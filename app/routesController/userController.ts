import * as express from "express";
import * as mongo from "mongodb";
const fileupload = require("express-fileupload");
import { MongoHelper } from "../DB/mongoHelper";
import cloudinary from "cloudinary";
const cloud = cloudinary.v2;
const userController = express.Router();
userController.use(
  fileupload({
    useTempFiles: true,
  })
);

cloud.config({
  cloud_name: "dz6xpwefc",
  api_key: "712437264882739",
  api_secret: "VQYxrAuih_AORePmHWv02nnhDY0",
});

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: number;
};

const getCollection = () => {
  return MongoHelper.client.db("messagesApp").collection("users");
};

userController.get(
  "/users/:id",
  (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const usersCollection = getCollection();
    const o_id = new mongo.ObjectId(id);
    usersCollection.findOne({ _id: o_id }, (err, mongoRes) => {
      if (err) res.status(500).send(err);
      res.status(200).send(mongoRes);
    });
  }
);

userController.post(
  "/users/new-user",
  (req: express.Request, res: express.Response) => {
    let { uid, firstName, lastName, phone } = req.body;
    const usersCollection = getCollection();
    const user: User = { _id: uid, firstName, lastName, phone };

    usersCollection.insertOne(user, (err, mongoRes) => {
      if (err) res.status(500).send(err);
      res.status(200).send(mongoRes.ops);
    });
  }
);

userController.post(
  "/update/user",
  async (req: express.Request, res: express.Response) => {
    const { phoneNumber, currentUserId } = req.body;
    const usersCollection = getCollection();

    const file: any = req.files?.avatar;
    const { tempFilePath } = file;
    cloud.uploader.upload(
      tempFilePath,
      async (err: cloudinary.UploadResponseCallback, image: any) => {
        if (err) res.status(500).send(err);

        const { secure_url } = image;

        if (phoneNumber && phoneNumber.length === 10) {
          const result = await usersCollection.findOneAndUpdate(
            { _id: currentUserId },
            { $set: { avatar: secure_url, phone: phoneNumber } },
            { returnOriginal: true }
          );
          if (!result.ok) res.status(404).send("result not found");
          res.status(200).json(result);
        }
      }
    );
  }
);
userController.delete(
  "/user/:id",
  (req: express.Request, res: express.Response) => {}
);

export default userController;
