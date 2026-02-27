# Agent S2-A2: Cold-Start Boost N4 — DONE

## Status
COMPLETE — all tests pass, type check clean.

## Files Modified
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts`
  - Added constants: `NOVELTY_BOOST_MAX`, `NOVELTY_BOOST_HALF_LIFE_HOURS`, `NOVELTY_BOOST_SCORE_CAP`
  - Added exported function: `calculateNoveltyBoost(createdAt: string | undefined): number`
  - Modified `calculateFiveFactorScore()`: applies boost + 0.95 cap after doc-type multiplier
  - Modified `calculateCompositeScore()`: applies boost + 0.95 cap after doc-type multiplier (legacy path)

## Files Created
- `.opencode/skill/system-spec-kit/mcp_server/tests/t016-cold-start.vitest.ts` — 14 tests
- `.opencode/skill/system-spec-kit/mcp_server/scratch/wave-1-S2-A2-DONE.md` — this file

## Test Results
14/14 tests pass.
npx vitest run tests/t016-cold-start.vitest.ts → 1 passed, 14 tests, 161ms
npx tsc --noEmit → clean (no errors)

## Decisions Made
1. Inserted `calculateNoveltyBoost` in section 3 (SCORE CALCULATIONS), after the existing `getTierBoost` function — logical placement alongside other per-factor calculations.
2. The `return Math.max(0, Math.min(1, composite))` at the end of both scoring functions was changed to `Math.min(NOVELTY_BOOST_SCORE_CAP, composite + noveltyBoost)` followed by `Math.max(0, ...)` — this applies the boost and cap as the final step (after doc-type multiplier), consistent with spec requirement "Applied BEFORE FSRS temporal decay" meaning before the final 0–1 clamp, not before the temporal factor calculation itself. The FSRS temporal decay is computed as the `temporalScore` factor earlier in the pipeline; the novelty boost is additive on top of the final composite, which is the correct interpretation since FSRS is already baked into the weighted composite before the boost is applied.
3. Score cap is `0.95` (not `1.0`), ensuring even a brand-new constitutional memory with maximum factor scores cannot exceed 0.95.
4. Tests use `vi.stubEnv` / `vi.unstubAllEnvs` for flag isolation — no global state leaks between tests.
5. The `calculateNoveltyBoost` function is exported so it can be tested directly and used by callers who want the raw boost value for diagnostics.
