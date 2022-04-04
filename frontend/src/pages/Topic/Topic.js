import {Link, useParams, useSearchParams} from "react-router-dom";
import styles from "./Topic.module.css"
import React, {useState} from "react";
import {FaChevronDown} from "react-icons/fa";
import PostList from "../../components/PostList/PostList";
export default function Topic({setLoginWarning, setShowBurgerMenu}) {
  let { topic } = useParams();
  const [searchParams] = useSearchParams();

  document.title = "Goldit" + (topic?" - " + topic:"")
  if (!topic) topic = "all"
  const [showSortFilterArg, setShowSortFilterArg] = useState(false);

  const filters = ["hot", "new", "top"]
  const dayFilters = ["day", "week", "month", "all"]
  const sortFilter = searchParams.get("sort")===null?"hot":searchParams.get("sort");
  const sortFilterArg = searchParams.get("t")===null?"week":searchParams.get("t");

  return (
    <div>
      <div className={styles.topic_header}>
        <div className={styles.topic}>{topic}</div>
          <div className={styles.topic_filter}>
            {filters.map((filter) => {
              return <Link to={"/topic/" + topic + "?sort=" + filter} key={filter}
                           style={filter===sortFilter?{"backgroundColor":"rgb(255, 210, 0)"}:{}}>{filter}</Link>
            })}
            {sortFilter==="top" &&
            <div onClick={() => setShowSortFilterArg(true)} className={styles.sort_filter}>
              {sortFilterArg} <FaChevronDown size={"0.6em"}/>
              {showSortFilterArg &&
                <div className={styles.sort_filter_popup}>
                  {dayFilters.map((dayFilter) => {
                  return <Link to={"/topic/" + topic + "?sort=top&t=" + dayFilter} key={dayFilter}
                  style={dayFilter===sortFilterArg?{"fontWeight":"bold"}:{}}>{dayFilter}</Link>})}
                </div>}
            </div>}
            {showSortFilterArg && <div className={styles.sort_filter_popup_complement} onClick={() => setShowSortFilterArg(false)}/>}
          </div>
      </div>

      <PostList setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu} topic={topic} sortFilter={sortFilter} sortFilterArg={sortFilterArg}/>

    </div>
  );
}
