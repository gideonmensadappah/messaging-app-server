import * as express from "express";
import * as mongo from "mongodb";
import { MongoHelper } from "../DB/mongoHelper";

const userController = express.Router();

const getCollection = () => {
  return MongoHelper.client.db("messagesApp").collection("users");
};

userController.get(
  "/users/:id",
  (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const collection = getCollection();
    const o_id = new mongo.ObjectId(id);
    collection.findOne({ _id: o_id }, (err, mongoRes) => {
      if (err) console.error(err);
      res.status(200).send(mongoRes);
    });
  }
);
type User = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: number;
};
userController.post(
  "/users/new-user",
  (req: express.Request, res: express.Response) => {
    let { uid, firstName, lastName, phone } = req.body;
    const collection = getCollection();
    const user: User = { _id: uid, firstName, lastName, phone };

    collection.insertOne(user, (err, mongoRes) => {
      if (err) console.error(err);
      res.status(200).send(mongoRes.ops);
    });
  }
);
userController.put(
  "/users/:id",
  (req: express.Request, res: express.Response) => {}
);
userController.delete(
  "/user/:id",
  (req: express.Request, res: express.Response) => {}
);

export default userController;
