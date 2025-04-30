import express, {Request, Response} from "express";
import cors  from "cors";
import { executeQuery } from "../config/database";


const app = express();

// Middleware - Permite o uso do json
app.use(express.json());

// Middleware - Cors
app.use(cors())

app.get('/produtos', (req : Request, res : Response) =>  {
    
    executeQuery('SELECT * FROM TAB_PRODUTOS', [], function(err : Error | null, result ?: Array<any>) {
        if(err){
            return res.status(500).json(err);
        } else {
            res.status(200).json(result);
        }
    })
});

app.listen(3000, () => {
    console.log("Servidor online")
})