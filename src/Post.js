import React, { useState, useEffect } from "react";

import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

import classes from "./Post.module.css";
import { db } from "./firebase";

const Post = (props) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (props.postId) {
      unsubscribe = db
        .collection("posts")
        .doc(props.postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [props.postId]);

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(props.postId).collection("comments").add({
      text: comment,
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className={classes.post}>
      <div className={classes.header}>
        <Avatar className={classes.avatar}>{props.username[0]}</Avatar>
        <h3>{props.username}</h3>
      </div>
      <img className={classes.img} src={props.imageUrl} alt="" />
      <p className={classes.text}>
        <strong>{props.username}:</strong> {props.caption}
      </p>
      <div className={classes.posts_comments}>
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      <form className={classes.comment_box}>
        <input
          className={classes.post_input}
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={!comment}
          className={classes.post_button}
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default Post;
