import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useQuery, useMutation , useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update.jsx";

const Profile = () => {
    
  const [openUpdate , setOpenUpdate] = useState(false);
    const {currentUser } = useContext(AuthContext);

   const userid = useLocation().pathname.split("/")[2]; 
   console.log('userid in profile = '+ userid);
  const fetchUser = async () => {
    const response = await makeRequest.get("/users/find/"+userid);
    return response.data; 
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['user', userid],
    queryFn: fetchUser
  });

  const fetchRelation = async () => {
    try {
      const response = await makeRequest.get(`/relationships?followeduserid=` + userid);
     
      return response.data;
    } catch (error) {
      console.error("Error fetching relationships:", error);
    }
  };
  
    const {isLoading : rIsLoading, data: relationshipData } = useQuery({
      queryKey: ['relationship'],
      queryFn: fetchRelation
    });

    const QueryClient = useQueryClient();

    const newPost = async (following) => {
      if(following)
      { return makeRequest.delete("/relationships?userid="+userid);}
      return makeRequest.post("/relationships",{userid});
     
    };
    
  
      // Use useMutation hook
      const mutation = useMutation({
        mutationFn: newPost,
        onSuccess: () => {
             QueryClient.invalidateQueries(["relationship"])
        },
        onError: (error) => {
          console.error('Error :', error);
        },
      });

    const handleFollow = ()=>{
      mutation.mutate(relationshipData.includes(currentUser.id));

    }



  return (
    <div className="profile">
      {isLoading ? "Loading..." :  <> <div className="images">
        <img
          src={"/upload/"+data.coverpic}
          alt=""
          className="cover"
        />
        <img
          src={"/upload/"+ data.profilepic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data && data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data && data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data && data.website}</span>
              </div>
            </div>
            { rIsLoading ? ("loading") : Number(userid) === currentUser.id ? (<button onClick={()=>setOpenUpdate(true)}>Update</button>) :  (
            <button onClick={handleFollow}>{relationshipData.includes(currentUser.id) ? "Following": "Follow"}</button>)}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts userid = {userid}/>
      </div> </>}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  );
};

export default Profile;
