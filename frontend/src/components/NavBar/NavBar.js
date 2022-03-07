import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../images/logo-light-new.png";
import {AppContext} from "../../contexts/AppContext";
import {GiHamburgerMenu} from "react-icons/gi";

export const NavBar = ({active, setShowBurgerMenu}) => {

  const { topics } = useContext(AppContext)

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <img src={logo} alt="" className={styles.logo}/>
      </Link>
      <ul className={styles.navbar_topics}>
        {topics && topics.map((topic) => {
          return (
            <li key={topic} className={`${styles.navbar_topic} ${topic===active ? styles.navbar_topic_active : ""}`}>
              <Link to={"/topic/" + topic}>{topic}</Link>
            </li>
          )
        })}
      </ul>
      <GiHamburgerMenu size={"2em"} style={{"margin":"auto 10px"}} onClick={() => setShowBurgerMenu(true)}
                       className={styles.burger_menu}/>
    </nav>
  );
}