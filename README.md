# HEPATIQ — Mobile App (PWA)

App **full-screen móvil** de soporte clínico hepatobiliar para oncólogos. Diseñada para acceso vía QR durante ponencias, con experiencia de app nativa en el móvil.

Basada en **NCCN Hepatobiliary v5.2021**.

---

## 📱 Características mobile

- ✅ **Full-screen sin frame** — ocupa toda la pantalla del móvil
- ✅ **PWA instalable** — se puede añadir a la pantalla de inicio y se abre como app nativa
- ✅ **Safe-area aware** — respeta notch y home indicator en iPhones
- ✅ **Theme color** — la barra de estado se tiñe del color de la app
- ✅ **Sin zoom accidental** — comportamiento app-like
- ✅ **Bottom navigation fija** — siempre accesible

---

## 🚀 Cómo desplegar en GitHub Pages (3 minutos)

### Paso 1 — Limpia tu repo `astragastro`

Si ya tienes archivos del intento anterior, bórralos:

```bash
cd ~/ruta/a/tu/repo/astragastro
git rm -rf .
git commit -m "Limpiar repo"
git push
```

### Paso 2 — Sube TODO el contenido del zip a la raíz del repo

Descomprime el zip. Verás una carpeta `astragastro-deploy/`. Coge **todo lo de dentro** (no la carpeta, solo lo de dentro) y mételo en la raíz de tu repo.

**🚨 Archivo oculto crítico:** El `.nojekyll` es un archivo oculto. En Finder pulsa **Cmd + Shift + .** para verlo. Sin él, GitHub Pages romperá los assets.

Desde terminal (más fácil):
```bash
cd ~/ruta/a/tu/repo/astragastro
# Copia AQUÍ todo el contenido de astragastro-deploy/ (incluido .nojekyll)
git add -A
git commit -m "Deploy HEPATIQ mobile PWA"
git push
```

### Paso 3 — Configura Pages

Repo → **Settings** → **Pages**:
- **Source:** `Deploy from a branch`
- **Branch:** `main`, carpeta `/ (root)`
- **Save**

### Paso 4 — Espera 1-2 minutos y prueba

URL: `https://nestorguerra.github.io/astragastro/`

---

## 🎯 Para usar en la ponencia con QR

1. **Genera el QR** apuntando a `https://nestorguerra.github.io/astragastro/` 
   - Recomiendo qr-code-generator.com o similar.
2. **Mete el QR en una slide** al inicio de tu charla.
3. La audiencia escanea con la cámara → se abre en su navegador móvil.
4. **Opcional**: pueden pulsar "Compartir → Añadir a pantalla de inicio" (iOS) o "Instalar app" (Android Chrome) → se instala como app nativa con icono propio.

### Demo flow sugerido durante la ponencia

1. "Soy oncólogo, viene un paciente nuevo" → **+** → registrar paciente con TNM
2. "Necesito estratificar su función hepática" → **Calc** → Child-Pugh
3. "El paciente tiene mutación FGFR2" → **Régimen** → filtras y aparece Pemigatinib/Infigratinib
4. "Mira la categoría NCCN de cada recomendación" → badges visibles

---

## 📁 Archivos del deploy

```
astragastro/                  ← raíz de tu repo
├── index.html                ← App pre-compilada
├── favicon.svg
├── apple-touch-icon.png      ← Icono para iOS (180x180)
├── icon-192.png              ← Icono Android
├── icon-512.png              ← Icono Android HD
├── manifest.json             ← PWA manifest
├── .nojekyll                 ← Bypass Jekyll (CRÍTICO)
├── assets/
│   ├── index-XXX.js          ← React app compilada
│   └── index-XXX.css         ← Estilos compilados
├── source/                   ← Código fuente (por si quieres modificar)
└── README.md
```

---

## 🛠 Cómo modificar el código

```bash
cd source
npm install
npm run dev        # http://localhost:5173
# ...edita src/App.jsx...
npm run build
# Copia source/dist/* a la raíz del repo
git add -A && git commit -m "Update app" && git push
```

---

## 📋 Funcionalidades clínicas

- ✅ Registro pacientes con TNM (AJCC 8ª ed.): HCC, vesícula, colangio intra/extra
- ✅ Calculadoras: **Child-Pugh, MELD, Milán/UNOS**
- ✅ Selector de régimen con filtrado por Child-Pugh + biomarcadores
- ✅ Biomarcadores: **FGFR2, IDH1, MSI-H, dMMR, NTRK, BRAF-V600E, TMB-H, AFP**
- ✅ Categoría NCCN (1, 2A, 2B, 3) en cada recomendación
- ✅ Vista detalle paciente con timeline

---

## ⚖️ Aviso

Demo educativo basado en NCCN Hepatobiliary v5.2021. No sustituye al juicio clínico ni a la consulta con un especialista.

**© 2026 NCompany — Madrid**
