-- 1. Criação das Tabelas Base (Estrutura Normalizada)

-- Tabela de Centros de Custo (Evita redundância de nomes de departamentos)
CREATE TABLE cost_centers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    budget_limit DECIMAL(10, 2) NOT NULL
);

-- Tabela de Ativos (Servers, VMs, Licenças)
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Ex: 'VM', 'Physical Server', 'SQL License'
    status VARCHAR(20) NOT NULL, -- Ex: 'Active', 'Deprecated', 'Unused'
    purchase_date DATE,
    cost_monthly DECIMAL(10, 2) NOT NULL,
    cost_center_id INTEGER REFERENCES cost_centers(id),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Histórico (Governança e Auditoria)
-- Esta tabela atende ao requisito de rastrear mudanças para evitar "perda de conhecimento"
CREATE TABLE asset_history_log (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    old_cost DECIMAL(10, 2),
    new_cost DECIMAL(10, 2),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_reason VARCHAR(255) -- Pode ser preenchido pela aplicação
);

-- 3. Função do Trigger (A Mágica da Automação)
CREATE OR REPLACE FUNCTION log_asset_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Só registra se houver mudança de Status ou Custo (impacto financeiro)
    IF (OLD.status <> NEW.status) OR (OLD.cost_monthly <> NEW.cost_monthly) THEN
        INSERT INTO asset_history_log (asset_id, old_status, new_status, old_cost, new_cost, changed_at)
        VALUES (OLD.id, OLD.status, NEW.status, OLD.cost_monthly, NEW.cost_monthly, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Criação do Trigger
CREATE TRIGGER trg_audit_assets
AFTER UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION log_asset_changes();

-- Inserção de Dados Fictícios para Teste (Seed)
INSERT INTO cost_centers (code, name, budget_limit) VALUES 
('CC-001', 'Infraestrutura TI', 50000.00),
('CC-002', 'Desenvolvimento', 30000.00);

INSERT INTO assets (name, type, status, cost_monthly, cost_center_id) VALUES 
('Srv-App-01', 'VM', 'Active', 250.00, 1),
('Srv-Legacy-09', 'Physical', 'Unused', 800.00, 1); -- Ativo ocioso gerando custo!