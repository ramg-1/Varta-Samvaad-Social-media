import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery , useQueryClient , useMutation } from '@tanstack/react-query';
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";



const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const {currentUser}=useContext(AuthContext);

  const fetchLikes = async () => {
    const response = await makeRequest.get("/likes?postid="+post.id);
    return response.data; 
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['likes',post.id],
    queryFn: fetchLikes
  });

  const fetchComments = async () => {
    const response = await makeRequest.get("/comments?postid=" + post.id);
    return response.data.rows; 
  };
  
  const { isLoading: commentsLoading, error: commentsError, data: comments } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: fetchComments,
  });
  
  

    const QueryClient = useQueryClient();

    const newPost = async (liked) => {
      if(liked)
      { return makeRequest.delete("/likes?postid="+post.id);}
      return makeRequest.post("/likes",{postid:post.id});
     
    };
    
  
      // Use useMutation hook
      const mutation = useMutation({
        mutationFn: newPost,
        onSuccess: () => {
             QueryClient.invalidateQueries(["likes"])
        },
        onError: (error) => {
          console.error('Error :', error);
        },
      });

      const newDelete = async (postid) => {
      
        return makeRequest.delete("/posts/"+postid);
       
      };
      
    
        // Use useMutation hook
        const deleteMutation = useMutation({
          mutationFn: newDelete,
          onSuccess: () => {
               QueryClient.invalidateQueries(["posts"])
          },
          onError: (error) => {
            console.error('Error :', error);
          },
        });

    const handleLike = ()=>{
      mutation.mutate(data.includes(currentUser.id));

    }

    const handleDelete = ()=>{
         deleteMutation.mutate(post.id);
    }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={'/upload/'+post.profilepic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userid}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.created_at).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={()=>setMenuOpen(!menuOpen)}/>
            { menuOpen && post.userid === currentUser.id && <button onClick={handleDelete}>delete</button>}
          
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img src={"./upload/"+post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
          { isLoading ? ("Loading...") :  data&&data.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{color:"red"} } onClick={handleLike} /> : <FavoriteBorderOutlinedIcon onClick={handleLike}/>}
            {data&&data.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {comments && comments.length} 
            Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postid={post.id}/>}
      </div>
    </div>
  );
};

export default Post;
