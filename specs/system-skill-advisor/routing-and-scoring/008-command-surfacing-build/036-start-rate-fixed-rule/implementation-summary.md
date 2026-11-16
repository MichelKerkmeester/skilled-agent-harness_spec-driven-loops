---
title: "Implementation Summary: Phase 36: start-rate-fixed-rule"
description: "The printed start rate now follows the goal's fixed arm start rule, so a document read with no write is a lookup printed beside the rate. Every stored start rate moved by exactly its lookups and nothing else moved."
trigger_phrases:
  - "start rate fixed rule implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/036-start-rate-fixed-rule"
    last_updated_at: "2026-11-16T07:43:44Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 036: 99aef1e794f plus review fixes, four stored sets restated"
    next_safe_action: "Run the /deep:review loop over the packet code"
    packet_purpose: "Purpose: One start rule across every printed number, with the lookups still printed so the old count stays recoverable."
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/036-start-rate-fixed-rule/implementation-summary.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/036-start-rate-fixed-rule/scratch/restate.txt"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/036-start-rate-fixed-rule/scratch/restate-sets.txt"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"
    session_dedup:
      fingerprint: "sha256:99ec48963f2d8c563a61b57266c56868f5ef2d6e5e70c146e3a42b043e43d720"
      session_id: "scaffold-036-start-rate-fixed-rule"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "77af2d6d-58e8-4180-b6da-697f12833f71"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-16T07:43:44Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-start-rate-fixed-rule |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every printed start count now uses the one rule the goal fixed before the first session: a run starts a command by a skill call naming it, a `COMMAND:` started line, a host expansion, or a read of its document plus a write in its checkout. A read with no write is a lookup. Most counted starts were lookups, so the restated rates are much lower, and the lookups stay printed beside them.

### Phase 36: start-rate-fixed-rule

`startState` computes the shape of anything the run did with the command and sets `started` only for `skill`, `reported`, `expanded` and `readWrite`. A read alone keeps the shape `readOnly` with `started` false. The tally counts a shape for every uncapped start row that started or looked up, so the four starting shapes sum to the started count and `readOnly` holds the lookups. `tally.started`, `startedOfOffered` and each policy's `started` count follow it. The decline and skill-only counts already used the rule through `startedCommand` and did not move.

Test expectations changed: the three policy cases of the read it.each now expect `started` to equal `wrote`, the read-alone row of the shape it.each became its own case expecting a lookup, the outside-checkout case also asserts `started` false, and the capped-row comment now says the split covers uncapped start rows. One summary case was added: an offered read with no write prints `startRate 0 of 1`, `readOnly 1`, `startedOfOffered 0` and no policy start.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | `startState` and the tally follow the rule. The `readDocument` comment says a read is a touch, not a start |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | Lookup cases at the judge and the summary level |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | States the rule for `startRate`, `startedOfOffered` and `byPolicy`, and lists `startShapes` |
| `scratch/` | Created | Gate files, before and after summaries of four stored sets, `restate.py`, `restate-sets.py`, their outputs and `fields-check.txt` |
| `../goal.md` | Modified | Restated rows for the 007 start, pre and final sets and the 033 arm, two correction rows and an old-rule marker row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The before summaries were taken at `c3477fdcc85`, with the 007 start set byte-identical to the copy taken at `267c27fc5df`. The scorer change landed as `99aef1e794f`. Rescoring the 007 start set and the 033 arm gave 22 lines where each new numerator equals the old one minus its lookups and no denominator moved. With the start fields removed, before and after summaries are identical. The gate review approved at 93/100 with five P2s, all fixed in the close-out: the `readDocument` comment, a summary-level lookup test that fails when the shape count moves back under `started`, the README wording for `startedOfOffered` and `byPolicy`, a direct comparison of the decline counts with 034's record, and a correction row for a miscited source. The pre and final sets, which earlier goal rows also quote, were rescored with the scorer from `c3477fdcc85` and with the new one, and moved the same way.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Follow the fixed rule in the printed rate (Q080) | The operator asked for the recommended option. One rule across every printed number stops the rate and the verdict disagreeing |
| Keep lookups printed as `readOnly` | The old `startRate` numerator stays recoverable as started plus `readOnly` |
| Restate the pre and final sets too | The spec promised to restate every printed rate the change moves, and earlier goal rows quote those sets |
| Append correction rows, never edit old rows | The goal log is append-only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 007 start set and 033 arm | 22 lines `numerator moved by readOnly, denominator equal`, 0 DIFF (`restate.txt`) |
| 007 pre and final sets | 11 lines moved by `readOnly`, other fields equal (`restate-sets.txt`) |
| Other fields | Identical with the start fields removed (`fields-check.txt`) |
| Decline and skill-only | Equal to 034's record per arm and pooled: decline 0 of 40 off and 0 of 80 on, skill-only 0 of 40 each |
| Advisor suite | 2325 then 2326 passed, 0 failed, exit 0. Typecheck exit 0 |
| Floors and eval | `24/44`, `0/35`, `2/44` and `[160,49,21,5]`, unchanged |
| Mutation | Moving the shape count back under `started` fails the new summary case |
| Gate review | APPROVED 93/100, five P2s fixed |
| Acceptance criteria | 5 of 5 Met. Checklist P0 12/12, P1 13/13, P2 1/1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Older goal rows keep old-rule figures.** The log is append-only, so a marker row and the restated rows supersede them rather than replacing them.
2. **Started of offered cannot be rebuilt from `readOnly`.** It counts offered rows, a different set from the start rows the split covers, so its old value is only in the before summaries.
3. **`after.txt` names an uncommitted tree.** The after gates ran on the working tree before `99aef1e794f` was committed, holding the same code.
<!-- /ANCHOR:limitations -->

---
