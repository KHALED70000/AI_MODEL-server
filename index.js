const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ptsepf.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('AI-MODEL is Running!')
})

async function run() {
    try {
        await client.connect();

        const DataBase = client.db('AI_MODEL_DB')
        const ALLmodelsCollection = DataBase.collection('AllModels')

        //APIs HERE......//
        app.post('/AllModels', async (req, res) => {
            const newAiMolel = req.body;
            const result = await ALLmodelsCollection.insertOne(newAiMolel)
            res.send(result);
        })
        app.get('/Letest-AllModels', async (req, res) => {
            const cursor = ALLmodelsCollection.find().sort({ createdAt: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/AllModels', async (req, res) => {
            const cursor = ALLmodelsCollection.find().sort({ createdAt: -1 })
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/AllModels/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await ALLmodelsCollection.findOne(query);
            res.send(result);
        })
        app.get('/Mymodels', async(req, res)=>{
            const email = req.query.email;
            const query = { createdBy: email }
            const cursor = ALLmodelsCollection.find(query);
            const result = await cursor.toArray(cursor);

            res.send(result);
        })
        app.delete('/Mymodels/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await ALLmodelsCollection.deleteOne(query);

            res.send(result);
        })
        //APIs HERE......//

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB")
    }
    finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`AI-MODEL is Running on port ${port}`)
})