const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('hello world')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f7dhy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db(process.env.DB_NAME).collection("products");
    

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
        res.send("done done")
    })

    app.get('/getAllProduct',(req,res)=>{
        productCollection.find()
        .toArray((err, items)=>{
            res.send(items)
        })
    })
    

    app.delete('/deleteProduct/:id',(req,res)=>{
        const id = ObjectId(req.params.id);
        productCollection.findOneAndDelete({_id : id})
        .then(doc => {
            res.send(doc)
        })
    })
    const orderCollection = client.db(process.env.DB_NAME).collection("orders");

    app.post('/orderNow',(req,res)=>{
        const order = req.body;
        console.log(order, "order");
        orderCollection.insertOne(order)
        res.send('product ordered') 
    })

    app.get('/allOrder/:email',(req,res)=>{
        const email = req.params.email
        orderCollection.find({email : email})
        .toArray((err,orders)=>{
            res.send(orders)
        })
    })

});




app.listen(port)