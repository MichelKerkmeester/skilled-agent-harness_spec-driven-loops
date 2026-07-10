---
title: "Implementation Plan: RTK Shell-Output Shortening Trial"
description: "Trial RTK (the Rust shell-output shortener bundled with Headroom) on a representative set of our noisy commands, measure savings and correctness, and decide adopt/skip — independent of Headroom proxy/wrap."
trigger_phrases:
  - "rtk shell output trial"
  - "rust token killer trial"
  - "shell output compression"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/005-rtk-shell-output-trial"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the rtk-shell-output-trial phase"
    next_safe_action: "Obtain the RTK binary and pick representative commands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-005-rtk-shell-output-trial"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: RTK Shell-Output Shortening Trial

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Scope** | #5 — RTK shell-output trial |
| **Dependency posture** | Independent — does not require the Headroom Python package or the proxy/wrap. |
| **Output** | Scoped, reviewable artifacts under this phase folder |
| **Testing** | Evidence in the report + `validate.sh` |

### Overview
Obtain the RTK binary, pick a representative set of our noisy commands, run each raw and rtk-prefixed capturing both outputs, measure savings, diff for fidelity, and decide adopt/skip per command class.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Dependencies resolved (Independent — does not require the Headroom Python package or the proxy/wrap.)
- [ ] Scope and acceptance criteria confirmed from spec.md

### Definition of Done
- [ ] All P0 requirements met with evidence
- [ ] Report artifact written; `validate.sh` green; STOP for review
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Key Components
- **Command set**: representative git/test/build/search commands from our workflows.
- **Measure harness**: raw vs rtk char/token deltas.
- **Fidelity diff**: confirm rtk preserves what we consume.
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
- [ ] T001 Obtain the RTK binary (binaries.py or standalone) and verify provenance
- [ ] T002 Select ≥5 representative noisy commands

### Phase 2: Core
- [ ] T003 Run each raw vs rtk; record char/token savings
- [ ] T004 Diff outputs; flag any dropped information we rely on

### Phase 3: Verification
- [ ] T005 Write the trial report with per-command adopt/skip calls
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
| Independent — does not require the Headroom Python package or the proxy/wrap. | Internal | Planned | Phase cannot start/complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Approach fails or evidence is negative.
- **Procedure**: Artifacts are isolated under this phase folder; delete them. No authoritative artifact or vendored upstream is mutated, so rollback is a directory removal.
<!-- /ANCHOR:rollback -->
