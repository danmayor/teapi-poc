import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import BookEntity from './bookEntity';
import { Author, Book } from '@teapi-poc/data/src/models';

/**
 * Our persistence representation (Entity) of an author
 */
@Entity()
export default class AuthorEntity implements Author {
    /**
     * Configures OneToMany between author and books
     */
    @OneToMany(() => BookEntity, (book) => book.author)
    books?: Book[] | undefined;

    /**
     * DB Generated ID
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Constrains the name
     */
    @Column({ length: 100, unique: true })
    displayName: string;
};
