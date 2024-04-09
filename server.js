const util = require('util');
var express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
var app = express();
const uri = "mongodb+srv://Susmitagiri:Susmita%402024@cluster1.tlsbvrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
var port = process.env.port || 3000;
let collection;
app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function runDBConnection() {
  try {
    await client.connect();
    collection = client.db().collection('Dog');
    // console.log(collection);
    console.log('connected to MongoDB successfully!');
  } catch (ex) {
    console.error('failed to connect to MongoDB!')
    console.error(ex);
  }
}

runDBConnection();

app.listen(port, () => {
  console.log("App listening to: " + port)
})

app.get('/', (req, res) => {
  res.render('index.html');
  // res.send('Hello world!');
})

app.get('/api/cards', async (req, res) => {
  console.log('GET: /api/cards');
  const cards = await collection.find().toArray();
  // console.log(cards);
  res.send(cards);
});


app.post('/api/cards', async (req, res) => {
  console.log('POST: /api/cards');
  const card = {
    title: req.body.value.title,
    color: req.body.value.color,
    imagePath: req.body.value.imagePath,
    description: req.body.value.description
  };

  console.log(`adding card to database; card: ${util.inspect(card)}`);
  const result = await collection.insertOne(card); // insert data into database 
  const success = result && result.acknowledged;
  if (success) {
    res.status(200).json("SUCCESS").send();
  } else {
    res.status(500).json("FAILED").send();
  }
});


