"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var mongoHelper_1 = require("../DB/mongoHelper");
var mongo = __importStar(require("mongodb"));
var chatsController = express.Router();
var getCollection = function () {
    return mongoHelper_1.MongoHelper.client.db("messagesApp").collection("chats");
};
chatsController.get("/", function (req, res) {
    var collection = getCollection();
    collection.find().toArray(function (err, chats) {
        if (err) {
            res.status(500);
            res.end();
            console.error(err);
        }
        else {
            chats = chats.map(function (user) { return user; });
            res.json(chats);
        }
    });
});
chatsController.get("/messages/user/:id", function (req, res) {
    var id = req.params["id"];
    var collection = getCollection();
    collection.find({ usersId: { $in: [id] } }).toArray(function (err, chats) {
        if (err) {
            console.error(err);
        }
        else {
            chats = chats.map(function (chat) { return chat; });
            res.json(chats);
        }
    });
});
chatsController.post("/messages/create-new-chat", function (req, res) {
    var _a = req.body, currentUserId = _a.currentUserId, requestedUserId = _a.requestedUserId;
    var collection = getCollection();
    var _currentUserId = currentUserId;
    var _requestedUserId = requestedUserId;
    var newChat = {
        usersId: [_currentUserId, _requestedUserId],
    };
    collection.insertOne(newChat, function (err, mongoRes) {
        if (err) {
            console.error(err);
        }
        else {
            res.status(200).json(mongoRes.ops[0]);
        }
    });
});
chatsController.delete("/messages/delete-chat/:chatId", function (req, res) {
    var id = req.params["chatId"];
    var collection = getCollection();
    var o_id = new mongo.ObjectID(id);
    collection.deleteOne({ _id: o_id }, function (err, mongoRes) {
        if (!res) {
            console.error(err);
        }
        return res.status(200).send(mongoRes.result);
    });
});
exports.default = chatsController;
