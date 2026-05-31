---
title: "Code Graph: Feature Catalog"
description: "Current feature inventory for the system-code-graph skill and mk-code-index MCP server, with source anchors for graph readiness, structural queries, structural tool tools, coverage graph references and doctor-code-graph policy."
trigger_phrases:
  - "system-code-graph feature catalog"
  - "mk-code-index feature catalog"
  - "code graph inventory"
  - "code graph runtime catalog"
importance_tier: "important"
---

# Code Graph: Feature Catalog

<!-- Filename: lowercase per project convention; sk-doc template suggests feature_catalog.md but lowercase is intentional. -->

This catalog is the current feature inventory for `.opencode/skills/system-code-graph/mcp_server/`. Live MCP callers use the standalone `mk-code-index` namespace, exposed as `mcp__mk_code_index__*`. The stable tool IDs remain `code_graph_*` and `detect_changes`.

---

## 1. OVERVIEW

The catalog covers 14 runtime features across 7 groups. Per-feature files carry the implementation surface, trigger path, current automation class, fallback and cross-references.

**Feature-to-tool granularity (F013/F014).** The 14 features map to **8 MCP tools** in the `mk-code-index` server because individual features often compose multiple operations on the same tool. For example, `code_graph_query` provides multiple query operations (`outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius`), each catalogued as its own feature. Previously, the **coverage-graph deep-loop tools** (`deep_loop_graph_*`) were registered with the `mk-spec-memory` MCP server; they were removed in arc 118 (FULL_ISOLATE_NO_MCP) and now live as direct `.cjs` script entry points under `.opencode/skills/deep-loop-runtime/scripts/`. The catalog entries below are retained as historical reference and point at the current script paths.

| Group | Count | Scope |
| --- | ---: | --- |
| [01--read-path-freshness](./01--read-path-freshness/) | 2 | Read-path freshness |
| [02--manual-scan-verify-status](./02--manual-scan-verify-status/) | 3 | Manual scan / verify / status |
| [03--detect-changes](./03--detect-changes/) | 1 | Detect-changes preflight |
| [04--context-retrieval](./04--context-retrieval/) | 2 | Context retrieval |
| [05--coverage-graph](./05--coverage-graph/) | 4 | Coverage graph |
| [06--mcp-tool-surface](./06--mcp-tool-surface/) | 1 | MCP tool surface |
| [08--doctor-code-graph](./08--doctor-code-graph/) | 1 | Doctor code graph |

Reality classification source: read-path freshness is half-auto because requested reads can run bounded repair, full scan/verify/status are manual, deep-loop convergence runs automatically inside command YAML, deep-loop upsert is conditional and deep-loop query/status are manual.

---

## 2. READ-PATH FRESHNESS

### Ensure code graph ready

#### Description

Shared readiness helper that detects empty, stale, full-scan and selective-reindex states and can run bounded selective repair on read paths. Called by query, context and verification surfaces as the read-path gate.

#### How It Works

Half-auto (class: half). Code graph freshness checks happen after a read invocation, not as a background watcher. Full-scan states are refused by query/context when inline full scans are disabled; the fallback is `code_graph_scan({ incremental:false })` or plain `rg`.

#### Source Files

See [`01--read-path-freshness/001-ensure-code-graph-ready.md`](01--read-path-freshness/001-ensure-code-graph-ready.md) for full implementation and source paths.

---

### Query self-heal

#### Description

Read-path self-heal inside `code_graph_query` that invokes the readiness helper with selective inline indexing allowed and full inline scans suppressed before answering structural queries.

#### How It Works

Half-auto (class: half). Self-heal runs only inside a requested `code_graph_query` call. When stale files exceed the selective threshold or Git HEAD changed, query blocks and tells the operator to run `code_graph_scan`.

#### Source Files

See [`01--read-path-freshness/002-query-self-heal.md`](01--read-path-freshness/002-query-self-heal.md) for full implementation and source paths.

---

## 3. MANUAL SCAN / VERIFY / STATUS

### code_graph_scan

#### Description

Explicit maintenance tool that scans workspace files, indexes structural nodes/edges with content-hash change detection, and optionally runs the gold-query verifier after explicit full scans.

#### How It Works

Manual (class: manual). Read paths may recommend it but do not run a broad full scan. `verify:true` only runs after `incremental:false`.

#### Source Files

See [`02--manual-scan-verify-status/003-code-graph-scan.md`](02--manual-scan-verify-status/003-code-graph-scan.md) for full implementation and source paths.

---

### code_graph_verify

#### Description

Diagnostic verification gate that runs the persisted gold-query battery against the current graph. Blocks on stale readiness and executes only when fresh.

#### How It Works

Manual (class: manual). Runs as an explicit MCP maintenance call or optional verification inside a full `code_graph_scan`. The handler refuses stale graphs.

#### Source Files

See [`02--manual-scan-verify-status/004-code-graph-verify.md`](02--manual-scan-verify-status/004-code-graph-verify.md) for full implementation and source paths.

---

### code_graph_status

#### Description

Read-only health probe that reports readiness, graph counts, parser health, edge drift and gold verification trust without mutating graph state.

#### How It Works

Manual diagnostic (class: manual). Uses a read-only readiness snapshot so status calls do not repair stale state. Does not perform scans, only reports current state.

#### Source Files

See [`02--manual-scan-verify-status/005-code-graph-status.md`](02--manual-scan-verify-status/005-code-graph-status.md) for full implementation and source paths.

---

## 4. DETECT-CHANGES PREFLIGHT

### detect_changes preflight

#### Description

Read-only diff preflight that maps unified-diff hunks to indexed symbols through line-range overlap. Refuses stale, empty, error or failed-verification graphs with `status:"blocked"` instead of false-safe empty impact.

#### How It Works

Manual (class: manual). Passes `allowInlineIndex:false` so it never silently indexes on the preflight path. Run `code_graph_scan` first when blocked.

#### Source Files

See [`03--detect-changes/006-detect-changes-preflight.md`](03--detect-changes/006-detect-changes-preflight.md) for full implementation and source paths.

---

## 5. CONTEXT RETRIEVAL

### code_graph_context

#### Description

LLM-oriented context retrieval surface that expands seeds (manual, graph) into compact graph neighborhoods with neighborhood, outline and impact modes while preserving readiness and partial-output metadata.

#### How It Works

Half-auto (class: half). The tool self-checks readiness on invocation but no ambient hook calls it automatically. Blocked responses omit graph answers and include `requiredAction:"code_graph_scan"`.

#### Source Files

See [`04--context-retrieval/007-code-graph-context.md`](04--context-retrieval/007-code-graph-context.md) for full implementation and source paths.

---

### Context handler

#### Description

Handler-level context assembly that normalizes manual/graph seeds, picks a query mode, enforces deadlines and routes blocked readiness before building compact graph context.

#### How It Works

Half-auto (class: half). Only triggered through `code_graph_context` dispatch. Can return partial output under deadline or budget pressure, so check `metadata.partialOutput` before treating responses as complete.

#### Source Files

See [`04--context-retrieval/008-context-handler.md`](04--context-retrieval/008-context-handler.md) for full implementation and source paths.

---

## 6. COVERAGE GRAPH

> **Note (arc 118):** The four `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools were removed in arc 118 (FULL_ISOLATE_NO_MCP). Each tool was replaced by a direct `.cjs` script entry point under `.opencode/skills/deep-loop-runtime/scripts/`. Catalog entries below are retained as historical reference; the script paths under each entry's "Current Reality" are the live invocation surface.

### deep_loop_graph_query

#### Description

Coverage-graph read tool for research/review deep-loop graph state. Inspects uncovered questions, unverified claims, contradictions, provenance chains, coverage gaps and hot nodes.

#### How It Works

Manual (class: manual). Direct `.cjs` invocation: `node .opencode/skills/deep-loop-runtime/scripts/query.cjs --spec-folder <path> --loop-type <review|research> --session-id <id>`. Reads are session-scoped.

#### Source Files

See [`05--coverage-graph/009-deep-loop-graph-query.md`](05--coverage-graph/009-deep-loop-graph-query.md) for historical implementation. Current surface: `.opencode/skills/deep-loop-runtime/scripts/query.cjs` (replaced MCP tool in arc 118).

---

### deep_loop_graph_status

#### Description

Session-scoped coverage-graph health report returning node/edge counts, relation breakdowns, signals and momentum for dashboards and synthesis checks.

#### How It Works

Manual (class: manual). Direct `.cjs` invocation: `node .opencode/skills/deep-loop-runtime/scripts/status.cjs ...`. Empty graphs return zero counts and null signals, so use upsert-enabled deep loops to populate graph events first.

#### Source Files

See [`05--coverage-graph/010-deep-loop-graph-status.md`](05--coverage-graph/010-deep-loop-graph-status.md) for historical implementation. Current surface: `.opencode/skills/deep-loop-runtime/scripts/status.cjs` (replaced MCP tool in arc 118).

---

### deep_loop_graph_upsert

#### Description

Coverage-graph write tool that stores nodes and edges for deep research/review loops. Called conditionally by command YAML when latest iteration `graphEvents` are present.

#### How It Works

Half-auto (class: half). Command-owned deep-research/deep-review YAML calls `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs` conditionally on `graphEvents`. No `graphEvents` means no upsert, and the workflow skip is intentional.

#### Source Files

See [`05--coverage-graph/011-deep-loop-graph-upsert.md`](05--coverage-graph/011-deep-loop-graph-upsert.md) for historical implementation. Current surface: `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` (replaced MCP tool in arc 118).

---

### deep_loop_graph_convergence

#### Description

Coverage-graph convergence tool that computes typed decisions (CONTINUE, STOP_ALLOWED, STOP_BLOCKED), signal values and blockers for deep research/review loops.

#### How It Works

Auto inside command workflows (class: auto). deep-research and deep-review YAML call `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` before the inline stop vote. Empty graphs return CONTINUE.

#### Source Files

See [`05--coverage-graph/012-deep-loop-graph-convergence.md`](05--coverage-graph/012-deep-loop-graph-convergence.md) for historical implementation. Current surface: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` (replaced MCP tool in arc 118).

---

## 7. MCP TOOL SURFACE

### Tool registrations

#### Description

MCP registration and dispatch surface for the `mk-code-index` runtime. Exposes `code_graph_*` and `detect_changes` names through the code graph dispatcher. Deep-loop coverage graph tools are no longer MCP tools; arc 118 replaced them with direct `.cjs` script entry points under `.opencode/skills/deep-loop-runtime/scripts/`.

#### How It Works

Manual (class: manual). Tool registration is availability, not automation. Schema validation rejects malformed tool calls before handler execution for registered names.

#### Source Files

See [`06--mcp-tool-surface/013-tool-registrations.md`](06--mcp-tool-surface/013-tool-registrations.md) for full implementation and source paths.

---

## 8. DOCTOR CODE GRAPH

### Doctor code-graph route policy

#### Description

`/doctor code-graph` command-owned diagnostic and repair policy surface. The route manifest exposes mutating flags (apply, prune, repair) while the current YAML keeps Phase A diagnostic-only and writes only packet-local scratch reports.

#### How It Works

Manual (class: manual). Triggered by slash command `/doctor code-graph` with flags (`--scope`, `--operation`, `--dry-run`, `--confirm`). The route manifest is marked `mutates` because it grants future apply flags, but the current YAML states Phase A is diagnostic-only.

#### Source Files

See [`08--doctor-code-graph/014-doctor-apply-mode.md`](08--doctor-code-graph/014-doctor-apply-mode.md) for full implementation and source paths.
