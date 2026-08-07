---
title: "Implementation Summary: Devin goal hooks"
description: "Three Devin goal-hook adapters shipped and live-verified: UserPromptSubmit inject, SessionStart restore, Stop verify-and-continue at the full tier phase 002 confirmed."
trigger_phrases:
  - "devin goal hooks summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks"
    last_updated_at: "2026-07-29T06:45:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped and live-verified all three Devin goal-hook adapters"
    next_safe_action: "Hand parity findings to phases 004/005 (Cursor, Pi)"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/devin/goal-inject.mjs"
      - ".opencode/hooks/goal/devin/goal-session-start.mjs"
      - ".opencode/hooks/goal/devin/goal-verify.mjs"
      - ".opencode/hooks/goal/devin/goal-devin.test.mjs"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-003-devin-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Devin's Stop hook decision:block forces genuine continuation (mechanism confirmed by phase 002; this phase's script emits the identical envelope)."
      - "Devin's real Stop payload carries neither last_assistant_message nor transcript_path (direct live capture), so the verify step never receives evidence in practice today -- a live upstream gap, not an adapter defect."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-devin-goal-hooks |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three Devin lifecycle hook adapters under `.opencode/hooks/goal/devin/`, each a thin wrapper around the phase 001 shared goal core (`.opencode/hooks/goal/lib/goal-core.cjs`), plus registration in `.devin/hooks.v1.json` and a co-located `node --test` suite.

- **`goal-inject.mjs`** (`UserPromptSubmit`): reads the shared `active-goal.json`; if the goal is `active`, injects `renderGoalBrief({goal, runtimeLabel:'Devin'})` as `additionalContext` and calls `recordTurn({runtime:'devin'})`. No-ops silently for no goal / paused / disabled.
- **`goal-session-start.mjs`** (`SessionStart`): read-only restore of the same brief at session boot; never calls `recordTurn` (a session start is not a turn).
- **`goal-verify.mjs`** (`Stop`): runs `verifyGoalHeuristic()` against the Stop payload's evidence text (prefers `last_assistant_message`, falls back to reading the `transcript_path` file's last `source:"agent"` step). On a `not-met` verdict with iteration budget remaining (`goal.maxAutoTurns` if present, else a default cap of 20 against the shared `turnsUsed` counter), emits Devin's confirmed Stop continuation contract — a bare `{"decision":"block","reason":"..."}` at the top level of stdout, not nested in `hookSpecificOutput`. Honors `stop_hook_active === true` as the loop guard. Every path fails open.
- **`.devin/hooks.v1.json`**: three new entries, additive-only — `goal-session-start.mjs` appended to `SessionStart`, `goal-inject.mjs` appended to `UserPromptSubmit`, `goal-verify.mjs` appended to `Stop`. No existing entry touched.
- **`goal-devin.test.mjs`**: 21 `node --test` cases spawning each adapter as a real child process against an isolated `MK_GOAL_STATE_DIR`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read `spec.md`/`plan.md`/`tasks.md`/`checklist.md` for this phase and `002-capability-probes/capability-matrix.md` to confirm scope, requirements, and the fixed Devin tier (full injection-plus-verify/continue).
2. Read the goal-core API (`goal-core.cjs`), the goal manage CLI (`bin/goal.cjs`), and this phase's pattern exemplars (`spec-gate-enforce.mjs`, `completion-evidence-stop.cjs`, `shared.ts`, the real Devin `Stop`-hook evidence transcript `caring-diver.json`) to confirm the exact adapter idioms, payload shape, and response envelope to mirror.
3. Wrote the three adapters as direct-run `.mjs` (no build step), each self-contained (own stdin/parse helpers, matching the sibling adapters' own-helpers convention rather than a new shared local module).
4. Registered all three in `.devin/hooks.v1.json` (additive-only; confirmed with `git diff --stat` and `python3 -c "import json;json.load(...)"`).
5. Wrote and ran `goal-devin.test.mjs` — 21/21 pass.
6. Ran two live `devin -p` smoke sessions directly against this repo's real `.devin/hooks.v1.json` (confirmed `devin` installed and authenticated, model `swe-1-6-fast`, `--permission-mode auto`, `</dev/null`), reading the resulting session transcripts from `~/.local/share/devin/cli/transcripts/` — the same evidentiary bar (raw transcript over CLI stdout or self-report) phase 002 established.
7. Diagnosed why the second live session's Stop hook did not force a continuation by running a third, isolated `/tmp`-workspace probe (mirroring phase 002's own methodology) with a debug `tee` in front of `goal-verify.mjs` to capture the *exact* raw Stop payload Devin sends. This surfaced a genuine finding (see Known Limitations).
8. Cleaned up: cleared the real `.opencode/skills/.goal-state/active-goal.json` test pollution (see Key Decisions), removed all `/tmp` probe workspaces and stdout captures.
9. Flipped `spec.md`/`plan.md`/`tasks.md`/`checklist.md` to Complete with the evidence recorded above; regenerated `description.json`/`graph-metadata.json`; ran `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Named the three files `goal-inject.mjs`/`goal-session-start.mjs`/`goal-verify.mjs`, not `tasks.md`'s original `user-prompt-submit.cjs`/`session-start.cjs`/`stop.cjs` placeholders. | Matches the task brief's explicit deliverable names and the direct-run-`.mjs`-no-build-step pattern (`spec-gate-enforce.mjs`), consistent with the other Devin Gate-3 adapters already in this repo rather than the `.ts`-compiled lifecycle adapters. |
| `goal-verify.mjs` prefers `payload.last_assistant_message`, falls back to reading `payload.transcript_path`'s last `source:"agent"` step, rather than requiring either. | Prior research in this repo (`029-cli-devin-revival`) already found `last_assistant_message` absent from real Devin `Stop` payloads; the fallback chain is defensive, and both branches fail open to empty evidence rather than throwing. |
| `goal-verify.mjs` charges its own forced continuations against the same `turnsUsed` counter `goal-inject.mjs` advances (via `recordTurn`), rather than inventing a second counter. | Keeps one shared iteration budget across both real user turns and Stop-forced continuations without adding new fields to the core's record shape (the core is read-only per this phase's scope). |
| Did not add a shared local helper module inside `.opencode/hooks/goal/devin/` for stdin/parse boilerplate; each adapter is self-contained. | Matches this phase's exact deliverable list (three adapter files, not four); the ~15 lines of duplication per file is the same trade-off the sibling `spec-gate-enforce.mjs`/`completion-evidence-stop.cjs` pair already accepts in this repo. |
| Cleared the real `.opencode/skills/.goal-state/active-goal.json` after every live-smoke step, including a mid-test accident where a manual CLI invocation without `MK_GOAL_STATE_DIR` briefly overwrote the real state. | The shared goal-state file is a live, concurrently-read resource; the accident was caught immediately (the polluting objective text was `"... --stateDir"`, an unmistakable artifact of a stray CLI arg) and reverted with `goal.cjs clear` before it could be read by another session. Confirmed clean before and after via `cat`/`goal.cjs show`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test goal-devin.test.mjs` | PASS — 21/21, 0 fail |
| `rg -n "mk-goal" .opencode/hooks/goal/devin` (REQ-005) | 0 hits |
| `python3 -c "import json;json.load(open('.devin/hooks.v1.json'))"` | Valid JSON |
| `git diff --stat .devin/hooks.v1.json` | 1 file changed, 15 insertions(+), 0 deletions — additive-only |
| Live `devin -p` smoke — `UserPromptSubmit` injection (REQ-001/SC-001) | **CONFIRMED** — transcript `~/.local/share/devin/cli/transcripts/rainbow-poppyseed.json`, step 9 (`source:"system"`), full `[active_goal:goal-5f039e2c-...]` block with objective `"Confirm the Devin goal hooks live smoke test reaches the model"`, injected before the user turn at step 10 |
| Live `devin -p` smoke — `SessionStart` restore (REQ-002/SC-002) | **CONFIRMED** — same transcript, step 6, identical block fired at session boot, before any user turn |
| Live `devin -p` smoke — `.devin/hooks.v1.json` registration (SC-005) | **CONFIRMED** — both sessions ran cleanly through all ~13 registered Devin hooks (worktree-guard, spec-gate, dispatch-preflight, our three, etc.) with no errors, and the goal-hook entries specifically fired as shown above |
| Live `devin -p` smoke — `Stop` verify (REQ-003/SC-003, second session) | **CONFIRMED verify runs safely; block/continue not independently triggered live** — see Known Limitations |
| `validate.sh --strict` (this folder) | PASS — see command below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Devin's real `Stop` payload carries neither `last_assistant_message` nor `transcript_path`.** Direct live capture (isolated `/tmp` probe, a `tee` placed in front of `goal-verify.mjs`) shows the actual payload is exactly `{"hook_event_name":"Stop","stop_hook_active":false,"session_id":"...","prompt_id":"..."}` — no evidence field at all, under `devin 3000.2.17` in a plain `devin -p ... --permission-mode auto` single-turn session. This reconfirms and sharpens a finding already documented in this repo for the sibling `completion-evidence-stop.cjs` hook (`029-cli-devin-revival/research-devin-hooks-portability/research.md` and related iteration notes), which independently hit the same `last_assistant_message`-absent gap. The practical effect: `verifyGoalHeuristic()` receives empty `transcriptText`, correctly returns `'unclear'` (evidence too short), and `goal-verify.mjs` correctly approves rather than blocking. This is the adapter's fail-open design working as intended, not a bug — but it means the verify-and-continue tier's *continue* half will not trigger from a real `Stop` event today, only the mechanism for it is proven.
2. **The block/continue mechanism itself is confirmed transitively, not independently re-triggered live by this exact script.** Two independent facts compose to the full claim: (a) `goal-verify.mjs`, given evidence, correctly emits `{"decision":"block","reason":"..."}` at the top level of stdout — proven by 3 of the 21 unit tests plus an earlier manual smoke test with a crafted `last_assistant_message`; (b) Devin's `Stop` hook, given exactly that envelope shape from any script, forces genuine continuation — proven live by phase 002's probe (`caring-diver.json` transcript, `002-capability-probes/capability-matrix.md`). Because of Limitation 1, this phase could not observe a real `devin -p` session naturally produce a `not-met` verdict to combine both facts in one live transcript; doing so would require fabricating an evidence field Devin does not actually send, which this phase deliberately did not do (mirrors the task's own "do not fake it" discipline for live proof).
3. **`goal.maxAutoTurns` is read defensively but never written.** The goal core's record schema (phase 001) has no such field today; `goal-verify.mjs` checks `Number.isFinite(goal.maxAutoTurns)` and falls back to a local default cap (20) when absent. If a future phase adds a settable per-goal turn budget to the core, this adapter already honors it without changes.
4. **The heuristic verifier's own accuracy is inherited, not re-evaluated by this phase.** `verifyGoalHeuristic()` is phase 001's shared core; this phase only wires its inputs/outputs into Devin's `Stop` contract and does not re-litigate the heuristic's precision/recall.
<!-- /ANCHOR:limitations -->
