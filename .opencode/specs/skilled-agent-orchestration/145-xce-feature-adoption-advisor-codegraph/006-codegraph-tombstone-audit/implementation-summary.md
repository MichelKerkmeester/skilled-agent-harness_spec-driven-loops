---
title: "Implementation Summary: codegraph tombstone audit"
description: "Implemented bounded default-off tombstone audit lineage for code-graph stale node and edge cleanup."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit"
    last_updated_at: "2026-06-10T23:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Documented completed tombstone audit implementation"
    next_safe_action: "No implementation action remains"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/scan.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/status.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-codegraph-tombstone-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-codegraph-tombstone-audit |
| **Completed** | 2026-06-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now opt into a bounded deletion audit for code-graph cleanup and answer why retained nodes or edges disappeared. The default path still hard-deletes exactly as before: with `SPECKIT_CODE_GRAPH_TOMBSTONES` unset, no tombstone table is created and no tombstone rows are written.

### Bounded Tombstone Audit

The code graph records file, node, and edge tombstones only when `SPECKIT_CODE_GRAPH_TOMBSTONES=true`. Each retained row stores the deletion kind, minimal identity fields, reason, and timestamp. Retention is count-bound by `SPECKIT_CODE_GRAPH_TOMBSTONE_LIMIT`, defaulting to 100 rows and clamped to 10000.

### Status Visibility

`getStats()` now includes a tombstone summary. `code_graph_scan` and `code_graph_status` expose retained counts by kind and reason plus recent retained tombstones, while live graph queries continue to read only `code_nodes` and `code_edges`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Added flag-gated tombstone schema, deletion capture, retention pruning, and stats summary |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Modified | Passed explicit cleanup reasons and included tombstone summary in scan results |
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts` | Modified | Included tombstone summary in read-only status output |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts` | Created | Covered default-off behavior, enabled lineage, retention pruning, and query isolation |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Modified | Updated cleanup assertions to require explicit deletion reasons |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All audit writes ship behind `SPECKIT_CODE_GRAPH_TOMBSTONES=true`; unset remains the default. Verification used temp/fixture DBs only and did not touch the live code-graph DB.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Create the tombstone table only when enabled | This preserves default-off DB behavior and avoids default path-history growth. |
| Use count-bound retention | The code graph is rebuildable, so bounded diagnosis is enough and full time-travel would add unnecessary storage cost. |
| Keep tombstones outside live graph tables | Existing queries ignore tombstones without extra filters, preserving correctness and query performance. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm test -- --run mcp_server/tests/code-graph-tombstones.vitest.ts mcp_server/tests/code-graph-db.vitest.ts mcp_server/tests/code-graph-scan.vitest.ts mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | PASS: 4 files, 55 tests |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh ...` | PASS: no output |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. Tombstones are audit-only. They do not restore deleted nodes or edges.
2. Retention is intentionally bounded. Older deletion evidence is pruned once the configured row limit is exceeded.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
