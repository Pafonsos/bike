import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Statistics } from "@/app/page"

interface StatisticsCardProps {
  title: string
  stats: Statistics
  isGroup1?: boolean
}

function formatNumber(num: number | number[] | null, precision = 2): string {
  if (num === null) return "N/A"
  if (Array.isArray(num)) return num.map((n) => n.toFixed(precision)).join(", ")
  return typeof num === "number" ? num.toFixed(precision) : String(num)
}

export default function StatisticsCard({ title, stats, isGroup1 = true }: StatisticsCardProps) {
  const borderColor = isGroup1 ? "border-t-blue-600" : "border-t-red-600"
  const titleColor = isGroup1 ? "text-blue-800" : "text-red-800"
  const valueColor = isGroup1 ? "text-blue-700" : "text-red-700"

  const statItems = [
    { label: "Média", value: stats.mean, precision: 5 },
    { label: "Erro padrão", value: stats.errorStd, precision: 9 },
    { label: "Mediana", value: stats.median, precision: 2 },
    { label: "Moda", value: stats.mode, precision: 2 },
    { label: "Desvio Padrão", value: stats.std, precision: 9 },
    { label: "Variância da amostra", value: stats.variance, precision: 9 },
    { label: "Curtose", value: stats.kurtosis, precision: 9 },
    { label: "Assimetria", value: stats.skewness, precision: 9 },
    { label: "Intervalo", value: stats.range, precision: 2 },
    { label: "Mínimo", value: stats.min, precision: 2 },
    { label: "Máximo", value: stats.max, precision: 2 },
    { label: "Soma", value: stats.sum, precision: 2 },
    { label: "Contagem", value: stats.count, precision: 0 },
    { label: "Nível de confiança (95,0%)", value: stats.confidenceLevel95, precision: 9 },
    { label: "Q1", value: stats.q1, precision: 2 },
    { label: "Q3", value: stats.q3, precision: 2 },
    { label: "IQR", value: stats.iqr, precision: 2 },
  ]

  return (
    <Card className={`border-t-4 ${borderColor} hover:shadow-lg transition-shadow`}>
      <CardHeader>
        <CardTitle className={`${titleColor} text-center border-b pb-2`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <span className="font-semibold text-gray-700">{item.label}:</span>
              <span className={`${valueColor} font-bold text-lg`}>{formatNumber(item.value, item.precision)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
