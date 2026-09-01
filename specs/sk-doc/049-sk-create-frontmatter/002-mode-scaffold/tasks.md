---
title: "Tasks: Phase 2: mode-scaffold"
description: "The baseline capture, the four authored files, the description trim that turned the first packaging failure into a pass, and the four gate runs that closed the phase."
trigger_phrases:
  - "mode scaffold tasks"
  - "packaging gate tasks"
  - "sibling shape parity check"
  - "hub gate baseline capture"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: mode-scaffold

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

- [x] T001 Capture the pre-packet hub baseline: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs` exits 0 with every invariant passing before `sk-create-frontmatter/` exists
- [x] T002 Pick `sk-create-repo-rule` as the shape reference, being the most recently built sibling mode, and read its file layout and its packaging warning list (`.opencode/skills/sk-doc/sk-create-repo-rule/`)
- [x] T003 [P] Read the create-skill authoring templates that govern the four files (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the packet identity file with name, description, allowed tools, version, keyword comment and workflow prose (`.opencode/skills/sk-doc/sk-create-frontmatter/SKILL.md`)
- [x] T005 Author the human entry point from the create-skill README template (`.opencode/skills/sk-doc/sk-create-frontmatter/README.md`)
- [x] T006 Author the reference-tree index, deliberately indexing nothing yet, so the packet is empty rather than incomplete (`.opencode/skills/sk-doc/sk-create-frontmatter/references/README.md`)
- [x] T007 Open the packet changelog at its first version so later phases append instead of create (`.opencode/skills/sk-doc/sk-create-frontmatter/changelog/v1.0.0.0.md`)
- [x] T008 Fix the first packaging failure: `Strict mode: 1 contract requirement(s) unmet — Description 132 chars exceeds soft target of 130`, resolved by trimming the `SKILL.md` description to 127 characters
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the packaging gate to a pass: `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict` reports `Result: PASS` with exactly 2 warnings, `Missing recommended section: INTEGRATION POINTS` and `Missing recommended section: RELATED RESOURCES` (REQ-001, SC-001)
- [x] T010 Confirm sibling parity: `sk-create-repo-rule` reports the same 2 warnings under the same command, so the new packet carries the sibling's file shape (REQ-003)
- [x] T011 Run link integrity on the new packet: `SUMMARY files_examined=4 entries_examined=2 failures=0 excluded_anchor=0 excluded_external=0`
- [x] T012 Run the hub gate, record its failure and read its cause from the source rather than inferring it: `FAIL: 6a: child director(ies) neither registered as a packet nor allowlisted: [sk-create-frontmatter]`, caused by the filter at `.opencode/commands/doctor/scripts/parent-skill-check.cjs:1003` against `DIRECTORY_ALLOWLIST` (lines 76-80, support-directory names only) and `registeredPackets`. The other four hubs stayed at exit 0. Recorded as ADR-001 in `decision-record.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T012 all closed
- [x] No `[B]` blocked tasks remaining — `grep '\[B\]' tasks.md` returns nothing
- [x] Manual verification passed — three acceptance rows `Met`, two `Superseded` by ADR-001, none `Unmet`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
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
- [x] CHK-002 [P0] Technical approach defined in plan.md — the four-file layout, the two gates and the sibling comparison are in plan.md §1 and §3
- [x] CHK-003 [P1] Dependencies identified and available — the create-skill templates, `sk-create-repo-rule`, `package_skill.py` and `parent-skill-check.cjs` were all present and runnable
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Not applicable: no code was written. The packaging gate is the equivalent structural check for a markdown mode packet, and it reports `Result: PASS`
- [x] CHK-011 [P0] No console errors or warnings — the packaging gate emits exactly 2 warnings, both expected and both matched by the sibling; no error output from any of the four gate runs
- [x] CHK-012 [P1] Error handling implemented — Not applicable: the packet contains no executable code
- [x] CHK-013 [P1] Code follows project patterns — the four files were authored from the `sk-create-skill` templates and match `sk-create-repo-rule`'s shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001, AC-003 and AC-004 are `Met`; AC-002 and AC-005 are `Superseded` by ADR-001 because REQ-002 and SC-002 rest on a premise this phase disproved. No row is `Unmet`
- [x] CHK-021 [P0] Manual testing complete — all four gate runs were executed and their output read line by line, including the run that failed
- [x] CHK-022 [P1] Edge cases tested — the empty-packet case is the edge case this phase exists to exercise: a packet with a reference index and no reference documents under it still passes the packaging gate
- [x] CHK-023 [P1] Error scenarios validated — two real failures were produced and handled: the 132-character description that failed strict packaging, and the hub-gate invariant that an unregistered directory trips
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — The one finding, that an unregistered child directory fails invariant 6a, is `class-of-bug` against the spec's premise rather than against the code: every unregistered mode directory would behave identically
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — The only producer of a hub child directory is a mode packet, and this phase adds exactly one; `parent-skill-check.cjs:1003` is the single site that classifies them
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — plan.md's Affected Surfaces table lists every surface that observes the new directory, including the registration files this phase deliberately does not touch
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Not applicable: no security, path, parser or redaction code is touched. The phase adds markdown files and edits no script
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — Two axes, registered against unregistered and allowlisted against not, giving four rows; the packet occupies the single failing cell (plan.md, Affected Surfaces)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — `PARENT_HUB_CHECK_STRICT` is the one process-wide variable in play. It was deliberately left at its default so the failure would surface; setting it to 0 was considered and rejected in ADR-001
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Evidence is pinned to named commands with quoted output and to two source line ranges, `parent-skill-check.cjs:1003` and lines 76-80, not to a branch-relative diff
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed: the four files contain prose, a keyword list and a version number, no credential or token
- [x] CHK-031 [P0] Input validation implemented — Not applicable: the packet contains no executable code and accepts no input
- [x] CHK-032 [P1] Auth/authz working correctly — Not applicable: no auth surface exists for a documentation packet
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — plan.md, tasks.md, acceptance-criteria.md, decision-record.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002
- [x] CHK-041 [P1] Code comments adequate — Not applicable: no code was written. The one comment in `SKILL.md` is the routing keyword line the packaging gate expects
- [x] CHK-042 [P2] README updated (if applicable) — the packet's own `README.md` and `references/README.md` were both authored in this phase; no hub-level README changes, because the packet is not registered yet
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — confirmed: `scratch/` holds only `.gitkeep`
- [x] CHK-051 [P1] scratch/ cleaned before completion — confirmed: `scratch/` is empty aside from `.gitkeep`
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

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — ADR-001 in `decision-record.md` records the build-empty-and-unregistered decision, its four weighed alternatives, and the source lines that disprove the spec's premise
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — ADR-001 status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — four options are scored in ADR-001, including registering here, disabling strict mode, and widening the directory allowlist
- [x] CHK-103 [P2] Migration path documented (if applicable) — Not applicable at this phase: nothing migrates into the packet until phase 003
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — Not applicable: a markdown mode packet has no request-serving surface
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — Not applicable: no throughput surface exists
- [x] CHK-112 [P2] Load testing completed — Not applicable: there is no runtime service to load-test
- [x] CHK-113 [P2] Performance benchmarks documented — Not applicable: no performance benchmark applies to an empty documentation packet
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7 and ADR-001 both give the same one-command rollback, `rm -rf .opencode/skills/sk-doc/sk-create-frontmatter/`, which also returns the hub gate to exit 0
- [x] CHK-121 [P0] Feature flag configured (if applicable) — Not applicable, and deliberately so: `PARENT_HUB_CHECK_STRICT=0` would have hidden the hub-gate failure and was rejected in ADR-001
- [x] CHK-122 [P1] Monitoring/alerting configured — Not applicable: the packaging and hub gates are the monitoring, and both were run
- [x] CHK-123 [P1] Runbook created — the plan.md §7 rollback procedure serves as this phase's runbook
- [x] CHK-124 [P2] Deployment runbook reviewed — see CHK-123; the rollback was reviewed against the hub gate, which returns to exit 0 once the directory is removed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — satisfied by CHK-030 and CHK-031: the four files were read in full and carry no secret, credential or customer content
- [x] CHK-131 [P1] Dependency licenses compatible — Not applicable: no new external dependency is introduced; both gate scripts are existing internal tools
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — Not applicable: no web-facing runtime surface exists
- [x] CHK-133 [P2] Data handling compliant with requirements — confirmed: the packet holds authoring prose only, no personal or customer data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md, decision-record.md and implementation-summary.md trace to the same requirement and success-criterion ids
- [x] CHK-141 [P1] API documentation complete (if applicable) — Not applicable: the packet exposes no API
- [x] CHK-142 [P2] User-facing documentation updated — the packet's `README.md` is its user-facing document and was authored here; it becomes reachable only after phase 004 registers the mode
- [x] CHK-143 [P2] Knowledge transfer documented — ADR-001 records the disproved premise and its source lines, which is the piece a later reader would otherwise have to rediscover
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
