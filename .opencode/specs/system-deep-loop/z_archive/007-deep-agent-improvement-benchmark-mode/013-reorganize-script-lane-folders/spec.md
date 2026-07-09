---
title: "Feature Specification: reorganize scripts into physical lane folders"
description: "Move scripts into agent-improvement, model-benchmark, and shared folders, update references, and verify runtime path handling."
trigger_phrases:
  - "scripts-physical-reorg"
  - "deep-agent-improvement scripts reorg"
  - "scripts lane subdirs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/013-reorganize-script-lane-folders"
    last_updated_at: "2026-05-29T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffold 013 phase docs for scripts physical lane reorg"
    next_safe_action: "git mv scripts into lane subdirs and fix __dirname path joins"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/loop-host.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-reorganize-script-lane-folders"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: reorganize scripts into physical lane folders

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase moves the 16 deep-agent-improvement scripts plus the scorer subtree into agent-improvement, model-benchmark, and shared lane subdirs, making the two-lane split visible on disk for the last flat surface. It is the highest-risk phase because two path traps lie in wait: loop-host spawns children across all three lanes (TST-1 must stay byte-identical) and dispatch-model resolves config by walking up from `__dirname` (a wrong depth fails silently).

**Key Decisions**: three-lane classification (ADR-001), spawn-time lane resolution to preserve TST-1 (ADR-002), fix dispatch-model depth plus a positive config-load test (ADR-003), lib and tests stay at root (ADR-004)

**Critical Dependencies**: 010 references/assets lane split (shipped), the full vitest suite as the verification gate
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 19 |
| **Predecessor** | 012-label-catalog-playbook-and-advisor-lanes |
| **Successor** | 014-review-two-lane-workflow-implementation |
| **Handoff Criteria** | 16 scripts moved into the three lane subdirs, every __dirname-relative path repaired, all refs rewritten, full vitest suite green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the deep-agent-improvement model-benchmark mode decomposition. It is the last and highest-risk phase.

**Scope Boundary**: Only the `scripts/` tree of the deep-agent-improvement skill: the 16 movable scripts plus the scorer subtree. `lib/`, `tests/`, `vitest.config.mjs`, `node_modules`, and `README.md` stay at the scripts root. References and assets were already lane-split in phase 010.

**Dependencies**:
- 010-reorganize-two-lane-references-assets shipped the references and assets lane split, so the scripts tree is the last on-disk surface still flat.

**Deliverables**:
- 8 agent-improvement scripts moved into `scripts/agent-improvement/`
- 2 model-benchmark scripts plus the `scorer/` subtree moved into `scripts/model-benchmark/`
- 6 shared scripts moved into `scripts/shared/`
- Every `__dirname`-relative path join repaired for the new depth
- Every cross-reference (SKILL.md, README.md, workflow YAMLs, tests) rewritten

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill now exposes two co-equal lanes (agent-improvement and model-benchmark) in prose, and phases 010-012 split references, assets, the agent note, the catalog, and the advisor by lane. The `scripts/` tree is the last surface still flat: all 16 scripts plus the scorer subtree sit at one level, so a reader cannot tell which lane a script serves and the lane boundary is invisible on disk.

### Purpose
Make the two-lane split visible on disk for the scripts tree by moving each script into its lane subdir while preserving the byte-identical agent-improvement default path (TST-1) and keeping every relative path and cross-reference correct.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move 8 agent-improvement scripts into `scripts/agent-improvement/`
- Move 2 model-benchmark scripts plus the `scorer/` subtree into `scripts/model-benchmark/`
- Move 6 shared scripts into `scripts/shared/`
- Repair every `__dirname`-relative path join broken by the new depth
- Rewrite every cross-reference in SKILL.md, scripts/README.md, the 4 workflow YAMLs, and the vitest test files

### Out of Scope
- `lib/`, `tests/`, `vitest.config.mjs`, `node_modules`, `README.md` at the scripts root - they stay put because lib is shared infra both lanes import via `./lib/` and tests resolve scripts by absolute repo path
- Behavior changes to any script - this phase only moves files and repoints paths, no logic rewrites beyond the path-resolution fix

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/agent-improvement/**` | Move (git mv) | 8 agent-improvement scripts |
| `scripts/model-benchmark/**` | Move (git mv) | 2 scripts + scorer/ subtree |
| `scripts/shared/**` | Move (git mv) | 6 shared scripts |
| `scripts/loop-host.cjs` | Modify | resolve child script lane paths at spawn time, not in planInvocation (TST-1) |
| `scripts/dispatch-model.cjs` | Modify | fix `..` depth so state/ and assets/ still resolve to the skill root |
| `scripts/score-candidate.cjs` | Modify | confirm `__dirname` join still resolves co-lane scan-integration and generate-profile |
| `scripts/run-benchmark.cjs` | Modify | repoint the lazy `./scorer/score-model-variant.cjs` require to the new scorer path |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | repoint every `scripts/<name>.cjs` literal to the lane path |
| `.opencode/skills/deep-agent-improvement/scripts/README.md` | Modify | repoint script paths |
| `.opencode/commands/deep/assets/*.yaml` | Modify | repoint script paths in 4 workflow YAMLs |
| `scripts/tests/*.vitest.ts` | Modify | repoint absolute script paths in test resolvers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Scripts moved into the three lane subdirs | `scripts/agent-improvement/` holds the 8, `scripts/model-benchmark/` holds the 2 plus `scorer/`, `scripts/shared/` holds the 6; no mover left at the scripts root |
| REQ-002 | TST-1 byte-identical default path preserved | `planInvocation` still returns bare script names; lane resolution happens in the spawn layer; the loop-host identity test stays green |
| REQ-003 | All `__dirname`-relative paths repaired | dispatch-model resolves `state/` and `assets/agent-improvement/improvement_config.json` against the skill root; loop-host spawns each child at its lane path; run-benchmark loads the scorer |
| REQ-004 | Full vitest suite green | `node --test` / vitest run passes all 14 test files with the moved scripts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All cross-references rewritten | `rg "scripts/(loop-host|dispatch-model|run-benchmark|score-candidate|generate-profile|...)\.cjs"` in SKILL.md, README.md, and YAMLs returns only lane paths |
| REQ-006 | skill graph-metadata refreshed | moved script paths in `graph-metadata.json` match the new lane paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every movable script lives under a lane subdir, the scorer subtree sits under model-benchmark, and lib/tests stay at the scripts root.
- **SC-002**: The full vitest suite passes and the agent-improvement default path produces byte-identical output (TST-1).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 010 references/assets lane split | Green | shipped; the assets path dispatch-model loads is already at `assets/agent-improvement/` |
| Risk | dispatch-model silent config failure | High | `loadConfig` swallows read errors and returns `{}`; a wrong `..` depth makes it silently use defaults. Fix and assert the config actually loads, not just that the script runs |
| Risk | loop-host TST-1 regression | High | resolve lane paths in the spawn layer (runNode), never in planInvocation, so the identity test stays byte-identical |
| Risk | missed cross-reference | Med | grep sweep SKILL.md, README.md, YAMLs, and tests after the move, expect zero stale flat paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The move is a structural reorg with no runtime hot path change; benchmark and score timings stay within prior bounds.

### Security
- **NFR-S01**: No new path traversal surface; all moved paths stay inside the skill root and existing path guards remain in force.

### Reliability
- **NFR-R01**: The agent-improvement default path remains byte-identical (TST-1); no silent fallback to defaults on the model-benchmark config path.

---

## 8. EDGE CASES

### Data Boundaries
- Missing config file: dispatch-model must keep its optional-config behavior, but the candidate path must resolve to the real skill-root assets dir, not a wrong-depth miss that always returns `{}`.
- Unknown mode: loop-host still warns and falls back to agent-improvement after the move.

### Error Scenarios
- Child script not found at lane path: loop-host surfaces a non-zero exit rather than a silent skip.
- Scorer require path wrong: run-benchmark `--scorer=5dim` must fail loudly, not fall back to pattern scoring silently.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: ~25 moved/edited, LOC: low (path edits), Systems: 1 skill |
| Risk | 22/25 | Auth: N, API: N, Breaking: Y (TST-1 + silent-config-failure traps) |
| Research | 8/20 | __dirname depth + spawn-layer resolution mapped from code reads |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 10/15 | Dependencies: SKILL/README/YAML/tests must move in lockstep |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | dispatch-model silently loads `{}` config after move | H | M | fix `..` depth; assert config loads with a positive test |
| R-002 | loop-host TST-1 identity break | H | M | lane resolution in spawn layer only |
| R-003 | missed cross-reference leaves a dead path | M | M | grep sweep all 4 reference surfaces |
| R-004 | scorer require path wrong, silent pattern fallback | M | L | repoint require and run the 5dim test |

---

## 11. USER STORIES

### US-001: Lane-visible scripts tree (Priority: P0)

**As a** maintainer of the deep-agent-improvement skill, **I want** each script under its lane subdir, **so that** I can tell which lane a script serves from the tree alone.

**Acceptance Criteria**:
1. Given the moved tree, When I list `scripts/`, Then I see agent-improvement, model-benchmark, and shared subdirs holding their mapped scripts.

### US-002: Preserved default behavior (Priority: P0)

**As a** caller of the agent-improvement default path, **I want** byte-identical behavior after the move, **so that** the reorg is invisible to existing callers.

**Acceptance Criteria**:
1. Given no `--mode` flag, When loop-host plans the invocation, Then the plan is byte-identical to the pre-move plan and the suite TST-1 test passes.

---

## 12. OPEN QUESTIONS

- Do any tests resolve scripts by relative path rather than absolute repo path, which would also need repointing?
- Is `materialize-benchmark-fixtures.cjs` correctly classified shared, given loop-host spawns it on the model-benchmark path?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Risk Matrix, User Stories, Complexity Assessment
-->
