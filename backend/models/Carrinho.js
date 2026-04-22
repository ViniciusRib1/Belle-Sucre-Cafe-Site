// Exemplo de Model utilizando uma conexão de banco de dados
const db = require('../db');

const Carrinho = {
    adicionar: (usuarioId, produtoId, callback) => {
        const sql = "INSERT INTO carrinho (usuario_id, produto_id) VALUES (?, ?)";
        return db.query(sql, [usuarioId, produtoId], callback);
    }
};

module.exports = Carrinho;