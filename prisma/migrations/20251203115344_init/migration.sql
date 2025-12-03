-- CreateTable
CREATE TABLE "Pais" (
    "idPais" SERIAL NOT NULL,
    "nombrePais" TEXT NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("idPais")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "idDepartamento" SERIAL NOT NULL,
    "nombreDepartamento" TEXT NOT NULL,
    "idPais" INTEGER NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("idDepartamento")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "idProvincia" SERIAL NOT NULL,
    "nombreProvincia" TEXT NOT NULL,
    "idDepartamento" INTEGER NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("idProvincia")
);

-- CreateTable
CREATE TABLE "Distrito" (
    "idDistrito" SERIAL NOT NULL,
    "nombreDistrito" TEXT NOT NULL,
    "idProvincia" INTEGER NOT NULL,

    CONSTRAINT "Distrito_pkey" PRIMARY KEY ("idDistrito")
);

-- CreateTable
CREATE TABLE "Sexo" (
    "idSexo" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Sexo_pkey" PRIMARY KEY ("idSexo")
);

-- CreateTable
CREATE TABLE "EstadoCivil" (
    "idEstadoCivil" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "EstadoCivil_pkey" PRIMARY KEY ("idEstadoCivil")
);

-- CreateTable
CREATE TABLE "Rol" (
    "idRol" SERIAL NOT NULL,
    "nombreRol" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "idPermiso" SERIAL NOT NULL,
    "nombrePermiso" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("idPermiso")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "idRol" INTEGER NOT NULL,
    "idPermiso" INTEGER NOT NULL,
    "ultimoAcceso" TIMESTAMP(3),
    "intentosFallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "tokenRecuperacion" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "DatosPersonales" (
    "idDatosPersonales" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "idSexo" INTEGER NOT NULL,
    "idEstadoCivil" INTEGER NOT NULL,

    CONSTRAINT "DatosPersonales_pkey" PRIMARY KEY ("idDatosPersonales")
);

-- CreateTable
CREATE TABLE "CorreoElectronico" (
    "idCorreo" SERIAL NOT NULL,
    "idDatosPersonales" INTEGER NOT NULL,
    "correoElectronico" TEXT NOT NULL,
    "tipoCorreo" TEXT NOT NULL DEFAULT 'personal',

    CONSTRAINT "CorreoElectronico_pkey" PRIMARY KEY ("idCorreo")
);

-- CreateTable
CREATE TABLE "Telefono" (
    "idTelefono" SERIAL NOT NULL,
    "idDatosPersonales" INTEGER NOT NULL,
    "numeroTelefono" TEXT NOT NULL,
    "tipoTelefono" TEXT NOT NULL DEFAULT 'movil',

    CONSTRAINT "Telefono_pkey" PRIMARY KEY ("idTelefono")
);

-- CreateTable
CREATE TABLE "Direccion" (
    "idDireccion" SERIAL NOT NULL,
    "idDatosPersonales" INTEGER NOT NULL,
    "idDistrito" INTEGER NOT NULL,
    "calleAvenida" TEXT NOT NULL,
    "tipoDireccion" TEXT NOT NULL DEFAULT 'domicilio',
    "piso" TEXT,
    "numero" TEXT NOT NULL,
    "referencia" TEXT,

    CONSTRAINT "Direccion_pkey" PRIMARY KEY ("idDireccion")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "idCliente" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "ruc" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "idProveedor" SERIAL NOT NULL,
    "nombreEmpresa" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "contacto" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("idProveedor")
);

-- CreateTable
CREATE TABLE "CategoriaProducto" (
    "idCategoria" SERIAL NOT NULL,
    "nombreCategoria" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "CategoriaProducto_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateTable
CREATE TABLE "Producto" (
    "idProducto" SERIAL NOT NULL,
    "nombreProducto" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioCompra" DOUBLE PRECISION NOT NULL,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 5,
    "idCategoria" INTEGER NOT NULL,
    "idProveedor" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("idProducto")
);

-- CreateTable
CREATE TABLE "Venta" (
    "idVenta" SERIAL NOT NULL,
    "fechaVenta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,
    "idCliente" INTEGER,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "igv" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "totalLetras" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'completada',

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("idVenta")
);

-- CreateTable
CREATE TABLE "DetalleVenta" (
    "idDetalleVenta" SERIAL NOT NULL,
    "idVenta" INTEGER NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("idDetalleVenta")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pais_nombrePais_key" ON "Pais"("nombrePais");

-- CreateIndex
CREATE UNIQUE INDEX "Sexo_descripcion_key" ON "Sexo"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoCivil_descripcion_key" ON "EstadoCivil"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombreRol_key" ON "Rol"("nombreRol");

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_nombrePermiso_key" ON "Permiso"("nombrePermiso");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombreUsuario_key" ON "Usuario"("nombreUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "DatosPersonales_idUsuario_key" ON "DatosPersonales"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "DatosPersonales_dni_key" ON "DatosPersonales"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_dni_key" ON "Cliente"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_ruc_key" ON "Cliente"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_ruc_key" ON "Proveedor"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaProducto_nombreCategoria_key" ON "CategoriaProducto"("nombreCategoria");

-- AddForeignKey
ALTER TABLE "Departamento" ADD CONSTRAINT "Departamento_idPais_fkey" FOREIGN KEY ("idPais") REFERENCES "Pais"("idPais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_idDepartamento_fkey" FOREIGN KEY ("idDepartamento") REFERENCES "Departamento"("idDepartamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distrito" ADD CONSTRAINT "Distrito_idProvincia_fkey" FOREIGN KEY ("idProvincia") REFERENCES "Provincia"("idProvincia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_idRol_fkey" FOREIGN KEY ("idRol") REFERENCES "Rol"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_idPermiso_fkey" FOREIGN KEY ("idPermiso") REFERENCES "Permiso"("idPermiso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatosPersonales" ADD CONSTRAINT "DatosPersonales_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatosPersonales" ADD CONSTRAINT "DatosPersonales_idSexo_fkey" FOREIGN KEY ("idSexo") REFERENCES "Sexo"("idSexo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatosPersonales" ADD CONSTRAINT "DatosPersonales_idEstadoCivil_fkey" FOREIGN KEY ("idEstadoCivil") REFERENCES "EstadoCivil"("idEstadoCivil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorreoElectronico" ADD CONSTRAINT "CorreoElectronico_idDatosPersonales_fkey" FOREIGN KEY ("idDatosPersonales") REFERENCES "DatosPersonales"("idDatosPersonales") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefono" ADD CONSTRAINT "Telefono_idDatosPersonales_fkey" FOREIGN KEY ("idDatosPersonales") REFERENCES "DatosPersonales"("idDatosPersonales") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direccion" ADD CONSTRAINT "Direccion_idDatosPersonales_fkey" FOREIGN KEY ("idDatosPersonales") REFERENCES "DatosPersonales"("idDatosPersonales") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direccion" ADD CONSTRAINT "Direccion_idDistrito_fkey" FOREIGN KEY ("idDistrito") REFERENCES "Distrito"("idDistrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "CategoriaProducto"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedor"("idProveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("idCliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_idVenta_fkey" FOREIGN KEY ("idVenta") REFERENCES "Venta"("idVenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;
