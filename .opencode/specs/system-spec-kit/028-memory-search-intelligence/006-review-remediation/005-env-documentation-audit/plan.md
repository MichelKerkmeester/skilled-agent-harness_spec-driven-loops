---
title: "Implementation Plan: ENV Documentation Deep Review and Remediation"
description: "The audit method and the remediation approach for the repository ENV-variable documentation: ten iterative opus passes over one surface, then source-verified doc and dist fixes."
trigger_phrases:
  - "env documentation audit plan"
  - "ENV_REFERENCE remediation plan"
  - "flag coverage audit method"
  - "stale dist rebuild plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/005-env-documentation-audit"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the audit method and the source-verified remediation approach"
    next_safe_action: "A separate house-style pass over pre-existing ENV_REFERENCE prose"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/005-env-documentation-audit/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: ENV Documentation Deep Review and Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference docs over TypeScript flag source |
| **Framework** | system-spec-kit ENV reference and its sibling |
| **Storage** | The compiled dist that the runtime reads |
| **Testing** | Source-versus-doc cross-check plus dist rebuild verification |

### Overview
An audit-then-remediate effort over one documentation surface. A ten-iteration opus deep review treated ENV_REFERENCE.md, the sibling environment_variables.md, the four changelogs, the root README, and the four skills' flag source as a single body, and entered a POOR verdict because the reference was actively misleading rather than merely incomplete. The remediation rebuilt the stale dist, added the missing flag rows, corrected the wrong defaults, reconciled the cross-doc contradictions, and fixed the structure, verifying every finding against source and correcting three review errors in the process.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The README and a changelog claim ENV_REFERENCE.md is the complete reference
- [x] The flag source identified as the ground truth to check the docs against
- [x] The ten audit lenses and the loop-until-dry stop condition defined

### Definition of Done
- [x] The stale dist rebuilt, zero `_V1` names remain
- [x] The missing rows added, the wrong defaults corrected, the contradictions reconciled
- [x] Every finding verified against source, no production default flipped
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-of-truth cross-check then source-verified remediation. The audit reads the flag source as ground truth and treats the docs as claims to test against it, so a documented default that disagrees with source is a defect, not a style note. The remediation re-verifies each finding at its source site before editing, which is how three review errors were caught rather than propagated into the docs.

### Key Components
- **The deep-review record**: the POOR entry verdict, the defects by severity, the three review errors caught, and the remediation applied
- **The dist rebuild**: drops the stale `_V1` names so the documented disable knobs work at runtime by their documented name
- **The added flag rows**: fifteen genuinely user-facing flags including the bitemporal reads, the force-parse and its degree cap, and the advisor RRF spine
- **The default corrections and reconciliations**: five wrong defaults fixed, two stale entries fixed, three cross-doc contradictions reconciled
- **The structural fixes**: the section sequence renumbered gapless, the interleaved unnumbered section moved to the appendix cluster

### Data Flow
The audit drives ten passes with rotating lenses, accumulating defects until a pass adds none. The raw 412-versus-289 gap triages down to a real set: zero P0, thirteen P1, sixteen P2. Each defect is re-verified at its source site, then fixed in ENV_REFERENCE.md or the sibling, with the dist rebuilt for the stale-build defect. The record captures every verdict and every caught review error.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify the flag source as the ground truth and the docs as claims
- [x] Define the ten audit lenses and the loop-until-dry stop condition
- [x] Treat ENV_REFERENCE.md, the sibling, the changelogs, the README, and the source as one surface

### Phase 2: Core Implementation
- [x] Run ten opus passes, enter POOR, record zero P0, thirteen P1, sixteen P2
- [x] Rebuild the stale dist so the documented disable knobs work at runtime
- [x] Add the fifteen flag rows, correct the five defaults, reconcile the three contradictions
- [x] Fix the two stale entries and the two structural issues

### Phase 3: Verification
- [x] Re-verify each finding against source, catch and correct three review errors
- [x] Confirm the section sequence is gapless 1 through 17 and the README is unchanged
- [x] Confirm zero `_V1` names remain and no production default was flipped
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deep read | The whole ENV-documentation surface against the flag source | Opus loop-until-dry passes |
| Cross-check | Documented defaults and flag names versus source | Manual source verification |
| Build | The rebuilt dist carries the de-suffixed flag names | Dist rebuild and grep for `_V1` |
| Structure | The section sequence is gapless and contiguous | Section-number scan |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The four skills' flag source | Internal | Green | No ground truth to check the docs against |
| The dist build pipeline | Internal | Green | The stale-build defect cannot be fixed |
| ENV_REFERENCE.md and the sibling | Internal | Green | Nothing to remediate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remediation edit documents a flag wrong, or the dist rebuild breaks the runtime
- **Procedure**:
  1. The dist is gitignored, so reverting the rebuild restores the prior local build with no shipped impact
  2. Revert the doc edits in ENV_REFERENCE.md and the sibling
  3. Re-run the source-versus-doc cross-check on the reverted state
<!-- /ANCHOR:rollback -->
