require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://db:db@cluster0.dbyzuki.mongodb.net/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("reduxBlog");
    const postCollection = db.collection("posts");

    app.get("/posts", async (req, res) => {
      const cursor = postCollection.find({});
      const posts = await cursor.toArray();

      res.send({ status: true, data: posts });
    });

    app.post("/post", async (req, res) => {
      const post = req.body;

      const result = await postCollection.insertOne(post);

      res.send(result);
    });

    app.patch("/post/:id", async (req, res) => {
      const post = req.body;
      const id = req.params.id;

      const result = await postCollection.updateOne({ _id: ObjectId(id) }, { $set: post });
      res.send(result);
    });

    app.delete("/post/:id", async (req, res) => {
      const id = req.params.id;

      const result = await postCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
