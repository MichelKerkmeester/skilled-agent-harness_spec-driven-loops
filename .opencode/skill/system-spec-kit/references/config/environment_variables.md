---
title: Environment Variables Reference
description: Configuration options via environment variables for the Spec Kit system
---

# Environment Variables Reference

Configuration options via environment variables for the Spec Kit system.

---

## 1. 📖 OVERVIEW

These variables control memory system behavior, token budgets, script execution, and batch processing.

---

## 2. 🗄️ MEMORY SYSTEM (MCP SERVER)

| Variable | Default | Purpose |
|----------|---------|---------|
| `MEMORY_DB_PATH` | `mcp_server/database/context-index.sqlite` | Override database location |
| `MEMORY_BASE_PATH` | Current working directory | Workspace root path |
| `MEMORY_ALLOWED_PATHS` | `specs/,.opencode/` | Additional allowed paths (colon-separated) |
| `DEBUG_TRIGGER_MATCHER` | `false` | Enable verbose trigger matching logs |
| `ENABLE_RERANKER` | `false` | Enable experimental ML reranking (requires Python) |

---

## 3. 🎯 TOKEN BUDGET

| Variable | Default | Purpose |
|----------|---------|---------|
| `MCP_MAX_TOKENS` | `25000` | Maximum response token budget |
| `MCP_TOKEN_SAFETY_BUFFER` | `0.8` | Safety buffer multiplier (80%) |
| `MCP_CHARS_PER_TOKEN` | `3.5` | Token estimation ratio |
| `MCP_MIN_ITEMS` | `1` | Minimum items to return |

---

## 4. 📜 SCRIPTS

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEBUG` | `false` | Enable debug logging in generate-context.js |
| `AUTO_SAVE_MODE` | `false` | Skip alignment check in hooks |
| `SPECKIT_QUIET` | `false` | Suppress non-essential output |
| `SPECKIT_TEMPLATES_DIR` | Auto-detected | Override templates directory |
| `SPECKIT_TEMPLATE_STYLE` | `minimal` | Template style: `minimal` or `verbose` |

---

## 5. ⚡ BATCH PROCESSING

| Variable | Default | Purpose |
|----------|---------|---------|
| `SPEC_KIT_BATCH_SIZE` | `5` | Batch size for memory_index_scan |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | Delay between batches (ms) |

---

## 6. 💡 USAGE EXAMPLES

```bash
# Enable debug logging
DEBUG=1 node scripts/memory/generate-context.js specs/001-feature/

# Use custom database location
MEMORY_DB_PATH=/tmp/test-db.sqlite node mcp_server/context-server.js

# Enable experimental reranker
ENABLE_RERANKER=true node mcp_server/context-server.js

# Quiet mode for CI/CD
SPECKIT_QUIET=true bash scripts/validate-spec.sh specs/001-feature/

# Use verbose templates for new spec folders
SPECKIT_TEMPLATE_STYLE=verbose bash scripts/spec/create.sh 'Add new feature'
```

---

## 7. 🔗 RELATED RESOURCES

- [Execution Methods](../workflows/execution_methods.md)
- [Troubleshooting](../debugging/troubleshooting.md)
- [Quick Reference](../workflows/quick_reference.md)
