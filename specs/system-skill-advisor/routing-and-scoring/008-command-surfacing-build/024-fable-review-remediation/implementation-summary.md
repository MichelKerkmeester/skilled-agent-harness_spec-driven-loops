---
title: "Implementation Summary: Phase 24: fable-review-remediation"
description: "A Codex shell step now reaches the transcript scorer with its command text, so the stored Codex runs can show a load. The mention reader withholds a command from two refusals and a question and keeps it for three real requests. The scorer no longer counts a search or a heredoc line as a load and follows a cd inside one command."
trigger_phrases:
  - "fable review remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/024-fable-review-remediation"
    last_updated_at: "2026-11-14T15:45:00Z"
    last_updated_by: "claude"
    recent_action: "Closed the phase with every acceptance row marked from the scratch evidence"
    next_safe_action: "Coordinator commits the ten changed files and the phase docs, then opens phase 025"
    blockers: []
    key_files:
      - "scratch/after.txt"
      - "scratch/repro-after.txt"
      - "scratch/rescore-delta.txt"
      - "scratch/boundaries.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-024-fable-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Relabel of slash-variant rows sv-09, sv-11 and sv-12 (finding 9). Waiting on the operator"
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
| **Spec Folder** | 024-fable-review-remediation |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
| **BASE** | `60968af043`, the start of lanes A, R and F (T001) |
| **BASES** | `4a622e419f`, the start of lane S after phase 023 committed (T003) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Codex run can now show the workflow it opened. Before this phase all 58 Codex shell steps of the before arm and all 53 of the after arm reached the scorer with no command text. Now 7 of 58 and 4 of 53 do, and those are bodies that call no shell command or pass their commands through a list. A person who refused a command no longer gets it offered, and a person who asked for one keeps it.

### Phase 24: fable-review-remediation

This phase closes findings 1, 4, 5, 6 and the rest of 7 of the review of 2026-11-14 and the P022 reversal (decision P024). The Codex reader keeps the body of a custom tool call as `arguments.input`, and the scorer reads the `cmd` strings of that body as one shell step. The mention reader reads `no need to run` and `stop using` as refusals, keeps the command on `why not use` and on a later `run it` bound to the nearest command, and ends a sentence at a question mark. The scorer counts no search and no heredoc line as a load, reads a bare document name in the folder an earlier `cd` entered, reads the `cmd` key of a Codex `exec_command` call and counts a command on the partner side in `offeredAsPartner` and not in `offered`. The plugin timing test now checks the delays the plugin schedules instead of wall-clock time.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/shared/session-readers/codex.mjs` | Modified | Keeps a custom tool call's body under `arguments.input` (T009) |
| `.skilled/hooks/shared/session-readers/codex.d.mts.map` | Modified | Regenerated declaration map of the reader. The T009 verify line was amended to name it |
| `.skilled/hooks/shared/tests/session-readers/codex.test.mjs` | Modified | A custom tool call case and a function call case (T009) |
| `.skilled/hooks/shared/session-readers/README.md` | Modified | States where a custom tool call's body sits, line 32 (T010) |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modified | Refusal leads, the `why not` exception, the later `run it` and the question mark (T004 to T008, T025, T026) |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | Modified | A failing case first and a guard case beside every new lead |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | Codex exec body, search, heredoc, `cd`, partner offer and the `cmd` key (T011 to T016, T027, T028) |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | One failing case first for each scorer rule |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | The Codex body rule, the three shell-read rules, `offeredAsPartner` and the three designed withholds (T017) |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modified | The termination grace test checks scheduled delays (T024) |

`git diff --name-only BASE` also lists `capture-command-routing-baseline.mjs`, `command-routing-baseline.json`, `command-prompts.jsonl` and `command-routing-slice.vitest.ts`. Phase 023 committed those between BASE and BASES (`scratch/boundaries.txt:25-32`), and this phase did not touch them.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four worker lanes ran test first. Lane A (mention reader) and lane R (Codex reader) started after T001 and T002 recorded the before numbers at BASE. Lane F (plugin test) ran beside them. Lane S (scorer) waited for phases 022 and 023 to be Complete and committed, then started at BASES. Lane D wrote the README after lane S. An Opus verifier checked every worker task. The coordinator then ran every suite (T018), the floor capture (T019), the seven probes (T020), the rescore of both stored arms (T021) and the boundary checks (T022). Nothing was committed by this phase.

### The six review prompts, row 0 before and after

The `OFFERS` probe prints the head row for each prompt the review wrote. Before is `scratch/repro-before.txt`, after is `scratch/repro-after.txt:52-75`. The two control prompts that follow print the same rows before and after.

| Review prompt | Row 0 before | Row 0 after |
|---------------|--------------|-------------|
| `no need to run /doctor:setup, the hooks are fine` | command-doctor-setup, `command=/doctor:setup policy=run` | system-skilled-doctor, `command=-` |
| `stop using /create:changelog for this, write the changelog entry by hand` | sk-doc, `command=/create:changelog policy=ask` | sk-doc, `command=-` |
| `I have not run /speckit:plan yet, please start it for the login feature` | system-spec-kit, `command=-` | command-speckit-plan, `command=/speckit:plan policy=start` |
| `I already ran /create:readme but the output was wrong, run it again for the hooks folder` | sk-doc, `command=-` | sk-doc, `command=/create:readme policy=start` |
| `why not use /create:agent for this? go ahead and make a security reviewer agent` | sk-doc, `command=-` | create:agent, `command=/create:agent policy=start` |
| `quick question? is /speckit:resume safe to run twice` | system-spec-kit, `command=/speckit:resume policy=start` | system-spec-kit, `command=-` |

### Codex lines of the rescore

From `scratch/rescore-delta.txt:3-4,14,24`, over the stored arms `runs-pre.jsonl` and `runs-post.jsonl` of phase 007. The final arm summary holds no Codex runtime, so there is no Codex post workflow line.

| Runtime and arm | Measure | Before | After | Moved by |
|-----------------|---------|--------|-------|----------|
| codex post | start | 0 of 12 | 0 of 12 | nothing moved |
| codex pre | start | 0 of 12 | 0 of 12 | nothing moved |
| codex pre | workflow | command 0, skill 0, none 16, followedRate 0 of 16, loadRate 0 of 16 | command 2, skill 2, none 12, followedRate 4 of 16, loadRate 4 of 16 | T009 and T011, the exec body read as shell commands |

The parent goal log row (`../goal.md:278`) quotes the same numbers: codex pre start 0 of 12 and codex post start 0 of 12 before and after, so the start rate that criterion 3 quotes did not move, and Codex pre loadRate 0 of 16 before and 4 of 16 after.

### Every count that moved

Each attribution comes from `scratch/rescore-delta.txt:24-27`, found by scoring with that rule undone.

| Runtime and arm | Row | Change | Task |
|-----------------|-----|--------|------|
| codex pre | cmd-deep-ai-council-plain-tune-01 | none to command | T009 and T011 |
| codex pre | cmd-doctor-agents-md-plain-tune-01 | none to command | T009 and T011 |
| codex pre | cmd-deep-review-plain-tune-01 | none to skill | T009 and T011 |
| codex pre | cmd-doctor-deep-loop-plain-tune-01 | none to skill | T009 and T011 |
| pi pre | cmd-create-feature-catalog-plain-tune-01 | skill to none, a search is not a load | T012 |
| pi pre | cmd-create-diff-plain-tune-01 | improvised to skill, a `cd` inside one command | T014 |
| opencode post (final arm) | cmd-doctor-deep-loop-plain-tune-01 | otherMode to none | T012 |

Net, pi pre moved improvised 2 to 1 and none 7 to 8 with skill unchanged at 4, and opencode post moved otherMode 1 to 0 and none 1 to 2. No other runtime and arm moved a count, and no start rate moved in any of the 12 start lines. These are counts and reasons only, not a gain or a loss.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The Codex record keeps its shape and `arguments` stays an object (D1) | The scorer, the history lookup, four hooks and the OpenCode plugin read the record. One added key under `arguments` reaches the scorer without changing what the history lookup, the hooks or the plugin read, and RT, HT and VP still pass |
| A question mark ends a sentence before a bare ask word (P024 supersedes P022) | `quick question? is /speckit:resume safe to run twice` asks about the command and no longer gets a start offer |
| The plugin timing test is fixed after all (P032 supersedes P028 for it) | T002 reproduced the failure 2 times of 20 under load, so the item was no longer unshown. Only the test changed and the plugin source is unchanged against BASE |
| A later `run it` binds to the nearest command only, and the cut skips a path or URL (T025, T026) | The T007 rule let an `it` meant for `/speckit:plan` mark `/speckit:complete` as asked for, and the first cut let `/tmp/notes.md` hide a real request |
| Every changed count is attributed by undoing one rule (D5) | No rule was bent to make a stored run score better, and each moved row names the rule that moved it |
| The T009 verify line was amended to name `codex.d.mts.map` | The reader's declaration map is regenerated with the source, so the diff holds two files and not one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `VX tests/command-attach-guards.vitest.ts` | 104 passed at BASE (`scratch/before.txt:9`), 119 passed after (`scratch/after.txt:3`) |
| `VX tests/command-transcript-score.vitest.ts` | 151 passed at BASES (`scratch/before-scorer.txt:9`), 165 passed after (`scratch/after.txt:6`) |
| `VX tests/command-offer.vitest.ts` | 29 passed (`scratch/after.txt:9`) |
| `RT` session reader tests | pass 93 fail 0 before, pass 95 fail 0 after (`scratch/after.txt:11-13`) |
| `HT` history lookup tests | 30 passed before and after (`scratch/after.txt:16`) |
| `TC` typecheck | exit 0 (`scratch/after.txt:18`) |
| `VP` plugin tests | pass 45 fail 0 (`scratch/after.txt:20-22`) |
| `VALL` advisor suite | The first run failed 2 tests by timeout under load (a 30 s timeout and a timing bench), each passed twice alone. The rerun exited 0 with 2027 passed and 6 skipped (`scratch/after.txt:23-33`) |
| `FLOOR` before and after | `cmp` exits 0. Typed recall 24 of 44, false offers 0 of 35, plain holdout 1 of 44 (`scratch/floor-after.txt:1-5`). The slice test passed 9 of 9 |
| `MENTION` probe | `SHIPPED: 40 of 46 agree` before, `SHIPPED: 46 of 46 agree` after (`scratch/repro-after.txt:48`) |
| `CODEX` probe | Shell events with no command text 58 of 58 to 7 of 58 pre and 53 of 53 to 4 of 53 post (`scratch/repro-after.txt:109-110,138-139`) |
| `SHELL` probe | First eight lines end none, none, none, none, none, skill, skill and none (`scratch/repro-after.txt:145-152`) |
| Rescore | 12 start lines and 11 workflow lines, SUMOK true over both after files, both denominator `cmp` checks exit 0 |
| Boundaries | `AGENTS.md` unchanged against BASE (exit 0). Corpus and baseline unchanged against BASES (exit 0), and against BASE they differ only by phase 023's commit (exit 1). No package file changed and the comment id search printed nothing (`scratch/boundaries.txt:1-9`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Codex numbers are thin.** They come from tuned rows, one run each, and no brief reached Codex in either arm. A rate over 12 or 16 runs moves a lot on one run, so read the Codex rows as counts and not as an outcome.
2. **A body with a gate lookup and a task command reads as a gate step.** The scorer joins every `cmd` string of one exec body into one shell step, so a body that runs a lookup and a task command together is scored by the lookup. The routing-accuracy README states this rule.
3. **Eight exec bodies per arm still carry no command the helper can read.** They call web search or a tool listing, or pass their commands through a list. 7 of 58 and 4 of 53 shell events keep no command text (`scratch/repro-after.txt:110,139`).
4. **Declined on a probe, no code (D4).** The OpenCode plugin label for a needs-mode hub printed `same head with and without the label: true`, and the Claude hook label fallback printed `CLI rows over 5 prompts: 10, below the bars: 0, row 0 below the bars: 0` (`scratch/repro-after.txt:164,167`).
5. **The relabel of rows sv-09, sv-11 and sv-12 waits on the operator (finding 9, D3).** A relabel moves three rows into the false-offer tally, so the floor would read 0 of 38 where completion criterion 2 of the parent says 0 of 35 (`scratch/floor-after.txt:2` prints `{"count":0,"total":35}`).
6. **The plugin timing test was fixed in T024.** The flake probe printed `18 passed, 2 failed of 20 runs, slowest process 820 ms` before, with the failure `expected bounded timeout, got 370ms`. T024's own run before its edit printed 16 passed and 4 failed. After the edit it printed `20 passed, 0 failed of 20 runs, slowest process 382 ms` (`scratch/repro-after.txt:170`). A bound on every scheduled delay was declined because a queue timer may run longer than 40 ms.
7. **Smaller follow-ups declined on their task lines.** `stop here` plus a command reads as a refusal, accepted as rare (T005). A one-word path such as `/tmp` reads as a command with no colon, which no pattern can tell apart, and a file named like a command is too rare to earn a task (T026). A pin test on key order was declined because no reader emits both `command` and `cmd` (T028).
<!-- /ANCHOR:limitations -->

---
