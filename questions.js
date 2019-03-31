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

const askQuestion = async (req, res) => {
  // Let the ball sleep for a while
  var waitTill = new Date(new Date().getTime() + 2000);
  while(waitTill > new Date()){}

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
