const express = require('express');
// const { default: mongoose } = require('mongoose');
// const USChema = mongoose.model('users');
// const postSchema = require('../models/Post');
// const PostDB = mongoose.model('posts', postSchema);
const router = express.Router();


router.post('/', async (rq, rs)=>{
    const {id} = rq.body;
    const sql = "SELECT * FROM `users` where `_id` = '"+id+"'";
    try {
        const db = rq.app.locals.db
        db.query(sql, (err, res)=>{
            if(err) {
                console.log(err);
                throw err
            }
            if(res.length > 0){
                rs.json(res[0])
            }else{
                rs.send({status: 'Not found!'})
            }
        })
        // let info = await USChema.findOne({'_id': id});
        // if(info){
        //     rs.json(info);
        // }else{
        //     rs.send({status: 'Not found!'})
        // }
    } catch (e) {
        console.log(e)
        rs.send({status: 'error'})
    }
})
router.post('/fullInfo', async (rq, rs)=>{
    const {id} = rq.body;
    const sql = "SELECT * FROM `users` where `_id` = '"+id+"'";
    const sqlToFetchPosts = "SELECT * FROM `posts` where `uid` = '"+id+"'";

    
    const db = rq.app.locals.db

    try {
        let fullProfileInfo = {
            'info': '',
            'posts': ''
        }
        db.query(sql, (er, res)=>{
            if(er) {
                console.log(er);
            }
            if(res && res.length > 0){
                fullProfileInfo.info = res[0];
            }else{
                fullProfileInfo.info = {}
            }
        })
        db.query(sqlToFetchPosts, (err, rees)=>{
            if(err) {
                console.log(err);
            }


            fullProfileInfo.posts = rees
            rs.json(fullProfileInfo)
        })

    } catch (e) {
        console.log(e);
        rs.send({status: 'error'})
    }
    // try {
    //     let info = await USChema.findOne({'_id': id});
    //     let usrPosts = await PostDB.find({'uid': id}),
    //         fullProfileInfo = {
    //         'info': info,
    //         'posts': usrPosts
    //     }
    //     if(info || usrPosts){
    //         rs.json(fullProfileInfo);
    //     }else{
    //         rs.send({status: 'Not found!'})
    //     }
    // } catch (e) {
    //     console.log(e)
    //     rs.send({status: 'error'})
    // }

})
module.exports = router