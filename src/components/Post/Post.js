import React from "react";

import Avatar from "@material-ui/core/Avatar";

import classes from "./Post.module.css";

const post = (props) => {
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
    </div>
  );
};

export default post;
