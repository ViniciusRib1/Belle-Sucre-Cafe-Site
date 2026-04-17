const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' }); // Ajuste para sua pasta de imagens

router.post('/login', userController.login);
router.post('/registrar', upload.single('foto'), userController.registrar);
router.get('/usuario-logado', userController.getUsuarioLogado);

module.exports = router;