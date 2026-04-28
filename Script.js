/*
=================================================================
  SCRIPT.JS — MenosQueCoches
=================================================================

  ÍNDICE — qué hace cada parte:

  1. MENÚ HAMBURGUESA    → abre/cierra el menú en móvil
  2. NAVBAR SCROLL       → la navbar se vuelve más oscura al bajar
  3. MODO ACCESIBILIDAD  → cambia los colores de la página
  4. FILTROS DEL CATÁLOGO → muestra/oculta tarjetas por categoría
  5. MODAL               → abre una ventana con los detalles del coche
  6. FORMULARIO          → valida los campos y envía el mensaje
  7. COMPARADOR          → compara hasta 3 coches lado a lado
  8. BOTÓN VOLVER ARRIBA → aparece cuando el usuario baja la página

  CÓMO LEER ESTE ARCHIVO:
  · document.getElementById("id")   → busca un elemento por su id del HTML
  · document.querySelector(".clase") → busca un elemento por su clase
  · elemento.classList.add("x")     → añade la clase CSS "x" al elemento
  · elemento.classList.remove("x")  → quita la clase CSS "x"
  · elemento.classList.toggle("x")  → la añade si no está, la quita si está
  · elemento.textContent = "texto"  → cambia el texto visible del elemento
  · elemento.innerHTML   = "html"   → cambia el contenido HTML del elemento
  · elemento.style.display = "none" → oculta el elemento
=================================================================
*/


/* =================================================================
   1. MENÚ HAMBURGUESA
   Cuando el usuario pulsa el botón ☰, el menú aparece o desaparece.
   Funciona añadiendo y quitando la clase CSS "visible" al menú.
   ================================================================= */

// Buscamos en el HTML el botón con id="btn-menu" y el ul con id="menu"
var botonMenu = document.getElementById("btn-menu");
var menu      = document.getElementById("menu");

function sincronizarEstadoMenu() {
    var menuAbierto = menu.classList.contains("visible");

    botonMenu.classList.toggle("abierto", menuAbierto);
    botonMenu.setAttribute("aria-expanded", menuAbierto ? "true" : "false");
    botonMenu.setAttribute("aria-label", menuAbierto ? "Cerrar menú" : "Abrir menú");

    document.body.classList.toggle("menu-abierto", menuAbierto);
}

function cerrarMenu() {
    menu.classList.remove("visible");
    sincronizarEstadoMenu();
}

// Cuando el usuario hace clic en el botón hamburguesa...
botonMenu.addEventListener("click", function() {

    // toggle: si "visible" no está → la añade. Si está → la quita.
    menu.classList.toggle("visible");

    // También animamos el propio botón convirtiéndolo en una X
    sincronizarEstadoMenu();
});

// Si el usuario pulsa un enlace del menú, cerramos el menú
// (excepto el enlace de Accesibilidad, que necesita abrir el submenu)
var enlacesMenu = menu.querySelectorAll("a");

enlacesMenu.forEach(function(enlace) {
    enlace.addEventListener("click", function(evento) {
        // Si el enlace pulsado NO es el de accesibilidad, cerramos el menú
        if (enlace.id !== "btn-acc") {
            cerrarMenu();
        }
    });
});

// En móvil el submenu de accesibilidad no se puede abrir con hover.
// El JS escucha el clic en "Accesibilidad ⚙️" y añade la clase "abierto-sub"
var btnAcc        = document.getElementById("btn-acc");
var desplegableAcc = document.getElementById("desplegable-acc");

if (btnAcc) {
    btnAcc.addEventListener("click", function(evento) {
        evento.preventDefault();  // evita que el enlace "#" suba al inicio
        // toggle: si "abierto-sub" no está → la añade. Si está → la quita.
        desplegableAcc.classList.toggle("abierto-sub");
    });
}

// Cierra el submenu al pulsar cualquier botón de accesibilidad
var botonesSubmenu = document.querySelectorAll(".submenu button");
botonesSubmenu.forEach(function(boton) {
    boton.addEventListener("click", function() {
        desplegableAcc.classList.remove("abierto-sub");
        // En móvil también cerramos el menú principal
        cerrarMenu();
    });
});

// Si el usuario toca fuera del panel abierto en móvil, lo cerramos
document.addEventListener("click", function(evento) {
    var menuAbierto = menu.classList.contains("visible");
    var clicDentroDeNav = evento.target.closest(".nav-contenedor");

    if (menuAbierto && window.innerWidth <= 600 && !clicDentroDeNav) {
        cerrarMenu();
        desplegableAcc.classList.remove("abierto-sub");
    }
});

// Si la pantalla vuelve a escritorio, limpiamos el estado móvil
window.addEventListener("resize", function() {
    if (window.innerWidth > 600) {
        cerrarMenu();
        desplegableAcc.classList.remove("abierto-sub");
    }
});


/* =================================================================
   2. NAVBAR — EFECTO AL HACER SCROLL
   Cuando el usuario baja más de 50px, la navbar recibe la clase
   CSS "scroll" que la hace más oscura (ver Estilo.css .navbar.scroll)
   ================================================================= */

var navbar = document.getElementById("navbar");

// El evento "scroll" se dispara cada vez que el usuario hace scroll
window.addEventListener("scroll", function() {

    // window.scrollY es cuántos píxeles ha bajado el usuario
    if (window.scrollY > 50) {
        navbar.classList.add("scroll");
    } else {
        navbar.classList.remove("scroll");
    }
});


/* =================================================================
   3. MODO ACCESIBILIDAD
   Esta función se llama desde los botones del HTML con onclick="cambiarModo(...)"
   Añade o quita clases al <body> para cambiar los colores de toda la web.
   La preferencia se guarda en localStorage para que se recuerde al recargar.
   ================================================================= */

// Al cargar la página, recuperamos el modo guardado (si existe)
var modoActual = localStorage.getItem("modo-accesibilidad") || "";
if (modoActual) {
    document.body.classList.add(modoActual);
}

// Esta función es "global" — el HTML la llama con onclick="cambiarModo('claro')"
function cambiarModo(modo) {
    var claseNueva = "modo-" + modo;

    // Comprobamos si este modo ya estaba activo
    var yaEstabaActivo = document.body.classList.contains(claseNueva);

    // Quitamos SIEMPRE todos los modos para empezar desde cero
    document.body.classList.remove("modo-claro", "modo-oscuro", "modo-contraste");

    if (yaEstabaActivo) {
        // Si ya estaba activo, lo apagamos (no volvemos a añadirlo)
        modoActual = "";
        localStorage.removeItem("modo-accesibilidad");
    } else {
        // Si no estaba activo, lo encendemos
        document.body.classList.add(claseNueva);
        modoActual = claseNueva;
        localStorage.setItem("modo-accesibilidad", claseNueva);
    }
}


/* =================================================================
   4. FILTROS DEL CATÁLOGO
   Cuando el usuario pulsa un botón de filtro ("Lujo", "Deportivo"...),
   mostramos solo las tarjetas que tienen ese data-categoria.
   ================================================================= */

// Buscamos el contenedor de filtros
var contenedorFiltros = document.getElementById("filtros");

// Cuando el usuario hace clic dentro del contenedor de filtros...
contenedorFiltros.addEventListener("click", function(evento) {

    // evento.target es el elemento exacto que se ha clicado
    // closest busca el .btn-filtro más cercano al elemento clicado
    var boton = evento.target.closest(".btn-filtro");

    // Si el clic no fue en un botón de filtro, no hacemos nada
    if (!boton) return;

    // Quitamos la clase "activo" de todos los botones de filtro
    var todosBotones = document.querySelectorAll(".btn-filtro");
    todosBotones.forEach(function(b) {
        b.classList.remove("activo");
    });

    // Ponemos "activo" en el botón que se ha clicado
    boton.classList.add("activo");

    // Leemos qué filtro eligió el usuario (viene del atributo data-filtro del HTML)
    var filtroElegido = boton.dataset.filtro;

    // Recorremos todas las tarjetas del catálogo
    var todasLasTarjetas = document.querySelectorAll("#catalogo .tarjeta");

    todasLasTarjetas.forEach(function(tarjeta) {

        // Leemos la categoría de la tarjeta (viene del atributo data-categoria del HTML)
        var categoriaTarjeta = tarjeta.dataset.categoria;

        // Si el filtro es "todos" o coincide con la categoría → la mostramos
        if (filtroElegido === "todos" || categoriaTarjeta === filtroElegido) {
            tarjeta.style.display = "";       // vuelve a ser visible
            tarjeta.style.opacity = "1";
        } else {
            tarjeta.style.opacity = "0";      // primero la desvanecemos
            // Después de la animación (300ms), la ocultamos del todo
            setTimeout(function() {
                if (tarjeta.style.opacity === "0") {
                    tarjeta.style.display = "none";
                }
            }, 300);
        }
    });
});


/* =================================================================
   5. MODAL — VENTANA EMERGENTE CON LOS DETALLES DEL COCHE
   Al hacer clic en una tarjeta del catálogo, abrimos el modal
   y llenamos sus elementos con los datos de esa tarjeta.
   ================================================================= */

// Buscamos el modal y sus elementos internos
var modal            = document.getElementById("modal");
var botonCerrarModal = document.getElementById("btn-cerrar-modal");
var modalFoto        = document.getElementById("modal-foto");
var modalTitulo      = document.getElementById("modal-titulo");
var modalEtiqueta    = document.getElementById("modal-etiqueta");
var modalDesc        = document.getElementById("modal-descripcion");
var modalSpecs       = document.getElementById("modal-specs");

// Recorremos todas las tarjetas del catálogo
var tarjetasCatalogo = document.querySelectorAll("#catalogo .tarjeta");

tarjetasCatalogo.forEach(function(tarjeta) {

    tarjeta.addEventListener("click", function(evento) {

        // Si el usuario hizo clic en el botón "Comparar", no abrimos el modal
        if (evento.target.closest(".btn-comparar")) return;

        // Leemos los datos de la tarjeta que se clicó
        // querySelector busca dentro de "tarjeta" (no en toda la página)
        var foto       = tarjeta.querySelector(".tarjeta-foto");
        var titulo     = tarjeta.querySelector("h3");
        var etiqueta   = tarjeta.querySelector(".etiqueta");
        var descripcion = tarjeta.querySelector("p");
        var especificaciones = tarjeta.querySelectorAll(".specs li");

        // Rellenamos el modal con esos datos
        modalFoto.src          = foto.src;
        modalFoto.alt          = foto.alt;
        modalTitulo.textContent = titulo.textContent;
        modalEtiqueta.textContent = etiqueta.textContent;
        modalDesc.textContent  = descripcion.textContent;

        // Vaciamos la lista de specs del modal y la rellenamos de nuevo
        modalSpecs.innerHTML = "";
        especificaciones.forEach(function(spec) {
            // cloneNode(true) copia el elemento y todo lo que tiene dentro
            modalSpecs.appendChild(spec.cloneNode(true));
        });

        // Mostramos el modal añadiendo la clase "visible"
        // (en Estilo.css, .modal.visible cambia display:none a display:flex)
        modal.classList.add("visible");

        // Bloqueamos el scroll de la página mientras el modal está abierto
        document.body.style.overflow = "hidden";
    });
});

// Cerrar el modal al pulsar la X
botonCerrarModal.addEventListener("click", function() {
    cerrarModal();
});

// Cerrar el modal al hacer clic fuera de la caja (en el fondo oscuro)
modal.addEventListener("click", function(evento) {
    // Si el clic fue exactamente en el fondo del modal (no en la caja)
    if (evento.target === modal) {
        cerrarModal();
    }
});

// Cerrar el modal al pulsar la tecla Escape
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape" && menu.classList.contains("visible")) {
        cerrarMenu();
        desplegableAcc.classList.remove("abierto-sub");
    }

    if (evento.key === "Escape") {
        cerrarModal();
    }
});

// Función auxiliar para cerrar el modal
function cerrarModal() {
    modal.classList.remove("visible");
    document.body.style.overflow = ""; // restauramos el scroll
}


/* =================================================================
   6. FORMULARIO DE CONTACTO
   Validamos los campos antes de enviar.
   Si todo está bien, enviamos los datos a nuestro endpoint en Vercel.
   ================================================================= */

var formulario        = document.getElementById("formulario");
var campoNombre       = document.getElementById("nombre");
var campoEmail        = document.getElementById("email");
var campoMensaje      = document.getElementById("mensaje");
var errorNombre       = document.getElementById("error-nombre");
var errorEmail        = document.getElementById("error-email");
var errorMensaje      = document.getElementById("error-mensaje");
var estadoFormulario  = document.getElementById("estado-formulario");

// Función que comprueba si un campo es válido y muestra/oculta el error
function validarCampo(campo, errorElemento, condicion, mensajeError) {
    if (condicion) {
        // El campo está mal → mostramos el error y pintamos el borde rojo
        errorElemento.textContent = mensajeError;
        campo.classList.add("error-campo");
        campo.classList.remove("ok-campo");
        return false; // no válido
    } else {
        // El campo está bien → borramos el error y pintamos el borde verde
        errorElemento.textContent = "";
        campo.classList.remove("error-campo");
        campo.classList.add("ok-campo");
        return true; // válido
    }
}

// Validamos en tiempo real mientras el usuario escribe
campoNombre.addEventListener("input", function() {
    validarCampo(
        campoNombre,
        errorNombre,
        campoNombre.value.trim().length < 2,  // condición de error
        "El nombre debe tener al menos 2 caracteres."
    );
});

campoEmail.addEventListener("input", function() {
    // Expresión regular que comprueba que el email tiene el formato correcto
    var formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validarCampo(
        campoEmail,
        errorEmail,
        !formatoEmail.test(campoEmail.value.trim()),  // si NO cumple el formato → error
        "Introduce un email válido (ej: nombre@correo.com)."
    );
});

campoMensaje.addEventListener("input", function() {
    validarCampo(
        campoMensaje,
        errorMensaje,
        campoMensaje.value.trim().length < 10,
        "El mensaje debe tener al menos 10 caracteres."
    );
});

// Cuando el usuario envía el formulario...
formulario.addEventListener("submit", async function(evento) {

    // Cancelamos el envío normal del navegador (que recargaría la página)
    evento.preventDefault();

    // Validamos todos los campos a la vez
    var nombreOk  = validarCampo(campoNombre, errorNombre, campoNombre.value.trim().length < 2, "El nombre debe tener al menos 2 caracteres.");
    var emailOk   = validarCampo(campoEmail, errorEmail, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoEmail.value.trim()), "Introduce un email válido.");
    var mensajeOk = validarCampo(campoMensaje, errorMensaje, campoMensaje.value.trim().length < 10, "El mensaje debe tener al menos 10 caracteres.");

    // Si algún campo está mal, no enviamos
    if (!nombreOk || !emailOk || !mensajeOk) {
        estadoFormulario.textContent = "Revisa los campos marcados en rojo.";
        estadoFormulario.className   = "error";
        return;
    }

    // Todo bien → intentamos enviar al endpoint de contacto
    estadoFormulario.textContent = "Enviando...";
    estadoFormulario.className   = "";

    try {
        var datosFormulario = {
            nombre: campoNombre.value.trim(),
            email: campoEmail.value.trim(),
            mensaje: campoMensaje.value.trim()
        };

        var respuesta = await fetch(formulario.action, {
            method:  "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosFormulario)
        });

        var resultado = await respuesta.json().catch(function() {
            return {};
        });

        if (respuesta.ok) {
            // El envío funcionó
            estadoFormulario.textContent = resultado.message || "Mensaje enviado. Te contestaremos pronto.";
            estadoFormulario.className   = "ok";
            formulario.reset();  // vaciamos el formulario
            // Quitamos los bordes de color de los campos
            [campoNombre, campoEmail, campoMensaje].forEach(function(c) {
                c.classList.remove("ok-campo", "error-campo");
            });
        } else {
            throw new Error(resultado.error || "Error del servidor");
        }

    } catch (error) {
        // Algo falló
        estadoFormulario.textContent = "No se pudo enviar el mensaje ahora mismo. Inténtalo de nuevo en unos minutos.";
        estadoFormulario.className   = "error";
    }
});


/* =================================================================
   7. COMPARADOR DE COCHES
   El usuario puede añadir hasta 3 coches pulsando "+ Comparar".
   Los datos se guardan en un array y se pintan en los 3 huecos.
   ================================================================= */

// Array con los datos de los 3 huecos (null = hueco vacío)
var cochesEnComparador = [null, null, null];

// Función que se llama desde el botón "+ Comparar" de cada tarjeta
function añadirAlComparador(boton) {

    // Buscamos la tarjeta que contiene el botón pulsado
    var tarjeta = boton.closest(".tarjeta");

    // Recogemos los datos de la tarjeta
    var datosCoche = {
        nombre:    tarjeta.querySelector("h3").textContent,
        foto:      tarjeta.querySelector(".tarjeta-foto").src,
        etiqueta:  tarjeta.querySelector(".etiqueta").textContent,
        specs:     tarjeta.querySelectorAll(".specs li")
    };

    // Comprobamos si este coche ya está en el comparador
    var yaEsta = cochesEnComparador.some(function(coche) {
        return coche && coche.nombre === datosCoche.nombre;
    });

    if (yaEsta) {
        alert("Este coche ya está en el comparador.");
        return;
    }

    // Buscamos el primer hueco libre (null)
    var posicionLibre = cochesEnComparador.indexOf(null);

    if (posicionLibre === -1) {
        alert("El comparador está lleno. Quita un coche antes de añadir otro.");
        return;
    }

    // Guardamos el coche en el hueco libre
    cochesEnComparador[posicionLibre] = datosCoche;

    // Cambiamos el texto del botón para indicar que está en uso
    boton.textContent = "✓ Añadido";
    boton.classList.add("en-uso");

    // Pintamos el comparador con los nuevos datos
    pintarComparador();

    // Desplazamos la página hasta el comparador
    document.getElementById("comparador").scrollIntoView({ behavior: "smooth" });
}

// Función que quita un coche de la posición indicada
function quitarDelComparador(posicion) {

    var nombreCoche = cochesEnComparador[posicion].nombre;

    // Vaciamos ese hueco
    cochesEnComparador[posicion] = null;

    // Restauramos el botón de ese coche en el catálogo
    var tarjetasCatalogo = document.querySelectorAll("#catalogo .tarjeta");
    tarjetasCatalogo.forEach(function(tarjeta) {
        if (tarjeta.querySelector("h3").textContent === nombreCoche) {
            var boton = tarjeta.querySelector(".btn-comparar");
            boton.textContent = "+ Comparar";
            boton.classList.remove("en-uso");
        }
    });

    // Repintamos el comparador
    pintarComparador();
}

// Función que vacía el comparador entero
function limpiarComparador() {
    cochesEnComparador = [null, null, null];

    // Restauramos todos los botones del catálogo
    document.querySelectorAll(".btn-comparar").forEach(function(boton) {
        boton.textContent = "+ Comparar";
        boton.classList.remove("en-uso");
    });

    pintarComparador();
}

// Función que dibuja los datos del comparador en los huecos del HTML
function pintarComparador() {

    // Mostramos u ocultamos el botón "Limpiar comparador"
    var btnLimpiar = document.getElementById("btn-limpiar");
    var hayCoches  = cochesEnComparador.some(function(c) { return c !== null; });
    btnLimpiar.style.display = hayCoches ? "inline-block" : "none";

    // Buscamos el CV más alto para resaltarlo (el "ganador")
    // Primero extraemos los CV de cada coche (si los tiene)
    var potencias = cochesEnComparador.map(function(coche) {
        if (!coche) return -1;
        // Buscamos en los specs el elemento que tenga "Potencia"
        var cvTexto = "";
        coche.specs.forEach(function(spec) {
            if (spec.textContent.includes("Potencia")) {
                cvTexto = spec.textContent;
            }
        });
        // Extraemos el número (ej: "630 CV" → 630)
        var numero = parseInt(cvTexto.replace(/\D/g, ""), 10);
        return isNaN(numero) ? -1 : numero;
    });

    var maxCV = Math.max.apply(null, potencias);

    // Pintamos cada uno de los 3 huecos
    cochesEnComparador.forEach(function(coche, i) {
        var hueco = document.getElementById("hueco-" + i);

        if (!coche) {
            // Hueco vacío: mostramos el texto por defecto
            hueco.className = "hueco-comparador";
            hueco.innerHTML = "Añade un coche";
        } else {
            // Hueco con coche: construimos el HTML con sus datos
            hueco.className = "hueco-comparador lleno";

            // Construimos las filas de la tabla de specs
            var filasSpecs = "";
            coche.specs.forEach(function(spec, indice) {

                // ¿Esta fila es la de potencia y es la más alta?
                var esPotencia   = spec.textContent.includes("Potencia");
                var esGanador    = esPotencia && potencias[i] === maxCV && maxCV > 0;
                var claseGanador = esGanador ? " class=\"ganador\"" : "";

                // Separamos el texto "Potencia:" y "630 CV"
                var partes    = spec.innerHTML.split("</strong>");
                var etiqueta  = partes[0] + "</strong>";
                var valor     = partes[1] || "";

                filasSpecs += "<tr><td>" + etiqueta + "</td><td" + claseGanador + ">" + valor + "</td></tr>";
            });

            // innerHTML construye el HTML completo de la tarjeta del comparador
            hueco.innerHTML =
                "<img src='" + coche.foto + "' alt='" + coche.nombre + "' class='comp-foto'>" +
                "<div class='comp-info'>" +
                    "<div class='comp-nombre'>" + coche.nombre + "</div>" +
                    "<span class='etiqueta'>" + coche.etiqueta + "</span>" +
                    "<table class='comp-tabla'>" + filasSpecs + "</table>" +
                    "<button class='comp-quitar' onclick='quitarDelComparador(" + i + ")'>Quitar</button>" +
                "</div>";
        }
    });
}


/* =================================================================
   8. BOTÓN VOLVER ARRIBA
   El botón está siempre en el HTML pero invisible (opacity: 0).
   Cuando el usuario baja 400px, le añadimos la clase "visible".
   ================================================================= */

var botonArriba = document.getElementById("btn-arriba");

// Cada vez que el usuario hace scroll comprobamos la posición
window.addEventListener("scroll", function() {

    if (window.scrollY > 400) {
        botonArriba.classList.add("visible");
    } else {
        botonArriba.classList.remove("visible");
    }
});

// Al hacer clic, vuelve suavemente al inicio
botonArriba.addEventListener("click", function() {
    window.scrollTo({
        top:      0,
        behavior: "smooth"  // animación suave en lugar de salto brusco
    });
});
