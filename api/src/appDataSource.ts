import { Author, Book } from "@teapi-poc/data";
import { DataSource } from "typeorm";
import AuthorEntity from "./entities/authorEntity";
import BookEntity from "./entities/bookEntity";

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

export const registerAppDataService = async (): Promise<DataSource> => {
    var dbCon = await AppDataSource.initialize();
    return dbCon;
};

export const seedBook = async (dbCon: DataSource): Promise<Book> => {
    const authors = dbCon.getRepository(AuthorEntity)
        .createQueryBuilder('author_entity');

    const books = dbCon.getRepository(BookEntity)
        .createQueryBuilder('book_entity');

        const bestBook = await books
            .where("title = :title", { title: 'Best Book' })
            .getOne();

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
