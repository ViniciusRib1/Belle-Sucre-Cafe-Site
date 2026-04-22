const db = require('../db');

const Produto = {
    create: (produto, callback) => {
        const sql = "INSERT INTO produtos (nome, preco, imagem) VALUES (?, ?, ?)";
        db.query(sql, [produto.nome, produto.preco, produto.imagem], callback);
    },
    findAll: (callback) => {
        const sql = "SELECT * FROM produtos";
        db.query(sql, callback);
    }
};

module.exports = Produto;