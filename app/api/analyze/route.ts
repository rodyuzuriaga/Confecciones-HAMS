import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Función para guardar la inspección en la base de datos
async function saveInspection(
  imagenBase64: string,
  analysisResult: any,
  tiempoAnalisisMs: number,
  respuestaCompleta: string
) {
  try {
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
        imagenBase64,
        resultado: analysisResult.status || "error",
        recomendacion: analysisResult.overall_recommendation,
        puntuacionCalidad: analysisResult.quality_score,
        resumenAnalisis: analysisResult.summary,
        notasIA: analysisResult.notes,
        respuestaCompletaIA: respuestaCompleta,
        tiempoAnalisisMs,
        defectos: {
          create: analysisResult.defects?.map((d: any) => ({
            tipo: d.type,
            severidad: d.severity,
            ubicacion: d.location,
            confianza: d.confidence,
            descripcion: d.description,
            recomendacion: d.recommendation,
          })) || [],
        },
      },
      include: {
        defectos: true,
      },
    })

    // Actualizar contadores del lote
    const updateData: any = {
      cantidadInspeccionada: { increment: 1 },
      cantidadTotal: { increment: 1 },
    }

    if (analysisResult.status === "approved") {
      updateData.cantidadAprobada = { increment: 1 }
    } else if (analysisResult.status === "defects_found" || analysisResult.status === "error") {
      updateData.cantidadRechazada = { increment: 1 }
    }

    await prisma.loteProduccion.update({
      where: { idLote: lote.idLote },
      data: updateData,
    })

    return inspeccion.idInspeccion
  } catch (error) {
    console.error("Error al guardar inspección:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No se proporcionó imagen" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "")

    const prompt = `Eres un experto en control de calidad textil especializado ÚNICAMENTE en la inspección de pantalones jeans. Tu tarea es analizar imágenes de jeans para detectar defectos de fabricación.

IMPORTANTE: PRIMERO verifica si la imagen muestra efectivamente un pantalón jeans. Si la imagen NO muestra un pantalón jeans (por ejemplo: es una camisa, falda, vestido, chaqueta, objeto no textil, persona, paisaje, etc.), debes RECHAZAR inmediatamente la prenda con un puntaje de calidad de 0.

TODA tu respuesta debe estar en ESPAÑOL.

Solo analiza jeans - rechaza cualquier otra prenda u objeto que no sea un pantalón jeans.

Para jeans válidos, detecta TODOS los posibles defectos de fabricación:

Para cada defecto encontrado, proporciona:
1. Tipo de defecto (ej: costura irregular, mancha, decoloración, hilo suelto, botón defectuoso, cierre dañado, tela rasgada, medidas incorrectas, arrugas permanentes, costuras torcidas, ojales mal hechos, remaches defectuosos, etiqueta mal colocada, desgaste prematuro, manchas de aceite, puntos saltados en costura, etc.)
2. Severidad: "critical" (afecta funcionalidad o es muy visible), "major" (defecto notable pero no crítico), "minor" (defecto menor, poco visible)
3. Ubicación aproximada en la prenda
4. Confianza del análisis (porcentaje)
5. Descripción detallada del defecto EN ESPAÑOL
6. Recomendación (rechazar, reparar, aprobar con observación)

Si NO encuentras defectos en un jean válido, indica que la prenda pasa el control de calidad.
Si la imagen no es clara o no muestra suficiente detalle de un jean, indica esto en las notas EN ESPAÑOL.

Responde ÚNICAMENTE en formato JSON válido con esta estructura (TODOS los textos en ESPAÑOL):
{
  "status": "defects_found" | "approved" | "error",
  "summary": "Resumen general del análisis EN ESPAÑOL",
  "total_defects": número,
  "quality_score": número del 0 al 100,
  "defects": [
    {
      "id": "string único",
      "type": "tipo de defecto EN ESPAÑOL",
      "severity": "critical" | "major" | "minor",
      "location": "ubicación en la prenda EN ESPAÑOL",
      "confidence": número del 0 al 100,
      "description": "descripción detallada EN ESPAÑOL",
      "recommendation": "rechazar" | "reparar" | "aprobar con observación"
    }
  ],
  "overall_recommendation": "APROBAR" | "RECHAZAR" | "REPARAR",
  "notes": "notas adicionales del inspector IA EN ESPAÑOL"
}`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    // Extraer JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysisResult = JSON.parse(jsonMatch[0])
      const tiempoAnalisisMs = Date.now() - startTime
      
      // Guardar en la base de datos
      const idInspeccion = await saveInspection(image, analysisResult, tiempoAnalisisMs, text)
      
      return NextResponse.json({
        ...analysisResult,
        idInspeccion,
        tiempoAnalisisMs,
      })
    }

    return NextResponse.json({
      status: "error",
      summary: "No se pudo procesar la respuesta del modelo",
      raw_response: text,
    })
  } catch (error) {
    console.error("Error en análisis:", error)
    return NextResponse.json(
      {
        error: "Error al analizar la imagen",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
