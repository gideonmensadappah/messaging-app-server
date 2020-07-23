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
  "/chat/:chatId",
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
// Join chats and users

chatsController.get(
  "/chats/:id",
  async (req: express.Request, res: express.Response) => {
    const id = req.params["id"];
    const collection = getCollection();
    collection
      .aggregate([
        { $match: { usersId: { $in: [id] } } },
        {
          $lookup: {
            from: "users",
            localField: "usersId",
            foreignField: "_id",
            as: "chatsdetails",
          },
        },
      ])
      .toArray((err, mongoRes) => {
        if (err) res.send(err);

        const chatList: any = mongoRes.reduce((acc, currentObject) => {
          const filteredDetails = currentObject.chatsdetails.filter(
            (user: any) => user._id !== id
          );
          if (filteredDetails.length)
            acc.push(
              Object.assign({}, currentObject, {
                chatsdetails: filteredDetails,
              })
            );

          return acc;
        }, []);
        res.status(200).json(chatList);
      });
    try {
    } catch {
      console.log("catch block!");
      res.json([]);
    }
  }
);

type CreateChat = {
  usersId: Array<string>;
};
chatsController.post("/chat", (req: express.Request, res: express.Response) => {
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
});

chatsController.delete(
  "/chat/:chatId",
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
