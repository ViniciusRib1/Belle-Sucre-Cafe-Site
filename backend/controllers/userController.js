const User = require('../models/User');
const db = require('../db');

exports.login = (req, res) => {

    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

    db.query(sql, [email, senha], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Erro no servidor");
        }

        if (results.length === 0) {
            return res.status(401).send("Email ou senha inválidos");
        }

        const usuario = results[0];

        // salva sessão
        req.session.usuarioId = usuario.id;

        req.session.save((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erro ao salvar sessão");
            }

            res.redirect('/inicio-user.html');
        });

    });

};

exports.registrar = (req, res) => {

    const { nome, email, senha } = req.body;
    const foto = req.file ? req.file.filename : 'default.png';

    User.create({ nome, email, senha, foto }, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao registrar usuário");
        }

        // salva sessão
        req.session.usuarioId = result.insertId;

        req.session.save((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erro ao salvar sessão");
            }

            res.redirect('/inicio-user.html');
        });

    });

};

exports.getUsuarioLogado = (req, res) => {

    if (!req.session.usuarioId) {
        return res.json({ success: false });
    }

    User.findById(req.session.usuarioId, (err, results) => {

        if (err) {
            console.log(err);
            return res.json({ success: false });
        }

        if (results.length === 0) {
            return res.json({ success: false });
        }

        res.json({
            success: true,
            usuario: results[0]
        });

    });

};

exports.logout = (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao fazer logout");
        }

        res.clearCookie('connect.sid');
        res.redirect('/login.html');

    });

};

exports.atualizarPerfil = (req, res) => {
    const userId = req.session.usuarioId || req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Sessão expirada." });
    }

    const { nome, endereco } = req.body;
    
    // TRATAMENTO SEGURO DOS ARQUIVOS
    let foto = null;
    let banner = null;

    if (req.files) {
        if (req.files['foto'] && req.files['foto'][0]) {
            foto = req.files['foto'][0].filename;
        }
        if (req.files['banner'] && req.files['banner'][0]) {
            banner = req.files['banner'][0].filename;
        }
    }

    const sql = `
        UPDATE usuarios 
        SET nome = ?, endereco = ?, 
            foto = COALESCE(?, foto), 
            banner = COALESCE(?, banner) 
        WHERE id = ?`;

    db.query(sql, [nome, endereco, foto, banner, userId], (err) => {
        if (err) {
            console.error("Erro SQL:", err);
            return res.status(500).json({ success: false, message: "Erro no banco." });
        }

        // Busca os dados incluindo o EMAIL
        db.query("SELECT nome, email, endereco, foto, banner FROM usuarios WHERE id = ?", [userId], (err, results) => {
            if (err) return res.status(500).json({ success: false });

            res.json({
                success: true,
                usuario: results[0]
            });
        });
    });
};

// Sistema de reset de senha
const crypto = require('crypto');

// Armazenamento temporário de tokens (em produção, use Redis ou banco)
const resetTokens = new Map();

exports.solicitarResetSenha = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email é obrigatório" });
    }

    User.findByEmail(email, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Erro no servidor" });
        }

        if (results.length === 0) {
            // Por segurança, não revelamos se o email existe ou não
            return res.json({ success: true, message: "Se o email existir, você receberá instruções para resetar sua senha." });
        }

        // Gera token único
        const token = crypto.randomBytes(32).toString('hex');
        const expiracao = Date.now() + (15 * 60 * 1000); // 15 minutos

        resetTokens.set(token, {
            userId: results[0].id,
            expiracao: expiracao
        });

        // Em produção, enviaria email. Por enquanto, apenas simulamos
        console.log(`Token de reset para ${email}: ${token}`);
        console.log(`Link: http://localhost:3000/reset-senha.html?token=${token}`);

        res.json({
            success: true,
            message: "Se o email existir, você receberá instruções para resetar sua senha.",
            // Para desenvolvimento, incluímos o token na resposta
            debug: { token, link: `http://localhost:3000/reset-senha.html?token=${token}` }
        });
    });
};

exports.resetarSenha = (req, res) => {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
        return res.status(400).json({ success: false, message: "Token e nova senha são obrigatórios" });
    }

    if (novaSenha.length < 6) {
        return res.status(400).json({ success: false, message: "A senha deve ter pelo menos 6 caracteres" });
    }

    const tokenData = resetTokens.get(token);

    if (!tokenData) {
        return res.status(400).json({ success: false, message: "Token inválido" });
    }

    if (Date.now() > tokenData.expiracao) {
        resetTokens.delete(token);
        return res.status(400).json({ success: false, message: "Token expirado" });
    }

    User.updatePassword(tokenData.userId, novaSenha, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Erro ao atualizar senha" });
        }

        // Remove o token usado
        resetTokens.delete(token);

        res.json({ success: true, message: "Senha alterada com sucesso!" });
    });
};