---
title: "System Code Graph Readiness and Scope Fingerprint"
description: "Readiness state machine (fresh/stale/blocked/empty/absent), trust state, and scope-fingerprint contract that read-path tools enforce."
trigger_phrases:
  - "code-graph readiness"
  - "scope fingerprint"
  - "code-graph blocked"
  - "code-graph stale"
  - "trust state"
---

# System Code Graph Readiness and Scope Fingerprint

The state machine that gates every read-path tool plus the fingerprint that detects scope drift between scans.

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

### Core principle

The read path refuses to answer on non-fresh graphs. A `blocked` payload with an explicit `requiredAction` is the contract — never a silently-empty result. This false-safe guarantee prevents agents from acting on partial structural state.

### Why two signals (readiness + trust state)

- **Readiness** answers "does the graph reflect current workspace state."
- **Trust state** answers "did the graph pass its gold-query battery recently."

Both must be acceptable before a tool returns authoritative output. A graph can be `fresh` but `untrusted` if it has not been verified since a structural change.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-readiness-states -->
## 2. READINESS STATES

| State | Meaning | Read-path Behavior |
|---|---|---|
| `fresh` | Graph reflects current workspace. Recent scan, content hashes match, scope fingerprint unchanged. | Tools answer normally. |
| `stale` | Workspace changed since last scan. Soft-stale: incremental rescan can self-heal. Hard-stale: too many changes, full rescan needed. | Read tools return `blocked` with `requiredAction: "code_graph_scan"`. |
| `blocked` | Explicit refusal payload from a tool. Returned when readiness is not `fresh`, scope fingerprint mismatches, or trust state requires re-verification. | Tools return the blocked payload with `readiness`, `requiredAction`, `lastPersistedAt`. |
| `empty` | Graph has zero indexed nodes. Either uninitialized or after a destructive operation. | Tools return `blocked` with `requiredAction: "code_graph_scan"`. |
| `absent` | No graph database exists yet. | `code_graph_status` returns `absent`; read tools return `blocked` with `requiredAction: "code_graph_scan"`. |
| `error` | Database corrupt, schema mismatch, or unrecoverable parse failure. | Tools return `blocked` with `requiredAction` pointing to `code_graph_apply` recovery operation. |

---

<!-- /ANCHOR:2-readiness-states -->

<!-- ANCHOR:3-trust-state -->
## 3. TRUST STATE

Companion signal that marks whether the gold-query verification battery passed recently.

| Trust State | Meaning | Operator Action |
|---|---|---|
| `verified` | Last `code_graph_verify` run passed within trust window. | Proceed; trust is fresh. |
| `unverified` | Graph is fresh but verification has not been run since the last meaningful change. | Run `code_graph_verify` before acting on high-stakes queries. |
| `quarantined` | Verification failed; parser errors accumulated past threshold; or apply-mode rolled back a bad apply. | Diagnose via `parserHealth` in `code_graph_status`; use `code_graph_apply` repair operations. |

`code_graph_status` returns both `readiness` and `trustState` in one call. Treat them as independent dimensions: a `fresh + quarantined` graph can answer structural reads but should not be trusted for verification-gated decisions.

---

<!-- /ANCHOR:3-trust-state -->

<!-- ANCHOR:4-scope-fingerprint -->
## 4. SCOPE FINGERPRINT

### What it is

A hash of the scan inputs:

- Include / exclude glob patterns.
- `SPECKIT_CODE_GRAPH_INDEX_SKILLS`, `INDEX_AGENTS`, `INDEX_COMMANDS`, `INDEX_SPECS`, `INDEX_PLUGINS` env flags (or per-call equivalents).
- Maintainer mode.

The fingerprint is computed at scan time and stored alongside the graph. Every read-path call recomputes the fingerprint of the **current** scan inputs and compares.

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

<!-- /ANCHOR:4-scope-fingerprint -->

<!-- ANCHOR:5-typical-flows -->
## 5. TYPICAL FLOWS

### Cold start

```text
code_graph_status         → readiness: "absent"
code_graph_scan           → returns scan metadata, readiness flips to "fresh"
code_graph_query / ...    → answers normally
code_graph_verify         → trustState flips to "verified"
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

<!-- /ANCHOR:5-typical-flows -->

<!-- ANCHOR:6-related-resources -->
## 6. RELATED RESOURCES

- `code-graph-readiness-check.md` — `ensureCodeGraphReady()` implementation contract used by handlers.
- `tool-surface.md` — which of the 11 tools are gated by readiness.
- `database-path-policy.md` — where the readiness marker and graph DB live.

<!-- /ANCHOR:6-related-resources -->
