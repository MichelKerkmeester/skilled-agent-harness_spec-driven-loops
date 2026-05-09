---
title: "Implementation Plan: 027/004 Skill Advisor First-Action Mandate"
description: "Plan for render-layer mandate wording with uncertainty guardrails, fallback hints, and fixture migration."
trigger_phrases:
  - "027 004 advisor mandate plan"
  - "skill advisor first action plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-skill-advisor-first-action-mandate"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned plan.md with manifest anchors and pt-02 guardrails"
    next_safe_action: "Choose uncertainty guard strategy"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-09-027-alignment-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Renderer-side uncertainty check or producer invariant proof."
    answered_questions:
      - "No scorer source changes."
---
# Implementation Plan: 027/004 Skill Advisor First-Action Mandate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit skill_advisor |
| **Storage** | None |
| **Testing** | Vitest, `npm run check`, spec validator |

### Overview
Phase 004 strengthens the advisor brief from suggestion to first-action mandate when confidence and uncertainty thresholds are satisfied. pt-02 adds the guardrails that make the stronger wording honest: high-uncertainty cases must stay soft, unknown hints must fall back safely, and exact string fixtures must be migrated intentionally.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Guard strategy chosen.
- [ ] FIRST_ACTION_HINT coverage and fallback text defined.
- [ ] Existing exact-string fixtures inventoried.

### Definition of Done
- [ ] Mandate wording renders only for threshold-passing recommendations.
- [ ] Unknown labels never render `undefined`.
- [ ] Renderer tests, producer tests if touched, `npm run check`, and strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Render-layer copy and guard update.

### Key Components
- **`render.ts`**: owns FIRST_ACTION_HINT, fallback text, guard logic, and final brief strings.
- **Renderer/producer tests**: own boundary and legacy-string fixture coverage.

### Data Flow
The advisor recommendation reaches render with confidence, uncertainty, and label data. The renderer emits mandate wording only when the selected guard proves both confidence and uncertainty are within threshold.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill_advisor/lib/render.ts` | Prompt-boundary renderer | Modify | Renderer boundary tests |
| `render.vitest.ts` | Renderer fixtures | Modify | Mandate, fallback, cap, uncertainty tests |
| `skill-advisor-brief.vitest.ts` | Producer fixture coverage | Modify only if string pins exist | Producer invariant or migrated string tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Choose guard strategy.
- [ ] Inventory string fixtures and hint labels.

### Phase 2: Core Implementation
- [ ] Add hints and fallback.
- [ ] Update render strings and guard.
- [ ] Migrate tests.

### Phase 3: Verification
- [ ] Run renderer tests, `npm run check`, and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | render output, uncertainty guard, fallback, token caps | Vitest |
| Integration | producer invariant if selected | Vitest |
| Validation | Spec folder structure and anchors | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing render.ts threshold semantics | Internal | Available | Guard proof cannot be written |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: mandate wording causes false-positive first-action commands or breaks existing brief tests.
- **Procedure**: Revert the render/test commit and confirm old brief tests pass.
<!-- /ANCHOR:rollback -->
