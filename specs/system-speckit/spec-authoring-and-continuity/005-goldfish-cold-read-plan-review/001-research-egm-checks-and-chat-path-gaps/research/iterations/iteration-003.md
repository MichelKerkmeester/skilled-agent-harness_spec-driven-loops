# Iteration 3: The smallest change set — assembled, priced, and what not to build

## Focus

Assemble the recommendation the topic asks for: **the smallest set of changes to existing files that keeps a chat-started loop on its workflow**, how that set applies to `deep-review` and `deep-ai-council`, and what should not be built. Focus taken from strategy Section 11 (Next Focus) verbatim; iterations 1 and 2 produced the findings this iteration assembles.

This iteration also closes the last open key question — which existing checks could have caught the incident, and why none did — by completing the positive half iteration 2 left untested.

**Ambiguity resolved:** "the smallest set" has two readings — smallest *edit count*, or smallest *surface that cannot be bypassed*. Read as the second, because a one-line prose edit is the smallest edit count and the incident is direct evidence that prose at that line did not hold. Deferred: whether a legitimate fan-out run should run packet-level `phase_init`/`phase_save` at all (Finding 8); that is a design change larger than this set and is named rather than folded in.

## Actions Taken

1. Re-read the incident record and re-derived the decision point from it: the session called `fanout-run.cjs` with one lineage through `--fanout-config-json`, an internal flag.
2. Read the command-doc flag table and policy paragraph (`.skilled/commands/deep/research.md:111-128`) and grepped every document for `--fanout-config-json` to establish where that flag is described.
3. Read the research YAML's fan-out step in full (`deep-research-auto.yaml:179-235`) for its two skip conditions, its script call, and its jump to `phase_synthesis`.
4. Read `fanout-run.cjs` at the expansion boundary (`3396-3418`), the flag allowlist (`30-36`, `121`), `inputError` (`125-129`), the anomaly collector and summary (`4244-4253`), and the exit-code path (`4272-4273`).
5. Read `lineage-timestamp-window.ts:1-110` for what the anomaly actually classifies, to test iteration 2's recommended change (3).
6. Read the council's dispatch site (`orchestrate-session.cjs:17`, `262-300`) and grepped `ai-council.md` for fan-out language, to price the guard for the council.
7. Read the review side's equivalents (`review.md:95-100`, `deep-review-confirm.yaml:185-216`, `deep-review-presentation.txt:88`) to establish whether review needs its own change.

## Findings

1. **The policy is written about one flag surface, and the script is entered through another.** The command doc's flag table lists `--executor`, `--executors` and `--concurrency`, and the policy sentence is defined over those. The flag that actually carries the lineage matrix into `fanout-run.cjs` is `--fanout-config-json`, which appears in **no** command doc and in **no** presentation policy table — only inside the four workflow YAMLs and one runbook. The incident's session did not have to contradict the policy to bypass it; it only had to reach the script by its real entry flag. Any guard keyed to the documented flags leaves that route open, which is why the refusal has to sit on the expanded lineage list rather than on flag parsing. [SOURCE: .skilled/commands/deep/research.md:121]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:229]
[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:210]
[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:234]

2. **The workflow already draws this boundary, twice, and both gates open for a one-entry array.** `step_fanout_spawn` is skipped on `config.fanout is absent`; its CLI sub-step is skipped on `no entries in config.fanout.executors`. A config carrying exactly one entry is present and has entries, so both conditions pass and the script is called — the same shape the incident produced. The YAML's belief is "fan-out exists or it does not"; the policy's rule is "fan-out means two or more labels". The gap between those two sentences is the incident. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:207]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:209]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223]
[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:208]

3. **The guard has three same-family precedents inside one screen of code, and the insertion point is a single line.** `fanout-run.cjs` expands the lineages at 3396; at 3397 it already refuses a policy-violating run in code (`stopPolicy=max-iterations` on an uncapped lineage) using `throw inputError(...)`; at 3408 it refuses a run whose capabilities do not preflight; at 121 it refuses unknown flags. `inputError` sets `code = 'INPUT_VALIDATION'` and the top-level catch emits `{status:'error', code:'INPUT_VALIDATION', error:<message>}`. A one-lineage refusal is the same block with a different predicate, inserted after 3396, before anything spawns. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3396]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3408]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:121]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:125]

4. **The conditional that makes the guard cheap is already written in the file, and it excludes the council by construction.** The existing policy guard's own predicate is `(loopType === 'research' || loopType === 'review') && ...`. Reusing it means the refusal lands on exactly the two loop types that reach the fan-out path through a workflow, and never on `council`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397]

5. **Corrective: the timestamp anomaly cannot see in-process iteration, so iteration 2's recommended change (3) is unsound.** The check classifies each state record's timestamp as `before_window`, `after_window` or `unparseable` against the lineage's own dispatch window. A record written *inside* that window is normal by definition — and every record an in-process lineage writes is inside it. The incident's symptoms (iterations 7, 9 and 10 sharing a modification second; iteration 3 modified after iteration 10) are all intra-window facts, so the field would have been absent or quiet. It is also folded into the summary unconditionally when non-empty, which means the wiring iteration 2 wanted already exists; there is nothing to escalate because there is nothing to escalate. Withdrawn: "escalate the already-computed timestamp anomaly". [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:5]
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:79]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4244]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4247]

6. **The council needs no change at all: it never enters `fanout-run.cjs`'s lineage runner.** `orchestrate-session.cjs` imports exactly one symbol from the script — `buildLineageCommand`, a spawn-argument builder — and spawns each deliberation seat itself in `runSeatSubprocess`. The council's command doc contains no fan-out, fanout or single-executor language, so there is no policy surface to bypass and no one-lineage fan-out shape to refuse. Combined with Finding 4, the guard is inert for the council on both counts. [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:17]
[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:262]
[SOURCE: .skilled/commands/deep/ai-council.md]

7. **`deep-review` inherits both defects and needs one of the two edits, not two.** Review states the identical policy paragraph; its fan-out step also runs before `phase_init` and is skipped on an empty executor list; it calls the same script with the same internal flag. So change 1 covers review with no review-specific code, and only the doc sentence needs a second copy. [SOURCE: .skilled/commands/deep/review.md:97]
[SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:208]
[SOURCE: .skilled/commands/deep/assets/deep-review-presentation.txt:88]

8. **The smallest set is three edits, and it is honest about what it does not fix.** (1) `fanout-run.cjs`: a one-lineage refusal after `expandLineages`, modelled on the `stopPolicy` guard, predicate `(loopType === 'research' || loopType === 'review') && allLineages.length < 2`, message naming both legal routes ("run the command's own workflow for a single executor; fan-out requires two or more labels"), with `--allow-single-lineage` added to the `FANOUT_FLAGS` allowlist so the three stress fixtures and any salvage call keep working. Cost: roughly ten lines plus one flag name. (2) `research.md:125` and `review.md:97`: one sentence appended to the policy paragraph stating that fan-out requires two or more labels and contains no packet-level `phase_init`/`phase_save`. (3) Optionally mirror that sentence in the two presentation assets, which is where setup rendering reads the policy. **What it does not fix, stated plainly:** a *legitimate* two- or three-lineage fan-out run still runs no packet lock, no session classification and no spec check, because fan-out is defined as skipping `phase_init`. The refusal makes the incident's route illegal; it does not give fan-out a packet-level init. That is a separate, larger question and should be its own packet. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:217]
[SOURCE: .skilled/commands/deep/research.md:125]
[SOURCE: .skilled/commands/deep/review.md:97]
[SOURCE: .skilled/commands/deep/assets/deep-research-presentation.txt:71]

9. **No existing check could have fired before the run, and only one can fire after it — the answer to the last open key question, now tested in the positive direction.** *`verify-iteration.cjs`*: not on the incident's route at all (`fanout-run.cjs` runs its own per-lineage artifact gates), and on the driver route it passed ten times because it is per-iteration by construction — it never examines packet-level phases. Its route proof is advisory by its own comment: when the projection carries no leaf dispatch fields the warning fires and the iteration still passes, deliberately, "so a real bypass stays" visible rather than fatal — which is exactly what ten clean passes over a zero-packet-workflow run look like. *Dispatch receipts*: written only by YAML dispatch steps, all of which bind `receiptDir` to the packet's `dispatch-receipts/`; the fan-out route never executes those steps either, so an absent receipt cannot separate a correct fan-out from the incident. *Lock*: nothing contends with a lock that was never taken; absence is not an observable any current check tests. *`fanout-run.cjs`'s report*: the exit code is computed from `fulfilled`/`rejected` alone, and the timestamp field it would have carried cannot fire (Finding 5). *`validate.sh`*: packet documents were never touched, which is precisely the state it accepts. The surviving discriminator is the packet config's `status` field — written by `step_update_config_status` in `phase_synthesis`, left at `initialized` by the incident, meaningful to a human and to no script. That is a report, not a gate, and it arrives after the damage. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4272]
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1278]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:482]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:516]

## Questions Answered

- Which existing checks could have caught the incident before or after the run (verify-iteration.cjs, dispatch receipts, config status, lock, fanout-run's success report, validate.sh), and why did each not fire?
- What is the smallest set of changes to existing files that keeps a chat-started loop on its workflow, how does it apply to deep-review and ai-council, and what should not be built?

## Questions Remaining

None from the strategy's key-question set. Two sub-questions are recorded for a follow-up packet rather than answered here:

- Should a legitimate fan-out run execute packet-level `phase_init` and `phase_save` at all, given it is defined as skipping them? (Named in Finding 8 as out of this set's scope.)
- Should the refusal be unconditional by default with `--allow-single-lineage` as the only escape, or should the escape be a config field? A flag matches the file's existing style (`FANOUT_FLAGS`, `assertKnownFlags`) and needs no schema change; the fixture cost is identical either way.

## Ruled Out

- **Escalating the already-computed timestamp anomaly** (iteration 2's change 3). The classifier only reports records outside the lineage's dispatch window, so intra-window in-process iteration cannot trigger it, and the non-empty summary fold already exists. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:5]
- **Keying the guard to the documented flags** (`--executor`, `--executors`, `--count`). The script is entered through `--fanout-config-json`, which none of those flags describe; a flag-level guard is bypassable by construction. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:229]
- **Requiring two entries in the YAML's `skip_when` instead of in the script.** It would have to be written twice (research and review), would leave the direct script call untouched — which is exactly how the incident happened — and `skip_when` fails open. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:223]

## Dead Ends

- **A packet-level "did this run walk the workflow" receipt to check afterwards.** The only receipt writer in the repository is the YAML dispatch step (`receiptDir` bound at eight places in the research YAML alone), so receipts mark the single-executor path and are legitimately absent on fan-out. Building a fan-out receipt would be a new artifact, not an existing check.
- **Using `fanout-run.cjs`'s `status` field as a workflow verdict.** Already ruled out in iteration 2 and re-confirmed here at the exit-code line: the code is a function of `fulfilled`/`rejected` only. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4272]

## Edge Cases

- **Ambiguous input:** "smallest set" read as smallest bypass-proof surface, not smallest edit count; the alternative reading and its cost are recorded in Focus.
- **Contradictory evidence:** iteration 1's contradiction (fresh-context-per-iteration prose vs the in-process CLI lineage) still stands; no new contradiction. A contradiction with the *prior iteration* was found and resolved in favour of this iteration's evidence: the timestamp recommendation is withdrawn with its classifier cited rather than quietly dropped (Finding 5).
- **Missing dependencies:** none. No network source used; `resource-map.md` remains absent by config, so no coverage gate applies.
- **Partial success:** the fixture count behind change 1 ("three stress fixtures") is carried from iteration 2's read of `fanout.vitest.ts:165,756,794` and was not re-verified here; the unit-suite single-entry cases are known to exist but were not re-counted. Neither suite was run, so all fixture claims are read-level, not observed test outcomes. `durationMs` on this iteration's record is a wall-clock estimate, not instrumented.

## Sources Consulted

- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/incident-chat-started-loop.md
- .skilled/commands/deep/research.md:111-128
- .skilled/commands/deep/review.md:95-100
- .skilled/commands/deep/ai-council.md
- .skilled/commands/deep/assets/deep-research-auto.yaml:179-235, 1278, 1354, 1455, 1557, 1668, 1769, 1834, 2340
- .skilled/commands/deep/assets/deep-review-confirm.yaml:185-216
- .skilled/commands/deep/assets/deep-review-auto.yaml:234
- .skilled/commands/deep/assets/deep-research-presentation.txt:71
- .skilled/commands/deep/assets/deep-review-presentation.txt:88
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:30-36, 121-129, 3396-3418, 4244-4253, 4272-4273
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:1-110
- .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:416-417, 482, 516, 529-535
- .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:17, 262-300
- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/research/dispatch-receipts/ (i1, i2, i3-intent present; written by the single-executor path)

## Assessment

- New information ratio: 0.79
- Questions addressed: the last open key question (which checks could have caught it) and the topic's final question (smallest change set, review/council applicability, do-not-build list)
- Questions answered: both; the strategy's key-question set is now complete

## Reflection

- **What worked and why:** testing a prior iteration's recommendation instead of building on it. Reading the timestamp classifier's reason enum took one screen and converted a recommended change into a withdrawn one — the check reports *out-of-window* records, and in-process iteration is by definition in-window. The same discipline paid twice: reading the script's *actual* entry flag (`--fanout-config-json`) rather than the documented one explained why every flag-level fix is bypassable, which is the fact that decides where change 1 goes.
- **What did not work and why:** assuming the council shares the fan-out surface because the topic names all three modes. One `rg` for `fanout-run` in the council directory returned a single import of `buildLineageCommand` and nothing else, so an entire section of the anticipated recommendation collapsed into a one-line "not applicable". Token cost of the detour was small; the risk it avoided was recommending a council edit that has no caller.
- **What I would do differently:** verify the citation line before writing the recommendation around it. The exit-code line had to be located by grep after the argument was drafted, and the first attempt at a `classifyExitCode` definition search failed outright because the function is imported from a sibling lib — the honest sequence is locate, then argue.

## Next Focus

**Recommended next focus (if the loop continues):** none required — the strategy's key questions are all answered and every remaining item is a sub-question of a follow-up packet. If one more iteration runs, the highest-value use is adversarial: take change 1's exact predicate and try to construct a *legitimate* caller it would wrongly refuse — the candidates are `fanout-salvage.cjs`, the council's `buildLineageCommand` path (already shown inert), and a resume of a run whose config was written before the guard existed (`deep-research-config.json` snapshots with `fanout.executors` of length one). That last case is the only plausible false-positive and deserves the check before implementation.

## SCOPE VIOLATIONS

- **`research/research.md` was again not updated, although `progressiveSynthesis` is `true`.** The config enables progressive synthesis; this iteration's dispatch allowlist names only `iterations/iteration-003.md`, `deltas/iter-003.jsonl` and the append gateway's own writes. The narrower allowlist was followed and no write was attempted, so `research/research.md` still stops at iteration 1 until the workflow's synthesis phase consolidates iterations 2 and 3. Recorded rather than resolved: the two rules disagree and the dispatch allowlist wins by construction. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/research/deep-research-config.json]
