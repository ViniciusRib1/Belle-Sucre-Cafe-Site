const express = require('express');
const router = express.Router();
const db = require('../db');

// adicionar produto ao carrinho
router.post("/adicionar-carrinho", (req, res) => {
    const usuario_id = req.session.usuarioId;
    const { produto_id } = req.body;

    if (!usuario_id) {
        return res.status(401).json({ sucesso: false, mensagem: "Usuário não logado" });
    }

    const sql = "INSERT INTO carrinho (usuario_id, produto_id) VALUES (?, ?)";

    db.query(sql, [usuario_id, produto_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ sucesso: false });
        }

        res.json({ sucesso: true });
    });
});

module.exports = router;