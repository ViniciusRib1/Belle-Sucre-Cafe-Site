const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

// Carrega o .env que está dentro da pasta backend
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// 1. Middlewares para ler dados do formulário (OBRIGATÓRIO ANTES DAS ROTAS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Configuração de Sessão (Necessário para o login funcionar)
app.use(session({
    secret: 'belle-sucre-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // mude para true se usar HTTPS
}));

// 3. Arquivos Estáticos (HTML, CSS, JS do frontend)
app.use(express.static(path.join(__dirname, '../public')));

const userRoutes = require('./routes/userRoutes');

app.use('/api', userRoutes);

app.get('/test', (req, res) => res.send("Servidor Belle Sucré está ativo!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`🚀 Rotas de API ativas em http://localhost:${PORT}/api`);
});