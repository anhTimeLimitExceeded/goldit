import {Autocomplete, CircularProgress, Dialog, Paper, Popper, TextField} from "@mui/material";
import styles from "./PostSubmitForm.module.css";
import {BiImageAdd} from "react-icons/bi";
import {useContext, useState} from "react";
import { FileUploader } from "react-drag-drop-files";
import {AppContext} from "../../contexts/AppContext";
import {createPost, getBase64} from "../../utils";
import {useNavigate} from "react-router-dom";
import {IoMdCloseCircle} from "react-icons/io";

export default function PostSubmitForm({postPopup, setPostPopup}) {

  const {topics} = useContext(AppContext)
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTopics, setPostTopics] = useState([]);
  const [titleWarning, setTitleWarning] = useState(false)
  const [contentWarning, setContentWarning] = useState(false)
  const [topicsWarning, setTopicsWarning] = useState(false)
  const [creatingPost, setCreatingPost] = useState(false)

  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const PaperMy = function (props) {
    return (<Paper {...props} sx={{
      "& .MuiAutocomplete-listbox": {backgroundColor: "lightgray"},
      "& .MuiAutocomplete-listbox .MuiAutocomplete-option[aria-selected='true']" : {backgroundColor: "rgb(255,200,0)"},
      "& .MuiAutocomplete-option.Mui-focused": {backgroundColor: "rgb(255,200,0)"},
      "& .MuiAutocomplete-noOptions": {backgroundColor: "lightgray"},
    }} />)
  }

  const PopperMy = function (props) {
    return (<Popper {...props} placement="top" modifiers={[{name: 'flip', enabled: false,}]}/>)
  }

  const createPostRequest = async () => {
    setTitleWarning(postTitle.length === 0)
    setContentWarning(postContent.length === 0)
    setTopicsWarning(postTopics.length === 0)
    if (postTitle.length === 0 || postContent.length === 0 || postTopics.length === 0) return;
    setCreatingPost(true);
    const base64images = [];
    for (let i = 0; i < images.length; i++) {
      base64images.push(await getBase64(images[i]));
    }
    createPost({
      title: postTitle,
      contents: postContent,
      topics: postTopics,
      images: base64images,
    }).then(r => {
      if (r == null) {
        console.log("err")
      } else {
        setPostTitle("")
        setPostContent("")
        setPostTopics([])
        setCreatingPost(false);
        setPostPopup(false);
        navigate("/post/" + r);
      }
    })
  }

  const addImage = (addedImages) => {
    const newImages = [];
    for (let i = 0; i < addedImages.length; i++) {
      newImages.push(addedImages[i]);
    }
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  }


  return <Dialog open={postPopup} onClose={() => setPostPopup(false)} fullWidth
                  PaperProps={{style: {backgroundColor: "white", borderRadius: 10, maxWidth: "800px"}}}>
    {creatingPost? <div className={styles.posting_overlay}><CircularProgress size={100} sx={{"margin":"auto", "color": "rgb(255,200,0)"}} thickness={6}/></div>
    :<div className={styles.post_popup}>
      <input placeholder="Title" type="text" value={postTitle} className={`${titleWarning && styles.warning} ${styles.post_popup_title}`} maxLength="250"
             onChange={(e) => setPostTitle(e.target.value)} onFocus={() => setTitleWarning(false)}/>
      <textarea placeholder="Content" value={postContent} className={`${contentWarning && styles.warning} ${styles.post_popup_content}`} rows="8"
                onChange={(e) => setPostContent(e.target.value)} onFocus={() => setContentWarning(false)}/>
      <div className={styles.post_images}>
        {images && images.map((image, index) => {
          return (<div style={{"position" : "relative"}} key={index}>
            <img src={URL.createObjectURL(image)} alt={image.name} className={styles.post_image}/>
            <IoMdCloseCircle className={styles.post_remove_image} size={25}
                             onClick={() => removeImage(index)}/>
          </div>)
        })}
      </div>
      <FileUploader multiple={true} handleChange={addImage} name="images"
                    hoverTitle={" "} types={["JPEG", "PNG", "JPG"]}>
        <div className={styles.post_image_upload_box}>
          <BiImageAdd size={50}/> <span>Click or drop to upload images</span>
        </div>
      </FileUploader>
      <div className={styles.post_popup_topics_and_submit}>
        <div className={styles.post_popup_topics}>
          <h4 style={{"marginTop":"0"}}>Topics: </h4>
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
    }
  </Dialog>
}