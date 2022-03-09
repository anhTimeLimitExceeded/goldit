import './App.module.css';
import React, {useContext, useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import Topic from "./pages/Topic/Topic";
import {auth} from "./firebase";
import {AppContext} from "./contexts/AppContext";
import {getTopics, postAuthInfo} from "./utils";
import Post from "./pages/Post/Post";
import {NavBar} from "./components/NavBar/NavBar";
import styles from "./App.module.css";
import ToolBar from "./components/ToolBar/ToolBar";
function App() {
  const { setUser, setTopics } = useContext(AppContext)
  const [loginWarning, setLoginWarning] = useState(false)
  const getIsMobile = () => window.innerWidth <= 700;

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) await postAuthInfo();
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
      setTopics(await getTopics())
    })();
  }, [setTopics]);

  return (
    <div className="App">
      <NavBar setShowBurgerMenu={setShowBurgerMenu}/>
      <div className={styles.container}>
        <Routes>
          <Route path='/' element={<Topic setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>}/>
          <Route path='/topic/:topic' element={<Topic setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>}/>
          <Route path='/post/:id/:title' element={<Post setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>}/>
        </Routes>

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
