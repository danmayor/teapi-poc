import { DataSource } from "typeorm";
import AuthorEntity from "./entities/authorEntity";
import BookEntity from "./entities/bookEntity";
import { Book } from "@teapi-poc/data/src/models";

/**
 * We use this so we don't attempt to synchronize the database every endpoint,
 * it's a cached reference to our TypeORM DataSource
 */
let dbCon: DataSource | undefined;

/**
 * This is our custom TypeORM data source configuration
 */
const AppDataSource = new DataSource({
    type: "mssql",
    host: "localhost",
    username: "teapi",
    password: "teapipass",
    database: "teapi",

    entities: [__dirname + '/entities/*{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: true,
    logging: false, 

    options: {
        encrypt: true,
        trustServerCertificate: true
    }
});

/**
 * This method will return a valid data source, either from cache or
 * freshly connected, initialized and synchronized.
 * 
 * @returns DataSource
 */
export const getDataSource = async (): Promise<DataSource> => {
    if (!dbCon)
        dbCon = await AppDataSource.initialize();

    return dbCon;
};

/**
 * A little helper method that seeds an initial author and book
 * 
 * @param dbCon The DataSource to persist seed data to
 * @returns The book created (with author joined)
 */
export const seedBook = async (dbCon: DataSource): Promise<Book> => {
    const authors = dbCon.getRepository(AuthorEntity)
        .createQueryBuilder('author_entity');

    const books = dbCon.getRepository(BookEntity)
        .createQueryBuilder('book_entity');

    let author = await authors
        .where('displayName = :displayName', { displayName: 'Best Author' })
        .getOne();
    
    if (!author) {
        author = new AuthorEntity();
        author.displayName = 'Best Author';

        author = await dbCon.manager.save(author);

        console.log('-- Inserted', author);
    }

    let book = await books
        .where('title = :title', { title: 'Best Book' })
        .getOne();

    if (!book) {
        book = new BookEntity();
        book.authorId = author.id;
        book.description = 'Best damn book ever';
        book.title = 'Best Book';

        book = await dbCon.manager.save(book);

        console.log('-- Inserted', book);
    }

    return book;
}

export default AppDataSource;
