import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET - Obtener todos los lotes de producción
export async function GET() {
  try {
    const lotes = await prisma.loteProduccion.findMany({
      orderBy: { fechaCreacion: "desc" },
      include: {
        _count: {
          select: { inspecciones: true },
        },
      },
    })

    return NextResponse.json(lotes)
  } catch (error) {
    console.error("Error al obtener lotes:", error)
    return NextResponse.json(
      { error: "Error al obtener lotes" },
      { status: 500 }
    )
  }
}
