import mongoose from "mongoose";

const dbConnect = async()=>{
  try{
      const dbConnection=await mongoose.connect(process.env.CONNECTION_STRING)
    console.log(`DataBase connected : ${dbConnection.connection.name} ${dbConnection.connection.host}`)
  }catch(err){
    console.log(err)
    process.exit(1)
  }
}

export default dbConnect;