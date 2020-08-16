import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { userContext } from "./App";

const Userprofile = (props) => {
  const { state, dispatch } = useContext(userContext);
  const [profileUser, setProfileUser] = useState(null);
  const { id } = useParams();
  const [showFollowbutton, setShowFollowbutton] = useState(
    state ? !state.following.includes(id) : true
  );
  const followUser = async (whoToFollowid) => {
    let res = await fetch("/v1/user/follow", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        whoToFollow: whoToFollowid,
      }),
    });
    let resjson = await res.json();
    console.log("follow", resjson);
    dispatch({
      type: "FOLLOW USER",
      user: {
        following: resjson.data.following,
        followers: resjson.data.followers,
      },
    });
    localStorage.setItem("user", JSON.stringify(resjson.data));
    setProfileUser((prevState) => {
      return {
        ...prevState,
        followers: [...prevState.followers, resjson.data._id],
      };
    });
    setShowFollowbutton(false);
  };

  const UnfollowUser = async (whoToUnFollowid) => {
    let res = await fetch("/v1/user/unfollow", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        whoToUnFollow: whoToUnFollowid,
      }),
    });
    let resjson = await res.json();
    console.log("follow", resjson);
    dispatch({
      type: "FOLLOW USER",
      user: {
        following: resjson.data.following,
        followers: resjson.data.followers,
      },
    });
    localStorage.setItem("user", JSON.stringify(resjson.data));
    setProfileUser((prevState) => {
      const newfollower = prevState.followers.filter((item) => {
        return item !== resjson.data._id;
      });

      return {
        ...prevState,
        followers: newfollower,
      };
    });
    setShowFollowbutton(true);
  };
  const [name, setName] = useState("");
  const [postCount, setPostCount] = useState("");
  const [posts, setPost] = useState(null);

  useEffect(() => {
    const postByUser = async () => {
      let res = await fetch(`/v1/user/${id}`, {
        method: "get",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      let resjson = await res.json();
      console.log("user details", resjson);
      setName(resjson.data.user.name);
      setPostCount(resjson.data.userpost.length);
      setPost(resjson.data.userpost);
      setProfileUser(resjson.data.user);
    };
    postByUser();
  }, []);
  let showFollowers;

  if (profileUser) {
    showFollowers = (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "109%",
        }}
      >
        <h5>{postCount} posts</h5>
        <h5>{profileUser.followers.length} followers</h5>
        <h5>{profileUser.following.length} following</h5>
      </div>
    );
  } else {
    showFollowers = null;
  }
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
                src={profileUser ? profileUser.profilepic : null}
                style={{
                  height: "160px",
                  width: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <h4 style={{ fontFamily: "monospace" }}>{name}</h4>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "109%",
                }}
              >
                <h5>{postCount} posts</h5>
                
              </div> */}
              {showFollowers}
              {showFollowbutton ? (
                <button
                  className="btn waves-effect waves-light"
                  type="submit"
                  placeholder="login"
                  onClick={() => {
                    followUser(profileUser._id);
                  }}
                  style={{ margin: "20px" }}
                >
                  follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light"
                  type="submit"
                  placeholder="login"
                  onClick={() => {
                    UnfollowUser(profileUser._id);
                  }}
                  style={{ margin: "20px" }}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {posts.map((post) => {
              return (
                <img className="gal-img" src={post.image} key={post._id} />
              );
            })}

            {/* <img
          className="gal-img"
          src="https://images.unsplash.com/photo-1595940828263-a4c63ddd86eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        />
        <img
          className="gal-img"
          src="https://images.unsplash.com/photo-1595940828263-a4c63ddd86eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        />
        <img
          className="gal-img"
          src="https://images.unsplash.com/photo-1595940828263-a4c63ddd86eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        />
        <img
          className="gal-img"
          src="https://images.unsplash.com/photo-1595940828263-a4c63ddd86eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        />
        <img
          className="gal-img"
          src="https://images.unsplash.com/photo-1595940828263-a4c63ddd86eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        />
        <img
          className="gal-img"
          src="https://images.unsplash.com/photo-1595940828263-a4c63ddd86eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        />
        <img
          className="gal-img"
          src="https://images.unsplash.com/photo-1595940828263-a4c63ddd86eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        />
        <img
          className="gal-img"
          src="https://images.unsplash.com/photo-1595940828263-a4c63ddd86eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        /> */}
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

export default Userprofile;
