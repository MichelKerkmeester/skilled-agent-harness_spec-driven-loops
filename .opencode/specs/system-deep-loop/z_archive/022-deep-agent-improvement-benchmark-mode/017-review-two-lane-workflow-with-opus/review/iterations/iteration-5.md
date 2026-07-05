# Deep-Review Iteration 5 — Correctness (Opus second opinion)

## State Summary

- Mode: review | Dimension: correctness | Iteration 5 of 10
- Target: deep-agent-improvement TWO-LANE program (phases 008-013), post-015-remediation state.
- This is an independent OPUS 4.8 second opinion. Job: (a) confirm the 015 remediations hold in the
  current code (no regression), and (b) hunt NEW correctness issues a different model surfaces.
- Prior iterations (1-4) reported 9 findings (1 carried-forward P1 cluster on the materializer guard,
  1 P1 on the bundle-gate exec gate, 1 P1 doc cross-ref, plus 6 P2s). Those are NOT re-reported here.

## Files Reviewed (correctness focus)

- `scripts/shared/loop-host.cjs` — parseArgs space-form, planInvocation, BENCHMARK_* forwarding lists.
- `scripts/shared/reduce-state.cjs` — registry build, mode attribution, benchmark plateau stop.
- `scripts/shared/materialize-benchmark-fixtures.cjs` — fixture id -> output path (escape verified by run).
- `scripts/shared/promote-candidate.cjs` — promotion gates and the `--score` / `--benchmark-report` contract.
- `scripts/model-benchmark/run-benchmark.cjs` — fixture scoring, 5dim path, provenance, report shape.
- `scripts/model-benchmark/dispatch-model.cjs` — executor routing, read-only default, backoff/sentinel.
- `scripts/model-benchmark/scorer/score-model-variant.cjs` + `grader/harness.cjs` + `deterministic/cwd-check.cjs`.
- `scripts/agent-improvement/score-candidate.cjs` — 5-dim scoring, cache key, recommendation logic.
- The three in-scope vitest files (re-ran: 29/29 pass).
- `commands/deep/start-{agent-improvement,model-benchmark}-loop.md`,
  `assets/deep_start-model-benchmark-loop_auto.yaml`, `SKILL.md`, `explicit.ts`.

## Findings by Severity

### P0

None.

### P1

**correctness-5-1 — Lane B (model-benchmark) promotion is non-executable as wired: the promoter
hard-requires a scored `--score` file that the model-benchmark workflow never produces.**

- File: `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml:174-176`
  (and `scripts/shared/promote-candidate.cjs:153,168,233,243`).
- Evidence: The in-scope auto YAML `step_promote_candidate` (lines 174-176) says: "run
  promote-candidate.cjs --benchmark-report {…}/report.json with the resolved candidate, target,
  **score**, config, manifest, and archive-dir, then --approve". But the entire Lane B workflow
  (auto YAML phase_loop) only runs `loop-host --mode=model-benchmark` (materialize + run-benchmark)
  and `reduce-state`. There is NO step that:
    1. writes a candidate file (`grep -niE 'candidate|manifest|score-candidate' auto.yaml` → only the
       promoter path + archive sentinel; no candidate-write or `score-candidate.cjs` step),
    2. produces a `score.json` in `status:'scored'` state, or
    3. copies a `target_manifest.jsonc`.
  Meanwhile `promote-candidate.cjs:153` makes `--score` REQUIRED, and `:168` rejects with
  `Cannot promote: score file is not in scored state` unless `score.status === 'scored'`. The Lane B
  artifact is `report.json` with `status:'benchmark-complete'`, `recommendation:'benchmark-pass'`, no
  top-level `dimensions`, and no `delta.total` (verified by reading a representative report shape and
  by reading run-benchmark.cjs:463-493). So even if an operator passed the benchmark report.json as
  `--score`, it fails the `'scored'` gate; and `:233` (`recommendation !== 'candidate-better'`) and
  `:243` (`evaluatePromotionGates(score.dimensions)` over an absent `dimensions`) would also reject.
  The companion `confirm` YAML (out of scope, line 205) makes this explicit by passing an unbound
  `--score={score_output_path}` placeholder that nothing in Lane B defines.
- Net: the documented "guarded Lane B promotion" capability cannot run. The benchmark loop itself
  (materialize → run-benchmark → reduce) is unaffected and works; only the optional promotion step
  is broken. Hence P1 (real defect in a documented capability), not P0.
- Fix (choose one, do not implement here): EITHER (a) add a Lane B promotion adapter that derives a
  `--score`-compatible scored file from the benchmark report (map `benchmark-pass`→`candidate-better`,
  surface per-fixture/dimension scores, set `status:'scored'`), OR (b) give promote-candidate.cjs a
  benchmark-mode branch that accepts `report.json` (`status:'benchmark-complete'`,
  `recommendation:'benchmark-pass'`, `aggregateScore` ≥ `BENCHMARK_AGGREGATE_GATE`) as the sole score
  evidence when `--benchmark-report` is supplied and `--score` is omitted, OR (c) explicitly mark Lane B
  promotion as not-yet-wired in the YAML/SKILL.md and remove the executable-looking promote step.
- confidence: 0.82

### P2

No new P2 correctness issues this round (the prior P2 cluster already covers parseArgs dialect drift,
duplicated integration scoring, the unused `classifyPath` param, cross-packet attribution noise, and
the duplicated `fixturePathFor`/profiles-dir default).

## Traceability Checks (correctness-relevant)

- `spec_code`: the auto-YAML promote step (174-176) does NOT resolve to executable promoter behavior
  for Lane B (see correctness-5-1). Partial.
- The default profile (`benchmark-profiles/default.json`) `thresholdDelta:0.05` is consumed by
  run-benchmark.cjs:450 as a 0..1 ratio headroom (`aggregateScore/100 - thresholdDelta`) and stored in
  `totals.delta`; this is informational only and not read by any gate or by reduce-state — no defect,
  but the `delta` field name overlaps the agent-improvement `delta.total` (0..100 candidate-minus-baseline)
  semantic. Noted; no consumer conflates them today, so not raised as a finding.

## Confirmations (015 remediations verified to hold in current code)

- F-P0-1 (loop-host space-form parseArgs): CONFIRMED. `parseArgs` binds `--key value` to the following
  non-`--` token (loop-host.cjs:99-110); the 4 space-form unit tests + the end-to-end forwarding test
  pass (loop-host.vitest.ts:44-180, 29/29 green).
- F-P1-1 (dispatch read-only default + `DEEP_AGENT_DISPATCH_WRITE` opt-in): CONFIRMED. All five executors
  in `buildSpawnSpec` (dispatch-model.cjs:185-234) use their read-only mode by default and only escalate
  under the env opt-in; `cwd: dir` is now set for EVERY executor in the spawn options (dispatch-model.cjs:265).
- F-P1-9 (fixture-id sanitize in run-benchmark): CONFIRMED for run-benchmark — `assertSafeFixtureId`
  rejects `../evil` and `a/b` before any `path.join` (run-benchmark.cjs:126-138); the two traversal
  tests pass. (The materializer guard remains MISSING — that is the prior carried-forward P1
  correctness-1-1, re-verified open via a live run that wrote `escaped.md` one level above outputsDir;
  not re-reported.)
- F-P1-12 (candidate-keyed score cache): CONFIRMED. `computeInputHash` binds `candidatePath` +
  `baselinePath` into the key (score-candidate.cjs:554-555); the "never shares a cache hit between two
  different candidates" test passes.
- F-P1-11 (packet-local score cache dir, not world-writable tmp): CONFIRMED. `defaultCacheDir` anchors
  on the output dir then candidate dir, falling back to tmp only as a last resort (score-candidate.cjs:171-181).
- F-P1-13 / F-P1-7 (report history snapshot + scorer/grader+profile provenance on success AND failure):
  CONFIRMED. Label is sanitized (run-benchmark.cjs:88-91), a label-stamped immutable snapshot is written
  to report-history/ and its path persisted in the ledger (504-525); provenance fields are populated
  pre-load and carried on both the success report and the infra_failure report/ledger (413-427, 457-575).
  The hardening vitest exercises all of these and passes.
- F-P1-4 (D4 grader score clamp on fresh + cache-hit paths): CONFIRMED. `clampScore01` is applied to both
  the fresh result (harness.cjs:230-231) and the cache-hit result (206-209).
- Hardening env gates: `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` is honored in the 5-dim acceptance exec path
  (score-model-variant.cjs:107-113) and `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts cached raw output
  (harness.cjs:237-239). (The gate's NON-coverage of `bundle-gate.cjs`'s own `execSync` at
  bundle-gate.cjs:153 remains the prior open P1 security-2-1 — re-verified, not re-reported.)
- TST-1 backward-compat identity: CONFIRMED. Default and explicit `agent-improvement` routes plan a
  byte-identical `score-candidate.cjs` invocation; unknown modes fall back identically (loop-host.vitest.ts
  TST-1 block passes).
- `isInside` separator-bounded containment (cwd-check.cjs:85-87) and the cwd-check `..` classification
  (89-109) are sound for the tested cases: prefix-sibling escapes (`/repo/proj-evil` vs `/repo/proj`)
  are correctly NOT treated as in-cwd.

## Verdict

CONDITIONAL — one NEW P1 (Lane B promotion non-executable). The benchmark and agent-improvement
evaluation loops themselves are correct; all sampled 015 remediations hold with no regression.

## Next Dimension

security (iteration 6) — re-confirm the bundle-gate exec gate (prior P1) and probe the llm-grader
dispatch / env-gate surface for any new injection or trust-boundary issue.
