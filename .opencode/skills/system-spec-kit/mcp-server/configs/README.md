---
title: "MCP Server Configuration"
description: "Configuration files for memory ranking weights and cognitive co-activation regex settings."
trigger_phrases:
  - "search weights"
  - "mcp config"
  - "ranking configuration"
  - "cognitive config"
  - "co-activation pattern"
---

# MCP Server Configuration

> Configuration inputs for memory search ranking and cognitive co-activation parsing.

## 1. OVERVIEW

`mcp-server/configs/` stores configuration used by memory search and cognitive matching. JSON files hold data-only settings. TypeScript files validate environment-backed runtime settings before handlers and search modules consume them.

Runtime scoring rules still live in the modules that execute scoring. This folder documents config inputs and export contracts only.

Use this folder when changing static ranking defaults, trigger weight inputs, or cognitive regex environment parsing. Do not add runtime branching here unless the config file is the stable boundary and the caller owns behavior.

## 2. SURFACE

| Surface | Purpose |
|---|---|
| `search-weights.json` | Ranking weights, document-type multipliers and trigger caps used by memory search paths. |
| `cognitive.ts` | Environment-backed regex config for cognitive co-activation matching. |
| Environment variables | `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` and `SPECKIT_COGNITIVE_COACTIVATION_FLAGS`. |

## 3. EXPORTS

`cognitive.ts` exports:

- `CognitiveConfig`
- `COGNITIVE_CONFIG`
- `loadCognitiveConfigFromEnv()`
- `safeParseCognitiveConfigFromEnv()`

`search-weights.json` exports data through normal JSON imports or file reads. Keep the file valid JSON.

## 4. ALLOWED IMPORTS

| Import | Rule |
|---|---|
| Zod | Allowed in `cognitive.ts` for environment validation. |
| Config consumers | Search and cognitive modules may import `cognitive.ts` or read `search-weights.json`. |
| Runtime constants | Keep runtime scoring constants in their owning search or scoring modules. |
| Side effects | Do not add DB, file write, network, or handler execution side effects to this folder. |

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `search-weights.json` | Data-only ranking and trigger configuration for memory search paths. |
| `cognitive.ts` | Regex config parsing, default values, validation errors and safety checks. |
| `README.md` | Folder contract for config shape and import rules. |

## 6. BOUNDARIES

| Boundary | Rule |
|---|---|
| Data ownership | Store portable search and cognitive config inputs here. |
| Behavior ownership | Keep ranking, search execution and memory mutations in their owning modules. |
| Runtime safety | Validate environment regex values before exposing them to callers. |
| Side effects | Keep config loading free of writes, network calls and handler dispatch. |

## 7. ENTRYPOINTS

- Import `COGNITIVE_CONFIG` when a caller needs validated default cognitive matching settings.
- Call `loadCognitiveConfigFromEnv()` when tests or startup code need explicit environment parsing.
- Use `safeParseCognitiveConfigFromEnv()` when invalid regex input should return an error object instead of throwing.
- Read `search-weights.json` from search-ranking code that needs stable scoring inputs.

## 8. VALIDATION

Run from the repository root:

```bash
node -e "JSON.parse(require('fs').readFileSync('.opencode/skills/system-spec-kit/mcp-server/configs/search-weights.json', 'utf8'))"
npm test -- --run .opencode/skills/system-spec-kit/mcp-server/tests/cognitive-config.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/configs/README.md
```

Expected result: JSON parsing succeeds, cognitive config tests pass and README validation exits `0` with no HVR issues.

## 9. RELATED

- [Scoring modules](../lib/scoring/README.md)
- [Cognitive modules](../lib/cognitive/README.md)
- [Search handlers](../handlers/README.md)
- [Memory search reference](../../references/memory/memory-system.md)
