const express = require('express');
const router = express.Router();

router.post('/', async (rq, rs)=>{
    const db = rq.app.locals.db
    const { name, email, pass } = rq.body;
    const sql = "INSERT INTO `users` (name, email, pass) VALUES ('"+name+"', '"+email+"', '"+pass+"')";
    const sqlForCheck = "SELECT * FROM `users` where `email` = '"+email+"'";
    try {
        db.query(sqlForCheck, (err, result)=>{
            if(err) {
                throw err
            }
    
            if(result.length > 0){
                rs.send({response: 'already have an account'});
            }else{
                db.query(sql, (er, insertQueryRes) =>{
                    if(er) throw er;
                    
                    rs.json({uid: insertQueryRes.insertId})
                })
            }
        })
    } catch (error) {
        console.log(error);
        throw error
    }
    // try {
    //     // check if email already exist or not
    //     let existedUsr = await USChema.findOne({ email: email });
    //     if(existedUsr){
    //         return rs.send('exist');
    //     }
    //     // if email not exist then create new user
    //     let usr = new USChema({name: name, email: email, pass: pass});
    //     usr.save().then((doc)=>{
    //         rs.json({uid: doc._id})
    //     }).catch((err)=>{
    //         console.log(err)
    //     })
    // } catch (e) {
    //     rs.send({status: 'error'})
    //     console.log(e)
    // }
});

module.exports = router