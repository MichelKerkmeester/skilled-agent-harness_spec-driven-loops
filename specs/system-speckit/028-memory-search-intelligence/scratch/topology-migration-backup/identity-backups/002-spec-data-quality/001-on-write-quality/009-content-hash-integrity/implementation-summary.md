---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will extend verify_integrity with a read-time content-hash recompute behind a default-off flag. No code change has landed."
trigger_phrases:
  - "content hash integrity"
  - "read time hash verify"
  - "storage drift guard"
  - "verify_integrity content hash"
  - "silent corruption detection"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/009-content-hash-integrity"
    last_updated_at: "2026-07-06T18:49:49.542Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for A9 read-time content-hash integrity scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
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
| **Spec Folder** | 009-content-hash-integrity |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Read-time content-hash recompute

The phase will extend the existing `verify_integrity` summary at `lib/search/vector-index-queries.ts:1524` with a read-time recompute that re-hashes each row body via `hashContentBody` from `lib/content-id.ts:14` and compares the result to the stored `content_hash`. Today the stored hash is written once at save time and used only as an embedding-cache key and an idempotency receipt, never re-checked on read. The recompute closes that gap, so a silent DB or migration corruption of a stored body becomes a detectable integrity fault instead of invisible bad recall.

### Report-only mismatch field behind a default-off flag

The phase will surface mismatch row ids on a new `contentHashMismatches` field on the integrity summary, report-only with no body or hash mutation. The whole recompute will sit behind a default-off flag, so the flag-off sweep performs no extra row-body read and keeps the current cost and summary shape. Rows with a null or absent `content_hash` will be skipped, so a pre-migration row is never counted as a mismatch.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Planned modify | Add the read-time recompute branch to `verify_integrity` and surface `contentHashMismatches` behind a default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts` | Read-only reuse | Reuse `hashContentBody` for the recompute, no change to the helper |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Read-only reference | Pin the exact body form against the save-side `content_hash` write so the read form matches the write form |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned rollout adds the recompute branch behind a default-off flag, pins the recompute body form against the save-side write at `checkpoints.ts:2145` to avoid false mismatches, and proves the guard with a deliberately corrupted scratch row that reports in `contentHashMismatches` while a clean corpus reports zero. A re-read of the mismatched row will confirm the body and stored hash stay untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `hashContentBody` verbatim | The helper is the canonical write-time body hash, so reusing it keeps the read form aligned with the write form and adds no new hash logic |
| Keep the recompute in the integrity sweep behind a default-off flag | A per-read recompute would tax the hot search path, so the sweep with a default-off flag holds the current cost floor |
| Make the check detect-and-report only | The row body is an authored or saved artifact, so a body fix is never a safe-class auto-fix and the check reports a mismatch instead of mutating it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet.

| Check | Result |
|-------|--------|
| A corrupted scratch row is reported in `contentHashMismatches` with its id | PLANNED, not yet run |
| A clean corpus reports zero mismatches | PLANNED, not yet run |
| A re-read of a mismatched row proves no body or hash mutation | PLANNED, not yet run |
| The flag-off integrity summary keeps the current shape with no extra read | PLANNED, not yet run |
| `validate.sh --strict` on the phase folder exits 0 | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Body-form precondition.** The recompute must hash the same body form the save path hashes at `checkpoints.ts:2145`, or a normalization difference will cause false mismatches.
3. **Open sweep-scope question.** Whether the recompute runs on every read or only inside the on-demand integrity sweep is unresolved. The research verdict places it as a standing drift guard in the sweep, so the sweep is the default home pending an operator request for a per-read mode.
<!-- /ANCHOR:limitations -->

---
