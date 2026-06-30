---
title: "Tasks: 105 cli-devin v1.0.4.0"
description: "Task tracker."
trigger_phrases:
  - "105 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/085-cli-devin-effectiveness-improvements"
    last_updated_at: "2026-05-16T05:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task list"
    next_safe_action: "Dispatch agents"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:c1088b3d88af2b0b1e34181aeb58861b558ff55253360d6899a13ee138347a46"
      session_id: "105-tasks"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 105 cli-devin v1.0.4.0

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP
- [x] T001 Scaffold 105 packet (spec / plan / tasks / impl-summary / description / graph-metadata)
- [ ] T002 Author research/retrospective.md with the 999 findings
- [ ] T003 Strict-validate 105 packet
- [ ] T004 Capture HEAD baseline SHA for rollback
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### Bucket A — Agent 1 (recipe + MCP)
- [ ] T005 `devin mcp add sequential_thinking ...`
- [ ] T006 Update agent-config-deep-research-iter.json
- [ ] T007 Update agent-config-deep-review-iter.json
- [ ] T008 Update agent-config-synthesis.json
- [ ] T009 Smoke-test each recipe via devin -p

### Bucket B — Agent 2 (SKILL + references + asset)
- [ ] T010 Bump cli-devin SKILL.md to v1.0.4.0; add ALWAYS rule #14
- [ ] T011 Update references/deep-loop-iter-contract.md
- [ ] T012 Update references/agent-config-recipes.md
- [ ] T013 Update assets/deep-loop-iter-template.md
- [ ] T014 sk-doc validate each touched file

### Bucket C — Agent 3 (YAML + dispatchers)
- [ ] T015 Update `if_cli_devin:` in deep_start-research-loop_auto.yaml
- [ ] T016 Update same in deep_start-review-loop_auto.yaml
- [ ] T017 YAML safe_load validate both
- [ ] T018 (optional) Update run-loop.sh dispatcher in 999/scripts/
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION
- [ ] T019 Verify all 3 buckets landed
- [ ] T020 Final strict-validate on 105 packet
- [ ] T021 Final integration smoke: dispatch tiny iter with new recipe, confirm sequential_thinking invoked
- [ ] T022 Commit on main + push to origin
- [ ] T023 Backfill 105/implementation-summary.md with actuals
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- v1.0.4.0 bundle on main + pushed
- All 9 target files updated
- Strict-validate + recipe smoke-tests pass
- sequential_thinking visible in tool-trace of a smoke iter
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Spec: spec.md
- Plan: plan.md
- Retrospective driver: ../../../system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/
- cli-devin v1.0.3.0 baseline: packet 059 (.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/055-cli-devin-deep-loop-alignment/)
<!-- /ANCHOR:cross-refs -->
