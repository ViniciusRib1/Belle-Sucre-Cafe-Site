const express = require('express');
const router = express.Router();
const db = require('../db'); // importar conexão com banco
const carrinhoController = require('../controllers/carrinhoController');

// Listar produtos que estão no carrinho
router.get("/meu-carrinho", (req, res) => {
    const usuario_id = req.session.usuarioId;

    if (!usuario_id) return res.json([]);

    const sql = `
        SELECT carrinho.id as carrinho_id,
        produtos.nome,
        produtos.preco,
        produtos.imagem
        FROM carrinho
        JOIN produtos ON carrinho.produto_id = produtos.id
        WHERE carrinho.usuario_id = ?
        `;

    db.query(sql, [usuario_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json([]);
        }
        res.json(results);
    });
});

// Remover produto do carrinho
router.post('/remover-carrinho/:id', (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM carrinho WHERE id = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.send("Erro ao remover");
        }

        res.redirect('/carrinho');
    });
});

router.post('/finalizar-pedido', carrinhoController.finalizarPedido);

module.exports = router;