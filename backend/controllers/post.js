import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts=(req,res)=>{
    const userid = req.query.userid;
      const token = req.cookies.accessToken;
      if(!token) return res.status(401).json("Not logged in !");

               jwt.verify(token ,"secretkey", (err,userInfo)=>{
                     if(err) return res.status(403).json("Token is not valid!");  

                      

        const q = (userid!== 'undefined') ? `SELECT p.*, u.id AS userId, u.name, u.profilepic FROM posts AS p JOIN "user" AS u ON (u.id = p.userid) WHERE p.userid = $1  ORDER BY  p.created_at DESC`
        : `SELECT p.*, u.id AS userId, u.name, u.profilepic FROM posts AS p JOIN "user" AS u ON (u.id = p.userid) 
        LEFT JOIN relationships AS r ON (p.userid = r.followeduserid) where r.followeruserid=$1 or p.userid=$2
        ORDER BY  p.created_at DESC`;
            console.log(userInfo);
                  

           // const values = userid!== 'undefined' ? [userid] : [userInfo.id , userInfo.id];
            var values;
            if(userid === 'undefined') values = [userInfo.id , userInfo.id];
            else values = [userid];
         db.query(q, values ,(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
               });


}


export const addPost=(req,res)=>{
         
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in !");

             jwt.verify(token ,"secretkey", (err,userInfo)=>{
                   if(err) return res.status(403).json("Token is not valid!");  

      const q = "INSERT INTO posts (description , img, userid) VALUES ($1 , $2 , $3 )";
      const values = [
           req.body.description,
           req.body.img,
           userInfo.id

      ]
      db.query(q,values ,(err,data)=>{
          if(err) return res.status(500).json(err);
          return res.status(200).json('Post has been created');
      });
             });


}


export const deletePost=(req,res)=>{
         
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in !");

             jwt.verify(token ,"secretkey", (err,userInfo)=>{
                   if(err) return res.status(403).json("Token is not valid!");  

      const q = "DELETE FROM posts WHERE id = $1 AND userid = $2";
     
         
      db.query(q,[req.params.id , userInfo.id] ,(err,data)=>{
          if(err) return res.status(500).json(err);
          if(data.rowCount>0)
          return res.status(200).json('Post has been deleted');
        return res.status(403).json("you can delete only your post.")
      });
             });


}