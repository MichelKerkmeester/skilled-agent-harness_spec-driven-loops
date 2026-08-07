---
title: "Implementation Plan: 002 Advisor Surface Audit"
description: "Disposition nine findings before touching anything. Two are already verified; the other seven need re-testing with exact-symbol searches, because the naive search for a shorter lookalike string would "
trigger_phrases:
  - "advisor-018-002"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/018-advisor-audit-and-state-containment/002-advisor-surface-audit"
    last_updated_at: "2026-07-27T17:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored from research"
    next_safe_action: "Re-verify each finding against HEAD"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-018-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 002 Advisor Surface Audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node |
| **Framework** | MCP server, scorer lanes, launcher |
| **Storage** | SQLite skill graph, JSON state |
| **Testing** | Vitest; note the include glob does not reach every test on disk |

### Overview

Disposition nine findings before touching anything. Two are already verified; the other seven need re-testing with exact-symbol searches, because the naive search for a shorter lookalike string would have refuted a true finding.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every claim re-verified against current HEAD
- [ ] Open question in `spec.md` resolved

### Definition of Done
- [ ] All checklist items carry evidence
- [ ] `validate.sh --strict` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verify first, then change one thing at a time, proving each step before the next.

### Key Components

- **Evidence**: the research report and its per-claim commands.
- **Verification**: independent re-runs, not the report's own assertions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm
- [ ] Re-verify all nine findings against current HEAD with exact-symbol searches

### Phase 2: Disposition
- [ ] Record CONFIRMED, REFUTED or DEFERRED per finding with its command

### Phase 3: Systemic
- [ ] Propose a guard for the test-invisibility class rather than two point fixes

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Spec conformance | `validate.sh --strict` |
| Behavioural | The change actually holds | Re-run each evidence command |
| Regression | The defect cannot return | A boundary test, not an enumeration |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Research report | Internal | Green | No evidence base |
| Current HEAD stability | External | Shared tree | Findings may go stale mid-phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a change breaks a consumer that the evidence did not surface.
- **Procedure**: revert the single commit for that change; each step lands separately so blast radius stays one item.
<!-- /ANCHOR:rollback -->
