# After-state — post-build (diff vs baseline.md)

## Verification (after the shadow-only build)

| Gate | Command | Result |
|------|---------|--------|
| Typecheck | `npm run typecheck` | 0 errors (unchanged from baseline) |
| New unit tests | `npx vitest run tests/scorer/outcome-weighted-ranking.vitest.ts` | 20 / 20 pass |
| Broad scorer vitest | `npx vitest run tests/scorer` | 15 files / 109 tests — all pass (was 14/89; +1 file / +20 tests) |
| Broad scorer + legacy | `npx vitest run tests/scorer tests/legacy` | 181 pass; 2 fail — both fail identically at HEAD (skill-graph weight-band drift + 197-prompt corpus parity drift), 0 NEW failures |

## BM25 calibration telemetry — prove-first, no promotion claim

- The query-length-bucketed midpoint is **default-off**. With the flag off,
  `resolveBm25LogisticMidpoint(*, false) === 4`, so the lane squash is
  byte-identical to the baseline (`raw / (raw + 4)`) — proven by a test.
- With calibration on, a single-token query uses midpoint 2 (a strictly higher
  squashed score), a 5+-term query uses 8, others stay at 4. This changes the
  shadow lane's TELEMETRY only; the lane remains `shadowOnly: true` with a zeroed
  fusion weight, so live ranking does not move.
- **No leverage/telemetry-delta number is claimed.** Promotion requires a
  measured telemetry win on a real corpus, which is out of scope here (NO-GO).

## Live-ranking guardrail

- The live fused sort (`scoreAdvisorPrompt`) is byte-identical whether or not the
  skill-outcome store has data — proven by a test that populates the store + ticks
  the fold, then asserts identical `recommendations` JSON. The shadow re-rank is a
  separate module the live sort never imports.

## What stayed PENDING (gated)

- **Execution-success emitter runtime seam** (Q-001): the record contract + the
  append/record write-path are built and tested; which post-task signal *fires*
  the emitter is an undecided design seam, left pending.
- **Shared Beta-posterior reliability math** (REQ-004): owned by sibling 004
  (`004-c4-shadow-seam-beta-posterior`), not yet landed. The adapter seam is built
  and returns the neutral fresh-skill value until the primitive is wired — the
  re-rank is therefore inert (no live impact), exactly as the spec's edge case
  prescribes.
- **Promotion to live** (REQ-009): NO-GO — requires accumulated real
  execution-success data AND a benchmark proving the blend out-ranks pure
  similarity. Recorded in `decision-record.md`.
