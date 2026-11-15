---
title: "Implementation Summary"
description: "A Vibe dispatch bound to a packet now starts with that packet's goal slice, the session context, the startup-guard warnings and the stale-dist warning, through one session_start hook."
trigger_phrases:
  - "vibe context and goal hooks implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks"
    last_updated_at: "2026-11-14T23:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the Vibe session-start goal and context hook"
    next_safe_action: "Phase 012 writes the playbook and docs"
    blockers: []
    key_files:
      - ".skilled/hooks/session-lifecycle/vibe/session-start.mjs"
      - ".skilled/hooks/goal/vibe/goal-inject.mjs"
      - ".vibe/hooks.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A Vibe hook process inherits the dispatch environment"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-vibe-context-and-goal-hooks |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Vibe run started with `VIBE_SPEC_FOLDER` set now sees that packet's goal in its first turn. Asked for the Objective line, a keyed run quoted it exactly.

### Phase 11: vibe-context-and-goal-hooks

`.vibe/hooks.toml` has one `session_start` entry, `session-start`. It runs `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, which composes four parts in a fixed order: the packet's `chat_slice`, the session-prime context, the startup-guard warnings from phase 008's `session-cleanup.mjs`, and the `check-dist-staleness.sh --all` warning. Each part is skipped when it is empty or fails, and the hook always exits 0. The slice comes from `renderVibeGoalSlice` in `.skilled/hooks/goal/vibe/goal-inject.mjs`, which returns exactly what `goal.cjs packet` renders.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/goal/vibe/goal-inject.mjs`, `goal-vibe.test.mjs`, `README.md` | Created | Slice renderer, three-case fixture test, adapter README |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `README.md` | Created | The composing hook and its README |
| `.vibe/hooks.toml` | Modified | `session-start` replaces `session-cleanup-start` as the one `session_start` entry |
| `.vibe/SYNC.md`, `.skilled/hooks/goal/README.md`, `.skilled/hooks/session-lifecycle/README.md` | Modified | Vibe rows and the hook's contract |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs`, `tests/render-home-hooks.test.mjs` | Created (amendment) | Writes the hooks file into a disposable `VIBE_HOME` with absolute paths |
| `fanout-run.cjs`, `fanout-run.vitest.ts`, `cli-mistral-vibe.vitest.ts`, `vibe-shim.cjs` | Modified (amendment) | Lineages get the home hooks and `VIBE_SPEC_FOLDER` |
| cli-mistral-vibe docs, `dispatch-rule-checks.test.mjs`, `.vibe/hooks.toml` header | Modified (amendment) | Dispatch shape with the render step and `AI_SESSION_CHILD=1` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two OpenCode dispatches on `mistral/deepseek-v4-1-flash-1017#max` wrote the code and the docs, each on its own files. The orchestrator edited `hooks.toml`, reviewed the code, ran the test and the keyed first-turn run, and scanned the saved run for key material.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One entry that also runs the startup guards | Phase 008 had already registered a `session_start` entry; D3 asks for one, so the new entry runs `session-cleanup.mjs` as a part and replaces it |
| Dist freshness in the same entry | Phase 008's classification left that warning to this phase |
| Inject at `packet_budget=unknown` | The slice length is the packet's concern, and the hook stays a plain renderer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Syntax | PASS: `node --check` exits 0 on both adapters |
| Fixture test | PASS: `tests 3`, `pass 3`, `fail 0` |
| Registration | PASS: `rg -c 'session_start' .vibe/hooks.toml` prints 1 |
| Keyed first turn | PASS: the reply is the exact Objective line; `export.json` `exit_code` 0; the journal holds the slice in a `vibe.hookContext` block |
| Secret scan of `scratch/` | PASS: the key value appears in no file |
| Operator `~/.vibe` | PASS: no file changed during the run |
| Home hooks renderer | PASS: `tests 2`, `pass 2`, `fail 0` |
| Lineage adapter | PASS: cli-mistral-vibe unit cases 10 passed; Vibe stress file 22 passed, 1 skipped (live probe) |
| Keyed scratch-cwd turn | PASS: `export.json` `0`/`finished` on `deepseek-flash`; `proof.txt` written; reply quotes the Objective line; `pre_tool_call` requests name `user:spec-gate`, `user:env-secret-guard`, `user:dispatch-preflight` and the other guards |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A dispatch must render the home hooks.** Vibe loads `.vibe/hooks.toml` only when the trusted cwd is the checkout, so a scratch-cwd dispatch gets the hooks and the slice only when its caller runs `render-home-hooks.cjs` into the disposable home, as the documented shape does; no dispatch-time rule checks that the step ran. The lineage adapter always renders it.
2. **Not in subagents.** `session_start` fires for a main session only.
3. **No refresh.** Vibe has no idle or compaction event, so the slice is injected once per session.
<!-- /ANCHOR:limitations -->
