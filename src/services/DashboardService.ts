import { IAssetRepository } from '../repositories/IAssetRepository';

export class DashboardService {
    constructor(private assetRepository: IAssetRepository) {}

    async getFullDashboard() {
        const assets = await this.assetRepository.getAll();
        const history = await this.assetRepository.getHistory();

        // 1. Cálculos Gerais (KPIs)
        let totalCost = 0;
        let wastedCost = 0;
        
        // Estruturas para os Gráficos
        const costByType: Record<string, number> = {};
        const statusDistribution: Record<string, number> = {};

        assets.forEach(asset => {
            const cost = Number(asset.cost_monthly);
            totalCost += cost;

            // Lógica de Desperdício
            if (asset.status === 'Unused' || asset.status === 'Deprecated') {
                wastedCost += cost;
            }

            // Agrupamento por Tipo (Gráfico de Barras)
            if (!costByType[asset.type]) costByType[asset.type] = 0;
            costByType[asset.type] += cost;

            // Agrupamento por Status (Gráfico Donut)
            if (!statusDistribution[asset.status]) statusDistribution[asset.status] = 0;
            statusDistribution[asset.status] += 1;
        });

        return {
            kpis: {
                total_monthly_cost: totalCost,
                wasted_cost: wastedCost,
                optimization_percentage: totalCost > 0 ? ((wastedCost / totalCost) * 100).toFixed(2) : 0,
                assets_count: assets.length
            },
            charts: {
                cost_by_type: Object.entries(costByType).map(([name, value]) => ({ name, value })),
                status_distribution: Object.entries(statusDistribution).map(([name, value]) => ({ name, value })),
                history: history
            }
        };
    }
}