---
title: "Tasks: Phase 2: router-file-tooling"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "router file tooling tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: router-file-tooling

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`RS` is `.skilled/skills/sk-code/sk-code-skilled/assets/scripts`. `RT` is `.skilled/skills/sk-code/sk-code-skilled/scripts/tests`. `AD` is `.skilled/skills/system-skill-advisor/runtime`. `HM` is `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the source probe baseline. Verify: the `node -e` probe in `spec.md` section 2 prints `{"hub-router.json":7,"inline":6}`. Observed: it printed `{"hub-router.json":7,"inline":6}` before the first change and the same string after the last one.
- [x] T002 Capture the guard baselines. Verify: `node $RS/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`, and `python3 $RS/verify_alignment_drift.py --root .skilled/skills --check-router` prints `Findings: 0` over 5419 files. Observed: `router-sync: 5/5 checks passed`, and `[alignment-drift] PASS` with `Scanned files: 5419` and `Findings: 0`.
- [x] T003 [P] Capture the suite baselines. Verify: `node --test $RT/verify-router-sync.test.cjs` prints `pass 9`, `python3 $RS/test_verify_alignment_drift.py` prints `Ran 30 tests` and `OK`, and `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` prints `pass 42`. Observed: `pass 9`, `Ran 30 tests` ending in `OK`, and `pass 42`.
- [x] T004 [P] Confirm the heading grammar against real files. Verify: `grep -rl "MACHINE ROUTER" --include=SKILL.md .skilled/skills | wc -l` prints 54, `grep -l "MACHINE ROUTER" .skilled/skills/*/ROUTER.md | wc -l` prints 0, and `grep -rn "^## .*MACHINE-READABLE ROUTER" .skilled/skills/*/ROUTER.md | wc -l` prints 7. Observed: 54, 0 and 7.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create the resolver with the heading grammar, the two candidate documents and the three verdicts (`$RS/router-file-resolver.cjs`). Verify: `node -e 'require("./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs")'` exits 0. Observed: the resolver suite requires the module at the top of the file and printed `pass 7 fail 0`, so the require exits 0.
- [x] T006 Add the resolver unit set, one case per verdict plus one for a file with no heading (`$RT/router-file-resolver.test.cjs`). Verify: `node --test $RT/router-file-resolver.test.cjs` prints `pass 4`. Observed: `pass 7 fail 0`.
- [x] T007 Point `parseRouter` at the resolver and keep its return shape (`$RS/router-replay-lib.cjs`). Verify: the source probe still prints `{"hub-router.json":7,"inline":6}`. Observed: the probe printed `{"hub-router.json":7,"inline":6}`, the same string as the baseline.
- [x] T008 Add a router-in-`ROUTER.md` case and a dual-declaration case to the sync suite (`$RT/verify-router-sync.test.cjs`). Verify: `node --test $RT/verify-router-sync.test.cjs` prints `pass 11`. Observed: `pass 11 fail 0`, up from 9.
- [x] T009 Point `readSkillRouter` at the resolver instead of reading `SKILL.md` itself (`$RS/verify-router-sync.cjs`). Verify: `node $RS/verify-router-sync.cjs` prints `5/5 checks passed`. Observed: `router-sync: 5/5 checks passed`.
- [x] T010 Read declarations from `ROUTER.md` when it holds a machine-router section, and keep paths rooted at the skill (`$RS/verify_alignment_drift.py`). Verify: the scan over `.skilled/skills` still prints `Findings: 0`. Observed: `[alignment-drift] PASS`, `Scanned files: 5420`, `Findings: 0`.
- [x] T011 Add a `ROUTER.md` case and a dual-declaration case to the scan suite (`$RS/test_verify_alignment_drift.py`). Verify: `python3 $RS/test_verify_alignment_drift.py` prints `Ran 32 tests` and `OK`. Observed: `Ran 36 tests` ending in `OK`, up from 30.
- [x] T012 Carry `ROUTER.md` into each generated copy and check it for drift (`$HM`). Verify: `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` prints `pass 6` today and one more passing case for the copied file. Observed: `pass 7 fail 0`, up from 6, and the live sync wrote 7 of 65 copies so each hub copy now carries `ROUTER.md`, with `--check` printing `PASS: 65 Hermes skill copies in sync`.
- [x] T013 Add the `ROUTER.md` probe to `buildSourceSnapshot` (`$AD/lib/freshness.ts`). Verify: `cd $AD && node_modules/.bin/vitest run tests/legacy/advisor-freshness.vitest.ts` prints `Tests 12 passed`. Observed: `npm run typecheck` and `npm run build` in the advisor runtime both exited 0, and the combined run that covers `tests/legacy/advisor-freshness.vitest.ts` reported `3 files, 20 tests passed`.
- [x] T014 Add the same probe to `advisorSourceSignature` (`.opencode/plugins/system-skill-advisor.js`). Verify: `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` prints `pass 42`. Observed: `pass 42 fail 0`, unchanged, because the probe adds a part only for a skill that carries the file.
- [x] T015 Add the `router-md` reason and the target discovery (`$AD/lib/daemon/watcher.ts`), with one case in the watcher suite (`$AD/tests/daemon-watcher-new-root-ingestion.vitest.ts`). Verify: `cd $AD && node_modules/.bin/vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts` prints no failing case. Observed: the combined run covers that file and reported `3 files, 20 tests passed` with no failing case.
- [x] T016 Write the parity suite, one case per document in the fixture skill (`$AD/tests/parity/router-signature-parity.vitest.ts`). Verify: it passes, and deleting the plugin probe makes it fail. Observed: it passes inside the combined run, and the evidence records that it fails when the plugin probe is removed, checked by the worker that wrote it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run the resolver and scan suites together (`$RT`, `$RS`). Verify: `node --test $RT/router-file-resolver.test.cjs $RT/verify-router-sync.test.cjs` exits 0, and the Python suite prints `OK`. Observed: `pass 7 fail 0` and `pass 11 fail 0` from the two Node suites, and `Ran 36 tests` ending in `OK` from the Python suite.
- [x] T018 Run both guards over the live tree. Verify: `5/5 checks passed` and `Findings: 0` over 5420 files. Observed: `5/5 checks passed`, and `[alignment-drift] PASS` with `Scanned files: 5420` and `Findings: 0`.
- [x] T019 Run the advisor suites. Verify: freshness prints `Tests 12 passed`, and the watcher and parity suites print no failing case. Observed: `3 files, 20 tests passed` with no failing case.
- [x] T020 Run the phase gate. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/002-router-file-tooling --strict` prints `RESULT: PASSED`. Observed: `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, after `repair-derived.cjs --apply` refreshed the derived description and graph metadata that the level change left stale.
- [x] T021 Record the observed counts in `acceptance-criteria.md` and move each row that now passes to `Met`. Verify: every `Met` row names a command and the output the run printed. Observed: all 11 rows read `Met`, and each one names a command and the output that command printed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The source probe still prints `{"hub-router.json":7,"inline":6}`, so no live skill changed its router source in this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance gate**: See `acceptance-criteria.md`
- **Research findings**: See `../001-deep-research/research/research.md` sections 4, 5 and 9
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

This packet runs no task under `[B]`. A blocked task keeps its line pending, names the command that fails, and stops the phase gate, so the packet cannot close around it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented: `spec.md` section 4 carries REQ-001 to REQ-010, answered by `rg -c '^\| REQ-' spec.md` printing 10.
- [x] CHK-002 [P0] Technical approach defined: `rg -n 'router-file-resolver|parseRouter|check_router_paths' plan.md` names the resolver and its two moved callers in section 3.
- [x] CHK-003 [P1] Dependencies available: `node --version` prints 20.19 or newer and `python3 --version` prints 3.9 or newer.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script parses: `node --check` exits 0 for `router-file-resolver.cjs`, `router-replay-lib.cjs` and `verify-router-sync.cjs`, and `python3 -c 'import ast,pathlib; ast.parse(pathlib.Path(".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py").read_text())'` exits 0.
- [x] CHK-011 [P0] The advisor runtime typechecks and builds: `npm run typecheck` and `npm run build` in `.skilled/skills/system-skill-advisor/runtime` both exit 0.
- [x] CHK-012 [P0] No suite reports a failure: each `node --test` run prints `fail 0`, and the combined `vitest` run prints `3 files, 20 tests passed`.
- [x] CHK-013 [P1] The new module follows the house layout: `rg -c '^// [0-9]\.' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs` prints 5 for the five numbered sections.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance row is Met: `rg -c '\| Met \|' acceptance-criteria.md` prints 11 and no row reads `Unmet`.
- [x] CHK-021 [P0] One resolver case per verdict: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs` prints `pass 7 fail 0`.
- [x] CHK-022 [P1] Edge shapes are covered: `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` prints `Ran 36 tests` and `OK`, including the `ROUTER.md` and dual-declaration cases.
- [x] CHK-023 [P1] Failure paths exit non-zero: the two scan fixtures assert `returncode` 1 for `ROUTER-DEAD-PATH` and for `ROUTER-DUAL-DECLARATION`, answered by the same `Ran 36 tests` run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret is read or written: `rg -n 'password|secret|api[_-]?key|Bearer' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs` prints no match.
- [x] CHK-031 [P0] Path input is resolved before use: `rg -n 'path\.resolve' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs` prints 2, one per candidate document.
- [x] CHK-032 [P1] No authentication surface exists to test: `rg -n 'NFR-S01' spec.md` prints the recorded N/A and its reason.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and acceptance criteria agree on the scan count: `rg -c '5420' spec.md plan.md acceptance-criteria.md` names the same number in each file.
- [x] CHK-041 [P1] No ephemeral artifact label sits in a code comment: the strict run prints `+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found`.
- [x] CHK-042 [P2] The scripts README covers the new module: `rg -n 'router-file-resolver' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md` prints its row, and the code-file count in that file reads 8.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Each new file sits where its suite already lives: `ls .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs .skilled/skills/system-skill-advisor/runtime/tests/parity/router-signature-parity.vitest.ts` exits 0.
- [x] CHK-051 [P1] No temp file is left behind: each fixture case removes its own temp root, and `ls -A specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/002-router-file-tooling/scratch` prints only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->

---
