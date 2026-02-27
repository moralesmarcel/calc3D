import { useMemo, useState } from 'react';
import { AlertCircle, Calculator, Clock, Download, FileText, Moon, Package, Printer, Settings, Sun, TrendingUp, Zap } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DARK_COLORS, INITIAL_DATA, LIGHT_COLORS } from './data/constants';
import { InputField } from './components/InputField';
import { InputGroup } from './components/InputGroup';
import { CalculationResults, PrintingData } from './types';

export default function App() {
    // Estados principais da tela: tema, nome do projeto e dados do formulário.
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [data, setData] = useState<PrintingData>(INITIAL_DATA);
  
    // Escolhe automaticamente a paleta de cores conforme o tema selecionado.
  const theme = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const results = useMemo<CalculationResults>(() => {
    // Este bloco concentra toda a regra de negócio da calculadora.
    // useMemo evita recalcular tudo quando nada foi alterado no formulário.
    const pricePerGram = data.filamentPrice / data.filamentWeight;
    const filamentCost = pricePerGram * data.partWeight * (1 + data.filamentLoss / 100);
    const electricityCost = (data.printerPower / 1000) * data.printTime * data.electricityPrice;
    const laborCost = data.prepTime * data.hourlyRate;
    const hourlyMaintenance = data.maintenanceMonthly / data.workingHoursMonthly;
    const overheadCost = hourlyMaintenance * data.printTime;
    const subtotal = filamentCost + electricityCost + laborCost + overheadCost;
    const failureBuffer = subtotal * (data.failureRate / 100);
    const totalProductionCost = subtotal + failureBuffer;
    const suggestedPrice = totalProductionCost * (1 + data.profitMargin / 100);

    return {
      filamentCost,
      electricityCost,
      laborCost,
      overheadCost,
      failureBuffer,
      totalProductionCost,
      suggestedPrice,
      totalProfit: suggestedPrice - totalProductionCost
    };
  }, [data]);

  const updateData = (key: keyof PrintingData, value: number) => {
    // Atualiza apenas o campo alterado, preservando os demais valores do formulário.
    setData((previous: PrintingData) => ({ ...previous, [key]: value }));
  };

  const generatePDF = () => {
    // Geração do PDF resumindo todos os custos para compartilhar com cliente.
    const now = new Date();
    const osNumber = `${now.toISOString().slice(0, 19).replace(/[-:T]/g, '').slice(0, 14)}`;
    const doc = new jsPDF();

    doc.setFillColor(50, 47, 62);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Calc3D Pro - Relatório de Pedido', 15, 20);
    doc.setFontSize(10);
    doc.text(`OS: ${osNumber}`, 15, 30);

    doc.setTextColor(50, 47, 62);
    doc.text(`Projeto/Cliente: ${projectName || 'Não informado'}`, 15, 50);

    autoTable(doc, {
      startY: 58,
      head: [['Parâmetro', 'Valor']],
      body: [
        ['Preço do rolo', `R$ ${data.filamentPrice.toFixed(2)}`],
        ['Peso da peça', `${data.partWeight}g`],
        ['Tempo de impressão', `${data.printTime}h`],
        ['Taxa de falha', `${data.failureRate}%`],
        ['Margem de lucro', `${data.profitMargin}%`]
      ]
    });

    autoTable(doc, {
      startY: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8,
      head: [['Detalhamento', 'Valor (R$)']],
      body: [
        ['Filamento', results.filamentCost.toFixed(2)],
        ['Energia', results.electricityCost.toFixed(2)],
        ['Mão de obra', results.laborCost.toFixed(2)],
        ['Manutenção', results.overheadCost.toFixed(2)],
        ['Reserva para falha', results.failureBuffer.toFixed(2)],
        ['Total de produção', results.totalProductionCost.toFixed(2)],
        ['Preço sugerido', results.suggestedPrice.toFixed(2)],
        ['Lucro estimado', results.totalProfit.toFixed(2)]
      ]
    });

    doc.save(`${osNumber}_Calc3D_Pro.pdf`);
  };

  // Dados consolidados para o gráfico de pizza (composição de custos).
  const chartData = [
    { name: 'Material', value: results.filamentCost, color: theme.chart.material },
    { name: 'Energia', value: results.electricityCost, color: theme.chart.energy },
    { name: 'Mão de obra', value: results.laborCost, color: theme.chart.labor },
    { name: 'Manutenção', value: results.overheadCost, color: theme.chart.maint },
    { name: 'Falhas', value: results.failureBuffer, color: theme.chart.fail }
  ];

  return (
    // Estrutura principal da página (layout responsivo + tema dinâmico).
    <div className="min-h-screen pb-12 transition-colors duration-300" style={{ backgroundColor: theme.bg, color: theme.text }}>
      {/* Cabeçalho fixo com identidade da ferramenta e botão de troca de tema. */}
      <header className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: theme.header, borderColor: theme.border }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-2" style={{ backgroundColor: theme.accent }}>
              <Printer className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Calc3D <span style={{ color: theme.accent }}>Pro</span></h1>
          </div>
          <button
            onClick={() => setIsDarkMode((prev: boolean) => !prev)}
            className="rounded-full p-2"
            title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Conteúdo principal dividido em duas colunas: formulário e painel de resultados. */}
      <main className="mx-auto max-w-7xl px-4 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Coluna esquerda: parâmetros de entrada da simulação. */}
          <div className="space-y-4 lg:col-span-7">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Settings className="h-5 w-5" style={{ color: theme.textMuted }} />
              Parâmetros de produção
            </h2>

            <InputGroup theme={theme} label="Identificação do pedido" icon={<FileText className="h-5 w-5" style={{ color: theme.accent }} />}>
              <div className="col-span-full">
                <InputField theme={theme} label="Projeto / Cliente" type="text" value={projectName} onChange={(value) => setProjectName(String(value))} />
              </div>
            </InputGroup>

            <InputGroup theme={theme} label="Filamento / Material" icon={<Package className="h-5 w-5" style={{ color: theme.chart.material }} />}>
              <InputField theme={theme} label="Preço do rolo" value={data.filamentPrice} onChange={(v) => updateData('filamentPrice', Number(v))} suffix="R$" step={0.01} />
              <InputField theme={theme} label="Peso do rolo" value={data.filamentWeight} onChange={(v) => updateData('filamentWeight', Number(v))} suffix="g" />
              <InputField theme={theme} label="Peso da peça" value={data.partWeight} onChange={(v) => updateData('partWeight', Number(v))} suffix="g" />
              <InputField theme={theme} label="Perda estimada" value={data.filamentLoss} onChange={(v) => updateData('filamentLoss', Number(v))} suffix="%" />
            </InputGroup>

            <InputGroup theme={theme} label="Energia e tempo" icon={<Zap className="h-5 w-5" style={{ color: theme.chart.energy }} />}>
              <InputField theme={theme} label="Consumo da impressora" value={data.printerPower} onChange={(v) => updateData('printerPower', Number(v))} suffix="W" />
              <InputField theme={theme} label="Tempo de impressão" value={data.printTime} onChange={(v) => updateData('printTime', Number(v))} suffix="h" step={0.1} />
              <InputField theme={theme} label="Preço do kWh" value={data.electricityPrice} onChange={(v) => updateData('electricityPrice', Number(v))} suffix="R$" step={0.01} />
            </InputGroup>

            <InputGroup theme={theme} label="Mão de obra e operação" icon={<Clock className="h-5 w-5" style={{ color: theme.chart.labor }} />}>
              <InputField theme={theme} label="Hora técnica" value={data.hourlyRate} onChange={(v) => updateData('hourlyRate', Number(v))} suffix="R$/h" />
              <InputField theme={theme} label="Tempo de preparo" value={data.prepTime} onChange={(v) => updateData('prepTime', Number(v))} suffix="h" step={0.1} />
            </InputGroup>

            <InputGroup theme={theme} label="Custos fixos e margem" icon={<TrendingUp className="h-5 w-5" />}>
              <InputField theme={theme} label="Manutenção mensal" value={data.maintenanceMonthly} onChange={(v) => updateData('maintenanceMonthly', Number(v))} suffix="R$" />
              <InputField theme={theme} label="Horas trabalhadas/mês" value={data.workingHoursMonthly} onChange={(v) => updateData('workingHoursMonthly', Number(v))} suffix="h" />
              <InputField theme={theme} label="Taxa de falha" value={data.failureRate} onChange={(v) => updateData('failureRate', Number(v))} suffix="%" />
              <InputField theme={theme} label="Margem de lucro" value={data.profitMargin} onChange={(v) => updateData('profitMargin', Number(v))} suffix="%" />
            </InputGroup>
          </div>

          {/* Coluna direita: resumo financeiro e gráfico de composição. */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <section className="relative overflow-hidden rounded-2xl p-8 text-white shadow-xl" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : theme.text }}>
                <div className="relative z-10">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <p className="mb-1 text-sm uppercase tracking-widest text-slate-400">Custo de produção</p>
                      <h3 className="text-4xl font-bold">R$ {results.totalProductionCost.toFixed(2)}</h3>
                    </div>
                    <div className="rounded-xl p-3" style={{ backgroundColor: `${theme.accent}33` }}>
                      <Calculator className="h-6 w-6" style={{ color: theme.accent }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <div>
                      <p className="mb-1 text-xs uppercase text-slate-400">Preço sugerido</p>
                      <p className="text-2xl font-bold" style={{ color: theme.secondary }}>R$ {results.suggestedPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase text-slate-400">Lucro estimado</p>
                      <p className="text-2xl font-bold" style={{ color: theme.accent }}>R$ {results.totalProfit.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Botão que dispara a geração do relatório PDF com os dados atuais. */}
                  <button
                    onClick={generatePDF}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 py-4 font-bold transition hover:bg-white/20"
                  >
                    <Download className="h-5 w-5" />
                    Gerar relatório PDF
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <AlertCircle className="h-4 w-4" style={{ color: theme.accent }} />
                  Composição de custos
                </h3>
                <div className="h-64 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      {/* Tooltip formatado em moeda para facilitar leitura do gráfico. */}
                      <Tooltip formatter={(value: number | string | undefined) => `R$ ${Number(value ?? 0).toFixed(2)}`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé com crédito do desenvolvedor e link clicável para o GitHub. */}
      <footer className="mx-auto mt-12 max-w-7xl border-t px-4 pt-6" style={{ borderColor: theme.border }}>
        <p className="text-center text-sm" style={{ color: theme.textMuted }}>
          Desenvolvido por{' '}
          <a
            href="https://github.com/moralesmarcel"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            style={{ color: theme.accent }}
          >
            Marcel Morales
          </a>
        </p>
      </footer>
    </div>
  );
}
