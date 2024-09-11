-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para stockdepositos
CREATE DATABASE IF NOT EXISTS `stockdepositos` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci */;
USE `stockdepositos`;

-- Volcando estructura para tabla stockdepositos.activas
CREATE TABLE IF NOT EXISTS `activas` (
  `id` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `CUIT` bigint(20) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `fechaUM` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`,`CUIT`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla stockdepositos.deposito
CREATE TABLE IF NOT EXISTS `deposito` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) NOT NULL,
  `domicilio` varchar(50) NOT NULL,
  `activo` tinyint(4) NOT NULL,
  `fechaUM` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla stockdepositos.destinatario
CREATE TABLE IF NOT EXISTS `destinatario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombreCompleto` varchar(50) NOT NULL,
  `CUIT` bigint(20) NOT NULL,
  `domicilio` varchar(150) NOT NULL,
  `nroTelefono` bigint(20) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `activo` tinyint(4) NOT NULL,
  `fechaUM` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`,`CUIT`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla stockdepositos.entrega
CREATE TABLE IF NOT EXISTS `entrega` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cantidadEntrega` int(11) NOT NULL,
  `fechaHoraEntrega` datetime NOT NULL,
  `observaciones` varchar(50) NOT NULL,
  `id_destinatario` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_deposito` int(11) NOT NULL,
  `id_stock` int(11) NOT NULL,
  `activo` tinyint(4) NOT NULL,
  `fechaUM` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_entrega_usuario` (`id_usuario`),
  KEY `FK_entrega_deposito` (`id_deposito`),
  KEY `FK_entrega_stock` (`id_stock`),
  KEY `FK_entrega_destinatario` (`id_destinatario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla stockdepositos.material
CREATE TABLE IF NOT EXISTS `material` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombreMaterial` varchar(50) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `activo` tinyint(4) NOT NULL,
  `fechaUM` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla stockdepositos.proveedor
CREATE TABLE IF NOT EXISTS `proveedor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombreCompleto` varchar(50) NOT NULL,
  `CUIT` bigint(20) NOT NULL,
  `domicilio` varchar(150) NOT NULL,
  `nroTelefono` bigint(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `activo` tinyint(4) NOT NULL,
  `fechaUM` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`,`CUIT`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla stockdepositos.recepcion
CREATE TABLE IF NOT EXISTS `recepcion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cantidadAlta` int(11) NOT NULL,
  `fechaHoraRecepcion` datetime NOT NULL,
  `observaciones` varchar(50) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_deposito` int(11) NOT NULL,
  `id_stock` int(11) NOT NULL,
  `activo` tinyint(4) NOT NULL,
  `fechaUM` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_recepcion_proveedor` (`id_proveedor`),
  KEY `FK_recepcion_usuario` (`id_usuario`),
  KEY `FK_recepcion_deposito` (`id_deposito`),
  KEY `FK_recepcion_stock` (`id_stock`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla stockdepositos.stock
CREATE TABLE IF NOT EXISTS `stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cantidadActual` int(11) NOT NULL,
  `id_material` int(11) NOT NULL,
  `id_deposito` int(11) NOT NULL,
  `activo` tinyint(4) NOT NULL,
  `fechaUM` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_material_en_deposito_material` (`id_material`),
  KEY `FK_material_en_deposito_deposito` (`id_deposito`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla stockdepositos.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombreCompleto` varchar(50) NOT NULL,
  `CUIT` bigint(20) NOT NULL,
  `nombreUsuario` varchar(50) NOT NULL,
  `contrasena` varchar(50) NOT NULL,
  `administrador` int(11) NOT NULL DEFAULT 0,
  `proveedores` int(11) NOT NULL DEFAULT 0,
  `depositos` int(11) NOT NULL DEFAULT 0,
  `destinatario` int(11) NOT NULL DEFAULT 0,
  `materiales` int(11) NOT NULL DEFAULT 0,
  `entregas` int(11) NOT NULL DEFAULT 0,
  `recepciones` int(11) NOT NULL DEFAULT 0,
  `informes` int(11) NOT NULL DEFAULT 0,
  `usuarios` int(11) NOT NULL DEFAULT 0,
  `id_deposito` int(11) NOT NULL,
  `fechaBaja` datetime DEFAULT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `fechaUM` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_usuario_deposito` (`id_deposito`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
