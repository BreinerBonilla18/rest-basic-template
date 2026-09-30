import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas base
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});