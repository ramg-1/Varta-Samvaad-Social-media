import {db} from '../connect.js';

export const getUser = (req,res) => {
    
      const name = req.params.name + '%';
    
    const q = `SELECT id , username ,profilepic FROM "user" WHERE username ILIKE $1 ;`;

    db.query(q, [name], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data);
    });

}