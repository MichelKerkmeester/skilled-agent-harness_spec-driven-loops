---
title: "Graph degraded stress cell with SPEC_KIT_DB_DIR isolation"
description: "Deterministic vitest sweep that exercises all four fallbackDecision branches of the code-graph query path without touching the live code-graph.sqlite, using initDb(tmpdir), vi.spyOn(getDb), and a sha256 byte-equality guard."
trigger_phrases:
  - "graph degraded stress cell with SPEC_KIT_DB_DIR isolation"
  - "code-graph-degraded-sweep"
  - "fallbackDecision vitest sweep"
  - "SPEC_KIT_DB_DIR isolation"
  - "sha256 byte-equality guard"
version: 3.6.0.6
---

# Graph degraded stress cell with SPEC_KIT_DB_DIR isolation

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

A deterministic vitest sweep that exercises all four `fallbackDecision` branches of the code-graph query path without touching the live `code-graph.sqlite`, using `initDb(tmpdir)`, `vi.spyOn(getDb)`, and a sha256 byte-equality guard.

The sweep exists to close the v1.0.2 NEUTRAL verdict on the fast-fail handler. Each of the four buckets (empty graph, broad-stale graph, readiness exception, fresh graph) sets up its own tmpdir, swaps the database singleton via `initDb(tempDir)`, and pins `process.cwd()` so the readiness-debounce cache key stays unique per test. A dedicated guard test in the same suite computes a sha256 over the live `code-graph.sqlite` before and after the sweep and fails if the bytes differ, which proves the isolation pattern works rather than asserting it from documentation alone.

---

## 2. HOW IT WORKS

### Core Behavior


Test isolation uses three building blocks. `initDb(tempDir)` swaps the singleton database connection to a fresh sqlite file inside a per-test tmpdir, so any write the handler performs lands in disposable storage. `vi.spyOn(getDb)` redirects the production handler's database accessor to the swapped connection without modifying the handler source. `vi.spyOn(process, 'cwd')` returns a unique value per test so the readiness-debounce cache, which keys on cwd, never serves a stale entry from a previous bucket.

### Quality Gates & Validation


Total suite runtime is under 1 second when deterministic. A regression that allows the sweep to fall back to live I/O typically blows the runtime budget by 5x or more, so suite timing is itself a signal that isolation broke even before the sha256 check fires.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/graph-degraded-stress-cell-isolation.md` | Manual playbook | Playbook scenario 279 covering bucket routing, live-DB byte-equality, and suite runtime budget |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/graph-degraded-stress-cell-isolation.md`
Related references:
- [mcp-daemon-rebuild-restart-live-probe.md](../../feature-catalog/tooling-and-scripts/mcp-daemon-rebuild-restart-live-probe.md) — MCP daemon rebuild, restart, and live-probe protocol
- [embedder-list-registry-inventory.md](../../feature-catalog/tooling-and-scripts/embedder-list-registry-inventory.md) — Embedder list registry inventory
