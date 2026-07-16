---
title: "Legacy DB Binding Cleanup: Stale SQLite Removed and F-019-1 Root Cause Corrected"
description: "The stale legacy code-graph SQLite DB was removed and the F-019-1 finding was downgraded from an active misbinding to a resolved stale leftover. No config change was needed because the canonical DB was the active store all along."
trigger_phrases:
  - "legacy db cleanup"
  - "f-019-1 db binding"
  - "code-graph stale sqlite removed"
  - "db misbinding false positive"
  - "029 phase 005"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/005-db-binding-cleanup`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening`

### Summary

Playbook scenario 019 (F-019-1) reported the code-graph runtime bound to a legacy SQLite DB at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` (106 KB). Investigation revealed that an empty code-graph SQLite is also ~106,496 bytes, so the smoke-006 `dbFileSize: 106496` reading came from the canonical DB in its then-empty state, not the legacy file. The canonical DB was the active store all along, configured by default via `opencode.json` and the launcher `dbDir` path with no legacy fallback in code. The stale legacy file (mtime May 25, not held open, gitignored) was removed alongside its now-empty parent directory. F-019-1 was downgraded from "active misbinding (P1)" to "stale leftover (P2), resolved." No config or code change was needed.

### Added

- None.

### Changed

- None. The canonical DB binding required no modification. The cleanup was a file removal only.

### Fixed

- Stale legacy DB removed from `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`. The file was gitignored, unused. It was a leftover from an earlier layout. Its presence had caused F-019-1 to be classified as an active misbinding.

### Verification

| Check | Result |
|-------|--------|
| `lsof` on legacy DB before removal | PASS (not held open) |
| Legacy DB absent after removal | PASS |
| Canonical DB present and non-zero | PASS (68,464,640 bytes) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` | Deleted | Stale legacy DB removed. File was gitignored, unused. Not held open by any process. |

### Follow-Ups

- A live `code_graph_status` dispatch was not run after cleanup to avoid graph-metadata churn. Run one to confirm the canonical DB is healthy if graph behavior appears degraded.
- Scenario 019 was not re-dispatched via the playbook runner. A targeted re-run of scenario 019 would formally close F-019-1 with a recorded PASS.
