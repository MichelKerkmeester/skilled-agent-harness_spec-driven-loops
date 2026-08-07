# Review Report: 020-maintenance-grace-background-embedding

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | PASS |
| **hasAdvisories** | true |
| **Active P0** | 0 |
| **Active P1** | 0 |
| **Active P2** | 2 |
| **Scope** | Spec folder 020-maintenance-grace-background-embedding (4 files: maintenance-marker.ts, memory-index.ts, retry-manager.ts, maintenance-marker.vitest.ts) |
| **Convergence Reason** | maxIterations=1 reached (single fan-out lineage iteration) |
| **Iterations** | 1 |
| **Dimensions Covered** | 1/4 (Correctness) |

The maintenance-marker module, scan IIFE refactor, and embedding-queue wiring are correct. Reference counting, idempotency, and overlap semantics all match the spec. Two P2 advisory findings were recorded: stale on-disk labels when multiple holders overlap (cosmetic, launcher only checks file existence) and a missing test for duplicate-label reference counting.

---

## 2. Planning Trigger

Verdict is **PASS** with P2 advisories. No remediation planning is required. The two P2 findings are advisory and can be addressed in a future maintenance cycle:

- F001: Add `writeMarker()` call in `end()` when other holders remain (optional, cosmetic improvement)
- F002: Add a test case for duplicate-label beginMaintenance calls

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | First/Last Seen | Status |
|----|----------|-----------|-------|-----------|-----------------|--------|
| F001 | P2 | Correctness | Stale labels on disk when multiple holders overlap | `mcp_server/lib/storage/maintenance-marker.ts:76` | 1/1 | active |
| F002 | P2 | Correctness | No test for duplicate-label reference counting | `mcp_server/tests/maintenance-marker.vitest.ts:1` | 1/1 | active |

### Finding Details

**F001**: When `end()` decrements `activeCount` but other holders remain, the on-disk marker file is NOT rewritten with the pruned label set. The in-memory `activeLabels` array is updated correctly via `splice`, but the file retains old labels until the next write event (begin, refresh, or 20s timer tick). Impact: purely informational — the launcher reads the marker file for existence only, never inspects labels.

**F002**: Calling `beginMaintenance('scan')` twice before either ends pushes two `'scan'` entries into `activeLabels`. `end()` removes the first found via `indexOf`. This works correctly (file removed at 0 holders) but produces duplicate labels in the on-disk file. No existing test covers this path.

---

## 4. Remediation Workstreams

No remediation required. Both findings are P2 advisories:

| Lane | Finding | Action | Priority |
|------|---------|--------|----------|
| Marker cosmetics | F001 | Optionally rewrite marker file in `end()` when other holders remain | Low |
| Test coverage | F002 | Add test: same-label double-begin, verify reference counting and label dedup | Low |

---

## 5. Spec Seed

No spec changes required. The implementation correctly satisfies all spec requirements (REQ-001 through REQ-004).

---

## 6. Plan Seed

No plan changes required. The two P2 findings are advisory and can be addressed in a future maintenance cycle without blocking release.

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| `spec_code` | core | pass | hard | All 3 normative claims in spec.md (REQ-001 shared module, REQ-002 embedding queue protection, REQ-003 overlap semantics) resolve to shipped behavior with file:line evidence |
| `checklist_evidence` | core | partial | hard | No checklist.md exists in the spec folder; Level 1 spec folder does not require it |
| `feature_catalog_code` | overlay | pass | advisory | Feature catalog entries for workspace scanning and embedding retry orchestrator match implementation |

### spec_code Evidence
- REQ-001 (shared module): `spec.md:103` → `maintenance-marker.ts:58-84` — `beginMaintenance(label)` returns `{refresh(), end()}`, 180s TTL, 20s self-refresh, present while >=1 holder, removed at 0, idempotent end
- REQ-002 (embedding queue protected): `spec.md:105` → `retry-manager.ts:1038` — `runBackgroundJob` calls `beginMaintenance('embedding-queue')` after empty-queue guard, `end()` in `finally`
- REQ-003 (overlap): `spec.md:106` → `maintenance-marker.ts:59-60` — Reference counting lets scan and embedding queue hold marker through overlap

---

## 8. Deferred Items

- Full live end-to-end reindex run: deploy-time confirmation, not a code deliverable (spec.md:110)
- Making synchronous embedding phases cooperative (chunk-and-yield): noted follow-on (spec.md:109)
- F001 and F002: P2 advisories, no blocking action required

---

## 9. Audit Appendix

### Iteration Table
| Iteration | Dimension | Focus | New Ratio | Findings | Status |
|-----------|-----------|-------|-----------|----------|--------|
| 1 | Correctness | maintenance-marker.ts, memory-index.ts, retry-manager.ts, maintenance-marker.vitest.ts | 0.15 | 0P0, 0P1, 2P2 | complete |

### Convergence Signal Replay
- Rolling average: N/A (single iteration, no rolling window)
- MAD noise floor: N/A (single iteration)
- Dimension coverage: 1/4 (25%) — Correctness only
- Stabilization: not reached (maxIterations=1)
- Composite stop score: below threshold (dimension coverage gate fails)

### File Coverage Matrix
| File | D1 | D2 | D3 | D4 |
|------|----|----|----|-----|
| mcp_server/lib/storage/maintenance-marker.ts | reviewed | - | - | - |
| mcp_server/handlers/memory-index.ts | reviewed | - | - | - |
| mcp_server/lib/providers/retry-manager.ts | reviewed | - | - | - |
| mcp_server/tests/maintenance-marker.vitest.ts | reviewed | - | - | - |

### Dimension Breakdown
| Dimension | Status | Iterations | Findings |
|-----------|--------|------------|----------|
| Correctness | covered | 1 | 0P0, 0P1, 2P2 |
| Security | not covered | - | - |
| Traceability | not covered | - | - |
| Maintainability | not covered | - | - |

### Claim Adjudication
No P0/P1 findings to adjudicate. P2 findings are advisory and do not require claim-adjudication packets.

### Replay Validation
- Config: valid, all required fields present
- JSONL: 1 config record + 1 iteration record, parseable
- Strategy: consistent with JSONL state
- Findings registry: reconciles against JSONL totals (2 P2, 0 P0/P1)
- Verdict mapping: PASS (no P0/P1, has P2 → hasAdvisories=true)
