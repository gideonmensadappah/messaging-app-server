import express from "express";
import { MongoHelper } from "../DB/mongoHelper";

const search = express.Router();
const getCollection = () => {
  return MongoHelper.client.db("messagesApp").collection("users");
};

search.get("/search", (req: express.Request, res: express.Response) => {
  const usersCollection = getCollection();
  const query = String(req.query["query"]);

  let mongoquery = {
    $or: [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
    ],
  };

  if (query) {
    usersCollection.find(mongoquery).toArray((err, users) => {
      if (err) res.status(500).send(err);
      if (users.length === 0) {
        res.send([]);
      } else {
        res.status(200).json(users);
      }
    });
  }
});

export default search;
