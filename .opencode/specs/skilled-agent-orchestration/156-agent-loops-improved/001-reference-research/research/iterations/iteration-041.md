# Iteration 41: S6-03 Convergence Math ADR

## Focus

S6-03 asked whether we should author an ADR to unify convergence math now split across `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs`, and `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` into one declarative threshold/weight spec with a shared parity test.

Answer: yes, but the ADR should govern profiles and parity first, not force all loop types through one algorithm. The reference repos support a shared typed contract for knobs, defaults, and tests while preserving domain-specific scoring semantics.

## Actions Taken

1. Checked prior research state for S6-03 and adjacent convergence work to avoid duplicating S2/S3 findings.
2. Read the three target convergence files and captured where thresholds, weights, and novelty floors currently live.
3. Mined Kasper for declarative bounded configuration, defaults, decay math, and tests around threshold behavior.
4. Mined loop-cli-main for a central loop option contract that feeds CLI, IPC, and UI paths.
5. Synthesized an ADR-shaped backlog item with target files, migration difficulty, and parity-test scope.

## Findings

1. Author the ADR now: convergence knobs are already policy, not incidental implementation details.
   - Reference mechanism: Kasper declares bounded config fields for `scoring_threshold`, `weakness_decay_days`, and `min_observations_for_update` in one schema, then merges normalized values over defaults [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/config.ts:26] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/config.ts:189]. Its defaults live in one typed object [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/types.ts:31].
   - OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, where research/review/context scoring weights and thresholds are inline [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:123] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:207] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:241].
   - Why it helps: it gives future S2/S3 convergence ideas one approved place to land instead of adding another local constant.
   - Port difficulty: med.
   - Tag: quick-win for the ADR, deep-rewrite for the later migration.

2. The ADR should define a declarative convergence profile, with per-loop semantics but shared shape.
   - Reference mechanism: loop-cli-main centralizes loop operator inputs in `LoopOptions`, IPC payloads, and a single `buildLoopOptions()` adapter before those values reach the daemon/UI boundary [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/types.ts:20] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/types.ts:90] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/loop-config.ts:86].
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs`, where council keeps a separate `THRESHOLDS` object plus its own score weights [SOURCE: .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:18] [SOURCE: .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:104].
   - Why it helps: a profile shape can unify names like `threshold`, `weight`, `role`, `direction`, and `normalizer` without pretending research novelty and council agreement are the same metric.
   - Port difficulty: med.
   - Tag: deep-rewrite.

3. The shared parity test is mandatory; otherwise the ADR becomes documentation drift.
   - Reference mechanism: Kasper tests threshold clamping for `scoring_threshold` and `weakness_decay_days` [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/config.test.ts:43] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/config.test.ts:110], tests min-observation gating [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/utils.test.ts:47], and tests decay changing observed ranking [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/state.test.ts:178].
   - OUR target file: `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts`.
   - Why it helps: parity tests can assert that the profile produces the same trace thresholds, stop decisions, and scores as the current inline implementation before code migration starts.
   - Port difficulty: easy for current snapshots, med once council is included.
   - Tag: quick-win.

4. Fold graph novelty floors into the same contract, but keep signal computation in coverage graph code.
   - Reference mechanism: Kasper applies half-life weighting directly in aggregate statistics with `weight = 0.5 ** (ageDays / decayDays)` [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:74].
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`, where signal interfaces and graph novelty delta live separately from the CLI thresholds that consume them [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:32] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:547]. The consuming floors are in `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:35] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:312].
   - Why it helps: future decay/confirmation knobs can be profile-owned while evidence extraction stays graph-owned.
   - Port difficulty: med.
   - Tag: deep-rewrite.

## Questions Answered

- S6-03: Yes, author the ADR. The immediate backlog item should define the declarative profile schema, list current constants across runtime/council/graph novelty, and require a parity test before moving code.
- The ADR should explicitly reject a single universal convergence formula. Shared contract, loop-specific metrics.

## Questions Remaining

- Exact profile file path is still open. Candidate: `.opencode/skills/deep-loop-runtime/lib/deep-loop/convergence-profiles.cjs` or a JSON schema plus CJS loader.
- Whether council parity should live in `tests/integration/convergence-script.vitest.ts` or a council-specific test under `.opencode/skills/deep-loop-runtime/tests/council/`.
- How S6-04 anti-convergence floors (`minIterations`, `convergenceMode`) should compose with the proposed profile schema.

## Next Focus

[S6-04] What ADR-level contract makes anti-convergence (`minIterations`/`convergenceMode`) consistent across research/review/context/council so the optimizer cannot tune past the floor?
