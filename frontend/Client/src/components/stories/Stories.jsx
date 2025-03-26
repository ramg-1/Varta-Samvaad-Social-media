import { useContext } from "react";
import "./stories.scss"
import { AuthContext } from "../../context/authContext"
import { makeRequest } from "../../axios";

import { useQuery } from '@tanstack/react-query';

const Stories = () => {

  const {currentUser} = useContext(AuthContext)

  //TEMPORARY

  // const fetchStories = async () => {
  //   const response = await makeRequest.get("/posts?userid="+userid);
  //   return response.data.rows; 
  // };
  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['stories'],
  //   queryFn: fetchStories
  // });

  const stories = [
    {
      id: 1,
      name: "Kong",
      img: "https://www.pixelstalk.net/wp-content/uploads/2016/08/Best-Free-Photos-HD-Nature-Pictures.jpg",
    },
    {
      id: 2,
      name: "Devil",
      img: "https://www.pixelstalk.net/wp-content/uploads/2016/08/Best-Free-Photos-HD-Nature-Pictures.jpg",
    },
   
  ];

  return (
    <div className="stories">
      <div className="story">
          <img src={'/upload/'+currentUser.profilepic} alt="" />
          <span>{currentUser.name}</span>
          <button>+</button>
        </div>
      {stories.map(story=>(
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Stories