const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// Router para API
const apiRouter = express.Router();

// Rota GET para listar instituições (quando não há ID específico)
apiRouter.get('/instituicao', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Instituições')
            .select('*');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error('Erro ao carregar instituições:', e);
        res.status(500).json({ error: e.message });
    }
});

// ROTA POST: Para inserir uma nova instituição
apiRouter.post('/instituicao', async (req, res) => {
    console.log("Corpo recebido:", req.body);

    const { Nome, CNPJ, Endereço, CEP, Telefone } = req.body;

    if (!Nome || !CNPJ || !Endereço || !CEP || !Telefone) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const { data, error } = await supabase
        .from('Instituições')
        .insert([{ Nome, CNPJ, Endereço, CEP, Telefone }]);

    if (error) {
        console.log("Erro do Supabase:", error);
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Instituição inserida com sucesso', data });
});

// ROTA DELETE
apiRouter.delete('/instituicao/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Instituições')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Excluído com sucesso!' });
});

// ROTA PUT
apiRouter.put('/instituicao/:id', async (req, res) => {
    const { id } = req.params;
    const { Nome, CNPJ, Endereço, CEP, Telefone } = req.body;

    const { data, error } = await supabase
        .from('Instituições')
        .update({ Nome, CNPJ, Endereço, CEP, Telefone })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Atualizado com sucesso!', data });
});

// Usar o router para todas as rotas da API
app.use('/api', apiRouter);

// Rota para servir index.html na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Listener para desenvolvimento local
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;
