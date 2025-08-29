<?php

/**
 * Configuración de manejo de errores para php-mvc-base
 * 
 * Este archivo debe ser incluido al inicio de la aplicación para habilitar
 * el sistema avanzado de manejo de errores.
 */

// Definir si estamos en modo debug (cambiar a false en producción)
define('DEBUG_MODE', true);

// Cargar el manejador de errores
require_once 'libs/errorHandler.php';

// Inicializar el sistema de manejo de errores
ErrorHandler::getInstance();

// Configuración de errores PHP
if (DEBUG_MODE) {
	// En desarrollo: mostrar todos los errores
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
} else {
	// En producción: no mostrar errores al usuario
	ini_set('display_errors', 0);
	ini_set('display_startup_errors', 0);
	error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);
}

// Configuración de logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/php_errors.log');
