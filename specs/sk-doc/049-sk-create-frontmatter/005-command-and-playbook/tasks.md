---
title: "Tasks: Phase 5: command-and-playbook"
description: "The registry-derived command test that landed on no command, the 11 scenarios in 3 categories, the measured frontmatter shape that lets the package validator and the benchmark loader both pass, and the five tooling defects found while pricing the scenarios."
trigger_phrases:
  - "command decision tasks"
  - "playbook package authoring"
  - "scenario frontmatter shape"
  - "playbook allowlist enrolment"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: command-and-playbook

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

- [x] T001 Derive the command test from `.opencode/skills/sk-doc/mode-registry.json` rather than inventing one: every sibling carrying a `/create:*` command produces a new artifact, and exactly two modes carry `command: null`
- [x] T002 Name the property that separates the two groups: the `command: null` modes are the ones that operate on something that already exists. `sk-create-quality-control` validates, scores and optimizes an existing document; this mode answers a question about a contract and fixes a block inside a document another mode owns
- [x] T003 [P] Settle the three scenario categories against what the mode's own documentation claims: `field-and-class-resolution/`, `description-budget/` and `version-derivation/`, in kebab-case as the package contract requires
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Record the command decision: no command ships, and the registry keeps `command: null`. `/create:frontmatter` would imply creating a frontmatter file, which is not an artifact anyone asks for (plan.md ADR-001)
- [x] T005 Write the playbook root at `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md`, including the index table the loader parses
- [x] T006 Author the three `field-and-class-resolution/` scenarios FMC-001 to FMC-003, covering the reference block, class-row-before-field-row diagnosis, and an out-of-scope class
- [x] T007 [P] Author the three `description-budget/` scenarios FMB-001 to FMB-003, covering an over-budget trim, a trim that loses routing tokens, and a silent discovery drop
- [x] T008 [P] Author the five `version-derivation/` scenarios FMV-001 to FMV-005, covering the numstat gate, changelog-anchored derivation, skip-on-differ, an idempotent rerun, and a file with no frontmatter
- [x] T009 Measure both candidate frontmatter shapes against both consumers rather than picking the one the documentation suggests. With all six keys present the package reports `SKIP package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=0 routing_gold_excluded=11 violations=0 warnings=0` at exit 0, because `hasRoutingGoldSignature()` (`validate-playbook-package.cjs:120`) matches, line 534 filters every file out of the operator set, and line 581 hard-codes `SKIP` when that set is empty
- [x] T010 Resolve the conflict by omitting only the `expected_workflow_mode` scalar. Every scenario keeps its typed `expected_leaf_resources` gold and its `expected_resources`, the loader parses those independently, and all eleven stay inside the operator contract (plan.md ADR-002)
- [x] T011 Write the resolution into a "Package shape" section of the playbook root, including the cost: with the scalar absent, `scenario.expected` is undefined, so `requireRouteDeclaration` stays false at `codex-executor.cjs:145` and a missing route declaration is not recorded as a failure
- [x] T012 Reprice the scenarios that would otherwise have relied on broken tooling: every scenario uses `--skill sk-doc` because `--skill sk-create-frontmatter` silently discovers zero files; one scenario passes `--manifest-out` explicitly; two scenarios use `package_skill.py --check --strict` instead of `quick_validate.py`, which reads only a packet's `SKILL.md` and so cannot prove an authored reference or asset block
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the package validator: `PASS package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=11 routing_gold_excluded=0 violations=0 warnings=0` (REQ-001, SC-001)
- [x] T014 Run the benchmark loader: `shape=sk-doc scenarios=11 warnings=[]`, with a parsed prompt, `expectedIntent`, `expectedResources` and typed leaf gold on every scenario (REQ-002, SC-002)
- [x] T015 Run link integrity on the package: `failures=0`
- [x] T016 Enrol the package in `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` so its clean state is enforced rather than incidental, then rerun the fleet sweep: 39 PASS packages and zero FAIL
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T016 all closed
- [x] No `[B]` blocked tasks remaining — `grep '\[B\]' tasks.md` returns nothing
- [x] Manual verification passed — acceptance-criteria.md AC-001 through AC-005 are all `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The package itself**: `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001, REQ-002 and REQ-003 in spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md — the registry-derived command test and the two-consumer frontmatter analysis are in plan.md §1 and §3, with both decisions as ADR-001 and ADR-002
- [x] CHK-003 [P1] Dependencies identified and available — the phase 002 packet, the phase 003 content its scenarios cite, the phase 004 registration, and both gates that read the package
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no code was written. The equivalent structural check is the package validator, which reports zero violations and zero warnings
- [x] CHK-011 [P0] No console errors or warnings — the validator reports `warnings=0` and the loader reports `warnings=[]`
- [x] CHK-012 [P1] Error handling implemented — Not applicable: this phase authors markdown scenarios, not control flow
- [x] CHK-013 [P1] Code follows project patterns — the package follows the playbook template: a root document, kebab-case category directories, one scenario per file, and the frontmatter keys the loader reads
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-005 in acceptance-criteria.md are all `Met`
- [x] CHK-021 [P0] Manual testing complete — every scenario's command was run while pricing it, which is how the five tooling defects were found rather than inferred
- [x] CHK-022 [P1] Edge cases tested — the edge that mattered was the frontmatter shape, and both candidates were run through both consumers instead of one being assumed correct
- [x] CHK-023 [P1] Error scenarios validated — the `SKIP` at exit 0 was produced deliberately and read, which is what made the validator-versus-loader conflict visible rather than theoretical
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — `cross-consumer`: the validator and the loader read the same frontmatter block under different rules, and the finding is the disagreement between them, not a defect in either one alone
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Every enrolled playbook package produces scenario frontmatter of the same class. The two that mattered were read directly: the sk-doc hub package for the shape the loader accepts, and `sk-create-repo-rule` for the shape it rejects
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — plan.md's Affected Surfaces table lists all eight surfaces, including `codex-executor.cjs:145`, which reads `scenario.expected` and loses a check under the shipped shape
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Not applicable in the security sense. The nearest equivalent is the parser case, and it was covered directly: both frontmatter shapes were parsed by both consumers and the results read
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — Two axes, four rows: two frontmatter shapes crossed with two consumers. Only one cell combination satisfies both P0 requirements
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — The relevant global-state hazard was found rather than simulated: `frontmatter-version.mjs compute` writes its manifest into the repository root when `--manifest-out` is omitted. One scenario passes the flag and the playbook documents the hazard
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Evidence is pinned to named commands with quoted output and to three source lines in `validate-playbook-package.cjs` (120, 534, 581), not to a branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed: every value in the package is a command, a file path or an expected output string
- [x] CHK-031 [P0] Input validation implemented — Not applicable: no input-handling code was added. The validator and loader that parse these files were not modified
- [x] CHK-032 [P1] Auth/authz working correctly — Not applicable: a playbook package has no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002
- [x] CHK-041 [P1] Code comments adequate — Not applicable: no code was written. The equivalent is the package's own "Package shape" section, which explains the omitted key so a later reader does not add it back
- [x] CHK-042 [P2] README updated (if applicable) — deferred to phase 006, which adds the playbook row and the two playbook gates to the mode's `README.md` as part of closeout
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — confirmed: `scratch/` holds only `.gitkeep`
- [x] CHK-051 [P1] scratch/ cleaned before completion — confirmed: `scratch/` is empty aside from `.gitkeep`, and no manifest file was left in the repository root
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-01
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — no `decision-record.md` exists for this phase and none is required at this level; both decisions are recorded as ADR-001 (no command ships) and ADR-002 (omit `expected_workflow_mode`) in plan.md's L3 Architecture Decision Record section
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — ADR-001 status: Accepted. ADR-002 status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — ADR-001 rejects shipping the command under either name; ADR-002 rejects keeping all six keys, dropping the leaf gold instead, and changing the shared validator
- [x] CHK-103 [P2] Migration path documented (if applicable) — Not applicable: nothing is migrated. The package is new, and no existing package changed shape
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — Not applicable: a markdown playbook package has no runtime request-serving surface
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — Not applicable: no NFR-P02 exists and no throughput surface is involved
- [x] CHK-112 [P2] Load testing completed — Not applicable: there is no runtime service to load-test
- [x] CHK-113 [P2] Performance benchmarks documented — Not applicable: this phase makes no performance claim. The benchmark it does touch is a routing benchmark, which is a correctness measure
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7: remove the package directory and its allowlist line, then rerun the fleet sweep. Both artifacts are additive, so the reversal is a deletion
- [x] CHK-121 [P0] Feature flag configured (if applicable) — Not applicable in the usual sense. The nearest thing is the allowlist line, which decides whether the package's clean state is enforced, and it is set
- [x] CHK-122 [P1] Monitoring/alerting configured — the fail-closed fleet sweep is the standing monitoring, and enrolment is what puts this package inside it. A future regression now fails a gate instead of going unnoticed
- [x] CHK-123 [P1] Runbook created — the package itself is the runbook: 11 scenarios, each with the command to run and the output to expect
- [x] CHK-124 [P2] Deployment runbook reviewed — confirmed by the post-enrolment fleet run: 39 PASS packages and zero FAIL
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — satisfied by CHK-030 and CHK-031: the package holds commands, paths and expected output strings, with no credential or customer content
- [x] CHK-131 [P1] Dependency licenses compatible — Not applicable: no new external dependency is introduced. Every tool the scenarios invoke is an existing internal script
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — Not applicable: no web-facing runtime surface is involved
- [x] CHK-133 [P2] Data handling compliant with requirements — confirmed: the scenarios operate on repository documents only, and one was explicitly repriced to pass `--manifest-out` so it does not write into the repository root
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md trace to the same requirement and success-criterion ids
- [x] CHK-141 [P1] API documentation complete (if applicable) — Not applicable: no API surface is added
- [x] CHK-142 [P2] User-facing documentation updated — the playbook root is the operator-facing document this phase produces, and it now carries both the scenario index and the package-shape explanation
- [x] CHK-143 [P2] Knowledge transfer documented — the validator-versus-loader conflict, the exit-0 `SKIP` hazard and the five tooling defects are all recorded in implementation-summary.md, because each would otherwise be rediscovered the hard way
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

Not applicable. No formal named-approver sign-off process governs this internal spec-folder phase.

| Approver | Role | Status | Date |
|----------|------|--------|------|
| N/A | Technical Lead | Not required | |
| N/A | Product Owner | Not required | |
| N/A | QA Lead | Not required | |
<!-- /ANCHOR:sign-off -->
