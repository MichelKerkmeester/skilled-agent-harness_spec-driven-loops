# Deep Review Iteration 003 — 007-voyage-cleanup-and-egress-monitoring

**Dimension:** reversibility
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:46:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-007-003 | 007-voyage-cleanup-and-egress-monitoring/spec.md:154 | Reversibility claim conflicts with the implementation summary: the legacy DB is not recoverable from git. | Spec says deletion is reversible via git history at `spec.md:154`; implementation says `context-index.sqlite` was gitignored and not recoverable from git at `implementation-summary.md:151`. | Correct the spec and add the real rollback: recreate by re-embedding or restore from an explicit local backup if one exists. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-007-003 | 007-voyage-cleanup-and-egress-monitoring/tasks.md:80 | Deferred tcpdump task is marked `[B]` but completion criteria still say "Phase 3 except deferred-by-design T015" is done. | `tasks.md:80` has `[ ] T015 [B]`; `tasks.md:90` says Phase 3 except T015 is done. | Mark T015 as explicitly deferred rather than blocked, or keep completion open. |

## Notes
No additional destructive-operation blocker beyond the missing backup story. The spec should stop implying git can restore ignored sqlite files.
