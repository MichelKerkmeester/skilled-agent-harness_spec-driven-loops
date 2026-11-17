# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-2`, pass two)
- Session: `fanout-accuracy-runner-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Dimension: D1 Correctness, changed-code pass
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (12 review actions)
- Operator review focus bound as `review_focus`: pass-two review of command surfacing in the `accuracy-runner` area. This iteration takes the files marked `yes` in `review-scope-2.txt` and reads the changed regions line by line for a defect the pass-one fix introduced or left behind, with a concrete input per finding.
- How this iteration addressed the focus: it read `command-offer.mjs` end to end, the runner's arm/backfill selection and turn loop, the new `needsMode` path in the capture, and `measure-brief-cost.mjs`, then tested each candidate against a command line or function input. Cross-runtime behaviour, mutating-command safety and holdout hygiene are re-checked in iteration 3.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:1-459`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:760-925,930-1299`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:300-414,662-699`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:1-279`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:88-114`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:92-118`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A started-command row selected by `--row-id` is logged under the `pre` arm** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:974` -- `armFor` gives a run the `g2` arm only when `options.set === 'g2'`. A g2 row can also be selected explicitly: `assertRunnable` (line 781-784) bypasses the corpus lookup for every id in `G2_PROMPTS`, so `--row-id g2-deep-review-typed` is a legal selection. That path reaches `main` line 1232 with `options.set === null`, and `armFor` returns `DEFAULT_ARM` (`pre`). The run line at line 1134 then carries `arm: "pre"` for a fifteen-minute started-command turn. The scorer groups by arm (`armOf`, `score-command-transcripts.mjs:1009-1012`), so the g2 row joins the chat pre-arm and is compared with rows it was never meant to share an arm with. The code comment at line 940-944 claims the started-command set "carries its own arm, so a run of it cannot land in the change comparison by omission"; the explicit-id path contradicts it.
Finding class: measurement-correctness / arm attribution
Scope proof: both files are in the declared scope; the finding concerns only how a selected row is labelled, not what the turn does.
Affected surface hints: `run-command-behaviour.mjs` `armFor` and the run line; `score-command-transcripts.mjs` arm bucketing; any comparison that reads `pre` vs `g2`.
Case: `node run-command-behaviour.mjs --runtime claude --row-id g2-deep-review-typed --out /tmp/run.jsonl` writes a line whose `arm` is `pre`; a later `score-command-transcripts.mjs --summary /tmp/run.jsonl` prints that started-command row under `claude pre`, so the g2 arm is empty and the pre arm holds a turn the design says it cannot.

2. **`--backfill` replays a started-command row with the default fixture path, even when the run used a custom `--fixture`** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1214` -- The run resolves the fixture as `options.fixture ?? resolve(dirname(options.out), 'g2-fixture')` (line 793-795) and substitutes it into the prompt for every g2 row (line 799-803). The backfill has no `--fixture` flag and re-derives it from the log's folder: `resolve(dirname(options.backfill), 'g2-fixture')`. The run line records no fixture path. So a g2 arm run with `--fixture /tmp/special-fixture` and later backfilled will replay `/deep:research ... /tmp/g2-fixture/... :auto` instead of the prompt the turn actually ran. The offer recorded by `replayOffer` is a function of that prompt, so the backfill can record an offer for a prompt no session ever saw.
Finding class: measurement-correctness / replay fidelity
Scope proof: the finding is confined to the runner and its backfill path; the log line schema is the only other surface it names.
Affected surface hints: `run-command-behaviour.mjs` `fixtureDir` and `backfillLog`; `command-offer.mjs` `backfillRunLog`; any g2 run whose operator overrides `--fixture`.
Case: `--runtime claude --set g2 --fixture /tmp/special-fixture --out /tmp/g2/log.jsonl` then `--backfill /tmp/g2/log.jsonl --out /tmp/g2/backfilled.jsonl`; the replay asks the hook about `/tmp/g2-fixture/...`, a directory that does not exist, and the recorded `offeredCommand` describes that prompt rather than the measured turn.

3. **The capture leaves its environment projection installed after it returns, although its header promises a caller inherits none of it** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:361` -- `scoreCommandCorpus` writes `SYSTEM_SKILL_ADVISOR_DB_DIR`, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, `VITEST`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL` and `PYTHONDONTWRITEBYTECODE` into `process.env`, and deletes `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON`, `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW` and `SPECKIT_PRIVATE_SKILL_ROOTS`. The `finally` block (line 662-668) restores only `globalThis.Date` and removes `dbDir`; none of the environment is put back. The header at line 31-33 says "Setup runs on call, never on import: the environment projection, the clock pin and the scorer import all live inside scoreCommandCorpus(), so a harness may import this module and score in-process without inheriting either." A harness that calls the function and then scores again in the same process does inherit the projection, and the inherited `SYSTEM_SKILL_ADVISOR_DB_DIR` names a directory the `finally` has already deleted.
Finding class: process-isolation / measurement-correctness
Scope proof: the finding is inside the capture module and its own header claim; the only cross-file reference is the scorer it projects.
Affected surface hints: `capture-command-routing-baseline.mjs` `scoreCommandCorpus`; any in-process caller such as `tests/command-routing-slice.vitest.ts`; a second `scoreAdvisorPrompt` call in the same process.
Case: a Node harness does `await scoreCommandCorpus()` then `scoreAdvisorPrompt(prompt, { workspaceRoot })` expecting the operator's skill graph; the second call still has `VITEST=true`, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` and a `SYSTEM_SKILL_ADVISOR_DB_DIR` that no longer exists, so it runs under the fixture projection or reports a missing graph instead of scoring the checkout.

4. **`measure-brief-cost.mjs` measures the child-session brief when it runs from a dispatched worker** -- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:167` -- The hook is spawned with `env: { ...process.env, SPECKIT_IPC_SOCKET_DIR: socketDir }`, so `AI_SESSION_CHILD` reaches the hook unchanged. `render.ts:533` reads `options.childSession ?? process.env.AI_SESSION_CHILD === '1'`, and the child branch downgrades the label (for example `(parent-named only)` instead of the command and policy). The measured `bytes`, `headBytes` and `live` are then the child brief's, and because the head still starts `Advisor: live` the run reports `liveRows > 0` and no refusal. The module header says the bytes are "what the Claude prompt hook actually sends the model for one typed command prompt"; in a dispatched worker that is a shorter, differently worded brief than a user's session receives.
Finding class: measurement-correctness / ambient-environment coupling
Scope proof: the finding is confined to the cost script and the renderer branch it depends on; no other measurement file is named.
Affected surface hints: `measure-brief-cost.mjs` `measureRow`; `render.ts` child-session branch; any cost figure captured from a dispatched worker.
Case: an operator runs the script from a session whose environment carries `AI_SESSION_CHILD=1`; the hook renders the child form, `headBytes` drops, `live` stays true, and the printed `totalBytes`/`medianBytes` describe the child brief while the README presents them as the install's cost.

## Traceability Checks

- `spec_code`: partial. The capture's published rows and the committed baseline still agree at the structural level (132 rows, no holdout ids). The three new findings are behaviour defects in the harness, not baseline drift, so no floor moved.
- `checklist_evidence`: partial. No parent checklist; the phase 007 note remains the only closure evidence for the per-runtime proof.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: partial. The arm and fixture defects are runtime-independent (they affect the log before any runtime runs), so no new per-runtime claim is made. The six argv tables were not re-read this iteration.
- `feature_catalog_code`: pending.
- `playbook_capability`: pending.

## Integration Evidence

- `run-command-behaviour.mjs` ↔ `command-offer.mjs`: the runner's `backfillLog` passes `promptFor` and the module resolves every prompt before writing, which is what makes finding 2 a wrong prompt rather than a partial write.
- `capture-command-routing-baseline.mjs` ↔ `tests/command-routing-slice.vitest.ts`: the test calls `scoreCommandCorpus()` in-process, the exact caller the header's promise is about and the exact caller finding 3 affects if any later test in that process scores again.
- `measure-brief-cost.mjs` ↔ `render.ts`: the script's only view of the brief is the hook's stdout, so every environment value that changes the head changes the measurement.

## Edge Cases

- **A finding's reach depends on a caller the repo does not ship.** Finding 3 needs an in-process second scoring call; the slice test does not make one today, so the finding is P2 rather than a failing gate.
- **Finding 4 is invisible from a normal shell.** `AI_SESSION_CHILD` is set only for dispatched workers, so an operator's own run measures the user brief. The case is real in this repository's dispatch model, not hypothetical.
- **No live run to confirm finding 1's downstream effect.** The worktree is dirty, so the arm label was proven from the selection code and the `armFor` expression; the scorer's bucketing was read, not observed.
- **Holdout text was not read.** `command-prompts.jsonl` was parsed only in iteration 1 for ids and splits; this iteration read no corpus rows.

## Confirmed-Clean Surfaces

- `command-offer.mjs`'s refusal path: `backfillRunLog` resolves every prompt before it writes, and a refused row leaves no output file.
- `command-offer.mjs`'s match rules: `parseOffer` reads the policy only when it directly follows the command, and `briefDelivered` returns `unknown` rather than a miss when the store cannot be read.
- The runner's per-turn guards: the head/stash snapshot, the restore-before-replay order, and `EXIT_HEAD_MOVED` skipping the restore are consistent with the README.
- `measure-brief-cost.mjs`'s holdout and unknown refusals fire before the hook is spawned, and the degraded-brief path exits 2.

## Ruled Out

- **`parseOffer` reading a trailing word as part of the command.** Ruled out for the renderer's own head shape: after the command comes ` (policy)` or a space and a digit, and neither matches the optional second word. A two-word tracked command such as `/doctor:overlay apply` is matched whole, which is the intent.
- **`replayOffer` replaying the wrong hook for a non-Claude runtime.** Documented design: the head is the only text that names command and policy, and the replay is explicitly the Claude hook (`README.md:71`). Re-reporting it would be a deferred-item repeat, not a new defect.
- **`backfillRunLog` writing a partial log.** Ruled out: every prompt is resolved before the first line is written.
- **`measure-brief-cost.mjs` leaking a prompt.** Ruled out: output rows carry id and sizes only, and a refused row prints its id, never its prompt.

## Next Focus

- Dimension: security
- Focus area: `childEnv` and its callers, the arena builder's dotenv and destination guards, the live-arm refusal order, and holdout hygiene across the capture, scorer, runner and cost script
- Reason: iteration 2 closed the correctness read of the changed code; security is the next risk-ordered dimension and the pass-two focus names credential reach, mutating-command safety and holdout hygiene
- Rotation status: D1 complete, D2 next
- Blocked/productive carry-forward: productive (line-by-line changed-code read); blocked (no live arm)
- Required evidence: the exact env name or file path that crosses the boundary, and the line that permits it

Review verdict: PASS
