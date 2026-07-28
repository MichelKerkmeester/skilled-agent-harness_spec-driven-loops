# Iteration 5: spec_code Protocol

## Focus

Core `spec_code` protocol — verify normative contract claims resolve to shipped behavior in agents and registries.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: contract.md, .opencode/agents/markdown.md, .opencode/agents/prompt-improver.md
- New findings: P0=0 P1=0 P2=0
- New findings ratio: 0.08

## Findings

None new. Grep of `.opencode/agents/` shows no live references to pre-rename packet paths. REQ-003 routing resolution holds for sampled agents.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | Agents align; parent status gap (F001) remains |

## Assessment

Live routing surfaces match contract; metadata reconciliation still outstanding.

Review verdict: PASS
