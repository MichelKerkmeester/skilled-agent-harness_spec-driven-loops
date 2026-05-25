# Deep Research Strategy: Deep Skills Unique Value Differentiation

## Charter

This 10-iteration deep-research run characterizes the unique value differentiation of three "deep" skills: deep-review, deep-research, and deep-council. The goal is to identify contract surface differences, use-case overlap, cost-latency profiles, findings schema variations, routing rules, and drift risks across the three skills.

## Iteration Plan

From `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/plan.md` §2:

1. **Iter-001 (contract-surface)**: Characterize deep-review contract — input shape, output artifacts, state files, convergence semantics, command-mode suffixes.
2. **Iter-002 (contract-surface)**: Characterize deep-research contract — input shape, output artifacts, state files, convergence semantics, command-mode suffixes.
3. **Iter-003 (contract-surface)**: Characterize deep-council contract — input shape, output artifacts, state files, convergence semantics, command-mode suffixes.
4. **Iter-004 (use-case-overlap)**: Map use-case overlap between the three skills — when to use which, decision matrix.
5. **Iter-005 (cost-latency)**: Analyze cost-latency profiles per skill — executor selection, iteration count, token budget, runtime duration.
6. **Iter-006 (findings-schema)**: Compare findings schema across skills — P0/P1/P2 tiers, evidence requirements, adjudication flows.
7. **Iter-007 (routing-rule)**: Document routing rules — command suffixes, auto-detection, advisor confidence thresholds.
8. **Iter-008 (drift-risk)**: Assess drift risk — contract evolution, backward compatibility, migration paths.
9. **Iter-009 (synthesis)**: Synthesize unique value claims per skill — differentiation matrix, recommendation guide.
10. **Iter-010 (validation)**: Validate findings against ground truth — test cases, edge scenarios, operator feedback.

## Convergence Criteria

- Convergence threshold: 0.2
- Minimum findings per iteration: 8
- All findings must have file:line citations
- Registry fingerprint deduplication enforced
- State JSONL must track iteration progress

## Known Context

None — this is the first iteration of the research run.

## Next Focus

Characterize deep-review contract from command entrypoint, workflow YAMLs, agent definition, and deep-loop runtime API.
