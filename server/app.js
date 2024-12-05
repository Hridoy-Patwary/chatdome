const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const connToDB = require('./database/db');
// const UserSchema = require('./models/UserModule');
// const { default: mongoose } = require('mongoose');
const Hash = require('./functions/customHash');
// const USChema = mongoose.model('users', UserSchema);

const multer = require('multer');
const path = require('path');





const hash = new Hash();

const app = express();
const server = http.createServer(app);
const io = new Server(server)

app.use(express.json());

// cors policy
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


let cdShareUsers = [], listeningFor = ''

io.on("connection", (socket) => {
    socket.on("i", (username)=>{
        listeningFor = 'cd share'
        cdShareUsers.push({username: username, id: socket.id});
        socket.emit("ini", {msg: "welcome", id: socket.id, ulist: cdShareUsers});
        socket.broadcast.emit('newConnection', {nwID: socket.id, ulist: cdShareUsers});
    })
    socket.on('prmsg', (pr)=>{
        io.to(pr.to).emit('prmsg', {uid: pr.from, msg: pr.msg})
    })
    // socket listener for messages
    socket.on('msgListener', async (i)=>{
        listeningFor = 'msg'
        // const listenFor = i.id
        // const decrpt = hash.decrypt('cD');
        // const uid = decrpt(listenFor)
        // let user = await USChema.findOne({_id: uid})
        // if(user){
        //     // console.log(user.name)
        // }
    })
    // user typing
    socket.on('usrtpig', (i)=>{
        socket.compress(true).broadcast.emit('usrtpig', i)
    })
    // send message to the user
    socket.on('smttu', async ({s, i, m})=>{
        const decrpt = hash.decrypt('cD');
        const id = decrpt(i);
        socket.compress(true).broadcast.emit('nmb', [id, {i: s, m: m}]) // nmb = new message broadcast
    })
    socket.on('disconnect', (r)=>{
        if(listeningFor === 'cd share'){
            cdShareUsers = cdShareUsers.filter(x => x.id !== socket.id)
            socket.broadcast.emit('userLeft', {disconnectID: socket.id, ulist: cdShareUsers})
        }
    })
});
const dbConn = connToDB
const db = dbConn();

app.locals.db = db;
app.locals.dbConn = dbConn;
// server endpoints
app.use("/media/u/i", express.static(path.join(__dirname, '/media/u/i')))
app.use("/api/v1/login", require("./routes/login"));
app.use('/api/v1/signup', require("./routes/singup"));
app.use('/api/v1/info', require('./routes/getInfo'));
app.use('/api/v1/npost', require('./routes/createPost'));
app.use('/api/v1/uplist', require('./routes/userPosts'));
app.use('/api/v1/m', require('./routes/message'));
app.use('/api/v1/feed', require('./routes/feed'));
app.use('/api/v1/p2p', require('./routes/websocket'));




app.post('/api/v1/user/connect', async (rq, rs)=>{
    const { requestedUsr, requestingTo } = rq.body;
    const sqlToCheck = "SELECT * FROM `requests` WHERE `usr` = '"+requestedUsr+"' AND toUsr = '"+requestingTo+"' AND `type` = 'connect'";
    const requestSQL = "INSERT INTO `requests` (type, usr, toUsr) VALUES ('connect', '"+requestedUsr+"', '"+requestingTo+"')";
    try {
        const checkRes = await dbConn.runQuery(sqlToCheck);
        if(checkRes && checkRes.length < 1){
            const req = await dbConn.runQuery(requestSQL);
            rs.send(req)
        }else{
            rs.send({status: 'bad request'})
        }
    } catch (error) {
        console.log(error);
        rs.send({status: 'error'})
    }
    console.log(requestedUsr, requestingTo);
})


app.post('/api/v1/user/connect/check', async (rq, rs)=>{
    const { usr, to } = rq.body;
    const sqlToCheck = "SELECT * FROM `requests` WHERE `usr` = '"+usr+"' AND `toUsr` = '"+to+"' OR `usr` = '"+to+"' AND `toUsr` = '"+usr+"'";
    try {
        const checkRes = await dbConn.runQuery(sqlToCheck);
        rs.send(checkRes);
    } catch (error) {
        console.log(error);
        rs.send({status: 'error'})
    }
})


app.post('/api/v1/statusUpdate', async (rq, rs)=>{
    const {id} = rq.body;
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; 
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    const sql = "UPDATE `users` SET `activeStatus` = '"+localISOTime+"' WHERE `users`.`_id` = '"+id+"'";

    try {
        // let status = await USChema.findOneAndUpdate({'_id': id}, {
        //     $set: {
        //         'activeStatus': currentTime
        //     }});
        db.query(sql, (err, res)=>{
            if(err) {
                console.log(err);
                throw err
            }
            rs.send(res)
        })
    } catch (e) {
        console.log(e)
        rs.send({status: 'error'})
    }
})

app.post('/api/v1/bio', async (rq, rs)=>{
    // const {b, id} = rq.body;
    try {
        // await USChema.findOneAndUpdate({'_id': id}, {
        //     $set: {
        //         'bio': b
            // }});
        rs.send({status: 'ok'});
    } catch (e) {
        console.log(e)
    }
})


const storage = multer.diskStorage({
    destination: "./media/u/i/",
    filename: function (req, file, cb) {
        cb(null, req.body.uid?req.body.uid+'.'+file.originalname.split('.').pop():file.originalname);
    },
});
const diskStorage = multer({ storage: storage });
app.post("/api/media/upload", diskStorage.single("image"), async (req, res) => {
    const { uid } = req.body;
    let srcObj = {
        'profile': '',
        'cover': ''
    }

    try {
        srcObj.profile = req.file.path;
        let updPrSrcImgAsStr = srcObj;
        // let updPrImgSrc = await USChema.findOne({ '_id': id });
        // let updPrfSrc = await USChema.findOneAndUpdate({ '_id': uid }, {
        //     $set: {
        //         'src': updPrSrcImgAsStr
        //     }
        // })
        const getUsrSrcColmn = "SELECT `src` FROM `users` WHERE `_id` = '"+uid+"'";
        const usrSrcData = await dbConn.runQuery(getUsrSrcColmn);
        const prfSrcUpdQuery = "UPDATE `users` SET `src` = '"+JSON.stringify(updPrSrcImgAsStr)+"' WHERE `_id` = '"+uid+"'";
        
        
        if(updPrSrcImgAsStr){
            updPrSrcImgAsStr = await dbConn.runQuery(prfSrcUpdQuery);
            res.send({ 'json': srcObj, 'src': JSON.parse(usrSrcData[0].src).length})
        }else{
            res.status(500).send({status: 'error', res: updPrSrcImgAsStr});
        }
    } catch (error) {
        res.status(500).send({status: 'error'});
    }
});


app.post('/api/v1/ulist', async function(rq, rs){
    const { id } = rq.body;
    try {
        rs.json(await dbConn.runQuery("SELECT * FROM `users` WHERE `_id` NOT IN ("+id+")"));
    } catch (error) {
        console.log(error);
        throw error
    }
})



server.listen(9000, () => {
    console.log('Server started on port 9000');
});