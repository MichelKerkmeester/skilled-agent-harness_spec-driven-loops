---
title: "Implementation Summary"
description: "The workflow measure now counts what a run did: shell reads and prompt mirrors are loads, a write outside the checkout sets no boundary, a wrong-mode load and an ask that waited get their own values, and a followed rate sits beside the load rate."
trigger_phrases:
  - "workflow measure soundness implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/022-workflow-measure-soundness"
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Closed the phase after the gates and the rescore of both stored arms"
    next_safe_action: "Commit the phase, then start phase 023"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-352-command-surfacing-research"
      parent_session_id: null
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-workflow-measure-soundness |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The workflow measure now counts what a run did. Phase 019's load rate missed runs that read a workflow through the shell or a prompt mirror, and it called a run improvised when its first write was a scratch file outside the checkout. Rescored with the same stored sessions, the final-arm followed rate reads claude 8 of 16, devin 16 of 16, dsh 13 of 15, opencode 14 of 16 and pi 12 of 16.

### Phase 22: workflow-measure-soundness

The packet's question is whether a model takes a real workflow more often, so the measure has to see a workflow load in every shape a runtime uses. A load is now a read tool, a skill tool, a shell command that reads the document (`cat`, `sed -n`, `head` and the other readers, not an in-place `sed`) or a `prompts/<namespace>-<name>.md` mirror. A write outside the run's checkout, such as a temp note, no longer sets the boundary a load has to come before. A load of another mode under the owning hub is `otherMode`, apart from the skill's own load. An ask row whose run offered the command and waited is `asked`, and `askedActed` counts the asked runs that worked the task first. `followedRate` is `command + skill + asked` over every owned scored run. `loadRate` keeps its rule and now shares that denominator, the six path counts, so no owned run leaves it. On the offer side, `parseOffer` says whether the command sat on the head or on its partner (`offeredAs`), and a head quoted inside a tool result no longer counts as a delivered brief.

The start commit `BASE` is `47577daa6f`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | Shell and mirror loads, confirm stems, mode-aware path, ask path, checkout-aware boundary, the new counts and `followedRate` |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | 82 to 139 cases, one or more per rule |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs` | Modified | `offeredAs`, the tool-result rule and the replay note in the header |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts` | Modified | 25 to 29 cases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | Names the new fields, the load shapes and the delivery rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash max workers on OpenCode Go wrote one task each in three lanes that owned different files, test first. An Opus verifier checked each code task before the next in its lane, and the coordinator checked the README task directly. Five checks found a defect or a gap, and each became a new task with the next free id rather than an edit to the old one: T029 (a mode that keeps its workflow in another mode's folder), T030 (the `~` rule and two false comment facts), T031 (a command that ends a sentence), T032 and T037 (an in-place `sed` is a write), T033 (the ask check used the old boundary) and T034 to T036, T038 and T039 (test cases for rules no test pinned, T039 the holdout refusal). T005 kept three design confirm stems its line did not name, recorded as P023.

The coordinator then ran every suite, rescored both stored arms with `OPENCODE_DB` unset, diffed each row's path under the `BASE` scorer and the current one, and reran the two probes.

| Runtime | Before arm load rate, `BASE` to now | Final arm load rate, `BASE` to now | Final arm followed rate | Final arm `askedActed` |
|---|---|---|---|---|
| claude | 4 of 16 to 5 of 16 | 6 of 16 to 6 of 16 | 8 of 16 | 2 of 2 asked |
| codex | 0 of 16 to 0 of 16 | not run | not run | not run |
| devin | 12 of 16 to 12 of 16 | 15 of 16 to 15 of 16 | 16 of 16 | 1 of 1 asked |
| dsh | 10 of 16 to 12 of 16 | 12 of 15 to 13 of 15 | 13 of 15 | 0 asked |
| opencode | 9 of 16 to 10 of 16 | 7 of 16 to 13 of 16 | 14 of 16 | 1 of 1 asked |
| pi | 3 of 16 to 7 of 16 | 5 of 16 to 12 of 16 | 12 of 16 | 0 asked |

`scratch/workflow-delta.txt` names each of the 34 rows that moved and the task whose rule moved it. The largest moves are pi and opencode, whose runs read workflow documents through the shell: the probe counted 7 and 6 such missed loads in the final arm before this phase and 0 after.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A failed check becomes a new task, the passed part stays ticked | Each task's line stays the record of what its worker was asked, and the fix is checked on its own |
| Keep the three design confirm stems T005's worker added (P023) | The task's own on-disk guard failed without them, they match the command docs, and no stored run names a design command |
| The followed rate replaces the phase 019 load rate as the packet's number | An ask row that offered and waited took its workflow's own first step, so leaving it out understated ask rows, and the load rate stays beside it with the same denominator |
| `rg` and `grep` over a workflow document still count as a load here | The task named eleven readers. The Fable review of 11:40 questioned it, and phase 024 decides it with a probe |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Transcript scorer tests | PASS, 139 passed, 0 failed, 82 before |
| Offer tests | PASS, 29 passed, 0 failed, 25 before |
| Typecheck in the advisor runtime | PASS, exit 0 |
| Full advisor suite | PASS, 184 files, 1983 passed, 6 skipped, 0 failed, 1922 at the end of phase 021. One earlier run failed once in `advisor-validate.vitest.ts`, a file this phase does not touch, and passed in two single-file reruns and a full rerun |
| Count identity over both after files | PASS, `SUMOK` prints `true` twice |
| Load rate denominators | PASS, both `cmp` of the `DEN` files print nothing and exit 0 |
| Old fields | PASS, `share`, `loadRate` and `noneActed` present in every block |
| Delta file | PASS, 11 runtime and arm lines, 34 moved rows, each with a rule |
| Reproductions | PASS, `skill,command,command,command,otherMode,skill,asked`, `offeredAs` `partner` once, no missed shell load or prompt mirror left |
| Boundaries | PASS, five files, no `AGENTS.md`, package or comment-id change, phase 019 folder clean |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A load is not a followed step.** The rate counts a workflow opened before the first write, not each of its steps run. A step-level check of stored runs waits on the operator.
2. **The rows are tuned.** These are the 16 tuned command rows the behaviour arms ran, so the rate says nothing about requests nobody tuned for. Phase 023 adds sealed reach and fit counts, and a behaviour arm on untuned rows waits on the operator.
3. **Each row ran once.** One run per row and runtime gives no spread, and phase 023 adds a range beside each rate.
4. **The offer on a stored run of a runtime other than Claude is the Claude hook's replay.** It was recorded when the run was made, and no rescore rewrites it.
5. **Codex shows no load.** Every Codex shell step reaches the scorer with no command text, so the Codex before arm moved on no row. Phase 024 plans the reader fix and a rescore.
<!-- /ANCHOR:limitations -->
