# Deep Review Strategy: maintenance-grace daemon survives re-election

## topic
Review of spec-folder `019-maintenance-grace-daemon-survives-reelection` — the maintenance-active marker that lets launchers adopt a busy-but-healthy daemon during re-election instead of reaping it mid-scan.

## review-dimensions

- [x] D1 Correctness (Priority 1) — PASSD with 2 P2 advisories
- [ ] D2 Security (Priority 2)
- [ ] D3 Traceability / Spec-Alignment (Priority 3)
- [ ] D4 Maintainability (Priority 4)

## completed-dimensions

- [x] D1 Correctness — Iteration 001: All 4 REQs verified with file:line evidence. 2 P2 spec-drift advisories (marker shape, TTL). Verdict: PASS.

## running-findings

P0: 0 | P1: 0 | P2: 2 (+2 from iteration 001)
- F001: Marker shape drift (labels vs jobId) — P2
- F002: TTL divergence (180s vs 60s spec) — P2

## what-worked

- Iteration 001: Source-level verification of all 4 REQs against actual implementation files. Confirmed both launcher guard sites with file:line evidence. Marked as PASS.

## what-failed

(None)

## exhausted-approaches

(None)

## ruled-out-directions

(None)

## next-focus

D2 Security — verify no trust-boundary bypass in marker handling. Max iterations reached (1/1) — synthesis triggered.

## known-context

This is a fan-out lineage (p019-deepseek-2) in the review fan-out for spec 019. The implementation shipped the maintenance-active marker, pure supervision predicate, and both launcher guard sites. The spec is Level 1 with 4 requirements (REQ-001 through REQ-004). The implementation summary confirms: build passes, syntax checks pass, unit tests pass, isolated harness passes, and a full live reindex completed in 330s on the live daemon.

resource-map.md not present. Skipping coverage gate.

## cross-reference-status

| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| spec_code | core | partial | hard | All 4 REQs verified. 2 P2 spec-drifts identified (marker shape, TTL). See iteration-001.md. |
| checklist_evidence | core | N/A | hard | No checklist.md present (Level 1) |
| feature_catalog_code | overlay | N/A | advisory | N/A for this target |
| playbook_capability | overlay | N/A | advisory | N/A for this target |

## files-under-review

| File | Status | Notes |
|------|--------|-------|
| `lib/storage/maintenance-marker.ts` | reviewed | REQ-001 confirmed: marker writer correct, reference-counted, TTL 180s |
| `handlers/memory-index.ts` (L1496-1542) | reviewed | Integration confirmed: beginMaintenance + phase refresh + finally end |
| `bin/lib/model-server-supervision.cjs` (L615-640) | reviewed | Pure predicate confirmed: fail-safe, all gates correct |
| `bin/mk-spec-memory-launcher.cjs` (L329-333, L820-824, L1688-1693) | reviewed | Both guard sites confirmed: dead-socket + stale-reclaim |
| `tests/launcher-maintenance-guard.vitest.ts` | reviewed | 10 test cases covering adopt, expired, mismatch, dead, eperm, null, invalid pid |
| `tests/maintenance-marker.vitest.ts` | reviewed | 5 test cases covering write, ref-counting, idempotent end, refresh, multi-handle |
| `spec.md` | reviewed | 2 P2 spec-drifts versus implementation |
| `implementation-summary.md` | reviewed | Documents TTL change and known limitations |

## review-boundaries

- Max iterations: 1 (reached)
- Convergence threshold: 0.10
- Severity threshold: P2
- Execution mode: auto
- Status: synthesis triggered (maxIterations reached)
