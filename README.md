# Frutería Web — Tienda con historial de transacciones

Proyecto académico del **Laboratorio de Ingeniería de Software III**. Es una
tienda de productos que funciona por completo en el navegador: no hay servidor,
no hay base de datos y no se usa ninguna librería externa. Todo está hecho con
HTML, CSS y JavaScript puro.

El inventario vive en un arreglo de objetos dentro de `js/script.js`, y
JavaScript se encarga de dibujar el catálogo, el carrito y el historial de
ventas. El HTML llega prácticamente vacío en sus zonas dinámicas.

---

## Cómo ejecutarlo

Basta con abrir `index.html` en el navegador. No requiere instalación,
compilación ni servidor.

Si haces cambios y no los ves reflejados, recarga forzando la caché con
**Ctrl + F5**: el navegador tiende a conservar versiones viejas de
`style.css` y `script.js`.

---

## Estructura del proyecto

```
Proyecto_1/
├── index.html        Estructura de la página (catálogo, carrito, tabla)
├── css/
│   └── style.css     Estilos, tokens de diseño y tema oscuro
├── js/
│   └── script.js     Toda la lógica de la aplicación
├── image/            16 imágenes de producto (.png)
└── README.md
```

---

## Funcionalidades

### Catálogo dinámico

Las tarjetas de producto **no están escritas en el HTML**: JavaScript las
fabrica una por una a partir del arreglo `inventarioProductos`. Cada tarjeta
muestra imagen, nombre, categoría, precio y estado de inventario.

El estado del stock tiene tres niveles:

| Condición | Qué muestra | Efecto |
|---|---|---|
| `stock === 0` | "Agotado" | la tarjeta se apaga y el botón se deshabilita |
| `stock <= 3` | "¡Últimas N unidades!" | borde de alerta en la tarjeta |
| `stock > 3` | "Disponibles: N" | tarjeta normal |

### Filtro por categoría

Un selector filtra el catálogo entre **Frutas, Verduras, Bebidas y Lácteos**,
o muestra todas. Responde al evento `change` y vuelve a dibujar solo las
tarjetas que coinciden.

### Carrito con cantidades

- Si agregas el mismo producto varias veces, **no se crean líneas repetidas**:
  se suma la cantidad en una sola línea.
- Cada línea tiene botones de `+`, `−` y `X`.
- El carrito y el inventario están sincronizados: cada unidad que entra al
  carrito sale del inventario, y cada unidad que se retira regresa.
- Las tarjetas del catálogo avisan "Ya llevas N en el carrito".
- La cabecera lleva un contador de artículos.

### Cupones de descuento

Se escriben en el campo del carrito y se aplican con clic o con **Enter**. El
texto se normaliza con `trim()` y `toUpperCase()`, así que `" mitad "` también
funciona.

| Cupón | Beneficio | Condición |
|---|---|---|
| `DESCUENTO10` | 10 % de descuento | ninguna |
| `MITAD` | 50 % de descuento | compra mínima de $100.00 |
| `ENVIOGRATIS` | envío sin costo | ninguna |

Cualquier otro código reinicia los beneficios y muestra un error. Solo puede
haber un cupón activo a la vez.

### Reglas de negocio

| Regla | Valor |
|---|---|
| Costo de envío | $8.00 |
| Envío gratis desde | $60.00 (después del descuento) |
| Compra mínima para el cupón `MITAD` | $100.00 |
| Número del primer pedido | #1001 |

El envío también es gratis si el carrito está vacío o si se aplicó el cupón
`ENVIOGRATIS`.

### Compra y comprobante

El formulario pide nombre y correo. Al enviarlo:

1. Se cancela la recarga de la página con `preventDefault()`.
2. Se valida que el carrito no esté vacío y que el nombre tenga al menos
   3 letras.
3. Se registra la venta en el historial.
4. Se vacía el carrito y se reinician los cupones.

El inventario vendido **no se devuelve**, porque esa mercancía efectivamente
salió de la tienda.

### Historial de transacciones

Es la funcionalidad central del proyecto. Cada compra confirmada agrega una
fila a la tabla del final de la página, **sin borrar las anteriores**:

| Cliente | Nombre del producto | Cantidad | Fecha y hora | Pedido | Total Pagado |
|---|---|---|---|---|---|
| Leyder Ceron | Manzana roja, Piña | 3 | 18/09/26, 11:18 p. m. | #1001 | $64.35 |
| Ana Lopez | Queso, Yogur, Café | 3 | 18/09/26, 11:18 p. m. | #1002 | $55.00 |

Hay **una fila por transacción**, no por producto. La columna "Nombre del
producto" lista todos los productos del pedido separados por coma, y "Cantidad"
suma las unidades. Se hizo así porque "Total Pagado" es un valor del pedido
completo —incluye envío y descuento—, y repetirlo en una fila por producto daría
a entender que ese monto se pagó por cada artículo.

El historial vive únicamente en el DOM y dura lo que dure la sesión: al recargar
la página se pierde.

### Tema oscuro

El botón de la cabecera **no cambia ningún color a mano**. Solo agrega o quita
la clase `tema-oscuro` al `<body>`; dentro de esa clase se redefinen los mismos
tokens de `:root`, y todos los elementos que usan `var()` se repintan solos.

### Aviso de conexión

La página escucha los eventos `online` y `offline` del navegador. Si se pierde
la conexión aparece un aviso bajo la cabecera, y al recuperarla se notifica.

---

## Catálogo incluido

16 productos en 4 categorías:

| # | Producto | Categoría | Precio | Stock inicial |
|---|---|---|---|---|
| 1 | Manzana roja | fruta | $20.50 | 8 |
| 2 | Piña | fruta | $15.35 | 5 |
| 3 | Pera | fruta | $5.45 | 12 |
| 4 | Melón | fruta | $6.15 | 3 |
| 5 | Zanahoria | verdura | $3.20 | 14 |
| 6 | Tomate | verdura | $4.75 | 2 |
| 7 | Jugo natural | bebida | $12.00 | 6 |
| 8 | Agua de coco | bebida | $8.90 | 4 |
| 9 | Papaya | fruta | $7.80 | 9 |
| 10 | Jugo de naranja | bebida | $10.50 | 2 |
| 11 | Lechuga | verdura | $2.50 | 10 |
| 12 | Leche | bebida | $9.00 | 7 |
| 13 | Brócoli | verdura | $5.00 | 5 |
| 14 | Café | bebida | $15.00 | 3 |
| 15 | Queso | lácteo | $20.00 | 6 |
| 16 | Yogur | lácteo | $12.00 | 8 |

Para agregar un producto nuevo basta con crear su objeto y sumarlo al arreglo
`inventarioProductos`: la interfaz no necesita ningún otro cambio.

---

## Organización del código

`js/script.js` está dividido en nueve secciones numeradas:

| Sección | Contenido |
|---|---|
| 1 | Inventario, reglas de negocio y estado de la aplicación |
| 2 | Selección de elementos del DOM |
| 3 | Funciones auxiliares (precios, búsquedas, fecha, totales) |
| 4 | Dibujar el catálogo |
| 5 | Lógica del carrito y del inventario |
| 6 | Dibujar el carrito y el resumen |
| 7 | Mensajes del sistema y filas del historial |
| 8 | Eventos de la aplicación |
| 9 | Inicialización (función autoejecutable) |

`css/style.css` sigue el mismo criterio: una hoja base con los tokens de diseño
en `:root`, y bloques que se van agregando al final. Ninguna regla nueva inventa
colores ni medidas: todas se calculan con `calc()` a partir de
`--espaciado-base` y usan los colores declarados como variables.

---



## Técnicas aplicadas

**CSS:** variables con ámbito global y local, `calc()`, `var()` con valores de
respaldo, unidades de viewport (`dvh`, `svh`), Flexbox, `border-collapse`,
`:nth-child()` y reasignación de tokens para el tema oscuro.

**JavaScript:** objetos y arreglos de objetos; `const` y `let`; condicionales
`if / else if / else`, operador ternario y `switch` con condicional anidado;
ciclos `for`, `while`, `do-while` y `forEach`; funciones declarativas,
expresivas, flecha y autoejecutable (IIFE); plantillas literales, `toFixed()`,
`trim()` y `toUpperCase()`; manipulación del DOM con `createElement`,
`appendChild`, `removeChild`, `innerHTML` y `classList`; eventos `click`,
`change`, `keydown`, `submit`, `online` y `offline`; `setTimeout` y
`clearTimeout`.

---

## Limitaciones conocidas

- **Nada persiste al recargar.** Inventario, carrito, historial y tema vuelven a
  su estado inicial. Todo vive en memoria.
- **El historial no se puede exportar ni borrar** desde la interfaz.
- **Un solo cupón a la vez.** Aplicar uno nuevo reemplaza al anterior.
- **El correo no se muestra** en la tabla: se pide y se valida, pero el
  historial solo registra el nombre del cliente.
