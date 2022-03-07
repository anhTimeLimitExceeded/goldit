import { useParams } from "react-router-dom";
import { PostCard } from "../../components/PostCard/PostCard"
import {NavBar} from "../../components/NavBar/NavBar";
import styles from "./Topic.module.css"
import React, {useContext, useEffect, useState} from "react";
import ToolBar from "../../components/ToolBar/ToolBar";
import {getPostByTopic} from "../../utils";
import {AppContext} from "../../contexts/AppContext";
export default function Topic() {
  let { topic } = useParams();
  document.title = "Goldit" + (topic?" - " + topic:"")
  if (!topic) topic = "all"
  const { user } = useContext(AppContext)
  const [posts, setPosts] = useState([]);
  const getIsMobile = () => window.innerWidth <= 700;
  const [loginWarning, setLoginWarning] = useState(false)
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
      setPosts(await getPostByTopic(topic))
    })();
  }, [setPosts, topic, user]);

  if (!posts) return null;
  return (
    <div>
      <NavBar active={topic} setShowBurgerMenu={setShowBurgerMenu}/>
      <div className={styles.container}>
        <div className={styles.posts_container}>
          {posts && posts.map((post) => {
            return (<PostCard key={post.id} id={post.id} title={post.title} content={post.contents} topics={post.topics} author={post.author}
                              time={post.createdAt} link={post.link} score={post.score} vote={post.vote} linkable={true}
                              setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>);
          })}
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