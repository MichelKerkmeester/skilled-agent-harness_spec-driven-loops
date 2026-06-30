---
title: "Feature Specification: sk-prompt-models README"
description: "Rewrite the sk-prompt-models skill README in the narrative voice, leading with the per-model prompt-craft hub and the craft-versus-mechanics split."
trigger_phrases:
  - "sk-prompt-models readme"
  - "sk-prompt-models narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/019-sk-prompt-models-readme"
    last_updated_at: "2026-06-07T14:42:36Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped sk-prompt-models README via deep-context + dual-draft"
    next_safe_action: "Begin phase 020 (sk-prompt README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-019"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Corrected the 'five executors' claim (really cli-devin + cli-opencode + optional cli-claude-code); dropped version; framework map kept as a pattern not a pinned count; minimax-2.7 evidence corrected to historical"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-prompt-models README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 24 |
| **Predecessor** | 018-sk-git-readme |
| **Successor** | 020-sk-prompt-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified; executor count corrected |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19**, the fifth skill in Batch D (sk-*).

**Scope Boundary**: Only `.opencode/skills/sk-prompt-models/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `sk-prompt-models/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-prompt-models README is a tabular reference card with no problem-first entry point, and it carries a stale version line plus a wrong "five executors" claim (the hub dispatches through two active executors, cli-devin and cli-opencode, plus an optional third). It does not lead with the distinctive value: a per-model prompt-craft hub that keeps the framework, scaffold and gotchas for each small model in one place and points at the executor for the mechanics.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the per-model prompt-craft hub, the framework map (RCAF default, TIDD-EC for MiniMax, COSTAR for MiMo) and the four-way ownership split, with the version and the wrong executor count corrected.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `sk-prompt-models/README.md` to the narrative skeleton; correct the executor count and drop the version.

### Out of Scope

- Any change to SKILL.md, the model profiles or the registry. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-models/README.md` | Modify | Narrative-voice rewrite of the per-model prompt-craft hub README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Executor count corrected | Two active executors (cli-devin, cli-opencode) plus an optional third; no "five executors" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Core facts accurate | Four-way ownership split, the framework map as a pattern not a count, the navigation chain; no version; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The framework map, the ownership split and the navigation chain match SKILL.md and model-profiles.json; the executor count is corrected; every cited path (including the two benchmark dirs) resolves.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model repeats the "five executors" claim | Inaccurate README | Authoring prompt pinned two executors plus an optional third; host scanned the draft and found none |
| Risk | Model overstates minimax-2.7 evidence | Inaccurate evidence claim | Host corrected the framework-map cell to mark 2.7 historical and only M3 benchmark-backed |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The framework map, the ownership split and the registry verified during the gather.
<!-- /ANCHOR:questions -->
