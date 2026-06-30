---
title: "Implementation Plan: Phase 7: memory-reindex"
description: "Run memory_index_scan on packets 157 + 158 to refresh stale spec-memory rows, leaving archived rename-history rows untouched."
trigger_phrases:
  - "memory reindex plan"
  - "memory_index_scan 157 158 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/007-memory-reindex"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/007-memory-reindex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: memory-reindex

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Spec Kit Memory MCP |
| **Framework** | memory_index_scan / context-index.sqlite |
| **Storage** | regenerated index (not hand-edited) |
| **Testing** | SQLite count query + memory_search probe |

### Overview
Run `memory_index_scan({ specFolder })` for `157-glm-5-2-support` and `158-sk-prompt-models-rename` so their rows reflect the renamed content. Confirm with a `context-index.sqlite` query (0 live-packet rows with the old name) and a `memory_search`. Leave the archived `z_archive/114-…` rename-history rows untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Rename (phases 2–6) complete; docs already say sk-prompt-models

### Definition of Done
- [x] 157 + 158 re-indexed; 0 live-packet rows reference the old name
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scoped regeneration. The index is derived from the spec docs; a packet-scoped scan refreshes only the live packets, preserving archived history.

### Key Components
- **memory_index_scan**: the re-index entry point.
- **context-index.sqlite**: the index queried to confirm.

### Data Flow
1. Scan 157 → rows refreshed.
2. Scan 158 → rows refreshed.
3. Query the index to confirm 0 live-packet old-name rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Baseline: count context-index rows referencing the old name, scoped to 157/158

### Phase 2: Re-index
- [x] `memory_index_scan({ specFolder: "skilled-agent-orchestration/120-glm-5-2-support" })`
- [x] `memory_index_scan({ specFolder: "skilled-agent-orchestration/121-sk-prompt-models-rename" })`

### Phase 3: Verify
- [x] Re-query: 0 live-packet rows with the old name; a memory_search for sk-prompt-models surfaces renamed docs; write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Query | Live-packet old-name rows = 0 | sqlite3 count on context-index.sqlite |
| Search | Renamed docs retrievable | `memory_search` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec Kit Memory daemon | Internal | Available | Cannot re-index (exit 75 retryable) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Re-index errors or scans the wrong scope.
- **Procedure**: Re-indexing is idempotent and derived from the docs; re-run with the correct packet scope. No source content changes.
<!-- /ANCHOR:rollback -->
