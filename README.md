# Nova Codice — Landing Page

> Documentación técnica y de proyecto para uso interno y futuros prompts de IA.

---

## 📌 Descripción del proyecto

**Nova Codice** es un emprendimiento de servicios digitales orientado a **PYMEs y emprendedores** que buscan dar el salto al mundo digital. El equipo ofrece tres servicios principales:

1. **Desarrollo Web** — Sitios institucionales, landing pages, e-commerce y aplicaciones web.
2. **Software a Medida** — CRMs, ERPs, dashboards, automatizaciones y sistemas de gestión personalizados.
3. **Redes Sociales / Community Manager** — Estrategia de contenidos, diseño de posts/reels, gestión de comunidades y reportes mensuales.

La landing page tiene como objetivo **captar consultas de potenciales clientes** y presentar el equipo, los servicios y los valores de la marca de forma clara, moderna y profesional.

---

## 🗂️ Estructura de archivos

```
NovaCodiceLanding/
├── index.html              # Página principal (una sola página, múltiples secciones)
├── css/
│   └── styles.css          # Hoja de estilos principal
├── js/
│   └── main.js             # JavaScript: animaciones, interactividad, partículas
├── img/
│   ├── Nova Codice Loguito.png      # Ícono/logo solo (esfera)
│   └── Nova Codice loguito 2.png   # Logo completo (esfera + nombre)
└── README.md               # Este archivo
```

---

## 🎨 Identidad visual

### Paleta de colores

| Variable CSS         | Valor     | Uso principal                                 |
|----------------------|-----------|-----------------------------------------------|
| `--bg`               | `#0D0D0D` | Fondo general de la página                    |
| `--purple`           | `#6C2BFF` | Color primario: botones, acentos, degradados  |
| `--mint`             | `#00F5A0` | Color secundario: checks, tags, degradados    |
| `--text`             | `#EAEAEA` | Texto principal                               |
| `--text-muted`       | `rgba(234,234,234,0.55)` | Texto secundario / descripciones |

### Gradiente principal
```css
linear-gradient(135deg, #6C2BFF 0%, #00F5A0 100%)
```

### Tipografía
- **Títulos / Display:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — pesos 400, 500, 600, 700, 800
- **Cuerpo:** [Inter](https://fonts.google.com/specimen/Inter) — pesos 300, 400, 500, 600, 700
- Ambas fuentes se cargan desde Google Fonts en el `<head>` de `index.html`.

### Logos
- **`Nova Codice Loguito.png`** — Ícono esfera solo. Usado en: favicon, sección About, hero visual.
- **`Nova Codice loguito 2.png`** — Logo completo (esfera + texto). Usado en: navbar, footer.

---

## 📄 Secciones de la página

### 1. `#inicio` — Hero
- Fondo animado con canvas de partículas interconectadas (efecto network).
- Tres orbs de color difuminados con animación flotante.
- Título principal con texto en degradado animado.
- Estadísticas animadas (contador desde 0).
- Dos CTAs: "Ver Servicios" y "Hablar con el equipo".
- Visual de escritorio: logo flotante con anillos pulsantes y tarjetas flotantes.
- Indicador de scroll en la parte inferior.

### 2. `#nosotros` — Quiénes Somos
- Descripción del equipo y la misión de Nova Codice.
- Tres highlights de valor (Resultados, Relación cercana, Tecnología).
- Tarjeta visual con logo, nombre y barras de progreso animadas.

### 3. `#servicios` — Servicios (con pestañas)
Sistema de **3 pestañas** (tabs):
- **🌐 Desarrollo Web** — lista de 8 ítems + 4 mini-tarjetas de características.
- **💻 Software a Medida** — lista de 8 ítems + 4 mini-tarjetas.
- **📱 Redes Sociales** — lista de 8 ítems + 4 mini-tarjetas.
Cada pestaña tiene un CTA directo a la sección de consultas.

### 4. `#valores` — Nuestros Valores
Grid de **6 tarjetas** con hover effects:
1. Innovación constante
2. Enfoque en resultados
3. Transparencia total
4. Pasión por lo que hacemos
5. Crecimiento compartido
6. Agilidad y rapidez

### 5. `#proceso` — Cómo Trabajamos
Timeline vertical de **5 pasos** con línea degradada:
1. Consulta inicial gratuita
2. Propuesta personalizada
3. Diseño y desarrollo
4. Revisión y ajustes
5. Lanzamiento y soporte

### 6. `#consultas` — Formulario de Contacto
- Panel izquierdo: 5 razones para elegirnos.
- Panel derecho: formulario integrado con **FormSubmit**.
- Campos: nombre, empresa, email, teléfono, servicio (select), mensaje.
- Validación client-side básica con feedback visual.
- Configuración FormSubmit vía `<input type="hidden">`.

### 7. Footer
- Logo + descripción breve.
- Columna de servicios (links internos).
- Columna de empresa (links internos).
- Columna de contacto: email, ubicación, CTA.
- Iconos de redes sociales (Instagram, LinkedIn, X/Twitter).
- Copyright y crédito.

---

## 🚀 Funcionalidades JavaScript

| Módulo               | Descripción                                                        |
|----------------------|--------------------------------------------------------------------|
| Navbar scroll        | Agrega glassmorphism al navbar al hacer scroll > 60px              |
| Hamburger menu       | Apertura/cierre del menú mobile con animación y bloqueo de scroll  |
| Smooth scroll        | Navegación suave con offset del navbar                             |
| Active nav link      | Resalta el link del navbar según la sección visible                |
| Scroll animations    | IntersectionObserver para animar elementos al entrar en viewport   |
| Progress bars        | Animación de barras al hacer scroll a la sección About             |
| Counter animation    | Cuenta numérica animada en los stats del hero (easeOutQuad)        |
| Tab system           | Sistema de pestañas para la sección de servicios                   |
| Particle canvas      | Red de partículas animadas en el fondo del hero                    |
| Cursor glow          | Efecto de resplandor sutil tras el cursor (solo desktop)           |
| Form validation      | Validación client-side + feedback visual de envío                  |
| Tilt effect          | Leve inclinación 3D en tarjetas al hover (desktop)                 |
| Visibility API       | Pausa las partículas cuando la tab no está activa                  |
| Reduced motion       | Respeta `prefers-reduced-motion` del SO del usuario                |

---

## 📧 Configuración de FormSubmit

El formulario de contacto usa [FormSubmit.co](https://formsubmit.co) para enviar consultas al email del equipo.

### Pasos para activar:

1. Abrir `index.html` y buscar la línea:
   ```html
   action="https://formsubmit.co/TU_CORREO@ejemplo.com"
   ```

2. Reemplazar `TU_CORREO@ejemplo.com` con el email real del equipo (ej: `novacodice@gmail.com`).

3. La **primera vez** que alguien envíe el formulario, FormSubmit enviará un email de confirmación a esa dirección. Hacer clic en "Confirm Email" para activarlo.

4. A partir de entonces, todos los formularios llegan automáticamente al inbox.

### Configuración incluida:
```html
<!-- Asunto del email -->
<input type="hidden" name="_subject" value="Nueva consulta desde Nova Codice 🚀" />

<!-- Sin CAPTCHA (se puede activar cambiando a "true") -->
<input type="hidden" name="_captcha" value="false" />

<!-- Formato tabla (más legible) -->
<input type="hidden" name="_template" value="table" />

<!-- URL de redirección post-envío (opcional) -->
<input type="hidden" name="_next" value="" />
```

Para redirigir a una página de "Gracias", crear `gracias.html` y poner su URL en `_next`.

---

## 🛠️ Cómo usar / desplegar

### Localmente (sin servidor):
Simplemente abrir `index.html` en cualquier navegador moderno. No requiere servidor ni build tools.

### En producción:
1. Subir todos los archivos a un hosting (Netlify, Vercel, GitHub Pages, cPanel, etc.).
2. Mantener la estructura de carpetas intacta.
3. Actualizar el email en el `action` del formulario.
4. Configurar el dominio personalizado si aplica.

### Recomendaciones de hosting gratuito:
- **Netlify** (drag & drop de la carpeta) — recomendado para comenzar.
- **GitHub Pages** — si el repositorio es público.
- **Vercel** — alternativa rápida.

---

## 📐 Variables CSS principales

Todas las configuraciones visuales están centralizadas en `css/styles.css` bajo `:root { }`.
Para personalizar la paleta o tipografía, solo modificar esas variables:

```css
:root {
  --bg:           #0D0D0D;   /* Fondo */
  --purple:       #6C2BFF;   /* Color primario */
  --mint:         #00F5A0;   /* Color secundario */
  --text:         #EAEAEA;   /* Texto principal */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body:    'Inter', sans-serif;
  --max-width:    1200px;    /* Ancho máximo del contenido */
  --nav-height:   80px;      /* Alto del navbar */
}
```

---

## 📱 Responsive

| Breakpoint  | Comportamiento                                                      |
|-------------|---------------------------------------------------------------------|
| > 1100px    | Layout completo: hero 2 columnas, grids completos                  |
| ≤ 1100px    | Hero de una columna, hero visual oculto, grids simplificados       |
| ≤ 768px     | Hamburger menu activo, valores en 1 columna, form en 1 columna     |
| ≤ 480px     | Botones full-width, tabs apilados, padding reducido                 |

---

## 🔧 Personalización frecuente

### Cambiar el email del formulario:
En `index.html`, línea del `<form action="...">`.

### Agregar/quitar servicios en las listas:
En `index.html`, dentro de `<ul class="service-list">` de cada panel.

### Modificar colores del degradado:
En `css/styles.css`, variable `--gradient` en `:root`.

### Cambiar las estadísticas del hero:
En `index.html`, `data-count="50"`, `data-count="100"`, etc.
El sufijo (+, %) se maneja en el HTML con `.stat-plus`.

### Agregar más secciones:
1. Agregar el `<section id="nueva-seccion">` en `index.html`.
2. Agregar el link `<a href="#nueva-seccion">` en ambas navs (desktop y mobile).
3. Las clases `animate-on-scroll` funcionan automáticamente.

### Agregar links reales a redes sociales:
En el footer de `index.html`, cambiar `href="#"` por las URLs reales de cada red.

---

## 📦 Dependencias externas

| Recurso          | Fuente                    | Cómo se usa              |
|------------------|---------------------------|--------------------------|
| Space Grotesk    | Google Fonts CDN          | Tipografía display       |
| Inter            | Google Fonts CDN          | Tipografía cuerpo        |
| FormSubmit       | formsubmit.co             | Envío de formularios     |

**No hay frameworks de JavaScript ni CSS.** Todo es HTML, CSS y JS vanilla puro.

---

## 🏷️ Metadatos SEO

Actualmente configurados en el `<head>` de `index.html`:
- `description`: Descripción para motores de búsqueda.
- `keywords`: Palabras clave del sector.
- `og:title`, `og:description`, `og:type`: Open Graph para compartir en redes.

Para mejorar SEO a futuro:
- Agregar `og:image` con una imagen de 1200×630px.
- Agregar `og:url` con la URL del sitio en producción.
- Crear un `sitemap.xml`.
- Agregar `robots.txt`.

---

## ✍️ Equipo Nova Codice

- **Servicios:** Desarrollo Web · Software a Medida · Redes Sociales & Community Manager
- **Público objetivo:** PYMEs y emprendedores de Argentina
- **Modalidad:** 100% remoto
- **Contacto:** novacodice@gmail.com

---

*Documentación generada para uso interno del equipo Nova Codice. Última actualización: marzo 2025.*
