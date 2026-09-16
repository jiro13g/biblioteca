<?php
require 'conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$accion = $_GET['accion'] ?? '';

try {
  if ($metodo === 'GET') {
    if ($accion === 'listar') {
      $estado = $_GET['estado'] ?? '';
      if ($estado) {
        $sql = "SELECT p.*, u.nombre as usuario, l.titulo as libro, l.codigo 
                FROM prestamos p
                JOIN usuarios u ON p.usuario_id = u.id
                JOIN libros l ON p.libro_id = l.id
                WHERE p.estado = ?
                ORDER BY p.fecha_prestamo DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$estado]);
      } else {
        $sql = "SELECT p.*, u.nombre as usuario, l.titulo as libro, l.codigo 
                FROM prestamos p
                JOIN usuarios u ON p.usuario_id = u.id
                JOIN libros l ON p.libro_id = l.id
                ORDER BY p.fecha_prestamo DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
      }
      $prestamos = $stmt->fetchAll();
      echo json_encode(['exito' => true, 'datos' => $prestamos]);
    } elseif ($accion === 'ultimos') {
      $sql = "SELECT p.*, u.nombre as usuario, l.titulo as libro
              FROM prestamos p
              JOIN usuarios u ON p.usuario_id = u.id
              JOIN libros l ON p.libro_id = l.id
              ORDER BY p.fecha_prestamo DESC LIMIT 5";
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $prestamos = $stmt->fetchAll();
      echo json_encode(['exito' => true, 'datos' => $prestamos]);
    }
  } elseif ($metodo === 'POST') {
    $errores = validarDatos($data, ['usuario_id', 'libro_id']);
    if (!empty($errores)) {
      http_response_code(400);
      echo json_encode(['exito' => false, 'errores' => $errores]);
      exit;
    }
    
    // Verificar unidades disponibles
    $sql = "SELECT unidades FROM libros WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['libro_id']]);
    $libro = $stmt->fetch();
    
    if (!$libro || $libro['unidades'] <= 0) {
      http_response_code(400);
      echo json_encode(['exito' => false, 'error' => 'No hay unidades disponibles']);
      exit;
    }
    
    // Crear préstamo
    $fecha = date('Y-m-d');
    $sql = "INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, estado) VALUES (?, ?, ?, 'Activo')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['usuario_id'], $data['libro_id'], $fecha]);
    
    // Decrementar unidades
    $sql = "UPDATE libros SET unidades = unidades - 1 WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['libro_id']]);
    
    echo json_encode(['exito' => true, 'id' => $pdo->lastInsertId(), 'mensaje' => 'Préstamo registrado']);
  } elseif ($metodo === 'PUT') {
    if ($accion === 'devolver') {
      $id = $_GET['id'] ?? 0;
      $fecha = date('Y-m-d');
      
      // Obtener información del préstamo
      $sql = "SELECT libro_id FROM prestamos WHERE id = ?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([$id]);
      $prestamo = $stmt->fetch();
      
      if (!$prestamo) {
        http_response_code(404);
        echo json_encode(['exito' => false, 'error' => 'Préstamo no encontrado']);
        exit;
      }
      
      // Actualizar préstamo
      $sql = "UPDATE prestamos SET estado = 'Devuelto', fecha_devolucion = ? WHERE id = ?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([$fecha, $id]);
      
      // Incrementar unidades
      $sql = "UPDATE libros SET unidades = unidades + 1 WHERE id = ?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([$prestamo['libro_id']]);
      
      echo json_encode(['exito' => true, 'mensaje' => 'Devolución registrada']);
    }
  } elseif ($metodo === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $sql = "DELETE FROM prestamos WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    echo json_encode(['exito' => true, 'mensaje' => 'Préstamo eliminado']);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['exito' => false, 'error' => $e->getMessage()]);
}
