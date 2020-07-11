import * as express from "express";
import { MongoHelper } from "../DB/mongoHelper";
import * as mongo from "mongodb";

const chatsController = express.Router();

const getCollection = () => {
  return MongoHelper.client.db("messagesApp").collection("chats");
};

chatsController.get("/", (req: express.Request, res: express.Response) => {
  const collection = getCollection();
  collection.find().toArray((err, chats) => {
    if (err) {
      res.status(500);
      res.end();
      console.error(err);
    } else {
      chats = chats.map((chat) => chat);
      res.json(chats);
    }
  });
});

chatsController.get(
  "/chats/chat/:chatId",
  (req: express.Request, res: express.Response) => {
    const { chatId } = req.params;
    const collection = getCollection();
    const o_id = new mongo.ObjectID(chatId);
    collection.findOne({ _id: o_id }, (err, mongoRes) => {
      if (err) console.error(err);
      res.status(200).send(mongoRes);
    });
  }
);

chatsController.get(
  "/messages/user/:id",
  (req: express.Request, res: express.Response) => {
    const id = req.params["id"];
    const collection = getCollection();

    collection.find({ usersId: { $in: [id] } }).toArray((err, chats) => {
      if (err) {
        console.error(err);
      } else {
        chats = chats.map((chat) => chat);
        res.json(chats);
      }
    });
  }
);

type CreateChat = {
  usersId: Array<string>;
};
chatsController.post(
  "/messages/create-new-chat",
  (req: express.Request, res: express.Response) => {
    const { currentUserId, requestedUserId } = req.body;
    const collection = getCollection();
    const _currentUserId: string = currentUserId;
    const _requestedUserId: string = requestedUserId;
    const newChat: CreateChat = {
      usersId: [_currentUserId, _requestedUserId],
    };
    collection.insertOne(newChat, (err, mongoRes) => {
      if (err) {
        console.error(err);
      } else {
        res.status(200).json(mongoRes.ops[0]);
      }
    });
  }
);

chatsController.delete(
  "/messages/delete-chat/:chatId",
  (req: express.Request, res: express.Response) => {
    const id = req.params["chatId"];
    const collection = getCollection();
    const o_id = new mongo.ObjectID(id);
    collection.deleteOne({ _id: o_id }, (err, mongoRes) => {
      if (!res) {
        console.error(err);
      }
      return res.status(200).send(mongoRes.result);
    });
  }
);

export default chatsController;
