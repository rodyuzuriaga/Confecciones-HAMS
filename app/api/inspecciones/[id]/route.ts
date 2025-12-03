import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

// GET - Obtener una inspección específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idInspeccion = parseInt(id)

    if (isNaN(idInspeccion)) {
      return NextResponse.json(
        { error: "ID de inspección inválido" },
        { status: 400 }
      )
    }

    const inspeccion = await prisma.inspeccion.findUnique({
      where: { idInspeccion },
      include: {
        defectos: true,
        lote: true,
        producto: true,
        usuario: {
          select: {
            idUsuario: true,
            nombreUsuario: true,
          },
        },
      },
    })

    if (!inspeccion) {
      return NextResponse.json(
        { error: "Inspección no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(inspeccion)
  } catch (error) {
    console.error("Error al obtener inspección:", error)
    return NextResponse.json(
      { error: "Error al obtener inspección" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una inspección
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idInspeccion = parseInt(id)

    if (isNaN(idInspeccion)) {
      return NextResponse.json(
        { error: "ID de inspección inválido" },
        { status: 400 }
      )
    }

    await prisma.inspeccion.delete({
      where: { idInspeccion },
    })

    return NextResponse.json({ success: true, message: "Inspección eliminada" })
  } catch (error) {
    console.error("Error al eliminar inspección:", error)
    return NextResponse.json(
      { error: "Error al eliminar inspección" },
      { status: 500 }
    )
  }
}
