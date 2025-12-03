/*
  Warnings:

  - You are about to drop the `CategoriaProducto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proveedor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_idCategoria_fkey";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_idProveedor_fkey";

-- DropTable
DROP TABLE "CategoriaProducto";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Producto";

-- DropTable
DROP TABLE "Proveedor";
