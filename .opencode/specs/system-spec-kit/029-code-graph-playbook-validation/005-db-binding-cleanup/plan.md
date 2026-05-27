---
title: "Implementation Plan: Legacy DB Cleanup (029 Phase 005)"
description: "Remove the stale legacy code-graph DB and confirm canonical is active."
trigger_phrases:
  - "legacy db cleanup plan"
  - "f-019-1 plan"
  - "029 phase 005 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-code-graph-playbook-validation/005-db-binding-cleanup"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 005 plan"
    next_safe_action: "Remove stale legacy DB"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Legacy DB Cleanup (029 Phase 005)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Filesystem state (SQLite file) |
| **Framework** | mk-code-index DB resolution |
| **Storage** | SQLite |
| **Testing** | file-existence + lsof checks |

### Overview
Delete one stale, unused, gitignored legacy DB file after confirming it is not held open; canonical DB needs no change (already the configured default).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Legacy DB confirmed stale + unused (lsof clean, mtime May 25)
- [x] Canonical confirmed active (68 MB, mtime today)

### Definition of Done
- [ ] Legacy DB absent
- [ ] Canonical DB intact
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Filesystem cleanup.

### Key Components
- **legacy DB** — to remove.
- **canonical DB** — active, unchanged.

### Data Flow
lsof check → rm legacy → verify canonical present.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| legacy DB file | stale leftover | delete | `test -f` absent |
| canonical DB | active store | unchanged | `test -f` present, non-zero |

Required inventories:
- Code references to legacy path as default/fallback: confirmed NONE (launcher `dbDir`=canonical; `opencode.json:69` notes legacy is auto-migrated). Removal does not orphan any consumer.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-confirm `lsof` clean on legacy DB

### Phase 2: Core Implementation
- [ ] `rm` legacy DB (+ remove now-empty parent dir)

### Phase 3: Verification
- [ ] Legacy path absent; canonical present + non-zero
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | file existence + lsof | bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| no live process on legacy DB | Internal | Green | unsafe to remove if held |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: runtime errors after removal (not expected — file was unused).
- **Procedure**: the launcher auto-creates/migrates a DB on next startup; canonical is the source of truth, so no manual restore needed.
<!-- /ANCHOR:rollback -->
