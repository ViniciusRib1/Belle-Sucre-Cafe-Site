const express = require('express');
const session = require('express-session');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// server.js
app.use(session({
    secret: 'belle-sucre-secret',
    resave: false,             // Evita regravar sessões não modificadas
    saveUninitialized: false,  // Não cria sessão para quem não logou
    cookie: { 
        secure: false,         // OBRIGATÓRIO false para rodar em HTTP (localhost)
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 // 1 hora
    }
}));

// AS ROTAS DEVEM VIR DEPOIS DA SESSÃO
app.use('/api', userRoutes);
app.use(express.static(path.join(__dirname, '../public')));

// Servir arquivos estáticos (HTML, CSS, JS do frontend)
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Uso das rotas MVC
app.use('/api', userRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});