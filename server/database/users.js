const connToDB = require("./db");



export default class Database{
    database = connToDB()
    signup(name, email, pass){
        const sql = "INSERT INTO `users` (name, email, pass) VALUES ('"+name+"', '"+email+"', '"+pass+"')";
        const sqlForCheck = "SELECT * FROM `users` where `email` = '"+email+"'";
        try {
            this.database.query(sqlForCheck, (err, result)=>{
                if(err) {
                    throw err
                }
                if(result.length > 0){
                    return {response: 'already have an account'};
                }else{
                    this.database.query(sql, (er, insertQueryRes) =>{
                        if(er){
                            console.log(er);
                            throw er
                        };
                        
                        return {uid: insertQueryRes.insertId};
                    })
                }
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    login(email, pass){
        const sql = "SELECT * FROM `users` where `email` = '"+email+"'";
        this.database.query(sql, (err, res)=>{
            if(err) {
                console.log(err);
                throw err
            }
            if(res.length > 0){
                if(res[0].pass === pass){
                    return {uid: res[0]._id}
                }else{
                    return {status: "WP", x: res[0]} // wrong password
                }
            }else {
                return "NE";
            }
        });
    }
}