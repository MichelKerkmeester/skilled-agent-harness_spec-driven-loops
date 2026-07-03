---
title: "Implementation Summary: Content-Hash Normalization and Save-Dedup Lanes"
description: "Content-hash input is normalized and the broken save-dedup lanes are repaired, so an unchanged re-save returns unchanged instead of minting a deprecated snapshot — stopping the save-path churn that accumulated duplicate rows unboundedly."
trigger_phrases:
  - "content hash normalization"
  - "save dedup lanes"
  - "full-auto canonical save self-reject"
  - "continuity fingerprint unify"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/003-content-hash-normalization-and-save-dedup-lanes"
    last_updated_at: "2026-07-03T19:02:31Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Integrated + verified 003; content-hash normalization + dedup lanes; 315 tests green"
    next_safe_action: "Phase 004 embedding-coverage-and-vector-shard-consistency"
    blockers: []
    key_files:
      - "mcp_server/lib/content-id.ts"
      - "mcp_server/handlers/memory-save.ts"
      - "mcp_server/handlers/save/pe-orchestration.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-003-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The dual-compare is a runtime normalized-vs-legacy comparison, not a destructive batch migration"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-content-hash-normalization-and-save-dedup-lanes |
| **Completed** | 2026-07-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Saving an unchanged document no longer churns the corpus. Before, `content_hash` was a raw sha256 of the file bytes, so a CRLF flip, a trailing space, or a bumped `_memory.continuity` timestamp read as new content — and every same-path re-save then retired its predecessor to `tier='deprecated'` and inserted a fresh row, accumulating snapshots without bound. The lanes that should have absorbed those re-saves were all broken. They work now.

### Normalized content identity

`normalizeContentHashInput` folds CRLF to LF, strips trailing whitespace, and zeros the continuity fingerprint and timestamp lines inside the YAML frontmatter block before hashing, so churn that does not change durable identity produces the same hash. The dedup match path is dual-compare: it accepts the normalized hash or the legacy raw hash (and a normalized-stored-content fallback), so already-indexed rows stay matchable without any stored-hash rewrite — a runtime comparison, not a destructive migration.

### The dedup lanes, unblocked

The full-auto canonical save no longer structurally self-rejects: POST_SAVE_FINGERPRINT validates against the pending/rendered content and the apply follow-up dispatches a real canonical writer. The PE-gate UPDATE/REINFORCE lanes are reachable again (the same-path exclusion was dropped from the similar-memory lookup), the transactional complement recheck is gated on reconsolidation-enabled and `!force` so a same-path re-save stops aborting with E088, and the quality-gate semantic dedup excludes a document's own predecessor instead of rejecting a re-save as a near-duplicate of itself. The two `buildContinuityFingerprint` builders are unified onto one exported implementation, so CONTINUITY_FRESHNESS cannot mismatch by construction.

### Ordering, collapse, and routing

Recon conflict handling retires the predecessor before inserting the successor, so it no longer collides with the active-uniqueness index (which excludes constitutional, deprecated, and archived). The cross-file canonical-path guard now covers SUPERSEDE, so a cross-file regex match cannot deprecate a sibling document. Result fusion collapses candidates by canonical file identity keeping the best score, as belt-and-braces behind the source fix. And the content-router's transcript-wrapper drop is anchored to line-start speaker cues (or two speaker turns), so a chunk that merely mentions `tool:` or `user:` mid-line is no longer silently dropped.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented in an isolated worktree and got 8 of 10 REQs right on the first pass — a marked improvement over the prior phase, self-correcting against the phase tests as it went. GPT-5.5-fast (xhigh) then ran an independent adversarial review and failed REQ-008 (three save-path sub-lanes: preflight self-reject, BM25 added pre-commit, mutex reclaim without rename-verify) and REQ-010 (the speaker-cue regex was still unanchored), and flagged six failing hybrid-search tests. GPT-high remediated all of it; Opus 4.8 final-verified and integrated.

Final-verify attributed the six hybrid-search failures precisely: they fail identically on the pre-003 tree, so they are not a 003 regression — they are stale DB mocks left over from phase 002's BM25 predicate change (the mock matched the old SQL string and returned nothing). Repairing the mock to match the current `deleted_at`/tier query closes that phase-002 loose end too. Only the sixteen-plus in-scope mcp_server source and test files were integrated; a stray run that regenerated ~1,836 description.json files and bumped package.json was excluded as out of scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dual-compare at runtime, no stored-hash rewrite | REQ-001 must stay non-destructive; comparing normalized-vs-legacy on read keeps every existing row matchable without a risky batch migration over the live index |
| Zero the continuity fingerprint/timestamp before hashing | Those lines change on every save by design; excluding them is what makes an otherwise-identical re-save dedup instead of churn |
| Retire the predecessor before inserting the successor | The active-uniqueness index excludes constitutional/deprecated/archived, so inserting first would collide with the still-active predecessor |
| Repair the phase-002 hybrid-search mock rather than skip it | The mock drifted from the real query after 002 added the shared predicate; fixing it restores real coverage instead of hiding it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (integrated main) | PASS (clean) |
| 003 vitest (9 files) | PASS (315/315) |
| REQ-001..REQ-010 xhigh review | PASS after remediation (8/10 first pass, 2 remediated) |
| hybrid-search stale-mock failures | FIXED (were pre-003 phase-002 mock drift) |
| Content-hash dual-compare | Runtime, non-destructive (no stored-hash rewrite) |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No batch migration ships with this phase.** The dual-compare is a runtime read-path comparison, so legacy raw-hash rows are matched on the fly rather than rewritten. That is intentional (non-destructive), but it means the normalized hash only becomes the stored value the next time a given document is actually re-saved.
2. **The search-level effects depend on the daemon running this code.** Like phases 001 and 002, the running daemons pick up the new save/dedup behavior on their next restart.
<!-- /ANCHOR:limitations -->
