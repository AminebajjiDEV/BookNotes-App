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
async function getRead() { // get only read books by latest date
    const result = await db.query(
        `SELECT id, title, author, rating, read_at, genre, isbn
            FROM books
           WHERE is_read = TRUE
           ORDER BY read_at DESC;`
    );
    return result.rows;
}


app.get("/", async (req, res) => { // get only read books by latest date
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

async function getRating() { // get rating of read books and order by descending
    const result = await db.query(`SELECT id, title, author, rating, read_at, genre, isbn
        FROM books
        WHERE is_read = TRUE
        ORDER BY rating DESC;`);
    return result.rows;
}


app.get("/byRating", async (req, res) => {  // get rating of read books and order by descending
    try {
        const ratedBooks = await getRating();
        console.log("Rated books :", ratedBooks);
        res.render("index.ejs", {
            books: ratedBooks,
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


async function getTitle() { // get titles of read books by Alphabetical order
    const result = await db.query(`SELECT id, title, author, rating, read_at, genre, isbn
        FROM books
        WHERE is_read = TRUE
        ORDER BY title ASC;`);
    return result.rows;
}

app.get("/byTitle", async (req, res) => { // get titles of read books by Alphabetical order
    try {
        const orderByTitle = await getTitle();
        console.log("Books ordered by title ASC :", orderByTitle);
        res.render("index.ejs", {
            books: orderByTitle,
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

async function getWatchList() { // get books that are on watch list
    const result = await db.query(`SELECT id, title, author, rating,  genre, isbn
        FROM books
        WHERE is_in_watchlist = TRUE
        ORDER BY title ASC;`);
    return result.rows;
}

app.get("/byWatchList", async (req, res) => { // get books that are on watch list
    try {
        const watchList = await getWatchList();
        console.log("Books that are on watch-list :", watchList);
        res.render("index.ejs", {
            books: watchList,
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


app.get("/genre", async (req, res) => { // get books by genre and display them by extracting queries
    try {
        const selectedGenre = req.query.genre; // extracting the genre from the query params because we are using get request

        const result = await db.query(`SELECT id, title, author, rating, genre, isbn
            FROM books
            WHERE genre = $1
            ORDER BY title ASC;`, [selectedGenre]); // passing the genre as a param to prevent SQL injection as a good practice

        const books = result.rows;
        console.log("Books by selected genre:", books);

        res.render("index.ejs", {
            books: books,
            error: null
        });
    } catch (err) {
        console.error("Error fetching books:", err);
        res.render("index.ejs", {
            books: [],
            error: "Sorry I haven't read any book from this Genre."
        });
    }
})




app.use(async (req, res) => { // When a user searchs for a route that doesn't exist this error message will be displayed
    res.status(404).send("Could not find what you are looking for.")
})


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});