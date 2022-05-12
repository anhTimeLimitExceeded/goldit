import {Dialog} from "@mui/material";
import styles from "./TopicSubmitForm.module.css";
import {useState} from "react";
import {postNewTopic} from "../../utils";

export default function TopicSubmitForm({newTopicPopup, setNewTopicPopup}) {

  const [titleWarning, setTitleWarning] = useState(false)
  const [newTopic, setNewTopic] = useState("");
  const [newTopicReason, setNewTopicReason] = useState("");

  return <Dialog open={newTopicPopup} onClose={() => setNewTopicPopup(false)} fullWidth
          PaperProps={{style: {backgroundColor: "white", borderRadius: 10, maxWidth: "600px"}}}>
    <div className={styles.post_popup}>
      <input placeholder="Topic name" type="text" value={newTopic} className={`${titleWarning && styles.warning} ${styles.post_popup_title}`}
             onChange={(e) => setNewTopic(e.target.value)} onFocus={() => setTitleWarning(false)}/>
      <textarea placeholder="Reason (optional)" value={newTopicReason} className={styles.post_popup_content} rows="3"
                onChange={(e) => setNewTopicReason(e.target.value)}/>
      <div className={styles.post_popup_topics_and_submit}>
        <button className={styles.post_submit_button} onClick={() => {
          postNewTopic({"topic": newTopic, "reason": newTopicReason});
          setNewTopicPopup(false)
        }}>
          Submit request</button>
      </div>
    </div>
  </Dialog>
}