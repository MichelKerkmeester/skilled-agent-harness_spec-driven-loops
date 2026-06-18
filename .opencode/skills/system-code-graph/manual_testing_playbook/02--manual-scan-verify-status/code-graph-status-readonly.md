---
title: "006 code_graph_status readonly"
description: "Verify status reads readiness and graph quality without mutating or repairing stale state."
trigger_phrases:
  - "006"
  - "code graph status readonly"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 006 code_graph_status readonly

## 1. OVERVIEW

Verify status reads readiness and graph quality without mutating or repairing stale state.

---

## 2. SCENARIO CONTRACT

- Objective: Verify status reads readiness and graph quality without mutating or repairing stale state.
- Real user request: `Inspect code_graph_status around a stale-file fixture and confirm it reports diagnostics without repairing the graph.`
- Operator prompt: `Inspect code_graph_status around a stale-file fixture. Show readiness and graph-quality diagnostics without repair or scan mutation, then return PASS/FAIL with before-and-after evidence.`
- Expected execution process: Capture `code_graph_status({})` twice around a stale-file fixture, compare `lastPersistedAt`, readiness and scan counts and confirm no `code_graph_scan` was invoked.
- Expected signals: Status returns diagnostic fields including `freshness`, `readiness`, `canonicalReadiness`, `trustState`, `graphQualitySummary` and, when tombstone auditing is enabled, tombstone retained counts by kind/reason plus recent retained tombstones. It does not repair stale state.
- Desired user-visible outcome: A concise verdict explaining whether status stayed diagnostic-only and whether tombstone audit visibility appears only when enabled.
- Pass/fail: PASS if status reports diagnostics without changing persistence or scan evidence and exposes tombstone audit status under the explicit flag. FAIL if it repairs stale state, invokes scan, omits readiness or graph-quality diagnostics, or leaks tombstone state into live graph query results.

---

## 3. TEST EXECUTION

### Commands

1. Capture `code_graph_status({})` twice around a stale-file fixture.
2. Compare `lastPersistedAt`, readiness and scan counts.
3. Confirm no `code_graph_scan` was invoked.
4. In a disposable workspace with `SPECKIT_CODE_GRAPH_TOMBSTONES=true`, create a cleanup event, run `code_graph_status({})`, and capture the tombstone counts by kind/reason plus recent retained tombstone excerpt.

### Expected Output / Verification

Status returns diagnostic fields including `freshness`, `readiness`, `canonicalReadiness`, `trustState` and `graphQualitySummary`, but does not repair stale state. With tombstone auditing enabled, the status payload also includes retained deletion-lineage counts and recent retained tombstones; with the flag unset, the default path remains compact and audit-free.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Corrupt the copied DB and verify status returns a degraded envelope rather than crashing.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Tombstone audit storage and stats summary |
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts` | Read-only status output |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts` | Tombstone audit validation |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 006
- Canonical root source: `manual_testing_playbook.md`
