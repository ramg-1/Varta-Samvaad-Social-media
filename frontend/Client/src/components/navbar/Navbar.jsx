import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [profileClick , setProfileClick] = useState(false);
  const [suggestionList , setSuggestionList] = useState(false);
  const [userList , setUserList] = useState([]);
  const navigate = useNavigate();


  const handleProfileClick=()=>{
       setProfileClick(!profileClick);
      //  alert(profileClick);
  }
  const handleLogout= async()=>{
    try{
      const response = await axios.post("http://localhost:8800/api/auth/logout", {}, { withCredentials: true });
      console.log(response.data);
      navigate("/login");
    } catch(error) {
      console.log(error); 
    }
     
  }

    const handleSearch = async(e)=>{
        try{
             const name = e.target.value;
            setSuggestionList(true);
              if(name){
                const result = await axios.get(`http://localhost:8800/api/search/${name}`);
                console.log(JSON.stringify(result.data.rows));
                setUserList(result.data.rows);
                }
                else {
                   setSuggestionList(false);
                  console.log('name is empty');
                }
        }
        catch(error){
           console.log(error);
        }
    }

    const handleUser=(id)=>{
           navigate(`/profile/${id}`);
           setSuggestionList(false);
         
    }

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Social sphere</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search-container">
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." onChange={handleSearch} />
        </div>
        {suggestionList ? <div className="suggestion-list">
               {userList.length>0  ? <div className="user-list">
                     {
                        userList.map((user)=>(
                          <div key = {user.id} className="user-container" onClick={()=>handleUser(user.id)}>
                               <img src={'/upload/'+ user.profilepic} alt="" ></img>
                              <div >{user.username}</div>
                          </div>
                        ))
                     }
               </div> 
                :<div>Not Found!!</div>}            
          </div>: <div></div>}
          </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img onClick={handleProfileClick}
            src={'/upload/'+currentUser.profilepic}
            alt=""
          />
          <span>{currentUser.name}</span> 
            { profileClick ? <button id="profileBox" onClick = {handleLogout}> Log out </button> : <div></div>} 
        </div>
      </div>
    </div>
  );
};

export default Navbar;
