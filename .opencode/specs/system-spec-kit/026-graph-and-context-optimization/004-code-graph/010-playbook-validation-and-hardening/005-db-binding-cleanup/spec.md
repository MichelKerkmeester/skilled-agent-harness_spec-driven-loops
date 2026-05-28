---
title: "Feature Specification: Legacy DB Cleanup (029 Phase 005)"
description: "Remove the stale legacy code-graph SQLite DB; confirm the runtime uses the canonical DB (F-019-1)."
trigger_phrases:
  - "legacy code graph db cleanup"
  - "f-019-1 db binding"
  - "029 phase 005 db cleanup"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-code-graph-playbook-validation/005-db-binding-cleanup"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 005 spec; corrected F-019-1 root cause (stale leftover, not misbinding)"
    next_safe_action: "Remove stale legacy DB file"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Legacy DB Cleanup (029 Phase 005)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
029 finding F-019-1 reported a legacy code-graph SQLite DB at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` (106 KB) alongside the canonical DB. Phase-005 investigation CORRECTED the original "runtime bound to legacy" inference: an empty code-graph SQLite is ~106,496 bytes, the same size as the stale legacy file, so smoke-006's `dbFileSize: 106496` was the canonical DB in its then-empty state — not the legacy DB. The canonical DB is now 68 MB and actively updated (mtime today); the legacy file is a stale, unused leftover (mtime May 25, not held open, gitignored).

### Purpose
Remove the stale legacy DB so no legacy path lingers, satisfying scenario 019's "no legacy paths active" requirement; confirm the canonical DB remains the active, configured store.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` (+ empty parent dir).
- Confirm canonical DB (`.opencode/.spec-kit/code-graph/database/code-graph.sqlite`) is present and the configured default.

### Out of Scope
- Any code/config change to DB resolution (none needed — canonical is already the default per `opencode.json:69` and launcher `dbDir`).
- Re-running scenario 019 via dispatch (file-state verification is sufficient and avoids graph churn).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` | Delete | Stale legacy DB (gitignored, unused) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Legacy DB removed | `test -f <legacy>` → absent |
| REQ-002 | Canonical DB intact | `test -f <canonical>` → present, non-zero |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No process held the legacy DB at removal | `lsof` clean before `rm` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Legacy DB path absent; canonical DB present and active.
- **SC-002**: Re-running scenario 019 would PASS (no legacy paths active).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Legacy DB actually in use | Runtime breaks | Confirmed NOT held open (`lsof`) + canonical active (mtime today); legacy stale (May 25) |
| Risk | Irreversible delete | Data loss | File is gitignored empty leftover; canonical 68 MB is the real store |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — root cause corrected and removal confirmed safe.
<!-- /ANCHOR:questions -->
