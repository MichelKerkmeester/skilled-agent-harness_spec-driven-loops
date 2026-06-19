# Baseline — before any change (REQ-008)

Captured before the outcome-weighted-ranking follow-on build. No leverage number
is quoted; none exists in the campaign (every leverage tag is structural inference).

## Verification baseline (HEAD, no edits)

| Gate | Command | Result |
|------|---------|--------|
| Typecheck | `npm run typecheck` | 0 errors |
| Broad scorer vitest | `npx vitest run tests/scorer` | 14 files / 89 tests — all pass |

## Live behaviors held byte-identical by this build

- **BM25 logistic midpoint** (`lib/scorer/lanes/bm25.ts`): `score = rawScore / (rawScore + 4)`
  with a fixed midpoint constant `4`. The lane is `shadowOnly: true` with a zeroed
  fusion weight, so it is telemetry-only — it does not contribute to the live sort.
  The query-length calibration is added DEFAULT-OFF; with the flag off the midpoint
  stays `4`, byte-identical to this baseline.
- **Live fused sort** (`lib/scorer/fusion.ts` `scoreAdvisorPrompt`): the outcome-weighted
  re-rank is a separate shadow module never imported by the live sort, so the live
  recommendation order is unchanged whether or not the skill-outcome store has data.

## Signal that does NOT exist today

- The advisor captures only recommendation-acceptance (`AdvisorHookOutcomeRecord`:
  `accepted | corrected | ignored`, keyed on `skillLabel`). There is no per-skill
  execution-success signal. This build adds the net-new execution-success record +
  durable store + idempotent fold; the runtime seam that fires the emitter and the
  shared Beta-posterior reliability math stay PENDING (the latter owned by sibling 004,
  not yet landed).

## After-state

See `after.md` (captured post-build; diff vs this file).
