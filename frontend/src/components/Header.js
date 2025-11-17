import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Navbar.css';

/**
 * Constant header for navigation
 */
const Header = () => {

    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const { logout } = useLogout();
    const { userToken, user } = useAuthContext();
    
    /**
     * Handles hamburger menu status
     */
    const hamburgerMenuClick = () => {
        setHamburgerOpen(!hamburgerOpen);
        const burger = document.getElementById("hamburger-menu");
        const nav = document.getElementById("navbar");  
        
        if (!hamburgerOpen)
        {
            burger.style.left = "0%";
            burger.style.width = "250px";
            nav.style.height = "275px";
        }
        else
        {
            burger.style.left = "100%";
            burger.style.width = "0px";
            nav.style.height = "84px"; 
        }
    }

    /**
     * Handles logging out
     */
    const logoutClick = () => {
        hamburgerMenuClick();
        logout();
    }

    /**
     * UI
     */
    return (
        <div className="navbar" id="navbar">
            <div>
                <Link to="/" >
                    <img className="header-logo" src={require("./../img/CE Logo.png")} alt="Site logo" />
                </Link>
            </div>
            <div>
                <h1>Chaotic Events</h1>
            </div>
            <div style={{"marginLeft":"auto", display:"flex"}}>
                {userToken && 
                    <Link reloadDocument to={'chaoticEvents/userprofile/'+user.userName} >
                        <img title="Account" src={require("./../img/accountCircle.png")} className="nav-icon" alt=""/>
                    </Link>}
                {!hamburgerOpen && <img onClick={hamburgerMenuClick} style={{left:"50px"}} src={require("./../img/hamburgerMenu.png")} className="nav-icon" alt="Hamburger Menu"></img>}
            </div>
            <div className="hamburger-menu" id="hamburger-menu">
                <div onClick={hamburgerMenuClick}>
                    <img src={require("./../img/close.png")} alt="Hamburger Menu"></img>
                    <h1>Close</h1>
                </div>
                <Link to="/chaoticEvents" onClick={hamburgerMenuClick} style={{ textDecoration: 'none', color: 'black'}}>
                    <div>
                        <img src={require("./../img/home.png")} alt="" />
                        <h1>Home</h1>
                    </div>
                </Link>
                <Link to="/chaoticEvents/about" onClick={hamburgerMenuClick} style={{ textDecoration: 'none', color: 'black'}}>
                    <div>
                        <img src={require("./../img/info.png")} alt="" />
                        <h1>About</h1>
                    </div>
                </Link>
                {!userToken && <div> 
                            <Link to="/chaoticEvents/loginsignup" onClick={hamburgerMenuClick} style={{all:'inherit', borderBottom:'none'}}>
                                <img src={require("./../img/newList.png")} alt="" />
                                <h1>Create List</h1>
                            </Link>
                        </div>}
                {userToken && <div>
                            <Link to="/chaoticEvents/createlist" onClick={hamburgerMenuClick} style={{all:'inherit', borderBottom:'none'}}>
                                <img src={require("./../img/newList.png")} alt="" />
                                <h1>Create List</h1>
                            </Link>
                        </div>
                }
                {!userToken &&
                <div style={{"borderBottom":"0px"}}>
                    <Link to="/chaoticEvents/loginsignup" onClick={hamburgerMenuClick} style={{all:'inherit'}}>
                        <img title="Login" src={require("./../img/login.png")} alt="" />
                        <h1>Login/Signup</h1>
                    </Link>
                </div>}
                {userToken &&
                <div style={{"borderBottom":"0px"}}>
                    <Link to="/chaoticEvents/loginsignup" style={{all: "inherit"}} onClick={logoutClick}>
                        <img title="Login" src={require("./../img/login.png")} alt="" />
                        <h1>Logout</h1>
                    </Link>
                </div>}
            </div>
        </div> 
    );
}
 
export default Header;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.