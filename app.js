const API = './php';
let formularioActual = '';
let datosActuales = {};

// Navegar entre secciones
function irA(seccion) {
  document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
  document.getElementById(seccion).classList.add('activa');
  
  if (seccion === 'inicio') cargarDashboard();
  else if (seccion === 'usuarios') cargarUsuarios();
  else if (seccion === 'libros') cargarLibros();
  else if (seccion === 'prestamos') cargarPrestamos();
  else if (seccion === 'reportes') cargarReportes();
}

// DASHBOARD
async function cargarDashboard() {
  try {
    const [usuarios, libros, prestamos] = await Promise.all([
      fetch(`${API}/usuarios.php?accion=listar`).then(r => r.json()),
      fetch(`${API}/libros.php?accion=listar`).then(r => r.json()),
      fetch(`${API}/prestamos.php?accion=listar`).then(r => r.json())
    ]);
    
    document.getElementById('total-usuarios').textContent = usuarios.datos?.length || 0;
    document.getElementById('total-libros').textContent = libros.datos?.filter(l => l.unidades > 0).length || 0;
    document.getElementById('total-prestamos').textContent = prestamos.datos?.filter(p => p.estado === 'Activo').length || 0;
    
    await cargarLibrosDestacados();
    await cargarUltimosPrestamos();
  } catch (e) {
    console.error('Error cargando dashboard:', e);
  }
}

async function cargarLibrosDestacados() {
  try {
    const res = await fetch(`${API}/libros.php?accion=destacados`);
    const data = await res.json();
    
    const contenedor = document.getElementById('libros-destacados');
    contenedor.innerHTML = data.datos?.map(libro => `
      <div class="libro-card" onclick="mostrarDetallesLibro(${libro.id})">
        <div class="libro-portada">${libro.titulo.charAt(0)}</div>
        <div class="libro-info">
          <h3>${libro.titulo}</h3>
          <p>${libro.autor}</p>
          <p>📖 ${libro.codigo}</p>
          <div class="libro-unidades">Unidades: ${libro.unidades}</div>
        </div>
      </div>
    `).join('') || '<p>No hay libros disponibles</p>';
  } catch (e) {
    console.error('Error cargando libros destacados:', e);
  }
}

async function cargarUltimosPrestamos() {
  try {
    const res = await fetch(`${API}/prestamos.php?accion=ultimos`);
    const data = await res.json();
    
    const tbody = document.querySelector('#tabla-ultimos-prestamos tbody');
    tbody.innerHTML = data.datos?.map(p => `
      <tr>
        <td>${p.fecha_prestamo}</td>
        <td>${p.usuario}</td>
        <td>${p.libro}</td>
        <td><span class="estado-${p.estado.toLowerCase()}">${p.estado}</span></td>
      </tr>
    `).join('') || '<tr><td colspan="4">No hay préstamos</td></tr>';
  } catch (e) {
    console.error('Error cargando últimos préstamos:', e);
  }
}

// USUARIOS
async function cargarUsuarios(buscar = '') {
  try {
    const url = buscar ? `${API}/usuarios.php?accion=listar&buscar=${buscar}` : `${API}/usuarios.php?accion=listar`;
    const res = await fetch(url);
    const data = await res.json();
    
    const tbody = document.querySelector('#tabla-usuarios tbody');
    tbody.innerHTML = data.datos?.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.cedula}</td>
        <td>${u.telefono}</td>
        <td>
          <button onclick="editarUsuario(${u.id})" class="btn-secundario">Editar</button>
          <button onclick="eliminarUsuario(${u.id})" class="btn-secundario">Eliminar</button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="5">No hay usuarios</td></tr>';
  } catch (e) {
    console.error('Error cargando usuarios:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buscarUsuarios = document.getElementById('buscar-usuarios');
  if (buscarUsuarios) {
    buscarUsuarios.addEventListener('input', (e) => cargarUsuarios(e.target.value));
  }
});

function abrirFormularioUsuario() {
  formularioActual = 'usuario';
  datosActuales = {};
  document.getElementById('modal-titulo').textContent = 'Nuevo Usuario';
  document.getElementById('campos-formulario').innerHTML = `
    <input type="text" name="nombre" placeholder="Nombre completo" required>
    <input type="text" name="cedula" placeholder="Cédula" required>
    <input type="tel" name="telefono" placeholder="Teléfono">
  `;
  document.getElementById('modal').style.display = 'flex';
}

async function editarUsuario(id) {
  try {
    const res = await fetch(`${API}/usuarios.php?accion=obtener&id=${id}`);
    const data = await res.json();
    
    formularioActual = 'usuario';
    datosActuales = data.datos;
    document.getElementById('modal-titulo').textContent = 'Editar Usuario';
    document.getElementById('campos-formulario').innerHTML = `
      <input type="hidden" name="id" value="${data.datos.id}">
      <input type="text" name="nombre" placeholder="Nombre completo" value="${data.datos.nombre}" required>
      <input type="text" name="cedula" placeholder="Cédula" value="${data.datos.cedula}" disabled>
      <input type="tel" name="telefono" placeholder="Teléfono" value="${data.datos.telefono}">
    `;
    document.getElementById('modal').style.display = 'flex';
  } catch (e) {
    alert('Error al cargar usuario');
  }
}

async function eliminarUsuario(id) {
  if (confirm('¿Está seguro de eliminar este usuario?')) {
    try {
      const res = await fetch(`${API}/usuarios.php?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      alert(data.mensaje);
      cargarUsuarios();
    } catch (e) {
      alert('Error al eliminar usuario');
    }
  }
}

// LIBROS
async function cargarLibros(buscar = '') {
  try {
    const url = buscar ? `${API}/libros.php?accion=listar&buscar=${buscar}` : `${API}/libros.php?accion=listar`;
    const res = await fetch(url);
    const data = await res.json();
    
    const contenedor = document.getElementById('libros-lista');
    contenedor.innerHTML = data.datos?.map(libro => `
      <div class="libro-card" onclick="mostrarDetallesLibro(${libro.id})">
        <div class="libro-portada">${libro.titulo.charAt(0)}</div>
        <div class="libro-info">
          <h3>${libro.titulo}</h3>
          <p><strong>Autor:</strong> ${libro.autor}</p>
          <p><strong>Código:</strong> ${libro.codigo}</p>
          <div class="libro-unidades">Unidades: ${libro.unidades}</div>
          <button onclick="editarLibro(${libro.id}, event)" class="btn-secundario" style="margin-top: 0.5rem; width: 100%; display: block;">Editar</button>
        </div>
      </div>
    `).join('') || '<p>No hay libros</p>';
  } catch (e) {
    console.error('Error cargando libros:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buscarLibros = document.getElementById('buscar-libros');
  if (buscarLibros) {
    buscarLibros.addEventListener('input', (e) => cargarLibros(e.target.value));
  }
});

function abrirFormularioLibro() {
  formularioActual = 'libro';
  datosActuales = {};
  document.getElementById('modal-titulo').textContent = 'Nuevo Libro';
  document.getElementById('campos-formulario').innerHTML = `
    <input type="text" name="codigo" placeholder="Código del libro" required>
    <input type="text" name="titulo" placeholder="Título" required>
    <input type="text" name="autor" placeholder="Autor" required>
    <input type="number" name="unidades" placeholder="Unidades" min="1" required>
    <input type="text" name="genero" placeholder="Género">
    <textarea name="descripcion" placeholder="Descripción"></textarea>
  `;
  document.getElementById('modal').style.display = 'flex';
}

async function editarLibro(id, event) {
  event.stopPropagation();
  try {
    const res = await fetch(`${API}/libros.php?accion=obtener&id=${id}`);
    const data = await res.json();
    
    formularioActual = 'libro';
    datosActuales = data.datos;
    document.getElementById('modal-titulo').textContent = 'Editar Libro';
    document.getElementById('campos-formulario').innerHTML = `
      <input type="hidden" name="id" value="${data.datos.id}">
      <input type="text" name="codigo" placeholder="Código" value="${data.datos.codigo}" disabled>
      <input type="text" name="titulo" placeholder="Título" value="${data.datos.titulo}" required>
      <input type="text" name="autor" placeholder="Autor" value="${data.datos.autor}" required>
      <input type="number" name="unidades" placeholder="Unidades" value="${data.datos.unidades}" required>
      <input type="text" name="genero" placeholder="Género" value="${data.datos.genero || ''}">
      <textarea name="descripcion" placeholder="Descripción">${data.datos.descripcion || ''}</textarea>
    `;
    document.getElementById('modal').style.display = 'flex';
  } catch (e) {
    alert('Error al cargar libro');
  }
}

async function mostrarDetallesLibro(id) {
  try {
    const res = await fetch(`${API}/libros.php?accion=obtener&id=${id}`);
    const data = await res.json();
    const libro = data.datos;
    
    document.getElementById('detalles-libro').innerHTML = `
      <h2>${libro.titulo}</h2>
      <div style="background: linear-gradient(135deg, #8b6f47 0%, #5c4033 100%); color: #fffbf0; padding: 2rem; border-radius: 8px; text-align: center; margin: 1.5rem 0; font-size: 3rem; font-weight: 700;">
        ${libro.titulo.charAt(0)}
      </div>
      <p><strong>Autor:</strong> ${libro.autor}</p>
      <p><strong>Código:</strong> ${libro.codigo}</p>
      <p><strong>Género:</strong> ${libro.genero || 'N/A'}</p>
      <p><strong>Unidades disponibles:</strong> ${libro.unidades}</p>
      <p><strong>Descripción:</strong></p>
      <p>${libro.descripcion || 'Sin descripción'}</p>
      <button onclick="cerrarModalLibro()" class="btn-primario" style="width: 100%; margin-top: 1rem;">Cerrar</button>
    `;
    document.getElementById('modal-libro').style.display = 'flex';
  } catch (e) {
    alert('Error al cargar detalles del libro');
  }
}

function cerrarModalLibro() {
  document.getElementById('modal-libro').style.display = 'none';
}

// PRÉSTAMOS
async function cargarPrestamos() {
  try {
    const estado = document.getElementById('filtro-estado')?.value || '';
    const url = estado ? `${API}/prestamos.php?accion=listar&estado=${estado}` : `${API}/prestamos.php?accion=listar`;
    const res = await fetch(url);
    const data = await res.json();
    
    const tbody = document.querySelector('#tabla-prestamos tbody');
    tbody.innerHTML = data.datos?.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.usuario}</td>
        <td>${p.libro}</td>
        <td>${p.fecha_prestamo}</td>
        <td>${p.fecha_devolucion || '-'}</td>
        <td><span class="estado-${p.estado.toLowerCase()}">${p.estado}</span></td>
        <td>
          ${p.estado === 'Activo' ? `<button onclick="registrarDevolucion(${p.id})" class="btn-secundario">Devolver</button>` : ''}
          <button onclick="eliminarPrestamo(${p.id})" class="btn-secundario">Eliminar</button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="7">No hay préstamos</td></tr>';
  } catch (e) {
    console.error('Error cargando préstamos:', e);
  }
}

function abrirFormularioPrestamo() {
  formularioActual = 'prestamo';
  datosActuales = {};
  document.getElementById('modal-titulo').textContent = 'Nuevo Préstamo';
  document.getElementById('campos-formulario').innerHTML = `
    <select name="usuario_id" required>
      <option value="">Seleccionar usuario</option>
    </select>
    <select name="libro_id" required>
      <option value="">Seleccionar libro</option>
    </select>
  `;
  document.getElementById('modal').style.display = 'flex';
  cargarSelectUsuarios();
  cargarSelectLibros();
}

async function cargarSelectUsuarios() {
  const res = await fetch(`${API}/usuarios.php?accion=listar`);
  const data = await res.json();
  const select = document.querySelector('select[name="usuario_id"]');
  select.innerHTML = '<option value="">Seleccionar usuario</option>' + 
    data.datos?.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('');
}

async function cargarSelectLibros() {
  const res = await fetch(`${API}/libros.php?accion=listar`);
  const data = await res.json();
  const select = document.querySelector('select[name="libro_id"]');
  select.innerHTML = '<option value="">Seleccionar libro</option>' + 
    data.datos?.map(l => `<option value="${l.id}">${l.titulo} (${l.unidades} disponibles)</option>`).join('');
}

async function registrarDevolucion(id) {
  if (confirm('¿Registrar devolución de este libro?')) {
    try {
      const res = await fetch(`${API}/prestamos.php?accion=devolver&id=${id}`, { method: 'PUT' });
      const data = await res.json();
      alert(data.mensaje);
      cargarPrestamos();
    } catch (e) {
      alert('Error al registrar devolución');
    }
  }
}

async function eliminarPrestamo(id) {
  if (confirm('¿Está seguro de eliminar este préstamo?')) {
    try {
      const res = await fetch(`${API}/prestamos.php?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      alert(data.mensaje);
      cargarPrestamos();
    } catch (e) {
      alert('Error al eliminar préstamo');
    }
  }
}

// REPORTES
async function cargarReportes() {
  try {
    const [libros, usuarios, prestamos] = await Promise.all([
      fetch(`${API}/libros.php?accion=listar`).then(r => r.json()),
      fetch(`${API}/usuarios.php?accion=listar`).then(r => r.json()),
      fetch(`${API}/prestamos.php?accion=listar`).then(r => r.json())
    ]);
    
    // Libro más prestado
    const conteoLibros = {};
    prestamos.datos?.forEach(p => {
      conteoLibros[p.libro] = (conteoLibros[p.libro] || 0) + 1;
    });
    const libroMasPrestado = Object.keys(conteoLibros).sort((a, b) => conteoLibros[b] - conteoLibros[a])[0];
    document.getElementById('libro-mas-prestado').textContent = libroMasPrestado || 'N/A';
    
    // Usuario con más préstamos
    const conteoUsuarios = {};
    prestamos.datos?.forEach(p => {
      conteoUsuarios[p.usuario] = (conteoUsuarios[p.usuario] || 0) + 1;
    });
    const usuarioMasPrestamos = Object.keys(conteoUsuarios).sort((a, b) => conteoUsuarios[b] - conteoUsuarios[a])[0];
    document.getElementById('usuario-mas-prestamos').textContent = usuarioMasPrestamos || 'N/A';
    
    // Total transacciones
    document.getElementById('total-transacciones').textContent = prestamos.datos?.length || 0;
  } catch (e) {
    console.error('Error cargando reportes:', e);
  }
}

// FORMULARIOS
async function guardarDatos(event) {
  event.preventDefault();
  
  const form = document.getElementById('formulario');
  const formData = new FormData(form);
  const datos = Object.fromEntries(formData);
  
  try {
    let url = '', metodo = '';
    
    if (formularioActual === 'usuario') {
      url = datos.id ? `${API}/usuarios.php` : `${API}/usuarios.php`;
      metodo = datos.id ? 'PUT' : 'POST';
    } else if (formularioActual === 'libro') {
      url = datos.id ? `${API}/libros.php` : `${API}/libros.php`;
      metodo = datos.id ? 'PUT' : 'POST';
    } else if (formularioActual === 'prestamo') {
      url = `${API}/prestamos.php`;
      metodo = 'POST';
    }
    
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    
    const data = await res.json();
    
    if (data.exito) {
      alert(data.mensaje);
      cerrarModal();
      if (formularioActual === 'usuario') cargarUsuarios();
      else if (formularioActual === 'libro') cargarLibros();
      else if (formularioActual === 'prestamo') cargarPrestamos();
    } else {
      alert('Error: ' + (data.error || data.errores?.join(', ')));
    }
  } catch (e) {
    alert('Error al guardar datos');
  }
}

function cerrarModal() {
  document.getElementById('modal').style.display = 'none';
}

// Cargar dashboard al iniciar
document.addEventListener('DOMContentLoaded', () => {
  cargarDashboard();
});
