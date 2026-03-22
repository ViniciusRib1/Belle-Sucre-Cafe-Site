const db = require("../db");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');

exports.registrar = (req, res) => {
    const { nome, email, senha } = req.body;
    const foto = req.file ? req.file.filename : null;

    const query = 'INSERT INTO usuarios (nome, email, senha, foto) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, email, senha, foto], (err, result) => {
        if (err) {
            console.error("Erro ao registrar:", err);
            // O 'return' impede que o código continue e tente enviar outra resposta abaixo
            return res.status(500).json({ error: "Erro ao registrar usuário" });
        }

        // Salva na sessão para o front-end buscar depois
        req.session.usuario = { nome, email, foto };

        // REDIRECIONAMENTO CORRETO
        return res.redirect('/inicio-user.html');
    });
};

// Exemplo de Login
exports.login = (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    db.query(query, [email, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro no servidor" });
        }

        if (results.length > 0) {
            const usuario = results[0];
            
            // Salva os dados na sessão
            req.session.usuario = {
                nome: usuario.nome,
                email: usuario.email,
                foto: usuario.foto
            };

            // REDIRECIONAMENTO APÓS SUCESSO
            return res.redirect('/inicio-user.html');
        } else {
            // Caso falhe, você pode redirecionar de volta com um erro ou mandar um status
            return res.status(401).send('<script>alert("Login inválido"); window.location.href="/login.html";</script>');
        }
    });
};
exports.getUsuarioLogado = (req, res) => {
    if (req.session.usuario) {
        res.json({ success: true, usuario: req.session.usuario });
    } else {
        res.json({ success: false, message: "Nenhum usuário logado." });
    }
};

exports.atualizarPerfil = (req, res) => {
    if (!req.session.usuario) return res.status(401).json({ success: false });
    const { nome, endereco } = req.body;
    const id = req.session.usuario.id;

    const deletarArquivo = (nomeArquivo) => {
        if (nomeArquivo && !nomeArquivo.includes('default-')) {
            const caminho = path.join(__dirname, "../../public/uploads/", nomeArquivo);
            if (fs.existsSync(caminho)) fs.unlinkSync(caminho);
        }
    };

    let novaFoto = req.session.usuario.foto;
    let novoBanner = req.session.usuario.banner;

    if (req.files && req.files['foto']) {
        deletarArquivo(req.session.usuario.foto);
        novaFoto = req.files['foto'][0].filename;
    }
    if (req.files && req.files['banner']) {
        deletarArquivo(req.session.usuario.banner);
        novoBanner = req.files['banner'][0].filename;
    }

    User.update(id, nome, endereco, novaFoto, novoBanner, (err) => {
        if (err) return res.status(500).json({ success: false, message: "Erro ao atualizar." });
        req.session.usuario.nome = nome;
        req.session.usuario.endereco = endereco;
        req.session.usuario.foto = novaFoto;
        req.session.usuario.banner = novoBanner;
        res.json({ success: true, message: "Perfil atualizado!", usuario: req.session.usuario });
    });
};