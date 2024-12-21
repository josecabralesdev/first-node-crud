import express from 'express';
import env from 'dotenv';
import mongoose from 'mongoose';
import { router as bookRoutes } from './routes/book.routes.js';
import bodyParser from 'body-parser';

env.config();

// Usamos express para los middlewares
const app = express()
app.use(bodyParser.json()) // Parseador de Bodies

// Aca conectamos la base de datos
mongoose.connect(process.env.MONGO_URL, {
  dbName: process.env.MONGO_DB_NAME,
})
const db = mongoose.connection

app.use('/books', bookRoutes)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})