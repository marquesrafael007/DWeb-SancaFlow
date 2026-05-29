const express = require('express');
const path = require('path');
const app = require('./api/index.js');

// Servir arquivos estáticos (CSS, Imagens, etc)
app.use(express.static(__dirname));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Servir o index.html na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
