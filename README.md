# 📚 Biblioteca Digital

Sistema web de gestión de biblioteca desarrollado con HTML5, CSS3, JavaScript, PHP y MySQL. Diseño inspirado en bibliotecas tradicionales de madera con colores cálidos y elegantes.

## 🎯 Características

- ✅ Gestión completa de usuarios (CRUD)
- ✅ Catálogo de libros con búsqueda
- ✅ Control de préstamos y devoluciones
- ✅ Control automático de unidades disponibles
- ✅ Dashboard con estadísticas
- ✅ Reportes de actividad
- ✅ Interfaz responsive (desktop, tablet, móvil)
- ✅ Diseño visual atractivo con colores de madera

## 📁 Estructura del Proyecto

```
biblioteca/
├── index.html                 # Página principal
├── README.md                  # Este archivo
├── database.sql               # Script de base de datos
├── css/
│   └── estilos.css           # Estilos CSS
├── js/
│   └── app.js                # Lógica JavaScript
└── php/
    ├── conexion.php          # Configuración de BD
    ├── usuarios.php          # API de usuarios
    ├── libros.php            # API de libros
    └── prestamos.php         # API de préstamos
```

## 🛠️ Instalación Local

### Requisitos
- Servidor local (XAMPP, WAMP, MAMP)
- PHP 7.4+
- MySQL 5.7+
- Git (opcional)

### Pasos

1. **Descargar/Clonar el proyecto:**
   ```bash
   # Con Git
   git clone https://github.com/tuusuario/biblioteca-digital.git
   cd biblioteca-digital
   
   # O descargar ZIP y extraer
   ```

2. **Copiar archivos al servidor local:**
   - Windows (XAMPP): `C:\xampp\htdocs\biblioteca`
   - macOS (MAMP): `/Applications/MAMP/htdocs/biblioteca`
   - Linux: `/var/www/html/biblioteca`

3. **Crear la base de datos:**
   - Abrir phpMyAdmin: `http://localhost/phpmyadmin`
   - Crear nueva base de datos llamada `biblioteca`
   - Importar archivo `database.sql`:
     - Seleccionar BD `biblioteca`
     - Ir a "Importar"
     - Seleccionar archivo `database.sql`
     - Hacer clic en "Abrir"

4. **Configurar conexión:**
   - Abrir `php/conexion.php`
   - Verificar datos de conexión (usuario: root, contraseña vacía en local)
   - Si es necesario, actualizar credenciales

5. **Acceder a la aplicación:**
   - Abrir navegador: `http://localhost/biblioteca`

## 🚀 Despliegue en AlwaysData

### Paso 1: Preparar el proyecto

1. Crear archivo `.gitignore`:
   ```
   php/conexion.php
   .env
   node_modules/
   ```

2. Actualizar credenciales en `php/conexion.php`:
   ```php
   $host = 'tu-servidor-alwaysdata.com';
   $user = 'tu_usuario';
   $password = 'tu_contraseña';
   $db = 'tu_usuario_biblioteca';
   ```

### Paso 2: Subir a GitHub

```bash
git init
git add .
git commit -m "Inicial: Biblioteca Digital"
git branch -M main
git remote add origin https://github.com/tuusuario/biblioteca-digital.git
git push -u origin main
```

### Paso 3: Desplegar en AlwaysData

1. **Acceder a panel AlwaysData**
   - Ingresar a https://www.alwaysdata.com/
   - Ir a "Web > Sitios web"

2. **Crear nuevo sitio**
   - Click en "Agregar sitio web"
   - Nombre: `biblioteca`
   - Tipo: PHP
   - Directorio raíz: `/biblioteca`

3. **Conectar repositorio Git**
   - En panel, ir a "Repositorios Git"
   - Agregar repositorio GitHub
   - Seleccionar rama `main`
   - Activar despliegue automático

4. **Crear base de datos**
   - Ir a "Bases de datos > MySQL"
   - Crear nueva BD: `tu_usuario_biblioteca`
   - Anotar credenciales

5. **Subir base de datos**
   - Ir a phpMyAdmin (en panel AlwaysData)
   - Importar archivo `database.sql`
   - Verificar que las tablas se crearon correctamente

6. **Configurar variables de entorno**
   - Crear archivo `.env` en raíz con credenciales
   - O actualizar `php/conexion.php` directamente

### Paso 4: Verificar despliegue

- Acceder a: `https://tudominio.alwaysdata.com/biblioteca`
- Probar crear usuario, libro y préstamo
- Verificar que los datos se guardan correctamente

## 📊 Funcionalidades Principales

### Gestión de Usuarios
- Registrar nuevos usuarios
- Editar información (nombre, teléfono)
- Buscar usuarios por nombre o cédula
- Eliminar usuarios
- Ver historial de préstamos

### Gestión de Libros
- Agregar nuevos libros al catálogo
- Editar información de libros
- Buscar libros por título, autor o código
- Visualizar unidades disponibles
- Eliminar libros del sistema

### Gestión de Préstamos
- Registrar nuevos préstamos
- Controlar automáticamente unidades
- Registrar devoluciones
- Filtrar por estado (Activo/Devuelto)
- Ver historial completo

### Dashboard
- Estadísticas en tiempo real
- Libros destacados
- Últimos préstamos registrados
- Navegación intuitiva

### Reportes
- Libro más prestado
- Usuario con más préstamos
- Total de transacciones

## 🎨 Colores y Diseño

El sistema utiliza una paleta de colores inspirada en bibliotecas tradicionales:

- **Madera oscura**: #3d2817
- **Madera claro**: #8b6f47
- **Beige**: #f5f1e8
- **Crema**: #fffbf0
- **Dorado**: #d4af37
- **Café oscuro**: #5c4033

## 📱 Responsividad

La aplicación se adapta correctamente a:
- ✅ Escritorio (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Móvil (< 768px)

## 🔐 Seguridad

- ✅ Consultas preparadas (PDO) contra inyecciones SQL
- ✅ Validación de datos en servidor
- ✅ Credenciales separadas del repositorio
- ✅ Headers CORS configurados

## 📝 API REST

Todos los módulos utilizan endpoints REST:

### Usuarios
- `GET /php/usuarios.php?accion=listar` - Listar usuarios
- `POST /php/usuarios.php` - Crear usuario
- `PUT /php/usuarios.php` - Actualizar usuario
- `DELETE /php/usuarios.php?id=1` - Eliminar usuario

### Libros
- `GET /php/libros.php?accion=listar` - Listar libros
- `GET /php/libros.php?accion=destacados` - Libros destacados
- `POST /php/libros.php` - Crear libro
- `PUT /php/libros.php` - Actualizar libro
- `DELETE /php/libros.php?id=1` - Eliminar libro

### Préstamos
- `GET /php/prestamos.php?accion=listar` - Listar préstamos
- `GET /php/prestamos.php?accion=ultimos` - Últimos préstamos
- `POST /php/prestamos.php` - Crear préstamo
- `PUT /php/prestamos.php?accion=devolver&id=1` - Registrar devolución
- `DELETE /php/prestamos.php?id=1` - Eliminar préstamo

## 🐛 Solución de Problemas

**Problema**: Error de conexión a BD
- **Solución**: Verificar credenciales en `php/conexion.php`

**Problema**: Tabla vacía
- **Solución**: Importar `database.sql` nuevamente en phpMyAdmin

**Problema**: Estilos CSS no cargan
- **Solución**: Verificar que la ruta en `index.html` sea correcta (`<link rel="stylesheet" href="css/estilos.css">`)

**Problema**: JavaScript no funciona
- **Solución**: Verificar que `js/app.js` esté en la ruta correcta

## 👨‍💻 Autor

Desarrollado como proyecto de prácticas en sistemas web.

## 📄 Licencia

Libre para uso educativo y comercial.

---

**Última actualización**: Septiembre 2025
**Versión**: 1.0.0
