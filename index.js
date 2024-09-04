import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const app = express();
const port = 3000;


// PostgreSQL db config
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

// db.connect() // to connect to DATABASE

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/", (req,res) =>{
    res.render("index.ejs")
});




app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});