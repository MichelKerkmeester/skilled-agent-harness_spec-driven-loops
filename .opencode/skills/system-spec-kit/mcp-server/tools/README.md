---
title: "MCP Server Tools"
description: "Typed MCP tool dispatch modules, schema validation boundaries and handler routing."
trigger_phrases:
  - "tool dispatch"
  - "memory quick search"
  - "typed tool args"
---

# MCP Server Tools

---

## 1. OVERVIEW

`mcp-server/tools/` is the typed dispatch layer for MCP tool calls. It maps public tool names to domain dispatch modules, validates arguments through schemas and forwards accepted requests to handler code.

Current state:

- `index.ts` owns dispatcher order and returns `null` when no dispatcher claims a tool name.
- Domain modules group memory, context, causal graph, checkpoint and lifecycle tools.
- `types.ts` keeps parsed argument shapes and shared MCP response aliases close to dispatch code.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                         MCP TOOLS                            │
╰──────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ MCP client   │ ───▶ │ dispatchTool   │ ───▶ │ domain tool    │
│ tool call    │      │ index.ts       │      │ module         │
└──────────────┘      └───────┬────────┘      └───────┬────────┘
                              │                       │
                              ▼                       ▼
                       ┌──────────────┐       ┌────────────────┐
                       │ schemas      │ ───▶  │ handlers       │
                       │ validation   │       │ domain logic   │
                       └──────┬───────┘       └───────┬────────┘
                              │                       │
                              ▼                       ▼
                       ┌──────────────┐       ┌────────────────┐
                       │ typed args   │       │ MCP response   │
                       │ types.ts     │       │ envelope       │
                       └──────────────┘       └────────────────┘

Dependency direction: tools ───▶ schemas ───▶ handlers
```

---

## 3. PACKAGE TOPOLOGY

```text
mcp-server/tools/
+-- index.ts              # ALL_DISPATCHERS and dispatchTool routing
+-- context-tools.ts      # memory_context orchestration dispatch
+-- memory-tools.ts       # memory search, save, CRUD and stats dispatch
+-- causal-tools.ts       # causal graph dispatch
+-- checkpoint-tools.ts   # checkpoint and learning history dispatch
+-- lifecycle-tools.ts    # index scan, task learning, async ingest, eval and session dispatch
+-- types.ts              # Shared response aliases and argument shapes
`-- README.md
```

Allowed direction:

- Tool modules may validate with `../schemas/` before calling handlers.
- Tool modules may call `../handlers/` after arguments are typed.
- `index.ts` may import dispatcher functions from sibling tool modules.

Disallowed direction:

- Handlers should not import tool dispatch modules.
- Tool modules should not parse raw MCP payloads outside the schema boundary.
- Dispatch modules should not own storage, retrieval or scoring logic.

---

## 4. KEY FILES

| File | Role |
|---|---|
| `index.ts` | Registers dispatchers and exposes `dispatchTool()`. |
| `context-tools.ts` | Routes L1 context orchestration calls. |
| `memory-tools.ts` | Routes memory search, trigger, save, update, delete and stats tools. |
| `causal-tools.ts` | Routes causal link, unlink, stats and lineage calls. |
| `checkpoint-tools.ts` | Routes checkpoint lifecycle and learning history calls. |
| `lifecycle-tools.ts` | Routes memory index scan/status/cancel, task learning, async ingest, eval and session calls. |
| `types.ts` | Defines shared response and typed argument contracts. |

---

## 5. BOUNDARIES AND FLOW

Dispatch flow:

```text
╭──────────────────────────────╮
│ MCP tool request             │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ dispatchTool(name, args)     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ First matching dispatcher    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ validateToolArgs()           │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Handler call                 │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ MCP response envelope        │
└──────────────────────────────┘
```

This folder owns dispatch and argument boundaries. Handler modules own behavior, schema modules own accepted input shape and lower layers own storage or retrieval details.

---

## 6. ENTRYPOINTS

Public TypeScript entrypoints:

- `dispatchTool()` from `index.ts`
- `ALL_DISPATCHERS` from `index.ts`
- Domain dispatcher functions exported by each `*-tools.ts` file

Runtime tool names are owned by the MCP server registry and routed through this folder before handlers run.

---

## 7. VALIDATION

Use repository-root commands:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run build
npm --prefix .opencode/skills/system-spec-kit/mcp-server test
```

Run targeted tests for changed dispatch behavior when editing a single tool module.

---

## 8. RELATED

- [`../handlers/README.md`](../handlers/README.md)
- [`../schemas/README.md`](../schemas/README.md)
- [`../core/README.md`](../core/README.md)
- [`../README.md`](../README.md)
