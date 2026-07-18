---
title: "Implementation Summary: Prompt Command Canon Refactor"
description: "The /prompt:improve command went from a 28KB monolith to a thin create-command router with a Phase 0 dispatch-context check and an auto/confirm/presentation asset triad, with every behavior preserved and the command index fixed."
trigger_phrases:
  - "prompt command summary"
  - "canon refactor summary"
  - "router triad summary"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/009-prompt-command-canon-refactor"
    last_updated_at: "2026-07-18T06:21:04.143Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Refactored /prompt:improve into the create-command canon and validated it"
    next_safe_action: "Refresh packet metadata, strict-validate, then commit and FF-push"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-prompt-command-canon-refactor |
| **Completed** | 2026-07-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/prompt:improve` is now a thin create-command router instead of a 28KB monolith. The command that fronts the sk-prompt engine reads like every other first-class router: it verifies its dispatch context, binds the required inputs, then hands off to owned assets. Display wording, workflow steps, and routing no longer sit fused in one file, so any one of them can change without touching the others.

### Router with a Phase 0 dispatch-context check
`improve.md` carries the six canonical sections plus a `PHASE 0: DISPATCH-CONTEXT CHECK` and a `MANDATORY INPUT GATE` under section 1, matching the deep-command pattern. The gate binds `prompt_input` (never inferred), `enhancement_mode`, `save_choice`, `execution_mode`, and `dispatch_mode` before any YAML loads.

### Presentation and workflow assets
The consolidated Q0-Q4 setup prompt, the interactive framework and simplification templates, the error-recovery table, the transparency report, and the result and status displays moved verbatim into `prompt_improve_presentation.txt`. The DEPTH pipeline, CLEAR scoring, inline-vs-`@prompt-improver` dispatch, and the spec-folder save flow moved into `prompt_improve_auto.yaml` (autonomous) and `prompt_improve_confirm.yaml` (paused at Discover, Prototype, and Test).

### Command index corrected
The operator's rename left the commands README pointing at a root `prompt-improve.md` that no longer exists. The index now lists a `prompt` command group, invokes the command as `/prompt:improve`, and its link resolves.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/commands/prompt/improve.md | Modified | Monolith to thin canon router with Phase 0 + input gate |
| .opencode/commands/prompt/assets/prompt_improve_presentation.txt | Created | Display source of truth |
| .opencode/commands/prompt/assets/prompt_improve_auto.yaml | Created | Autonomous workflow |
| .opencode/commands/prompt/assets/prompt_improve_confirm.yaml | Created | Interactive workflow with checkpoints |
| .opencode/commands/README.txt | Modified | Recategorized into the prompt group; fixed the broken link |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The refactor mirrored the create-command router template and `speckit/plan.md`, and adopted the deep-command Phase 0 pattern from `deep/command-benchmark.md`. Each monolith capability was mapped to a router section or an asset before the inline content was removed, so nothing was dropped. The router was validated with `validate_document.py --type command`, and the command index was grepped clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put Phase 0 and the input gate in the router, not the YAML | Matches the deep-command canon: the router owns dispatch-context verification and input binding; the YAML owns execution only |
| Replace the monolith's @general-agent verification with a dispatch-context check | The dispatch-context check is the current canon for "was this invoked correctly," which is what the old agent gate approximated |
| Add `Task` to `allowed-tools` | The workflow dispatches `@prompt-improver`; the monolith documented that path without granting the tool |
| Fix the commands README in the same phase | The operator's rename broke a link and mis-categorized the command; the index must match the shipped reality |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type command`, prompt/improve.md | PASS, valid=True, 0 errors, 0 warnings |
| Stale references, `rg /prompt-improve` over .opencode/commands | PASS, none remain; README link resolves to prompt/improve.md |
| Behavior-preservation map | PASS, every monolith capability present across router + assets |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The command is not yet registered in a machine-readable command contract.** No repo-level `command_contract.json` registers the `prompt` family, so the contract-drift generator does not yet gate this router. Register it there if a `prompt`-family contract is later adopted.
<!-- /ANCHOR:limitations -->
