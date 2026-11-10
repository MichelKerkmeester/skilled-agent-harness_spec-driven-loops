# Iteration 019 — ai-council runtime: stop logic, adjudication, seat subprocess

## Focus
Council runtime beyond seat dispatch: `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs`,
`orchestrate-topic.cjs`, `runtime/lib/council/{cost-guards,adjudicator-verdict-scoring}.cjs`, and the council's own
convergence reference. Target: adjudication, stability, stop logic, and the seat subprocess path. Registry findings
(`executor.mode` inert, un-called `dispatchSeat`) deliberately not repeated.

Note on the pack citation: the focus text placed `runSeatSubprocess` "near `orchestrate-session.cjs:389`"; the
definition is at line 262 and `dispatchSeat` occupies 389. No repo defect, recorded for the next dispatcher's benefit.

## Actions Taken
1. Mapped the council packet: 5 scripts (849 + 408 + 210 + 444 + 15 lines), 9 `runtime/lib/council/` modules
   (2.9k lines incl. two TS graph modules), 11 council/script test files, 3 `deep-ai-council-*.yaml` assets.
2. Read `runSeatSubprocess` [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:262]
   and `dispatchSeat` through the persist step [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:389].
3. Read `orchestrateSession`'s topic loop and `sessionSaturationDecision`
   [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:647].
4. Read `evaluateCouncilCostGuards` in full [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:126]
   and `scoreVerdictDelta` / `scoreVerdictProgression`
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/council/adjudicator-verdict-scoring.cjs:118].
5. Read the round loop, `scoreRound`, `stopReasonFor` [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:238]
   against the council's documented stop-reason list and state payloads
   [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/deep-mode.md:121].
6. Grepped every caller of `consecutiveStableRounds` / `consecutive_stable_rounds` across the deep-loop tree.

Tests were read, not executed: `vitest` writes cache into `node_modules/.vite/`, which is outside this leaf's write
authority. Recorded under SCOPE VIOLATIONS as a declined action rather than executed.

## Findings

**f-iter019-001 — drift, P2.** The documented stop-reason vocabulary does not belong to the function the docs name.
`deep-mode.md` lists `max_topics_per_session`, `saturation_threshold`, `max_rounds_per_topic`, `all_seats_failed`
under "`evaluateCouncilCostGuards` checks if limits are exceeded and returns stop reasons"
[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/deep-mode.md:121]. But
`evaluateCouncilCostGuards` emits exactly `max_topics_per_session`, `max_rounds_per_topic`, `saturation_threshold`
and `two_consecutive_stable_rounds`
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:142]; `all_seats_failed` is emitted
only by `stopReasonFor` [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:257],
and `two_consecutive_stable_rounds` is missing from the documented list. The union is right; the ownership
attribution is wrong in both directions. Introduced with the council packet (present at v4.0.0.0).
Verify: `grep -n "reasons.push" .skilled/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs`.

**f-iter019-002 — over-engineering, P2.** `two_consecutive_stable_rounds` is unreachable in every live path. No
production caller passes `consecutiveStableRounds` into `evaluateCouncilCostGuards`; `orchestrateSession` passes only
`topicNumber` [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:694] and
`stopReasonFor` reads `score.stable` per round, never a streak count
[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:256]. The only producer of a
streak is `scoreVerdictProgression` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/council/adjudicator-verdict-scoring.cjs:162],
which no council script calls — it appears only in a unit test. What breaks if the branch and that export are
removed: one test assertion and one export. The stop-reason branch at cost-guards.cjs:143 cannot fire today, so
the guard is telemetry-free dead logic, not a backstop.
Verify: `grep -rn "consecutiveStableRounds\|scoreVerdictProgression" --include=*.cjs --include=*.ts .skilled/skills/system-deep-loop | grep -v node_modules`.

**f-iter019-003 — operator UX, P2.** `stability_score` names a distance, not a score. The topic completion record
sets `stability_score` to the final round's `verdict_delta`
[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:393], a weighted 0..1
divergence where 0 means fully converged and the guard trips on `<= saturation_threshold`
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:140]. The session-level record and
the docs publish that field with no polarity statement
[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/deep-mode.md:88]. An operator
reading `stability_score: 0.05` on a council dashboard will read "barely stable" for a topic that is fully
saturated — the inverse. `sessionSaturationDecision` itself is correct (it forwards the delta as `verdictDelta`
[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:654]); only the name and
the missing polarity note mislead.
Verify: `grep -rn "stability_score" .skilled/skills/system-deep-loop/deep-ai-council/references/`.

**f-iter019-004 — bug, P2.** The seat timeout path discards the seat's output, unlike the failure path. On a
non-zero exit the rejection carries `error.stdout` / `error.stderr`
[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:339]; on timeout the
rejection is a bare `Error` with neither attached, and `close` returns early so any output already captured is
dropped [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:318]. A seat that
deliberates for the full budget and is SIGTERMed therefore loses a complete deliberation that the operator paid
for, and the orchestrator cannot distinguish "produced nothing" from "produced an answer too late". Asymmetry is
the defect, not the timeout itself.
Verify: unit-inject `spawn` with a child that emits stdout then never closes; assert the rejected error's `stdout`.

**f-iter019-005 — drift, P2.** `execution_provenance.effective.model` is hardcoded `null` while the sibling
`requested.model` carries the resolved model
[SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:374]. The persisted seat
record therefore claims an effective model of unknown for every seat, which is the one field a provenance record
exists to answer. The same literal also encodes kind→command for five kinds, duplicating what
`buildLineageCommand` owns at line 271 [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:271],
so adding a sixth kind requires editing two maps or the two halves disagree silently.
Verify: read `execution_provenance` on any `.council/seats/*` record produced by a real run.

## Questions Answered
None of the strategy's key questions matched exactly. f-iter019-004 narrows the executor-failure-handling question
to the *seat* transport (it is still not the CLI-executor quota path), and f-iter019-001/002 narrow the
drift/over-engineering half of the council cluster.

## Questions Remaining
- Hub canon (v4.0.1.0): `package_skill.py --strict` conformance across hub + seven modes — still unproven.
- Executor failure handling (v4.0.0.3, v4.0.0.16): what a single-executor run records for a devin
  `resource_exhausted` or a builder throw — fifteenth carry, still unread.
- UX: two of three `*-presentation.txt` assets remain unread; `deep-research-presentation.txt` never compared with
  the `deep-review` pair.
- New: does `council-graph-db.ts` / `council-graph-query.ts` (1,156 lines, two modules) have a live caller in the
  council run path, or is it consumed only by `replay-graph-from-artifacts.cjs`? Not read this iteration.
- New: `mergeVerdicts` — the no-adjudicator fallback in `orchestrate-topic.cjs` — was read only at its call site;
  its confidence aggregation is unchecked.
- Carried: `--pure` validity for the installed OpenCode (f-iter018-003); unknown-token `{...}` rendering policy;
  missing normaliser mapping `executor.kind` onto `executor.type`.

## Next Focus
Final iteration: close the drift/over-engineering half of the council cluster by reading
`runtime/lib/council/council-graph-db.ts` + `council-graph-query.ts` callers and `mergeVerdicts`, and spend one
action on the hub-canon `package_skill.py --strict` check that has been carried for six iterations. Do not re-derive
f-iter019-001..005. Nothing in the repository was modified.

## SCOPE VIOLATIONS
- Declined: executing the council's `vitest` suites. `deep-ai-council/vitest.config.mjs` and the `node_modules/.vite`
  cache both sit outside this leaf's allowed write paths, so a test run would have written outside the lineage
  directory. Findings were derived by reading the tests' import graph instead. No mutation attempted.
