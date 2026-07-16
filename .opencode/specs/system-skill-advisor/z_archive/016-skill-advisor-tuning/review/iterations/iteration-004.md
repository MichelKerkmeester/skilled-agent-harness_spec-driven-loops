# Deep Review Iteration 004

## Dispatcher
- Run: `016-skill-advisor-tuning-deep-review-auto`
- target_agent: `deep-review`
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: `review`
- Budget profile: `scan`
- Focus: Ranked angle 4 — Corpus-number reconciliation
- Dimension: traceability

## Files Reviewed
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/spec.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/005-executor-delegation-resolver/spec.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/006-graph-causal-visited-guard/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/spec.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/python-ts-parity.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/semantic-shadow-ablation.vitest.ts`

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- Confirmed ranked charter angle 4 is the active focus [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_review-charter.md:11`].
- Reconciled the corpus-number regimes as distinct, not contradictory:

| Number | Regime | Evidence | Reproduction status |
|---:|---|---|---|
| 136 / 193 | WS4 graph-causal baseline-dist vs fix-dist corpus route diff on the then-current tree; 0 route flips, `tsCorrect 136 -> 136` | [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/006-graph-causal-visited-guard/implementation-summary.md:68`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/006-graph-causal-visited-guard/implementation-summary.md:94`] | Reproduced by reading WS4 implementation-summary verification; no rerun performed in this read-only iteration. |
| 147 / 193 | WS5 eval-hardening ratcheted baseline in the deterministic harness/filesystem projection regime, with built-in semantic disabled | [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:129`; `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:14`] | Reproduced from the committed baseline JSON: `correct=147`, `total=193`. |
| 149 / 193 | WS6 full 5-lane seeded real-provider semantic-shadow ablation, RRF/rerank off, semantic lane enabled | [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/spec.md:133`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/spec.md:138`] | Reproduced from the WS6 spec/summary; the opt-in provider-backed test was not run. |
| 150 / 193 | WS6 same seeded real-provider ablation with `disabledLanes:['semantic_shadow']` | [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/spec.md:139`] | Reproduced from the WS6 spec/summary; it is the disabled-arm comparator, not a current full-scorer baseline. |
| pythonCorrect=105 / tsAlsoCorrect=101 / regressions=4 | TS-vs-Python parity preservation gate over rows the Python reference gets correct, with built-in semantic disabled; not the same denominator as TS-vs-gold top-1 | [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/python-ts-parity.vitest.ts:174`; `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/python-ts-parity.vitest.ts:178`] | Reproduced from hard assertions in the parity test; it measures Python-preserved correctness, not full TS top-1. |

- Confirmed the parent phase map intentionally treats 006/007/008 as separate completed child phases rather than one continuous metric stream [SOURCE: `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/spec.md:86`; `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/spec.md:89`].

## Integration Evidence
- Exact integration surfaces reviewed: `/deep:review:auto` route proof in config/state, WS4 corpus route-diff verification, WS5 ratchet baseline JSON, WS6 opt-in semantic ablation harness, and `python-ts-parity.vitest.ts` hard assertions.

## Edge Cases
- The numbers were reconciled from committed docs/tests/baseline JSON rather than re-running scorer suites. This preserves read-only scope and avoids known pre-existing infra failures named by the charter.
- The `149 vs 150` pair is not a production scorer improvement claim; it is a paired ablation under a seeded real-provider harness with RRF/rerank off.

## Confirmed-Clean Surfaces
- No P0/P1/P2 findings were found for angle 4.
- No advisor implementation files were edited.

## Ruled Out
- Ruled out a corpus-number contradiction: 136, 147, 149/150, and 105/101/4 are different regimes with distinct denominators or comparators.
- Ruled out treating `pythonCorrect=105 / tsAlsoCorrect=101` as TS top-1 accuracy; the test explicitly defines it as preservation of Python-correct rows.

## Next Focus
- dimension: traceability
- focus area: WS3 parity ledger has no owning child
- reason: Ranked charter angle 5 follows angle 4.
- rotation status: angle 5 of 10
- blocked/productive carry-forward: Carry P1 findings from angles 1–3; angle 4 produced a clean reconciliation table.
- required evidence: REQ-003 owner docs, approved divergence ledger, 197→193 rename evidence, force-local parity and SQLite/source evaluation evidence.
