import {Link, useParams, useSearchParams} from "react-router-dom";
import { PostCard } from "../../components/PostCard/PostCard"
import styles from "./Topic.module.css"
import React, {useContext, useEffect, useState} from "react";
import {getPostByTopic} from "../../utils";
import {AppContext} from "../../contexts/AppContext";
import {FaChevronDown} from "react-icons/fa";
import {Skeleton} from "@mui/material";
export default function Topic({setLoginWarning, setShowBurgerMenu}) {
  let { topic } = useParams();
  const [searchParams] = useSearchParams();

  document.title = "Goldit" + (topic?" - " + topic:"")
  if (!topic) topic = "all"
  const { user } = useContext(AppContext)
  const [posts, setPosts] = useState(null);
  const [showSortFilterArg, setShowSortFilterArg] = useState(false);
  const filters = ["hot", "new", "top"]
  const dayFilters = ["day", "week", "month", "all"]
  const sortFilter = searchParams.get("sort")===null?"hot":searchParams.get("sort");
  const sortFilterArg = searchParams.get("t")===null?"day":searchParams.get("t");

  useEffect(() => {
    setPosts(null);
    setShowSortFilterArg(false);
    (async () => {
        setPosts(await getPostByTopic(topic, sortFilter, sortFilterArg))
    })();
  }, [setPosts, topic, user, sortFilter, sortFilterArg]);

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
      {posts ? posts.map((post) => {
        return (<PostCard key={post.id} id={post.id} title={post.title} content={post.contents} topics={post.topics} author={post.author}
                          time={post.createdAt} link={post.link} score={post.score} vote={post.vote} linkable={true}
                          setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/>);
      }) :
        [...Array(10)].map((value, index) => {
          return <Skeleton key={index} variant="rectangular" height={100} sx={{"margin": "10px 20px 20px 20px", "borderRadius": "5px"}}/>
        })
      }
    </div>
  );
}
