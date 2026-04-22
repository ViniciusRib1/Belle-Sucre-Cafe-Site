const db = require('./db');

// Verificar e popular produtos se não existirem
function inicializarProdutos() {
    const sqlVerificar = "SELECT COUNT(*) as total FROM produtos";
    
    db.query(sqlVerificar, (err, results) => {
        if (err) {
            console.error('Erro ao verificar produtos:', err);
            return;
        }

        if (results[0].total === 0) {
            console.log('Inserindo produtos no banco de dados...');
            
            const produtos = [
                { id: 1, nome: 'Torta de Morango', preco: 18.50, imagem: 'torta_morango.jpg' },
                { id: 2, nome: 'Bolo de Chocolate', preco: 20.00, imagem: 'bolo_chocolate.jpg' },
                { id: 3, nome: 'Doce de Pistache', preco: 15.50, imagem: 'doce_pistache.jpg' },
                { id: 4, nome: 'Petit Gâteau', preco: 25.50, imagem: 'petit_gateau.jpg' },
                { id: 5, nome: 'Bolo de Morango', preco: 20.00, imagem: 'bolo_morango.jpg' },
                { id: 6, nome: 'Coxinha', preco: 20.00, imagem: 'coxinha.png' },
                { id: 7, nome: 'Presunto e Queijo', preco: 25.00, imagem: 'presunto_queijo.png' },
                { id: 8, nome: 'Esfiha de Carne', preco: 29.00, imagem: 'esfiha_carne.png' },
                { id: 9, nome: 'Kibe', preco: 32.00, imagem: 'kibe.png' },
                { id: 10, nome: 'Bolinha de Queijo', preco: 28.00, imagem: 'bolinha_queijo.png' },
                { id: 11, nome: 'Cappucino', preco: 2.00, imagem: 'cappucino.png' },
                { id: 12, nome: 'Café', preco: 1.00, imagem: 'cafe.png' },
                { id: 13, nome: 'Café Espresso', preco: 1.50, imagem: 'cafe_espresso.png' },
                { id: 14, nome: 'Café Gelado Caramelizado', preco: 3.50, imagem: 'ice_coffee.png' }
            ];

            const sqlInsert = "INSERT INTO produtos (id, nome, preco, imagem) VALUES ?";
            const valores = produtos.map(p => [p.id, p.nome, p.preco, p.imagem]);

            db.query(sqlInsert, [valores], (err, result) => {
                if (err) {
                    console.error('Erro ao inserir produtos:', err);
                } else {
                    console.log('✅ Produtos inseridos com sucesso!');
                }
            });
        } else {
            console.log('✅ Produtos já existem no banco');
        }
    });
}

module.exports = { inicializarProdutos };
