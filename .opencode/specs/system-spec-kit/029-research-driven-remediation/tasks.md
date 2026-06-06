# Tasks: Research-Driven Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

| ID | Task | Status |
|----|------|--------|
| T1 | Causal link/unlink post-mutation cache invalidation + relation-vocab alignment | Done (build + 293 causal tests green) |
| T2 | Remove stale MiniMax `--variant` suppression (live-confirmed acceptance) | Done (node --check + 35 playbook tests green) |
| T3 | Copy `lib/` tree in launcher-ipc-bridge fixture (only suite with the gap) | Done (un-skip proof: 0 MODULE_NOT_FOUND) |
| T4 | Code-graph `depthTruncated` completeness signal + regression test | Done (code-graph build + 35 query tests green) |

## Notes

Research over-claimed two findings, corrected during verification: the causal cache is graph-structure (not entity-density); only one launcher suite had the copy gap (not two). One verified bonus fix folded into T1 (invalid relation vocab in stats output).
