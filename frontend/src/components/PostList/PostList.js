import {Skeleton} from "@mui/material";
import {PostCard} from "../PostCard/PostCard";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../contexts/AppContext";
import {getPostByTopic} from "../../utils";

export default function PostList({setLoginWarning, setShowBurgerMenu, topic, sortFilter, sortFilterArg}) {

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(AppContext)
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useState(
  {
    "topic": topic,
    "sortFilter": sortFilter,
    "sortFilterArg": sortFilterArg,
    "page": 0,
  })

  const observer = useRef(null);
  const lastPostRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSearchParams(p => {
            return {...p, "page": p["page"] + 1}
          })
        }
      });
      if (node) observer.current.observe(node);
    }, [isLoading, hasMore]
  );

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setSearchParams({
      "topic": topic,
      "sortFilter": sortFilter,
      "sortFilterArg": sortFilterArg,
      "page": 0,
    })
  }, [topic, sortFilter, sortFilterArg])

  useEffect(() => {
    if (isLoading) return;
    setIsLoading(true);
    (async () => {
      const nextPosts = await getPostByTopic(searchParams["topic"], searchParams["sortFilter"], searchParams["sortFilterArg"], searchParams["page"]);
      setPosts(p => [...p, ...nextPosts]);
      return nextPosts;
    })().then((nextPosts) => {
      setIsLoading(false);
      setHasMore(nextPosts.length > 0);
    });
  }, [setPosts, JSON.stringify(searchParams)]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const nextPosts = await getPostByTopic(searchParams["topic"], searchParams["sortFilter"], searchParams["sortFilterArg"], 0);
      setPosts(nextPosts);
      return nextPosts;
    })().then((nextPosts) => {
      setIsLoading(false);
      setHasMore(nextPosts.length > 0);
    });
  }, [setPosts, user]);

  return <div>
    {posts.length === 0 ?
      [...Array(10)].map((value, index) => {
        return <Skeleton key={index} variant="rectangular" height={100} sx={{"margin": "10px 20px 20px 20px", "borderRadius": "5px"}}/>
      })
      :
      posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <div ref={lastPostRef} key={post.id}> <PostCard id={post.id} title={post.title} content={post.contents} images={post.images}
                                                            topics={post.topics} author={post.author} time={post.createdAt} link={post.link} score={post.score}
                                                            vote={post.vote} commentCount={post.commentCount} linkable={true}
                                                            setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/> </div>);
        } else {
          return (<div key={post.id}> <PostCard key={post.id} id={post.id} title={post.title} content={post.contents} images={post.images}
                                                topics={post.topics} author={post.author} time={post.createdAt} link={post.link} score={post.score}
                                                vote={post.vote} commentCount={post.commentCount} linkable={true}
                                                setLoginWarning={setLoginWarning} setShowBurgerMenu={setShowBurgerMenu}/> </div>);
        }})}
    <div>
      {hasMore && <Skeleton variant="rectangular" height={100} sx={{"margin": "10px 20px 20px 20px", "borderRadius": "5px"}}/>}
    </div>
  </div>
}