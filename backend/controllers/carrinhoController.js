// Simulação do Controller (Node.js/Express)
const Carrinho = require('../models/Carrinho');
const Pedido = require('../models/Pedido');
const db = require('../db');

exports.adicionarAoCarrinho = (req, res) => {
    const { produto_id } = req.body;
    // O ID do usuário deve vir da sessão para segurança
    const usuario_id = req.session.usuarioId;

    if (!usuario_id) {
        return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
    }

    Carrinho.adicionar(usuario_id, produto_id, (err) => {
        if (err) {
            console.error('Erro ao adicionar ao carrinho:', err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao adicionar ao carrinho." });
        }
        res.status(200).json({ sucesso: true });
    });
};

exports.finalizarPedido = (req, res) => {
    const usuario_id = req.session.usuarioId;
    const { endereco, total } = req.body;

    if (!usuario_id) return res.status(401).json({ sucesso: false });
    if (!endereco) return res.status(400).json({ sucesso: false, mensagem: "Endereço é obrigatório" });

    // 1. Busca os dados do usuário
    const User = require('../models/User');
    
    User.findById(usuario_id, (err, usuarioResults) => {
        if (err || usuarioResults.length === 0) {
            return res.status(500).json({ sucesso: false });
        }

        const usuario = usuarioResults[0];

        // 2. Busca os produtos do carrinho
        const sqlCarrinho = `
            SELECT p.nome, p.preco 
            FROM carrinho c 
            JOIN produtos p ON c.produto_id = p.id 
            WHERE c.usuario_id = ?`;

        db.query(sqlCarrinho, [usuario_id], (err, itens) => {
            if (err || itens.length === 0) {
                return res.status(500).json({ sucesso: false });
            }

            const listaProdutos = itens.map(p => `${p.nome} (R$ ${parseFloat(p.preco).toFixed(2)})`).join(', ');

            // 3. Salva o pedido com todos os dados do usuário
            const sqlPedido = `
                INSERT INTO pedidos (
                    usuario_id, 
                    nome_usuario, 
                    email_usuario, 
                    endereco_entrega, 
                    foto_usuario, 
                    produtos, 
                    total, 
                    pago
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const pedidoParams = [
                usuario_id,
                usuario.nome,
                usuario.email,
                endereco,
                usuario.foto || 'default.png',
                listaProdutos,
                total || 0,
                true
            ];

            db.query(sqlPedido, pedidoParams, (err, result) => {
                if (err) {
                    if (err.code === 'ER_BAD_FIELD_ERROR') {
                        // Caso a tabela de pedidos não tenha os novos campos, tenta esquema antigo
                        const sqlPedidoFallback = "INSERT INTO pedidos (usuario_id, produtos, total, pago) VALUES (?, ?, ?, ?)";
                        return db.query(sqlPedidoFallback, [usuario_id, listaProdutos, total || 0, true], (err2, result2) => {
                            if (err2) {
                                console.log('Erro ao inserir pedido no fallback:', err2);
                                return res.status(500).json({ sucesso: false });
                            }
                            db.query("DELETE FROM carrinho WHERE usuario_id = ?", [usuario_id], () => {
                                res.json({ sucesso: true, pedido_id: result2.insertId });
                            });
                        });
                    }

                    console.log(err);
                    return res.status(500).json({ sucesso: false });
                }

                // 4. Limpa o carrinho
                db.query("DELETE FROM carrinho WHERE usuario_id = ?", [usuario_id], () => {
                    res.json({ sucesso: true, pedido_id: result.insertId });
                });
            });
        });
    });
};

