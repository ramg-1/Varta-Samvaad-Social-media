import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser=(req,res)=>{
     const userid = req.params.userid;
     const q = 'SELECT * FROM "user" WHERE id = $1';


     db.query(q,[userid],(err,data)=>{
               if(err) return res.status(500).json(err);
                const {password , ...info} = data.rows[0];

                return res.json(info);
              
     });
        
};

export const updateUser=(req,res)=>{
     
       const token = req.cookies.accessToken;
       if(!token) return res.status(401).json("Not authenticated! "); 

       jwt.verify(token, "secretkey" , (err,userInfo)=>{
          if(err) return res.status(403).json("Token is not valid !");

          const q = `UPDATE "user" SET name = $1 , city=$2 , website = $3 ,profilepic = $4, coverpic = $5 WHERE id = $6  `;

          
          console.log('ProfilePic:', req.body.profilepic);
          console.log('CoverPic:', req.body.coverpic);
          

          db.query(q,[
               req.body.name[0],
               req.body.city[0],
               req.body.website[0],
               req.body.profilepic,
               req.body.coverpic,
               userInfo.id
          ],(err,data)=>{
                 if(err) res.status(500).json(err);
                 if(data.affectedRows > 0) return res.json('Updated!');
                 return res.status(403).json("You can update only on your post!");
          })

       })
        
};