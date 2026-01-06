import { useEffect, useState } from 'react';
import { getDashboardSummary, type DashboardSummary } from './services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, AlertTriangle, Activity } from 'lucide-react';

function App() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    // Busca os dados assim que a tela carrega
    getDashboardSummary().then(data => {
      setSummary(data);
    }).catch(err => console.error("Erro ao buscar dados:", err));
  }, []);

  if (!summary) return <div className="container">Carregando dashboard...</div>;

  // Dados formatados para o Gráfico do Recharts
  const dataGraph = [
    { name: 'Custo Útil', value: summary.total_monthly_cost - summary.wasted_cost },
    { name: 'Desperdício', value: summary.wasted_cost },
  ];
  const COLORS = ['#10b981', '#ef4444']; // Verde e Vermelho

  return (
    <div className="container">
      <h1>📊 DataCost Governance</h1>
      <p>Monitoramento de desperdício em infraestrutura de TI</p>

      {/* Cartões de Indicadores (KPIs) */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign color="#2563eb" />
            <h3>Custo Total</h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            R$ {summary.total_monthly_cost.toFixed(2)}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '5px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle color="#ef4444" />
            <h3>Desperdício Identificado</h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
            R$ {summary.wasted_cost.toFixed(2)}
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="#10b981" />
            <h3>Potencial de Otimização</h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            {summary.optimization_percentage}%
          </p>
        </div>
      </div>

      {/* Gráfico 1: Pizza de Eficiência */}
      <div className="grid">
        <div className="card">
          <h3>Composição do Orçamento</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dataGraph}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataGraph.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Espaço para o Gráfico 2 (futuro) */}
        <div className="card">
          <h3>Distribuição por Tipo de Ativo</h3>
          <p style={{color: '#666'}}>Em breve...</p>
        </div>
      </div>
    </div>
  );
}

export default App;