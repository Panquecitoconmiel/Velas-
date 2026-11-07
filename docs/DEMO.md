# Demostración de diseño (modo vitrina)

Versión de la tienda de velas de Mafer para **mostrar el diseño a clientes**. Funciona sin servidor ni base de datos y se publica gratis en **Cloudflare Pages**.

## Qué se puede hacer

- Recorrer portada, catálogo, filtros, búsqueda y detalle de productos.
- Personalizar recuerdos para eventos (paquete, listón, etiqueta) y ver el precio calculado.
- Cotizar o pedir por WhatsApp desde el producto o el carrito.
- Cambiar la temporada del sitio desde el panel (Configuración › Temporada del sitio); el cambio se guarda solo en ese navegador.
- Agregar al carrito, crear una cuenta de prueba y completar el checkout. Se crea un **pedido de prueba**; no se cobra nada.
- Ver «Mi cuenta»: pedidos, direcciones y favoritos.
- Entrar al **panel administrativo** en modo solo lectura con:
  - correo: `admin@demo.mafer`
  - contraseña: `demo1234`

Todo lo que hace cada visitante (carrito, cuenta, pedidos) se guarda **solo en su navegador**. No se envían correos ni se procesan pagos.

## Publicar en Cloudflare Pages (una sola vez)

1. Entra a https://dash.cloudflare.com (crea tu cuenta gratis si no tienes).
2. Menú **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**.
3. Conecta tu cuenta de GitHub y elige el repositorio **Velas-** (si no aparece, usa «Configure GitHub App» y dale acceso a ese repositorio).
4. Configuración de compilación:
   - **Framework preset:** None
   - **Build command:** `pnpm --filter ./client build:demo`
   - **Build output directory:** `client/dist`
   - (Root directory: déjalo vacío)
5. **Save and Deploy**. En 2–3 minutos queda en `https://NOMBRE-DEL-PROYECTO.pages.dev`.

Cada vez que subas cambios a `main` en GitHub, Cloudflare vuelve a publicar la demostración sola.
No hay que configurar variables: la versión de Node se toma de `.node-version` y, en Cloudflare, la instalación omite la preparación de la base de datos (no se usa en la demostración).

## Probarla en tu computadora

```bash
pnpm --filter ./client build:demo
pnpm --filter ./client preview:demo
```

Abre http://localhost:4173/

## Catálogo actual

42 velas de ejemplo: recuerdos de bautizo, baby shower, bodas, XV años y cumpleaños; colecciones de Navidad, Día de muertos y Amor y amistad; aromáticas y velas postre. Nombres, precios (MXN) y existencias son de ejemplo.

Las fotos de las velas están recortadas sin fondo en `client/public/productos/velas/*.webp` (fotos de referencia proporcionadas por la clienta) y las de Día de muertos y lavanda son ilustraciones (`*.svg`, generadas con `node scripts/ilustraciones-velas.mjs`). Son **imágenes ilustrativas**: antes de vender, reemplázalas por fotos propias desde el panel.

En el catálogo las velas se muestran sin recuadro y brillan, como encendidas, al pasar el cursor o tocarlas.

## Cambiar los productos de la demostración

El catálogo base está en `server/prisma/catalog.ts` (lo usa `pnpm db:seed` en la tienda real). Los datos de la demostración se exportan de ahí a `client/src/services/demo/data.json`. La lógica que imita al servidor está en `client/src/services/demo/mock.ts`. La versión normal de la tienda (`pnpm build`) **no** incluye estos archivos.

## GitHub Pages (alternativa)

Usa `pnpm --filter ./client build:demo:github` con la variable `VITE_BASE=/NOMBRE-DEL-REPOSITORIO/` y publica `client/dist`.
