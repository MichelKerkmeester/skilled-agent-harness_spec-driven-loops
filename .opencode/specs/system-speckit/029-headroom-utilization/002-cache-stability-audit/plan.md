---
title: "Implementation Plan: Cache-Stability Audit of Prompt Prefixes"
description: "Audit our hook/prompt-prefix injection for volatile tokens (UUIDs, ISO-8601 timestamps, JWTs, hex hashes, session IDs) that bust the provider prompt cache, and relocate them after the stable cached prefix. Applies CacheAligner principle with zero Headroom dependency."
trigger_phrases:
  - "cache stability audit"
  - "prompt cache busting"
  - "volatile token audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/002-cache-stability-audit"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the cache-stability-audit phase"
    next_safe_action: "Identify the hook sites that contribute to the cached prefix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-002-cache-stability-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cache-Stability Audit of Prompt Prefixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Scope** | #1 — Cache-stability audit |
| **Dependency posture** | None — this is a read-only audit of our own injected context; it does not install or run Headroom. |
| **Output** | Scoped, reviewable artifacts under this phase folder |
| **Testing** | Evidence in the report + `validate.sh` |

### Overview
Grep our hook-injection and startup-context sites for the four volatile-token shapes plus session ids, locate which land in the cached prefix, and relocate them after the stable prefix where it is safe. No Headroom code is installed or run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Dependencies resolved (None — this is a read-only audit of our own injected context; it does not install or run Headroom.)
- [ ] Scope and acceptance criteria confirmed from spec.md

### Definition of Done
- [ ] All P0 requirements met with evidence
- [ ] Report artifact written; `validate.sh` green; STOP for review
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Key Components
- **Volatile-token matcher**: regexes for UUID, ISO-8601, JWT-shape, hex-hash, session-id (mirroring `cache_aligner.py` classification).
- **Prefix boundary map**: which injected blocks are byte-stable vs per-turn.
- **Reorder fixes**: move volatile content to the tail of the injected block.
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
- [ ] T001 Enumerate hook/startup/advisor injection sites that contribute to the prompt prefix
- [ ] T002 Build the volatile-token matchers (UUID / ISO-8601 / JWT / hex-hash / session-id)

### Phase 2: Core
- [ ] T003 Grep the sites; record each volatile-token occurrence with file:line into the audit report
- [ ] T004 Classify each as in-cached-prefix vs after-prefix; mark the cache-busters

### Phase 3: Verification
- [ ] T005 Recommend a move-after-prefix (or justified-keep) for each cache-buster
- [ ] T006 Apply the low-risk reorders; re-run the audit; STOP for review
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
| None — this is a read-only audit of our own injected context; it does not install or run Headroom. | Internal | Planned | Phase cannot start/complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Approach fails or evidence is negative.
- **Procedure**: Artifacts are isolated under this phase folder; delete them. No authoritative artifact or vendored upstream is mutated, so rollback is a directory removal.
<!-- /ANCHOR:rollback -->
