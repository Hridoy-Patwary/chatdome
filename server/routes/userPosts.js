const express = require("express");
// const { default: mongoose } = require('mongoose');
// const postsModel = mongoose.model('posts');
const router = express.Router();


router.post('/', async (rq, rs)=>{
    const {id} = rq.body;
    try {
        // let posts = await postsModel.find({uid: id});
        // rs.json(posts)
    } catch (e) {
        console.log(e)
        rs.send({status: 'error'})
    }
});

module.exports = router;