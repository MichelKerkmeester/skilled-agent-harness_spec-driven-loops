---
title: "Implementation Plan: Claude Design parity keystone build"
description: "Plan for the lean keystone build: one shared claude_design_parity.md protocol consumed by sk-interface-design and mcp-magicpath, plus minimal SKILL.md and graph-metadata hooks."
trigger_phrases:
  - "claude design parity build plan"
  - "shared design parity protocol plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/007-claude-design-parity-build"
    last_updated_at: "2026-06-14T09:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the keystone build plan"
    next_safe_action: "Operator reviews; commit when ready"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/references/claude_design_parity.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-007-claude-design-parity-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Claude Design parity keystone build

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + JSON graph metadata |
| **Framework** | sk-doc skill structure; cross-skill reference |
| **Storage** | `.opencode/skills/{sk-interface-design,mcp-magicpath}/` |
| **Testing** | `package_skill.py`, `validate.sh --strict` |

### Overview
Implement the keystone as one shared protocol reference both skills point to, plus tiny hooks. The protocol consolidates the hardened 005 + 006 set; the skills stay lean.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 005 hardened + 006 synthesized
- [x] Keystone mechanism corrected to previewImageUrl
- [x] Guardrails (no presets/levers) confirmed

### Definition of Done
- [x] Shared protocol authored; both skills hooked
- [x] `package_skill.py` valid both; SKILL.md under cap
- [x] `validate.sh --strict` green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One canonical shared reference (in `sk-interface-design/references/`, the depends_on target), consumed cross-skill by `mcp-magicpath`. SKILL.md hooks point to it; the heavy content lives once.

### Key Components
- **`claude_design_parity.md`** (NEW): the protocol (intake, reuse/adherence, revision grammar, fidelity check, boundary, handoff, direction gate, guardrails).
- **sk-interface-design hooks**: references + resource-loading + graph-metadata pointer.
- **mcp-magicpath hooks**: resource-loading row + a canvas-side ALWAYS rule.

### Data Flow
Both skills load the protocol when producing/iterating UI; mcp-magicpath executes the canvas-side steps; sk-interface-design owns judgment.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-interface-design/references/claude_design_parity.md` | New | create | present + valid |
| `sk-interface-design/SKILL.md`, `graph-metadata.json` | Existing | hook (pointers) | package_skill, size |
| `mcp-magicpath/SKILL.md` | Existing | hook (resource row + rule) | package_skill |
| `sk-interface-design/references/design_principles.md` | Authority | unchanged | no diff from this build |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm 005-hardened + 006 keystone set; scaffold 007

### Phase 2: Core Implementation
- [x] Author `claude_design_parity.md` (the protocol)
- [x] Hook `sk-interface-design` (references + resource-loading + graph-metadata)
- [x] Hook `mcp-magicpath` (resource row + canvas-side ALWAYS rule)

### Phase 3: Verification
- [x] `package_skill.py` both skills; size check
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill | Both skills valid | `package_skill.py` |
| Size | SKILL.md under cap | `wc -w` |
| Packet | Spec-folder docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../005-...` (hardened) + `../006-...` | Internal | Green (complete) | No spec to build |
| sk-doc validators | Internal | Green | No validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A skill fails validation or the protocol bloats the skills.
- **Procedure**: Revert the skill-dir changes (git); the protocol is additive and removable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends on | Why |
|-------|-----------|-----|
| Phase 2 | 005 hardened + 006 | Implements their combined keystone set |
| Phase 3 | Phase 2 | Validate what was built |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Effort | Notes |
|------|--------|-------|
| Protocol reference | M | The bulk of the content, in one place |
| Skill hooks | S | A few lines each, two skills |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- The protocol is one additive file; removing it + the few hook lines fully reverts.
- `design_principles.md` is untouched by this build, so the skill's authority is unaffected on rollback.
<!-- /ANCHOR:enhanced-rollback -->
