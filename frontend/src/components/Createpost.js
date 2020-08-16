import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const Createpost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageurl] = useState("");
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      console.log("inside fetch");
      try {
        if (imageUrl) {
          let res2 = await fetch("/v1/posts/create", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            title,
            body: JSON.stringify({
              image: imageUrl,
              title,
              body,
            }),
          });
          let jsres2 = await res2.json();
          console.log("server_res", jsres2);
          if (jsres2.success === true) {
            M.toast({
              html: jsres2.message,
              classes: "#43a047 green darken-1",
            });
            history.push("/explore");
          } else {
            console.log("hello");
            M.toast({ html: jsres2.message, classes: "#c62828 red darken-3" });
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [imageUrl]);

  const postDetails = async () => {
    try {
      console.log("details");
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

      await setImageurl(jres.secure_url);
      console.log("img url");
      console.log("cloudinary_res", jres);
      console.log("local", localStorage.getItem("token"));
    } catch (err) {
      console.log("error in cloudinaryfetch", err);
    }
  };
  return (
    <div className="card input-filed home-card">
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
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
        placeholder="login"
        style={{ marginLeft: "100px" }}
        onClick={() => postDetails()}
      >
        Submit Review
      </button>
    </div>
  );
};

export default Createpost;
