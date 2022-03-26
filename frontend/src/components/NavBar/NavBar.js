import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../images/logo-light-new.png";
import {GiHamburgerMenu} from "react-icons/gi";
import {
  CircularProgress,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField
} from "@mui/material";
import {BsSearch} from "react-icons/bs";
import {getSearchResults} from "../../utils";

export const NavBar = ({setShowBurgerMenu}) => {

  const [openSearch, setOpenSearch] = useState(false);
  const [windowSize, setWindowSize] = useState({width: undefined, height: undefined});
  const [searchDelay, setSearchDelay] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const searchBox = useRef(null)
  const searchDropdown = useRef(null)
  const navigate = useNavigate()

  const sendSearchRequest = (query) => {
    if (!query || query.length === 0) return;
    setSearching(true);
    setSearchResults(null);
    clearTimeout(searchDelay);
    setSearchDelay(setTimeout(async () => {
      setSearchResults(await getSearchResults(query));
      setSearching(false);
    }, 2000))
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBox.current && !searchBox.current.contains(event.target)
      && searchDropdown.current && !searchDropdown.current.contains(event.target)) setOpenSearch(false)
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener('resize', () => setWindowSize({width: window.innerWidth, height: window.innerHeight}));
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('resize', () => setWindowSize({width: window.innerWidth, height: window.innerHeight}));
    }
  }, [searchBox, setOpenSearch]);

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <img src={logo} alt="" className={styles.logo}/>
      </Link>
      <div className={styles.search_box}>
        <TextField
          ref={searchBox}
          onClick={() => setOpenSearch(true)}
          onChange={(e) => sendSearchRequest(e.target.value)}
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
            width: "100%",
            "& .MuiOutlinedInput-root": {borderColor: "rgb(255,200,0)", borderRadius: "10px"},
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {borderColor: "rgb(255,200,0)", borderRadius: "10px"},
          }}/>
        {searchBox.current && openSearch &&
        <Paper elevation={4} key={windowSize} style={{"position":"fixed"}} sx={{width: searchBox.current.offsetWidth}}
               ref={searchDropdown}>
          {searching && <div style={{"display":"flex", "justifyContent":"center", "padding":"20px"}}>
            <CircularProgress sx={{"color": "rgb(255,200,0)"}} thickness={6}/>
          </div>}
          {searchResults &&
            <List>
              {searchResults.map(searchResult => {
                return (<ListItem key={searchResult.id} className={styles.search_result}
                                  onClick={() => {setOpenSearch(false); navigate("/post/" + searchResult.link)}}>
                  <div>
                    <div><b>{searchResult.title}</b></div>
                    <div>{searchResult.contents}</div>
                  </div>
                  </ListItem>)})}
            </List>}
        </Paper>}
      </div>

      <div>
        <GiHamburgerMenu onClick={() => setShowBurgerMenu(true)} className={styles.burger_menu}/>
      </div>

    </nav>
  );
}
