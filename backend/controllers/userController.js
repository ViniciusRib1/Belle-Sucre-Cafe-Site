const User = require('../models/User');

exports.login = (req, res) => {
    const { email, senha } = req.body;
    User.findByEmail(email, (err, results) => {
        if (err) return res.status(500).send("Erro no servidor");
        
        if (results.length > 0 && results[0].senha === senha) {
            req.session.userId = results[0].id;
            return res.redirect('/inicio-user.html');
        } else {
            return res.redirect('/login.html?erro=1');
        }
    });
};

// backend/controllers/userController.js
exports.login = (req, res) => {
    const { email, senha } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err) return res.status(500).send("Erro no servidor");

        if (results.length > 0 && results[0].senha === senha) {
            // 1. Define os dados na sessão
            req.session.userId = results[0].id;

            // 2. SALVA MANUALMENTE E SÓ REDIRECIONA NO CALLBACK
            req.session.save((err) => {
                if (err) {
                    console.error("Erro ao salvar sessão:", err);
                    return res.redirect('/login.html?erro=2');
                }
                return res.redirect('/inicio-user.html');
            });
        } else {
            return res.redirect('/login.html?erro=1');
        }
    });
};

exports.registrar = (req, res) => {
    const { nome, email, senha } = req.body;
    const foto = req.file ? req.file.filename : 'default.png';

    User.create({ nome, email, senha, foto }, (err, result) => {
        if (err) return res.status(500).send("Erro ao registrar");

        // Criar a sessão
        req.session.userId = result.insertId;

        // FORÇAR O SALVAMENTO ANTES DO REDIRECT
        req.session.save((err) => {
            if (err) return res.status(500).send("Erro ao salvar sessão");
            res.redirect('/inicio-user.html');
        });
    });
};

exports.getUsuarioLogado = (req, res) => {
    if (!req.session.userId) return res.status(401).json({ logado: false });

    User.findById(req.session.userId, (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ logado: false });
        res.json(results[0]);
    });
};