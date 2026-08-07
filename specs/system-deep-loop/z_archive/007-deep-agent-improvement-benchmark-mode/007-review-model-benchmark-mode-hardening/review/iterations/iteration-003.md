## Dimension

D2 Security - command injection, path traversal, unsafe model-output parsing, and secrets/cache exposure.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118`
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:72`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:101`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:172`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:128`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:153`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:80`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:63`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:98`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:191`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:219`
- `.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:177`
- `.opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts:68`

## Findings by Severity

### P0

None.

### P1

#### DR-003-P1-001 - Benchmark criteria can execute arbitrary shell commands and can escape the scorer cwd

- File: `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:101`
- Evidence: `scoreAcceptanceDeterministic()` accepts `criteria.acceptance` as data, then for `type === 'deterministic'` runs `execSync(a.command, { cwd: cwdAbs, ... })` without a command allowlist or argv splitting. The ported D2 bundle gate repeats the same pattern by selecting a `smoke-run` or `deterministic` acceptance command and executing `execSync(acceptance.command, ...)` in `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:128` and `:153`.
- Evidence: The same scorer path only requires `cwd` to be absolute at `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:172`; grep criteria then use `path.join(cwdAbs, a.file)` at `:82` and `:95`, so `../` segments can resolve outside the intended fixture workspace.
- Claim: Any benchmark profile or caller that can supply `criteria.acceptance` can run shell commands under the local agent process and can probe paths outside the fixture cwd.
- Counterevidence sought: Direct CLI model dispatch in `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173` uses `spawnSync(spec.bin, spec.args, ...)`, and the executor specs build argv arrays instead of shell strings. That rules out shell injection in `prompt/model/agent` dispatch args, but it does not cover the scorer acceptance-command path.
- Alternative explanation: These criteria may be intended as trusted local fixtures only. That downgrades from P0, but the benchmark mode is explicitly a reusable scoring surface and the reviewed code has no guard that enforces trusted fixture provenance.
- Final severity: P1
- Confidence: 0.90
- Downgrade trigger: Downgrade to P2 only if benchmark profiles are cryptographically pinned or otherwise proven to be repo-owned trusted code, and the scorer API is not reachable with user-provided criteria.
- Recommendation: Replace string `execSync` with a small allowlisted command runner, execute by argv via `execFileSync`/`spawnSync`, reject shell metacharacters, and constrain `cwd` plus all criterion file paths with `path.resolve(cwdAbs, file)` and a `path.relative` containment check.

#### DR-003-P1-002 - D4 grader accepts unbounded model-provided scores and can poison benchmark integrity

- File: `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:63`
- Evidence: `parseGraderResponse()` accepts any numeric `score` from strict JSON at `:67-69`, fenced JSON at `:78-80`, regex-extracted JSON at `:89-91`, and finally accepts a score-only regex via `parseFloat()` at `:98-105`. None of these paths enforce finite numbers or a `0..1` range.
- Evidence: The parsed `grader.score` is used directly as D4 in `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:216`, then multiplied into the weighted score at `:220-221`. The result is also cached and reused via `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:191`.
- Claim: A malformed or adversarial grader response can inflate scores above the rubric range, poison the grader cache, and make benchmark promotion decisions trust invalid model output.
- Counterevidence sought: Mock paths return in-range scores, and the system prompt asks for JSON only. No schema validation or clamp exists in the code path that consumes real grader output.
- Alternative explanation: The grader model is operator-controlled rather than attacker-controlled. That limits exploitability, but this is still an integrity boundary because the benchmark relies on LLM output as a scoring input.
- Final severity: P1
- Confidence: 0.86
- Downgrade trigger: Downgrade to P2 if a caller outside this scope validates grader output before `score-model-variant.cjs` consumes it, or if real grader mode is permanently disabled in benchmark mode.
- Recommendation: Validate with a strict schema, require `Number.isFinite(score) && score >= 0 && score <= 1`, reject score-only fallback for promotion-grade runs, and avoid caching invalid parse results as reusable grader outputs.

### P2

#### DR-003-P2-001 - Grader cache persists raw model output that may echo sensitive candidate content

- File: `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:219`
- Evidence: The grader result includes `raw_grader_output` at `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:206`, writes it into the cached blob body at `:219`, and `cache.write_atomic()` persists that blob with metadata in `.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:177-184`.
- Evidence: Cache keys are hashes, and I did not find a cache-key secret leak. The remaining risk is persisted raw grader text: grader output can quote or summarize candidate output, and candidate output may itself include copied secrets or local paths.
- Recommendation: Cache only the sanitized parsed grader result by default; keep raw grader output behind an explicit debug flag with redaction and retention guidance.

## Traceability Checks

- `spawned_cli_arg_injection`: pass. `dispatch-model.cjs` builds argv arrays and calls `spawnSync(spec.bin, spec.args, ...)`; Codex receives the prompt through stdin.
- `criteria_command_execution`: fail. The scorer and bundle gate execute fixture/criteria command strings with `execSync`.
- `cwd_path_escape`: fail. The scorer requires an absolute cwd but does not constrain cwd to the repo or ensure criterion file paths remain under that cwd.
- `unsafe_deserialization`: fail. Grader JSON parsing accepts any numeric score and the regex fallback accepts score-only text.
- `secrets_exposure`: advisory. Cache keys are hashes, but raw grader output is persisted.
- `checklist_evidence`: fail. Existing scorer tests cover passing/failing grep criteria, but no test covers command allowlisting, cwd containment, or out-of-range grader scores.

## SCOPE VIOLATIONS

None. Reviewed target files were not modified.

## Verdict

FAIL for D2 security. Direct CLI argv injection is ruled out, but the benchmark/scorer path still has two P1 integrity/security defects.

## Next Dimension

D2 Security second-executor pass in iteration 4 should try to reproduce or downgrade DR-003-P1-001 and DR-003-P1-002, then widen to env allowlisting and the MiniMax skill docs.
