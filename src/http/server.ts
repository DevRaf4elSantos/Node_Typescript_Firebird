import express, {Request, Response} from "express";
import cors  from "cors";
import { executeQuery } from "../config/database";

const app = express();

// Middleware - Permite o uso do json
app.use(express.json());

// Middleware - Cors
app.use(cors())

// Middleware Recebendo Objetos Complexos e transformando em string
app.use(express.urlencoded({ extended: true }))

app.get('/produtos', (req : Request, res : Response) =>  {

    let params : string[] = []
    let ssql : string = 'SELECT * FROM TAB_PRODUTOS WHERE PROD_ID > 0 '

    // Quando for pegar(GET) baseado em texto lembre-se de colocar %
    if(req.query.descricao ){
        ssql += ' and PROD_DESCRICAO like ?';
        params.push("%" + req.query.descricao.toString().toUpperCase() + "%")
    }
    
    // Quando for pegar(GET) UM VALOR NÚMERICO BUSQUE RETIRAR O % E ADICIONAR O to.String()
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

app.post('/produtos', (req : Request, res : Response) =>  {

    let ssql : string = 'INSERT INTO TAB_PRODUTOS(PROD_DESCRICAO, VALOR) VALUES (?, ?)'
    
    executeQuery(ssql, [req.body.descricao, req.body.preco], function(err : Error | null, result ?: Array<any>) {
        if(err){
            return res.status(500).json(err);
        } else {
            res.status(201).json({Mensagem : 'Produto Criado Com Sucesso'})           
        }
    })
});

app.patch('/produtos', (req : Request, res : Response) =>  {
    
    let ssql : string = '';
    let params : string[] = [];
    
    if(req.query.id && req.body.descricao && req.body.preco){
         ssql  = 'UPDATE TAB_PRODUTOS SET PROD_DESCRICAO = ?, VALOR = ? WHERE PROD_ID = ?'
         params.push(req.body.descricao.toString().toUpperCase())
         params.push(req.body.preco.toString().toUpperCase())
         params.push(req.query.id.toString().toUpperCase())
    
    }
    else if(req.query.id && req.body.descricao){
        ssql  = 'UPDATE TAB_PRODUTOS SET PROD_DESCRICAO = ? WHERE PROD_ID = ?'
        params.push(req.body.descricao.toString().toUpperCase())
        params.push(req.query.id.toString().toUpperCase())
    }
    else if(req.query.id  && req.body.preco){
        ssql  = 'UPDATE TAB_PRODUTOS SET VALOR = ? WHERE PROD_ID = ?'
        params.push(req.body.preco.toString().toUpperCase())
        params.push(req.query.id.toString().toUpperCase())
    }
    else if(req.query.id ){
        res.json({ mensage : "Infelizmente não pudemos atualizar o valor solicitado"})
    }
    
    executeQuery(ssql, params, function(err : Error | null, result ?: Array<any>) {
        if(err){
            return res.status(500).json(err);
        } else {
           
            res.status(200).json({Mensagem : 'Produto Atualizado Com Sucesso'})
           
        }
    })
});

app.delete('/produtos', (req : Request, res : Response) =>  {

    let params : string[]= []
    if(req.query.id){
       params.push(req.query.id.toString())
        executeQuery('DELETE FROM TAB_PRODUTOS WHERE PROD_ID = ?', params, function(err : Error | null, result ?: Array<any>) {
            if(err){
                return res.status(500).json(err);
            } else {
                res.status(200).json({Mensagem : 'Produto Removido com Sucesso!'})
            }
        }
    )}
});


app.listen(3000, () => {
    console.log("Servidor online")
})