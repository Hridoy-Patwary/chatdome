const express = require('express');
// const { default: mongoose } = require('mongoose');
// const Message = require('../models/Message');
// const User = require('../models/UserModule');
// const messageModel = mongoose.model('messages', Message);
// const userModel = mongoose.model('users', User);
const router = express.Router();

router.post('/get', async (rq, rs)=>{
    const { id, opsitID } = rq.body;
    const db = rq.app.locals.db;
    const sql = "SELECT * FROM `messages` where `senderID` = '"+id+"' AND `receiverID` = '"+opsitID+"' OR `senderID` = '"+opsitID+"' AND `receiverID` = '"+id+"'  ORDER BY _id DESC";

    try {
        // let sendList = await messageModel.find({senderID: id, receiverID: opsitID});
        // let replyList = await messageModel.find({senderID: opsitID, receiverID: id});
        
        // if(sendList || replyList){
        //     let msgs = replyList.concat(...sendList)
        //     rs.json(msgs);
        // }else{
        //     rs.send({status: 'Not Found!'})
        // }
        db.query(sql, (err, res)=>{
            if(err) {
                console.log(err);
                throw err
            }
            if(res.length > 0){
                rs.json(res)
            }else rs.send({status: 'Not Found!'});
        });
    } catch (e) {
        console.log(e)
        rs.send({status: 'error'})
    }
})
router.post('/lastmsg', async (rq, rs)=> {
    const { id } = rq.body;
    try {
        // let x = await messageModel.find({receiverID: id}).sort({_id: -1}).limit(1);
        // let y = await messageModel.find({senderID: id}).sort({_id: -1}).limit(1);
        // let v = y.concat(...x);
        // rs.json(v)
    } catch (e) {
        console.log(e);
        rs.send({status: 'error'})
    }
})
async function updateMsgStage(stg, msgID){
    try {
        // await messageModel.findById(msgID).then((msg) =>{
        //     msg.stage = stg
        //     msg.save()
        // })
    } catch (e) {
        console.log(e)
    }
}
router.post('/chatlist', async (rq, rs)=>{
    const {id} = rq.body;
    const db = rq.app.locals.db;
    const sql = "SELECT * FROM `messages` where `senderID` = '"+id+"' OR `receiverID` = '"+id+"' ORDER BY _id DESC";

    let returnVlu = {};
    try {
        db.query(sql, (err, res)=>{
            if(err) {
                console.log(err);
                throw err
            }
            rs.json(res)
        });

        // let y = await messageModel.aggregate([
        //     {
        //         $lookup: {
        //             from: "users",
        //             let: { senderID: "$senderID", receiverID: "$receiverID" },
        //             pipeline: [{
        //                 // $match: { _id: { $or: ["$$senderID", "$$receiverID"] }}
                        
        //                 $match: {
                            
        //                     $or: [
        //                         {$expr: { _id: "$$senderID" }},
        //                         {$expr: { _id: "$$receiverID" }}
        //                     ]
        //                 }
        //             },{ $project: { _id: 1, name: 1, src: 1 } }],
        //             as: 'messageDoc'
        //         }
        //     }
        // ])
        // let x = await userModel.aggregate([
        //     {
        //         $lookup: {
        //             from: 'messages',
        //             let: { uid: "$_id" },
        //             pipeline: [{
        //                 $match: { $or: [ 
        //                     {senderID: id},
        //                     {receiverID: id}
        //                 ]}
        //             },{ $project: { _id: 1, msg: 1, senderID: 1, receiverID: 1, timestamp: 1 } }],
        //             as: 'messageDoc'
        //         }
        //     }
        // ])
        // rs.json(x)
        // let list = await messageModel.find({$or: [{receiverID: id}, {senderID: id}]}).sort({timestamp: -1}).limit(20)
        // // messageModel.
        // if(list){
        //     const unique = list.filter((obj, index) => list.findIndex((item) => (item.receiverID === obj.receiverID && item.senderID === obj.senderID)) === index);
        //     rs.json(unique)
        // }
    } catch (e) {
        console.log(e);
        rs.send(returnVlu)
    }
})
router.post('/send', async (rq, rs) => {
    const {sender, reciever, message} = rq.body;
    const msgSql = "INSERT INTO `messages` (senderID, receiverID, msg) VALUES ('"+sender+"', '"+reciever+"', '"+message+"')";
    const dbConn = rq.app.locals.dbConn;

    try {
        let newMsg = await dbConn.runQuery(msgSql);
        rs.send(newMsg)
        // let newMsg = new messageModel({senderID: sender, receiverID: reciever, msg: message});
        // newMsg.save().then((m)=>{
        //     updateMsgStage('sent', m._id);
        //     rs.send({status: 'ok'})
        // }).catch((err)=>{
        //     console.log(err)
        //     rs.send({status: 'error'})
        // })
    } catch (e) {
        console.log(e)
        rs.send({status: 'error'})
    }
})


module.exports = router