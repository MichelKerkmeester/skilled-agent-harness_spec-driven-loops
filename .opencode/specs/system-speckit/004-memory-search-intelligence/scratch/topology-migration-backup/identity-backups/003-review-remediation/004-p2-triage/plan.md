---
title: "Implementation Plan: P2 Triage"
description: "Approach for grouping the 91 P2 by lens, deciding fix-now vs accept-as-is and routing the fix-now groups."
trigger_phrases:
  - "028 p2 triage plan"
  - "p2 fix-now routing plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-review-remediation/004-p2-triage"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING p2-triage plan"
    next_safe_action: "Verify every P2 maps to a group before routing"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-plan-006-004-p2-triage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: P2 Triage

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown triage over the review report |
| **Framework** | Spec Kit review remediation |
| **Storage** | Repository files |
| **Testing** | Coverage check against the full P2 set, strict spec validation |

### Overview
This phase is a decision layer, not a change. It reads the 91 P2 from the review report, assigns each to a lens family, marks each family fix-now or accept-as-is with a reason and routes the fix-now families to a follow-on owner. No code is touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The full P2 set is read from `../../archive/review-report.md`.
- [ ] The lens families are enumerated.
- [ ] The two review caveats (lineage re-root, bitemporal zero-callers) are noted.

### Definition of Done
- [ ] Every P2 maps to exactly one family.
- [ ] Every family has a verdict and a one-line reason.
- [ ] Every fix-now family names a follow-on owner.
- [ ] Strict validation exits 0 for this child phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decision-layer triage over a frozen finding set.

### Key Components
- **Grouping**: assign each P2 to a lens family.
- **Verdict**: mark each family fix-now or accept-as-is.
- **Reason**: justify each verdict in one line.
- **Routing**: send each fix-now family to a follow-on owner.

### Data Flow
The review report finding set is partitioned into families. Each family gets a verdict and a reason. Fix-now families are routed. Accept-as-is families record why deferral is safe.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../../archive/review-report.md` | Per-item P2 source of truth | Read only | Triage maps every P2 |
| This phase scaffold | Triage decision record | Author | Verdicts and routing complete |
| Follow-on phases | Fix-now owners | Route to | Each fix-now family has an owner |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read all 91 P2 from the review report.
- [ ] Confirm the lens family list covers every finding.
- [ ] Note the two caveats requiring reconfirmation.

### Phase 2: Core Implementation
- [ ] Assign each P2 to one family.
- [ ] Mark each family fix-now or accept-as-is with a one-line reason.
- [ ] Route each fix-now family to a follow-on owner.

### Phase 3: Verification
- [ ] Confirm no P2 is left ungrouped.
- [ ] Confirm each family has a verdict and a reason.
- [ ] Run strict validation for this child folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Coverage | Every P2 mapped | Manual cross-check against review-report.md |
| Verdict completeness | Every family decided | Triage table review |
| Spec validation | Child phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `review-report.md` | Internal | Green | Cannot triage without the finding set |
| Phases 001-003 | Internal | Pending | Some fix-now families route to them |
| Spec-kit validator | Internal | Green | Cannot claim phase validation without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A family verdict is shown wrong by a reconfirmed caveat.
- **Procedure**: Re-decide that family with the new evidence and re-route if needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 004 | `../spec.md` | Parent roster orders the remediation phases |
| 004 | `../003-doc-accuracy/spec.md` | G12 doc-accuracy cluster is owned there |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Grouping | Small | Families already drafted in spec.md |
| Verdicts and reasons | Small | One line per family |
| Routing | Small | Map fix-now families to owners |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep the prior triage table before re-deciding a family.
- Re-route any family whose verdict changes after a caveat is reconfirmed.
- Re-run `validate.sh --strict` after any change.
<!-- /ANCHOR:enhanced-rollback -->
