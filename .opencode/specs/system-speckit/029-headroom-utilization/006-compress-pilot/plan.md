---
title: "Implementation Plan: Scoped Offline compress() Pilot"
description: "Run a scoped, offline Headroom compress() pilot on one copied non-authoritative artifact behind the 003 guard, measuring real token savings, citation survival, and rejection of excluded fixtures — turning the proven perfect-fit design into a measured result."
trigger_phrases:
  - "compress pilot"
  - "headroom compress benchmark"
  - "perfect fit pilot"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/006-compress-pilot"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the compress-pilot phase"
    next_safe_action: "Pick one large copied artifact and reuse the 004 install"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-006-compress-pilot"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Scoped Offline compress() Pilot

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Scope** | #6 — Offline compress() pilot |
| **Dependency posture** | Depends on 003 (the exclusion guard) and 004 (the isolated install). |
| **Output** | Scoped, reviewable artifacts under this phase folder |
| **Testing** | Evidence in the report + `validate.sh` |

### Overview
Reuse the 004 install, pick one large copied non-authoritative artifact, run it through the 003 guard then compress() with the conservative config, measure live before/after tokens and citation equality, and run the negative fixtures to confirm 100% rejection.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Dependencies resolved (Depends on 003 (the exclusion guard) and 004 (the isolated install).)
- [ ] Scope and acceptance criteria confirmed from spec.md

### Definition of Done
- [ ] All P0 requirements met with evidence
- [ ] Report artifact written; `validate.sh` green; STOP for review
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Key Components
- **Pilot harness**: guard → compress() → measure, fail-safe to raw.
- **Positive fixture**: one large copied bundle (e.g. a long tool-output / iteration bundle).
- **Negative fixtures**: the excluded classes that must be rejected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Scoped to this phase folder and the explicitly named targets in spec.md §3. No authoritative artifact is mutated, and the vendored `../../external/` tree is read-only.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| this phase's artifacts | phase output | create | files present + `validate.sh` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] T001 Reuse the 004 isolated install; confirm clean-room env
- [ ] T002 Select one large copied non-authoritative artifact + assemble negative fixtures

### Phase 2: Core
- [ ] T003 Run the artifact through the 003 guard, then compress() with the conservative config
- [ ] T004 Measure before/after tokens + [SOURCE:] equality; run negative fixtures

### Phase 3: Verification
- [ ] T005 Write the measured report (savings, citation survival, rejection rate)
- [ ] T006 Run validate.sh; STOP for the adoption decision
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence | P0 acceptance criteria | report artifact, measured deltas |
| Validation | spec-folder hygiene | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Depends on 003 (the exclusion guard) and 004 (the isolated install). | Internal | Planned | Phase cannot start/complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Approach fails or evidence is negative.
- **Procedure**: Artifacts are isolated under this phase folder; delete them. No authoritative artifact or vendored upstream is mutated, so rollback is a directory removal.
<!-- /ANCHOR:rollback -->
