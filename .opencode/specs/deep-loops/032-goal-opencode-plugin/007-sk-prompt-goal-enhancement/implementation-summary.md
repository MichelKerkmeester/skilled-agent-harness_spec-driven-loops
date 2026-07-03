---
title: "Implementation Summary: sk-prompt goal enhancement"
description: "The /goal plugin now turns raw user input into a deterministic sk-prompt-style goal prompt before injecting it into session context."
trigger_phrases:
  - "goal prompt implementation summary"
  - "sk-prompt goal enhancement"
  - "goalPrompt"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement"
    last_updated_at: "2026-06-30T16:45:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Implemented deterministic sk-prompt goal prompt generation"
    next_safe_action: "Phase complete; restart OpenCode before relying on the updated plugin in a new session"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:00969fd8cf81825d65413f56a26752d28aa33cbfc07a80ac9482bdacbb7a6e36"
      session_id: "goal-sk-prompt-enhancement-20260630"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use deterministic sk-prompt methodology inside the plugin rather than an LLM call"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-sk-prompt-goal-enhancement |
| **Completed** | 2026-06-30 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/goal set` now improves raw user input into a structured goal prompt before the plugin injects it into OpenCode system context. The stored state keeps both the original sanitized `objective` and the enhanced `goalPrompt`, so status output remains auditable while the model receives a more precise execution brief.

### Deterministic sk-prompt Generator

The plugin now derives a `goalPrompt` locally using sk-prompt concepts: DEPTH methodology, CRAFT/TIDD-EC framework metadata, RICCE-style structure, and CLEAR scoring. The generator adds role, objective, context, method, success criteria and stop conditions without making a hidden model call.

### Prompt Metadata And Compatibility

Goal records now include `promptEnhancement` metadata with version, methodology, framework, perspectives, CLEAR score, character count and max-character budget. Older records that lack `goalPrompt` are normalized on read by deriving a prompt from the stored objective.

### Enhanced Injection

`renderGoalInjection` now injects the enhanced prompt under `goal_prompt:` while preserving a short raw `objective:` preview. The renderer keeps the existing active-goal fence, verifier line, usage line and directive, and it still clamps the whole injection path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-goal.js` | Modified | Adds deterministic prompt generation, metadata normalization, enhanced injection and status fields. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modified | Pins goal prompt generation, metadata, length cap, injection parity and adversarial sanitization. |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modified | Verifies tool-context set/show paths persist and expose the enhanced prompt. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md` | Modified | Adds concrete phase 7 scope and handoff criteria. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/` | Created | Holds this phase's spec, plan, tasks and implementation summary. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change stays inside the plugin tool path, so `.opencode/commands/goal_opencode.md` remains a thin one-tool router and no runtime dependency or hidden LLM call was added.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision                                              | Why                                                                                                                                           |
| -------------------------------------------------------| -----------------------------------------------------------------------------------------------------------------------------------------------|
| Use deterministic prompt generation in `mk-goal.js`   | OpenCode skills are context resources, not a stable plugin API. Local generation avoids latency, recursion and nondeterministic state writes. |
| Preserve raw `objective` separately from `goalPrompt` | Status output and old tests can still inspect the user's original goal while injection uses the improved prompt.                              |
| Backfill missing `goalPrompt` on read                 | Existing state files remain readable without migration scripts.                                                                               |
| Keep `/goal` command unchanged                        | The command contract already requires exactly one plugin tool call; duplicating prompt logic there would split state ownership.               |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .opencode/plugins/tests/mk-goal-state.test.cjs` | PASS |
| `node .opencode/plugins/tests/mk-goal-tool-path.test.cjs` | PASS |
| `node .opencode/plugins/tests/mk-goal-export-contract.test.cjs` | PASS |
| `node .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | PASS |
| `node .opencode/plugins/tests/mk-goal-supervisor.test.cjs` | PASS |
| `node .opencode/plugins/tests/mk-goal-continuation.test.cjs` | PASS |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins` | PASS: 11 files scanned, 0 findings |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/plugins/mk-goal.js` | PASS |
| `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/plugins/mk-goal.js` | FAIL: script has Python shebang despite `.sh` name; rerun with `python3` passed |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/032-goal-opencode-plugin --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Prompt enhancement is deterministic, not model-generated.** This keeps `/goal set` reliable and local, but it cannot infer project-specific implementation details beyond the raw objective and current session context available to the model after injection.
2. **Default injection is larger than before.** The enhanced prompt remains capped and clamped, but active goal context now uses more tokens by design.
3. **Running OpenCode sessions keep loaded plugin code.** Restart OpenCode before relying on this updated plugin in a new session.
<!-- /ANCHOR:limitations -->
