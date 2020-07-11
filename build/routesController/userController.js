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
var mongo = __importStar(require("mongodb"));
var mongoHelper_1 = require("../DB/mongoHelper");
var userController = express.Router();
var getCollection = function () {
    return mongoHelper_1.MongoHelper.client.db("messagesApp").collection("users");
};
userController.get("/users/:id", function (req, res) {
    var id = req.params.id;
    var collection = getCollection();
    var o_id = new mongo.ObjectId(id);
    collection.findOne({ _id: o_id }, function (err, mongoRes) {
        if (err)
            console.error(err);
        res.status(200).send(mongoRes);
    });
});
userController.post("/users/new-user", function (req, res) {
    var _a = req.body, uid = _a.uid, firstName = _a.firstName, lastName = _a.lastName, phone = _a.phone;
    var collection = getCollection();
    var user = { _id: uid, firstName: firstName, lastName: lastName, phone: phone };
    collection.insertOne(user, function (err, mongoRes) {
        if (err)
            console.error(err);
        res.status(200).send(mongoRes.ops);
    });
});
userController.put("/users/:id", function (req, res) { });
userController.delete("/user/:id", function (req, res) { });
exports.default = userController;
