import dotnev from "dotenv";
import Server from "./server";

dotnev.config();

new Server().listen();