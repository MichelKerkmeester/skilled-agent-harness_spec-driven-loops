---
title: "Tasks: Phase 1: inventory-and-contract"
description: "The reproducible probe, the five-form classifier, the run-time parser sweep and the ownership boundary decision that produced inventory/consumer-inventory.md."
trigger_phrases:
  - "frontmatter inventory tasks"
  - "frontmatter probe verification"
  - "frontmatter ownership boundary tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: inventory-and-contract

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

- [x] T001 Design the reproducible probe: `grep -ranI --exclude-dir=.git --exclude-dir=node_modules -E 'frontmatter-(templates|versioning)' .opencode/ | grep -v '/benchmark/reports/'`, confirming the `-a` flag is required for files carrying a NUL byte (inventory §1)
- [x] T002 [P] Confirm the `/benchmark/reports/` exclusion filter removes exactly the three frozen skill-benchmark report bundles and nothing else (inventory §1)
- [x] T003 [P] Build the five-form classifier (markdown-link, skill-relative-in-string, repo-absolute, bare-relative, bare-name) so the split does not assume markdown-link syntax (inventory §3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the probe and capture all 83 matched lines across 40 files (inventory §2)
- [x] T005 Classify every line into the four-bucket partition: 54 live references over 34 files, 4 internal cross-links over 2 files, 13 frozen-history/out-of-scope lines over 6 surfaces, 12 bare-name mentions over 4 files (inventory §2, §5, §6)
- [x] T006 Trace `quick_validate.py` and `package_skill.py` line by line to answer REQ-002; confirm neither opens either frontmatter document at run time (inventory §4)
- [x] T007 Enumerate the 22 owned-by-frontmatter mode-packet consumers and the 12 shared hub/command/script consumers with file, line and written form (inventory §5a-5c)
- [x] T008 Decide and record the ownership boundary: both documents move whole; the three enforcement scripts stay shared because `post-edit-router.cjs:38` hard-codes the path (inventory §7)
- [x] T009 [P] Scan both moving documents for outbound links pointing away from them; found 4 that break on the move and 2 that read wrong in prose once the shared-tier path changes (inventory §5e)
- [x] T010 Write `inventory/consumer-inventory.md` end to end
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Capture the pre-move `resolve_skill_markdown_links.py --repo-root . --scope .opencode/skills/sk-doc` baseline: 113 failures, exactly one naming a frontmatter path (inventory §8)
- [x] T012 Rerun the probe and classifier within the same session and confirm the identical 83/40 count and five-form split (SC-001)
- [x] T013 Confirm the four-bucket partition sums to 83 with no line left unclassified (SC-002)
- [x] T014 Confirm the inventory names both run-time-parser candidates explicitly and states plainly that neither parses (SC-003)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T014 all closed
- [x] No `[B]` blocked tasks remaining — `grep '\[B\]' tasks.md` returns nothing
- [x] Manual verification passed — acceptance-criteria.md AC-001 through AC-006 all `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Inventory**: See `inventory/consumer-inventory.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001/002/003 (spec.md §4)
- [x] CHK-002 [P0] Technical approach defined in plan.md — the probe, classifier and partition are documented in plan.md §1 and §3
- [x] CHK-003 [P1] Dependencies identified and available — read access to `.opencode/` and `resolve_skill_markdown_links.py`; no external dependency required
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Not applicable: no code was written; the only artifact is a markdown inventory document
- [x] CHK-011 [P0] No console errors or warnings — Not applicable: the probe and classifier ran clean with no error output
- [x] CHK-012 [P1] Error handling implemented — Not applicable: no code was written in this read-only phase
- [x] CHK-013 [P1] Code follows project patterns — Not applicable: no code was written; the inventory document follows the sk-doc markdown template conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-006 in acceptance-criteria.md are `Met`
- [x] CHK-021 [P0] Manual testing complete — the probe output was read line by line and cross-checked against the four-bucket partition
- [x] CHK-022 [P1] Edge cases tested — the NUL-byte-file case (handled by `-a`) and the three frozen benchmark bundles (handled by the exclusion filter) were both found and handled
- [x] CHK-023 [P1] Error scenarios validated — every one of the 83 matched lines resolved to exactly one of four buckets; none were left ambiguous or dropped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — Not applicable: this is a read-only inventory phase, not a classified bug fix; nothing here is an "actionable finding" against running code
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Met by construction: the probe itself is the producer inventory (`grep -ranI ... 'frontmatter-(templates|versioning)' .opencode/`), not an assumed subset
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Met: `inventory/consumer-inventory.md` §5a-5d enumerate every consumer surface (scripts, YAML configs, hub docs, mode packets) by file and line
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Not applicable: no security/path/parser/redaction code is touched; this phase edits nothing
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — Not applicable: no algorithmic input matrix exists for a read-only inventory
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — Not applicable: no process-wide state or environment-dependent code is touched
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Evidence is pinned to the reproducible probe command in inventory §1, not a moving branch-relative range; rerunning it within the same session reproduced the identical count
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed: every line in the inventory document is a file path or grep/classifier output, no credential or secret value
- [x] CHK-031 [P0] Input validation implemented — Not applicable: no code was written
- [x] CHK-032 [P1] Auth/authz working correctly — Not applicable: no auth surface exists for a read-only documentation phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002/003
- [x] CHK-041 [P1] Code comments adequate — Not applicable: no code was changed
- [x] CHK-042 [P2] README updated (if applicable) — Not applicable: no README belongs to this phase; consumer READMEs are repointed in phase 003, per inventory §8
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

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — no `decision-record.md` exists for this phase (not required at this level); the one architecture decision — the ownership boundary — is documented as ADR-001 in plan.md's L3 Architecture Decision Record section
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — ADR-001 status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — ADR-001 documents the two rejected alternatives (splitting either document; moving the enforcement scripts) and why each was rejected
- [x] CHK-103 [P2] Migration path documented (if applicable) — Not applicable: no data/schema/version migration is involved; this phase produced one inventory document and moved nothing
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — Not applicable: this is a read-only documentation/inventory phase with no runtime request-serving surface
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — Not applicable: no NFR-P02 exists; no throughput surface for an inventory phase
- [x] CHK-112 [P2] Load testing completed — Not applicable: no runtime service exists to load-test
- [x] CHK-113 [P2] Performance benchmarks documented — Not applicable: no performance benchmark applies to a read-only inventory phase
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested — documented in plan.md §7: the only artifact this phase produced (`inventory/consumer-inventory.md`) can be removed with a single `rm`; nothing else needs reverting
- [x] CHK-121 [P0] Feature flag configured (if applicable) — Not applicable: no runtime feature flag governs a read-only documentation phase
- [x] CHK-122 [P1] Monitoring/alerting configured — Not applicable: no runtime monitoring surface exists
- [x] CHK-123 [P1] Runbook created — satisfied via the plan.md §7 rollback procedure, which serves as this phase's runbook
- [x] CHK-124 [P2] Deployment runbook reviewed — see CHK-123; the rollback procedure is the reviewed runbook for this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — satisfied by CHK-030/CHK-031: the inventory document was read line by line and carries no secret, credential or customer content
- [x] CHK-131 [P1] Dependency licenses compatible — Not applicable: no new external dependency is introduced; `resolve_skill_markdown_links.py` is an existing internal script used as-is
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — Not applicable: no web-facing runtime surface exists for a read-only inventory phase
- [x] CHK-133 [P2] Data handling compliant with requirements — confirmed: every line in the inventory document is a file path, line number or grep/classifier output; no secret, credential or customer content
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to the same REQ-001/002/003 and SC-001/002/003
- [x] CHK-141 [P1] API documentation complete (if applicable) — Not applicable: no API is introduced or changed by this phase
- [x] CHK-142 [P2] User-facing documentation updated — Not applicable: `inventory/consumer-inventory.md` is internal skill-authoring documentation, not user-facing product documentation
- [x] CHK-143 [P2] Knowledge transfer documented — the inventory's §7 ownership boundary and §8 phase-003 handoff record the reasoning future phases need
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

Not applicable — no formal named-approver sign-off process governs this internal spec-folder documentation phase.

| Approver | Role | Status | Date |
|----------|------|--------|------|
| N/A | Technical Lead | Not required | |
| N/A | Product Owner | Not required | |
| N/A | QA Lead | Not required | |
<!-- /ANCHOR:sign-off -->
