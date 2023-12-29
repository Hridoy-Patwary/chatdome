const express = require("express");
const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 7071 });
const connMap = new Map();

const app = express();
const port = 3000;



wss.on('connection', (socket, req)=>{
    console.log('new connect were made')
    connMap.set(socket, req);
    socket.on('message', (e)=>{
        console.log(e)
        socket.send('new connection made')
        socket.emit('connected')
    })
    socket.on('close', ()=>{
        console.log('connection closed')
    })
    
    // connMap.keys().forEach((client) => {
    //     client.send('asdfasd')
    // });
    console.log(connMap)
})




app.get('/', (rq, rs) => {
    rs.send('running');
});

// app.use('/api/socket', 'websocket.js')


app.listen(port, ()=>{
    console.log('socket server is running on port: '+port);
});