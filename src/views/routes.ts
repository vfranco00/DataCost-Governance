import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { PostgresAssetRepository } from '../repositories/PostgresAssetRepository';

const router = Router();
const dashboardController = new DashboardController();
const assetRepo = new PostgresAssetRepository();

// Rota 1: Dados para os Gráficos de Decisão
router.get('/dashboard/summary', dashboardController.getSummary);

// Rota 2: Listagem bruta (para tabelas)
router.get('/assets', async (req, res) => {
    const assets = await assetRepo.getAll();
    res.json(assets);
});

export { router };