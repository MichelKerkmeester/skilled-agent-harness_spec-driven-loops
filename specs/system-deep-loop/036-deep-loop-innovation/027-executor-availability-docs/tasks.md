---
title: "Tasks: Correct the deep-loop command contracts to state the real per-command CLI executor sets"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Correct the deep-loop command contracts to state the real per-command CLI executor sets

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

- [x] T001 Read the four executor resolvers and record each command's accepted set (`executor-config.ts`, `fanout-run.cjs`, `orchestrate-session.cjs`, `dispatch-model.cjs`, `executor-dispatch.cjs`)
- [x] T002 Enumerate every in-scope doc that names an executor set, before editing any of them
- [x] T003 [P] Confirm `assets/compiled/*.contract.md` are generated artifacts with recorded source digests, not hand-authored files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the seven-kind fan-out set in the research and review contracts, including Q-Exec options D-G (`deep-research-presentation.txt`, `deep-review-presentation.txt`)
- [x] T005 Correct the council contract to its own five-kind set, drop the two rejected kinds and the unaccepted `active-runtime` default (`deep-ai-council-presentation.txt`, `-auto.yaml`, `-confirm.yaml`)
- [x] T006 Correct the model-benchmark grader set and realign the ASCII panel line to the panel's 69-character width (`deep-model-benchmark-presentation.txt`)
- [x] T007 Correct the agent-improvement dispatcher line, the skill-benchmark live transports, and the three `system-deep-loop` packet docs that repeat a stale list
- [x] T008 Replace the two stale fail-fast claims - `cli-opencode` without `--model` (it defaults) and "reserved-but-unwired executor kinds" (none remain) - with the real failure modes
- [x] T009 Regenerate the three compiled contract artifacts (`compile-command-contracts.cjs --write`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Negative control: run `check-contract-drift.cjs` after the source edits and before regeneration - observed exit 2 naming all three commands
- [x] T011 Re-run `check-contract-drift.cjs` from the final state - observed exit 0, `[CONTRACT DRIFT] OK commands=3`
- [x] T012 Run `check-projection-coverage.cjs` - observed exit 0, `"ok":true`, `"violations":[]`
- [x] T013 Re-read every edited region rather than trusting the writes; confirm the ASCII panel measures 69 characters per line
- [x] T014 Residue rescan for any surviving two-executor enumeration - one further hit found in `feature-catalog.md` and fixed
- [x] T015 Scan the compiled diff for absorbed content unrelated to this change - only digest refreshes found
- [x] T016 Validate this packet with `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed - every edited region re-read from disk
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



