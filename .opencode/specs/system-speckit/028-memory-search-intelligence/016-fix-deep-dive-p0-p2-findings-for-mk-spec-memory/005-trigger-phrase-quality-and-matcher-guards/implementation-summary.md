---
title: "Implementation Summary: Trigger-Phrase Quality and Matcher Guards"
description: "Retired legacy word-soup trigger phrases, added matcher-side stopword/IDF guards and per-memory dedup, replaced the full-corpus phrase re-read with a (path,mtime) cache, made trigger writes merge instead of clobber user-authored phrases, and deduped the constitutional rows — so memory_match_triggers surfaces the right docs without noise."
trigger_phrases:
  - "trigger phrase quality"
  - "matcher stopword idf guard"
  - "constitutional row dedup"
  - "trigger write merge"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/005-trigger-phrase-quality-and-matcher-guards"
    last_updated_at: "2026-07-04T14:08:37.746Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Integrated 005; ran trigger-regen + constitutional-dedup migrations under backup; 54 tests green"
    next_safe_action: "Phase 006 rescue-layer-ranking-authority-decision (Part 1 eval-parity gates 006-2/007/008)"
    blockers: []
    key_files:
      - "mcp_server/lib/parsing/trigger-matcher.ts"
      - "mcp_server/handlers/memory-save.ts"
      - "mcp_server/scripts/migrations/regenerate-legacy-trigger-phrases.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-005-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-006 trigger-cache predicate was already added by phase 002; verified + tested, not re-implemented"
      - "REQ-010: constitutional rows stay excluded from the trigger cache (decided + documented)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-trigger-phrase-quality-and-matcher-guards |
| **Completed** | 2026-07-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`memory_match_triggers` stops surfacing noise. Legacy rows stored word-soup phrases — long low-signal token strings that matched almost anything — and the matcher then ranked them on single-token hits. That is fixed on both sides: a batched, resumable, checkpoint-gated migration regenerated 48 legacy rows' phrases through the quality extractor, and the matcher now applies a stopword + minimum-length + IDF guard to single-token matches and dedupes phrases per memory.

The phrase cache no longer re-reads the whole corpus from disk every 60 seconds; it is keyed on (path, mtime) with a batched record fetch. Trigger writes merge extracted phrases with user-authored ones (case-insensitively deduped, capped) instead of clobbering what a human wrote. `memory_match_triggers` now matches a specFolder by path segment (`folder === scope` or `folder` starts with `scope + '/'`), consistent with every other read surface, instead of a bare substring. Frontmatter parsing handles apostrophes and multi-line YAML phrase lists, the trigger backfill keeps failed rows failed behind an attempt cap and backoff while cleaning up phrases for deleted memories, and the trigger-cache loader excludes archived/deprecated/tombstoned/constitutional rows through the shared active-row predicate that phase 002 added (verified here, not re-implemented).

Constitutional hygiene: a gated migration deduped the constitutional rows from 30 down to 19 distinct, and a write guard now rejects a constitutional save that originates from a `/tmp` or sandbox path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/parsing/trigger-matcher.ts` | Modified | Stopword/min-length/IDF guard + per-memory dedup; (path,mtime) phrase cache |
| `mcp_server/handlers/memory-triggers.ts` | Modified | specFolder path-segment prefix match |
| `mcp_server/handlers/memory-save.ts` | Modified | Merge extracted + user-authored triggers; constitutional /tmp-origin write guard |
| `mcp_server/lib/parsing/memory-parser.ts` | Modified | Apostrophe + multi-line YAML trigger parsing |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | Modified | Failed-row attempt cap/backoff + orphan phrase cleanup |
| `mcp_server/scripts/migrations/regenerate-legacy-trigger-phrases.mjs` | Created | Dry-run-default, `--before`-scoped, resumable legacy regen (ran: 48 rows) |
| `mcp_server/scripts/migrations/dedup-constitutional-trigger-rows.mjs` | Created | Dry-run-default, baseline-gated constitutional dedup (ran: 11 deleted) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented; GPT-5.5-fast (xhigh) passed nine of ten REQs and failed one — the regeneration migration's `--before` cutoff was optional, so an apply could rewrite fresh post-guard phrases. Opus 4.8 fixed that (apply now requires `--before` with an ISO check), final-verified, integrated, and ran both migrations on the live index under an atomic backup: 48 legacy rows regenerated and 11 duplicate constitutional rows deprecated (30 to 19 distinct), integrity clean, the one-active-row-per-key invariant still zero. The migration dry-runs originally reported zero because they ran against a checkpoint snapshot; re-running against the live DB surfaced the real 48/30 counts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regeneration apply requires `--before` | Without a cutoff the migration could rewrite fresh, already-clean phrases; scoping to pre-guard rows keeps it to genuine legacy word-soup |
| Merge trigger writes instead of replacing | A save must never silently drop a human-authored trigger phrase |
| Constitutional rows stay out of the trigger cache | Decided and documented; they are surfaced through their own injection lane, not matched as triggers |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (integrated main) | PASS (clean) |
| 005 vitest (5 files) | PASS (54/54) |
| REQ-001..REQ-010 xhigh review | PASS after remediation (9/10 first pass, REQ-001 remediated) |
| Trigger regen migration (live, under backup) | PASS (48 rows regenerated) |
| Constitutional dedup migration (live) | PASS (11 deleted; 30 to 19 distinct; integrity ok) |
| Active-key invariant after migrations | PASS (0 violations) |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Matcher-side effects need the daemon running this code.** Like the earlier phases, the running daemons pick up the new matcher guards and cache behavior on their next restart.
2. **Rollback is the named backup.** Both migrations are audited/reversible, and `context-index.sqlite.pre-005-trigger-quality-20260703` restores the full pre-migration state.
<!-- /ANCHOR:limitations -->
