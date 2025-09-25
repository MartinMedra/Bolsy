/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Credito` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deuda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PagoRecurrente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Widget` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TipoMovimiento" AS ENUM ('INGRESO', 'EGRESO');

-- DropForeignKey
ALTER TABLE "public"."Categoria" DROP CONSTRAINT "Categoria_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Credito" DROP CONSTRAINT "Credito_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Deuda" DROP CONSTRAINT "Deuda_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Meta" DROP CONSTRAINT "Meta_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Movimiento" DROP CONSTRAINT "Movimiento_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Movimiento" DROP CONSTRAINT "Movimiento_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PagoRecurrente" DROP CONSTRAINT "PagoRecurrente_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PagoRecurrente" DROP CONSTRAINT "PagoRecurrente_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Widget" DROP CONSTRAINT "Widget_usuarioId_fkey";

-- DropTable
DROP TABLE "public"."Categoria";

-- DropTable
DROP TABLE "public"."Credito";

-- DropTable
DROP TABLE "public"."Deuda";

-- DropTable
DROP TABLE "public"."Meta";

-- DropTable
DROP TABLE "public"."Movimiento";

-- DropTable
DROP TABLE "public"."PagoRecurrente";

-- DropTable
DROP TABLE "public"."Usuario";

-- DropTable
DROP TABLE "public"."Widget";

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "preferencias" JSONB,
    "layout" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categorias" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movimientos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "tipo" "public"."TipoMovimiento" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."metas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "montoObjetivo" DOUBLE PRECISION NOT NULL,
    "montoActual" DOUBLE PRECISION NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pagos_recurrentes" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "frecuencia" INTEGER NOT NULL,
    "proximaFecha" TIMESTAMP(3) NOT NULL,
    "pagado" BOOLEAN NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "pagos_recurrentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."creditos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "montoRestante" DOUBLE PRECISION NOT NULL,
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "tasa" DOUBLE PRECISION NOT NULL,
    "diaPago" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creditos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."deudas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "montoRestante" DOUBLE PRECISION NOT NULL,
    "fechaLimite" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deudas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."widgets" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "posicion" TEXT NOT NULL,

    CONSTRAINT "widgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- AddForeignKey
ALTER TABLE "public"."categorias" ADD CONSTRAINT "categorias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movimientos" ADD CONSTRAINT "movimientos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movimientos" ADD CONSTRAINT "movimientos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."metas" ADD CONSTRAINT "metas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos_recurrentes" ADD CONSTRAINT "pagos_recurrentes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos_recurrentes" ADD CONSTRAINT "pagos_recurrentes_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."creditos" ADD CONSTRAINT "creditos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deudas" ADD CONSTRAINT "deudas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."widgets" ADD CONSTRAINT "widgets_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
