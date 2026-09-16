<?php
require 'conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$accion = $_GET['accion'] ?? '';

try {
  if ($metodo === 'GET') {
    if ($accion === 'listar') {
      $buscar = $_GET['buscar'] ?? '';
      if ($buscar) {
        $sql = "SELECT * FROM libros WHERE titulo LIKE ? OR autor LIKE ? OR codigo LIKE ? ORDER BY fecha_agregado DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["%$buscar%", "%$buscar%", "%$buscar%"]);
      } else {
        $sql = "SELECT * FROM libros ORDER BY fecha_agregado DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
      }
      $libros = $stmt->fetchAll();
      echo json_encode(['exito' => true, 'datos' => $libros]);
    } elseif ($accion === 'destacados') {
      $sql = "SELECT * FROM libros WHERE unidades > 0 LIMIT 4";
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $libros = $stmt->fetchAll();
      echo json_encode(['exito' => true, 'datos' => $libros]);
    } elseif ($accion === 'obtener') {
      $id = $_GET['id'] ?? 0;
      $sql = "SELECT * FROM libros WHERE id = ?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([$id]);
      $libro = $stmt->fetch();
      echo json_encode(['exito' => true, 'datos' => $libro]);
    }
  } elseif ($metodo === 'POST') {
    $errores = validarDatos($data, ['codigo', 'titulo', 'autor', 'unidades']);
    if (!empty($errores)) {
      http_response_code(400);
      echo json_encode(['exito' => false, 'errores' => $errores]);
      exit;
    }
    $sql = "INSERT INTO libros (codigo, titulo, autor, unidades, descripcion, genero) 
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      $data['codigo'],
      $data['titulo'],
      $data['autor'],
      $data['unidades'],
      $data['descripcion'] ?? '',
      $data['genero'] ?? ''
    ]);
    echo json_encode(['exito' => true, 'id' => $pdo->lastInsertId(), 'mensaje' => 'Libro registrado']);
  } elseif ($metodo === 'PUT') {
    $errores = validarDatos($data, ['id', 'titulo', 'autor', 'unidades']);
    if (!empty($errores)) {
      http_response_code(400);
      echo json_encode(['exito' => false, 'errores' => $errores]);
      exit;
    }
    $sql = "UPDATE libros SET titulo = ?, autor = ?, unidades = ?, descripcion = ?, genero = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      $data['titulo'],
      $data['autor'],
      $data['unidades'],
      $data['descripcion'] ?? '',
      $data['genero'] ?? '',
      $data['id']
    ]);
    echo json_encode(['exito' => true, 'mensaje' => 'Libro actualizado']);
  } elseif ($metodo === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $sql = "DELETE FROM libros WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    echo json_encode(['exito' => true, 'mensaje' => 'Libro eliminado']);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['exito' => false, 'error' => $e->getMessage()]);
}
