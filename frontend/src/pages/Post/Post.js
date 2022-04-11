import {useParams} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useState} from "react";
import styles from "../Post/Post.module.css";
import {PostCard} from "../../components/PostCard/PostCard";
import {createComment, getPost, getPostComments} from "../../utils";
import {AppContext} from "../../contexts/AppContext";
import {Skeleton} from "@mui/material";
import {CommentCard} from "../../components/CommentCard/CommentCard";
import Error from "../Error/Error";

export default function Post({setLoginWarning, setShowBurgerMenu}) {

  let { postId, title } = useParams();
  const { user } = useContext(AppContext)
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [commentWarning, setCommentWarning] = useState(false)
  const [postComments, setPostComments] = useState(null);
  const [sortFilter, setSortFilter] = useState("top")
  const filters = ["top", "new"]

  const renderComments = useCallback((comments, depth) => {
    return comments.map(comment => {
      return <CommentCard key={comment.id} id={comment.id} author={comment.author} contents={comment.contents}
                          score={comment.score} vote={comment.vote} time={comment.createdAt}
                          children={renderComments(comment.children, depth+1)} depth={depth}
                          setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>
    })
  }, [setLoginWarning, setShowBurgerMenu])

  useEffect(() => {
    (async () => {
      setPost(await getPost(postId, title))
      setPostComments(renderComments(await getPostComments(postId, sortFilter), 1))
    })();
  }, [setPost, postId, title, user, renderComments, sortFilter]);

  const createCommentRequest = () => {
    if (!user) {
      setShowBurgerMenu(true);
      setLoginWarning(true);
      return;
    }
    setCommentWarning(comment.length === 0);
    if (comment.length === 0) return;
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

  const updateComments =  async (filter) => {
    setSortFilter(filter);
    setPostComments(null);
    setPostComments(renderComments(await getPostComments(postId, filter), 1));
  }

  if (post === undefined) return <Error/>

  document.title = "Goldit: " + post?.title;
  return (
    <div>
      {post ?
        <PostCard key={post.id} id={post.id} title={post.title} content={post.contents} images={post.images} topics={post.topics}
                  author={post.author} isAuthor={post.isAuthor} time={post.createdAt} link={post.link} score={post.score} vote={post.vote} commentCount={post.commentCount}
                  showContents={true} linkable={false} editable={true} setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>
      :
        <Skeleton variant="rectangular" height={200} sx={{"margin": "10px 20px 20px 20px", "borderRadius": "5px"}}/>
      }
        <div className={styles.comments_container}>
          <textarea placeholder="Leave a comment" className={`${commentWarning && styles.warning} ${styles.comment_input}`}
                    rows="4" value={comment} onChange={(e) => setComment(e.target.value)}
                    onClick={() => setCommentWarning(false)}/>
          <button style={{"width":"100px","alignSelf":"center"}} onClick={() => createCommentRequest()}>Comment</button>
          <div className={styles.comments_filters}>
            <div style={{"padding": "2px 10px"}}>Sorted by: </div>
            {filters.map((filter) => {
              return <div key={filter} style={filter===sortFilter?{"backgroundColor":"rgb(255, 210, 0)"}:{}}
                          className={styles.comments_filter} onClick={() => updateComments(filter)}>{filter}</div>
            })}
          </div>

          {postComments ?
          <div style={{"padding":"0 0 10px 5px"}}>
            {postComments}
          </div>
          :
          <Skeleton variant="rectangular" height={500} sx={{"margin": "10px", "borderRadius": "5px"}}/>
          }
        </div>
    </div>
  );
}
