---
title: "Implementation Summary: Remove untracked stub packets below the system-code-graph archive ceiling"
description: "Planning-only scaffold for deleting the 007/009 untracked system-code-graph stub directories. No deletion has run."
trigger_phrases:
  - "system-code-graph stub cleanup"
  - "remove untracked spec stubs"
  - "archive ceiling packet cleanup"
  - "007 009 stub directory removal"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored planning-stub implementation-summary"
    next_safe_action: "Re-verify zero tracked files, then run verify-then-rm-rf sequence"
    blockers: []
    key_files:
      - ".opencode/specs/system-code-graph/007-code-graph-buildout/"
      - ".opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/"
      - ".opencode/specs/system-code-graph/context-index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-system-code-graph-cleanup-impl-summary-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the 152 stale descriptions.json specFolder entries pointing at the old 007-/009- basenames be reindexed in a follow-up packet?"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-system-code-graph-cleanup |
| **Completed** | Pending (scaffold only, not executed) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet plans the deletion of two untracked, zero-tracked-file stub directories (`007-code-graph-buildout`, `009-advisor-codegraph-shared-features`) that squat below the system-code-graph archive ceiling even though their real content already migrated to `031`/`033`. No deletion has executed yet; the plan defines the verify-then-`rm -rf` sequence and the classification of every remaining basename reference.

### Stub Directory Cleanup Plan

The plan requires a fresh `git ls-files` confirmation of zero tracked files in both stub directories immediately before deletion, and a repo-wide grep classifying every remaining reference to the two basenames as either historical/audit (the `context-index.md` rename-mapping table) or stale search-index staleness (152 `descriptions.json` entries), never a live pointer that would break.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Planned | Delete `007-code-graph-buildout` and `009-advisor-codegraph-shared-features` (untracked stub dirs), re-verify packet number line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Execution is pending per plan.md / checklist.md.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Classify remaining references before deleting, not after | Completing the classification pass first means a genuinely live reference is never silently broken by the delete. |
| Leave the 152 stale `descriptions.json` entries out of scope | Search-index staleness is a separate reindex follow-up, not a reason to block this low-risk, untracked-only cleanup. |
| Treat `context-index.md`'s rename-mapping table as historical record, not a live pointer | The table intentionally documents `007->031` and `009->033` as completed migration history and is preserved as-is. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --recursive --strict` | Not yet run (acceptance criteria in checklist.md) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scaffold only.** No `rm -rf` has run against either stub directory; this document only plans the sequence.
2. **Low blast radius but still gated.** Deletion still requires a fresh `git ls-files` re-check immediately before execution, not reuse of this scaffold's snapshot.
3. **Reindex follow-up not covered.** The 152 stale `descriptions.json` `specFolder` entries are explicitly deferred to a separate packet.
<!-- /ANCHOR:limitations -->

---
