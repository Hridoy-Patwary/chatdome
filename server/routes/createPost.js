const express = require('express');
// const { default: mongoose } = require('mongoose');
// const Post = require('../models/Post');
// const PostIni = mongoose.model('posts', Post);
const router = express.Router();


router.post('/', async (rq, rs)=>{
    const {uid, txt, privacy} = rq.body;
    const newPostSql = "INSERT INTO `posts` (uid, postTxt, privacy) VALUES ('"+uid+"', '"+txt+"', '"+privacy+"')";

    try {
        // let newPost = new PostIni({uid: uid, postTxt: txt, privacy: privacy});
        // newPost.save().then((p)=>{
        //     rs.json(p)
        // }).catch((err)=>{
        //     console.log(err)
        // })
        if(await rq.app.locals.dbConn.runQuery(newPostSql)){
            rs.send({status: 200})
        }else rs.send({status: 400})
    } catch (e) {
        console.log(e)
    }
})
module.exports = router