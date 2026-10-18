# 

# 📐 ACROMÁTICO OS

**Sistema Integral de Automatización, Captación y Gestión para Estudio de Arquitectura**  
Diseñado especialmente para el flujo de trabajo de [**Acromático Estudio**](https://www.acromaticoestudio.com/) en **Zona Norte, Buenos Aires** (Tigre, San Isidro, Vicente López, San Fernando, Pilar, Escobar y barrios cerrados).

---

## 🌟 Visión del Proyecto

Para un arquitecto **metódico, sumamente ordenado y detallista**, el mayor cuello de botella suele ser la gestión repetitiva: filtrar consultas desorganizadas de clientes por WhatsApp, calcular parámetros urbanísticos (FOS/FOT) manualmente, dar seguimiento a exigencias de reglamentos de barrios privados y llevar expedientes colegiales (CAPBA D4) y municipales.

**Acromático OS** resuelve esto dividiendo el sistema en dos experiencias complementarias:

1. **Vista de Cara al Público (Cliente)**: Una experiencia visual minimalista y cinemática, con un **Recorrido Interactivo Guiado en 6 pasos** que cautiva al usuario, lo invita a estructurar su proyecto (vivienda, interiores/mobiliario, oficinas o gastronomía) y le genera de inmediato un código oficial de seguimiento.  
2. **Vista de Administración (El Arquitecto)**: Un panel de mando donde el arquitecto controla su **Pipeline de Proyectos (Kanban)**, gestiona **checklists municipales automatizados**, calcula el cumplimiento de **FOS y FOT en tiempo real**, registra notas en la bitácora técnica de obra y organiza sus **tareas diarias con una matriz de prioridades metódica**.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :---- | :---- |
| **Frontend** | **Next.js 16** (App Router), **Tailwind CSS v4**, **TypeScript**, **Lucide Icons**, **Canvas Confetti** |
| **Backend** | **Express**, **Node.js**, **TypeScript**, **Mongoose** |
| **Base de Datos** | **MongoDB** (con modo de desarrollo resiliente híbrido en memoria si Mongo local no está levantado) |
| **Seguridad** | **Helmet** (CSP estricto), **Rate Limiting** multinivel, **JWT** en cookies `HttpOnly`, **Zod Validation**, Sanitización activa contra inyecciones **NoSQL** |

&nbsp;

---

## 🏛️ Catálogo de Servicios Integrados

1. **Viviendas Residenciales desde Cero**: Proyectos unifamiliares en barrios cerrados (San Sebastián, Lagoon Pilar, Nordelta, Puertos) y lotes urbanos.  
2. **Habilitaciones & Trámites Municipales**: Presentación formal en Obras Particulares, cálculo de FOS/FOT, liquidación colegial CAPBA D4 y obtención de permiso de obra.  
3. **Arquitectura de Interiores & Mobiliario a Medida**: Equipamiento fijo, carpintería técnica de autor, cocinas con isla monolítica, vestidores de piso a techo y herrería de diseño.  
4. **Espacios Corporativos & Oficinas**: Puestos de trabajo ergonómicos, tabiquería vidriada con marco negro, cielorrasos fonoabsorbentes y fajas LED.  
5. **Locales Gastronómicos & Retail**: Bares, cafés de especialidad, restaurantes, diseño de barras monolíticas, cálculo de evacuación y habilitaciones comerciales.

---

## 🔒 Protocolos de Seguridad Informática

- **Protección contra Inyecciones NoSQL**: Middleware de sanitización recursiva que detecta y elimina operadores maliciosos (`$gt`, `$where`, etc.) en `req.body`, `req.query` y `req.params`.  
- **Autenticación Robusta**: Tokens JWT cifrados con expiración semanal, transmitidos en cookies con flags `HttpOnly`, `SameSite=Lax` y `Secure` (previene robo por XSS).  
- **Protección contra Fuerza Bruta & DDoS**:  
  - `authLimiter`: Máximo 10 intentos de login cada 15 minutos en `/api/auth/login`.  
  - `intakeLimiter`: Máximo 20 envíos de proyectos cada 15 minutos en `/api/projects/intake`.  
  - `generalLimiter`: Límite general en toda la API.  
- **Validación Estricta de Esquemas**: Todo payload entrante pasa por esquemas **Zod** tipados en TypeScript antes de alcanzar los controladores.  
- **Cabeceras HTTP Seguras**: Configuración de `helmet` con Content Security Policy (CSP), HSTS, prevención de clickjacking y protección MIME.

---

## 🚀 Puesta en Marcha

### Requisitos Previos:

- Node.js v18+ instalado.  
- (Opcional) MongoDB local o cadena en la nube (si no está disponible, el sistema cuenta con un motor en memoria automático para que todo funcione sin interrupciones).

### 1\. Iniciar el Backend (Express API):

```powershell
cd backend
npm run dev
```

&nbsp;

> El servidor quedará activo en: `http://localhost:5000` (Healthcheck: `http://localhost:5000/api/health`)

### 2\. Iniciar el Frontend (Next.js):

```powershell
cd frontend
npm run dev
```

&nbsp;

> La aplicación web estará disponible en: `http://localhost:3000`

---

## 🔑 Credenciales del Panel de Administración

Para acceder a la vista privada del arquitecto:

## 🔑 Acceso al Panel de Administración (Desarrollo)

- **URL**: `http://localhost:3000/admin`  
- **Email**: `admin@ejemplo.com`  
- **Contraseña**: Configurada en tu archivo `.env` del backend
*(En la pantalla de login también hay un botón para autocompletar estas credenciales con un solo click)*

---

## 🧭 Rutas Principales

- `/`: Landing pública interactiva con catálogo de servicios, portfolio de obras reales y el **Recorrido Guiado de 6 Pasos**.  
- `/seguimiento`: Portal de transparencia donde los clientes consultan el avance y estado de su expediente con su código (ej: `ACR-2025-0108`).  
- `/admin`: Acceso privado y autenticación JWT.  
- `/admin/dashboard`: Tablero Kanban por fases (*Briefing $\rightarrow$ Anteproyecto $\rightarrow$ Ejecutivo $\rightarrow$ Municipal $\rightarrow$ Obra*) y métricas del estudio.  
- `/admin/proyectos/[id]`: Ficha técnica de detalle con **Checklist municipal interactivo**, **Calculador FOS/FOT** y **Bitácora técnica**.  
- `/admin/tareas`: Planificador personal metódico organizado por matriz de prioridad (Urgente / Alta / Media) con subtareas medibles y control de horas.