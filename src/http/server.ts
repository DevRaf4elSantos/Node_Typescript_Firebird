import express, {Request, Response} from "express";
import cors  from "cors";
import { executeQuery,firebird, dbOptions, executeTransecctions } from "../config/database";
import e from "express";
import { log } from "console";

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

    let ssql : string = 'INSERT INTO TAB_PRODUTOS(PROD_DESCRICAO, VALOR) VALUES (?, ?) returning PROD_ID'
    
    executeQuery(ssql, [req.body.descricao, req.body.preco], function(err : Error | null, result ?: Array<any>) {
        if(err){
            return res.status(500).json(err);
        } else {
            res.status(201).json({ result })
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

app.post('/pedidos', (req : Request, res : Response) =>  {
    
     firebird.attach(dbOptions, function (err, db) {
       if(err){
            return res.status(500).json(err)
       }    

        db.transaction(firebird.ISOLATION_READ_COMMITTED, async (err : Error | null, transaction ?: firebird.Transaction) => {
           
           if(err){
               return res.status(500).json(err)
           }
           
           try{
                let ssql =  'insert into tab_pedidos(id_cliente, valor_pedido) values(?, ?) returning id_pedidos' ;
                
                const ret = await  executeTransecctions(transaction, ssql, [req.body.id_cliente, req.body.valor])
                let id = ''; 
                
                if(ret != undefined ){
                    id = ret.ID_PEDIDOS 
                }

                for(let i = 0; i < req.body.item.length; i++){
                    let ssql2 = 'insert into tab_pedido_item(id_pedido, prod_id, qtd_produto, valor_unit, valor_total) values(?, ?, ?, ?, ?) returning id_item, id_pedido' ;
                    
                    const returno = await executeTransecctions(transaction, ssql2, [id, req.body.item[i].id_produto, req.body.item[i].qtd_produto, req.body.item[i].valor_unit, req.body.item[i].total_pedido ])
                    
                    console.log(returno)
                    
                }


                transaction?.commit((error : Error)=>{
                    console.log('entrou transaction commit')
                    if(error){
                        console.log('entrou transaction rollback')
                        transaction.rollback();
                        res.send(500).json(error +  '  entrou aqui ')
                    } else {

                        res.status(201).json({id})
                    }
                })


           }catch(error){
                console.log('Entrou no catch');
                
                transaction?.rollback()
                res.status(500).json(error)
           }
       })
    })
});

app.listen(3000, () => {
    console.log("Servidor online")
})