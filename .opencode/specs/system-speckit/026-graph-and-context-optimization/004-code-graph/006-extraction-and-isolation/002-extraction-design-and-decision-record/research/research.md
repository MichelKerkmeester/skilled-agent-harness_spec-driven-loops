# Deep Research Synthesis: Code-Graph Extraction

**Spec folder**: `015-design-and-decision-record`  
**Research started**: 2026-05-14  
**Converged**: Yes (3 iterations, all 8 questions answered)  
**Stop reason**: All architectural questions answered; sufficient evidence for ADR-001

---

## 1. Research Question Summary

| Q# | Question | Answer | Iteration |
|----|----------|--------|-----------|
| Q1 | Touchpoint inventory | 280+ touchpoints confirmed (baseline 244+) | 1, 2, 3 |
| Q2 | DB extraction shape | DB moves with skill, env fallback | 3 (ADR-001) |
| Q3 | MCP server topology | Co-resident with spec_kit_memory | 3 (ADR-001) |
| Q4 | Tool-id stability | Preserve code_graph_*/ccc_* stable | 3 (ADR-001) |
| Q5 | Cross-subsystem import direction | Sibling-skill imports | 3 (ADR-001) |
| Q6 | Plugin bridge disposition | Move code-graph-specific, shared schema stays | 3 |
| Q7 | Implementation phase decomposition | Confirm 002-006 sequence | 3 (ADR-001) |
| Q8 | Risk catalog | 6 risks with detection + mitigation + rollback | 3 (ADR-001) |

## 2. Touchpoint Inventory (Q1)

### Confirmed Counts vs Pre-Research Baseline

| Category | Baseline | Verified | Delta |
|----------|----------|----------|-------|
| code_graph/ source files (TS) | ~50 | 71 | +21 (includes tools/, barrel exports, utils) |
| code_graph/ docs (MD) | ~42 | 37 | -5 (baseline over-counted) |
| code_graph/ tests | 28 | 32 | +4 (includes README, gold-queries.json, .test-d.ts) |
| Stress tests | 1 | 6 | +5 (degraded-sweep, context-stress, scan-stress, ccc-integration, detect-changes) |
| External tests importing code-graph | 0 | 9 | +9 |
| Cross-subsystem handlers | 5 | 5 | Confirmed |
| Hooks | 6 | 6 | Confirmed |
| Agent files | 7 | 10 | +3 (.codex variants) |
| Command files | 5 | 8 | +3 (doctor sub-files) |
| Top-level docs | 4 | 4 | Confirmed |
| system-spec-kit refs | 3 | 3 | Confirmed |
| Skill cross-refs | 3 | 3 | Confirmed |
| Constitutional | 1 | 1 | Confirmed |
| Feature catalog cat-22 | 33 | 33 | Confirmed |
| Manual playbook cat-22 | 30 | 30 | Confirmed |
| Plugin bridges | 3 | 4 | +1 (includes plugin .js itself) |
| Database files | 3 | 3 | Confirmed |
| Scripts | 2 | 3 | +1 (session-snapshot.ts) |
| opencode.json | 1 | 1 | Confirmed |
| vitest.config.ts | 1 | 1 | Confirmed |
| **Total** | **~244** | **~280** | **+36** |

### Key Discoveries Not In Baseline

1. **6 stress test files** under `stress_test/code-graph/` (baseline assumed 1)
2. **9 external test files** under `mcp_server/tests/` that import code-graph symbols (baseline did not enumerate)
3. **session-snapshot.ts** imports `getStats()` and `getGraphFreshness()` from code-graph (previously missed)
4. **skill_advisor/bench/code-graph-parse-latency.bench.ts** imports `parseFile()` from code-graph (bench, not functional import)
5. **skill_advisor/lib/freshness/trust-state.ts** type-exports `GraphFreshness` from code-graph (type-only)
6. **Plugin .js file** at `.opencode/plugins/spec-kit-compact-code-graph.js` — previously the baseline listed only the 2 .mjs bridge siblings
7. **3 doctor command sub-files** (`_routes.yaml`, `doctor_code-graph.yaml`, `update.md`) — baseline listed only the main doctor.md

## 3. Architectural Decision Analysis

### Q2: DB Extraction Shape

**Three candidates evaluated:**

| Criterion | (a) Shared DB dir | (b) Moved with env fallback | (c) Env-driven shared root |
|-----------|-------------------|---------------------------|---------------------------|
| Ownership clarity | 1 — coupled | 5 — clear | 4 — clear but implicit |
| Migration complexity | 5 — no change | 3 — copy-on-first-run | 2 — config required always |
| WAL conflict risk | 1 — possible | 5 — isolated | 4 — isolated if env differs |
| Test isolation | 2 — shared state | 5 — env override clean | 5 — env override clean |
| Backwards compat | 4 — old path works | 3 — migration step needed | 2 — requires env var |
| Config surface | 5 — no new config | 4 — optional env var | 3 — mandatory env var |
| **Total** | **18/30** | **25/30** | **20/30** |

**Decision**: (b) DB moves to `.opencode/skills/system-code-graph/database/` with `SPECKIT_CODE_GRAPH_DB_DIR` env override for tests/CI.

### Q3: MCP Server Topology

**Two candidates evaluated:**

| Criterion | Co-resident (accepted) | Own-process standalone |
|-----------|----------------------|------------------------|
| Startup cost | 5 — zero overhead | 2 — 2-5s added cold-start |
| Dispatch latency | 5 — direct function call | 3 — MCP round-trip |
| Runtime config friction | 5 — no changes | 2 — 4 configs need new entry |
| ABI stability | 4 — same process, shared Node | 5 — isolated |
| Consumer break risk | 5 — 0 consumer path changes | 2 — startup-brief, hooks break |
| Test compat | 5 — 28 tests unchanged | 2 — need MCP harness rewrite |
| DB access | 4 — co-resident SQLite read | 3 — cross-process (SQLite single-writer) |
| **Total** | **33/35** | **19/35** |

**Decision**: Co-resident. The code-graph doesn't need process isolation — it's read-heavy, shares no write-conflicted resources with memory, and already tested co-resident. Own-process would break startup-brief (hooks build briefs from local SQLite), require 4 runtime config changes, and add launcher duplication.

### Q4: Tool-id Stability

**Two candidates evaluated:**

| Criterion | Preserve code_graph_*/ccc_* (accepted) | Migrate to system_code_graph.* |
|-----------|--------------------------------------|-------------------------------|
| Consumer break risk | 5 — zero breakage | 1 — 10 agents, 8 commands, 6 hooks, 30+ tests, doctor |
| Backwards compat path | 5 — transparent | 2 — deprecation bridge needed |
| Discoverability | 4 — already known names | 5 — new namespace signals ownership |
| Implementation effort | 5 — no changes | 1 — rename + bridge + docs |
| Precedent consistency | 4 — mirrors advisor_* | 3 — new convention |
| **Total** | **23/25** | **12/25** |

**Decision**: Preserve stable. The precedent (advisor_* tools kept stable during extraction) demonstrates the pattern. Server-level namespacing is already provided by `spec_kit_memory`. 80+ references would need updating for a rename.

### Q5: Cross-Subsystem Import Direction

**Three candidates evaluated:**

| Criterion | Sibling-skill import (accepted) | Shared types module | Shared package |
|-----------|-------------------------------|--------------------|----------------|
| Implementation effort | 4 — ~20 import path changes | 2 — extract + stabilize types first | 1 — new package infra |
| "No behavior change" compliance | 5 — only path changes | 3 — type extraction may shift shapes | 2 — packaging may shift shapes |
| Consumer break risk | 4 — path updates only | 3 — type re-exports | 2 — dependency resolution |
| Future flexibility | 3 — tight coupling | 5 — clean boundary | 5 — clean boundary |
| Migration speed | 5 — single-phase | 2 — adds prerequisite phase | 1 — adds 2+ prerequisite phases |
| **Total** | **21/25** | **15/25** | **11/25** |

**Decision**: Sibling-skill imports. A shared types module would require extracting AND stabilizing types first — an extra prerequisite phase that risks the "no behavior change" constraint. Sibling-skill imports keep the migration surface bounded to ~20 files.

## 4. Implementation Phase Decomposition (Q7 — Confirmed)

The provisional 6-phase sequence is confirmed:

1. **002-scaffold-skill**: Create `.opencode/skills/system-code-graph/` with full scaffold (docs, metadata, feature catalog, playbook, database/, lib/, handlers/, tools/, tests/, references/).
2. **003-physical-move+DB**: `git mv` code_graph/ tree; resolve DB path from new location with env fallback; move code-graph.sqlite + sidecars.
3. **004-rewire-consumers**: Update ~25 import paths in handlers, context-server, hooks, session-snapshot, external tests, skill_advisor refs. Update vitest.config.ts, plugin bridge path.
4. **005-doc-migration**: Split 33+30 category-22 docs; update 10 agent files, 8 commands, 4 top-level docs, 3 skill cross-refs, constitutional rule, opencode.json.
5. **006-validation-cleanup**: Full test suite, gold-query battery, doctor workflow, startup-brief validation. Remove stale references. Update parent phase spec.

Research found no missing prerequisite phase. The sequence mirrors the precedent skill-advisor extraction exactly.

## 5. Risk Catalog (Q8)

| Risk | Severity | Detection | Mitigation |
|------|----------|-----------|------------|
| Startup-brief regression | High | hook test failure, "Graph: unavailable" when DB healthy | Re-wire hooks LAST; full hook test battery before merge |
| Gold-query verifier drift | Medium | battery path mismatch, WASM not found | Verify battery runs in new location before consumer rewire |
| Doctor path-resolution break | Medium | dead yaml path references | Validate all doctor targets post-move |
| Stress test discovery break | Medium | CI runs 0 code-graph stress tests | Add new patterns to BOTH vitest configs before removing old |
| Plugin bridge ABI risk | Low | plugin tool returns error | Update BRIDGE_PATH; verify plugin loads |
| Live-index data-loss risk | Low | 0 nodes after move, gold queries fail | Copy DB before delete; verify node count matches |

## 6. Disposition Distribution

| Disposition | Count | % |
|------------|-------|---|
| `move` | ~170 | 60% |
| `update` | ~90 | 32% |
| `stay-and-rewire` | ~25 | 9% |
| `never-move` | ~5 | 2% |

<!-- ANCHOR:references -->
## 7. References

- [SOURCE: glob **/* in mcp_server/code_graph/] — iteration-001
- [SOURCE: grep code_graph_ across mcp_server/*.ts, .opencode/agents/, .claude/agents/] — iteration-002
- [SOURCE: glob .opencode/plugins/, glob feature_catalog/22--*, glob manual_testing_playbook/22--*] — iteration-003
- [SOURCE: read code-graph-db.ts, ensure-ready.ts, tool-schemas.ts, vitest.config.ts] — iteration-001 + iteration-002 + iteration-003
- [SOURCE: read startup-brief.ts, context-server.ts, code-graph-tools.ts, handlers/index.ts] — iteration-001 + iteration-002 + iteration-003
- Precedent citation: `.opencode/specs/.../015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-extraction-design-and-adr/decision-record.md`
- Exclusion set citation: `resource-map.md` (pre-research baseline, ingested at init)
<!-- /ANCHOR:references -->
