---
title: "Implementation Plan: Skill References Assets And SKILL Cleanup"
description: "Defines the pending cleanup approach for skill.md, references and assets sweep."
trigger_phrases:
  - "028 release cleanup skill references plan"
  - "skill-references-assets-and-skillmd cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/000-release-cleanup/003-skill-references-assets-and-skillmd"
    last_updated_at: "2026-07-04T17:31:34.024Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed cleanup per plan, verification route run"
    next_safe_action: "Concurrent session owns the deferred deep-research skill subset"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-plan-003-skill-references-assets-and-skillmd"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Skill References Assets And SKILL Cleanup

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
- [ ] Discovery command is run and saved as evidence.
- [ ] Candidate list is compared with the phase scope.
- [ ] Packet 030 exclusion is confirmed.

### Definition of Done
- [ ] Every candidate document is reviewed.
- [ ] HVR voice checks pass.
- [ ] Stale-reference checks pass.
- [ ] Strict validation exits 0 for this child phase.
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
| SKILL.md, references and assets sweep | Release documentation surface | Review later | Discovery output and grep evidence |
| Packet 030 | Shipped evidence packet | Unchanged | Confirm no path under packet 030 appears in diff |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Run discovery: `rg --files .opencode/skills | rg '/(SKILL\.md|references/.+\.md|assets/.+\.md)$'`
- [ ] Save discovered paths for phase evidence.
- [ ] Confirm every path belongs to this phase scope.

### Phase 2: Core Implementation
- [ ] Review each discovered document against current source files.
- [ ] Remove or replace stale path claims.
- [ ] Apply HVR voice edits.
- [ ] Keep unrelated document families unchanged.

### Phase 3: Verification
- [ ] Run em dash scan: `rg -n $'\\u2014' <discovered-docs>`
- [ ] Run semicolon scan: `rg -n $'\\x3b' <discovered-docs>`
- [ ] Run stale-reference scan: `rg -n 'TODO|TBD|deprecated|stale|removed|renamed|missing|does not exist|dead link' <discovered-docs>`
- [ ] Run strict validation for this child folder.
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
| 003 | `../spec.md` | Parent phase map owns release-cleanup ordering |
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
