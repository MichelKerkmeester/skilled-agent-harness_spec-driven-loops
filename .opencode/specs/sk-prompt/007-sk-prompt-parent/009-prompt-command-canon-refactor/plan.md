---
title: "Implementation Plan: Prompt Command Canon Refactor"
description: "Split the /prompt:improve monolith into a thin canon router (Phase 0 dispatch-context check plus input gate) and an auto/confirm/presentation asset triad, preserving every behavior and fixing the command index."
trigger_phrases:
  - "prompt command plan"
  - "router asset split plan"
  - "canon command refactor plan"
  - "presentation triad plan"
  - "phase 0 dispatch context"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/009-prompt-command-canon-refactor"
    last_updated_at: "2026-07-18T06:21:04.143Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the implementation plan for the /prompt:improve refactor"
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
# Implementation Plan: Prompt Command Canon Refactor

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command router + YAML workflow assets |
| **Framework** | sk-doc create-command canon |
| **Storage** | None |
| **Testing** | `validate_document.py --type command` + `validate.sh --strict` |

### Overview
Move the monolith's inline workflow into an `_auto.yaml` / `_confirm.yaml` pair and its inline display into a `_presentation.txt`, leaving `improve.md` as a thin router that owns only the Phase 0 dispatch-context check, the blocking input gate, mode routing, and execution-target selection. The router mirrors the canonical six-section shape and the deep-command Phase 0 pattern.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The create-command router template, contract, and presentation template are read.
- [x] A reference router (`speckit/plan.md`) and the deep-command Phase 0 pattern are confirmed.
- [x] Every monolith capability is enumerated for a behavior-preserving split.

### Definition of Done
- [x] Router validates as `--type command` with 0 errors / 0 warnings.
- [x] Command index corrected; no stale references remain.
- [x] Docs updated (spec/plan/tasks/implementation-summary).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Router / presentation / workflow split (create-command canon, mode-pair topology).

### Key Components
- **Router** (`improve.md`): Phase 0 dispatch-context check, mandatory input gate, mode routing, execution targets.
- **Presentation asset**: the consolidated prompt, interactive templates, transparency report, results, next-step.
- **Workflow YAML pair**: the DEPTH pipeline, CLEAR scoring, dispatch, and save flow — autonomous vs paused.

### Data Flow
Router verifies context and binds inputs -> loads the presentation contract -> loads the selected workflow YAML -> YAML executes with bound inputs and renders through the presentation asset.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `prompt/improve.md` | The command entrypoint | update (monolith to router) | `validate_document.py --type command` |
| `prompt/assets/*` | New owned assets | create | Presence + router OWNED ASSETS table |
| `commands/README.txt` | Command index | update | grep shows no stale `/prompt-improve`; link resolves |
| `sk-prompt/prompt-improve` packet | Skill the command dispatches | unchanged | Referenced by path in the workflow YAML |

Required inventories:
- Monolith capability map: modes, dispatch, DEPTH pipeline, CLEAR scoring, save options, status contract.
- Stale references: `rg -n '/prompt-improve|prompt-improve\.md' .opencode/commands`.
- Matrix axes: execution mode (auto/confirm) x enhancement mode x dispatch (inline/agent).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the create-command canon and a reference router.
- [x] Enumerate the monolith's capabilities for a behavior-preserving split.

### Phase 2: Core Implementation
- [x] Rewrite `improve.md` as a thin router with Phase 0 + input gate.
- [x] Author the presentation, auto, and confirm assets.
- [x] Correct the commands README index.

### Phase 3: Verification
- [x] Validate the router as `--type command`.
- [x] Confirm no stale references remain and the link resolves.
- [x] Documentation updated.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Router canon conformance | `validate_document.py --type command` |
| Reference | No stale command references | `rg` over `.opencode/commands` |
| Manual | Behavior-preservation map | Read of monolith vs router + assets |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| create-command canon templates | Internal | Green | Router shape would drift from canon |
| Shared working tree with a concurrent session | Internal | Green | Pathspec-scoped edits avoid collision |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The router fails command validation or a behavior is found missing after the split.
- **Procedure**: `git checkout -- .opencode/commands/prompt/improve.md` restores the monolith; re-map the missing capability before retrying.
<!-- /ANCHOR:rollback -->
