---
title: "Implementation Summary: Legacy DB Cleanup (029 Phase 005)"
description: "Removed the stale legacy code-graph DB; corrected F-019-1 root cause — the runtime was on canonical all along (empty-DB size coincidence)."
trigger_phrases:
  - "legacy db cleanup summary"
  - "f-019-1 summary"
  - "029 phase 005 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-code-graph-playbook-validation/005-db-binding-cleanup"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Removed stale legacy DB; corrected F-019-1 (no misbinding)"
    next_safe_action: "Proceed to phase 006 parser recovery"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-code-graph-playbook-validation/005-db-binding-cleanup |
| **Completed** | 2026-05-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The stale legacy code-graph DB is gone, and F-019-1's root cause is corrected: there was never an active misbinding.

### Root-cause correction
The original 029 finding inferred the runtime was bound to the empty legacy DB because smoke-006 reported `dbFileSize: 106496` — the legacy file's size. Phase-005 investigation showed an **empty** code-graph SQLite is ~106,496 bytes too, so that reading was the **canonical DB in its then-empty state**, not the legacy file. The canonical DB resolution is correct by design (`opencode.json:69` default + launcher `dbDir` → `.opencode/.spec-kit/code-graph/database`; no code-level legacy fallback). The canonical DB is now 68 MB and actively updated; the legacy file was a stale, gitignored, unused leftover (mtime May 25, not held open).

### Cleanup
Removed `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` and its now-empty parent dir. No config/code change was needed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` | Deleted | Stale legacy DB removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Investigated the real binding (file sizes/mtimes, `opencode.json` default, launcher `resolvedDbDir`, `lsof`), confirmed the legacy file was unused, then removed it. Verified legacy absent + canonical present non-zero.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the file, change no config | Canonical is already the configured default; the legacy file was the only artifact of the finding |
| Downgrade F-019-1 from "active misbinding (P1)" to "stale leftover (P2), resolved" | Empty-DB size coincidence explained the smoke-006 reading; canonical is and was the active store |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `lsof` legacy DB before rm | PASS (not held) |
| Legacy DB absent after rm | PASS |
| Canonical DB present non-zero | PASS (68,464,640 bytes) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not re-validated via a live `code_graph_status` dispatch.** File-state verification is conclusive (legacy gone, canonical active); a status dispatch was skipped to avoid re-triggering graph-metadata churn.
<!-- /ANCHOR:limitations -->
