---
title: "MCP Server Formatters"
description: "Response formatting modules for MCP search payloads, token metrics and safe content shaping."
trigger_phrases:
  - "formatters"
  - "search result formatting"
  - "token metrics"
---

# MCP Server Formatters

---

## 1. OVERVIEW

`formatters/` converts internal memory and search records into MCP response payloads. It owns result shaping, optional content embedding, anchor extraction output and token savings metrics.

Current responsibilities:

- Format raw search rows into stable MCP result envelopes.
- Estimate token use for tiered and anchor-filtered content.
- Apply path checks before file content is embedded in responses.

---

## 2. ARCHITECTURE

```text
MCP tools and handlers
        │
        ▼
formatSearchResults()
        │
        +--> path checks from core/config.ts and lib/utils/path-security.ts
        +--> anchor parsing from lib/parsing/memory-parser.ts
        +--> token estimates from token-metrics.ts
        +--> response envelopes from lib/response/envelope.ts
        │
        ▼
MCP-ready search response
```

---

## 3. PACKAGE TOPOLOGY

```text
formatters/
+-- index.ts             # Public formatter exports
+-- search-results.ts    # Search result envelope and content formatter
`-- token-metrics.ts     # Token estimation and tier metrics
```

Allowed direction:

- `index.ts` exports formatter APIs only.
- `search-results.ts` may import parser, response, search and path-security helpers.
- `token-metrics.ts` may import shared token estimation.

---

## 4. DIRECTORY TREE

```text
formatters/
+-- README.md
+-- index.ts
+-- search-results.ts
`-- token-metrics.ts
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Re-exports formatter types and functions for MCP server callers. |
| `search-results.ts` | Builds formatted search results, content fields, trace fields, trust badges and response envelopes. |
| `token-metrics.ts` | Estimates token counts and computes HOT, WARM and excluded-result savings metrics. |

---

## 6. BOUNDARIES AND FLOW

Formatters should stay presentation-focused. They may normalize payload shape, attach metrics and guard content reads. They should not own database queries, search ranking or MCP tool registration.

Main flow:

```text
raw results -> normalize fields -> optional content read -> optional anchor filter -> token metrics -> MCP envelope
```

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/formatters/README.md
```

For code changes in this folder, also run the MCP server TypeScript checks defined by the package scripts.

---

## 8. RELATED

- `../handlers/README.md`
- `../core/README.md`
- `../utils/README.md`
