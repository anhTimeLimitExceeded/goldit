import styles from "./ToolBar.module.css";
import React, {useContext, useState} from "react";
import {Tooltip} from "@mui/material";
import {AppContext} from "../../contexts/AppContext";
import {signIn, signOut} from "../../firebase";
import {FaEdit, FaSignOutAlt} from "react-icons/fa";
import {Link} from "react-router-dom";
import PostSubmitForm from "./PostSubmitForm";
import TopicSubmitForm from "./TopicSubmitForm";
import ProfileEditForm from "./ProfileEditForm";
export default function ToolBar({loginWarning, setLoginWarning}) {

  const {user, trendingTopics} = useContext(AppContext)
  const [postPopup, setPostPopup] = useState(false)
  const [newTopicPopup, setNewTopicPopup] = useState(false)
  const [profileEditPopup, setProfileEditPopup] = useState(false)

  return (
    <div className={styles.sidebar}>
      <div className={styles.toolbar}>
        {user?
          <div className={styles.toolbar_user_info}>
            <div>Hi,&nbsp;<b>{user.displayName}</b></div>
            <div className={styles.toolbar_user_buttons}>
              <div onClick={() => setProfileEditPopup(true)}>
                Edit profile
                <div className={styles.toolbar_sign_out}>
                  <FaEdit/>
                </div>
              </div>
              <div onClick={signOut}>
                Sign out
                <div className={styles.toolbar_sign_out}>
                  <FaSignOutAlt/>
                </div>
              </div>
            </div>
          </div>
          :<Tooltip open={loginWarning} title={<h2>You must login first!</h2>} placement="top">
              <button className={`${loginWarning && styles.warning} ${styles.toolbar_button}`}
                      onClick={() => {setLoginWarning(false); signIn()}}>Login</button>
          </Tooltip>
        }
        <button className={styles.toolbar_button} onClick={() => {
          user ? setPostPopup(true) : setLoginWarning(true)
        }}>Create a post!</button>
        <button className={styles.toolbar_button} onClick={() => {
          user ? setNewTopicPopup(true) : setLoginWarning(true)
        }}>Request a new topic</button>

        <PostSubmitForm postPopup={postPopup} setPostPopup={setPostPopup}/>
        <TopicSubmitForm newTopicPopup={newTopicPopup} setNewTopicPopup={setNewTopicPopup}/>
        <ProfileEditForm newTopicPopup={profileEditPopup} setNewTopicPopup={setProfileEditPopup}/>

    </div>
      <div className={styles.topics_bar}>
        <div className={styles.topics_bar_header}><b>Trending today:</b> <Link to={"/alltopics/"}>see all</Link></div>
        <div className={styles.topics_list}>
          {trendingTopics && Object.entries(trendingTopics).map(([topic, value]) => {
            return <Link to={"/topic/" + topic} key={topic}>
              {topic}<span className={styles.topic_notification}>{value >= 100? "99+": value}</span>
            </Link>
          })}
        </div>
      </div>
    </div>
  )
}
