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

Closure (2026-09-29). Built and committed as `65c71719ac`. `BE` is `scratch/w4-build/build-evidence.md` and `SE` is `scratch/w4-session/session-evidence.md`; where the two disagree, `SE` wins.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record sk-create-skill's `node --test` pass and fail counts as the baseline, and confirm phase 021's build is not running (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/`). Evidence: at start HEAD `bf830c3d47` the dir run printed `tests 19, pass 18, fail 1`, the pre-existing `skill-root-metadata-contract.test.cjs` fleet-list mismatch, exit 1. `git status --porcelain -- .skilled/skills/sk-doc/sk-create-skill` printed nothing and no `build-021` brief exists (`BE` sections 1 and 2)
- [x] T002 Read the owners' contracts before writing: `compiled-route.cjs:30-110`, each hub's clarify branch named in `spec.md` section 2, `validate-compiled-routing-scenarios.cjs:141-205` and `:304`, and the hubs' `mode-registry.json`. Route the code write through sk-code's OpenCode route. Evidence: every code brief bound sk-code's route and carried the owners' contracts by line: brief 02 named `COMPILED_ROUTE_MODULE` and the `parseScenario` import, brief 05 modeled the verdict math on `score-track-narrowing.mjs:812-897`, brief 06 ported the gates from `score-jev-tiebreak.mjs:1359-1506`. The orchestrator read each dispatch's code against its brief (`BE` section 4)
- [x] T003 [P] Build the test fixtures: a synthetic hub engine that returns route, clarify with mode alternatives and clarify with checklist alternatives, a synthetic transcript directory, and rows files with 29 and 30 labeled rows (`T`). Evidence: briefs 01 to 03 built them, and `T` pins `the gate stops at 29 labeled rows` and `30 labeled rows pass the gate and print the fixed rule lines`. `node --test T`: `tests 28, pass 28, fail 0`, exit 0 (`BE` sections 4 and 5)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Prompt sources: canary fixtures, playbook scenarios through `parseScenario` and advisor corpus rows mapped to their compiled hub, each unparsed prompt counted per hub and source (`S`). Evidence: briefs 01 and 02. The real-tree run counts `total prompts=359 unparsed=24` and `corpus: rows=265 none=24 skill_firing=241 mapped=146 no_compiled_hub=95`, with 24 unparsed playbook scenarios (sk-code 7, cli-external-orchestration 17) counted and never dropped (`BE` sections 4, 5 and 9)
- [x] T005 Engine replay through `loadHubEngine` and `evaluate`, recording action and alternatives, and the per-hub, per-source report with checklist alternatives kept apart (`S`). Evidence: briefs 02 and 03. The run prints `route=239 clarify=3 defer=86 reject=7 clarify_mode=2 clarify_checklist=1`, and `system-deep-loop`'s canary clarify lands under checklist (`clarify_checklist=1`) with one mode clarify each on `cli-external-orchestration` and `sk-doc` (`BE` section 5 P1)
- [x] T006 Transcript count behind `--transcripts <dir>`: front-door lines with `"action":"clarify"` against other actions, per hub, counts only. `real clarify rate: not measured` without the flag (`S`). Evidence: brief 03, tests `countTranscripts counts each front-door line once, escaped or plain` and `the transcript count prints counts and no transcript text`. The real run without the flag prints `real clarify rate: not measured` (`BE` sections 4 and 5 P1)
- [x] T007 Rows writer behind `--rows-out <file>`: id, hub, source, committed prompt, alternatives, `gold` when the scenario's mode is among them, `label` empty (`S`). Evidence: brief 02, test `rowLines writes every label empty`. The run prints `rows written: 2 with_gold=0`, and `grep -c` finds `"label":""` on 2 of 2 rows (`BE` section 5 P2)
- [x] T008 Scorer: label validation with exit 2 on a foreign label, the 30-row gate line, the first-alternative baseline and `no headroom` above 90 percent (`S`). Evidence: brief 04, tests `the gate stops at 29 labeled rows`, `a label outside the row's alternatives exits 2 and names the row` and `a baseline above nine tenths prints no headroom`. On the real rows file the scorer prints `rows: 2 labeled=0 operator=0 committed_gold=0` then `stop: fewer than 30 labeled rows (0 labeled)`, exit 0 (`BE` sections 4 and 5 P2)
- [x] T009 Gates, arms and verdict per `spec.md` section 4: identity line, both skip line sets, `--out` refusal before output, the payload and cost lines, three rotations, exit handling, `calls.jsonl` and the verdict line on stdout and in `report.json` (`S`). Evidence: briefs 06 to 08b, 28 of 28 tests including `--deem without --out exits 2 before any output`, every skip line set and `a jev stub that answers the label keeps`. Gate code equals 002's `score-jev-tiebreak.mjs:1359-1506` with the 2,000 ms health timeout (`BE` sections 4 and 5 P3)
- [x] T010 [P] One row each in `sk-create-skill/scripts/README.md` and `scripts/tests/README.md`. Evidence: briefs 09 and 10, each `cmp`-identical to its verified draft, `validate_document.py` `Total issues: 0` (`BE` section 4)
- [x] T011 The sk-doc docs through their modes: `sk-create-skill/SKILL.md`, README, the next changelog file, one playbook scenario with its index row, and the hub catalog entry `feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` with its index row. Then regenerate the Hermes copy, the sk-doc leaf manifest pair and the trigger index when its `--check` reports stale docs. Evidence: briefs 11 to 17c wrote the nine docs, each `cmp`-identical to its draft with `validate_document.py` `Total issues: 0`. The Hermes copy is regenerated and in `65c71719ac`; the leaf manifest `--check` passed unchanged (`leaf-manifest.json OK`), and the trigger index follows in its own commit, rebuilt from an archive of HEAD (`BE` sections 4 and 6, `SE` section 4)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 `node --test` on `T` exits 0 with at least 16 passing tests: the happy path and edge case of each REQ-009 surface (`T`). Evidence: the session's rerun from the final state printed `tests 28, pass 28, fail 0`, exit 0, including `a deem stub that answers the label keeps` (`verdict deem: keep`) and `a deem stub that answers the first alternative stops on margin` (`SE` section 2, `BE` section 5 P3)
- [x] T013 One census run on the real tree with stub `jev` and `cli-deem` first on `PATH`. Both stub logs stay empty. Record per-hub clarify counts, the rows-with-gold count and the unparsed counts in `goal.md`'s log. Evidence: exit 0, empty stderr, `stub/calls.log` never created. Totals `clarify=3 clarify_mode=2 clarify_checklist=1 gold_in_alternatives=0`, `unparsed=24`, `rows written: 2 with_gold=0`; the counts are in `goal.md`'s log, recorded by this closure pass (`BE` section 5 P1, `SE` section 2)
- [x] T014 Write the real rows file to an operator-named path outside the repository, then run the scorer on it and record the `stop: fewer than 30 labeled rows` line in `goal.md`'s log. The phase closes here. Evidence: the scorer on the real rows file printed `stop: fewer than 30 labeled rows (0 labeled)`, exit 0, both bare and under `--deem --jev --out`, with no out folder and no stub call; the line is in `goal.md`'s log. Deviation: the rows file went to `scratch/w4-build/runs/census/rows.jsonl`, inside the repository, rather than an operator-named path outside it; the brief's write scope wins (`BE` sections 5 and 8, `SE` section 2)
- [x] T015 `git status --porcelain` is identical before and after T013 and T014, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` exits 1. Evidence: the grep exits 1 on `S` and on `T`. Porcelain before the runs and after them differs only by `system-skill-advisor/feature-catalog/feature-catalog.md`, build 019's concurrent path, so the runs themselves changed nothing (`BE` section 5 P4)
- [x] T016 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T010 and T011 changed (parent D6). Evidence: exit 0 and `Total issues: 0` on all nine changed docs, the playbook index with `--type playbook` and the catalog index with `--type feature_catalog` (`BE` section 5 P5, `SE` section 2)
- [x] T017 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, sk-create-skill's suite fails nothing beyond T001's baseline, then the parent orchestrator commits with path-scoped commits (parent D5). Evidence: Pi MiMo on the code `VERDICT: PASS` and Devin DeepSeek on the docs `VERDICT: PASS`, REQ-001 to REQ-010 met, 8 P2 findings recorded and not chased. The suite ends `tests 47, pass 46, fail 1`, the same one pre-existing failure as the baseline. Committed as `65c71719ac`, 14 files (`SE` sections 3 and 4)
- [ ] T018 Past the gate, outside this phase: the operator labels at least 30 rows, then one `--deem --out <dir>` run and, on the operator's flag, one `--jev --out <dir>` run, each verdict line logged in `goal.md`. Open for the operator: the committed prompts give 2 rows, so the gate needs `--transcripts` or hand-picked prompts, and the live Jev run waits on the operator's yes (parent D4, `SE` section 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001 to T017 marked `[x]`. T018 is past the label gate. Evidence: this closure pass, rows above
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the census and the gate ran on the real tree. Evidence: `BE` section 5 P1 and P2, rerun by the session from the final state (`SE` section 2)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Label-gate precedent**: See `../003-goal-verifier-jev-shadow/spec.md` and `../006-goal-criteria-lint/spec.md`
<!-- /ANCHOR:cross-refs -->

---
