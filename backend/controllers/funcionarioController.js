const Produto = require('../models/Produto');
const Pedido = require('../models/Pedido');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.verificarFuncionario = (req, res) => {
    // Agora verifica apenas 'admin', conforme gravado no login
    if (req.session.funcionarioId === 'admin') {
        res.json({ autenticado: true });
    } else {
        res.json({ autenticado: false });
    }
};

exports.loginFuncionario = (req, res) => {
    const { email, senha } = req.body;

    if (email === 'admin@gmail.com' && senha === 'adm123') {
        req.session.funcionarioId = 'admin@gmail.com';
        
        // Use o save para garantir que a sessão foi gravada antes de mudar de página
        req.session.save((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erro ao salvar sessão do admin");
            }
            res.redirect('/dashboard-funcionario.html');
        });
    } else {
        return res.status(401).send("Email ou senha inválidos");
    }
};

exports.registrarProduto = [
    upload.single('imagem'),
    (req, res) => {
        const { nome, preco } = req.body;
        const imagem = req.file ? req.file.filename : null;

        Produto.create({ nome, preco, imagem }, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erro ao registrar produto");
            }
            res.status(200).send("Produto registrado com sucesso");
        });
    }
];

exports.getPedidos = (req, res) => {
    Pedido.findAllWithUser((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao buscar pedidos" });
        }
        res.json(results);
    });
};

exports.atualizarUsuarioNome = (req, res) => {
    const { email, novoNome } = req.body;

    const sql = "UPDATE usuarios SET nome = ? WHERE email = ?";
    const db = require('../db');
    db.query(sql, [novoNome, email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao atualizar usuário");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Usuário não encontrado");
        }
        res.status(200).send("Nome atualizado com sucesso");
    });
};

exports.logoutFuncionario = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao fazer logout");
        }
        res.redirect('/login.html');
    });
};