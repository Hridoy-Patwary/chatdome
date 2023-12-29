const express = require('express');
const router = express.Router();


router.get('/', (rq, rs)=>{
    const obj = {
        a: 'thios',
        number: 46
    }
    rs.json(obj)
})
module.exports = router