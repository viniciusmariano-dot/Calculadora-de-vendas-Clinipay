import React, { useState } from 'react';
import { Calculator, DollarSign, CreditCard, TrendingUp, CheckCircle2 } from 'lucide-react';

// Rate tables
const taxasStandard = [
  { parcelas: 1,  label: 'À vista', mdr: 0.0239, ant: 0.0199 },
  { parcelas: 2,  label: '2x',    mdr: 0.0299, ant: 0.0296 },
  { parcelas: 3,  label: '3x',    mdr: 0.0299, ant: 0.0394 },
  { parcelas: 4,  label: '4x',    mdr: 0.0299, ant: 0.0493 },
  { parcelas: 5,  label: '5x',    mdr: 0.0299, ant: 0.0591 },
  { parcelas: 6,  label: '6x',    mdr: 0.0299, ant: 0.0690 },
  { parcelas: 7,  label: '7x',    mdr: 0.0349, ant: 0.0788 },
  { parcelas: 8,  label: '8x',    mdr: 0.0349, ant: 0.0887 },
  { parcelas: 9,  label: '9x',    mdr: 0.0349, ant: 0.0986 },
  { parcelas: 10, label: '10x',   mdr: 0.0349, ant: 0.1084 },
  { parcelas: 11, label: '11x',   mdr: 0.0349, ant: 0.1183 },
  { parcelas: 12, label: '12x',   mdr: 0.0349, ant: 0.1281 },
  { parcelas: 13, label: '13x',   mdr: 0.0399, ant: 0.1380 },
  { parcelas: 14, label: '14x',   mdr: 0.0399, ant: 0.1478 },
  { parcelas: 15, label: '15x',   mdr: 0.0399, ant: 0.1577 },
  { parcelas: 16, label: '16x',   mdr: 0.0399, ant: 0.1675 },
  { parcelas: 17, label: '17x',   mdr: 0.0399, ant: 0.1774 },
  { parcelas: 18, label: '18x',   mdr: 0.0399, ant: 0.1873 },
  { parcelas: 19, label: '19x',   mdr: 0.0399, ant: 0.1971 },
  { parcelas: 20, label: '20x',   mdr: 0.0399, ant: 0.2070 },
  { parcelas: 21, label: '21x',   mdr: 0.0399, ant: 0.2168 }
];

const taxasPremium = [
  { parcelas: 1,  label: 'À vista', mdr: 0.0199, ant: 0.0169 },
  { parcelas: 2,  label: '2x',    mdr: 0.0239, ant: 0.0251 },
  { parcelas: 3,  label: '3x',    mdr: 0.0239, ant: 0.0335 },
  { parcelas: 4,  label: '4x',    mdr: 0.0239, ant: 0.0419 },
  { parcelas: 5,  label: '5x',    mdr: 0.0239, ant: 0.0503 },
  { parcelas: 6,  label: '6x',    mdr: 0.0239, ant: 0.0587 },
  { parcelas: 7,  label: '7x',    mdr: 0.0299, ant: 0.0671 },
  { parcelas: 8,  label: '8x',    mdr: 0.0299, ant: 0.0754 },
  { parcelas: 9,  label: '9x',    mdr: 0.0299, ant: 0.0838 },
  { parcelas: 10, label: '10x',   mdr: 0.0299, ant: 0.0922 },
  { parcelas: 11, label: '11x',   mdr: 0.0299, ant: 0.1006 },
  { parcelas: 12, label: '12x',   mdr: 0.0299, ant: 0.1090 },
  { parcelas: 13, label: '13x',   mdr: 0.0349, ant: 0.1173 },
  { parcelas: 14, label: '14x',   mdr: 0.0349, ant: 0.1257 },
  { parcelas: 15, label: '15x',   mdr: 0.0349, ant: 0.1341 },
  { parcelas: 16, label: '16x',   mdr: 0.0349, ant: 0.1425 },
  { parcelas: 17, label: '17x',   mdr: 0.0349, ant: 0.1509 },
  { parcelas: 18, label: '18x',   mdr: 0.0349, ant: 0.1593 },
  { parcelas: 19, label: '19x',   mdr: 0.0349, ant: 0.1676 },
  { parcelas: 20, label: '20x',   mdr: 0.0349, ant: 0.1760 },
  { parcelas: 21, label: '21x',   mdr: 0.0349, ant: 0.1844 }
];

interface CalculationResult {
  standard: {
    fee: number;
    net: number;
  };
  premium: {
    fee: number;
    net: number;
  };
  savings: number;
}

function App() {
  const [saleValue, setSaleValue] = useState<string>('');
  const [installments, setInstallments] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateFees = () => {
    setError('');
    
    const value = parseFloat(saleValue.replace(/[^\d.,]/g, '').replace(',', '.'));
    const numInstallments = parseInt(installments);
    
    if (isNaN(value) || value <= 0) {
      setError('Por favor, informe um valor de venda válido.');
      return;
    }
    
    if (isNaN(numInstallments) || numInstallments < 1 || numInstallments > 21) {
      setError('Por favor, informe um número de parcelas entre 1 e 21.');
      return;
    }
    
    const standardData = taxasStandard[numInstallments - 1];
    const premiumData = taxasPremium[numInstallments - 1];
    
    // Calculate Standard fees
    const feeStandard = (standardData.mdr * value) + ((value - (standardData.mdr * value)) * standardData.ant);
    const netStandard = value - feeStandard;
    
    // Calculate Premium fees
    const feePremium = (premiumData.mdr * value) + ((value - (premiumData.mdr * value)) * premiumData.ant);
    const netPremium = value - feePremium;
    
    // Calculate savings
    const savings = feeStandard - feePremium;
    
    setResult({
      standard: { fee: feeStandard, net: netStandard },
      premium: { fee: feePremium, net: netPremium },
      savings: savings
    });
  };

  const handleSaleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSaleValue(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Calculadora Vendas Clinipay
            </h1>
            <p className="text-lg text-gray-600">
              Compare os planos <span className="font-semibold text-gray-800">Standard</span> e{' '}
              <span className="font-semibold text-orange-600">Premium</span> da Clinipay
            </p>
          </div>

          {/* Calculator Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="saleValue" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2 text-orange-600" />
                  Valor da Venda
                </label>
                <input
                  type="text"
                  id="saleValue"
                  value={saleValue}
                  onChange={handleSaleValueChange}
                  placeholder="Ex: R$ 20.000,00"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                />
              </div>

              <div>
                <label htmlFor="installments" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 mr-2 text-orange-600" />
                  Quantidade de Parcelas
                </label>
                <select
                  id="installments"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg bg-white"
                >
                  <option value="">Selecione...</option>
                  {taxasStandard.map((item) => (
                    <option key={item.parcelas} value={item.parcelas}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={calculateFees}
                disabled={!saleValue || !installments}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <Calculator className="w-5 h-5 inline-block mr-2" />
                Calcular Taxa de Venda
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* Standard Plan */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-black flex items-center">
                    <div className="w-3 h-3 bg-black rounded-full mr-3"></div>
                    Plano Standard
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Taxa Total</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(result.standard.fee)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Valor Líquido</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(result.standard.net)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                    Plano Premium
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Taxa Total</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(result.premium.fee)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Valor Líquido</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(result.premium.net)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-xl text-white overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="w-6 h-6 mr-2" />
                        <h3 className="text-xl font-bold">Economia com Premium</h3>
                      </div>
                      <p className="text-3xl md:text-4xl font-bold">
                        {formatCurrency(result.savings)}
                      </p>
                      <p className="text-orange-100 mt-2">
                        Você economiza escolhendo o plano Premium
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <TrendingUp className="w-16 h-16 text-orange-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;