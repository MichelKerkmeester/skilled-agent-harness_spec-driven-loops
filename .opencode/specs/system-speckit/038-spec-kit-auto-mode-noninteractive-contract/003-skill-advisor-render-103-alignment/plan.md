---
title: "Implementation Plan: 103/003 Skill Advisor Render-Layer 103 Alignment"
description: "Plan for strengthening skill advisor render wording under the 103 noninteractive contract while preserving scorer and threshold behavior."
trigger_phrases:
  - "103 phase 003"
  - "skill advisor render 103 alignment"
  - "render.ts MUST invoke FIRST"
  - "advisor first-action under 103 contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet per pt-04 audit"
    next_safe_action: "Implement render wording"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-103-003-skill-advisor-render-103-alignment-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 103/003 Skill Advisor Render-Layer 103 Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit skill advisor |
| **Storage** | None |
| **Testing** | Focused render tests, OpenCode checks, strict spec validation |

### Overview

Phase 103/003 updates only the skill advisor render layer. It keeps `passes_threshold` as the existing authority, adds a first-action hint map, and changes passing recommendations from soft "use" language to the 103-owned "MUST invoke FIRST" vocabulary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] 027/005 cancellation path identified.
- [x] 103/001 and 103/002 predecessor packets exist.
- [x] Target file and threshold lines identified.
- [x] Scorer surgery explicitly out of scope.

### Definition of Done

- [ ] `FIRST_ACTION_HINT` exists in `render.ts`.
- [ ] Passing recommendations render `MUST invoke ${label} FIRST`.
- [ ] Non-passing recommendations do not render the mandate.
- [ ] `lib/scorer/` has no diff.
- [ ] Focused render tests pass.
- [ ] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Render-layer wording transformation behind an existing scorer-produced threshold signal.

### Key Components

- **`FIRST_ACTION_HINT`**: static map from shipped skill label to concise first action.
- **Fallback hint**: safe generic action for unknown/future labels.
- **Passing recommendation renderer**: emits mandate only after `passes_threshold`.
- **Render tests**: assert gate behavior and cap safety.

### Data Flow

The scorer produces recommendations and threshold metadata. `render.ts` reads the top passing recommendation, resolves its first-action hint, formats the directive, and applies the existing text cap. If the threshold gate fails, the renderer keeps non-mandatory output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Read `mcp_server/skill_advisor/lib/render.ts`.
- [ ] Read existing skill advisor render tests and fixtures.
- [ ] Inventory shipped skill labels used by advisor output.

### Phase 2: Core Implementation

- [ ] Add `FIRST_ACTION_HINT` map to `render.ts`.
- [ ] Add fallback action hint for unknown labels.
- [ ] Update `render.ts:155-157` normal passing path to emit `MUST invoke ${label} FIRST — ${action_hint}`.
- [ ] Preserve `render.ts:124-133` threshold logic.
- [ ] Leave `mcp_server/skill_advisor/lib/scorer/` untouched.

### Phase 3: Verification

- [ ] Add/adjust render tests for passing mandate wording.
- [ ] Add/adjust render tests for below-threshold and high-uncertainty non-mandate behavior.
- [ ] Add/adjust fallback hint test.
- [ ] Add/adjust cap safety test.
- [ ] Run focused render tests.
- [ ] Run strict validation for this spec folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Passing threshold directive wording | Existing render test harness |
| Unit | Non-passing threshold does not mandate | Existing render test harness |
| Unit | Unknown label fallback hint | Existing render test harness |
| Unit | Cap safety for longest label/hint | Existing render test harness |
| Diff check | `lib/scorer/` untouched | `git diff -- mcp_server/skill_advisor/lib/scorer` |
| Documentation | Spec folder validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `103/001-deep-review-three-tier-setup` | Predecessor | Existing | Establishes three-tier noninteractive contract |
| `103/002-auto-mode-contract-generalization-to-all-commands` | Predecessor | Existing | Generalizes the contract vocabulary |
| Cancelled `027/005` | Source scope | Existing | Supplies original renderer wording proposal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Mandate wording appears in low-confidence output, render cap breaks, or tests reveal scorer coupling.
- **Procedure**: Revert `render.ts` and render-test edits for this packet; leave 027/005 cancelled because ownership remains under 103.
<!-- /ANCHOR:rollback -->
