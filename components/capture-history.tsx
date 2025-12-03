"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle, XCircle, AlertTriangle, Search, RefreshCw, Loader2, Trash2, Eye, Clock, Cpu, Package, FileText, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import type { AnalysisResult } from "@/components/inspection-view"
import { toast } from "sonner"

interface InspeccionDB {
    idInspeccion: number
    fechaInspeccion: string
    imagenBase64: string | null
    resultado: string
    recomendacion: string | null
    puntuacionCalidad: number | null
    resumenAnalisis: string | null
    notasIA: string | null
    tiempoAnalisisMs: number | null
    defectos: {
        idDefecto: number
        tipo: string
        severidad: string
        ubicacion: string | null
        confianza: number | null
        descripcion: string | null
        recomendacion: string | null
    }[]
    lote: {
        numeroLote: string
    } | null
}

interface CaptureHistoryProps {
    history?: AnalysisResult[]
}

export function CaptureHistory({ history: localHistory = [] }: CaptureHistoryProps) {
    const [inspecciones, setInspecciones] = useState<InspeccionDB[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedInspeccion, setSelectedInspeccion] = useState<InspeccionDB | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchInspecciones = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/inspecciones?limit=100")
            const data = await response.json()
            if (data.data) {
                setInspecciones(data.data)
            }
        } catch (error) {
            console.error("Error al cargar inspecciones:", error)
            toast.error("Error al cargar el historial")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchInspecciones()
    }, [fetchInspecciones])

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta inspección?")) return
        
        try {
            await fetch(`/api/inspecciones/${id}`, { method: "DELETE" })
            setInspecciones(prev => prev.filter(i => i.idInspeccion !== id))
            toast.success("Inspección eliminada")
        } catch (error) {
            toast.error("Error al eliminar")
        }
    }

    const filteredInspecciones = inspecciones.filter(item => 
        item.resumenAnalisis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lote?.numeroLote.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.defectos.some(d => d.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="h-full p-6 space-y-6 overflow-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Historial de Capturas</h2>
                    <p className="text-muted-foreground">
                        {inspecciones.length} inspecciones guardadas en base de datos
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por lote o defecto..." 
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={fetchInspecciones} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInspecciones.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Search className="h-12 w-12 mb-4 opacity-20" />
                            <p>No hay capturas registradas aún</p>
                        </div>
                    ) : (
                        filteredInspecciones.map((item) => (
                            <Card key={item.idInspeccion} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 group" style={{
                                borderLeftColor: item.resultado === "approved" ? "#22c55e" : item.resultado === "defects_found" ? "#ef4444" : "#f59e0b"
                            }}>
                                <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            {item.resultado === "approved" ? (
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm">
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Aprobado
                                                </Badge>
                                            ) : item.resultado === "defects_found" ? (
                                                <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-sm">
                                                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Defectos Encontrados
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
                                                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Error
                                                </Badge>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(item.fechaInspeccion), "d MMM yyyy, HH:mm", { locale: es })}
                                            </div>
                                            {item.lote && (
                                                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                                                    <Package className="w-3 h-3 mr-1" />
                                                    {item.lote.numeroLote}
                                                </Badge>
                                            )}
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(item.idInspeccion)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-3">
                                    <div className="space-y-4">
                                        {/* Imagen con overlay */}
                                        <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                                            {item.imagenBase64 ? (
                                                <>
                                                    <img 
                                                        src={item.imagenBase64} 
                                                        alt="Captura" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-muted-foreground text-xs">Sin imagen</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Puntuación de calidad con barra de progreso */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Puntuación de Calidad</span>
                                                <span className={`text-lg font-bold ${
                                                    (item.puntuacionCalidad || 0) >= 80 ? "text-emerald-600" :
                                                    (item.puntuacionCalidad || 0) >= 50 ? "text-amber-600" : "text-red-600"
                                                }`}>
                                                    {item.puntuacionCalidad || 0}%
                                                </span>
                                            </div>
                                            <Progress 
                                                value={item.puntuacionCalidad || 0} 
                                                className={`h-2 ${
                                                    (item.puntuacionCalidad || 0) >= 80 ? "[&>div]:bg-emerald-500" :
                                                    (item.puntuacionCalidad || 0) >= 50 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
                                                }`}
                                            />
                                        </div>

                                        {/* Stats compactos */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
                                            <div className="flex items-center gap-1">
                                                <Cpu className="w-3 h-3" />
                                                <span>{item.tiempoAnalisisMs || 0}ms</span>
                                            </div>
                                            {item.defectos && item.defectos.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3 text-red-500" />
                                                    <span>{item.defectos.length} defecto{item.defectos.length > 1 ? "s" : ""}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Defectos */}
                                        {item.defectos && item.defectos.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {item.defectos.slice(0, 2).map((defect) => (
                                                        <Badge 
                                                            key={defect.idDefecto} 
                                                            variant="secondary" 
                                                            className={`text-xs font-medium ${
                                                                defect.severidad === "critical" 
                                                                    ? "bg-red-100 text-red-800 border border-red-200" 
                                                                    : defect.severidad === "major"
                                                                        ? "bg-orange-100 text-orange-800 border border-orange-200"
                                                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                            }`}
                                                        >
                                                            {defect.tipo}
                                                        </Badge>
                                                    ))}
                                                    {item.defectos.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{item.defectos.length - 2} más
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Botón Ver Detalles */}
                                        <Button 
                                            className="w-full mt-2" 
                                            variant="default"
                                            onClick={() => setSelectedInspeccion(item)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver Detalles Completos
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Dialog para ver detalle completo - Diseño igual al análisis IA */}
            <Dialog open={!!selectedInspeccion} onOpenChange={() => setSelectedInspeccion(null)}>
                <DialogContent className="max-w-5xl w-[90vw] h-[85vh] p-0 overflow-hidden flex flex-col">
                    <VisuallyHidden.Root asChild>
                        <DialogTitle>Detalle de Inspección</DialogTitle>
                    </VisuallyHidden.Root>
                    {selectedInspeccion && (
                        <>
                            {/* Header con gradiente */}
                            <div className={`p-6 text-white shrink-0 rounded-t-lg ${
                                selectedInspeccion.recomendacion === "APROBAR" 
                                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500" 
                                    : selectedInspeccion.recomendacion === "RECHAZAR"
                                        ? "bg-gradient-to-r from-red-600 to-red-500"
                                        : "bg-gradient-to-r from-amber-600 to-amber-500"
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-80">Inspección #{selectedInspeccion.idInspeccion}</p>
                                        <h2 className="text-2xl font-bold flex items-center gap-3">
                                            {selectedInspeccion.recomendacion === "APROBAR" ? (
                                                <CheckCircle className="w-7 h-7" />
                                            ) : selectedInspeccion.recomendacion === "RECHAZAR" ? (
                                                <XCircle className="w-7 h-7" />
                                            ) : (
                                                <AlertTriangle className="w-7 h-7" />
                                            )}
                                            {selectedInspeccion.recomendacion}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-bold">{selectedInspeccion.puntuacionCalidad}%</p>
                                        <p className="text-sm opacity-80">Puntuación de Calidad</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido con scroll */}
                            <ScrollArea className="flex-1 overflow-auto">
                                <div className="p-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Columna izquierda - Imagen */}
                                    <div className="space-y-4">
                                        <div className="relative rounded-xl overflow-hidden bg-slate-100 border shadow-sm">
                                            {selectedInspeccion.imagenBase64 ? (
                                                <img 
                                                    src={selectedInspeccion.imagenBase64} 
                                                    alt="Imagen analizada" 
                                                    className="w-full h-auto max-h-[450px] object-contain"
                                                />
                                            ) : (
                                                    <div className="aspect-video flex items-center justify-center text-muted-foreground">
                                                        Sin imagen disponible
                                                    </div>
                                                )}
                                            </div>
                                        
                                            {/* Info de la imagen */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-muted/50 rounded-lg p-4 text-center border">
                                                    <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">Tiempo de Análisis</p>
                                                    <p className="font-bold text-lg">{selectedInspeccion.tiempoAnalisisMs}ms</p>
                                                </div>
                                                <div className="bg-muted/50 rounded-lg p-4 text-center border">
                                                    <Package className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">Lote</p>
                                                    <p className="font-bold text-sm">{selectedInspeccion.lote?.numeroLote || "N/A"}</p>
                                                </div>
                                            </div>

                                            {/* Fecha */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                                            <Clock className="w-4 h-4" />
                                            <span>Analizado el {format(new Date(selectedInspeccion.fechaInspeccion), "PPPP 'a las' HH:mm", { locale: es })}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Columna derecha - Análisis */}
                                    <div className="space-y-5">
                                        {/* Barra de calidad */}
                                        <div className="bg-muted/30 rounded-xl p-4 border">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-medium">Puntuación de Calidad</span>
                                                <span className={`text-2xl font-bold ${
                                                    (selectedInspeccion.puntuacionCalidad || 0) >= 80 ? "text-emerald-600" :
                                                    (selectedInspeccion.puntuacionCalidad || 0) >= 50 ? "text-amber-600" : "text-red-600"
                                                }`}>
                                                    {selectedInspeccion.puntuacionCalidad}%
                                                </span>
                                            </div>
                                            <Progress 
                                                value={selectedInspeccion.puntuacionCalidad || 0} 
                                                className={`h-3 ${
                                                    (selectedInspeccion.puntuacionCalidad || 0) >= 80 ? "[&>div]:bg-emerald-500" :
                                                    (selectedInspeccion.puntuacionCalidad || 0) >= 50 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
                                                }`}
                                            />
                                        </div>

                                        {/* Resumen */}
                                        <div className="bg-muted/20 rounded-xl p-4 border">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-4 h-4 text-primary" />
                                                <h4 className="font-semibold">Resumen del Análisis</h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedInspeccion.resumenAnalisis}</p>
                                        </div>

                                        {/* Notas IA */}
                                        {selectedInspeccion.notasIA && (
                                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Cpu className="w-4 h-4 text-blue-600" />
                                                    <h4 className="font-semibold text-blue-800">Notas del Inspector IA</h4>
                                                </div>
                                                <p className="text-sm text-blue-700 leading-relaxed">{selectedInspeccion.notasIA}</p>
                                            </div>
                                        )}

                                        {/* Defectos Detectados */}
                                        {selectedInspeccion.defectos.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                    <h4 className="font-semibold">Defectos Detectados ({selectedInspeccion.defectos.length})</h4>
                                                </div>
                                                <div className="space-y-3 max-h-64 overflow-auto pr-2">
                                                    {selectedInspeccion.defectos.map((defect) => (
                                                        <div 
                                                            key={defect.idDefecto}
                                                            className={`p-4 rounded-xl border-l-4 ${
                                                                defect.severidad === "critical"
                                                                    ? "border-l-red-500 bg-red-50 dark:bg-red-50"
                                                                    : defect.severidad === "major"
                                                                        ? "border-l-orange-500 bg-orange-50 dark:bg-orange-50"
                                                                        : "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-50"
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className="font-semibold text-slate-800 dark:text-slate-800">{defect.tipo}</span>
                                                                <Badge className={`text-xs text-white ${
                                                                    defect.severidad === "critical"
                                                                        ? "bg-red-500"
                                                                        : defect.severidad === "major"
                                                                            ? "bg-orange-500"
                                                                            : "bg-yellow-500"
                                                                }`}>
                                                                    {defect.severidad === "critical" ? "Crítico" : 
                                                                     defect.severidad === "major" ? "Mayor" : "Menor"}
                                                                </Badge>
                                                            </div>
                                                            {defect.descripcion && (
                                                                <p className="text-sm text-slate-600 dark:text-slate-600 mb-2">{defect.descripcion}</p>
                                                            )}
                                                            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-500">
                                                                {defect.ubicacion && (
                                                                    <span className="flex items-center gap-1">
                                                                        📍 {defect.ubicacion}
                                                                    </span>
                                                                )}
                                                                {defect.confianza && (
                                                                    <span className="flex items-center gap-1">
                                                                        🎯 {defect.confianza}% confianza
                                                                    </span>
                                                                )}
                                                                {defect.recomendacion && (
                                                                    <span className="flex items-center gap-1">
                                                                        💡 {defect.recomendacion}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Estado Aprobado */}
                                        {selectedInspeccion.resultado === "approved" && (
                                            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-emerald-800">Prenda Aprobada</p>
                                                    <p className="text-sm text-emerald-600">No se detectaron defectos significativos</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
