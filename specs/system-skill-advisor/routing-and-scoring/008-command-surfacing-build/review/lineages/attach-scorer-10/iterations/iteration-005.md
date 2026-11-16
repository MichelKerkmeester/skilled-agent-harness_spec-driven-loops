# Review Iteration 005 - attach-scorer-10

## Dispatcher

- Mode: review, leaf iteration 5 (confirmation pass) of the `attach-scorer-10` fan-out lineage.
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the seven `attach-scorer` rows of `review/review-scope-10.txt`.
- Focus read first: `review/review-brief-10.txt`; this pass re-reads the four findings it produced and takes the stop decision, with no new direction opened.
- Prior state read: state log (four iterations), registry (four open findings), strategy (all four dimensions complete).
- Holdout rule honoured: no prompt corpus was opened and no session text was printed.

## Files Reviewed

| File | Lines read | Dimension |
|------|-----------|-----------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 395-455 | correctness, maintainability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | 165-190 | correctness, maintainability |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | 609-742, 1514-1540 | correctness, traceability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | 1435-1450, 1520-1560 | correctness, traceability |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | 1-60, 1788-1812 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 134-138 | traceability |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | 26-36 | traceability |

## Findings by Severity

### P0 Findings

None, and no carried P0 to re-read.

### P1 Findings

None new. AC10-P1-001 is confirmed at its original severity on a re-read of the strip line, the two offer call sites and the single-quote probe.

### P2 Findings

None new. AC10-P2-001, AC10-P2-002 and AC10-P2-003 are confirmed at their original severity:

- AC10-P2-001 (reversed-order suffix test): re-read `commandParts` at `:624-638` and the new cases at `:1528-1554`; the reversed chain still starts (probe unchanged) and still has no assertion.
- AC10-P2-002 (curly double quotes untested): re-read the strip at `:423` and the markup table at `tests/command-attach-guards.vitest.ts:172-184`; the typographic pair is stripped in code and absent from the table.
- AC10-P2-003 (apostrophe exclusion unstated): re-probed `what's /create:readme do?` (withheld, true) and `whats /create:readme do?` (not withheld, false), which is the exact regression a blanket apostrophe strip would create.

## Traceability Checks

- `spec_code` -- pass on confirmation. `REQ-006`'s four clauses and `REQ-003`'s anchor still match the code and their cases; the D-01 disposition still matches the mention fix, with the single-quote input as its one uncovered member. No requirement row changed during the run.
- `checklist_evidence` -- notApplicable; no `checklist.md` in this phase-parent packet.

## Integration Evidence

- Re-read the exact integration surfaces named in iterations 1-4: `attachCommand` at `command-attach.ts:501`, `typedCommandForTop` at `:259`, `fusion.ts:1213`, `insideCheckout` consumers at `score-command-transcripts.mjs:747`, `:1536`, `:1552`, the slice-test baseline pin at `command-routing-slice.vitest.ts:318-336`, and the runtime tuple at `advisor-runtime-values.ts:12-21`. No surface call path changed during the run.
- The convergence graph now holds one dimension node per dimension, one file node per reviewed file, and one finding/evidence pair per finding, with the COVERS, IN_DIMENSION, IN_FILE and EVIDENCE_FOR edges from iterations 1-4.

## Edge Cases

- The single-quote P1 and the apostrophe comment P2 are deliberately kept as two findings: one asks for a narrower fix, the other records the constraint that makes the broad fix unsafe.
- No new ambiguity was found; the recorded limits (suffix-before-extension, lead-diag-only baseline rows, underscore emphasis, macOS-only isolation script) still cover the adjacent cases.
- The `capturedAtSha` question stays ruled out under the slice test's own definition at `:320`.

## Confirmed-Clean Surfaces

- Scorer: route split, linear suffix pop, head-only self-auto, shared scratch pattern, and the four `insideCheckout`/`startState` cases added for `/var/tmp` and bare `/tmp`.
- Benchmark: the Vibe row is required by the exhaustive record and honest at `not-recorded`.
- Baseline: the two moved rows, `reached_top3` 0, `agreement` 5/9 and `false_offer` 0/35 reconcile; the corpus hash did not move.
- README cell: the two-backtick question claim and the 3-of-8 ceiling agree with the baseline split.

## Ruled Out

- Re-opening any carried finding for a different severity: no new fact arrived in this pass.
- A new correctness, security, traceability or maintainability direction: all four dimensions are covered and the confirmation re-read found no new input.
- Re-reporting the recorded limits: S9-P2-005 duplicate vocabulary, F1 shared scratch pattern, and the `capturedAtSha` provenance question all stay in their recorded state.

## Verdict

No new finding. Active findings: one P1 (AC10-P1-001) and three P2. The iteration final line follows the active-finding mapping and stays CONDITIONAL until the P1 is fixed.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: all four dimensions are covered, both core protocols are recorded, the graph and stop steps ran on every iteration, and the only blocker to PASS is the active P1
- Rotation status: D1-D4 complete, confirmation complete
- Required evidence: the registry, dashboard and report must agree with this narrative
- Recovery note: none

Review verdict: CONDITIONAL
