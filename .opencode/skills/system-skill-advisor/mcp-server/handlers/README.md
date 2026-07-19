---
title: "Skill Advisor Handlers: MCP Tool Entrypoints"
description: "MCP handler modules for advisor recommendation, status, rebuild and validation tools plus the skill-graph tool handlers."
trigger_phrases:
  - "skill advisor handlers"
  - "advisor recommend handler"
  - "advisor status handler"
---

# Skill Advisor Handlers: MCP Tool Entrypoints

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`mcp-server/handlers/` contains MCP tool handlers for advisor operations plus the skill-graph handlers under `skill-graph/`. The tool registry imports `../handlers/index.js`; the handlers are thin entrypoints that delegate recommendation, status, rebuild, validation and skill-graph behavior to library modules.

Current state:

- Exposes recommendation, status, rebuild and validation handlers.
- Exposes the skill-graph handlers (`scan`, `query`, `status`, `validate`, `propagate-enhances`) under the `skill-graph/` subdirectory.
- Uses `index.ts` as the local handler export surface.
- Keeps request orchestration separate from scorer and freshness internals.

---

## 2. DIRECTORY TREE

```text
handlers/
+-- advisor-rebuild.ts     # Rebuild handler
+-- advisor-recommend.ts   # Recommendation handler
+-- advisor-status.ts      # Status handler
+-- advisor-validate.ts    # Validation handler
+-- skill-graph/           # Skill-graph tool handlers
|   +-- scan.ts                # skill_graph_scan handler
|   +-- query.ts               # skill_graph_query handler
|   +-- status.ts              # skill_graph_status handler
|   +-- validate.ts            # skill_graph_validate handler
|   +-- propagate-enhances.ts  # skill_graph_propagate_enhances handler
|   +-- response-envelope.ts   # Shared skill-graph response envelope
|   `-- index.ts               # Skill-graph handler exports
+-- index.ts               # Handler exports
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-recommend.ts` | Handles advisor recommendation tool calls. |
| `advisor-status.ts` | Handles advisor status tool calls. |
| `advisor-rebuild.ts` | Handles advisor rebuild tool calls. |
| `advisor-validate.ts` | Handles advisor validation tool calls. |
| `skill-graph/` | Handlers for the skill-graph tools: scan, query, status, validate and propagate-enhances. |
| `index.ts` | Re-exports handler modules for registration. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Import advisor library modules, schemas and shared response helpers as needed. |
| Exports | Export MCP handler functions only. |
| Ownership | Keep tool request orchestration here. Put scoring in `../lib/scorer/` and schemas in `../schemas/`. |

Main flow:

```text
MCP tool request
  -> handler validation and orchestration
  -> advisor library helper
  -> prompt-safe response payload
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `advisor-recommend.ts` | Handler | Recommendation endpoint. |
| `advisor-status.ts` | Handler | Status endpoint. |
| `advisor-rebuild.ts` | Handler | Rebuild endpoint. |
| `advisor-validate.ts` | Handler | Validation endpoint. |
| `skill-graph/` | Handler group | Skill-graph tool endpoints: scan, query, status, validate and propagate-enhances. |
| `index.ts` | Barrel module | Local handler exports. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/handlers/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../schemas/README.md`](../schemas/README.md)
