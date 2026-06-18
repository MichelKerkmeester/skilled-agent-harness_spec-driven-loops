# Deep Review Strategy — p018-opus-3

## Topic
Review of `018-reindex-scan-responsiveness-and-cancellation`: the fix that makes a background `memory_index_scan` yield the daemon's single event-loop thread in its all-rows tail loops and be genuinely cancellable. Fan-out lineage `p018-opus-3`, executor cli-claude-code model=claude-opus-4-8, single iteration (maxIterations=1).

## Review Dimensions
- [x] Correctness — verdict: PASS (no defects in yield/abort/cancel logic; one P2 post-terminal Set-leak edge)
- [x] Security — verdict: PASS (no attack surface; internal daemon job control)
- [x] Traceability — verdict: PASS (spec/plan/tasks/impl-summary align with the actual diff; honest scope-bound completion claims)
- [x] Maintainability — verdict: PASS with advisory (one P2 test-coverage gap)

## Completed Dimensions
| Dimension | Iteration | Verdict | Note |
|-----------|-----------|---------|------|
| correctness | 1 | PASS | Yields confirmed between transactions; envelope returns correct; signature/arg order correct |
| security | 1 | PASS | No untrusted input, credentials, path/schema/env handling |
| traceability | 1 | PASS | REQ-001..REQ-004 all resolve to shipped code |
| maintainability | 1 | PASS+adv | F001 test-coverage gap (P2) |

## Running Findings
- P0: 0 (Δ0)
- P1: 0 (Δ0)
- P2: 2 (Δ+2) — F001 (test coverage), F002 (post-terminal Set-leak edge)

## What Worked
- Reading the focused commit diff (`f1dbb676f2`) then confirming against current source gave fast, high-confidence correctness verification.
- Static `grep` over `tests/` surfaced the untested new paths (F001) when the suite itself could not be run.

## What Failed
- Could not execute the touched-surface vitest suites: `npx`/`vitest` are blocked in this sandboxed review environment. SC-001/REQ-004 recorded as asserted-not-independently-verified.

## Exhausted Approaches
- Running tests via `npx vitest` (sandbox-blocked, do not retry in this environment).

## Ruled-Out Directions
- Index drift after early-abort — disproven (in-order positional tally; cancelled envelope supersedes partial).
- Yield inside open transaction — disproven (yields at iteration boundaries only).
- Security finding — no surface introduced.

## Next Focus
None within scope (coverage complete at maxIterations=1). Optional follow-on hardening: tests for `shouldAbort` and the `isCancelRequestedFast` Set lifecycle; guard `requestCancel` against post-terminal add.

## Known Context
- `resource-map.md` not present. Skipping coverage gate.
- Level 1 incident-fix packet; no checklist.md required.
- The launcher lease-heartbeat re-election is explicitly out of scope (separate supervision subsystem; documented follow-on in spec.md §3 / implementation-summary.md Known Limitations).

## Cross-Reference Status
### Core (hard)
- spec_code: PASS — REQ-001..REQ-004 → memory-index.ts:1176-1181,1311-1316 / batch-processor.ts:150 / job-store.ts:315-338
- checklist_evidence: N/A — Level 1, no checklist.md

### Overlay (advisory)
- feature_catalog_code: N/A — no catalog entry for this packet
- playbook_capability: N/A — no playbook references this fix

## Files Under Review
| File | Coverage | Note |
|------|----------|------|
| handlers/memory-index.ts | full | tail-loop yields (1176-1181, 1311-1316), processBatches call (1034), bg dispatch hook (1444) |
| utils/batch-processor.ts | full | shouldAbort option (18), break (150) |
| lib/ops/job-store.ts | full | cancel Set (74), requestCancel (315-320), isCancelRequestedFast (335-338), terminal cleanup (369, 397-399) |
| tests/handler-memory-index-scan-jobs.vitest.ts | full | mock parity (107) |

## Review Boundaries
- maxIterations: 1 (forced single pass)
- severityThreshold: P2
- Observation-only: no code under review modified.
- Non-Goals: launcher lease-heartbeat re-election; full corpus reindex; cosmetic consistency/enrichment cleanup.
- Stop Conditions: maxIterations reached AND all 4 dimensions covered AND no active P0/P1 after adversarial self-check.
