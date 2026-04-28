# MenosQueCoches — Entrega 3 corregida

## Cambios aplicados

1. Se ha renombrado `Web.html` a `index.html` para que Vercel y cualquier hosting estático detecten la página principal automáticamente.
2. Se mantiene la estructura HTML/CSS/JS original de la tercera entrega.
3. Se ha añadido una meta descripción básica en el HTML.
4. Se ha mejorado el formulario de contacto:
   - El formulario envía los datos a FormSubmit para que lleguen al correo configurado.
   - El destinatario actual es `carlos.jaen.4d@gmail.com`.
5. Se han añadido atributos útiles para móvil en los campos del formulario: `autocomplete` e `inputmode="email"`.
6. Se han añadido pequeños ajustes CSS para imágenes, vídeos, iframes y uso táctil en móvil.
7. Se ha ajustado `vercel.json` para una publicación estática sencilla.

## Cómo probarlo en local

Abre `index.html` con Live Server en VS Code. No lo abras directamente con doble clic si quieres simular mejor el comportamiento de una web real.

## Cómo subirlo a Vercel

1. Sube la carpeta del proyecto a GitHub.
2. Entra en Vercel.
3. Importa el repositorio.
4. Framework preset: Other.
5. Build command: dejar vacío.
6. Output directory: dejar vacío o raíz del proyecto.
7. Deploy.

## Estado actual

- Web pública: `https://menosquecoches.vercel.app`
- Repositorio principal: `https://github.com/carlosjaen4d-design/MenosQueCoches`
## Formulario de contacto

Ahora mismo el formulario queda preparado para enviar al correo:

1. El frontend envía los datos a `https://formsubmit.co/ajax/carlos.jaen.4d@gmail.com`.
2. FormSubmit requiere una activación inicial desde el correo receptor la primera vez.
3. Después de confirmar esa activación, los mensajes llegarán a `carlos.jaen.4d@gmail.com`.

## Código QR

El QR ya está generado y apunta a la URL pública:

`https://menosquecoches.vercel.app`

Archivo:

`img/qr-menosquecoches.png`

## Compatibilidad móvil

La web está preparada para móviles modernos, incluyendo iPhone 13 o superior:

- Tiene etiqueta viewport.
- Tiene menú hamburguesa.
- Usa `playsinline`, `muted` y `autoplay` en el vídeo de portada.
- El formulario usa tamaño mínimo de 16px para evitar zoom automático en iOS.
- Las secciones principales pasan a una columna en pantallas pequeñas.

Aun así, antes de entregarla/publicarla definitivamente conviene probar:

- Menú hamburguesa.
- Filtros del catálogo.
- Modal de coches.
- Comparador.
- Formulario.
- Mapa.
- Vídeo de portada.
