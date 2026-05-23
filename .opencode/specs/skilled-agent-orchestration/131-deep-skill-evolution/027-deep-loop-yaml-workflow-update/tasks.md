---
title: "Tasks: 118/005 — YAML Workflow Update"
description: "Per-file task breakdown for rewriting 10 mcp_tool: call sites across 4 deep-* workflow YAMLs to bash invocations of phase 003 .cjs script shims. T001-T024."
trigger_phrases:
  - "118 yaml tasks"
  - "deep-loop yaml rewrite tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/005-yaml-workflow-update"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded T001-T024 task list."
    next_safe_action: "Execute T001-T004 setup tasks."
    blockers:
      - "Phase 004 must delete the 4 mcp__mk_spec_memory__deep_loop_graph_* tools first."
      - "Phase 003 must ship convergence.cjs + upsert.cjs."
    completion_pct: 5
    key_files:
      - "tasks.md"
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:1180053180053180053180053180053180053180053180053180053180050000"
      session_id: "118-005-tasks-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 118/005 — YAML Workflow Update

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
## Phase 1: Setup

> **Effort estimate**: ~20 minutes total.

- [ ] T001 Confirm phase 003 implementation-summary marks `.cjs` shims as complete (`../003-script-shim-and-db-relocation/implementation-summary.md`) [5m]
- [ ] T002 Confirm phase 004 implementation-summary marks MCP-tool deletion as complete (`../004-mcp-tool-surface-removal/implementation-summary.md`) [5m]
- [ ] T003 Re-run `grep -n "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_" .opencode/commands/spec_kit/assets/spec_kit_deep-*.yaml` and record current line numbers in `implementation-summary.md` (scaffold-time line refs may drift) [5m]
- [ ] T004 Smoke-test the bash shims: `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder <sandbox> --loop-type review --session-id smoke-test` returns valid JSON [5m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **Effort estimate**: ~45-60 minutes total across 4 files.

### File 1: spec_kit_deep-review_auto.yaml

- [ ] T005 Rewrite `step_graph_convergence` call site (~L430): replace `mcp_tool: mcp__mk_spec_memory__deep_loop_graph_convergence` block with `bash: 'node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "review" --session-id "{session_id}"'`; preserve `outputs:`, `append_jsonl:`, and `note:` (update note to reflect bash invocation) (`.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`) [12m]
- [ ] T006 Rewrite `step_graph_upsert` call site (~L1015): replace MCP block with `bash: 'node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --spec-folder "{spec_folder}" --loop-type "review" --session-id "{session_id}" --nodes "{graph_nodes_json}" --edges "{graph_edges_json}"'`; preserve `outputs:`, `skip_conditions:` (`.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`) [10m]
- [ ] T007 If `grep -c` still > 0 for this file, locate and rewrite the trailing status-check reference (helper or audit step) [5m]
- [ ] T008 `python3 -c "import yaml; yaml.safe_load(open('.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml'))"` exits 0 [2m]

### File 2: spec_kit_deep-review_confirm.yaml

- [ ] T009 [P] Mirror T005 at `step_graph_convergence` (~L438) (`.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml`) [10m]
- [ ] T010 [P] Mirror T006 at `step_graph_upsert` (~L937) (`.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml`) [10m]
- [ ] T011 If `grep -c` still > 0, rewrite trailing helper/audit reference [5m]
- [ ] T012 YAML parse smoke test on the file [2m]

### File 3: spec_kit_deep-research_auto.yaml

- [ ] T013 [P] Rewrite `step_graph_convergence` (~L413): replace `mcp_tool:` block with bash invocation of `convergence.cjs --spec-folder "{spec_folder}" --loop-type "research" --session-id "{config.lineage.sessionId}"`; preserve `outputs:` (including `graph_decision_json`, `graph_trace_json`, `graph_convergence_score`) and `append_to_jsonl:` (`.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`) [12m]
- [ ] T014 [P] Rewrite `step_graph_upsert` (~L869): replace `mcp_tool:` inside `if_graph_events_present:` block with bash invocation of `upsert.cjs ...`; preserve `if_graph_events_present:` / `if_graph_events_missing:` guards (`.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`) [10m]
- [ ] T015 YAML parse smoke test on the file [2m]

### File 4: spec_kit_deep-research_confirm.yaml

- [ ] T016 [P] Mirror T013 at `step_graph_convergence` (~L402) (`.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml`) [10m]
- [ ] T017 [P] Mirror T014 at `step_graph_upsert` (~L723) (`.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml`) [10m]
- [ ] T018 YAML parse smoke test on the file [2m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **Effort estimate**: ~30 minutes total.

- [ ] T019 Run `grep -c "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_"` across all 4 YAMLs; assert 0 per file; paste output into `implementation-summary.md` [5m]
- [ ] T020 Run `python3 -c "import yaml; yaml.safe_load(open(...))"` on all 4 YAMLs; assert exit 0 each [5m]
- [ ] T021 Smoke-run one iteration of `/spec_kit:deep-review` against a sandbox spec folder; confirm `step_graph_convergence` and `step_graph_upsert` complete without "unknown tool" or "undefined variable" errors; paste relevant JSONL event into `implementation-summary.md` [15m]
- [ ] T022 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/005-yaml-workflow-update --strict`; assert exit 0 [3m]
- [ ] T023 Tick every checklist item in `checklist.md` with evidence (grep output, parse exit codes, smoke run snippet, validate.sh output) [2m]
- [ ] T024 Update `implementation-summary.md` Metadata + What Was Built + Verification sections with actual numbers [included in T023]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T001-T024 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 4 YAMLs report 0 MCP-tool grep hits
- [ ] All 4 YAMLs parse cleanly under pyyaml
- [ ] One smoke deep-review iteration succeeds at the graph step
- [ ] `validate.sh ... --strict` exits 0
- [ ] `checklist.md` fully verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Spec**: `../spec.md`
- **Phase 003 (script contract source)**: `../003-script-shim-and-db-relocation/spec.md`
- **Phase 004 (MCP tool removal predecessor)**: `../004-mcp-tool-surface-removal/spec.md`
<!-- /ANCHOR:cross-refs -->
