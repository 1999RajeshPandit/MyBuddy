import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

// const connOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1/ExamDB";

const connectToDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI);
    if (connect) console.log(`Mongodb connected - ${connect.connection.host}`);
  } catch (err) {
    console.log(`Database error ${err}`);
  }
};

export default connectToDB;