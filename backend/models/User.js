const db = require("../db");

const User = {
    findByEmail: (email, callback) => {
        db.query("SELECT * FROM usuarios WHERE email = ?", [email], callback);
    },
    create: (nome, email, senha, foto, callback) => {
        db.query("INSERT INTO usuarios (nome, email, senha, foto) VALUES (?, ?, ?, ?)", [nome, email, senha, foto], callback);
    },
    update: (id, nome, endereco, foto, banner, callback) => {
        db.query("UPDATE usuarios SET nome = ?, endereco = ?, foto = ?, banner = ? WHERE id = ?", [nome, endereco, foto, banner, id], callback);
    }
};

module.exports = User;