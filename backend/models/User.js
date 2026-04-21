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
        const query = "SELECT nome, foto, email FROM usuarios WHERE id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = User;