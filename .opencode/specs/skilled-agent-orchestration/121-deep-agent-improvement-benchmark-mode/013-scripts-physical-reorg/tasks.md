---
title: "Tasks: scripts physical lane reorg"
description: "Task breakdown for moving the 16 deep-agent-improvement scripts plus scorer into lane subdirs, repairing __dirname paths, and rewriting all cross-references."
trigger_phrases:
  - "scripts-physical-reorg tasks"
  - "scripts lane reorg tasks"
  - "deep-agent-improvement scripts tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/013-scripts-physical-reorg"
    last_updated_at: "2026-05-29T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffold 013 tasks for scripts physical lane reorg"
    next_safe_action: "git mv scripts into lane subdirs and fix __dirname path joins"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/loop-host.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-scripts-physical-reorg"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: scripts physical lane reorg

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture `__dirname` and relative-require inventory (`rg -n "__dirname|require\('\./" scripts/*.cjs scripts/scorer/**`)
- [ ] T002 Capture cross-reference inventory in SKILL.md, README.md, YAMLs, tests
- [ ] T003 [P] Confirm lane mapping against the actual 16-file list + scorer subtree
- [ ] T004 Run baseline vitest suite green before moving anything
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 git mv the 8 agent-improvement scripts into `scripts/agent-improvement/`
- [ ] T006 git mv dispatch-model + run-benchmark + `scorer/` into `scripts/model-benchmark/`
- [ ] T007 git mv the 6 shared scripts into `scripts/shared/`
- [ ] T008 Fix dispatch-model `..` depth so state/ and assets/ resolve to the skill root
- [ ] T009 Resolve loop-host child script lane paths in the spawn layer, not planInvocation (TST-1)
- [ ] T010 Repoint run-benchmark lazy scorer require to the new model-benchmark path
- [ ] T011 Confirm score-candidate `__dirname` join resolves co-lane scan-integration + generate-profile
- [ ] T012 Rewrite SKILL.md, README.md, and 4 YAML cross-references to lane paths
- [ ] T013 Repoint absolute script paths in the vitest resolvers
- [ ] T014 Refresh skill graph-metadata moved script paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the full vitest suite; expect all 14 files green
- [ ] T016 Positive-assert dispatch-model loads real config (not `{}`)
- [ ] T017 grep for stale flat script paths returns zero across all reference surfaces
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Full vitest suite passed and TST-1 identity preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- Setup, Implementation, Verification
-->
