# Deep Review Iteration 005 — 009-cocoindex-ipc-fix

**Dimension:** performance
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:52:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-009-001 | 009-cocoindex-ipc-fix/tasks.md:77 | Active carry-forward: no new P0, existing indexing blocker remains. | `tasks.md:77`. | Same fix as iteration 001. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-009-005 | 009-cocoindex-ipc-fix/implementation-summary.md:98 | Latency evidence covers 20 warmed `limit=1` calls only; normal limit=3/5 and live daemon restart are not measured. | `implementation-summary.md:98` reports p95 for `limit=1`; verification caveat at `:74`. | Re-measure after live daemon restart with the default search limit and representative path/language filters. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-009-005 | 009-cocoindex-ipc-fix/tasks.md:81 | Parent graph metadata update remains unchecked. | `tasks.md:81` is `[ ] T015`. | Complete it during finalization or remove from 009 if parent state is owned by 008. |

## Notes
Converged after five passes. 009 remains FAIL for ship because the source-indexing P0 is unresolved.
