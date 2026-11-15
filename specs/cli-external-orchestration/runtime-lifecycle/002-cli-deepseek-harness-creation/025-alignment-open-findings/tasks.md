---
title: "Tasks: Phase 25: alignment-open-findings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment open findings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 25: alignment-open-findings

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

`DL` is `.skilled/skills/system-deep-loop` and `SA` is `.skilled/skills/system-skill-advisor/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rerun each failing check on main. Verify: the link check prints `5 broken` and the playbook check exits 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Repoint the five benchmark links (`cli-{cursor,opencode,pi}/benchmark/reports/`). Verify: the link check prints `0 broken`.
- [x] T003 Drop the dated run line (`setup-native-module-health-and-mcp-installation.md`). Verify: the playbook check exits 0.
- [x] T004 State the failed-required-gate FAIL rule (`DL/deep-review/SKILL.md` and three catalog entries). Verify: `grep -c "required quality gate" DL/deep-review/SKILL.md` prints 3.
- [x] T005 Name Mistral Vibe and fix the test count (`README.md`, the three hooks READMEs, `session-handover-loop.md`). Verify: `grep -c "six runtimes"` on the catalog entry prints 0.
- [x] T006 Name the retired mode folder (`.skilled/changelog/skilled/v4.0.2.1.md`). Verify: the coverage check prints `STATUS=OK`.
- [x] T007 Add the intent signals and recompile (`DL/graph-metadata.json`, `system-spec-kit/graph-metadata.json`, `SA/scripts/skill-graph.json`). Verify: both probes route to their skill.
- [x] T008 Record the `mode packet` dispute (`router-reach-allowlist.json`). Verify: the sk-doc reach check prints `RESULT: PASSED`.
- [x] T009 Regenerate the deep-review contract (`.skilled/commands/deep/assets/compiled/`). Verify: the drift check prints OK.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the routing suites (`SA`). Verify: scorer 7/7, holdout 6/6, divergence 9/9, golden 39/39 and the corpus floors print `"overall_pass": true`.
- [x] T011 Run the structural routing steps. Verify: each of the ten steps exits 0.
- [x] T012 Validate this phase and its parent. Verify: `validate.sh --strict` prints `RESULT: PASSED` for both.
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
