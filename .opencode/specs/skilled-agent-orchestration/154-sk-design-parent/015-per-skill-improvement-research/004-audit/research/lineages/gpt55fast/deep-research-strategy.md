# Deep Research Strategy - gpt55fast audit lineage

## Charter

Produce prioritized, evidence-backed improvements for `sk-design` audit mode, constrained to research artifacts inside this lineage directory. Do not edit the live audit skill or parent packet. Do not run `resolveArtifactRoot`.

## Research Questions

| ID | Question | Status |
| --- | --- | --- |
| Q1 | What is the current maturity baseline of `design-audit`? | answered |
| Q2 | Which improvements are net-new and high leverage rather than duplicate existing references? | answered |
| Q3 | Are there routing or parseability defects that can explain imperfect routing scores? | answered |
| Q4 | Which operator-facing artifacts would make audits more repeatable? | answered |
| Q5 | What benchmark and manual-test additions would make improvements measurable? | answered |
| Q6 | Which attractive directions should be rejected as scope creep? | answered |
| Q7 | What should be implemented first? | answered |

## Iteration Plan

1. Inventory the live audit skill and prior 009 research.
2. Inspect evidence capture and report template behavior.
3. Replay the parseable router against representative audit prompts.
4. Review accessibility/performance and quick-fix handoff surfaces.
5. Review hardening matrix and production-readiness probes.
6. Review AI tell and anti-pattern score calibration.
7. Review register-gated transform remediation and cross-mode ownership.
8. Check manual testing and benchmark artifact coverage.
9. Cull duplicates and scope-creep recommendations.
10. Synthesize the ranked recommendation set.

## Quality Gates

- Cite checked-in files or captured stdout for every load-bearing finding.
- Prefer small documentation or fixture additions over new infrastructure.
- Preserve audit boundary: audit reports and routes; `sk-code` implements accepted fixes.
- Name evidence limitations: packet 014 has no `design-audit` benchmark directory in this checkout; the operator-provided `82/100` score is treated as context, not file evidence.
- Keep all writes inside the configured lineage artifact directory.
