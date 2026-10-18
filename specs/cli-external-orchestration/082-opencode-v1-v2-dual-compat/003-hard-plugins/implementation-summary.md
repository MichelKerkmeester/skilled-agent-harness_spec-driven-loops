---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "hard plugins implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins"
    last_updated_at: "2026-10-18T12:45:03Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hard-plugins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-hard-plugins |
| **Status** | Planned |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not started. This phase has not run, so it has changed no tracked file and recorded no verdict. Once it runs, the five hard plugins load on both OpenCode versions, each with a v2 leg that a test proves, and the `sk-vision` bundle is rebuilt from its source or recorded as blocked.

### Phase 3: hard-plugins

Not started. The phase will port `system-completion-sentinel`, `system-spec-gate`, `system-skill-advisor`, `opencode-goal` and `sk-vision`. It will move the seams out of the default exports, and it will update the tests that call those exports. Its file list is in `spec.md` section 3.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/system-completion-sentinel.js`, `system-spec-gate.js`, `system-skill-advisor.js`, `opencode-goal.js` | Not started | Each default export becomes `{ id, setup, server }`, with a v2 leg. |
| `.opencode/plugins/lib/completion-sentinel-core.js`, `opencode-goal-core.js` and, if T003 keeps the seam, `system-spec-gate-core.js` | Not started | Core modules that hold the seams moved out of the default exports. |
| `.opencode/plugins/tests/v2-hard-plugins.test.cjs` | Not started | Five registration cases, and behaviour cases for the sentinel, the spec gate, the goal queue and the skill advisor. |
| The existing tests for these five plugins | Not started | Calls move to `.server`, and the seam readers point at the core modules. |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` and the `src/opencode/` command module | Not started | The command registers through `ctx.command.transform` on v2. |
| `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js` | Not started | Rebuilt bundle. The folder `dist/` is gitignored. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not started. The verification plan is in `tasks.md`, and the closure gate is `acceptance-criteria.md`. The v2 behaviour cases run first against the unported tree, so each one must fail before its port. The orchestrator then reruns every check from the final state, and a DeepSeek review runs before closure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Not started | The decisions for this phase sit in `goal.md` and in the open questions of `spec.md`. The four orchestrator decisions are recorded in task T003. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict validation of this folder with `validate.sh --strict` | Not started |
| v2 behaviour cases, failing before the port and passing after it (T008, T017) | Not started |
| Plugin suite at or above the phase 2 floor (T018) | Not started |
| v1 load capture and v2 active list (T019, T020) | Not started |
| `sk-vision` build and load capture, or blocker (T015, T016) | Not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** No port has run, so every file and every check stays open until the tasks in `tasks.md` run.
2. **Phase 1 verdicts.** The sentinel depends on Q5, the skill advisor depends on Q6 and `sk-vision` depends on Q11 and its build. A verdict that phase 1 leaves unknown closes that work as blocked, and the implementation summary names it.
3. **Research class of the skill advisor.** Research marks `system-skill-advisor` as mechanical. This phase follows the brief unless task T003 records a different decision.
<!-- /ANCHOR:limitations -->

---

