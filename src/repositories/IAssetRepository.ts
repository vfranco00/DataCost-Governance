import { Asset } from '../models/Asset';

export interface IAssetRepository {
    getAll(): Promise<Asset[]>;
    create(asset: Asset): Promise<Asset>;
    // Futuramente: update, delete, getHistory...
}