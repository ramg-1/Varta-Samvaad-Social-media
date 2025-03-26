import {db} from '../connect.js';
import jwt from 'jsonwebtoken';

export const getRelationships = (req,res)=>{

  
      console.log("getrelations is working");
      const q = "SELECT followeruserid FROM relationships WHERE followeduserid = $1";
      console.log("querying in relationship to get ids");
          
      db.query(q,[req.query.followeduserid] ,(err,data)=>{
          if(err) return res.status(500).json(err);
          console.log("db.query is running");
          return res.status(200).json(data.rows.map(relationship=>relationship.followeruserid));
      });  
            

}

export const addRelationship = (req,res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in !");

             jwt.verify(token ,"secretkey", (err,userInfo)=>{
                   if(err) return res.status(403).json("Token is not valid!");  

      const q = "INSERT INTO relationships (followeruserid , followeduserid) VALUES ($1 , $2)";
      const values = [
           userInfo.id,
           req.body.userid

      ]
          console.log(userInfo);
      db.query(q,values ,(err,data)=>{
          if(err) return res.status(500).json(err);
          return res.status(200).json('Following');
      });
             });
}


export const deleteRelationship = (req,res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in !");

             jwt.verify(token ,"secretkey", (err,userInfo)=>{
                   if(err) return res.status(403).json("Token is not valid!");  

      const q = "DELETE FROM relationships WHERE followeruserid = $1 and followeduserid = $2";
    //   const values = [
    //        userInfo.id,
    //        req.body.postid

    //   ]
          console.log(userInfo);
      db.query(q,[userInfo.id , req.query.userid] ,(err,data)=>{
          if(err) return res.status(500).json(err);
          return res.status(200).json('Unfollowed');
      });
             });
}