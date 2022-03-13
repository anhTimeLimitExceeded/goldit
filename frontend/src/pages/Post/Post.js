import { useParams } from "react-router-dom";
import React, {useCallback, useContext, useEffect, useState} from "react";
import styles from "../Post/Post.module.css";
import {PostCard} from "../../components/PostCard/PostCard";
import {createComment, getPost, getPostComments} from "../../utils";
import {AppContext} from "../../contexts/AppContext";
import {Skeleton} from "@mui/material";
import {CommentCard} from "../../components/CommentCard/CommentCard";

export default function Post({setLoginWarning, setShowBurgerMenu}) {
  let { postId, title } = useParams();
  const { user } = useContext(AppContext)
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [postComments, setPostComments] = useState(null);

  const renderComments = useCallback((comments, depth) => {
    return comments.map(comment => {

      return <CommentCard key={comment.id} id={comment.id} author={comment.author} contents={comment.contents}
                          score={comment.score} vote={comment.vote} time={comment.createdAt}
                          children={renderComments(comment.children, depth+1)} depth={depth}
                          setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>
    })
  }, [])

  useEffect(() => {
    (async () => {
      setPost(await getPost(postId, title))
      setPostComments(renderComments(await getPostComments(postId), 1))
    })();
  }, [setPost, postId, title, user, renderComments]);

  const createCommentRequest = () => {
    if (!user) {
      setShowBurgerMenu(true);
      setLoginWarning(true);
      return;
    }
    createComment({
      contents: comment,
      parentId: postId,
    }).then(comment => {
      setComment('')
      const newComment = <CommentCard key={comment.id} id={comment.id} author={comment.author} score={comment.score}
                                      vote={comment.vote} contents={comment.contents} time={comment.createdAt}
                                      depth={1} replied={true} setLoginWarning={setLoginWarning}
                                      setShowBurgerMenu={setShowBurgerMenu}/>;
      if (!postComments) {
        setPostComments([newComment])
      } else {
        setPostComments([newComment, ...postComments])
      }
    })
  }

  document.title = "Goldit: " + post?.title;
  return (
    <div>
      {post ?
        <PostCard key={post.id} id={post.id} title={post.title} content={post.contents} topics={post.topics} author={post.author}
                          time={post.createdAt} link={post.link} score={post.score} vote={post.vote} commentCount={post.commentCount}
                          showContents={true} linkable={false} setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>
      :
        <Skeleton variant="rectangular" height={200} sx={{"margin": "10px 20px 20px 20px", "borderRadius": "5px"}}/>
      }
      {postComments ?
        <div className={styles.comments_container}>
          <textarea placeholder="Leave a comment" className={styles.comment_input} rows="4" value={comment}
                    onChange={(e) => setComment(e.target.value)}/>
          <button style={{"width":"100px","alignSelf":"center"}} onClick={() => createCommentRequest()}>Comment</button>
          <div style={{"padding":"0 0 10px 5px"}}>
            {postComments}
          </div>
        </div>
        :
        <Skeleton variant="rectangular" height={500} sx={{"margin": "10px 20px 20px 20px", "borderRadius": "5px"}}/>
      }
    </div>
  );
}
