import './App.css';
import React, { useContext, useEffect } from "react";
import {Routes, Route} from "react-router-dom";
import Topic from "./pages/Topic/Topic";
import {auth} from "./firebase";
import {AppContext} from "./contexts/AppContext";
import {getTopics, postAuthInfo} from "./utils";
import Post from "./pages/Post/Post";
function App() {
  const { setUser, setTopics } = useContext(AppContext)

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) await postAuthInfo();
    });
  }, [setUser]);

  useEffect(() => {
    (async () => {
      setTopics(await getTopics())
    })();
  }, [setTopics]);

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Topic/>}/>
        <Route path='/topic/:topic' element={<Topic/>}/>
        <Route path='/post/:id/:title' element={<Post/>}/>
      </Routes>
    </div>
  );
}

export default App;
