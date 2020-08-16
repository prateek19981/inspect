import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { userContext } from "./App";

const Profile = (props) => {
  console.log("profile", props);
  const [name, setName] = useState("");
  const [postCount, setPostCount] = useState("");
  const [posts, setPost] = useState(null);
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState();
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  const { state, dispatch } = useContext(userContext);

  const updateImage = async (file) => {
    try {
      setImage(file);
    } catch (err) {
      console.log("error in cloudinaryfetch", err);
    }
  };

  useEffect(() => {
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
        console.log("update", jres);
        await setUrl(jres.secure_url);
        console.log("img url");
        console.log("cloudinary_res", jres);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, profilepic: jres.secure_url })
        );
        dispatch({ type: "UPDATEPIC", profilepic: jres.secure_url });
        let serverresponse = await fetch("/v1/user/updateprofilepic", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ profilepic: jres.secure_url }),
        });
        let jsonserverresponse = await serverresponse.json();
        console.log("server res", jsonserverresponse);
      } catch (err) {
        console.log(err);
      }
    };
    if (image) {
      uploadImage();
    }
  }, [image]);

  useEffect(() => {
    console.log("profile mounted");
    const postByUser = async () => {
      let res = await fetch("/v1/posts/", {
        method: "get",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      let resjson = await res.json();
      console.log("profilejson", resjson);
      let currentUser = JSON.parse(localStorage.getItem("user"));
      console.log("followers", currentUser.followers);

      setFollowers(currentUser.followers.length);
      setFollowing(currentUser.following.length);

      const currUser = JSON.parse(localStorage.getItem("user"));
      console.log("curr", currUser);
      console.log("name", currUser.name);
      setName(currUser.name);
      setPostCount(resjson.data.length);
      setPost(resjson.data);
      console.log("profilejson", resjson);
    };
    postByUser();
  }, []);
  const currUser = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {posts ? (
        <div
          className="profile-contain"
          style={{ maxWidth: "550px", margin: "10px auto" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px auto",
              borderBottom: "1px solid grey",
            }}
          >
            <div className="image">
              <img
                src={currUser.profilepic}
                style={{
                  height: "160px",
                  width: "160px",
                  borderRadius: "80px",
                }}
              />
              <div className="file-field input-field">
                <div className="btn">
                  <span>Update profile picture</span>
                  <input
                    type="file"
                    onChange={(e) => updateImage(e.target.files[0])}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                </div>
              </div>
            </div>

            <div>
              <h4>{name}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "109%",
                }}
              >
                <h5>{postCount} posts</h5>
                <h5>{followers} followers</h5>
                <h5>{following} following</h5>
              </div>
            </div>
          </div>
          <div className="gallery">
            {posts.length == 0 ? (
              <h4 style={{ fontFamily: "monospace" }}>No Reviews to show </h4>
            ) : (
              posts.map((post, i) => {
                return <img className="gal-img" src={post.image} key={i} />;
              })
            )}
          </div>
        </div>
      ) : (
        <div className="preloader-wrapper big active loader">
          <div className="spinner-layer spinner-blue">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>

          <div className="spinner-layer spinner-red">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>

          <div className="spinner-layer spinner-yellow">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>

          <div className="spinner-layer spinner-green">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
