# Deep Review — Iteration 2

**Dimension:** correctness
**Run:** mimo-deepreview-015
**Model:** mimo-v2.5-pro
**Prior findings:** P0=0 P1=0 P2=2

---

## Files Reviewed

- `scripts/model-benchmark/scorer/grader/harness.cjs:1-460` (dimId threading, parseGraderResponse, normalizeParsedPayload, dispatchReal --append-system-prompt, clampScore01, collectBraceBalancedObjects)
- `scripts/skill-benchmark/live-executor.cjs:1-302` (GRADED_RESPONSE_MAX_CHARS=8000, collectBraceBalancedObjects, DEFAULT_MODEL, extractRoutingJson)
- `scripts/model-benchmark/dispatch-model.cjs:1-677` (shellQuote on resume-hint, loadConfig ENOENT-vs-parse, sleepSync)
- `scripts/model-benchmark/scorer/score-model-variant.cjs:1-365` (criteriaExecAllowed gate, scoreAcceptanceDeterministic, buildGraderFn)
- `scripts/skill-benchmark/score-skill-benchmark.cjs:1-403` (scoreScenario decomposition: normalizeScenarioInput, scoreD1Intra, scoreD2, scoreD3, scoreAssetRecall, firstFailingStage, modeAScore, buildLiveEvidence)
- `scripts/skill-benchmark/d4-ablation.cjs:1-258` (gradeAblation, gradeTaskOutcome, buildGraderBase dimId threading)
- `scripts/model-benchmark/sweep-benchmark.cjs:1-646` (extractAssistantText, dispatchCell, expandCells)
- `scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:155-254` (criteriaExecAllowed gate in Layer-3)
- `SKILL.md:1-546` (§4 hardening env gates, §11 script list)
- `README.md:1-378` (references count, scripts table, structure, triggers)
- `references/skill-benchmark/scoring_contract.md:1-59` (funnel stages, advisory signals, D1-D5 weights)
- `changelog/v1.11.1.0.md:1-46` (28-fix remediation claims)

---

## Findings by Severity

### P1 (required fix)

#### R2-P1-001: Duplicate criteriaExecAllowed logic in bundle-gate.cjs

**File:** `scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:173` and `scripts/model-benchmark/scorer/score-model-variant.cjs:111-120`

**Claim:** The criteriaExecAllowed gate is implemented twice with different signatures. `score-model-variant.cjs` exports a `criteriaExecAllowed()` function that checks `DEEP_AGENT_ALLOW_CRITERIA_EXEC` with a warning on the unset/default path (`warnedPermissiveCriteriaExec` flag). `bundle-gate.cjs` implements the same check inline with `process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC === '0'` — no warning, no shared function. The two implementations are functionally consistent for the `=0` disable case, but the bundle-gate path never warns on the permissive default and cannot be toggled to `'true'`/`'1'` explicitly (only `!== '0'`).

**Impact:** Low correctness risk today (both disable on `=0`), but a maintenance divergence: if the gate semantics change (e.g., default flipped to deny), the bundle-gate path would need its own update. The SKILL.md §4 contract says "BOTH criteria-exec paths are refused" which is true, but the two paths are not governed by the same code.

**Fix:** Extract `criteriaExecAllowed()` into a shared helper (e.g., `scripts/model-benchmark/scorer/lib/criteria-gate.cjs`) and import it in both `score-model-variant.cjs` and `bundle-gate.cjs`. Alternatively, have `bundle-gate.cjs` require the function from `score-model-variant.cjs`.

---

### P2 (suggestion)

#### R2-P2-001: Fallback regex in parseGraderResponse can match nested "score" key

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:211`

**Claim:** The fallback regex `rawText.match(/\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}/)` uses a non-greedy `[\s\S]*?` prefix that matches from the first `{` in the text. If the grader output contains a nested JSON object with its own `"score"` key (e.g., `{"meta": {"score": 0.1}, "score": 0.9}`), the regex could match the inner `{"score": 0.1}` fragment instead of the outer object, yielding a wrong score. The non-greedy `[\s\S]*?\}` would terminate at the first `}` after the inner score.

**Impact:** Mitigated by the three prior parse paths (strict JSON, fenced block, brace-balanced object in collectBraceBalancedObjects) which would catch the correct outer object first. The fallback regex is truly last-resort. Also mitigated by `clampScore01` bounding the result. Probability is low since grader prompts request a flat JSON response.

**Fix:** No action required for correctness. If desired, replace with a brace-balanced extraction (like collectBraceBalancedObjects) as the penultimate fallback before the score-only regex.

#### R2-P2-002: scoreScenario decomposition — modeAScore rounding differs from inline original by 0 in tests

**File:** `scripts/skill-benchmark/score-skill-benchmark.cjs:162-171`

**Claim:** The decomposed `modeAScore` function applies `Math.round(... * 100)` to the final weighted score. The changelog claims "byte-identical math" and the formulas match the original inline implementation. However, the function is now a standalone export, and the rounding happens at a single point. This is a positive change (cleaner), not a bug — noting for completeness.

**Impact:** None. The decomposition is behavior-preserving as claimed.

---

## Traceability Checks

| Claim (changelog/v1.11.1.0) | Verified? | Evidence |
|---|---|---|
| Grader is dimension-aware (dimId threaded) | ✅ | `harness.cjs:154` composeGraderPrompt dimId param, `harness.cjs:186` parseGraderResponse dimId param, `harness.cjs:338` gradeD4 opts.dim_id, `harness.cjs:347` cache key includes dim_id |
| normalizeParsedPayload stamps missing dim_id, caps mismatched confidence | ✅ | `harness.cjs:127-143` — stamps dimId on null dim_id, caps confidence to min(existing, 0.3) on mismatch, annotates rationale |
| dispatchReal uses --append-system-prompt | ✅ | `harness.cjs:250` — `['--print', '--model', GRADER_MODEL, '--append-system-prompt', prompt.systemPrompt, '-p', prompt.userPrompt]` |
| GRADED_RESPONSE_MAX_CHARS=8000 | ✅ | `live-executor.cjs:45` — `const GRADED_RESPONSE_MAX_CHARS = 8000;` used at line 255 |
| collectBraceBalancedObjects is string-aware | ✅ | `live-executor.cjs:118-148` — tracks `inString`/`escaped`, handles `\\` and `\"` correctly |
| shellQuote on resume-hint | ✅ | `dispatch-model.cjs:347` — `buildResumeHint` uses `shellQuote()` for both sentinel and loopHost paths |
| loadConfig ENOENT-vs-parse diagnostic | ✅ | `dispatch-model.cjs:112-114` — ENOENT skips silently, parse error warns |
| criteriaExecAllowed gate in score-model-variant | ✅ | `score-model-variant.cjs:111-120` — warns on unset, returns true (default), false on `=0` |
| criteriaExecAllowed gate in bundle-gate | ✅ | `bundle-gate.cjs:173` — checks `=== '0'`, returns passed:false |
| scoreScenario decomposed into helpers | ✅ | `score-skill-benchmark.cjs:51-183` — 9 named helpers, scoreScenario calls them, WEIGHTS used for modeAScore |
| D4-R uses task-outcome prompt path | ✅ | `d4-ablation.cjs:151-153` — `TASK_OUTCOME_PROMPT_PATH` points to `system-grader-task-outcome.md`, `buildGraderBase` threads `dimId: 'D4-R'` |
| SKILL.md §4 hardening env gates accurate | ✅ | Claims both criteria-exec paths refused on `=0` — verified in both score-model-variant.cjs and bundle-gate.cjs |
| SKILL.md §11 scripts list complete | ✅ | 22 scripts listed; all exist on disk |
| README references count = 17 | ✅ | README line 192: "References (17, grouped by lane)" — 6+3+3+5 = 17 |
| scoring_contract.md funnel stages match code | ✅ | Contract lists activated-inter → router-unparseable → surface-mismatch → routed-intra → discovered; code at lines 154-159 matches |

---

## Verdict

**CONDITIONAL** — One P1 (shared criteriaExecAllowed helper) and two minor P2s. No P0 blockers. The v1.11.1.0 remediation is functionally correct: dimId threading, parse normalization, shell quoting, brace scanner, criteria gate, and scoreScenario decomposition all verify against the claimed behavior. The P1 is a maintainability/consistency concern, not a correctness bug in current behavior.

---

## Next Dimension

**security** — next iteration should scrutinize: shell injection surfaces in dispatch-model.cjs (buildSpawnSpec prompt handling), untrusted grader output handling in harness.cjs (the untrustedDelimiter defense), and the criteriaExecAllowed trust boundary in score-model-variant.cjs.
