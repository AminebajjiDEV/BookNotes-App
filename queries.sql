CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_in_watchlist BOOLEAN DEFAULT FALSE,
    isbn VARCHAR(20),
    opinion text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- here is a simple example of how to insert the book data on your db

INSERT INTO books (title, author, rating, read_at, is_read, is_in_watchlist, isbn, genre, opinion)
VALUES 
    -- Fiction
    ('Meditations', 'Marcus Aurelius', 5, '2023-08-20 09:00:00', TRUE, FALSE, '9780140449334', 'Fiction', 'A timeless work by the Roman Emperor that serves as a guiding manual for life, offering invaluable insights into how to remain steadfast in the face of adversity. Its blend of philosophical wisdom and personal reflection provides deep clarity on handling life’s challenges with resilience and grace.'),
    
    -- Self Help
    ('The Obstacle is the Way', 'Ryan Holiday', 5, '2023-07-30 13:45:00', TRUE, FALSE, '9781591846352', 'Self Help', 'Ryan Holiday brilliantly applies the ancient Stoic philosophy of turning obstacles into opportunities. With practical examples and historical anecdotes, this book offers an actionable approach to handling challenges, giving readers the tools to cultivate a more resilient mindset and a calm attitude in the face of adversity.'),
    
    -- Autobiography
    ('Man\'s Search for Meaning', 'Viktor Frankl', 5, '2023-09-10 16:00:00', TRUE, FALSE, '9780807014295', 'Autobiography', 'This powerful memoir by Viktor Frankl is a profound reflection on how to find meaning in the darkest of times. Surviving the Holocaust, Frankl emphasizes that life’s hardships can be endured if we focus on meaning and purpose, a message that deeply resonates with stoic ideals of inner strength and perspective.'),
    
    -- Science
    ('Cosmos', 'Carl Sagan', 4, '2023-08-01 19:00:00', TRUE, FALSE, '9780345331359', 'Science', 'Carl Sagan’s monumental work explores the wonders of the universe, encouraging readers to think beyond the confines of their personal lives and see their place in the vastness of the cosmos. For a stoic, this book offers a humbling perspective on the insignificance of individual problems compared to the grand scale of existence.'),
    
    -- Dystopian
    ('Brave New World', 'Aldous Huxley', 4, '2023-07-15 18:45:00', TRUE, FALSE, '9780060850524', 'Dystopian', 'In a world where pleasure and ignorance reign supreme, Huxley offers a chilling reflection on the consequences of losing individual agency. This book invites stoic readers to consider the importance of personal freedom, autonomy, and how the pursuit of virtue can stand against societal complacency.'),
    
    -- Thriller
    ('The Stranger', 'Albert Camus', 5, '2023-06-28 15:10:00', TRUE, FALSE, '9780679720201', 'Thriller', 'Camus’ existential masterpiece delves into the life of an indifferent man confronted with absurdity. This novel reflects stoic themes like acceptance of fate and detachment from emotional turmoil, offering deep insight into the nature of existence and how to remain composed in the face of life’s uncertainties.'),
    
    -- Fantasy
    ('The Way of Kings', 'Brandon Sanderson', 4, '2023-08-05 12:15:00', TRUE, FALSE, '9780765326355', 'Fantasy', 'This epic fantasy novel presents the journey of characters facing insurmountable odds and personal growth. Its stoic underpinnings can be seen in the characters’ struggles with duty, responsibility, and resilience, all themes central to the stoic philosophy of embracing hardship to grow stronger.'),
    
    -- Fiction
    ('Siddhartha', 'Hermann Hesse', 5, '2023-08-18 09:30:00', TRUE, FALSE, '9780553208849', 'Fiction', 'Hesse’s novel tells the story of a man seeking enlightenment, balancing the desires of the world with a deeper understanding of peace. Its narrative intertwines stoic principles of self-reflection, acceptance, and the search for personal meaning, all while engaging readers with timeless, philosophical prose.'),
    
    -- Self Help
    ('Stillness is the Key', 'Ryan Holiday', 4, '2023-07-12 17:10:00', TRUE, FALSE, '9780525538585', 'Self Help', 'Holiday returns with another gem that promotes the idea of finding peace and stillness amid the chaos of modern life. Grounded in stoic philosophy, this book teaches readers how to cultivate inner calm and reflect deeply on what truly matters, offering a toolkit for navigating life’s pressures with stoic calm.'),
    
    -- Science
    ('The Elegant Universe', 'Brian Greene', 4, '2023-07-25 14:20:00', TRUE, FALSE, '9780393338102', 'Science', 'This book presents a masterful exploration of string theory and quantum mechanics. For a stoic, Greene’s explanation of the complexities of the universe encourages reflection on how little control we truly have over reality, promoting the idea that calm and acceptance are necessary when faced with the unknowable forces of the cosmos.');
