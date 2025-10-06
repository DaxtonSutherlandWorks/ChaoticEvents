import { useState } from "react";
import { useLogin } from '../hooks/useLogin'
import { useSignup } from '../hooks/useSignup'
import '../styles/LoginSignup.css'

const LoginSignup = () => {

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const {login, error: loginError, isLoading: loginIsLoading} = useLogin();
    const {signup, error: signupError, isLoading: signupIsLoading} = useSignup();

    const handleLogin = async (e) => {
        e.preventDefault();

        await login(loginEmail, loginPassword);
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        await signup(signupEmail, signupPassword, signupUsername);
    }


    return (
        <div className="login-container">
            <div className="form-card-left">
                <h3>Login</h3>
                <br />
                <form onSubmit={handleLogin}>
                    <input type="email"
                        onChange={(elem) => setLoginEmail(elem.target.value)}
                        value={loginEmail}
                        placeholder=" Email"

                    />
                    <br /><br />
                    <input type="password"
                        onChange={(elem) => setLoginPassword(elem.target.value)}
                        value={loginPassword}
                        placeholder=" Password"

                    />
                    <br /><br />
                    <div style={{"textAlign":"center"}}>
                        <button disabled={loginIsLoading}>Login</button>  
                    </div>
                    <br />
                    {loginError && <div className="login-signup-error">{loginError}</div>}
                </form>
            </div>

            <div className="form-card-right">
                <h3>Sign up</h3>
                <br />
                <form onSubmit={handleSignup}>

                    <input 
                        type="email"
                        onChange={(e) => setSignupEmail(e.target.value)}
                        value={signupEmail}
                        placeholder=" Email" 
                    />
                    <br /><br />
                    <input 
                        type="password"
                        onChange={(e) => setSignupPassword(e.target.value)}
                        value={signupPassword}
                        placeholder=" Password" 
                    />
                    <br /><br />
                    <input 
                        type="text"
                        onChange={(e) => setSignupUsername(e.target.value)}
                        value={signupUsername}
                        placeholder=" User Name" 
                    />
                    <br /><br />
                    <div style={{"textAlign":"center"}}>
                        <button disabled={signupIsLoading}>Sign Up</button>  
                    </div>
                    <br />
                    {signupError && <div className="login-signup-error">{signupError}</div>}
                </form>
            </div>
            
        </div>
     );
}
 
export default LoginSignup;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.