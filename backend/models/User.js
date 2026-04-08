const db = require("../db");

const User = {
    findByEmail: (email, callback) => {
        db.query("SELECT * FROM usuarios WHERE email = ?", [email], callback);
    },
    create: (nome, email, senha, foto, callback) => {
        db.query("INSERT INTO usuarios (nome, email, senha, foto) VALUES (?, ?, ?, ?)", [nome, email, senha, foto], callback);
    },
    // Atualiza os dados incluindo as fotos
    update: (id, nome, endereco, foto, banner, callback) => {
        const query = 'UPDATE usuarios SET nome = ?, endereco = ?, foto = ?, banner = ? WHERE id = ?';
        db.query(query, [nome, endereco, foto, banner, id], callback);
    }
};
exports.atualizarPerfil = (req, res) => {
    const userId = req.session.usuario.id;
    const { nome, endereco } = req.body;

    // Recupera nomes atuais para caso o usuário não envie novas fotos
    let fotoAtual = req.session.usuario.foto;
    let bannerAtual = req.session.usuario.banner;

    // Se novos arquivos foram submetidos (via Multer)
    if (req.files) {
        if (req.files['foto']) fotoAtual = req.files['foto'][0].filename;
        if (req.files['banner']) bannerAtual = req.files['banner'][0].filename;
    }

    const novosDados = { nome, endereco, foto: fotoAtual, banner: bannerAtual };

    User.updateProfile(userId, novosDados, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Erro ao salvar." });

        req.session.usuario.nome = nome;
        req.session.usuario.endereco = endereco;
        req.session.usuario.foto = fotoAtual;
        req.session.usuario.banner = bannerAtual;

        res.json({ success: true, usuario: req.session.usuario });
    });
};

module.exports = User;