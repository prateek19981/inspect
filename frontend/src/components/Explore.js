import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Explore = (props) => {
  console.log("home", props);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("token", localStorage.getItem("token"));
        let res = await fetch("/v1/posts/all", {
          method: "get",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        let resjson = await res.json();
        console.log("posts", resjson);
        if (resjson.success === true) {
          setData(resjson.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, []);
  const likePost = async (id) => {
    let res = await fetch("/v1/posts/like", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ postid: id }),
    });

    let resjson = await res.json();
    let result = resjson.data;

    console.log("like", result);
    const newData = data.map((item) => {
      if (item._id === result._id) {
        return result;
      } else {
        return item;
      }
    });
    setData(newData);
  };

  const postComment = async (text, postid) => {
    let res = await fetch("/v1/posts/postcomment", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postid,
        text,
      }),
    });
    let resjson = await res.json();
    console.log("comment", resjson);
    const newData = data.map((item) => {
      if (item._id === resjson.data._id) {
        return resjson.data;
      } else {
        return item;
      }
    });
    setData(newData);
  };
  const unlikePost = async (id) => {
    console.log("likepost");
    let res = await fetch("/v1/posts/unlike", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ postid: id }),
    });

    let resjson = await res.json();

    let result = resjson.data;

    console.log("like", result);
    const newData = data.map((item) => {
      if (item._id === result._id) {
        return result;
      } else {
        return item;
      }
    });
    setData(newData);
  };
  const deletePost = async (postid) => {
    console.log("delete");
    let res = await fetch("/v1/posts/deletepost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postid,
      }),
    });
    let resjson = await res.json();
    console.log(resjson);
    if (resjson.success === true) {
      const newdata = data.filter((item) => {
        return item._id !== resjson.data._id;
      });
      setData(newdata);
    }
  };
  return (
    <>
      {data.length > 0 ? (
        <div className="home">
          {data.map((post) => {
            const curruser = JSON.parse(localStorage.getItem("user"));
            const userid = curruser._id;
            const commentuser = post.comments;
            return (
              <div className="card home-card" key={post._id}>
                <h5
                  className="card-title"
                  style={{ textAlign: "center", cursor: "pointer" }}
                >
                  <Link
                    to={
                      curruser._id === post.postedBy._id
                        ? `/profile`
                        : `/profile/${post.postedBy._id}`
                    }
                  >
                    <h4 style={{ fontFamily: "monospace" }}>
                      {post.postedBy.name}
                    </h4>
                  </Link>
                </h5>

                <div className="card-image">
                  {JSON.parse(localStorage.getItem("user"))._id ===
                  post.postedBy._id ? (
                    <i
                      className="material-icons"
                      style={{
                        float: "right",
                        cursor: "pointer",
                        transform: "translate(0,-43px)",
                      }}
                      onClick={() => deletePost(post._id)}
                    >
                      delete
                    </i>
                  ) : null}
                  <img src={post.image} />
                </div>

                <div className="card-content">
                  {post.likes.includes(userid) ? (
                    <i
                      className="material-icons"
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => unlikePost(post._id)}
                    >
                      thumb_up
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => likePost(post._id)}
                      style={{ cursor: "pointer" }}
                    >
                      thumb_up
                    </i>
                  )}

                  <h6>{post.likes.length} like</h6>

                  <h6 className="card-title">{post.title}</h6>
                  <p>{post.body}</p>
                  {post.comments.map((comment) => {
                    return (
                      <div key={comment._id}>
                        <h6>
                          <span
                            style={{ fontWeight: "500", marginRight: "6px" }}
                          >
                            <Link
                              to={
                                comment.postedBy._id === curruser._id
                                  ? `/profile`
                                  : `/profile/${comment.postedBy._id}`
                              }
                            >
                              {comment.postedBy.name}
                            </Link>
                          </span>

                          {comment.text}
                        </h6>
                      </div>
                    );
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      postComment(e.target[0].value, post._id);
                    }}
                  >
                    <input type="text" placeholder="write a comment"></input>
                  </form>
                </div>
              </div>
            );
          })}
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

export default Explore;
