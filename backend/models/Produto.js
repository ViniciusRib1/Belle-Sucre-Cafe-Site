// Simulação de Model (Pode ser substituído por Sequelize, Mongoose ou SQL puro)
const db = require('./database'); // Seu arquivo de conexão

const CarrinhoModel = {
    adicionar: async (usuarioId, produtoId) => {
        // Lógica para inserir no banco de dados
        const query = "INSERT INTO carrinho (usuario_id, produto_id) VALUES (?, ?)";
        return await db.execute(query, [usuarioId, produtoId]);
    },
    buscarPorUsuario: async (usuarioId) => {
        const query = "SELECT p.* FROM produtos p INNER JOIN carrinho c ON p.id = c.produto_id WHERE c.usuario_id = ?";
        return await db.execute(query, [usuarioId]);
    }
};

module.exports = CarrinhoModel;