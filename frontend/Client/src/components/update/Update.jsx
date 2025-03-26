import { useScrollTrigger } from "@mui/material";
import "./update.scss";
import { useState } from "react";
import { useMutation , useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Update = ({setOpenUpdate , user })=>{
   const [cover,setCover] = useState(null);
   const [profile,setProfile]=useState(null);
    const [texts , setTexts] = useState({
        name:"",
        city:"",
        website:""
    });
    
  const upload = async (file)=>{
    try{
         const formData = new FormData();
         formData.append("file",file);
         const res = await makeRequest.post("/upload", formData);
         return res.data;

    }  catch(err){
        console.log(err);
    }
 }

    
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };


    const queryClient = useQueryClient();

    const newPost = async (user) => {
      return makeRequest.put("/users",user);
    };
    
  
      // Use useMutation hook
      const mutation = useMutation({
        mutationFn: newPost,
        onSuccess: () => {
             queryClient.invalidateQueries(["user"])
        },
        onError: (error) => {
          console.error('Error :', error);
        },
      });

  const handleClick = async (e)=>{
     e.preventDefault();
     let coverUrl = user.coverpic ;
     let profileUrl = user.profilepic ;
    
     coverUrl=cover ? await upload(cover) : user.coverpic ;
     profileUrl=profile ? await upload(profile) : user.profilepic;

     mutation.mutate({...texts , coverpic:coverUrl , profilepic:profileUrl});
     setOpenUpdate(false);
  };

    return (<div className="update">
        Update
        <form>
            <input type="file" onChange={e=>setCover(e.target.files[0])}></input>
            <input type="file" onChange={e=>setProfile(e.target.files[0])}></input>
            <input type="text" name="name" onChange={handleChange}></input>
            <input type="text" name="city" onChange={handleChange}></input>
            <input type="text" name="website" onChange={handleChange}></input>
            <button onClick={handleClick}>Update</button>
        </form>
        <button onClick={()=>setOpenUpdate(false)}>X</button>
        </div>);
}

export default Update;