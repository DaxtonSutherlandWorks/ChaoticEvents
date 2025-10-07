import '../styles/EventCard.css'

/**
 * A card with event details and several selectable features based on parameters.
 * 
 * Params:
 *  id-String: Represents the event's location in the list and the number needed to be rolled for it to be selected.
 *  event-{}: The actual event to be represented, see docs for format.
 *  selectable-boolean: Denotes if the card is selectable, affects UI.
 *  className-String: The card's className, affects UI.
 *  handleClick-function: Passed from parent to resolve clicks.
 *  handleDelete-function: Passed from parent to determine if event is deletable and affect UI.
 */
const EventCard = ({id, event, selectable, className, handleClick, handleDelete, handleEdit}) => {

    /**
     * UI
     */
    return ( 
        <div>
            <button className={className}
                id={id}
                title={selectable ? "Select" : ""}
                onClick={handleClick}
                style={selectable ? {} : {textAlign: 'left'}} >
                <div className='title-container'>
                    <h2 style={{backgroundColor: event.titleColor}}>#{event.dieNum} {event.title}</h2>
                    {handleEdit && <img className="event-action-button" onClick={(event) => handleEdit(event)} src={require("./../img/pencil.png")} alt="" />}
                    {handleDelete && <img className="event-action-button" onClick={(event) => handleDelete(event)} src={require("./../img/trash.png")} alt="" />}
                    
                </div>
                <p>{event.body}</p>
            </button>
        </div>
        
     );
}
 
export default EventCard;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.