import { pool } from '../config/database';
import { Asset } from '../models/Asset';
import { IAssetRepository, AssetHistory } from './IAssetRepository';

export class PostgresAssetRepository implements IAssetRepository {
    
    async getAll(): Promise<Asset[]> {
        const query = 'SELECT * FROM assets';
        const result = await pool.query(query);
        return result.rows; // Retorna os dados do banco
    }

    async create(asset: Asset): Promise<Asset> {
        const query = `
            INSERT INTO assets (name, type, status, cost_monthly, cost_center_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [asset.name, asset.type, asset.status, asset.cost_monthly, asset.cost_center_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getHistory(): Promise<AssetHistory[]> {
    const query = `
        SELECT 
            TO_CHAR(changed_at, 'Mon') as month,
            SUM(new_cost) as total_cost
        FROM asset_history_log
        GROUP BY 1
        ORDER BY MIN(changed_at);
    `;
    const result = await pool.query(query);
    return result.rows;
}
}