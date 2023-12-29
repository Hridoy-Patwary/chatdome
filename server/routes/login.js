const express = require("express");
// const { default: mongoose } = require('mongoose');
// const UserSchema = require('../models/UserModule');
// const USChema = mongoose.model('users', UserSchema);
const router = express.Router();


router.post('/', async (rq, rs)=>{
    const db = rq.app.locals.db
    const { email, pass } = rq.body;
    const sql = "SELECT * FROM `users` where `email` = '"+email+"'";
    try {
        db.query(sql, (err, res) => {
            if(err) {
                console.log(err);
                throw err
            }
            if(res.length > 0){
                if(res[0].pass === pass){
                    rs.json({uid: res[0]._id});
                }else{
                    rs.json({status: "WP", x: res[0]}); // wrong password
                }
            }else {
                rs.json("NE")
            }
        })
    } catch (error) {
        console.log(error);
        throw error
    }

    // try {
    //     let usrCheck = await USChema.findOne({'email': email});
    //     if(usrCheck){
    //         if(usrCheck.pass === pass){
    //             rs.json({uid: usrCheck._id});
    //         }else{
    //             rs.json("WP"); // wrong password
    //         }
    //     }else{
    //         rs.json("NE"); // not exist
    //     }
    // } catch (e) {
    //     rs.send({status: 'error'})
    //     console.log(e)
    // }
});

module.exports = router;