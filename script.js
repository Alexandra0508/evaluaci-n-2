let colaboradores= [];

const formulario = document.getElementById('form-corporativo');
const inputNombre = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputCargo = document.getElementById('cargo');
const inputCorreo = document.getElementById('correo-corporativo');
const buscador = document.getElementById('buscador');

const mensajeError = document.getElementById('form-error');
const tablaBody = document.getElementById('tabla-body-colaboradores');

function campoVacio(valor) {
    return valor.trim() === '';
}
function soloLetras(texto) {
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regexLetras.test(texto.trim());
}

function validarCorreo(correo){
  try {
        if (typeof correo !== "string") {
            return false;
        }
        correo = correo.trim();
        const regex = /^[a-zA-Z0-9._%+-]+@empresa\.cl$/;

        return regex.test(correo);
    } catch (error) {
        console.error("Error al validar el correo:", error);
        return false;
    }
}

function validarFormulario(nombre, apellido, cargo, correo) {
    if (campoVacio(nombre) || campoVacio(apellido) || campoVacio(cargo) || campoVacio(correo)) {
        return "Todos los campos son obligatorios.";
    }
    if (!soloLetras(nombre)) {
        return "El nombre solo puede contener letras.";
    }
    if (!soloLetras(apellido)) {
        return "El apellido solo puede contener letras.";
    }
    if (!validarCorreo(correo)) {
        return "El correo debe tener un formato válido y el dominio @empresa.cl";
    }
    return null;
}


function filtrarColaboradores() {

    const textoBusqueda = buscador.value.toLowerCase().trim();

    const colaboradoresFiltrados = colaboradores.filter(colaborador => {
        const coincideNombre = colaborador.nombre.toLowerCase().includes(textoBusqueda);
        const coincideCargo = colaborador.cargo.toLowerCase().includes(textoBusqueda);
        
        return coincideNombre || coincideCargo;
    });

    renderizarTabla(colaboradoresFiltrados);
}
buscador.addEventListener('input', filtrarColaboradores);

function eliminarColaborador(id) {
    colaboradores = colaboradores.filter(colaborador => colaborador.id !== id);
    filtrarColaboradores(); 
}

function renderizarTabla(listaAMostrar) {
    tablaBody.innerHTML = '';

    listaAMostrar.forEach(colaborador => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${colaborador.nombre}</td>
            <td>${colaborador.apellido}</td>
            <td>${colaborador.cargo}</td>
            <td>${colaborador.correo}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarColaborador(${colaborador.id})">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = inputNombre.value;
    const apellido = inputApellido.value;
    const cargo = inputCargo.value;
    const correo = inputCorreo.value;

    const error = validarFormulario(nombre, apellido, cargo, correo);

    if (error) {
        mensajeError.textContent = error;
        mensajeError.style.color = 'var(--danger-color)';
    } else {
        mensajeError.textContent = '';

        const nuevoColaborador = {
            id: Date.now(), 
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            cargo: cargo.charAt(0).toUpperCase() + cargo.slice(1), 
            correo: correo.trim().toLowerCase()
        };
        colaboradores.push(nuevoColaborador);

        buscador.value = '';
        renderizarTabla(colaboradores);

        formulario.reset();
    }
});
