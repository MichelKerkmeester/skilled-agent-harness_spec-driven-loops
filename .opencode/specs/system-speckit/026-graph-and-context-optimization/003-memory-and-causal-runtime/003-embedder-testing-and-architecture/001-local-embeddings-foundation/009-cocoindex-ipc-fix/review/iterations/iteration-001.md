# Deep Review Iteration 001 — 009-cocoindex-ipc-fix

**Dimension:** correctness
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:48:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-009-001 | 009-cocoindex-ipc-fix/spec.md:124 | 009 has not met its source-code indexing P0 requirement. | Spec REQ-006 requires non-zero rows for at least 3 source languages at `spec.md:124`; tasks mark T011 blocked at `tasks.md:77`; implementation records `FAIL/BLOCKED` at `implementation-summary.md:99`. | Patch/fork the Rust-core Environment initialization blocker, then rerun refresh/index and verify language counts. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-009-001 | 009-cocoindex-ipc-fix/implementation-summary.md:74 | Verification used an isolated daemon and copied DB; the live home daemon was not restarted, so the real MCP surface is not proven patched. | `implementation-summary.md:74` says live daemon restart was denied and verification used `/private/tmp/coco009`; limitation repeats at `:110`. | Add a post-restart verification task against the real daemon before marking search fixed for the user environment. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-009-001 | 009-cocoindex-ipc-fix/implementation-summary.md:3 | Description says "Search-only daemon path patched and verified" without naming the isolated-daemon limit. | Summary line `3` omits the sandbox/live-daemon caveat later disclosed at `:74` and `:110`. | Add the caveat to the description/frontmatter so resume context does not overstate live readiness. |

## Notes
Correctness pass finds one hard blocker: search-only improved, but full indexing remains blocked and gates 006.
