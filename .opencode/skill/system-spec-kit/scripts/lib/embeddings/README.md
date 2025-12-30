# Embeddings Factory - Multi-Provider Architecture

Flexible embeddings system supporting multiple backends with robust fallback and per-profile databases.

## 📁 Structure

```
embeddings/
├── profile.js              # Defines EmbeddingProfile and slug management
├── factory.js              # Factory that selects the appropriate provider
└── providers/
    ├── hf-local.js         # HuggingFace local (default)
    ├── openai.js           # OpenAI embeddings API
    └── ollama.js           # Ollama (future)
```

## 🎯 Available Providers

| Provider | Dimension | Requirements | When to use |
|----------|-----------|------------|-------------|
| **hf-local** | 768 | Node.js only | Default, privacy, offline |
| **openai** | 1536/3072 | `OPENAI_API_KEY` | Cloud, auto-detect if key exists |
| **ollama** | 768 | Ollama service | (Not yet implemented) |

## 🔧 Configuration

### Auto-detection (Recommended)

```bash
# Without configuration: uses HF local
node context-server.js

# With OpenAI: auto-detects the key
export OPENAI_API_KEY=sk-...
node context-server.js
```

### Manual Override

```bash
# Force HF local even if OPENAI_API_KEY exists
export EMBEDDINGS_PROVIDER=hf-local

# Force OpenAI (requires key)
export EMBEDDINGS_PROVIDER=openai
export OPENAI_API_KEY=sk-...

# Configure specific model
export OPENAI_EMBEDDINGS_MODEL=text-embedding-3-large  # 3072 dims
export HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5
```

## 💾 DB per Profile

Each unique combination of `{provider, model, dimension}` uses its own SQLite database:

```
database/
├── context-index.sqlite                              # Legacy (hf-local + nomic + 768)
├── context-index__openai__text-embedding-3-small__1536.sqlite
├── context-index__openai__text-embedding-3-large__3072.sqlite
└── context-index__hf-local__custom-model__768.sqlite
```

**Advantages:**
- ✅ No "dimension mismatch" errors
- ✅ Changing providers doesn't require migration
- ✅ You can experiment without losing data

## 📖 API Usage

### Generate Embeddings

```javascript
const embeddings = require('./embeddings');

// To index documents
const docEmbedding = await embeddings.generateDocumentEmbedding('text...');

// For search
const queryEmbedding = await embeddings.generateQueryEmbedding('search...');
```

### Get Metadata

```javascript
// Current provider info
const metadata = embeddings.getProviderMetadata();
console.log(metadata);
// {
//   provider: 'openai',
//   model: 'text-embedding-3-small',
//   dim: 1536,
//   healthy: true
// }

// Complete profile
const profile = embeddings.getEmbeddingProfile();
console.log(profile.getDatabasePath('/base/dir'));
// '/base/dir/context-index__openai__text-embedding-3-small__1536.sqlite'
```

### Pre-warmup (Recommended on startup)

```javascript
await embeddings.preWarmModel();
// Downloads/loads the model in background
```

## 🔄 Configuration Precedence

1. Explicit `EMBEDDINGS_PROVIDER` (if not `auto`)
2. Auto-detection: OpenAI if `OPENAI_API_KEY` exists
3. Fallback: HF local

## 🛡️ Robust Fallback

If OpenAI fails during warmup/healthcheck (auth, network, rate limit), the system automatically degrades to HF local **before** indexing data, preventing dimension mixing.

## 🧪 Testing

```bash
# Basic test (without loading heavy models)
node scripts/test-embeddings-factory.js

# With OpenAI
OPENAI_API_KEY=sk-... node scripts/test-embeddings-factory.js
```

## 📝 Legacy Compatibility

The public API maintains 100% compatibility. Existing code works without changes:

```javascript
// ✅ Still works
const { generateDocumentEmbedding, getEmbeddingDimension } = require('./embeddings');
```

## 🔮 Future: Ollama Provider

To implement the Ollama provider:

1. Create `providers/ollama.js` similar to `openai.js`
2. HTTP requests to `http://localhost:11434/api/embeddings`
3. Add `case 'ollama':` in `factory.js`

## 📊 Provider Comparison

| Feature | HF Local | OpenAI | Ollama |
|----------------|----------|--------|--------|
| Cost | Free | ~$0.02/1M tokens | Free |
| Latency | Medium | Low-Medium | Low |
| Privacy | ✅ Local | ❌ Cloud | ✅ Local |
| Offline | ✅ Yes | ❌ No | ✅ Yes |
| Setup | Easy | API key | Install + model |
| Dimension | 768 fixed | Configurable | Model dependent |

## 🐛 Troubleshooting

### "Dimension mismatch"
Should no longer occur. Each profile has its own DB. If you see this error, verify you're not using forced `MEMORY_DB_PATH`.

### "OpenAI provider requires OPENAI_API_KEY"
Force HF local: `export EMBEDDINGS_PROVIDER=hf-local`

### "Model not loaded"
HF local downloads ~274MB on first run. Be patient during cold start.

### View active provider
```bash
# In the MCP tool memory_health
{
  "embeddingProvider": {
    "provider": "...",
    "model": "...",
    "dimension": ...
  }
}
```
