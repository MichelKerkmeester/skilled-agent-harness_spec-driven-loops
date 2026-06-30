---
title: "Implementation Plan: sk-prompt design-tool usecases"
description: "Plan for assessing sk-prompt against the mcp-magicpath and mcp-open-design design-generation usecases and, since a gap was confirmed, adding a lean design-generation prompt reference plus smart-router wiring inside the skill's existing architecture."
trigger_phrases:
  - "sk-prompt design tool plan"
  - "design generation prompt reference plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/006-sk-prompt-design-tool-usecases"
    last_updated_at: "2026-06-14T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan reflects the executed assess-then-improve approach"
    next_safe_action: "Orchestrator registers the 006 child in the 150 parent"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/references/design_generation_patterns.md"
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-006-sk-prompt-design-tool-usecases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-prompt design-tool usecases

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill content (`sk-prompt` reference + SKILL.md router) |
| **Framework** | Spec Kit Level 2 plus sk-doc skill packaging conventions |
| **Storage** | In-skill `references/` doc plus router edits in SKILL.md |
| **Testing** | `package_skill.py --check`, README structure check, spec `validate.sh --strict` |

### Overview
Read `sk-prompt` in full and the three usecase skills (`mcp-magicpath`, `mcp-open-design`, and the shared `claude_design_parity.md`). Decide whether `sk-prompt` already serves design-generation prompting. The verdict was yes for three of four needs, so the plan adds one reference doc and wires it into the router, with no new pipeline and no scoring change. The reference owns the prompt and defers the look, the transport, and the handoff to their owners.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source skills read in full (`sk-prompt`, `mcp-magicpath`, `mcp-open-design`, `claude_design_parity.md`)
- [x] Multi-turn discovery flow grounded in `mcp-open-design` references, not assumed
- [x] Architecture fit decided (reference plus router, mirroring `patterns_evaluation.md`)

### Definition of Done
- [x] Assessment verdict recorded with reasons
- [x] Reference added and wired across all router and doc surfaces
- [x] `package_skill.py --check` PASS and spec `validate.sh --strict` 0 errors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive reference plus router intent. The new reference is a CONDITIONAL resource loaded by a `DESIGN_GEN` intent, exactly how `patterns_evaluation.md` loads for the `FRAMEWORK` intent.

### Key Components
- **`design_generation_patterns.md`**: the grounded anti-default brief, the seed-of-thought variation technique, the discovery-form pre-answer, the handoff pointer, and the guardrails.
- **SKILL.md router**: `DESIGN_GEN` entry in `INTENT_MODEL` and `RESOURCE_MAP`, plus resource-domain, loading-level, and reference-list rows.

### Data Flow
Design-generation request to router intent scoring to `DESIGN_GEN` to load `design_generation_patterns.md` plus `patterns_evaluation.md`, then base-framework selection (COSTAR, CRISPE, CRAFT) inside the existing DEPTH pass and CLEAR scoring.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt/references/design_generation_patterns.md` | New design-generation reference | created | `package_skill.py --check` PASS |
| `.opencode/skills/sk-prompt/SKILL.md` | Skill router and rules | router wiring + version | router rows present and consistent |
| `.opencode/skills/sk-prompt/README.md` | Skill overview | RELATED DOCUMENTS row | README structure check 0 issues |
| `.opencode/skills/sk-prompt/changelog/v2.2.0.0.md` | Changelog | created | matches the version bump |
| `.opencode/skills/sk-design-interface/` | Look and parity protocol | unchanged (read-only) | no diff in skill dir |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `sk-prompt` (SKILL.md, depth_framework.md, patterns_evaluation.md, README)
- [x] Read `mcp-magicpath`, `mcp-open-design`, and `claude_design_parity.md`
- [x] Ground the multi-turn discovery flow in the `mcp-open-design` references
- [x] Baseline `package_skill.py --check` to capture the starting state

### Phase 2: Implementation
- [x] Author `references/design_generation_patterns.md`
- [x] Wire the `DESIGN_GEN` intent and resource map into SKILL.md
- [x] Update resource domains, loading levels, §5 and §9 references, README, version, changelog

### Phase 3: Verification
- [x] `package_skill.py --check` PASS
- [x] README structure check 0 issues
- [x] `validate.sh --strict` on this packet 0 errors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill structure | `sk-prompt` package integrity | `package_skill.py --check` |
| README structure | README template conformance | `validate_document.py --type readme` |
| Spec validation | This packet's doc set | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `package_skill.py` | Internal | Green | Cannot gate skill structure |
| `claude_design_parity.md` | Internal (read-only) | Green | Lose the handoff and guardrail source |
| `validate.sh` | Internal | Green | Cannot gate the packet docs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The addition proves unwanted or a check fails that cannot be resolved.
- **Procedure**: Delete `references/design_generation_patterns.md` and `changelog/v2.2.0.0.md`, revert the SKILL.md router and version edits and the README row. The change is additive and isolated to `sk-prompt`, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|------------|-----|
| Phase 1: Setup | none | Reading the source skills is the entry point |
| Phase 2: Implementation | Phase 1 | The verdict and the reference depend on the read |
| Phase 3: Verification | Phase 2 | The checks gate the authored content |

The phases are strictly sequential. Within Phase 1 the three skill reads are parallelizable.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Notes |
|-------|----------|-------|
| Phase 1: Setup | Small | Read four skills and ground the discovery flow |
| Phase 2: Implementation | Small | One reference plus consistent router rows |
| Phase 3: Verification | Small | Three checks, iterate to clean |

Total footprint is roughly 200 changed or new lines across the reference, router, README, and changelog.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Trigger | Detection | Action |
|---------|-----------|--------|
| `package_skill.py --check` regresses | Check reports a new error | Revert the offending SKILL.md or reference edit, re-run |
| README check regresses | `validate_document.py` reports an issue | Revert the README §9 row |
| Addition judged unwanted | Operator review | Remove the reference, changelog, router rows, README row, version bump |

Every step is a local revert inside `sk-prompt`. No external state, migration, or shared schema is involved, so there is no data to restore.
<!-- /ANCHOR:enhanced-rollback -->
