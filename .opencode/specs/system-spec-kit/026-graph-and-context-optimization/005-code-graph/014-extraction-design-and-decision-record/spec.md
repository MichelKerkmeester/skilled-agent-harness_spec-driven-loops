---
title: "Feature Specification: Design + ADR for code-graph extraction"
description: "Run a 10-iteration deep-research investigation of the code-graph extraction surface, then write ADR-001, resource-map.md, and research synthesis. No code moves."
trigger_phrases:
  - "code graph extraction design"
  - "code-graph extraction ADR"
  - "code graph topology design"
  - "system-code-graph architectural shape"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/014-extraction-design-and-decision-record"
    last_updated_at: "2026-05-14T07:00:38Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Author deep-research config and dispatch 10-iter loop"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "resource-map.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140001"
      session_id: "001-extraction-design-and-adr"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This packet is research only; no code or skill folder moves happen here."
      - "Output: ADR-001 in decision-record.md locking the architectural shape; resource-map.md enumerating every touchpoint; research/research.md as narrative synthesis."
      - "Subsequent children (002+) scaffold AFTER this packet's ADR ships."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Design + ADR for code-graph extraction

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `001-extraction-design-and-adr` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Code-graph today is a 108-file subsystem (29 lib TS + 10 handlers + 2 tools + 28 vitest + 16 in-package docs + 23 READMEs) inside `system-spec-kit`, 12 MCP tools (`code_graph_*`, `ccc_*`, `detect_changes`), backed by `code-graph.sqlite` (55 MB live index, 7 exclusive tables), consumed by 5 cross-subsystem handlers, 6 runtime hooks across 4 runtimes, 7 agent files, 5 commands, 1 plugin bridge + 2 `.mjs` siblings, 1 constitutional rule, 4 top-level docs, and 63 category-22 docs across `feature_catalog/22--*/` + `manual_testing_playbook/22--*/`.

The parent phase 014 extracts code-graph into a first-class `.opencode/skills/system-code-graph/` skill folder. **Unlike the precedent skill-advisor extraction, no architectural decisions are pre-locked**: this packet's job is to research, evaluate, and lock them via 10 iterations of deep-research before any code or doc moves.

Eight architectural decisions must be answered by ADR-001 before subsequent children (002+) can scaffold:

- **Q1 (Touchpoint inventory)**: extend the pre-research baseline (108 + 63 + 5 + 6 + 7 + 5 + 3 = 197+ touchpoints); find anything missed.
- **Q2 (Database extraction shape)**: (a) DB stays in shared `mcp_server/database/` with new skill importing same `DATABASE_DIR` resolution from `core/config.ts`; (b) DB moves to new skill's own dir with `SPECKIT_CODE_GRAPH_DB_DIR` env + fallback for live-index migration; (c) DB dir becomes env-driven shared root.
- **Q3 (MCP server topology)**: own process vs in-process. Score on startup cost, dispatch latency, runtime config friction, ABI stability.
- **Q4 (Tool-id stability)**: preserve `code_graph_*` and `ccc_*` namespaces (12 tools) vs migrate to `system_code_graph.*`. Score on consumer break risk, backwards-compat path, discoverability.
- **Q5 (Cross-subsystem import direction)**: post-extraction, do `handlers/{memory-search,session-resume,session-bootstrap,session-health,memory-context}.ts`, `context-server.ts`, `tool-schemas.ts` import from sibling skill, shared types module, or shared package?
- **Q6 (Plugin bridge disposition)**: `.opencode/plugins/spec-kit-compact-code-graph.js` + `mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs` + `mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs`. Move with code-graph, stay as system-spec-kit shim, or split?
- **Q7 (Implementation phase decomposition)**: what 002+ children does ADR-001 commission? Provisional shape (002 scaffold-skill, 003 physical-move + DB, 004 rewire-consumers, 005 doc-migration, 006 validation-cleanup) — confirm or revise.
- **Q8 (Risk catalog)**: startup-brief regression risk (6 hooks consume code-graph readiness), gold-query verifier drift, doctor-command path-resolution break, stress-test discovery break, plugin bridge ABI risk, live-index migration data-loss risk. Each risk: detection signal + mitigation + rollback path.

### Purpose
Run 10 iterations of deep-research via `/spec_kit:deep-research :auto` (executor: cli-opencode + deepseek-v4-pro, flags `--pure` and `</dev/null` redirect). Output three artifacts: `research/research.md` (workflow-owned narrative synthesis), `resource-map.md` (tabular catalog enumerating every touchpoint with disposition: move / update / stay-and-rewire / never-move), `decision-record.md` (ADR-001 locking the 8 architectural decisions and the implementation phase decomposition). After convergence, update parent phase 014's `spec.md` 'What Needs Done' to reflect the locked decomposition so children 002-006 scaffold + execute without re-litigating the design.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only survey of the current code-graph surface:
  - `.opencode/skills/system-spec-kit/mcp_server/code_graph/` tree
  - All callers across the repo (`code_graph_*`, `ccc_*`, `detect_changes`, readiness, context, runtime-detection)
  - Tool registrations in `mcp_server/tool-schemas.ts` + `context-server.ts`
  - Category-22 feature_catalog and manual_testing_playbook docs
- Run the 10-iteration deep-research loop with the configured executor.
- Write `research/research.md`, `resource-map.md`, and `decision-record.md`.
- Update parent phase 014 `spec.md` with the locked sequence after ADR convergence.

### Out of Scope
- ANY code or file moves
- ANY skill folder creation (002's job)
- ANY tool-id changes
- Changing code-graph scoring, parsing, scan-scope policy, or query algorithms
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Touchpoint inventory covers the complete code-graph surface. | ADR/resource map extends the 244+ pre-research baseline and records missed items. |
| REQ-002 | Database extraction shape is decided. | ADR-001 selects shared DB, moved DB with env fallback, or env-driven shared root, with migration plan. |
| REQ-003 | MCP server topology is decided. | ADR-001 scores own process vs in-process on startup cost, dispatch latency, runtime config friction, and ABI stability. |
| REQ-004 | Tool-id stability path is decided. | ADR-001 preserves `code_graph_*`/`ccc_*` or specifies backwards-compatible migration to a new namespace. |
| REQ-005 | Cross-subsystem import direction is decided. | ADR-001 states whether callers import from sibling skill, shared types module, or shared package. |
| REQ-006 | Plugin bridge disposition is decided. | ADR-001 covers all 3 bridge files and names move/update/stay disposition. |
| REQ-007 | Research converges within 10 iterations or records stop reason. | `research/research.md` cites convergence reason or explicit non-convergence stop state. |
| REQ-008 | No code or skill-folder moves occur in this packet. | Git diff stays within `001-extraction-design-and-adr/` packet docs + parent `014/spec.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validation passes for child 001 and parent 014.
- **SC-002**: `decision-record.md` exists and ADR-001 answers all 8 decisions.
- **SC-003**: `resource-map.md` covers READMEs/Documents/Commands/Agents/Skills/Specs/Scripts/Tests/Config/Meta plus code handlers, hooks, database, constitutional, and plugin bridge categories.
- **SC-004**: `research/research.md` cites the convergence reason or stop reason.
- **SC-005**: No code files, runtime configs, or skill folders are touched by this packet.
- **SC-006**: Parent phase 014 `spec.md` is updated with the ADR-locked decomposition.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research misses a touchpoint | Later extraction phases break a live consumer | Grep wide and cross-check against `git grep code_graph_` count. |
| Risk | ADR locks too rigidly | Later phases re-litigate the design | Include consequences section and explicit revisit trigger. |
| Risk | `cli-opencode` dispatch reliability | 10-iteration loop stalls or loses state | Use a single sequential 10-iteration loop per memory `feedback_cli_dispatch_unreliability`. |
| Risk | Convergence not guaranteed at 10 iterations | ADR may be under-supported | Re-dispatch with prior state preserved if stop reason says evidence is insufficient. |
| Dependency | 008 backend resilience shipped | Extraction starts from hardened backend | Required before structural move. |
| Dependency | 011 scan-scope policy shipped | Extraction does not change scope semantics | Required before structural move. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to deep-research outputs; none for the dispatcher.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Dispatch under 4 hours wall clock (10 iter × 20-25 min average). |
| NFR-Q01 | Quality | ADR follows the L2-verify decision-record structure. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Dynamic-import consumers: surface with reflection flag.
- Tool registration happens in TWO places: `tool-schemas.ts` + `context-server.ts`.
- `mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` lives outside `code_graph/`.
- `mcp_server/vitest.config.ts` test-discovery patterns at lines 20-21 must be accounted for.
- `.opencode/skills/system-code-graph/.gitkeep` placeholder already exists.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | ~0 LOC code; 1500-2500 lines of doc | Pure research + resource map + ADR |
| **Surface area** | Whole-repo survey | Read-many, write-few |
| **Risk** | Low | No production code touched |
| **Reversibility** | High | Single-commit revert deletes packet |
<!-- /ANCHOR:complexity -->
