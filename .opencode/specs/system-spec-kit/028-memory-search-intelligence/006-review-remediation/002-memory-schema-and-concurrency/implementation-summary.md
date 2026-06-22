---
title: "Implementation Summary: Memory Schema and Concurrency Remediation"
description: "Pending scaffold summary for the memory-schema-and-concurrency remediation phase."
trigger_phrases:
  - "002-memory-schema-and-concurrency implementation summary"
  - "028 review remediation schema concurrency"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/002-memory-schema-and-concurrency"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded impl"
    next_safe_action: "Do not mark the fixes complete until execution evidence exists"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-summary-006-002-memory-schema-and-concurrency"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This summary exists to satisfy the Level-2 contract."
      - "The three fixes remain PENDING."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/028-memory-search-intelligence/006-review-remediation/002-memory-schema-and-concurrency |
| **Completed** | Not executed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The scaffold defines the memory-schema-and-concurrency remediation phase. No code has been fixed. The P1-2 derived-id split, P1-4 in-lock embedding and P1-5 retention spare-only stale snapshot all remain PENDING.

### Pending Remediation Contract

This child phase has the required spec, plan, task list, checklist and summary docs. They cite `vector-index-schema.ts:1126`, `consolidation.ts:701` and `memory-retention-sweep.ts:612` with quoted fix intent so a later execution pass can align the derived-id identity, move the embedding pass out of the write lock with a refreshed maintenance handle and re-validate the retention spare axes inside the transaction.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| spec.md | Created | Defines scope, cited findings and acceptance criteria |
| plan.md | Created | Defines fix approach and verification route |
| tasks.md | Created | Lists pending remediation tasks |
| checklist.md | Created | Lists pending verification checks |
| implementation-summary.md | Created | Records that this is scaffold only |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase docs were created from the spec-kit Level-2 structure and kept in PENDING state. The three storage-layer fixes are intentionally deferred to a separate executing seat.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep a pending summary | The Level-2 validator requires the file and the content must avoid false completion claims |
| Leave all checks unchecked | No fix or test evidence exists yet |
| Group the three fixes | All sit in the memory schema and storage concurrency surface and share a migration-safety risk profile |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Derived-id fix | PENDING |
| Consolidation lock fix | PENDING |
| Retention spare-axis fix | PENDING |
| Strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/002-memory-schema-and-concurrency --strict` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fixes not executed.** This phase defines the remediation contract only. Later work must confirm the cited facts and add migration-safety and concurrency tests before any completion claim.
<!-- /ANCHOR:limitations -->
