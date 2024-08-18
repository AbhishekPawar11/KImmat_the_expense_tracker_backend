import mongoose from "mongoose";


const conncetdb= async ()=>{
    try {
        const  conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected :${conn.connection.host}`);
    } catch (error) {
        console.log("error while connecting Database" , error);
        process.exit(1);
    }
}

export default conncetdb;
