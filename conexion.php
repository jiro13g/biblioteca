<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de conexión
$host = 'localhost'; // En AlwaysData: tu servidor
$db = 'biblioteca';
$user = 'root'; // Cambiar en producción
$password = ''; // Agregar contraseña en producción
$charset = 'utf8mb4';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Conexión fallida: ' . $e->getMessage()]);
  exit;
}

// Método para validar datos
function validarDatos($datos, $campos) {
  $errores = [];
  foreach ($campos as $campo) {
    if (!isset($datos[$campo]) || empty(trim($datos[$campo]))) {
      $errores[] = "El campo '$campo' es requerido";
    }
  }
  return $errores;
}

// Obtener datos JSON
$data = json_decode(file_get_contents("php://input"), true) ?? [];
