import express, {Request, Response} from "express";
import cors  from "cors";
import { executeQuery } from "../config/database";


const app = express();

// Middleware - Permite o uso do json
app.use(express.json());

// Middleware - Cors
app.use(cors())

app.get('/produtos', (req : Request, res : Response) =>  {

    let params : string[] = []
    let ssql : string = 'SELECT * FROM TAB_PRODUTOS WHERE PROD_ID > 0 '

    if(req.query.descricao ){
        ssql += ' and PROD_DESCRICAO like ?';
        params.push("%" + req.query.descricao.toString().toUpperCase() + "%")
    }
    console.log(params[0]);
    console.log(ssql)
    
    executeQuery(ssql, params, function(err : Error | null, result ?: Array<any>) {
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