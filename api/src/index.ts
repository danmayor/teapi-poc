import express, { Request, Response } from 'express';
import { getDataSource, seedBook } from './appDataSource';
import BookEntity from './entities/bookEntity';
import registerAuthorEndpoints from './endpoints/authorEndpoint';

/**
 * This is our async entry point for the entire application, it's verbose on the command line
 * as it starts up explaining step by step what it's doing...
 */
(async () => {
    // App start, prepare database...
    console.log('Application startup...');
    console.log('- Preparing database...')
    const dbCon = await getDataSource();
    await seedBook(dbCon);

    // Prepare host...
    console.log('- Preparing app host...');
    const app = express();
    const port = 3000;

    // Register endpoints
    console.log('- Registering endpoints...')
    app.use(express.json());
    registerAuthorEndpoints(app)

    // Launch app host and listen for traffic
    console.log('- Launching server...')
    app.listen(port, async () => {
        // Grab our best book just to ensure DB is good
        const books = dbCon.getRepository(BookEntity)
            .createQueryBuilder('book_entity');

        const bestBook = await books
            .leftJoinAndSelect('book_entity.author', 'author')
            .where('title = :title', { title: 'Best Book' })
            .getOne();

        console.log(`> We're online at http://localhost:${port}`);
        console.log('> Check out our book!', bestBook);
    });
})();
