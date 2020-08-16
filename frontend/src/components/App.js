import React, { useContext } from "react";
import { BrowserRouter, Route, useHistory, Switch } from "react-router-dom";
import { createContext, useReducer, useEffect } from "react";
import Navbar from "./Navbar";
import Explore from "./Explore";
import Profile from "./Profile";
import Signup from "./Signup";
import Login from "./Login";
import Createpost from "./Createpost";
import Userprofile from "./Userprofile";
import Home from "./Home";
import "../App.css";
import { initialState, userReducer } from "../reducer/user";
import M from "materialize-css";
export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USERLOGIN", user: user });
      history.push("/");
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/explore">
        <Explore />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/createpost">
        <Createpost />
      </Route>
      <Route path="/profile/:id">
        <Userprofile />
      </Route>
    </Switch>
  );
};

function App() {
  let options = ["one,two"];
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <div className="App">
      <userContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          {document.addEventListener("DOMContentLoaded", function () {
            var elems = document.querySelectorAll(".sidenav");
            var instances = M.Sidenav.init(elems, options);
          })}
          <Navbar />
          <Routing />
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
