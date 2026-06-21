# Iteration 005 — C2: the prod-mode completeRecall@3 benchmark + regression loop for the spec corpus

Focus: the existing eval harness shape, and how to build a spec-corpus prod-mode completeRecall@3 benchmark + regression gate on it — the harness that UNBLOCKS the entire retrieval tier (A1 prefix, B3 edge-b, metadata fusion). Reader class: R (this is the gate, not a candidate). Floor: this IS the floor-measurement instrument.

## The decisive discovery: the engine already exists

C2 is **NOT a green-field build**. `scripts/evals/run-eval-v2.mjs` already IS the prod-mode completeRecall@3 dual-mode harness the parent's "unblock condition" demands. From its own header and code:

- It computes **completeRecall@K at tight cutoffs 3/5/8** over MULTI-TARGET gold sets (`run-eval-v2.mjs:38-43`, `SPECKIT_EVAL_V2_KS` default `'3,5,8'`).
- It runs **DUAL-MODE on the same copy DB**: an `eval path` (`evaluationMode + forceAllChannels`, no truncation) and a `prod path` (`routeQuery()` with the 3-floor truncation ACTIVE) (`:13-23`).
- It reports the **eval-vs-prod delta as a first-class FIDELITY metric** (`:233-238 delta`, `:317`) — the exact "eval flatters prod" gap the parent identified as the trap.
- It opens the DB **read-only via a tempdir backup**, never mutates the live DB (`:25-26`, `backupSqlite`).
- The metric primitives exist: `computeCompleteRecall` (`eval-metrics.ts:372`) and `computeCompleteRecallProfile` → `{completeRecallAt3, completeRecallAt5, completeRecallAt8}` (`eval-metrics.ts:408-417`).
- It already sets a failing exit (`run-eval-v2.mjs:357 process.exitCode = 1`) on a coverage condition — the regression-gate hook point.

**So the parent's "only a prod-mode eval-v2 dual-mode read of completeRecall@3 can promote a retrieval candidate" is satisfied by an EXISTING binary. The C2 build is two narrow additions: a spec-corpus golden set, and a regression baseline+gate around the existing run.**

## The actual gap: a spec-corpus MULTI-TARGET golden set

The shipped golden sets are the wrong shape for the spec corpus gate:
- `golden-queries.json` / `context-recall-golden.json` are **single-target, `trigger_derived`** queries (`{query, memoryId, title, specFolder, querySource:'trigger_derived'}`) — one target each. eval-v2's whole point is that single-target sets SATURATE and hide wins (`run-eval-v2.mjs:5-9`).
- eval-v2 needs the three MULTI-TARGET measurability classes it enumerates: `thematic_multi_target`, `causal_chain`, `hard_negative` (`:46-50`).

**Build artifact C2-1:** author `scripts/evals/spec-corpus-golden.json` with multi-target queries grounded in real spec packets — e.g. a `thematic_multi_target` query "spec data quality automation" whose gold set is the 005 packet's sibling research docs; a `causal_chain` query whose gold set is a parent→child phase chain; `hard_negative` queries that must NOT surface a near-miss packet. Each entry: `{id, query, class, targetMemoryIds:[...], specFolder}`. This is the one genuinely new authored artifact; the harness consumes it unchanged.

## Build artifact C2-2: the regression baseline + gate

The harness reports numbers; it does not yet gate against a stored baseline. Port the `skill_advisor_bench.py` regression-gate pattern (it has a `--min-throughput-multiplier` "blocking regression gate" and `sys.exit(main())`, `skill_advisor_bench.py:248,306`):

1. **Baseline capture:** run eval-v2 on the spec golden, store `prod.completeRecallAt3` (and the fidelity delta) into a committed `scripts/evals/spec-corpus-baseline.json` (the analogue of the memory-state baseline the eval dir already keeps).
2. **Gate logic:** a thin `run-spec-recall-gate.mjs` (or a flag on eval-v2) that runs the harness, compares `prod.completeRecallAt3` to the baseline, and:
   - PROMOTION mode (gating a retrieval candidate): PASS only if `prod.completeRecallAt3` RISES vs baseline by a margin (not eval-mode — the prod column is the only one that counts, the parent's central rule). FAIL → the retrieval candidate is not promoted.
   - REGRESSION mode (guarding the corpus): FAIL (`process.exitCode=1`) if `prod.completeRecallAt3` DROPS below `baseline - epsilon`.
3. **Re-baseline:** an explicit `--update-baseline` (operator-gated, committed) so the baseline only moves intentionally — mirrors how the golden snapshots are regenerated.

## How C2 unblocks the retrieval tier (the wiring that matters)

C2 is the gate the other keystones' retrieval-class items depend on:
- A1's header-path prefix (parent CONDITIONAL) → build default-off, re-index, then C2 PROMOTION mode must show prod@3 rise.
- B3 edge-(b) below-floor refinement → C2 confirms a reorder before any below-floor suggestion is acted on.
- metadata fusion / answerable_questions retrieval effect → same gate.
The data-quality program ships A1/B1/B2 write-time/adherence wins on cost TODAY; the retrieval slate stays frozen behind C2 until this gate exists and reads green.

## On-write vs retroactive timing

C2 is neither — it is a MEASUREMENT gate, run (a) on-demand before promoting any retrieval candidate (PROMOTION mode), and (b) optionally in the B1 scheduled sweep / a `workflow_dispatch` CI job in REGRESSION mode to catch a silent prod@3 drop. It must NOT run on every write (it copies the DB and runs the full golden set — too heavy). It runs at promotion decisions and on a schedule, not per-save.

## Rollback

- C2-1 golden + C2-2 gate are additive files; the harness itself is unchanged. Remove the gate script + baseline to disable. The existing `run-eval-v2.mjs` keeps working as a manual report.
- A re-baseline is a committed JSON change → `git revert`.

## Risks

- **RISK-C2a (golden authorship bias):** a hand-authored multi-target golden set can be gamed to show a win. MITIGATION: derive target sets from real packet structure (sibling/phase/causal links) via a generator like the existing `derive-edge-recall-golden.mjs`, not by hand-picking; review the golden as a gate-able artifact.
- **RISK-C2b (reading the eval column):** the perennial trap — promoting on `eval.completeRecallAt3` instead of `prod.completeRecallAt3`. MITIGATION: the gate script reads ONLY the prod column for promotion; the fidelity delta is reported alongside as a tripwire (a large delta means "eval flatters prod, do not trust").
- **RISK-C2c (small-corpus noise at @3):** completeRecall@3 over a ~2022-row corpus can be noisy run-to-run. MITIGATION: multi-target classes reduce single-hit luck; require a margin (not a tie) for promotion; report variance across a few runs.
- **RISK-C2d (coverage gap silently passing):** eval-v2 reports a class as `class absent from golden set` (`:307`) rather than failing. MITIGATION: the gate treats a missing measurability class as a FAIL in PROMOTION mode (you cannot promote on a class you did not measure).

## Rollout order (C2 internal — and it gates the whole program's retrieval half)

1. Author `spec-corpus-golden.json` (generator-derived, multi-target, all 3 classes).
2. Run eval-v2 on it; capture `spec-corpus-baseline.json` (the first real prod@3 number for the spec corpus — answers the parent's single open question).
3. Add `run-spec-recall-gate.mjs` (PROMOTION + REGRESSION modes).
4. Wire REGRESSION mode into the B1 scheduled sweep / a `workflow_dispatch` CI job.
5. From here, any retrieval-class candidate (A1 prefix, B3 edge-b, fusion) is promoted ONLY through PROMOTION mode.

## Dead ends ruled out this iteration

- Building a new prod-mode @3 harness — `run-eval-v2.mjs` already does prod+eval dual-mode completeRecall@3 with a fidelity delta and read-only copy DB. Reuse it. [evidence: `run-eval-v2.mjs:5-26,38-50,233-238,357`]
- Reusing the shipped single-target goldens — they saturate and hide wins, the exact blind spot eval-v2 was built to close. [evidence: `run-eval-v2.mjs:5-9`; `context-recall-golden.json` single-target shape]
- Promoting on the eval-mode column — only prod@3 counts; eval flatters prod by the fidelity delta. [evidence: `run-eval-v2.mjs:21-23`; parent truncation law]

## Assessment

newInfoRatio: 0.66 — the decisive find (the prod-mode @3 dual-mode harness ALREADY EXISTS as `run-eval-v2.mjs`, reframing C2 from "build a harness" to "author a spec golden + add a baseline gate") is net-new and materially de-risks the program; lower than early iters because it heavily reuses one discovered binary rather than designing many seams. Status: insight. Sources: `run-eval-v2.mjs:5-26,38-50,233-238,307,357`; `eval-metrics.ts:372,408-417`; `skill_advisor_bench.py:248,306`; `context-recall-golden.json`; `derive-edge-recall-golden.mjs`.
