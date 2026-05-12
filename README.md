# HEPATIQ — Soporte clínico hepatobiliar

App de soporte clínico para oncólogos basada en **NCCN Hepatobiliary v5.2021**.

## 🚀 Cómo desplegar en GitHub Pages (3 minutos)

Esta versión está **pre-compilada**. No necesitas Node, ni workflows, ni nada. Solo subir archivos y configurar Pages.

### Paso 1 — Limpia tu repo actual

Si tu repo `astragastro` ya tiene contenido del intento anterior, **bórralo todo**:

1. Ve a tu repo en GitHub.
2. Por cada archivo/carpeta → click en el archivo → icono papelera 🗑️ → Commit.
3. O más rápido desde terminal:
   ```bash
   cd /ruta/a/tu/repo
   git rm -rf .
   git commit -m "Limpiar repo"
   git push
   ```

### Paso 2 — Sube TODOS los archivos de este zip

Descomprime el zip y sube **todo el contenido** (no la carpeta, solo lo de dentro) a la raíz de tu repo:

```
astragastro/
├── index.html        ← raíz del repo
├── favicon.svg
├── .nojekyll         ← MUY IMPORTANTE, archivo oculto
├── assets/
│   ├── index-XXX.js
│   └── index-XXX.css
├── source/           ← código fuente (por si quieres modificar luego)
└── README.md
```

**⚠️ Aviso importante sobre el archivo `.nojekyll`:**

Es un archivo oculto (empieza por punto). En **Mac Finder** está oculto por defecto:
- Pulsa **Cmd + Shift + .** en Finder para mostrar archivos ocultos.
- Asegúrate de que `.nojekyll` está subido al repo.
- Si lo subes por la web de GitHub (drag & drop), tienes que tener los ocultos visibles.

**Alternativa más segura desde terminal:**
```bash
cd /ruta/a/tu/repo
# Copia todo lo de este zip a la raíz
git add -A
git commit -m "Deploy HEPATIQ pre-compilado"
git push
```

### Paso 3 — Configura GitHub Pages

1. Ve a tu repo → **Settings** → **Pages**.
2. En **Source**, selecciona: **Deploy from a branch**.
3. En **Branch**, selecciona: **main** y carpeta **/ (root)**.
4. Click **Save**.

### Paso 4 — Espera 1-2 minutos

GitHub Pages tarda un poco en publicar el primer deploy. Refresca `https://nestorguerra.github.io/astragastro/` después de un par de minutos.

---

## ✅ ¿Cómo saber si va bien?

Si abres la URL y sigues viendo pantalla blanca:

1. **Abre DevTools** (F12 o Cmd+Opt+I) → pestaña **Console**.
2. Si ves error `404` para los archivos `.js` o `.css` → falta el `.nojekyll`. Revisa el Paso 2.
3. Si ves error `MIME type` → mismo problema, `.nojekyll` no está subido.
4. Si la pestaña **Network** muestra los `.js` cargando con `200 OK` y aún así está blanco → mándame captura de la Console.

---

## 🛠 Cómo modificar el código (opcional)

Si quieres cambiar algo (textos, paleta, regímenes, etc.) tienes el código fuente en la carpeta `source/`.

```bash
cd source
npm install
npm run dev       # Servidor local en http://localhost:5173
# ...editas src/App.jsx...
npm run build     # Genera /dist con la nueva versión
```

Después copias el contenido de `source/dist/` a la raíz del repo (reemplazando `index.html`, `assets/`, etc.) y haces push.

---

## 📋 Funcionalidades

- ✅ Registro de pacientes con TNM (AJCC 8ª ed.)
- ✅ Calculadoras Child-Pugh, MELD y Milán/UNOS
- ✅ Selector de régimen filtrado por Child-Pugh + biomarcadores
- ✅ FGFR2, IDH1, MSI-H, dMMR, NTRK, BRAF-V600E, TMB-H, AFP
- ✅ Categoría NCCN (1, 2A, 2B, 3) en cada recomendación

---

## ⚖️ Aviso

Demo educativo basado en NCCN Hepatobiliary v5.2021. No sustituye al juicio clínico.

**© 2026 NCompany — Madrid**
