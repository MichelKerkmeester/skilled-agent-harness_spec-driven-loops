---
title: "Code Graph: Feature Catalog"
description: "Current feature inventory for the system-code-graph skill and mk-code-index MCP server, with source anchors for graph readiness, structural queries, structural tool tools, coverage graph references and doctor-code-graph policy."
trigger_phrases:
  - "system-code-graph feature catalog"
  - "mk-code-index feature catalog"
  - "code graph inventory"
  - "code graph runtime catalog"
importance_tier: "important"
version: 1.2.0.23
---

# Code Graph: Feature Catalog

<!-- Filename: lowercase per project convention; sk-doc template suggests feature_catalog.md but lowercase is intentional. -->

This catalog is the current feature inventory for `.opencode/skills/system-code-graph/mcp_server/`. Live MCP callers use the standalone `mk-code-index` namespace, exposed as `mcp__mk_code_index__*`. The stable tool IDs remain `code_graph_*` and `detect_changes`. Since the 028 MCP-to-CLI program, the same 8 tools are also available through the daemon-backed `node .opencode/bin/code-index.cjs` CLI, the dual-stack fallback when the MCP transport is down.

---

## 1. OVERVIEW

The catalog covers 18 runtime features across 8 groups. Per-feature files carry the implementation surface, trigger path, current automation class, fallback and cross-references.

**Feature-to-tool granularity (F013/F014).** The 17 runtime features (excluding the CLI fallback surface, which mirrors the whole tool set) map to **8 MCP tools** in the `mk-code-index` server because individual features often compose multiple operations on the same tool. For example, `code_graph_query` bundles the query operations `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to` and `blast_radius` under shared query features rather than one catalog entry per operation. Previously, the **coverage-graph deep-loop tools** (`deep_loop_graph_*`) were registered with the `mk-spec-memory` MCP server; they were removed in arc 118 (FULL_ISOLATE_NO_MCP) and now live as direct `.cjs` script entry points under `.opencode/skills/system-deep-loop/runtime/scripts/`. The catalog entries below are retained as historical reference and point at the current script paths.

| Group | Count | Scope |
| --- | ---: | --- |
| [read-path-freshness](./read_path_freshness/) | 2 | Read-path freshness |
| [manual-scan-verify-status](./manual_scan_verify_status/) | 3 | Manual scan / verify / status |
| [detect-changes](./detect_changes/) | 1 | Detect-changes preflight |
| [context-retrieval](./context_retrieval/) | 2 | Context retrieval |
| [coverage-graph](./coverage_graph/) | 4 | Coverage graph |
| [mcp-tool-surface](./mcp_tool_surface/) | 2 | Tool surface (MCP registration + daemon-backed CLI) |
| [doctor-code-graph](./doctor_code_graph/) | 1 | Doctor code graph |
| [edge-confidence-and-provenance](./edge_confidence_and_provenance/) | 3 | Edge confidence and provenance |

Reality classification source: read-path freshness is half-auto because requested reads can run bounded repair, full scan/verify/status are manual, deep-loop convergence runs automatically inside command YAML, deep-loop upsert is conditional and deep-loop query/status are manual. Edge confidence differentiation and edge evidence classification are manual write/read-time flag checks that only run inside a dispatched `code_graph_scan`/`code_graph_query`/`code_graph_context` call; seeded-PPR impact ranking is likewise manual, default-off, and its own benchmark verdict (CUT stands) means catalog presence documents tested code, not a shipping recommendation.

---

## 2. READ-PATH FRESHNESS

### Ensure code graph ready

#### Description

Shared readiness helper that detects empty, stale, full-scan and selective-reindex states and can run bounded selective repair on read paths. Called by query, context and verification surfaces as the read-path gate.

#### How It Works

Half-auto (class: half). Code graph freshness checks happen after a read invocation, not as a background watcher. Full-scan states are refused by query/context when inline full scans are disabled; the fallback is `code_graph_scan({ incremental:false })` or plain `rg`.

#### Source Files

See [`read-path-freshness/ensure-code-graph-ready.md`](read_path_freshness/ensure_code_graph_ready.md) for full implementation and source paths.

---

### Query self-heal

#### Description

Read-path self-heal inside `code_graph_query` that invokes the readiness helper with selective inline indexing allowed and full inline scans suppressed before answering structural queries.

#### How It Works

Half-auto (class: half). Self-heal runs only inside a requested `code_graph_query` call. When stale files exceed the selective threshold or Git HEAD changed, query blocks and tells the operator to run `code_graph_scan`.

#### Source Files

See [`read-path-freshness/query-self-heal.md`](read_path_freshness/query_self_heal.md) for full implementation and source paths.

---

## 3. MANUAL SCAN / VERIFY / STATUS

### code_graph_scan

#### Description

Explicit maintenance tool that scans workspace files, indexes structural nodes/edges with content-hash change detection, and optionally runs the gold-query verifier after explicit full scans.

#### How It Works

Manual (class: manual). Read paths may recommend it but do not run a broad full scan. `verify:true` only runs after `incremental:false`.

#### Source Files

See [`manual-scan-verify-status/code-graph-scan.md`](manual_scan_verify_status/code_graph_scan.md) for full implementation and source paths.

---

### code_graph_verify

#### Description

Diagnostic verification gate that runs the persisted gold-query battery against the current graph. Blocks on stale readiness and executes only when fresh.

#### How It Works

Manual (class: manual). Runs as an explicit MCP maintenance call or optional verification inside a full `code_graph_scan`. The handler refuses stale graphs.

#### Source Files

See [`manual-scan-verify-status/code-graph-verify.md`](manual_scan_verify_status/code_graph_verify.md) for full implementation and source paths.

---

### code_graph_status

#### Description

Read-only health probe that reports readiness, graph counts, parser health, edge drift and gold verification trust without mutating graph state.

#### How It Works

Manual diagnostic (class: manual). Uses a read-only readiness snapshot so status calls do not repair stale state. Does not perform scans, only reports current state.

#### Source Files

See [`manual-scan-verify-status/code-graph-status.md`](manual_scan_verify_status/code_graph_status.md) for full implementation and source paths.

---

## 4. DETECT-CHANGES PREFLIGHT

### detect_changes preflight

#### Description

Read-only diff preflight that maps unified-diff hunks to indexed symbols through line-range overlap. Refuses stale, empty, error or failed-verification graphs with `status:"blocked"` instead of false-safe empty impact.

#### How It Works

Manual (class: manual). Passes `allowInlineIndex:false` so it never silently indexes on the preflight path. Run `code_graph_scan` first when blocked.

#### Source Files

See [`detect-changes/detect-changes-preflight.md`](detect_changes/detect_changes_preflight.md) for full implementation and source paths.

---

## 5. CONTEXT RETRIEVAL

### code_graph_context

#### Description

LLM-oriented context retrieval surface that expands seeds (manual, graph) into compact graph neighborhoods with neighborhood, outline and impact modes while preserving readiness and partial-output metadata.

#### How It Works

Half-auto (class: half). The tool self-checks readiness on invocation but no ambient hook calls it automatically. Blocked responses omit graph answers and include `requiredAction:"code_graph_scan"`.

#### Source Files

See [`context-retrieval/code-graph-context.md`](context_retrieval/code_graph_context.md) for full implementation and source paths.

---

### Context handler

#### Description

Handler-level context assembly that normalizes manual/graph seeds, picks a query mode, enforces deadlines and routes blocked readiness before building compact graph context.

#### How It Works

Half-auto (class: half). Only triggered through `code_graph_context` dispatch. Can return partial output under deadline or budget pressure, so check `metadata.partialOutput` before treating responses as complete.

#### Source Files

See [`context-retrieval/context-handler.md`](context_retrieval/context_handler.md) for full implementation and source paths.

---

## 6. COVERAGE GRAPH

> **Note (arc 118):** The four `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools were removed in arc 118 (FULL_ISOLATE_NO_MCP). Each tool was replaced by a direct `.cjs` script entry point under `.opencode/skills/system-deep-loop/runtime/scripts/`. Catalog entries below are retained as historical reference; the script paths under each entry's "Current Reality" are the live invocation surface.

### deep_loop_graph_query

#### Description

Coverage-graph read tool for research/review deep-loop graph state. Inspects uncovered questions, unverified claims, contradictions, provenance chains, coverage gaps and hot nodes.

#### How It Works

Manual (class: manual). Direct `.cjs` invocation: `node .opencode/skills/system-deep-loop/runtime/scripts/query.cjs --spec-folder <path> --loop-type <review|research> --session-id <id>`. Reads are session-scoped.

#### Source Files

See [`coverage-graph/deep-loop-graph-query.md`](coverage_graph/deep_loop_graph_query.md) for historical implementation. Current surface: `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` (replaced MCP tool in arc 118).

---

### deep_loop_graph_status

#### Description

Session-scoped coverage-graph health report returning node/edge counts, relation breakdowns, signals and momentum for dashboards and synthesis checks.

#### How It Works

Manual (class: manual). Direct `.cjs` invocation: `node .opencode/skills/system-deep-loop/runtime/scripts/status.cjs ...`. Empty graphs return zero counts and null signals, so use upsert-enabled deep loops to populate graph events first.

#### Source Files

See [`coverage-graph/deep-loop-graph-status.md`](coverage_graph/deep_loop_graph_status.md) for historical implementation. Current surface: `.opencode/skills/system-deep-loop/runtime/scripts/status.cjs` (replaced MCP tool in arc 118).

---

### deep_loop_graph_upsert

#### Description

Coverage-graph write tool that stores nodes and edges for deep research/review loops. Called conditionally by command YAML when latest iteration `graphEvents` are present.

#### How It Works

Half-auto (class: half). Command-owned deep-research/deep-review YAML calls `node .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` conditionally on `graphEvents`. No `graphEvents` means no upsert, and the workflow skip is intentional.

#### Source Files

See [`coverage-graph/deep-loop-graph-upsert.md`](coverage_graph/deep_loop_graph_upsert.md) for historical implementation. Current surface: `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` (replaced MCP tool in arc 118).

---

### deep_loop_graph_convergence

#### Description

Coverage-graph convergence tool that computes typed decisions (CONTINUE, STOP_ALLOWED, STOP_BLOCKED), signal values and blockers for deep research/review loops.

#### How It Works

Auto inside command workflows (class: auto). deep-research and deep-review YAML call `node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` before the inline stop vote. Empty graphs return CONTINUE.

#### Source Files

See [`coverage-graph/deep-loop-graph-convergence.md`](coverage_graph/deep_loop_graph_convergence.md) for historical implementation. Current surface: `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` (replaced MCP tool in arc 118).

---

## 7. MCP TOOL SURFACE

### Tool registrations

#### Description

MCP registration and dispatch surface for the `mk-code-index` runtime. Exposes `code_graph_*` and `detect_changes` names through the code graph dispatcher. Deep-loop coverage graph tools are no longer MCP tools; arc 118 replaced them with direct `.cjs` script entry points under `.opencode/skills/system-deep-loop/runtime/scripts/`.

#### How It Works

Manual (class: manual). Tool registration is availability, not automation. Schema validation rejects malformed tool calls before handler execution for registered names.

#### Source Files

See [`mcp-tool-surface/tool-registrations.md`](mcp_tool_surface/tool_registrations.md) for full implementation and source paths.

---

### code-index CLI fallback surface

#### Description

Daemon-backed CLI over the unchanged mk-code-index daemon, shipped by the 028 MCP-to-CLI program. `node .opencode/bin/code-index.cjs` exposes the same 8 tools through a manifest generated from `CODE_GRAPH_TOOL_SCHEMAS` and is the transport-down fallback when the MCP registration is unavailable; the repaired `mk-code-graph` OpenCode bridge routes over it instead of in-process dist/DB imports.

#### How It Works

Manual (class: manual). The shim guards stale dist with exit 69 (`SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1` overrides in development) and defaults the socket dir to `/tmp/mk-code-index`. The entrypoint validates argv with `validateToolArgs()` parity plus schema-driven numeric/boolean coercion (unparseable values exit 64; range clamping stays handler-owned), preserves `status:"blocked"` readiness refusals as actionable exit-0 answers with `requiredAction` in JSON and text renderings, auto-spawns over IPC unless `--warm-only` (exit 75 when the backend is unavailable), and maps exits to the shared 0/1/64/69/75 taxonomy.

#### Source Files

See [`mcp-tool-surface/code-index-cli.md`](mcp_tool_surface/code_index_cli.md) for full implementation and source paths.

---

## 8. DOCTOR CODE GRAPH

### Doctor code-graph route policy

#### Description

`/doctor code-graph` command-owned diagnostic and repair policy surface. The route manifest exposes mutating flags (apply, prune, repair) while the current YAML keeps Phase A diagnostic-only and writes only packet-local scratch reports.

#### How It Works

Manual (class: manual). Triggered by slash command `/doctor code-graph` with flags (`--scope`, `--operation`, `--dry-run`, `--confirm`). The route manifest is marked `mutates` because it grants future apply flags, but the current YAML states Phase A is diagnostic-only.

#### Source Files

See [`doctor-code-graph/doctor-apply-mode.md`](doctor_code_graph/doctor_apply_mode.md) for full implementation and source paths.

---

## 9. EDGE CONFIDENCE AND PROVENANCE

### Edge confidence differentiation

#### Description

Opt-in `CALLS` edge write-path differentiation (`SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, default off) that replaces the legacy uniform `0.8/INFERRED/heuristic` tier with resolution-specific confidence and evidence class for same-file and cross-file call resolution.

#### How It Works

Manual (class: manual). The flag is a write-time check inside `code_graph_scan`; existing persisted edge metadata only changes when a symbol's `CALLS` edges are rewritten by a subsequent scan.

#### Source Files

See [`edge-confidence-and-provenance/edge-confidence-differentiation.md`](edge_confidence_and_provenance/edge_confidence_differentiation.md) for full implementation and source paths.

---

### Edge evidence classification

#### Description

Shared read-path classification across `code_graph_query`, `code_graph_scan` and `code_graph_context` that recognizes `AMBIGUOUS` evidence class as weak evidence alongside `INFERRED`, and scopes the edge-confidence-differentiation flag-off legacy-tier substitution strictly to `CALLS` edges.

#### How It Works

Manual (class: manual). Classification runs inline inside each handler's response formatting whenever the parent tool is dispatched; there is no separate trigger.

#### Source Files

See [`edge-confidence-and-provenance/edge-evidence-classification.md`](edge_confidence_and_provenance/edge_evidence_classification.md) for full implementation and source paths.

---

### Seeded PPR impact ranking

#### Description

Default-off seeded Personalized PageRank ranking mode (`SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`) for `code_graph_context`'s `impact` query mode, recovered from git history to re-benchmark against a real edge-confidence gradient. Verdict: CUT stands, and the gap widened -- not intended to ship enabled.

#### How It Works

Manual (class: manual). Only triggered through `code_graph_context({queryMode: "impact"})` with the flag on; the flag is read per-call, so toggling it changes the very next `impact`-mode call with no restart required.

#### Source Files

See [`edge-confidence-and-provenance/seeded-ppr-impact-ranking.md`](edge_confidence_and_provenance/seeded_ppr_impact_ranking.md) for full implementation and source paths.
