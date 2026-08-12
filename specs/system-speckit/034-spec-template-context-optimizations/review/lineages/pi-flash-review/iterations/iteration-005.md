# Iteration 5: REQ-001 gating completeness — per-level render contract for research.md.tmpl

## Focus
Dimension: correctness (deep re-audit of REQ-001). Scope: verify the working-tree research.md.tmpl restructure renders the intended sections per level, that the phase level is handled, and that REQ-001's acceptance ("renderer snapshot tests pass; spec-kit-docs.json gains a research.md documents entry") is verifiable from the current test surface.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 5
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P1, Required
- **F013**: REQ-001 "renderer snapshot tests pass" is unverifiable for research.md.tmpl — no test covers its renders, while the only render snapshot suite fails, `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:37`, [Evidence: the golden-snapshot suite iterates only `requiredCoreDocs + requiredAddonDocs` per level (scaffold-golden-snapshots.vitest.ts:37); research.md.tmpl is a `lazyAddonDoc` (level-contract-resolver.vitest.ts:13) and is NOT rendered by any snapshot test (`grep -rn "research.md.tmpl" scripts/tests/*.ts` → no hits). REQ-001's acceptance "renderer snapshot tests show L1 render collapses well below 944 lines" therefore has no automated proof, and the one suite that does cover the manifest templates currently FAILS (4 snapshot mismatches on spec.md at Levels 1/2/3/3+, observed iteration 1).]

### P2, Suggestion
- **F014**: Level-gating success is lopsided — L1 collapses to 175 lines but L3/3+/phase renders stay at 944 (full template), `research.md.tmpl:152`, [Evidence: measured renders: L1=175, L2=350, L3=944, 3+=944, phase=944. The restructure gates sections 4-6 at level:2+ and 7-16 at level:3+ (research.md.tmpl:152/329), so Level-3+ authors still read the full 944-line template. That matches spec.md.tmpl's own gating pattern (spec.md.tmpl keeps L3+ near-full), so it is consistent behavior — but REQ-001's "materially smaller at every level" phrasing in the problem statement (spec.md:61 "944-line research template at every level") should be narrowed to L1/L2 to stay honest about the actual savings.]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:61/108 vs measured renders + test surface | Savings claim L1/L2 verified (175/350 lines); L3+ unchanged; snapshot-proof acceptance has no test |
| checklist_evidence | pass | hard | checklist.md CHK-007 | Unchecked |

## Assessment
- New findings ratio: 0.55
- Dimensions addressed: correctness
- Novelty justification: F013 (no automated render proof for research.md) and F014 (lopsided savings) are new angles on REQ-001 beyond the earlier 944-constant nit (F003).

## Ruled Out
- "research.md renders are covered by the snapshot suite": [lazyAddonDocs excluded from the iteration loop], [vitest source inspection]
- "L3 savings equal L1 savings": [measured 944 vs 175], [renderer output line counts]

## Dead Ends
- None.

## Recommended Next Focus
Broaden: AC_COVERAGE behavior verification — run the rule against a known-covered and a known-under-covered fixture packet to confirm the warn/no-warn observable (F008 claim adjudication).

Review verdict: CONDITIONAL