# Deep Review Dashboard

## Status

- Lineage: `codex-4`
- Session: `fanout-codex-4-1780595350529-muaf3m`
- Phase: synthesis complete
- Stop reason: converged
- Final verdict: `CONDITIONAL`
- Iterations: 5
- Active findings: 4

## Finding Counts

| Severity | Count | Status |
| --- | ---: | --- |
| P0 | 0 | none |
| P1 | 2 | active |
| P2 | 2 | active |

## Findings

| ID | Severity | Dimension | Title |
| --- | --- | --- | --- |
| P1-001 | P1 | Correctness | Comment-hygiene checker misses forbidden requirement/checklist IDs on mixed stable-reference lines |
| P1-002 | P1 | Security | Direct-main workflow bypasses the only CI comment-hygiene gate while local hooks remain opt-in and bypassable |
| P2-001 | P2 | Traceability | Constitutional deep-review executor rule is stale relative to the command/runtime executor model |
| P2-002 | P2 | Traceability | sk-doc and sk-code version metadata drift across SKILL, README, and changelog surfaces |

## Coverage

| Dimension | Covered | Iterations |
| --- | --- | --- |
| Correctness | yes | 001, 005 |
| Security | yes | 002, 005 |
| Traceability | yes | 003, 005 |
| Maintainability | yes | 004, 005 |
| Stabilization | yes | 005 |

## Convergence

- Last two new-finding ratios: `0.0`, `0.0`
- Latest stabilization pass: no new P0/P1 findings
- Active P0: 0
- Active P1: 2
- Release readiness state: converged conditional

## Verification

- JSON config and registry parse: passed
- JSONL state and deltas parse: passed
- Iteration verdict final lines: passed
- sk-doc skill validation: passed
- sk-code skill validation: passed
