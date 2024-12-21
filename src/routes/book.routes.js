import express from 'express';
import Book from '../models/book.model.js';

export const router = express.Router();

// Middleware
const getBook = async (req, res, next) => {
  let book
  const { id } = req.params

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid ID' })
  }

  try {
    book = await Book.findById(id)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

  req.book = book
  next()
}

// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
  try {
    const books = await Book.find()
    console.log('GET ALL', books)
    if (books.length === 0) {
      return res.status(204).json([])
    }
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Crear un nuevo libro (recurso) [POST]
router.post('/', async (req, res) => {
  const { title, author, genre, publication_date } = req?.body
  if (!title || !author || !genre || !publication_date) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const book = new Book({
    title,
    author,
    genre,
    publication_date,
  })

  try {
    const newBook = await book.save()
    console.log(newBook)
    res.status(201).json(newBook)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', getBook, async (req, res) => {
  res.json(req.book)
})

router.put('/:id', getBook, async (req, res) => {
  try {
    const book = res.book
    book.title = req.body.title || book.title
    book.author = req.body.author || book.author
    book.genre = req.body.genre || book.genre
    book.publication_date = req.body.publication_date || book.publication_date

    const updatedBook = await book.save()
    res.json(updatedBook)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/:id', getBook, async (req, res) => {
  if (
    !req.body.title &&
    !req.body.author &&
    !req.body.genre &&
    !req.body.publication_date
  ) {
    res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const book = res.book
    book.title = req.body.title || book.title
    book.author = req.body.author || book.author
    book.genre = req.body.genre || book.genre
    book.publication_date = req.body.publication_date || book.publication_date

    const updatedBook = await book.save()
    res.json(updatedBook)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', getBook, async (req, res) => {
  try {
    const book = res.book
    await book.deleteOne({
      _id: req.book._id,
    })
    res.json({ message: `Book ${book.title} deleted` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})