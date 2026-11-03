---
title: "Tasks: Phase 3: conversation-adoption-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "conversation adoption research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: conversation-adoption-research

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the phase child and fill `spec.md`. Verify: `ls 003-conversation-adoption-research/spec.md` prints the path.
- [x] T002 Bind the loop config (`R/deep-research-config.json`). Verify: `grep -c gpt-6-luna R/deep-research-config.json` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the Luna lineage (`R/lineages/luna/iterations/`). Verify: `ls R/lineages/luna/iterations | wc -l` prints 8.
- [x] T004 Audit the 28 packages the Luna lineage skipped (`R/lineages/devin/iterations/`). Luna hit its usage limit after 8 iterations, so a cli-devin lineage on `deepseek-v4-1-flash-max` ran instead. Verify: `ls R/lineages/devin/iterations | wc -l` prints 6.
- [x] T005 Merge both lineages (`R/findings-registry.json`, `R/resource-map.md`). Verify: `fanout-merge.cjs` and `reduce-state.cjs` exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Write the synthesis (`R/research.md`). Verify: `grep -c '^## ' R/research.md` prints 9.
- [x] T007 Run the closeout (`synthesis-closeout.cjs --stop-reason manualStop`). Verify: closeout and gateway both exit 0.
- [x] T008 Validate the packet. Verify: `validate.sh --strict --recursive` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: five claims from each lineage spot-checked against scenario files
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

---
