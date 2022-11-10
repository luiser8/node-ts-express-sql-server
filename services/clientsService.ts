import '../config/database';
import * as sql from 'mssql';
import DB from '../config/database';
import IClient from '../interfaces/IClient';
import { IParams } from '../interfaces/IParams';
import { ClientScheme } from '../schemes/clientScheme';

export const getClientsAll = async () => {
    try {
        const db = new DB();
        return await db.Execute('sp_clients_select');
    } catch (error) {
        return error;
    }
};

export const getClientById = async (id: number) => {
    try {
        const params: IParams[] = [
            {
                name: 'id_client',
                type: sql.Int,
                value: id
            }
        ];
        const db = new DB();
        return await db.Execute('sp_clients_select_id', params);
    } catch (error) {
        return error;
    }
};

export const postClient = async (client: IClient) => {
    try {
        await ClientScheme.validate(client);
    } catch (error) {
        return error;
    }

    try {
        const { first_name, last_name, address } = client;

        const params: IParams[] = [
            {
                name: 'first_name',
                type: sql.VarChar,
                value: first_name
            },
            {
                name: 'last_name',
                type: sql.VarChar,
                value: last_name
            },
            {
                name: 'address',
                type: sql.VarChar,
                value: address
            }
        ];

        const db = new DB();
        return await db.Execute('sp_clients_insert', params);

    } catch (error) {
        return error;
    }
};

export const putClient = async (client: IClient) => {
    try {
        await ClientScheme.validate(client);
    } catch (error) {
        return error;
    }

    try {
        const { id, first_name, last_name, address } = client;

        const params: IParams[] = [
            {
                name: 'id_client',
                type: sql.Int,
                value: id
            },
            {
                name: 'first_name',
                type: sql.VarChar,
                value: first_name
            },
            {
                name: 'last_name',
                type: sql.VarChar,
                value: last_name
            },
            {
                name: 'address',
                type: sql.VarChar,
                value: address
            }
        ];

        const db = new DB();
        return await db.Execute('sp_clients_update', params);

    } catch (error) {
        return error;
    }
};

export const delClient = async (id: number) => {
    try {
        const params: IParams[] = [
            {
                name: 'id_client',
                type: sql.Int,
                value: id
            }
        ];

        const db = new DB();
        return await db.Execute('sp_clients_delete', params);
    } catch (error) {
        return error;
    }
};
