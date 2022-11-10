import { Router } from "express";
import { getAll, getById, post, put, del } from "../controllers/clientsController";

const clientsRouter = Router();

clientsRouter.get("/", getAll);
clientsRouter.get("/:id", getById);
clientsRouter.post("/", post);
clientsRouter.put("/:id", put);
clientsRouter.delete("/:id", del);

export default clientsRouter;
