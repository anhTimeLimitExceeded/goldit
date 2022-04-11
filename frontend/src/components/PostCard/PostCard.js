import styles from "./PostCard.module.css"
import {TiMediaPlay, TiMediaPlayOutline, TiMediaPlayReverse, TiMediaPlayReverseOutline} from "react-icons/ti";
import {AiFillCloseCircle, AiFillPlusCircle} from "react-icons/ai";
import {VscComment} from "react-icons/vsc";
import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {deletePost, getDisplayTime, postVote} from "../../utils";
import {AppContext} from "../../contexts/AppContext";
import {ImageCarousel} from "../ImageCarousel/ImageCarousel";
import {Dialog} from "@mui/material";
import PostSubmitForm from "../ToolBar/PostSubmitForm";

export const PostCard = ({id, title, content, images, time, author, isAuthor, topics, link, score, vote, commentCount,
                           showContents=false, linkable=false, editable=false,
                           setLoginWarning, setShowBurgerMenu}) => {
  const {user} = useContext(AppContext)
  const [showContent, setShowContent] = useState(showContents);
  const [postcardHover, setPostcardHover] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [postScore, setPostScore] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editPopup, setEditPopup] = useState(false);

  useEffect(() => {
    setPostScore(score);
    setUserVote(vote);
  }, [score, vote]);

  const navigate = useNavigate();

  const upvote = () => {
    if (!user) {
      setShowBurgerMenu(true);
      setLoginWarning(true);
      return;
    }
    postVote(id, "up")
    if (userVote === "up") {
      setPostScore(postScore-1);
      setUserVote("neither")
    } else if (userVote === "neither") {
      setPostScore(postScore+1);
      setUserVote("up")
    } else if (userVote === "down") {
      setPostScore(postScore+2);
      setUserVote("up");
    }
  }

  const downvote = () => {
    if (!user) {
      setShowBurgerMenu(true);
      setLoginWarning(true);
      return;
    }
    postVote(id, "down")
    if (userVote === "up") {
      setPostScore(postScore-2);
      setUserVote("down");
    } else if (userVote === "neither") {
      setPostScore(postScore-1);
      setUserVote("down");
    } else if (userVote === "down") {
      setPostScore(postScore+1);
      setUserVote("neither")
    }
  }

  const requestDeletePost = () => {
    deletePost(id).then(r => {
      navigate("/")
    });
  }
  return (
    <div className={`${styles.post_container} ${linkable && postcardHover && styles.post_container_hover}`}>
        <div className={styles.score}>
          {userVote === "up" ?
            <TiMediaPlayReverse  className={styles.vote_button} size={"1.5em"} onClick={upvote}/>
            :
            <TiMediaPlayReverseOutline className={styles.vote_button} size={"1.5em"} onClick={upvote}/>
          }
          {postScore < 1000? postScore : Math.round(postScore/100) / 10 + "k"}
          {userVote === "down" ?
            <TiMediaPlay className={styles.vote_button} size={"1.5em"} onClick={downvote}/>
            :
            <TiMediaPlayOutline className={styles.vote_button} size={"1.5em"} onClick={downvote}/>
          }
        </div>
        <div className={styles.post}>
          <div className={styles.post_overlay} onClick={() => {linkable && navigate("/post/" + link)}}
               onMouseEnter={() => setPostcardHover(true)}
               onMouseLeave={() => setPostcardHover(false)}/>
          <div className={styles.post_title}>{title}</div>
          <div className={styles.post_details}>
              {showContent?
                <AiFillCloseCircle className={styles.show_content_button} size={"1.8em"} onClick={() => setShowContent(!showContent)}/>
                :
                <AiFillPlusCircle className={styles.show_content_button} size={"1.8em"} onClick={() => setShowContent(!showContent)}/>
              }
            <div className={styles.post_details_timestamp}>
              <div>submitted {getDisplayTime(time)} <span style={{"whiteSpace": "nowrap"}}>by {author}</span></div>
            </div>
          </div>
          <div className={styles.post_details_comments_and_tags}>
            <div className={styles.post_details_comments}>
              <VscComment className={styles.post_details_comments_icon}/>{commentCount} {commentCount>1?" comments":" comment"}
            </div>
            <div className={styles.post_tags}>
              {topics && topics.map((topic) => {
                return(<Link key={topic} to={"/topic/" + topic}>{topic}</Link>)
              })}
            </div>
            {editable && isAuthor &&
              <>
                <div className={styles.post_details_comments_edit_delete} onClick={() => setEditPopup(true)}>edit</div>
                <PostSubmitForm postPopup={editPopup} setPostPopup={setEditPopup} postId={id} postInitialTitle={title} postInitialContent={content} editable={true}
                postInitialTopics={topics} postInitialImages={images}/>
                <div className={styles.post_details_comments_edit_delete} onClick={() => setShowDeleteDialog(true)}>delete</div>
                <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} fullWidth>
                  <h2 style={{"textAlign":"center"}}>Are you sure you want to delete this post?</h2>
                  <div style={{"display":"flex", "justifyContent":"space-evenly", "marginBottom":"20px"}}>
                    <button onClick={requestDeletePost}><h2 style={{"margin":"0"}}>Yes</h2></button>
                    <button onClick={() => setShowDeleteDialog(false)}><h2 style={{"margin":"0"}}>No</h2></button>
                  </div>
                </Dialog>
              </>
            }
          </div>
          {showContent && <div>
            <div className={styles.post_content}>
              <p>{content}</p>
            </div>
            {images && <ImageCarousel images={images}/>}
          </div>}
        </div>
  </div>
  );
}