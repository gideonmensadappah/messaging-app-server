import * as dotenv from "dotenv";
dotenv.config();
import * as http from "http";
import io from "socket.io";
import app from "./server";
import { MongoHelper } from "./DB/mongoHelper";

const PORT = process.env.PORT || 5151;

type Message = {
  id: string;
  avatar: string;
  userId: string;
  chatId: string;
  text: string;
  createdAt: Date;
};

const server = http.createServer(app);
const ioServer = io(server);

ioServer.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("new chat", () => {
    ioServer.emit("new chat");
  });
  socket.on("new message", (payload: Message) => {
    socket.broadcast.emit("income message", payload);
  });

  socket.on("typing", (msg: string) =>
    socket.broadcast.emit("user typing", msg)
  );
  socket.on("stop typing", (msg: string) =>
    socket.broadcast.emit("user typing stopped", msg)
  );
});

server.listen(PORT);
server.on("listening", async () => {
  try {
    await MongoHelper.connect(process.env.DB_URL!);
    console.info("Welcome to Messaging App Server DB is ON SET!");
  } catch (err) {
    console.error(err);
  }
});
