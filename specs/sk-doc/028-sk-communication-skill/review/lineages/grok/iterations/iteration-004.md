# Iteration 4: D4 Maintainability — docs hygiene and follow-on cost

## Focus
Dimension: maintainability. Assess clarity, scaffold leftovers, incomplete docs, and safe follow-on change cost across skill-owned docs (without re-litigating F001 as a new defect).

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=1 P2=1
- New findings ratio: 0.08

## Findings

### P0, Blocker
(none)

### P1, Required
(none new — F001 remains active and raises follow-on integration cost when README and SKILL both teach a dead `./clients` subpath)

### P2, Suggestion
- **F007**: Benchmark README still contains scaffold TODO, `.opencode/skills/sk-communication/benchmark/README.md:19`, Overview section is literally `TODO describe what this skill is benchmarked on and by which harness.` while the playbook already defines the Lane C harness and report persistence contract. Incomplete operator onboarding for benchmarks. Dimension: maintainability. Recommendation: replace the TODO with a short description pointing at the manual-testing playbook and `run-skill-benchmark.cjs`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | prior | Unchanged |
| checklist_evidence | fail | hard | prior F004 | Unchanged |

## Assessment
- New findings ratio: 0.08
- Dimensions addressed: maintainability
- Novelty justification: New F007 only. Confirmed SKILL smart router correctly scopes `RESOURCE_BASES` to `references/` only (no phantom assets load). leaf-aliases length matches manifest leaf count (20). Internal `src/clients/` path in the routing table is legitimate filesystem guidance and is distinct from the false `./clients` package export (F001).

## Ruled Out
- Missing leaf-aliases parity: 20 aliases vs 20 leaves.
- Smart-router attempting to load missing assets/: RESOURCE_BASES is references-only at SKILL.md:75.

## Dead Ends
- None.

## Recommended Next Focus
Iteration 5 stabilization / broadened angles — re-check F001 consumers, catalog features without playbook scenarios, and any residual overlay gaps. stopPolicy=max-iterations requires this fifth pass even if composite convergence is high.

Review verdict: PASS
