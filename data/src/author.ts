import Book from "./book";

/**
 * Our generic "Author" data model
 */
export default interface Author {
    /**
     * The books this author has written
     */
    books?: Book[];

    /**
     * Unique id of this author
     */
    id: number;

    /**
     * Unique name of this author
     */
    displayName: string;
};
