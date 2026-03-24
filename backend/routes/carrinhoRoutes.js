// Listar produtos que estão no carrinho
app.get("/meu-carrinho", (req, res) => {
    const usuario_id = req.session.usuarioId;

    if (!usuario_id) return res.json([]);

    // Busca o nome e preço do produto juntando as tabelas 'carrinho' e 'produtos'
    const sql = `
        SELECT c.id AS carrinho_id, p.nome, p.preco 
        FROM carrinho c 
        JOIN produtos p ON c.produto_id = p.id 
        WHERE c.usuario_id = ?`;

    db.query(sql, [usuario_id], (err, results) => {
        if (err) return res.status(500).json([]);
        res.json(results);
    });
});

// Remover produto do carrinho
app.delete("/remover-do-carrinho/:id", (req, res) => {
    const idItemCarrinho = req.params.id;

    const sql = "DELETE FROM carrinho WHERE id = ?";
    db.query(sql, [idItemCarrinho], (err, result) => {
        if (err) return res.status(500).json({ sucesso: false });
        res.json({ sucesso: true });
    });
});