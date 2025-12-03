import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

// GET - Obtener estadísticas generales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const periodo = searchParams.get("periodo") || "dia" // dia, semana, mes, total

    let dateFilter: Date | undefined
    const now = new Date()

    switch (periodo) {
      case "dia":
        dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "semana":
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "mes":
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        dateFilter = undefined
    }

    const whereClause = dateFilter
      ? { fechaInspeccion: { gte: dateFilter } }
      : {}

    // Obtener estadísticas
    const [
      totalInspecciones,
      aprobadas,
      rechazadas,
      defectosPorSeveridad,
      defectosPorTipo,
      ultimasInspecciones,
      loteActual,
    ] = await Promise.all([
      prisma.inspeccion.count({ where: whereClause }),
      prisma.inspeccion.count({ where: { ...whereClause, resultado: "approved" } }),
      prisma.inspeccion.count({ where: { ...whereClause, resultado: "defects_found" } }),
      prisma.defecto.groupBy({
        by: ["severidad"],
        _count: { severidad: true },
        where: {
          inspeccion: whereClause,
        },
      }),
      prisma.defecto.groupBy({
        by: ["tipo"],
        _count: { tipo: true },
        where: {
          inspeccion: whereClause,
        },
        orderBy: {
          _count: { tipo: "desc" },
        },
        take: 10,
      }),
      prisma.inspeccion.findMany({
        take: 5,
        orderBy: { fechaInspeccion: "desc" },
        include: { defectos: true },
      }),
      prisma.loteProduccion.findFirst({
        orderBy: { fechaCreacion: "desc" },
      }),
    ])

    // Calcular promedios
    const promedioCalidad = await prisma.inspeccion.aggregate({
      where: whereClause,
      _avg: { puntuacionCalidad: true },
    })

    const tasaAprobacion = totalInspecciones > 0 
      ? ((aprobadas / totalInspecciones) * 100).toFixed(1) 
      : "0"

    const defectosFormateados = {
      critical: defectosPorSeveridad.find(d => d.severidad === "critical")?._count.severidad || 0,
      major: defectosPorSeveridad.find(d => d.severidad === "major")?._count.severidad || 0,
      minor: defectosPorSeveridad.find(d => d.severidad === "minor")?._count.severidad || 0,
    }

    return NextResponse.json({
      periodo,
      totalInspecciones,
      aprobadas,
      rechazadas,
      tasaAprobacion: parseFloat(tasaAprobacion),
      promedioCalidad: Math.round(promedioCalidad._avg.puntuacionCalidad || 0),
      defectosPorSeveridad: defectosFormateados,
      defectosPorTipo: defectosPorTipo.map(d => ({
        tipo: d.tipo,
        cantidad: d._count.tipo,
      })),
      ultimasInspecciones,
      loteActual,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
