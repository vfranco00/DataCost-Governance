import { Asset } from '../models/Asset';

export interface AssetHistory {
    month: string;
    total_cost: number;
}

export interface IAssetRepository {
    getAll(): Promise<Asset[]>;
    create(asset: Asset): Promise<Asset>;
    getHistory(): Promise<AssetHistory[]>;
}