"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle, XCircle, AlertTriangle, Search, Filter, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { AnalysisResult } from "@/components/inspection-view"

interface CaptureHistoryProps {
    history: AnalysisResult[]
}

export function CaptureHistory({ history }: CaptureHistoryProps) {
    return (
        <div className="h-full p-6 space-y-6 overflow-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Historial de Capturas</h2>
                    <p className="text-muted-foreground">Registro detallado de análisis realizados por la IA</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar por ID o tipo..." className="pl-8" />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Calendar className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Search className="h-12 w-12 mb-4 opacity-20" />
                        <p>No hay capturas registradas aún</p>
                    </div>
                ) : (
                    history.map((item, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            {item.status === "approved" ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Aprobado
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                    <XCircle className="w-3 h-3 mr-1" /> Rechazado
                                                </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {item.timestamp ? format(new Date(item.timestamp), "PP p", { locale: es }) : "Fecha desconocida"}
                                            </span>
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden group">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="Captura" className="w-full h-full object-contain" />
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                    <p className="text-white text-xs font-medium truncate">{item.summary}</p>
                                                </div>
                                                <span className="text-muted-foreground text-xs">Vista Previa de Captura</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Confianza IA</span>
                                            <span className="font-medium">{(item.quality_score || 0).toFixed(1)}%</span>
                                        </div>

                                        {item.defects && item.defects.length > 0 && (
                                            <div className="space-y-1">
                                                <span className="text-xs font-medium text-muted-foreground">Defectos Detectados:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.defects.map((defect, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                            {defect.type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-muted/50 p-2 rounded text-xs text-muted-foreground mt-2">
                                            <p className="font-medium mb-1">Análisis:</p>
                                            {item.summary}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
