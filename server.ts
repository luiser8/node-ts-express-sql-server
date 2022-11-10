import express, { Application, Request, Response } from 'express';
import body_parser from 'body-parser';
import compression from 'compression';
import createError from 'http-errors';
import morgan from 'morgan';
import cors from 'cors';
import path from'path';
import clientsRouter from './routes/clientsRouter';

class Server {
    private app: Application;
    private port: string;
    private paths = {
        clients: "/api/v1/clients/"
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || "9091";
        this.config();
        this.views();
        this.routes();
        this.errorHandler();
    }

    config(){
        this.app.use(compression());
        this.app.use(morgan('combined'));
        this.app.use(cors());
        this.app.use(body_parser.json());
        this.app.use(body_parser.urlencoded({ extended: true }));
    }

    views(){
        const __dirname = path.dirname('views');
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
    }

    routes(){
        this.app.get('/', (_, res) => {
            res.render('index', { error: false, message:'node-ts-express-sql-server' })
        });
        this.app.use(this.paths.clients, clientsRouter);
    }

    errorHandler(){
        this.app.use((_, __, next) => {
            next(createError(404));
        });
        this.app.use((err: any, req: Request, res: Response) => {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            res.status(err.status || 500);
            res.render('error');
        });
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Server running in port ${this.port}`);
        });
    }
}

export default Server;