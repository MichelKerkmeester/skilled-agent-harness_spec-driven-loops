# Review Iteration 003 - attach-scorer-10

## Dispatcher

- Mode: review, leaf iteration 3 of the `attach-scorer-10` fan-out lineage.
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the seven `attach-scorer` rows of `review/review-scope-10.txt`.
- Focus read first: `review/review-brief-10.txt`; this iteration answers its traceability dimension across the same four changed surfaces and names the owning requirement rows.
- Prior state read: state log (two iterations), registry (AC10-P1-001 open), strategy (next focus: traceability).
- Holdout rule honoured: no prompt corpus was opened; the two moved baseline rows stay judged by the recorded lead-index limit.

## Files Reviewed

| File | Lines read | Dimension |
|------|-----------|-----------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 240-270, 405-455, 480-505 | traceability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | 140-240, 455-485 | traceability |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | 600-745, 1450-1475, 1495-1545 | traceability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | 1430-1455, 1500-1575 | traceability |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | 1-60, 1780-1820 | traceability |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 128-140 | traceability |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | 20-40, 99-110 | traceability |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. AC10-P1-001 from iteration 1 stays active.

### P2 Findings

1. **`REQ-006`'s "in any order" clause has no test behind it** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1544` -- `REQ-006` says the suffix chain is read "in any order", and the pop loop at `score-command-transcripts.mjs:632` supports that today, but every new case uses a mode-first chain. The longest-chain case at `:1544` is `:auto:with-research:with-context:with-phases`; the two self-auto cases at `:1555` and `:1565` both put `:auto` first; the leading-anchor case at `tests/command-attach-guards.vitest.ts:474` only pins refusal. A modifier-first chain such as `speckit:complete:with-research:auto` starts correctly now (probed: `started:true`, `shape:skill`, `selfAuto:true`), so this is coverage, not a defect in today's behaviour.
   Finding class: requirement clause without a regression test on changed code.
   Scope proof: the changed helper is `commandParts` at `score-command-transcripts.mjs:624-638`, and the new suffix cases are the rows cited above; both are this area's own changed surface.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:632`, `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1544`, `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/spec.md:137`.
   Case: a later change that pops only a trailing mode, or that restores a mode-first anchored pattern, keeps every current suffix case green while `speckit:complete:with-research:auto` stops resolving and the row silently loses its start.

## Traceability Checks

- `spec_code` -- pass. `REQ-006` (`038-alignment-p1-remediation/spec.md:137`) is clause-for-clause in the code: the suffix chain is read off the head before the route (`score-command-transcripts.mjs:624-638`), the pop loop is linear (`:632`), a self-chosen `:auto` before a route or a modifier chain sets self-auto (`:1368`, `:1461-1468`), and `/tmp`, `/var/tmp` and `/var/folders` are scratch (`:721`). `AC-006`'s evidence (`scratch/after-pass-nine.txt`) exists and prints build/typecheck exit 0, 2339 passed 0 failed both ways, FLOOR 24/44 0/35 2/44 and EVAL [160,49,21,5]. `REQ-003`'s leading anchor is pinned at `tests/command-attach-guards.vitest.ts:474`. The D-01 row in `scratch/alignment-final-dispositions.md` owns the mention fix, and its five guard cases and six-failure claim match the commit's added cases. The one requirement gap is the reversed-order test above.
- `checklist_evidence` -- notApplicable; no `checklist.md` in this phase-parent packet.

## Integration Evidence

- Mention guard: `command-attach.ts:259` and `:501`, with `scorer/fusion.ts:1213`, `:1232`, `:1248` as the third consumer. The D-01 disposition's promise is scoped to backticks, asterisks and double quotes; the single-quote P1 is the uncovered member of that class.
- Scorer: `insideCheckout` (`:721`) is called by `firstWritePosition` (`:747`), `startShape` (`:1552`) and `guardedWriteCounts` (`:1536`); `commandParts` is called by `namesCommand` (`:704`) and `startState` (`:1500`).
- Baseline: `tests/command-routing-slice.vitest.ts:318-336` holds the totals, the per-command tallies and the corpus hash, and it deliberately does not compare `capturedAtSha`; its comment at `:320` defines the field as the checkout that ran the capture, not the scorer's decision. The two moved rows and the metric arithmetic reconcile as recorded in iteration 1.
- Bench: `SEVEN_AXIS_MATRIX` is a `Record` over `ADVISOR_RUNTIME_VALUES` (`runtime/lib/advisor-runtime-values.ts:12-21`), whose eight labels include `vibe`, so the row is the exhaustive-record requirement and its `not-recorded` values are honest.
- README: the changed cell at `README.md:134` names the two backticked question rows and the resulting 3-of-8 ceiling; the baseline holds 8 named plus 4 partial slash-variant rows and `reached_top3: 0`, so the sentence is an upper bound and does not contradict the captured value.

## Edge Cases

- Curly double quotes (`\u201c\u201d`) are stripped by the code and have no test of their own; the single-quote P1 already asks for the markup table to be extended, and a separate row for the curly double quote belongs in that fix.
- `capturedAtSha` names `dae6d02810e`, a commit whose `command-attach.ts` has no strip line, because the capture ran on a checkout at that HEAD with the fix uncommitted. The slice test's own comment says the field is not a reproducibility pin and the corpus hash plus the live totals are; recorded here as a known practice, not a finding.
- The two moved rows (`sv-06`, `sv-08`) stay judged without their text under the recorded limit; the disposition's lead-index evidence and the metric arithmetic agree.

## Confirmed-Clean Surfaces

- `REQ-006`'s scratch clause: `/tmp`, `/var/tmp` and `/var/folders` read as scratch in both consumers, and the three added `insideCheckout` rows plus the two `startState` rows pin them.
- `REQ-006`'s route clause: `speckit:complete:auto add auth` and the longest advertised chain start with self-auto true, pinned at `:1528-1554`.
- `REQ-003`'s suffix refusal: `/speckit:complete:draft:auto` is refused, pinned at the guards file.
- The bench row: the runtime tuple and the matrix keys agree for all eight labels.
- The README cell's two-backtick claim: consistent with the dispositions and the captured totals.

## Ruled Out

- `capturedAtSha` as a reproducibility defect: the slice test at `:320` defines the field as the checkout that ran the capture and does not compare it; the reproducibility pin is the corpus hash and the live totals.
- The two moved baseline rows as a defect: recorded limit plus consistent arithmetic.
- A stale `reached_top3` sentence in the README: the sentence is an upper bound and matches the 8 named plus 4 partial split.
- The `--write` sentence: its antecedent is the real-embedding mode, the only refused combination.
- A `REQ-006` code mismatch: every clause is present and only the reversed-order coverage is missing.

## Verdict

One new P2 (reversed-order requirement coverage) and one active P1 carried from iteration 1. CONDITIONAL by the active-finding mapping.

## Next Focus

- Dimension: maintainability
- Focus area: comment accuracy, helper reuse, test naming and the cost of a follow-on change across the four changed surfaces
- Reason: maintainability is the last uncovered dimension
- Rotation status: D1-D3 complete, D4 pending
- Required evidence: each finding names a `file:line` and an input; recorded limits (S9-P2-005, F1) stay out
- Recovery note: none

Review verdict: CONDITIONAL
