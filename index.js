import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from 'dotenv';

const app = express();
const port = 3000;

config();
const filename = "database.db";
console.log(filename);
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

class Book extends Model { }
Book.init({
    autor: DataTypes.STRING,
    isbn: DataTypes.INTEGER,
    editorial: DataTypes.STRING,
    paginas: DataTypes.INTEGER
}, { sequelize, modelName: 'book' });

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Get all books.
 * @name GET /book
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/book', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Get a book by ID.
 * @name GET /book/:id
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Book ID.
 * @param {Object} res - Express response object.
 */
app.get('/book/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Create a new book.
 * @name POST /book
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.autor - Book author.
 * @param {number} req.body.isbn - Book ISBN.
 * @param {string} req.body.editorial - Book editorial.
 * @param {number} req.body.paginas - Number of pages.
 * @param {Object} res - Express response object.
 */
app.post('/book', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Update a book by ID.
 * @name PUT /book/:id
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Book ID.
 * @param {Object} req.body - Request body.
 * @param {string} [req.body.autor] - Book author.
 * @param {number} [req.body.isbn] - Book ISBN.
 * @param {string} [req.body.editorial] - Book editorial.
 * @param {number} [req.body.paginas] - Number of pages.
 * @param {Object} res - Express response object.
 */
app.put('/book/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Delete a book by ID.
 * @name DELETE /book/:id
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Book ID.
 * @param {Object} res - Express response object.
 */
app.delete('/book/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Starts the server on the specified port.
 * @function
 * @memberof module:app
 */
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
