---
title: "Tasks: Phase 2: release-update-customization-signals"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "release update customization signals tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: release-update-customization-signals

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Capture the baseline read-only report into `scratch/baseline-check.json` and record exit codes and unit status counts (`.skilled/commands/doctor/scripts/release-update.cjs`) Baseline: `check --json` exit 0, status current, 84 units (local 54, current 30); summary in `scratch/measurement.md`, the 21 MB report kept outside the packet.
- [x] T002 [P] Walk the generator scripts and write the generated-artifact inventory into `scratch/generated-inventory.md` (`.skilled/skills/sk-doc/sk-create-skill/scripts/`, `.skilled/skills/system-skill-advisor/runtime/lib/derived/`) `scratch/generated-inventory.md`.
- [x] T003 [P] Read `provenance.ts` and record the exact fingerprint payload into `scratch/provenance-input.md` (`.skilled/skills/system-skill-advisor/runtime/lib/derived/provenance.ts`) `scratch/provenance-input.md`.
- [x] T004 [P] Re-confirm each recorded finding against the current engine and mark any that no longer holds (`048/003-update` research section 12, `scratch/design.md`) `scratch/findings-recheck.md`: four hold, one resolved by reading.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the generated-file class and its regenerate-after-apply handling (`.skilled/commands/doctor/scripts/release-update.cjs`) `GENERATED_ARTIFACTS`, `regeneratedClass` and `regenerateFollowUps` in `release-update.cjs`; `unitStatus` ignores the generated class.
- [x] T006 Add the base-recording action that writes `base.json` per unit from a named release (`.skilled/commands/doctor/scripts/release-update.cjs`) `record-base` subcommand; refuses with no release named on a tag-less tree and while `base.json` is uncommitted.
- [x] T007 Add the prerelease opt-in to latest-upstream resolution, keeping the default exclusion (`.skilled/commands/doctor/scripts/release-update.cjs`) `--include-prerelease` on check, align, apply and record-base; default stays stable-only.
- [x] T008 Allow apply without an alignment run for update and new units, re-verifying base blobs at write time (`.skilled/commands/doctor/scripts/release-update.cjs`) `planWithoutRun` and the new `resolveApplyRun`; a decisions file with no `plan.json` beside it is refused.
- [x] T009 Record the `provenance_fingerprint` pre-filter decision with its fixture and set ADR-003's status (`.skilled/commands/doctor/scripts/release-update.cjs`, `plan.md`) ADR-003 Rejected with the payload quoted; no engine change depends on it.
- [x] T010 Update the operator-facing policy text for the new action, flag and apply path (`.skilled/commands/doctor/update.md`, `.skilled/commands/doctor/assets/doctor-update-check.yaml`, `.skilled/commands/doctor/assets/doctor-update-apply.yaml`, `.skilled/commands/doctor/assets/doctor-update-presentation.txt`) `update.md`, all three `doctor-update-*.yaml` workflows and the presentation updated; YAMLs parse.
- [x] T011 Add one disposable-repository test per engine behavior (`.skilled/commands/doctor/scripts/tests/release-update.test.cjs`) Six new cases plus a stronger help case; 22 of 22 pass, and the new cases fail on the old engine (15 pass, 7 fail).
- [x] T012 Run the read-only `check --json` and record the generated-only count over the 54 local units with its method (`.skilled/commands/doctor/scripts/release-update.cjs`) `scratch/measurement.md`: 0 of 54 local units are generated-only; 8 generated files across 5 units.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the engine suite and confirm zero failures (`.skilled/commands/doctor/scripts/tests/release-update.test.cjs`) `node --test .../release-update.test.cjs`: tests 22, pass 22, fail 0 (`scratch/engine-tests.log`).
- [x] T014 Confirm the copied-tree fixture reports `baseSource: recorded` after the recording action (`.skilled/commands/doctor/scripts/tests/release-update.test.cjs`) Copied-tree case passes; `scratch/fixture-demo.log` shows `baseSource=recorded` after `record-base`.
- [x] T015 Confirm `--help` lists the new action and flag, and the workflow YAMLs parse (`.skilled/commands/doctor/scripts/release-update.cjs`, `.skilled/commands/doctor/assets/`) `--help` lists `record-base` and `--include-prerelease`; `yaml.safe_load` parses all three workflows.
- [x] T016 Validate the phase folder under strict mode and record `RESULT: PASSED` (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`) See the implementation summary verification table.
- [x] T017 Write the evidence rows and known limitations (`implementation-summary.md`) `implementation-summary.md` filled.
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

- [x] CHK-001 [P0] Requirements documented in spec.md spec.md §4.
- [x] CHK-002 [P0] Technical approach defined in plan.md plan.md and its ADRs.
- [x] CHK-003 [P1] Dependencies identified and available Git and Node only; the suite runs on disposable repositories.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks `node --check release-update.cjs` and the test file; `yaml.safe_load` on the three workflows.
- [x] CHK-011 [P0] No console errors or warnings The suite prints no warnings; `check --json` on this checkout exits 0 with an empty stderr.
- [x] CHK-012 [P1] Error handling implemented New refusals: no release named on a tag-less tree, uncommitted `base.json`, a decisions file with no plan. Each exits 1 with a named reason.
- [x] CHK-013 [P1] Code follows project patterns New code follows the engine sections, the `COMMAND_OPTIONS`-driven help and the existing refusal style.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met acceptance-criteria.md: six of six Met.
- [x] CHK-021 [P0] Manual testing complete `scratch/fixture-demo.log` on disposable repositories; read-only `check --json` on this checkout.
- [x] CHK-022 [P1] Edge cases tested Derived-block edit inside vs outside `derived`; release authored edit to a regenerated graph metadata; a copied tree with no tags; string vs numeric tag order.
- [x] CHK-023 [P1] Error scenarios validated Each refusal above is asserted in the suite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Generated class `class-of-bug`; base recording, prerelease opt-in and no-run apply `algorithmic`; measurement `matrix/evidence`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Producer inventory in `scratch/generated-inventory.md`, walked from the writers.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Consumers of `classCounts`, unit status and follow-ups: the check, align and apply workflows and the presentation, all updated; the align evidence step skips generated files.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A: no new path or parser surface; `record-base` writes the fixed `BASE_FILE` through the existing `safeResolve` and `writeAtomic`.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Axes: generated/authored x base recorded/inferred x release changed/unchanged x decisions present/absent. Covered rows: generated with release unchanged, generated with release authored change, authored edit, inferred then recorded base, run absent with and without a decisions file.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. N/A: the engine reads no process-wide state beyond its arguments and the repository.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence pinned to the uncommitted working-tree diff of the files in implementation-summary.md over base `1f7746def8`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets No secrets.
- [x] CHK-031 [P0] Input validation implemented `--release` still parsed by `parseVersion`; `--scope` checked by `applyScope`.
- [x] CHK-032 [P1] Auth/authz working correctly N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Synchronized.
- [x] CHK-041 [P1] Code comments adequate Each new function carries a WHY comment; no ephemeral ids.
- [x] CHK-042 [P2] README updated (if applicable) Router, workflows and presentation updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence in scratch/; the two 21 MB reports stay outside the packet.
- [x] CHK-051 [P1] scratch/ cleaned before completion scratch/ holds only the named evidence files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-10-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md ADRs live in plan.md, the only decision home this phase planned; no row is waived, so no decision-record.md is needed.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) ADR-001 and ADR-002 Accepted, ADR-003 Rejected.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale Each ADR lists rejected alternatives.
- [x] CHK-103 [P2] Migration path documented (if applicable) N/A: `base.json` keeps schemaVersion 1; `record-base` writes the shape `apply` already wrote.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) NFR-P01 held: content is read only for changed `graph-metadata.json` files under the derived rule; whole-file artifacts cost no extra process.
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) N/A: no NFR-P02.
- [x] CHK-112 [P2] Load testing completed N/A.
- [x] CHK-113 [P2] Performance benchmarks documented N/A.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested Rollback is reverting the listed files; no-run apply writes `rollback.json`, proven by the suite's rollback after a no-run apply.
- [x] CHK-121 [P0] Feature flag configured (if applicable) N/A: behavior is opt-in by subcommand and flag.
- [x] CHK-122 [P1] Monitoring/alerting configured N/A.
- [x] CHK-123 [P1] Runbook created `--help` and the presentation are the runbook.
- [x] CHK-124 [P2] Deployment runbook reviewed N/A.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed NFR-S01 held: the only network write is still the single named-tag fetch.
- [x] CHK-131 [P1] Dependency licenses compatible No new dependency.
- [x] CHK-132 [P2] OWASP Top 10 checklist completed N/A.
- [x] CHK-133 [P2] Data handling compliant with requirements N/A.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized Synchronized.
- [x] CHK-141 [P1] API documentation complete (if applicable) `--help` lists the new subcommand and flag.
- [x] CHK-142 [P2] User-facing documentation updated Presentation and router updated.
- [x] CHK-143 [P2] Knowledge transfer documented implementation-summary.md.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Unassigned | Technical Lead | [ ] Approved | |
| Unassigned | Product Owner | [ ] Approved | |
| Unassigned | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

