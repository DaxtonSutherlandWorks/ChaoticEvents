import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

import Home from "./pages/Home"
import Header from "./components/Header"
import Footer from "./components/Footer"
import About from './pages/About';
import LoginSignup from './pages/LoginSignup';
import ListView from './pages/ListView';
import CreateList from './pages/CreateList';
import UserProfile from './pages/UserProfile';

function App() {

  const { userToken } = useAuthContext();
 
  window.$themes={'Fire': ['#e7623e', '#ffbdab'],
                  'Gold': ['#b59e54', '#ecd68b'],
                  'Rogue': ['#ab6dac', '#febbff'],
                  'Emerald': ['#507f62', '#9de9ba'],
                  'Silver': ['#91a1b2', '#bdc8d3'],
                  'Ash': ['#555752', '#9da099'],
                  'Moss': ['#7a853b', '#c5cf87'],
                  'Blood': ['#992e2e', '#f59090'],
                  'Rust': ['#7f513e', '#da8c6b'],
                  'Iris': ['#7b469b', '#d593ff'],
                  'Copper': ['#d59139', '#ffcc89'],
                  'Sky': ['#51a5c5', '#a3e5ff'],
                  'Cobalt': ['#2a50a1', '#709dff'],
                  'Default': ['#C73032', '#fab6b8']};

  return (
    <div className="App">
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
      <BrowserRouter>
        <Header></Header>
        <div className="page-content">
          <div className='content-card'>
            <Routes>
              <Route
                path="/"
                element={<Home />}>

              </Route>
              <Route
                path="/about"
                element={<About />}>
                
              </Route>
              <Route
                path="/loginsignup"
                element={userToken ? <Navigate to="/" /> : <LoginSignup />}>

              </Route>
              <Route
                path="/ListView"
                element={<ListView />}>
        
              </Route>
              <Route
                path="/createlist"
                element={<CreateList />}>
              </Route>
              <Route
                path="/userprofile/:userName"
                element={<UserProfile />}>

              </Route>
            </Routes>
          </div>
        </div>
        <Footer></Footer>
      </BrowserRouter>
    </div>
  );
}

export default App;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.
