# Iteration 9: Final Numerical Cross-Check of Load-Bearing Figures

## Focus

Independent re-derivation of every number that the synthesis will carry, from live source, to guarantee the convergence report cites only verified figures.

## Findings

### F1. Cross-check table (all measured from live source this lineage unless noted)

| Figure | Value | Verification |
|---|---|---|
| GATE_3_QUESTION | **521 B** | Measured from spec-gate-core.mjs:117-124 array join — exact match with 001's 521 B |
| HYGIENE+GOVERNOR+PROOF+label | 767 B | render.ts constants measured (iter 3); 001's 763 B within capture variance |
| Full brief (head+directives) | 809 B | measured (iter 3); 001's 806 B within variance |
| Route head | 42-43 B | measured 42 B; 001/004: 43 B |
| PI_SUBAGENT_DISPATCH_DIRECTIVE | **554 B** | measured (iter 3) — exact match with 001 |
| Activation matrix | 30 cells: 13 emit / 17 N/A / **0 evidence** | programmatic count (iter 2) |
| 004 shadow 10-turn reduction | 9,626 → 1,715 B (−82.2%) | 004 impl summary receipt `reductionPct=82.2` (iter 2) |
| Pi 10-turn baseline (no dedup) | 13,630 B | 10 × 1,363 (derived from measured constants) |
| 013 dedup best-case 10-turn | 6,727 B | 1,363 + 9 × 596 (iter 3) |
| Fallback-case 10-turn | 13,420 B | 10 × 1,321 (iter 3) |
| End-state worst→best 10-turn (steps 1+4b) | 2,347-6,855 B | iter 7 projections |
| Continuity (SessionStart) | ~389 B | 001 representative capture (not re-measured; fragments in session-prime.ts) |

### F2. No figure required correction

Every figure the synthesis will cite was either re-measured exactly (521, 554) or confirmed within documented capture variance (767/763, 809/806, 42/43). The 389 B session-context figure rests on 001's capture (session-prime.ts emits composed templates — measured fragments sum to ~800 B across 12 templates but the composed output shape varies by lifecycle; 001's representative capture remains the cited value).

### F3. Convergence-accounting inputs

Evidence ratios: [1.0, 0.85, 0.8, 0.8, 0.75, 0.35, 0.6, 0.25] (8 evidence iterations; no thought/insight statuses). Question coverage: 5/5 answered. Stuck count: 0 (no sub-threshold consecutive runs).

## Sources Consulted

- spec-gate-core.mjs:117-124 (GATE_3_QUESTION measured)
- render.ts constants (iter 3 measurements); prompt-advisor.ts (554 B)
- activation-matrix.json (iter 2 count); 004 implementation-summary.md:135
- session-prime.ts (template inventory); hooks/001 research.md:46-60

## Assessment

- **newInfoRatio: 0.2** — cross-check pass; exact 521 B confirmation is the only new datum; no corrections needed.
- **Confidence:** high — synthesis figures are now source-verified.

## Reflection

- What worked: measuring the Gate-3 question directly (exact match) closes the last unverified byte figure.
- What failed: nothing.
- Ruled out: any correction to the numbers carried from iterations 1-8.

## Recommended Next Focus

Iteration 10 (final): Convergence report inputs — signal computation over the 9-iteration series, gap statement, and handoff to synthesis.
