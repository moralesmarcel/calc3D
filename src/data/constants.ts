import { PrintingData } from '../types';

// Valores iniciais exibidos ao abrir a calculadora.
// Eles servem como exemplo e podem ser ajustados pelo usuário na interface.
export const INITIAL_DATA: PrintingData = {
  filamentPrice: 120,
  filamentWeight: 1000,
  partWeight: 180,
  filamentLoss: 8,
  printerPower: 220,
  printTime: 6,
  electricityPrice: 0.95,
  hourlyRate: 30,
  prepTime: 0.8,
  maintenanceMonthly: 300,
  workingHoursMonthly: 120,
  failureRate: 10,
  profitMargin: 35
};

// Paleta usada quando o modo claro está ativo.
export const LIGHT_COLORS = {
  bg: '#f8fafc',
  card: '#ffffff',
  header: '#ffffff',
  text: '#322f3e',
  textMuted: '#64748b',
  border: '#e2e8f0',
  accent: '#e63c6d',
  secondary: '#f5b494',
  chart: {
    material: '#abdecb',
    energy: '#ede7a5',
    labor: '#e63c6d',
    maint: '#322f3e',
    fail: '#f5b494'
  }
};

// Paleta usada quando o usuário ativa o modo escuro.
export const DARK_COLORS = {
  bg: '#2c2c2c',
  card: '#3a3a3a',
  header: '#252525',
  text: '#e4e4e4',
  textMuted: '#a0aec0',
  border: '#4a4a4a',
  accent: '#a8dadc',
  secondary: '#ffc1cc',
  chart: {
    material: '#a8dadc',
    energy: '#ffc1cc',
    labor: '#b39cd0',
    maint: '#e4e4e4',
    fail: '#718096'
  }
};
