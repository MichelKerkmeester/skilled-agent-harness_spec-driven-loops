---
title: "Feature Specification: Prompt Command Canon Refactor"
description: "The /prompt:improve command was a 28KB monolith carrying its whole workflow and every display string inline. This phase refactors it into the create-command canon: a thin router with a Phase 0 dispatch-context check plus an auto/confirm workflow-YAML triad and a presentation asset."
trigger_phrases:
  - "prompt improve command"
  - "create-command canon"
  - "router presentation split"
  - "workflow yaml triad"
  - "prompt command refactor"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/009-prompt-command-canon-refactor"
    last_updated_at: "2026-07-18T06:21:04.143Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the phase spec for the /prompt:improve canon refactor"
    next_safe_action: "Validate the router and workflow assets, then refresh packet metadata"
    blockers: []
    key_files:
      - ".opencode/commands/prompt/improve.md"
      - ".opencode/commands/prompt/assets/prompt_improve_presentation.txt"
      - ".opencode/commands/prompt/assets/prompt_improve_auto.yaml"
      - ".opencode/commands/prompt/assets/prompt_improve_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-009-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Prompt Command Canon Refactor

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-cutover-and-rollout |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The prompt-improvement command was a single 28KB Markdown file that carried its whole workflow, every consolidated-prompt question, all interactive templates, and the result formats inline. That is the pre-canon monolith shape: the router, the workflow, and the presentation were fused, so display wording could not change without editing execution logic and the file could not be validated as a thin router. The operator renamed and moved it from the root `prompt-improve.md` to `prompt/improve.md` (invoked `/prompt:improve`), leaving the command's index references stale and a docs link broken.

### Purpose
Refactor `/prompt:improve` into the create-command canon — a thin router with a Phase 0 dispatch-context check and a blocking input gate, backed by an `_auto.yaml` / `_confirm.yaml` workflow triad and a `_presentation.txt` display asset — with no behavior dropped and the command index corrected.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `prompt/improve.md` as a thin router with the six canonical sections plus a Phase 0 dispatch-context check and a mandatory input gate.
- Author the three owned assets: presentation contract, auto workflow YAML, confirm workflow YAML.
- Correct the stale `/prompt-improve` references and the broken link in the commands README index.

### Out of Scope
- Changing the prompt-engineering behavior (frameworks, DEPTH pipeline, CLEAR scoring, save flow) — those are preserved verbatim, only relocated.
- The `sk-prompt/prompt-improve` skill packet itself, which the command dispatches unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/commands/prompt/improve.md | Modify | Monolith to thin canon router with Phase 0 + input gate |
| .opencode/commands/prompt/assets/prompt_improve_presentation.txt | Create | Display source of truth (prompts, templates, results) |
| .opencode/commands/prompt/assets/prompt_improve_auto.yaml | Create | Autonomous workflow |
| .opencode/commands/prompt/assets/prompt_improve_confirm.yaml | Create | Interactive workflow with checkpoints |
| .opencode/commands/README.txt | Modify | Recategorize the command into the prompt group; fix the broken link |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The router validates as a canon command | `validate_document.py --type command` returns valid with zero errors for `prompt/improve.md` |
| REQ-002 | The router carries a Phase 0 dispatch-context check and a blocking input gate | Both subsections are present under section 1, matching the deep-command pattern |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The workflow-YAML triad owns execution and the presentation asset owns display | The router lists all three under OWNED ASSETS and holds no inline prompts or result templates |
| REQ-004 | No prompt-improvement behavior is dropped | Every monolith capability (modes, dispatch, CLEAR, save, status) is present across the router and assets |
| REQ-005 | The command index reflects the new path and invocation | No `/prompt-improve` or `prompt-improve.md` references remain in the commands README; the link resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `prompt/improve.md` validates as `--type command` with 0 errors and 0 warnings.
- **SC-002**: The command's behavior is preserved: every mode, dispatch path, scoring rule, and save option from the monolith is present in the router or its assets.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Splitting the monolith could silently drop a behavior | Medium | Enumerate every monolith capability and map it to a router section or asset before deleting inline content |
| Risk | A concurrent session shares the working tree | Low | Pathspec-scoped edits and commits limited to the command files, the README, and this phase folder |
| Dependency | create-command canon (router template, contract, presentation template) | None if honored | Router mirrors the canonical six-section shape and the deep-command Phase 0 pattern |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The refactor is verified and the command index is corrected.
<!-- /ANCHOR:questions -->
