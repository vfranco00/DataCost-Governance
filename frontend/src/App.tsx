import { useEffect, useState } from 'react';
import { getDashboardSummary, type DashboardData } from './services/api';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line 
} from 'recharts';
import { DollarSign, AlertTriangle, Activity, Server } from 'lucide-react';

function App() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then(response => setData(response))
      .catch(err => console.error("Erro:", err));
  }, []);

  if (!data) return <div className="container">Carregando inteligência de dados...</div>;

  const { kpis, charts } = data;

  // Cores para os gráficos
  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

  // Dados calculados para o gráfico de Orçamento (Útil vs Lixo)
  const budgetData = [
    { name: 'Investimento Útil', value: kpis.total_monthly_cost - kpis.wasted_cost },
    { name: 'Desperdício', value: kpis.wasted_cost },
  ];

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Server /> DataCost Governance
        </h1>
        <p style={{ color: '#64748b' }}>Sistema de Apoio à Decisão para Infraestrutura de TI</p>
      </header>

      {/* 1. KPIs (Indicadores Chave) */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <DollarSign size={20} color="#2563eb" />
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Custo Mensal</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>R$ {kpis.total_monthly_cost.toFixed(2)}</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <span style={{ color: '#ef4444', fontSize: '0.9rem' }}>Desperdício (Mensal)</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>R$ {kpis.wasted_cost.toFixed(2)}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Activity size={20} color="#10b981" />
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Otimização Possível</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{kpis.optimization_percentage}%</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Server size={20} color="#f59e0b" />
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Ativos</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpis.assets_count}</div>
        </div>
      </div>

      {/* LINHA 1 DE GRÁFICOS (1 e 2) */}
      <div className="grid" style={{ marginBottom: '2rem' }}>
        
        {/* GRÁFICO 1: Onde está indo o dinheiro? (Rosca) */}
        <div className="card">
          <h3>1. Saúde do Orçamento</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
            Visualiza a proporção de gastos eficientes vs. desperdício.
          </p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" /> {/* Útil */}
                  <Cell fill="#ef4444" /> {/* Lixo */}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 2: Quem gasta mais? (Barras) */}
        <div className="card">
          <h3>2. Custo por Tipo de Ativo</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
            Identifica quais tecnologias (VM, Server, License) encarecem a fatura.
          </p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={charts.cost_by_type}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val}`} />
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Custo Mensal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div> {/* <--- O ERRO ESTAVA AQUI: Faltava fechar essa DIV da grid */}

      {/* LINHA 2 DE GRÁFICOS (3 e 4) */}
      <div className="grid">
        
        {/* GRÁFICO 3: Status dos Ativos (Pizza) */}
        <div className="card">
          <h3>3. Inventário por Status</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
            Mostra quantos ativos estão parados ("Unused") gerando custo.
          </p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={charts.status_distribution}
                  cx="50%" cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {charts.status_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 4: Histórico de Volatilidade (Linha) */}
        <div className="card">
          <h3>4. Evolução do Custo (Auditoria)</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
            Baseado na tabela de Histórico (Triggers), mostra a tendência de gastos.
          </p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={charts.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                <Line 
                  type="monotone" 
                  dataKey="total_cost" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }} 
                  name="Custo Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;