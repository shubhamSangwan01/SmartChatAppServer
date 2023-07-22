
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/user.js";
import Message from "./models/message.js";
import User from "./models/user.js";
import Group from "./models/groups.js";
import GroupChat from "./models/groupChat.js";
import Notification from "./models/notification.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use((req, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "x-access-token",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});


const PORT = process.env.PORT || 5000;

try {
  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(
        "mongodb+srv://ashish123:ashish123@chatapp.ie5n16j.mongodb.net/?retryWrites=true&w=majority"
      );
      //  await Message.deleteMany();
      //  await User.deleteMany();
      //  await Group.deleteMany();
      //  await GroupChat.deleteMany();
      //  await Notification.deleteMany();
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  app.use("/", routes);

  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log("listening for requests at PORT", PORT);
    });
  });
} catch (error) {
  console.log(error);
}