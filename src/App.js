import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import InstagramEmbed from "react-instagram-embed";

import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user is logged in...
        //console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      //perfom cleanup
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signup = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({ displayName: username });
      })
      .catch((err) => alert(err));

    setOpenModal(false);
  };

  const signin = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err));
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram logo"
              />
              <div className="app__textfield">
                <TextField
                  id="standard-basic"
                  label="username"
                  variant="standard"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  id="standard-basic"
                  label="email"
                  variant="standard"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  id="standard-basic"
                  label="password"
                  variant="standard"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" onClick={signup}>
                Sign Up
              </Button>
            </center>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram logo"
              />
              <div className="app__textfield">
                <TextField
                  id="standard-basic"
                  label="email"
                  variant="standard"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  id="standard-basic"
                  label="password"
                  variant="standard"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" onClick={signin}>
                Sign In
              </Button>
            </center>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__header__image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpenModal(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              user={user}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
