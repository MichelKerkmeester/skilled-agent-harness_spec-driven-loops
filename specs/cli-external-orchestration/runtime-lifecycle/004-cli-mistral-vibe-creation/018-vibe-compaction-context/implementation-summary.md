---
title: "Implementation Summary"
description: "The Vibe compaction detector, its post_tool binding, the Vibe history-lookup registration and the forced-compaction run that proves the re-injection."
trigger_phrases:
  - "vibe compaction context implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/018-vibe-compaction-context"
    last_updated_at: "2026-11-14T23:30:00Z"
    last_updated_by: "deepseek-v4-1-flash-1017"
    recent_action: "Built the compaction detector, binding and Vibe history row"
    next_safe_action: "Phase 019 builds the relaunch tier on the handoff pointer this phase re-injects"
    blockers: []
    key_files:
      - ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs"
      - ".skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs"
      - ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs"
      - ".skilled/hooks/shared/session-readers/index.mjs"
      - ".skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The compaction entry is a completed checkpoint-compaction record; the detector matches it through compactionsSince"
      - "A post_tool additional_context is recorded on the tool result, so the binding reaches the model mid-turn"
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
| **Spec Folder** | 018-vibe-compaction-context |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Vibe session now gets its goal slice, its history lookup offer and its open handoff pointer back once after every compaction, at the next turn start or the next tool call.

### Phase 18: vibe-compaction-context

- **Detector** (`compaction-context.mjs`): reads the journal through `loadVibeSession` and `compactionsSince`, keeps a per-session watermark under `.skilled/skills/.state/vibe-compaction/`, writes the watermark before returning text, advances the advisor directive receipt on a new compaction, and builds the re-injection from `renderVibeGoalSlice`, the shared `## History Lookup` offer and the open handoff note. Every path fails open.
- **Turn-start part** (`turn-start.mjs`): runs the detector after the pending completion advisory and before the advisor brief, so the re-armed receipt is visible to the advisor in the same turn.
- **Post-tool binding** (`compaction-post-tool.mjs`): sums the journal files' sizes, returns nothing when the size is unchanged, and otherwise runs the same detector. Non-strict in `.vibe/hooks.toml`, so a failure never blanks a tool result.
- **History lookup**: the `vibe` reader row is `ready`, `vibe` is in `HISTORY_LOCATOR_KINDS` and `HISTORY_LOCATOR_RUNTIMES`, and the CLI resolves a Vibe session under `$VIBE_HOME/logs/session/unified/<session_id>` so the printed offer redeems.
- **Tests**: nine `node --test` cases over the recorded compaction journal, plus one Vibe read case in the history lookup CLI suite.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | Create | Watermark detector, history offer and handoff pointer |
| `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` | Create | `post_tool` binding with the journal-size check |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` | Create | Nine fixture cases over the recorded compaction journal |
| `.skilled/hooks/session-lifecycle/vibe/fixtures/compaction-journal/` | Create | Redacted copy of the recorded forced compaction |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Modify | Runs the detector as a turn-start part |
| `.skilled/hooks/session-lifecycle/vibe/README.md` | Modify | Detector and binding rows |
| `.vibe/hooks.toml` | Modify | One non-strict `post_tool` entry |
| `.skilled/hooks/shared/session-readers/index.mjs` | Modify | `vibe` row promoted from `gated` to `ready` |
| `.skilled/hooks/shared/tests/session-readers/vibe-reader.test.mjs` | Modify | Capability assertion follows the promotion |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` | Modify | `vibe` in the locator kinds and runtime list |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts` | Modify | Vibe store root, session candidates and runtime label |
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-cli.vitest.ts` | Modify | One Vibe read case |
| `specs/.../018-vibe-compaction-context/scratch/compaction-entry.md` | Create | Entry shape and the history lookup baseline |
| `specs/.../018-vibe-compaction-context/scratch/forced-compaction/` | Create | Run script, prompt, journal, watermark and excerpt |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Setup read phase 014's compaction finding and copied its recorded journal into the detector fixture. The detector reuses the phase 014 reader's `compactionsSince`, so the entry shape is the one Vibe actually wrote: a completed `checkpoint-compaction-<id>` projection entry. The history offer reuses the compiled locator digest, hook-state writer and offer builder, so the handle the detector mints is the one the CLI re-derives. The CLI gained the Vibe branch because `transcript_path` alone did not name a Vibe store root; the spec's Files to Change table did not list `cli.ts`, and the Vibe read case could not pass without it.

The forced-compaction proof ran through `run-fixture.sh` with the rendered home hooks, phase 014's small-window config and `VIBE_SPEC_FOLDER` bound to this packet. The first attempt crossed the threshold once but the model kept exploring and compacted seven times; the recorded run puts the instruction first, compacts once, and the next tool call carries the Objective line.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Watermark keyed by compaction id and journal sequence | A repeat read of the same journal returns nothing, and a later compaction advances the mark |
| Watermark written before the text is built | A crash cannot repeat one injection on every later turn |
| The detector runs before the advisor part | The receipt is advanced before the advisor decides what to deliver in the same turn |
| The offer is withheld when the session folder cannot run the printed command | `buildHistoryLookupSection` refuses an unredeemable command; the goal slice and handoff pointer still land |
| The binding sums journal file sizes | A directory's mtime does not move when a file inside it grows |
| `vibe` stays a `transcript_path` runtime | The hook payload's `transcript_path` is the session root, and the CLI now resolves that root from `VIBE_HOME` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | exit 0 |
| `node --check .skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | exit 0 |
| `printf 'not json' \| node .skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` | only `exit=0` |
| `rg -c 'compaction-post-tool.mjs' .vibe/hooks.toml` | 1 |
| `node -e "...capabilities.vibe.status"` | `ready` |
| `npm run build` in `.skilled/skills/system-spec-kit/runtime` | exit 0 |
| `rg -c "vibe" .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/hook-state.js` | 2 |
| `node --test .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` | `tests 9`, `pass 9`, `fail 0` |
| `npx vitest run tests/history-locator.vitest.ts tests/history-locator-adapters.vitest.ts tests/history-lookup-cli.vitest.ts` | `Tests 96 passed (96)`; baseline 95 plus the Vibe case |
| `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` | `tests 3`, `pass 3`, `fail 0` |
| Forced-compaction run (`scratch/forced-compaction/`) | one automatic compaction at sequence 14; the next `post_tool_call` result carries `**Objective:**`; `watermark.json` names that compaction id |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The offer needs a redeemable folder.** A session whose cwd is not a checkout gets the goal slice and the handoff pointer but no history offer, because the printed command could not run there.
2. **A compaction at the end of a run is not re-injected.** The binding needs a later tool call; a run that compacts and immediately finishes has no seam.
3. **The journal format is pinned to Vibe 3.1.2.** A future entry shape fails open rather than injecting the wrong text.
<!-- /ANCHOR:limitations -->

---

## Continuity

- **Predecessor**: `017-vibe-decision-capture`
- **Successor**: `019-vibe-relaunch-command-tier`
- **Evidence**: `scratch/compaction-entry.md`, `scratch/forced-compaction/excerpt.md`
