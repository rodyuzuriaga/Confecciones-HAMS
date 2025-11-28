"use client"

import { useState, useEffect } from "react"
import { Activity, Cpu, HardDrive, Clock, Shield, Wifi, CheckCircle2, AlertTriangle, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TopBarProps {
  totalInspected: number
  totalDefects: number
  currentTime: Date
  isRunning: boolean
  efficiency: number
  cpuUsage: number
  memoryUsage: number
}

export function TopBar({
  totalInspected,
  totalDefects,
  currentTime,
  isRunning,
  efficiency,
  cpuUsage,
  memoryUsage,
}: TopBarProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <header className="h-16 bg-[#1e293b] text-white border-b border-slate-700 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left - Logo & System Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide">HAM'S VISION AI</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Sistema de Control de Calidad</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${isRunning ? "bg-emerald-500/20 border border-emerald-500/40" : "bg-slate-600/50 border border-slate-500/40"}`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
          <span className="text-xs font-semibold">{isRunning ? "OPERANDO" : "DETENIDO"}</span>
        </div>
      </div>

      {/* Center - Key Metrics */}
      <div className="hidden lg:flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase">Inspeccionadas</p>
            <p className="text-lg font-bold font-mono">{mounted ? totalInspected.toLocaleString() : totalInspected}</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-600" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase">Defectos</p>
            <p className="text-lg font-bold font-mono text-red-400">{totalDefects}</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-600" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase">Eficiencia</p>
            <p className="text-lg font-bold font-mono text-blue-400">{efficiency.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Right - System Resources & Time */}
      <div className="flex items-center gap-6">
        {/* System Resources */}
        <div className="hidden xl:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-400" />
            <div className="w-20">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>CPU</span>
                <span>{cpuUsage}%</span>
              </div>
              <Progress value={cpuUsage} className="h-1.5 bg-slate-700" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-400" />
            <div className="w-20">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>MEM</span>
                <span>{memoryUsage}%</span>
              </div>
              <Progress value={memoryUsage} className="h-1.5 bg-slate-700" />
            </div>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-600 hidden xl:block" />

        {/* Connection Status */}
        <div className="hidden sm:flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <Shield className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Time */}
        <div className="text-right">
          <p className="text-[10px] text-slate-400">{mounted ? formatDate(currentTime) : "---"}</p>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <p className="text-sm font-mono font-bold text-cyan-400">{mounted ? formatTime(currentTime) : "--:--:--"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
