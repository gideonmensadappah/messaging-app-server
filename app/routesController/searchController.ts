import express from "express";
import { MongoHelper } from "../DB/mongoHelper";

const search = express.Router();
const getCollection = () => {
  return MongoHelper.client.db("messagesApp").collection("users");
};

search.get("/search", (req: express.Request, res: express.Response) => {
  const collection = getCollection();
  const query = String(req.query["query"]);

  let mongoquery = {
    $or: [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
    ],
  };

  if (query) {
    collection.find(mongoquery).toArray((err, users) => {
      if (err) console.error(err);
      if (users) {
        res.status(200);
        res.json(users);
      } else {
        res.send([]);
      }
    });
  }
});

export default search;
