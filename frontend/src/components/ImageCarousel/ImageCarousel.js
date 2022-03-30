import styles from "./ImageCarousel.module.css"
import {useState} from "react";

export const ImageCarousel = ({images}) => {

  const [active, setActive] = useState(0)

  return <div className={styles.carousel_wrapper}>
    <div className={styles.carousel}>
      {images.map((image, index) => {
        return <img className={`${styles.carousel_photo} 
        ${index === active-1 && styles.carousel_photo_prev}
        ${index === active && styles.carousel_photo_active}
        ${index === active+1 && styles.carousel_photo_next}`} src={image} key={index} alt={index}/>
      })}
      <div className={styles.carousel_counter}>{active+1}/{images.length}</div>
      {active > 0 && <div className={styles.carousel_button_prev} onClick={() => setActive(active-1)}/>}
      {active < images.length-1 && <div className={styles.carousel_button_next} onClick={() => setActive(active+1)}/>}
    </div>
  </div>
}
