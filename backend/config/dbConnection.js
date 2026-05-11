const mongoose = require("mongoose");

const connectDb = async ()=>
{
    try{
        const connect = await mongoose.connect(process.env.SERVER_URL);
        if(connect) console.log("Database connected: ",connect.connection.name);
    }catch(err)
    {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDb;