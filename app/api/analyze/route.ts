import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No se proporcionó imagen" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "")

    const prompt = `Eres un experto en control de calidad textil especializado en la inspección de pantalones y jeans. Analiza esta imagen de un pantalón/jean y detecta TODOS los posibles defectos de fabricación.

Para cada defecto encontrado, proporciona:
1. Tipo de defecto (ej: costura irregular, mancha, decoloración, hilo suelto, botón defectuoso, cierre dañado, tela rasgada, medidas incorrectas, arrugas permanentes, costuras torcidas, ojales mal hechos, remaches defectuosos, etiqueta mal colocada, desgaste prematuro, manchas de aceite, puntos saltados en costura, etc.)
2. Severidad: "critical" (afecta funcionalidad o es muy visible), "major" (defecto notable pero no crítico), "minor" (defecto menor, poco visible)
3. Ubicación aproximada en la prenda
4. Confianza del análisis (porcentaje)
5. Descripción detallada del defecto
6. Recomendación (rechazar, reparar, aprobar con observación)

Si NO encuentras defectos, indica que la prenda pasa el control de calidad.

Responde ÚNICAMENTE en formato JSON válido con esta estructura:
{
  "status": "defects_found" | "approved",
  "summary": "Resumen general del análisis",
  "total_defects": número,
  "quality_score": número del 0 al 100,
  "defects": [
    {
      "id": "string único",
      "type": "tipo de defecto",
      "severity": "critical" | "major" | "minor",
      "location": "ubicación en la prenda",
      "confidence": número del 0 al 100,
      "description": "descripción detallada",
      "recommendation": "rechazar" | "reparar" | "aprobar con observación"
    }
  ],
  "overall_recommendation": "APROBAR" | "RECHAZAR" | "REPARAR",
  "notes": "notas adicionales del inspector IA"
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
      return NextResponse.json(analysisResult)
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
