---
title: "Verification Checklist: Align the sk-design README Set to the create-readme Standard"
description: "Level 3 verification checklist for the README alignment sweep. Items are pending until the sweep runs; each is marked with evidence at completion."
trigger_phrases:
  - "styles readme alignment checklist"
  - "create-readme sweep verification"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/009-styles-readme-create-readme-alignment"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Aligned checklist to L3 fixture anchors"
    next_safe_action: "Verify items with evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/library/bundles/README.md"
      - ".opencode/skills/sk-design/styles/tests/database/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-008-readme-alignment-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Align the sk-design README Set to the create-readme Standard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: Pending — spec.md REQ-001 through REQ-005
- [ ] CHK-002 [P0] Approach and phases defined in plan.md
  - **Evidence**: Pending — plan.md classify/author/quality phases
- [ ] CHK-003 [P1] Twelve target folders and READMEs read from the live tree
  - **Evidence**: Pending — Phase 1 listing
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each README follows its create-readme template shape
  - **Evidence**: Pending — skill/code/data mapping applied
- [ ] CHK-011 [P0] No template placeholders or empty sections remain
  - **Evidence**: Pending
- [ ] CHK-012 [P1] Each README states purpose, contents, usage and architecture fit
  - **Evidence**: Pending
- [ ] CHK-013 [P1] Already-substantial READMEs aligned without losing accurate content
  - **Evidence**: Pending — `lib/database`, `scripts`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every named file, path and link resolves on disk
  - **Evidence**: Pending — link resolution pass
- [ ] CHK-021 [P0] create-quality-control structure and DQI checks pass per README
  - **Evidence**: Pending
- [ ] CHK-022 [P1] Drift corrected: root README backend paths and scripts `_harness/` tree
  - **Evidence**: Pending
- [ ] CHK-023 [P1] Bundle count confirmed from a live listing
  - **Evidence**: Pending
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each drift finding classified: root README `_engine`/`_db` paths, scripts `_harness/` tree, scripts packet citation
  - **Evidence**: Pending
- [ ] CHK-FIX-002 [P0] All twelve READMEs authored from live folder listings, no fabricated paths
  - **Evidence**: Pending
- [ ] CHK-FIX-003 [P1] Cross-consumer check: skill-root and folder READMEs agree on backend paths
  - **Evidence**: Pending
- [ ] CHK-FIX-004 [P1] No packet IDs, phase IDs or migration history remain in any README
  - **Evidence**: Pending
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No fabricated files, commands, APIs or metrics
  - **Evidence**: Pending — authored from live reads
- [ ] CHK-031 [P0] No packet IDs, phase IDs or migration history in durable README content
  - **Evidence**: Pending — evergreen-id rule
- [ ] CHK-032 [P1] No code, test or bundle-data file modified
  - **Evidence**: Pending — `git diff` scope check
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and this checklist stay synchronized
  - **Evidence**: Pending
- [ ] CHK-041 [P1] Related-docs links between the six spec docs resolve
  - **Evidence**: Pending
- [ ] CHK-042 [P2] implementation-summary.md updated with real evidence after the sweep
  - **Evidence**: Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the twelve README files change in the working tree
  - **Evidence**: Pending — `git diff --name-only`
- [ ] CHK-051 [P1] No stray temp files left in the packet or target folders
  - **Evidence**: Pending
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 (planned) |
| P1 Items | 23 | 0/23 (planned) |
| P2 Items | 6 | 0/6 (planned) |

**Verification Date**: Pending
**Verified By**: Pending
**ADRs**: 3 documented, 3 accepted
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
  - **Evidence**: Pending — ADR-001, ADR-002, ADR-003
- [ ] CHK-101 [P1] All ADRs have status
  - **Evidence**: Pending — three ADRs status Accepted
- [ ] CHK-102 [P1] README type matches folder type across all twelve
  - **Evidence**: Pending — skill/code/data mapping
- [ ] CHK-103 [P2] Code-folder diagrams use real folder zones
  - **Evidence**: Pending
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: READABILITY VERIFICATION

- [ ] CHK-110 [P1] Each README reaches purpose and contents within the first screen (NFR-R01)
  - **Evidence**: Pending
- [ ] CHK-111 [P1] Code-folder diagrams are terminal-readable (NFR-R02)
  - **Evidence**: Pending
- [ ] CHK-112 [P2] Tables used for file maps, options and comparisons
  - **Evidence**: Pending
- [ ] CHK-113 [P1] Fenced code blocks carry language tags
  - **Evidence**: Pending
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DELIVERY READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (revert README edits, no code impact)
  - **Evidence**: Pending — plan.md rollback sections
- [ ] CHK-121 [P1] HVR clean on all twelve READMEs
  - **Evidence**: Pending
- [ ] CHK-122 [P1] Cross-references between skill root and folder READMEs agree
  - **Evidence**: Pending
- [ ] CHK-123 [P2] Sibling packet `009` boundary respected
  - **Evidence**: Pending
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] HVR review completed on all twelve READMEs
  - **Evidence**: Pending — no em dashes, no semicolons, no banned words
- [ ] CHK-131 [P1] Evergreen-ID rule satisfied: no mutable packet or phase IDs in README bodies
  - **Evidence**: Pending
- [ ] CHK-132 [P2] create-readme rules honored: no Table of Contents, no anchor-comment navigation
  - **Evidence**: Pending
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All six spec documents synchronized
  - **Evidence**: Pending
- [ ] CHK-141 [P1] Each README's internal links resolve from its own location
  - **Evidence**: Pending
- [ ] CHK-142 [P2] Skill-root README related-documents section current
  - **Evidence**: Pending
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Orchestrator | Packet Owner | Pending | |
| Reviewer | Doc Quality | Pending | |
<!-- /ANCHOR:sign-off -->
