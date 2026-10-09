---
title: "Tasks: Phase 1: ponytail-deep-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ponytail deep research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: ponytail-deep-research

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

- [x] T001 Scaffold the phase parent and this child (`../spec.md`, `spec.md`)
- [x] T002 Confirm `codex` and `pi` are on PATH
- [x] T003 Bind the run config (`research/deep-research-config.json`): two fan-out executors, 10 iterations each
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Run the GPT-6 Luna lineage through cli-codex (`research/lineages/`): 10 iterations, 38 min, exit 0
- [x] T005 [P] Run the DeepSeek V4.1 Flash lineage through cli-pi (`research/lineages/`): 10 iterations at xhigh (runner cap), 28 min, exit 0
- [x] T006 Synthesize both lineages (`research/research.md`): merge of 97 findings, orchestrator corrections applied, `synthesis_complete` recorded through the gateway
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Check recommendation citations against the source: all 36 `[SOURCE:]` tags resolve (65 after the independent re-review amendment, all resolving); every carried repository-state claim was opened; 3 DeepSeek claims refuted and corrected
- [x] T008 Confirm no write landed outside `research/`: runner reported 0 containment advisories; `git status` showed no stray changes from the run
- [x] T009 Run `validate.sh --strict` on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



