import { Express, Request, Response } from 'express';
import { getDataSource } from '../appDataSource';
import { CreateAuthor, UpdateAuthor } from '@teapi-poc/data/src/commands';
import AuthorEntity from '../entities/authorEntity';

/**
 * Creates a new author
 * 
 * @param req The incoming http request - expects body is json serialized CreateAuthor command
 * @param res The http response object we can send
 */
const create = async (req: Request, res: Response) => {
    try {
        const dbCon = await getDataSource();
        const command: CreateAuthor = req.body;
        // todo: validate command here

        let author = new AuthorEntity();
        author.displayName = command.displayName;

        author = await dbCon.manager.save(author);

        await res.status(201).send(author);
    } catch(err: any) {
        console.log('Error:', err);

        res.status(400).send({
            message: 'Failed to create new author',
            innerError: err.originalError?.info?.message
        });
    }
};

/**
 * Generic get / listing action
 * 
 * @param req The incoming http request
 * @param res The http response object we can send
 */
const get = async (req: Request, res: Response) => {
    const dbCon = await getDataSource();

    // todo: could add pagination, filtering and sorting here...
    const authors = await dbCon.getRepository(AuthorEntity)
        .createQueryBuilder("author_entity")
        .getMany();

    await res.status(200).send(authors);
};

/**
 * Gets a specific author by route provided id
 * 
 * @param req The incoming http request - expects params.authorId
 * @param res The http response object we can send
 */
const getById = async (req: Request, res: Response) => {
    const dbCon = await getDataSource();
    const id = req.params.authorId;

    const author = await dbCon.getRepository(AuthorEntity)
        .createQueryBuilder("author_entity")
        .where("id = :id", { id })
        .getOne();

    if (!author)
        await res.status(404).send({
            message: `Author not found (${id})`,
            fields: {
                id: ['No author with this id']
            }
        });
    else
        await res.status(200).send(author);
};

/**
 * Removes a given author by unique id
 * 
 * @param req The incoming http request - expects params.authorId
 * @param res The http response object we can send
 */
const remove = async (req: Request, res: Response) => {
    const dbCon = await getDataSource();
    const id = req.params.authorId;

    var author = await dbCon.getRepository(AuthorEntity)
        .createQueryBuilder("author_entity")
        .where("id = :id", { id })
        .getOne();

    if (author) 
        await dbCon.manager.remove(author);

    await res.status(200).send("Boo");
};

/**
 * Update an existing author
 * 
 * @param req The incoming http request - expects params.authorId and req.body is json serialized UpdateAuthor command
 * @param res The http response object we can send
 */
const update = async (req: Request, res: Response) => {
    const dbCon = await getDataSource();
    const id = req.params.authorId;
    const command: UpdateAuthor = req.body;

    // todo: validate command here

    let author = await dbCon.getRepository(AuthorEntity)
        .createQueryBuilder("author_entity")
        .where("id = :id", { id })
        .getOne();

    if (!author) {
        await res.status(404).send({
            message: `Author not found (${id})`,
            fields: {
                id: ['No author with this id']
            }
        });
    } else {
        author.displayName = command.displayName;
        author = await dbCon.manager.save(author);
        await res.status(200).send(author);
    }
};

/**
 * Call this with the main Express app to register /api/author endpoint routes
 * 
 * @param app The express app to register our routes with
 * @returns The provided express app to allow chaining in a builder pattern
 */
const registerAuthorEndpoints = (app: Express): Express => {
    console.log('-- Registering author endpoint');
    return app
        .delete('/api/author/:authorId', remove)
        .get('/api/author/:authorId', getById)
        .get('/api/author', get)
        .post('/api/author', create)
        .put('/api/author/:authorId', update);
};

export default registerAuthorEndpoints;
