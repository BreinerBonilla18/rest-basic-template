import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();


router.get('/', getUsers);          // Obtener lista con filtros y paginación
router.post('/', createUser);       // Crear usuario
router.put('/:id', updateUser);     // Actualizar usuario por ID
router.delete('/:id', deleteUser);  // Eliminar usuario por ID

export default router;