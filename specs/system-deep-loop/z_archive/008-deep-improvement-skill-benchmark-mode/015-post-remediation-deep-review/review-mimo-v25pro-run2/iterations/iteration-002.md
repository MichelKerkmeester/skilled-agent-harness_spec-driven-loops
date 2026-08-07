# Iteration 002 — Correctness

## Dimension
correctness

## Files Reviewed
- `scripts/model-benchmark/scorer/grader/harness.cjs` (full, 460 lines)
- `scripts/skill-benchmark/live-executor.cjs` (full, 302 lines)
- `scripts/model-benchmark/dispatch-model.cjs` (full, 677 lines)
- `scripts/model-benchmark/scorer/score-model-variant.cjs` (full, 365 lines)
- `scripts/skill-benchmark/score-skill-benchmark.cjs` (full, 403 lines)
- `scripts/skill-benchmark/d4-ablation.cjs` (full, 258 lines)
- `scripts/model-benchmark/sweep-benchmark.cjs` (full, 646 lines)
- `SKILL.md` (546 lines)
- `references/skill-benchmark/scoring_contract.md` (59 lines)
- `changelog/v1.11.1.0.md` (46 lines)

## Findings by Severity

### P0 — None

### P1 — None

### P2

#### R2-P2-001: Regex fallback in parseGraderResponse could match across object boundaries

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:211`

**Claim:** The fallback regex `rawText.match(/\{[\s\S]*?"score"\s*:\s*([\d.]+)[\s\S]*?\}/)` at line 211 uses `[\s\S]*?` which matches across newlines and can span multiple brace-delimited objects. If the model outputs multiple JSON objects in sequence (e.g., a summary object followed by a grading object), the regex could match an opening `{` from one object and a closing `}` from another, mixing fields from unrelated objects.

**Impact:** Low. This is the third fallback (after strict JSON and fenced-block parsing), and `normalizeParsedPayload` applies capped confidence (0.3) plus an annotated rationale when the result is used. The regex is unlikely to produce a false match in practice because most model outputs either produce clean JSON or prose with a single embedded object.

**Fix:** Make the regex non-crossing by matching the innermost brace pair containing "score": replace with a regex that finds the shortest `{...}` containing `"score"`, or accept this as-is since the fallback's low-confidence annotation already degrades the result appropriately.

## Traceability Checks

### SKILL.md §11 scripts list
All 28 scripts listed in §11 exist on disk and match their described purposes. The `score-skill-benchmark.cjs` listing includes the `advisor-probe.cjs` dependency (imported at line 27). The `d4-ablation.cjs` listing matches the file that contains both `runD4Ablation` and `runD4RAblation`.

### scoring_contract.md vs score-skill-benchmark.cjs
- **D1-intra weights:** Contract says `0.4 * intentRecall + 0.6 * resourceRecall`. Code at `score-skill-benchmark.cjs:97` uses `D1_INTRA_INTENT_WEIGHT = 0.4` and `D1_INTRA_RESOURCE_WEIGHT = 0.6` (lines 36-37). ✓
- **Surface mismatch cap:** Contract says D1-intra capped at 0.25 on surface mismatch. Code uses `SURFACE_MISMATCH_D1_CAP = 0.25` (line 38), applied at line 104. ✓
- **Funnel order:** Contract specifies `activated-inter → router-unparseable → surface-mismatch → routed-intra → discovered`. Code at `firstFailingStage` (lines 153-160) checks in exactly that order. ✓
- **D4 unscored in Mode A:** Contract says D4 stays `unscored-mode-a`. Code at line 240 sets `dims.d4 = { score: null, unscored: '...' }`. ✓
- **Advisory signals:** Contract says `D4_task_outcome` and `assetRecall` are outside the weighted aggregate. Code at `aggregate` lines 334-337 computes them separately from the measured dims. ✓

### changelog/v1.11.1.0.md vs code
- **dimId threading:** Changelog says `composeGraderPrompt`, `parseGraderResponse`, mock dispatcher, cache key, and metadata all thread `dimId`. Code confirms: `composeGraderPrompt` (line 154), `parseGraderResponse` (line 186), `dispatchMock` (line 266), cache key via `derive_grader_key` (line 341-348), cache metadata (line 405). ✓
- **--append-system-prompt:** Changelog says `dispatchReal` uses `--append-system-prompt` for system half and `-p` for candidate output. Code at line 250: `['--print', '--model', GRADER_MODEL, '--append-system-prompt', prompt.systemPrompt, '-p', prompt.userPrompt]`. ✓
- **GRADED_RESPONSE_MAX_CHARS=8000:** Changelog says truncation moved from 2000 to 8000. Code at `live-executor.cjs:45` defines `GRADED_RESPONSE_MAX_CHARS = 8000`, used at line 255 for `responseText` slice. ✓
- **collectBraceBalancedObjects:** Changelog says string-aware brace scanner. Code at lines 118-148 tracks `inString` and `escaped` state correctly: inside a string, `\\` toggles `escaped`, `"` closes the string, and `{`/`}` are ignored while `inString` is true. ✓
- **shellQuote on resume hint:** Changelog says `buildResumeHint` uses `shellQuote`. Code at `dispatch-model.cjs:347` calls `shellQuote(relSentinel)` and `shellQuote(loopHost)`. ✓
- **loadConfig ENOENT-vs-parse:** Changelog says ENOENT silently continues, parse error warns. Code at lines 112-114: `if (err.code === 'ENOENT') continue; console.warn(...)`. ✓
- **criteriaExecAllowed gate:** Changelog says warns when not explicitly set. Code at `score-model-variant.cjs:115-118`: warns when `raw` is neither `'0'`, `'1'`, nor `'true'`. ✓
- **scoreScenario decomposition:** Changelog says helpers are behavior-preserving. Code confirms: `normalizeScenarioInput`, `computeSurfaceMatch`, `scoreD1Intra`, `scoreD2`, `scoreD3`, `scoreAssetRecall`, `firstFailingStage`, `modeAScore`, `buildLiveEvidence` are all called from `scoreScenario` (lines 194-260). Formulas match the scoring contract. ✓

## Verdict
**PASS** — No P0 or P1 findings. One P2 advisory (regex fallback edge case). All v1.11.1.0 remediation changes verified correct: dimId threading, --append-system-prompt, brace scanner, shell quoting, criteria exec gate, and scoreScenario decomposition all match their claims and are behavior-preserving. Traceability checks confirm SKILL.md, scoring_contract.md, and changelog all accurately describe the shipped code.

## Next Dimension
security
