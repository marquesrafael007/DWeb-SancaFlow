const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Headers, Request, Response } = require('node-fetch');

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());
const port = 3000;

const instituicao = [
    {nome, CNPJ, endereço, CEP, telefone}
]
app.post('/instituicao', async(req, res) =>{
    const novaInstituicao = req.body;

    if(!Nome || !CNPJ || !Endereço || !CEP || !Telefone){
        return res.status(400).json({ error: 'Nome, CNPJ, endereço, CEP e telefone são obrigatórios'});
    }

    const { data, error} = await supabase
    .from('instituicao')
    .insert([{instituicao}]);

    if(error){
        return res.status(500).json({ error: error.message});

    }

    return res.status(201).json({ message: 'Instituição inserida com sucesso', data});
});

app.get('/instituicao', async(req, res) =>{
    const { data, error} = await supabase
    .from('instituicao')
    .insert([{instituicao}])
    .select('*');

    if(error){
        return res.status(500).json({ error: error.message});
    }

    return res.status(200).json(instituicao);
});

app.listen(port,() => {
    console.log(`Servidor rodando em https://localhost:${port}`);
})