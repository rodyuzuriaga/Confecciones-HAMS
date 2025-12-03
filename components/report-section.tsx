"use client"

import { useState } from "react"
import { format } from "date-fns"
import { 
  Calendar as CalendarIcon, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Datos de ejemplo para reportes
const reportesData = {
  inspeccionesPorDia: [
    { fecha: "2025-12-01", total: 145, aprobadas: 138, rechazadas: 7 },
    { fecha: "2025-12-02", total: 167, aprobadas: 159, rechazadas: 8 },
    { fecha: "2025-12-03", total: 132, aprobadas: 125, rechazadas: 7 },
  ],
  defectosPorTipo: [
    { tipo: "Costura irregular", cantidad: 45, porcentaje: 35 },
    { tipo: "Mancha", cantidad: 28, porcentaje: 22 },
    { tipo: "Botón defectuoso", cantidad: 18, porcentaje: 14 },
    { tipo: "Decoloración", cantidad: 15, porcentaje: 12 },
    { tipo: "Medidas incorrectas", cantidad: 12, porcentaje: 9 },
    { tipo: "Otros", cantidad: 10, porcentaje: 8 },
  ],
  rendimientoPorOperador: [
    { operador: "Juan Pérez", inspecciones: 234, eficiencia: 96.5 },
    { operador: "María García", inspecciones: 198, eficiencia: 94.2 },
    { operador: "Carlos López", inspecciones: 178, eficiencia: 92.8 },
  ],
}

export function ReportSection() {
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [fechaFin, setFechaFin] = useState<Date | undefined>(new Date())
  const [tipoReporte, setTipoReporte] = useState("inspecciones")

  const handleExportPDF = () => {
    toast.success("Exportando a PDF", {
      description: "El reporte se está generando...",
    })
    // Aquí iría la lógica de exportación a PDF
    setTimeout(() => {
      toast.success("PDF generado", {
        description: "El archivo ha sido descargado",
      })
    }, 1500)
  }

  const handleExportExcel = () => {
    toast.success("Exportando a Excel", {
      description: "El reporte se está generando...",
    })
    // Aquí iría la lógica de exportación a Excel
    setTimeout(() => {
      toast.success("Excel generado", {
        description: "El archivo ha sido descargado",
      })
    }, 1500)
  }

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Reportería
          </h2>
          <p className="text-muted-foreground">
            Genera reportes detallados del sistema de control de calidad
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <FileText className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtros de fecha */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Reporte</CardTitle>
          <CardDescription>Seleccione el rango de fechas y tipo de reporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Fecha Inicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">Fecha Inicio</label>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !fechaInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio ? format(fechaInicio, "dd/MM/yyyy") : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={setFechaInicio}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Fecha Fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">Fecha Fin</label>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !fechaFin && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin ? format(fechaFin, "dd/MM/yyyy") : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={setFechaFin}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tipo de Reporte */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Tipo de Reporte</label>
              <div className="flex gap-4 items-center">
                <Select value={tipoReporte} onValueChange={setTipoReporte}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspecciones">Inspecciones por día</SelectItem>
                    <SelectItem value="defectos">Defectos por tipo</SelectItem>
                    <SelectItem value="operadores">Rendimiento por operador</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-2">
                  <Filter className="h-4 w-4" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspecciones</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">444</div>
            <p className="text-xs text-muted-foreground">En el rango seleccionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">422</div>
            <p className="text-xs text-muted-foreground">95.0% del total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">22</div>
            <p className="text-xs text-muted-foreground">5.0% del total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">94.5%</div>
            <p className="text-xs text-muted-foreground">+2.3% vs periodo anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de datos según tipo de reporte */}
      <Card>
        <CardHeader>
          <CardTitle>
            {tipoReporte === "inspecciones" && "Inspecciones por Día"}
            {tipoReporte === "defectos" && "Defectos por Tipo"}
            {tipoReporte === "operadores" && "Rendimiento por Operador"}
          </CardTitle>
          <CardDescription>
            Datos del {fechaInicio ? format(fechaInicio, "dd/MM/yyyy") : "inicio"} al{" "}
            {fechaFin ? format(fechaFin, "dd/MM/yyyy") : "fin"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            {tipoReporte === "inspecciones" && (
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Aprobadas</TableHead>
                    <TableHead className="text-right">Rechazadas</TableHead>
                    <TableHead className="text-right">Eficiencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportesData.inspeccionesPorDia.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{format(new Date(row.fecha), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="text-right font-medium">{row.total}</TableCell>
                      <TableCell className="text-right text-green-600">{row.aprobadas}</TableCell>
                      <TableCell className="text-right text-red-600">{row.rechazadas}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {((row.aprobadas / row.total) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}

            {tipoReporte === "defectos" && (
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Defecto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Porcentaje</TableHead>
                    <TableHead>Tendencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportesData.defectosPorTipo.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.tipo}</TableCell>
                      <TableCell className="text-right">{row.cantidad}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{row.porcentaje}%</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${row.porcentaje}%` }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}

            {tipoReporte === "operadores" && (
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operador</TableHead>
                    <TableHead className="text-right">Inspecciones</TableHead>
                    <TableHead className="text-right">Eficiencia</TableHead>
                    <TableHead>Rendimiento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportesData.rendimientoPorOperador.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.operador}</TableCell>
                      <TableCell className="text-right">{row.inspecciones}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={cn(
                            row.eficiencia >= 95
                              ? "bg-green-50 text-green-700"
                              : row.eficiencia >= 90
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                          )}
                        >
                          {row.eficiencia}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {row.eficiencia >= 95 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {row.eficiencia >= 95 ? "Excelente" : "Regular"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}