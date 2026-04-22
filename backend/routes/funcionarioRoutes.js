const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');

router.get('/verificar-funcionario', funcionarioController.verificarFuncionario);
router.post('/registrar-produto', funcionarioController.registrarProduto);
router.get('/pedidos', funcionarioController.getPedidos);
router.post('/atualizar-usuario-nome', funcionarioController.atualizarUsuarioNome);
router.post('/logout-funcionario', funcionarioController.logoutFuncionario);

module.exports = router;