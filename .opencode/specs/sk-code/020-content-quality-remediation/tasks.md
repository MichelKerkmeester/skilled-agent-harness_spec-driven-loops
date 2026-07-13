---
title: "Tasks: sk-code Content-Quality Remediation"
description: "Content-fix + verification task checklist with evidence."
trigger_phrases:
  - "020 tasks sk-code content quality remediation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/020-content-quality-remediation"
    last_updated_at: "2026-07-13T05:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete; 20/20 files at 0 issues"
    next_safe_action: "Terminal gates"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code Content-Quality Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Triage 019 xHigh review findings; confirm Bucket C items are pre-existing content defects out of 019 scope
- [x] T002 Identify the 2 security files + 19 boilerplate-When-to-Use files by corpus scan
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Rewrite generic When-to-Use → concrete scenarios in 19 code-webflow references (evidence: 0 "when implementing or troubleshooting" remain)
- [x] T004 Reconcile SameSite-cookie example to a non-sensitive cookie + add HttpOnly session-token caveat (`security_patterns/overview_and_checklist.md`)
- [x] T005 Add HTTPS origin allowlist + Subresource Integrity note to the CDN loader (`third_party_integrations/best_practices_and_summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T006 validate_document.py 0 issues on all 20 edited files (evidence: 20 VALID, 0 FAIL)
- [x] T007 Structural re-scan unchanged: 0 intro/Purpose dups, 0 generic When-to-Use
- [x] T008 0 new broken .md links in the 2 security files (evidence: fenced-code-aware scan, 0 broken)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
20/20 edited files at validate_document 0; 0 generic When-to-Use; both security examples consistent + safe; validate.sh --strict Errors 0. Met.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md` — scope and requirements
- `checklist.md` — QA evidence
- Sibling `019-split-doc-template-alignment` — structural conformance + the xHigh review that surfaced these items
<!-- /ANCHOR:cross-refs -->
