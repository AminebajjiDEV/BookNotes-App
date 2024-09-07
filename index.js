import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const app = express();
const port = process.env.PORT; // set up a port config on your .env file


// PostgreSQL db config
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

db.connect() // to connect to DATABASE

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



let error = "";
async function getRead() { // get only read books
    const result = await db.query(
        `SELECT id, title, author, rating, read_at, genre
            FROM books
           WHERE is_read = TRUE;`
    );
    return result.rows;
}


app.get("/", async (req, res) => {
    try {
        const readbooks = await getRead();
        console.log("books :", readbooks);
        res.render("index.ejs", {
            books: readbooks,
            error: error
        })
    } catch (err) {
        console.error("Error fetching books:", err);
        res.render("index.ejs", {
            books: [],
            error: "An error occurred while fetching books."
        }); 
    }

})


app.use(async (req, res) => { // When a user searchs for a route that doesn't exist this error message will be displayed
    res.status(404).send("Could not find what you are looking for.")
})


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});