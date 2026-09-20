---
title: "Feature Specification: Add the Cline provider to the cli-pi skill roster (xhigh-only)"
description: "Document cline-pass DeepSeek V4 Flash in the cli-pi skill's provider roster (references/providers-and-models.md §2), dispatched only at --thinking xhigh (no lower tiers), completing parity with the cli-opencode roster entry."
trigger_phrases:
  - "cline in cli-pi roster"
  - "cli-pi providers-and-models cline-pass"
  - "add cline to cli pi skill"
  - "cline-pass xhigh only pi roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/004-cline-cli-pi-roster"
    last_updated_at: "2026-08-18T14:15:43Z"
    last_updated_by: "claude"
    recent_action: "Added cline-pass section to the cli-pi roster, xhigh-only"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add the Cline provider to the cli-pi skill roster (xhigh-only)

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-cline-pi-config-build |
| **Successor** | 005-cline-pro-and-pi-default (adds the Pro model and the pi cline default) |
| **Handoff Criteria** | cli-pi roster shows the `### cline-pass` section, xhigh-only; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Cline Provider Roster specification — documenting the config-wired provider in the cli-pi mode's own catalog.

**Scope Boundary**: one roster section in the cli-pi skill. No pi runtime config change (that was Phase 3), no code.

**Dependencies**:
- Phase 3 (`cline-pass` wired into `.pi`), which made the provider real in pi and confirmed the model id and xhigh-only tier behavior.

**Deliverables**:
- A `### cline-pass` section in `cli-pi/references/providers-and-models.md` §2.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 3 made `cline-pass/deepseek-v4-flash` a live pi provider, but the cli-pi skill's provider roster (`references/providers-and-models.md`) still listed only the six prior providers. A dispatcher reading the cli-pi catalog to pick a model had no Cline entry, so the config-wired provider was undiscoverable from the mode's own docs — the reverse of Phase 1, which documented Cline in cli-opencode.

### Purpose
Add a `### cline-pass` roster section to the cli-pi mode so the provider is documented where dispatchers look, with the correct dispatch form (`--provider cline-pass --model cline-pass/deepseek-v4-flash`) and the policy that it runs **only at `--thinking xhigh`** — lower thinking tiers are not supported for this entry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `### cline-pass` section under §2 PROVIDERS & MODELS in `cli-pi/references/providers-and-models.md`: provider description, config-only note, dispatch form, the xhigh-only policy, and a model row.

### Out of Scope
- Any `.pi` runtime config change (owned by Phase 3).
- A cli-pi SKILL.md keyword or cli-reference.md login-menu edit — unlike cli-opencode, cli-pi concentrates its roster in `providers-and-models.md` and both other docs already point to it as source of truth.
- Cline's non-Flash models.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Add `### cline-pass` section, xhigh-only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Roster documents cline-pass | `providers-and-models.md` has a `### cline-pass` section with the `cline-pass/deepseek-v4-flash` model row |
| REQ-002 | xhigh-only policy stated | The section states dispatch is only at `--thinking xhigh`; lower tiers not supported |
| REQ-003 | Correct dispatch form | The section shows `--provider cline-pass --model cline-pass/deepseek-v4-flash` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cross-link to setup | The section links to `.pi/custom-providers.md` for config/removal |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg '### cline-pass' cli-pi/references/providers-and-models.md` matches.
- **SC-002**: The section names `--thinking xhigh` as the only supported tier (no `max`, no lower tiers).
- **SC-003**: `validate.sh --strict` on this phase exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Roster drifts from the live `.pi` config | Docs mislead a dispatcher | Model id and tier mirror the Phase 3 config and live `pi --list-models`; cross-linked to `.pi/custom-providers.md` |
| Dependency | Phase 3 config | Docs describe a real provider | Phase 3 Complete; `pi --list-models` shows the row |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The dispatch form and tier match the Phase 3 config and the live pi roster.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Predecessor (config)**: `../003-cline-pi-config-build/implementation-summary.md`
- **Parent Spec**: `../spec.md`
