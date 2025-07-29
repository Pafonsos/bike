"use client"

import { useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import StatisticsCard from "@/components/statistics-card"
import ChartSection from "@/components/chart-section"
import FrequencyTable from "@/components/frequency-table"
import ComparisonSection from "@/components/comparison-section"
// import VerificationSection from "@/components/verification-section" // Removido

// Dados reconstruídos a partir das tabelas de frequência para visualização nos gráficos
// Estes dados são uma aproximação para representar a distribuição das classes.
const grupo1Data = [
  // Classe 7.0-10.0: 1 valor (ponto médio 8.5)
  8.5,
  // Classe 10.01-13.0: 3 valores (distribuídos na classe)
  10.5, 11.5, 12.5,
  // Classe 13.01-16.0: 7 valores (distribuídos na classe)
  13.5, 14.0, 14.5, 15.0, 15.2, 15.5, 15.8,
  // Classe 16.01-19.0: 10 valores (distribuídos na classe)
  16.2, 16.5, 16.8, 17.0, 17.2, 17.5, 17.8, 18.0, 18.3, 18.7,
  // Classe 19.01-22.0: 3 valores (distribuídos na classe)
  19.5, 20.5, 21.5,
  // Classe 22.01-25.0: 6 valores (distribuídos na classe)
  22.5, 23.0, 23.5, 24.0, 24.5, 25.0,
]

// Dados reconstruídos para o Grupo 2, ajustados para 38 observações
const grupo2Data = [
  // Classe 4.39-7.95: 1 valor
  6.0,
  // Classe 7.95-11.51: 4 valores
  8.5, 9.5, 10.5, 11.0,
  // Classe 11.51-15.07: 14 valores (restaurado para 14)
  12.0, 12.5, 13.0, 13.2, 13.5, 13.8, 14.0, 14.2, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0,
  // Classe 15.07-18.63: 12 valores
  15.5, 16.0, 16.2, 16.5, 16.8, 17.0, 17.2, 17.5, 17.8, 18.0, 18.3, 18.5,
  // Classe 18.63-22.19: 5 valores
  19.0, 20.0, 21.0, 22.0, 21.5,
  // Classe 22.19-25.77: 2 valores
  23.5, 25.0,
]

export interface FrequencyData {
  classe: string
  frequencia: number
  xi: number // Novo campo para o ponto médio
  fr: number
  fAcumulada: number
  frAcumulada: number
}

// Dados das tabelas de frequência originais (para exibição nas tabelas e histograma)
export const grupo1FrequencyData: FrequencyData[] = [
  { classe: "7.27 - 10.18", frequencia: 1, xi: 8.73, fr: 3.13, fAcumulada: 1, frAcumulada: 3.13 },
  { classe: "10.18 - 13.09", frequencia: 4, xi: 11.64, fr: 12.5, fAcumulada: 5, frAcumulada: 15.63 },
  { classe: "13.09 - 16.00", frequencia: 6, xi: 14.55, fr: 18.75, fAcumulada: 11, frAcumulada: 34.38 },
  { classe: "16.00 - 18.91", frequencia: 15, xi: 17.46, fr: 46.88, fAcumulada: 26, frAcumulada: 81.25 },
  { classe: "18.91 - 21.82", frequencia: 3, xi: 20.37, fr: 9.38, fAcumulada: 29, frAcumulada: 90.63 },
  { classe: "21.82 - 24.75", frequencia: 3, xi: 23.29, fr: 9.38, fAcumulada: 32, frAcumulada: 100.0 },
]

// Dados de frequência do Grupo 2, restaurados para somar 38 observações
export const grupo2FrequencyData: FrequencyData[] = [
  { classe: "4.39 - 7.95", frequencia: 1, xi: 6.17, fr: 2.63, fAcumulada: 1, frAcumulada: 2.63 },
  { classe: "7.95 - 11.51", frequencia: 4, xi: 9.73, fr: 10.53, fAcumulada: 5, frAcumulada: 13.16 },
  { classe: "11.51 - 15.07", frequencia: 14, xi: 13.29, fr: 36.84, fAcumulada: 19, frAcumulada: 50.0 },
  { classe: "15.07 - 18.63", frequencia: 12, xi: 16.85, fr: 31.58, fAcumulada: 31, frAcumulada: 81.58 },
  { classe: "18.63 - 22.19", frequencia: 5, xi: 20.41, fr: 13.16, fAcumulada: 36, frAcumulada: 94.74 },
  { classe: "22.19 - 25.77", frequencia: 2, xi: 23.98, fr: 5.26, fAcumulada: 38, frAcumulada: 100.0 },
]

export interface Statistics {
  mean: number
  errorStd: number
  median: number
  mode: number[] | null
  std: number
  variance: number
  kurtosis: number
  skewness: number
  range: number
  min: number
  max: number
  sum: number
  count: number
  confidenceLevel95: number
  q1: number
  q3: number
  iqr: number
}

// Estatísticas EXATAS fornecidas pelo usuário (mantidas como hardcoded)
const providedGrupo1Stats: Statistics = {
  mean: 16.9196875,
  errorStd: 0.638731335,
  median: 17.23,
  mode: [12.6],
  std: 3.613210068,
  variance: 13.055287,
  kurtosis: 0.779421361,
  skewness: -0.166211381,
  range: 17.48,
  min: 7.27,
  max: 24.75,
  sum: 541.43,
  count: 32,
  confidenceLevel95: 1.302701147,
  q1: 13.76,
  q3: 18.8,
  iqr: 5.04,
}

const providedGrupo2Stats: Statistics = {
  mean: 15.57105263,
  errorStd: 0.686039491,
  median: 15.05,
  mode: [20.87],
  std: 4.229031446,
  variance: 17.88470697,
  kurtosis: 0.83652901,
  skewness: 0.160081415,
  range: 21.38,
  min: 4.39,
  max: 25.77,
  sum: 591.7,
  count: 38, // Mantido como 38, pois é a estatística fornecida
  confidenceLevel95: 1.390048046,
  q1: 12.74,
  q3: 17.68,
  iqr: 4.94,
}

// Função para calcular estatísticas a partir de um array de dados (usada para verificação)
function calculateStatisticsFromData(data: number[]): Statistics {
  const sorted = [...data].sort((a, b) => a - b)
  const n = sorted.length

  const getQuantile = (p: number) => {
    const pos = p * (n - 1)
    const base = Math.floor(pos)
    const rest = pos - base

    if (base + 1 < n) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base])
    }
    return sorted[base]
  }

  const quartiles = {
    q1: getQuantile(0.25),
    median: getQuantile(0.5),
    q3: getQuantile(0.75),
  }

  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const variance =
    data.length > 1 ? data.reduce((sq, n_val) => sq + Math.pow(n_val - mean, 2), 0) / (data.length - 1) : 0
  const std = Math.sqrt(variance)

  const frequency: { [key: number]: number } = {}
  let maxFreq = 0
  const modes: number[] = []

  data.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value]
    }
  })

  for (const value in frequency) {
    if (frequency[value] === maxFreq) {
      modes.push(Number.parseFloat(value))
    }
  }

  // Simplified calculations for verification purposes, not for exact match
  const sum = data.reduce((a, b) => a + b, 0)
  const count = data.length
  const range = Math.max(...data) - Math.min(...data)
  const min = Math.min(...data)
  const max = Math.max(...data)
  const iqr = quartiles.q3 - quartiles.q1

  // Placeholder for complex stats not easily calculable from reconstructed data
  const errorStd = 0
  const kurtosis = 0
  const skewness = 0 // Declared variable here
  const confidenceLevel95 = 0

  return {
    mean,
    errorStd,
    median: quartiles.median,
    mode: modes.length === Object.keys(frequency).length ? null : modes,
    std,
    variance,
    kurtosis,
    skewness,
    range,
    min,
    max,
    sum,
    count,
    confidenceLevel95,
    q1: quartiles.q1,
    q3: quartiles.q3,
    iqr,
  }
}

export default function StatisticalAnalysis() {
  // Usamos as estatísticas fornecidas diretamente para exibição
  const grupo1Stats = providedGrupo1Stats
  const grupo2Stats = providedGrupo2Stats

  // Calculamos as estatísticas a partir dos dados reconstruídos para verificação
  const calculatedGrupo1Stats = calculateStatisticsFromData(grupo1Data)
  const calculatedGrupo2Stats = calculateStatisticsFromData(grupo2Data)

  useEffect(() => {
    console.log("Dados Reconstruídos Grupo 1:", grupo1Data)
    console.log("Estatísticas Fornecidas Grupo 1:", grupo1Stats)
    console.log("Estatísticas Calculadas do Reconstruído Grupo 1:", calculatedGrupo1Stats)
    console.log("Dados Reconstruídos Grupo 2:", grupo2Data)
    console.log("Estatísticas Fornecidas Grupo 2:", grupo2Stats)
    console.log("Estatísticas Calculadas do Reconstruído Grupo 2:", calculatedGrupo2Stats)
  }, [grupo1Stats, grupo2Stats, calculatedGrupo1Stats, calculatedGrupo2Stats])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <Card className="mb-8 border-l-4 border-l-green-600">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-800 mb-2">📊 Análise Estatística Interativa</CardTitle>
            <p className="text-lg text-gray-600">
              Comparação detalhada entre dois grupos de dados com visualizações interativas
            </p>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <StatisticsCard title="📈 Estatísticas - Grupo 1 (10h-15h)" stats={grupo1Stats} isGroup1={true} />
          <StatisticsCard title="📈 Estatísticas - Grupo 2 (15h-20h)" stats={grupo2Stats} isGroup1={false} />
        </div>

        {/* Charts Section */}
        <ChartSection
          grupo1Data={grupo1Data} // Dados reconstruídos para os gráficos
          grupo2Data={grupo2Data} // Dados reconstruídos para os gráficos
          grupo1Stats={grupo1Stats} // Estatísticas fornecidas para o Box Plot
          grupo2Stats={grupo2Stats} // Estatísticas fornecidas para o Box Plot
        />

        {/* Comparison Section */}
        <ComparisonSection grupo1Stats={grupo1Stats} grupo2Stats={grupo2Stats} />

        {/* Frequency Tables */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <FrequencyTable
            data={grupo1Data}
            title="📋 Tabela de Frequências - Grupo 1 (10h-15h)"
            frequencyData={grupo1FrequencyData}
          />
          <FrequencyTable
            data={grupo2Data}
            title="📋 Tabela de Frequências - Grupo 2 (15h-20h)"
            frequencyData={grupo2FrequencyData}
          />
        </div>

        {/* Verification Section (Removido) */}
        {/* <VerificationSection
          grupo1Data={grupo1Data}
          grupo2Data={grupo2Data}
          providedGrupo1Stats={grupo1Stats}
          providedGrupo2Stats={grupo2Stats}
          calculatedGrupo1Stats={calculatedGrupo1Stats}
          calculatedGrupo2Stats={calculatedGrupo2Stats}
        /> */}
      </div>
    </div>
  )
}
