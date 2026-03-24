// Exemplo de Model utilizando uma estrutura de banco de dados fictícia
const db = require('../config/database');

const Carrinho = {
    adicionar: async (usuarioId, produtoId) => {
        const sql = "INSERT INTO itens_carrinho (id_usuario, id_produto) VALUES (?, ?)";
        return await db.query(sql, [usuarioId, produtoId]);
    }
};

module.exports = Carrinho;