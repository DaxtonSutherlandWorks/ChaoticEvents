import { createContext, useReducer } from 'react';

export const EventListsContext = createContext();

/* Params
    state: the reliable previous state (current state)
    action: object passed into dispatch function with type and payload
   Function:
    Switch statement checking action param, uses payload to update state
   Return:
    The new State
*/
export const eventListsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EVENTLISTS':
            return {
                eventLists: action.payload
            };
        case 'CREATE_EVENTLIST':
            return {
                eventLists: [action.payload, ...state.eventLists]
            };
        case 'DELETE_EVENTLIST':
            return {
                eventLists: state.eventLists.filter((eventList) => eventList._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const EventListsContextProvider = ({ children }) => {
    
    // Like a useState, get the state, function, and initial value.
    // Call dispatch to change state using an object with
    // a type value in all caps representing the function to complete, and
    // a payload of the data needed to carry out the operation:
    // dispatch({type: 'CREATE_EVENTLIST', payload: [{}, {}]});
    // The reducer function is called to work based on the type param
    const [state, dispatch] = useReducer(eventListsReducer, {
        eventLists: null
    });

    return (
        <EventListsContext.Provider value={{...state, dispatch}}>
            { children }
        </EventListsContext.Provider>
    );
};

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.