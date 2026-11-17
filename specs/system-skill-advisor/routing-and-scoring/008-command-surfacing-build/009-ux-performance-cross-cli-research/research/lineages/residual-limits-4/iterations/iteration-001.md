# Iteration 1: What the reader sees on each runtime at HEAD after 014 and 015

## Focus

KQ1. What each of claude, codex, opencode, pi, devin and dsh actually shows the model on the built state after phases 014 and 015, and which runtime still loses the command, the policy or the skill, or cannot prove the brief arrived. The final behaviour arm was run before 014 and 015 at `320e7b64d4`; phase 015 rescored the same transcript lines with the new scorer. No new arm was run, because the lane forbids a live arm. The measurement is therefore over the scored run lines plus the phase 015 render probe, both committed evidence, re-aggregated here by hand.

## Actions Taken

- Read `P/goal.md`, `P/014-review-remediation/implementation-summary.md` and `P/015-health-default-and-brief-refinements/implementation-summary.md` for the built state and the open limitations.
- Aggregated `P/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl` (120 run lines, five runtimes) with `jq`, and `P/015-health-default-and-brief-refinements/scratch/summary-final-after.json` (per-runtime post-arm tallies).
- Read the phase 015 render probe `P/015.../scratch/render-entries-after.json` for the nine live heads.
- Read `.opencode/plugins/system-skill-advisor.js:1578-1582` and `:1463-1476` for the OpenCode delivery channel.

## Findings

1. At HEAD the six runtimes fall into three delivery-proof classes. Proven: claude 24 of 24, devin 24 of 24, pi 24 of 24, dsh 23 of 23 stored sessions. Unproven: opencode 24 of 24 rows read `deliveryUnknown`, because the plugin pushes the head onto `output.system` in memory and the shared session reader keeps no trace. Absent: codex 0 of 24, because its hooks are unapproved. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/summary-final-after.json] [SOURCE: .opencode/plugins/system-skill-advisor.js:1580]

2. The bytes the reader receives are identical across the hook and the OpenCode plugin on all nine committed probe prompts: one system entry each, 244 to 305 bytes, after rank 4 removed the duplicate compiled-routing line. OpenCode's residual limit is evidence of delivery, not the content or size of the brief. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/render-entries-after.json]

3. Codex is the only runtime where the reader receives no brief at all, still 0 of 24. This is the operator-owned hook approval already recorded in the goal log, not a code defect in this phase, and it is the largest single reader-experience gap on the six-runtime surface. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:135] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl]

4. OpenCode's reader experience is truncated by the turn cap more than any other runtime: 8 of 24 runs exit 143, 6 of 14 offers land on a capped row, and its start rate is computed on only 5 of 12 start rows. The brief does reach those rows (14 offers), but the run stops before the offer can be taken or refused, so the published 2 of 5 understates what the reader was shown. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/summary-final-after.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl]

5. DSH's one unscored row (`cmd-deep-research-plain-tune-01`, reason `locator_unavailable`) is the one DSH line whose `locator` is null in the stale arm; the other 23 lines carry a locator and delivered true. It is a re-score artifact of the pre-015 arm, not a current delivery gap, and one fresh DSH row is what closes it. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/summary-final-after.json]

## Ruled Out

- Re-running the behaviour arm to get fresh OpenCode or DSH delivery evidence: the lane forbids a live arm and no model session may start.
- Treating the nine probe heads as a brief-size corpus: it is a render parity probe, and KQ2 needs the full typed corpus measured.
- Re-opening segment-three rank 4 (OpenCode compiled-routing line): the after probe shows one entry per prompt on all nine labels, so its gain is already taken.

## Dead Ends

- A per-runtime text comparison of the brief: the render probe shows the same renderer output through both channels, so no content difference exists to measure.
- Using `summary-final-after.json` alone for delivery: it carries `deliveryUnknown` but not `briefDelivered`, so the per-runtime truth had to come from the run lines.

## Edge Cases

- Ambiguous input: none. The lane names the runtimes and the evidence files.
- Contradictory evidence: none. `runs-post-final.jsonl` (144 lines, six runtimes) and `runs-final.jsonl` (120 lines, five runtimes) disagree on delivery only because the former is the pre-close six-runtime file with no delivery pass; the five-runtime file is the one phase 015 scored, so it governs.
- Missing dependencies: the Codex run lines carry `briefDelivered: null` and no codex row exists in `runs-final.jsonl`, so Codex delivery is cited from the goal log's 0 of 24 rather than a fresh line.
- Partial success: none; the iteration is a full re-aggregation of committed evidence.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/014-review-remediation/implementation-summary.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/implementation-summary.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/summary-final-after.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/render-entries-after.json`
- `.opencode/plugins/system-skill-advisor.js`

## Assessment

- New information ratio: 0.80
- Questions addressed: KQ1
- Questions answered: KQ1

## Reflection

- What worked and why: reading the raw run lines instead of the summary exposed the delivery split (`true` versus `unknown`) and the cap denominator, which the summary's aggregate fields hide behind a start rate.
- What did not work and why: `summary-final-after.json` cannot answer "what did the reader see" on its own, because it records the unknown count but not the per-line delivery value.
- What I would do differently: pull the per-row `offeredPolicy` and `exit` fields into the same pass next time, so the cap effect and the policy mix are read together rather than from two files.

## Recommended Next Focus

KQ2: measure live brief bytes across the typed corpus with a source-level harness, and read the hook's own latency records, since phase 015 left both open (`degraded_brief`, live cost not measured).
