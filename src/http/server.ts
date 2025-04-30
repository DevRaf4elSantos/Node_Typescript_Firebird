import express, {Request, Response} from "express";
import cors  from "cors";
import { dbOptions } from "../config/database";
import fireBird from 'node-firebird';

const app = express();

// Middleware - Permite o uso do json
app.use(express.json());

// Middleware - Cors
app.use(cors())

app.get('/produtos', (req : Request, res : Response) =>  {
    
    
    
    
 
    
});

app.listen(3000, () => {
    console.log("Servidor online")
})