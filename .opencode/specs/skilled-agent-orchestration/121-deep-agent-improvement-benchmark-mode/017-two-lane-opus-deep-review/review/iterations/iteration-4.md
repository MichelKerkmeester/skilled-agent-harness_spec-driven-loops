# Deep-Review Iteration 4 — Maintainability

**Run:** 017-two-lane-opus-deep-review (Opus 4.8 second opinion)
**Iteration:** 4 of 10
**Dimension focus:** maintainability
**Target:** deep-agent-improvement two-lane program (phases 008-013), post-015-remediation
**Verdict (provisional, this dimension):** CONDITIONAL — no new P0/P1; a cluster of P2 maintainability defects (parser fragmentation, duplicated scoring algorithms with behavioral drift, dead parameter, cross-packet comment-attribution noise).

---

## State Summary

This is the maintainability pass of the second (Opus) opinion. Prior iterations (1-3) confirmed the 015 remediation holds for the correctness/security/traceability surfaces they touched and surfaced 2 open P1s (materializer fixture-id traversal; bundle-gate criteria-exec gate gap) plus 1 P1 (dead "Mode 4" SKILL.md anchor in both command docs) and 1 P2 (stale explicit.ts projection comment). This round reviews the same scope adversarially for maintainability and does NOT repeat those.

I re-verified the load-bearing 015 fixes that intersect maintainability:
- loop-host `parseArgs` space-form binding (F-P0-1) is real and tested (loop-host.vitest.ts:44-66, 144-161).
- run-benchmark fixture-id sanitize, report-history snapshot, provenance-on-both-paths, regex-DoS guard are present and tested (run-benchmark-hardening.vitest.ts).
- score-candidate packet-local + candidate-keyed cache (F-P1-11, F-P1-12) is present and tested (score-candidate-cache.vitest.ts).
- harness D4 score clamp on both fresh and cache-hit paths (F-P1-4) is present (harness.cjs:44-48, 206-209, 229-231).

All hold. See Confirmations.

---

## Files Reviewed

- scripts/shared/loop-host.cjs (parseArgs, planInvocation, resolveScriptPath)
- scripts/shared/reduce-state.cjs (dashboard renderer, registry builder)
- scripts/shared/materialize-benchmark-fixtures.cjs (parseArgs, fixturePathFor, renderFixture)
- scripts/shared/promote-candidate.cjs (parseArgs, gate chain)
- scripts/model-benchmark/run-benchmark.cjs (parseArgs, scoreIntegration, report shape)
- scripts/model-benchmark/dispatch-model.cjs (parseArgs, comment attribution, repoRoot depth)
- scripts/model-benchmark/scorer/score-model-variant.cjs (sha256Hex dup)
- scripts/model-benchmark/scorer/grader/harness.cjs (sha256Hex dup)
- scripts/model-benchmark/scorer/deterministic/cwd-check.cjs (classifyPath unused param)
- scripts/agent-improvement/score-candidate.cjs (parseArgs, scoreDimIntegration)
- tests: loop-host.vitest.ts, run-benchmark-hardening.vitest.ts, score-candidate-cache.vitest.ts

---

## Findings by Severity

### P0
None.

### P1
None.

### P2

- **maintainability-4-1** — Four divergent `parseArgs` dialects across the in-scope scripts. `loop-host.cjs` (87-113), `materialize-benchmark-fixtures.cjs` (9-20), and `run-benchmark.cjs` (17-35) support space-form `--key value`; `promote-candidate.cjs` (28-38), `score-candidate.cjs` (35-45), and `dispatch-model.cjs` (359-372) do NOT (key=value or boolean only). loop-host plans space-form args for the Lane B pipeline, which the materializer + run-benchmark accept — but the same `--candidate /path` typed at `promote-candidate.cjs` or `score-candidate.cjs` would silently bind `candidate=true`. No single shared arg parser; the contract lives only in comments + tests. Latent footgun for the next maintainer.

- **maintainability-4-2** — Integration scoring is duplicated with behavioral drift. `run-benchmark.cjs::scoreIntegration` (317-376) and `score-candidate.cjs::scoreDimIntegration` (276-312) implement the same mirror(0.6)/command(0.2)/skill(0.2) weighting and the same -30/-20 missing/diverged penalties, but: (a) run-benchmark factored them into named constants (`MIRROR_MISSING_PENALTY`, `INTEGRATION_WEIGHTS`) while score-candidate still uses magic numbers; (b) run-benchmark normalizes `mirror.status || mirror.syncStatus` (335) while score-candidate reads only `m.syncStatus` (292-294). The two will silently diverge under maintenance, and a scanner that emits `status` (not `syncStatus`) scores differently in the two lanes.

- **maintainability-4-3** — Dead parameter in `cwd-check.cjs::classifyPath(rawPath, fixtureCwdAbs, fixtureCwdRel)` (89). `fixtureCwdRel` is never referenced in the body (90-108); the function resolves everything off `fixtureCwdAbs`. It is passed at the call site (123) and only used for the `fixture_cwd_rel` echo in the result (140). Misleads a reader into thinking the relative path participates in classification.

- **maintainability-4-4** — Cross-packet review-attribution noise in `dispatch-model.cjs`. The file (a 121-packet file) carries a mix of `(014 review)` tags (42, 50, 264 — the actual review lineage for this two-lane program) AND `(122 review)` tags (117, 264) plus `120/003` provenance. The `122 review` tags appear to be copy-through from the upstream `dispatch-minimax.cjs` source and do not correspond to any review in this packet's lineage; they will mislead a maintainer grepping for the finding that motivated a given line.

- **maintainability-4-5** — `fixturePathFor` is duplicated verbatim between `materialize-benchmark-fixtures.cjs` (32-34) and `run-benchmark.cjs` (80-83), and the profiles-dir default literal `.opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles` is hardcoded in three places (materializer 69, run-benchmark 387, plus the F-P1-4b alignment requirement between materializer and run-benchmark loadProfile). The F-P1-4b fix explicitly relies on these two copies staying byte-aligned by hand; a shared helper would make the alignment structural instead of a maintenance contract.

---

## Traceability Checks

- skill_agent: SKILL.md §4 (LANE B) ↔ run-benchmark/loop-host/dispatch-model behavior — consistent (the dead "Mode 4" anchor is already tracked as traceability-3-1, not repeated).
- The BENCHMARK_RUN_OPTIONS "single source of truth" claim in loop-host (57-65) IS in sync with run-benchmark's accepted args (output, state-log, label, profiles-dir, integration-report, scorer, grader) — confirmed, not a finding.

---

## Confirmations (incl. 015 fixes that hold)

- loop-host F-P0-1 space-form parseArgs fix holds and is covered by loop-host.vitest.ts.
- run-benchmark F-P1-9 fixture-id sanitize, F-P1-13 report-history snapshot, F-P1-7 provenance on success+failure, and the regex-DoS length/input bounds all hold and are tested.
- score-candidate F-P1-11 (packet-local cache dir) + F-P1-12 (candidate-path-keyed hash) hold and are tested.
- harness F-P1-4 D4 score clamp holds on both fresh-write and cache-hit paths.
- BENCHMARK_RUN_OPTIONS / BENCHMARK_MATERIALIZE_OPTIONS forwarding lists are in sync with the downstream scripts' accepted flags (no schema drift).
- reduce-state dashboard renderer is well-factored (named render* helpers, no magic-number drift internal to that file).

---

## Verdict

CONDITIONAL (maintainability) — 5 new P2 advisories, no new P0/P1.

## Next Dimension

Correctness or security re-sweep on any not-yet-deeply-covered hotspot (e.g. reduce-state stop-status math, promote-candidate gate ordering).
