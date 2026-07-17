# Iteration 1: Correctness & Maintainability

**Dimension:** Correctness (primary), Maintainability (secondary)
**Files reviewed:** `maintenance-marker.ts`, `memory-index.ts`, `retry-manager.ts`, `maintenance-marker.vitest.ts`

---

## Findings

### P2-001: `activeLabels` accumulates duplicate entries

**Category:** correctness / maintainability
**Severity:** P2
**Finding class:** cosmetic
**File:line:** `maintenance-marker.ts:60`

`beginMaintenance(label)` pushes the label onto `activeLabels` unconditionally. If the same label is used for two concurrent holders (e.g., two overlapping `beginMaintenance('embedding-queue')` calls — possible if `runBackgroundJob` overlaps a re-entry), the array contains duplicates. When `end()` runs `activeLabels.indexOf(label)`, it removes only the first occurrence. The duplicate lingers until the second holder also ends. This is cosmetic: the launcher checks file freshness, not label content. The marker file may briefly show a label count that doesn't match the holder count.

**Evidence:** `maintenance-marker.ts:60` (`activeLabels.push(label)`) and `maintenance-marker.ts:76` (`activeLabels.indexOf(label)` removes first match only).

**Advisory:** Consider deduplicating labels in `writeMarker()` (e.g., `[...new Set(activeLabels)]`) or tracking a label→count map instead of a flat array.

---

### P2-002: Label removal precedes `activeCount` decrement in `end()`

**Category:** correctness
**Severity:** P2
**Finding class:** cosmetic
**File:line:** `maintenance-marker.ts:73-81`

In `end()`, the label splice (line 76-77) runs before `activeCount` decrement (line 75). If the interval timer fires between these two lines (synchronous gap, unlikely but possible), `writeMarker()` serializes a marker with the label already removed but `activeCount` still reflecting the holder. The launcher doesn't parse labels, so this is cosmetic. No behavioral impact.

**Evidence:** `maintenance-marker.ts:73-81` shows splice before decrement.

---

## Analysis

### Reference-counted lifecycle (correct)

- `beginMaintenance` increments `activeCount`, pushes label, writes marker, starts timer if first holder. ✓
- `end()` guards with `ended` flag (idempotent), decrements, splices label, removes file at zero, clears timer. ✓
- `refresh()` guards with `!ended && activeCount > 0`. ✓
- Timer is `unref()`'d so it doesn't hold the event loop open. ✓
- 180s TTL bounds any leaked reference. ✓

### Scan IIFE wiring (correct)

- `handleMemoryIndexScan` calls `beginMaintenance('index_scan')` at line 1502. ✓
- `maintenance.refresh()` called at each phase boundary (line 1510). ✓
- `maintenance.end()` called in the outer `finally` block (line 1540). ✓
- The shared module is reference-counted, so the embedding queue can hold the marker independently after the scan ends. ✓

### Embedding queue wiring (correct)

- `runBackgroundJob` creates `maintenanceHandle` only after `stats.queue_size > 0` (line 1032-1038). ✓
- An idle tick (`queue_size === 0`) returns early without creating a handle — no marker written. ✓
- `maintenanceHandle?.end()` called in the `finally` block (line 1055). ✓
- The `?.` guard makes the finally safe when no handle was created (empty queue path). ✓

### Test coverage (adequate)

- Single holder lifecycle. ✓
- Reference counting with two overlapping holders. ✓
- Idempotent `end()`. ✓
- `refresh()` rewrites with non-decreasing TTL. ✓
- Three holders with staggered end. ✓

---

## Verdict

No P0 or P1 findings. Two P2 advisories (cosmetic label tracking). The reference-counted maintenance marker correctly protects both the scan and the embedding queue through their overlap, the idle-tick guard works, and the test suite covers the critical paths.

Review verdict: PASS
