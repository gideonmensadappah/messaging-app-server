import * as mongodb from "mongodb";

export class MongoHelper {
  public static client: mongodb.MongoClient;

  public static connect(url: string) {
    return new Promise((resolve, reject) => {
      mongodb.MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (error, client: mongodb.MongoClient) => {
          if (error) {
            reject(error);
          } else {
            MongoHelper.client = client;
            resolve(client);
          }
        }
      );
    });
  }
}
