export interface Asset {
    id?: number;
    name: string;
    type: string;
    status: 'Active' | 'Deprecated' | 'Unused';
    cost_monthly: number;
    cost_center_id: number;
    last_updated?: Date;
}