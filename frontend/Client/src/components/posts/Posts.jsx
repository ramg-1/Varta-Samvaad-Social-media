import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from '@tanstack/react-query';



const Posts = ({userid}) => {
    
  const fetchPosts = async () => {
    const response = await makeRequest.get("/posts?userid="+userid);
    return response.data.rows; 
  };
  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

    
        console.log( error);
       
        const uniquePosts = data ? [...new Map(data.map(post => [post.id, post])).values()] : [];

        return (
    <div className="posts">
      {uniquePosts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Posts;
