import express, { Request, Response } from 'express';
import cors from 'cors';
import { router } from './views/routes';

const app = express();

// Configuração básica
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use('/api', router);

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});