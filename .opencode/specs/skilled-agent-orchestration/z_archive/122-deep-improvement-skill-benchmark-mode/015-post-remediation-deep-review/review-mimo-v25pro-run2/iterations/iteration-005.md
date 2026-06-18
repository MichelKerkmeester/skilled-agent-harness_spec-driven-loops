# Iteration 005 — Maintainability

**Dimension:** maintainability
**Focus:** Code clarity, DRY, naming, doc-vs-code alignment, cognitive complexity
**Run:** mimo-deepreview-015-run2
**Timestamp:** 2026-06-02T00:00:00Z

---

## Files Reviewed

| File | Lines | Focus |
|------|-------|-------|
| `harness.cjs` | 1-460 | Grader dispatcher, dim-threading, cache key |
| `live-executor.cjs` | 1-302 | Brace scanner, response cap, extraction |
| `dispatch-model.cjs` | 1-677 | shellQuote, loadConfig, envelope builder |
| `score-model-variant.cjs` | 1-365 | criteriaExecAllowed gate, 5-dim scorer |
| `score-skill-benchmark.cjs` | 1-403 | scoreScenario refactor, helper extraction |
| `d4-ablation.cjs` | 1-258 | D4/D4-R ablation, shared grader base |
| `sweep-benchmark.cjs` | 1-646 | Matrix expansion, cell dispatch |
| `SKILL.md` | 1-546 | Router, lane docs, script listing |
| `README.md` | 1-378 | Structure, counts, tables |
| `changelog/v1.11.1.0.md` | 1-46 | Remediation claims |

---

## Findings by Severity

### P2 — Suggestions

#### R5-P2-001: Duplicated `clamp01` logic across `d4-ablation.cjs` and `harness.cjs`

**File:** `d4-ablation.cjs:39`, `harness.cjs:81`

**Claim:** `d4-ablation.cjs` defines its own `clamp01(x)` (line 39) that is semantically identical to `harness.cjs:clampScore01(value)` (line 81). Both coerce non-finite to 0 and clamp to [0,1]; the only difference is the parameter name. `d4-ablation.cjs` already imports `harness.cjs` (line 27: `const grader = require('../model-benchmark/scorer/grader/harness.cjs')`), so `clampScore01` is already available.

**Impact:** Two copies of the same safety-critical clamping logic must be kept in sync. If the clamping behavior is ever updated (e.g. different fallback for NaN), the diverging copy is a silent bug source.

**Fix:** In `d4-ablation.cjs`, remove the local `clamp01` definition and use `grader.clampScore01` (already exported from `harness.cjs`).

---

#### R5-P2-002: `normalizeParsedPayload` conflates two responsibilities

**File:** `harness.cjs:127-143`

**Claim:** The function handles two orthogonal cases in one branch: (a) missing `dim_id` → stamp expected dim (line 129), and (b) mismatched `dim_id` → cap confidence and annotate rationale (lines 131-142). The confidence cap `Math.min(parsed.confidence, 0.3)` at line 131 doubles as both "default when missing" and "penalty for mismatch" — if a caller provides `confidence: 0.8` with a mismatched dim, it is capped to `0.3`, which may or may not be intended. The magic `0.3` is not named or documented.

**Impact:** A future maintainer changing the confidence cap for one case (e.g. raising it for dim-mismatch) could inadvertently affect the other (missing-confidence default). The unnamed `0.3` is hard to grep for.

**Fix:** Extract the mismatch confidence cap as a named constant (e.g. `DIM_MISMATCH_MAX_CONFIDENCE = 0.3`) and consider splitting the two cases for clarity.

---

#### R5-P2-003: Grader cache key omits `system_prompt_path`

**File:** `harness.cjs:341-348`

**Claim:** The `cache.derive_grader_key` call (line 341) threads `variant_hash`, `fixture_id`, `rubric_version`, `grader_model_build_hash`, `dim_id`, and `swe16_output_hash`, but does NOT include `system_prompt_path`. D4-R callers pass a different system prompt (`system-grader-task-outcome.md`) via `opts.system_prompt_path`, but if the fixture/output/dim-id are identical, the cache could return a D4-hallucination grade for a D4-R request.

**Impact:** In practice, D4 and D4-R use different `dim_id` values, so the cache key diverges. But if a future dimension reuses the same dim_id with a different prompt, the cache would be stale. This is a latent risk, not a live bug.

**Fix:** Add `system_prompt_path` (or a hash of the system prompt content) to the cache key derivation.

---

#### R5-P2-004: `scoreScenario` helper functions lack JSDoc for scoring formulas

**File:** `score-skill-benchmark.cjs:109-139`

**Claim:** The v1.11.1.0 refactor extracted `scoreD2` and `scoreD3` into standalone helpers (good), but the function-level comments are thin. `scoreD2` returns `resourceRecall` directly (line 111), while `scoreD3` computes `1 - unexpectedRoutedCount / routed` (line 133) — two different formulas for what an operator might expect to be symmetric dimensions. The relationship between D2 (recall) and D3 (precision-inverse) is not documented in the function or its callers.

**Impact:** A maintainer unfamiliar with the scoring contract could misread D3 as a recall metric (like D2) rather than a precision metric. The formulas are correct per the scoring contract, but the code doesn't cite it.

**Fix:** Add one-line JSDoc comments to `scoreD2` and `scoreD3` naming the metric (recall vs. precision-inverse) and referencing the scoring contract.

---

#### R5-P2-005: `modeAScore` rounds per-row before weighted sum

**File:** `score-skill-benchmark.cjs:162-171`

**Claim:** The `modeAScore` function (line 162) takes dimension scores that are already `Math.round(... * 100)` from `normalizeScenarioInput`, then computes a weighted sum and rounds again. Double-rounding can accumulate rounding error (e.g. `[83.5, 84.5]` rounds to `[84, 85]` → avg 84.5 → 85, but the true average is 84.0).

**Impact:** Minor — the rounding error is at most ±1 point on a 0-100 scale. This is cosmetic but could matter for threshold comparisons (e.g. verdict at 80).

**Fix:** Consider computing the weighted sum from raw (un-rounded) dimension scores and rounding only at the final step.

---

#### R5-P2-006: `scoreAssetRecall` returns `null` for missing assets instead of computing

**File:** `score-skill-benchmark.cjs:141-151`

**Claim:** `scoreAssetRecall` returns `{ score: null, note: 'no expected assets...' }` (line 145) and `{ score: null, deferred: true, ... }` (line 148) as early returns. This is a different control flow from the other dimension scorers (`scoreD1Intra`, `scoreD2`, `scoreD3`) which always return a numeric score. The advisory nature is correct, but the null-return pattern means `avg()` in `aggregate` silently skips these rows, which could confuse a maintainer tracing why `assetRecallAvg` is null.

**Impact:** Low — the advisory status is documented in the function and in the report output. But the asymmetric return shape (null vs. number) compared to the other scorers is a readability gap.

**Fix:** Add a brief comment in `scoreAssetRecall` noting that null scores are intentionally excluded from the aggregate average.

---

## Traceability Checks

### SKILL.md §11 Script Listing

SKILL.md line 544 lists 22 scripts. Cross-referencing with the actual file tree:

- All 22 scripts listed in §11 exist on disk.
- The v1.11.1.0 changelog claims "6 previously-missing scripts" were added to §11. The current listing includes: `run-skill-benchmark.cjs`, `live-executor.cjs`, `score-skill-benchmark.cjs`, `d4-ablation.cjs`, `sweep-benchmark.cjs`, `build-report.cjs` — these are all present.
- `router-replay.cjs`, `contamination-lint.cjs`, `executor-dispatch.cjs`, `playbook-generator.cjs`, `load-playbook-scenarios.cjs`, `advisor-probe.cjs`, `browser-executor.cjs`, `d5-connectivity.cjs` are present on disk but NOT listed in §11. These are support/helper scripts, not primary entry points, so the omission is consistent with §11's scope (primary scripts only).

**Verdict:** §11 listing is accurate for primary scripts. No discrepancy with code.

### README.md Counts

- README line 192: "References (17, grouped by lane)". Counting the table at lines 198-214: 17 entries. Correct.
- README line 216: "Scripts (22 + lib, grouped by lane)". Counting the table at lines 222-245: 22 entries plus lib/ helpers. Correct.
- README trigger phrases (lines 4-13): 9 entries. Matches SKILL.md frontmatter (lines 6-15): 9 entries. Correct.

**Verdict:** README counts match actual content.

### Changelog v1.11.1.0 vs Code

- "composeGraderPrompt, parseGraderResponse, the mock dispatcher, the cache key, and the cache metadata all thread a dimId" — verified: `composeGraderPrompt` (line 154), `parseGraderResponse` (line 186), `dispatchMock` (line 266), `cache.derive_grader_key` (line 341), `cache.write_atomic` (line 404) all use `dimId`.
- "normalizeParsedPayload helper backs every parse path" — verified: strict (line 191), fenced (line 203), regex (line 215), score-only (line 229 — uses `dimId` directly).
- "dispatchReal now sends the system half via --append-system-prompt" — verified: line 250.
- "GRADED_RESPONSE_MAX_CHARS = 8000" — verified: line 45.
- "collectBraceBalancedObjects" — verified: line 118.
- "shellQuote" — verified: line 356.
- "criteriaExecAllowed" — verified: line 111.

**Verdict:** All v1.11.1.0 changelog claims match the code. No discrepancy.

### scoreScenario Refactor Behavior Preservation

The v1.11.1.0 refactor split `scoreScenario` into helpers. Verifying formula equivalence:

- D1-intra: `0.4 * ir + 0.6 * rr` with surface mismatch cap at 0.25 — matches `D1_INTRA_INTENT_WEIGHT` (0.4), `D1_INTRA_RESOURCE_WEIGHT` (0.6), `SURFACE_MISMATCH_D1_CAP` (0.25).
- D2: `resourceRecall` (or `d1intra.score` for negative) — matches `scoreD2` at line 111.
- D3: `1 - unexpectedRoutedCount / routed` (or `d1intra.score` for negative) — matches `scoreD3` at line 133.
- Mode-A score: weighted sum of measured dims, normalized — matches `modeAScore` at lines 162-171.

**Verdict:** Refactor is behavior-preserving. Formulas and branch order identical.

---

## Verdict

**CONDITIONAL** — No P0 or P1 findings. Six P2 suggestions (all maintainability improvements, none blocking). The v1.11.1.0 remediation is well-executed: dimension threading is correct, the brace scanner handles strings/escapes properly, shell quoting is sound, the criteria-exec gate is explicit, and the scoreScenario refactor is behavior-preserving. The doc-vs-code alignment (SKILL.md §11, README counts, changelog claims) is accurate. The codebase is maintainable but could benefit from DRY consolidation (clamp01), named constants (confidence cap), and cache key completeness.

---

## Next Dimension

No remaining dimensions. This is the final iteration (5 of 5). The full review cycle covered: inventory+correctness, correctness, security, traceability, maintainability.

**Cumulative findings across 5 iterations:** P0=0, P1=2, P2=6 (prior) + P2=6 (this iteration) = **P0=0, P1=2, P2=12**.
