import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

// GET - Obtener todas las inspecciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const [inspecciones, total] = await Promise.all([
      prisma.inspeccion.findMany({
        skip,
        take: limit,
        orderBy: { fechaInspeccion: "desc" },
        include: {
          defectos: true,
          lote: true,
          producto: true,
        },
      }),
      prisma.inspeccion.count(),
    ])

    return NextResponse.json({
      data: inspecciones,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error al obtener inspecciones:", error)
    return NextResponse.json(
      { error: "Error al obtener inspecciones" },
      { status: 500 }
    )
  }
}

// POST - Crear nueva inspección
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      imagenBase64,
      resultado,
      recomendacion,
      puntuacionCalidad,
      resumenAnalisis,
      notasIA,
      respuestaCompletaIA,
      tiempoAnalisisMs,
      defectos,
      idUsuario,
    } = body

    // Obtener o crear el lote del día actual
    const today = new Date()
    const numeroLote = `LOTE-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`

    let lote = await prisma.loteProduccion.findUnique({
      where: { numeroLote },
    })

    if (!lote) {
      lote = await prisma.loteProduccion.create({
        data: {
          numeroLote,
          fechaCreacion: today,
          cantidadTotal: 0,
          cantidadInspeccionada: 0,
          cantidadAprobada: 0,
          cantidadRechazada: 0,
          estado: "en_proceso",
        },
      })
    }

    // Obtener o crear el producto "Jeans" por defecto
    let producto = await prisma.producto.findFirst({
      where: { nombre: "Jeans" },
    })

    if (!producto) {
      producto = await prisma.producto.create({
        data: {
          nombre: "Jeans",
          descripcion: "Pantalón de mezclilla",
          especificacionesCalidad: "Control de calidad estándar para jeans",
          activo: true,
        },
      })
    }

    // Crear la inspección
    const inspeccion = await prisma.inspeccion.create({
      data: {
        idLote: lote.idLote,
        idProducto: producto.idProducto,
        idUsuario: idUsuario || null,
        imagenBase64,
        resultado,
        recomendacion,
        puntuacionCalidad,
        resumenAnalisis,
        notasIA,
        respuestaCompletaIA,
        tiempoAnalisisMs,
        defectos: {
          create: defectos?.map((d: any) => ({
            tipo: d.type || d.tipo,
            severidad: d.severity || d.severidad,
            ubicacion: d.location || d.ubicacion,
            confianza: d.confidence || d.confianza,
            descripcion: d.description || d.descripcion,
            recomendacion: d.recommendation || d.recomendacion,
          })) || [],
        },
      },
      include: {
        defectos: true,
        lote: true,
        producto: true,
      },
    })

    // Actualizar contadores del lote
    const updateData: any = {
      cantidadInspeccionada: { increment: 1 },
      cantidadTotal: { increment: 1 },
    }

    if (resultado === "approved") {
      updateData.cantidadAprobada = { increment: 1 }
    } else if (resultado === "defects_found") {
      updateData.cantidadRechazada = { increment: 1 }
    }

    await prisma.loteProduccion.update({
      where: { idLote: lote.idLote },
      data: updateData,
    })

    return NextResponse.json(inspeccion, { status: 201 })
  } catch (error) {
    console.error("Error al crear inspección:", error)
    return NextResponse.json(
      { error: "Error al crear inspección", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    )
  }
}
