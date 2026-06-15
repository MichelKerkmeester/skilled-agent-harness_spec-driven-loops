---
title: "Implementation Plan: Phase 4: model-hub-and-priority-profiles"
description: "Rewrite sk-prompt-small-model SKILL.md (hub architecture, version 0.2.0), create references/models/_index.md, and author the two priority profiles minimax-m3.md and mimo-v2.5-pro.md following the fixed 6-section template with empirical benchmark evidence."
trigger_phrases:
  - "implementation plan"
  - "model hub plan"
  - "priority profiles plan"
importance_tier: "normal"
contextType: "spec-completion"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/004-model-hub-and-priority-profiles"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "agent"
    recent_action: "Plan marked complete — all phases done"
    next_safe_action: "Phase 005: backfill remaining profiles"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:c8cfb7260ff0869ab0bda8fa35da1c953d2cd98d70347d86e21db3b349815290"
      session_id: "phase-004-completion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: model-hub-and-priority-profiles

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill documentation) |
| **Framework** | sk-prompt-small-model hub architecture (Architecture A) |
| **Storage** | File-based skill references under `.opencode/skills/sk-prompt-small-model/` |
| **Testing** | Manual LOC count, section-presence check, validate.sh --strict |

### Overview
Phase 4 matures `sk-prompt-small-model` from a thin router into the canonical per-model prompt-craft hub for the small-model rotation. The approach is documentation-only: rewrite SKILL.md to the hub architecture (Architecture A), create the model index, and author the two priority profiles (minimax-m3.md carrying benchmark 120/003 evidence, mimo-v2.5-pro.md with benchmark 126/004 empirical evidence). No runtime code is touched; executor mechanics stay in cli-devin/cli-opencode.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (phase 003 model-profiles.json data confirmed present)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (validate.sh --strict exits 0)
- [x] Docs updated (spec/plan/tasks/implementation-summary all complete)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hub architecture (Architecture A): thin entry surface (SKILL.md) + on-demand per-model profiles (`references/models/<id>.md`) + two thin indexes (`_index.md` + `pattern-index.md`).

### Key Components
- **SKILL.md**: Entry surface <= 200 LOC; dispatch matrix; ALWAYS/NEVER ownership rules; adoption protocol for new providers
- **references/models/_index.md**: Per-model index mirroring model-profiles.json recommended_frameworks; 8 active model rows; roadmap pointers for unAuthored profiles
- **references/models/minimax-m3.md**: Priority profile; TIDD-EC + dense; carried from minimax-2.7 benchmark 120/003
- **references/models/mimo-v2.5-pro.md**: Priority profile; COSTAR + lean; empirical from benchmark 126/004

### Data Flow
Operator names a small model -> advisor surfaces sk-prompt-small-model via trigger phrases or enhances edges -> operator reads `_index.md` to pick the profile -> operator reads `<id>.md` for framework + scaffold + gotchas -> operator follows `pattern-index.md` to cli-X for executor mechanics -> prompt-craft and mechanics combine in the dispatch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt-small-model/SKILL.md` | Entry surface (thin router) | Rewritten to hub architecture; version 0.2.0 | `wc -l` = 199; title check; version check |
| `references/models/_index.md` | Did not exist | Created: 8-row index | File present; 8 rows confirmed |
| `references/models/minimax-m3.md` | Did not exist | Created: full 6-section profile | All 6 sections present; status: carried; 120/003 cited |
| `references/models/mimo-v2.5-pro.md` | Did not exist | Created: full 6-section profile | All 6 sections present; status: empirical; 126/004 cited |
| `cli-opencode` prompt templates | Carries executor mechanics for MiniMax and MiMo | Unchanged — profiles cross-reference but do not restate | No changes to cli-opencode files |
| `sk-prompt/assets/model-profiles.json` | DATA registry | Unchanged — read by profiles as source of truth | Phase 003 already populated; no changes here |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Audit existing SKILL.md to identify what to keep vs rewrite
- [x] Verify phase 003 model-profiles.json data is present for target models
- [x] Confirm the fixed 6-section profile template shape with the phase spec

### Phase 2: Core Implementation
- [x] Rewrite SKILL.md: hub architecture, ALWAYS/NEVER rules, dispatch matrix, adoption protocol, version 0.2.0, 199 LOC
- [x] Create `references/models/_index.md`: 8 active-model rows with framework, pre-planning density, status
- [x] Author `references/models/minimax-m3.md`: TIDD-EC + dense, status: carried (120/003), full 6-section template
- [x] Author `references/models/mimo-v2.5-pro.md`: COSTAR + lean, status: empirical (126/004), full 6-section template

### Phase 3: Verification
- [x] LOC check on SKILL.md (wc -l = 199, under 200-LOC cap)
- [x] Section completeness check on both profiles (6/6 sections present in each)
- [x] validate.sh --strict on the spec folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | SKILL.md LOC count; version field; title check | `wc -l` |
| Manual | Profile section presence (6/6 in each file) | Read + visual inspection |
| Manual | Executor mechanics absence check (no binary flags restated in profiles) | Read + visual inspection |
| Automated | Spec folder structural validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-prompt/assets/model-profiles.json` (phase 003) | Internal | Green — phase 003 complete | Profiles cannot mirror the registry DATA if it is absent or stale |
| `cli-opencode` prompt templates 14 and 15 | Internal | Green — Templates 14/15 exist | Profiles cross-reference these for executor mechanics; no dependency on their content for authoring profiles |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh --strict fails after all edits; or SKILL.md LOC > 200 after rewrite
- **Procedure**: Restore SKILL.md from git history (the old 0.1.0 version); remove the newly created profile files and _index.md; re-run validate.sh to confirm the folder is structurally valid in its pre-phase-004 state
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
