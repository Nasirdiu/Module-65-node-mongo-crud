const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//use middleware

//user name: dbuser1
//pass: J5Ec3sDTf7lAy1Q4

const uri =
  "mongodb+srv://dbuser1:J5Ec3sDTf7lAy1Q4@cluster0.nkc9f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");

    //get user
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //post user :add a new user .
    app.post("/user", async (req, res) => {
      const newuser = req.body;
      console.log("adding new user", newuser);
      const result = await userCollection.insertOne(newuser);
      res.send(result);
    });
    //update user

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    //delete user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

/* async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");
    const user={name:'Pallob',email:'pallob@gmail.com'};
    const result= await userCollection.insertOne(user);
    console.log(`User inserted with id:${result.insertedId}`);
  } finally {
      //sudu akta kaj er jono use korbo er beshi hola use korbo na.
    // await client.close();
  }
}
run().catch(console.dir); */

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running My Node And CRUD Server");
});

app.listen(port, () => {
  console.log("CRUD Server is running");
});
