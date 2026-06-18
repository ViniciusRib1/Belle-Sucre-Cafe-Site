-- Remove o banco se ele já existir para evitar erros de duplicidade
DROP DATABASE IF EXISTS bellesucre;
CREATE DATABASE bellesucre;
USE bellesucre;



/* Tabela de Usuários */
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    foto VARCHAR(255),
    endereco VARCHAR(255),
    banner VARCHAR(255)
);

/* Tabela de Produtos */
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    preco DECIMAL(10,2),
    imagem VARCHAR(255)
);

/* Tabela do Carrinho */
CREATE TABLE carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    produto_id INT,
    quantidade INT DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

/* Tabela de Pedidos */
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nome_usuario VARCHAR(100),
    email_usuario VARCHAR(150),
    endereco_entrega VARCHAR(255),
    foto_usuario VARCHAR(255),
    produtos TEXT,
    total DECIMAL(10,2),
    pago BOOLEAN DEFAULT FALSE,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);



SELECT id, nome FROM produtos;
select id, nome, email from usuarios;


INSERT INTO produtos (id, nome, preco, imagem) VALUES 
(1, 'Torta de Morango', 18.50, 'torta de morango.jpg'),
(2, 'Bolo de Chocolate', 20.00, 'bolo de chocolate.jpg'),
(3, 'Doce de Pistache', 15.50, 'doce de pistache.jpg'),
(4, 'Petit Gâteau', 25.50, 'petit gâteau.jpg'),
(5, 'Bolo de Morango', 20.00, 'bolo de morango.jpg'),
(6, 'Coxinha', 20.00, 'coxinha.png'),
(7, 'Presunto e queijo', 25.00, 'presuntoequeijo.png'),
(8, 'Esfiha de carne', 29.00, 'esfihadecarne.png'),
(9, 'Kibe', 32.00, 'kibe.png'),
(10, 'Bolinha de queijo', 28.00, 'bolinhadequeijo.png'),
(11, 'Cappucino', 2.00, 'cappucino.png'),
(12, 'Café', 1.00, 'cafe.png'),
(13, 'Café Espresso', 1.50, 'cafe-espresso.png'),
(14, 'Café Gelado Caramelizado', 3.50, 'iceCoffe.png'),
(15, 'Chocolate Quente', 5.50, 'chocolate-quente.jpg');

