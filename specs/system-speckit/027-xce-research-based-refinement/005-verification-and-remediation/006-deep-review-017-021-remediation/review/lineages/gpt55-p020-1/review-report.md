# Deep Review Report: gpt55-p020-1

## Executive Summary

Verdict: PASS

Release readiness state: in-progress

hasAdvisories: true

Scope: one-iteration fan-out lineage for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding`, focused on correctness evidence for the shared maintenance marker and embedding queue wiring.

Active findings: P0=0, P1=0, P2=1.

Stop reason: `maxIterations=1`. This lineage did not reach full four-dimension legal STOP coverage; it is a fan-out slice intended for merge with sibling lineages.

## Planning Trigger

No P0 or P1 findings were confirmed, so this lineage does not trigger required remediation planning by itself. It emits one P2 advisory that can be folded into a future hardening or test-coverage pass.

## Active Finding Registry

| ID | Severity | Status | Dimension | Finding | Evidence |
|----|----------|--------|-----------|---------|----------|
| F001 | P2 | active | correctness | Add direct retry-manager marker regression coverage | `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1036-1055`; `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:662-674`; `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts:82-109` |

F001 rationale: the implementation currently appears correctly wired, but the retry-manager test boundary does not directly assert marker absence on idle ticks or marker presence/release around a real non-empty queue tick. The existing marker tests cover the shared module in isolation, and retry-manager tests cover empty-queue return shape.

## Remediation Workstreams

| Workstream | Findings | Suggested Action |
|------------|----------|------------------|
| Test hardening | F001 | Add a retry-manager-level unit test that spies or isolates `beginMaintenance`, covers empty queue no-marker behavior, and covers non-empty queue begin/end behavior. |

## Spec Seed

No spec change is required for a PASS lineage. If F001 is accepted, a small verification addendum could state that background-embedding marker behavior has direct retry-manager boundary coverage, not only marker-module coverage.

## Plan Seed

1. Add a retry-manager test that proves `runBackgroundJob()` does not call `beginMaintenance('embedding-queue')` when `stats.queue_size === 0`.
2. Add a retry-manager test that seeds one eligible pending row, verifies the queue path calls `beginMaintenance('embedding-queue')`, and verifies `end()` runs in `finally`.
3. Keep existing marker-module ref-count tests unchanged; they remain useful lower-level coverage.

## Traceability Status

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `spec.md:102-139`; `maintenance-marker.ts:58-87`; `memory-index.ts:1507-1552`; `retry-manager.ts:1012-1055` | Shared module, scan holder, and embedding queue holder checked in this lineage. Full traceability remains incomplete under maxIterations=1. |
| checklist_evidence | pass | hard | `tasks.md:61-65` | Target is Level 1 and has no `checklist.md`; sampled task verification claims instead. |
| feature_catalog_code | partial | advisory | `retry-manager.ts:1012-1055` | Feature surface observed but not exhaustively catalog-audited. |
| playbook_capability | partial | advisory | `implementation-summary.md:83-94` | Deploy verification claim was read, not re-run. |

## Deferred Items

- F001 is deferred as a P2 advisory because no active behavior defect was confirmed.
- Security, full traceability, and maintainability dimensions were not fully covered because this lineage was capped at one iteration.
- Live deploy verification was not re-run; the lineage only reviewed existing evidence.

## Audit Appendix

| Item | Result |
|------|--------|
| Iterations | 1 |
| Files reviewed | 11 |
| Dimensions covered | 1/4 (`correctness`) |
| Final iteration verdict | PASS |
| Synthesis verdict | PASS |
| Active P0/P1/P2 | 0/0/1 |
| Code graph | Stale; not used as finding evidence |
| Resource map | Target `resource-map.md` absent at init; coverage gate skipped |

Replay validation: JSONL has one config record, one iteration record with the required fields, and this synthesis event. The iteration file ends with the exact final line `Review verdict: PASS`.

Evidence replay summary: `beginMaintenance` writes and reference-counts the marker in `maintenance-marker.ts:58-87`; the background scan holder starts before `runIndexScan` and ends in `finally` at `memory-index.ts:1507-1552`; the embedding queue holder starts after the empty-queue guard and ends in `finally` at `retry-manager.ts:1032-1055`.
