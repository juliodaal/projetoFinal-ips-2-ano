let parameters = {
    "server":{
        "port": 8081
    },
    "database": {
        "host": process.env.HOST || "127.0.0.1",
        "user": process.env.USER || "root",
        "database": process.env.DATABASE || "projecto",
        "password": process.env.PASSWORD || ""
    }
}
module.exports.parameters = parameters;