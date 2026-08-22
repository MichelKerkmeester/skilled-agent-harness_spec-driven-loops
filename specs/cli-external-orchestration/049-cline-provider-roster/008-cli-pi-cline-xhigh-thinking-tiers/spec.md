---
title: "Feature Specification: Expose xhigh in the pi picker for cline-pass models"
description: "The pi interactive picker capped cline-pass DeepSeek V4 Flash/Pro at high effort because the models had no thinkingLevelMap. Declare the map (high + xhigh) so the picker can reach xhigh, matching opencode's official cline-pass support, and restore the xhigh default."
trigger_phrases:
  - "pi cline picker capped at high"
  - "pi thinkingLevelMap xhigh cline"
  - "cannot tab to xhigh pi cline"
  - "cline-pass xhigh picker fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/008-cli-pi-cline-xhigh-thinking-tiers"
    last_updated_at: "2026-08-22T11:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec for the pi cline-pass xhigh thinkingLevelMap fix"
    next_safe_action: "Commit and push to v4 and main"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".pi/custom-providers.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Expose xhigh in the pi picker for cline-pass models

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-cline-model-dispatch-playbook-scenario |
| **Successor** | none |
| **Handoff Criteria** | `.pi/models.json` cline-pass models declare a `thinkingLevelMap` exposing `xhigh`; both JSON parse; a live `pi --thinking xhigh` cline dispatch completes; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Cline Provider Roster specification — a picker-parity fix that lets pi's interactive TUI reach the `xhigh` tier the CLI already supported.

**Scope Boundary**: add a `thinkingLevelMap` to the two cline-pass models in `.pi/models.json` and restore the global `xhigh` default. No new model, provider, or API-level behavior change.

**Dependencies**:
- Phases 3/5/6 (the cline-pass `.pi` config and slashed-id fix), which declared the models this phase augments.

**Deliverables**:
- A `thinkingLevelMap` exposing `high` + `xhigh` on both cline-pass models, `defaultThinkingLevel` restored to `xhigh`, and the `.pi/custom-providers.md` note explaining why the map is required.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In pi's interactive model picker, the cline-pass DeepSeek V4 Flash (and Pro) effort could not be cycled past `high` — `xhigh` was unreachable — while opencode's official cline-pass support reaches `xhigh`. pi derives a model's *selectable* thinking tiers from its `thinkingLevelMap`; the cline-pass models in `.pi/models.json` declared only `reasoning: true` with no map, so pi fell back to a `high` ceiling. Separately, `defaultThinkingLevel` in `.pi/settings.json` had drifted from `xhigh` to `high`. The `--thinking xhigh` CLI flag always worked; only the picker was capped.

### Purpose
Declare a `thinkingLevelMap` on both cline-pass models that exposes `high` and `xhigh` (Cline has no `max` tier), so pi's picker can select `xhigh` — matching opencode. Restore `defaultThinkingLevel: "xhigh"`. Document the map requirement so it is not dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `thinkingLevelMap` (`{ "high": "high", "xhigh": "xhigh", … }`) to both cline-pass models in `.pi/models.json`.
- Restore `.pi/settings.json` `defaultThinkingLevel` to `xhigh`.
- Note the `thinkingLevelMap` requirement in `.pi/custom-providers.md`.

### Out of Scope
- opencode / cli-opencode (already reaches xhigh via its official catalog).
- Any new model, provider, or the fan-out executor's `--thinking` mapping (unchanged; deep-loop already caps effort at max/xhigh per policy).
- The `enabledModels` ox-alpha entry (a separate, already-shipped roster change).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | `thinkingLevelMap` on both cline-pass models |
| `.pi/settings.json` | Modify | `defaultThinkingLevel` restored to `xhigh` |
| `.pi/custom-providers.md` | Modify | Note the `thinkingLevelMap` picker requirement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Map exposes xhigh | Both cline-pass models in `.pi/models.json` carry a `thinkingLevelMap` with a non-null `xhigh` entry; the file parses |
| REQ-002 | Dispatch unbroken | A live `pi --thinking xhigh --model cline-pass/cline-pass/deepseek-v4-flash` turn completes at exit 0 (no invalid-level error) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Default restored | `.pi/settings.json` `defaultThinkingLevel` is `xhigh` |
| REQ-004 | Requirement documented | `.pi/custom-providers.md` explains that the picker needs the `thinkingLevelMap` to offer `xhigh` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: pi's picker can select `xhigh` for the cline-pass models (operator-confirmed in the TUI after restart).
- **SC-002**: A live `pi --thinking xhigh` cline dispatch completes at exit 0.
- **SC-003**: `validate.sh --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wrong provider level string in the map | Dispatch could 400 on an unknown level | Mirrored the OpenRouter DeepSeek Flash map (`xhigh: "xhigh"`); verified a live `--thinking xhigh` cline turn completes |
| Risk | Map dropped by a future edit | Picker silently caps at high again | Documented the requirement in `.pi/custom-providers.md` |
| Dependency | pi reads `thinkingLevelMap` from `.pi/models.json` on launch | Picker parity | Operator restarts the pi TUI to pick up the config |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The `thinkingLevelMap` field was confirmed against pi's own models-store schema (e.g. the OpenRouter DeepSeek Flash entry exposes `xhigh` the same way), and a live `--thinking xhigh` cline dispatch completes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Predecessor (cline playbook scenario)**: `../007-cline-model-dispatch-playbook-scenario/implementation-summary.md`
- **Parent Spec**: `../spec.md`
