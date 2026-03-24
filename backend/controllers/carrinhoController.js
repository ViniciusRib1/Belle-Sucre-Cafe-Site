// Simulação do Controller (Node.js/Express)
const Carrinho = require('../models/Carrinho');

exports.adicionarAoCarrinho = async (req, res) => {
    try {
        const { produto_id } = req.body;
        // O ID do usuário deve vir da sessão para segurança
        const usuario_id = req.session.usuarioId; 

        if (!usuario_id) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
        }

        await Carrinho.adicionar(usuario_id, produto_id);
        res.status(200).json({ sucesso: true });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
    }
};