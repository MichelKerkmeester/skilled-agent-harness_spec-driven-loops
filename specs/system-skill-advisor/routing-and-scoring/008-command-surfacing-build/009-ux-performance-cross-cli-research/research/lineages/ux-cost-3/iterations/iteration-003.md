# Iteration 3: Ranking the lane's changes, with verification and floor risk

## Focus

KQ3: rank what this lane can defend by expected gain per unit of risk, name the file each change touches, the measurable gain, the check that proves it, and the risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer `[160,50,21,5]`).

## Focus Selection Check

Strategy next focus named KQ3. No exhausted approach applied: none of the three changes below is a segment-one or segment-two disposition, and none retries a ruled-out direction.

## Actions Taken

1. Ran `capture-command-routing-baseline.mjs` without `--write` at HEAD to record the floors this ranking is measured against.
2. Read the `advisor_status` output schema and the `/doctor:setup` advisor leg to bound what a default-on record can actually surface.
3. Checked the write path's existing `requireDebug` option to confirm the health-only default needs no new writer.
4. Designed one verification per change and checked each against an existing test surface.

## Findings

1. **The floors hold at HEAD, measured now.** The read-only capture prints `typed_recall_at_1 {"correct":24,"total":44}`, `false_offer {"count":0,"total":35}`, `attachedMetrics.typed {"own":24,"attached":20,"combined":44,"total":44}`, plain tune `23` of 45, holdout `1` of 44, `typed_reach_top3` 27 of 44. Any change this lane recommends must leave those identical. [COMMAND: `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` (no `--write`), exit 0] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch/floor-baseline-head.txt]

2. **Change 1, the default: write a health-only record, keep the content fields behind the debug gate.** File: `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` gains a `requireDebug` pass-through on `persistAdvisorHookDiagnosticRecord`, and `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` passes `skillLabel` and `errorDetails` only when `SKILL_ADVISOR_DEBUG` is set. The writer already supports the ungated path (`requireDebug: false`, used by outcome records), so no new file writer is needed. Gain: `advisor_status` and `/doctor:setup` show hook health on every install instead of the 17 of 136 workspace keys that have a diagnostics file today. Cost: about 120 bytes and 0.26 ms per prompt, capped at 200 records. Privacy: the default record carries no skill id. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:319-321] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:524-530] [SOURCE: .skilled/skills/system-skill-advisor/runtime/hooks/claude/user-prompt-submit.ts:415-427]

3. **Change 1's gain has a hard bound worth stating: the doctor still needs a running daemon.** The advisor leg runs `advisor_status --warm-only` and exits 75 (SKIP) when the daemon is not running, so a default-on record makes health visible whenever the daemon answers, not on a cold install. The record is the missing half, not the whole fix. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:59]

4. **Change 2: make the brief-cost script refuse a degraded arm, and report the head separately.** File: `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs`. It should classify each emitted head and exit 2 with `{"error":"degraded_brief","liveRows":0}` when every row is an outage or stale line, and add `medianHeadBytes` so the steady-state number is visible beside the first-message one. Gain: the committed check stops reporting 361 bytes (the outage line) where the live brief is 296, a 22% error, and the number becomes reproducible across daemon states. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch/brief-cost-head.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch/live-brief-cost.json]

5. **Change 3: carry the health section's age.** File: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` plus `schemas/advisor-tool-schemas.ts`. `hookHealth` today carries `invocations`, `rollingP95Ms`, `rollingFailOpenRate` and `rollingCacheHitRate`, and no timestamp, so three records from install day read exactly like three from a minute ago. Adding `lastRecordAt` from the newest record's `timestamp` costs zero bytes per prompt and makes the one case change 1 does not cover — a workspace whose hook never runs, such as an unapproved Codex install — read honestly instead of green. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:451] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:483-489]

6. **Ranking by expected gain per unit of risk.** First, change 1: it is the only one that turns a surface from always-empty to populated, and it touches neither the scorer nor the renderer. Second, change 2: it repairs a published measurement with a 22% error and no product risk. Third, change 3: it costs nothing and prevents a stale green, but it only matters after change 1. All three are additive and none changes a behaviour the floors measure.

7. **What this lane does not recommend, with the measurement that closes it.** No brief cut: the head is 78 bytes of six load-bearing fields and the constant block is once per session (iteration 2). No directive trim: eliminated in segment one and re-confirmed at 218 bytes, all of it suppressed after a session's first message. No embedder warm-up or keep-alive: declined at segment-two ranks 16 and 18, and this run's warm median 7.89 ms against a 750 ms deadline gives no new fact that changes it.

8. **One observation outside the lane, recorded because it is a floor-adjacent number.** The same read-only capture reports `agreement {"correct":8,"total":10}` where phase 011 recorded `{"correct":7,"total":9}`. The denominator moved, so this is a corpus or pin change rather than a scoring gain; it is named here so the next floor check does not read it as a regression, and it is not a recommendation. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/implementation-summary.md:121]

## Questions Answered

- KQ3: three changes ranked, each with its file, gain, verification and floor risk; the floors at HEAD are recorded as the baseline they must leave untouched.

## Questions Remaining

- None in this lane's two carried questions. The cold-embedder sample stays a recorded gap, not an open question.

## Ruled Out

- **A new writer for health records.** Rejected: `writeBoundedJsonl` already takes `requireDebug: false` and the outcome records use it, so a second sink would duplicate the trim, the private modes and the queue.
- **Sampling health records (one in N prompts).** Rejected on arithmetic: at 120 bytes and 0.26 ms, sampling saves nothing measurable while making `rollingP95Ms` a sample of a sample and `invocations` no longer a prompt count.
- **Putting the skill id back behind a separate opt-in flag.** Rejected: no reader consumes it for health, and the diagnostics file's own comment names the privacy reason it is sensitive.

## Dead Ends

- Reading the doctor leg as proof that a default flip is sufficient: the leg SKIPs without a daemon, so health visibility has two preconditions, not one.
- Treating the capture's `agreement` change as evidence about this lane: the denominator changed, which no change here can cause.

## Edge Cases

- Ambiguous input: none. KQ3 names ranking, file, gain, verification and floor risk, and each is stated per change.
- Contradictory evidence: none. The one number that moved (`agreement`) is explained by its denominator.
- Missing dependencies: the cold-embedder sample remains unavailable (iteration 2), and it does not affect any of the three changes.
- Partial success: none.

## Sources Consulted

- `scratch/floor-baseline-head.txt` (read-only capture, exit 0)
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:319-321, 483-489, 524-530`
- `.skilled/skills/system-skill-advisor/runtime/hooks/claude/user-prompt-submit.ts:415-427`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:487-510`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:451`
- `.skilled/commands/doctor/assets/doctor-setup.yaml:59`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs`
- `scratch/brief-cost-head.json`, `scratch/live-brief-cost.json`

## Assessment

- New information ratio: 0.60
- Questions addressed: KQ3
- Questions answered: KQ3

## Reflection

- What worked and why: ranking after measuring the floors, rather than before, made "no floor risk" a claim with a printed baseline behind it. Running the capture read-only cost one command and converted an assertion into evidence.
- What did not work and why: the first framing of change 1 claimed the doctor would show health on a fresh install. Reading the leg's exit-75 rule cut that claim to "whenever the daemon answers", which is the honest bound.
- What I would do differently: read the consuming surface before designing the writer change. The doctor's daemon precondition is the kind of constraint that changes a recommendation's wording, not its value.

## Recommended Next Focus

A short verification pass: confirm the three change sites compile against their current callers and that a fixture can drive changes 1 and 3 end to end, then close with synthesis.
