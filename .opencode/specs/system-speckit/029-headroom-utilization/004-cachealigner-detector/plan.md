---
title: "Implementation Plan: Isolated Install + CacheAligner Detector"
description: "Install Headroom in an isolated, telemetry-off environment and run CacheAligner (detector-only, never mutates) over captured prompts to produce a real findings report, cross-checked against the 002 manual audit."
trigger_phrases:
  - "cachealigner detector"
  - "headroom isolated install"
  - "cache aligner findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/004-cachealigner-detector"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the cachealigner-detector phase"
    next_safe_action: "Stand up an isolated Headroom venv with telemetry off"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-004-cachealigner-detector"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Isolated Install + CacheAligner Detector

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Scope** | #3+#4 — Install + CacheAligner detector |
| **Dependency posture** | Independent install. Complements 002 (feeds its audit). The install is reused by 006. |
| **Output** | Scoped, reviewable artifacts under this phase folder |
| **Testing** | Evidence in the report + `validate.sh` |

### Overview
Create a disposable venv, pip install Headroom with the minimal extras CacheAligner needs, set the clean-room env vars (telemetry/update off, offline), capture a representative prompt, run CacheAligner.apply(), record findings, and assert the input bytes are unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Dependencies resolved (Independent install. Complements 002 (feeds its audit). The install is reused by 006.)
- [ ] Scope and acceptance criteria confirmed from spec.md

### Definition of Done
- [ ] All P0 requirements met with evidence
- [ ] Report artifact written; `validate.sh` green; STOP for review
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Key Components
- **Isolated venv**: disposable, minimal extras, never on the live interpreter.
- **Clean-room env**: `HEADROOM_TELEMETRY=off`, `HEADROOM_UPDATE_CHECK=off`, `HF_HUB_OFFLINE=1`.
- **Detector run**: `CacheAligner.apply(messages)` → findings; assert messages unchanged.
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
- [ ] T001 Create disposable venv; pip install minimal Headroom extras
- [ ] T002 Set clean-room env vars; verify no telemetry/update network calls

### Phase 2: Core
- [ ] T003 Capture a representative prompt; run CacheAligner.apply()
- [ ] T004 Assert input message bytes unchanged; collect VolatileFinding output

### Phase 3: Verification
- [ ] T005 Write the findings report; reconcile with the 002 audit
- [ ] T006 Run validate.sh; STOP for review
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
| Independent install. Complements 002 (feeds its audit). The install is reused by 006. | Internal | Planned | Phase cannot start/complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Approach fails or evidence is negative.
- **Procedure**: Artifacts are isolated under this phase folder; delete them. No authoritative artifact or vendored upstream is mutated, so rollback is a directory removal.
<!-- /ANCHOR:rollback -->
