# Embeddings Factory - Arquitectura Multi-Provider

Sistema de embeddings flexible que soporta múltiples backends con fallback robusto y DB por perfil.

## 📁 Estructura

```
embeddings/
├── profile.js              # Define EmbeddingProfile y gestión de slugs
├── factory.js              # Factory que selecciona el provider adecuado
└── providers/
    ├── hf-local.js         # HuggingFace local (default)
    ├── openai.js           # OpenAI embeddings API
    └── ollama.js           # Ollama (futuro)
```

## 🎯 Providers Disponibles

| Provider | Dimensión | Requisitos | Cuándo usar |
|----------|-----------|------------|-------------|
| **hf-local** | 768 | Solo Node.js | Default, privacidad, offline |
| **openai** | 1536/3072 | `OPENAI_API_KEY` | Cloud, auto-detect si existe key |
| **ollama** | 768 | Ollama service | (No implementado aún) |

## 🔧 Configuración

### Auto-detección (Recomendado)

```bash
# Sin configuración: usa HF local
node context-server.js

# Con OpenAI: auto-detecta la key
export OPENAI_API_KEY=sk-...
node context-server.js
```

### Override Manual

```bash
# Forzar HF local aunque exista OPENAI_API_KEY
export EMBEDDINGS_PROVIDER=hf-local

# Forzar OpenAI (requiere key)
export EMBEDDINGS_PROVIDER=openai
export OPENAI_API_KEY=sk-...

# Configurar modelo específico
export OPENAI_EMBEDDINGS_MODEL=text-embedding-3-large  # 3072 dims
export HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5
```

## 💾 DB por Perfil

Cada combinación única de `{provider, model, dimension}` usa su propia base de datos SQLite:

```
database/
├── context-index.sqlite                              # Legacy (hf-local + nomic + 768)
├── context-index__openai__text-embedding-3-small__1536.sqlite
├── context-index__openai__text-embedding-3-large__3072.sqlite
└── context-index__hf-local__custom-model__768.sqlite
```

**Ventajas:**
- ✅ No hay "dimension mismatch" errors
- ✅ Cambiar de provider no requiere migración
- ✅ Puedes experimentar sin perder datos

## 📖 API Usage

### Generar Embeddings

```javascript
const embeddings = require('./embeddings');

// Para indexar documentos
const docEmbedding = await embeddings.generateDocumentEmbedding('texto...');

// Para búsqueda
const queryEmbedding = await embeddings.generateQueryEmbedding('búsqueda...');
```

### Obtener Metadata

```javascript
// Info del provider actual
const metadata = embeddings.getProviderMetadata();
console.log(metadata);
// {
//   provider: 'openai',
//   model: 'text-embedding-3-small',
//   dim: 1536,
//   healthy: true
// }

// Perfil completo
const profile = embeddings.getEmbeddingProfile();
console.log(profile.getDatabasePath('/base/dir'));
// '/base/dir/context-index__openai__text-embedding-3-small__1536.sqlite'
```

### Pre-warmup (Recomendado en startup)

```javascript
await embeddings.preWarmModel();
// Descarga/carga el modelo en background
```

## 🔄 Precedencia de Configuración

1. `EMBEDDINGS_PROVIDER` explícito (si no es `auto`)
2. Auto-detección: OpenAI si existe `OPENAI_API_KEY`
3. Fallback: HF local

## 🛡️ Fallback Robusto

Si OpenAI falla durante warmup/healthcheck (auth, red, rate limit), el sistema degrada automáticamente a HF local **antes** de indexar datos, previniendo mezcla de dimensiones.

## 🧪 Testing

```bash
# Test básico (sin cargar modelos pesados)
node scripts/test-embeddings-factory.js

# Con OpenAI
OPENAI_API_KEY=sk-... node scripts/test-embeddings-factory.js
```

## 📝 Compatibilidad Legacy

La API pública se mantiene 100% compatible. Código existente funciona sin cambios:

```javascript
// ✅ Sigue funcionando
const { generateDocumentEmbedding, getEmbeddingDimension } = require('./embeddings');
```

## 🔮 Futuro: Ollama Provider

Para implementar el provider de Ollama:

1. Crear `providers/ollama.js` similar a `openai.js`
2. HTTP requests a `http://localhost:11434/api/embeddings`
3. Añadir `case 'ollama':` en `factory.js`

## 📊 Comparación de Providers

| Característica | HF Local | OpenAI | Ollama |
|----------------|----------|--------|--------|
| Coste | Gratis | ~$0.02/1M tokens | Gratis |
| Latencia | Media | Baja-Media | Baja |
| Privacidad | ✅ Local | ❌ Cloud | ✅ Local |
| Offline | ✅ Sí | ❌ No | ✅ Sí |
| Setup | Fácil | API key | Install + model |
| Dimensión | 768 fija | Configurable | Depende modelo |

## 🐛 Troubleshooting

### "Dimension mismatch"
Ya no debería ocurrir. Cada perfil tiene su DB. Si ves este error, verifica que no estés usando `MEMORY_DB_PATH` forzado.

### "OpenAI provider requiere OPENAI_API_KEY"
Fuerza HF local: `export EMBEDDINGS_PROVIDER=hf-local`

### "Model not loaded"
HF local descarga ~274MB en primera ejecución. Paciencia en cold start.

### Ver provider activo
```bash
# En el MCP tool memory_health
{
  "embeddingProvider": {
    "provider": "...",
    "model": "...",
    "dimension": ...
  }
}
```
