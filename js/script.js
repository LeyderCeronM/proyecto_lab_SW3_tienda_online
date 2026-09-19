
/* =========================================================================
   TIENDA DE PRODUCTOS - PROYECTO INTEGRADOR (VERSIÓN 3)
   V1 catálogo dinámico  ->  V2 carrito con cantidades  ->  V3 filtros,
   cupones, formulario de compra, comprobante y modo oscuro.
   Nada se reescribió desde cero: cada versión agregó una capa sobre la
   anterior.
   ========================================================================= */


/* =========================================================================
   1. VARIABLES Y TIPOS DE DATOS (nuestra "base de datos" simulada)
   ========================================================================= */
const manzana     = { id: 1,  nombre: "Manzana roja",    categoria: "fruta",   precio: 20.5,  stock: 8,  icono: "image/manzana.png" };
const pina        = { id: 2,  nombre: "Piña",            categoria: "fruta",   precio: 15.35, stock: 5,  icono: "image/piña.png" };
const pera        = { id: 3,  nombre: "Pera",            categoria: "fruta",   precio: 5.45,  stock: 12, icono: "image/pera.png" };
const melon       = { id: 4,  nombre: "Melón",           categoria: "fruta",   precio: 6.15,  stock: 3,  icono: "image/melon.png" };
const zanahoria   = { id: 5,  nombre: "Zanahoria",       categoria: "verdura", precio: 3.2,   stock: 14, icono: "image/zanahoria.png" };
const tomate      = { id: 6,  nombre: "Tomate",          categoria: "verdura", precio: 4.75,  stock: 2,  icono: "image/tomate.png" };
const jugo        = { id: 7,  nombre: "Jugo natural",    categoria: "bebida",  precio: 12.0,  stock: 6,  icono: "image/jugo.png" };
const cocoAgua    = { id: 8,  nombre: "Agua de coco",    categoria: "bebida",  precio: 8.9,   stock: 4,  icono: "image/aguaCoco.png" };

// NUEVO EN LA V3: se amplía el catálogo para tener más opciones que filtrar
const papaya      = { id: 9,  nombre: "Papaya",          categoria: "fruta",   precio: 7.8,   stock: 9,  icono: "image/papaya.png" };
const jugoNaranja = { id: 10, nombre: "Jugo de naranja", categoria: "bebida",  precio: 10.5,  stock: 2,  icono: "image/jugoNaranja.png" };
//Agregados por el programador
const lechuga     = { id: 11, nombre: "Lechuga",         categoria: "verdura", precio: 2.5,   stock: 10, icono: "image/lechuga.png" };
const leche       = { id: 12, nombre: "Leche",           categoria: "bebida",  precio: 9.0,   stock: 7,  icono: "image/leche.png" };
const brocoli     = { id: 13, nombre: "Brócoli",         categoria: "verdura", precio: 5.0,   stock: 5,  icono: "image/brocoli.png" };
const cafe        = { id: 14, nombre: "Café",            categoria: "bebida",  precio: 15.0,  stock: 3,  icono: "image/cafe.png" }; 
const queso       = { id: 15, nombre: "Queso",           categoria: "lacteo",  precio: 20.0,  stock: 6,  icono: "image/queso.png" };
const yogur       = { id: 16, nombre: "Yogur",           categoria: "lacteo",  precio: 12.0,  stock: 8,  icono: "image/yogur.png" };

// Array que contiene todos los objetos del inventario
const inventarioProductos = [manzana, pina, pera, melon, zanahoria, tomate, jugo, cocoAgua, papaya, jugoNaranja, lechuga, leche, brocoli, cafe, queso, yogur];

// Valores fijos de las reglas de negocio: constantes en MAYÚSCULAS
const COSTO_ENVIO = 8;
const MINIMO_ENVIO_GRATIS = 60;
const MINIMO_CUPON_MITAD = 100;

// Estado de la aplicación: van con 'let' porque estos valores SÍ cambian
let carrito = [];               // Array de objetos {id, nombre, precio, icono, cantidad}
let porcentajeDescuento = 0;    // Number: 0, 0.10 o 0.50
let envioGratisPorCupon = false;// Boolean: lo activa el cupón ENVIOGRATIS
let categoriaActual = "todos";  // String: filtro del catálogo
let temaOscuro = false;         // Boolean: controla la clase del <body>
let numeroPedido = 1000;        // Number: contador de pedidos confirmados
let temporizadorMensaje = null; // Guarda el setTimeout activo del mensaje

/* =========================================================================
   2. SELECCIÓN DE ELEMENTOS DEL DOM
   ========================================================================= */
const contenedorProductos = document.getElementById("lista-productos");

const contenedorCarrito   = document.getElementById("items-carrito");
const contadorCarrito     = document.getElementById("contador-carrito");
const textoSubtotal  = document.getElementById("texto-subtotal");
const textoEnvio     = document.getElementById("texto-envio");
const textoTotal     = document.getElementById("texto-total");
const textoDescuento = document.getElementById("texto-descuento");
const lineaDescuento = document.getElementById("linea-descuento");

const inputDescuento  = document.getElementById("input-descuento");
const btnDescuento    = document.getElementById("btn-aplicar-descuento");
const selectCategoria = document.getElementById("filtro-categoria");

const formCompra  = document.getElementById("form-compra");
const inputNombre = document.getElementById("input-nombre");
const inputCorreo = document.getElementById("input-correo");

const mensajeSistema = document.getElementById("mensaje-sistema");
const cuerpoHistorial = document.getElementById("cuerpo-historial");
const avisoConexion  = document.getElementById("aviso-conexion");
const btnTema        = document.getElementById("btn-tema");


/* =========================================================================
   3. FUNCIONES AUXILIARES
   ========================================================================= */

// 3.1. Función flecha: convierte un número en texto de precio.
// toFixed(2) obliga a mostrar siempre dos decimales.
const formatearPrecio = (valor) => {
    return `$${valor.toFixed(2)}`;
};

// 3.2. Función declarativa: busca un producto por su id usando un ciclo for.
function buscarProductoPorId(idProducto) {
    for (let i = 0; i < inventarioProductos.length; i++) {
        if (inventarioProductos[i].id === idProducto) {
            return inventarioProductos[i]; // return corta el ciclo y sale
        }
    }
    return null; // null = valor vacío intencional
}

// 3.3. Busca una línea dentro del carrito
function buscarItemEnCarrito(idProducto) {
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            return carrito[i];
        }
    }
    return null;
}

// 3.4. Devuelve un carrito NUEVO sin el producto indicado.
// Así evitamos borrar elementos "a la fuerza": construimos otra lista.
const carritoSinProducto = (idProducto) => {
    const nuevoCarrito = [];
    carrito.forEach((item) => {
        if (item.id !== idProducto) {
            nuevoCarrito.push(item);
        }
    });
    return nuevoCarrito;
};

// 3.5. Cuenta cuántas unidades hay en total en el carrito
const contarUnidades = () => {
    let unidades = 0;
    carrito.forEach((item) => {
        unidades = unidades + item.cantidad;
    });
    return unidades;
};


// 3.6. Función flecha: devuelve la fecha y la hora del momento actual.
// new Date() sin argumentos toma el reloj del computador, y toLocaleString
// lo escribe con el formato de Colombia (día/mes/año y hora de 12 horas).


const formatearFechaHora = () => {
    const ahora = new Date();
    return ahora.toLocaleString("es-CO", {
        dateStyle: "short",
        timeStyle: "short"
    });
};

// 3.7. Función flecha: calcula subtotal, descuento, envío y total.
// Concentrar el cálculo en un solo lugar evita que el descuento se aplique
// dos veces o que el comprobante muestre un total distinto al del panel.
const calcularTotales = () => {
    let subtotal = 0;

    // forEach: ejecuta una acción por cada elemento de la lista
    carrito.forEach((item) => {
        subtotal = subtotal + (item.precio * item.cantidad);
    });

    const descuento = subtotal * porcentajeDescuento;

    // Operadores lógicos: el envío es gratis si el carrito está vacío, si se
    // aplicó el cupón de envío gratis, o si se superó el mínimo de compra.
    const envio = (carrito.length === 0 || envioGratisPorCupon === true || subtotal - descuento >= MINIMO_ENVIO_GRATIS)
        ? 0
        : COSTO_ENVIO;

    const total = subtotal - descuento + envio;

    return {
        subtotal: subtotal,
        descuento: descuento,
        envio: envio,
        total: total
    };
};

/* =========================================================================
   4. DIBUJAR EL CATÁLOGO
   ========================================================================= */
function renderizarProductos() {

    // Ciclo WHILE: mientras el contenedor tenga hijos, los va eliminando.
    // Es la forma de "limpiar" la zona antes de volver a dibujarla.
    while (contenedorProductos.firstChild) {
        contenedorProductos.removeChild(contenedorProductos.firstChild);
    }

    // forEach: recorre el inventario producto por producto
    inventarioProductos.forEach((producto) => {

        // NUEVO EN LA V3: operador lógico || para aplicar el filtro
        const coincideFiltro = (categoriaActual === "todos" || producto.categoria === categoriaActual);

        if (coincideFiltro) {
            // Creamos la etiqueta desde cero y le ponemos su clase CSS
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta");

            // Condicional múltiple: tres estados posibles de inventario
            let textoStock = "";
            if (producto.stock === 0) {
                textoStock = "Agotado";
                tarjeta.classList.add("agotada");
            } else if (producto.stock <= 3) {
                textoStock = `¡Últimas ${producto.stock} unidades!`;
                tarjeta.classList.add("poco-stock");
            } else {
                textoStock = `Disponibles: ${producto.stock}`;
            }

            // NUEVO EN LA V2: avisamos cuántas unidades ya lleva el usuario
            const itemEnCarrito = buscarItemEnCarrito(producto.id);
            const textoEnCarrito = (itemEnCarrito === null)
                ? ""
                : `Ya llevas ${itemEnCarrito.cantidad} en el carrito`;

            // Plantillas literales para armar el HTML interno de la tarjeta
            tarjeta.innerHTML = `
                <span class="icono-producto"><img src="${producto.icono}" alt="${producto.nombre}" style="width: 100%; height: auto;"></span>
                <h3 class="nombre-producto">${producto.nombre}</h3>
                <p class="etiqueta-categoria">${producto.categoria}</p>
                <p class="precio-producto">${formatearPrecio(producto.precio)}</p>
                <p class="estado-stock">${textoStock}</p>
                <p class="mini-dato">${textoEnCarrito}</p>
            `;

            // El botón se crea aparte para poder escucharlo con addEventListener
            const botonComprar = document.createElement("button");
            botonComprar.classList.add("boton", "boton-bloque");

            if (producto.stock === 0) {
                botonComprar.textContent = "Sin existencias";
                botonComprar.disabled = true;
            } else {
                botonComprar.textContent = "Agregar al carrito";
                botonComprar.addEventListener("click", () => {
                    agregarAlCarrito(producto.id);
                });
            }

            tarjeta.appendChild(botonComprar);
            contenedorProductos.appendChild(tarjeta);
        }
    });
}



/* =========================================================================
   5. LÓGICA DEL CARRITO Y DEL INVENTARIO
   ========================================================================= */

// 5.1. Agrega una unidad al carrito y la descuenta del inventario
const agregarAlCarrito = (idProducto) => {
    const producto = buscarProductoPorId(idProducto);

    if (producto.stock > 0) {
        const item = buscarItemEnCarrito(idProducto);

        if (item === null) {
            // Todavía no está en el carrito: creamos su línea
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                icono: producto.icono,
                cantidad: 1
            });
        } else {
            // Ya estaba: solo sumamos una unidad a esa línea
            item.cantidad++;
        }

        producto.stock--;
        mostrarMensaje(`${producto.nombre} agregado al carrito`, "exito");
        actualizarPantalla();
    } else {
        mostrarMensaje(`No queda inventario de ${producto.nombre}`, "error");
    }
};

// 5.2. Suma o resta una unidad de una línea. 'cambio' vale 1 o -1.
function cambiarCantidad(idProducto, cambio) {
    const item = buscarItemEnCarrito(idProducto);
    const producto = buscarProductoPorId(idProducto);

    if (cambio === 1) {
        if (producto.stock > 0) {
            item.cantidad++;
            producto.stock--;
        } else {
            mostrarMensaje(`No hay más unidades de ${producto.nombre}`, "error");
        }
    } else {
        item.cantidad--;
        producto.stock++; // la unidad regresa al inventario

        // Si la línea llegó a cero, la sacamos del carrito
        if (item.cantidad === 0) {
            carrito = carritoSinProducto(idProducto);
        }
    }

    actualizarPantalla();
}

// 5.3. Elimina la línea completa y devuelve todo su inventario
function quitarDelCarrito(idProducto) {
    const item = buscarItemEnCarrito(idProducto);
    const producto = buscarProductoPorId(idProducto);

    producto.stock = producto.stock + item.cantidad;
    carrito = carritoSinProducto(idProducto);

    mostrarMensaje(`${producto.nombre} se quitó del carrito`, "error");
    actualizarPantalla();
}


/* =========================================================================
   6. DIBUJAR EL CARRITO Y EL RESUMEN
   ========================================================================= */

// 6.1. Función expresiva: se guarda dentro de una constante
const renderizarCarrito = function () {

    // Ciclo WHILE para limpiar el panel antes de volver a dibujarlo
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }

    if (carrito.length === 0) {
        const vacio = document.createElement("p");
        vacio.classList.add("carrito-vacio");
        vacio.textContent = "Tu carrito está vacío. Agrega productos del catálogo.";
        contenedorCarrito.appendChild(vacio);
        return; // salimos: no hay nada más que dibujar
    }

    carrito.forEach((item) => {
        const linea = document.createElement("div");
        linea.classList.add("linea-carrito");

        const info = document.createElement("div");
        info.innerHTML = `
            <p class="nombre-linea">
                <img src="${item.icono}" alt="${item.nombre}" style="width: 20%; height: auto; vertical-align: middle;"> ${item.nombre}
            </p>
            <p class="detalle-linea">${item.cantidad} × ${formatearPrecio(item.precio)} = ${formatearPrecio(item.precio * item.cantidad)}</p>
        `;

        const controles = document.createElement("div");
        controles.classList.add("controles-linea");

        const btnMenos = document.createElement("button");
        btnMenos.classList.add("boton-mini");
        btnMenos.textContent = "−";
        btnMenos.addEventListener("click", () => {
            cambiarCantidad(item.id, -1);
        });

        const btnMas = document.createElement("button");
        btnMas.classList.add("boton-mini");
        btnMas.textContent = "+";
        btnMas.addEventListener("click", () => {
            cambiarCantidad(item.id, 1);
        });

        const btnQuitar = document.createElement("button");
        btnQuitar.classList.add("boton-mini");
        btnQuitar.classList.add("boton-quitar");
        btnQuitar.textContent = "X";
        btnQuitar.addEventListener("click", () => {
            quitarDelCarrito(item.id);
        });

        controles.appendChild(btnMenos);
        controles.appendChild(btnMas);
        controles.appendChild(btnQuitar);

        linea.appendChild(info);
        linea.appendChild(controles);
        contenedorCarrito.appendChild(linea);
    });
};

// 6.2. Escribe los totales en el panel derecho
function renderizarResumen() {
    const totales = calcularTotales();

    textoSubtotal.textContent = formatearPrecio(totales.subtotal);
    textoTotal.textContent = formatearPrecio(totales.total);
    contadorCarrito.textContent = contarUnidades();

    // Condicional doble: la línea de descuento solo aparece si hay descuento
    if (totales.descuento > 0) {
        textoDescuento.textContent = `- ${formatearPrecio(totales.descuento)}`;
        lineaDescuento.classList.remove("oculto");
    } else {
        lineaDescuento.classList.add("oculto");
    }

    // Operador ternario para el texto del envío
    textoEnvio.textContent = (totales.envio === 0) ? "Gratis" : formatearPrecio(totales.envio);
}

// 6.3. Función maestra: refresca las tres zonas de la interfaz
function actualizarPantalla() {
    renderizarProductos();
    renderizarCarrito();
    renderizarResumen();
}


/* =========================================================================
   7. MENSAJES DEL SISTEMA Y COMPROBANTE
   ========================================================================= */
function mostrarMensaje(texto, tipo) {
    mensajeSistema.textContent = texto;

    // Primero quitamos cualquier estado anterior
    mensajeSistema.classList.remove("oculto");
    mensajeSistema.classList.remove("mensaje-exito");
    mensajeSistema.classList.remove("mensaje-error");
    mensajeSistema.classList.remove("mensaje-info");

    // SWITCH: elegimos qué clase CSS aplicar según el tipo de aviso
    switch (tipo) {
        case "exito":
            mensajeSistema.classList.add("mensaje-exito");
            break;
        case "error":
            mensajeSistema.classList.add("mensaje-error");
            break;
        case "info":
            mensajeSistema.classList.add("mensaje-info");
            break;
        default:
            mensajeSistema.classList.add("mensaje-exito");
    }

    // clearTimeout evita que un aviso viejo apague al nuevo antes de tiempo
    clearTimeout(temporizadorMensaje);

    // setTimeout: después de 3000 milisegundos escondemos el mensaje
    temporizadorMensaje = setTimeout(() => {
        mensajeSistema.classList.add("oculto");
    }, 3000);
}

// 7.1. Función declarativa que FABRICA una fila nueva del historial.
// Antes esta zona sobrescribía un panel de texto (la boleta): cada pedido
// borraba al anterior. Ahora, en su lugar, se construye una <tr> con sus <td>
// y se agrega al final del <tbody>, así que los pedidos se van acumulando.
function agregarFilaHistorial(nombreCliente, totales) {

    // --- PASO 0: armamos el detalle de lo comprado.
    // OJO con el orden: esto se lee del carrito, así que esta función debe
    // llamarse ANTES de vaciarlo en manejarCompra.
    // Ciclo DO-WHILE: se ejecuta al menos una vez y aquí eso es correcto,
    // porque solo se llega a esta función cuando el carrito tiene productos.
    let nombresProductos = "";
    let i = 0;
    do {
        const item = carrito[i];
        // El primero entra solo; a los demás se les antepone una coma
        nombresProductos = (i === 0)
            ? item.nombre
            : `${nombresProductos}, ${item.nombre}`;
        i++;
    } while (i < carrito.length);

    // --- PASO 1: fabricamos la FILA (todavía está suelta, fuera del documento)
    const fila = document.createElement("tr");

    // --- PASO 2: fabricamos cada CELDA DE DATOS (<td>, no <th>: estas son
    // celdas de contenido, no encabezados). Una por cada columna de la tabla.

    // Dato extraído del FORMULARIO
    const celdaCliente = document.createElement("td");
    celdaCliente.textContent = nombreCliente;

    // Dato extraído del CARRITO: todos los productos de este pedido
    const celdaProducto = document.createElement("td");
    celdaProducto.textContent = nombresProductos;

    // Dato extraído del CARRITO: suma de unidades de todas las líneas
    const celdaCantidad = document.createElement("td");
    celdaCantidad.textContent = contarUnidades();

    // Dato tomado del RELOJ del navegador en el instante de la compra
    const celdaFecha = document.createElement("td");
    celdaFecha.textContent = formatearFechaHora();

    // Dato extraído del ESTADO de la aplicación
    const celdaPedido = document.createElement("td");
    celdaPedido.textContent = `#${numeroPedido}`;

    // Dato extraído del CÁLCULO DE TOTALES
    const celdaTotal = document.createElement("td");
    celdaTotal.textContent = formatearPrecio(totales.total);


    // --- PASO 3: las celdas van DENTRO de la fila, EN EL MISMO ORDEN de los
    // <th> del HTML. Si este orden no coincide, los datos salen en la columna
    // equivocada aunque la tabla se vea bien armada.
    fila.appendChild(celdaCliente);
    fila.appendChild(celdaProducto);

    fila.appendChild(celdaCantidad);
    fila.appendChild(celdaFecha);
    fila.appendChild(celdaPedido);
    fila.appendChild(celdaTotal);

    // --- PASO 4: y la fila ya armada va DENTRO del <tbody> de la tabla.
    // appendChild agrega AL FINAL: por eso las filas anteriores no se tocan
    // y el <tbody> se convierte en el registro de toda la sesión.
    cuerpoHistorial.appendChild(fila);
}
/* =========================================================================
   8. EVENTOS DE LA APLICACIÓN
   ========================================================================= */

// 8.1. Cambio de categoría (evento change de un selector)
selectCategoria.addEventListener("change", () => {
    categoriaActual = selectCategoria.value; // .value trae la opción elegida
    renderizarProductos();
});

// 8.2. Cupones: función expresiva reutilizada por el clic y por Enter
const aplicarCupon = function () {
    // trim() quita los espacios sobrantes y toUpperCase() normaliza el texto,
    // así " mitad " también funciona.
    const codigo = inputDescuento.value.trim().toUpperCase();
    const totales = calcularTotales();

    if (carrito.length === 0) {
        mostrarMensaje("Agrega productos antes de usar un cupón", "info");
        return;
    }

    // SWITCH: comparamos el texto exacto que escribió el usuario
    switch (codigo) {
        case "DESCUENTO10":
            porcentajeDescuento = 0.10;
            envioGratisPorCupon = false;
            mostrarMensaje("Cupón aplicado: 10% de descuento", "exito");
            break;

        case "MITAD":
            // Condicional anidado: este cupón exige una compra mínima
            if (totales.subtotal >= MINIMO_CUPON_MITAD) {
                porcentajeDescuento = 0.50;
                envioGratisPorCupon = false;
                mostrarMensaje("Cupón aplicado: 50% de descuento", "exito");
            } else {
                porcentajeDescuento = 0;
                mostrarMensaje(
                    `El cupón MITAD necesita una compra mínima de ${formatearPrecio(MINIMO_CUPON_MITAD)}`,
                    "error"
                );
            }
            break;

        case "ENVIOGRATIS":
            porcentajeDescuento = 0;
            envioGratisPorCupon = true;
            mostrarMensaje("Cupón aplicado: envío gratis", "exito");
            break;

        default:
            // Cualquier otro texto cae aquí y se reinician los beneficios
            porcentajeDescuento = 0;
            envioGratisPorCupon = false;
            mostrarMensaje("Ese código no existe o ya venció", "error");
    }

    renderizarResumen();
};



// 8.3. Evento de ratón + función flecha
btnDescuento.addEventListener("click", () => {
    aplicarCupon();
});

// 8.4. Evento de teclado + función declarativa que recibe el Objeto Evento (e)
function detectarEnterCupon(e) {
    if (e.key === "Enter") {
        aplicarCupon();
    }
}
inputDescuento.addEventListener("keydown", detectarEnterCupon);

// 8.5. Cambio de tema (evento click de un botón).
// El botón no toca ni un color: cambia una clase y una variable booleana.
btnTema.addEventListener("click", () => {
    // Condicional doble sobre un Boolean
    if (temaOscuro === false) {
        document.body.classList.add("tema-oscuro");
        btnTema.textContent = "Modo claro";
        temaOscuro = true;
    } else {
        document.body.classList.remove("tema-oscuro");
        btnTema.textContent = "Modo oscuro";
        temaOscuro = false;
    }
});
// 8.6. Formulario de compra: función expresiva que confirma el pedido
const manejarCompra = function (evento) {
    
    // preventDefault() cancela la recarga automática de la página
    evento.preventDefault();
    if (carrito.length === 0) {
        mostrarMensaje("Tu carrito está vacío", "error");
        return;
    }

    const nombreCliente = inputNombre.value;

    // Validación propia además de la que ya hace el HTML con 'required'
    if (nombreCliente.length < 3) {
        mostrarMensaje("Escribe tu nombre completo (mínimo 3 letras)", "error");
        return;
    }

    const totales = calcularTotales();
    numeroPedido++;

    // En vez de sobrescribir la boleta, agregamos un registro más al historial
    agregarFilaHistorial(nombreCliente, totales);

    // Reiniciamos el estado de la compra (el stock vendido NO se devuelve)
    carrito = [];
    porcentajeDescuento = 0;
    envioGratisPorCupon = false;
    inputDescuento.value = "";
    inputNombre.value = "";
    inputCorreo.value = "";

    mostrarMensaje(`Pedido #${numeroPedido} confirmado`, "exito");
    actualizarPantalla();
};

formCompra.addEventListener("submit", manejarCompra);


/* =========================================================================
   9. INICIALIZACIÓN (Función autoejecutable - IIFE)
   ========================================================================= */
(function iniciarTienda() {
    console.log("Iniciando la tienda...");

    // Primer dibujado de la interfaz
    actualizarPantalla();

    // Eventos del navegador: avisar cuando se cae o vuelve la conexión
    window.addEventListener("offline", () => {
        avisoConexion.classList.remove("oculto");
    });

    window.addEventListener("online", () => {
        avisoConexion.classList.add("oculto");
        mostrarMensaje("Conexión restaurada", "exito");
    });

    console.log(`Tienda lista con ${inventarioProductos.length} productos.`);
})();
