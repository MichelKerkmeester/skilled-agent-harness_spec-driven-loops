feat: implement embeddings factory pattern with multi-provider support

Replace mandatory Ollama dependency with flexible embeddings system that
supports multiple providers (OpenAI, HF local, Ollama) with auto-detection
and robust fallback.

## Key Changes

### New Architecture
- Implement factory pattern for embedding providers
- Add OpenAI embeddings provider with auto-detection
- Extract HF local provider from monolithic implementation
- Introduce EmbeddingProfile for provider metadata

### Provider Auto-Detection
- OpenAI-first if OPENAI_API_KEY exists (configurable)
- Fallback to HF local (no additional dependencies)
- Manual override via EMBEDDINGS_PROVIDER env var
- Graceful degradation on provider failure

### DB-per-Profile
- Each {provider, model, dimension} uses separate SQLite database
- Prevents "dimension mismatch" errors permanently
- No migrations needed when switching providers
- Legacy DB path preserved for backward compatibility

### API Compatibility
- Maintain 100% backward compatible public API
- Existing code works without modifications
- Add new functions: getEmbeddingProfile(), getProviderMetadata()

### Documentation
- Update README.md: Ollama now optional (Phase 2)
- Document embedding providers configuration
- Add provider comparison table
- Include environment variables reference

## Files Changed

### New Files
- scripts/lib/embeddings/profile.js - EmbeddingProfile management
- scripts/lib/embeddings/factory.js - Provider factory
- scripts/lib/embeddings/providers/hf-local.js - HF local provider
- scripts/lib/embeddings/providers/openai.js - OpenAI provider
- scripts/lib/embeddings/README.md - Architecture docs
- scripts/test-embeddings-factory.js - Test suite
- IMPLEMENTATION_SUMMARY.md - Detailed change log

### Modified Files
- scripts/lib/embeddings.js - New wrapper using factory
- scripts/lib/embeddings-legacy.js - Backup of original (renamed)
- mcp_server/lib/vector-index.js - DB-per-profile support
- mcp_server/context-server.js - Expose provider metadata
- .opencode/install_guides/README.md - Update Ollama to optional

## Environment Variables

```bash
# Provider selection (auto|openai|hf-local|ollama)
EMBEDDINGS_PROVIDER=auto  # default

# OpenAI config
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDINGS_MODEL=text-embedding-3-small

# HF Local config
HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5

# Database location
MEMORY_DB_DIR=/path/to/database
```

## Testing

All tests passing:
```bash
node scripts/test-embeddings-factory.js
# ✅ Factory pattern: Funcional
# ✅ API compatible: Mantenida
# ✅ Profiles: Funcionando
# ✅ Providers: Disponibles
```

## Breaking Changes

None. API is fully backward compatible.

## Migration Guide

No migration needed. System auto-detects best provider:
1. With OPENAI_API_KEY → uses OpenAI automatically
2. Without → uses HF local (existing behavior)
3. Override: `export EMBEDDINGS_PROVIDER=hf-local`

## Future Work

- [ ] Implement Ollama provider (optional)
- [ ] Add embedding cache (performance optimization)
- [ ] Batch processing for OpenAI (cost optimization)

---

Resolves: Make Ollama optional for Spec Kit Memory
Version: 12.0.0
