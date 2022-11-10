import * as sql from 'mssql';
import dotenv from 'dotenv';
import { IParams } from '../interfaces/IParams';
import { httpResponseError } from '../middleware/httpResponseError';

class DB {
  public config: sql.config;

  constructor() {
    dotenv.config();
    this.config = {
      user: process.env.MS_USER,
      password: process.env.MS_PASSWORD,
      database: process.env.MS_DATABASE,
      server: process.env.MS_HOST !== undefined ? process.env.MS_HOST : "127.0.0.1",
      port: Number(process.env.MS_PORT),
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: false,
        trustServerCertificate: false
      }
    };
  }

  async Execute(procedure: string, params: IParams[] = []): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let pool!: sql.ConnectionPool;

      try {
        pool = await new sql.ConnectionPool(this.config).connect();
      } catch (err: any) {
        console.log('ERROR EXECUTE SP', err);
        reject(new httpResponseError("can't connect to db", 500));
        return;
      }
      try {
        const query = pool.request();

        params.forEach((element) => {
          query.input(element.name, element.type, element.value);
        });

        const { returnValue, recordset } = await query.execute(procedure);

        switch (returnValue) {
          case 0:
            console.log('CONTROLLED ERROR RUN SP', recordset[0]);
            reject(new httpResponseError(recordset[0].message || 'The query could not be executed', 400));
            break;
          case 1:
            resolve(recordset);
            break;
          case -1:
            console.log('UNCONTROLLED ERROR RUN SP', recordset[0]);
            reject(new httpResponseError('The query could not be executed, an internal error occurred'));
            break;

          default:
            console.log('returnedValue SP not expected', recordset[0]);
            reject(new httpResponseError('Unexpected SP response', 500));
            break;
        }
      } catch (err: any) {
        console.log('ERROR EXECUTE SP', err);
        reject(new httpResponseError(err.message, 500));
      } finally {
        if (pool && typeof pool.close === 'function') {
          pool.close();
        }
      }
    });
  }
}

export default DB;