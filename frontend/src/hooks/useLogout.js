import { useAuthContext } from "./useAuthContext";
//import { useWorkoutsContext } from "./useWorkoutsContext";

export const useLogout = () => {
    const { dispatch: authDispatch } = useAuthContext();

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('userToken');

        // dispatch logout action
        authDispatch({type: 'LOGOUT'});
    }

    return {logout};
}

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.