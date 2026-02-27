// Estrutura dos dados informados no formulário da calculadora.
// Cada campo representa um fator que influencia no custo final da impressão 3D.
export interface PrintingData {
  filamentPrice: number;
  filamentWeight: number;
  partWeight: number;
  filamentLoss: number;
  printerPower: number;
  printTime: number;
  electricityPrice: number;
  hourlyRate: number;
  prepTime: number;
  maintenanceMonthly: number;
  workingHoursMonthly: number;
  failureRate: number;
  profitMargin: number;
}

// Estrutura de saída dos cálculos, usada para exibir resumo, gráfico e PDF.
export interface CalculationResults {
  filamentCost: number;
  electricityCost: number;
  laborCost: number;
  overheadCost: number;
  failureBuffer: number;
  totalProductionCost: number;
  suggestedPrice: number;
  totalProfit: number;
}
