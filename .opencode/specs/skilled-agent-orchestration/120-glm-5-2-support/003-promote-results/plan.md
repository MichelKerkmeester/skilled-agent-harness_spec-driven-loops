---
title: "Implementation Plan: Phase 3: promote-results"
description: "Edit model_profiles.json recommended_frameworks + glm-5.2.md §3/§4 from the phase-2 verdict, then re-run card-sync + strict validation."
trigger_phrases:
  - "glm-5.2 promote plan"
  - "registry empirical framework glm"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-glm-5-2-support/003-promote-results"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan scaffolded; not started"
    next_safe_action: "Edit registry and profile from the verdict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/003-promote-results"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: promote-results

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON registry + Markdown profile |
| **Framework** | sk-prompt-models registry + card-sync guard |
| **Storage** | None (file-based) |
| **Testing** | Card-sync guard, JSON parse, `validate.sh --strict` |

### Overview
Read the phase-2 verdict, then make two edits: (1) `glm-5.2.recommended_frameworks` in `model_profiles.json` (primary, preplanning_density, evidence, status), and (2) §3/§4 of `references/models/glm-5.2.md` to cite the run. Edit the registry DATA first, then mirror the profile, then re-run the card-sync guard until exit 0. On a TIE/INCONCLUSIVE verdict, keep `default-unverified` and record the reason (149/003 precedent).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 2 verdict + leaderboard available

### Definition of Done
- [x] Registry + profile reflect the verdict
- [x] Card-sync exit 0; `validate.sh --strict` exit 0 across the packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-then-mirror. Edit the DATA (`model_profiles.json`) first, then mirror its framework choice into the profile §3/§4; the card-sync guard enforces that the two stay in sync.

### Key Components
- **model_profiles.json**: the `glm-5.2.recommended_frameworks` block (the DATA).
- **references/models/glm-5.2.md**: §3 Recommended Framework + §4 Benchmark Evidence (the mirror).
- **card-sync guard**: proves registry ↔ profile stay synchronized.

### Data Flow
1. Read the phase-2 verdict + leaderboard.
2. Write `recommended_frameworks` (primary/preplanning_density/evidence/status).
3. Mirror §3/§4 in the profile, citing the run-label.
4. Card-sync guard verifies the mirror.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Promote
- [x] Update `glm-5.2.recommended_frameworks` (primary, preplanning_density, evidence, status) from the verdict
- [x] Rewrite §3 + §4 of `references/models/glm-5.2.md` to cite the run

### Phase 2: Verify
- [x] Card-sync guard exit 0; edited JSON parses
- [x] `validate.sh --strict` exit 0 on parent + children
- [x] Reconcile parent phase map + child statuses + continuity
- [x] Write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | Registry ↔ profile sync | `check-prompt-quality-card-sync.sh .` |
| Parse | Edited JSON | `node` JSON.parse |
| Validate | Packet structural completeness | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 verdict | Internal | Pending | Nothing to promote |
| Card-sync guard | Internal | Available | Cannot verify sync |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Card-sync fails or the promotion over-claims.
- **Procedure**: Revert the two edits (git checkout); re-run the guard. Config-only, no migration.
<!-- /ANCHOR:rollback -->
