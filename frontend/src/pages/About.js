import { useState } from "react";
import "../styles/About.css";

const About = () => {

    const [personalClicks, setPersonalClicks] = useState(0);
    const [popup, setPopup] = useState(false);
    const [gitHubPassword, setGitHubPassword] = useState();

    const personalBoxClick = () => 
        {
            setPersonalClicks(personalClicks + 1);
        
            if (personalClicks === 4) {
                setPopup(true);
                setPersonalClicks(0);
            }
        }
        
    const handlePopUpButton = (event) =>
        {
            event.preventDefault();

            // Congratulations! You found where I leak the password to my source code in my code!
            // Unfortunately, this security error doesn't do anything since you're already
            // reading my source code. Just one more Easter Egg for those who read every bit.
            if (gitHubPassword === "GreatCandidate,Is#1")
            {
                //TODO: Add Github Link and welcome text
                console.log("YAY");
            }
        }

    const handleLeave = () =>
    {
        setPopup(false);
    }

    return ( 
        <div>
            {popup && <div className="popup-container">
                        <form className="confirm-popup" onSubmit={handlePopUpButton}>
                            <h1 style={{marginBottom: '30px'}}>Enter Passcode Here to be Taken to my Source Code:</h1>
                            <input type="password"
                                onChange={(elem) => setGitHubPassword(elem.target.value)}
                                value={gitHubPassword}
                                placeholder=" Password"
                            />
                            <br></br>
                            <button type="submit">Submit</button>
                            <br></br>
                            <br></br>
                            <p> -or- </p>
                            <br></br>
                            <button type="button" onClick={handleLeave}>Run Away</button>
                        </form>
                      </div>}
            <h1>About</h1>
            <br />
            <div className="about-card" style={{"background-color" :"#ecd68b"}}>
                <h2>Intro</h2>
                <br />
                <p>
                    Welcome to Chaotic Events! This web app is designed for players of various tabletop pen and paper games
                    to come together and enjoy random event tables for their games. Event tables for exploring roleplaying worlds are
                    unsung heroes for Game Masters looking to spice up world traversal, area exploration, town life, or any number of
                    facets within the worlds they have crafted. With Chaotic Events, I hope to see players and Game Masters of any system
                    create, share, and interact with event tables they have created for their games or for fun! Please have a look at this
                    page to see the fine details of this web app and how to use it to it's fullest, or jump right in if that is more your pace.
                </p>
            </div>
            <br />
            <div className="about-card" style={{"background-color" :"#febbff"}}>
                <h2>Events and Event Lists</h2>
                <br />
                <p>
                    The majority of this web app's content is user generator events and lists. In this setting, an event is a description of an event!
                    As you can see from the example below, they can be anything from a description of a creature encounter, to an odd meeting with a roadside traveler,
                    or even your players stumbling across a long abandoned point of interest. An Event List is simply a collection of all these events, that
                    can be shared across users.
                </p>
            </div>
            <br />
            <div className="about-card" style={{"background-color" :"#9de9ba"}}>
                <h2>User Accounts</h2>
                <br />
                <p>
                    This wed app does utilize user accounts, needing only an email to signup. This email is stored in a private database, and used <em>ONLY</em> to
                     inform users of website updates. To access full functionality of list creation and saving, you will need a user account to participate.
                    However, anyone in the world is welcome to browse our user's publicly published lists at any time!
                </p>
            </div>
            <br/>
            <div className="about-card" style={{"background-color" :"#bdc8d3"}}>
                <h2>User Conduct</h2>
                <br />
                <p>
                    Please understand that Chaotic Events is platform where potentially any one could view the content you make public. With that in mind, please be mindful
                    of what is included in your events, user name, and snapshot. Please bear in mind that all content published to this website is reviewed. While I take no
                     responsibility for what is posted here, I will remove overly offensive and especially illegal content as soon as possible. Repeated infractions are cause
                     for a permanant ban from Chaotic Events. That being said, I do understand that the world of table top roleplaying is not always sparkly clean and want to make it clear that
                      mild language and suggestive themes come with the territory. All I ask is that things are kept in good taste. Even though the web app's name shortens to
                      "CE", please act as if your alignment is "NG", or somewhere along the Good spectrum.
                </p>
            </div>
            <br />
            <div className="about-card" style={{"background-color" :"#a3e5ff"}}>
                <h2>Home Page</h2>
                <br />
                <p>
                    The Homepage is your window into the worlds that your fellow users have proudly published to this web app. While logged in to your account,
                    you will have three searchable and filterable collections of Event Lists to view. My Lists are all the lists you have published. Saved Lists 
                    is a collection of all the lists you have liked enough to save. Finally, the Public List Browser catalogues every list in our data base from newest
                    to oldest by default. I encourage intrepid adventure into the depths of this collection!
                </p>
            </div>
            <br />
            <div className="about-card" style={{"background-color" :"#ffcc89"}}>
                <h2>List View</h2>
                <br />
                <p>
                    Clicking on any Event List will bring you to the List View for that list. Here, you can see all the events contained within that list orderly
                    displayed for you to read over. This page is designed to be used as a tool to keep track of what events have been used on your players in a session.
                    Click an event to bring it to the top and remove it from the list. You may also click the "Roll!" button to randomly select an unused event from the
                    list for your players to encounter. Accidnetally select an event? Just click "Deselect Event" to add it back to the list. Click "Reset List" to return
                    all events to the list. Here, you can also find buttons to save and rate the list, as well as edit or delete it if you are its creator.
                </p>
            </div>
            <br />
            <div className="about-card" style={{"background-color" :"#ffbdab"}}>
                <h2>Create List</h2>
                <br />
                <p>
                    Here, you may create Event Lists to share with the world or for your own personal use. Use the form at the top of the page to add events to your list
                    one by one. When you have added all the events you would like to, Scroll down to finalize a tile, description, and color scheme for your new list.
                    Also be sure to specify whether this list should be publicly viewable using the checkbox, and add tags if you would like to make your list appear more easily
                    in searches. If you have started a list and suddendly had to stop, not to worry! Any time an event is added, your progress will be saved until finalizing your list.
                    Finally, be sure to add some flair with all of the color options!
                </p>
            </div>
            <br />
            <div className="about-card" style={{"background-color" :"#d593ff"}}>
                <h2>User Profiles</h2>
                <br />
                <p>
                    You may view other user's pages from lists they have published, or your own from the user icon in the top right corner of the navigation bar.
                    Here you can view a user's stats, and a personal snapshot they have written if they have so decided to. Additionally, every user's profile has
                    a display of all the Event Lists they have publicly published. Finally, if for any reason you wish to remove your presence from Chaotic Events,
                    you can delete your user account on this page. Just be mindful, any lists you have made will be lost forever!
                </p>
            </div>
            <br />
            <div className="about-card" style={{"background-color" :"#9de9ba", "display":"grid"}}>
                <h2 style={{"margin-bottom":"20px"}}>Funding</h2>
                <br />
                <p>
                    ChaoticEvents is a free service with no ads. It will never be ruined by advertisements or a paywall. I receive no outside funding, and any information you enter into this
                    website is not for sale. Any solicititations from data brokers for the purchase of your information will be answered with disproportionate and unreasonable hostility.
                    I made this project for fun, practice, and because it is something that I though would be useful for me and my friends. However, if you feel that ChaoticEvents has brought you
                    any value and wish to help keep the lights on, I will begrudingly accept tips through the button below. The sarcastic tone of this paragraph aside, I do deeply thank anyone who makes
                    a donation.
                </p>
                <div className="paypal-container">
                    <form action="https://www.paypal.com/donate" method="post" target="_top">
                        <input type="hidden" name="business" value="LFEQEGHA8M3CQ" />
                        <input type="hidden" name="no_recurring" value="0" />
                        <input type="hidden" name="item_name" value="Thank you for your consideration. It really means a lot that ChaoticEvents brought you enough joy to think about a donation." />
                        <input type="hidden" name="currency_code" value="USD" />
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                        <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                    </form>
                </div>
            </div>
            <br />
            <div className="about-card" style={{"background-color" :"#709dff"}} onClick={personalBoxClick}>
                <h2>A Personal Word</h2>
                <br />
                <p>
                    I want to sincerly thank you for visiting my little, extrodinarily niche web application. This is my first project I have published publically
                    and I hope it proves useful to a few people. This is also my first foray into the MERN stack, a learning experience I have loved every minute of.
                    Lastly, I know the style of this web app is a lot different than most of what you see on the internet these days. I really do miss the pop and color
                    of the older internet, there are more colors than blue, white, and gray believe it or not! I hope my project brought some color into your day!
                    Please keep an eye on me in the future and see what else I publish! And by the way, if you happen to have my resume and want to see my source code,
                    now would be a good time to click this box five times.
                </p>
            </div>
            <br />
        </div>
     );
}
 
export default About;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.