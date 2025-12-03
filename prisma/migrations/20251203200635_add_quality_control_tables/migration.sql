-- CreateTable
CREATE TABLE "Producto" (
    "idProducto" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "especificacionesCalidad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("idProducto")
);

-- CreateTable
CREATE TABLE "LoteProduccion" (
    "idLote" SERIAL NOT NULL,
    "numeroLote" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidadTotal" INTEGER NOT NULL DEFAULT 0,
    "cantidadInspeccionada" INTEGER NOT NULL DEFAULT 0,
    "cantidadAprobada" INTEGER NOT NULL DEFAULT 0,
    "cantidadRechazada" INTEGER NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'en_proceso',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoteProduccion_pkey" PRIMARY KEY ("idLote")
);

-- CreateTable
CREATE TABLE "Inspeccion" (
    "idInspeccion" SERIAL NOT NULL,
    "idLote" INTEGER,
    "idProducto" INTEGER,
    "idUsuario" INTEGER,
    "fechaInspeccion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imagenBase64" TEXT,
    "imagenUrl" TEXT,
    "resultado" TEXT NOT NULL,
    "recomendacion" TEXT,
    "puntuacionCalidad" INTEGER,
    "resumenAnalisis" TEXT,
    "notasIA" TEXT,
    "respuestaCompletaIA" TEXT,
    "tiempoAnalisisMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inspeccion_pkey" PRIMARY KEY ("idInspeccion")
);

-- CreateTable
CREATE TABLE "Defecto" (
    "idDefecto" SERIAL NOT NULL,
    "idInspeccion" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "severidad" TEXT NOT NULL,
    "ubicacion" TEXT,
    "confianza" INTEGER,
    "descripcion" TEXT,
    "recomendacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Defecto_pkey" PRIMARY KEY ("idDefecto")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoteProduccion_numeroLote_key" ON "LoteProduccion"("numeroLote");

-- AddForeignKey
ALTER TABLE "Inspeccion" ADD CONSTRAINT "Inspeccion_idLote_fkey" FOREIGN KEY ("idLote") REFERENCES "LoteProduccion"("idLote") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspeccion" ADD CONSTRAINT "Inspeccion_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "Producto"("idProducto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspeccion" ADD CONSTRAINT "Inspeccion_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defecto" ADD CONSTRAINT "Defecto_idInspeccion_fkey" FOREIGN KEY ("idInspeccion") REFERENCES "Inspeccion"("idInspeccion") ON DELETE CASCADE ON UPDATE CASCADE;
