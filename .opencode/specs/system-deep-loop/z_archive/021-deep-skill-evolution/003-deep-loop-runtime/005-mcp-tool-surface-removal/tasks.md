---
title: "Tasks: 004 — MCP Tool Surface Removal"
description: "Task list for deleting 5 MCP handler files + 4 tool-schema entries + 4 input-schema entries + 4 registration calls for the deep_loop_graph_* tools."
trigger_phrases:
  - "MCP tool surface removal tasks"
  - "delete coverage-graph tasks"
  - "118 phase 004 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored T001-T029 task list for phase 004"
    next_safe_action: "Await phase 003 shims"
    blockers: ["depends-on:003-script-shim-and-db-relocation"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1180041180041180041180041180041180041180041180041180041180040002"
      session_id: "118-004-mcp-tool-surface-removal-tasks"
      parent_session_id: null
---
# Tasks: 004 — MCP Tool Surface Removal

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`

**Milestone Reference**:

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T005 | T+30 min |
| M2 | T006-T017 | T+90 min |
| M3 | T018-T024 | T+120 min |
| M4 | T025-T029 | T+150 min |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Milestone M1]

- [ ] T001 Confirm phase 003 ships `.cjs` script shims at `.opencode/skills/deep-loop-runtime/scripts/` [5m]
- [ ] T002 Grep entire repo for `deep_loop_graph_` references; classify hits (YAML / `/doctor` / playbook / OTHER) [10m] {deps: T001}
- [ ] T003 Grep entire repo for `handlers/coverage-graph` import paths; flag any hit outside the five files marked for deletion [5m] {deps: T001}
- [ ] T004 Capture pre-deletion `mcp tools list` output to scratch as baseline for SC-005 delta [5m] {deps: T001}
- [ ] T005 Run `tsc --noEmit` on `.opencode/skills/system-spec-kit/mcp_server/`; expect exit 0 as pre-phase baseline [5m] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Milestone M2]

### Handler file deletes

- [ ] T006 [P] Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` [2m] {deps: T002, T003}
- [ ] T007 [P] Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` [2m] {deps: T002, T003}
- [ ] T008 [P] Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts` [2m] {deps: T002, T003}
- [ ] T009 [P] Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts` [2m] {deps: T002, T003}
- [ ] T010 Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts` (handler-registration module) [3m] {deps: T006, T007, T008, T009}
- [ ] T011 Remove the now-empty `mcp_server/handlers/coverage-graph/` folder [2m] {deps: T010}

### Schema and registration edits

- [ ] T012 [P] Edit `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`: drop the 4 tool definitions for `deep_loop_graph_convergence`, `deep_loop_graph_upsert`, `deep_loop_graph_query`, `deep_loop_graph_status` [10m] {deps: T002}
- [ ] T013 [P] Edit `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`: drop the 4 matching schema entries [10m] {deps: T002}
- [ ] T014 [P] Edit `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts`: drop the 4 registration calls and the `from '../handlers/coverage-graph/...'` import line(s) [10m] {deps: T002, T010}

### Import cleanup

- [ ] T015 Scan modified files (T012, T013, T014) for now-unused local imports; remove dangling import statements [10m] {deps: T012, T013, T014}
- [ ] T016 Repo-wide grep confirms zero `handlers/coverage-graph` import paths anywhere [5m] {deps: T011, T015}
- [ ] T017 Clear stale build artifacts: `rm -rf .opencode/skills/system-spec-kit/mcp_server/dist/` [2m] {deps: T015}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Milestone M3 + M4]

### Compile and surface checks

- [ ] T018 Run `tsc --noEmit` on `.opencode/skills/system-spec-kit/mcp_server/`; expect exit 0 [5m] {deps: T017}
- [ ] T019 Repo-wide grep confirms zero `deep_loop_graph_` symbol references in any TS source under `mcp_server/` [5m] {deps: T015}
- [ ] T020 Smoke-start the MCP server; capture stdout/stderr; expect no errors and all non-coverage-graph tools register [10m] {deps: T018}
- [ ] T021 Repeat MCP smoke start four more times (total 5/5 clean runs) for NFR-R01 evidence [15m] {deps: T020}
- [ ] T022 Call `mcp tools list`; confirm the four deleted IDs are absent and total count dropped by exactly 4 vs baseline (SC-005) [5m] {deps: T020}

### Cross-phase cross-check

- [ ] T023 Invoke each of the four phase-003 `.cjs` script shims directly via bash; confirm each returns expected output (consumers ready for phases 005 / 006) [10m] {deps: T020}
- [ ] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal --strict`; expect exit 0 [5m] {deps: T018}

### Documentation and closeout

- [ ] T025 Fill `implementation-summary.md` `what-built` with concrete deleted-file paths and three modified-file diffs (line counts removed) [15m] {deps: T022}
- [ ] T026 Fill `implementation-summary.md` `verification` with `tsc --noEmit` evidence, 5/5 smoke-start evidence, and tool-list delta evidence [15m] {deps: T022, T023}
- [ ] T027 Mark `decision-record.md` ADR-001 status: Accepted; confirm five checks 5/5 PASS [5m] {deps: T024}
- [ ] T028 Mark every `checklist.md` item with `[x]` and an evidence pointer to the relevant T### task or command output [15m] {deps: T026}
- [ ] T029 Update `spec.md` Status from `Scaffolded` to `Complete` and refresh `_memory.continuity` block (`last_updated_at`, `recent_action`, `next_safe_action`, `completion_pct: 100`, `blockers: []`) [10m] {deps: T028}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1 tasks (T001-T005) complete with evidence
- [ ] All Phase 2 tasks (T006-T017) complete; five handler files deleted; three files edited cleanly
- [ ] All Phase 3 tasks (T018-T029) complete with verification evidence
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` exits 0
- [ ] `checklist.md` items all marked `[x]` with citations
- [ ] ADR-001 status: Accepted, five checks 5/5 PASS
- [ ] `implementation-summary.md` `what-built` + `verification` sections filled with concrete paths and outputs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent**: `../spec.md`
- **Predecessor Phase**: `../003-script-shim-and-db-relocation/`
- **Successor Phase**: `../005-yaml-workflow-update/`

**Architecture-Tasks Mapping**:

| Architecture Component | Tasks |
|------------------------|-------|
| `tool-schemas.ts` edit | T012, T015 |
| `schemas/tool-input-schemas.ts` edit | T013, T015 |
| `tools/index.ts` edit | T014, T015 |
| `handlers/coverage-graph/` delete | T006, T007, T008, T009, T010, T011 |
| TS compile gate | T005 (pre), T018 (post) |
| MCP smoke start | T020, T021 |
| Tool-list delta proof | T022 |
| ADR-001 sign-off | T027 |
<!-- /ANCHOR:cross-refs -->
