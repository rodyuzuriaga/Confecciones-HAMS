"use client"

import { Gauge, Target, Package, AlertOctagon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricsPanelProps {
  speed: number
  efficiency: number
  totalInspected: number
  totalDefects: number
}

export function MetricsPanel({ speed, efficiency, totalInspected, totalDefects }: MetricsPanelProps) {
  const defectRate = totalInspected > 0 ? ((totalDefects / totalInspected) * 100).toFixed(2) : "0.00"
  const passRate = totalInspected > 0 ? (((totalInspected - totalDefects) / totalInspected) * 100).toFixed(1) : "100.0"

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Speed */}
      <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Gauge className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Velocidad</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-foreground">{speed}</span>
            <span className="text-sm text-muted-foreground">u/h</span>
          </div>
        </div>
      </div>

      {/* Efficiency */}
      <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Eficiencia</p>
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-2xl font-bold font-mono",
                efficiency >= 95 ? "text-emerald-600" : efficiency >= 90 ? "text-amber-600" : "text-red-600",
              )}
            >
              {efficiency.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">%</span>
            <TrendingUp className="w-4 h-4 text-emerald-500 ml-1" />
          </div>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Aprobación</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-emerald-600">{passRate}</span>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* Defect Rate */}
      <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <AlertOctagon className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Tasa Defectos</p>
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-2xl font-bold font-mono",
                Number(defectRate) <= 2
                  ? "text-emerald-600"
                  : Number(defectRate) <= 5
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {defectRate}
            </span>
            <span className="text-sm text-muted-foreground">%</span>
            <TrendingDown className="w-4 h-4 text-emerald-500 ml-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
