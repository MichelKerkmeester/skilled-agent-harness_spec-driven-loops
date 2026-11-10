---
title: "Tasks: Closing the Phase 12 Review Findings"
description: "Task Format: T### [P?] Description (file path). One task per fix, each closed by its own check from the final state."
trigger_phrases:
  - "phase 12 review findings tasks"
  - "teardown guard tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Closing the Phase 12 Review Findings

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

- [x] T001 Confirm each finding F1 to F11 in its file, with path and line (`spec.md` §3)
- [x] T002 Record the baselines: the live advisor, the generation file, the live lease, the route guard, the Hermes check, the README manifest test and strict validation (`evidence/baselines.txt`)
- [x] T003 Scaffold this phase with `create.sh`, write its goal and bind it in the parent goal
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Give scenario 433 the signal-free wait, its 12-second idle timeout, the `lsof` self-check, the variable check and `rm -r` (F1, F3, F4, F9)
- [x] T005 Add the `lsof` self-check, the variable check, `rm -r` and the new kept-sandbox message to CP-003 step 1 and CP-004 step 5 (F3, F4, F9, F10)
- [x] T006 Correct the phase 12 records: the round 2a line, REQ-005, the FU2 bullet, the 457 count, the case B claim, the Codex counts, the carry-over claim and the live-launcher note (F2, F5, F6, F9, F10)
- [x] T007 Refresh the parent's derived metadata after this phase's, so its status reads from finished children (F7). Phase 12's was refreshed first as well, since this phase corrected its docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the `lsof` and variable checks against the phase 12 blocks and the new ones (`evidence/guard-checks/`)
- [x] T009 Run each new block as written and watch for a returning folder (`evidence/guard-checks/`)
- [x] T010 Run the watched crash test once (`evidence/crash-test/`)
- [x] T011 GPT-6 Luna max fast through cli-codex verifies the three blocks (`evidence/luna-verify/`)
- [x] T012 Rerun 433, CP-003 and CP-004 in the five CLIs, two at a time, then check `/tmp` and the live advisor (`evidence/reruns/`)
- [x] T013 `validate_document.py` on the three scenario files, the route guard, the Hermes check and the README manifest test, each against its T002 baseline (`evidence/final-gates.txt`. T002 recorded no validator baseline, so the HEAD copies supplied it in `evidence/validate-document-baseline.txt`)
- [x] T014 `check-goal.cjs` on the parent and this phase, `goal.cjs packet` at `packet_budget=ok` and `validate.sh --strict --recursive` on packet 030 (`evidence/strict-validate.txt`)
- [x] T015 Prove the parent goal's six criteria again from the final state (`evidence/goal-reverify/`)
- [x] T016 Trace each `live generation file CHANGED` from the reruns, add F12's triage to 433 and CP-004, rerun each traced run once and have GPT-6 Luna verify the trace (`evidence/reruns/generation-trace.txt`, `evidence/luna-verify/report-2.txt` to `report-4.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] With `lsof` hidden, each new block keeps its sandbox where its phase 12 form removes it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
