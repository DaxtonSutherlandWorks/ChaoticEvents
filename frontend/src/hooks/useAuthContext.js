import { AuthContext } from "../context/AuthContext";
import { useContext } from 'react';

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error('useAuthContext must be used inside a AuthContextProvider');
    }

    return context;
}

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.