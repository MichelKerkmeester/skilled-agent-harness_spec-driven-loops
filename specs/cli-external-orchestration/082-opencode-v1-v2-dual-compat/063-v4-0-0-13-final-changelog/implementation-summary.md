---
title: "Implementation Summary"
description: "The v4.0.0.13 changelog now matches what the release will actually ship: one DeepSeek default on both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime, dispatch that takes the first `opencode2` anywhere on PATH, and suite counts from reruns on this tree. A reader upgrading no longer meets the previous model or a dispatch rule the tree has left behind."
trigger_phrases:
  - "v4 0 0 13 final changelog implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/063-v4-0-0-13-final-changelog"
    last_updated_at: "2026-10-23T00:23:41Z"
    last_updated_by: "spec-record-writer"
    recent_action: "Filled the phase records after the writer pass, both validators and the read-only review"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.13.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-063-v4-0-0-13-final-changelog"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 063-v4-0-0-13-final-changelog |
| **Status** | Complete |
| **Completed** | 2026-10-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The v4.0.0.13 changelog now matches what the release will actually ship. A reader upgrading meets one DeepSeek default across both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime, dispatch that takes the first `opencode2` anywhere on PATH, and suite counts taken from reruns on this tree.

### Phase 63: v4-0-0-13-final-changelog

The release note had been trimmed and reordered, but its facts had drifted from the tree. The `#### One Default Model on Both Versions` item, the dispatch glance bullet and the llmgateway upgrade note still named `llmgateway/deepseek-v4.1-flash`. They now name `llmgateway/deepseek-v4.1-flash-1017`, LLM Gateway's 2026-10-17 release, as the default for both OpenCode versions, Pi, Hermes and the deep-loop fan-out runtime, with Pi's blackhole workers at `high`. That change landed in phase 058 as commit `5b5f56720f`. A new upgrade note tells a reader how to pin the older `deepseek-v4.1-flash` if they need it.

Dispatch now reads as it behaves after phase 062, commit `4505c338b1`: it takes the first `opencode2` anywhere on PATH and uses `opencode` only when no `opencode2` is installed, and the fan-out runtime picks the same way. A new upgrade note named `Expect OpenCode 2 when both are installed` sits after `Move to OpenCode 2`, so a reader whose run changes version can see why.

The suite table was refreshed from reruns on this tree. OpenCode plugins moved from 516 to 533, hook node tests from 886 to 914 and hook vitest tests from 452 to 461, while battery unit tests stayed at 55. The plugin count of 17 and the 12 `.markdown` files were rechecked and are unchanged. The title stays 'v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 2', and the glance list still holds 11 bullets.

The review left two small wording points alone. 'Runs OpenCode 2 whenever it is installed' at lines 17 and 39 compresses away the `OPENCODE_BIN` override that line 99 states, and OpenCode 1 is named before OpenCode 2 inside two clauses at lines 99 and 172. Neither inverts the recommendation, so both are recorded rather than fixed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modified | New default model in three places, a pin note for the older model, `opencode2` dispatch wording, the `Expect OpenCode 2 when both are installed` upgrade note and the refreshed suite table |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 063 and the 062 to 063 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One DeepSeek v4.1 flash 1017 writer through `cli-pi` at high thinking received a single brief with seven exact replacements and applied all of them. The facts behind the brief came from phase 058's commit `5b5f56720f` for the default model, phase 062's commit `4505c338b1` for the dispatch preference, and reruns on this tree for the suite counts. `validate_document.py` then reported VALID with 0 issues and `hvr_scan.py` reported 0 hard blockers. One separate read-only DeepSeek v4.1 flash 1017 session at max thinking reviewed the finished file and returned VERDICT: PASS with no P0 or P1 and two P2s, both recorded here and left unfixed. The commit, push and CI run are still open; no tag or release was created in this phase, because the orchestrator creates them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name `llmgateway/deepseek-v4.1-flash-1017` in all three default statements | Phase 058 set that release as the default everywhere, so leaving one statement on the old id would tell a reader two different things |
| Add a pin note for the older `deepseek-v4.1-flash` | The old model stays selectable when pinned, and LLM Gateway lists DeepSeek's own route for it as closing on 2026-10-24, so a reader needs the way back |
| Describe dispatch as first `opencode2` anywhere on PATH | Phase 062 changed the behavior, and the previous wording described the older first-`opencode` rule |
| Place `Expect OpenCode 2 when both are installed` after `Move to OpenCode 2` | A reader who has just been told to move needs the concrete behavior next, not a separate section later |
| Refresh the suite table rather than carry the old counts | The counts came from reruns on this tree, so the release note should show what this tree actually runs |
| Record the two P2s instead of fixing them | Neither inverts the recommendation, and the release was close; the record keeps them available for a later pass |
| Leave the title unchanged | Phase 061 set it to lead with the handover and OpenCode 2, and this phase changed no fact it states |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on `.skilled/changelog/skilled/v4.0.0.13.md` | PASS: VALID with 0 issues |
| `hvr_scan.py` on `.skilled/changelog/skilled/v4.0.0.13.md` | PASS: 0 hard blockers |
| Glance list | 11 bullets |
| Title | Unchanged: 'v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 2' |
| Suite table | Plugins 533 from 516, hook node tests 914 from 886, hook vitest 461 from 452, battery unit tests 55 unchanged; plugin count 17 and 12 `.markdown` files rechecked unchanged |
| Read-only DeepSeek v4.1 flash 1017 review at max thinking | PASS: no P0 or P1, two P2s recorded: the `OPENCODE_BIN` override compressed away at lines 17 and 39, and OpenCode 1 named before OpenCode 2 inside two clauses at lines 99 and 172 without inverting the recommendation |
| Writer | DeepSeek v4.1 flash 1017 through `cli-pi` at high thinking, one brief with seven exact replacements, all applied |
| Commit, push and CI green on the commit | PASS: `5801f6f807` on main, 12 of 12 CI runs green, and 13 green with Trigger Index Rebuild skipped on `dd180cefeb` (Spec-Kit Check 39879181332) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `OPENCODE_BIN` override is compressed away in two places.** The phrase 'runs OpenCode 2 whenever it is installed' at lines 17 and 39 reads as an absolute rule, while line 99 states the `OPENCODE_BIN` override. A reader who only reads the early lines may miss that escape hatch. Recorded from the review and not fixed.
2. **OpenCode 1 is named before OpenCode 2 inside two clauses.** Lines 99 and 172 mention OpenCode 1 first in a subordinate clause. This does not invert the recommendation, which still names OpenCode 2 as the expected version. Recorded from the review and not fixed.
<!-- /ANCHOR:limitations -->

---
