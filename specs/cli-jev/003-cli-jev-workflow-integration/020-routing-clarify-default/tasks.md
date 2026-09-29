---
title: "Tasks: Phase 20: routing-clarify-default"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "clarify default tasks"
  - "score-clarify-default tasks"
  - "clarify census tasks"
  - "clarify label gate verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 20: routing-clarify-default

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

`S` is `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` and `T` is `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`, both proposed. Parent D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel. Tasks marked "past the gate" are outside this phase's completion.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record sk-create-skill's `node --test` pass and fail counts as the baseline, and confirm phase 021's build is not running (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/`)
- [ ] T002 Read the owners' contracts before writing: `compiled-route.cjs:30-110`, each hub's clarify branch named in `spec.md` section 2, `validate-compiled-routing-scenarios.cjs:141-205` and `:304`, and the hubs' `mode-registry.json`. Route the code write through sk-code's OpenCode route
- [ ] T003 [P] Build the test fixtures: a synthetic hub engine that returns route, clarify with mode alternatives and clarify with checklist alternatives, a synthetic transcript directory, and rows files with 29 and 30 labeled rows (`T`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Prompt sources: canary fixtures, playbook scenarios through `parseScenario` and advisor corpus rows mapped to their compiled hub, each unparsed prompt counted per hub and source (`S`)
- [ ] T005 Engine replay through `loadHubEngine` and `evaluate`, recording action and alternatives, and the per-hub, per-source report with checklist alternatives kept apart (`S`)
- [ ] T006 Transcript count behind `--transcripts <dir>`: front-door lines with `"action":"clarify"` against other actions, per hub, counts only. `real clarify rate: not measured` without the flag (`S`)
- [ ] T007 Rows writer behind `--rows-out <file>`: id, hub, source, committed prompt, alternatives, `gold` when the scenario's mode is among them, `label` empty (`S`)
- [ ] T008 Scorer: label validation with exit 2 on a foreign label, the 30-row gate line, the first-alternative baseline and `no headroom` above 90 percent (`S`)
- [ ] T009 Gates, arms and verdict per `spec.md` section 4: identity line, both skip line sets, `--out` refusal before output, the payload and cost lines, three rotations, exit handling, `calls.jsonl` and the verdict line on stdout and in `report.json` (`S`)
- [ ] T010 [P] One row each in `sk-create-skill/scripts/README.md` and `scripts/tests/README.md`
- [ ] T011 The sk-doc docs through their modes: `sk-create-skill/SKILL.md`, README, the next changelog file, one playbook scenario with its index row, and the hub catalog entry `feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` with its index row. Then regenerate the Hermes copy, the sk-doc leaf manifest pair and the trigger index when its `--check` reports stale docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 `node --test` on `T` exits 0 with at least 16 passing tests: the happy path and edge case of each REQ-009 surface (`T`)
- [ ] T013 One census run on the real tree with stub `jev` and `cli-deem` first on `PATH`. Both stub logs stay empty. Record per-hub clarify counts, the rows-with-gold count and the unparsed counts in `goal.md`'s log
- [ ] T014 Write the real rows file to an operator-named path outside the repository, then run the scorer on it and record the `stop: fewer than 30 labeled rows` line in `goal.md`'s log. The phase closes here
- [ ] T015 `git status --porcelain` is identical before and after T013 and T014, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` exits 1
- [ ] T016 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T010 and T011 changed (parent D6)
- [ ] T017 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, sk-create-skill's suite fails nothing beyond T001's baseline, then the parent orchestrator commits with path-scoped commits (parent D5)
- [ ] T018 Past the gate, outside this phase: the operator labels at least 30 rows, then one `--deem --out <dir>` run and, on the operator's flag, one `--jev --out <dir>` run, each verdict line logged in `goal.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T001 to T017 marked `[x]`. T018 is past the label gate
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the census and the gate ran on the real tree
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Label-gate precedent**: See `../003-goal-verifier-jev-shadow/spec.md` and `../006-goal-criteria-lint/spec.md`
<!-- /ANCHOR:cross-refs -->

---
