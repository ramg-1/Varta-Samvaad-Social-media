import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useQuery , useMutation , useQueryClient} from '@tanstack/react-query';
import moment from "moment";

const Comments = ({postid }) => {

     const [ description , setDescription ]=useState("");
   
  const { currentUser } = useContext(AuthContext);

  const fetchComments = async () => {
    const response = await makeRequest.get("/comments?postid="+postid);
    return response.data.rows; 
  };
    
  const { isLoading, error, data } = useQuery({
    queryKey: ['comments',postid],
    queryFn: fetchComments
  });

  const QueryClient = useQueryClient();

  const newComment = async (desc) => {
    return makeRequest.post("/comments",desc);
  };
  

    // Use useMutation hook
    const mutation = useMutation({
      mutationFn: newComment,
      onSuccess: () => {
           QueryClient.invalidateQueries(["comments",postid])
      },
      onError: (error) => {
        console.error('Error :', error);
      },
    });

const handleClick = async (e)=>{
   e.preventDefault();
  
   mutation.mutate({description , postid});
   setDescription("");
  
};
 
  return (
    <div className="comments">
      <div className="write">
        <img src={'/upload/'+currentUser.profilepic} alt="" />
        <input type="text" placeholder="write a comment" value = {description} onChange={(e)=>setDescription(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? " Loading ...": data.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={'/upload/'+comment.profilepic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.description}</p>
          </div>
          <span className="date">{moment(comment.created_at).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
