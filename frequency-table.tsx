import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FrequencyData } from "@/app/page"

interface FrequencyTableProps {
  data: number[]
  title: string
  frequencyData: FrequencyData[]
}

export default function FrequencyTable({ data, title, frequencyData }: FrequencyTableProps) {
  const isGroup1 = title.includes("Grupo 1")
  const borderColor = isGroup1 ? "border-t-blue-600" : "border-t-red-600"
  const titleColor = isGroup1 ? "text-blue-800" : "text-red-800"
  const headerColor = isGroup1 ? "bg-blue-700" : "bg-red-700"

  return (
    <Card className={`border-t-4 ${borderColor}`}>
      <CardHeader>
        <CardTitle className={`${titleColor} text-center`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className={`${headerColor} text-white`}>
                <th className="p-3 text-left font-semibold">Classes</th>
                <th className="p-3 text-center font-semibold">Xi</th>
                <th className="p-3 text-center font-semibold">Frequência</th>
                <th className="p-3 text-center font-semibold">Fr (%)</th>
                <th className="p-3 text-center font-semibold">F. Acumulada</th>
                <th className="p-3 text-center font-semibold">Fr (%) Acumulada</th>
              </tr>
            </thead>
            <tbody>
              {frequencyData.map((row, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium">{row.classe}</td>
                  <td className="p-3 text-center">{row.xi.toFixed(2)}</td>
                  <td className="p-3 text-center">{row.frequencia}</td>
                  <td className="p-3 text-center">{row.fr.toFixed(2)}%</td>
                  <td className="p-3 text-center">{row.fAcumulada}</td>
                  <td className="p-3 text-center">{row.frAcumulada.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumo dos dados */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Total de observações:</strong> {data.length} |<strong> Amplitude:</strong>{" "}
            {(Math.max(...data) - Math.min(...data)).toFixed(2)} km
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
