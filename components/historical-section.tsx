"use client"

import { TrendingUp, Award, Calendar, Package, Clock, Zap, Medal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Area,
  Cell,
} from "recharts"

const monthlyTrends = [
  { mes: "Jun", prendas: 5200, defectos: 156, oee: 92.1 },
  { mes: "Jul", prendas: 5800, defectos: 145, oee: 93.5 },
  { mes: "Ago", prendas: 6100, defectos: 138, oee: 94.2 },
  { mes: "Sep", prendas: 6450, defectos: 129, oee: 95.0 },
  { mes: "Oct", prendas: 6800, defectos: 122, oee: 95.8 },
  { mes: "Nov", prendas: 7350, defectos: 110, oee: 96.7 },
]

const shiftAnalysis = [
  { turno: "Turno 1 (06:00-14:00)", efficiency: 96.7, defects: 38, color: "#2563eb" },
  { turno: "Turno 2 (14:00-22:00)", efficiency: 95.9, defects: 45, color: "#7c3aed" },
  { turno: "Turno 3 (22:00-06:00)", efficiency: 94.1, defects: 52, color: "#f97316" },
]

const heatmapData = [
  { dia: "Lun", h08: 2, h10: 1, h12: 3, h14: 2, h16: 1, h18: 2 },
  { dia: "Mar", h08: 1, h10: 2, h12: 4, h14: 3, h16: 2, h18: 1 },
  { dia: "Mié", h08: 2, h10: 1, h12: 2, h14: 2, h16: 1, h18: 2 },
  { dia: "Jue", h08: 1, h10: 3, h12: 5, h14: 2, h16: 2, h18: 1 },
  { dia: "Vie", h08: 2, h10: 2, h12: 3, h14: 4, h16: 1, h18: 2 },
  { dia: "Sáb", h08: 1, h10: 1, h12: 2, h14: 1, h16: 1, h18: 1 },
]

const rootCauses = [
  { causa: "Tensión de hilo", count: 145, color: "#dc2626" },
  { causa: "Velocidad excesiva", count: 98, color: "#f97316" },
  { causa: "Fatiga operador", count: 67, color: "#2563eb" },
  { causa: "Material defectuoso", count: 54, color: "#7c3aed" },
  { causa: "Otros", count: 48, color: "#64748b" },
]

const operatorRanking = [
  { name: "María García", efficiency: 98.2, defects: 8, speed: 105 },
  { name: "Carlos López", efficiency: 97.5, defects: 12, speed: 102 },
  { name: "Ana Martínez", efficiency: 96.8, defects: 15, speed: 98 },
  { name: "José Rodríguez", efficiency: 95.4, defects: 18, speed: 95 },
  { name: "Laura Sánchez", efficiency: 94.9, defects: 21, speed: 92 },
]

const getHeatmapColor = (value: number) => {
  if (value <= 2) return "bg-emerald-200"
  if (value <= 4) return "bg-amber-200"
  return "bg-red-300"
}

export function HistoricalSection() {
  const totalPrendas = monthlyTrends.reduce((acc, curr) => acc + curr.prendas, 0)

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Crecimiento</span>
            </div>
            <p className="text-3xl font-bold text-violet-600 font-mono">+29.5%</p>
            <p className="text-xs text-muted-foreground mt-2">en 6 meses</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">OEE Promedio</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600 font-mono">95.8%</p>
            <p className="text-xs text-muted-foreground mt-2">+3.5% mejora</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Mejor Mes</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 font-mono">Nov</p>
            <p className="text-xs text-muted-foreground mt-2">96.7% eficiencia</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Total Prendas</span>
            </div>
            <p className="text-3xl font-bold text-amber-600 font-mono">{(totalPrendas / 1000).toFixed(1)}K</p>
            <p className="text-xs text-muted-foreground mt-2">en 6 meses</p>
          </div>
        </div>

        {/* Monthly Trends Chart - Full Width */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4">Tendencias Mensuales (Últimos 6 Meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} domain={[90, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="prendas"
                fill="#2563eb"
                fillOpacity={0.15}
                stroke="#2563eb"
                strokeWidth={2}
                name="Prendas"
              />
              <Bar yAxisId="left" dataKey="defectos" fill="#dc2626" radius={[4, 4, 0, 0]} name="Defectos" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="oee"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ fill: "#7c3aed", r: 4 }}
                name="OEE %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shift Analysis */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Análisis por Turno</h3>
            <div className="space-y-4">
              {shiftAnalysis.map((shift) => (
                <div key={shift.turno} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{shift.turno}</span>
                    <Badge
                      style={{
                        backgroundColor: `${shift.color}15`,
                        color: shift.color,
                        borderColor: `${shift.color}40`,
                      }}
                      className="border font-mono"
                    >
                      {shift.efficiency}%
                    </Badge>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${shift.efficiency}%`, backgroundColor: shift.color }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{shift.defects} defectos registrados</p>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Mapa de Calor - Defectos por Hora</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1.5 text-xs text-muted-foreground text-center mb-2">
                <div></div>
                <div>08h</div>
                <div>10h</div>
                <div>12h</div>
                <div>14h</div>
                <div>16h</div>
                <div>18h</div>
              </div>
              {heatmapData.map((row) => (
                <div key={row.dia} className="grid grid-cols-7 gap-1.5">
                  <div className="text-xs text-muted-foreground flex items-center font-medium">{row.dia}</div>
                  {[row.h08, row.h10, row.h12, row.h14, row.h16, row.h18].map((val, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded-md ${getHeatmapColor(val)} flex items-center justify-center text-xs font-bold text-slate-700`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-emerald-200" />
                <span className="text-muted-foreground">Bajo (0-2)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-amber-200" />
                <span className="text-muted-foreground">Medio (3-4)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-red-300" />
                <span className="text-muted-foreground">Alto (5+)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Root Causes - Pareto */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Análisis de Causas Raíz (Pareto)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={rootCauses} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="causa" type="category" stroke="#64748b" fontSize={11} width={110} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Cantidad">
                  {rootCauses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Operator Ranking */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Ranking de Operadores (Top 5)</h3>
            <div className="space-y-3">
              {operatorRanking.map((op, idx) => (
                <div
                  key={op.name}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-slate-200">
                    {idx === 0 ? (
                      <Medal className="w-4 h-4 text-yellow-500" />
                    ) : idx === 1 ? (
                      <Medal className="w-4 h-4 text-slate-400" />
                    ) : idx === 2 ? (
                      <Medal className="w-4 h-4 text-amber-600" />
                    ) : (
                      <span className="text-sm font-bold text-slate-400">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{op.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {op.defects} defectos | {op.speed}% velocidad
                    </p>
                  </div>
                  <Badge
                    className={`text-xs font-mono ${
                      op.efficiency >= 97
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : op.efficiency >= 95
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-amber-100 text-amber-700 border-amber-300"
                    }`}
                  >
                    {op.efficiency}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">Mejora Continua</span>
            </div>
            <p className="text-sm text-emerald-700/80">
              La eficiencia ha mejorado un 3.5% en los últimos 6 meses gracias a la automatización del control de
              calidad.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold text-amber-700">Punto Crítico</span>
            </div>
            <p className="text-sm text-amber-700/80">
              El turno 3 (nocturno) presenta la menor eficiencia. Se recomienda revisar la rotación del personal.
            </p>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-violet-600" />
              <span className="text-sm font-bold text-violet-700">Oportunidad</span>
            </div>
            <p className="text-sm text-violet-700/80">
              El 35% de defectos son por tensión de hilo. Mantenimiento preventivo reduciría mermas significativamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
