---
title: "Tasks: Phase 14: sk-design-doc-and-routing-check"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk design doc and routing check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: sk-design-doc-and-routing-check

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Rerun `node .skilled/bin/compiled-route.cjs --hub sk-design` for "make a bar chart of monthly revenue" and "generate a DESIGN.md from this website", and once with `SPECKIT_COMPILED_ROUTING=0`. Save stdout and exit codes (`scratch/baseline-routes.txt`). Evidence: orchestrator at `6f47c32dce`, before any edit. The chart prompt printed action `route` to `sk-design-chart`, the DESIGN.md prompt routed to `sk-design-md-generator` and the kill switch printed `{"servingAuthority":"legacy","hubId":"sk-design"}`, exit 0. The outputs are recorded in the orchestrator's build evidence, not saved as `scratch/` files
- [x] T002 [P] Run `node .skilled/bin/compiled-route-admission.cjs --hub sk-design --json` and save it (`scratch/baseline-admission.json`). Evidence: verdict `drift`, pass 3 drift 1 over 4 scenarios, exit 1 (SD-007 `wrong-mode`: missing `sk-design-chart`, routed `sk-design-diagram`). The same run is kept as `raw/admission.json` in the report folder (T009)
- [x] T003 [P] Run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design` and save it as the baseline (`scratch/baseline-parent-check.txt`). Evidence: exit 0, "all hard invariants passed, 0 warnings". The expected `12-lib` exit 1 no longer occurs after the main merge
- [x] T004 [P] Run the same-class inventory `rg -n 'isPass[^A-Za-z]|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` and save it (`scratch/baseline-gate-inventory.txt`). Evidence: 26 lines in 11 files, as planned
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rewrite rule 6 to match T001: on a route, tell the reader to take the mode from the front door and fall back to the routing section on a legacy sentinel or an error. On a sentinel, keep rule 6 and record the finding (`.skilled/skills/sk-design/SKILL.md:202-203`). Evidence: brief 01 (pi), commit `fb04862cee`. `grep -c 'not in the compiled closure'` prints 0 and numstat `4 2`. Rule 6 now sits at `SKILL.md:202-205`
- [x] T006 Record the owner's gate choice, date and name (`spec.md` section 10). Evidence: "Owner choice: A, 2026-09-27, the operator", commit `6f47c32dce` (18:04), before the first gate edit in `fb04862cee` (18:30)
- [x] T007 Option A: rewrite each line T004 lists to say the gate passes on zero hard failures in `target`, `schema` and `provenance`, and turn `claims >= 80` expected signals into `failures: []` (the 11 md-generator files in `spec.md` section 3). Evidence: briefs 02 to 12 (pi), commit `fb04862cee`. Per-file numstat matched the index (`2 2`, `5 5`, `1 1`, `1 1`, `3 3`, `1 1`, `4 4`, `7 7`, `1 1`, `1 1`, `1 1`), 27 lines in 11 files, and the old pattern counts 0 in each. Deviation: briefs 08 to 10 write `claims 100`, not `failures: []`, because those lines already assert zero failures and a zero-failure run scores `claimsScore` 100 (`validate.ts:661`)
- [x] T008 Option B instead of T007: after the operator's yes to the install, change `isValidationPass` and add one vitest case on each side of the rule (`backend/scripts/validate.ts:699-701`, `backend/tests/validate.test.ts`). N/A: the owner chose option A, so no brief covered option B and no install ran. `git diff --stat 6f47c32dce..HEAD -- .skilled/skills/sk-design/sk-design-md-generator/backend` is empty
- [x] T009 Copy T002's output into the run folder (`.skilled/skills/sk-design/benchmark/reports/<run-label>/raw/admission.json`). Evidence: `raw/admission.json` in `2026-09-27--manual-testing-playbook--hub-routing-replay`, commit `def91d168d`. Its `hubs[0]` prints `drift {"pass":3,"drift":1,...}` and 4 scenarios
- [x] T010 Write the run script with one `probe` per mode scenario, its prompt copied verbatim from the `Real user request:` bullet or the `Exact Prompt` cell, and run it into `raw/mode-routing.txt` (`.skilled/skills/sk-design/benchmark/reports/<run-label>/raw/mode-routing-run.sh`). Evidence: brief 13 (codex gpt-5.5 medium), commit `fb04862cee`. `bash -n` exit 0, 49 probe lines, and the prompt diff against each scenario's bullet printed `IDENTICAL` over 49 lines. The run exited 0 with 49 sections and 49 `RC: 0`, and a second run was byte-identical (commit `def91d168d`)
- [x] T011 Write the report: run identity, the N of M figure over 53 scenarios, one row per scenario with its gold and routed mode, every n/a and every miss named, SD-007 recorded as found (`.skilled/skills/sk-design/benchmark/reports/<run-label>/skill-benchmark-report.md`). Evidence: commit `def91d168d`, recounted against `raw/`. **40 of 52 scored, 1 n/a (`SKD-031`), 12 misses**, so 52 plus 1 is 53. `validate_document.py --type readme` prints `VALID`, exit 0
- [x] T012 Add the run's row to section 2 (`.skilled/skills/sk-design/benchmark/README.md`). Evidence: brief 14 (pi), commit `def91d168d`. `grep -c` of the run label prints 1 and numstat `1 0`
- [x] T019 After T009 to T011 record the baseline, diagnose SD-007: read the scenario and its gold, its compiled route and the keywords `hub-router.json` gives chart and diagram, and write the cause into the report (`manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md`, `hub-router.json`). Evidence: report section 6. The prompt names flowcharts and no chart, and `flowchart` is diagram vocabulary (`hub-router.json:125-127`). The gold had been pointed at chart plus diagram without a prompt change. Confirmed by the orchestrator
- [x] T020 Put the smallest fix, a vocabulary change or a gold correction, to the sk-design owner and record the yes (`spec.md` section 10). Evidence: the operator answered "Correct the gold (Recommended)", recorded as `SD-007 fix approved: option (b)` in commit `c114d00d97`, before the fix
- [x] T021 Apply the approved fix. Under the vocabulary option, re-mint sk-design's activation manifest with the routing owner's tool and confirm `compiled-route-status.cjs --hub sk-design` reports `compiled-serving` (`hub-router.json` or the SD-007 frontmatter, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-design/manifest.json`). Evidence: brief 15 (pi), commit `31768cc51e`. The frontmatter gold now names `sk-design-diagram` and its two diagram leaves, numstat `4 10`, and the diff touches frontmatter lines only. `hub-router.json` is unchanged. `compiled-route-status.cjs --hub sk-design` prints `"causeCode":"compiled-serving"`, exit 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Happy path: `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` prints 0 and the live route still prints `"action":"route"`. Evidence: phase-close gates g1 and g2 at `31768cc51e`. The chart prompt routes to `sk-design-chart` and the grep prints 0
- [x] T014 Edge cases: the kill-switch run prints the legacy sentinel and the new rule 6 names that case. The report's N and M match a count of the `raw/` captures. Evidence: g1 prints the legacy sentinel, exit 0. Rule 6 says "On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing in section 2 instead" (`SKILL.md:204-205`). The orchestrator recounted the report against `raw/`: 4 admission rows and 49 `### ` blocks
- [x] T015 Gate check for the chosen option: the `rg` returns no match (A) or backend `npm test` exits 0 (B). Evidence: g3, `rg` prints no match, exit 1, and the backend diff since `6f47c32dce` is empty
- [x] T016 Scope: `git status --porcelain` lists only `.skilled/skills/sk-design/`, this phase folder and, under the SD-007 vocabulary option, sk-design's activation manifest. Evidence: g6 lists every path changed since `6f47c32dce` under `.skilled/skills/sk-design/`, this phase, `.hermes/skills/` or the two sk-design activation manifests. The gold option was taken, yet `fb04862cee` carries the re-minted manifest (the pre-commit route-remint gate, because the hub `SKILL.md` is a routing input), its `specs/sk-doc/019` mirror and two regenerated Hermes copies. All are generated, but they sit outside the scope this task names. The orchestrator's amendment at close allows these generated derivatives (AC-006 and the `goal.md` log), so the scope check passes: the four paths are the only ones outside `.skilled/skills/sk-design/` and this phase
- [x] T017 Rerun `parent-skill-check.cjs` and compare with T003. No new failure. The `12-lib` failure is the worktree provisioning fault phase 018 plans, not an sk-design fault. Evidence: g5, exit 0, "all hard invariants passed, 0 warnings", the same as T003. The `12-lib` failure did not occur at either point
- [x] T022 After T021: `compiled-route-admission.cjs --hub sk-design` prints 4 pass and exits 0, and a rerun of T010's script into a second capture shows no scenario that matched its gold in the baseline and misses now. Evidence: admission prints "sk-design pass 4 pass, 0 drift, 0 stale, 0 n/a; 3 mode(s) without gold", exit 0. `raw/mode-routing-after-fix.txt` is byte-identical to `raw/mode-routing.txt` (`cmp` rerun while closing the docs), so no scenario moved. `compiled-route-guard.cjs` reports all hubs fresh, exit 0
- [x] T018 Update `implementation-summary.md`, `acceptance-criteria.md` and `goal.md` with evidence, then run `validate.sh --strict` on this phase. Evidence: the three docs record the build evidence, and `validate.sh --strict` and `check-goal.cjs` results are in `implementation-summary.md` Verification
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T008 is N/A under option A
- [x] No `[B]` blocked tasks remaining. Evidence: T006 and T020 hold the owner's answers, which unblocked T007 and T021. T008 is N/A under option A
- [x] Manual verification passed. Evidence: T013 to T015, T017 and T022
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-008
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` sections 3 and 4
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` section 6. Both owner answers are recorded in `spec.md` section 10, and the front door routed sk-design throughout
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: the only script, `raw/mode-routing-run.sh`, passes `bash -n` (exit 0). The report prints `VALID` under `validate_document.py --type readme`, exit 0
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the replay printed 49 `RC: 0` in 49 sections, and `parent-skill-check.cjs` reports 0 warnings
- [x] CHK-012 [P1] Error handling implemented. Evidence: rule 6 sends a legacy sentinel or any error to the section 2 routing (`.skilled/skills/sk-design/SKILL.md:202-205`)
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the run script follows the `probe` shape of the cli-jev `hub-routing-run.sh` precedent and calls only `node .skilled/bin/compiled-route.cjs`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, 8 of 8 Met, AC-006 after its amendment at close
- [x] CHK-021 [P0] Manual testing complete. Evidence: the orchestrator read every replay miss in the report and each option A line against `validate.ts:661` and `:699-701`
- [x] CHK-022 [P1] Edge cases tested. Evidence: the kill-switch sentinel (T014), a second replay run byte-identical to the first and the post-fix replay byte-identical to the baseline (T022)
- [x] CHK-023 [P1] Error scenarios validated. Evidence: `SPECKIT_COMPILED_ROUTING=0` prints the legacy sentinel with exit 0, the case rule 6 now names
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Classes: rule 6 `instance-only`, the gate wording `class-of-bug` over 11 files, SD-007 `matrix/evidence` (a wrong gold)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: the T004 `rg` found 26 lines in 11 files before the build and none after (g3)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: no code symbol changed under option A. The SD-007 gold is read only by the admission harness, which now prints 4 pass
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A: docs, a gold correction and a read-only replay, with no security, path, parser or redaction surface
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` affected surfaces. The replay covers 4 admission rows plus 49 mode rows, 53 in all
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: the `SPECKIT_COMPILED_ROUTING=0` run, which prints the legacy sentinel
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: commits `fb04862cee`, `def91d168d` and `31768cc51e`, diff range `6f47c32dce..31768cc51e`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the captures hold prompts and routing JSON only, and the run script needs no credential
- [x] CHK-031 [P0] Input validation implemented. N/A: no code takes input. The run script's prompts were diffed against their scenarios and printed `IDENTICAL` over 49 lines
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no auth surface. No model, classifier or network call was made by the replay
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec, plan, tasks, acceptance criteria, goal and summary agree on Complete, and the stale gate-choice rows now read as made
- [x] CHK-041 [P1] Code comments adequate. Evidence: the run script's header states what it replays and that it makes no model or network call. `grep -nE 'specs/|REQ-[0-9]|AC-[0-9]|cli-jev|phase'` over it prints nothing, exit 1
- [x] CHK-042 [P2] README updated (if applicable). Evidence: `benchmark/README.md` section 2 has the run's row (T012)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: `scratch/` holds only `.gitkeep` and `briefs/`
- [x] CHK-051 [P1] scratch/ cleaned before completion. Deviation: `scratch/briefs/` is kept on purpose as the record of what each executor was sent. Nothing else is in `scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27. CHK-051 keeps `scratch/briefs/` as a recorded deviation
<!-- /ANCHOR:summary -->

---
