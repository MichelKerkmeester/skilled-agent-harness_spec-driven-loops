---
title: "Implementation Plan: Manual Testing Playbook Cleanup"
description: "Defines the pending cleanup approach for manual testing playbook sweep."
trigger_phrases:
  - "028 release cleanup manual testing plan"
  - "manual-testing-playbooks cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/005-manual-testing-playbooks"
    last_updated_at: "2026-07-04T17:31:30.637Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Cleanup executed and quality gates satisfied"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-plan-005-manual-testing-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Manual Testing Playbook Cleanup

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | Spec Kit documentation workflow |
| **Storage** | Repository files |
| **Testing** | Shell discovery, grep scans and strict spec validation |

### Overview
This phase is a documentation cleanup work package, not an implementation pass. It starts with discovery, reviews each candidate against current files and ends with voice, stale-reference and validator checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Discovery command is run and saved as evidence.
- [x] Candidate list is compared with the phase scope.
- [x] Packet 030 exclusion is confirmed.

### Definition of Done
- [x] Every candidate document is reviewed.
- [x] HVR voice checks pass (no violation introduced by edits).
- [x] Stale-reference checks pass (14 genuine anchors fixed, residuals classified).
- [x] Strict validation exits 0 for this child phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only release cleanup.

### Key Components
- **Discovery**: Enumerates the target document set.
- **Review**: Compares each claim against current repository evidence.
- **Patch**: Updates only the in-scope documents during the later cleanup.
- **Verification**: Runs grep checks and strict validation.

### Data Flow
Discovery output becomes the candidate list. Cleanup edits use that list as the boundary, then verification scans confirm voice, path and stale-reference requirements.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Manual testing playbook sweep | Release documentation surface | Review later | Discovery output and grep evidence |
| Packet 030 | Shipped evidence packet | Unchanged | Confirm no path under packet 030 appears in diff |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Run discovery: `rg --files | rg '(^|/)(manual_testing_playbook\.md|manual_testing_playbook/.+\.md|manual_testing_playbook[^/]*\.md)$'`
- [x] Save discovered paths for phase evidence.
- [x] Confirm every path belongs to this phase scope.

### Phase 2: Core Implementation
- [x] Review each discovered document against current source files.
- [x] Remove or replace stale path claims.
- [x] Apply HVR voice edits.
- [x] Keep unrelated document families unchanged.

### Phase 3: Verification
- [x] Run em dash scan: `rg -n $'\\u2014' <discovered-docs>`
- [x] Run semicolon scan: `rg -n $'\\x3b' <discovered-docs>`
- [x] Run stale-reference scan against the live tree (backtick-anchor resolution).
- [x] Run strict validation for this child folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Discovery | Candidate document set | `rg --files` |
| Voice | HVR prose constraints | `rg` scans |
| Path validity | Source-file references | `test -e` and `rg -n` |
| Spec validation | Child phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current repository tree | Internal | Green | Cannot verify path claims without it |
| Spec-kit validator | Internal | Green | Cannot claim phase validation without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Cleanup edits touch documents outside this phase scope.
- **Procedure**: Revert only the out-of-scope edits and rerun discovery plus validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 005 | `../spec.md` | Parent phase map owns release-cleanup ordering |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Discovery | Small | One command plus review |
| Cleanup execution | Medium | Depends on discovered document count |
| Verification | Medium | Voice, path and stale-reference checks |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep discovery output with the phase evidence before edits.
- Revert any edit outside the discovered candidate list.
- Re-run `validate.sh --strict` after rollback.
<!-- /ANCHOR:enhanced-rollback -->
