"use client"

import { useState, useEffect, useCallback } from "react"
import { TopBar } from "@/components/top-bar"
import { NavigationTabs } from "@/components/navigation-tabs"
import { InspectionSection } from "@/components/inspection-section"
import { StatsSection } from "@/components/stats-section"
import { HistoricalSection } from "@/components/historical-section"
import { ConfigDialog } from "@/components/config-dialog"
import { LoginForm } from "@/components/login-form"
import { UserManagement } from "@/components/user-management"
import { ReportSection } from "@/components/report-section"
import { Toaster, toast } from "sonner"
import type { AnalysisResult } from "@/components/inspection-view"

export interface Defect {
  id: string
  type: string
  severity: "critical" | "major" | "minor"
  timestamp: Date
  camera: string
  position: { x: number; y: number }
  confidence: number
}

export interface SystemConfig {
  confidenceThreshold: number
  aiModel: string
  sensitivity: string
  autoReject: boolean
  emailAlerts: boolean
  soundAlerts: boolean
  resolution: string
  fps: string
}

const DEFECT_TYPES = ["Costura irregular", "Mancha", "Botón defectuoso", "Decoloración", "Medidas incorrectas"]

import { CaptureHistory } from "@/components/capture-history"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"inspeccion" | "estadisticas" | "historico" | "capture-history" | "usuarios" | "reporteria">("inspeccion")
  const [isRunning, setIsRunning] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [totalInspected, setTotalInspected] = useState(1247)
  const [defects, setDefects] = useState<Defect[]>([])
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentConfidence, setCurrentConfidence] = useState(94)
  const [activeDefect, setActiveDefect] = useState<Defect | null>(null)
  const [speed, setSpeed] = useState(87)
  const [efficiency, setEfficiency] = useState(94.2)
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [activeCamera, setActiveCamera] = useState("CAM-01")
  const [config, setConfig] = useState<SystemConfig>({
    confidenceThreshold: 85,
    aiModel: "v2.0",
    sensitivity: "medium",
    autoReject: true,
    emailAlerts: true,
    soundAlerts: false,
    resolution: "1080p",
    fps: "60",
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const runSimulation = useCallback(() => {
    if (!isRunning) return

    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 800)

    setSpeed(80 + Math.floor(Math.random() * 20))
    setEfficiency(92 + Math.random() * 6)
    setCpuUsage(35 + Math.floor(Math.random() * 25))
    setMemoryUsage(60 + Math.floor(Math.random() * 20))
    setCurrentConfidence(85 + Math.floor(Math.random() * 15))

    setTotalInspected((prev) => prev + 1)

    if (Math.random() < 0.08) {
      const severities: ("critical" | "major" | "minor")[] = ["critical", "major", "minor"]
      const newDefect: Defect = {
        id: Date.now().toString(),
        type: DEFECT_TYPES[Math.floor(Math.random() * DEFECT_TYPES.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        timestamp: new Date(),
        camera: `CAM-0${Math.floor(Math.random() * 4) + 1}`,
        position: {
          x: 20 + Math.floor(Math.random() * 60),
          y: 20 + Math.floor(Math.random() * 60),
        },
        confidence: 85 + Math.floor(Math.random() * 15),
      }
      setDefects((prev) => [newDefect, ...prev].slice(0, 50))
      setActiveDefect(newDefect)
      setTimeout(() => setActiveDefect(null), 4000)
    }
  }, [isRunning])

  useEffect(() => {
    const interval = setInterval(runSimulation, 3000)
    return () => clearInterval(interval)
  }, [runSimulation])

  const clearDefects = () => setDefects([])

  const handleAIAnalysis = useCallback((result: AnalysisResult) => {
    // Save to history
    setHistory(prev => [result, ...prev])

    if (result.status === "defects_found" && result.defects) {
      // Convertir defectos del análisis IA al formato del sistema
      const newDefects: Defect[] = result.defects.map((d, index) => ({
        id: `ai-${Date.now()}-${index}`,
        type: d.type,
        severity: d.severity,
        timestamp: new Date(),
        camera: "IA-UPLOAD",
        position: { x: 50, y: 50 },
        confidence: d.confidence,
      }))

      setDefects((prev) => [...newDefects, ...prev].slice(0, 50))
      setTotalInspected((prev) => prev + 1)

      toast.error(`Se detectaron ${result.total_defects} defectos`, {
        description: result.summary,
      })
    } else if (result.status === "approved") {
      setTotalInspected((prev) => prev + 1)
      toast.success("Prenda aprobada", {
        description: "No se detectaron defectos significativos",
      })
    }
  }, [])

  const handleLogin = useCallback((username: string) => {
    setIsAuthenticated(true)
    setCurrentUser(username)
    toast.success("Bienvenido", {
      description: `Has iniciado sesión como ${username}`,
    })
  }, [])

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setActiveSection("inspeccion")
    toast.info("Sesión cerrada", {
      description: "Has cerrado sesión correctamente",
    })
  }, [])

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Toaster position="top-right" theme="system" />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Toaster position="top-right" theme="system" />

      {/* Top Bar con información del sistema */}
      <TopBar
        totalInspected={totalInspected}
        totalDefects={defects.length}
        currentTime={currentTime}
        isRunning={isRunning}
        efficiency={efficiency}
        cpuUsage={cpuUsage}
        memoryUsage={memoryUsage}
      />

      {/* Navegación por pestañas */}
      <NavigationTabs
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        setShowConfig={setShowConfig}
      />

      {/* Contenido principal basado en sección activa */}
      <main className="flex-1 overflow-hidden relative">
        {activeSection === "inspeccion" && (
          <InspectionSection
            isRunning={isRunning}
            isAnalyzing={isAnalyzing}
            currentConfidence={currentConfidence}
            activeDefect={activeDefect}
            currentTime={currentTime}
            activeCamera={activeCamera}
            setActiveCamera={setActiveCamera}
            speed={speed}
            efficiency={efficiency}
            totalInspected={totalInspected}
            defects={defects}
            clearDefects={clearDefects}
            onAIAnalysis={handleAIAnalysis}
          />
        )}

        {activeSection === "estadisticas" && (
          <StatsSection totalInspected={totalInspected} totalDefects={defects.length} />
        )}

        {activeSection === "historico" && <HistoricalSection />}

        {activeSection === "capture-history" && <CaptureHistory history={history} />}

        {activeSection === "usuarios" && <UserManagement />}

        {activeSection === "reporteria" && <ReportSection />}
      </main>

      <ConfigDialog open={showConfig} onOpenChange={setShowConfig} config={config} setConfig={setConfig} />
    </div>
  )
}
