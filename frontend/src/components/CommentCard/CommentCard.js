import React, {useContext, useEffect, useState} from "react";
import styles from "./CommentCard.module.css"
import {TiMediaPlay, TiMediaPlayOutline, TiMediaPlayReverse, TiMediaPlayReverseOutline} from "react-icons/ti";
import {createComment, getDisplayTime, postVote} from "../../utils";
import {BiExpandAlt} from "react-icons/bi";
import {AppContext} from "../../contexts/AppContext";

export const CommentCard = ({id, author, contents, time, score, vote,
                              children, depth, replied=false,
                              setLoginWarning, setShowBurgerMenu}) => {

  const {user} = useContext(AppContext)
  const [collapseComment, setCollapseComment] = useState(false);
  const [collapseBarHover, setCollapseBarHover] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState(null);
  const [childrenComments, setChildrenComments] = useState(children);
  const [upvoteHover, setUpvoteHover] = useState(false);
  const [downvoteHover, setDownvoteHover] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [commentScore, setCommentScore] = useState(null);

  useEffect(() => {
    setCommentScore(score);
    setUserVote(vote);
  }, [score, vote]);

  const upvote = () => {
    if (!user) {
      setShowBurgerMenu(true);
      setLoginWarning(true);
      return;
    }
    postVote(id, "up")
    if (userVote === "up") {
      setCommentScore(commentScore-1);
      setUserVote("neither")
    } else if (userVote === "neither") {
      setCommentScore(commentScore+1);
      setUserVote("up")
    } else if (userVote === "down") {
      setCommentScore(commentScore+2);
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
      setCommentScore(commentScore-2);
      setUserVote("down");
    } else if (userVote === "neither") {
      setCommentScore(commentScore-1);
      setUserVote("down");
    } else if (userVote === "down") {
      setCommentScore(commentScore+1);
      setUserVote("neither")
    }
  }

  const createCommentRequest = () => {
    if (!user) {
      setShowBurgerMenu(true);
      setLoginWarning(true);
      return;
    }
    setShowReply(false);
    setReplyContent(null);
    createComment({
      contents: replyContent,
      parentId: String(id),
    }).then(comment => {
      const newComment = <CommentCard key={comment.id} id={comment.id} author={comment.author} score={comment.score}
                                      vote={comment.vote} contents={comment.contents} time={comment.createdAt}
                                      depth={depth} replied={true} setLoginWarning={setLoginWarning}
                                      setShowBurgerMenu={setShowBurgerMenu}/>;
      if (!children) {
        setChildrenComments([newComment])
      } else {
        setChildrenComments([newComment, ...children])
      }
    })
  }
  return (
    <div className={styles.comment_card_container}>
      <div className={styles.comment_card_collapse_bar_container} onClick={() => setCollapseComment(!collapseComment)}
           onMouseEnter={() => setCollapseBarHover(true)} onMouseLeave={() => setCollapseBarHover(false)}>
        {collapseComment ?
          <div style={collapseBarHover ? {"backgroundColor": "rgb(255, 210, 0)"} : {  }}
              className={styles.comment_card_collapse_bar_expand}><BiExpandAlt/></div>
          :
          <div style={collapseBarHover ? {"backgroundColor": "rgb(255, 210, 0)"} : {"backgroundColor": "lightgrey"}}
               className={styles.comment_card_collapse_bar}/>
        }
      </div>
      <div className={`${styles.comment_details} ${replied && styles.comment_card_details_replied}`}>
          <div className={styles.comment_author}>
            {author}
            {collapseComment && <span className={styles.comment_time}>
              {commentScore < 1000? commentScore : Math.round(commentScore/100) / 10 + "k"} points</span>}
            <span className={styles.comment_time}>submitted {getDisplayTime(time)}</span>
          </div>
          {!collapseComment &&
            <div>
              <div className={styles.comment_content}>{contents}</div>
              <div className={styles.comment_card_taskbar}>
                {userVote === "up" ?
                  <TiMediaPlayReverse color={!upvoteHover?"grey":""} style={{"transform": "rotate(90deg)"}}
                                      onClick={upvote} onMouseEnter={() => {setUpvoteHover(true)}}
                                      onMouseLeave={() => {setUpvoteHover(false)}}/>
                  :
                  <TiMediaPlayReverseOutline color={!upvoteHover?"grey":""} style={{"transform": "rotate(90deg)"}}
                                             onClick={upvote} onMouseEnter={() => {setUpvoteHover(true)}}
                                             onMouseLeave={() => {setUpvoteHover(false)}}/>
                }
                {commentScore < 1000? commentScore : Math.round(commentScore/100) / 10 + "k"}
                {userVote === "down" ?
                  <TiMediaPlay color={!downvoteHover?"grey":""} style={{"transform":"rotate(90deg)"}}
                               onClick={downvote} onMouseEnter={() => {setDownvoteHover(true)}}
                               onMouseLeave={() => {setDownvoteHover(false)}}/>
                  :
                  <TiMediaPlayOutline color={!downvoteHover?"grey":""} style={{"transform":"rotate(90deg)"}}
                                      onClick={downvote} onMouseEnter={() => {setDownvoteHover(true)}}
                                      onMouseLeave={() => {setDownvoteHover(false)}}/>
                }
                {depth <= 5 && <div className={styles.comment_reply} onClick={() => setShowReply(!showReply)}>reply</div>}
              </div>
              {showReply && <div className={styles.comment_reply_container}>
                <textarea placeholder="Reply this comment" className={styles.comment_reply_input} rows="3"
                          onChange={(e) => setReplyContent(e.target.value)}/>
                <div className={styles.comment_reply_container_taskbar}>
                  <button onClick={() => setShowReply(false)}>cancel</button>
                  <button onClick={() => createCommentRequest()}>submit</button>
                </div>
              </div>}
              {childrenComments}
            </div>
          }
      </div>
    </div>
  );
}
