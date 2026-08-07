# Deep Review Iteration 001 — 004-vec-store-rebuild

**Dimension:** correctness
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:35:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-004-001 | 004-vec-store-rebuild/spec.md:125 | A P0 acceptance criterion is still unmet: CocoIndex does not serve a query end-to-end. | Spec requires `cocoindex_code.search` success at `004-vec-store-rebuild/spec.md:125`; implementation records `FAIL — msgspec.DecodeError` at `004-vec-store-rebuild/implementation-summary.md:126`. | Keep 004 non-shippable until 009 restores search, or formally split 004's ship boundary to memory-only and move CocoIndex serving to a successor. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-004-001 | 004-vec-store-rebuild/plan.md:67 | Plan quality gates still mark CocoIndex schema and strict validate as unchecked, while implementation later says schema and strict validate passed. | Plan lines `67-69` remain unchecked; implementation lines `123` and `129` report pass. | Reconcile the plan/tasks/summary status, or mark 004 explicitly superseded by 009 for CocoIndex. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-004-001 | 004-vec-store-rebuild/implementation-summary.md:145 | The performance estimate drift is documented but not converted into a follow-on acceptance gate. | `implementation-summary.md:145` says full repo indexing may take hours instead of minutes. | Add a follow-on performance requirement before using Qwen3 rebuild time as a release-quality baseline. |

## Notes
Correctness pass confirms 004 is only partially complete. Memory side is healthy; the code-search side still fails its own P0.
