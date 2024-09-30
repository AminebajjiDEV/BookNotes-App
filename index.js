import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pg from "pg";
import pixels from 'image-pixels';

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



// this URL is used for searching for all the informations of the book.
const searchURL = "https://openlibrary.org/search.json";

// to verify if book cover image exists 
async function checkImageUrl(isbn){

    const imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    const fallbackImage = 'images/image.png';
    const { width , height } = await pixels(imageUrl); // return width,height in PX
    if(width < 100){
        return fallbackImage;
    }
    return imageUrl
    
}

// SEARCH for books and their info from the Open Library using their API
app.post("/search", async (req, res) => {
    const book = req.body.input.trim();// used to eleminate unessecary/accidental spacing
    if (!book || (typeof book !== 'string' && typeof book !== 'number')) { // the make sure the input isn't null
        return res.status(400).send("Invalid input. Please enter a valid book title.");
    }
    console.log("Book name: ", book);
    try {
        const searchResponse = await axios.get(`${searchURL}?q=${encodeURIComponent(book)}&limit=1`); // to get all the infos of a book only from the it's title

        //here I Mapped the first book's data to a new object with only the fields I need which will enhance performace and response speed a LOT compared to getting the full response from OL API
        const firstBook = searchResponse.data?.docs?.[0] && {
            title: searchResponse.data.docs[0].title,
            author_name: searchResponse.data.docs[0].author_name?.[0], // get first author
            author_key: searchResponse.data.docs[0].author_key?.[0],   // get first author key for author picture
            first_publish_year: searchResponse.data.docs[0].first_publish_year,
            isbn: searchResponse.data.docs[0].isbn?.[0],                // get fourth ISBN for book cover
            subject: searchResponse.data.docs[0].subject?.[0],  //  get first subject which is the genre
            first_sentence: searchResponse.data.docs[0].first_sentence?.[0], // get first sentence of the book
        };
        console.log("book isbn: ", firstBook.isbn);

        if (!firstBook) {
            return res.status(404).render("booksInfo.ejs", { error: "No book found by that entry. Please try again with a different book." });
        }

        // Get valid image URL or fallback image
        const imageUrl = await checkImageUrl(firstBook.isbn);


        res.render("booksInfo.ejs", {
            searchResult: { ...firstBook, imageUrl },
            error: null,
        });
        console.log("Data sent to EJS:", { searchResult: firstBook });

    } catch (err) {
        console.error("Error fetching books data:", err);
        res.status(500).render("booksInfo.ejs", { error: "No book found by that entry. Please try again with a different book." });
    }
})



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
    const result = await db.query(`SELECT id, title, author, rating, genre, isbn
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


app.get("/opinion", async (req, res) => {
    try {
        const selectedId = req.query.id; // extracting the book id from the query params to help identify the book and search for the users opinion on the db.

        const result = await db.query(`SELECT id, title, author, rating, genre, isbn, opinion 
            FROM books
            WHERE id = $1;`, [selectedId]); // passing the book id as a param to prevent SQL injection as a good practice

        const opinionResults = result.rows;
        console.log("Book opinion data is : ", opinionResults)

        res.render("bookReview.ejs", {
            book: opinionResults[0],// to access the first book of the array so the data can be displayed on my EJS file. PS: i'm still trying to figure out why i should use the [0] even tho it's only returning one book.
            error: null
        });


    } catch (err) {
        console.error("Error fetching books:", err);
        res.render("index.ejs", {
            books: [],
            error: "Sorry I haven't written an opinion for this book just yet."
        });
    }
})


app.use(async (req, res) => { // When a user searchs for a route that doesn't exist this error message will be displayed
    res.status(404).send("Could not find what you are looking for.")
})


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});