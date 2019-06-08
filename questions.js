const prom = require('prom-client');
const responses = [
  "Yes",
  "No",
  "Probably",
  "Absolutely",
  "Follow your heart",
  "Perhaps",
  "Can't tell yet",
  "UGABUGA",
  "Don't know bro"
];

const counter = new prom.Counter({
  name: 'questions_counter',
  help: 'How many questions have been asked'
});

const getQuestions = async (req, res) => {
  if (req.mongo) {
    const questions = await req.mongo
      .collection("questions")
      .find()
      .toArray();

    res.send(questions);
  } else {
    console.error('/questions => MongoDB is missing!');
    res.sendStatus(500);
  }
};

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const askQuestion = async (req, res) => {
  counter.inc();

  // Let the ball sleep for a while
  await sleep(Math.random() * 1000);

  const index = Math.floor(Math.random() * responses.length);
  const response = responses[index];

  if (req.mongo) {
    console.log('/ask => Adding a question to MongoDB');
    await req.mongo
      .collection("questions")
      .insertOne({ question: req.body.question, answer: response, date: new Date().toISOString() });
  }

  res.send({ response });
};

module.exports = app => {
  app.get("/questions", getQuestions);
  app.post("/ask", askQuestion);
};
