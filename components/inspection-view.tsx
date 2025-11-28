"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Crosshair,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  ZoomIn,
  Grid3X3,
  Upload,
  Camera,
  Loader2,
  X,
  FileImage,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AnalysisDefect {
  id: string
  type: string
  severity: "critical" | "major" | "minor"
  location: string
  confidence: number
  description: string
  recommendation: string
}

export interface AnalysisResult {
  status: "defects_found" | "approved" | "error"
  summary: string
  total_defects: number
  quality_score: number
  defects: AnalysisDefect[]
  overall_recommendation: "APROBAR" | "RECHAZAR" | "REPARAR"
  notes: string
  imageUrl?: string
  timestamp?: Date
}

interface InspectionViewProps {
  isRunning: boolean
  isAnalyzing: boolean
  currentConfidence: number
  currentTime: Date
  activeCamera: string
  onAnalysisComplete?: (result: AnalysisResult) => void
}

export function InspectionView({
  isRunning,
  isAnalyzing: externalAnalyzing,
  currentConfidence,
  currentTime,
  activeCamera,
  onAnalysisComplete,
}: InspectionViewProps) {
  const [mode, setMode] = useState<"camera" | "upload">("camera")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      handleFileSelect(file)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const analyzeImage = async () => {
    if (!uploadedImage) return

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedImage }),
      })

      const result = await response.json()
      const resultWithImage = { ...result, imageUrl: uploadedImage, timestamp: new Date() }
      setAnalysisResult(resultWithImage)
      onAnalysisComplete?.(resultWithImage)
    } catch (error) {
      console.error("Error:", error)
      setAnalysisResult({
        status: "error",
        summary: "Error al conectar con el servicio de análisis",
        total_defects: 0,
        quality_score: 0,
        defects: [],
        overall_recommendation: "RECHAZAR",
        notes: "Por favor, intente nuevamente",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setAnalysisResult(null)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "major":
        return "bg-orange-500 text-white"
      case "minor":
        return "bg-yellow-500 text-black"
      default:
        return "bg-gray-500 text-white"
    }
  }

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

  return (
    <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden flex flex-col shadow-sm">
      {/* Header */}
      <div className="h-14 px-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Vista de Inspección</h2>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={mode === "upload" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setMode("upload")}
            >
              <Upload className="w-3 h-3 mr-1.5" />
              Subir Imagen
            </Button>
            <Button
              variant={mode === "camera" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setMode("camera")}
            >
              <Camera className="w-3 h-3 mr-1.5" />
              Cámara
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAnalyzing && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 animate-pulse">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Analizando con IA
            </Badge>
          )}

          {analysisResult && (
            <Badge className={getRecommendationColor(analysisResult.overall_recommendation)}>
              {analysisResult.overall_recommendation}
            </Badge>
          )}

          {analysisResult?.quality_score !== undefined && (
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-xs",
                analysisResult.quality_score >= 80
                  ? "border-emerald-400 text-emerald-600 bg-emerald-50"
                  : analysisResult.quality_score >= 50
                    ? "border-amber-400 text-amber-600 bg-amber-50"
                    : "border-red-400 text-red-600 bg-red-50",
              )}
            >
              Calidad: {analysisResult.quality_score}%
            </Badge>
          )}

          <div className="hidden md:flex items-center gap-1 ml-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex">
        {/* Main View */}
        <div className="flex-1 relative bg-slate-100 overflow-hidden">
          {mode === "upload" ? (
            <>
              {!uploadedImage ? (
                // Upload Zone
                <div
                  className={cn(
                    "absolute inset-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer",
                    dragOver
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-slate-300 hover:border-primary/50 hover:bg-slate-50",
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />

                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FileImage className="w-10 h-10 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">Arrastra una imagen de pantalón aquí</h3>
                  <p className="text-sm text-muted-foreground mb-4">o haz clic para seleccionar un archivo</p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600">JPG</Badge>
                    <Badge variant="outline" className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600">PNG</Badge>
                    <Badge variant="outline" className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600">WEBP</Badge>
                  </div>
                </div>
              ) : (
                // Image Preview with Analysis
                <div className="absolute inset-0 flex">
                  {/* Image */}
                  <div className="flex-1 relative">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Imagen a analizar"
                      className="w-full h-full object-contain bg-slate-900"
                    />

                    {/* Grid Overlay cuando está analizando */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-cyan-500/30" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/40" />
                        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-cyan-500/30" />
                        <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-500/30" />
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/40" />
                        <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-500/30" />
                        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                      </div>
                    )}

                    {/* Clear Button */}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      onClick={clearImage}
                    >
                      <X className="w-5 h-5" />
                    </Button>

                    {/* Analyze Button */}
                    {!isAnalyzing && !analysisResult && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-white shadow-lg px-8"
                          onClick={analyzeImage}
                        >
                          <Cpu className="w-5 h-5 mr-2" />
                          Analizar con IA
                        </Button>
                      </div>
                    )}

                    {/* Analysis Overlay */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
                          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                          <h3 className="text-lg font-bold text-foreground mb-2">Analizando imagen...</h3>
                          <p className="text-sm text-muted-foreground">Google Gemini está inspeccionando la prenda</p>
                        </div>
                      </div>
                    )}

                    {/* Corner Info */}
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-black/70 text-white border-0 font-mono text-xs">
                        {mounted ? currentTime.toLocaleTimeString("es-ES") : "--:--:--"}
                      </Badge>
                    </div>
                  </div>

                  {/* Results Panel */}
                  {analysisResult && (
                    <div className="w-96 bg-white border-l border-border overflow-y-auto">
                      <div className="p-4 border-b border-border sticky top-0 bg-white z-10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-foreground">Resultado del Análisis</h3>
                          <Badge className={getRecommendationColor(analysisResult.overall_recommendation)}>
                            {analysisResult.overall_recommendation}
                          </Badge>
                        </div>

                        {/* Quality Score */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Puntuación de Calidad</span>
                              <span className="font-bold">{analysisResult.quality_score}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
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
                        </div>

                        <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                      </div>

                      {/* Defects List */}
                      {analysisResult.defects && analysisResult.defects.length > 0 ? (
                        <div className="p-4">
                          <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Defectos Encontrados ({analysisResult.total_defects})
                          </h4>

                          <div className="space-y-3">
                            {analysisResult.defects.map((defect, index) => (
                              <div
                                key={defect.id || index}
                                className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge className={cn("text-xs", getSeverityColor(defect.severity))}>
                                      {defect.severity === "critical"
                                        ? "Crítico"
                                        : defect.severity === "major"
                                          ? "Mayor"
                                          : "Menor"}
                                    </Badge>
                                    <span className="font-medium text-sm text-foreground">{defect.type}</span>
                                  </div>
                                  <span className="text-xs font-mono text-muted-foreground">{defect.confidence}%</span>
                                </div>

                                <p className="text-xs text-muted-foreground mb-2">{defect.description}</p>

                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-500">
                                    <strong>Ubicación:</strong> {defect.location}
                                  </span>
                                  <Badge variant="outline" className="text-[10px]">
                                    {defect.recommendation}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        analysisResult.status === "approved" && (
                          <div className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h4 className="font-bold text-foreground mb-2">Prenda Aprobada</h4>
                            <p className="text-sm text-muted-foreground">No se detectaron defectos significativos</p>
                          </div>
                        )
                      )}

                      {/* Notes */}
                      {analysisResult.notes && (
                        <div className="p-4 border-t border-border">
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Notas del Inspector IA
                          </h4>
                          <p className="text-sm text-foreground">{analysisResult.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="p-4 border-t border-border sticky bottom-0 bg-white">
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 bg-transparent" onClick={clearImage}>
                            Nueva Inspección
                          </Button>
                          <Button variant="default" className="flex-1" onClick={analyzeImage}>
                            Re-analizar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // Camera Mode (placeholder)
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm">Feed de cámara {activeCamera}</p>
                <p className="text-slate-500 text-xs mt-1">Resolución: 1920x1080 @ 60fps</p>
                <p className="text-amber-400 text-xs mt-4">Modo cámara en vivo - requiere conexión de hardware</p>
              </div>

              {/* Grid Overlay for camera mode */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/4 top-0 bottom-0 w-px bg-cyan-500/20" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/30" />
                <div className="absolute left-3/4 top-0 bottom-0 w-px bg-cyan-500/20" />
                <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-500/20" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/30" />
                <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-500/20" />
              </div>

              {/* Scan Line when running */}
              {isRunning && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
              )}

              {/* Corner Info */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge className="bg-black/70 text-white border-0 font-mono text-xs">{activeCamera}</Badge>
                {isRunning && (
                  <Badge className="bg-red-600 text-white border-0 text-xs animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 inline-block" />
                    EN VIVO
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-4 right-4">
                <Badge className="bg-black/70 text-white border-0 font-mono text-xs">
                  {mounted ? currentTime.toLocaleTimeString("es-ES") : "--:--:--"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
