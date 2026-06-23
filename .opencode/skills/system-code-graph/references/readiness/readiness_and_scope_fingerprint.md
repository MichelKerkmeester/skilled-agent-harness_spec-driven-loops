---
title: "System Code Graph Readiness and Scope Fingerprint"
description: "Readiness state machine (fresh/stale/blocked/empty/absent), trust state, and scope-fingerprint contract that read-path tools enforce."
trigger_phrases:
  - "code-graph readiness"
  - "scope fingerprint"
  - "code-graph blocked"
  - "code-graph stale"
  - "trust state"
importance_tier: "important"
contextType: "implementation"
version: 1.2.0.6
---

# System Code Graph Readiness and Scope Fingerprint

The state machine that gates every read-path tool plus the fingerprint that detects scope drift between scans.

---

## 1. OVERVIEW

### Purpose

Describe the readiness state machine, trust state, and scope fingerprint that decide whether structural graph reads can answer.

### When to Use

- A `code_graph_*` read returns `blocked`, `stale`, `empty`, `absent`, or `error`.
- A scan scope change triggers a fingerprint mismatch.
- A high-stakes query needs trust-state interpretation before edits.

### Core Principle

The read path refuses to answer on non-fresh graphs. A `blocked` payload with an explicit `requiredAction` is the contract — never a silently-empty result. This false-safe guarantee prevents agents from acting on partial structural state.

### Key Sources

- `mcp_server/lib/readiness-contract.ts`
- `mcp_server/lib/ensure-ready.ts`
- `mcp_server/handlers/status.ts`

### Why two signals (readiness + verification trust)

- **Readiness** answers "does the graph reflect current workspace state."
- **Verification trust** answers "did the graph pass its gold-query battery recently."

Both must be acceptable before verification-gated decisions proceed. A graph can be `fresh` while `goldVerificationTrust` is `absent` or `stale` if it has not been verified since a structural change.

---

## 2. READINESS STATES

This table mixes the top-level freshness enum with derived projections for read convenience. The canonical top-level `GraphFreshness` enum (`mcp_server/lib/readiness-contract.ts`) is exactly four values: `fresh`, `stale`, `empty`, `error`. `blocked` is a read-tool refusal payload, not a freshness value; `absent` is a trust-state projection of an `empty` graph, not a freshness value.

| State | Meaning | Read-path Behavior |
|---|---|---|
| `fresh` | Graph reflects current workspace. Recent scan, content hashes match, scope fingerprint unchanged. | Tools answer normally. |
| `stale` | Workspace changed since last scan. Soft-stale: incremental rescan can self-heal. Hard-stale: too many changes, full rescan needed. | Read tools return `blocked` with `requiredAction: "code_graph_scan"`. |
| `blocked` | Explicit refusal payload from a tool. Returned when readiness is not `fresh`, scope fingerprint mismatches, or `goldVerificationTrust` requires re-verification. | Tools return the blocked payload with `readiness`, `requiredAction`, `lastPersistedAt`. |
| `empty` | Graph has zero indexed nodes. Either uninitialized or after a destructive operation. | Tools return `blocked` with `requiredAction: "code_graph_scan"`. |
| `absent` | Trust-state projection of an `empty` graph (e.g. no graph database exists yet) — NOT a top-level freshness/readiness value. | OR-8-01: a missing DB surfaces as top-level `freshness: empty` / `canonicalReadiness: missing` / `trustState: absent`; `code_graph_status` never returns a top-level readiness of `absent`. Read tools return `blocked` with `requiredAction: "code_graph_scan"`. |
| `error` | Database corrupt, schema mismatch, or unrecoverable parse failure. | Tools return `blocked` with `requiredAction` pointing to `code_graph_apply` recovery operation. |

---

## 3. TRUST STATE AND GOLD VERIFICATION TRUST

`code_graph_status` returns two separate status axes:

| Field | Runtime Values | Meaning | Operator Action |
|---|---|---|---|
| `trustState` | `live` / `stale` / `absent` / `unavailable` | Freshness-derived projection from `mcp_server/lib/readiness-contract.ts`. `fresh` maps to `live`, `stale` maps to `stale`, `empty` maps to `absent`, and `error` maps to `unavailable`. | Use with `readiness` to decide whether read-path tools can answer. |
| `goldVerificationTrust` | `live` / `stale` / `absent` | Gold-query verification freshness from `mcp_server/handlers/status.ts`. `live` means the last verification exists, passed, and is within the trust window; `stale` means the verification is failed, old, or attached to a non-fresh graph; `absent` means no verification record exists. | Run `code_graph_verify` before high-stakes or verification-gated decisions when this is not `live`. |

Parser quarantine is a separate health signal surfaced through `parserHealth`, `parserSkipList`, and related status metadata; it is not a `trustState` value.

---

## 4. SCOPE FINGERPRINT

### What it is

A hash of the scan inputs:

- Include / exclude glob patterns.
- `SPECKIT_CODE_GRAPH_INDEX_SKILLS`, `INDEX_AGENTS`, `INDEX_COMMANDS`, `INDEX_SPECS`, `INDEX_PLUGINS` env flags (or per-call equivalents).
- Maintainer mode.

The fingerprint is computed at scan time and stored alongside the graph. Every read-path call recomputes the fingerprint of the **current** scan inputs and compares.

**Per-call exception (FIX-009-v3):** when the stored scope came from an explicit per-call scan (`source: 'scan-argument'`, e.g. `code_graph_scan({ includeSkills: false })`), the read path trusts that stored scope and does NOT block on env-vs-stored fingerprint drift. The index contains exactly what the caller last requested, so a later env-flag change does not invalidate read-after-scan. Env/default-sourced scopes still block on mismatch.

### When it matters

Fingerprint mismatch means: "this graph was indexed under a different scope, so its answers may not reflect what you would see now." The read path returns `blocked` with a fingerprint-delta hint, even if the graph is otherwise `fresh`.

### Resolution paths

| Situation | Resolution |
|---|---|
| Operator widened scope (e.g. enabled `INDEX_SKILLS`) | `code_graph_scan` with the new flags. Incremental is fine for additive scope. |
| Operator narrowed scope | Full scan with `incremental: false`. Cannot incrementally shrink. |
| Two scans want different scopes (e.g. maintainer mode vs end-user mode) | Pick one canonical scope per workspace; do not alternate. Maintainer mode forces all `INDEX_*` to true; alternating with end-user mode (all false) thrashes the fingerprint. |
| Forced replacement of populated graph from a different scope | Pass `forceScopeChange: true` to `code_graph_scan`. Operator opt-in required. |

---

## 5. TYPICAL FLOWS

### Cold start

```text
code_graph_status         → readiness: "absent"
code_graph_scan           → returns scan metadata, readiness flips to "fresh"
code_graph_query / ...    → answers normally
code_graph_verify         → goldVerificationTrust flips to "live"
```

### After a small refactor

```text
code_graph_status         → readiness: "stale" (soft-stale)
code_graph_scan           → incremental, ~seconds
code_graph_query / ...    → answers normally
```

### After a scope widening

```text
SPECKIT_CODE_GRAPH_INDEX_SKILLS=true (newly enabled)
code_graph_status         → readiness: "stale" + scope fingerprint mismatch
code_graph_scan           → incremental scan with new flag; fingerprint updates
code_graph_query / ...    → answers normally over the widened scope
```

### After a destructive operation

```text
code_graph_status         → readiness: "empty" or "error"
code_graph_apply { operation: "recover-sqlite-corruption" }  → repairs DB
code_graph_scan { incremental: false, persistBaseline: true } → rebuilds graph
code_graph_verify         → re-establishes trust
```

---

## 6. RELATED RESOURCES

- [`code_graph_readiness_check.md`](code_graph_readiness_check.md) — `ensureCodeGraphReady()` implementation contract used by handlers.
- [`../runtime/tool_surface.md`](../runtime/tool_surface.md) — which of the 8 tools are gated by readiness.
- [`../config/database_path_policy.md`](../config/database_path_policy.md) — where the readiness marker and graph DB live.
