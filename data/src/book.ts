import Author from "./author";

/**
 * Our generic "Book" data model
 */
export default interface Book {
    /**
     * Author of this book
     */
    author: Author;

    /**
     * Optional description of this book
     */
    description?: string;

    /**
     * Unique id of this book
     */
    id: number;

    /**
     * Unique title of this book
     */
    title: string;
};
