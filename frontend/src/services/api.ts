import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

export interface DashboardData {
    kpis: {
        total_monthly_cost: number;
        wasted_cost: number;
        optimization_percentage: string;
        assets_count: number;
    };
    charts: {
        cost_by_type: Array<{ name: string; value: number }>;
        status_distribution: Array<{ name: string; value: number }>;
        history: Array<{ month: string; total_cost: number }>;
    };
}

export const getDashboardSummary = async () => {
    // Agora chama a rota que traz TUDO
    const response = await api.get<DashboardData>('/dashboard/summary');
    return response.data;
};