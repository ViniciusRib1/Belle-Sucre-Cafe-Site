const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');
const { inicializarProdutos } = require('./inicializarDB');

// Inicializar produtos no banco de dados
setTimeout(inicializarProdutos, 2000);


const userRoutes = require('./routes/userRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const cardapioRoutes = require('./routes/cardapioRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'belle-sucre-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 
    }
}));

app.delete("/remover-do-carrinho/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM carrinho WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.json({ sucesso: false });
        }

        res.json({ sucesso: true });

    });

});

app.use('/api', userRoutes);
app.use('/api', carrinhoRoutes);
app.use('/api', cardapioRoutes);
app.use('/api', funcionarioRoutes);
app.use('/Images', express.static('Images'));
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});