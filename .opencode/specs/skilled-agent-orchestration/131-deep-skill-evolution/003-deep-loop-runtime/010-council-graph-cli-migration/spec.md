---
title: "Feature Specification: 010 — Council Graph CLI Migration"
description: "Migrate the remaining council_graph_* MCP tool family into deep-loop-runtime direct CLI support, then remove the MCP schemas, handlers, registrations, and consumer references."
trigger_phrases:
  - "council graph CLI migration"
  - "council_graph_ MCP removal"
  - "deep-loop-runtime council loopType"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/010-council-graph-cli-migration"
    last_updated_at: "2026-05-24T07:40:20Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed Phase 5 test migration, mirror cleanup, and packet closure"
    next_safe_action: "Complete; none unless follow-up cleanup is requested"
    blockers: []
    completion_pct: 100
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:1310030100000000000000000000000000000000000000000000000000000001"
      session_id: "131-003-010-council-cli-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Feature Specification: 010 — Council Graph CLI Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 010 completes the council graph half of the deep-loop-runtime MCP-to-CLI migration. The existing direct scripts in `.opencode/skills/deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs` already handle `loopType=research` and `loopType=review`; this packet specifies extending the same scripts to accept `loopType=council`, porting the dedicated council database/query/convergence code into `.opencode/skills/deep-loop-runtime/lib/council/`, rewiring `deep-ai-council` to spawn the scripts, and deleting the four `council_graph_*` MCP tools from `system-spec-kit`.

The intended exit state is a single runtime-owned graph surface for research, review, and council loops. `system-spec-kit` keeps memory/checkpoint/session/eval tooling, but no longer owns council graph persistence, query, status, or convergence handlers.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Spec** | `../` (`131-deep-skill-evolution/003-deep-loop-runtime`) |
| **Scope Mode** | Phase folder, Option E |
| **Estimated LOC Changed** | ~558 LOC handler removal, ~200 LOC convergence port, CLI/test/docs rewires |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The prior deep-loop-runtime arc removed the four `deep_loop_graph_*` MCP tools and replaced them with direct CLI scripts, but the council graph family remains in `system-spec-kit/mcp_server/`. The live MCP surface still includes `council_graph_upsert`, `council_graph_query`, `council_graph_status`, and `council_graph_convergence`; their schemas, handlers, registrations, tests, and `deep-ai-council` references still couple council graph behavior to the memory MCP server.

That split leaves two similar graph architectures in different places. Research/review loops go through `deep-loop-runtime` scripts, while council loops still depend on `system-spec-kit` MCP tools. The migration should make council graph state follow the same direct CLI boundary without redesigning the existing script argv shape.

### Purpose

Move council graph persistence, prompt-safe query helpers, and convergence math behind the existing deep-loop-runtime CLI scripts, then delete the old MCP tool family so `mcp tools list` shows four fewer tools and `deep-ai-council` rebuilds and queries derived graph state by spawning local scripts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Port `mcp_server/lib/council-graph/{council-graph-db.ts,council-graph-query.ts}` into `.opencode/skills/deep-loop-runtime/lib/council/`.
- Move council-specific convergence math from `mcp_server/handlers/council-graph/convergence.ts` into a runtime library, preserving the `STOP_BLOCKED`, `STOP_ALLOWED`, and `CONTINUE` semantics.
- Extend `.opencode/skills/deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs` to accept `--loop-type council`.
- Delete the four `council_graph_*` MCP tool schemas, input schemas, handlers, and registry dispatches from `system-spec-kit/mcp_server/`.
- Rewire `deep-ai-council` script and YAML/documentation references from MCP tool calls to direct subprocess CLI calls.
- Migrate council graph tests into `.opencode/skills/deep-loop-runtime/tests/` as CLI-facing integration coverage and update count/layer tests in `system-spec-kit`.
- Update `opencode.json` `_NOTE_2_TOOLS` from 39 tools to 35 tools and remove council graph inventory text.

### Out of Scope

- Changing `deep-loop-runtime` script argument shape beyond accepting `loopType=council`.
- Touching `deep-research` or `deep-review` skills.
- Migrating `code_graph_*`, spec-memory search, checkpoint, session, eval, or embedder MCP tool families.
- Replacing packet-local `ai-council/**` artifacts as source-of-truth.
- Committing changes.

### Files to Change in the Implementation Packet

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/council/` | Modify/Create | Add council graph DB/query/convergence modules beside existing council primitives. |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Modify | Accept `loopType=council`; use council node/relation taxonomy and artifact provenance fields. |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Modify | Route council query modes to council query helpers. |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Modify | Return council readiness, recovery payload, counts, and signals. |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify | Route council convergence to council-specific signal math. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/*.ts` | Delete | Remove four MCP handlers after CLI consumers are live. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Remove four `council_graph_*` tool definitions at current lines 650-740. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Remove four schema exports and allowed-parameter rows at current lines 607-663. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Modify | Remove imports, `TOOL_NAMES`, dispatch cases, and schema-validation references at current lines 12-42. |
| `.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs` | Modify | Spawn `deep-loop-runtime/scripts/upsert.cjs --loop-type council` instead of emitting an MCP payload for the operator. |
| `.opencode/commands/deep/ask-ai-council.md` and YAML assets | Modify | Replace MCP graph wording and old workflow notes with direct CLI invocation guidance. |
| `.opencode/agents/ai-council.md` | Modify | Update graph storage boundary text from MCP tooling to runtime CLI reducers. |
| `opencode.json` | Modify | Drop council graph tools from `_NOTE_2_TOOLS` and adjust count to 35. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime CLI accepts council loop type | Each script accepts `--loop-type council` and returns structured JSON with exit codes matching existing script contracts. |
| REQ-002 | Council taxonomy preserved | Runtime libraries preserve node kinds `SESSION`, `ROUND`, `SEAT`, `CLAIM`, `EVIDENCE`, `DISAGREEMENT`, `DECISION`, `RECOMMENDATION` and relation kinds `PARTICIPATES_IN`, `PROPOSES`, `SUPPORTS`, `CONTRADICTS`, `DERIVES_FROM`, `AGREES_WITH`, `RESOLVES`, `ESCALATES`, `EVIDENCE_FOR`, `RECOMMENDS`. |
| REQ-003 | Council convergence semantics preserved | Empty graph returns `STOP_BLOCKED`; critical unresolved disagreements block stop approval; passing thresholds return `STOP_ALLOWED`. |
| REQ-004 | MCP tools removed | `council_graph_upsert`, `council_graph_query`, `council_graph_status`, and `council_graph_convergence` are absent from `mcp tools list`, schemas, allowed-parameter maps, and dispatcher code. |
| REQ-005 | `deep-ai-council` no longer invokes council MCP tools | YAML workflows, script usage text, and graph support references call the direct CLI or describe it accurately. |
| REQ-006 | Tests migrated | Existing council graph behavior is covered under `deep-loop-runtime/tests/`, including DAC-027 through DAC-032 value scenarios. |
| REQ-007 | Tool inventory corrected | `opencode.json` advertises 35 mk-spec-memory tools and no council_graph inventory. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | System-spec-kit count/layer tests updated | `context-server.vitest.ts`, `layer-definitions.vitest.ts`, and count assertions stop expecting council tools. |
| REQ-009 | Derived-state recovery remains explicit | Status output and `deep-ai-council/references/graph_support.md` continue to state that `ai-council/**` artifacts are authoritative. |
| REQ-010 | No deep-research/review regressions | Research/review CLI integration tests still pass after adding council branches. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --loop-type council ...` returns valid JSON for a no-op or populated graph invocation.
- **SC-002**: All four `council_graph_*` IDs are absent from the MCP tool surface and from `system-spec-kit/mcp_server` live TypeScript sources.
- **SC-003**: Council value scenarios DAC-027 through DAC-032 pass after migration.
- **SC-004**: Existing research/review `deep-loop-runtime` integration tests pass unchanged.
- **SC-005**: `deep-ai-council` replay helper can rebuild the derived graph through a child-process CLI call.
- **SC-006**: This packet validates with `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mixed ESM/TS/CJS boundary | High | Mirror the existing deep-loop-runtime script pattern: scripts dynamically import `.ts` libs and emit line-delimited JSON. |
| Risk | Council metadata differs from coverage graph shape | Medium | Preserve `artifactPath`, `contentHash`, `roundId`, and prompt-safe metadata in council-specific normalization instead of forcing coverage-graph fields. |
| Risk | Deleting MCP before consumer rewire | High | Use the safer order in ADR-003: port, CLI extend, consumer rewire, MCP delete, tests. |
| Risk | Tool count tests encode stale totals | Medium | Include context-server, layer-definitions, review-fixes, and `opencode.json` count updates in Phase 5. |
| Dependency | Existing council graph tests | High | Treat `council-graph.vitest.ts`, `council-graph-value-scenarios.vitest.ts`, and fixture helpers as behavior sources to migrate, not disposable coverage. |
| Dependency | `deep-ai-council` DAC scenarios | High | Run DAC-019 through DAC-024 plus graph value DAC-027 through DAC-032 where available. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Direct CLI invocations must preserve the current exit-code contract: success 0, script error 1, DB/runtime error 2, input validation 3.
- **NFR-R02**: Graph storage remains derived and recoverable by replaying `ai-council/**` artifacts.

### Maintainability

- **NFR-M01**: Council graph code lives with existing council primitives in `deep-loop-runtime/lib/council/`.
- **NFR-M02**: The existing four-script CLI surface is extended, not replaced by a new council-only CLI.

### Performance

- **NFR-P01**: Subprocess invocation overhead is bounded by direct local `node` execution; no MCP bridge round trip remains in council graph flows.

---

## 8. EDGE CASES

### Data Boundaries

- **Council-specific namespace**: `loopType=council` must not accept research/review node kinds by accident.
- **Artifact provenance**: `artifactPath`, `contentHash`, and `roundId` should survive upsert and prompt-safe query output where allowed.
- **Empty graph**: Council convergence keeps the current MCP behavior and returns `STOP_BLOCKED`.

### Error Scenarios

- **Stale MCP consumer**: If `rg council_graph_` finds a live consumer after `deep-ai-council` rewiring, halt MCP deletion until the consumer is migrated.
- **DB path collision**: If runtime storage points at the old MCP database directory, halt and fix storage ownership before value scenarios run.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multiple skills, MCP schemas, CLI scripts, tests, and docs |
| Risk | 17/25 | Public local CLI contract and MCP tool deletion |
| Research | 10/20 | Requires handler, lib, command, and test inventory reads |
| Multi-Agent | 4/15 | Single implementation executor expected |
| Coordination | 13/15 | Consumer rewires and tool-count metadata must land together |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Consumer still calls deleted MCP tool | H | M | Rewire `deep-ai-council` before MCP deletion; run repo-wide grep. |
| R-002 | Council convergence score drifts during port | H | M | Migrate existing handler tests and DAC-029 scenario. |
| R-003 | Tool count metadata remains stale | M | M | Include `opencode.json` and count tests in Phase 5. |
| R-004 | Research/review branches regress | H | L | Run existing runtime script integration tests. |

---

## 11. USER STORIES

### US-001: Council operator rebuilds graph without MCP

**As a** deep-ai-council operator, **I want** replay and graph checks to use direct runtime scripts, **so that** council graph support remains available after the MCP tools are removed.

**Acceptance Criteria**:

1. Given `ai-council-state.jsonl` exists, when replay runs, then it upserts council nodes and edges through `deep-loop-runtime/scripts/upsert.cjs --loop-type council`.
2. Given graph rows exist, when status and convergence run, then they return council-specific structured JSON without MCP calls.

### US-002: Spec-kit maintainer shrinks the MCP surface

**As a** spec-kit maintainer, **I want** the four `council_graph_*` MCP tools removed, **so that** mk-spec-memory no longer owns deep council graph behavior.

**Acceptance Criteria**:

1. `mcp tools list` excludes all four `council_graph_*` IDs.
2. `opencode.json` and tool-definition tests report 35 mk-spec-memory tools.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- The prompt referenced `.opencode/commands/spec_kit/deep-council.md`, but the current repo path is `.opencode/commands/deep/ask-ai-council.md` plus `deep_ask-ai-council_*.yaml`. Phase 4 should update the live path and search for any mirrors rather than depend on the old path.
- The current `deep-loop-runtime/lib/council/` directory already exists. Phase 1 should add graph modules there rather than create a separate top-level `lib/council-graph/` unless implementation evidence shows stronger import-boundary reasons.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
