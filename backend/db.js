const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.DB_PASSWORD) {
    console.log("Alerta: A senha do banco não foi encontrada no .env dentro da pasta backend!");
}

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME 
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados do Belle Sucré Café!');
});

module.exports = db;