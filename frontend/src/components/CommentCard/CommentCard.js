import React, {useState} from "react";
import styles from "./CommentCard.module.css"
import {TiMediaPlayOutline, TiMediaPlayReverse, TiMediaPlayReverseOutline} from "react-icons/ti";
import {createComment, getDisplayTime} from "../../utils";
import {BiExpandAlt} from "react-icons/bi";

export const CommentCard = ({id, author, contents, time, children, depth, replied=false}) => {

  const [collapseComment, setCollapseComment] = useState(false);
  const [collapseBarHover, setCollapseBarHover] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState(null);
  const [childrenComments, setChildrenComments] = useState(children);
  const createCommentRequest = () => {
    setShowReply(false);
    setReplyContent(null);
    createComment({
      contents: replyContent,
      parentId: String(id),
    }).then(comment => {
      const newComment = <CommentCard key={comment.id} id={comment.id} author={comment.author}
                                      contents={comment.contents} time={comment.createdAt} depth={depth} replied={true}/>;
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
            {collapseComment && <span className={styles.comment_time}>10 points</span>}
            <span className={styles.comment_time}>submitted {getDisplayTime(time)}</span>
          </div>
          {!collapseComment &&
            <div>
              <div className={styles.comment_content}>{contents}</div>
              <div className={styles.comment_card_taskbar}>
                <TiMediaPlayReverseOutline style={{"transform": "rotate(90deg)"}}/>
                0
                <TiMediaPlayOutline style={{"transform": "rotate(90deg)"}}/>
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
