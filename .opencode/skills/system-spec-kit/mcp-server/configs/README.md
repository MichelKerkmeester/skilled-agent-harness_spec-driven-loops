---
title: "MCP Server Configuration"
description: "Configuration files read by the engine config loader and the config tests: co-activation regex settings and a retained ranking weights file."
trigger_phrases:
  - "search weights"
  - "mcp config"
  - "ranking configuration"
  - "cognitive config"
  - "co-activation pattern"
---

# MCP Server Configuration

> Configuration inputs for the engine config loader and its tests.

## 1. OVERVIEW

`mcp-server/configs/` holds one data-only JSON settings file and one TypeScript module that validates environment-backed regex settings. `core/config.ts` imports the regex config. `tests/config-cognitive.vitest.ts` and the skill's `scripts/tests/test-bug-fixes.js` exercise the two files.

The search pipeline that once consumed `search-weights.json` was retired with the MCP server that held it, so nothing ranks searches with these files any more. They are kept for the config loader and its tests, and this folder documents their shape and export contracts only.

Use this folder when changing the co-activation regex defaults or the retained weight inputs. Do not add runtime branching here unless the config file is the stable boundary and the caller owns behavior.

---

## 2. SURFACE

| Surface | Purpose |
|---|---|
| `search-weights.json` | Ranking weights, document-type multipliers and trigger caps. No runtime path reads them; the skill's `scripts/tests/test-bug-fixes.js` parses the file. |
| `cognitive.ts` | Environment-backed regex config, loaded by `core/config.ts` and covered by `tests/config-cognitive.vitest.ts`. |
| Environment variables | `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` and `SPECKIT_COGNITIVE_COACTIVATION_FLAGS`. |

---

## 3. EXPORTS

`cognitive.ts` exports:

- `CognitiveConfig`
- `COGNITIVE_CONFIG`
- `loadCognitiveConfigFromEnv()`
- `safeParseCognitiveConfigFromEnv()`

`search-weights.json` exports data through normal JSON imports or file reads. Keep the file valid JSON.

---

## 4. ALLOWED IMPORTS

| Import | Rule |
|---|---|
| Zod | Allowed in `cognitive.ts` for environment validation. |
| Config consumers | `core/config.ts` imports `cognitive.ts`. The config tests read both files. |
| Runtime constants | Keep runtime scoring constants in their owning search or scoring modules. |
| Side effects | Do not add DB, file write, network, or handler execution side effects to this folder. |

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `search-weights.json` | Data-only ranking and trigger configuration, retained and exercised by tests. |
| `cognitive.ts` | Regex config parsing, default values, validation errors and safety checks. |
| `README.md` | Folder contract for config shape and import rules. |

---

## 6. BOUNDARIES

| Boundary | Rule |
|---|---|
| Data ownership | Store portable search and cognitive config inputs here. |
| Behavior ownership | Keep ranking and execution behavior in its owning modules. |
| Runtime safety | Validate environment regex values before exposing them to callers. |
| Side effects | Keep config loading free of writes, network calls and handler dispatch. |

---

## 7. ENTRYPOINTS

- Import `COGNITIVE_CONFIG` when a caller needs validated default cognitive matching settings.
- Call `loadCognitiveConfigFromEnv()` when tests or startup code need explicit environment parsing.
- Use `safeParseCognitiveConfigFromEnv()` when invalid regex input should return an error object instead of throwing.
- Read `search-weights.json` for the retained scoring inputs. No runtime path reads it today.

---

## 8. VALIDATION

Run from the repository root:

```bash
node -e "JSON.parse(require('fs').readFileSync('.opencode/skills/system-spec-kit/mcp-server/configs/search-weights.json', 'utf8'))"
(cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/config-cognitive.vitest.ts)
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/configs/README.md
```

Expected result: JSON parsing succeeds, cognitive config tests pass and README validation exits `0` with no HVR issues.

---

## 9. RELATED

- [Rollout gating](../lib/cognitive/README.md)
- [Handlers](../handlers/README.md)
- [Retrieval and continuity reference](../../references/memory/memory-system.md)
