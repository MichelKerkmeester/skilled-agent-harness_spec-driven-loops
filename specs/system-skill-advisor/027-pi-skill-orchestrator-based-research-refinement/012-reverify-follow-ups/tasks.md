---
title: "Tasks: Closing the Goal Re-verification Follow-ups"
description: "Task Format: T### [P?] Description (file path). One task group per follow-up, each closed by its own check from the final state."
trigger_phrases:
  - "goal re-verification follow-ups tasks"
  - "cp-003 teardown tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Closing the Goal Re-verification Follow-ups

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

- [x] T001 Confirm each follow-up FU1 to FU4 in its file, with path and line (`spec.md` §3)
- [x] T002 Record the baselines: the route guard, the Hermes check, the playbook validator on the advisor package and the live launcher's pid (`evidence/baselines.txt`)
- [x] T003 Scaffold this phase with `create.sh`, add D5 and its binding row to the parent goal and write this phase's goal
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reword cli-devin NEVER rule 1 and ESCALATE IF rule 4 so one approval covers a task, and set the version to 1.4.5.0 (FU1)
- [x] T005 Write the cli-devin 1.4.5.0 release entry (FU1)
- [x] T006 Rebuild the cli-devin Hermes copy in a scratch folder and copy back only that file (FU1)
- [x] T007 Re-mint the `cli-external-orchestration` runtime manifest and resync its authored copy (FU1)
- [x] T008 Add a teardown to CP-003 step 1, with its expected signal and failure row (FU2)
- [x] T009 Remove CP-004 sections 6 and 7 (FU3)
- [x] T010 Write the 2026-09-27 scenario 457 record and its index row (FU4)
- [x] T011 Record the first verify's findings in `spec.md`, then harden the teardown in CP-003 step 1 and CP-004 step 5 (FU2)
- [x] T012 Record the second verify's findings in `spec.md`, then replace both teardowns with one that sends no signal and waits for the sandbox daemon's 12-second idle exit (FU2)
- [x] T023 Record the third verify's findings in `spec.md`, then, on the operator's choice, add an open-file test to both teardowns so the daemon of a crashed launcher is waited out (FU2)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Negative control on each teardown: the committed CP-003 step 1 and the new block, each under a one-minute idle timeout (`evidence/cp003-negative-control.txt`, `-2-hardened.txt`, `-3-idle.txt`)
- [x] T014 Behaviour tests: the old and hardened teardowns on three inputs, a timed probe of the idle exit, then the final teardown on a hostile lease, a killed launcher and the normal path (`evidence/teardown-check/`)
- [x] T015 GPT-6 Luna max fast through cli-codex verifies the first three teardowns, and all three verdicts are FAIL (`evidence/luna-verify/report-1.txt`, `report-2.txt`, `report-3.txt`)
- [x] T016 GPT-6 Luna verifies the teardown with the open-file test and returns PASS (`evidence/luna-verify/report-4.txt`)
- [x] T017 Round 1: rerun CP-003 on the first teardown in the five CLIs, one at a time (`evidence/teardown-reruns/round-1/`)
- [x] T018 Round 3: rerun CP-003 and CP-004 on the final teardown in the five CLIs, two at a time, then check `/tmp` and every live advisor (`evidence/teardown-reruns/`). Round 2's eight runs on the signal-free teardown before the open-file test are in `round-2a/`
- [x] T019 Route guard, a compiled route for a Devin prompt, the Hermes check and `validate_document.py` on the edited docs, each against its T002 baseline
- [x] T020 Check every byte count and SHA-256 in the scenario 457 record against its file
- [x] T024 Probe which sandbox files the daemon holds open from its cold start to its exit, then run the old and the new wait against a held file, the daemon of a crashed launcher and the normal path (`evidence/teardown-check/probe-open-files*.txt`, `open-file-result.txt`)
- [x] T021 `check-goal.cjs` on the parent and this phase, `goal.cjs packet` at `packet_budget=ok` and `validate.sh --strict --recursive` on packet 030
- [x] T022 Prove the parent goal's six criteria again from the final state, since this phase changed two of its scenarios (`evidence/goal-reverify/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The CP-003 negative control shows a leftover folder before the fix and none after it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
