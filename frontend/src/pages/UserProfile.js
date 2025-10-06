import { useEffect, useState } from "react";
import CollapsibleEventList from "../components/CollapsibleEventList";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import '../styles/UserProfile.css';
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const UserProfile = () => {

    const navigate = useNavigate();
    const { userName } = useParams();

    const [userLists, setUserLists] = useState();
    const [ userProfile, setUserProfile] = useState();
    const [ owned, setOwned ] = useState(false);
    const [ editUsernameMode, setEditUsernameMode ] = useState(false);
    const [ editSnapshotMode, setEditSnapshotMode ] = useState(false);
    const [ userNameError, setUserNameError ] = useState(false);
    const [ userNameErrorMessage, setUserNameErrorMessage ] = useState('Please note: editing your user name will require you to log in again.');
    const [ popup, setPopup ] = useState(false);
    const { logout } = useLogout();

    const {userToken, user, dispatch} = useAuthContext();

    /**
     * Use effect to fetch users events with respect to privacy based on whether the viewer is the user, and fetch the user profile.
     */
    useEffect(() => {
        
        // Fetcher for only public events
        const fetchPublicUserEventLists = async () => {

            const response = await fetch('http://localhost:4000/api/eventLists/userPublic/'+userName);
    
            const json = await response.json();            

            if (response.ok) {
                setUserLists(json);
            }
        }

        // Fetcher for user profile
        const fetchUserProfile = async () => {
            const response = await fetch('http://localhost:4000/api/user/getProfile/'+userName, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json();

            if (response.ok) {
                setUserProfile(json);
            }
        }

        // Checks if the viewer is the user, gets all lists if so, only public otherwise
        if (user)
        {
            fetchPublicUserEventLists();
        }
        else
        {
            fetchPublicUserEventLists();
        }

        fetchUserProfile();
        
    }, [user]);

    // User profile fetcher redefined here because UseEffects are funny with async functions
    const fetchUserProfile = async () => {
            const response = await fetch('http://localhost:4000/api/user/getProfile/'+userName, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json();

            if (response.ok) {
                setUserProfile(json);
            }
        }

    /**
     * Simple boolean flipper for entering edit mode
     */
    const handleEditSnapshotClick = () => {
        setEditSnapshotMode(true);
    }

    /**
     * Form submission event for an edited user snapshot. Updates user snapshot in the database
     */
    const handleSaveSnapshotClick = async (event) => {
        event.preventDefault();

        const updatePayload = {userID: user._id, mode: "SNAPSHOT", snapshot: document.getElementById("snapshot-field").value.trim()};

        const response = await fetch('http://localhost:4000/api/user/updateProfile', {
            method: 'PATCH',
            body: JSON.stringify(updatePayload),    
            headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${userToken.token}`
                }
            });

        setEditSnapshotMode(false);
        fetchUserProfile();
    }

    /**
     * Simple boolean flipper for entering edit mode
     */
    const handleEditUsernameClick = () => {
        setUserNameError(true);
        setEditUsernameMode(true);
    }

    /**
     * Form submission event for an edited username. Updates username in the database
     */
    const handleSaveUsernameClick = async (event) => {
        event.preventDefault();

        const updatePayload = {userID: user._id, mode: "USERNAME", userName: document.getElementById("username-field").value};

        const response = await fetch('http://localhost:4000/api/user/updateProfile', {
            method: 'PATCH',
            body: JSON.stringify(updatePayload),    
            headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${userToken.token}`
                }
            });

        const json = await response.json();

        if (response.ok)
        {
            const updatedUser = {_id: user._id, userName: json.userName, email: user.email, iat: user.iat, exp: user.exp};
            setUserProfile(json);
            setUserNameError(false);
            setEditUsernameMode(false);
            dispatch({type: 'LOGOUT'});  
            navigate('/loginsignup');
        }
        else{
            setUserNameErrorMessage(json.error);
            setUserNameError(true);
        }
        
    }

    /**
     * Simple boolean flipper for activating the deletion popup.
     */
    const handleDeleteClick = async () => {
        setPopup(!popup);
    }

    /**
     * Simple boolean flipper for exiting edit mode
     */
    const cancelUserNameEdit = () => {
        setEditUsernameMode(false);
        setUserNameError(null);
        document.getElementById("username-field").value = "";
    }

    /**
     * Simple boolean flipper for exiting edit mode
     */
    const cancelSnapshotEdit = () => {
        setEditSnapshotMode(false);
        document.getElementById("snapshot-field").value = "";
    }

    /**
     * 
     */
    const handlePopUpButton = async (event) => {
        
        // Prevents immediate page reload
        event.preventDefault();

        if (event.nativeEvent.submitter.id ==="popup-yes") {
            const response = await fetch('http://localhost:4000/api/user/deleteUser', {
            method: 'DELETE',
            body: JSON.stringify({userID: user._id}),    
            headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${userToken.token}`
                }
            });

            if (response.ok)
            {
                logout();
                window.location.replace("/")
            }
        }

        // Hides popup
        setPopup(false);

    }

    return ( 
        <div style={{textAlign: "center"}}>
            {popup && <div className="popup-container">
                        <form className="confirm-delete-popup" onSubmit={handlePopUpButton}>
                            <h1 style={{marginBottom: '30px'}}>Are you sure you want to delete your account? All of your lists will be lost.</h1>
                            <div>
                                <button type="submit" id="popup-no" style={{marginBottom: '20px', marginRight: '50px'}}>NO</button>
                                <button type="submit" id="popup-yes">YES</button>
                            </div>
                        </form> 
                      </div>}
            {userProfile && <div>
                <div className="username-container">
                    {(owned && !editUsernameMode) && <img onClick={handleEditUsernameClick} src={require("./..\\img\\pencil.png")} />}
                    {!editUsernameMode && <h1 style={{fontSize: "3em"}}>{userProfile.userName}</h1>}
                    {editUsernameMode && <form className="username-container" onSubmit={handleSaveUsernameClick}>
                        <button onClick={cancelUserNameEdit}><img src={require("./..\\img\\closeBlack.png")} /></button>
                        <button type="submit"><img src={require("./..\\img\\save.png")} /></button>
                        <input id="username-field" name="username-field" placeholder="Type new Username here" type="text" pattern="\S(.*\S)?" title="Username must not be only whitespace" required="true"></input>
                    </form>
                    }
                </div>
                {userNameError && <div className="error-container">
                            <p>{userNameErrorMessage}</p>
                        </div>}
                {owned && <div className='profile-button-container'>
                    <button onClick={handleDeleteClick} style={{justifySelf: "left"}}>Delete</button>
                </div>}
                <div className="stats-container">
                    <h1>Stats:</h1>
                    <p><span style={{fontWeight: "bold"}}>Lists Published:</span> {userProfile.totalLists}</p>
                    <p><span style={{fontWeight: "bold"}}>Lists Saved by Users:</span> {userProfile.totalSaves}</p>
                    <p><span style={{fontWeight: "bold"}}>Member Since:</span> {userProfile.joined}</p>
                    <p style={{gridColumn: "span 3"}}><span style={{fontWeight: "bold"}}>Total Likes Gathered:</span> {userProfile.totalPos}</p>
                </div>
                <div className="snapshot-title-container">
                    {(owned && !editSnapshotMode) && <img onClick={handleEditSnapshotClick} src={require("./..\\img\\pencil.png")} />}
                    {(owned && editSnapshotMode) && <div>
                        <button onClick={cancelSnapshotEdit}><img src={require("./..\\img\\closeBlack.png")} /></button>
                        <button type="submit" form="snapshot-form"><img src={require("./..\\img\\save.png")} /></button>
                    </div>}
                    <h1>Snapshot</h1>
                </div>
                <div className="snapshot-container">
                    {editSnapshotMode && <form id="snapshot-form" onSubmit={handleSaveSnapshotClick}>
                            <textarea id="snapshot-field" name='snapshot-field' placeholder="Enter text you want to display on your profile here and press enter or use the save button to save" type="text" required="true"/>
                        </form>}
                    {(userProfile.snapshot && !editSnapshotMode) && <p style={{fontSize: "1.2em"}}>{userProfile.snapshot}</p>}
                    {(!userProfile.snapshot && !editSnapshotMode) && <p style={{fontSize: "1.2em"}}>This mysterious stranger has not written a bio...</p>}
                </div>
            </div>
            }
            {userLists && <CollapsibleEventList title="User's Public Lists" eventLists={userLists}></CollapsibleEventList>}
        </div>
        
     );
}
 
export default UserProfile;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.