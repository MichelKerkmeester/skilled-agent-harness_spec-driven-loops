# Deep Review Iteration 002 — 004-vec-store-rebuild

**Dimension:** reversibility
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:36:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-004-001 | 004-vec-store-rebuild/spec.md:125 | Active carry-forward from iteration 001: the code-search P0 remains unresolved. | `implementation-summary.md:126` records end-to-end CocoIndex search failure. | Resolve via 009 or remove the requirement from 004's ship boundary. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-004-002 | 004-vec-store-rebuild/plan.md:175 | Rollback for the deleted MiniLM `target_sqlite.db` accepts degraded code search rather than providing a restore path. | `plan.md:170-175` says the old MiniLM DB is gone and rollback means temporary degradation. | Before shipping destructive DB deletes, record a backup path, reindex command, or explicit acceptance that code search rollback is rebuild-only. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-004-002 | 004-vec-store-rebuild/implementation-summary.md:91 | Direct SQLite mutation was used against a live DB, but the reusable recovery recipe is prose-only. | `implementation-summary.md:91` describes live `sqlite3` DELETE+rescan. | Add a packet-local recovery script or exact transaction block with preflight/backups for future wedge recovery. |

## Notes
Reversibility is acceptable for memory recovery but weak for the deleted code index. The main blocker remains the unfixed CocoIndex serving path.
