import styles from "./PostCard.module.css"
import {TiMediaPlay, TiMediaPlayOutline, TiMediaPlayReverse, TiMediaPlayReverseOutline} from "react-icons/ti";
import {AiFillCloseCircle, AiFillPlusCircle} from "react-icons/ai";
import {VscComment} from "react-icons/vsc";
import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getDisplayTime, postVote} from "../../utils";
import {AppContext} from "../../contexts/AppContext";

export const PostCard = ({id, title, content, time, author, topics, link, score, vote, commentCount,
                           showContents=false, linkable=false,
                           setLoginWarning, setShowBurgerMenu}) => {
  const {user} = useContext(AppContext)
  const [showContent, setShowContent] = useState(showContents);
  const [hover, setHover] = useState(false);
  const [postcardHover, setPostcardHover] = useState(false);
  const [upvoteHover, setUpvoteHover] = useState(false);
  const [downvoteHover, setDownvoteHover] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [postScore, setPostScore] = useState(null);
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

  return (
    <div className={`${styles.post_container} ${linkable && postcardHover && styles.post_container_hover}`}>
        <div className={styles.score}>
          {userVote === "up" ?
            <TiMediaPlayReverse color={!upvoteHover?"grey":""} style={{"transform": "rotate(90deg)"}}
                                       size={"1.5em"} onClick={upvote}
                                       onMouseEnter={() => {setUpvoteHover(true)}}
                                       onMouseLeave={() => {setUpvoteHover(false)}}/>
            :
            <TiMediaPlayReverseOutline color={!upvoteHover?"grey":""} style={{"transform": "rotate(90deg)"}}
                                       size={"1.5em"} onClick={upvote}
                                       onMouseEnter={() => {setUpvoteHover(true)}}
                                       onMouseLeave={() => {setUpvoteHover(false)}}/>
          }
          {postScore < 1000? postScore : Math.round(postScore/100) / 10 + "k"}
          {userVote === "down" ?
            <TiMediaPlay color={!downvoteHover?"grey":""} style={{"transform":"rotate(90deg)"}} size={"1.5em"}
                                onClick={downvote}
                                onMouseEnter={() => {setDownvoteHover(true)}}
                                onMouseLeave={() => {setDownvoteHover(false)}}/>
            :
            <TiMediaPlayOutline color={!downvoteHover?"grey":""} style={{"transform":"rotate(90deg)"}} size={"1.5em"}
                                onClick={downvote}
                                onMouseEnter={() => {setDownvoteHover(true)}}
                                onMouseLeave={() => {setDownvoteHover(false)}}/>
          }
        </div>
        <div className={styles.post}>
          <div className={styles.post_overlay} onClick={() => {linkable && navigate("/post/" + link)}}
               onMouseEnter={() => setPostcardHover(true)}
               onMouseLeave={() => setPostcardHover(false)}/>
          <div className={styles.post_title}>{title}</div>
          <div className={styles.post_details}>
              {showContent? <AiFillCloseCircle color={!hover?"grey":""} size={"1.8em"} onClick={() => setShowContent(!showContent)}
                                               className={styles.show_content_button}
                                               onMouseEnter={() => {setHover(true)}}
                                               onMouseLeave={() => {setHover(false)}}/>:
                           <AiFillPlusCircle color={!hover?"grey":""} size={"1.8em"} onClick={() => setShowContent(!showContent)}
                                             className={styles.show_content_button}
                                             onMouseEnter={() => {setHover(true)}}
                                             onMouseLeave={() => {setHover(false)}}/>
              }
            <div className={styles.post_details_timestamp}>
              <div>submitted {getDisplayTime(time)} <span style={{"whiteSpace": "nowrap"}}>by {author}</span></div>
            </div>
          </div>
          <div className={styles.post_details_comments_and_tags}>
            <div className={styles.post_details_comments} onClick={() => navigate("/post/" + link)}>
              <VscComment className={styles.post_details_comments_icon}/>{commentCount} {commentCount>1?" comments":" comment"}
            </div>
            <div className={styles.post_tags}>
              {topics && topics.map((topic) => {
                return(<Link key={topic} to={"/topic/" + topic}>{topic}</Link>)
              })}
            </div>
          </div>
          {showContent && <div className={styles.post_content}>
            <p>{content}</p>
          </div>}
        </div>
  </div>
  );
}