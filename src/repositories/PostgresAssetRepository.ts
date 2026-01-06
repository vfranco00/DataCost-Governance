import { pool } from '../config/database';
import { Asset } from '../models/Asset';
import { IAssetRepository } from './IAssetRepository';

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
}