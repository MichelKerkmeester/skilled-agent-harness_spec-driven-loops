---
title: "Tasks: Phase 8: overlay-first-write-checks"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "overlay first write checks tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: overlay-first-write-checks

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the handover and Barter's reference (`barter/ai-speckit/skilled/barter-overlays/sync.cjs`, lines 700 to 1100). Verify: the four checks and their refusal order are listed in `spec.md` section 3.
- [x] T002 Read the engine's guard, re-pin and protected-path code (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: `plan.md` section 3 names the engine functions the new checks reuse.
- [x] T003 Capture the baseline. Verify: `node --test` over the five overlay engine test files, the contract test and the hook test prints `tests 91`, `pass 91`, `fail 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the `strictWrites` key, the `generated` globs and `strictWriteRefusal`, called from `commandGuard` (`overlay-engine.cjs`). Verify: the two `--guard` calls in `spec.md` exit 1 with the lines shown.
- [x] T005 Add `apply --adopt <path>` with `adoptUnderLock` and `appendOverlayEntry` (`overlay-engine.cjs`). Verify: the adopt tests in `overlay-engine-strict-writes.test.cjs` pass.
- [x] T006 Add the `pre-commit` command with `stagedUnownedChanges` (`overlay-engine.cjs`). Verify: the pre-commit test passes.
- [x] T007 Add `repin.rootFiles` and the `root-file` report lines (`overlay-engine.cjs`). Verify: the staged re-pin test reads both lines from `report.rootFiles`.
- [x] T008 Refuse an adopt whose overlay copy resolves outside the overlay folder through a link, and quote a path with a space in every printed command (`overlay-engine.cjs`). Verify: the refusal test and the root-file test assert both.
- [x] T009 Write the strict-writes tests (`.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs`). Verify: `node --test` on that file prints `tests 10`, `pass 10`.
- [x] T010 Add one hook test for a strict refusal (`.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs`). Verify: `node --test` on that file prints `tests 19`, `pass 19`.
- [x] T011 Bring the router, route manifest, workflow, presentation and command contract in line (`.skilled/commands/doctor/overlay.md`, `_routes.yaml`, `assets/doctor-overlay-apply.yaml`, `assets/doctor-overlay-presentation.txt`, `sk-create-command/assets/command-contract.json`). Verify: `node --test tests/doctor-overlay-contract.test.cjs` prints `pass 8`.
- [x] T012 Describe the setting, adopt and root files in the reference, the hook README and the two command lists (`system-skilled-doctor/references/overlays.md`, `overlay-guard/README.md`, `.skilled/commands/README.txt`, `README.md`). Verify: `rg -c 'strictWrites' .skilled/skills/system-skilled-doctor/references/overlays.md` prints a count above 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the whole overlay gate. Verify: `node --test` over the overlay engine tests, the contract test and the hook test prints `tests 102`, `pass 102`, `fail 0`.
- [x] T014 Run the route and mirror checks. Verify: `route-validate.sh` ends with `OK: route-validate`, `doctor-phrase-reach.cjs` ends with `STATUS=OK`, and `sync-runtime-mirrors.cjs --check` prints `PASS`.
- [x] T015 Run the quality gate on the changed code and config files. Verify: `quality-gate.cjs --files ...` prints `"p0_blocking": 0` and `"findings": []`.
- [x] T017 Fix the converter's source copy on Node 26, on the operator's instruction (`.skilled/commands/doctor/scripts/sk-skill-convert.cjs`). Verify: `node --test tests/sk-skill-convert.test.cjs` prints `pass 69`, `fail 0`, and `node --test tests/` prints `pass 1100`, `fail 0`.
- [x] T016 Have two other model families read the change, then confirm each finding before acting on it. Verify: `implementation-summary.md` lists each finding with what was run against it.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-011.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` section 6. `git` is on the PATH and the suite uses it.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `node --check overlay-engine.cjs` exits 0, and `quality-gate.cjs` over the seven changed code and config files prints `"findings": []`.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the 102-test run prints no error outside the assertions it makes.
- [x] CHK-012 [P1] Error handling implemented. Evidence: every adopt refusal exits 2 before a write, and the refusal test compares the manifest bytes before and after.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the new section follows the engine's header, JSDoc and `is`-prefixed boolean style, and reuses `managedPathTest`, `repinSettings`, `runGit` and `withLock`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, every row Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the before and after `--guard` calls in `spec.md`, run against the engine at `1f50e98e12` and the changed engine.
- [x] CHK-022 [P1] Edge cases tested. Evidence: a path with a space, a link inside the overlay folder, a git-ignored path, a commit that moves the pin, and a misused command line each have an assertion.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: seven adopt refusals in one test, each with exit 2 and its message.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] N/A as a fix: this phase adds a feature. The two review findings it did fix are `instance-only` (the link) and `class-of-bug` (the unquoted path, fixed at all three printed adopt commands).
- [x] CHK-FIX-002 [P0] Same-class inventory done for the quoting fix. Evidence: `rg -n 'apply --adopt \$\{' overlay-engine.cjs` shows every interpolated path going through `shellPath`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `plan.md`, Affected Surfaces.
- [x] CHK-FIX-004 [P0] Path handling has adversarial cases. Evidence: outside the vendored roots, a link out of the overlay folder, a protected name and an overlap each refuse in `overlay-engine-strict-writes.test.cjs`.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: `plan.md`, Affected Surfaces, Required inventories.
- [x] CHK-FIX-006 [P1] N/A: the new code reads no environment variable. It reads the working directory only to resolve a relative path, as `--guard` did before.
- [x] CHK-FIX-007 [P1] Evidence is pinned. The change sits on `main` directly above `1f50e98e12`, recorded on the operator's instruction.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: `quality-gate.cjs` reports no `secret.*` finding.
- [x] CHK-031 [P0] Input validation implemented. Evidence: `strictWrites` must be a boolean, `generated` a list of strings and `repin.rootFiles` a list of relative paths, each checked where it is read.
- [x] CHK-032 [P1] N/A: no authentication or authorization is involved.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: the three name the same files and the same checks.
- [x] CHK-041 [P1] Code comments adequate. Evidence: each new function that carries a contract has a JSDoc block, and no comment names a spec path or an id.
- [x] CHK-042 [P2] README updated. Evidence: `README.md` and `.skilled/hooks/overlay-guard/README.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the dispatch briefs and patch scripts sat in the session scratchpad outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `ls scratch` in this folder lists `.gitkeep` only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-11
<!-- /ANCHOR:summary -->

---
