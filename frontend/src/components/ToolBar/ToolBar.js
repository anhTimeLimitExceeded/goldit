import styles from "./ToolBar.module.css";
import React, {useContext, useState} from "react";
import {Autocomplete, Dialog, Paper, Popper, TextField, Tooltip} from "@mui/material";
import {AppContext} from "../../contexts/AppContext";
import {signIn, signOut} from "../../firebase";
import {FaSignOutAlt} from "react-icons/fa";
import {createPost} from "../../utils";
import {useNavigate} from "react-router-dom";
export default function ToolBar({loginWarning, setLoginWarning}) {

  const {user, topics} = useContext(AppContext)
  const [postPopup, setPostPopup] = useState(false)
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTopics, setPostTopics] = useState([]);
  const [titleWarning, setTitleWarning] = useState(false)
  const [contentWarning, setContentWarning] = useState(false)
  const [topicsWarning, setTopicsWarning] = useState(false)

  const [newTopicPopup, setNewTopicPopup] = useState(false)
  const [newTopic, setNewTopic] = useState("");
  const [newTopicReason, setNewTopicReason] = useState("");
  const [newTopicWarning, setNewTopicWarning] = useState(false)
  const navigate = useNavigate();

  const createPostRequest = () => {
    setTitleWarning(postTitle.length === 0)
    setContentWarning(postContent.length === 0)
    setTopicsWarning(postTopics.length === 0)
    if (postTitle.length === 0 || postContent.length === 0 || postTopics.length === 0) return;
    createPost({
      title: postTitle,
      contents: postContent,
      topics: postTopics
    }).then(r => {
      if (r == null) {
        console.log("err")
      } else {
        setPostPopup(false);
        navigate("/post/" + r);
      }
    })
  }

  const PaperMy = function (props) {
    return (<Paper {...props} sx={{
      "& .MuiAutocomplete-listbox": {backgroundColor: "lightgray"},
      "& .MuiAutocomplete-listbox .MuiAutocomplete-option[aria-selected='true']" : {backgroundColor: "rgb(255,200,0)"},
      "& .MuiAutocomplete-option.Mui-focused": {backgroundColor: "rgb(255,200,0)"},
    }} />)
  }

  const PopperMy = function (props) {
    return (<Popper {...props} placement="top" modifiers={[{name: 'flip', enabled: false,}]}/>)
  }

  return (
    <div className={styles.toolbar}>
      {user?
        <div className={styles.toolbar_user_info}>
          Hi,&nbsp;<b>{user.displayName.substr(0, user.displayName.indexOf(" "))}</b>
          <div className={styles.toolbar_sign_out}>
            <FaSignOutAlt onClick={signOut}/>
          </div>
        </div>
        :<Tooltip open={loginWarning} title="You must login first!" placement="top">
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
      <Dialog open={postPopup} onClose={() => setPostPopup(false)} fullWidth
        PaperProps={{style: {backgroundColor: "white", borderRadius: 10, maxWidth: "800px"}}}>
        <div className={styles.post_popup}>
          <input placeholder="Title" type="text" value={postTitle} className={`${titleWarning && styles.warning} ${styles.post_pupup_title}`}
            onChange={(e) => setPostTitle(e.target.value)} onFocus={() => setTitleWarning(false)}/>
          <textarea placeholder="Content" value={postContent} className={`${contentWarning && styles.warning} ${styles.post_pupup_content}`} rows="8"
            onChange={(e) => setPostContent(e.target.value)} onFocus={() => setContentWarning(false)}/>
          <div className={styles.post_pupup_topics_and_submit}>
            <div className={styles.post_pupup_topics}>
              <h4 style={{"margin-top":"0"}}>Topics: </h4>
              {topics && (<Autocomplete
                className={`${topicsWarning && styles.warning} ${styles.post_topics_input}`}
                fullWidth
                multiple
                id="size-small-outlined-multi"
                size="small"
                options={topics}
                renderInput={(params) => (<TextField {...params} helperText="Select up to 3 topics"/>)}
                getOptionDisabled={() => postTopics.length >= 3}
                onChange={(e, value) => {setPostTopics(value)}}
                onFocus={() => setTopicsWarning(false)}
                PaperComponent={PaperMy}
                PopperComponent={PopperMy}
                sx = {{
                  "& .MuiAutocomplete-tag" : {backgroundColor:"rgb(255,200,0)"},
                  "& .MuiChip-deleteIcon" : {color: "dimgray"},
                  "& .MuiChip-deleteIcon:hover" : {color: "gray"},
                  "& .MuiOutlinedInput-root": {borderRadius: "10px"},
                  "& .MuiOutlinedInput-root fieldset": {borderWidth: "2px", borderColor: 'gray'},
                  "& .MuiOutlinedInput-root:hover fieldset": {borderColor: 'gray'},
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {borderColor: "rgb(255,200,0)", borderRadius: "10px"},
                  "& label.Mui-focused": {color: "gray"},
                  "& .MuiChip-label": {fontWeight: "600"},
                }}
              />)}
            </div>
            <button className={styles.post_submit_button} onClick={createPostRequest}>
              Create post</button>
          </div>
          <button className={styles.post_submit_button_mobile} onClick={createPostRequest}>
            Create post</button>
        </div>
      </Dialog>
      <Dialog open={newTopicPopup} onClose={() => setNewTopicPopup(false)} fullWidth
              PaperProps={{style: {backgroundColor: "white", borderRadius: 10, maxWidth: "600px"}}}>
        <div className={styles.post_popup}>
          <input placeholder="Topic name" type="text" value={newTopic} className={`${titleWarning && styles.warning} ${styles.post_pupup_title}`}
                 onChange={(e) => setNewTopic(e.target.value)} onFocus={() => setTitleWarning(false)}/>
          <textarea placeholder="Reason (optional)" value={newTopicReason} className={styles.post_pupup_content} rows="3"
                    onChange={(e) => setNewTopicReason(e.target.value)}/>
          <div className={styles.post_pupup_topics_and_submit}>
            <button className={styles.post_submit_button}>
              Submit request</button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
