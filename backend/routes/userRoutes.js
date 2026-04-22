const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/login', userController.login);
router.post('/login-funcionario', userController.loginFuncionario);

router.post('/registrar', upload.single('foto'), userController.registrar);

router.get('/usuario-logado', userController.getUsuarioLogado);

router.post(
    '/atualizar-perfil',
    upload.fields([
        { name: 'foto', maxCount: 1 },
        { name: 'banner', maxCount: 1 }
    ]),
    userController.atualizarPerfil
);

// Rotas para reset de senha
router.post('/solicitar-reset-senha', userController.solicitarResetSenha);
router.post('/resetar-senha', userController.resetarSenha);

module.exports = router;
