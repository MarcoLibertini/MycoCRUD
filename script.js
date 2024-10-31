const API_URL = "/api/hongos";
//seleccionamos div del main principal
var contenidoPrincipal = document.querySelector('.contenido-principal');
let formularioVisible = false;


//////////////

// Coloca aquí el código Fetch para obtener y agregar productos
function cargarHongos() {

    //recuperar credenciales para validar el acceso
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            //'x-access-token': token,
            //'user-id': userID
        }
    }

    //seleccionamos div del main principal
    const contenidoPrincipal = document.querySelector('.contenido-principal');
    contenidoPrincipal.innerHTML = '';

    // Actualizar el título h2 creando el elemento 
    //YA QUE DEJO DE ANDAR DE UNA SIMPLE FORMA QUE ERA SOLO CAMBIAR EL TEXT CONTENT
    const h2Principal = document.createElement('h2');
    h2Principal.id = 'h2-principal';
    h2Principal.textContent = 'Hongos';
    contenidoPrincipal.appendChild(h2Principal);

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    fetch(`http://127.0.0.1:5000/api/hongos`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //creacion de tabla
            const table = document.createElement('table');
            table.id = "tabla-hongos";
            table.className = "tabla-hongos";


            //creacion de encabezado (thead)
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            headerRow.innerHTML = `
            <th>Nombre</th>
            <th>Cepa</th>
            <th>Tiempo de fructificación</th>
            <th>Color sombrero</th>
            <th>Color de pie</th>
            <th>Efectos</th>
            <th>Intensidad</th>
        `;

            //agrego los encabezados
            thead.appendChild(headerRow);

            // Crear el cuerpo (tbody)
            const tbody = document.createElement("tbody");
            tbody.id = "lista-hongos";

            //cargamos productos a la tabla
            data.forEach(hongo => {

                const fila = document.createElement('tr')

                //Me quedo con la fila
                fila.id = hongo.id

                //agrego clases a los botones para activar y desactivar la edicion
                fila.innerHTML = `
                
                <td class="edit-field">${hongo.nombre}</td>
                <td class="edit-field">${hongo.cepa}</td>
                <td class="edit-field">${hongo.tiempo_fructificacion}</td>
                <td class="edit-field">${hongo.color_sombrero}</td>
                <td class="edit-field">${hongo.color_pie}</td>
                <td class="edit-field">${hongo.efectos}</td>
                <td class="edit-field">${hongo.intensidad}</td>
    
                <td>
                    <button onclick="editarHongo(${hongo.id})" class="small-button rounded-button edit-button">Editar</button>
                    <button onclick="eliminarHongo(${hongo.id})" class="small-button rounded-button delete-button">Eliminar</button>
                </td>
                `;
                tbody.appendChild(fila);

            });
            // Aagrego el encabezado y el cuerpo a la tabla
            table.appendChild(thead);
            table.appendChild(tbody);

            // agregar la tabla al elemento "contenido-principal"
            contenidoPrincipal.appendChild(table);

            // Agregar el botón "Agregar Hongo" y el formulario debajo de la tabla
            agregarBotonAgregarHongoYFormulario();
        })


    //FUNCION PARA AGREGAR BOTON DE AGREGAR PRODUCTO Y FORMULARIO
    // Boton "Agregar PRODUCTO" 
    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar Hongo';
    addButton.className = 'btn btn-primary float-right';
    addButton.addEventListener('click', () => {
        if (formularioVisible) {

            mostrarFormularioProductos();
        }
    });


}


//FUNCION EDITAR
function editarHongo(id) {
    // Obtén la fila correspondiente a través del ID o de alguna otra forma que identifique la fila
    const fila = document.getElementById(id);

    // Obtwngo los campos editables de la fila
    const camposEditables = fila.querySelectorAll('td');

    // Habilita la edición de los campos de la fila
    camposEditables.forEach(campo => {
        if (campo.classList.contains('edit-field')) {
            campo.contentEditable = 'true';
        }
    });

    // Cambia el texto del botón de "Editar" a "Guardar"
    const botonEditar = fila.querySelector('.edit-button');
    botonEditar.textContent = 'Guardar';

    // Cambia la función del botón a "guardarCambios"
    botonEditar.onclick = function () {
        guardarCambios(id);
    };
}



// Función para guardar los cambios en una fila
function guardarCambios(id) {
    // Obtén la fila correspondiente a través del ID
    const fila = document.getElementById(id);

    // Obtiene los campos editables de la fila
    const camposEditables = fila.querySelectorAll('td.edit-field');
    camposEditables.forEach(campo => {
        campo.contentEditable = 'false';
    });

    // Deshabilita la edición de los botones
    const botones = fila.querySelectorAll('.edit-button, .delete-button');
    botones.forEach(boton => {
        boton.contentEditable = 'false';
    });

    // Cambia el texto del botón de "Guardar" a "Editar"
    const botonEditar = fila.querySelector('.edit-button');
    botonEditar.textContent = 'Editar';

    // Cambia la función del botón a "editar"
    botonEditar.onclick = function () {
        editar(id);
    };


    // Crea un objeto con los datos actualizados
    const datosActualizados = {
        nombre: camposEditables[0].textContent.trim(), // Nombre del hongo
        cepa: camposEditables[1].textContent.trim(), // Cepa del hongo
        tiempoFructificacion: camposEditables[2].textContent.trim(), // Tiempo de fructificación
        colorSombrero: camposEditables[3].textContent.trim(), // Color del sombrero
        colorPie: camposEditables[4].textContent.trim(), // Color del pie
        efectos: camposEditables[5].textContent.trim(), // Efectos del hongo
        intensidad: camposEditables[6].textContent.trim() // Intensidad de los efectos
    };

    // Realizar una solicitud PUT para enviar los datos actualizados al servidor
    fetch(`http://127.0.0.1:5000/api/hongos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
    })
        .then(response => {
            if (response.ok) {
                // solicitud con éxito
                alert('Cambios guardados exitosamente');
            } else {
                alert('La solicitud falló');
                // solicitud falló
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}

// Función para eliminar un hongo existente
function eliminarHongo(id) {
    const fila = document.getElementById(id);
    const nombreHongo = fila.querySelector('.edit-field').textContent;

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el hongo "${nombreHongo}"?`);

    if (confirmacion) {
        // Realizar una solicitud DELETE para eliminar el hongo
        fetch(`http://127.0.0.1:5000/api/hongos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    // La solicitud se completó con éxito
                    alert('Hongo eliminado exitosamente');
                    // Eliminar la fila de la tabla
                    fila.remove();
                } else {
                    alert('La solicitud falló');
                    // La solicitud falló, maneja el error según tus necesidades
                }
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });
    }
}





//////////////


//FUNCION PARA AGREGAR EL BOTON DE AGREGAR HONGO Y EL FORMULARIO
function agregarBotonAgregarHongoYFormulario() {
    // Boton "Agregar Hongo" 
    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar Hongo';
    addButton.className = 'btn btn-primary float-right';
    addButton.addEventListener('click', () => {
        mostrarFormularioAgregarHongo();
    });

    // Crea un div para los botones
    const divBotones = document.createElement("div");
    divBotones.classList.add("contenedor-botones");

    // Agrego el botón al "contenido-principal"
    divBotones.appendChild(addButton);
    contenidoPrincipal.appendChild(divBotones);

}

// Función para mostrar el formulario de agregar hongo
function mostrarFormularioAgregarHongo() {
    // Verifica si el formulario ya está visible
    if (!formularioVisible) {
        // Crea el formulario de agregar hongo
        const formularioAgregarHongo = document.createElement('form');
        formularioAgregarHongo.id = 'formularioAgregarHongo';
        formularioAgregarHongo.className = 'table-width';
        formularioAgregarHongo.innerHTML = `
            <label for="nombre">Nombre</label>
            <input type="text" class="form-control" id="nombre" placeholder="Nombre" required>
            <label for="cepa">Cepa</label>
            <input type="text" class="form-control" id="cepa" placeholder="Cepa" required>
            <label for="tiempoFructificacion">Tiempo de fructificación</label>
            <input type="text" class="form-control" id="tiempoFructificacion" placeholder="Tiempo de fructificación" required>
            <label for="colorSombrero">Color sombrero</label>
            <input type="text" class="form-control" id="colorSombrero" placeholder="Color sombrero" required>
            <label for="colorPie">Color de pie</label>
            <input type="text" class="form-control" id="colorPie" placeholder="Color de pie" required>
            <label for="efectos">Efectos</label>
            <input type="text" class="form-control" id="efectos" placeholder="Efectos" required>
            <label for="intensidad">Intensidad</label>
            <input type="text" class="form-control" id="intensidad" placeholder="Intensidad" required>
            <button type="submit" class="btn btn-primary">Agregar</button>
            <button type="button" class="btn btn-primary" onclick="cancelarHongo()">Cancelar</button>
        `;

        // Agrega el formulario al contenedor principal
        contenidoPrincipal.appendChild(formularioAgregarHongo);

        // Cambia el estado de formularioVisible a true
        formularioVisible = true;

        // Agrega un evento al formulario para enviar los datos al servidor
        formularioAgregarHongo.addEventListener('submit', (event) => {
            event.preventDefault();
            const nombre = document.querySelector('#nombre').value;
            const cepa = document.querySelector('#cepa').value;
            const tiempoFructificacion = document.querySelector('#tiempoFructificacion').value;
            const colorSombrero = document.querySelector('#colorSombrero').value;
            const colorPie = document.querySelector('#colorPie').value;
            const efectos = document.querySelector('#efectos').value;
            const intensidad = document.querySelector('#intensidad').value;
            const hongo = {
                nombre: nombre,
                cepa: cepa,
                tiempo_fructificacion: tiempoFructificacion,
                color_sombrero: colorSombrero,
                color_pie: colorPie,
                efectos: efectos,
                intensidad: intensidad,
            };
            fetch('http://127.0.0.1:5000/api/hongos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hongo)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    formularioAgregarHongo.style.display = 'none';
                    // Elimina el formulario del contenedor principal
                    contenidoPrincipal.removeChild(formularioAgregarHongo);
                    // Cambia el estado de formularioVisible a false
                    formularioVisible = false;
                    // Actualiza la lista de hongos
                    cargarHongos();
                })
                .catch(error => {
                    console.error('Error al agregar hongo:', error);
                });
        });
    }
}

// Función para cancelar la operación de agregar hongo
function cancelarHongo() {
    const formularioAgregarHongo = document.getElementById('formularioAgregarHongo');
    formularioAgregarHongo.style.display = 'none';
    contenidoPrincipal.removeChild(formularioAgregarHongo);
    // Cambia el estado de formularioVisible a false
    formularioVisible = false;
}
// Llamar a la función cargarHongos() para mostrar los hongos al cargar la página
cargarHongos();