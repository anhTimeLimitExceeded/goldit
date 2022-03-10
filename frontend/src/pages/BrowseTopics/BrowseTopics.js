import React, {useContext} from "react";
import {AppContext} from "../../contexts/AppContext";
import {Link} from "react-router-dom";
import styles from "./BrowseTopics.module.css"

export default function BrowseTopics() {
  const {topics} = useContext(AppContext)
  if (!topics) return null;
  const rows = Math.floor(topics.length / 3) + 1;
  return (
    <div className={styles.container}>
      <div className={styles.header}>All topics:</div>
      {topics && [...Array(rows)].map((value, rIndex) => {
        return <div className={styles.row_container} key={rIndex}>
          {[...Array(3)].map((value, cIndex) => {
            const topic = topics[rIndex * 3 + cIndex];
            return <div className={styles.item_container} key={cIndex}><Link to={"/topic/" + topic} key={topic}>{topic}</Link></div>
          })}
        </div>
      })}
    </div>
  );
}
