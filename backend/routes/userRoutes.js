const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const fs = require('fs'); // Declarado apenas UMA vez

// Configuração do Multer para salvar as imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../../public/uploads/");
        // Cria a pasta uploads caso ela não exista
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Rotas da API
router.post("/login", userController.login);
router.post("/registrar", upload.single("foto"), userController.registrar);
router.get("/usuario-logado", userController.getUsuarioLogado);

// Rota de atualização (aceita foto de perfil e banner)
router.post("/atualizar-perfil", upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), userController.atualizarPerfil);

module.exports = router;