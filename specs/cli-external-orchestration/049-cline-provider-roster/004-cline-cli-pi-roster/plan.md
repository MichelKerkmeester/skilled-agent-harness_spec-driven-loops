---
title: "Implementation Plan: Add the Cline provider to the cli-pi skill roster (xhigh-only)"
description: "Docs-only roster add in the cli-pi mode, mirroring the deepseek policy-line + table pattern; verification by grep + validate.sh."
trigger_phrases:
  - "cline cli-pi roster plan"
  - "cli-pi cline-pass docs plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/004-cline-cli-pi-roster"
    last_updated_at: "2026-08-18T13:43:20Z"
    last_updated_by: "claude"
    recent_action: "Plan authored; roster edit applied"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add the Cline provider to the cli-pi skill roster (xhigh-only)

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (no code) |
| **Framework** | cli-external-orchestration / cli-pi mode |
| **Storage** | None |
| **Testing** | `rg` for the section + `validate.sh --strict`; live `pi --list-models` (Phase 3) as the fact source |

### Overview
Add one provider section to the cli-pi roster, mirroring the existing `### deepseek` policy-line + table shape. Content is anchored to the Phase 3 `.pi` config and the live `pi --list-models` row, with the xhigh-only dispatch policy the operator specified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 3 config live; model id `cline-pass/deepseek-v4-flash` confirmed via `pi --list-models`
- [x] cli-pi roster structure read (§2 provider subsections, §4 thinking lever)
- [x] xhigh-only policy confirmed with the operator (no lower tiers)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..004)
- [x] `### cline-pass` section present in the cli-pi roster
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation roster-add — mirror an existing validated section (the `### deepseek` policy-line + model table), adjusted for the xhigh-only tier.

### Key Components
- **cli-pi/references/providers-and-models.md**: the per-mode source of truth for provider/model/effort facts; SKILL.md and cli-reference.md both point here.

### Data Flow
A dispatcher composing a cli-pi run reads §2 to pick `cline-pass/deepseek-v4-flash`, then dispatches `pi --provider cline-pass --model cline-pass/deepseek-v4-flash --thinking xhigh`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix. One same-class inventory confirmed the roster is the only cli-pi surface that enumerates providers:

- `cli-pi/references/providers-and-models.md` §2 is the provider catalog; the `### cline-pass` section was added there.
- `cli-pi/SKILL.md` and `cli-pi/references/cli-reference.md` both defer to the roster as source of truth (no per-provider list of their own), so no parallel edit is required.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the cli-pi roster §2/§4 structure
- [x] Confirm model id + xhigh-only tier from Phase 3 config and live `pi --list-models`

### Phase 2: Core Implementation
- [x] Add the `### cline-pass` section (description, config note, dispatch form, xhigh-only policy, model row)

### Phase 3: Verification
- [x] Grep confirms the section and the xhigh-only wording
- [x] Cross-link to `.pi/CUSTOM-PROVIDERS.md` resolves
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence | Section present + xhigh-only | `rg` |
| Fact source | Model id + tier are real | `pi --list-models` (Phase 3) |
| Doc validation | Spec-folder conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 `.pi` config | Internal | Green | Docs would describe an unreal provider; Phase 3 Complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The roster section is found inaccurate against a later `pi --list-models`.
- **Procedure**: `git revert` / remove the `### cline-pass` section; it is additive and isolated (no code, no other doc touched).
<!-- /ANCHOR:rollback -->
