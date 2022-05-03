import {Dialog} from "@mui/material";
import styles from "./ProfileEditForm.module.css";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext";
import {editUsername} from "../../utils";

export default function ProfileEditForm({newTopicPopup, setNewTopicPopup}) {

  const {user} = useContext(AppContext)
  const [titleWarning, setTitleWarning] = useState(false)
  const [newUsername, setNewUsername] = useState(null);
  const [existedWarning, setExistedWarning] = useState(false);

  useEffect(() => setNewUsername(user?.displayName), [user])

  const editUsernameRequest = () => {
    editUsername({"username": newUsername}).then(r => {
      if (r === "ok") window.location.reload();
      else if (r === "existed") setExistedWarning(true)
    })
  }

  if (!user) return <div/>
  return <Dialog open={newTopicPopup} onClose={() => setNewTopicPopup(false)} fullWidth
          PaperProps={{style: {backgroundColor: "white", borderRadius: 10, maxWidth: "600px"}}}>
    <div className={styles.post_popup}>
      <div>
        Email: <input disabled={true} type="text" value={user.email} className={styles.post_popup_title}/>
      </div>
      <div>
        Username: <input type="text" value={newUsername} className={`${titleWarning && styles.warning} ${styles.post_popup_title}`} maxLength={20}
             onChange={(e) => setNewUsername(e.target.value)} onFocus={() => setTitleWarning(false)}/>
        {existedWarning && <span style={{"color":"red", "fontWeight":"normal", "fontSize":"16px"}}> username existed</span>}
      </div>
      <div className={styles.post_popup_topics_and_submit}>
        <button className={styles.post_submit_button} onClick={editUsernameRequest}>
          Submit changes</button>
      </div>
    </div>
  </Dialog>
}