"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import type { Statistics } from "@/app/page"
import { grupo1FrequencyData, grupo2FrequencyData } from "@/app/page"

interface ChartSectionProps {
  grupo1Data: number[]
  grupo2Data: number[]
  grupo1Stats: Statistics
  grupo2Stats: Statistics
}

export default function ChartSection({ grupo1Data, grupo2Data, grupo1Stats, grupo2Stats }: ChartSectionProps) {
  const [activeChart, setActiveChart] = useState("histogram")

  const chartDescriptions = {
    histogram: "Histograma mostra a distribuição de frequências dos dados baseado nas classes originais.",
    boxplot:
      "Box Plot exibe quartis, mediana, whiskers, outliers e todos os pontos de dados para análise completa da distribuição.",
    ogiva: "Ogiva (curva de frequência acumulada) mostra a distribuição cumulativa dos dados dos dois grupos.",
  }

  // Cores consistentes
  const GRUPO1_COLOR = "#2563eb" // Azul
  const GRUPO2_COLOR = "#dc2626" // Vermelho

  // Criar dados do histograma baseado nas classes originais
  function createHistogramData() {
    const maxLength = Math.max(grupo1FrequencyData.length, grupo2FrequencyData.length)
    const histogramData = []

    for (let i = 0; i < maxLength; i++) {
      const g1Data = grupo1FrequencyData[i]
      const g2Data = grupo2FrequencyData[i]

      histogramData.push({
        classe: g1Data?.classe || g2Data?.classe || `Classe ${i + 1}`,
        "Grupo 1": g1Data?.frequencia || 0,
        "Grupo 2": g2Data?.frequencia || 0,
      })
    }

    return histogramData
  }

  // Função para detectar outliers
  function detectOutliers(data: number[], stats: Statistics) {
    const lowerBound = stats.q1 - 1.5 * stats.iqr
    const upperBound = stats.q3 + 1.5 * stats.iqr
    return data.filter((value) => value < lowerBound || value > upperBound)
  }

  // Função para criar dados da ogiva baseado nas frequências acumuladas
  function createOgivaData() {
    const ogivaData = []

    // Usar os dados das tabelas de frequência para criar a ogiva
    const maxClasses = Math.max(grupo1FrequencyData.length, grupo2FrequencyData.length)

    for (let i = 0; i < maxClasses; i++) {
      const g1 = grupo1FrequencyData[i]
      const g2 = grupo2FrequencyData[i]

      // Extrair o valor final da classe para usar como ponto X
      const getClassEndValue = (classe: string) => {
        const parts = classe.split(" - ")
        return Number.parseFloat(parts[1]) || 0
      }

      if (g1 || g2) {
        ogivaData.push({
          valor: g1 ? getClassEndValue(g1.classe) : getClassEndValue(g2.classe),
          "Grupo 1": g1?.frAcumulada || 0,
          "Grupo 2": g2?.frAcumulada || 0,
        })
      }
    }

    return ogivaData
  }

  // Componente BoxPlot realista e detalhado
  const RealisticBoxPlot = () => {
    const outliers1 = detectOutliers(grupo1Data, grupo1Stats)
    const outliers2 = detectOutliers(grupo2Data, grupo2Stats)

    // Calcular whiskers (valores não-outliers mais extremos)
    const nonOutliers1 = grupo1Data.filter((v) => !outliers1.includes(v))
    const whiskerMin1 = nonOutliers1.length > 0 ? Math.min(...nonOutliers1) : grupo1Stats.min
    const whiscerMax1 = nonOutliers1.length > 0 ? Math.max(...nonOutliers1) : grupo1Stats.max

    const nonOutliers2 = grupo2Data.filter((v) => !outliers2.includes(v))
    const whiskerMin2 = nonOutliers2.length > 0 ? Math.min(...nonOutliers2) : grupo2Stats.min
    const whiskerMax2 = nonOutliers2.length > 0 ? Math.max(...nonOutliers2) : grupo2Stats.max

    const allValues = [...grupo1Data, ...grupo2Data]
    const minY = Math.min(...allValues) - 1
    const maxY = Math.max(...allValues) + 1
    const range = maxY - minY

    // Função para converter valor para coordenada Y
    const valueToY = (value: number) => 380 - ((value - minY) / range) * 320

    return (
      <div className="w-full h-[450px] relative bg-white rounded-lg border">
        <svg width="100%" height="100%" viewBox="0 0 600 450">
          {/* Grid de fundo */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Eixos */}
          <line x1="80" y1="50" x2="80" y2="380" stroke="#374151" strokeWidth="2" />
          <line x1="80" y1="380" x2="520" y2="380" stroke="#374151" strokeWidth="2" />

          {/* Labels do eixo Y */}
          {Array.from({ length: 8 }, (_, i) => {
            const value = minY + (i * range) / 7
            const y = valueToY(value)
            return (
              <g key={i}>
                <line x1="75" y1={y} x2="85" y2={y} stroke="#374151" strokeWidth="1" />
                <text x="70" y={y + 4} textAnchor="end" fontSize="11" fill="#374151">
                  {value.toFixed(1)}
                </text>
              </g>
            )
          })}

          {/* GRUPO 1 - Box Plot */}
          <g>
            {/* Todos os pontos de dados (agora lineares) */}
            {grupo1Data.map((value, index) => (
              <circle
                key={`g1-point-${index}`}
                cx="180" // Removido o jitter
                cy={valueToY(value)}
                r="2"
                fill={GRUPO1_COLOR}
                fillOpacity="0.4"
                stroke={GRUPO1_COLOR}
                strokeWidth="0.5"
              />
            ))}

            {/* Whisker inferior */}
            <line
              x1="180"
              y1={valueToY(whiskerMin1)}
              x2="180"
              y2={valueToY(grupo1Stats.q1)}
              stroke={GRUPO1_COLOR}
              strokeWidth="2"
            />

            {/* Whisker superior */}
            <line
              x1="180"
              y1={valueToY(grupo1Stats.q3)}
              x2="180"
              y2={valueToY(whiscerMax1)}
              stroke={GRUPO1_COLOR}
              strokeWidth="2"
            />

            {/* Caixa (Q1 a Q3) */}
            <rect
              x="160"
              y={valueToY(grupo1Stats.q3)}
              width="40"
              height={valueToY(grupo1Stats.q1) - valueToY(grupo1Stats.q3)}
              fill={GRUPO1_COLOR}
              fillOpacity="0.3"
              stroke={GRUPO1_COLOR}
              strokeWidth="2"
            />

            {/* Linha da mediana */}
            <line
              x1="160"
              y1={valueToY(grupo1Stats.median)}
              x2="200"
              y2={valueToY(grupo1Stats.median)}
              stroke={GRUPO1_COLOR}
              strokeWidth="3"
            />

            {/* Caps dos whiskers */}
            <line
              x1="170"
              y1={valueToY(whiskerMin1)}
              x2="190"
              y2={valueToY(whiskerMin1)}
              stroke={GRUPO1_COLOR}
              strokeWidth="2"
            />
            <line
              x1="170"
              y1={valueToY(whiscerMax1)}
              x2="190"
              y2={valueToY(whiscerMax1)}
              stroke={GRUPO1_COLOR}
              strokeWidth="2"
            />

            {/* Outliers */}
            {outliers1.map((outlier, index) => (
              <circle
                key={`g1-outlier-${index}`}
                cx="180"
                cy={valueToY(outlier)}
                r="4"
                fill={GRUPO1_COLOR}
                stroke="white"
                strokeWidth="2"
              />
            ))}

            {/* Estatísticas textuais */}
            <text x="180" y="25" textAnchor="middle" fontSize="12" fill={GRUPO1_COLOR} fontWeight="bold">
              Grupo 1 (10h-15h)
            </text>
            <text x="180" y="50" textAnchor="middle" fontSize="10" fill="#666">
              Min: {grupo1Stats.min.toFixed(1)} | Q1: {grupo1Stats.q1.toFixed(1)} | Med: {grupo1Stats.median.toFixed(1)}{" "}
              | Q3: {grupo1Stats.q3.toFixed(1)} | Max: {grupo1Stats.max.toFixed(1)}
            </text>
          </g>

          {/* GRUPO 2 - Box Plot */}
          <g>
            {/* Todos os pontos de dados (agora lineares) */}
            {grupo2Data.map((value, index) => (
              <circle
                key={`g2-point-${index}`}
                cx="420" // Removido o jitter
                cy={valueToY(value)}
                r="2"
                fill={GRUPO2_COLOR}
                fillOpacity="0.4"
                stroke={GRUPO2_COLOR}
                strokeWidth="0.5"
              />
            ))}

            {/* Whisker inferior */}
            <line
              x1="420"
              y1={valueToY(whiskerMin2)}
              x2="420"
              y2={valueToY(grupo2Stats.q1)}
              stroke={GRUPO2_COLOR}
              strokeWidth="2"
            />

            {/* Whisker superior */}
            <line
              x1="420"
              y1={valueToY(grupo2Stats.q3)}
              x2="420"
              y2={valueToY(whiskerMax2)}
              stroke={GRUPO2_COLOR}
              strokeWidth="2"
            />

            {/* Caixa (Q1 a Q3) */}
            <rect
              x="400"
              y={valueToY(grupo2Stats.q3)}
              width="40"
              height={valueToY(grupo2Stats.q1) - valueToY(grupo2Stats.q3)}
              fill={GRUPO2_COLOR}
              fillOpacity="0.3"
              stroke={GRUPO2_COLOR}
              strokeWidth="2"
            />

            {/* Linha da mediana */}
            <line
              x1="400"
              y1={valueToY(grupo2Stats.median)}
              x2="440"
              y2={valueToY(grupo2Stats.median)}
              stroke={GRUPO2_COLOR}
              strokeWidth="3"
            />

            {/* Caps dos whiskers */}
            <line
              x1="410"
              y1={valueToY(whiskerMin2)}
              x2="430"
              y2={valueToY(whiskerMin2)}
              stroke={GRUPO2_COLOR}
              strokeWidth="2"
            />
            <line
              x1="410"
              y1={valueToY(whiskerMax2)}
              x2="430"
              y2={valueToY(whiskerMax2)}
              stroke={GRUPO2_COLOR}
              strokeWidth="2"
            />

            {/* Outliers */}
            {outliers2.map((outlier, index) => (
              <circle
                key={`g2-outlier-${index}`}
                cx="420"
                cy={valueToY(outlier)}
                r="4"
                fill={GRUPO2_COLOR}
                stroke="white"
                strokeWidth="2"
              />
            ))}

            {/* Estatísticas textuais */}
            <text x="420" y="25" textAnchor="middle" fontSize="12" fill={GRUPO2_COLOR} fontWeight="bold">
              Grupo 2 (15h-20h)
            </text>
            <text x="420" y="50" textAnchor="middle" fontSize="10" fill="#666">
              Min: {grupo2Stats.min.toFixed(1)} | Q1: {grupo2Stats.q1.toFixed(1)} | Med: {grupo2Stats.median.toFixed(1)}{" "}
              | Q3: {grupo2Stats.q3.toFixed(1)} | Max: {grupo2Stats.max.toFixed(1)}
            </text>
          </g>

          {/* Título */}
          <text x="300" y="20" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
            Box Plot Detalhado - Comparação dos Grupos
          </text>

          {/* Legenda */}
          <g transform="translate(50, 400)">
            <circle cx="10" cy="10" r="3" fill={GRUPO1_COLOR} />
            <text x="20" y="14" fontSize="11" fill="#374151">
              Grupo 1 - Pontos de dados
            </text>
            <circle cx="150" cy="10" r="3" fill={GRUPO2_COLOR} />
            <text x="160" y="14" fontSize="11" fill="#374151">
              Grupo 2 - Pontos de dados
            </text>
            <circle cx="300" cy="10" r="4" fill="#666" stroke="white" strokeWidth="2" />
            <text x="310" y="14" fontSize="11" fill="#374151">
              Outliers
            </text>
          </g>

          {/* Labels dos eixos */}
          <text x="300" y="440" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">
            Grupos
          </text>
          <text
            x="25"
            y="220"
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="bold"
            transform="rotate(-90, 25, 220)"
          >
            Valores (km)
          </text>
        </svg>
      </div>
    )
  }

  const renderChart = () => {
    switch (activeChart) {
      case "histogram":
        const histogramData = createHistogramData()
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="classe" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Grupo 1" fill={GRUPO1_COLOR} name="Grupo 1 (10h-15h)" />
              <Bar dataKey="Grupo 2" fill={GRUPO2_COLOR} name="Grupo 2 (15h-20h)" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "boxplot":
        return <RealisticBoxPlot />

      case "ogiva":
        const ogivaData = createOgivaData()
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ogivaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="valor" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, ""]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Grupo 1"
                stroke={GRUPO1_COLOR}
                strokeWidth={3}
                name="Grupo 1 (10h-15h)"
                dot={{ fill: GRUPO1_COLOR, strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Grupo 2"
                stroke={GRUPO2_COLOR}
                strokeWidth={3}
                name="Grupo 2 (15h-20h)"
                dot={{ fill: GRUPO2_COLOR, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Card className="mb-8 border-l-4 border-l-blue-600">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-blue-800">📊 Visualizações dos Dados</CardTitle>
          <div className="flex flex-wrap gap-2">
            {Object.keys(chartDescriptions).map((chartType) => (
              <Button
                key={chartType}
                variant={activeChart === chartType ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveChart(chartType)}
                className={
                  activeChart === chartType
                    ? "bg-blue-700 hover:bg-blue-800"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }
              >
                {chartType === "histogram" && "Histograma"}
                {chartType === "boxplot" && "Box Plot"}
                {chartType === "ogiva" && "Ogiva"}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border-l-4 border-l-blue-600">
          <p className="text-gray-700">{chartDescriptions[activeChart as keyof typeof chartDescriptions]}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}
