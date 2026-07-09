# Iteration 002 — Security Dimension + Claim Adjudication

## Dimension

security (injection, dispatch-surface prompt injection, path traversal, secrets exposure, unsafe subprocess, sandbox escape)

## Files Reviewed

1. `scripts/shared/loop-host.cjs` — Mode-switching entry point, subprocess spawning
2. `scripts/shared/promote-candidate.cjs` — Guarded promotion helper, readScoreDelta
3. `scripts/shared/fixture-lint.cjs` — Gradeable-fixture classification
4. `scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` — Lane D adapter, env forwarding
5. `scripts/non-dev-ai-system/init_packaging.py` — Template rendering scaffolder
6. `assets/non_dev_ai_system/templates/run.sh.template` — Generated benchmark runner
7. `assets/non_dev_ai_system/packaging_config.example.json` — Example config with shell-bearing values
8. `Barter/Barter deals/_loop/loop.py` — Deals guarded-refine loop (make_worktree, guarded_promote, sh)
9. `Barter/Copywriter/_loop/loop.py` — Copywriter guarded-refine loop (make_worktree reference)

## Mandatory Claim Adjudication

### R1-P1-001: make_worktree() returns Copywriter/ subdir instead of packaging root

```json
{
  "claim": "make_worktree() returns {base}/Copywriter but deals packaging root is {base}/Barter deals",
  "evidenceRefs": [
    "Barter/Barter deals/_loop/loop.py:596",
    "Barter/Barter deals/_loop/loop.py:34",
    "Barter/Barter deals/_loop/loop.py:217",
    "Barter/Barter deals/_loop/loop.py:228-234",
    "Barter/Barter deals/_loop/loop.py:403-420",
    "Barter/Barter deals/_loop/loop.py:565-574",
    "Barter/Copywriter/_loop/loop.py:592-597"
  ],
  "counterevidenceSought": "Checked every caller of make_worktree() in the deals loop. The return value flows to: (1) measure() as root param -> sample() -> benchmark_one() which uses {root}/benchmark/run.sh and os.path.dirname(root) as BENCH_BARTER; (2) guarded_promote() as worktree param -> sets CW_ROOT={worktree} env for gates.py/derive.py subprocess calls, and uses {worktree}/_gates/ paths; (3) cleanup_worktree() which does os.path.dirname(wt_cw) to get the base worktree dir. All of these expect the PACKAGING ROOT (i.e., {worktree}/Barter deals/), not a subdir. The Copywriter loop's make_worktree correctly returns {base}/Copywriter because Copywriter IS its packaging root. The deals loop's make_worktree returns {base}/Copywriter but its packaging root is {base}/Barter deals. This is structurally identical to the Copywriter version — a copy-paste that was not adapted.",
  "alternativeExplanation": "Could the deals packaging live under a Copywriter/ subdir inside the worktree? No — the repo structure is Barter/{Copywriter, Barter deals}, and CW is set to Barter deals at line 34. The worktree mirrors this structure.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Would downgrade to P2 if the deals loop is never run in --run mode (dry-run only). Evidence: the --run path is the only one calling make_worktree(); --dry-run never does. But the loop is designed for --run operation."
}
```

**Verdict: CONFIRMED P1.** The return value is used as the packaging root (CW_ROOT) by all downstream callers. For the deals loop, this resolves to a non-existent `{worktree}/Copywriter` path. The --run mode is completely broken.

---

### R1-P1-002: readScoreDelta dual-shape handling fragile for future shapes

```json
{
  "claim": "readScoreDelta() dual-shape handling is fragile — future score files with delta: { total: null } produce NaN",
  "evidenceRefs": [
    "scripts/shared/promote-candidate.cjs:70-75",
    "scripts/shared/promote-candidate.cjs:294-298"
  ],
  "counterevidenceSought": "Checked all score producers in the codebase. Lane A (score-candidate.cjs) always produces numeric delta. Lane B (model-benchmark) has no score file — benchmarkMode skips readScoreDelta entirely (line 277: `if (!benchmarkMode)`). The dual-shape exists for forward compatibility. The threshold check at line 295 uses `Number(scoreDelta || 0) < threshold` — when scoreDelta is null, this evaluates to `0 < threshold`, which with default threshold=1 blocks promotion (correct fail-safe). The NaN path (delta: { total: null } -> score.delta is object -> returns undefined -> Number(undefined || 0) -> 0) also fail-safes. The only real risk is delta: { total: 'string' } -> returns 'string' -> Number('string') -> NaN -> NaN < threshold is false -> promotion proceeds incorrectly. But this requires a malformed score file that no current producer generates.",
  "alternativeExplanation": "The dual shape may be intentional forward-compatibility scaffolding, not a bug. The current codebase has exactly one score producer (Lane A) which always uses the primitive shape.",
  "finalSeverity": "P2",
  "confidence": 0.90,
  "downgradeTrigger": "Would close entirely if a comment documents the dual-shape contract and the NaN edge case is guarded."
}
```

**Verdict: DOWNGRADED from P1 to P2.** Current producers always use the primitive shape. The NaN edge case requires a malformed score file no current producer generates. The fail-safe direction (null -> 0 -> blocks promotion) is correct.

---

## Findings by Severity

### P0

None.

### P1

(One finding carried from R1-P1-001, confirmed above. R1-P1-002 downgraded to P2.)

#### R1-P1-001 (confirmed): Barter deals `make_worktree()` returns wrong child path

**[SOURCE: Barter deals/_loop/loop.py:596]**

Adjudicated above. Returns `{base}/Copywriter` but deals packaging root is `{base}/Barter deals`. All downstream callers (guarded_promote, measure, benchmark_one, cleanup_worktree) expect the packaging root. The --run mode is completely broken for the deals loop.

### P2

#### R2-P2-001: init_packaging.py template rendering lacks context-aware shell escaping

**[SOURCE: scripts/non-dev-ai-system/init_packaging.py:170-177, assets/non_dev_ai_system/templates/run.sh.template:19-22]**

The `resolve_template()` function (line 226-240) does plain string replacement of `{{KEY}}` placeholders. Config values containing shell metacharacters (`"`, `$()`, backticks, `;;`) would be injected verbatim into the generated bash script.

The `BENCHMARK_VARIANT_CASES` placeholder is the primary attack surface: each instruction value is wrapped in `SYS="..."` (line 176) but embedded `"` characters break the quoting, and `;;` terminates the case branch. The `benchmark_variant_preludes` values are injected bare into the case body (line 174).

Example: a config with `"cli": "normal text\" ; rm -rf / ; echo \""` would produce `SYS="normal text" ; rm -rf / ; echo ""` in the rendered bash script.

**Impact:** Low in practice — configs are operator-authored and live in the repo. A malicious PR modifying the config could inject shell commands, but that's the same trust boundary as modifying the code itself.

**Recommendation:** Escape `"` as `\"` and `$` as `\$` in values destined for shell contexts. Alternatively, validate that config string values contain no shell metacharacters.

#### R2-P2-002: readScoreDelta dual-shape (downgraded from R1-P1-002)

**[SOURCE: scripts/shared/promote-candidate.cjs:70-75]**

Downgraded per claim adjudication above. The dual-shape is fragile but not currently exploitable. Adding a type guard or comment documenting the contract would close this.

#### R1-P2-001 through R1-P2-005 (carried, unchanged)

All five P2 findings from iteration 1 remain active and unmodified.

## Security Review: Ruled-Out Attack Surfaces

### Subprocess Injection (ruled out)

All subprocess calls in the reviewed scope use array-form invocation (no `shell=True`):
- `loop-host.cjs:296`: `spawnSync('node', [scriptPath, ...scriptArgs], { stdio: 'inherit' })`
- `run-non-dev-ai-system.cjs:90`: `spawnSync('python3', pyArgs, { stdio: 'inherit', ... })`
- `loop.py:71-73`: `subprocess.run(cmd, capture_output=True, text=True, env=e, timeout=timeout, stdin=subprocess.DEVNULL)` — cmd is always a list
- `loop.py:383`: `sh(["opencode", "run", "--model", PROPOSER_MODEL, ...])` — array form

### Path Traversal (low risk)

`--packaging-root` in `run-non-dev-ai-system.cjs` is used directly in `path.join(root, '_loop', 'loop.py')` without sanitization. However, `fs.existsSync()` check at line 69 prevents execution with non-existent paths. The packaging root is always operator-provided via CLI or config.

### Secrets Exposure (expected behavior)

Environment variables (including potential API keys) are forwarded to subprocesses via `env: { ...process.env }` in `run-non-dev-ai-system.cjs:73` and `env=e` in `loop.py:72`. This is expected — the subprocesses need provider credentials to call model APIs.

### Sandbox Escape (not applicable)

Git worktree operations (`git worktree add/remove`) operate within the repo structure. The `opencode run` commands use `--dir` to set the working directory. No sandbox escape vectors found.

### Dispatch-Surface Prompt Injection (low risk)

The `opencode run` prompts in `run.sh.template` include user-provided fixture content via `$TASK` (line 15: `TASK="$(cat "$BENCH/prompts/$TEST.md")"`). If a fixture prompt contained adversarial instructions, they could influence the model's behavior. This is by design — fixtures are operator-authored test cases.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | PASS | All scripts reference spec 143 T1-T6, T11 in comments/docstrings |
| checklist_evidence | PENDING | No checklist.md found in review packet; deferred |

## Verdict

Review verdict: CONDITIONAL

P1 finding present (R1-P1-001 confirmed: worktree path bug breaks --run mode for deals loop). No P0 findings. P2 advisories recorded (7 total).

## Next Dimension

traceability (spec/code alignment, docs-vs-code drift, cross-reference integrity between operator guide, loop contract, templates, and instances)
