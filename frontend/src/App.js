import './App.module.css';
import React, {useContext, useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import Topic from "./pages/Topic/Topic";
import {auth} from "./firebase";
import {AppContext} from "./contexts/AppContext";
import {getTopics, getTrendingTopics, postAuthInfo} from "./utils";
import Post from "./pages/Post/Post";
import {NavBar} from "./components/NavBar/NavBar";
import styles from "./App.module.css";
import ToolBar from "./components/ToolBar/ToolBar";
import BrowseTopics from "./pages/BrowseTopics/BrowseTopics";
function App() {
  const { setUser, setTopics, setTrendingTopics } = useContext(AppContext)
  const [loginWarning, setLoginWarning] = useState(false)
  const getIsMobile = () => window.innerWidth <= 700;

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) await postAuthInfo().then(r => user.displayName = r.username);
      setUser(user);
    });
  }, [setUser]);

  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(getIsMobile);
  useEffect(() => {
    const onResize = () => {
      setIsMobile(getIsMobile());
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setTopics(await getTopics());
      setTrendingTopics(await getTrendingTopics());
    })();
  }, [setTopics]);

  return (
    <div className="App">
      <NavBar setShowBurgerMenu={setShowBurgerMenu}/>
      <div className={styles.container}>
        <div className={styles.content_container}>
          <Routes>
            <Route path='/' element={<Topic setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>}/>
            <Route path='/alltopics' element={<BrowseTopics/>}/>
            <Route path='/topic/:topic' element={<Topic setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>}/>
            <Route path='/post/:postId/:title' element={<Post setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>}/>
          </Routes>
        </div>

        {isMobile?
          (showBurgerMenu &&
            <div className={styles.toolbar_container_layover}>
              <div className={styles.toolbar_container_complement} onClick={() => {
                setShowBurgerMenu(false); setLoginWarning(false);}}>
              </div>

              <div className={styles.toolbar_container}>
                <ToolBar loginWarning={loginWarning} setLoginWarning={setLoginWarning}/>
              </div>
            </div>)
          :
          (<div className={styles.toolbar_container}>
            <ToolBar loginWarning={loginWarning} setLoginWarning={setLoginWarning}/>
          </div>)
        }
      </div>
    </div>
  );
}

export default App;
