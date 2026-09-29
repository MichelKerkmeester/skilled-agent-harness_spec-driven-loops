---
title: "Tasks: Phase 22: alignment-folder-suggestion"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "alignment suggestion tasks"
  - "below-50 census tasks"
  - "alignment label gate verification"
  - "save path replay tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 22: alignment-folder-suggestion

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

`S` is `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` and `T` is `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts`, both proposed. Parent D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel. Tasks marked "past the gate" are outside this phase's completion.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the `cli` vitest project's pass and fail counts as the baseline, and confirm no other build is changing system-spec-kit's `SKILL.md`, README or changelog (`.skilled/skills/system-spec-kit/runtime/cli/tests/`)
- [ ] T002 Read the owners' contracts before writing: `alignment-validator.ts:477-712`, `folder-detector.ts:1011-1052` and `:1136-1170`, and `evals/check-architecture-boundaries.ts` for whether an eval may import `spec-folder/`. Route the code write through sk-code's OpenCode route
- [ ] T003 [P] Build the test fixtures: synthetic logs of both paths in every band, a synthetic transcript directory with a paired and an unpaired event, a synthetic specs tree with numbered siblings, and rows files with 29 and 30 labeled rows (`T`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Line scan: the decision, hard-block, alternative and pick lines of both paths, banded by decision line (`S`)
- [ ] T005 Committed-text census over the repository's text files, skipping source code, with the per-path report (`S`)
- [ ] T006 Path replay: both validator functions run non-interactively on synthetic save data, the CLI path against the real specs root and the data path against the synthetic tree, logs captured (`S`)
- [ ] T007 Transcript census behind `--transcripts <dir>`, counts only, and `transcript events: not measured` without the flag (`S`)
- [ ] T008 Rows writer behind `--rows-out <file>`: id, path, target, alternatives, `state` or `null`, `gold` from a pick and `label` empty. A path inside the repository exits 2 (`S`)
- [ ] T009 Scorer: label validation with exit 2 on a foreign label, the 30-row gate, the baseline choice and `no headroom` above 90 percent (`S`)
- [ ] T010 Gates, arms and verdict per `spec.md` section 4: identity line, `--accept-payload`, both skip line sets, the `--out` refusal before output, the payload and cost lines, three rotations, exit handling, `calls.jsonl` without row text and the verdict line on stdout and in `report.json` (`S`)
- [ ] T011 [P] One row each in `runtime/cli/evals/README.md` and `runtime/cli/tests/README.md`
- [ ] T012 The system-spec-kit docs through sk-doc: `SKILL.md`, README, the next changelog file, the catalog entry `feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md` and the playbook entry `manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md`, each with its index row. Then regenerate the Hermes copy. Regenerate the trigger index when its `--check` reports stale docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 The vitest file exits 0 with at least 18 passing tests: the happy path and edge case of each REQ-009 surface (`T`)
- [ ] T014 One census run on the real tree with stub `jev` and `cli-deem` first on `PATH`. Both stub logs stay empty. Record the per-path band counts and the path replay's alternative counts in `goal.md`'s log
- [ ] T015 Run the scorer on the synthetic rows file with 29 labels and record the `stop: fewer than 30 labeled rows` line in `goal.md`'s log. The phase closes here
- [ ] T016 `git status --porcelain` is identical before and after T014 and T015, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` exits 1
- [ ] T017 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T011 and T012 changed (parent D6)
- [ ] T018 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and the `cli` project fails nothing beyond T001's baseline. Then the parent orchestrator commits with path-scoped commits (parent D5)
- [ ] T019 Past the gate, outside this phase: the operator runs `--transcripts` and `--rows-out` on their session directory, labels at least 30 rows, then asks for one `--deem --out <dir>` run and, on their flag and after stripping secrets, one `--jev --accept-payload --out <dir>` run. Each verdict line goes into `goal.md`'s log
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T001 to T018 marked `[x]`. T019 is past the label gate
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the census, the path replay and the gate ran on the real tree
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Label-gate precedent**: See `../003-goal-verifier-jev-shadow/spec.md` and `../006-goal-criteria-lint/spec.md`
<!-- /ANCHOR:cross-refs -->

---
