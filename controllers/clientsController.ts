import { Request, Response } from "express";
import { getClientsAll,  getClientById, postClient, putClient, delClient } from "../services/clientsService";

export const getAll = async (_req: Request, res: Response) => {
    try{
        const clients = await getClientsAll();
        res.status(200).json(clients)
    }catch(error: any){
        res.status(404).json({error:error.message});
    }
}

export const getById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const client = await getClientById(Number(id));
        res.status(200).json(client)
    }catch(error: any){
        res.status(404).json({error:error.message});
    }
}

export const post = async (req: Request, res: Response) => {
    try{
        const client = await postClient(req.body);
        res.status(201).json(client);
    }catch(error: any){
        res.status(409).json({error:error.message});
    }
}

export const put = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        if (!(id)) {
            return res.status(400).send("Id for put is required");
        }

        const client = await putClient(req.body);

        res.status(201).json(client);
    }catch(error: any){
        res.status(409).json({error:error.message});
    }
}

export const del = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        if (!(id)) {
            res.status(400).send("Id Client is required");
        }

        await delClient(Number(id));

        res.status(202).json(id);
    }catch(error: any){
        res.status(409).json({error:error.message});
    }
}
