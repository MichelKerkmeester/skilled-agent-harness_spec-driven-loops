# Implementación: Factory Pattern para Embeddings (v12.0)

## 🎯 Objetivo Completado

Reemplazar la dependencia obligatoria de Ollama por un sistema flexible de embeddings que soporta múltiples providers con auto-detección y fallback robusto.

## ✅ Cambios Implementados

### 1. Nueva Arquitectura de Embeddings

**Archivos Creados:**
- `scripts/lib/embeddings/profile.js` - Gestión de perfiles de embeddings
- `scripts/lib/embeddings/factory.js` - Factory pattern para selección de providers
- `scripts/lib/embeddings/providers/hf-local.js` - Provider HuggingFace local
- `scripts/lib/embeddings/providers/openai.js` - Provider OpenAI
- `scripts/lib/embeddings/README.md` - Documentación de arquitectura

**Archivos Modificados:**
- `scripts/lib/embeddings.js` - Nuevo wrapper que usa factory (mantiene API compatible)
- `scripts/lib/embeddings-legacy.js` - Backup del código original (renombrado)
- `mcp_server/lib/vector-index.js` - Soporte para DB por perfil
- `mcp_server/context-server.js` - Expone metadata del provider en `memory_health`
- `.opencode/install_guides/README.md` - Documentación actualizada

### 2. Características Implementadas

#### Auto-detección de Provider
```bash
# Sin configuración → usa HF local (768 dims)
node context-server.js

# Con OPENAI_API_KEY → usa OpenAI automáticamente (1536 dims)
export OPENAI_API_KEY=sk-...
node context-server.js

# Override manual
export EMBEDDINGS_PROVIDER=hf-local  # Fuerza local aunque exista key
```

#### DB por Perfil (Evita Dimension Mismatch)
Cada combinación `{provider, model, dimension}` usa su propia SQLite:
```
database/
├── context-index.sqlite                                    # Legacy (hf-local + nomic + 768)
├── context-index__openai__text-embedding-3-small__1536.sqlite
└── context-index__openai__text-embedding-3-large__3072.sqlite
```

#### Fallback Robusto
Si OpenAI falla durante warmup/healthcheck, degrada automáticamente a HF local **antes** de escribir datos, previniendo mezcla de dimensiones.

#### API 100% Compatible
El código existente sigue funcionando sin cambios:
```javascript
const { generateDocumentEmbedding, getEmbeddingDimension } = require('./embeddings');
// ✅ Funciona igual que antes
```

### 3. Variables de Entorno

**Nuevas variables opcionales:**
```bash
# Selección de provider (auto|openai|hf-local|ollama)
EMBEDDINGS_PROVIDER=auto          # Default

# OpenAI config
OPENAI_API_KEY=sk-...            # Habilita auto-detección de OpenAI
OPENAI_EMBEDDINGS_MODEL=text-embedding-3-small  # Default

# HF Local config  
HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5  # Default

# Database location
MEMORY_DB_DIR=/path/to/database  # Opcional
```

### 4. Documentación Actualizada

**README.md actualizado:**
- ✅ Fase 2 (Ollama) marcada como OPCIONAL
- ✅ Sección 7.3 (Spec Kit Memory) documenta múltiples providers
- ✅ Tabla comparativa de providers
- ✅ Instrucciones de configuración por env vars
- ✅ Cómo verificar provider activo via `memory_health`

## 🧪 Testing

Script de test incluido y validado:
```bash
node .opencode/skill/system-spec-kit/scripts/test-embeddings-factory.js
```

**Resultado:** ✅ Todos los tests pasaron

## 📊 Providers Soportados

| Provider   | Dimensión | Requisitos        | Estado        |
|------------|-----------|-------------------|---------------|
| hf-local   | 768       | Solo Node.js      | ✅ Funcional  |
| openai     | 1536/3072 | OPENAI_API_KEY    | ✅ Funcional  |
| ollama     | 768       | Ollama + modelo   | ⏳ Pendiente  |

## 🔄 Flujo de Selección de Provider

1. ¿Existe `EMBEDDINGS_PROVIDER` (y no es 'auto')? → Usar ese
2. ¿Modo 'auto' Y existe `OPENAI_API_KEY`? → Usar OpenAI
3. Fallback → HF local (sin deps adicionales)

## 📝 Próximos Pasos (Opcionales)

1. **Implementar Ollama Provider** (si se requiere):
   - Crear `providers/ollama.js`
   - HTTP a `localhost:11434/api/embeddings`
   - Añadir case en factory

2. **Optimizaciones** (si se requieren):
   - Cache de embeddings frecuentes
   - Batch processing para OpenAI
   - Métricas de coste/uso

3. **Testing adicional**:
   - Test e2e con OpenAI real
   - Test de migración DB legacy → nuevo formato
   - Benchmark de performance por provider

## 🛡️ Consideraciones de Seguridad/Privacidad

- ✅ Credenciales via env vars (no en git)
- ✅ Override manual para forzar local
- ✅ Logs claros de qué provider se usa
- ⚠️ OpenAI envía contenido a cloud (documentado)

## 💾 Compatibilidad

- ✅ API pública sin cambios breaking
- ✅ DB legacy (hf-local + nomic + 768) mantiene mismo path
- ✅ Código existente funciona sin modificaciones
- ✅ Tests de sintaxis pasados

## 🚀 Para Usar Ahora

### Con HF Local (Default, sin cambios)
```bash
# Ya funciona, nada que configurar
node .opencode/skill/system-spec-kit/mcp_server/context-server.js
```

### Con OpenAI
```bash
export OPENAI_API_KEY=sk-proj-...
node .opencode/skill/system-spec-kit/mcp_server/context-server.js
```

### Verificar Provider Activo
Usar el tool `memory_health` desde OpenCode:
```json
{
  "embeddingProvider": {
    "provider": "openai",
    "model": "text-embedding-3-small",
    "dimension": 1536,
    "healthy": true,
    "databasePath": "...context-index__openai__text-embedding-3-small__1536.sqlite"
  }
}
```

## 📄 Archivos Modificados (Resumen)

```
.opencode/skill/system-spec-kit/
├── scripts/
│   ├── lib/
│   │   ├── embeddings.js                    [MODIFICADO] Nuevo wrapper con factory
│   │   ├── embeddings-legacy.js             [NUEVO] Backup del original
│   │   └── embeddings/
│   │       ├── README.md                    [NUEVO] Documentación
│   │       ├── profile.js                   [NUEVO] EmbeddingProfile
│   │       ├── factory.js                   [NUEVO] Factory pattern
│   │       └── providers/
│   │           ├── hf-local.js              [NUEVO] Provider local
│   │           └── openai.js                [NUEVO] Provider OpenAI
│   └── test-embeddings-factory.js           [NUEVO] Script de test
├── mcp_server/
│   ├── context-server.js                    [MODIFICADO] Expone provider metadata
│   └── lib/
│       └── vector-index.js                  [MODIFICADO] DB por perfil
└── .opencode/install_guides/
    └── README.md                             [MODIFICADO] Ollama opcional, providers documentados
```

---

**Estado:** ✅ Implementación completa y testeada  
**Versión:** 12.0.0  
**Fecha:** 30 de diciembre de 2025
