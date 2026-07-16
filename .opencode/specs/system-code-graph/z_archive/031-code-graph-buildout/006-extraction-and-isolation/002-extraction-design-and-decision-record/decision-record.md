---
title: "Decision Record: Co-Resident Code-Graph MCP With Stable tool-ids"
description: "ADR-001 locks the code-graph extraction shape: co-resident MCP, stable tool-ids, moved DB with env fallback, sibling-skill imports, moved plugin bridge, 6-phase implementation, and risk catalog."
trigger_phrases:
  - "code graph extraction decision"
  - "system code graph ADR"
  - "code graph tool-id stability"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/006-extraction-and-isolation/002-extraction-design-and-decision-record"
    last_updated_at: "2026-05-14T10:00:00Z"
    last_updated_by: "claude"
    recent_action: "Accepted ADR-001 for co-resident code-graph with stable tool-ids"
    next_safe_action: "Scaffold child 002 system-code-graph skill"
    blockers: []
    key_files:
      - "decision-record.md"
      - "resource-map.md"
      - "research/research.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Co-Resident Code-Graph MCP With Stable tool-ids

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Co-Resident Code-Graph MCP With Stable tool-ids

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Decider** | Claude, using packet 014/001 constraints and deep-research findings |

---

<!-- ANCHOR:adr-001-context -->
### Context

The code-graph subsystem (111 files, 12 MCP tools, 7 SQLite tables, 55+ MB live index) lives inside `.opencode/skills/system-spec-kit/mcp_server/code_graph/`. Parent phase 014 extracts it into a first-class `.opencode/skills/system-code-graph/` skill. Unlike the precedent skill-advisor extraction (which required a standalone MCP process by operator constraint), this extraction has NO pre-locked architectural constraint for MCP topology—the decision is evaluated fresh below.

Eight architectural questions must be answered before children 002-006 can scaffold and execute. This ADR locks all eight based on 3 iterations of deep-research survey covering 244+ pre-research touchpoints + 169 cross-system import matches confirmed.

**Precedent**: skill-advisor extraction (packet 015/009/001) used standalone MCP with legacy tool bridge and DB-local to new skill. Code-graph extraction differs in two critical ways: (1) code-graph shares `DATABASE_DIR` with the memory DB, so a DB move has cross-subsystem impact; (2) code-graph's 12 tools are deeply embedded in agent workflows, context-server routing, and session bootstrapping.

**Two hard constraints from parent phase 014**:
- **Constraint A**: The extraction must not change code-graph scoring, parsing, scan-scope policy, or query algorithms — this is a structural move, not a behavior change.
- **Constraint B**: Existing consumers (5 handlers, 6 hooks, context-server, session-snapshot, skill-advisor type refs) must not break during migration.

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: **Co-resident MCP with stable tool-ids, moved DB with env fallback, sibling-skill imports, moved plugin bridge, 6-phase implementation.**

The eight architectural questions are answered as follows:

| Q# | Question | Decision | Rationale |
|----|----------|----------|-----------|
| **Q1** | Touchpoint inventory | **Confirmed 244+ → 280+ verified** | Deep-research enriched the pre-research baseline: 6 stress tests (not 1), 9 external test files importing code-graph, 1 barrel export, 1 util file, 1 skill_advisor bench import, session-snapshot imports. Full catalog in resource-map.md. |
| **Q2** | DB extraction shape | **(b) DB moves to new skill with `SPECKIT_CODE_GRAPH_DB_DIR` env fallback** | Shared DB dir (a) couples two skills on the same SQLite directory — code-graph writes conflict with memory reads under WAL. Env-driven root (c) adds unnecessary config surface for a single-skill DB. Option (b) mirrors skill-advisor precedent: DB lives under `.opencode/skills/system-code-graph/database/` by default, `SPECKIT_CODE_GRAPH_DB_DIR` overrides for tests/CI. Migration path: child 003 copies live index on first run, deletes old path after verify. |
| **Q3** | MCP server topology | **Co-resident with `spec_kit_memory`** (in-process) | Score comparison below. Own-process adds 2-5s startup, runtime config entries ×4, launcher duplication, process-coordination complexity, and breaks the startup-brief injection path (hooks build briefs locally from sqlite — if DB moves to own process, the brief builder must talk cross-process or duplicate). The code-graph tools don't need process isolation; they're read-heavy (scan is the only writer), share the same Node.js version, and are already tested co-resident. |
| **Q4** | Tool-id stability | **Preserve `code_graph_*`, `ccc_*`, `detect_changes` stable** | 6 hooks, context-server routing (~15 code-graph tool name match sites), layer-definitions, 10 agent files × 4 runtimes, 8 commands, 28+ test files, doctor workflow — all name these tools by id. Renaming during extraction would create churn without adding value. Server-level namespacing is already provided by `spec_kit_memory`. Post-extraction, tools remain registered under the same server. |
| **Q5** | Cross-subsystem import direction | **Consumers import from sibling skill (not shared types module)** | 5 handlers + context-server + 6 hooks + session-snapshot + 9 external tests + skill_advisor type ref all currently import from `../code_graph/lib/`. Post-extraction, these become `../../system-code-graph/mcp_server/lib/` imports. A shared types module would require extracting AND stabilizing types first (an extra phase), breaking the "no behavior change" constraint. Sibling-skill imports keep the migration surface bounded. |
| **Q6** | Plugin bridge disposition | **Plugin + code-graph-specific bridge move to system-code-graph; shared message schema stays** | `spec-kit-compact-code-graph.js` (plugin) and `spec-kit-compact-code-graph-bridge.mjs` (bridge) are code-graph-specific — move with code-graph. `spec-kit-opencode-message-schema.mjs` is shared by skill-advisor bridge too — stays in system-spec-kit. The plugin's `BRIDGE_PATH` import must be updated to point to new skill location. |
| **Q7** | Implementation phase decomposition | **Confirm provisional 6-phase sequence** | 002-scaffold-skill, 003-physical-move+DB, 004-rewire-consumers, 005-doc-migration, 006-validation-cleanup. The provisional sequence is correct — research found no missing prerequisite phase. |
| **Q8** | Risk catalog | **6 risks identified with detection signal + mitigation + rollback** | See full risk table below. |

**Why co-resident MCP over standalone process**:

Code-graph tools are deeply integrated into the same Node.js process as memory tools via:
1. **Startup-brief**: hooks build briefs from local SQLite — if DB moves to separate process, briefs need cross-process communication or DB duplication
2. **Session bootstrap/resume**: handlers call `getGraphFreshness()`, `getGraphReadinessSnapshot()` directly — function calls, not MCP round-trips
3. **Context-server routing**: inline function calls to `detectRuntime()`, `graphDb.*` — not MCP tool dispatches
4. **Test suite**: 28 in-package + 9 external + 6 stress tests — all import code-graph symbols directly, not through MCP

The code-graph doesn't need process isolation because:
- It shares no write-conflicted resources (code_graph writes to its own SQLite tables)
- It doesn't need independent scaling
- Its startup cost is already paid by the memory server cold-start
- Maintaining co-resident avoids the 4-runtime-config duplication + launcher creation + process-coordination that standalone requires

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

Scores use 1-5 where 5 is best.

| Shape | Startup cost | Dispatch latency | Runtime config friction | ABI stability | Consumer break risk | DB ownership clarity | Accept/Reject |
|-------|-------------|------------------|------------------------|---------------|--------------------|--------------------|---------------|
| **Co-resident (accepted)** | 5 | 5 | 5 | 4 | 5 | 4 | **Accepted.** Zero startup overhead, direct function calls, no config changes, existing test compat. DB ownership is documented by env override. |
| **Own-process standalone** | 2 | 3 | 2 | 5 | 2 | 5 | Rejected. 2-5s added startup, 4 runtime configs need new MCP entries, launcher duplication, startup-brief breaks (cross-process), 28 tests need MCP harness rewrite. Strong ABI isolation but cost is too high. |
| **Own-process with legacy bridge** | 2 | 3 | 2 | 4 | 3 | 5 | Rejected. Same costs as standalone + added bridge complexity. The skill-advisor precedent used this because it HAD a pre-locked standalone constraint — code-graph does not. |
| **DB stays in shared `mcp_server/database/`** | 5 | 5 | 5 | 3 | 5 | 1 | Rejected as Q2 answer. Couples two skills on same DB directory. WAL conflicts possible. Violates the extraction goal of clear ownership boundaries. |
| **Tool-id migration to `system_code_graph.*`** | 5 | 5 | 3 | 2 | 1 | 5 | Rejected as Q4 answer. 10 agent files, 8 commands, 6 hooks, context-server, 30+ test files all name `code_graph_*` — migration would be a separate packet, not an extraction side-effect. |
| **Shared types module** | 3 | 4 | 3 | 3 | 3 | 3 | Rejected as Q5 answer. Requires extracting AND stabilizing types first — adds a prerequisite phase, delays extraction, risks "no behavior change" constraint if any type shape shifts. |

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Code-graph becomes discoverable as a first-class `.opencode/skills/system-code-graph/` skill with its own README, feature catalog, playbook
- DB ownership moves with the package that writes and consumes it
- Tests can run package-locally (28 test files co-located with source)
- Import paths become explicit: `../../system-code-graph/mcp_server/lib/` documents the dependency direction
- Plugin bridge lives with the subsystem it serves
- No runtime config changes needed (co-resident — tools stay registered under `spec_kit_memory`)

**What it costs**:
- `code-graph-db.ts` must resolve `DATABASE_DIR` from new skill's config, not `core/config.ts`
- 5 handlers + context-server + 6 hooks + session-snapshot need import path rewiring (~20 files)
- 9 external test files in `mcp_server/tests/` need import path updates
- `vitest.config.ts` lines 20-21 need code-graph test path removal
- 33+30 category-22 docs split between code-graph core and shared context/hooks (doc migration judgment)
- `tool-schemas.ts` retains ~200 lines of code-graph schema definitions — these stay in system-spec-kit but now point to sibling skill (no functional change needed since schemas are self-contained TypeScript objects)

**Distribution of ~280 touchpoints by disposition**:

| Disposition | Count | Examples |
|------------|-------|----------|
| `move` | ~170 | code_graph/ source tree (111), in-package docs (35), stress tests (6), plugin bridge (2), cat-22 code-graph docs (~9), cat-22 playbook code-graph (~10), doctor yaml (1), gold queries asset (1) |
| `update` | ~90 | 10 agent files, 8 commands, 4 top-level docs, 3 skill cross-refs, 3 system-spec-kit refs, constitutional rule (1), opencode.json, vitest.config.ts, cat-22 shared docs (~24), cat-22 shared playbook (~20), scripts (2) |
| `stay-and-rewire` | ~25 | 5 handlers, context-server, tool-schemas, tools/index.ts, 6 hooks, session-snapshot, 9 external tests, skill_advisor type ref, skill_advisor bench |
| `never-move` | ~5 | memory DBs, skill_advisor DB, shared message schema, core/config.ts (DATABASE_DIR stays for memory DB) |

---

<!-- ANCHOR:adr-001-implementation-phases -->
### Implementation Phase Decomposition (Q7 — Confirmed)

| Child | Name | Description |
|-------|------|-------------|
| **002** | scaffold-skill | Create `.opencode/skills/system-code-graph/` with skill.md, README.md, description.json, graph-metadata.json, package.json, tsconfig.json, vitest.config.ts, feature_catalog/, manual_testing_playbook/, database/, references/, lib/, handlers/, tools/, tests/. Empty mcp_server scaffold with tool-schemas stubs. |
| **003** | physical-move+DB | `git mv` code_graph/ tree from system-spec-kit to system-code-graph. Resolve `DATABASE_DIR` in code-graph-db.ts from new skill config with `SPECKIT_CODE_GRAPH_DB_DIR` env fallback. Move code-graph.sqlite + WAL + SHM. |
| **004** | rewire-consumers | Update imports in 5 handlers, context-server, tools/index.ts, tool-schemas.ts, 6 hooks, session-snapshot, 9 external tests, skill_advisor refs. Update vitest.config.ts. Update plugun bridge path. Verify no test breakage. |
| **005** | doc-migration | Split category-22 docs: code-graph core → system-code-graph/feature_catalog/ and manual_testing_playbook/; shared context/hook docs stay in system-spec-kit. Update 10 agent files, 8 commands, 4 top-level docs, 3 skill cross-refs, constitutional rule, opencode.json. |
| **006** | validation-cleanup | Run full test suite. Verify tool registration. Run gold-query battery. Doctor workflow validation. Startup-brief validation. Remove stale code-graph references from system-spec-kit. Update parent phase 014 spec.md. Strict-validate all packets. |

---

<!-- ANCHOR:adr-001-risk-catalog -->
### Risk Catalog (Q8)

| # | Risk | Severity | Detection Signal | Mitigation | Rollback |
|---|------|----------|------------------|------------|----------|
| **R1** | Startup-brief regression from import rewiring | High | `startup-brief.vitest.ts` fails; hooks surface "Graph: unavailable" when DB is healthy | Child 004 runs full hook test battery before merging. Staged rewiring: hooks are the LAST consumers updated. | Revert import path changes; hooks fall back to old path. |
| **R2** | Gold-query verifier drift | Medium | `code-graph-verify.vitest.ts` fails with "tree-sitter WASM not found" or battery path mismatch | Battery path is absolute-resolved at test time. Child 003 verifies battery runs before consumers are rewired. | Copy battery JSON to new location and keep old path as fallback for 1 migration window. |
| **R3** | Doctor-command path-resolution break | Medium | `doctor_code-graph.yaml` resolves dead paths after move | YAML workspace-path references use `skill-root` variable. Child 005 validates all doctor targets post-move. | Restore doctor yaml to old location with deprecation notice. |
| **R4** | Stress-test discovery break | Medium | CI runs 0 code-graph stress tests after vitest.config.ts change | Child 004 adds new code-graph test patterns to BOTH vitest configs (old + new) before removing old ones. | Revert vitest.config.ts to old patterns. |
| **R5** | Plugin bridge ABI risk | Low | Plugin `spec_kit_compact_code_graph_status` tool returns error; bridge import fails | The plugin resolves `BRIDGE_PATH` via `fileURLToPath` at runtime — path must exist post-move. Child 004 updates `BRIDGE_PATH` in plugin .js and verifies plugin loads. | Keep old bridge copy with deprecation shim for 1 release. |
| **R6** | Live-index migration data-loss risk | Low | `code_graph_status` reports 0 nodes after move; gold queries fail | Child 003 copies code-graph.sqlite before deleting old path. Verifies node count matches. If new DB path is empty on first scan: old DB is the fallback. | Restore old DB path from backup. |

**Risk avoidance over standalone MCP**: By keeping code-graph co-resident, we avoid 3 additional risks that standalone would introduce:
- Cross-process DB access coordination (SQLite is single-writer)
- Runtime config × 4 requiring `system_code_graph` MCP server entry
- Hook startup-brief needing to call code-graph via MCP round-trip instead of direct SQLite read

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 8 architectural decisions have no canonical answer; 280+ touchpoints need disposition mapping before implementation can begin. |
| 2 | **Beyond Local Maxima?** | PASS | Compared 6 alternatives: co-resident vs standalone vs standalone-bridge (Q3), shared DB vs moved DB vs env-root (Q2), stable ids vs migration (Q4), sibling imports vs shared types (Q5). |
| 3 | **Sufficient?** | PASS | All 8 decisions locked: touchpoint inventory, DB shape, MCP topology, tool-id stability, import direction, plugin bridge, phase decomposition, risk catalog. |
| 4 | **Fits Goal?** | PASS | Extracts code-graph ownership without changing behavior, scoring, or tool behavior. No code moves in this packet. |
| 5 | **Open Horizons?** | PASS | Leaves children 002-006 free to scaffold, move, rewire, migrate docs, and validate. Future packets can revisit standalone MCP if isolation needs change. |

**Checks Summary**: 5/5 PASS

---

<!-- ANCHOR:adr-001-revisit -->
### Revisit Trigger

A future packet may amend this ADR if:
- Child 004 proves import rewiring breaks a consumer that cannot be fixed without MCP topology change
- Code-graph write volume increases (e.g., continuous background scanning) making process isolation desirable
- A new runtime adds hooks that cannot consume code-graph via direct import

---

<!-- ANCHOR:adr-001-rollback -->
### Rollback

Revert this commit. The 8 decisions then defer to a future amendment packet before children 002-006 proceed.
<!-- /ANCHOR:adr-001 -->
