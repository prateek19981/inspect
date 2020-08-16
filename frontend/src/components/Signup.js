import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { userContext } from "./App";
const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState();
  const [url, setUrl] = useState();
  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    if (url) {
      postwithoutImage();
    }
  }, [url]);

  const uploadImage = async () => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "engigram");
      data.append("cloud_name", "prateek1234");
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/prateek1234/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      let jres = await res.json();

      await setUrl(jres.secure_url);
      console.log("img url");
      console.log("cloudinary_res", jres);
      console.log("local", localStorage.getItem("token"));
    } catch (err) {
      console.log("error in cloudinaryfetch", err);
    }
  };
  const postwithoutImage = async () => {
    let res = await fetch("/v1/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic: url,
      }),
    });
    let jres = await res.json();
    if (jres.success === false) {
      M.toast({ html: jres.message, classes: "#c62828 red darken-3" });
    } else {
      M.toast({ html: jres.message, classes: "#43a047 green darken-1" });
      history.push("/login");
    }
    console.log("res", jres);
  };
  const postData = async () => {
    if (image) {
      uploadImage();
    } else {
      postwithoutImage();
    }
  };

  return (
    <div className="mycard">
      <div className="card authcard">
        <h2>Signup</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className="file-field input-field">
          <div className="btn">
            <span>IMAGE</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light"
          type="submit"
          onClick={() => {
            postData();
          }}
        >
          Signup
        </button>
        <h5>
          <Link to="/login">already have account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
