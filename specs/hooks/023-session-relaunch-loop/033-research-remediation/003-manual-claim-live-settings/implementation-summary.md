---
title: "Implementation Summary"
description: "The manual claim command the wrapper prints now starts the receiver on the consumed record's live model and effort, or on the settings the current hop launched on, instead of the first launch's."
trigger_phrases:
  - "manual claim live settings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/003-manual-claim-live-settings"
    last_updated_at: "2026-10-25T15:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Built and verified the live-settings manual claim template"
    next_safe_action: "Commit the phase and refresh its changelog file in ../changelog/"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-manual-claim-live-settings"
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
| **Spec Folder** | 003-manual-claim-live-settings |
| **Status** | Complete |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When you copy the manual claim command the wrapper prints, the receiver now starts on the model and effort the sender was really using. Before this, the command replayed a template built once from the first launch, so a session that had switched from Sonnet to Opus printed a command that started on Sonnet again.

### Phase 3: manual-claim-live-settings

Two paths in `.skilled/bin/skilled-loop` keep the template current. On every hop, right after the live settings block and before the hop's launch arguments are built, the wrapper rebuilds `SKILLED_LOOP_MANUAL_TEMPLATE` from the settings that hop launches on, re-exports it and recomputes the placeholder conflict. The session's own hop-cap command reads that exported template, so it is current too. On every print, `print_manual_command` reads the consumed record's live model, provider and effort in one node call (`read_consumed_live_settings`), applies them with `apply_consumed_live_settings`, which uses `model_is_valid`, `effort_is_valid` and the shared `live_model_voids_launch_effort` rule, and rebuilds the template and the conflict check from them. When the record holds no value that passes those checks, the current template is used unchanged, byte for byte. Every rebuild runs in a command substitution, because building a template resets `launch_arguments`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | `read_consumed_live_settings` and `apply_consumed_live_settings` helpers, the per-print rebuild in `print_manual_command`, and the per-hop template re-export |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Five wrapper tests: live model and effort, Cursor live model, invalid live model guard, live placeholder conflict, and the model-switching hop |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tests came first. Run against a scratch copy of the HEAD wrapper (`65f37f5d70`), four of the five failed on the startup template: Sonnet low where Opus medium was expected, `gpt-5.6-luna` where the Cursor model was expected, no conflict error for a live placeholder, and Sonnet in both the exported hop template and the printed command after the switching hop. The invalid-model guard passed, as a regression guard should. After the change all five pass. Output is in `scratch/red-before.txt` and `scratch/green-after.txt`, suite counts in `scratch/baseline-suite.txt` and `scratch/final-suite.txt`. No live proof was required, and none was run. The change is uncommitted in the working tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The per-print rebuild lives inside `print_manual_command` rather than at each call site | Every caller prints after a consume, including the withdrawn decline that phase 002 added, so one place covers all seven calls and none can be missed |
| The Cursor test feeds the stub record from `resolveSessionSettings` | It runs the real Cursor live reader on a config in the sandbox home, so the model in the printed command is the one the reader produced. `session-relaunch-cli.test.cjs` needed no change |
| The print path applies live values silently | The hop path's warnings say "relaunching on", which would be false for a print that relaunches nothing |
| An extra test for a live model holding the placeholder | The spec asks that the conflict warning still fire for a carried value. A live value reaching the template is new behaviour, so it gets its own test |
| The invalid-model guard carries no live effort | A valid live effort is applied by the effort rule even when the model is refused, so the guard checks only what its criterion names, the launch model |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | 920 of 921 pass, exit 1. Baseline 915 of 915. The one failure, "a reused note with the goal switch off hands on no packet" in `session-relaunch-cli.test.cjs`, is phase 006's failing-first test for consume, a path this phase does not touch |
| `npx vitest run ... pi/session-relaunch.test.ts` | PASS, 59 of 59, exit 0 |
| `bash -n` and `shellcheck -S warning` on `skilled-loop` | PASS, both exit 0 |
| The five new tests on HEAD, then on the change | 1 of 5, then 5 of 5 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One extra node process per print.** NFR-P01 asks for no extra node process. The template rebuild itself is pure Bash, but reading the record's live values takes one node call per print, on decline paths only. Parsing the JSON in Bash would avoid it at the cost of a fragile parser.
2. **The changelog file is not refreshed.** The phase context asks for a refresh of `../changelog/`, which is outside this phase's write scope.
<!-- /ANCHOR:limitations -->
