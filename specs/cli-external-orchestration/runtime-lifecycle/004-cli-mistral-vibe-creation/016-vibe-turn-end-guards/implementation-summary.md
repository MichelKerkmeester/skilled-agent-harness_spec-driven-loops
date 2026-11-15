---
title: "Implementation Summary"
description: "Built the one Vibe post_agent composer with the ask-surface reprompt and the completion advisory parts, a turn-start delivery part for the advisory, the fixture tests and the registration. T017 stays blocked: it needs an operator at an interactive TUI."
trigger_phrases:
  - "vibe turn end guards implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/016-vibe-turn-end-guards"
    last_updated_at: "2026-11-14T23:45:00Z"
    last_updated_by: "code-worker"
    recent_action: "Built the turn-end composer and its parts"
    next_safe_action: "Run T017 with an operator"
    blockers:
      - "T017: an interactive Vibe TUI session needs an operator, and a print-mode run has no question tool"
    key_files:
      - ".skilled/hooks/session-lifecycle/vibe/turn-end.mjs"
      - ".skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs"
      - ".skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs"
      - ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "The reply is on disk at post_agent time as a completion record; the reader's lastAssistantText prefers it"
      - "turn_id is stable across a post_agent retry, so the once-per-turn marker keys on it"
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
| **Spec Folder** | 016-vibe-turn-end-guards |
| **Completed** | 2026-11-14 (code complete; T017 blocked) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A main Vibe turn now ends through one `post_agent` entry. The completion part records an advisory for the next turn, then the ask-surface part sends a prose option menu back once with the reprompt that names Vibe's question tool. The next turn's `pre_agent` composer delivers the advisory and deletes it, so the model sees it exactly once.

### Phase 16: vibe-turn-end-guards

- **Ask-surface part.** `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` reads the finished turn through the phase 014 journal reader, passes `surfaceAvailable: false` for a dispatched child, a subagent and a session whose recorded tool catalog never names `ask_user_question`, and marks the turn with `markTurn` under the reader's stable `turnId`. A fire records one `"runtime":"vibe"` line in the ask-surface log and returns `{decision:'deny',reason:repromptFor('vibe')}`.
- **Completion part.** `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` reads the reply the same way, runs `evaluateCompletionEvidence` against `VIBE_SPEC_FOLDER` from the checkout root, logs the advisory and writes `.skilled/skills/.state/completion-sentinel/vibe-pending-advisory.txt` under the session's project root. It returns `{advisory}` and never a deny.
- **Composer.** `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` runs the completion part first, then the ask-surface part, and prints at most one `{"decision":"deny","reason":"..."}`. Malformed stdin, a missing journal and a throwing part all exit 0 with no output.
- **Advisory delivery.** `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` gained a first part that reads the pending file, deletes it and adds `[completion-evidence] <detail>` to `additional_context`. `SYSTEM_COMPLETION_DISABLED` turns it off.
- **Question-tool row.** `ask-surface-core.cjs` now maps `vibe` to `ask_user_question`, so the reprompt names the right tool.
- **Registration and docs.** `.vibe/hooks.toml` carries one `post_agent` entry (`match = "main"`, `timeout = 20.0`); the completion and session-lifecycle READMEs carry the Vibe row. The operator procedure and the phase facts are in `scratch/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` | Modified | `vibe: ['ask_user_question']` in `QUESTION_TOOLS` |
| `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | Created | Ask-surface part over the 014 journal reader |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | Created | Completion part, advisory log and pending file |
| `.skilled/hooks/completion/vibe/completion-evidence-post-agent.cjs` | Created (symlink) | Symlink to the real adapter |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | Created | The one registered `post_agent` composer |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Modified | Pending-advisory delivery part |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs` | Created | Ten fixture cases over copied 014 journals |
| `.vibe/hooks.toml` | Modified | One `post_agent` entry, `match = "main"` |
| `.skilled/hooks/completion/README.md` | Modified | Vibe row, tree line and key file |
| `.skilled/hooks/session-lifecycle/vibe/README.md` | Modified | Turn-end composer and advisory part |
| `scratch/post-agent-facts.md` | Created | The three journal facts this phase consumes |
| `scratch/turn-end-retry/procedure.md` | Created | The operator TUI procedure for T017 |
| `scratch/turn-end-retry/print-mode-smoke.md` | Created | The print-mode run that proves the entry loads and accepts |
| `description.json`, `graph-metadata.json` | Modified (generated) | Re-derived after the spec docs changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each part was written against the record shapes the 014 reader exposes, then driven end to end through the real hook entry points. The tests copy phase 014's recorded `post_agent` journal into a temp session root, rewrite only the reply text and, per case, the tool catalog, and spawn the composer with an isolated `TMPDIR` and project root. That keeps every case dependent on a journal Vibe actually wrote and keeps the marker, fire and pending state out of the checkout.

The completion part locates the checkout from its own file, so a scratch-cwd session still evaluates `VIBE_SPEC_FOLDER` against the real packet, while the pending advisory stays under the session's project root for the next `pre_agent` turn to consume.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One composer, completion part first | Vibe skips every later `post_agent` hook after a deny, so two entries would race the three-retry budget; the advisory must be written even when the reprompt denies |
| `markTurn` keyed on the reader's `turnId` | A deny injects a new user message but keeps `turn_id`, so a user-message key would fire the reprompt on every retry |
| The catalog check reads `tool_catalog.tools` from the journal | Vibe's `post_agent` payload has no tool list, and a headless catalog never names `ask_user_question`; a `keep` entry carries no tools and passes |
| The pending advisory lives under the session's project root | A scratch run's own next turn reads it there, and no two sessions can deliver each other's advisory |
| The completion part returns `{advisory}` with no `decision` field | The only deny path stays the ask-surface part, which makes "never denies" structural rather than a convention |
| The turn-start part deletes before it delivers | A file that cannot be removed would ride every later turn, so the advisory is dropped rather than repeated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 facts | `rg -c 'on disk\|turn key\|tool name' scratch/post-agent-facts.md` printed `3` |
| T002 reader | `node --check .skilled/hooks/shared/session-readers/vibe.mjs` exited 0; `rg -c 'turnId'` printed `6` |
| T003 turn-start exists | `node --check .skilled/hooks/session-lifecycle/vibe/turn-start.mjs` exited 0 |
| T004 question-tool row | `node -e "...repromptFor('vibe')"` printed `[ask-surface] ... through the \`ask_user_question\` tool instead: ...` |
| T005 ask-surface syntax | `node --check .skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` exited 0 |
| T006 completion syntax | `node --check .skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` exited 0 |
| T007 symlink | `readlink` printed `../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` |
| T008 malformed stdin | `printf 'not json' \| node .skilled/hooks/session-lifecycle/vibe/turn-end.mjs` printed only `exit=0` |
| T009 turn-start syntax | `node --check .skilled/hooks/session-lifecycle/vibe/turn-start.mjs` exited 0 |
| T010 fixture suite | `node --test .skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs` printed `ℹ tests 10` / `ℹ pass 10` / `ℹ fail 0` |
| T011 registration | `rg -c 'type = "post_agent"' .vibe/hooks.toml` printed `1` |
| T012 completion README | `rg -c 'completion-evidence-post-agent' .skilled/hooks/completion/README.md` printed `3` |
| T013 lifecycle README | `rg -c 'turn-end.mjs' .skilled/hooks/session-lifecycle/vibe/README.md` printed `3` |
| T014 rerun | `node --test .skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs` printed `ℹ tests 10` / `ℹ pass 10` / `ℹ fail 0` |
| T015 ask-surface core | `node --test .skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs` printed `ℹ tests 20` / `ℹ pass 20` / `ℹ fail 0` |
| T016 renderer | `node --test .vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` printed `ℹ tests 4` / `ℹ pass 4` / `ℹ fail 0` |
| T017 operator run | Blocked: an interactive TUI session needs an operator; a print-mode run has no question tool. Procedure is in `scratch/turn-end-retry/procedure.md` |
| T017 smoke run | Print-mode `vibe` exited 0 (`OK`); the journal's `post_agent_turn` intent names `user:turn-end` and returns `{"type":"accept"}` (`scratch/turn-end-retry/print-mode-smoke.md`) |
| T018 strict validation | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` printed `RESULT: PASSED` |
| Turn-start regression | `node --test .skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs` printed `ℹ tests 6` / `ℹ pass 6` / `ℹ fail 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T017 is blocked.** The live retry needs an operator at Vibe's TUI. A print-mode run never lists `ask_user_question`, so the ask-surface part passes it by design; the print-mode smoke run proves the entry loads and accepts but cannot show the retry. The fixture suite proves the decision on a recorded journal; the live run is the remaining proof.
2. **The tool-catalog check depends on the first catalog record.** A journal whose only catalog entries are `type: "keep"` cannot prove the question tool exists, so the part passes rather than reprompting. That is the safe direction, and phase 018's journal work can widen it if the format needs it.
3. **The completion advisory is per project root.** A session that changes its working directory between turns writes the pending file where the turn ended, and the next turn only reads it from its own `cwd`.
4. **The retry cap is shared.** Vibe caps retries at three per turn across every `post_agent` hook; one composer and one deny per turn keeps the ask-surface part well under it.
<!-- /ANCHOR:limitations -->

---
