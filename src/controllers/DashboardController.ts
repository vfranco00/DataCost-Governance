import { Request, Response } from 'express';
import { PostgresAssetRepository } from '../repositories/PostgresAssetRepository';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
    
    async getSummary(req: Request, res: Response) {
        try {
            // Instanciando as dependências (Em projetos maiores usamos Injeção Automática)
            const repository = new PostgresAssetRepository();
            const service = new DashboardService(repository);

            const data = await service.getFinancialSummary();
            
            return res.json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao gerar dashboard' });
        }
    }
}