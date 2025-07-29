import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Statistics } from "@/app/page"

interface ComparisonSectionProps {
  grupo1Stats: Statistics
  grupo2Stats: Statistics
}

function formatNumber(num: number, precision = 2): string {
  return num.toFixed(precision)
}

export default function ComparisonSection({ grupo1Stats, grupo2Stats }: ComparisonSectionProps) {
  const meanDiff = Math.abs(grupo1Stats.mean - grupo2Stats.mean)
  const stdDiff = Math.abs(grupo1Stats.std - grupo2Stats.std)
  const medianDiff = Math.abs(grupo1Stats.median - grupo2Stats.median)
  const rangeDiff = Math.abs(grupo1Stats.range - grupo2Stats.range)
  const iqrDiff = Math.abs(grupo1Stats.iqr - grupo2Stats.iqr)

  const cvGrupo1 = (grupo1Stats.std / grupo1Stats.mean) * 100
  const cvGrupo2 = (grupo2Stats.std / grupo2Stats.mean) * 100

  const comparisons = [
    {
      icon: "📊",
      label: "Período Grupo 1",
      value: `10h às 15h (${grupo1Stats.count} observações)`,
    },
    {
      icon: "📊",
      label: "Período Grupo 2",
      value: `15h às 20h (${grupo2Stats.count} observações)`,
    },
    {
      icon: "🔢",
      label: "Diferença entre Médias",
      value: `${formatNumber(meanDiff, 2)} km`,
    },
    {
      icon: "📏",
      label: "Diferença entre Medianas",
      value: `${formatNumber(medianDiff, 2)} km`,
    },
    {
      icon: "📈",
      label: "Diferença entre Desvios Padrão",
      value: `${formatNumber(stdDiff, 2)} km`,
    },
    {
      icon: "🎯",
      label: "Grupo com Maior Distância Média",
      value: grupo1Stats.mean > grupo2Stats.mean ? "Grupo 1 (10h-15h)" : "Grupo 2 (15h-20h)",
    },
    {
      icon: "📊",
      label: "Grupo com Maior Variabilidade (Desvio Padrão)",
      value: grupo1Stats.std > grupo2Stats.std ? "Grupo 1 (10h-15h)" : "Grupo 2 (15h-20h)",
    },
    {
      icon: "🔄",
      label: "Coeficiente de Variação Grupo 1",
      value: `${formatNumber(cvGrupo1, 2)}%`,
    },
    {
      icon: "🔄",
      label: "Coeficiente de Variação Grupo 2",
      value: `${formatNumber(cvGrupo2, 2)}%`,
    },
    {
      icon: "📏",
      label: "Amplitude Grupo 1",
      value: `${formatNumber(grupo1Stats.range, 2)} km`,
    },
    {
      icon: "📏",
      label: "Amplitude Grupo 2",
      value: `${formatNumber(grupo2Stats.range, 2)} km`,
    },
    {
      icon: "↔️",
      label: "Diferença entre Amplitudes",
      value: `${formatNumber(rangeDiff, 2)} km`,
    },
    {
      icon: "📦",
      label: "Amplitude Interquartil Grupo 1",
      value: `${formatNumber(grupo1Stats.iqr, 2)} km`,
    },
    {
      icon: "📦",
      label: "Amplitude Interquartil Grupo 2",
      value: `${formatNumber(grupo2Stats.iqr, 2)} km`,
    },
    {
      icon: "↔️",
      label: "Diferença entre IQRs",
      value: `${formatNumber(iqrDiff, 2)} km`,
    },
    {
      icon: "📈",
      label: "Curtose Grupo 1",
      value: formatNumber(grupo1Stats.kurtosis, 5),
    },
    {
      icon: "📈",
      label: "Curtose Grupo 2",
      value: formatNumber(grupo2Stats.kurtosis, 5),
    },
    {
      icon: "📉",
      label: "Assimetria Grupo 1",
      value: formatNumber(grupo1Stats.skewness, 5),
    },
    {
      icon: "📉",
      label: "Assimetria Grupo 2",
      value: formatNumber(grupo2Stats.skewness, 5),
    },
    {
      icon: "✅",
      label: "Nível de Confiança (95%) Grupo 1",
      value: formatNumber(grupo1Stats.confidenceLevel95, 5),
    },
    {
      icon: "✅",
      label: "Nível de Confiança (95%) Grupo 2",
      value: formatNumber(grupo2Stats.confidenceLevel95, 5),
    },
  ]

  return (
    <Card className="mb-8 border-l-4 border-l-green-800">
      <CardHeader>
        <CardTitle className="text-green-800 text-center">🔍 Análise Comparativa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-l-green-600"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-gray-700">{item.label}:</span>
              </div>
              <span className="text-green-700 font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
