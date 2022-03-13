import axios from "axios";
import {getIdToken} from "../firebase";
//API CALLS
axios.defaults.baseURL = 'https://twiki.csc.depauw.edu/goldit/api';

export const postAuthInfo = async () => {
  try {
    await axios.post("/auth", {},
      {
        headers: {
          authorization: await getIdToken(),
        },
      }
    );
  } catch (e) {
    console.warn(e);
  }
};

export const createPost = async (post) => {
  try {
    return (await axios.post("/post", post,
      {
        headers: {
          authorization: await getIdToken(),
        },
      }
    )).data;
  } catch (e) {
    console.warn(e);
  }
};

export const createComment = async (comment) => {
  try {
    return (await axios.post("/comment", comment,
      {
        headers: {
          authorization: await getIdToken(),
        },
      }
    )).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getPost = async (id, title) => {
  try {
    return (await axios.get("/post/" + id + "/" + title,
      {
        headers: {
          authorization: await getIdToken(),
        }
      })).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getPostComments = async (postId) => {
  try {
    return (await axios.get("/comment/" + postId,
      {
        headers: {
          authorization: await getIdToken(),
        }
      })).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getPostByTopic = async (topic, filter, filterArg) => {
  try {
    return (await axios.get(`/topic/${topic}?sort=${filter}&t=${filterArg}`, {
      headers: {
        authorization: await getIdToken(),
      }
    })).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getTopics = async () => {
  try {
    return (await axios.get("/topics")).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getTrendingTopics = async () => {
  try {
    return (await axios.get("/topics/trending")).data;
  } catch (e) {
    console.warn(e);
  }
};

export const postVote = async (postId, type) => {
  try {
    await axios.post("/vote", {
        postId : postId,
        type : type,
      },
      {
        headers: {
          authorization: await getIdToken(),
        },
      }
    );
  } catch (e) {
    console.warn(e);
  }
};

//UTILS FUNCTIONS
export const getDisplayTime = (time) => {
  const date = new Date(time)
  const today = new Date()
  if (date.getDate() === today.getDate()) {
    const diffHours = today.getHours() - date.getHours();
    if (diffHours < 1) {
      const diffMinutes = today.getMinutes() - date.getMinutes();
      return (diffMinutes < 5)? "just now" : diffMinutes + " minute" + (diffMinutes===1?"":"s") + " ago"
    } else {
      return diffHours + " hour" + (diffHours===1?"":"s") + " ago"
    }
  } else {
    return "on " + date.toLocaleDateString();
  }
}