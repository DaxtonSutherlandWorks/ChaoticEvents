import { useEffect, useState } from "react";
import CollapsibleEventList from "../components/CollapsibleEventList";
import { useAuthContext } from "../hooks/useAuthContext";
import { jwtDecode } from 'jwt-decode'

const Home = () => {

    const [userLists, setUserLists] = useState();
    const [allLists, setAllLists] = useState();
    const [savedLists, setSavedLists] = useState();
    const {userToken, user} = useAuthContext();

    // Use states that make list pagination work due to it being added late.
    const [browserCursor, setBrowserCursor] =useState(null);
    const [browserOverride, setBrowserOverride] = useState(false);
    const [userCursor, setUserCursor] = useState(null);
    const [userOverride, setUserOverride] = useState(false);
    const [savedCursor, setSavedCursor] = useState(null);
    const [savedOverride, setSavedOverride] = useState(false);

    /**
     * Fetches a 100 entry page of all EventLists from new to old
     */
    const fetchEventLists = async () => {
            let response;

            if (!browserCursor)
            {
                response = await fetch('https://daxtonsutherlandworks.com:4000/api/eventLists');
            }

            else {
                response = await fetch('https://daxtonsutherlandworks.com:4000/api/eventLists', {
                    headers: {
                        'Cursor': browserCursor
                    }
                })
            }
            
            const json = await response.json();
    
            if (response.ok) {
                setAllLists(json);
                
                //Forces CollapsibleList child to rerender.
                setBrowserOverride(!browserOverride);

                if (json.length > 1)
                {
                    setBrowserCursor(json[json.length-1]._id)
                }
                else
                {
                    setBrowserCursor(null);
                }
            }
        }

    /**
     * Fetches up to 100 of the newest events
     */
    const fetchNewestEvents = async () => {
            let response;

            response = await fetch('https://daxtonsutherlandworks.com:4000/api/eventLists');
            
            const json = await response.json();
    
            if (response.ok) {
                setAllLists(json);
                
                //Forces CollapsibleList child to rerender.
                setBrowserOverride(!browserOverride);

                if (json.length > 1)
                {
                    setBrowserCursor(json[json.length-1]._id)
                }
                else
                {
                    setBrowserCursor(null);
                }
            }
        }

    /**
     * Fetches a User's lists
     */
    const fetchUserLists = async () => {

            const response = await fetch('https://daxtonsutherlandworks.com:4000/api/eventLists/user', {
                headers: {
                'Authorization': `Bearer ${userToken.token}`
                }
            });
            
            const json = await response.json();

    
            if (response.ok) {
                setUserLists(json);
            }
        }

    /**
     * Fetches a User's saved lists
     */
    const fetchSavedLists = async () => {

            const response = await fetch('https://daxtonsutherlandworks.com:4000/api/user/'+jwtDecode(userToken.token).email+'/savedLists', {
                headers: {
                    'Authorization': `Bearer ${userToken.token}`
                    }
            });


            const json = await response.json();
    
            if (response.ok) {
                setSavedLists(json);
            }
        }

    useEffect(() => {

        if (!allLists)
        {
            fetchNewestEvents();
        }

        if (userToken)
        {         
            fetchUserLists();   
            fetchSavedLists();             
        }       

    }, [userToken]);
    

    return (
        <div>
            {savedLists && <div><CollapsibleEventList key={userOverride} title="My Lists" eventLists={userLists} ></CollapsibleEventList>
                            <CollapsibleEventList key={savedOverride} title="Saved Lists" eventLists={savedLists}></CollapsibleEventList>
                    </div> 
            }
            {!userToken && <div>
                        <h2>For full functionality, create an account or log in!</h2>
                        <h2>To see what Chaotic Events can do, check out the About page in the hamburger menu</h2>
                    </div>
            }
            {allLists && <div><CollapsibleEventList key={browserOverride} title="Public List Browser" eventLists={allLists} getOlder={fetchEventLists} getNewer={fetchNewestEvents}></CollapsibleEventList></div>}
        </div>      
    );
}

export default Home;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.