import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import React from "react";
import EventCard from "../components/EventCard";
import ColorSelector from "../components/ColorSelector";
import { useAuthContext } from '../hooks/useAuthContext';
import { jwtDecode } from 'jwt-decode'
import '../styles/CreateList.css';

/**
 * Page for users to build a list by adding events one at a time, then submit it to the database
 * Can allow for editing a list when loaded with state.
 */
const CreateList = () => {

    const [currEventTitleColor, setCurrEventTitleColor] = useState(window.$themes['Default']);
    const [newListThemeColor, setNewListThemeColor] = useState(window.$themes['Default']);
    const [newList, setNewList] = useState([]);
    const [popup, setPopup] = useState(false);
    const [deleteEventTitle, setDeleteEventTitle] = useState("");
    const [publicChecked, setPublicChecked] = useState(false);
    const [wipLoaded, setWipLoaded] = useState(false);
    const [restoreMessage, setRestoreMessage] = useState(false);
    const [result, setResult] = useState('');
    const [tags, setTags] = useState([]);
    const [editEvent, setEditEvent] = useState(null);
    const { userToken, user } = useAuthContext();
    const [editMode, setEditMode] = useState(false);

    const eventColorSelector = useRef();
    const listColorSelector = useRef();
    const location = useLocation();


    /**
     * Checks if this page has been given any state on render, which denotes that it should
     * be in edit mode. Populates fields with passed data to edit.
     */
    useEffect(() => {
        if (location.state) {
            let importedList = location.state;
            setEditMode(true);
            setNewListThemeColor(importedList.colorTheme);
            setNewList(importedList.events);
            setTags(importedList.tags);
            setPublicChecked(importedList.public)
            document.getElementById('listPublicField').checked = importedList.public;
            document.getElementById('listTitleField').value = importedList.title;
            document.getElementById('listDescription').value = importedList.description;
            listColorSelector.current.colorMatch(importedList.colorTheme[0]);
        }
    }, [])

    /**
     * Loads a WIP list from the user, unless this page was sent a state denoting that
     * it's in edit mode.
     */
    useEffect(() => {

        // Checks if page will be in edit mode
        if (!location.state)
        {
            const fetchWIPList = async () => {

                // If the user is just loading into the page, check to see if there is a WIP List and restore their progress
                if (newList.length === 0 && !wipLoaded)
                {
                    // Fetching WIPList
                    const response = await fetch('https://daxtonsutherlandworks.com:4000/api/user/'+user.email+'/getWIP', {
                        headers: {
                            'Authorization': `Bearer ${userToken.token}`
                        }
                    });
                
                    // Trying to populate events list with results
                    try {
                        
                        const json = await response.json();
                        
                        if (json.length === 0)
                        {
                            setWipLoaded(true);
                        }
                        else
                        {
                            setNewList(json);
                            setWipLoaded(true);
                            setRestoreMessage(true);
                        }
                    } 
                    
                    // Don't fill anything if there is a network error or an empty WIP List (First time use)
                    catch {
                        console.log("No previous list found to load");
                    }
                }
    
                // If the user is has made at least one event, they are considered to be working on a new list.
                else
                {
                    // Updating the user's WIPList to be current to their progress.
                    const response = await fetch('https://daxtonsutherlandworks.com:4000/api/user/setWIP', {
                        method: "POST",
                        body: JSON.stringify({
                            email: user.email,
                            WIPList: newList
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken.token}`
                        }
                    })
                }    
            }
    
            if (user) {
                fetchWIPList();
            }
        }
        
    }, [user, newList]);

    /**
     * Adds a new event to the temporary list, or cals a function to save edits
     * since they are done through the same form.
     * 
     * Params:
     *  event: The form submission event that is used to get information.
     */
    const handleAddEvent = event => {
        event.preventDefault();

        // Branch for if an event is currently being edited
        if (editEvent)
        {
            handleEditSave(event);
        }
        else
        {
            // Building new event
            const newEvent = {_id: newList.length+1,
            title: event.target.elements.title.value,
            body: event.target.elements.body.value,
            author: user.userName, 
            dieNum: newList.length+1,
            titleColor: currEventTitleColor[0]};

            // Updating useState
            setNewList([...newList, newEvent]);
        }

        setRestoreMessage(false);
        event.target.reset();
    }

    const handleEditSave = event => {
        
        const editedEvent = {
            _id: editEvent._id,
            title: event.target.elements.title.value,
            body: event.target.elements.body.value,
            author: editEvent.author,
            dieNum: editEvent.dieNum,
            titleColor: currEventTitleColor[0]};

        const editedList = newList.slice();
        editedList[editEvent.dieNum - 1] = editedEvent;
        
        setNewList(editedList);
        setEditEvent(null);
    }

    /**
     * Pulls up the popup to confirm deleting the event and grabs
     * the title of the list to be deleted in this format "#{dieNum} {title}"
     * 
     * Params:
     *  event: The click event of the trash button, used to grab the title of the event.
     */
    const handleDeleteEvent = (event) => {
        setDeleteEventTitle(event.target.parentElement.childNodes[0].innerText);
        setPopup(true);
    }

    /**
     * When an event's edit button is clicked, moves that event's info up to the event
     * creation area and matches the color selector.
     */
    const handleEditEvent = event => 
    {
        // Isolating event's dieNum
        let title = event.target.parentElement.children[0].innerHTML
        let editIndex = Number(title.substring(title.indexOf('#') + 1, title.indexOf(' ')))
        let newEditEvent = newList[editIndex - 1];

        document.getElementById('title-field').value = newEditEvent.title;
        document.getElementById('body-field').value = newEditEvent.body;

        setCurrEventTitleColor(newEditEvent.titleColor);
        eventColorSelector.current.colorMatch(newEditEvent.titleColor);

        setEditEvent(newEditEvent);
    }

    /**
     * Actually deletes the event after comfirmation through the popup dialogue
     * 
     * Params:
     *  event: The click event of the selected button used to get info and control the response
     */
    const handlePopUpButton = event => {
        //Blocks page reload
        event.preventDefault();

        // Deletes the event from the temporary list if yes was selected
        if (event.nativeEvent.submitter.id ==="popup-yes") {
            
            // Regex to get just the dieNum of the event in Number format
            const idToFind = Number(deleteEventTitle.match(/\d+/)[0])
            
            // Removes the event with matching dieNum
            const updatedList = newList.filter((eventCard => {
                return eventCard._id != idToFind;
            }))

            // Loops through list to adjust dieNums
            updatedList.forEach(eventCard => {
                if (eventCard.dieNum > idToFind)
                {
                    eventCard._id = eventCard._id - 1;
                    eventCard.dieNum = eventCard.dieNum - 1;
                }
            })

            // Updates useState, prompting rerender reflecting changes
            setNewList(updatedList);
            setRestoreMessage(false);
        }

        // Hides popup
        setPopup(false);
        
    }

    /**
     * Adds a tag to the current list
     */
    const handleTagAddition = event => {
        event.preventDefault();

        setTags([...tags, event.target.elements.tagField.value]);

        event.target.reset();
    }

    /**
     * Deletes a tag from the current list
     */
    const handleTagDelete = (event) => {
        
        const updatedTags = tags.filter((tag) => {
            return tag !== event.target.parentElement.children[1].innerText;
        })

        setTags(updatedTags);
    }

    /**
     * Toggles if the list will be public
     */
    const handlePublicClick = () => {
        setPublicChecked(!publicChecked);
    }

    /**
     * Builds the event list and submits it to the database
     */
    const handleSaveListClick = async event => {
        event.preventDefault();

        // Grabbing Variables
        let newName = document.getElementById('listTitleField').value;
        let newTheme = newListThemeColor;
        let newDescription = document.getElementById('listDescription').value;

        let newEventList = {'title': newName, 'author': user.userName, 'description':newDescription, 'rating': [0,0], 'events': newList, 'colorTheme': newTheme, 'tags': tags, 'public': publicChecked};
        
        const response = await fetch('https://daxtonsutherlandworks.com:4000/api/eventLists', {
                method: 'POST',
                body: JSON.stringify(newEventList),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ${userToken.token}'
                }
            })

        const json = await response.json();

        if(!response.ok) {
            setResult(json.error);
        }
        if(response.ok) {
            event.target.reset();
            setPublicChecked(false);
            setTags([]);
            setNewList([]);
            setResult('New List Successfully Saved!');
        }
    }

    const handleSaveEditsClick = async event => {
        event.preventDefault();

        // Grabbing Variables
        let editedName = document.getElementById('listTitleField').value;
        let editedTheme = newListThemeColor;
        let editedDescription = document.getElementById('listDescription').value;

        let editedEventList = {'title': editedName, 'author': user.userName, 'description':editedDescription, 'rating': [0,0], 'events': newList, 'colorTheme': editedTheme, 'tags': tags, 'public': publicChecked};

        const response = await fetch('https://daxtonsutherlandworks.com:4000/api/eventLists/edit/'+location.state._id, {
            method: 'PATCH',
            body: JSON.stringify(editedEventList),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ${userToken.token}'
            }
        })

        const json = await response.json();

        if(!response.ok) {
            setResult(json.error);
        }
        if(response.ok) {
            setResult('Edits Successfully Saved! Edit further or leave this page to continue.');
        }
    }

    return ( 
        <div>
            {popup && <div className="popup-container">
                        <form className="confirm-delete-popup" onSubmit={handlePopUpButton}>
                            <h1 style={{marginBottom: '30px'}}>Are you sure you want to delete this event?</h1>
                            <h2 style={{marginBottom: '30px'}}>{deleteEventTitle}</h2>
                            <div>
                                <button type="submit" id="popup-no" style={{marginBottom: '20px', marginRight: '50px'}}>NO</button>
                                <button type="submit" id="popup-yes">YES</button>
                            </div>
                        </form>
                      </div>}
            <h1 style={{textAlign: 'center'}}>Create a List</h1>
            {restoreMessage && <div className="restore-message" style={{backgroundColor: newListThemeColor[1], borderColor: newListThemeColor[0]}}>
                            <h2>Progress on previous list found and loaded</h2>
                          </div>}   
            <div className='event-form-container'>
                <form onSubmit={handleAddEvent}>
                    {!editEvent && <h2 style={{backgroundColor: currEventTitleColor[0]}}>Event Number: {newList.length + 1}</h2>}
                    {editEvent && <h2 style={{backgroundColor: currEventTitleColor[0]}}>Now Editing Event Number {editEvent.dieNum}</h2>}
                    <label htmlFor="title-field">Title: </label>
                    <input id="title-field" name='title' type="text" required={true}/>
                    <label htmlFor="body-field">Body: </label>
                    <textarea id="body-field" name='body' type="text" required={true}/>
                    
                    <div style={{display: "block"}}>
                        <div>
                            <label htmlFor="title-color-field">Title Color: </label>
                            <ColorSelector ref={eventColorSelector} setParentTitleColor={setCurrEventTitleColor}></ColorSelector>   
                        </div>
                    </div>

                    <div style={{margin: "20px"}}>
                        {!editEvent && <button type='submit' className="add-button" style={{backgroundColor: currEventTitleColor[1]}}>Add Event</button>}
                        {editEvent && <button type='submit' className="add-button" style={{backgroundColor: currEventTitleColor[1]}}>Save Edits</button>}
                    </div>
                    
                </form>
            </div>
            
            <div style={{margin: '2%'}}>
                <form className="list-title" id='listInfo' onSubmit={editMode ? handleSaveEditsClick : handleSaveListClick} style={{backgroundColor: newListThemeColor[0]}}>
                    <div>
                        <label style={{display:"block"}} htmlFor="list-title-field">Title: </label>
                        <input id="listTitleField" name='lTitle' type="text" required={true}/>
                    </div>
                    <div>
                        <label style={{display:"block"}} htmlFor="list-theme-color-field">Theme Color: </label>
                        <ColorSelector ref={listColorSelector} setParentTitleColor={setNewListThemeColor}></ColorSelector>
                    </div>
                    <div>
                        <label style={{display:"block"}} htmlFor="list-public-field">Make List Public? </label>
                        <input style={{transform:"scale(3)", marginTop:"10px"}} id="listPublicField" name='lPublic' type="checkbox" onClick={handlePublicClick}/>
                    </div>                   
                </form>
                <div className="list-description-container" style={{backgroundColor: newListThemeColor[0]}}>
                    <label htmlFor="list-description-field">Description: </label>
                    <textarea form="listInfo" id="listDescription" name='list-description-field' type="text" required={true}/>
                </div>
                <div className='new-events-box' style={{backgroundColor: newListThemeColor[1]}}>
                    {(newList.length === 0) && <h1>No Events to Display</h1>}
                    {newList && newList.map((event) => (
                            <EventCard id={event.title} key={event.title} event={event} className={'static-event-card'} handleDelete={handleDeleteEvent} handleEdit={handleEditEvent}/>
                        ))}
                </div>
                
                <form onSubmit={handleTagAddition} className="new-events-box-footer" style={{backgroundColor: newListThemeColor[0]}}>
                    <div className="tag-input-container" style={{borderColor: newListThemeColor[1]}}>
                        <div>
                            <label htmlFor="tag-field"> Tag: </label>
                        </div>
                        <div>
                            <input type="text" required={true} name="tags" id="tagField" maxLength='25' />
                            <button style={{backgroundColor: newListThemeColor[1]}}>Add Tag</button>
                        </div>
                        <div>
                            <em>25 character limit</em>
                        </div>
                    </div>
                    {(tags.length === 0) && <h2>If you like, add some tags to make your list easier to find in searches!</h2>}
                    <div className="tag-container">                       
                        {tags && tags.map((tag) => (
                                <div style={{backgroundColor: newListThemeColor[1]}}>
                                    <img className="tag-delete-button" onClick={(event) => handleTagDelete(event)} src={require("./../img/closeBlack.png")} alt="" />
                                    <p>{tag}</p>
                                </div>
                            ))}
                    </div>
                </form>
                {!editMode && <div className="save-button-container">
                    {newList.length <= 0 && <h1>Add some events before saving your list!</h1>}
                    {newList.length > 0 && <h1>Save this list to your account{publicChecked && <span> and publish to public lists</span>}?</h1>}
                    {result && newList.length === 0 && <div className="result-box" style={{backgroundColor: newListThemeColor[1], borderColor: newListThemeColor[0]}}>
                            <h1>{result}</h1>
                        </div>
                    }
                    <button disabled={newList.length <= 0} style={{backgroundColor: newListThemeColor[1]}} type="submit" form="listInfo">Save List</button>
                </div>}
                {editMode && <div className="save-button-container">
                    {newList.length <= 0 && <h1>Add some events before saving your edits!</h1>}
                    {newList.length > 0 && <h1>Save these edits to your account? Leave this page to discard them.</h1>}
                    {result && <div className="result-box" style={{backgroundColor: newListThemeColor[1], borderColor: newListThemeColor[0]}}>
                            <h1>{result}</h1>
                        </div>
                    }
                    <button disabled={newList.length <= 0} style={{backgroundColor: newListThemeColor[1]}} type="submit" form="listInfo">Save Edits</button>
                    </div>}
            </div>
        </div>
     );
}
 
export default CreateList;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.