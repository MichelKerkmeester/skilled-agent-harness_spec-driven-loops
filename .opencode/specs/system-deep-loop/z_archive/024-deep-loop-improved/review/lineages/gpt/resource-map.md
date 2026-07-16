# Review Resource Map: GPT Lineage

Resource map was absent at the target root. This lineage-local map records the surfaces actually reviewed.

| Surface | Files | Findings |
|---------|-------|----------|
| Phase 011 status and metadata | `spec.md`, `011-followup-remediation/spec.md`, `011-followup-remediation/graph-metadata.json`, child summaries | GPT-F001 |
| Recursive validation coverage | `validate.sh`, phase 011 handoff docs, 006 implementation summary | GPT-F002 |
| Strict-only validator coverage | `validate.sh`, `orchestrator.ts`, `validator-registry.json` | GPT-F003 |
| Cross-mode fan-out session id | `fanout-run.cjs`, `deep_context_auto.yaml`, `deep_research_auto.yaml` | GPT-F004 |
| Sliding-window convergence | child 007 docs, `coverage-graph-signals.ts`, `convergence.cjs` | GPT-F005 |
| Validation bridge tests | 006 implementation summary, `orchestrator.ts` | GPT-F006 |

## Empty-Result Replay

- Security replay found the prior OpenCode dangerous permission bypass fixed by an explicit `danger-full-access` opt-in.
- Merge replay found the prior registry-only merge issue fixed by state-log reconstruction helpers.
- Salvage replay found the prior exit-0/missing-artifact and salvage failure gates fixed in current `fanout-run.cjs`.
