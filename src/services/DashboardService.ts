import { IAssetRepository } from '../repositories/IAssetRepository';

export class DashboardService {
    // Injeção de Dependência (DIP do SOLID)
    constructor(private assetRepository: IAssetRepository) {}

    async getFinancialSummary() {
        const assets = await this.assetRepository.getAll();

        // Lógica de Negócio: Calcular desperdício
        let totalCost = 0;
        let wastedCost = 0;
        let optimizationPotential = 0;

        assets.forEach(asset => {
            const cost = Number(asset.cost_monthly);
            totalCost += cost;

            if (asset.status === 'Unused' || asset.status === 'Deprecated') {
                wastedCost += cost;
            }
        });

        // Retorna dados prontos para o Gráfico de Tomada de Decisão
        return {
            total_monthly_cost: totalCost,
            wasted_cost: wastedCost,
            optimization_percentage: totalCost > 0 ? ((wastedCost / totalCost) * 100).toFixed(2) : 0,
            assets_count: assets.length
        };
    }
}