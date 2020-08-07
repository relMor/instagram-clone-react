import React, { useState } from "react";

import "./App.css";
import Post from "./components/Post/Post";

function App() {
  const [posts, setPosts] = useState([
    { username: "Aman", caption: "Nothing much!" },
    { username: "Max", caption: "Whatsupp?" },
    { username: "Solo", caption: "Noice!!!" },
  ]);

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
          key={post.username}
          username={post.username}
          caption={post.caption}
        />
      ))}
    </div>
  );
}

export default App;
