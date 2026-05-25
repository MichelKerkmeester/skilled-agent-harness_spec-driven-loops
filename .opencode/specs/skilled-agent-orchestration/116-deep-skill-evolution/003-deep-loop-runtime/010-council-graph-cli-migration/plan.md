---
title: "Implementation Plan: 010 — Council Graph CLI Migration"
description: "Five-phase migration plan for moving council_graph_* MCP behavior into deep-loop-runtime CLI scripts, rewiring deep-ai-council, deleting the MCP surface, and migrating tests."
trigger_phrases:
  - "council graph CLI migration"
  - "council_graph_ MCP removal"
  - "deep-loop-runtime council loopType"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/010-council-graph-cli-migration"
    last_updated_at: "2026-05-24T09:35:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Remediated native review findings and revalidated council matrix"
    next_safe_action: "Complete; none unless follow-up cleanup is requested"
    blockers: []
    completion_pct: 100
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:1310030100000000000000000000000000000000000000000000000000000002"
      session_id: "131-003-010-council-cli-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 010 — Council Graph CLI Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS script entry points, TypeScript runtime libraries |
| **Framework** | Local CLI scripts replacing MCP tool handlers |
| **Storage** | SQLite via `better-sqlite3`, moved from `system-spec-kit/mcp_server/database` into deep-loop-runtime-owned storage |
| **Testing** | Vitest unit/integration tests, CLI spawn helpers, MCP tool-list checks |

### Overview

The migration has five serial phases. First, move council graph persistence and prompt-safe query helpers into `deep-loop-runtime/lib/council/`. Second, add `loopType=council` branches to the four existing scripts and port council convergence math. Third in execution order, rewire `deep-ai-council` YAML/scripts/docs to spawn the CLI. Fourth, delete the MCP schemas, handlers, registration, and layer entries after consumers are live. Fifth, migrate remaining tests and update runtime mirrors and tool-count notes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Current CLI scripts exist and pass their existing research/review tests.
- [x] Council MCP handlers and libs were readable and matched the initial inventory before migration.
- [x] `deep-ai-council` live command path confirmed as `.opencode/commands/deep/ask-ai-council.md` and `assets/deep_ask-ai-council_*.yaml`.
- [x] Existing `council-graph.vitest.ts` and DAC value-scenario fixtures were treated as migration source material.

### Definition of Done

- [x] `--loop-type council` works for upsert, query, status, and convergence scripts.
- [x] Four `council_graph_*` MCP tools are absent from schema, dispatcher, allowed-parameter maps, and live tool definitions.
- [x] `deep-ai-council` calls direct CLI subprocesses for graph replay.
- [x] Council graph tests pass in their new runtime-owned location.
- [x] `opencode.json` mk-spec-memory note says 35 tools and no council graph tool family.
- [x] `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Extend the existing runtime script bridge. The four scripts remain the public local interface; loop-type-specific libraries sit behind them. Research and review keep `lib/coverage-graph/`; council uses `lib/council/` for council graph persistence, queries, and convergence.

### Key Components

- **`deep-loop-runtime/scripts/*.cjs`**: argv parsing, JSON output, exit codes, dynamic imports.
- **`deep-loop-runtime/lib/council/`**: existing council primitives plus new graph DB/query/convergence modules.
- **`system-spec-kit/mcp_server/`**: loses the council graph MCP schemas, handlers, and registration.
- **`deep-ai-council`**: remains source-of-truth owner for `ai-council/**` artifacts and uses runtime CLI calls only for derived graph projection.

### Data Flow

```text
BEFORE
deep-ai-council artifacts
  -> replay helper emits council_graph_upsert payload
  -> operator/MCP path calls council_graph_* tool
  -> system-spec-kit/mcp_server handlers
  -> system-spec-kit council-graph SQLite

AFTER
deep-ai-council artifacts
  -> replay helper spawns node deep-loop-runtime/scripts/upsert.cjs --loop-type council
  -> deep-loop-runtime/lib/council graph DB/query/convergence libs
  -> deep-loop-runtime storage

Queries/status/convergence follow the same script path and emit structured JSON.
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Port Council DB + Query Lib

- Move or copy the behavior from `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts` into `.opencode/skills/deep-loop-runtime/lib/council/council-graph-db.ts` or `.cjs`, matching local runtime import conventions.
- Move query helpers from `council-graph-query.ts` into `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` or `.cjs`.
- Keep the council graph node and relation taxonomy intact.
- Replace `DATABASE_DIR` dependency from `system-spec-kit/mcp_server/core/config.js` with a deep-loop-runtime storage constant.
- Add lifecycle helpers compatible with existing runtime test cleanup.

### Phase 2: Add `loopType=council` to Four CLI Scripts

- Update `upsert.cjs` validation at current lines 107-109 to accept `council`.
- In `upsert.cjs`, route council nodes/edges through the council taxonomy and preserve `artifactPath`, `contentHash`, `roundId`, and metadata fields.
- Update `query.cjs` validation at current lines 93-99 and add council query modes: `unresolved_disagreements`, `evidence_chain`, `decision_support`, `convergence_blockers`, and `hot_nodes`.
- Update `status.cjs` validation at current lines 92-96 and return the current council recovery payload and signals.
- Update `convergence.cjs` validation at current lines 263-272 and port the 208-LOC council convergence logic into `lib/council/convergence.cjs`.
- Preserve the script JSON bridge shape and exit-code contract.

### Phase 3: Delete the Four MCP Tool Entries

- Delete or empty the four handler files in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/`: `upsert.ts`, `query.ts`, `status.ts`, `convergence.ts`.
- Remove tool definitions from `tool-schemas.ts` at current lines 650, 697, 714, and 727.
- Remove input-schema map rows and allowed-parameter rows from `schemas/tool-input-schemas.ts` at current lines 607-663.
- Remove imports, `TOOL_NAMES`, switch cases, and schema-validation set wiring from `mcp_server/tools/index.ts` at current lines 12-42.
- Update layer-definition and context-server test rows that list `council_graph_*`.
- Verify `mcp tools list` shows exactly four fewer tools.

### Phase 4: Rewire `deep-ai-council`

- Update `.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs` so it can spawn the runtime `upsert.cjs --loop-type council` path instead of only emitting an MCP payload.
- Update `.opencode/skills/deep-ai-council/references/graph_support.md`, `SKILL.md`, and `README.md` wording from "MCP projection" to "deep-loop-runtime CLI projection".
- Update `.opencode/commands/deep/ask-ai-council.md` and `.opencode/commands/deep/assets/deep_ask-ai-council_{auto,confirm}.yaml` where graph or MCP notes are stale.
- Update `.opencode/agents/ai-council.md` graph-storage boundary text.
- Search for residual `council_graph_` references and classify intentional historical mentions versus stale call instructions.

### Phase 5: Migrate Tests + Mirrors + Tool Count

- Move/rewrite `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` into `.opencode/skills/deep-loop-runtime/tests/integration/` as direct CLI invocation tests.
- Move/rewrite `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph-value-scenarios.vitest.ts` and `tests/fixtures/council-value/seed-helpers.ts` to runtime-owned integration/value coverage.
- Keep or relocate scenario fixture data for DAC-027 through DAC-032.
- Update system-spec-kit tests: `context-server.vitest.ts`, `layer-definitions.vitest.ts`, and any count assertions expecting council tools.
- Update `opencode.json` `_NOTE_2_TOOLS`: 39 -> 35 tools and remove council graph family wording.
- Run targeted and broad verification commands listed below.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Required Evidence |
|-----------|-------|-------|-------------------|
| Unit | Council graph DB/query/convergence libs | Vitest under `deep-loop-runtime/tests/council/` or `tests/unit/` | Taxonomy, prompt-safe metadata, blockers, scoring |
| Integration | Four scripts with `--loop-type council` | `deep-loop-runtime/tests/integration/*script*.vitest.ts` + `spawn-cjs.ts` | Exit code 0 for valid input, 3 for invalid input |
| Value scenarios | DAC-027 through DAC-032 | Migrated `council-graph-value-scenarios.vitest.ts` | Graph answers and call/read comparison remain valid |
| MCP removal | Tool surface and schemas | `mcp tools list`, `rg council_graph_ mcp_server` | Four IDs absent from live MCP surface |
| Consumer E2E | Deep AI Council graph replay | `replay-graph-from-artifacts.cjs` and DAC-019 through DAC-024 scenarios | Replay helper writes through CLI and council flow still passes |
| Regression | Research/review graph scripts | Existing runtime integration tests | No behavior regressions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing runtime scripts | Internal | Present | Hard blocker if baseline tests are failing before council branch work. |
| Existing `lib/council/` directory | Internal | Present | Guides placement for graph modules. |
| Council MCP handlers/libs | Internal | Present | Source behavior for port. |
| `deep-ai-council` command/YAML assets | Internal | Present under `.opencode/commands/deep/` | Must update live path, not stale `spec_kit/deep-council.md`. |
| Vitest harness | Internal | Present | Required for migrated tests. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Council CLI returns incorrect JSON/exit codes, migrated value scenarios fail, or hidden consumers require the MCP surface.
- **Procedure**: Revert the implementation commit or commit range. Because the safer order rewires consumers before MCP deletion, the rollback should restore the four MCP handlers and schemas together with the previous `deep-ai-council` references. Re-run MCP startup, `mcp tools list`, and the original council graph vitest files to verify the old surface is restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 -> Phase 2 -> Phase 4 -> Phase 3 -> Phase 5
```

The user-requested phase list names MCP deletion before consumer rewire. ADR-003 recommends the safer execution order: build and verify the CLI, rewire consumers, then delete MCP, then finish tests/counts.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 | Medium | 2-3 hours |
| Phase 2 | High | 3-5 hours |
| Phase 3 | Medium | 1-2 hours |
| Phase 4 | Medium | 2-3 hours |
| Phase 5 | High | 3-5 hours |
| **Total** | | **11-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

1. Revert the implementation commit or commit range.
2. Re-run the old MCP council graph tests and `mcp tools list` to confirm the old surface is restored.
3. If rollback happens after consumer rewire but before MCP deletion, revert only the consumer rewire and leave the new CLI code for investigation.
4. If rollback happens after MCP deletion, restore the four handlers, schemas, allowed-parameter rows, and tool registry entries in one revert.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Council MCP libs/handlers
  -> runtime council DB/query/convergence modules
  -> four script branches with loopType=council
  -> deep-ai-council subprocess calls
  -> MCP tool deletion
  -> migrated tests and tool-count metadata
```

| Dependency | Owner | Blocks |
|------------|-------|--------|
| Runtime council DB/query port | Phase 1 | CLI upsert/query/status/convergence |
| Runtime CLI branches | Phase 2 | Consumer rewire |
| Consumer rewire | Phase 4 | MCP deletion |
| MCP deletion | Phase 3 | Tool count and system-spec-kit tests |
| Migrated test fixtures | Phase 5 | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Port council graph DB and query helpers.
2. Port convergence math and expose all four scripts for `loopType=council`.
3. Rewire `deep-ai-council` replay and graph references to direct scripts.
4. Remove MCP schemas, handlers, and dispatch wiring.
5. Migrate tests and update tool count inventory.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Runtime libs | Council DB/query/convergence modules load from deep-loop-runtime. |
| M2 CLI works | Four scripts accept `--loop-type council` and pass direct tests. |
| M3 Consumers moved | `deep-ai-council` uses subprocess CLI calls. |
| M4 MCP removed | `mcp tools list` omits four council tools. |
| M5 Tests green | Runtime and affected spec-kit vitest suites pass. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:cross-refs -->
## RELATED DOCUMENTS

- `spec.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
