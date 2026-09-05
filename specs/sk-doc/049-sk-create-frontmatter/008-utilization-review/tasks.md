---
title: "Task Breakdown: utilization-review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: utilization-review

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

- [x] T001 Baseline the eight dead aliases against the hub's stage-one vocabulary (`.opencode/skills/sk-doc/graph-metadata.json`)
- [x] T002 Baseline the advisor on the eight aliases and three realistic prompts, all eleven returning nothing but one
- [x] T003 Reproduce the `--help` failure and record it (`Unknown mode: --help`, exit 64)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the eight aliases to `intent_signals` and `derived.trigger_phrases` (`.opencode/skills/sk-doc/graph-metadata.json`)
- [x] T005 Recognise `--help` and `-h` from any position before the mode is derived (`.opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs`)
- [x] T006 Replace the three-to-five-times inflation claim with the measured figure (`.opencode/skills/sk-doc/sk-create-frontmatter/SKILL.md`)
- [x] T007 Author the two description-budget fixtures and their README (`.opencode/skills/sk-doc/sk-create-frontmatter/assets/fixtures/`)
- [x] T008 Point `FMB-001` and `FMB-002` at their fixtures, in the prompt, the commands and the anchors (`manual-testing-playbook/description-budget/`, `manual-testing-playbook/manual-testing-playbook.md`)
- [x] T009 Register the fixtures as leaves and route them (`.opencode/skills/sk-doc/leaf-manifest.json` regenerated, `.opencode/skills/sk-doc/ROUTER.md`)
- [x] T010 Add feature catalog, testing playbook and agent to the section 1, 2 and 10 index tables (`sk-create-frontmatter/assets/frontmatter-templates.md`)
- [x] T011 Re-mint the runtime and authored activation manifests after the `SKILL.md` edit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Replay the advisor on the same eleven prompts, and replay four out-of-domain phrases against the new aliases
- [x] T013 Run the engine tests, 23 passed and 0 failed, two of them new
- [x] T014 Run the playbook package validator, `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs --verify`, `package_skill.py --check --strict` and `quick_validate.py`
- [x] T015 Run `validate_document.py` and `hvr_scan.py` on every edited markdown file, against each file's committed blocker baseline
- [x] T016 Re-pin the two drifted canary source hashes once the concurrent edit landed, and confirm `REAL-GREEN`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. spec.md sections 2 to 4, seven requirements
- [x] CHK-002 [P0] Technical approach defined in plan.md. plan.md, and the follow-up pass in implementation-summary.md section 7
- [x] CHK-003 [P1] Dependencies identified and available. advisor CLI live and git history present, spec.md section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. engine tests 23 passed 0 failed after the parseArgs change
- [x] CHK-011 [P0] No console errors or warnings. every gate in implementation-summary.md Verification exits 0 with its marker
- [x] CHK-012 [P1] Error handling implemented. the lone --help path exits 0 before any git pass, bogus still exits 64
- [x] CHK-013 [P1] Code follows project patterns. parseArgs edit follows the file's own argv scan
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. acceptance-criteria.md, 19 of 19 Met
- [x] CHK-021 [P0] Manual testing complete. 11 of 11 playbook scenarios executed, section 3
- [x] CHK-022 [P1] Edge cases tested. FMC-001 negative control, FMV-004 corpus hash before and after
- [x] CHK-023 [P1] Error scenarios validated. guard stale-manifest after the SKILL.md edit, fresh after the re-mint
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. four instance-only doc defects, one class-of-bug in the routing vocabulary, one algorithmic in parseArgs
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. the spec-document rule grepped and corrected at all nine sites
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. the eight aliases checked across graph-metadata, hub-router, mode-registry and ROUTER.md
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. no security, path, parser or redaction fix in this phase
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. eleven prompts plus four out-of-domain phrases, section 7
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. no process-wide state read by the tests
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. evidence pinned to commits 8ad1f98d09 and 8a9c5af8a3
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. no secrets in any edited file
- [x] CHK-031 [P0] Input validation implemented. not applicable, no input path changed beyond the help flag scan
- [x] CHK-032 [P1] Auth/authz working correctly. not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. spec, plan and tasks agree on the seventeen tasks and seven requirements
- [x] CHK-041 [P1] Code comments adequate. the parseArgs change carries a one-line reason
- [x] CHK-042 [P2] README updated (if applicable). README corrected for the inflation figure
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. scratch/ holds only .gitkeep
- [x] CHK-051 [P1] scratch/ cleaned before completion. scratch/ clean at closure
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented (if applicable). not applicable, no migration
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01). the lone --help returns immediately, the one target NFR-P01 set
- [x] CHK-111 [P1] Throughput targets met (NFR-P02). not applicable, no throughput target in this phase
- [x] CHK-112 [P2] Load testing completed. not applicable, documentation and a CLI flag
- [x] CHK-113 [P2] Performance benchmarks documented. the inflation measurement over 1,214 documents is the benchmark, recorded in section 4 of the summary
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested. git checkout per surface, recorded in ADR-001 for the canary pins
- [x] CHK-121 [P0] Feature flag configured (if applicable). not applicable, no feature flag
- [x] CHK-122 [P1] Monitoring/alerting configured. the canary and the compiled-route guard are the monitors, both green
- [x] CHK-123 [P1] Runbook created. the refresh sequence is written in the summary section 7 and ADR-001
- [x] CHK-124 [P2] Deployment runbook reviewed. not applicable, nothing deployed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed. no credential, path or input surface changed
- [x] CHK-131 [P1] Dependency licenses compatible. no dependency added
- [x] CHK-132 [P2] OWASP Top 10 checklist completed. not applicable
- [x] CHK-133 [P2] Data handling compliant with requirements. not applicable, no user data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized. spec, plan, tasks, acceptance criteria and summary agree on scope and outcome
- [x] CHK-141 [P1] API documentation complete (if applicable). not applicable, no API
- [x] CHK-142 [P2] User-facing documentation updated. README and field reference corrected
- [x] CHK-143 [P2] Knowledge transfer documented. the summary carries the mechanism for every corrected figure
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->


