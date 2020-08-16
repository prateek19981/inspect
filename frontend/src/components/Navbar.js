import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { userContext } from "./App";
import M from "materialize-css";

const Navbar = (props) => {
  const { state, dispatch } = useContext(userContext);
  console.log("state before logout", state);
  const history = useHistory();
  const logout = () => {
    localStorage.clear();
    dispatch({ type: "USERLOGOUT" });
    M.toast({
      html: "logged out successfully",
      classes: "#43a047 green darken-1",
    });
  };

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="2">
          <Link to="/createpost">Create Review</Link>
        </li>,
        <li key="4">
          <Link to="/explore">Explore</Link>
        </li>,
        <li key="3">
          <button
            onClick={() => {
              logout();
              history.push("/login");
            }}
            className="waves-effect waves-light btn #d32f2f"
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="5">
          <Link to="/login">login</Link>
        </li>,
        <li key="6">
          <Link to="/signup">signup</Link>
        </li>,
      ];
    }
  };

  console.log("nav", props);
  return (
    <div>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/login"} className="brand-logo">
            <h4
              style={{
                transform: "translate(0,-10px)",
                fontFamily: "monospace",
              }}
            >
              Inspect
            </h4>
          </Link>
          <a href="" data-target="mobile-demo" class="sidenav-trigger">
            <i class="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>
      <ul class="sidenav sidenav-close" id="mobile-demo">
        {renderList()}
      </ul>
    </div>
  );
};

export default Navbar;
