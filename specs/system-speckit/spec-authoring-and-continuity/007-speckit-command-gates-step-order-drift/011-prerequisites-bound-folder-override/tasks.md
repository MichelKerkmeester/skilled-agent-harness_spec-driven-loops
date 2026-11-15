---
title: "Tasks: Phase 11: prerequisites-bound-folder-override"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "prerequisites bound folder override tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: prerequisites-bound-folder-override

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

**Variables**: `A` is `.skilled/commands/speckit/assets`. `S` is `.skilled/skills/system-spec-kit/runtime/cli/setup`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the bare call, the override call and the four test counts (`scratch/baseline.txt`). Verify: `rg -c '^\$ ' scratch/baseline.txt` prints 8, the bare call shows exit 1 and the override call exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Prefix the step 1 call and restate the `prerequisites_complete` criterion with the bound folder (`A/speckit-implement.yaml`). Verify: `rg -c 'SPECIFY_FEATURE=' A/speckit-implement.yaml` prints 2.
- [x] T003 [P] Prefix the step 5 call (`A/speckit-plan.yaml`). Verify: `rg -c 'SPECIFY_FEATURE=' A/speckit-plan.yaml` prints 1.
- [x] T004 [P] Prefix the three calls (`A/speckit-complete.yaml`). Verify: `rg -c 'SPECIFY_FEATURE=' A/speckit-complete.yaml` prints 3.
- [x] T005 [P] Add a paragraph naming `SPECIFY_FEATURE`, its nested-packet form and the script lines that read it (`S/README.md`). Verify: `rg -n 'SPECIFY_FEATURE' S/README.md` prints one line or more.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the four workflow tests and parse all three YAMLs (`scratch/after.txt`). Verify: the counts match `scratch/baseline.txt` and `python3 -c 'import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]'` on the three files exits 0.
- [x] T007 Run the rewritten implement step 1 command for packet 015 (`scratch/after.txt`). Verify: `SPECIFY_FEATURE=agents/007-agent-alignment-follow-ups/015-review-verdict-gate-rule bash S/check-prerequisites.sh --json` exits 0, and `rg -n 'Run bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites' A/speckit-plan.yaml A/speckit-implement.yaml A/speckit-complete.yaml` exits 1.
- [x] T008 Run strict validation on this folder (`spec.md`). Verify: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/after.txt` shows the step 1 command exiting 0 for packet 015
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: `specs/agents/007-agent-alignment-follow-ups/015-review-verdict-gate-rule`, whose implement run stopped at this gate
<!-- /ANCHOR:cross-refs -->


---



