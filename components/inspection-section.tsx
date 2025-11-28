"use client"

import { InspectionView, type AnalysisResult } from "@/components/inspection-view"
import { CameraSelector } from "@/components/camera-selector"
import { MetricsPanel } from "@/components/metrics-panel"
import { EventLog } from "@/components/event-log"
import type { Defect } from "@/app/page"

interface InspectionSectionProps {
  isRunning: boolean
  isAnalyzing: boolean
  currentConfidence: number
  activeDefect: Defect | null
  currentTime: Date
  activeCamera: string
  setActiveCamera: (camera: string) => void
  speed: number
  efficiency: number
  totalInspected: number
  defects: Defect[]
  clearDefects: () => void
  onAIAnalysis?: (result: AnalysisResult) => void
}

export function InspectionSection({
  isRunning,
  isAnalyzing,
  currentConfidence,
  activeDefect,
  currentTime,
  activeCamera,
  setActiveCamera,
  speed,
  efficiency,
  totalInspected,
  defects,
  clearDefects,
  onAIAnalysis,
}: InspectionSectionProps) {
  return (
    <div className="h-full flex p-4 gap-4">
      {/* Left Panel - Camera Selector & AI Info */}
      <aside className="w-64 flex flex-col gap-4 flex-shrink-0">
        <CameraSelector activeCamera={activeCamera} setActiveCamera={setActiveCamera} />

        {/* AI Model Info */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Motor de IA</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Google Gemini</span>
              <span className="text-xs text-emerald-600 font-medium">Conectado</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Modelo de visión multimodal con capacidad de análisis textil avanzado
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Modelo</span>
                <span className="font-mono font-bold text-primary">gemini-1.5-flash</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Capacidades</span>
                <span className="font-mono font-bold text-cyan-600">Visión + Texto</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Tipos de Defectos</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-foreground">Costuras irregulares</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-foreground">Manchas y decoloración</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-foreground">Accesorios defectuosos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-foreground">Medidas incorrectas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-foreground">Daños en tela</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Center - Main View */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <InspectionView
          isRunning={isRunning}
          isAnalyzing={isAnalyzing}
          currentConfidence={currentConfidence}
          currentTime={currentTime}
          activeCamera={activeCamera}
          onAnalysisComplete={onAIAnalysis}
        />
        <MetricsPanel
          speed={speed}
          efficiency={efficiency}
          totalInspected={totalInspected}
          totalDefects={defects.length}
        />
      </div>

      {/* Right Panel - Event Log */}
      <aside className="w-80 flex-shrink-0">
        <EventLog defects={defects} clearDefects={clearDefects} />
      </aside>
    </div>
  )
}
