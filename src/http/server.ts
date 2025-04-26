import express from "express";
import cors  from "cors";

const app = express();

// Middleware - Permite o uso do json
app.use(express.json());

// Middleware - Cors
app.use(cors())

app.get('/', (req, res) => {
res.status(200).send("Retornar lista de produtos, teste")
    
});

app.listen(3000, () => {
    console.log("Servidor online")
})