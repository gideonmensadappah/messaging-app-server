import * as express from "express";
import { MongoHelper } from "../DB/mongoHelper";
import * as mongo from "mongodb";

const chatsController = express.Router();

const getCollection = () => {
  return MongoHelper.client.db("messagesApp").collection("chats");
};

chatsController.get("/", (req: express.Request, res: express.Response) => {
  const chatsCollection = getCollection();
  chatsCollection.find().toArray((err, chats) => {
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
    const chatsCollection = getCollection();
    const o_id = new mongo.ObjectID(chatId);
    chatsCollection.findOne({ _id: o_id }, (err, mongoRes) => {
      if (err) console.error(err);
      res.status(200).send(mongoRes);
    });
  }
);

chatsController.get(
  "/chats/:id",
  async (req: express.Request, res: express.Response) => {
    const id = req.params["id"];
    const chatsCollection = getCollection();

    try {
      chatsCollection
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
    } catch {
      res.json([]);
    }
  }
);

type CreateChat = {
  usersId: Array<string>;
};
chatsController.post("/chat", (req: express.Request, res: express.Response) => {
  const { currentUserId, requestedUserId } = req.body;
  const chatsCollection = getCollection();
  const _currentUserId: string = currentUserId;
  const _requestedUserId: string = requestedUserId;
  const newChat: CreateChat = {
    usersId: [_currentUserId, _requestedUserId],
  };
  chatsCollection.insertOne(newChat, (err, mongoRes) => {
    if (err) res.status(500).send(err);
    res.status(200).json(mongoRes.ops[0]);
  });
});

chatsController.delete(
  "/chat/:chatId",
  (req: express.Request, res: express.Response) => {
    const id = req.params["chatId"];
    const chatsCollection = getCollection();
    const o_id = new mongo.ObjectID(id);
    chatsCollection.deleteOne({ _id: o_id }, (err, mongoRes) => {
      if (err) res.status(500).send(err);
      res.status(200).send(mongoRes.result);
    });
  }
);

export default chatsController;
