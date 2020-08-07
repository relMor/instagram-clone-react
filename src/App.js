import React, { useState, useEffect } from "react";

import "./App.css";
import Post from "./components/Post/Post";
import { db } from "./firebase";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className="app">
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram logo"
        />
      </div>

      <h1>Instagram Clone</h1>
      {posts.map((post) => (
        <Post
          key={post.id}
          username={post.post.username}
          caption={post.post.caption}
        />
      ))}
    </div>
  );
}

export default App;
