---
title: "Implementation Summary: Completed-Run Extension (--extend=N)"
description: "Built and tested on the phase branch: --extend=N reopens a completed deep-research or deep-review run in the same session. Three acceptance rows wait on the integration worktree."
trigger_phrases:
  - "completed run extension implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension"
    last_updated_at: "2026-11-17T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Implementation, tests, docs and mirrors committed on the phase branch"
    next_safe_action: "Walk DR-065 and DRV-070 live for AC-004; AC-010 waits on the operator decision about the .vibe one-line mirrors"
    packet_purpose: "Purpose: An operator runs `/deep:research --extend=N` or `/deep:review --extend=N` on a completed run and gets exactly N more iterations in the same session and generation, with the extension recorded as a `run_extended` ledger event and the run re-synthesized afterwards."
    blockers: []
    key_files:
      - "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-completed-run-extension"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "94a4cf06-5c71-4a49-952f-6bbffe1f9b56"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T18:12:34Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Completed-Run Extension (--extend=N)

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-completed-run-extension |
| **Status** | In Progress |
| **Completed** | Merged into `worktrees/455-expansive-depth-integration` 2026-11-17 (merge `238c4e95ccb`). The merge gate printed 185 files, 3115 passed, 9 skipped, 0 failed. Playbook scenarios DR-065 and DRV-070, the catalog line and changelog `v2.1.0.0` were written by `@markdown` in integration. AC-004 (live walk) and AC-010 (`.vibe` mirror grep) stay open |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Completed-Run Extension (--extend=N)

`/deep:research --extend=N` and `/deep:review --extend=N` now reopen a completed run in the same session and generation. Under the loop lock and before classification, a new step counts the runs so far, sets `maxIterations` to that count plus N, and sets `maxDurationMinutes` to `max(prior budget, minutes since createdAt) + M`. It appends a `run_extended` ledger event through the gateway, and only then writes the config back with status `initialized` and lineage mode `completed-continue`. Classification then lands on resume, writes no `resumed` row, and the run continues. Before the first new dispatch the prior synthesis or review report is copied to `synthesis-v{generation}-r{continuedFromRun}.md` or `review-report-v{generation}-r{continuedFromRun}.md`, and an existing snapshot is never overwritten.

`--extend` refuses a run that is not complete, refuses fan-out before any lineage spawns, and accepts positive integers only, as does `--extend-minutes`. Without `--extend`, nothing changes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-{research,review}-ledger-schema/*-schema.ts`, `*-types.ts` | Modified | `run_extended` stem per loop, the `extension-budget` field kind, payload types, producer rows (`spoken`) |
| `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modified | Upcasts a legacy `extended` row and refuses one without a full budget |
| `runtime/lib/deep-{research,review}-reducer/*.ts` | Modified | Typed folds raise `maxIterations` and keep the run live |
| `runtime/lib/legacy-projections/*.ts` | Modified | Project the event as an `extended` state-log row |
| `deep-research/scripts/reduce-state.cjs`, `runtime/scripts/reduce-state.cjs` | Modified | Treat `extended` like `resumed` at the five lifecycle sites; `completed-continue` is a live lineage mode |
| `deep-research/assets/deep-research-config.json` | Modified | `completed-continue` allowed, `fork` alone deferred |
| `.skilled/commands/deep/assets/deep-{research,review}.yaml` | Modified | Inputs, preflight check, fan-out guard, extension step, snapshot step, classifier override, notes |
| `.skilled/commands/deep/assets/deep-{research,review}-presentation.txt`, `research.md`, `review.md` | Modified | Flag bindings, rows and argument hints |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Regenerated | Contract digests |
| Both `loop-protocol.md`, both quick references, `state-format.md`, `review-mode-contract.yaml`, `deep-research/SKILL.md`, `deep-research-strategy.md`, both READMEs | Modified | The mode is documented as live; `fork` stays deferred |
| `.skilled/agents/deep-{research,review}.md` and the ten runtime mirrors | Modified, regenerated | Lifecycle wording |
| Twelve test files (deep-loop runtime and three system-spec-kit suites) | Modified | See Verification |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fork orchestrated the phase in worktree 456. Pi with DeepSeek did the schema, reducer and several test edits, one change per brief. Each brief had a 20-minute watchdog and snapshots of the main checkout and the worktree. Every diff was read and every check rerun here. The YAML steps, the test cases built around the real workflow commands, the docs and the mirror sync were done natively under the directive's native-work allowance. Commits: `32d56a21455` (stem and reducers), `2c80c64f391` (workflow, docs, contract tests), `dc00a20a8dd` (tests), `ac4151f027f` (docs, mirrors, contracts) and the closing commit that adds the in-step value check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Open questions 1 to 4 take their recommended defaults (`decision-record.md` ADR-001 to ADR-004, Accepted 2026-11-17) | The operator accepted all four; the design decisions stay frozen in `goal.md` §1 |
| The extension step also checks the flag values, after the lock | The preflight `extend_values` check is prose the model executes. The in-step check keeps a bad value from reaching the config and makes the refusal testable |
| The `.claude/agents` twins were edited by hand, the other mirrors by their generators | `doctor-runtime-mirrors.yaml` names `.claude/agents` a hand-maintained mirror and is itself check-only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Ledger-schema suites | 76 of 76 |
| Typed reducer suites | 144 of 144 |
| State-reducer suites (T034) | 51 of 51; the two new cases fail against the reducers before the change |
| `append-mode-event-legacy-seam` | 6 of 6 |
| `workflow-restart-lifecycle` | 34 of 34 |
| `loop-heartbeat` | 5 of 5 |
| 26 YAML- and doc-reading suites | 442 of 442 |
| Three system-spec-kit suites | 18 of 18 (baseline 17 plus one) |
| `npm run -s typecheck`, `node --check` on both reducers | exit 0 |
| `check-ledger-stem-producers`, `check-projection-coverage`, `check-contract-drift` | exit 0 each |
| Mirror checkers from `/doctor:runtime-mirrors` | exit 0 each |
| Matrix axes | loop (research, review) × stopPolicy (convergence warning asserted for review; research fixtures use convergence) × start time (inside and after the old budget, 300 minutes) × extension count (one, two) |
| Whole runtime suite | Not run here, by directive. It runs once per merge in the integration worktree |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two acceptance rows are Unmet.** AC-004 needs a live run that shows exactly 3 new dispatches; the DR-065 and DRV-070 scenarios exist for that walk. AC-010: the REQ-010 grep still matches `.vibe/agents/deep-research.toml:4` and `deep-review.toml:4`, because the Vibe generator writes each agent body as one TOML line, so the line holds `completed-continue` and unrelated words such as "deferred tangents". The fix (amend REQ-010 to exclude `.vibe/agents`, whose parity `sync-agents-vibe.cjs --check` covers) waits on the operator.
2. **The typed reducers still treat a terminal event as final.** Review throws `duplicate-terminal-event` and research keeps a terminal state one-way. They have no live caller today, only tests, so an extended run is never folded by them. A future live caller must handle `run_extended` after a terminal event.
3. **Classification is prose.** `extension_rule` and `extension_override` tell the model to land on resume and skip the `resumed` row. Tests read the contract, not an executed branch.
4. **The before-the-lock refusal is prose too.** The preflight `extend_values` check is not executed by any test. The in-step check refuses the same values after the lock and is tested.
5. **The review config carries no lineage mode list.** Only the research config has `allowedModes` and `deferredModes`; review keeps its modes in the reducer and the mode contract.
6. **The extension counts the iteration rows in the state log.** A row written by hand, outside the gateway, is dropped when the gateway re-projects the log, so it is not counted. Workflow appends always go through the gateway.
<!-- /ANCHOR:limitations -->
