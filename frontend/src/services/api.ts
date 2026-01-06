import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// Tipagem dos dados que vêm do backend
export interface DashboardSummary {
    total_monthly_cost: number;
    wasted_cost: number;
    optimization_percentage: string;
    assets_count: number;
}

export const getDashboardSummary = async () => {
    const response = await api.get<DashboardSummary>('/dashboard/summary');
    return response.data;
};