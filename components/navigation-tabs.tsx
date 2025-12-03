"use client"

import { Eye, BarChart3, History, Settings, Play, Square, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavigationTabsProps {
  activeSection: "inspeccion" | "estadisticas" | "historico" | "capture-history" | "usuarios" | "reporteria"
  setActiveSection: (section: "inspeccion" | "estadisticas" | "historico" | "capture-history" | "usuarios" | "reporteria") => void
  isRunning: boolean
  setIsRunning: (value: boolean) => void
  setShowConfig: (value: boolean) => void
}

const tabs = [
  { id: "inspeccion" as const, label: "Inspección en Vivo", icon: Eye },
  { id: "estadisticas" as const, label: "Estadísticas", icon: BarChart3 },
  { id: "historico" as const, label: "Tendencias", icon: BarChart3 },
  { id: "capture-history" as const, label: "Historial de Capturas", icon: History },
  { id: "usuarios" as const, label: "Gestión de Usuarios", icon: Users },
  { id: "reporteria" as const, label: "Reportería", icon: FileText },
]

export function NavigationTabs({
  activeSection,
  setActiveSection,
  isRunning,
  setIsRunning,
  setShowConfig,
}: NavigationTabsProps) {
  return (
    <nav className="h-14 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          size="lg"
          className={cn(
            "px-6 font-semibold shadow-md transition-all",
            isRunning ? "bg-red-500 hover:bg-red-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white",
          )}
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Detener Sistema
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Iniciar Sistema
            </>
          )}
        </Button>

        <Button variant="outline" size="icon" onClick={() => setShowConfig(true)} className="h-10 w-10">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  )
}
