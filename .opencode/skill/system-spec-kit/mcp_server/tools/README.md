# Tools — Dispatch Layer

<!-- ANCHOR:overview -->
## 🔧 Overview

The **tool dispatch layer** routes incoming MCP tool calls to their handler functions. It implements a **dispatcher pattern** where each domain module owns a `TOOL_NAMES` Set and a `handleTool()` switch statement. The central `dispatchTool()` function in `index.ts` iterates all dispatchers until one claims the tool name.

**22 tools** are organized across **5 domain modules**, spanning layers L1–L7 of the Spec Kit Memory architecture.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:structure -->
## 📁 Structure

```
tools/
├── index.ts              # Barrel export + dispatchTool() central router
├── types.ts              # 22 argument interfaces + MCPResponse + parseArgs<T>()
├── context-tools.ts      # L1 Orchestration (1 tool)
├── memory-tools.ts       # L2–L4 Memory CRUD (9 tools)
├── causal-tools.ts       # L6 Causal Graph (4 tools)
├── checkpoint-tools.ts   # L5 Checkpoints (4 tools)
└── lifecycle-tools.ts    # L6–L7 Lifecycle & Maintenance (4 tools)
```
<!-- /ANCHOR:structure -->

<!-- ANCHOR:architecture -->
## 🏗️ Architecture

```
                    MCP Protocol
                        │
                        ▼
               ┌─────────────────┐
               │  dispatchTool() │  index.ts
               │  (central router)│
               └────────┬────────┘
                        │
          iterates ALL_DISPATCHERS[]
          ┌─────────────┼─────────────────────────────┐
          │             │             │                │                │
          ▼             ▼             ▼                ▼                ▼
   ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌────────────┐
   │  context   │ │  memory  │ │  causal  │ │ checkpoint  │ │ lifecycle  │
   │  -tools    │ │  -tools  │ │  -tools  │ │   -tools    │ │  -tools    │
   │ (1 tool)   │ │ (9 tools)│ │ (4 tools)│ │  (4 tools)  │ │ (4 tools)  │
   └─────┬──────┘ └────┬─────┘ └────┬─────┘ └──────┬──────┘ └─────┬──────┘
         │              │            │               │              │
         ▼              ▼            ▼               ▼              ▼
                    ../handlers/  (business logic)
```

**Dispatch flow:**

1. `dispatchTool(name, args)` receives the raw tool name and arguments
2. Iterates `ALL_DISPATCHERS` in priority order (context → memory → causal → checkpoint → lifecycle)
3. Each dispatcher checks `TOOL_NAMES.has(name)` — first match wins
4. The matching module calls `parseArgs<T>(args)` to cast raw args to a typed interface
5. The typed args are forwarded to the corresponding handler in `../handlers/`
6. Returns `MCPResponse` (or `null` if no dispatcher claims the tool)
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:tool-registry -->
## 📋 Tool Registry

### L1 — Orchestration (`context-tools.ts`)

| Tool | Description |
|------|-------------|
| `memory_context` | Unified entry point for context retrieval with intent-aware routing |

### L2–L4 — Memory CRUD (`memory-tools.ts`)

| Tool | Description |
|------|-------------|
| `memory_search` | Semantic vector search with optional reranking and decay |
| `memory_match_triggers` | Fast trigger phrase matching with cognitive features |
| `memory_save` | Index a memory file into the database |
| `memory_list` | Browse stored memories with pagination |
| `memory_stats` | Get statistics (counts, tiers, folder rankings) |
| `memory_health` | Check health status of the memory system |
| `memory_delete` | Delete a memory by ID or bulk-delete by spec folder |
| `memory_update` | Update an existing memory (re-embeds on content change) |
| `memory_validate` | Record validation feedback (useful/not useful) |

### L5 — Checkpoints (`checkpoint-tools.ts`)

| Tool | Description |
|------|-------------|
| `checkpoint_create` | Create a named checkpoint of current memory state |
| `checkpoint_list` | List all available checkpoints |
| `checkpoint_restore` | Restore memory state from a checkpoint |
| `checkpoint_delete` | Delete a checkpoint |

### L6 — Causal Graph (`causal-tools.ts`)

| Tool | Description |
|------|-------------|
| `memory_drift_why` | Trace causal chain for a memory (decision lineage) |
| `memory_causal_link` | Create a causal relationship between two memories |
| `memory_causal_stats` | Get statistics about the causal memory graph |
| `memory_causal_unlink` | Remove a causal relationship by edge ID |

### L6–L7 — Lifecycle & Maintenance (`lifecycle-tools.ts`)

| Tool | Description |
|------|-------------|
| `memory_index_scan` | Scan workspace for new/changed memory files and index them |
| `task_preflight` | Capture epistemic baseline before task execution |
| `task_postflight` | Capture epistemic state after task and calculate learning delta |
| `memory_get_learning_history` | Get learning history (preflight/postflight records) |
<!-- /ANCHOR:tool-registry -->

<!-- ANCHOR:types -->
## 🔠 Types (`types.ts`)

Provides the type foundation for the dispatch layer:

- **`MCPResponse`** — Re-exported from `../../shared/types`, the canonical response type for all tools
- **`MCPResponseWithContext`** — Extended response with optional `autoSurfacedContext` field (SK-004)
- **`parseArgs<T>()`** — Centralizes the single protocol-boundary cast from raw `Record<string, unknown>` to typed handler args
- **22 argument interfaces** — One per tool (e.g., `SearchArgs`, `SaveArgs`, `PreflightArgs`), defining the expected shape of each tool's input
<!-- /ANCHOR:types -->

<!-- ANCHOR:adding-new-tools -->
## ➕ Adding New Tools

1. **Define the argument interface** in `types.ts`
2. **Create or update a dispatch module** (e.g., `memory-tools.ts`):
   - Add the tool name to `TOOL_NAMES`
   - Add a `case` in the `handleTool()` switch that calls `parseArgs<T>()` and forwards to the handler
3. **Import the handler** from `../handlers/`
4. If creating a **new dispatch module**, add it to `ALL_DISPATCHERS` in `index.ts`
<!-- /ANCHOR:adding-new-tools -->

<!-- ANCHOR:related -->
## 🔗 Related

| Path | Description |
|------|-------------|
| `../handlers/` | Business logic — the handler functions that tools dispatch to |
| `../definitions/` | MCP tool definitions (names, descriptions, JSON schemas) |
| `../../shared/types.ts` | Canonical `MCPResponse` type |
<!-- /ANCHOR:related -->
