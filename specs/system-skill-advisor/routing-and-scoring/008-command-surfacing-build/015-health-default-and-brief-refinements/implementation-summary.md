---
title: "Implementation Summary"
description: "Built and verified on 2026-11-13. The phase builds research segment three ranks 1, 2, 3, 4, 5, 9 and 11 plus the unsafeNoChangedPath count. The advisor suite went from 1744 to 1755 passed with 0 failed, every floor held and all 14 acceptance criteria are Met. The work is in the working tree on top of 2549786f28 and is not committed yet."
trigger_phrases:
  - "health default and brief refinements implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements"
    last_updated_at: "2026-11-13T11:33:52Z"
    last_updated_by: "claude"
    recent_action: "Recorded the build evidence, marked all 14 acceptance criteria Met and closed the phase"
    next_safe_action: "Run review pass two and research segment four"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "closeout-015-health-default-and-brief-refinements"
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
| **Spec Folder** | 015-health-default-and-brief-refinements |
| **Completed** | 2026-11-13. AC-001 to AC-014 are `Met` |
| **Commit** | Not committed. The code is in the working tree on top of `HEAD` `2549786f28`, and the coordinator commits it after this close-out |
| **Level** | 2 |
| **Verified on** | `scratch/after.txt`, `scratch/boundaries.txt` and the wave 6 files in `scratch/` ran on the working tree over `2549786f28`. The close-out reran every task verify command and the targeted test files from the same tree on 2026-11-13 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every hook install except OpenCode now writes a health record on each prompt, with no prompt, skill label or error text, and `advisor_status` reports how often an answer came from the CLI's local scorer and when the newest record was written. A brief shows `(needs a mode)` only when the prompt names the hub. The top hub names the command its route picked even when a lower row carries it. OpenCode sends the head entry alone, and the brief-cost script reads live heads only.

### Phase 15: health-default-and-brief-refinements

This phase builds ranks 1, 2, 3, 4, 5, 9 and 11 of the ranked table in `../009-ux-performance-cross-cli-research/research/research-segment-3.md`, plus the `unsafeNoChangedPath` count the coordinator added beside rank 11.

The diagnostic sink writes the record without `skillLabel` and `errorDetails` when `SKILL_ADVISOR_DEBUG` is unset, and the whole record when it is set. Both go through the existing 200-record trim, so 301 default writes leave 200 lines. The CLI fallback marks a local-scorer answer with `metrics.degraded`, and the Claude hook passes it into the record. The health section reports `rollingDegradedRate` and `lastRecordAt`. `advisor_status` carries both fields under its strict schema, and the `/doctor:setup` advisor leg prints them. When no record exists the leg says no prompt hook has written one, and it no longer names the debug variable as the reason.

`routeNeedsMode` takes the skills the prompt names and returns false for a hub the prompt never named. The recaptured baseline reads `needs_mode_floor` 1 of 35 and lists one row, `nm-system-skill-advisor-01`. Under `compiledRouteTopOnly` the top hub keeps its routed command, so the live head for the create-agent tune row reads `/create:agent (start)`. The OpenCode transform no longer pushes the compiled-route line that read `targets=none`.

The brief-cost script counts head bytes, marks each row live or not and takes every byte statistic over live rows. With no live head it prints `degraded_brief` and exits 2. The transcript scorer counts `deliveryUnknown` on every run line and tallies `unsafeNoChangedPath` beside `unsafe`, which is computed as before. `promptSessionId` names the one added DSH session whose first user record equals the prompt, and the behaviour runner uses it when the store gained several sessions.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `HK` is `.skilled/skills/system-skill-advisor/hooks`, `RA` is `ADV/scripts/routing-accuracy` and `SKA` is `.skilled/skills/system-skill-advisor`. `git -c core.fsmonitor=false diff HEAD --stat -- .skilled .opencode/plugins` prints `30 files changed, 477 insertions(+), 73 deletions(-)`, and one new test file is untracked.

| File | Action | Purpose |
|------|--------|---------|
| `ADV/lib/metrics.ts`, `ADV/tests/handlers/advisor-status.vitest.ts` | Modified | The default record, `degraded`, `rollingDegradedRate`, `lastRecordAt` and the cases that pin them |
| `ADV/lib/skill-advisor-brief.ts`, `HK/lib/skill-advisor-cli-fallback.ts`, `HK/claude/user-prompt-submit.ts` | Modified | The degraded flag from the fallback through the hook into the record |
| `ADV/handlers/advisor-status.ts`, `ADV/schemas/advisor-tool-schemas.ts` | Modified | `hookHealth` gains the two fields under its strict schema |
| `ADV/lib/command-attach.ts`, `ADV/tests/command-attach.vitest.ts` | Modified | `routeNeedsMode` takes the named skills |
| `ADV/handlers/advisor-recommend.ts`, `ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modified | The caller passes the named skills, plus the top-only guard and its case |
| `RA/capture-command-routing-baseline.mjs`, `RA/command-routing-baseline.json`, `ADV/tests/command-routing-slice.vitest.ts` | Modified | `needs_mode_floor` and `needsModeRows`, no holdout id in the list, and the recaptured baseline |
| `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `ADV/tests/compiled-routing-consumption.vitest.ts` | Modified | No compiled-route push, with the plugin assertions and the consumption case held to it |
| `ADV/scripts/measure-brief-cost.mjs`, `ADV/tests/measure-brief-cost.vitest.ts` | Modified, Created | Live heads, the refusal and its stub-hook test |
| `RA/score-command-transcripts.mjs`, `ADV/tests/command-transcript-score.vitest.ts` | Modified | `deliveryUnknown` per run line and `unsafeNoChangedPath` |
| `RA/command-offer.mjs`, `ADV/tests/command-offer.vitest.ts`, `RA/run-command-behaviour.mjs` | Modified | `promptSessionId`, its three cases and its use for a DSH turn |
| `.skilled/commands/doctor/assets/doctor-setup.yaml`, `.skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs` | Modified | The advisor leg text and the reason its test pins |
| `HK/skill-advisor-hook.md`, `HK/skill-advisor-hook-validation.md`, `SKA/ARCHITECTURE.md`, `SKA/feature-catalog/hooks-and-plugin/claude-hook.md`, `RA/README.md` | Modified | The default record, the diagnostics sink, the bounding option's remaining role, the new keys and the refusal |
| `scratch/` | Created | Before and after numbers, the boundary checks, the wave 6 probe outputs, the debug-set probe, 27 worker briefs and 54 log files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash max workers ran through OpenCode, one task per worker. The 20 planned worker tasks, T003 to T022, ran in waves 1 to 3. T024 and T025 ran in wave 5. The five wave 4b tasks, T035 to T039, ran the same way. `scratch/briefs/` holds 27 briefs, and `scratch/logs/` holds one `.out` and one `.err` file per brief.

Three independent Opus verifiers checked T003 to T022. Each read the diff and reran the Verify clauses. The coordinator's record of those runs reads 20 of 20 PASS with no blocking defect in the task work. The verifier reports are not stored in `scratch/`.

Wave 4b came from the verifier reports and the first full-suite run. The coordinator checked T035 to T039 directly by running their verify commands and the three test files they touch, which reported 87 passed. No separate verifier read them.

The coordinator ran T001, T002, T023, T026 to T028 and T030 to T033. An Opus agent ran T029. Every Vitest command ran as `env -u AI_SESSION_CHILD npx vitest run`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A health record by default, with the skill label and the error text behind the debug variable | The gate was added for writes nobody read. `hookHealth` and the advisor leg read them now, and the health reader needs neither field |
| The label rule counts 1 floor row of 35, not 0 | `nm-system-skill-advisor-01` names `sk-doc`, the hub that tops it, so a stricter rule would also drop the label from prompts that ask for the hub |
| `needsModeRows` lists a row only when the capture may publish it | The list names rows with their outcome, so a holdout row stays out of it as it stays out of the row maps. The slice test's holdout check now covers the list |
| Wave 4b (T035 to T039) was added before wave 5 | It fixes what the verifiers and the first full-suite run flagged: 8 holdout ids in `needsModeRows`, missing cases in two test files, two doc sentences that named the wrong sink and one consumption case that still expected the removed OpenCode line |
| T030's degraded answer is recorded, and no code changed | The task accepts either answer. The refusal is the behaviour the script was changed to have |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T032 `VALL` | The first run read `1 failed \| 1754 passed` over 183 files. The failing case was `injects an additive compiled-routing line when a decision is served` in `tests/compiled-routing-consumption.vitest.ts`. After T039 the rerun read 183 files and 1755 tests passed, 6 skipped, 0 failed, exit 0. Before: 182 files and 1744 passed |
| T032 `FLOOR` and `EVAL` | Typed recall `{"correct":24,"total":44}`, false offers `{"count":0,"total":35}`, plain tune `{"own":8,"attached":15,"combined":23,"total":45}`, attached false offers `{"count":0,"total":35}` and `[160,50,21,5]`, each equal to `scratch/before.txt` |
| T032 `TC`, `NPL`, `DALL`, `DRV`, `SRM` | Exit 0, `pass 42` and `fail 0`, `pass 1188` and `fail 0`, `{"status":"fresh","changed":[]}` and `256 mirrors across 10 trees are in sync` |
| T024 baseline | `{"count":1,"total":35}` and `["nm-system-skill-advisor-01"]`. The T003 `diff` against `HEAD` printed nothing. An exact id match against the 44 holdout ids in the corpus finds 0 in `needsModeRows` |
| T026 health record | Lines 4 before and 5 after, tail `[false,false,"claude","ok","2026-11-13T10:37:01.497Z"]` and `hookHealth.lastRecordAt` `2026-11-13T10:37:01.497Z` with `rollingDegradedRate` 0 |
| Debug-set record | `scratch/debug-set-probe.txt`: with `SKILL_ADVISOR_DEBUG=1` the built sink wrote `"skillLabel":"sk-doc","errorDetails":"probe detail"`, and with it unset both read `null` |
| T023 restart and T027 heads | The worktree daemon was stopped and the next hook run started it on the new build. All four heads read `Advisor: live`. The create-agent head holds `/create:agent (start)`, the save head holds no `(needs a mode)` and both hub heads hold it |
| T028 render probe | `pluginEntries` length 1 on all nine labels |
| T029 DSH session | `chosen: session-ee6df6b3-bda7-4ec2-9a37-ebb1360794a1`, the candidate with 108 records. No `FINAL` line names that id |
| T030 brief cost | `{"error":"degraded_brief","rows":44,"liveRows":0}`, exit 2, with the worktree daemon running |
| T031 final arm | `{"claude":[0,0,0],"devin":[0,2,1],"dsh":[1,2,2],"opencode":[24,2,0],"pi":[0,1,1]}`, the planned SC-002 line. DSH `deliveryUnknown` moved from 0 to 1 |
| T033 boundaries | `AGENTS.md`, `.skilled/commands/create`, `render.ts` and the golden test are unchanged, the label scans print nothing, the package diff stat is empty, the two playbooks still set `SKILL_ADVISOR_DEBUG=1` and the status lists only files the tasks name |
| Close-out reruns | Every verify command of T003 to T039 printed its expected output. 15 targeted test files reported 297 passed with exit 0, `tests/measure-brief-cost.vitest.ts` reported 2 passed, `TC` exited 0 and `NPL` reported `pass 42` and `fail 0` |
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| 20 worker tasks plus T024 and T025 | 25 worker tasks. Wave 4b added T035 to T039 | The verifier reports and the first full-suite run named five gaps |
| `needsModeRows` lists every row whose head would read `(needs a mode)` | It lists only rows the capture may publish | The first list named 8 holdout row ids with their outcome, which the phase 014 rule forbids |
| `tests/compiled-routing-consumption.vitest.ts` is not in the file list | T039 edits it | It still expected the OpenCode compiled-routing line that T004 removed on purpose, and the first full-suite run failed that one case |
| `promptSessionId` gets no unit test (`spec.md` Q9) | T037 added three cases | A verifier named the missing cases |
| AC-001's debug-set clause is shown by the T012 cases and the T026 tail line | Neither reads the record with the variable set. `scratch/debug-set-probe.txt` shows it | The close-out found no test that reads `skillLabel` back with `SKILL_ADVISOR_DEBUG` set |
| T030 prints a live cost | It printed `degraded_brief` and exited 2 | The sandboxed hook the script uses could not reach a live advisor on this machine |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live brief bytes were not measured in this phase.** T030 exited 2 with `liveRows` 0 while the worktree daemon was running. The sandboxed hook the script uses could not reach a live advisor on this machine. This is an open point for a run whose hook reaches a live advisor.
2. **The default health log is re-read after each append.** The trim keeps the file near 300 lines at most, and the read happens after the hook's output is sent. It is recorded and not built.
3. **Hook tests that do not stub the persist step now write a real log.** The log lands under the temp folder and holds prompt-free records only.
4. **The behaviour runner passes a `dshHome` option the DSH reader does not read.** The reader resolves the same folder today, so the result is the same.
5. **T003 added an unrequested `route !== undefined` guard.** It changes no result.
6. **No vitest case reads a record written with the debug variable set.** The debug-set probe in `scratch/` shows the whole record is written.
7. **Review pass two has not run.** It reviews this code and is the packet's gate, not this phase's.
<!-- /ANCHOR:limitations -->

---
