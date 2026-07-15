---
title: "Feature Specification: Phase 5: trigger-phrase-quality-and-matcher-guards"
description: "45% of the 165,979 stored trigger-phrase occurrences are single junk words, the matcher has no stopword/length/IDF guard, and the Gate-1 match_triggers hot path runs 2.3s warm / 17s cold. This phase pairs retroactive data repair with write-side and matcher-side guards so junk phrases are purged and cannot return."
trigger_phrases:
  - "trigger phrase quality"
  - "trigger phrase regeneration"
  - "single word trigger junk"
  - "match triggers latency"
  - "matcher stopword guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/005-trigger-phrase-quality-and-matcher-guards"
    last_updated_at: "2026-07-04T17:51:10.230Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored spec/plan/tasks/checklist planning docs from deep-dive research"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-trigger-phrase-quality-and-matcher-guards"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should constitutional rows become visible to the trigger cache, or stay excluded with the exclusion documented?"
      - "What IDF floor / min-length keeps rare-but-real single-token triggers (allowlist needed?)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: trigger-phrase-quality-and-matcher-guards

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 13 |
| **Predecessor** | 004-embedding-coverage-and-vector-shard-consistency |
| **Successor** | 006-rescue-layer-ranking-authority-decision |
| **Handoff Criteria** | Warm `memory_match_triggers` p50 < 300ms; resume-style prompts surface active-packet docs (not z_archive); regeneration + constitutional migrations applied and audited; all P0 checklist items verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Deep dive remediation phase children specification.

**Scope Boundary**: Trigger-phrase data quality (stored phrases + constitutional rows), the trigger write path (parser + save auto-fix + backfill), the `memory_match_triggers` read path (matcher guards, scope semantics, cache loading), and trigger hot-path performance. No ranking/fusion changes and no archived-tier predicate implementation (consumed from phase 002, not built here).

**Dependencies**:
- Phase 002 (`002-archived-tier-and-tombstone-read-exclusions`) delivers the ONE shared active-row predicate; this phase applies that predicate to the trigger cache loader. Execution order places 002 before 005; if run out of order, the exclusion task is blocked (see tasks.md T008).
- Quality-loop trigger extractor (`handlers/quality-loop.ts`) is reused as the regeneration engine for legacy rows; it must remain functional as-is.

**Deliverables**:
- Retroactive trigger regeneration migration for legacy word-soup rows (batched, resumable).
- Write-side guards: merge-not-replace auto-fix, case-insensitive dedupe + count cap, apostrophe/multi-line frontmatter parsing fix.
- Matcher guards: stopword/min-length/IDF single-token guard, per-memory phrase dedup, archive/deprecated exclusion in the cache loader, specFolder prefix matching.
- Constitutional hygiene: dedup 70 rows to 20 distinct, purge the /tmp sandbox row (id 38797), write guard rejecting constitutional saves from /tmp or sandbox paths.
- Trigger backfill hardening: failed-row attempt cap/backoff, FK cleanup for deleted memories.
- Hot-path cache: (path, mtime)-keyed phrase extraction cache and batched record fetch.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The trigger-phrase corpus is dominated by junk: 45% of 165,979 phrase occurrences are single words ("feature" x2,072, "specification" x2,034, "system-spec-kit" x1,922, even "z_archive" x848), and a live resume-style prompt returned 5/5 z_archive hits via single-word matches at weight 0.8 (deep-dive report §1; findings ledger L4). The write path makes it worse: the quality-loop auto-fix REPLACES user-authored trigger phrases instead of merging (`handlers/memory-save.ts:537`, default ON), and the frontmatter parser silently drops multi-line phrases and phrases with apostrophes (`lib/parsing/memory-parser.ts:820`). On the read path, `memory_match_triggers` filters `specFolder` by exact match while every other surface is prefix-aware (report §3 P1 #10, `handlers/memory-triggers.ts:449,269`), the trigger cache re-reads every canonical spec doc from disk on each 60s TTL expiry (report §4 item 2, `lib/parsing/trigger-matcher.ts:333`), producing 2.3s warm / 17s cold latency on a per-user-message hot path, and constitutional priming carries 70 rows for only 20 distinct titles including a /tmp sandbox row (id 38797) auto-injected into every session (ledger L5).

### Purpose
Gate-1 trigger surfacing becomes fast and trustworthy: warm `memory_match_triggers` p50 under 300ms, junk single-word matches eliminated at both the data and matcher layers, and resume-style prompts surfacing active-packet docs instead of z_archive.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retroactive trigger regeneration for legacy word-soup rows reusing the quality-loop extractor (batched migration, resumable, reversible).
- Write-side: auto-fix merges with user triggers instead of replacing; case-insensitive dedupe + phrase count cap; apostrophe/multi-line frontmatter parsing fix.
- Matcher-side: stopword/min-length/IDF guard for single-token matches; per-memory phrase dedup; archive/deprecated exclusion in the trigger cache loader (consuming the phase 002 predicate); specFolder prefix matching; documented decision on constitutional-row visibility to the trigger cache.
- Constitutional hygiene: dedup 70 rows to 20 distinct, purge /tmp sandbox row id 38797, add a write guard rejecting constitutional saves sourced from /tmp or sandbox paths.
- Trigger backfill: failed rows keep failed status with an attempt cap/backoff; FK cleanup for phrases pointing at deleted memories.
- Hot-path performance: (path, mtime)-keyed phrase extraction cache replacing the full-corpus disk re-read per 60s TTL; batched record fetch (id IN) for match hydration.

### Out of Scope
- Archived-tier / tombstone predicate implementation - phase 002 owns the shared active-row predicate; this phase only consumes it.
- Ranking, fusion, and rescue-layer behavior - phases 006/007 own signal ordering and score fixes.
- Broader search hot-path performance beyond the trigger path (rescue hydration, graph adjacency, envelope serialization) - phase 010.
- z_archive tier migration and retro-demotion of archived critical/important rows - phase 002.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts | Modify | Auto-fix merges extracted triggers with user-authored ones instead of replacing (line 537 area); constitutional write guard rejecting /tmp and sandbox source paths |
| .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts | Modify | Frontmatter trigger extraction handles apostrophes and multi-line YAML list items (line 820 area); case-insensitive dedupe + count cap at parse time |
| .opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | Modify | Stopword/min-length/IDF single-token guard; per-memory phrase dedup; archive/deprecated exclusion in cache loader; (path, mtime)-keyed extraction cache replacing full-corpus disk re-read (line 333 area) |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts | Modify | specFolder filter becomes prefix-aware to match every other read surface (lines 449, 269); batched record fetch (id IN) for match hydration |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts | Modify | Failed-row attempt cap/backoff so failed phrases stop re-pending forever; FK cleanup for deleted memories |
| .opencode/skills/system-spec-kit/mcp_server/lib/ (new migration, following the existing migration pattern in vector-index-schema.ts) | Create | Batched, resumable regeneration migration for legacy word-soup trigger rows; constitutional dedup 70 to 20 + purge of sandbox row id 38797 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Retroactive trigger regeneration for legacy word-soup rows via the quality-loop extractor (report §1 trigger row; ledger L4). SELECTOR predicate: a row qualifies as "legacy word-soup" when its stored `trigger_phrases` are all/predominantly single-token entries drawn from the row title (title-word-soup signature) AND it predates the write-side guards (T003-T005). Regeneration MERGES newly-extracted phrases with the row's existing phrases (case-insensitive dedup, never blind-replace) so any surviving user-authored trigger is preserved — legacy save-time auto-fix already ran replace (REQ-004), so user phrases cannot be assumed absent. z_archive/archived-tier rows (~11k, excluded once phase 002's predicate lands) and constitutional rows are SKIPPED, to avoid burning extraction on soon-excluded rows and re-surfacing archived phrases | Migration runs batched + resumable on a DB copy first; the selector predicate, merge-preserve, and archived/constitutional skip are each asserted by the post-run audit; audit shows selected title-word-soup rows regenerated into multi-word phrases with prior user-authored phrases retained; single-word share drops from the 45% baseline; migration is idempotent on re-run |
| REQ-002 | Matcher-side stopword/min-length/IDF guard for single-token matches plus per-memory phrase dedup (ledger L4; Agent E P2) | Resume-style prompt reproduction returns 0 z_archive rows via single-word matches (baseline 5/5); stopword-only queries return no trigger hits; guard unit tests cover stopword, short-token, and high-IDF single-token cases |
| REQ-003 | (path, mtime)-keyed phrase extraction cache replacing the full-corpus disk re-read per 60s TTL, plus batched record fetch (report §4 item 2; ledger L4; `trigger-matcher.ts:333`). INVARIANT: the extraction cache MUST be a SEPARATE, write-invalidation-resistant store from the TTL trigger cache. `clearCache()` (`trigger-matcher.ts:583`) fires on EVERY write (`handlers/mutation-hooks.ts:132`, `handlers/chunking-orchestrator.ts:472/584/640`) and the 60s `CACHE_TTL_MS` check (`trigger-matcher.ts:489`) expires the trigger cache — neither may wipe the (path, mtime) extraction entries, or the "warm" path pays the full disk re-read that the 2.3s baseline measures | Warm `memory_match_triggers` p50 < 300ms measured UNDER write/scan churn (saves that fire `clearCache()` interleaved between measured calls), not just a quiescent loop (baseline 2.3s warm / 17s cold); after a `clearCache()` and after a 60s TTL expiry, unchanged (path, mtime) entries still perform zero disk reads on the next cache refresh |
| REQ-004 | Write-side auto-fix merges extracted triggers with user-authored triggers instead of replacing, with case-insensitive dedupe and count cap (report §3 P2 highlights; ledger Agent G P2; `memory-save.ts:537`) | Re-saving a doc with user-authored triggers preserves them in the index; merged list is deduped case-insensitively and capped; regression test asserts user phrases survive auto-fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | specFolder prefix matching in `memory_match_triggers` consistent with every other read surface, using the shared path-segment-aware idiom `folder === specFolder \|\| folder.startsWith(specFolder + '/')` (as in `hybrid-search.ts:571`, `memory-search.ts:1334`, `retrieval-rescue.ts:366`), or the `specFolderLikePattern()` `<folder>/%` helper (`vector-index-types.ts:34`) for the SQL lane, replacing the exact-match `row.spec_folder !== specFolder` at `memory-triggers.ts:450` and `:269`. The trailing `/` separator is REQUIRED so path-segment awareness holds: scope "028-foo" must NOT match sibling "028-foobar" (report §3 P1 #10; `memory-triggers.ts:449,269`) | Scoped match with a parent packet folder returns phase-child rows ("028-foo" matches "028-foo/005-..."); sibling-prefix "028-foobar" is NOT matched by scope "028-foo"; exact-scope behavior preserved for leaf folders; the documented fail-closed behavior at `memory-triggers.ts:449` (missing/unknown row excluded, scope-error returns empty) is preserved; scope test matrix passes |
| REQ-006 | Archive/deprecated exclusion in the trigger cache loader using the phase 002 shared active-row predicate (ledger L5; DUP MECHANISM section) | Trigger cache contains no archived/deprecated/tombstoned rows once 002 predicate is available; dependency on 002 recorded and checked before implementation |
| REQ-007 | Constitutional hygiene: dedup 70 rows to 20 distinct, purge /tmp sandbox row id 38797, write guard rejects constitutional saves from /tmp or sandbox paths (ledger L5) | Post-migration audit: constitutional tier has exactly the distinct set (20 titles), sandbox row gone; guard test proves a /tmp-sourced constitutional save is rejected with a clear error |
| REQ-008 | Frontmatter trigger parsing handles apostrophes and multi-line YAML phrases (ledger Agent H P2; `memory-parser.ts:820`) | Parser unit tests: phrases with apostrophes and multi-line list items round-trip into the index unchanged |

### P2 - Nice to have (defer with documented reason if cut)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Trigger backfill hardening: failed rows keep failed status behind an attempt cap/backoff; FK cleanup removes phrases for deleted memories (ledger Agent E P2) | Backfill run over a corpus with permanently-failing rows terminates without re-pending them forever; orphaned phrase rows for deleted memories removed |
| REQ-010 | Decide and document constitutional-row visibility to the trigger cache (ledger Agent E refinement: constitutional memories structurally invisible to match_triggers cache) | Decision recorded in implementation-summary.md either way (include with guard, or keep excluded with rationale); behavior matches the documented decision |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Warm `memory_match_triggers` p50 < 300ms measured against the ~33k-row production corpus UNDER write/scan churn — `clearCache()`-firing saves interleaved between the measured calls, NOT a quiescent loop (the 2.3s baseline is the post-invalidation rebuild cost; a quiescent test passes while production stays slow because `clearCache()` fires on every write) (baseline: 2.3s warm / 17s cold, deep-dive report §1).
- **SC-002**: Resume-style prompt trigger matching surfaces active-packet docs; zero z_archive rows reachable via single-word matches (baseline: 5/5 hits from z_archive, ledger L4).
- **SC-003**: Single-word share of stored trigger-phrase occurrences drops materially below the 45% baseline after regeneration, and new saves cannot reintroduce junk (write-side guards + matcher guard both active).
- **SC-004**: Constitutional priming set is 20 distinct rows with no /tmp sandbox row; a guard blocks future sandbox-sourced constitutional writes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 shared active-row predicate | Trigger-cache exclusion (REQ-006) cannot land cleanly without it | Execution order runs 002 before 005; if 005 starts first, mark T008 blocked and land the rest - do NOT hand-roll a duplicate predicate |
| Dependency | Quality-loop extractor output quality | Regeneration (REQ-001) inherits extractor weaknesses | T001 confirm-before-fix samples extractor output on legacy rows before the migration is written |
| Risk | Regeneration touches ~165k phrase occurrences | High - bad batch could destroy trigger recall | Dry-run on DB copy; keep pre-migration phrase snapshot until post-audit passes; batched + resumable with cursor |
| Risk | IDF/min-length guard over-filters legitimate single-token triggers (rare identifiers) | Medium - recall loss on niche prompts | Tune threshold against the live corpus during T006; allowlist for high-IDF single tokens; goldens re-run before/after |
| Risk | Merge-not-replace inflates phrase counts per memory | Low - envelope/index bloat | Case-insensitive dedupe + hard count cap in the same change (REQ-004) |
| Risk | Cache keyed on (path, mtime) misses content changes when mtime is preserved | Low - stale phrases served | Documented limitation; TTL still bounds staleness; content-hash fallback considered in T013 if measured necessary |
| Risk | Extraction cache wiped by `clearCache()` (every write) or the 60s TTL | High - defeats the p50 target; the "warm" 2.3s IS this post-invalidation rebuild | Keep the (path, mtime) extraction cache in a separate store that `clearCache()` (`trigger-matcher.ts:583`) and TTL expiry do NOT clear; gate SC-001 on p50 measured under write churn |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Warm `memory_match_triggers` p50 < 300ms at ~33k index rows (baseline 2.3s warm).
- **NFR-P02**: The (path, mtime) extraction cache survives BOTH `clearCache()` (fired on every write) and the 60s `CACHE_TTL_MS` expiry as a separate write-invalidation-resistant store; trigger cache refresh performs zero disk reads for entries whose (path, mtime) is unchanged; no full-corpus re-read per 60s TTL.

### Security
- **NFR-S01**: Constitutional write guard rejects constitutional-tier saves whose source path matches /tmp or sandbox locations; rejection is explicit, not silent.

### Reliability
- **NFR-R01**: Regeneration and constitutional migrations are idempotent, batched, and resumable; pre-migration phrase data is recoverable until the post-migration audit passes.
- **NFR-R02**: Backfill failure handling terminates: permanently-failing rows respect the attempt cap instead of re-pending forever.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or absent `trigger_phrases` frontmatter: parser returns an empty list, no crash, extractor may propose phrases via auto-fix (merged, not replacing).
- Phrase with apostrophe ("user's trigger") or multi-line YAML item: extracted intact (REQ-008), not silently dropped.
- Stopword-only or sub-min-length query tokens: matcher returns no single-token hits (REQ-002).
- Phrase count over cap after merge: deterministic truncation, user-authored phrases kept preferentially.

### Error Scenarios
- Memory row deleted while its phrases are still indexed: FK cleanup removes orphans (REQ-009); matcher never hydrates a missing row.
- Backfill row failing permanently: attempt cap/backoff parks it as failed instead of re-pending each run.
- Migration interrupted mid-batch: cursor resume continues without double-processing (NFR-R01).

### State Transitions
- Cache entry with unchanged (path, mtime) across TTL expiry: reused without disk read; changed mtime triggers re-extraction for that path only.
- Row transitions to archived/deprecated (via phase 002): drops out of the trigger cache on next load (REQ-006).
- Scoped query with a parent packet folder: prefix semantics return phase-child rows; foreign-folder rows stay excluded; sibling-prefix folders ("028-foobar" under scope "028-foo") stay excluded because the match requires the "028-foo/" segment boundary (REQ-005).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 5 existing files + 1 migration; ~165k data rows touched by migration |
| Risk | 11/25 | Data migration on live trigger corpus; per-message hot path; no auth/API surface changes |
| Research | 7/20 | Findings pre-verified by deep-dive; confirm-before-fix pass still required for agent-reported items |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Constitutional-row visibility to the trigger cache: include (with the junk guard active) or keep excluded and document why (REQ-010 - decide during implementation, record in implementation-summary.md).
- Exact IDF floor and min-length for the single-token guard: tuned against the live corpus in T006; is a small allowlist for rare-but-real single-token triggers needed?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
