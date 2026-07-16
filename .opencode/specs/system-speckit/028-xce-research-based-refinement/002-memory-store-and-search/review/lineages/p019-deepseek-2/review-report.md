# Deep Review Report: maintenance-grace daemon survives re-election

**Spec Folder:** `019-maintenance-grace-daemon-survives-reelection`
**Lineage:** `fanout-p019-deepseek-2`
**Completed:** 2026-06-17
**Total Iterations:** 1 (maxIterations=1)
**Stop Reason:** maxIterations reached

---

## 1. Executive Summary

**Verdict: PASS** (hasAdvisories: true)

| Severity | Active Count |
|----------|-------------|
| P0 | 0 |
| P1 | 0 |
| P2 | 2 |

**Scope:** Fan-out lineage (p019-deepseek-2) reviewed D1 Correctness against the maintenance-grace implementation: daemon marker writer, launcher supervision predicate, both launcher guard sites, and background scan integration. All 4 normative requirements (REQ-001 through REQ-004) were verified with file:line evidence. Two P2 spec-drift advisories were identified (marker shape from `jobId` to `labels` for reference counting, and TTL changed from 60s to 180s as a live-learned correction). Both are documented in `implementation-summary.md` but not yet reflected in `spec.md`.

**Convergence reason:** maxIterations=1 reached. Single-iteration lineage with correctness-only coverage.

---

## 2. Planning Trigger

**Route: `/create:changelog`** — the PASS verdict with hasAdvisories=true means the implementation is shippable and the two P2 advisories (spec-drift reconciliation) are deferred documentation updates, not code changes. The spec should be updated to reflect the settled implementation shape (labels + 180s TTL).

---

## 3. Active Finding Registry

| ID | Severity | Category | Title | Evidence | First Seen | Status |
|----|----------|----------|-------|----------|------------|--------|
| F001 | P2 | traceability | Marker shape drift: spec `jobId` vs implementation `labels` | spec.md:103, maintenance-marker.ts:44-51 | 1 | active |
| F002 | P2 | traceability | TTL divergence: spec 60s vs implementation 180s | spec.md:103, maintenance-marker.ts:25, implementation-summary.md:56 | 1 | active |

### Per-REQ Verification Summary

| REQ | Title | Status | Evidence |
|-----|-------|--------|----------|
| REQ-001 | Daemon writes maintenance marker | VERIFIED | maintenance-marker.ts:44-51 (write), :63 (20s timer), memory-index.ts:1502 (begin), :1510 (phase refresh), :1540 (finally end) |
| REQ-002 | Launcher adopts at both guard sites | VERIFIED | mk-spec-memory-launcher.cjs:820-824 (dead-socket), :1688-1693 (stale-reclaim), model-server-supervision.cjs:632-640 (predicate) |
| REQ-003 | Guard fails safe toward reaping | VERIFIED | model-server-supervision.cjs:634-638 (all gates: missing/expired/mismatch/non-alive), launcher-maintenance-guard.vitest.ts (10 test cases) |
| REQ-004 | Marker dir resolves identically | VERIFIED | mk-spec-memory-launcher.cjs:329-333 (SPEC_KIT_DB_DIR || SPECKIT_DB_DIR precedence), core/config.js (DATABASE_DIR on daemon side) |

---

## 4. Remediation Workstreams

**WS1: Spec Reconciliation (P2, 2 findings)**
- Update spec.md §4 REQ-001 to reflect `labels` array instead of `jobId` (F001)
- Update spec.md §3 "60s TTL" to "180s TTL" (F002)
- Effort: 5 minutes, documentation-only

---

## 5. Spec Seed

Minimal spec delta derived from review:

```markdown
<!-- spec.md §3 In Scope, REQ-001 should be updated -->
- REQ-001: Change "A daemon-written `<DATABASE_DIR>/.maintenance-active.json` marker
  (`{ childPid, activeUntilMs, jobId, refreshedAtIso }`, 60s TTL)" to 
  "(`{ childPid, activeUntilMs, labels, refreshedAtIso }`, 180s TTL)"
```

---

## 6. Plan Seed

1. T001: Update spec.md REQ-001 to reflect `labels` instead of `jobId` and 180s TTL instead of 60s (spec.md)
2. T002: Optionally update launcher test TypeScript type to include `labels` for consistency (launcher-maintenance-guard.vitest.ts)

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Details |
|----------|-------|--------|------|---------|
| spec_code | core | partial | hard | 4/4 REQs verified. 2 P2 drifts: marker shape (jobId→labels), TTL (60s→180s). No gate failures. |
| checklist_evidence | core | N/A | hard | Level 1 spec, no checklist.md |

---

## 8. Deferred Items

- F001: Update spec.md marker shape from `jobId` to `labels` — P2 advisory, documentation-only
- F002: Update spec.md TTL from 60s to 180s — P2 advisory, documentation-only
- The `refreshedAtIso` field is informational only (not validated by launcher) — no action needed

---

## 9. Audit Appendix

### Iteration Table

| # | Focus | Status | P0 | P1 | P2 | newFindingsRatio | Verdict |
|---|-------|--------|----|----|----|-------------------|---------|
| 1 | D1 Correctness | complete | 0 | 0 | 2 | 0.0 | PASS |

### Convergence Signal Replay

- Rolling average: N/A (single iteration)
- Dimension coverage: 1/4 (correctness only; maxIterations=1 reached before full coverage)
- Stop reason: maxIterations

### File Coverage Matrix

| File | Reviewed | Dimension |
|------|----------|-----------|
| lib/storage/maintenance-marker.ts | yes | correctness |
| handlers/memory-index.ts | yes | correctness |
| bin/lib/model-server-supervision.cjs | yes | correctness |
| bin/mk-spec-memory-launcher.cjs | yes | correctness |
| tests/launcher-maintenance-guard.vitest.ts | yes | correctness |
| tests/maintenance-marker.vitest.ts | yes | correctness |
| spec.md | yes | correctness |
| implementation-summary.md | yes | correctness |

### Dimension Breakdown

| Dimension | Covered | Iteration | Findings |
|-----------|---------|-----------|----------|
| correctness | yes | 1 | F001, F002 (both P2) |
| security | no | — | Deferred (maxIterations reached) |
| traceability | no | — | Deferred (maxIterations reached) |
| maintainability | no | — | Deferred (maxIterations reached) |

### Replay Validation

Computed verdict from stored JSONL: PASS (0 active P0, 0 active P1, 2 active P2 → hasAdvisories=true). Verdict logic matches synthesis.
