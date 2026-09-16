<?php
require 'conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$accion = $_GET['accion'] ?? '';

try {
  if ($metodo === 'GET') {
    if ($accion === 'listar') {
      $buscar = $_GET['buscar'] ?? '';
      if ($buscar) {
        $sql = "SELECT * FROM usuarios WHERE nombre LIKE ? OR cedula LIKE ? ORDER BY fecha_registro DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["%$buscar%", "%$buscar%"]);
      } else {
        $sql = "SELECT * FROM usuarios ORDER BY fecha_registro DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
      }
      $usuarios = $stmt->fetchAll();
      echo json_encode(['exito' => true, 'datos' => $usuarios]);
    } elseif ($accion === 'obtener') {
      $id = $_GET['id'] ?? 0;
      $sql = "SELECT * FROM usuarios WHERE id = ?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([$id]);
      $usuario = $stmt->fetch();
      echo json_encode(['exito' => true, 'datos' => $usuario]);
    }
  } elseif ($metodo === 'POST') {
    $errores = validarDatos($data, ['nombre', 'cedula', 'telefono']);
    if (!empty($errores)) {
      http_response_code(400);
      echo json_encode(['exito' => false, 'errores' => $errores]);
      exit;
    }
    $sql = "INSERT INTO usuarios (nombre, cedula, telefono) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['nombre'], $data['cedula'], $data['telefono']]);
    echo json_encode(['exito' => true, 'id' => $pdo->lastInsertId(), 'mensaje' => 'Usuario registrado']);
  } elseif ($metodo === 'PUT') {
    $errores = validarDatos($data, ['id', 'nombre', 'telefono']);
    if (!empty($errores)) {
      http_response_code(400);
      echo json_encode(['exito' => false, 'errores' => $errores]);
      exit;
    }
    $sql = "UPDATE usuarios SET nombre = ?, telefono = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['nombre'], $data['telefono'], $data['id']]);
    echo json_encode(['exito' => true, 'mensaje' => 'Usuario actualizado']);
  } elseif ($metodo === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $sql = "DELETE FROM usuarios WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    echo json_encode(['exito' => true, 'mensaje' => 'Usuario eliminado']);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['exito' => false, 'error' => $e->getMessage()]);
}
