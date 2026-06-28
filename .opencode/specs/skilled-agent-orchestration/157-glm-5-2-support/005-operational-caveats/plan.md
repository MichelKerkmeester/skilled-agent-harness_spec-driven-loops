---
title: "Implementation Plan: Phase 5: operational-caveats (contingency)"
description: "Document confirmed GLM-5.2 dispatch gotchas + mitigations across the glm-5.2 profile + cli-opencode, additive and observation-driven."
trigger_phrases:
  - "glm-5.2 operational caveats plan"
  - "glm-5.2 dispatch gotchas"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/005-operational-caveats"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Contingency phase plan scaffolded; not started"
    next_safe_action: "Execute when a GLM-5.2 gotcha is observed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/005-operational-caveats"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: operational-caveats (contingency)

<!-- SPECKIT_LEVEL: 1 -->

> **CONTINGENCY** — run when a real GLM-5.2 dispatch gotcha is observed.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown profile + JSON registry |
| **Framework** | sk-prompt-small-model profile + cli-opencode |
| **Storage** | None (file-based) |
| **Testing** | Card-sync guard, JSON parse |

### Overview
When a GLM-5.2 dispatch gotcha is confirmed in real use, add a dated observation + mitigation to the canonical surfaces: `glm-5.2.md` (§2/§5/§6), `model_profiles.json` weaknesses, and a brief caveat on the GLM line in `cli-opencode/SKILL.md`. Additive notes only; no framework/slug change. Mirrors 149/006's Kimi timeout caveat.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] A real GLM-5.2 gotcha observed + a mitigation confirmed

### Definition of Done
- [x] Caveat + mitigation in both skills, framed as dated observation
- [x] Card-sync exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive caveat propagation. The same gotcha + mitigation appears in the profile (the hub WEIGHT), the registry weaknesses (the DATA), and the executor SKILL.md (the dispatch surface), kept in sync by the card-sync guard.

### Key Components
- **references/models/glm-5.2.md** §2/§5/§6: the gotcha + mitigation prose.
- **model_profiles.json** weaknesses: the registry mirror.
- **cli-opencode/SKILL.md** GLM line: the executor-surface caveat.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Document
- [x] Add the confirmed gotcha + mitigation to `glm-5.2.md` (§2/§5/§6) and `model_profiles.json` weaknesses
- [x] Add the brief caveat to the GLM line in `cli-opencode/SKILL.md`

### Phase 2: Verify
- [x] Card-sync guard exit 0; `model_profiles.json` parses
- [x] Write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | Registry ↔ profile sync after additive notes | `check-prompt-quality-card-sync.sh .` |
| Parse | Edited JSON | `node` JSON.parse |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A confirmed GLM-5.2 gotcha | Observation | Trigger | Phase does not run without one |
| Card-sync guard | Internal | Available | Cannot verify sync |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Caveat proves wrong or guard fails.
- **Procedure**: Revert the additive notes (git checkout); re-run the guard.
<!-- /ANCHOR:rollback -->
