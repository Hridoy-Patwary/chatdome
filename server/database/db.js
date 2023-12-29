const mysql = require('mysql');
const DBUsr = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'patwary_chatdome'
};

// const DBUsr = {
//     host: 'patwaryd',
//     user: 'patwaryd_chatdome',
//     password: 'chatdomeMysql66',
//     database: 'patwaryd_chatdome'
// };
// const mongoose = require('mongoose');


// const connURI = 'mongodb://127.0.0.1:27017/CD';
let conn = mysql.createConnection(DBUsr)

const connToDB = ()=>{
    // mongoose.connect(connURI);
    // const conn = mongoose.connection;
    try {
        conn.connect((err) => {
            if(err) {
                console.log('some error occured, not connected to the database!!!')
            }else console.log("connected to the database");
        })
    } catch (error) {
        console.log('error occured');
    }
    conn.on('connected', ()=>{
        console.log("connected to the database successfully");
    });

    conn.on('disconnected', ()=>{
        console.log('disconnected to the database');
    });
    conn.on('error', (err)=>{
        console.log('DB connection error '+ err);
        let nmb = 0;
        const _i = setInterval(() => {
            conn = mysql.createConnection(DBUsr)
            try {
                nmb++;
                conn.connect((er) =>{
                    if(er){
                        console.log('failed to make connect with DB, try: '+nmb);
                    }else{
                        nmb = 0
                        console.log("connected to the database successfully");
                        clearInterval(_i)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }, 1000);
    });
    // this.closeDBConn = ()=>{
    //     console.log('inner fn')
    //     return conn.end()
    // }
    // this.runQuery = function(query){
    //     let rx = []
    //     conn.query(query, (err, res)=>{
    //         if(err) {
    //             console.log(err);
    //             throw err
    //         }
    //         rx = res
    //     })
    //     return rx
    // }
    return conn;
}
connToDB.endDBConn = function(){
    conn.end()
}
connToDB.runQuery = async function(query){
    return await new Promise((resolve, reject)=>{
        return conn.query(query, (err, result)=>{
            if(err){
                console.log(err);
                return reject(err)
            }
            return resolve(result);
        })
    })
}


module.exports = connToDB;