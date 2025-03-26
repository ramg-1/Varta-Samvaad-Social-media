import {db} from '../connect.js';
import jwt from 'jsonwebtoken';

export const getComments = (req,res)=>{
   

      const q = `SELECT c.*, u.id AS userId, u.name, u.profilepic FROM comments AS c JOIN "user" AS u ON (u.id = c.userid)
       WHERE c.postid = $1
      ORDER BY  c.created_at DESC`;
      db.query(q,[req.query.postid] ,(err,data)=>{
          if(err) return res.status(500).json(err);
          return res.status(200).json(data);
      });
           
}

export const addComment = (req,res)=>{
    
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in !");

             jwt.verify(token ,"secretkey", (err,userInfo)=>{
                   if(err) return res.status(403).json("Token is not valid!");  

      const q = "INSERT INTO comments (description , userid , postid) VALUES ($1 , $2 , $3 )";
      const values = [
           req.body.description,
           userInfo.id,
           req.body.postid

      ]
          console.log(userInfo);
      db.query(q,values ,(err,data)=>{
          if(err) return res.status(500).json(err);
          return res.status(200).json('Post has been created');
      });
             });

}