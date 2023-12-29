const express = require('express');
const WebSocket = require('ws');
const Hash = require('../functions/customHash');
const connToDB = require('../database/db');

const router = express.Router();
const hash = new Hash();
const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();

const db = connToDB

// async function checkUID(id){
//     const usr = await USChema.findById(id);
//     return usr?1:-1;
// }

async function updateStatus(uid){
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; 
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    const sql = "UPDATE `users` SET `activeStatus` = '"+localISOTime+"' WHERE `users`.`_id` = '"+uid+"'";
    return await db.runQuery(sql);
}

async function requester(from, to, type){
    const sqlToCheck = "SELECT * FROM `requests` WHERE `usr` = '"+from+"' AND `toUsr` = '"+to+"' OR `usr` = '"+to+"' AND `toUsr` = '"+from+"'";
    const requestSQL = "INSERT INTO `requests` (type, usr, toUsr) VALUES ('"+type+"', '"+from+"', '"+to+"')";
    const reqUpdateSQL = "UPDATE `requests` SET `type` = '"+type+"' WHERE `usr` = '"+to+"' AND `toUsr` = '"+from+"'";
    
    
    try {
        const checkRes = await db.runQuery(type==="accepted"?reqUpdateSQL:sqlToCheck);

        if(checkRes && checkRes.length < 1){
            const req = await db.runQuery(requestSQL);
            return {exist: false, data: req};
        }else{
            return {exist: true, data: checkRes};
        }
    } catch (error) {
        console.log(error);
        return {status: 'error'};
    }
}


wss.on('connection', (ws, rq) => {
    ws.binaryType = 'arraybuffer'
    const rqURISplit = rq.url.split('id=');
    const id = rqURISplit[rqURISplit.length - 1];
    // console.log(checkUID(id));
    if(id.length < 1){
        ws.close();
        return
    }
    updateStatus(id)
    ws.send(JSON.stringify({id: id}))
    const metadata = { id: id };
    clients.set(ws, metadata)


    ws.on('message', (messageAsString) => {
        let msg = '', to = {id: ''}, responsMsg = {};
        try {
            msg = JSON.parse(messageAsString);
        } catch (error) {
            msg = Buffer.from(messageAsString) || messageAsString;
        };


        if(typeof msg === 'object'){
            if(msg.usrtpig){
                to.id = msg.usrtpig[1];
                responsMsg.usrtpig = msg.usrtpig;
            }else if(msg.smttu){
                const decrpt = hash.decrypt('cD');
                to.id = decrpt(msg.smttu.i);
                responsMsg.nmb = [to.id.toString().trim(), {i: msg.smttu.s, m: msg.smttu.m}]
            }else if(msg.gmsg){
                to.id = msg.gmsg[1].i;
                responsMsg.delivery = {
                    type: 'msg',
                    status: 'ok',
                    to: msg.gmsg[0],
                    from: msg.gmsg[1].i
                }
            }else if(msg.req){
                to.id = msg.req.to;
                requester(msg.req.usr, msg.req.to, msg.req.type);
                responsMsg.req = {
                    type: msg.req.type,
                    from: msg.req.usr
                }
            }
            to.id = to.id.toString().trim()
            let clientWs = [...clients].find(([key, value]) => to.id === value.id);
            if(clientWs) clientWs[0].send(JSON.stringify(responsMsg))
            // console.log();
            // [...clients.keys()].forEach((client) => {
            //     if(clients.get(ws).id !== clients.get(client).id){
            //         client.send(JSON.stringify(responsMsg));
            //     }
            // });
        }else{
            console.log(msg);
        }
    })
    ws.on('close', ()=>{
        ws.send(JSON.stringify(['connection close', clients.size]))
        clients.delete(ws);
    })
})
router.post('/', (rq, rs)=>{
    const { id } = rq.body;
    // console.log(rq.body);
    if(id){
        // console.log(id);
        rs.send({status: 'ok'})
    }else{
        rs.send({status: id})
        return;
    };

})



// function uuidv4() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }
module.exports = router