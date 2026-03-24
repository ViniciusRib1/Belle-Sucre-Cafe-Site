app.post("/adicionar-carrinho", (req, res) => {
    const { produto_id } = req.body;
    const usuario_id = req.session.usuarioId; // Assumindo que você usa session

    if (!usuario_id) {
        return res.json({ sucesso: false, mensagem: "Usuário não logado" });
    }

    // Exemplo com MySQL:
    const sql = "INSERT INTO carrinho (usuario_id, produto_id) VALUES (?, ?)";
    db.query(sql, [usuario_id, produto_id], (err, result) => {
        if (err) return res.status(500).json({ sucesso: false });
        res.json({ sucesso: true });
    });
});