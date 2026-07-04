# Deep Review Dashboard — gpt-fast-high

| Field | Value |
|---|---|
| Session | `fanout-gpt-fast-high-1782918860442-kktrzm` |
| Stop reason | `maxIterationsReached` |
| Iterations | 10 / 10 |
| Dimensions covered | 4 / 4 |
| Active findings | P0=0, P1=7, P2=1 |
| Provisional verdict | CONDITIONAL |
| Release readiness | release-blocking for documentation remediation planning |
| hasAdvisories | true |

## Trend

| Iteration | Focus | New findings ratio | New P1 | New P2 | Verdict |
|---:|---|---:|---:|---:|---|
| 1 | correctness | 1.0000 | 1 | 0 | CONDITIONAL |
| 2 | correctness | 0.8333 | 2 | 0 | CONDITIONAL |
| 3 | security/correctness | 0.2308 | 1 | 0 | CONDITIONAL |
| 4 | traceability | 0.1613 | 1 | 0 | CONDITIONAL |
| 5 | traceability/maintainability | 0.1875 | 1 | 1 | CONDITIONAL |
| 6 | traceability | 0.1563 | 2 | 0 | CONDITIONAL |
| 7 | traceability/maintainability | 0.0000 | 0 | 0 | PASS |
| 8 | correctness/traceability | 0.0000 | 0 | 0 | PASS |
| 9 | maintainability/traceability | 0.0000 | 0 | 0 | PASS |
| 10 | stabilization | 0.0000 | 0 | 0 | PASS |

## Gate Blockers

- `spec_code`: fail. Active docs contradict `.opencode/agents/ai-council.md:4` and absent `.opencode/agents/*.toml` state.
- `playbook_capability`: fail. CO-017 still expects `--agent ai-council` direct dispatch to pass.
- `checklist_evidence`: partial. This lineage produced review outputs; post-hoc Sonnet verification remains a packet-level task outside this lineage.

## Next Action

Plan a documentation-only remediation pass. Do not implement fixes inside this review lineage.
