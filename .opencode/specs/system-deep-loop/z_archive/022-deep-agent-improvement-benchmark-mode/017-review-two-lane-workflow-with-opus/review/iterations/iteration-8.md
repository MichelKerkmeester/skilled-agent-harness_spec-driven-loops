# Iteration 8 — Maintainability (Opus second-opinion deep review)

## STATE

- Review target: two-lane deep-agent-improvement program (phases 008-013), post-015-remediation.
- Iteration 8 of 10. Dimension focus: **maintainability**.
- Feed-forward loop: 13 prior findings carried (1 P0-equivalent already-remediated cluster from 014, plus 5×P1 + 7×P2 across iters 1-7). No repeats.
- Scope read this round (full): `loop-host.cjs`, `reduce-state.cjs`, `materialize-benchmark-fixtures.cjs`, `promote-candidate.cjs`, `dispatch-model.cjs`, `run-benchmark.cjs`, `score-model-variant.cjs`, `grader/harness.cjs`, `cwd-check.cjs`, `score-candidate.cjs`, the three vitest files, both command docs, the auto YAML, `SKILL.md`, `explicit.ts`. Cross-referenced the 014 review findings registry (all-findings.jsonl) and 015 decision-record to disambiguate attribution.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:145,381` (finding-id-shaped attribution tags)
- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:409,455,466,503` (traceability-N-N tags)
- `.opencode/specs/.../014-review-two-lane-workflow-implementation/review/all-findings.jsonl` (014 emitted every finding as `"id":"n"`; the `dimension-iter-N` IDs in source are reconstructed, not original)
- `.opencode/skills/deep-agent-improvement/scripts/shared/reduce-state.cjs:1125` (hardcoded "Agent Improvement Dashboard" title; Lane B reuses this reducer per YAML step_reduce/step_final_dashboard)
- `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml:157,170` (Lane B drives reduce-state.cjs for benchmark-only runs)
- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:262-277` (CLI main hardcodes `criteria:{}` — examined, held as not-a-finding, documented smoke-test seam)

## Findings by Severity

### P2

**maintainability-8-1** — Finding-ID-shaped attribution tags (`(traceability-3-5)`, `(maintainability-8-4)`, `traceability-4-2`, `traceability-7-5`, `traceability-7-2`) are embedded in shipped source comments and collide with the active 017 review's own finding-ID namespace.

- `dispatch-model.cjs:145` carries `// P2 (traceability-3-5): emit a resume command...` and `dispatch-model.cjs:381` carries `// P2 (maintainability-8-4): surface failure diagnostics...`. `run-benchmark.cjs:409,466` carry `traceability-4-2 (014 review)`, `:455` `traceability-7-5 (014 review)`, `:503` `traceability-7-2 (014 review)`.
- The 014 review (the lineage these tags claim to cite) emitted EVERY finding with `"id":"n"` — verified by reading `014-review-two-lane-workflow-implementation/review/all-findings.jsonl`. The two dispatch-model items map to real 014 findings ("Pause resume hint points nowhere", iter 3; "Dispatcher CLI hides failure diagnostics", iter 8) but those findings never had the IDs `traceability-3-5` / `maintainability-8-4`; the IDs were synthesized in `dimension-iter-N` form after the fact.
- That synthesized form is exactly the ID scheme THIS review (017) is emitting right now (`maintainability-8-N`, `traceability-3-N`). A maintainer grepping the 017 deltas for `maintainability-8-4` will hit a shipped source comment that looks like it was produced by this review pass, when it actually refers to 014/iter-8. The collision is live and bidirectional.
- Distinct from prior `maintainability-4-4` (P2), which was scoped narrowly to *packet-number* tags (`122 review` vs `014 review`) in dispatch-model.cjs and asked only to normalize the packet number. This finding is about a different class: bare, packet-UNqualified finding-ID tags (`(traceability-3-5)`, `(maintainability-8-4)` have NO `(NNN review)` suffix at all) whose `dimension-iter-N` shape aliases an active review's namespace. Normalizing the packet number (the 4-4 fix) does not resolve the namespace collision; these two need a stable, namespace-safe citation form (e.g. `014/F-n` or a one-line prose rationale).

### Held (examined, NOT filed)

- **score-model-variant.cjs CLI `main()` hardcodes `criteria:{}`** (lines 262-277): the standalone CLI entrypoint can never exercise D1 acceptance because it passes empty criteria; D1 always returns 1.0 via the "no acceptance defined" branch. The module docblock explicitly frames the public API as `score(...)` taking criteria-as-data and the CLI as a smoke seam, and the production caller is `run-benchmark.cjs` via `require()`, not the CLI. Held as documented-by-design, not a defect.
- **score-candidate.cjs RUBRIC_VERSION `p126-reproducibility-v1`**: cross-checked against `references/agent-improvement/score_dimensions.md:163` — both agree on the `p126` token, so the rubric-version string is internally consistent. Not a finding.
- **scorer references** (`run-benchmark.cjs:431` require, YAML:91 `scorer_5dim`): verified via `cat -v` they correctly point at `score-model-variant.cjs` (an earlier ripgrep display artifact rendered the basename as `n.cjs`). Not a finding.

## Maintainability / Drift Checks

| Area | Status | Note |
|------|--------|------|
| In-source finding-id citation hygiene | fail | Synthesized `dimension-iter-N` IDs collide with the live 017 review namespace (maintainability-8-1) |
| 015 fix: `dispatch-model.cjs` failure-diagnostics surfacing (014 iter-8) | pass | main() now emits error/pause_reason/sentinel_path/stderr (dispatch-model.cjs:381-395); the FIX is real, only its comment tag is mis-shaped |
| 015 fix: resume-hint repo-relative + shared loop-host path (014 iter-3) | pass | buildResumeHint(dispatch-model.cjs:148-155) emits `rm <rel> && node .../scripts/shared/loop-host.cjs ...`; functionally correct |
| 015 fix: `sleepSync` no busy-wait (Atomics.wait) | pass | dispatch-model.cjs:122-130 blocks via Atomics.wait with a bounded-spin fallback; sound |
| 015 fix: score-cache packet-local (F-P1-11) + candidate-keyed (F-P1-12) | pass | score-candidate.cjs:171-181 anchors under outputPath/candidate dir; inputHash binds candidatePath/baselinePath (lines 554-555); cache test asserts no cross-candidate hit |
| 015 fix: fixture-id sanitize in run-benchmark (F-P1-9) | pass | assertSafeFixtureId (run-benchmark.cjs:128) guards the runner writer; (materializer gap already filed as correctness-1-1, not re-reported) |
| 015 fix: report-history immutable snapshot (F-P1-13) | pass | run-benchmark.cjs:508-511 writes label-stamped snapshot; sanitizeLabel(88-91) bounds the basename |
| BENCHMARK_RUN_OPTIONS single-source forwarding (loop-host) | pass | loop-host.cjs:57-65 centralizes the forwarded flag list; comment correctly ties it to run-benchmark.cjs accepted options |

## Verdict

CONDITIONAL — one NEW P2 maintainability defect (in-source finding-ID citation tags colliding with the active review namespace). Multiple 015-era maintainability fixes re-confirmed sound (dispatcher diagnostics, resume hint, sleepSync, packet-local candidate-keyed cache, report history). No new P0/P1 surfaced this round.

## Next Dimension

Correctness or security re-sweep (iteration 9), unless orchestrator re-routes.
