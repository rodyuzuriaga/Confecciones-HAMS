"use client"

import { CheckCircle2, AlertTriangle, Target, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

interface StatsSectionProps {
  totalInspected: number
  totalDefects: number
}

const weeklyData = [
  { day: "Lun", inspeccionadas: 245, defectos: 18 },
  { day: "Mar", inspeccionadas: 268, defectos: 22 },
  { day: "Mié", inspeccionadas: 252, defectos: 15 },
  { day: "Jue", inspeccionadas: 271, defectos: 19 },
  { day: "Vie", inspeccionadas: 289, defectos: 21 },
  { day: "Sáb", inspeccionadas: 198, defectos: 12 },
]

const defectDistribution = [
  { name: "Costuras", value: 35, color: "#dc2626" },
  { name: "Manchas", value: 25, color: "#f97316" },
  { name: "Botones", value: 20, color: "#2563eb" },
  { name: "Otros", value: 20, color: "#7c3aed" },
]

const hourlyData = [
  { hora: "06:00", tasa: 1.8 },
  { hora: "08:00", tasa: 2.1 },
  { hora: "10:00", tasa: 1.5 },
  { hora: "12:00", tasa: 2.8 },
  { hora: "14:00", tasa: 2.0 },
  { hora: "16:00", tasa: 1.6 },
  { hora: "18:00", tasa: 1.9 },
  { hora: "20:00", tasa: 2.2 },
]

const productionLines = [
  { name: "Línea A", efficiency: 96.5, status: "excellent" },
  { name: "Línea B", efficiency: 94.2, status: "good" },
  { name: "Línea C", efficiency: 91.8, status: "warning" },
  { name: "Línea D", efficiency: 95.1, status: "good" },
]

export function StatsSection({ totalInspected, totalDefects }: StatsSectionProps) {
  const efficiency = totalInspected > 0 ? ((totalInspected - totalDefects) / totalInspected) * 100 : 100
  const rejectRate = totalInspected > 0 ? (totalDefects / totalInspected) * 100 : 0

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Total Inspeccionadas</span>
            </div>
            <p className="text-3xl font-bold text-foreground font-mono">{totalInspected.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">+12% vs ayer</span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Defectos Detectados</span>
            </div>
            <p className="text-3xl font-bold text-red-600 font-mono">{totalDefects}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">-5% vs ayer</span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Eficiencia Global</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600 font-mono">{efficiency.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-2">Objetivo: 95%</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Tasa de Rechazo</span>
            </div>
            <p className="text-3xl font-bold text-amber-600 font-mono">{rejectRate.toFixed(2)}%</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">Mejora</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Production Chart */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Producción Semanal</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Bar dataKey="inspeccionadas" fill="#2563eb" radius={[4, 4, 0, 0]} name="Inspeccionadas" />
                <Bar dataKey="defectos" fill="#dc2626" radius={[4, 4, 0, 0]} name="Defectos" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Defect Distribution */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Distribución de Defectos</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={defectDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {defectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {defectDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold font-mono">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hourly Defect Rate */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Tasa de Defectos por Hora</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hora" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Area
                  type="monotone"
                  dataKey="tasa"
                  stroke="#0891b2"
                  fill="#0891b2"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Production Lines Status */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Estado de Líneas de Producción</h3>
            <div className="space-y-4">
              {productionLines.map((line) => (
                <div key={line.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{line.name}</span>
                    <Badge
                      className={`text-xs ${line.status === "excellent"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                          : line.status === "good"
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : "bg-amber-100 text-amber-700 border-amber-300"
                        }`}
                    >
                      {line.efficiency}%
                    </Badge>
                  </div>
                  <Progress value={line.efficiency} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
