# Iteration 006 — correctness (deep)

**Dimension:** correctness (deep)  
**Prior cumulative:** P0=0 P1=2 P2=9  
**This iteration:** P0=0 P1=2 P2=3

---

## Files Reviewed

- `scripts/model-benchmark/scorer/grader/harness.cjs:60-209` (parseGraderResponse, composeGraderPrompt, readSystemPrompt)
- `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md:1-45` (D4-R rubric)
- `scripts/skill-benchmark/d4-ablation.cjs:120-245` (gradeTaskOutcome, runD4RAblation)
- `scripts/skill-benchmark/live-executor.cjs:120-263` (extractRoutingJson, parseLiveResult, runLiveScenario)
- `scripts/skill-benchmark/score-skill-benchmark.cjs:120-351` (scoreScenario, aggregate, advisory signals)
- `scripts/skill-benchmark/run-skill-benchmark.cjs:120-293` (augmentWithD4R, run)
- `scripts/skill-benchmark/build-report.cjs:1-100` (renderReport advisory section)
- `scripts/model-benchmark/dispatch-model.cjs:1-120` (resolveStateDir, writeCapableOptIn)
- `scripts/model-benchmark/sweep-benchmark.cjs:270-420` (dispatchCell, extractAssistantText, runSweep)
- `scripts/model-benchmark/tests/dispatch-envelope.vitest.ts:1-100`
- `scripts/model-benchmark/tests/sweep-isolation.vitest.ts:1-100`
- `changelog/v1.11.0.0.md:1-41` (claims vs code)

---

## Findings by Severity

### P1 — Required Fix

#### R6-P1-001: Grader fallback parser hardcodes `dim_id: 'D4'` for all grader calls, including D4-R

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:187`  
**Claim:** `parseGraderResponse`'s last-resort regex fallback (lines 181–195) hardcodes `dim_id: 'D4'` regardless of which grader prompt was used. The D4-R task-outcome grader prompt (`system-grader-task-outcome.md:13`) specifies `dim_id: 'D4R'`, but when the grader response falls back to regex-only extraction, the dimension identifier is silently overwritten to `'D4'`.  
**Evidence:**
- `harness.cjs:187`: `dim_id: 'D4'` — hardcoded, not derived from the prompt or caller.
- `system-grader-task-outcome.md:13`: `"dim_id": "D4R"` — the grader is instructed to return `D4R`.
- `d4-ablation.cjs:189`: `system_prompt_path: TASK_OUTCOME_PROMPT_PATH` — D4-R calls route through the same `gradeD4` function, hitting the same fallback.

**Impact:** When a D4-R grader response fails strict/fenced/regex-JSON parsing and falls back to score-only extraction, the returned `dim_id` is `'D4'` instead of `'D4R'`. Downstream code that inspects `dim_id` to distinguish D4 (hallucination) from D4-R (task-outcome) results would misattribute the score. In the current codebase the `d4TaskOutcome` attachment in `run-skill-benchmark.cjs:255` uses `res.d4r` (not `dim_id`), so the aggregate is unaffected — but any future code relying on `dim_id` for routing or reporting would break silently.  
**Fix:** Pass `dim_id` as a parameter to `parseGraderResponse` (or `composeGraderPrompt` → response pipeline) so the fallback can emit the correct identifier. Alternatively, have `gradeD4` accept a `dimId` override and forward it.

---

#### R6-P1-002: responseText truncated to 2000 chars before grading penalizes longer D4-R outputs

**File:** `scripts/skill-benchmark/live-executor.cjs:216`  
**Claim:** `parseLiveResult` truncates `responseText` to 2000 characters (`responseText.slice(0, 2000)`). This truncated text is passed verbatim to the grader in `d4-ablation.cjs:117` (`onParsed.raw.responseText`) and `d4-ablation.cjs:233` (D4-R path). The D4-R task-outcome rubric (`system-grader-task-outcome.md:26–29`) scores "task-action correctness" and "verification fit" — both require seeing the full proposed edit and verification command. A model that produces a detailed implementation plan exceeding 2000 chars will have its output silently truncated, and the grader will score incomplete evidence.  
**Evidence:**
- `live-executor.cjs:216`: `responseText: responseText.slice(0, 2000)`
- `d4-ablation.cjs:117`: `onText: onParsed.raw.responseText` — uses truncated text.
- `d4-ablation.cjs:233`: same pattern for D4-R.
- `system-grader-task-outcome.md:26–27`: "Does the output name the right file(s) and describe a change that would actually satisfy the task" — requires full output.

**Impact:** The D4-R instrument claims to measure "real usefulness" of skill-assisted vs skill-unassisted task outputs. Truncating before grading introduces a systematic bias: longer, more detailed responses (which may be more useful) are penalized because the grader cannot see their tail. The 2000-char limit was sized for the D4 hallucination grader (which grades routing lists, typically short), not for task-outcome plans.  
**Fix:** Either increase the truncation limit for D4-R calls (e.g., 8000 chars), or pass the full `responseText` to the grader while keeping the truncated version in the report's `liveEvidence.responseHead`. The truncation is in `parseLiveResult` which is shared across both instruments — consider a `maxResponseLen` option.

---

### P2 — Suggestion

#### R6-P2-001: extractRoutingJson bare-object regex rejects nested-brace routing JSON

**File:** `scripts/skill-benchmark/live-executor.cjs:138`  
**Claim:** The bare-object fallback regex `/\{[^{}]*\}/g` matches only objects with no nested braces. While the current routing JSON shape (`{surface, subLanguage, resources, assets, agent, disambiguation}`) has no nested objects, a model that emits `{..., "meta": {"key": "val"}}` would fail to match. The fenced-block path (lines 132–135) handles this correctly; only the bare-object fallback is affected.  
**Impact:** Low — the fenced-block path is the primary extraction path, and the prose fallback (line 154) catches remaining cases. This is a robustness improvement, not a current bug.

---

#### R6-P2-002: D3 wastedCount semantics confusing for negative scenarios

**File:** `scripts/skill-benchmark/score-skill-benchmark.cjs:137`  
**Claim:** For negative scenarios, `wastedCount` is set to `routed` (the total routed count), with the note "negative scenario: D3 tracks the suppression outcome, not over-routing." The field name `wastedCount` implies resources wasted by over-routing, but in a negative scenario ALL routed resources are "wasted" (they shouldn't have been routed at all). The score correctly mirrors D1-intra, but the field semantics are misleading for consumers that interpret `wastedCount` as over-routing waste.  
**Impact:** Low — the `note` field documents the behavior, and the score is correct. A rename to `suppressedCount` or a `negative: true` flag would improve clarity.

---

#### R6-P2-003: parseGraderResponse fenced fallback doesn't validate dim_id

**File:** `scripts/model-benchmark/scorer/grader/harness.cjs:163`  
**Claim:** The fenced-JSON fallback path (lines 159–168) checks `typeof parsed.score === 'number'` but does not validate `dim_id`, unlike the strict path (line 152: `typeof parsed.score === 'number' && parsed.dim_id`). A grader response with a valid score but missing or wrong `dim_id` would pass the fenced fallback but not the strict path, creating inconsistent validation thresholds.  
**Impact:** Low — the fallback is already a degraded path, and the caller doesn't rely on `dim_id` for critical routing. Adding `dim_id` validation to all fallback paths would improve consistency.

---

## Traceability Checks

| Claim (changelog/SKILL.md) | Code reality | Verdict |
|---|---|---|
| "D4-R task-outcome instrument — separate from hallucination D4" (changelog:9-11) | `d4-ablation.cjs:183-198` uses `gradeTaskOutcome` with `system_prompt_path: TASK_OUTCOME_PROMPT_PATH` and returns `d4r` object. Separate from `gradeAblation`. | ✅ Accurate |
| "Score = 0.5 + (on − off) / 2; stamped attribution: approximate" (changelog:11) | `d4-ablation.cjs:196`: `clamp01(0.5 + (onScore - offScore) / 2)` + `attribution: 'approximate'` | ✅ Accurate |
| "Same skill-off contamination guard" (changelog:11) | `d4-ablation.cjs:225-230`: contamination check identical to hallucination path | ✅ Accurate |
| "Wired into orchestrator behind opt-in flag --d4" (changelog:12) | `run-skill-benchmark.cjs:284`: `if (code === 0 && args.d4 && (args['trace-mode'] === 'live'))` | ✅ Accurate |
| "Advisory signals NOT folded into weighted aggregate" (changelog:24) | `score-skill-benchmark.cjs:278-331`: `advisorySignals` block separate from `dimensionScores`; `aggregateScore` uses `avg((r) => r.modeAScore)` | ✅ Accurate |
| "schemaVersion: skill-benchmark-report.v1 preserved" (changelog:24) | `score-skill-benchmark.cjs:304`: `schemaVersion: 'skill-benchmark-report.v1'` | ✅ Accurate |
| "Deferred-asset scoring lane" (changelog:16) | `score-skill-benchmark.cjs:144-156`: `assetRecall` on separate channel, not in D2/D3 | ✅ Accurate |
| "D4-R aggregate 54/100" (changelog:30) | Cannot verify from code alone — runtime result. Claim is plausible given the instrument design. | ⚠️ Unverifiable (runtime) |
| SKILL.md v1.11.0.0 three-lane table (SKILL.md:29-36) | Lane A/B/C all present with correct commands. Lane C documented in `references/skill-benchmark/`. | ✅ Accurate |

---

## Verdict

**CONDITIONAL** — No P0 blockers. Two P1 correctness issues found: the hardcoded `dim_id: 'D4'` in the grader fallback parser (silent misattribution for D4-R), and the 2000-char responseText truncation before grading (systematic bias against longer task-outcome outputs). Both are in the D4-R instrument path. The weighted aggregate and CI path are unaffected (D4-R is advisory). Traceability is accurate across all verifiable claims.

---

## Next Dimension

**security** — remaining dimensions: security, traceability (code-vs-docs deep check). The untrusted-delimiter defense in `harness.cjs:94-106` and the read-only dispatch default in `dispatch-model.cjs:65-77` deserve security scrutiny.
