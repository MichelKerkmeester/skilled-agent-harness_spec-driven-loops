---
title: "Tasks: Phase 1: optin-5dim-scorer-and-skill-docs [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/005-add-opt-in-5dim-scorer-and-skill-docs"
    last_updated_at: "2026-05-28T19:15:45Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-add-opt-in-5dim-scorer-and-skill-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: optin-5dim-scorer-and-skill-docs

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 READ-FIRST run-benchmark.cjs + score-model-variant signature + benchmark fixture/profile schema
- [x] T002 Baseline DQI on dai SKILL.md (94/excellent) + README (77/good)
- [x] T003 [P] Read sk-doc skill README/MD templates + HVR + no-ToC policy
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 run-benchmark.cjs: `--scorer pattern|5dim` + `--grader noop|mock|llm`; lazy-load scorer; main async; unknown→warn+default
- [x] T005 `scoreFixture5dim` adapter (fixture→criteria, absolute cwd, weightedScore×100) + `scoringMethod` on report + state-log
- [x] T006 SKILL.md: Mode 4 model-benchmark docs + WHEN-TO-USE case + untagged-code-fence fix (DQI 94→97)
- [x] T007 README.md: structure table refreshed for loop-host/dispatch-model/scorer subtree
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 tests/optin-scorer.vitest.ts (3 tests: pattern default, 5dim per-dim scores, unknown→pattern)
- [x] T009 full vitest 131 green + alignment-drift PASS (0) + both scorer-path smokes (pattern 100, 5dim 90 benchmark-pass)
- [x] T010 DQI: SKILL.md 97/excellent + README 77/good, both 0 style/content issues
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

