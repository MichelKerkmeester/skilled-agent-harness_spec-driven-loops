---
title: "Graph degraded stress cell with SPEC_KIT_DB_DIR isolation"
description: "Deterministic vitest sweep that exercises all four fallbackDecision branches of the code-graph query path without touching the live code-graph.sqlite, using initDb(tmpdir), vi.spyOn(getDb), and a sha256 byte-equality guard."
---

# Graph degraded stress cell with SPEC_KIT_DB_DIR isolation

---

## 1. OVERVIEW

A deterministic vitest sweep that exercises all four `fallbackDecision` branches of the code-graph query path without touching the live `code-graph.sqlite`, using `initDb(tmpdir)`, `vi.spyOn(getDb)`, and a sha256 byte-equality guard.

The sweep exists to close the v1.0.2 NEUTRAL verdict on the fast-fail handler. Each of the four buckets (empty graph, broad-stale graph, readiness exception, fresh graph) sets up its own tmpdir, swaps the database singleton via `initDb(tempDir)`, and pins `process.cwd()` so the readiness-debounce cache key stays unique per test. A dedicated guard test in the same suite computes a sha256 over the live `code-graph.sqlite` before and after the sweep and fails if the bytes differ, which proves the isolation pattern works rather than asserting it from documentation alone.

---

## 2. CURRENT REALITY

The sweep lives at `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`. It runs four routing buckets end-to-end against the production query path. The empty and broad-stale buckets route to `nextTool: "code_graph_scan"`, the readiness exception bucket routes to `nextTool: "rg"`, and the fresh bucket produces no `fallbackDecision` because the graph is healthy.

Test isolation uses three building blocks. `initDb(tempDir)` swaps the singleton database connection to a fresh sqlite file inside a per-test tmpdir, so any write the handler performs lands in disposable storage. `vi.spyOn(getDb)` redirects the production handler's database accessor to the swapped connection without modifying the handler source. `vi.spyOn(process, 'cwd')` returns a unique value per test so the readiness-debounce cache, which keys on cwd, never serves a stale entry from a previous bucket.

The live-DB guard test is the integration anchor. It runs `shasum -a 256` over `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` before the sweep, captures the digest, runs the four bucket assertions, then re-runs `shasum` and asserts byte-equality. If the digest diverges, the isolation pattern broke somewhere and the test fails closed. If the live DB is missing entirely, the guard test no-ops, which is a separate failure mode the operator must catch.

Total suite runtime is under 1 second when deterministic. A regression that allows the sweep to fall back to live I/O typically blows the runtime budget by 5x or more, so suite timing is itself a signal that isolation broke even before the sha256 check fires.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | Handler | Implements the production `buildGraphQueryPayload()` path that the sweep exercises and the `fallbackDecision` matrix that the four buckets assert against |
| `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts` | Lib | Implements `detectState()` and the readiness-debounce cache that each bucket isolates via `vi.spyOn(process, 'cwd')` |

### Validation And Tests

| File | Focus |
|------|-------|
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | Four-bucket fallbackDecision sweep plus the live-DB sha256 byte-equality guard test |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/279-graph-degraded-stress-cell-isolation.md` | Playbook scenario 279 covering bucket routing, live-DB byte-equality, and suite runtime budget |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/43-graph-degraded-stress-cell-isolation.md`
