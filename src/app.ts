import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Configuração básica
app.use(express.json());
app.use(cors());

const PORT = 3000;

// Rota de Teste (Health Check)
app.get('/', (req: Request, res: Response) => {
    res.json({
        project: 'DataCost Governance (DCG)',
        status: 'Online',
        message: 'Ambiente TypeScript + Express configurado com sucesso!',
        timestamp: new Date()
    });
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📝 Modo de teste: Ativo`);
});