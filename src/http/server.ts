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
    
    fireBird.attach(dbOptions, function (err, db) {
        if(err){
            return res.status(500).json(err);
        }
        
        db.query('SELECT * FROM TAB_PRODUTOS', [], function(erro, result){
            db.detach();

            if(erro){
                return res.status(500).json(erro)
            } else {
                return res.status(200).json(result)
            }

        })
    })
    
    
 
    
});

app.listen(3000, () => {
    console.log("Servidor online")
})