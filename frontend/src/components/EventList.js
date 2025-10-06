import '../styles/EventList.css';
import { Link } from 'react-router-dom';

/**
 * A card representing an eventList and displaying its stats
 * 
 * Params
 *  eventlist-{}: The list being represent, see docs for structure.
 */
const EventList = ({ eventList }) => {

    let createDate = new Date(eventList.createdAt);

    return ( 
        <div>
            <br />
            <Link to='/ListView' state={eventList} style={{all:'inherit'}} onClick={() => window.scrollTo(0,0)}>
                <div className="event-list-card">
                    <div className="title-box" style={eventList.tags.length > 0 ? 
                        {backgroundColor: eventList.colorTheme[0],
                        borderBottomLeftRadius: '0px'} : 
                        {backgroundColor: eventList.colorTheme[0],
                        borderBottomLeftRadius: '6px'
                        }}>
                        <h1>{eventList.title} </h1>
                    </div>
                    <div className="description-box" style={{backgroundColor: eventList.colorTheme[1], textAlign: "left"}}>
                        <p>{eventList.description}</p>
                    </div>
                    <div className="info-box" style={eventList.tags.length > 0 ? 
                        {backgroundColor: eventList.colorTheme[0],
                        borderBottomRightRadius: '0px'} : 
                        {backgroundColor: eventList.colorTheme[0],
                        borderBottomRightRadius: '6px'
                        }}>
                        <br />
                        <p>Events: {eventList.events.length}</p>
                        <br />
                        <p>Author: {eventList.author}</p>
                        <br />
                        <span>
                            <img src={require("./..\\img\\likeWhite.png")} alt="" />
                            <p>{eventList.rating.join('/')}</p>
                            <img src={require("./..\\img\\dislikeWhite.png")} alt="" />
                        </span>
                        <br />
                        <p>Published: {createDate.toLocaleDateString()}</p>
                        <br />
                    </div>
                    {eventList.tags.length > 0 && <div className='card-footer' style={{backgroundColor: eventList.colorTheme[0]}}>
                        {eventList.tags.map((tag) => (
                                    <div style={{backgroundColor: eventList.colorTheme[1]}}>
                                        <img src={require("./..\\img\\hashTag.png")} alt="" />
                                        <p>{tag}</p>
                                    </div>
                                ))}
                    </div>}
                </div>
            </Link>
            <br />
        </div>
     );
}
 
export default EventList;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.