---
title: "Implementation Summary: Phase 23: untuned-outcome-evidence"
description: "The capture now prints where the 44 sealed plain rows fall out and counts a command on 48 sealed fit rows. The workflow summary prints a range beside each rate, splits the followed rate by the offer and pairs two arms row by row. Every number in this phase came from the two committed scripts."
trigger_phrases:
  - "untuned outcome evidence implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence"
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "Closed the phase"
    next_safe_action: "Operator sets or waives the outcome target named in the parent goal log"
    blockers: []
    key_files:
      - "scratch/outcome-evidence.txt"
      - "scratch/recapture.txt"
      - "scratch/after.txt"
      - "scratch/scope.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-023-untuned-outcome-evidence"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Outcome target: gain target, absolute followed rate or written waiver. Waiting on the operator"
      - "A new behaviour arm on untuned rows. Waiting on the operator"
      - "Where the work that raises the sealed reach lives. Waiting on the operator"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-untuned-outcome-evidence |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now read the packet's outcome on requests nobody tuned for. On the 44 sealed plain rows the brief carries the right command 1 time in the fixture regime and 4 times with the real embedding, against 28 of 45 and 33 of 45 on the tuned rows. On 48 new sealed rows that should carry no command the head carries one on 8 of the 24 decline rows.

### Phase 23: untuned-outcome-evidence

The capture script prints `plain_stages`, which says per split where each plain row fell out: the command led, its owner led, a route answered, a command was attached or none of these. It also counts how often a head carries a command on the 48 sealed fit rows, 24 skill-only and 24 decline, and refuses a fit row whose text repeats another row's, naming only the two ids.

The workflow summary prints a 95 percent range beside the followed rate and the load rate, so you can see how far one run moves a rate over 16 rows. It splits the followed rate by whether the head offered the row's command, and `--pair <from>,<to>` counts the rows that gained, lost or kept a followed workflow between two arms. The README says what each new field means and the five limits on reading it.

All of this starts at `BASE` 60968af043. The fit decline count is above zero and nothing was tuned to move it: the count is recorded as found and handed to the operator. The real holdout reach read 4 of 44 at T001 where planning read 5 (`scratch/before.txt`), the uncertainty phase 020 introduced.

### Files Changed

`RAD` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy` and `ADV` is `.skilled/skills/system-skill-advisor/runtime`.

| File | Action | Purpose |
|------|--------|---------|
| `RAD/capture-command-routing-baseline.mjs` | Modified | Prints `plain_stages` and the `fit` count and refuses a repeated fit row |
| `RAD/command-prompts.jsonl` | Modified | 48 sealed fit rows appended, 0 removed |
| `RAD/command-routing-baseline.json` | Modified | Recaptured with `--write`. Every earlier metric byte-equal |
| `RAD/score-command-transcripts.mjs` | Modified | The two ranges, the offered split and `--pair` |
| `RAD/README.md` | Modified | The new fields and the section `Reading the outcome` |
| `ADV/tests/command-routing-slice.vitest.ts` | Modified | The stage identity, the fit counts and the repeated-row refusal |
| `ADV/tests/command-transcript-score.vitest.ts` | Modified | The range, the offered split, the pair refusals and the paired line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three lanes ran the work. Lane R owned the capture, its test and the corpus and ran T003, T016, T004, T005 and T017. Lane S owned the scorer and its test and ran T007, T008, T009, T018, T019, T020, T021 and T022. Lane D wrote the README in T010 after both lanes ended. Each lane task went to a DeepSeek worker, and an Opus verifier checked every worker task and passed each one. Each task that changed a function wrote its test first and recorded the failing first run its line names.

The coordinator ran the gates: the before numbers (T001, T002), the recapture (T006), every suite (T011), the evidence capture (T012), the scope check (T013) and the hand-off to the parent goal log (T014). T006 to T013 ran with the next phase's uncommitted code edits set aside and restored after, so the recaptured baseline and the evidence match this phase's code only.

The evidence came from `node RAD/capture-command-routing-baseline.mjs` (fixture regime), the same script with `--real-embedding` (real regime) and the summary over `runs-pre.jsonl`, `runs-pre-dsh-rerun.jsonl` and `runs-final.jsonl` in `007-per-runtime-behaviour-proof/scratch/` with `--pair pre,post`. The lines below are copied from `scratch/outcome-evidence.txt`:

```text
regime fixture
reach tune 28 of 45
reach holdout 1 of 44
stage tune total=45 own=13 ownerLed=23 routed=21 withCommand=15 attached=15 neither=9
stage holdout total=44 own=1 ownerLed=6 routed=3 withCommand=0 attached=0 neither=37
fit skill-only 0 of 24
fit decline 8 of 24
regime real
reach tune 33 of 45
reach holdout 4 of 44
stage tune total=45 own=18 ownerLed=22 routed=21 withCommand=15 attached=15 neither=5
stage holdout total=44 own=4 ownerLed=5 routed=2 withCommand=0 attached=0 neither=35
fit skill-only 0 of 24
fit decline 8 of 24
followed claude pre 5 of 16 range 0.14 to 0.56 offered 0 of 0 notOffered 0 of 0 unknown 16
followed claude post 8 of 16 range 0.28 to 0.72 offered 7 of 14 notOffered 1 of 2 unknown 0
followed codex pre 0 of 16 range 0 to 0.19 offered 0 of 0 notOffered 0 of 0 unknown 16
followed pi pre 7 of 16 range 0.23 to 0.67 offered 0 of 0 notOffered 0 of 0 unknown 16
followed pi post 12 of 16 range 0.51 to 0.9 offered 10 of 14 notOffered 2 of 2 unknown 0
followed devin pre 12 of 16 range 0.51 to 0.9 offered 0 of 0 notOffered 0 of 0 unknown 16
followed devin post 16 of 16 range 0.81 to 1 offered 14 of 14 notOffered 2 of 2 unknown 0
followed opencode pre 10 of 16 range 0.39 to 0.82 offered 0 of 0 notOffered 0 of 0 unknown 16
followed opencode post 14 of 16 range 0.64 to 0.97 offered 13 of 14 notOffered 1 of 2 unknown 0
followed dsh pre 12 of 16 range 0.51 to 0.9 offered 0 of 0 notOffered 0 of 0 unknown 16
followed dsh post 13 of 15 range 0.62 to 0.96 offered 12 of 13 notOffered 1 of 2 unknown 0
paired claude pre to post rows=16 gained=4 lost=1 bothFollowed=4 neitherFollowed=7
paired pi pre to post rows=16 gained=6 lost=1 bothFollowed=6 neitherFollowed=3
paired devin pre to post rows=16 gained=4 lost=0 bothFollowed=12 neitherFollowed=0
paired opencode pre to post rows=16 gained=4 lost=0 bothFollowed=10 neitherFollowed=2
paired dsh pre to post rows=15 gained=3 lost=2 bothFollowed=10 neitherFollowed=0
limit: a loaded document is not a followed step, so a followed rate says a workflow opened and not that its steps were taken
limit: the behaviour rows are tuned rows, the corpus the brief was built against
limit: each row ran once, so the range around each rate is wide
limit: the two arms differ in more than the brief, so a paired gain or loss is not the brief's effect alone
limit: the offer on a stored run of a runtime other than Claude is the Claude hook's replay, recorded when the run was made, so offered and notOffered on those lines say what the Claude head carried
```

The same reach, stage, fit, followed and paired lines are in the parent goal log rows `Sealed reach`, `Sealed fit`, `Followed range` and `Paired arms`.

No task was marked `[B]`. Three follow-ups were declined, each on its task line: a rate-text assertion in T007, a refusal of one arm named twice in T018 and a shared-fixture extraction in T022.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Every number comes from a committed script's output | A number typed by hand cannot be rerun, and no sealed row's text is read or printed along the way |
| The fit rows were written once by a worker who saw no phrase table and scored no draft | A row written to pass would make the count a tuned number again |
| The fit decline count of 8 of 24 is recorded and not tuned | Tuning a guard on a sealed row ends that row's use, so the count goes to the operator |
| New facts arrive as new fields | Every earlier metric and summary field keeps its value, so no floor moves unseen |
| No behaviour run and no target set here | Only a new arm can show cause, and the operator ruled out more arms and owns the target |
| Each rate is printed with its range and its limits | One run per row over 16 rows is too thin to read as proof |
| The matrix of row class by tally | Plain tune and plain holdout feed the earlier metrics and `plain_stages`. Typed and silence rows feed the earlier metrics only. Skill-only and decline rows feed `fit` only. T006 shows the earlier metrics did not move |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Earlier baseline fields (T006, `scratch/recapture.txt`) | PASS. `cmp earlier-before.json earlier-after.json` exit 0, rows 132 and 132 |
| Stage and fit totals (T006) | PASS. `[44,24,24]` |
| Decline kinds | PASS. `jq -c '.attachedMetrics.fit'` over the baseline shows `refusal`, `question`, `small-edit` and `app-problem` each with `total` 6 |
| Slice suite (T011, `scratch/after.txt`) | PASS. 9 passed (9) |
| Transcript score suite (T011) | PASS. 151 passed (151) |
| Full advisor suite (T011) | PASS. exit 0, 184 files, 1998 passed with 6 skipped, 0 failed. Before: 1983 passed |
| Evidence line counts (T012) | PASS. reach 4, stage 4, fit 4, followed 11, paired 5, limit 5, replay limit 1, no fit line reads 0 of 0 |
| Scope (T013, `scratch/scope.txt`) | PASS. 7 files changed, 682 insertions and 11 deletions. The corpus numstat reads 48 then 0 |
| Comment and fit id searches (T013) | PASS. Both print nothing |
| Parent goal log (T014) | PASS. 9 rows, no cut row, `packet_budget=ok` |
| Earlier summary fields | PASS. `summary-before.json` against `summary-after.json` with the new fields stripped, `cmp` exit 0 |
| Syntax on the current tree | PASS. `node --check` exit 0 on the capture and the scorer |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A loaded document is not a followed step.** A followed rate says a workflow opened and not that its steps were taken. A step check needs rows built for it and a run.
2. **The behaviour rows are tuned rows.** They are the corpus the brief was built against, so the followed lines say nothing about fresh requests.
3. **Each row ran once.** The range around each rate is wide. Repeats wait on the operator.
4. **The two arms differ in more than the brief.** A paired gain or loss is not the brief's effect alone.
5. **The offer on a stored run of a runtime other than Claude is the Claude hook's replay.** It was recorded when the run was made, so `offered` and `notOffered` on those lines say what the Claude head carried.

The outcome target waits on the operator: a gain target, an absolute followed rate or a written waiver, with the gain target recommended. The new behaviour arm and the work that raises the sealed reach wait on the operator too.
<!-- /ANCHOR:limitations -->
