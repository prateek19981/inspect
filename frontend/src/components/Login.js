import React from "react";
import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { userContext } from "./App";

const Login = () => {
  const [email, setEmail] = useState("");
  const history = useHistory();
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(userContext);
  const postData = async () => {
    let res = await fetch("/v1/user/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    let resjson = await res.json();
    console.log("user signin", resjson);
    if (resjson.success === true) {
      M.toast({ html: resjson.message, classes: "#43a047 green darken-1" });
      localStorage.setItem("token", resjson.token);
      localStorage.setItem("user", JSON.stringify(resjson.user));
      dispatch({
        type: "USERLOGIN",
        user: resjson.user,
      });

      history.push("/explore");
    } else {
      M.toast({ html: resjson.message, classes: "#c62828 red darken-3" });
    }
    console.log("res", resjson);
  };
  return (
    <div className="mycard">
      <div className="card authcard">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button
          className="btn waves-effect waves-light"
          type="submit"
          placeholder="login"
          onClick={() => postData()}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
