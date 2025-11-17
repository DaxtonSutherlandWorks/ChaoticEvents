import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email,  password, userName) => {
        // Sets load state and clears previous errors
        setIsLoading(true);
        setError(null);

        // Submits post to api with Email/PW/UN to sign up
        const response = await fetch(window.$apiURI+'/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, userName})
        });

        const json = await response.json();

        // Error setting
        if (!response.ok) {
            setIsLoading(false);
            
            // React does not like newline characters, must check for the password error placeholder to work around.
            if (json.error === 'Password placeholder')
            {
                //In this array, break tags replace newlines.
                setError(["Password must contain:", <br/>, "8 Letters", <br/>, "1 Lowercase", <br/>, "1 Uppercase", <br/>, "1 Number", <br/>, "1 Symbol (!@#$%&* etc.)"]);
            }
            else
            {
                setError(json.error);
            }   
        }
        if (response.ok) {
            //Save user to local storage
            localStorage.setItem('userToken', JSON.stringify(json));

            //Update AuthContext
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
    }

    return { signup, isLoading, error};
}

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.