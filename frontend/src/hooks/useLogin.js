import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    // Login a user
    const login = async (email,  password) => {
        // Sets load state and clears previous errors
        setIsLoading(true);
        setError(null);

        // Submits post to api with email/PW to login
        const response = await fetch(window.$apiURI+'/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const json = await response.json();

        // Error setting
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        
        if (response.ok) {
            //Save user to local storage
            localStorage.setItem('userToken', JSON.stringify(json));

            //Update AuthContext
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
    }

    return { login, isLoading, error};
}

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.