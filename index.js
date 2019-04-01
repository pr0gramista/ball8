const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const questions = require("./questions");
const bodyParser = require("body-parser").json();

const getMongo = async () => {
  if (process.env.MONGO_URL !== undefined) {
    console.log("Mongo connected");
    return await MongoClient.connect(process.env.MONGO_URL);
  }
};

const start = async () => {
  const mongo = await getMongo();

  const app = express();

  app.use(bodyParser);
  app.use((req, res, next) => {
    if (mongo) {
      req.mongo = mongo.db("ball");
    }
    next();
  });
  app.get('/health', (req, res) => {
    res.status(200).send('1.0.1')
  });

  questions(app);

  app.listen(8080, () => console.log('Looking forward to your questions on :8080'));
};

start();
