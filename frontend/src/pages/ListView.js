import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import React from "react";
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import EventCard from "../components/EventCard";
import '../styles/ListView.css';
import { useHistory } from "react-router-dom";

/**
 * Page to view a list. Allows for rolling random events, cross them out as they are used,
 * save the list to a user's list, rate it, or edit it if the user owns it.
 */
const ListView = (userName) => {
    
    const location = useLocation();
    const events = location.state.events;
    const {user, userToken} = useAuthContext();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [availableEvents, setAvailableEvents] = useState(events);
    const [owned, setOwned] = useState(false);
    const [popup, setPopup] = useState(false);
    const [saved, setSaved] = useState(false);
    const [favor, setFavor] = useState(0);
    const [userInteractions, setUserInteractions] = useState(null);
    const [authorProfile, setAuthorProfile] = useState(null);

    let nav = useNavigate();

    useEffect(() => {
        
        if (user != null)
        {
            if (user.userName === location.state.author)
            {
                setOwned(true);
            }
            fetchUserInteractions();
        }

    }, [user])

    useEffect(() => {
        
        const fetchAuthorProfile = async () => {

            const response = await fetch('https://chaoticevents.onrender.com/api/user/getProfile/'+location.state.author, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json();

            if (response.ok)
            {
                setAuthorProfile(json);
            }
        }

        setAuthorProfile(fetchAuthorProfile());
    }, [])

    /**
     * Gets the user's interactions
     */
    const fetchUserInteractions = async () => {

        // Redefined here because of async funniness when used outside of a useEffect.
        const fetchAuthorProfile = async () => {

            const response = await fetch('https://chaoticevents.onrender.com/api/user/getProfile/'+location.state.author, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json();

            if (response.ok)
            {
                setAuthorProfile(json);
            }
        }

        const response = await fetch('https://chaoticevents.onrender.com/api/user/interactions/'+user._id, {
            headers: {
                'Authorization': `Bearer ${userToken.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            setUserInteractions(json);
            checkIfSaved(json);
            findFavor(json);
            setAuthorProfile(fetchAuthorProfile());
        }
    }

    /**
     * Loops through an array of interactions and updates the saved use state if needed
     */
    const checkIfSaved = (interactions) => {

        let found = false;

        interactions.forEach((interaction) => {
            if (interaction._id === location.state._id && interaction.saved)
            {
                found = true;
            }
        })

        setSaved(found);
    }

    /**
     * Loops through an array of interactions and updates the favor use state if needed
     */
    const findFavor = (interactions) => {

        let favor = 0;

        interactions.forEach((interaction) => {
            if (interaction._id === location.state._id)
            {
                favor = interaction.favor;
            }
        })

        setFavor(favor);
    }

    /**
     * A very round about way to move a selected event to its div and remove it from the list.
     * Works by getting the div element and using its attributes to create a new EventCard in the right spot,
     * then tweaks the original events class to cross it out of the list.
     * 
     * params
     *  event: the click event 
     */
    const handleEventClick =  (event) => {

        let eventButton
        /* The click can happen on the div tag or its children. This if/else sets a variable
            equal to the div by working its way up if needed. */
        if (event.target.localName !== "button")
        {
            eventButton = event.target.parentElement;
        }
        else {
            eventButton = event.target;
        }

        /* This is an ineffecient way of preventing a card from getting selected twice, just stumped here...
           Setting a button to disabled to prevent this possibility in the first place makes it so the click
           event won't fire again. Probably a re-render issue I'm missunderstanding... */
        if (eventButton.className == 'unselectable-event-card')
        {
            return;
        }
        
        // Snags the event with a matching id to make a new component with
        const currEvent = availableEvents.find((event) => {return ('event-card-' + event._id) == eventButton.id});
        setSelectedEvent(currEvent);

        // Removes event from the list of unselected events
        setAvailableEvents(availableEvents.filter((possibleEvent) => {
            return currEvent._id != possibleEvent._id;
        }))

        // Crossing out the selected event from the main list
        eventButton.setAttribute('title', '');
        eventButton.classList.remove('selectable-event-card');
        eventButton.classList.add('unselectable-event-card');
        
    }

    /**
     * Randomly selects an event and removes it from the availible events
     */
    const handleRollClick = () => {

        // Randomly rolling an event
        const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];

        // Updating states
        setAvailableEvents(availableEvents.filter((event) => {
            return randomEvent._id != event._id
        }))

        setSelectedEvent(randomEvent);

        // Crossing out the selected event from the main list
        const eventButton = document.getElementById('event-card-' + randomEvent._id);
        eventButton.setAttribute('title', '');
        eventButton.classList.remove('selectable-event-card');
        eventButton.classList.add('unselectable-event-card');
        
    }

    /**
     * Resets the list by getting all unselectable cards from the list and changing their class.
     * Also returns the currently selected event to the list and updates states.
     */
    const handleResetClick = () => {

        // Finds all removed events
        const removedEvents = document.getElementsByClassName('unselectable-event-card');

        // Resets attributes
        Array.from(removedEvents).forEach((card) => {
            card.classList.remove('unselectable-event-card');
            card.classList.add('selectable-event-card');
            card.setAttribute('title', 'Select');
        });
        
        //State updates
        setSelectedEvent(null);
        setAvailableEvents(events);
    }

    /**
     * Removes the dummy event from the place holder area and removes the unselectable
     * class from the event in the list
     */
    const handleDeselectClick = () => {


        // Remove crossing out of the selected event from the main list
        const eventButton = document.getElementById('event-card-' + selectedEvent._id);
        eventButton.setAttribute('title', '');
        eventButton.classList.remove('unselectable-event-card');
        eventButton.classList.add('selectable-event-card');

        //State updates
        setAvailableEvents([...availableEvents, selectedEvent]);
        setSelectedEvent(null);

    }

    /**
     * Navigates to CreateList while also passing this page's state, which is the
     * list that needs to be edited.
     */
    const handleEditClick = () => {
        nav("/CreateList", {state: location.state});
    }

    /**
     * Pulls up the popup to confirm deleting the list.
     */
    const handleDeleteClick = () => {
        setPopup(true);
    }

    /**
     * Actually removes an eventList from the database.
     */
    const handlePopUpButton = async event => {
        
        //Blocks page reload
        event.preventDefault();

        if (event.nativeEvent.submitter.id ==="popup-yes") {
            
            const response = await fetch('https://chaoticevents.onrender.com/api/eventLists/edit/'+location.state._id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken.token
                }
            })

            if (response.ok)
            {
                nav("/");
            }
        }

        setPopup(false);
    }

    /**
     * Saves this list by updating the User's eventListInteractions array
     */
    const handleSaveClick = async event => {

        const updatePayload = {list: location.state, userID: user._id, mode: 'SAVE'};

        try
        {
            const response = await fetch('https://chaoticevents.onrender.com/api/user/updateInteractions', {
                method: 'PATCH',
                body: JSON.stringify(updatePayload),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken.token
                }
            })

            setUserInteractions(fetchUserInteractions);

        }
        catch (error)
        {
            console.log(error)
        }

    }

    /**
     * Unsaves this list by updating the User's eventListInteractions array
     */
    const handleUnsaveClick = async event => {

        const updatePayload = {list: location.state, userID: user._id, mode: 'UNSAVE'};

        try
        {
            const response = await fetch('https://chaoticevents.onrender.com/api/user/updateInteractions', {
                method: 'PATCH',
                body: JSON.stringify(updatePayload),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken.token
                }
            })

            setUserInteractions(fetchUserInteractions);

        }
        catch (error)
        {
            console.log(error)
        }
    }

    /**
     * Calls the controller method for updating interactions on a favor click.
     */
    const handleFavorClick = async (event) => {

        // A String that lets the backend know what adjust to make to favor
        // This got confusing when trying to use numbers
        let netFavor = "none";

        // Calculates what adjustment should be made in the backend
        if (event.target.id === 'like-button')
        {
            switch (favor) {
                // Going from like to neutral
                case 1:
                    netFavor = "L->N";
                    break;
                // Going from neutral to like
                case 0:
                    netFavor = "N->L";
                    break;
                // Going from dislike to like
                case -1:
                    netFavor = "D->L"
                    break;
            }
        }
        else if (event.target.id === 'dislike-button')
        {
           switch (favor) {
                // Going from like to dislike
                case 1:
                    netFavor = "L->D";
                    break;
                // Going from neutral to dislike
                case 0:
                    netFavor = "N->D";
                    break;
                // Going from dislike to neutral
                case -1:
                    netFavor = "D->N";
                    break;
            }
        }

        const updatePayload = {list: location.state, userID: user._id, userToken: userToken, netFavor: netFavor, mode: 'FAVOR'};

        const response = await fetch('https://chaoticevents.onrender.com/api/user/updateInteractions', {
            method: 'PATCH',
            body: JSON.stringify(updatePayload),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken.token
            }
        })

        setUserInteractions(fetchUserInteractions);
    }

    /**
     * UI
     */
    return ( 
        <div>
            {popup && <div className="popup-container">
                        <form className="confirm-delete-popup" onSubmit={handlePopUpButton}>
                            <h1 style={{marginBottom: '30px'}}>Are you sure you want to delete this list? It will be removed from your profile and all list browsers.</h1>
                            <div>
                                <button type="submit" id="popup-no" style={{marginBottom: '20px', marginRight: '50px'}}>NO</button>
                                <button type="submit" id="popup-yes">YES</button>
                            </div>
                        </form>
                      </div>}
            <h1 style={{textAlign: 'center', margin: '2%'}}>Currently Viewing: {location.state.title} by <Link to={'/userprofile/'+location.state.author}>{location.state.author}</Link></h1>
            <h1 style={{textAlign: 'center', margin: '2%'}}>Selected Event: {selectedEvent ? selectedEvent.title: 'None'}</h1>
            <div className='selected-event-container'>
                {!selectedEvent && <h2 className="event-placeholder" id="test">No Selected Event</h2>}
                {selectedEvent && <EventCard id={selectedEvent._id} event={selectedEvent} className={'static-event-card'}/>}
            </div>
            <div className="roll-container">
                <button className={(availableEvents.length > 0) ? "roll-button" : "disabled-roll-button"} onClick={handleRollClick} disabled={!(availableEvents.length > 0)}>
                    <p>Roll!</p>
                    <img src={require("./../img/die.png")} alt="" />
                </button>
            </div>
            <div className="action-button-container">
                {!saved && <button disabled={owned} onClick={handleSaveClick}>Save List</button>}
                {saved && <button disabled={owned} onClick={handleUnsaveClick}>Unsave List</button>}
                <button onClick={handleResetClick}>Reset List</button>
                <button onClick={handleDeselectClick} disabled={!selectedEvent}>Deselect Event</button>
                <div className="rating-box">
                    <p>Rate List: </p>
                    <img id='like-button' onClick={handleFavorClick} src={favor === 1 ? require("./../img/greenLike.png"): require("./../img/like.png")} alt="" />
                    <p>|</p>
                    <img id='dislike-button' onClick={handleFavorClick} src={favor === -1 ? require("./../img/redDislike.png") : require("./../img/dislike.png")} alt="" />
                </div>        
            </div>
            
            {owned && <div className="user-button-container">
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDeleteClick}>Delete</button>
            </div>}

            <div style={{margin: '2%'}}>
                <h1 className="list-title">{location.state.title}</h1>
                <div className='events-box'>
                    {events && events.map((event) => (
                        <EventCard key={event.title} id={'event-card-' + event._id} event={event} className={'selectable-event-card'} selectable={true} handleClick={handleEventClick}/>
                    ))}
                </div>
            </div>
        </div>
     );
}
 
export default ListView;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.