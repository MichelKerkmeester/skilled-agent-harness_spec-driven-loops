---
title: "Feature Specification: ENV Documentation Deep Review and Remediation"
description: "A ten-iteration opus deep review of the repository ENV-variable documentation, and the remediation that fixed what it found. The review treated the canonical ENV_REFERENCE.md, the sibling environment_variables.md, the four changelogs, the root README, and the four skills' flag source as one surface. It found the reference was actively misleading, not merely incomplete: a stale dist build left twelve graduated features' documented disable knobs inert at runtime, five documented defaults were wrong, several entries were stale or contradictory across the two docs, and fifteen genuinely user-facing flags were undocumented including the bitemporal reads, the reverse-dependency force-parse and its degree cap, and the advisor RRF spine. The remediation rebuilt the dist, added the missing rows, corrected the defaults, reconciled the two docs, and fixed the structure, while verifying every finding against source and correcting three review errors in the process."
trigger_phrases:
  - "env documentation audit"
  - "ENV_REFERENCE.md missing flags"
  - "stale dist flag rename"
  - "undocumented feature flags"
  - "flag coverage gap"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/004-review-remediation/005-env-documentation-audit"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Audited ENV docs, rebuilt the dist, added 15 flags, fixed defaults"
    next_safe_action: "A separate house-style pass over pre-existing ENV_REFERENCE prose"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/004-review-remediation/005-env-documentation-audit/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: ENV Documentation Deep Review and Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/029-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../004-p2-triage/spec.md |
| **Successor** | ../006-review-record-packet-type/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root README points readers to ENV_REFERENCE.md as the complete flag reference, and a code-graph changelog claimed specific flags were documented there. Neither held. A check of the code against the docs showed 412 flags read versus 289 documented, and the gap hid real defects. A flag-rename commit dropped version suffixes in the source but never rebuilt the shipped dist, so twelve graduated features' documented disable knobs were inert at runtime. Five documented defaults were wrong, several entries were stale or contradictory across the two ENV docs, and fifteen genuinely user-facing flags were undocumented. A reader who trusted the reference would be misled.

### Purpose
Audit the whole ENV-documentation surface as one body and fix it so the reference is trustworthy. Rebuild the stale dist, add the missing rows, correct the wrong defaults, reconcile the cross-doc contradictions, and fix the structure, verifying every finding against source before acting.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The ten-iteration opus deep-review record (`review/review-report.md`): the entry verdict, the defects by severity, the three review errors caught, and the remediation applied
- The dist rebuild that restores the documented disable knobs at runtime
- The fifteen flag rows added to ENV_REFERENCE.md
- The five corrected defaults, the two fixed stale entries, the three cross-doc reconciliations, and the two structural fixes

### Out of Scope
- Reformatting the pre-existing ENV_REFERENCE.md prose for house style, which is a separate pass
- Flipping any production default
- Any file outside the ENV docs and this packet folder

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| review/review-report.md | Reference | The deep-review record, read-only, documented not edited |
| spec.md | Create | This conformant Level 1 spec from the template |
| plan.md | Create | The audit method and the remediation approach |
| tasks.md | Create | The audit lenses and the fix tasks, marked complete with evidence |
| implementation-summary.md | Create | The outcome, the verification, and the validation evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The stale dist is rebuilt | Zero `_V1` flag names remain in the dist, so the documented disable knobs work at runtime by their documented name |
| REQ-002 | The wrong defaults are corrected | The five inaccurate defaults match source, and the config-pin gaps are disclosed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The undocumented user-facing flags are added | Fifteen genuinely user-facing flag rows are present, including the bitemporal reads, the force-parse and its degree cap, and the RRF spine |
| REQ-004 | The cross-doc contradictions are reconciled | The two ENV docs agree on the recency decay, the graph weight cap, and the disputed defaults |
| REQ-005 | The structure is gapless and every finding verified | The section sequence runs gapless 1 through 17, and three review errors are caught and corrected against source |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who trusts ENV_REFERENCE.md is no longer misled, because the documented disable knobs work, the defaults match source, and the contradictions are gone
- **SC-002**: The code-graph changelog claim that the bitemporal flag and degree cap are documented in ENV_REFERENCE.md is now true, and no production default was flipped
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A review finding is wrong and the fix documents a falsehood | High | Every finding is verified against source first, three review errors were caught this way |
| Risk | The dist rebuild changes runtime behavior | Medium | The dist is gitignored so external users always build fresh, the impact was local only |
| Dependency | The four skills' flag source | The audit reads it as ground truth | The source is the authority the docs are checked against |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the pre-existing ENV_REFERENCE.md prose be reformatted for house style now? **RESOLVED: No, the eleven em-dashes and the prose semicolons are pre-existing debt, tracked for a separate house-style pass**
- Should the README be edited to match the review's claim about line 144? **RESOLVED: No, the review hallucinated that claim, the README has no such assertion and was left untouched**
<!-- /ANCHOR:questions -->
