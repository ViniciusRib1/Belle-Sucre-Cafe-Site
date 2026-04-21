const express = require('express');
const session = require('express-session');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'belle-sucre-secret',
    resave: false,
    saveUninitialized: false, // Importante: deixe false
    cookie: { 
        secure: false, // Obrigatório ser false para localhost (HTTP)
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 
    }
}));

app.use('/api', userRoutes);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});