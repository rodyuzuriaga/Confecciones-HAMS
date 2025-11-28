"use client"

import { FileText, CheckCircle2, Trash2, Download, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Defect } from "@/app/page"
import { cn } from "@/lib/utils"

interface EventLogProps {
  defects: Defect[]
  clearDefects: () => void
}

export function EventLog({ defects, clearDefects }: EventLogProps) {
  const critical = defects.filter((d) => d.severity === "critical").length
  const major = defects.filter((d) => d.severity === "major").length
  const minor = defects.filter((d) => d.severity === "minor").length

  return (
    <div className="h-full bg-card rounded-xl border border-border flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-foreground">Registro de Defectos</h2>
          </div>
          <Badge variant="outline" className="font-mono text-xs bg-slate-100">
            {defects.length} eventos
          </Badge>
        </div>

        {/* Severity Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-center">
            <p className="text-xl font-bold text-red-600 font-mono">{critical}</p>
            <p className="text-[10px] text-red-600/70 uppercase font-medium">Crítico</p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-center">
            <p className="text-xl font-bold text-orange-600 font-mono">{major}</p>
            <p className="text-[10px] text-orange-600/70 uppercase font-medium">Mayor</p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <p className="text-xl font-bold text-amber-600 font-mono">{minor}</p>
            <p className="text-[10px] text-amber-600/70 uppercase font-medium">Menor</p>
          </div>
        </div>
      </div>

      {/* Defect List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {defects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-foreground">Sin defectos detectados</p>
              <p className="text-xs text-muted-foreground mt-1">El sistema está monitoreando activamente</p>
            </div>
          ) : (
            defects.map((defect, index) => (
              <div
                key={defect.id}
                className={cn(
                  "p-3 rounded-lg border-l-4 bg-white shadow-sm",
                  defect.severity === "critical"
                    ? "border-l-red-500 bg-red-50/50"
                    : defect.severity === "major"
                      ? "border-l-orange-500 bg-orange-50/50"
                      : "border-l-amber-500 bg-amber-50/50",
                  index === 0 && "animate-slide-in",
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Circle
                      className={cn(
                        "w-2.5 h-2.5",
                        defect.severity === "critical"
                          ? "text-red-500 fill-red-500"
                          : defect.severity === "major"
                            ? "text-orange-500 fill-orange-500"
                            : "text-amber-500 fill-amber-500",
                      )}
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {defect.timestamp.toLocaleTimeString("es-ES")}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono h-5 bg-white">
                    {defect.camera}
                  </Badge>
                </div>

                <p className="text-sm font-medium text-foreground mb-2">{defect.type}</p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Pos: ({defect.position.x}, {defect.position.y})
                  </span>
                  <Badge
                    className={cn(
                      "text-[10px] h-5",
                      defect.severity === "critical"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : defect.severity === "major"
                          ? "bg-orange-100 text-orange-700 border-orange-300"
                          : "bg-amber-100 text-amber-700 border-amber-300",
                    )}
                  >
                    {defect.confidence}% confianza
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearDefects}
          disabled={defects.length === 0}
          className="flex-1 text-xs bg-transparent"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Limpiar
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Exportar
        </Button>
      </div>
    </div>
  )
}
