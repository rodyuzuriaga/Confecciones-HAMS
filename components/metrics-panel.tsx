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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Speed */}
      <div className="bg-card rounded-lg border border-border p-3 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
          <Gauge className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Velocidad</p>
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold font-mono text-foreground">{speed}</span>
            <span className="text-[10px] text-muted-foreground">u/h</span>
          </div>
        </div>
      </div>

      {/* Efficiency */}
      <div className="bg-card rounded-lg border border-border p-3 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-md">
          <Target className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Eficiencia</p>
          <div className="flex items-baseline gap-0.5">
            <span
              className={cn(
                "text-lg font-bold font-mono",
                efficiency >= 95 ? "text-emerald-600" : efficiency >= 90 ? "text-amber-600" : "text-red-600",
              )}
            >
              {efficiency.toFixed(1)}
            </span>
            <span className="text-[10px] text-muted-foreground">%</span>
            <TrendingUp className="w-3 h-3 text-emerald-500 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="bg-card rounded-lg border border-border p-3 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md">
          <Package className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Aprobación</p>
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold font-mono text-emerald-600">{passRate}</span>
            <span className="text-[10px] text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* Defect Rate */}
      <div className="bg-card rounded-lg border border-border p-3 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0 shadow-md">
          <AlertOctagon className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Tasa Defectos</p>
          <div className="flex items-baseline gap-0.5">
            <span
              className={cn(
                "text-lg font-bold font-mono",
                Number(defectRate) <= 2
                  ? "text-emerald-600"
                  : Number(defectRate) <= 5
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {defectRate}
            </span>
            <span className="text-[10px] text-muted-foreground">%</span>
            <TrendingDown className="w-3 h-3 text-emerald-500 ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
