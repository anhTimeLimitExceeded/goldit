import { useParams } from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import styles from "../Topic/Topic.module.css";
import styles1 from "../Post/Post.module.css";
import {PostCard} from "../../components/PostCard/PostCard";
import {getPost} from "../../utils";
import {AppContext} from "../../contexts/AppContext";

export default function Post({setLoginWarning, setShowBurgerMenu}) {
  let { id, title } = useParams();
  const { user } = useContext(AppContext)
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      setPost(await getPost(id, title))
    })();
  }, [setPost, id, title, user]);

  if (!post) return null;

  document.title = "Goldit: " + post.title;
  return (
    <div className={styles.posts_container}>
      <PostCard key={post.id} id={post.id} title={post.title} content={post.contents} topics={post.topics} author={post.author}
                time={post.createdAt} link={post.link} score={post.score} vote={post.vote} showContents={true} linkable={false}
                setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>
      <div className={styles1.comments_container}>
        <textarea placeholder="Leave a comment" className={styles1.comment_input} rows="4"/>
        420 Comments
      </div>
    </div>
  );
}
