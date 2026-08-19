# Juan & Briggitte

Experiencia web romantica interactiva, hecha con HTML, CSS y JavaScript vanilla.

## Ejecutar localmente

1. Abre esta carpeta en Visual Studio Code.
2. Instala la extension **Live Server**.
3. Haz clic derecho en `index.html` y elige **Open with Live Server**.

Las fotos de ejemplo son remotas y se pueden sustituir por archivos locales.

## Personalizar

Edita al inicio de `script.js`:

- `CONFIG.couple` para los nombres.
- `CONFIG.relationship.startDate` para la fecha de inicio.
- `CONFIG.music.file` apunta actualmente a `assets/music/Reik - Creo En Ti (LetraLyrics).mp3`.
- `CONFIG.development.resetVouchers` como `true` durante desarrollo para limpiar los vales guardados.

Los vales se editan en `vouchers`. Las 16 fotos que coloques en `assets/images/` se incorporan automáticamente a la galería y se pueden abrir en el lightbox.

## Musica

Crea `assets/music/` y coloca ahi `cancion.mp3`. Los navegadores bloquean el autoplay no solicitado; la experiencia intenta iniciar la musica despues de abrir el sobre y siempre deja disponible el boton flotante.

## Notas

- El contador calcula anos, meses y dias calendario, y actualiza horas, minutos y segundos cada segundo.
- Los vales canjeados persisten en `localStorage`.
- No hay backend ni API de pago.
