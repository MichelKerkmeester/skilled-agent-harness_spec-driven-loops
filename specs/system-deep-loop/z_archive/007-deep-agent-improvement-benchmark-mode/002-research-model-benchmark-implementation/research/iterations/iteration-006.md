# Iteration 6 — Q5: Backward-Compat Test Strategy + Implementation Edge Cases

## Focus

Q5: Design the backward-compat test strategy — regression fixtures for both modes, default-mode invariants, and concrete implementation edge cases the build packet must handle. This is the final unanswered question.

## Actions Taken

1. **Audited `score-candidate.cjs`** — the agent-improvement scorer. Confirmed it emits `evaluationMode: 'dynamic-5d'` in all records; maps to `agent-improvement` in the new naming scheme.
2. **Audited `run-benchmark.cjs`** — confirmed it emits `type: 'benchmark_run'` with `evaluationMode: 'benchmark'` and `type: 'infra_failure'` with `evaluationMode: 'benchmark'`.
3. **Audited `reduce-state.cjs`** — confirmed record-type routing is already mode-agnostic (only uses `record.type` and `record.evaluationMode`).
4. **Audited `promote-candidate.cjs`** — no `--mode` flag; convergence criteria are implicit in the promotion gate logic.
5. **Audited `materialize-benchmark-fixtures.cjs`** — standalone, gated by caller only.

## Findings

### F1 — Backward-Compat Invariants (Agent-Improvement)

These must hold true after the build:

**BC-INV-1**: `loop-host.cjs` (or whatever entry point) with `--mode=agent-improvement` OR no `--mode` flag MUST produce byte-for-byte identical state JSONL records as the current production path.

**BC-INV-2**: Existing callers of `score-candidate.cjs` (passing `--candidate=... --output=...`) must continue to work without modification. No new required arguments may be added.

**BC-INV-3**: The `type: 'scored'` record schema emitted by `score-candidate.cjs` must remain backward-compatible:
```json
{
  "status": "scored",
  "rubricVersion": "...",      // existing field
  "profileId": "...",          // existing field
  "evaluationMode": "agent-improvement",  // renamed from 'dynamic-5d', ADDED field
  "mode": "agent-improvement",  // NEW field — backward compat: present and correct
  "score": 85,                 // existing field
  "recommendation": "...",     // existing field
  "dimensions": [...],          // existing field
  "failureModes": [...]         // existing field
}
```
The rename of `evaluationMode: 'dynamic-5d'` → `'agent-improvement'` is a **breaking change** for any consumer that does exact-match string comparison. However, reduce-state.cjs does not check this string — it only checks `record.type === 'scored'`, so it is immune.

**BC-INV-4**: `reduce-state.cjs` must continue to correctly aggregate records that have NO `mode` field (old records from before this feature). The `inferProfileId()` and `inferFamily()` helpers already handle missing fields with fallbacks.

**BC-INV-5**: `promote-candidate.cjs` must default to `agent-improvement` behavior when `--mode` is absent or unknown. A `mode` field check that does not match known values must fall through to `agent-improvement`.

---

### F2 — Regression Test Strategy

**TST-1 — Identity Test (most critical)**:
```
node loop-host.cjs --candidate=<known-path> --output=/tmp/score-A.json
node loop-host.cjs --candidate=<known-path> --output=/tmp/score-B.json --mode=agent-improvement
diff /tmp/score-A.json /tmp/score-B.json
→ must be empty (no difference)
```
This validates BC-INV-1. Run this as a CI gate before any merge.

**TST-2 — State-Log Shape Regression**:
Parse the state JSONL written by the agent-improvement path. Assert:
- Every line is valid JSON
- Every `scored` record has `type`, `status`, `evaluationMode`, `mode`, `score`, `recommendation`
- `evaluationMode === 'agent-improvement'`
- `mode === 'agent-improvement'`
- No new required fields added that would break JSONL consumers

**TST-3 — Score Determinism (Agent-Improvement)**:
Run `score-candidate.cjs` twice on the same candidate with same manifest. Assert `score` and `recommendation` are identical. The scorer has a SHA256 cache — ensure `--no-cache` produces identical results.

**TST-4 — Benchmark Path Smoke Test**:
```
node materialize-benchmark-fixtures.cjs --profile=<test-profile> --outputs-dir=/tmp/fixtures-out
node run-benchmark.cjs --profile=<test-profile> --outputs-dir=/tmp/fixtures-out
→ must produce report.json with aggregateScore and recommendation fields
→ state log must contain a `benchmark_run` record
```

**TST-5 — Default Mode is Agent-Improvement**:
Call `loop-host.cjs` with no `--mode` argument and assert it calls `score-candidate.cjs` (not `run-benchmark.cjs`). This is validated by TST-1 (identity test).

**TST-6 — Mode Field Persistence in State Log**:
When running in `model-benchmark` mode, every state record must carry `mode: 'model-benchmark'`. When running in `agent-improvement`, every state record must carry `mode: 'agent-improvement'`. No record in a mixed run should have `mode: null` or `mode: undefined`.

---

### F3 — Implementation Edge Cases

**EC-1 — Empty or Missing State Log on First Run**:
`reduce-state.cjs` calls `parseJsonl(readUtf8(stateLogPath))` — if the file does not exist it throws. The caller must ensure the state log directory exists before writing. This is already handled by `fs.appendFileSync` (creates parent dirs) in existing code, but `loop-host.cjs` must follow the same pattern.

**EC-2 — Unknown `--mode` Value**:
If a user passes `--mode=foobar`, the loop must:
1. NOT crash
2. Default to `agent-improvement`
3. Log a warning to stderr

```js
const VALID_MODES = new Set(['agent-improvement', 'model-benchmark']);
const resolvedMode = VALID_MODES.has(args.mode) ? args.mode : (() => {
  if (args.mode !== undefined) {
    process.stderr.write(`loop-host: unknown mode '${args.mode}', defaulting to 'agent-improvement'\n`);
  }
  return 'agent-improvement';
})();
```

**EC-3 — Mixed State Log (Pre/Post Feature)**:
If old state log records (without `mode` field) are mixed with new records (with `mode` field), `reduce-state.cjs` must not break. It already handles this via `inferProfileId()` (defaults to `'dynamic'`) and `inferFamily()` (defaults to profileId). The dashboard renderer accesses `record.mode` only if present.

**EC-4 — Concurrent Execution**:
If two `loop-host.cjs` processes run simultaneously against the same state log, `fs.appendFileSync` does not coordinate. The state log path must be scoped per-run or locked. Recommendation: the caller should use a run-specific state log path (e.g., `agent-improvement-state-<timestamp>.jsonl`) for concurrent runs, or rely on the filesystem write-lock of the OS.

**EC-5 — `materialize-benchmark-fixtures.cjs` Failure**:
If `materialize-benchmark-fixtures.cjs` fails (missing fixture file, parse error), `run-benchmark.cjs` will silently produce all-zero scores (because `scoreFixture()` returns `missing-output` failure mode). The caller must detect non-zero exit code from materialize and propagate it before calling run-benchmark.

**EC-6 — Score Cache Collision**:
`score-candidate.cjs` uses SHA256 of (rubricVersion + candidateContent + baselineContent + targetPath + manifest + profile + dimensionConfig) as the cache key. If two different candidates produce identical content, the cache returns a stale score. This is pre-existing. For model-benchmark, the cache key should NOT include `baselineContent` (not applicable). The cache key must differ by mode to prevent cross-mode cache hits.

**EC-7 — `mode` Field in `infra_failure` Records**:
Both `score-candidate.cjs` and `run-benchmark.cjs` emit `infra_failure` records. These must carry the correct `mode` field so `reduce-state.cjs` can attribute them correctly. Currently `score-candidate.cjs` infra failures do NOT carry `evaluationMode` or `mode` (confirmed from code review of the failure object at lines 426–440 and 446–461). The build must add `evaluationMode: 'agent-improvement'` and `mode: 'agent-improvement'` to all score-candidate infra failure records.

**EC-8 — `promote-candidate.cjs` Mode Routing**:
`promote-candidate.cjs` is called by the loop host with `--mode`. If `--mode=model-benchmark`, the script must read the `benchmark_run` record fields (aggregateScore, passRate, minimumFixtureScore) from the score file passed via `--score=...`. The `--score` file for model-benchmark is a `benchmark_run` record (JSON), not a `scored` record. The script currently expects `score.status === 'scored'` (line 168). For model-benchmark, the equivalent check should be `score.status === 'benchmark-complete'`.

**EC-9 — `variant` Argument in `dispatch-model.cjs`**:
The 120/003 `dispatch-minimax.cjs` deliberately omits `--variant` because the framework bake-off holds it constant. For deep-agent-improvement's model-benchmark mode, the variant IS the experimental axis (one model vs another). `dispatch-model.cjs` MUST accept and forward a `--variant` argument when provided. The agent-improvement path should NOT pass `--variant` (it is held constant for comparison).

**EC-10 — Rubric Version Mismatch**:
`score-candidate.cjs` hardcodes `RUBRIC_VERSION = 'dynamic-5d/p126-reproducibility-v1'`. When the scorer is called in model-benchmark mode, the rubric version for benchmark-mode scoring should reflect the benchmark rubric (e.g., `'benchmark/v1'`), not the agent-improvement rubric. The rubric version must be passed through the scoring context and NOT hardcoded inside the scorer when called from model-benchmark mode.

---

### F4 — Build-Delta Summary (All Questions Answered)

**CREATE — `loop-host.cjs`** (new entry point):
```
- Accepts --mode=agent-improvement|model-benchmark (default: agent-improvement)
- --mode=agent-improvement: calls score-candidate.cjs → appends to state log → calls promote-candidate.cjs --mode=agent-improvement
- --mode=model-benchmark: calls materialize-benchmark-fixtures.cjs → calls run-benchmark.cjs → appends to state log → calls promote-candidate.cjs --mode=model-benchmark
- Unknown mode: warns to stderr, falls back to agent-improvement
- All state records: include mode field
```

**MODIFY — `score-candidate.cjs`**:
```
- Rename evaluationMode: 'dynamic-5d' → 'agent-improvement' in all output records
- Add mode: 'agent-improvement' to all output records (including infra_failure)
- No new required arguments
- backward-compat: existing callers with no --mode argument continue to work
```

**MODIFY — `run-benchmark.cjs`**:
```
- Add mode: 'model-benchmark' to all state records (already has evaluationMode: 'benchmark')
- Ensure infra_failure records also carry mode: 'model-benchmark'
```

**MODIFY — `promote-candidate.cjs`**:
```
- Accept --mode argument (default: 'agent-improvement')
- When mode=agent-improvement: require score.status === 'scored' (existing)
- When mode=model-benchmark: require score.status === 'benchmark-complete'
- Mode-aware convergence criteria per iteration-4 findings (F8)
```

**MODIFY — `reduce-state.cjs`**:
```
- Add mode field to profile bucket metadata
- Display mode in dashboard per-profile section
- No structural changes to registry aggregation logic
```

**CREATE — `dispatch-model.cjs`**:
```
- Model-agnostic dispatcher, generalized from dispatch-minimax.cjs
- Accepts --prompt-file, --model, --executor, --agent, --mock, --mock-mode, --cwd, --timeout-ms, --variant
- --variant: only forwarded for model-benchmark; omitted for agent-improvement
- modelBenchmarkConfig injected by loop-host for model-benchmark; undefined for agent-improvement
- Uses dynamic require / factory pattern gated on mode
```

**CREATE — Benchmark harness grader factory** (from 120/003 eval-rig):
```
- buildGraderFn(mode): factory function in eval-rig/grader/harness.cjs
- mode=agent-improvement: LLM grader with 5-dim rubric
- mode=model-benchmark: NOOP or forbidden-patterns simple match
- Seam contract: score(outputText, scoringContext, mode)
```

---

### F5 — Full Per-Seam Interface Contracts

**SEAM-1 — Candidate-Source Seam**:
```typescript
interface CandidateSourceOpts {
  bestCandidate: object | null;
  noImprovementCount: number;
  statePath: string;
}

interface CandidateSourceResult {
  proposal: {
    id: string;
    signature: string;
    meta?: object;
    filePath?: string;
    source: 'seeded' | 'mutated' | 'imported';
  } | null;
}
```

**SEAM-2 — Dispatcher Seam**:
```typescript
interface DispatchOpts {
  prompt_file: string;
  executor: 'cli-opencode' | 'cli-claude-code' | 'cli-devin' | 'cli-codex' | 'cli-gemini';
  model: string;                    // resolved from config if omitted
  agent?: string;                    // resolved from config if omitted
  mock?: boolean;
  mock_mode?: string;
  cwd?: string;
  timeout_ms?: number;
  variant?: string;                 // model-benchmark only; held constant for agent-improvement
  modelBenchmarkConfig?: object;    // injected by loop.cjs for model-benchmark; undefined for agent-improvement
}

interface DispatchResult {
  ok: boolean;
  exit_code: number;
  stdout: string;
  stderr: string;
  attempts: number;
  paused?: boolean;
  pause_reason?: string;
  mock?: boolean;
}
```

**SEAM-3 — Scorer Seam**:
```typescript
interface ScoreOpts {
  candidateId: string;
  candidateHash: string;
  fixture: object;                  // for model-benchmark; agent-improvement passes profile as fixture-compatible object
  outputText: string;
  rubricVersion: string;
  mode: 'agent-improvement' | 'model-benchmark';
  mockMode?: string;
}

interface ScoreResult {
  fixtureId: string;
  weightedScore: number;            // 0..1, must be 0 when hard_gate_failed
  dimensions: object;
  hard_gate_failed: boolean;
}
```

---

## Questions Answered

- **Q5** (fully): Backward-compat test strategy — identity test (TST-1) is the most critical CI gate; state-log shape regression (TST-2); score determinism (TST-3); benchmark smoke test (TST-4); default mode behavior (TST-5); mode field persistence (TST-6). All 5 questions are now answered.

## Questions Remaining

None. All 5 key questions are answered:
- Q1 (interface contracts): answered in iterations 1 and 3
- Q2 (dispatch generalization): answered in iteration 2
- Q3 (scorer port): answered in iteration 3
- Q4 (mode switch wiring): answered in iteration 4
- Q5 (backward-compat + edge cases): answered in this iteration

## Next Focus

All questions resolved. Recommend this research packet converges — `newInfoRatio` should be computed by the reducer over the full iteration history. If convergence is declared, the build packet should synthesize the full build-delta from iterations 1–6 and hand off to an implementation agent.
