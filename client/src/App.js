import React from "react";
import { Route, NavLink } from "react-router-dom";

import Registration from "./components/Registration";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

import "./App.css";

function App() {
  const logOut = () => {
    window.localStorage.clear("token");
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo-container">
          <i className="fas fa-head-side-cough"></i>
          <h2>Don't go to work</h2>
        </div>
        <div className="links-container">
          <NavLink to="/jokes">Home</NavLink>
          <NavLink to="/signin">Login</NavLink>
          <NavLink onClick={logOut} to="/signup">
            Logout
          </NavLink>
        </div>
      </nav>

      <Route exact path="/signup" component={Registration} />
      <Route exact path="/signin" component={LoginForm} />
      <Route exact path="/jokes" component={Dashboard} />
    </div>
  );
}
export default App;
