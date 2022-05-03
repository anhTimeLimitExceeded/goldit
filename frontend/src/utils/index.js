import axios from "axios";
import Compress from "compress.js";
import {getIdToken} from "../firebase";
//API CALLS
axios.defaults.baseURL = 'https://twiki.csc.depauw.edu/goldit/api';

export const postAuthInfo = async () => {
  try {
    return (await axios.post("/auth", {},
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

export const editUsername = async (body) => {
  try {
    return (await axios.put("/user", body,
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

export const editPost = async (id, post) => {
  try {
    return (await axios.put("/post/" + id, post,
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

export const deletePost = async (id) => {
  try {
    return (await axios.delete("/post/" + id,
      {
        headers: {
          authorization: await getIdToken(),
        }
      })).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getPostComments = async (postId, sortFilter) => {
  try {
    return (await axios.get("/comment/" + postId + "?sort=" + sortFilter,
      {
        headers: {
          authorization: await getIdToken(),
        }
      })).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getPostByTopic = async (topic, filter, filterArg, page) => {
  page = page == null? 0 : page;
  try {
    return (await axios.get(`/topic/${topic}?sort=${filter}&t=${filterArg}&p=${page}`, {
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

export const getSearchResults = async (query) => {
  try {
    return (await axios.get("/search?q=" + query)).data;
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

export const getBase64 = async image => {
  const compress = new Compress()
  const compressImage = await compress.compress([image], {
    size: 1, // the max size in MB, defaults to 2MB
    quality: 0.75, // the quality of the image, max is 1,
    maxWidth: 1000, // the max width of the output image, defaults to 1920px
    maxHeight: 1000, // the max height of the output image, defaults to 1920px
    resize: true // defaults to true, set false if you do not want to resize the image width and height
  })
  return compressImage[0].prefix + compressImage[0].data;
};
