---
title: "Tasks: Phase 39: main-sk-doc-routing-repair"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "main sk doc routing repair tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 39: main-sk-doc-routing-repair

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
| `[C]` | Coordinator task: a gate, a rescore or the close-out |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root. Set the names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build SP=$PK/039-main-sk-doc-routing-repair/scratch DOC=.skilled/skills/sk-doc`. `FLOOR`, `EVAL` and `PLOG` are as phase 036's `tasks.md` defines them. `SEVEN` is the five failing test files: `tests/scorer/doctor-bridge-isolation.vitest.ts tests/doctor-routing-slice.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts tests/compat/python-compat.vitest.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Record the failing tests and the before gates (`$SP/before.txt`). Verify: `SEVEN` shows 7 failed, and `FLOOR` and `EVAL` print 24/44 0/35 2/44 and [160,49,21,5]. Evidence: before.txt: SEVEN 7 failed 63 passed (4 doctor-bridge-isolation, doctor-routing-slice, divergence ratchet, holdout-independent), FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], SIGNAL DRIFT sk-doc
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Narrow the named hook README phrases (`$DOC/ROUTER.md`). Verify: the four isolation cases and slice rows doctor-control-11, 12 and 14 pass. Evidence: HOOK_README 58 to 44: the 12 git-* named phrases and the 2 spec-gate ones dropped; isolation x4 and doctor-control-11/12/14 pass (try-variant.sh no-git-named+names:spec-gate)
- [x] T003 Narrow the runtime folder and hook mirror README phrases (`$DOC/ROUTER.md`, `$DOC/sk-create-readme/ROUTER.md`). Verify: slice row doctor-a-10 passes. Evidence: "hook mirror readme" dropped from RUNTIME_PLUGIN_README (7 to 6); doctor-a-10 passes; sk-create-readme/ROUTER.md carries no advisor intent, left as is
- [x] T004 Find which of main's new intents moved the holdout row and `rr-iter3-069`, reading only row ids and expected skills, and narrow it (`$DOC/ROUTER.md`). Verify: the holdout prints 49 of 63 or more and the ratchet passes. Evidence: one intent dropped at a time, counts only: SECURITY_POLICY "security policy" moved the holdout (48 to 49 without it), HOOK_README spec-gate names moved rr-iter3-069 (a labeled row, not holdout); SECURITY_POLICY keeps "security.md" only, any "security policy" phrase drops the holdout to 48; 69 of 69 pass
- [x] T005 Regenerate the intent signals and recompile the graph (`$DOC/graph-metadata.json`, `$ADV/scripts/skill-graph.json`). After T004. Verify: `generate-router-intent-signals.cjs --check` and `skill-graph-freshness.cjs --strict` exit 0. Evidence: generate-router-intent-signals --write --hub sk-doc then --check RESULT: PASSED; skill_graph_compiler --export-json; skill-graph-freshness --strict exit 0, SIGNAL DRIFT none
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [C] Probe README requests through the advisor CLI (`$SP/readme-probes.txt`). After T005. Verify: the session-handover hook, git-preflight hook and runtime folder README requests each top sk-doc. Evidence: readme-probes.txt: session-handover, git-preflight and spec-gate hook READMEs, runtime and plugins folder READMEs and SECURITY.md top sk-doc; git hooks, git rules, git standards top sk-git; runtime mirror drift tops command-doctor-runtime-mirrors
- [x] T007 [C] Rebuild and rerun the gates both ways (`$SP/after.txt`). After T006. Verify: 0 failed with the flag unset and set, `FLOOR` unchanged, `EVAL` [160,49,21,5] or better, stored sets unchanged. Evidence: after.txt: stored sets unchanged, intent signals PASSED, graph freshness exit 0, build and typecheck exit 0, child run 2349 passed 0 failed, unset run 2348 passed 1 failed on the 60 ms native scorer latency p95 gate under review load, which passes 21/21 three times alone; FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5]
- [x] T008 [C] Log the fix and the criterion 2 recheck (`../goal.md`). After T007. Verify: `packet_budget=ok`. Evidence: goal rows Phase 039, sk-doc routing repair and Criterion 2 recheck after phase 039; packet_budget=ok
- [x] T009 [C] Close the phase (`implementation-summary.md`). After T008. Verify: `validate.sh $PK/039-main-sk-doc-routing-repair --strict` prints `RESULT: PASSED`. Evidence: implementation-summary filled, acceptance criteria all Met, spec Complete, validate --strict RESULT: PASSED
- [x] T010 [C] Fix review pass ten's single-quoted command P1 (`$ADV/lib/command-attach.ts`, `$ADV/tests/command-attach-guards.vitest.ts`). Verify: the quote cases fail without the fix. Evidence: a single quote is dropped only where it opens a command name; three cases fail without it, 167 pass with it; contractions keep their apostrophe
- [x] T011 [C] Fix review pass ten's doctor install P1 (`.skilled/commands/doctor/assets/doctor-install-presentation.txt`, `doctor-install.yaml`, `scripts/tests/doctor-install-contract.test.cjs`). Verify: the contract passes and fails with main's wording. Evidence: the presentation names claude, codex, cursor, devin, dsh, opencode, pi and vibe from the manifest; the stale DSH sentence is gone from the workflow; the test reads the manifest; 17/17, and 16/1 with main's text; doctor tests 1266/0
- [x] T012 [C] Rerun the gates after the pass ten fixes (`$SP/after-pass-ten.txt`). Verify: 0 failed both ways. Evidence: 2353 passed 0 failed with the flag unset and set, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], stored sets unchanged; one doctor case failed only while the advisor dist rebuilt in parallel and passes 1266/0 on rerun
- [x] T013 [C] Fix review pass eleven's two P1 (`$ADV/lib/command-attach.ts`). Verify: the new cases fail without the fix. Evidence: a single quote that closes a command name is dropped and a retired name is read beside its replacement; three cases fail on the previous code, 170 pass with it
- [x] T014 [C] Pin the wrapper class in one test (`$ADV/tests/command-attach-guards.vitest.ts`). Verify: it fails on the code before passes ten and eleven. Evidence: every mention fixture reads the same wrapped in six marks or under the retired name; three cases fail on `2f3f893c153` and on `5b2b062baef`, all pass now
- [x] T015 [C] Fix the cheap pass eleven P2 and correct the two 039 claims routing-11 contradicted (`spec.md`, `implementation-summary.md`, the doctor contract test). Verify: doctor tests and the gate. Evidence: README template fallback named in purpose, REQ-003 and Known Limitations; the untouched router row removed; the contract test checks the workflow and drops a subsumed line; doctor tests 1266/0; gate in `$SP/after-pass-eleven-invariance.txt`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The goal log records the fix and the criterion 2 recheck
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

- [x] CHK-001 [P0] The seven failures reproduced on the merged HEAD and clean origin/main (T001). Evidence: before.txt and the clean origin/main run
- [x] CHK-002 [P1] The cause of each failure attributed to one of main's commits. Evidence: bisect plus one-intent-at-a-time runs: fad83abd791 security policy, f6f242c1392 hook mirror, 3dc90eb8e01 git-* and spec-gate names
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The change touches the router keyword lists and the two generated files only (`git diff --stat`). Evidence: git diff --stat lists the router, the generated metadata and graph, and the pass-ten fix files
- [x] CHK-011 [P1] No test, baseline or ledger file changed. Evidence: no test, baseline or ledger file changed for the routing repair; the doctor contract test changed only for the pass-ten P1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria all Met
- [x] CHK-021 [P0] Full suite 0 failed with the flag unset and set (`after.txt`). Evidence: after-pass-ten.txt 2353/0 both ways
- [x] CHK-022 [P1] README requests still reach sk-doc (`readme-probes.txt`). Evidence: readme-probes.txt
- [x] CHK-023 [P1] `FLOOR` unchanged and `EVAL` not lower. Evidence: FLOOR and EVAL equal before.txt
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each fix names its class. Evidence: data fix at the producer for the routing; producer fix for the quote; merge drift for the doctor wording
- [x] CHK-FIX-002 [P0] Every README intent main added was checked for the same class. Evidence: every README intent main added was measured in try-variant.sh
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No holdout or command prompt text read or printed; rows named by id and expected skill only. Evidence: the holdout was measured by count only; rr-iter3-069 is a labeled row, not holdout
- [x] CHK-031 [P0] `.skilled/hooks/hook-flags.env` neither read nor created. Evidence: never opened or created
- [x] CHK-032 [P1] N/A: no credential or auth path is touched. Evidence: no auth path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, tasks and the goal rows name the same narrowed intents. Evidence: spec, tasks, the router prose and the goal rows name the same intents
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence lives in this phase's `scratch/` only. Evidence: scratch holds before, after, probes and the variant scripts
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
