# Deep Review Iteration 004 — 004-vec-store-rebuild

**Dimension:** edge-cases
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:38:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-004-001 | 004-vec-store-rebuild/spec.md:125 | Active carry-forward: code-search serving still fails the packet's P0 requirement. | Spec `REQ-005` and implementation `FAIL` row remain contradictory. | Resolve/split before ship. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-004-004 | 004-vec-store-rebuild/implementation-summary.md:65 | Wedge recovery depends on deleting `pending`/`retry` rows, but the packet does not define behavior under power loss between DELETE and rescan. | `implementation-summary.md:65` documents the DELETE+rescan workaround. | Add a recovery note: how to detect half-rebuilt state, re-run scan, and confirm FTS/vector consistency after interruption. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-004-004 | 004-vec-store-rebuild/implementation-summary.md:137 | Retry-manager recovery limitations are documented but not tracked as an actionable follow-on. | Known limitation `1` points at hardcoded retry defaults. | Create/link a follow-on packet for bulk recovery ergonomics. |

## Notes
Edge-case pass did not find a second P0. It did find that the documented manual DB surgery needs an interruption-safe operator path.
