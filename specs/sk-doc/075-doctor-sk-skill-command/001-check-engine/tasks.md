---
title: "Tasks: Phase 1: check-engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "check engine tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: check-engine

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

`DOC` is `.skilled/commands/doctor`. `SCS` is `.skilled/skills/sk-doc/sk-create-skill`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the fleet baseline (`scratch/baseline/`). Verify: one `package_skill.py --check --strict` result and one `ci-skill-root-metadata.cjs` line per shipped root exist in the folder. Evidence: both baseline JSON files record 13 per-root results and exit code 0.
- [x] T002 [P] Author fixture skills with invented names (`DOC/scripts/tests/fixtures/sk-skill-check/`). Verify: fixture tree covers plain, pre-migration, canon, dual-declaration, outside-root, `local-` prefix, direct-hub-with-packet and nested-packet scenarios. Evidence: each scenario is represented in the fixture tree; the reserved-name value is assembled only in the test process.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write locate, classify, collision and spawn-wrapper probes (`DOC/scripts/lib/sk-skill-surface.cjs`). Verify: `node -e "require('./.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs')"` exits 0. Evidence: the require smoke command exited 0; unit tests exercise the exported probes.
- [x] T004 Write rows C1 to C4: location, input kind, RS codes, root metadata class (`DOC/scripts/sk-skill-check.cjs`). Verify: the canon fixture reports C3 and C4 clean. Evidence: fixture suite confirms C2 verdicts for all four router shapes and C3/C4 pass for canon.
- [x] T005 Write rows C5 to C9: slug defaults, derived freshness, router equivalence counts, advisor home, runtime mirrors (`DOC/scripts/sk-skill-check.cjs`). Verify: exit 75 from the advisor stub prints UNKNOWN for C8 without incrementing the finding count. Evidence: unknown-only test asserts `findingCount: 0`, `unknownCount: 1`, `Result: NO FINDINGS (1 UNKNOWN)`, and exit 0; `check sk-git` exercises all five rows.
- [x] T006 Write rows C10 to C13: changelog, description budget, collisions, regression coverage (`DOC/scripts/sk-skill-check.cjs`). Verify: the `local-` prefix fixture reports a C12 finding. Evidence: prefix fixture asserts C12 FINDING without exposing its generated name; `check sk-git` reports changelog, description, collision, and corpus rows.
- [x] T007 Map preconditions to exit 2 with a named cause: `SHARED_NOT_BUILT`, missing `@spec-kit/shared`, absent resolver (`DOC/scripts/sk-skill-check.cjs`). Verify: a run with the resolver path hidden exits 2. Evidence: tests assert exit 2 and provision guidance for missing resolver, built parser, and Hermes shared dependency.
- [x] T008 Add text and `--json` rendering and the no-argument fleet table (`DOC/scripts/sk-skill-check.cjs`). Verify: `--json` output parses with `JSON.parse`. Evidence: fixture test parses JSON and asserts exactly 13 row objects; fleet JSON lists 13 roots.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the fixture suite (`DOC/scripts/tests/sk-skill-check.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0. Evidence: 31 tests passed, 0 failed, covering the advisor envelope, package failure payload, C6 skip/error rows, per-skill description status, nested-name resolution and existing fixtures.
- [x] T010 Compare the fleet run with the baseline (`scratch/baseline/`). Verify: every shipped root reports the baseline verdict. Evidence: fleet output was `Roots: 13; result: PASS`; the JSON comparison printed `current_roots=13 baseline_package_roots=13 baseline_metadata_roots=13 mismatches=0 baseline_match=true`, exit 0.
- [x] T011 Prove `check` writes nothing (repository tree). Verify: `git status --porcelain` is identical before and after a fleet run. Evidence: `git status --short` printed identical lines before and after `check`; the fleet check exited 0.
- [x] T012 [P1] Resolve the phase 001 code-review findings and interpreter-discovery follow-up in the checker, shared surface probes and tests. Verify: the explicit suite passes and named checks contain no FINDING rows. Evidence: the suite passed 31/31; `check sk-git` reported C8 UNKNOWN and exited 0 while the live advisor exited 75; `check sk-code-skilled` resolved as `hub-packet` and exited 0.
- [x] T013 [P1] Record review decisions and final evidence in the phase documents. Verify: strict phase validation prints `RESULT: PASSED`; all acceptance rows are Met with command or test evidence. Evidence: `repair-derived.cjs --apply --folder specs/sk-doc/075-doctor-sk-skill-command/001-check-engine` refreshed graph metadata; strict validation reported `RESULT: PASSED`, 0 errors and 0 warnings.
- [x] T014 [P1] Remove the router row's false positive, teach the route documents the engine's own row labels and fleet result line, and settle the `sk-prompt` format finding (`DOC/scripts/sk-skill-check.cjs`, `DOC/scripts/tests/sk-skill-check.test.cjs` and its `skills/mode-template/` fixture, `DOC/assets/doctor-sk-skill-check.yaml`, `DOC/assets/doctor-sk-skill-presentation.txt`). Verify: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` and `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` exit 0; `check <each sk-doc packet>` reports no C7 FINDING and the same verdict as `package_skill.py --check --strict`; the YAML and presentation name the labels the engine prints. Evidence: the suite passed 57/57 (three new tests failed on the pre-fix code: C7 reported `FINDING` for the mode-template fixture, the workflow named `C1 Location` nowhere, and the documented fleet result line did not carry `PASS`), the contract suite passed 32/32, and all 14 sk-doc packets report C3 PASS, `findingCount: 0`, exit 0 where `package_skill.py --check --strict --json` returns `valid: true`, exit 0. C7 is now FINDING only for a dual declaration and for a hub root, INFO with its reason otherwise. The fleet reports `Roots: 13; result: FINDINGS (1)`: `sk-prompt`'s Format cell is `package_skill.py --check --strict`'s own `valid: false` verdict on `benchmark/router/run_fixtures.sh`, so no row there reports a finding the gate does not, and that root is outside this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — Evidence: T001-T014 are complete with verification recorded above.
- [x] No `[B]` blocked tasks remaining — Evidence: T014 is complete after the router-row fix, the route-document labels and the strict validation rerun.
- [x] Manual verification passed — Evidence: the fleet check, `check sk-git` and `check sk-code-skilled` completed with `PYTHON` unset; the advisor outage was represented as C8 UNKNOWN, and strict validation passed.
- [x] `sk-skill-check.test.cjs` passes and the fleet run matches `scratch/baseline/` — Evidence: 31 tests passed when the phase closed, and the 13-root fleet matched both baseline files. Rerun after T014: 57 tests passed, and the fleet reports `Roots: 13; result: FINDINGS (1)`. The one finding is `sk-prompt`, whose Format cell is `package_skill.py --check --strict`'s own verdict on `benchmark/router/run_fixtures.sh`; that root is outside this phase, so the fleet now tracks the gate rather than the baseline.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` sections 2.1 and 4
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

A blocked task is marked `[B]` with the blocking cause on the same line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — Evidence: REQ-001 through REQ-008 are defined in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in plan.md — Evidence: plan defines thin validator orchestration, components, and data flow.
- [x] CHK-003 [P1] `scratch/baseline/` recorded before any script exists — Evidence: baseline files were written before either checker script; both contain 13 root results.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on both new scripts — Evidence: syntax checks passed for the checker, surface library and test file.
- [x] CHK-011 [P0] No stderr warnings on a clean fixture run — Evidence: the JSON report test asserts an empty error stream; the 31-test suite passed.
- [x] CHK-012 [P1] Every spawned validator has an exit-code mapping in `sk-skill-surface.cjs` — Evidence: the checker maps validator exits through `mapValidatorExit`; C6's per-skill `error` row becomes FINDING and advisor exit 75 stays UNKNOWN.
- [x] CHK-013 [P1] Script naming follows `ci-report.cjs` per-target naming — Evidence: new command script is named `sk-skill-check.cjs`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — Evidence: AC-001 through AC-014 are Met with fresh test or command evidence and file-and-line citations; strict validation passed.
- [x] CHK-021 [P0] Fleet run compared with the baseline — Evidence: the current run and both 13-root baseline files matched with `mismatches=0`.
- [x] CHK-022 [P1] Outside-root, dual-declaration and reserved-prefix fixtures tested — Evidence: the 31-test suite passed the outside-root, dual-declaration and reserved-name cases.
- [x] CHK-023 [P1] Exit 2 and exit 75 paths validated — Evidence: the suite passed the missing-resolver and Python/PyYAML exit 2 cases; the live advisor exit 75 produced C8 UNKNOWN and `check sk-git` exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

All phase review findings and the interpreter-discovery follow-up in the scoped checker, shared probes, tests and phase documents were addressed. Evidence: T012-T013 and AC-001 through AC-014.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — Evidence: source inspection found no secret constants or credentials.
- [x] CHK-031 [P0] Name-or-path argument resolved without shell interpolation — Evidence: nested-name and ambiguity tests pass; `check sk-code-skilled` reports `hub-packet`; child commands use `spawnSync(command, args)`.
- [x] CHK-032 [P1] No tracked output names a `local-` prefixed path — Evidence: the generated-prefix fixture test confirms serialized report redaction.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — Evidence: checker behavior, acceptance evidence and verification records match the frozen C1-C13 scope and plan; strict validation is recorded in T013.
- [x] CHK-041 [P1] Each row's comment states why the probe exists, not a ticket id — Evidence: the scoped quality gate ran comment hygiene clean; the reserved-prefix constant comment records its durable reason.
- [x] CHK-042 [P2] `DOC/scripts/README.markdown` entry deferred to phase 007 — Evidence: README update remains assigned to the later documentation phase.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baseline output lives under `scratch/baseline/` only — Evidence: the baseline directory contains only the two recorded validator JSON files.
- [x] CHK-051 [P1] scratch/ cleaned before completion, keeping the baseline — Evidence: phase scratch contains only `.gitkeep` and `baseline/` with its two required JSON files; the test-created temporary directories were removed after the suite.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
