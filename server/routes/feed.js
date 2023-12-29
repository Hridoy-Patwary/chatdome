const express = require('express');
// const { default: mongoose } = require('mongoose');
// const postDB = mongoose.model('posts');
const router = express.Router()


router.post('/', (rq, rs) => {
    const { id } = rq.body;
    try {
        rs.json(id)
    } catch (e) {
        console.log(e)
        rs.send({status: 'error'})
    }
})

module.exports = router