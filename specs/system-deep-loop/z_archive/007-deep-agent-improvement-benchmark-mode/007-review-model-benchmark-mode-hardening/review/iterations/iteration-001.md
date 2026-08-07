# Iteration 001 - Correctness

## Dimension

D1 Correctness - core build code for the session 120+121 authored work, focused on `loop-host.cjs`, `dispatch-model.cjs`, `run-benchmark.cjs`, `score-model-variant.cjs`, deterministic scorer checks, and the matching tests/spec evidence.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:58`
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118`
- `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:253`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:161`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:128`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:80`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/preplanning-regex.cjs:87`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/hallucination-flag.cjs:116`
- `.opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:84`
- `.opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts:50`
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime/spec.md:123`

## Findings by Severity

### P0

None.

### P1

#### DR-001-P1-001 - `model-benchmark` route never invokes the generic model dispatcher

- File: `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:73`
- Claim: The shipped `model-benchmark` route materializes fixture markdown and then scores those files, but never calls `dispatch-model.cjs`, so executor/model/variant benchmarking is not part of the loop.
- Evidence: `planInvocation()` returns only `materialize-benchmark-fixtures.cjs` and `run-benchmark.cjs` for `model-benchmark` at `loop-host.cjs:73-75`. `run-benchmark.cjs` starts from files already present under `outputsDir` and calls `scoreFixture()` at `run-benchmark.cjs:274-275`; it has no dispatcher import or `dispatch()` call. The spec requires `dispatch-model.cjs` to dispatch via the executor-routing map at `spec.md:127`.
- Counterevidence sought: Searched for `dispatch-model`, `buildSpawnSpec`, and `dispatch(` across `loop-host.cjs`, `run-benchmark.cjs`, and tests; no runtime wiring was found. The spec's note at `spec.md:166` defers the 5-dim scorer adoption, but does not defer model dispatch.
- Alternative explanation: The materializer could be intended as a dry-run mode, but the route is the default `--mode=model-benchmark` path and the dispatcher file was built as a required deliverable.
- Finding class: cross-consumer.
- Scope proof: The only `model-benchmark` plan in `loop-host.cjs` has two steps and neither step can run a model. Direct search did not find dispatcher wiring in the benchmark runner or tests.
- Affected surface hints: `loop-host.cjs`, `run-benchmark.cjs`, `dispatch-model.cjs`, benchmark smoke tests.
- Recommendation: Add a dispatch phase between fixture/prompt preparation and scoring, or split the current path into an explicit static-fixture dry-run so `--mode=model-benchmark` exercises the executor map.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 only if another in-scope runtime path already dispatches model outputs before this loop host is invoked and the mode contract documents this route as static scoring only.

#### DR-001-P1-002 - Direct dispatcher runs ignore the requested working directory for most executors

- File: `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173`
- Claim: `dispatchReal()` computes `dir` from `opts.cwd`, but `spawnSync()` never receives `cwd`, and only the `cli-opencode` spawn spec forwards `dir`; `cli-codex`, `cli-claude-code`, `cli-gemini`, and `cli-devin` run from the dispatcher process cwd instead of the benchmark workspace.
- Evidence: The interface advertises `cwd` and `timeout_ms` at `dispatch-model.cjs:14`. `dispatchReal()` resolves `dir` at `dispatch-model.cjs:158` and passes it to `buildSpawnSpec()`, but `spawnSync()` at `dispatch-model.cjs:173-181` has no `cwd: dir`. In `buildSpawnSpec()`, only `cli-opencode` includes `--dir` at `dispatch-model.cjs:122`; `cli-codex` at `dispatch-model.cjs:133-136`, `cli-claude-code` at `dispatch-model.cjs:128-130`, `cli-gemini` at `dispatch-model.cjs:139-140`, and `cli-devin` at `dispatch-model.cjs:144-145` do not receive the directory. The CLI parser also omits `--cwd` and `--timeout-ms` at `dispatch-model.cjs:265-275`, so direct CLI use cannot satisfy the advertised interface.
- Counterevidence sought: Checked `buildSpawnSpec()` for per-executor cwd flags and `spawnSync()` options for process-level cwd; only `cli-opencode` carries `dir`.
- Alternative explanation: Some CLIs may infer repo root from the parent process cwd, but that only works when the dispatcher itself is launched from the intended benchmark workspace, not when `opts.cwd` points elsewhere.
- Finding class: cross-consumer.
- Scope proof: All executor cases share the same `dispatchReal()` spawn call, and four of five executor branches do not consume `resolved.dir`.
- Affected surface hints: `dispatch-model.cjs`, CLI executor map, model-benchmark fixture workspaces.
- Recommendation: Set `cwd: dir` in `spawnSync()` for all executors and add parser support/tests for `--cwd` and `--timeout-ms`; keep executor-specific directory flags only where the CLI needs them in addition to process cwd.
- Final severity: P1.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if benchmark dispatch is explicitly constrained to `cli-opencode` only and direct `dispatch-model.cjs` CLI use is removed from the public contract.

#### DR-001-P1-003 - D3 cwd checker can miss traversal into sibling paths with the same prefix

- File: `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:86`
- Claim: `classifyPath()` uses a raw `startsWith(fixtureCwdAbs)` boundary test, so a traversal resolving from `/tmp/app` to `/tmp/app2/...` is treated as inside the fixture cwd.
- Evidence: Traversal handling resolves the candidate path and checks `!resolved.startsWith(fixtureCwdAbs)` at `cwd-check.cjs:80-87`. Because this is a prefix check rather than a path-segment containment check, `/tmp/app2/secret` starts with `/tmp/app` and returns `bare_relative` instead of `traversal_attempt`. The same file documents traversal attempts as a `0.0` hard fail policy at `cwd-check.cjs:15-18`.
- Counterevidence sought: Checked whether `fixtureCwdAbs` is normalized with a trailing separator or whether `path.relative()` is used elsewhere in `classifyPath()`; neither guard is present.
- Alternative explanation: Fixture directories may not commonly have prefix-colliding siblings, but temp and packet-local paths can easily produce this shape (`app` and `app2`, `fix-1` and `fix-10`).
- Finding class: algorithmic.
- Scope proof: This is the only containment check in `cwd-check.cjs`; every extracted path goes through `classifyPath()`.
- Affected surface hints: D3 scorer, path traversal fixtures, weighted score correctness.
- Recommendation: Replace `startsWith()` containment with `path.relative(fixtureCwdAbs, resolved)` and require the relative path to be non-empty/non-absolute and not start with `..` plus a path separator.
- Final severity: P1.
- Confidence: 0.91.
- Downgrade trigger: Downgrade to P2 only if traversal scoring is declared advisory and all security/path fixtures have separate deterministic acceptance that catches the same prefix case.

### P2

None.

## Traceability Checks

- `spec_code`: FAIL. `spec.md:127` requires the generic dispatcher route, but `loop-host.cjs:73-75` and `run-benchmark.cjs:274-275` do not invoke `dispatch-model.cjs`.
- `checklist_evidence`: FAIL. The existing tests cover `loop-host` ordering and scorer basics, but no dispatch-model test covers cwd propagation or runtime wiring from benchmark mode to the executor map.
- `skill_agent`: not assessed in this correctness iteration.
- `agent_cross_runtime`: PARTIAL. `dispatch-model.cjs` has branches for five CLI executors, but cwd handling is only effective for `cli-opencode`.
- `feature_catalog_code`: not assessed in this correctness iteration.
- `playbook_capability`: not assessed in this correctness iteration.

## SCOPE VIOLATIONS

None. No reviewed target files were modified.

## Verdict

FAIL. Correctness has three P1 findings. The highest-impact issue is that the benchmark mode scores materialized markdown without invoking the model dispatcher, so the central model-benchmark claim does not hold for the shipped route.

## Next Dimension

Continue D1 Correctness with the second executor pass, focusing on whether these findings reproduce from the MiniMax perspective and whether any correctness issues exist in the 120 MiniMax integration files outside the core benchmark path.
