<!-- SPECKIT_LEVEL: 3+ -->
# Verification Checklist: SpecKit Phase System

<!-- SPECKIT_TEMPLATE_SOURCE: checklist + checklist-extended | v2.2 -->

---

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [N/A] CHK-032 [P1] Auth/authz working correctly — N/A: shell script project with no auth/authz surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 0/26 |
| P1 Items | 44 | 0/44 |
| P2 Items | 12 | 0/12 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [N/A] CHK-121 [P0] Feature flag configured — N/A: uses CLI flag gating (--phase / --recommend-phases), not feature flag infrastructure
- [N/A] CHK-122 [P1] Monitoring/alerting configured — N/A: CLI tool, no runtime monitoring required
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [N/A] CHK-132 [P2] OWASP Top 10 checklist completed — N/A: shell script tooling, no web application attack surface
- [N/A] CHK-133 [P2] Data handling compliant with requirements — N/A: no PII or sensitive data processed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| G1: Plan Approval | Governance Gate | Pending | |
| G2: Phase 1 Complete | Governance Gate | Pending | |
| G3: Phase 2 Complete | Governance Gate | Pending | |
| G4: Phase 3 Complete | Governance Gate | Pending | |
| G5: Phase 4 Complete | Governance Gate | Pending | |
| G6: Final Acceptance | Governance Gate | Pending | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3+ checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

---

## Project: Phase 1 - Detection & Scoring

- [ ] **P0** `recommend-level.sh` includes `determine_phasing()` function [Source: ]
- [ ] **P0** JSON output includes `recommended_phases`, `phase_score`, `phase_reason`, `suggested_phase_count` [Test: ]
- [ ] **P0** Phase threshold: score >= 25 AND level >= 3 triggers recommendation [Test: ]
- [ ] **P1** New flags `--recommend-phases` and `--phase-threshold <N>` implemented [Source: ]
- [ ] **P1** 5 test fixtures created and passing: below threshold, at boundary, above threshold, extreme scale, no risk factors [Test: ]
- [ ] **P1** Backward compatibility: existing 51 test fixtures unaffected [Test: ]
- [ ] **P2** Confidence penalty when phase score near boundary (within 5 pts) [Source: ]

---

## Project: Phase 2 - Templates & Creation

- [ ] **P0** `create.sh --phase` creates parent folder with correct level templates [Test: ]
- [ ] **P0** `create.sh --phase` creates numbered child folders (001-*, 002-*) with `memory/` + `scratch/` [Test: ]
- [ ] **P0** Parent spec.md includes Phase Documentation Map section [File: ]
- [ ] **P0** Child spec.md includes parent back-references (`../spec.md`, `../plan.md`) [File: ]
- [ ] **P1** `--phases <N>` flag creates N child folders with correct numbering [Test: ]
- [ ] **P1** `--phase-names <list>` flag applies descriptive names to child folders [Test: ]
- [ ] **P1** `--phase` and `--subfolder` are mutually exclusive (error if both provided) [Test: ]
- [ ] **P1** Template addendum files created: `phase-parent-section.md`, `phase-child-header.md` [File: ]
- [ ] **P2** Default child level is L1 with `--child-level N` override [Test: ]

---

## Project: Phase 3 - Commands & Router

- [ ] **P0** SKILL.md PHASE intent signal added with keywords and weight [Source: ]
- [ ] **P0** SKILL.md RESOURCE_MAP includes PHASE → phase_definitions.md mapping [Source: ]
- [ ] **P0** SKILL.md COMMAND_BOOSTS includes `/spec_kit:phase` → PHASE [Source: ]
- [ ] **P0** `/spec_kit:phase` command: `phase.md` + 2 YAML assets created [File: ]
- [ ] **P1** `/spec_kit:plan` supports Gate 3 Option E and `--phase-folder` argument [Source: ]
- [ ] **P1** `/spec_kit:implement` resolves nested phase paths correctly [Test: ]
- [ ] **P1** `/spec_kit:complete` includes phase lifecycle validation step [Source: ]
- [ ] **P1** `/spec_kit:resume` detects phase folders and offers phase selection [Source: ]
- [ ] **P1** `"phase"` keyword removed from IMPLEMENT intent to avoid double-scoring [Source: ]

---

## Project: Phase 4 - Validation, Docs & Nodes

- [ ] **P0** `validate.sh --recursive` discovers `[0-9][0-9][0-9]-*/` child folders [Test: ]
- [ ] **P0** Recursive validation produces per-phase + aggregated results [Test: ]
- [ ] **P0** Exit code reflects worst result across parent + all children [Test: ]
- [ ] **P1** `check-phase-links.sh` rule script validates parent-child back-references [Test: ]
- [ ] **P1** JSON output includes `"phases": [...]` array [Test: ]
- [ ] **P1** 6 new test fixtures: flat, 1-phase, 3-phase, mixed levels, empty child, broken links [Test: ]
- [ ] **P1** `nodes/phase-system.md` created with correct content and MOC linkage [File: ]
- [ ] **P1** `index.md` updated with phase-system node in Workflow & Routing section [File: ]
- [ ] **P1** `references/structure/phase_definitions.md` created [File: ]
- [ ] **P1** `sub_folder_versioning.md` updated with Phases vs Versions section [File: ]
- [ ] **P1** `level_specifications.md` updated with Phase-Aware Specifications section [File: ]
- [ ] **P1** `template_guide.md` §10 expanded for phase organization [File: ]
- [ ] **P1** `quick_reference.md` updated with phase workflow shortcuts [File: ]
- [ ] **P1** `validation_rules.md` updated with PHASE_LINKS rule documentation [File: ]
- [ ] **P2** CLAUDE.md Gate 3 updated with Option E [File: ]

---

## Project: Cross-Cutting Verification

- [ ] **P0** All 51 existing test fixtures pass with --recursive flag (backward compatibility) [Test: ]
- [ ] **P0** Non-phased spec folders validate identically with/without --recursive [Test: ]
- [ ] **P1** End-to-end workflow: /spec_kit:phase → create → validate → resume cycle works [Test: ]
- [ ] **P1** Retrospective validation: system correctly flags 136/138 profiles as needing phases [Test: ]
- [ ] **P1** All modified reference docs internally consistent (no broken cross-references) [Review: ]
- [ ] **P2** Bash 4.0+ compatibility verified for all script changes [Test: ]
