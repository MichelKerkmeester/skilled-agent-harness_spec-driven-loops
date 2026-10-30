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

- [x] T009 Run the fixture suite (`DOC/scripts/tests/sk-skill-check.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0. Evidence: 23 tests passed, 0 failed, including fleet rendering, validator code propagation, hub classification, parse errors, Python preconditions and PATH interpreter discovery.
- [x] T010 Compare the fleet run with the baseline (`scratch/baseline/`). Verify: every shipped root reports the baseline verdict. Evidence: with `PYTHON` unset, the fleet command prints 13 roots with PASS and exits 0 after selecting the first PATH interpreter with PyYAML.
- [x] T011 Prove `check` writes nothing (repository tree). Verify: `git status --porcelain` is identical before and after a fleet run. Evidence: the initial and final status contain the same pre-existing packet edits and this task's allowed outputs; bytecode generation is disabled for every child process.
- [x] T012 [P1] Resolve the phase 001 code-review findings and interpreter-discovery follow-up in the checker, shared surface probes and tests. Verify: the explicit suite passes and named checks contain no FINDING rows. Evidence: 23 tests passed; PATH stubs confirm selection of the second interpreter and no fallback for empty `PYTHON`; `check sk-git` reports `Result: NO FINDINGS (1 UNKNOWN)` with exit 0.
- [x] T013 [P1] Record review decisions and final evidence in the phase documents. Verify: strict phase validation prints `RESULT: PASSED`; all acceptance rows are Met with command or test evidence. Evidence: `repair-derived.cjs --apply` refreshed the generated metadata and strict validation printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — Evidence: T001-T013 are complete with verification recorded above.
- [x] No `[B]` blocked tasks remaining — Evidence: T013 is complete after generated metadata refresh and strict validation.
- [x] Manual verification passed — Evidence: fleet and named `sk-git` checks completed with `PYTHON` unset; no interpreter mismatch or strict validator blocker remains.
- [x] `sk-skill-check.test.cjs` passes and the fleet run matches `scratch/baseline/` — Evidence: 23 tests passed; fleet reports 13 roots PASS with `PYTHON` unset.
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

- [x] CHK-010 [P0] `node --check` exits 0 on both new scripts — Evidence: syntax checks passed for the checker and surface library.
- [x] CHK-011 [P0] No stderr warnings on a clean fixture run — Evidence: JSON fixture invocation captured empty stderr.
- [x] CHK-012 [P1] Every spawned validator has an exit-code mapping in `sk-skill-surface.cjs` — Evidence: all child commands use `mapValidatorExit`; advisor exit 75 is explicitly mapped to UNKNOWN.
- [x] CHK-013 [P1] Script naming follows `ci-report.cjs` per-target naming — Evidence: new command script is named `sk-skill-check.cjs`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — Evidence: AC-001 through AC-014 are Met with test, command and task evidence.
- [x] CHK-021 [P0] Fleet run compared with the baseline — Evidence: 13 roots match package and metadata baseline verdicts.
- [x] CHK-022 [P1] Outside-root, dual-declaration and `local-` prefix fixtures tested — Evidence: fixture assertions pass for all three cases.
- [x] CHK-023 [P1] Exit 2 and exit 75 paths validated — Evidence: tests assert explicit Python/PyYAML, PATH discovery and other precondition exit 2 paths; advisor UNKNOWN on 75 exits 0 when no FINDING exists.
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
- [x] CHK-031 [P0] Name-or-path argument resolved without shell interpolation — Evidence: `resolveSkillTarget` resolves paths and child commands use `spawnSync(command, args)`.
- [x] CHK-032 [P1] No tracked output names a `local-` prefixed path — Evidence: the generated-prefix fixture test confirms serialized report redaction.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — Evidence: implementation and verification records match the frozen C1-C13 scope and plan.
- [x] CHK-041 [P1] Each row's comment states why the probe exists, not a ticket id — Evidence: checker comments explain each probe's durable purpose.
- [x] CHK-042 [P2] `DOC/scripts/README.markdown` entry deferred to phase 007 — Evidence: README update remains assigned to the later documentation phase.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baseline output lives under `scratch/baseline/` only — Evidence: the baseline directory contains only the two recorded validator JSON files.
- [x] CHK-051 [P1] scratch/ cleaned before completion, keeping the baseline — Evidence: phase scratch contains only `baseline/` and its two required files.
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
