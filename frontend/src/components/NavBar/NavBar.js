import React from 'react';
import {Link} from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../images/logo-light-new.png";
import {GiHamburgerMenu} from "react-icons/gi";
import {InputAdornment, TextField} from "@mui/material";
import {BsSearch} from "react-icons/bs";

export const NavBar = ({setShowBurgerMenu}) => {

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <img src={logo} alt="" className={styles.logo}/>
      </Link>
      <TextField
        className={styles.search_box}
        id="outlined-adornment-amount"
        placeholder="Search a topic or a post"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BsSearch/>
            </InputAdornment>
          ),
        }}
        sx = {{
          "& .MuiOutlinedInput-root": {borderColor: "rgb(255,200,0)", borderRadius: "10px"},
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {borderColor: "rgb(255,200,0)", borderRadius: "10px"},
        }}
      />
      <GiHamburgerMenu size={"2\em"} style={{"margin":"auto 10px"}} onClick={() => setShowBurgerMenu(true)}
                       className={styles.burger_menu}/>
    </nav>
  );
}
