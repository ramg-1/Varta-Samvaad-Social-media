import {db} from '../connect.js';
import jwt from 'jsonwebtoken';

export const getLikes = (req,res)=>{

  

      const q = "SELECT userid FROM likes WHERE postid = $1";
     
          
      db.query(q,[req.query.postid] ,(err,data)=>{
          if(err) return res.status(500).json(err);
        
          return res.status(200).json(data.rows.map(like=>like.userid));
      });
            

}

export const addLike = (req,res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in !");

             jwt.verify(token ,"secretkey", (err,userInfo)=>{
                   if(err) return res.status(403).json("Token is not valid!");  

      const q = "INSERT INTO likes (userid , postid) VALUES ($1 , $2)";
      const values = [
           userInfo.id,
           req.body.postid

      ]
          console.log(userInfo);
      db.query(q,values ,(err,data)=>{
          if(err) return res.status(500).json(err);
          return res.status(200).json('post has been liked');
      });
             });
}


export const deleteLike = (req,res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in !");

             jwt.verify(token ,"secretkey", (err,userInfo)=>{
                   if(err) return res.status(403).json("Token is not valid!");  

      const q = "DELETE FROM likes WHERE userid = $1 and postid = $2";
    //   const values = [
    //        userInfo.id,
    //        req.body.postid

    //   ]
          console.log(userInfo);
      db.query(q,[userInfo.id , req.query.postid] ,(err,data)=>{
          if(err) return res.status(500).json(err);
          return res.status(200).json('like has been removed');
      });
             });
}