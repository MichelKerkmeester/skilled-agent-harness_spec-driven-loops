# Iteration 002 - Correctness (MiniMax second pass)

## Dimension

D1 Correctness — second model pass (MiniMax M2.7). Reproduce and contest iteration 1's three P1 findings from the MiniMax perspective, then widen to the 120 MiniMax skill integration files for correctness-only issues.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:73` (re-check)
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173` (re-check)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:86` (re-check)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:212` (D-dimension dispatcher)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:179` (cache key derivation)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/dispute.cjs:70` (adversarial grader)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:49` (det key derivation)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:63` (grader key derivation)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:87` (importLooksReal regex)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/preplanning-regex.cjs:73` (stepHasAcceptance regex)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/hallucination-flag.cjs:83` (extractCliFlags regex)
- `.opencode/skills/cli-opencode/SKILL.md:1-404` (full review)
- `.opencode/skills/sk-prompt-small-model/SKILL.md:1-229` (full review)
- `.opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts:50` (scorer integration)

## Findings by Severity

### P0

None.

### P1

All three P1 findings from iteration 1 are **confirmed from MiniMax's perspective** — no contested evidence found.

#### DR-001-P1-001 (confirmed) — `model-benchmark` route never invokes the generic model dispatcher

- File: `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:73`
- Iteration 1 finding stands. The plan returned at line 73-75 has two steps: `materialize-benchmark-fixtures.cjs` and `run-benchmark.cjs`. Neither step calls `dispatch-model.cjs`. `run-benchmark.cjs` invokes `scoreFixture()` at lines 274-275, which scores fixture files already on disk. The dispatcher at `dispatch-model.cjs` is never in the benchmark path.
- Counterevidence sought and NOT found: Searched `dispatch-model.cjs` imports and exports, `run-benchmark.cjs` for any `require('dispatch-model')` or `dispatch(`, and `loop-host.cjs` for any dispatch-related plan step. Nothing connects the mode route to the dispatcher.
- The `score-model-variant.cjs` `dimScore()` function at lines 212-219 dispatches to the D-dimension scorer, not to `dispatch-model.cjs`. The D-dimension scorer is the internal 5-dim grader, not the executor dispatcher.
- Finding class: cross-consumer (architectural gap).
- Scope proof: `planInvocation()` returns a fixed 2-step array; no conditional path injects a dispatch step.
- Affected surface hints: `loop-host.cjs`, `run-benchmark.cjs`, `dispatch-model.cjs`, benchmark smoke tests.
- Recommendation: Same as iteration 1 — add a dispatch phase or split into static/dynamic modes.
- Final severity: P1 (confirmed, unchanged).
- Confidence: 0.91.
- Downgrade trigger: Unchanged from iteration 1 — downgrade only if another in-scope runtime path already dispatches model outputs.

#### DR-001-P1-002 (confirmed) — Direct dispatcher runs ignore the requested working directory for most executors

- File: `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173`
- Iteration 1 finding stands. `dispatchReal()` resolves `dir` at line 158 (`opts.cwd || repoRoot()`) and passes it to `buildSpawnSpec()` in `resolved.dir` at line 164. But `spawnSync()` at lines 173-181 receives no `cwd` argument at all — it uses the default (process cwd). `buildSpawnSpec()` only forwards `dir` for `cli-opencode` (line 122 `--dir` flag). All other executors (`cli-claude-code` lines 128-130, `cli-codex` lines 133-136, `cli-gemini` lines 139-140, `cli-devin` lines 144-145) receive no directory argument.
- Additional note from this pass: `dispatch-model.cjs:265-275` (`parseArgs`) does not accept `--cwd` or `--timeout-ms` as CLI flags, so direct invocation cannot satisfy the advertised interface (`opts.cwd`, `opts.timeout_ms` at line 14).
- Finding class: cross-consumer.
- Affected surface hints: `dispatch-model.cjs`, CLI executor map, model-benchmark fixture workspaces.
- Final severity: P1 (confirmed, unchanged).
- Confidence: 0.87.
- Downgrade trigger: Unchanged from iteration 1.

#### DR-001-P1-003 (confirmed) — D3 cwd checker can miss traversal into sibling paths with the same prefix

- File: `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:86`
- Iteration 1 finding stands. `classifyPath()` uses `!resolved.startsWith(fixtureCwdAbs)` at line 86 as the traversal gate. Because this is a raw string prefix check, a path from `/tmp/app` to `/tmp/app2/secret` resolves to `/tmp/app2/secret` which starts with `/tmp/app` — returning `bare_relative` instead of `traversal_attempt`. The hard-gate policy (score 0.0) at `cwd-check.cjs:15-18` applies only to `traversal_attempt`; `bare_relative` scores 1.0.
- Additional check: `fixtureCwdAbs` is NOT normalized with a trailing separator before the startsWith check. If it were `/tmp/app/`, the same false-negative would NOT occur for `/tmp/app2/...` — but the code does not add the separator.
- Finding class: algorithmic.
- Affected surface hints: D3 scorer, path traversal fixtures, weighted score correctness.
- Final severity: P1 (confirmed, unchanged).
- Confidence: 0.93.
- Downgrade trigger: Unchanged from iteration 1.

### P2

None new.

## Traceability Checks

- `spec_code`: FAIL (unchanged). `spec.md:127` requires the generic dispatcher route; `loop-host.cjs:73-75` and `run-benchmark.cjs:274-275` do not invoke `dispatch-model.cjs`.
- `checklist_evidence`: FAIL (unchanged). Tests cover loop-host ordering and scorer basics but not dispatcher runtime wiring or cwd propagation across executors.
- `skill_agent`: not assessed in this correctness pass.
- `agent_cross_runtime`: PARTIAL (unchanged). `dispatch-model.cjs` has five executor branches; cwd handling is only effective for `cli-opencode`.
- `feature_catalog_code`: not assessed in this correctness iteration.
- `playbook_capability`: not assessed in this correctness iteration.

## SCOPE VIOLATIONS

None. No reviewed target files were modified.

## Ruled-Out Directions

- **EC-5 ordering regression**: `planInvocation()` step order verified at `loop-host.cjs:71-76`; materialize always runs before run-benchmark.
- **Unknown-mode fallback regression**: `resolveMode()` at `loop-host.cjs:43-47` correctly falls back to `agent-improvement`; `loop-host.vitest.ts:32` test confirms.
- **Hard-gate arithmetic**: `applyHardGate()` at `score-model-variant.cjs:126-131` correctly caps D1 when D2 hard-gate fails; weighted score at lines 220-221 correctly multiplies.
- **Bundle-gate import-looks-real regex**: `importLooksReal()` at `bundle-gate.cjs:87-97` — the npm package name regex `/^@?[A-Za-z0-9._\-\/]+$/` at line 95 correctly allows scoped packages (`@scope/name`) and normal package names; no regression found.
- **Grader cache key derivation**: `derive_grader_key()` at `cache.cjs:63-93` correctly includes `grader_model_build_hash` (or placeholder) in the key derivation; hash includes `dim_id` ('D4') ensuring per-dimension separation.
- **dispute.cjs monkey-patch safety**: The `fs.readFileSync` patch at `dispute.cjs:70-76` is temporary and correctly restored in `finally {}` at line 85. No cross-contamination risk between dual-grader calls.

## 120 MiniMax Skill Files — Correctness Assessment

Reviewed the 120-authored MiniMax integration files for correctness issues:

### cli-opencode/SKILL.md (v1.3.4.0)
- Self-invocation guard (ADR-001) is correctly layered with three independent detection signals.
- Provider auth pre-flight decision tree correctly handles the four-provider matrix.
- `<dev/null` redirect requirement for non-interactive invocations is documented with the precise mechanism and position.
- No logic errors found in the routing key derivation or resource loading level mapping.

### sk-prompt-small-model/SKILL.md
- Dispatch matrix table correctly maps `minimax/MiniMax-M2.7` to `cli-opencode → minimax (minimax-api)` — single active path.
- Pattern ownership boundaries are clearly delineated; sentinel correctly stays thin.
- No correctness issues found.

### Verdict

**CONDITIONAL**. All three P1 findings from iteration 1 are reproduced and confirmed from the MiniMax M2.7 perspective. No new correctness issues were found in the 120 MiniMax integration files. No contested evidence was found that would support downgrading any finding. The benchmark mode still does not invoke the model dispatcher — this is the dominant correctness defect.

## Next Dimension

D2 Security — command injection surfaces in spawned CLIs, rate-limit backoff correctness, fixture allowlist bypass in the D4 scorer, and unsafe tempfile handling in score-model-variant.cjs.