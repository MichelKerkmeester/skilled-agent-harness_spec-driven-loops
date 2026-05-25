---
title: "Tasks: 118/006 — Collateral /doctor + Playbook Update"
description: "Task breakdown for swapping mcp__mk_spec_memory__deep_loop_graph_* tool refs in 4 collateral files for direct deep-loop-runtime .cjs script invocations."
trigger_phrases:
  - "phase 006 tasks"
  - "doctor collateral tasks"
  - "playbook collateral tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/007-collateral-doctor-playbook"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded tasks.md"
    next_safe_action: "Execute T001-T005 after 005 merges"
    blockers:
      - "phase 005 must complete first"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1180061180061180061180061180061180061180061180061180061180060002"
      session_id: "118-006-tasks-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 118/006 — Collateral /doctor + Playbook Update

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [15 minutes]

- [ ] T001 Verify phase 005 (YAML workflow update) is complete and merged on main [3m]
- [ ] T002 Verify all 4 phase-003 scripts exist (`ls .opencode/skills/deep-loop-runtime/scripts/*.cjs`) [2m]
- [ ] T003 Snapshot pre-edit grep counts per file (`grep -c 'mcp__mk_spec_memory__deep_loop_graph_'`) and record in handover [3m]
- [ ] T004 [P] Compare `--health-check` JSON stdout shape against legacy MCP tool response fixture from phase 003 [4m]
- [ ] T005 [P] Inventory exact line numbers of MCP tool refs in each of the 4 files [3m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [30 minutes]

### Collateral Edits
- [ ] T006 Edit `.opencode/commands/doctor.md` — replace `mcp__mk_spec_memory__deep_loop_graph_status` and related refs with `node .opencode/skills/deep-loop-runtime/scripts/<X>.cjs --health-check` [8m]
- [ ] T007 Edit `.opencode/commands/doctor/_routes.yaml` — update deep-loop diagnostic route target paths; preserve mutation-class annotations (`read-only`/`add-only`/`mutates`) [8m]
- [ ] T008 Edit `.opencode/commands/doctor/update.md` — swap refresh-op tool refs for script invocations [6m]
- [ ] T009 Edit `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md` — update dispatch line + reconcile expected stdout snippet if JSON shape requires it [8m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [15 minutes]

### Static Checks
- [ ] T010 Run zero-match grep assertion: `grep -c 'mcp__mk_spec_memory__deep_loop_graph_' <each of the 4 files>` returns 0 [2m]
- [ ] T011 [P] Validate `_routes.yaml` parses cleanly (`yq eval '.' .opencode/commands/doctor/_routes.yaml`) [2m]
- [ ] T012 [P] Validate frontmatter parses on the 3 .md files (Python yaml.safe_load on the `---` block) [3m]

### Manual Smoke
- [ ] T013 Manual `/doctor deep-loop` health-check invocation in repo root; assert exit 0 + JSON stdout [3m]
- [ ] T014 Visual review of playbook scenario 009: dispatch line + assertion line are internally consistent [2m]

### Spec Folder Verification
- [ ] T015 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/007-collateral-doctor-playbook --strict`; expect exit 0 [2m]
- [ ] T016 Mark all `checklist.md` items `[x]` with evidence (grep output snippets, smoke-test exit codes) [1m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Zero `mcp__mk_spec_memory__deep_loop_graph_` matches across the 4 collateral files
- [ ] `/doctor deep-loop` smoke test exits 0
- [ ] `validate.sh --strict` exits 0
- [ ] `checklist.md` fully verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Phase Parent**: See `../spec.md`
- **Predecessor**: See `../005-yaml-workflow-update/`
- **Successor**: See `../007-test-migration/`

<!-- /ANCHOR:cross-refs -->
