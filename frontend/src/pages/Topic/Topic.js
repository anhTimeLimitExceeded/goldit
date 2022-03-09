import { useParams } from "react-router-dom";
import { PostCard } from "../../components/PostCard/PostCard"
import styles from "./Topic.module.css"
import React, {useContext, useEffect, useState} from "react";
import {getPostByTopic} from "../../utils";
import {AppContext} from "../../contexts/AppContext";
export default function Topic({setLoginWarning, setShowBurgerMenu}) {
  let { topic } = useParams();
  document.title = "Goldit" + (topic?" - " + topic:"")
  if (!topic) topic = "all"
  const { user } = useContext(AppContext)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      setPosts(await getPostByTopic(topic))
    })();
  }, [setPosts, topic, user]);

  if (!posts) return null;
  return (
    <div className={styles.posts_container}>
      {/*<div className={styles.topic_header}>*/}
      {/*  <div className={styles.topic}>{topic}</div>*/}
      {/*  <div className={styles.topic_filter}>Sort by: Hot</div>*/}
      {/*</div>*/}
      {posts && posts.map((post) => {
        return (<PostCard key={post.id} id={post.id} title={post.title} content={post.contents} topics={post.topics} author={post.author}
                          time={post.createdAt} link={post.link} score={post.score} vote={post.vote} linkable={true}
                          setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>);
      })}
    </div>
  );
}
