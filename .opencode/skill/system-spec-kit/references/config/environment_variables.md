---
title: Environment Variables Reference
description: Configuration options via environment variables for the Spec Kit system
---

# Environment Variables Reference

Configuration options via environment variables for the Spec Kit system.

---

## 1. OVERVIEW

These variables control memory system behavior, token budgets, script execution, and batch processing.

---

## 2. MEMORY SYSTEM (MCP SERVER)

| Variable | Default | Purpose |
|----------|---------|---------|
| `MEMORY_DB_PATH` | `mcp_server/dist/database/context-index.sqlite` | Override database location |
| `MEMORY_BASE_PATH` | Current working directory | Workspace root path |
| `MEMORY_ALLOWED_PATHS` | `specs/,.opencode/` | Additional allowed paths (colon-separated) |
| `DEBUG_TRIGGER_MATCHER` | `false` | Enable verbose trigger matching logs |
| `ENABLE_RERANKER` | `false` | Enable experimental ML reranking (requires Python) |

---

## 3. EMBEDDING PROVIDERS

The MCP server supports multiple embedding providers for semantic search. Provider selection follows this precedence:
1. Explicit `EMBEDDINGS_PROVIDER` setting
2. `VOYAGE_API_KEY` detected (auto-selects Voyage)
3. `OPENAI_API_KEY` detected (auto-selects OpenAI)
4. Falls back to `hf-local` (Hugging Face local inference)

### Provider Selection

| Variable | Default | Purpose |
|----------|---------|---------|
| `EMBEDDINGS_PROVIDER` | `auto` | Explicit provider: `voyage`, `openai`, `hf-local`, or `auto` |

### Voyage AI Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `VOYAGE_API_KEY` | - | API key for Voyage AI embeddings (required for `voyage` provider) |
| `VOYAGE_EMBEDDINGS_MODEL` | `voyage-4` | Voyage model name (1024 dimensions) |

### OpenAI Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAI_API_KEY` | - | API key for OpenAI embeddings (required for `openai` provider) |
| `OPENAI_EMBEDDINGS_MODEL` | `text-embedding-3-small` | OpenAI model name (1536 dimensions) |

### Hugging Face Local Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `HF_EMBEDDINGS_MODEL` | `nomic-ai/nomic-embed-text-v1.5` | Local model name (768 dimensions) |

### Rate Limiting

| Variable | Default | Purpose |
|----------|---------|---------|
| `EMBEDDING_BATCH_DELAY_MS` | `100` | Delay between batch embedding requests (ms) |

---

## 4. TOKEN BUDGET

| Variable | Default | Purpose |
|----------|---------|---------|
| `MCP_MAX_TOKENS` | `25000` | Maximum response token budget |
| `MCP_TOKEN_SAFETY_BUFFER` | `0.8` | Safety buffer multiplier (80%) |
| `MCP_CHARS_PER_TOKEN` | `3.5` | Token estimation ratio |
| `MCP_MIN_ITEMS` | `1` | Minimum items to return |

---

## 5. SCRIPTS

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEBUG` | `false` | Enable debug logging in generate-context.ts |
| `AUTO_SAVE_MODE` | `false` | Skip alignment check in hooks |
| `SPECKIT_QUIET` | `false` | Suppress non-essential output |
| `SPECKIT_TEMPLATES_DIR` | Auto-detected | Override templates directory |
| `SPECKIT_TEMPLATE_STYLE` | `minimal` | Template style (currently only `minimal` supported) |

---

## 6. BATCH PROCESSING

| Variable | Default | Purpose |
|----------|---------|---------|
| `SPEC_KIT_BATCH_SIZE` | `5` | Batch size for memory_index_scan |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | Delay between batches (ms) |

---

## 7. USAGE EXAMPLES

```bash
# Enable debug logging
DEBUG=1 node scripts/dist/memory/generate-context.js specs/001-feature/

# Use custom database location
MEMORY_DB_PATH=/tmp/test-db.sqlite node mcp_server/context-server.ts

# Enable experimental reranker
ENABLE_RERANKER=true node mcp_server/context-server.ts

# Quiet mode for CI/CD
SPECKIT_QUIET=true bash scripts/spec/validate.sh specs/001-feature/

# Use Voyage AI embeddings (high quality, cloud-based)
VOYAGE_API_KEY=your-key-here node mcp_server/context-server.ts

# Use OpenAI embeddings
OPENAI_API_KEY=your-key-here node mcp_server/context-server.ts

# Force local embeddings (no API key required)
EMBEDDINGS_PROVIDER=hf-local node mcp_server/context-server.ts

# Use specific embedding model
VOYAGE_EMBEDDINGS_MODEL=voyage-4-large VOYAGE_API_KEY=your-key node mcp_server/context-server.ts
```

---

## 8. FEATURE FLAGS

Feature flags control experimental and optional functionality. All flags default to production-safe values.

| Flag | Default | Purpose |
|------|---------|---------|
| `SPEC_KIT_ENABLE_DEDUP` | `true` | Session deduplication (removes redundant memory entries) |
| `SPEC_KIT_ENABLE_DECAY` | `true` | Attention decay system (time-weighted memory retrieval) |
| `SPEC_KIT_ENABLE_EMBEDDING` | `true` | Vector embeddings for semantic search |
| `SPEC_KIT_ENABLE_CHECKPOINT` | `true` | Incremental checkpointing (save context at intervals) |
| `SPEC_KIT_ENABLE_CAUSAL` | `false` | Causal memory graph (experimental - maps decision dependencies) |
| `SPEC_KIT_ENABLE_VALIDATION` | `true` | Auto-validation on memory save |
| `SPEC_KIT_ENABLE_INDEXING` | `true` | Automatic re-indexing after memory updates |
| `SPEC_KIT_ENABLE_TRIGGERS` | `true` | Proactive memory surfacing via trigger matching |
| `SPEC_KIT_VERBOSE_LOGGING` | `false` | Debug logging (detailed diagnostic output) |
| `SPEC_KIT_OFFLINE_MODE` | `false` | Offline-first operation (no external API calls) |
| `SPEC_KIT_LAZY_EMBEDDING` | `true` | Lazy embedding model loading (reduces startup time) |
| `SPEC_KIT_PROVIDER_FALLBACK` | `true` | Auto-switch embedding providers on failure |

### Usage Examples

```bash
# Disable deduplication for testing
SPEC_KIT_ENABLE_DEDUP=false node mcp_server/context-server.ts

# Enable experimental causal memory graph
SPEC_KIT_ENABLE_CAUSAL=true node mcp_server/context-server.ts

# Verbose logging for debugging
SPEC_KIT_VERBOSE_LOGGING=true node scripts/dist/memory/generate-context.js specs/001/

# Offline mode (no API calls, local embeddings only)
SPEC_KIT_OFFLINE_MODE=true EMBEDDINGS_PROVIDER=hf-local node mcp_server/context-server.ts

# Disable trigger matching
SPEC_KIT_ENABLE_TRIGGERS=false node mcp_server/context-server.ts
```

### Production Recommendations

**Always Enabled:**
- `SPEC_KIT_ENABLE_DEDUP` - Prevents memory bloat
- `SPEC_KIT_ENABLE_DECAY` - Prioritizes recent context
- `SPEC_KIT_ENABLE_EMBEDDING` - Core semantic search
- `SPEC_KIT_ENABLE_VALIDATION` - Catches errors early
- `SPEC_KIT_ENABLE_INDEXING` - Keeps search up to date
- `SPEC_KIT_ENABLE_TRIGGERS` - Proactive context surfacing
- `SPEC_KIT_PROVIDER_FALLBACK` - Resilience against API failures

**Development/Testing:**
- `SPEC_KIT_VERBOSE_LOGGING=true` - Detailed diagnostics
- `SPEC_KIT_ENABLE_CAUSAL=true` - Test experimental features

**Disable Only If:**
- `SPEC_KIT_ENABLE_CHECKPOINT=false` - Manual checkpoint control needed
- `SPEC_KIT_OFFLINE_MODE=true` - No network access
- `SPEC_KIT_LAZY_EMBEDDING=false` - Faster first query (slower startup)

---

## 9. RELATED RESOURCES

- [Execution Methods](../workflows/execution_methods.md)
- [Troubleshooting](../debugging/troubleshooting.md)
- [Quick Reference](../workflows/quick_reference.md)
- [Memory System Architecture](../memory/memory_system.md)
