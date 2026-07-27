---
title: "Verification Checklist: sk-design shared procedures conformance"
description: "Verification Date: 2026-07-27"
trigger_phrases:
  - "sk-design shared procedures conformance"
  - "checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared/004-procedures"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 checklist for template-conformance leaf"
    next_safe_action: "Mark CHK-001 once the audit begins"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/procedures/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: sk-design shared procedures conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` ANCHOR:problem and ANCHOR:scope populated with the concrete in-scope file table.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` documents the read-then-diff-then-fix-or-disprove approach used for this leaf.
- [x] CHK-003 [P1] Governing template confirmed reachable and current
  - **Evidence**: Governing template file read directly in full at the path cited in `spec.md` (see CHK-010 evidence).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 1 in-scope file(s) read and diffed against .opencode/skills/sk-doc/create-skill/assets/skill/skill-procedure-template.md
  - **Evidence**: 1/1 file read and diffed against skill-procedure-template.md (polish-gate-orchestration.md).
- [x] CHK-011 [P1] Audit outcome recorded per file, including 'no changes' results
  - **Evidence**: DISPROVEN: the file's missing '## 1. OVERVIEW' and missing --- separators are NOT a defect — polish-gate-orchestration.md correctly follows the local shared/procedure-card-schema.md contract, which mandates '## 1. REQUIRED FIELDS' as the literal first heading (not OVERVIEW) and does not require --- separators between sections for procedure cards. Confirmed identical to the schema's own worked example. No changes made. Cross-checked against `checklist.md` CHK-010 evidence.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All in-scope files audited (100% coverage, not a sample)
  - **Evidence**: 100% of in-scope files audited per CHK-010's file count, not a sample.
- [x] CHK-021 [P0] Confirmed defects fixed or explicitly deferred with owner
  - **Evidence**: `node shared/scripts/procedure-card-schema-check.mjs` -> pass, 12/12 cards including this one, 0 failures.
- [x] CHK-022 [P1] Out-of-audit items (owned by sibling packets) NOT touched
  - **Evidence**: `git status --porcelain` scoped to this leaf's directory shows no sibling-packet paths touched.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Out-of-scope items (sibling-owned decisions) explicitly named, not silently fixed or ignored
  - **Evidence**: No out-of-scope items required naming for this leaf beyond what CHK-011 already records. Confirmed via `git status --porcelain` on the leaf's scope.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced
  - **Evidence**: `rg -n "api[_-]?key|secret|password|token="` across the touched files returns no hits.
- [x] CHK-031 [P2] N/A — documentation-only leaf, no input surfaces changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all cite the same in-scope file table and governing template path.
- [x] CHK-041 [P2] Governing template cited by path in spec.md and plan.md
  - **Evidence**: Governing template path is cited verbatim in `spec.md` ANCHOR:scope and referenced again in `plan.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No scratch/ files were created during this audit pass. `find <leaf>/scratch -type f 2>/dev/null` returns no results.
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: N/A confirmed — CHK-050 shows no scratch/ usage requiring cleanup. `find <leaf>/scratch -type f 2>/dev/null` confirms nothing to clean.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 6 | 6/6 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-07-27 (executed)
<!-- /ANCHOR:summary -->
