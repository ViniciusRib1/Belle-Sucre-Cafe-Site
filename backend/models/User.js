const db = require('../db');

const User = {
    findByEmail: (email, callback) => {
        const query = "SELECT * FROM usuarios WHERE email = ?";
        db.query(query, [email], callback);
    },
    create: (userData, callback) => {
        const { nome, email, senha, foto } = userData;
        const query = "INSERT INTO usuarios (nome, email, senha, foto) VALUES (?, ?, ?, ?)";
        db.query(query, [nome, email, senha, foto], callback);
    },
    findById: (id, callback) => {
    // Adicionamos email, endereco e banner explicitamente na busca
    const query = "SELECT id, nome, email, foto, banner, endereco FROM usuarios WHERE id = ?";
    db.query(query, [id], callback);
},

    updatePerfil: (id, dados, callback) => {
        const { nome, endereco, foto, banner } = dados;
        // Usamos COALESCE para não sobrescrever com NULL caso o usuário não envie nova foto/banner
        const query = `
            UPDATE usuarios 
            SET nome = ?, endereco = ?, 
                foto = COALESCE(?, foto), 
                banner = COALESCE(?, banner)
            WHERE id = ?
        `;
        db.query(query, [nome, endereco, foto, banner, id], callback);
    },

    updatePassword: (id, novaSenha, callback) => {
        const query = "UPDATE usuarios SET senha = ? WHERE id = ?";
        db.query(query, [novaSenha, id], callback);
    }
};


module.exports = User;