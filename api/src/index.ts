import express, { Request, Response } from 'express';
import { Author, Book } from '@teapi-poc/data';

const app = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello world');
});

app.listen(port, () => {
    console.log(`We're online at http://localhost:${port}`);

    const author: Author = {
        id: 1,
        name: 'Dan Mayor'
    };

    const book: Book = {
        author,
        description: 'Best book ever written',
        id: 1,
        title: 'BestBook'
    };

    console.log('Come see our book!', book);
});
