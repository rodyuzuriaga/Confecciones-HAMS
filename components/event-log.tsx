"use client"

import { useState, useEffect } from "react"
import { FileText, CheckCircle2, Trash2, Download, Circle, Cpu, RefreshCw, ClipboardList, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Defect } from "@/app/page"
import type { AnalysisResult } from "@/components/inspection-view"
import { cn } from "@/lib/utils"

interface EventLogProps {
  defects: Defect[]
  clearDefects: () => void
  analysisResult?: AnalysisResult | null
  onNewInspection?: () => void
  onReAnalyze?: () => void
}

export function EventLog({ defects, clearDefects, analysisResult, onNewInspection, onReAnalyze }: EventLogProps) {
  const [activeTab, setActiveTab] = useState<"defects" | "analysis">("defects")
  
  // Cambiar automáticamente a la pestaña de análisis cuando hay un nuevo resultado
  useEffect(() => {
    if (analysisResult) {
      setActiveTab("analysis")
    }
  }, [analysisResult])
  
  const critical = defects.filter((d) => d.severity === "critical").length
  const major = defects.filter((d) => d.severity === "major").length
  const minor = defects.filter((d) => d.severity === "minor").length

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "APROBAR":
        return "bg-emerald-500 text-white"
      case "RECHAZAR":
        return "bg-red-500 text-white"
      case "REPARAR":
        return "bg-amber-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 90) return "text-emerald-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="h-full bg-card rounded-xl border border-border flex flex-col shadow-sm overflow-hidden">
      {/* Header con Tabs */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-foreground">Registro de Defectos</h2>
          </div>
          <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-700 border-slate-300">
            {defects.length} eventos
          </Badge>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
          <Button
            variant={activeTab === "defects" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs flex-1"
            onClick={() => setActiveTab("defects")}
          >
            <ClipboardList className="w-3 h-3 mr-1.5" />
            Registros
          </Button>
          <Button
            variant={activeTab === "analysis" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs flex-1"
            onClick={() => setActiveTab("analysis")}
          >
            <BarChart3 className="w-3 h-3 mr-1.5" />
            Análisis IA
          </Button>
        </div>
      </div>

      {/* Contenido según Tab activo */}
      {activeTab === "defects" ? (
        <>
          {/* Severity Summary */}
          <div className="p-4 border-b border-border">
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
                      "p-3 rounded-lg border-l-4 bg-white dark:bg-slate-800 shadow-sm",
                      defect.severity === "critical"
                        ? "border-l-red-500 bg-red-50/50 dark:bg-red-950/50"
                        : defect.severity === "major"
                          ? "border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/50"
                          : "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/50",
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
                      <Badge variant="outline" className="text-[10px] font-mono h-5 bg-white dark:bg-slate-700">
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
                            ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
                            : defect.severity === "major"
                              ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700"
                              : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
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
        </>
      ) : (
        <>
          {/* Analysis Result View */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-4">
              {analysisResult ? (
                <>
                  {/* Resultado y Recomendación */}
                  <div className="text-center space-y-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Resultado del Análisis</p>
                    <Badge className={cn("text-lg px-4 py-1.5 font-bold", getRecommendationColor(analysisResult.overall_recommendation))}>
                      {analysisResult.overall_recommendation}
                    </Badge>
                  </div>

                  {/* Puntuación de Calidad con barra de progreso */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Puntuación de Calidad</span>
                      <span className={cn("font-bold font-mono", getQualityColor(analysisResult.quality_score))}>
                        {analysisResult.quality_score}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          analysisResult.quality_score >= 80
                            ? "bg-emerald-500"
                            : analysisResult.quality_score >= 50
                              ? "bg-amber-500"
                              : "bg-red-500",
                        )}
                        style={{ width: `${analysisResult.quality_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Resumen */}
                  <div className="bg-muted/20 rounded-lg p-3 border border-border">
                    <p className="text-sm text-foreground">{analysisResult.summary}</p>
                  </div>

                  {/* Estado */}
                  {analysisResult.status === "approved" && (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Prenda Aprobada</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">No se detectaron defectos significativos</p>
                      </div>
                    </div>
                  )}

                  {analysisResult.status === "defects_found" && analysisResult.defects.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Defectos Detectados ({analysisResult.total_defects})
                      </p>
                      {analysisResult.defects.map((defect) => (
                        <div
                          key={defect.id}
                          className={cn(
                            "p-3 rounded-lg border-l-4",
                            defect.severity === "critical"
                              ? "border-l-red-500 bg-red-50 dark:bg-red-950"
                              : defect.severity === "major"
                                ? "border-l-orange-500 bg-orange-50 dark:bg-orange-950"
                                : "border-l-amber-500 bg-amber-50 dark:bg-amber-950"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-foreground">{defect.type}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                defect.severity === "critical"
                                  ? "border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                                  : defect.severity === "major"
                                    ? "border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                                    : "border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                              )}
                            >
                              {defect.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{defect.description}</p>
                          <p className="text-xs text-foreground">
                            <span className="font-medium">Recomendación:</span> {defect.recommendation}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-muted-foreground">{defect.location}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{defect.confidence}% confianza</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notas del Inspector IA */}
                  {analysisResult.notes && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-3 h-3" />
                        Notas del Inspector IA
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-700 dark:text-slate-300">{analysisResult.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  {analysisResult.timestamp && (
                    <p className="text-[10px] text-muted-foreground text-center">
                      Análisis realizado: {analysisResult.timestamp.toLocaleString("es-ES")}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Cpu className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Sin análisis reciente</p>
                  <p className="text-xs text-muted-foreground mt-1">Sube una imagen para analizarla con IA</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer Actions para Análisis */}
          {analysisResult && (
            <div className="p-3 border-t border-border flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onNewInspection}
                className="flex-1 text-xs bg-transparent"
              >
                Nueva Inspección
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onReAnalyze}
                className="flex-1 text-xs bg-transparent"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Re-analizar
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
