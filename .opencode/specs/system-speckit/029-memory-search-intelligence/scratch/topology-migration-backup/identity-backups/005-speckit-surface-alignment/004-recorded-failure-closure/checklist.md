---
title: "Verification Checklist: Recorded-Failure Closure"
description: "Evidence checklist for cap reconciliation, constitutional rule, surfacer, and tests."
trigger_phrases:
  - "recorded failure closure checklist"
  - "unactioned recorded failure verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/004-recorded-failure-closure"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Ship recorded-failure closure route"
    next_safe_action: "Run strict validation for the closure phase"
    completion_pct: 100
---
# Verification Checklist: Recorded-Failure Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Failure class documented. [EVIDENCE: `spec.md:9-21`]
  - **Evidence**: `spec.md:9-21`.
- [x] CHK-002 [P0] Acceptance cases documented. [EVIDENCE: `spec.md:23-29`]
  - **Evidence**: `spec.md:23-29`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Closure rule is cited with file-line evidence. [EVIDENCE: `implementation-summary.md:40-46`]
  - **Evidence**: `implementation-summary.md:40-46`.
- [x] CHK-011 [P1] Surfacer bias and limitation are documented. [EVIDENCE: `implementation-summary.md:68-71` and `implementation-summary.md:94-96`]
  - **Evidence**: `implementation-summary.md:68-71` and `implementation-summary.md:94-96`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Unrouted FAIL test recorded. [EVIDENCE: `unactioned-recorded-failure-audit.test.mjs:5-9`]
  - **Evidence**: `unactioned-recorded-failure-audit.test.mjs:5-9` cited in `implementation-summary.md:79`.
- [x] CHK-021 [P0] Routed FAIL and routed contradiction tests recorded. [EVIDENCE: `unactioned-recorded-failure-audit.test.mjs:11-30`]
  - **Evidence**: `unactioned-recorded-failure-audit.test.mjs:11-30` cited in `implementation-summary.md:80-81`.
- [x] CHK-022 [P1] Clean text test recorded. [EVIDENCE: `unactioned-recorded-failure-audit.test.mjs:32-39`]
  - **Evidence**: `unactioned-recorded-failure-audit.test.mjs:32-39` cited in `implementation-summary.md:82`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] Recorded-failure closure route is fully documented. [EVIDENCE: `implementation-summary.md:40-47`]
  - **Evidence**: `implementation-summary.md:40-47` cites the strategy cap, rule, surfacer, and tests.
- [x] CHK-026 [P1] Constitutional README registration is complete. [EVIDENCE: constitutional README registration]
  - **Evidence**: `.opencode/skills/system-spec-kit/constitutional/README.md` lists `recorded-failure-must-route.md` in topology and key files.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret material introduced. [EVIDENCE: Markdown-only phase docs]
  - **Evidence**: Phase documents existing shipped rule/script/test files and adds markdown docs only in this pass.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: Cap reconciliation, constitutional rule, surfacer, and tests match across docs]
  - **Evidence**: All docs describe the cap reconciliation, constitutional rule, surfacer, and 4/4 assertion test.
- [x] CHK-041 [P1] Constitutional README registration completed. [EVIDENCE: constitutional README registration]
  - **Evidence**: `.opencode/skills/system-spec-kit/constitutional/README.md` now lists `recorded-failure-must-route.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Files are contained in the approved 014 phase folder. [EVIDENCE: `004-recorded-failure-closure/`]
  - **Evidence**: This checklist and peer docs live under `004-recorded-failure-closure/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-05
**Verified By**: gpt-5.5
<!-- /ANCHOR:summary -->
