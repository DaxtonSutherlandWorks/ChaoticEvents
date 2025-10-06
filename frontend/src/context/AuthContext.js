import { createContext, useReducer, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { userToken: action.payload, user: jwtDecode(action.payload.token)};
        case 'LOGOUT':
            return { userToken: null, user: null };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    // Sets up session with no user
    const [state, dispatch] = useReducer(authReducer, {
        userToken: null,
        user: null
    })

    // First loading checks for a persistent token in local storage
    useEffect(() => {
        let user =  JSON.parse(localStorage.getItem('userToken'));

        if (user) {
            const existingToken = (jwtDecode(user.token));
            

            // Scrubs local memory and sets user to null if token expired
            if (existingToken.exp < (Date.now()/1000))
            {
                localStorage.removeItem("userToken");
                dispatch({ type: 'LOGOUT'});
            }

            else
            {
                dispatch({ type: 'LOGIN', payload: user });
            }
        }

    }, []);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.