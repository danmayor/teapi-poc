import { Author, Book } from "@teapi-poc/data/src/models";
import AuthorEntity from "./authorEntity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

/**
 * Out persistence representation (Entity) of a book
 */
@Entity()
export default class BookEntity implements Book {
    /**
     * Configures ManyToOne between books and author
     */
    @ManyToOne(() => AuthorEntity, (author) => author.books)
    author: Author;

    /**
     * Configures the FK column for our author relation
     */
    @Column()
    authorId: number;

    /**
     * Configures an optional description
     */
    @Column({ length: 2000, nullable: true })
    description?: string;

    /**
     * DB Generated ID
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Constrains the title
     */
    @Column({ length: 100, unique: true })
    title: string;
};
