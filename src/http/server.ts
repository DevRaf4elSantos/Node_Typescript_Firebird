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

    // Quando for pegar(GET) baseado em texto lembre-se de colocar %
    if(req.query.descricao ){
        ssql += ' and PROD_DESCRICAO like ?';
        params.push("%" + req.query.descricao.toString().toUpperCase() + "%")
    }
    
    // Quando for pegar(GET) UM VALOR NÚMERICO BUSQUE RETIRAR O % E ADICIONAR O TOSTRING
    if(req.query.preco){
        ssql += ' and VALOR > ?';
        params.push(req.query.preco.toString())
    }

    
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