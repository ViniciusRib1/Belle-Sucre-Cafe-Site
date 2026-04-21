const User = require('../models/User');

exports.login = (req, res) => {
    const { email, senha } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err) return res.status(500).send("Erro interno");

        if (results.length > 0 && results[0].senha === senha) {
            req.session.userId = results[0].id;
            return req.session.save(() => {
                res.redirect('/inicio-user.html');
            });
        } 
        return res.redirect('/login.html?erro=1'); 
    });
};

exports.registrar = (req, res) => {
    const { nome, email, senha } = req.body;
    const foto = req.file ? req.file.filename : 'default.png';

    User.create({ nome, email, senha, foto }, (err, result) => {
        if (err) return res.status(500).send("Erro ao registrar");

        req.session.userId = result.insertId;
        return req.session.save((err) => {
            if (err) return res.status(500).send("Erro ao salvar sessão");
            res.redirect('/inicio-user.html');
        });
    });
};

exports.getUsuarioLogado = (req, res) => {
    if (!req.session.userId) {
        return res.json({ success: false });
    }

    User.findById(req.session.userId, (err, results) => {
        if (err || results.length === 0) {
            return res.json({ success: false });
        }
        // Retorna a estrutura que o frontend agora espera
        res.json({ success: true, usuario: results[0] });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid'); // Limpa o cookie da sessão
        res.redirect('/login.html');
    });
};