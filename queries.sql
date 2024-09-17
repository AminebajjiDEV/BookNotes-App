CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_in_watchlist BOOLEAN DEFAULT FALSE,
    isbn VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- here is a simple example of how to insert the book data on your db

INSERT INTO books (title, author, rating, read_at, is_read, is_in_watchlist, isbn, genre)
VALUES 
    -- 4 books with rating > 3, marked as read with different timestamps
    ('Project Hail Mary', 'Andy Weir', 5, '2023-07-25 12:30:00', TRUE, FALSE, '9780593135204', 'Science Fiction'),
    ('The Song of Achilles', 'Madeline Miller', 4, '2023-08-10 09:45:00', TRUE, FALSE, '9780062060624', 'Historical Fiction'),
    ('Circe', 'Madeline Miller', 5, '2023-07-05 18:15:00', TRUE, FALSE, '9780316556347', 'Fantasy'),
    ('A Man Called Ove', 'Fredrik Backman', 4, '2023-09-01 14:00:00', TRUE, FALSE, '9781476738024', 'Contemporary Fiction'),

    -- 3 books not read and on the watchlist
    ('Dune', 'Frank Herbert', NULL, NULL, FALSE, TRUE, '9780441172719', 'Science Fiction'),
    ('The House in the Cerulean Sea', 'TJ Klune', NULL, NULL, FALSE, TRUE, '9781250217288', 'Fantasy'),
    ('Normal People', 'Sally Rooney', NULL, NULL, FALSE, TRUE, '9781984822178', 'Contemporary Fiction'),

    -- 3 books with rating <= 3
    ('The Great Gatsby', 'F. Scott Fitzgerald', 3, '2023-05-22 16:00:00', TRUE, FALSE, '9780743273565', 'Classic Literature'),
    ('The Alchemist', 'Paulo Coelho', 2, '2023-04-10 11:45:00', TRUE, FALSE, '9780062315007', 'Philosophical Fiction'),
    ('Frankenstein', 'Mary Shelley', 3, '2023-06-01 20:15:00', TRUE, FALSE, '9780486282114', 'Horror');
