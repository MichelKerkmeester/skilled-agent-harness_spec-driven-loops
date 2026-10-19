---
title: "Implementation Summary"
description: "The research fixes are in, each with a failing-first test, and the decisions the adapters shared now live once in the core with a conformance table across all five adapters."
trigger_phrases:
  - "research fixes and core consolidation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation"
    last_updated_at: "2026-10-19T19:30:00Z"
    last_updated_by: "template-author"
    recent_action: "Closed phase 009 with all seven criteria Met"
    next_safe_action: "Operator decides on merging worktree 148 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-research-fixes-and-core-consolidation"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 009-research-fixes-and-core-consolidation |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research run's verified findings are fixed, and the five adapters now ask the core for the decisions they each used to make. A conformance table runs the same cases through every adapter, so the next drift fails one shared test.

### Phase 9: research-fixes-and-core-consolidation

On Claude, the Stop hook no longer hands the killer its own `bash -c` shell. It keeps `CLAUDE_PID` while that process descends from the loop and otherwise walks to the loop's direct child, and it leaves the record pending when neither exists. It also stops re-arming over live background tasks when a killer has died. The nudge never writes an unchecked spec folder into the note, prints an unknown one empty instead of a placeholder `prepare` rejects, and reads `SYSTEM_SPEC_FOLDER` on every runtime. A seed with a relative note path adds nothing, where it used to hand the model a claim command it could not run.

The wrapper now relaunches only an open note. `consume` reports the note state, and a missing, broken or already claimed note, or a consume that failed and lost the Gate 3 answer, stops the hop with the manual command. A record with no handoff or cwd is declined and keeps the runtime's exit code. `consume` also keeps a valid `none` from a note whose frontmatter no longer parses, a spaced `status : open` key is updated in place, a linked handoffs folder is refused, and the Claude window resolver reads settings up to the repository root.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `noteState`, `resolveKillerTarget`, `incomplete-record`, spaced keys |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | `CLI_COMMAND`, `normalizeSpecFolder`, `specFolderInput`, `seedInstructions`, `nudgeDecision`; empty folder field; no chmod through a link |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modified | Settings walk to the repository root |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Consume `note` field, broken-note answer, real handoffs directory |
| `.skilled/bin/skilled-loop` | Modified | Open note only; `incomplete-record` decline |
| `claude/`, `codex/shared.mjs`, `hermes/context-nudge.mjs`, `pi/session-relaunch.ts`, `.opencode/plugins/session-relaunch.js` | Modified | Shared helpers; Claude kill target and background guard; one note-state rule in OpenCode |
| `tests/adapter-conformance.test.cjs` | Created | Seven cases across Claude, Codex, Hermes and OpenCode |
| `tests/*.test.cjs`, `pi/session-relaunch.test.ts`, `.opencode/plugins/tests/session-relaunch.test.cjs` | Modified | Failing-first tests, the Pi mirror, fixtures with open notes and real seeds |
| Session-relaunch READMEs, `handoff.md`, `ENV-REFERENCE.md`, the catalog entry | Modified | G1 to G5, G7, C3 |
| `../002-pi-opencode-adapters/implementation-summary.md` | Modified | G6: what the later live runs closed |
| `../spec.md`, `../goal.md`, `../research/` | Modified, Created | Nine phases, worktree 148, the research artifacts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was read at its cited line before work began. The tests came first and failed against the unchanged code for the expected reasons. Then the fixes went in file by file, each suite turning green before the next. To prove the tests track the change, the eleven pre-phase sources were swapped in from HEAD: 49 of 510 node tests and 3 of 34 Pi tests failed, all of them new or changed tests. The phase sources went back and `cmp` matched every file to its backup.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the killer accepting any loop descendant | An in-process runtime started through a shim runs below the loop's direct child |
| Pi and OpenCode keep their own pid as the target | They run in process, so their pid is the runtime, and the killer already refuses anything outside the loop |
| Relaunch only an open note | A claim for any other state fails in the fresh session and wastes the hop |
| A malformed seed adds nothing | A claim command with a placeholder path cannot run, and the bare seed still names the note |
| Put the incomplete-record check after stale and hop-cap | The nudge reads only `stale` from this verdict, so an old incomplete record still counts as stale there |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Red run on pre-phase sources | node 510 tests, 49 fail; Pi 34 tests, 3 fail |
| Conformance table | 28 of 28 pass; Pi mirror 7 of 7 |
| Full gate | rc 0; node 510/510; Pi 34/34; tsc and shellcheck rc 0 |
| Drift guards, comment hygiene | 4/4 PASS; rc 0 |
| Touched docs | `validate_document.py` rc 0 each; no voice hard blockers |
| Recursive strict validation | Ten `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live rerun.** The fixes narrow paths the unit, wrapper and conformance tests reach. No live relaunch was run for this phase.
2. **A note stays open after a stopped hop.** When the wrapper refuses a broken note, the operator fixes the note and runs the printed manual command.
<!-- /ANCHOR:limitations -->

---
