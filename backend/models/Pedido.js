const db = require('../db');

const Pedido = {
    create: (pedido, callback) => {
        const sql = `
            INSERT INTO pedidos (
                usuario_id, 
                nome_usuario, 
                email_usuario, 
                endereco_entrega, 
                foto_usuario, 
                produtos, 
                total, 
                pago
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [
            pedido.usuario_id,
            pedido.nome_usuario,
            pedido.email_usuario,
            pedido.endereco_entrega,
            pedido.foto_usuario,
            pedido.produtos,
            pedido.total,
            pedido.pago
        ], callback);
    },
    findAllWithUser: (callback) => {
        const sql = `
            SELECT 
                id, 
                nome_usuario, 
                email_usuario, 
                endereco_entrega, 
                foto_usuario, 
                produtos, 
                total, 
                pago,
                data_pedido
            FROM pedidos
            ORDER BY data_pedido DESC
        `;
        db.query(sql, callback);
    }
};

module.exports = Pedido;