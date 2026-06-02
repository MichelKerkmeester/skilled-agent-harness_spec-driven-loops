# Iteration 5 — Maintainability

**Reviewer:** MiMo-v2.5-pro  
**Date:** 2026-06-02  
**Focus:** maintainability  
**Prior cumulative:** P0=0 P1=5 P2=9

---

## Files Reviewed

| File | Lines Reviewed |
|---|---|
| `scripts/skill-benchmark/live-executor.cjs` | 1–302 |
| `scripts/model-benchmark/dispatch-model.cjs` | 1–677 |
| `scripts/model-benchmark/scorer/score-model-variant.cjs` | 1–365 |
| `scripts/model-benchmark/scorer/grader/harness.cjs` | 1–460 |
| `scripts/skill-benchmark/score-skill-benchmark.cjs` | 1–403 |
| `scripts/skill-benchmark/d4-ablation.cjs` | 1–258 |
| `scripts/model-benchmark/sweep-benchmark.cjs` | 1–646 |
| `references/skill-benchmark/scoring_contract.md` | 1–59 |
| `SKILL.md` | 1–546 |
| `README.md` | 1–378 |
| `changelog/v1.11.1.0.md` | 1–46 |

---

## Findings by Severity

### P1 — Required Fix

#### R5-P1-001: `GRADED_RESPONSE_MAX_CHARS` has no inline rationale

**File:** `scripts/skill-benchmark/live-executor.cjs:45`  
**Claim:** The constant `GRADED_RESPONSE_MAX_CHARS = 8000` was introduced in v1.11.1.0 to replace a magic `2000`, but the constant has no doc comment explaining why 8000 was chosen, what happens if it's too low, or how it interacts with the grader harness. A future maintainer must read the changelog to understand the rationale.  
**Impact:** The value is a tuning knob — too low clips graded answers, too high wastes tokens. Without a rationale, a future refactor might re-lower it or raise it arbitrarily, re-introducing the truncation bug or inflating cost.  
**Fix:** Add a JSDoc comment: `/** Max chars of model response passed to the grader; 8000 is sufficient for a thorough task-outcome patch plan without clipping.`

#### R5-P1-002: Regex-based grader response fallback is greedy and fragile

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:211`  
**Claim:** The third fallback in `parseGraderResponse` uses `rawText.match(/\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}/)` — a greedy `\{[\s\S]*?` pattern that matches from the first `{` in the text to the last `}` containing a `score` field. If the grader model's output contains multiple JSON objects (e.g., embedded fixture metadata, a preamble JSON, AND the grade), this regex can match a span that starts in one object and ends in another, producing a malformed parse or silently picking the wrong object.  
**Impact:** The 4-layer fallback (strict → fenced → regex-object → score-only) is thorough but each layer is a maintenance liability. The regex-object layer is the most likely to produce a false-positive parse that passes `JSON.parse` on a stitched-together substring.  
**Fix:** Replace with a brace-balanced object scanner (the same pattern `live-executor.cjs:collectBraceBalancedObjects` already implements) so each `{...}` candidate is independently tested for a `score` field. This eliminates cross-object stitching and reuses proven code.

#### R5-P1-003: Grader dispatch is hardcoded to Claude CLI semantics

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:250`  
**Claim:** `dispatchReal` builds args as `['--print', '--model', GRADER_MODEL, '--append-system-prompt', prompt.systemPrompt, '-p', prompt.userPrompt]`. While `CLAUDE_BIN` and `GRADER_MODEL` are configurable via env vars, the actual CLI flag structure (`--append-system-prompt`, `--print`, `-p`) is Claude Code CLI specific. The `--append-system-prompt` flag was added in v1.11.1.0 and is the ONLY supported system-prompt delivery mechanism.  
**Impact:** If the `claude` CLI changes its flag semantics, if a new grader backend is added (e.g., Codex or Gemini), or if `--append-system-prompt` is deprecated, the entire grader harness breaks. The env-var configurability of `GRADER_MODEL` is misleading — it suggests any model works, but only Claude CLI models do.  
**Fix:** Document the Claude-only constraint in the module header and env var descriptions. Add a guard that validates `CLAUDE_BIN` exists and supports `--append-system-prompt` before dispatch (or at minimum, fail with a clear error on ENOENT).

### P2 — Suggestion

#### R5-P2-001: `scoreScenario` helper extraction creates high-param normalizer

**File:** `scripts/skill-benchmark/score-skill-benchmark.cjs:51–79`  
**Claim:** `normalizeScenarioInput` takes a single `arg` object with 6+ fields and returns 6 fields. It mixes two concerns: (1) normalizing legacy vs new input shapes, and (2) building the `expected` object from scenario metadata. The function has two reasons to change.  
**Impact:** When the scenario schema evolves, this function is the first thing that breaks, and its high parameter count makes it hard to test in isolation.  
**Fix:** Split into `normalizeInputShape(arg)` (legacy/new shape detection) and `buildExpected(scenario, obs)` (expected-object construction).

#### R5-P2-002: `dispatch-model.cjs` is 677 lines mixing 5+ concerns

**File:** `scripts/model-benchmark/dispatch-model.cjs` (entire file)  
**Claim:** The file combines rate-limit logic, multi-executor spawn specs, JSON event-stream parsing, resume-hint generation, pause-sentinel management, and CLI entry. Each concern could be a separate module.  
**Impact:** A change to one executor's args risks touching code shared by all five. The file's `buildSpawnSpec` alone is 60 lines with 5 switch cases — each executor's args are a maintenance surface.  
**Fix:** Extract `buildSpawnSpec` into a per-executor map (or at minimum, a `lib/executor-args.cjs` module). Extract `parseOpencodeStream` into `lib/opencode-stream-parser.cjs` (it's already used by `sweep-benchmark.cjs`).

#### R5-P2-003: Double-nested RegExp construction

**File:** `scripts/model-benchmark/scorer/score-model-variant.cjs:146`  
**Claim:** `new RegExp(new RegExp(a.pattern).source, 'g')` — the inner RegExp construction extracts `.source` from the pattern, then wraps it in another RegExp with the `'g'` flag. The inner construction is redundant; `new RegExp(a.pattern, 'g')` achieves the same result.  
**Impact:** Confusing to a reader about what escaping is happening. No behavioral difference, but signals a copy-paste or misunderstanding.  
**Fix:** Replace with `new RegExp(a.pattern, 'g')`.

#### R5-P2-004: Duplicated grader-base construction across files

**File:** `scripts/skill-benchmark/d4-ablation.cjs:67–76` vs `scripts/model-benchmark/scorer/score-model-variant.cjs:218–231`  
**Claim:** Both files construct grader option objects with the same field pattern (`variant_hash`, `rubric_version`, `mode`, `mock_mode`, `cache_dir`, `system_prompt_path`, `dim_id`). `d4-ablation.cjs` has `buildGraderBase()` but `score-model-variant.cjs` constructs the same fields inline in `buildGraderFn`.  
**Impact:** If a new grader option is added (e.g., a new cache field), both files must be updated independently.  
**Fix:** Export `buildGraderBase` from `harness.cjs` or a shared `lib/grader-shared.cjs` and import it in both consumers.

#### R5-P2-005: Undocumented test-only seam `opts._dispatch`

**File:** `scripts/model-benchmark/sweep-benchmark.cjs:301`  
**Claim:** `opts._dispatch` is mentioned in a comment as "test-only" but is not in the JSDoc for `runSweep` or in any external documentation. A production caller could accidentally set it.  
**Impact:** Low — the underscore prefix signals internal use, but the lack of documentation means a test author might not know it exists, and a production author might misuse it.  
**Fix:** Add to the `runSweep` JSDoc: `@param {Function} [opts._dispatch] - Test-only seam; replaces CLI dispatch.`

#### R5-P2-006: Scoring contract has no programmatic validation

**File:** `references/skill-benchmark/scoring_contract.md` (entire file)  
**Claim:** The scoring contract documents D5 penalties (P0=40, P1=12, P2=3), D1-D5 weights, and funnel stage ordering, but there is no automated check that the code matches the contract. If `d5-connectivity.cjs` changes a penalty value or `score-skill-benchmark.cjs` changes a weight, the contract silently drifts.  
**Impact:** The contract is the primary reference for operators and reviewers. A code-contract divergence undermines trust in the benchmark.  
**Fix:** Add a contract-validation test that asserts the weights in `score-skill-benchmark.cjs` match the documented values, and that D5 penalty constants match `d5-connectivity.cjs`.

---

## Traceability Checks

| Claim (changelog/v1.11.1.0) | Code Evidence | Status |
|---|---|---|
| "composeGraderPrompt threads dimId" | `harness.cjs:154` — `dimId` param, `dimensionInstruction(dimId)` at line 174 | ✅ MATCH |
| "parseGraderResponse normalizes via normalizeParsedPayload" | `harness.cjs:127–143` — `normalizeParsedPayload(parsed, dimId)` called at lines 191, 203, 215 | ✅ MATCH |
| "dispatchReal uses --append-system-prompt" | `harness.cjs:250` — `args = ['--print', '--model', GRADER_MODEL, '--append-system-prompt', prompt.systemPrompt, '-p', prompt.userPrompt]` | ✅ MATCH |
| "Fallback score-only uses dimId not hardcoded D4" | `harness.cjs:229` — `dim_id: dimId` (not `'D4'`) | ✅ MATCH |
| "GRADED_RESPONSE_MAX_CHARS = 8000" | `live-executor.cjs:45` — `const GRADED_RESPONSE_MAX_CHARS = 8000;` | ✅ MATCH |
| "collectBraceBalancedObjects is string-aware" | `live-executor.cjs:118–148` — tracks `inString`/`escaped` state | ✅ MATCH |
| "shellQuote on resume-hint path" | `dispatch-model.cjs:347` — `shellQuote(relSentinel)` and `shellQuote(loopHost)` | ✅ MATCH |
| "loadConfig ENOENT-vs-parse diagnostic" | `dispatch-model.cjs:112–114` — `if (err.code === 'ENOENT') continue; console.warn(...)` on parse failure | ✅ MATCH |
| "criteriaExecAllowed gate" | `score-model-variant.cjs:111–120` — warns on unset, preserves default | ✅ MATCH |
| "scoreScenario split into helpers" | `score-skill-benchmark.cjs:51–183` — 8 named helpers extracted | ✅ MATCH |
| "d4-ablation buildGraderBase shared" | `d4-ablation.cjs:67–76` — helper exists but NOT shared with score-model-variant | ⚠️ PARTIAL — helper is local, not cross-file shared |
| "sweep-benchmark de-duplicated event-stream parsing" | `sweep-benchmark.cjs:346–359` — uses `dispatcher.parseOpencodeStream` | ✅ MATCH |
| "SKILL.md §11 includes 6 previously-missing scripts" | `SKILL.md:544` — lists run-skill-benchmark, live-executor, score-skill-benchmark, d4-ablation, build-report | ✅ MATCH |
| "README reconciles references count 14→17" | `README.md:192–214` — 17 references listed | ✅ MATCH |

---

## Verdict

**CONDITIONAL** — 3 P1 findings, 6 P2 findings, 0 P0. The P1 findings are maintainability risks (undocumented constant, fragile regex fallback, hardcoded CLI dependency) rather than correctness bugs. The v1.11.1.0 remediation is behavior-preserving and all traceability checks pass. The P1s should be addressed before the next refactor touches the grader harness.

## Next Dimension

All four dimensions covered (correctness, security, traceability, maintainability). No further iterations needed.
