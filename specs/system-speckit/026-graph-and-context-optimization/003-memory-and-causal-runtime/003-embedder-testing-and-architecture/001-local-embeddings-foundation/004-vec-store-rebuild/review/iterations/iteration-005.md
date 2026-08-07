# Deep Review Iteration 005 — 004-vec-store-rebuild

**Dimension:** performance
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:39:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-004-001 | 004-vec-store-rebuild/implementation-summary.md:126 | Active carry-forward: no new P0, but the existing search failure remains release-blocking. | `implementation-summary.md:126`. | Resolve in 009 or narrow 004 to memory-only. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-004-005 | 004-vec-store-rebuild/implementation-summary.md:119 | Cold-load latency exceeded the stated target but is only marked informational. | `implementation-summary.md:119` says first inference 1007ms with target `<800ms`, flagged slow but functional. | Record whether the threshold is advisory or a real gate; if real, carry it into 005/008 acceptance. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-004-005 | 004-vec-store-rebuild/implementation-summary.md:127 | Direct sqlite-vec search is a useful workaround, but it is not packaged as a supported operator command. | `implementation-summary.md:127` says direct sqlite-vec proves data health. | Add the direct-query command/script to scratch for reproducible verification. |

## Notes
Converged after five passes: one active P0, several reconciliation/recovery P1s, and no new class of performance blocker.
