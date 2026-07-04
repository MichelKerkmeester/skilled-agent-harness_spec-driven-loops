---
title: "Feature Specification: Phase 2: archived-tier-and-tombstone-read-exclusions"
description: "Deprecated, archived, and tombstoned memory rows leak into every lexical, graph, and injection read channel because tier and deleted_at exclusions are channel-inconsistent. This phase ships one shared active-row predicate across all ten read channels, implements the archived tier end-to-end, and makes soft-delete tombstones actually hide rows."
trigger_phrases:
  - "archived tier exclusion"
  - "tombstone read filter"
  - "deprecated rows ranking"
  - "shared active-row predicate"
  - "z_archive tier migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/002-archived-tier-and-tombstone-read-exclusions"
    last_updated_at: "2026-07-04T17:51:11.002Z"
    last_updated_by: "plan-remediation"
    recent_action: "Remediated REWORK: corrected predicate SQL, fixed FTS/BM25 premise, added logic-sync gate"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-archived-tier-and-tombstone-read-exclusions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: archived-tier-and-tombstone-read-exclusions

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Read exclusion for non-active memory rows is enforced inconsistently across channels today. Three channels already filter deprecated rows, each under a different gate: the vector channel NULL-guards and excludes both deprecated and constitutional (`vector-index-queries.ts:431` default branch), while FTS (`sqlite-fts.ts:186-188`) and BM25/hybrid (`hybrid-search.ts:560-566`) exclude deprecated gated by the graduated `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` flag (default TRUE, so cold/deprecated rows are deliberately admitted and FSRS-ranked low today). The remaining channels — graph injection, the summary-lane no-op stub, community injection, rescue backfill, keyword fallback, and stats/health — consult no exclusion gate at all, so they re-admit rows the gated channels drop (deep-dive-report §2 Chain A step 4, ledger DUP MECHANISM). This phase replaces the divergent per-channel filters with ONE shared active-row predicate that honors the SAME graduated flag consistently, records an explicit logic-sync decision on that flag before adoption (REQ-000/T-004a), implements the `archived` tier end-to-end (a phantom tier today: conceptually referenced by the vector archived-inclusion gate but absent from IMPORTANCE_TIERS/VALID_TIERS), and fixes P0 tombstone visibility (a non-graduated exclusion — tombstones always hide) so deleted rows stop surfacing.

**Key Decisions**: ADR-001 predicate ownership in a single module (NULL-guarded ranked predicate that retains the vector channel's constitutional exclusion and is gated by the graduated cold-inclusion flag, so adoption does not silently reverse that decision); ADR-002 constitutional rows stay separately injected and never enter ranked results; ADR-003 z_archive migration tier-rewrite policy; ADR-004 retro-fix policy for substring-inflated tiers (see `decision-record.md`).

**Critical Dependencies**: Phase 011 (daemon freshness) restores a trusted CLI surface first per program execution order; phase 001's dup-hash collapse consumes this phase's predicate.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 13 |
| **Predecessor** | 001-orphan-sweep-cursor-and-corpus-identity-repair |
| **Successor** | 003-content-hash-normalization-and-save-dedup-lanes |
| **Handoff Criteria** | All P0 REQs verified with evidence; shared predicate live in all ten channels; z_archive and tier-normalization migrations applied with audit rows; phase 001 dup-collapse unblocked (predicate exported); baseline-vs-delta test report attached to implementation-summary.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Deep dive remediation phase children specification.

**Scope Boundary**: Read-path exclusion policy (shared active-row predicate), archived-tier lifecycle, tombstone visibility, tier value hygiene (write normalization, parser substring fix, retro-fix migrations), and the stats/health active-vs-raw count split. No ranking-algorithm changes, no content-hash or save-lane changes, no dup-row collapsing.

**Dependencies**:
- Phase 011 (daemon freshness and health truthfulness) runs first in program execution order (011 → 001 → 002) so CLI/daemon evidence is trustworthy.
- Phase 001 task "collapse dup-hash rows WITH read-exclusion honored" depends on THIS phase's predicate (phase-decomposition §001: "dep: 002 predicate").
- Phase 011 owns the health exclusion-audit `content` column fix (report #24) and the shared stats/health population definitions doc ("memory_stats/health shared population definitions (with 002)").

**Deliverables**:
- Shared active-row predicate module adopted by all ten read channels.
- `archived` tier implemented end-to-end (VALID_TIERS, memory_update, includeArchived).
- Tombstone read exclusion plus edge preservation and bulk-delete idempotency.
- z_archive tier migration (11,086 rows) and substring-tier retro-fix (948-row audit population).
- Active-vs-raw count split in memory_stats and memory_health.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Non-active rows dominate search results because read exclusion is channel-inconsistent. The 7,340 `tier='deprecated'` snapshot rows surface at 0.85 via lexical channels partly by design — the graduated `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` flag (default TRUE) tells FTS/BM25 to admit cold rows and let FSRS rank them low — but the ungated channels (graph injection, summary-lane stub, community, rescue, keyword fallback, stats/health) admit them unconditionally, so exclusion is neither uniform nor governed by one decision. Meanwhile 11,086 z_archive rows (33% of the corpus, including 272 critical and 4,278 important) rank as active because `is_archived=0` on every row, `includeArchived` is hardcoded false, and `archived` is a phantom tier absent from IMPORTANCE_TIERS/VALID_TIERS (report §1 live-state table, ledger L5). Soft-delete tombstones are invisible to every read path, so a deleted memory stays searchable while its graph edges are hard-deleted anyway (report §3 P0 #1, `memory-crud-delete.ts:82-99`). Tier values themselves are unreliable: updates store raw-case tiers that escape case-sensitive predicates (#23, `memory-crud-update.ts:254`) and a bare `[CRITICAL]`/`[IMPORTANT]` substring anywhere in a body sets the tier (`memory-parser.ts:892`), which explains 948 inflated critical rows.

### Purpose
Every read channel applies one shared active-row predicate, so deprecated, archived, and tombstoned rows are absent from all results, deletes actually hide, and tier distributions are sane after migration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ONE shared active-row predicate (`deleted_at IS NULL AND (importance_tier IS NULL OR lower(importance_tier) NOT IN ('deprecated','archived','constitutional'))` for ranked lanes — NULL tier reads as active, constitutional is excluded from ranked results and stays surfaced through its separate injection lane per ADR-002, and the deprecated/archived half is gated by the graduated flag per the REQ-000 logic-sync decision) applied to: vector, FTS, BM25, graph injection (`causal-boost.ts:457,687`), summary lane (`stage1-candidate-gen.ts:167` no-op stub), community members, rescue backfill, trigger cache, keyword fallback, and stats/health counts.
- `archived` tier end-to-end: add to VALID_TIERS, settable via memory_update, exclusion honored in every channel, `includeArchived` param unhardcoded (H refinement, E contract, L5).
- P0 tombstone visibility (#1): `deleted_at` filter in search/triggers/list/stats/dedup; tombstone mode stops hard-deleting edges; bulk-delete re-tombstone idempotency (H P2).
- One-shot z_archive migration: mark 11,086 rows archived and retro-demote their critical/important tiers (ADR-003).
- Tier write normalization (lowercase) at update/save (#23); `[CRITICAL]`/`[IMPORTANT]` substring tier assignment restricted to frontmatter-only (`memory-parser.ts:892`, H P2) plus retro-fix of mislabeled rows (948 critical audit, ADR-004).
- stats-vs-health population note and active-vs-raw split (H P2, L1).

### Out of Scope
- Dup-hash row collapse and orphan sweep - owned by phase 001 (consumes this phase's predicate).
- Content-hash normalization and save/dedup lanes - owned by phase 003.
- Health exclusion-audit `content` column fix (#24) and the shared population definitions doc - owned by phase 011; this phase only implements the count split on its own surfaces.
- Constitutional row dedup (70 rows to 20) and trigger-cache constitutional visibility - owned by phase 005.
- Ranking weight or fusion changes - owned by phases 006/007.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/active-row-predicate.ts` | Create | New single-owner predicate module: SQL fragment + row filter + includeArchived/constitutional escape hatches (ADR-001) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modify | Adopt predicate in vector channel (today at :431 the default branch already NULL-guards and excludes both deprecated and constitutional, with a vector-specific `isArchivedVectorInclusionEnabled()` override) and keyword fallback (:875, projection-joined dedup only, no tier/tombstone predicate) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | Modify | Adopt predicate in FTS channel; honor includeArchived param |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Adopt predicate in BM25 lane and result assembly |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Modify | Graph injection tier/tombstone filter at :457 and :687 (today: no tier filter) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Replace no-op archive filter stub at :167 with predicate |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/community-detection.ts` | Modify | Community member injection: existence + predicate check before inject |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` | Modify | Rescue backfill honors predicate (today: bypasses tier/context/quality gates at :388) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts` | Modify | Trigger cache loader excludes archived/deprecated/tombstoned rows |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts` | Modify | Active-vs-raw count split with explicit population note |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Same split; align populations with stats (definitions doc owned by 011) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Modify | Tombstone mode stops hard-deleting edges (:82-99); bulk delete adds `deleted_at IS NULL` idempotency filter |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modify | Store normalized lowercase tier (:254); allow `archived` as settable tier |
| `.opencode/skills/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts` | Modify | Add an `archived` entry to IMPORTANCE_TIERS (value 0.2, searchBoost 0.0, decay false, autoExpireDays null) and to the `ImportanceTier` union (:20,:32) so VALID_TIERS derives it (`Object.keys(IMPORTANCE_TIERS)` at :80); repurpose the existing canonical `getSearchableTiersFilter()` (:148, zero production callers) into the guarded active-tier clause the predicate module consumes |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | `[CONSTITUTIONAL]`/`[CRITICAL]`/`[IMPORTANT]` body-substring tier assignment removed; tier derives from frontmatter only (:892,:895,:898) — `[CONSTITUTIONAL]` (:892) is included because it grants the highest-privilege always-surface tier and is the most dangerous substring-inflation path |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | New migrations: z_archive archived rewrite + tier-case normalization + substring-tier retro-fix, each writing a tier audit trail |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-000 | LOGIC-SYNC (confirm-before-fix, gates REQ-001): re-read the channels that ALREADY filter deprecated (`sqlite-fts.ts:186-188`, `hybrid-search.ts:560-566`) and the graduated flag `isArchivedRetrievalIncludedByDefault()` (`search-flags.ts:834`, default TRUE by design) and record an EXPLICIT decision — keep the graduated cold-inclusion flag governing deprecated/archived across all channels, or move to unconditional hard exclusion — BEFORE the shared predicate is adopted, so adoption does not silently reverse a deliberate graduated decision (SYSTEMIC #2; logic-sync protocol) | Decision + file:line evidence recorded in tasks.md T-004a; the predicate's cold-inclusion default matches the recorded decision and no channel diverges from it |
| REQ-001 | One shared active-row predicate module — `deleted_at IS NULL AND (importance_tier IS NULL OR lower(importance_tier) NOT IN ('deprecated','archived','constitutional'))` for ranked lanes, with the deprecated/archived half gated by the graduated flag per REQ-000 — applied to all ten read channels: vector, FTS, BM25, graph injection (`causal-boost.ts:457,687`), summary lane (`stage1-candidate-gen.ts:167`), community members, rescue backfill, trigger cache, keyword fallback, stats/health counts (Chain A step 4; ledger DUP MECHANISM; L5) | `rg -n "activeRowPredicate|ACTIVE_ROW" mcp_server` shows all ten call sites importing the one module; per-channel adversarial test proves tombstoned rows are excluded everywhere, constitutional never enters ranked results, NULL-tier rows stay active, and deprecated/archived exclusion is uniform and consistent with the REQ-000 decision |
| REQ-002 | Tombstone visibility fixed: `deleted_at` exclusion enforced in search, triggers, list, stats, and dedup read paths (report §3 P0 #1; `memory-crud-delete.ts:82-99`; agent H) | With tombstone flag on, a soft-deleted row returns in zero channels; regression test per channel |
| REQ-003 | Tombstone mode stops hard-deleting causal edges so restore keeps the graph (P0 #1: "edges hard-deleted anyway") | Soft delete then restore preserves edge count; test asserts edges survive tombstone and reappear on restore |
| REQ-004 | `archived` tier implemented end-to-end: added to IMPORTANCE_TIERS with a defined ranking weight and decay (value 0.2, searchBoost 0.0, decay false, autoExpireDays null) and to the `ImportanceTier` union so VALID_TIERS derives it (`importance-tiers.ts:20,32,80`), settable via memory_update, excluded by default in every channel, `includeArchived` no longer hardcoded false (H refinement; E contract; L5) | `memory_update` accepts tier `archived`; VALID_TIERS includes `archived`; search with `includeArchived: true` returns archived rows, default search returns none |
| REQ-005 | One-shot migration marks the 11,086 z_archive rows archived and retro-demotes their 272 critical / 4,278 important tiers, writing prior tier to an audit trail (L5; report §1; ADR-003) | Post-migration SQL: 0 z_archive rows with tier critical/important; audit rows equal rewritten-row count; rollback script restores from audit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Bulk tombstone delete is idempotent: re-runs skip already-tombstoned rows via `deleted_at IS NULL` filter (H P2: "bulk tombstone delete re-deletes same rows every run") | Running bulk delete twice reports 0 rows affected on the second run |
| REQ-007 | Tier writes normalize to lowercase at update and save so 'Deprecated' cannot escape case-sensitive predicates or the unique-index partition (#23; `memory-crud-update.ts:254`) | Update with 'Deprecated'/'CRITICAL' stores 'deprecated'/'critical'; case-variant probe rows all match predicate |
| REQ-008 | `[CRITICAL]`/`[IMPORTANT]` substring in body no longer sets tier; tier derives from frontmatter only (`memory-parser.ts:892`; H P2) | Parsing a doc quoting "[CRITICAL]" in a code sample yields tier from frontmatter (or default), not critical |
| REQ-009 | Retro-fix migration recomputes tier from frontmatter for the substring-inflated population (948 critical audit rows; 272 overlap resolved by REQ-005 first) per ADR-004 | Post-migration audit query shows 0 rows whose critical tier is attributable to body-substring only; prior tiers logged |
| REQ-010 | memory_stats and memory_health report an explicit active-vs-raw split with matching population definitions on this phase's surfaces (L1: surfaces disagree by 7,369 rows; H P2) | stats.active + stats.excluded(deprecated/archived/tombstoned) = health.raw total; both payloads carry a population note |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Exclusion is uniform and governed by one decision. Tombstoned rows are absent from all ten channels and constitutional rows never enter ranked results (both non-graduated). For deprecated/archived rows behavior follows the recorded REQ-000 logic-sync decision: under hard exclusion (`SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false`) the live reproduction query "packet 028 memory search intelligence status" (report §1) returns no `deprecated`/`archived` row in any slot from any channel; under the graduated default they are admitted-and-ranked-cold identically across all ten channels with no channel silently diverging.
- **SC-002**: Delete actually hides: soft-deleted row invisible to search, triggers, list, stats, and dedup while edges survive for restore.
- **SC-003**: Tier distributions sane post-migration: 0 critical/important rows under z_archive; critical population explained by frontmatter, not substring inflation.
- **SC-004**: stats and health totals reconcile exactly under the documented active-vs-raw definitions (baseline disagreement: 7,369 rows).
- **SC-005**: No regressions: full vitest gate re-run matches the pre-change baseline except tests changed intentionally, with the delta reported (baseline-before-delta rule).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011 daemon/CLI trust | Evidence commands unreliable if dist-freshness deadlock recurs | Run 011 first per program order; use `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` bypass only for read-only probes |
| Dependency | Phase 001 dup-collapse consumes this predicate | 001 blocked if predicate export is late | Land predicate module (T-007) before channel adoption tasks; notify 001 owner at merge |
| Risk | Predicate over-excludes live rows (constitutional, NULL-tier, legacy rows) | High | Adversarial row-state matrix per channel; constitutional escape per ADR-002; NULL-tier treated as active |
| Risk | z_archive migration mis-demotes genuinely critical rows | Medium | Tier audit trail with prior values; rollback script; 272-row critical subset reviewed via sample before enforce |
| Risk | Rescue backfill returns empty after exclusion on archive-heavy queries | Medium | Rescue keeps its lexical floor over the ACTIVE population; A/B spot-check on the L4 z_archive trigger queries |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Warm `memory_search` p50 stays within +10% of the captured baseline (2.0-2.9s today per report §4); the predicate touches indexed columns only.
- **NFR-P02**: Migrations run one-shot in bounded batches (<=1,000 rows per transaction) so the daemon stays responsive.

### Security
- **NFR-S01**: Tombstoned row content never leaves the DB through any channel payload, including rescue hydration and trigger-cache snippets.

### Reliability
- **NFR-R01**: Every tier-rewriting migration writes an audit row (id, prior tier, new tier, reason) before mutation; rollback restores from audit exactly.
- **NFR-R02**: Predicate module is pure (no DB handle state) so all ten channels share identical semantics under DB rebind.

---

## 8. EDGE CASES

### Data Boundaries
- NULL or empty `importance_tier`: treated as active — the predicate's `importance_tier IS NULL OR ...` guard keeps legacy NULL-tier rows surfacing (matching the live convention at `vector-index-queries.ts:431` and `sqlite-fts.ts:188`; an unguarded `NOT IN` would drop NULL-tier rows via SQL three-valued logic). The ranked predicate excludes only explicit deprecated/archived/constitutional.
- Mixed-case stored tiers ('Deprecated', 'CRITICAL'): normalization migration rewrites them; predicate compares on normalized values until then.
- `deleted_at` legacy zero/NULL values: only a real tombstone timestamp excludes; 0 and NULL both read as live.

### Error Scenarios
- Constitutional row that is tombstoned: separate injection lane MUST still honor `deleted_at` (ADR-002).
- Row both archived and tombstoned: excluded everywhere; restore returns it to archived, not active.
- Re-save over a tombstoned path: out of scope here (phase 003 resurrect lane) but the predicate must not mask the dedup match semantics 003 relies on; documented in the predicate module contract.
- Rescue/community/graph injection candidate lists empty after exclusion: channels degrade to their normal empty-result behavior, no fallback to unfiltered reads.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 16, LOC: ~500, Systems: search pipeline + CRUD + migrations |
| Risk | 17/25 | Breaking: read-path policy for all channels; data migration on 11k+ rows |
| Research | 10/20 | Findings pre-verified in deep-dive report; 🟡 items need confirm-before-fix |
| Multi-Agent | 5/15 | Single implementer; direct execution |
| Coordination | 12/15 | Dependencies on phases 001, 003, 005, 011 boundaries |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Shared predicate regression hides live rows corpus-wide | H | M | Row-state x channel adversarial matrix (T-021); baseline-before-delta gate; NULL-tier active rule |
| R-002 | Migration demotes rows a user genuinely marked critical inside z_archive | M | M | Audit trail + rollback script (NFR-R01); sample review of the 272 critical rows before enforce |
| R-003 | Stopping edge hard-deletes changes delete contract for existing callers | M | L | Consumer inventory rg over delete handler callers; behavior only changes in tombstone mode |
| R-004 | Ten call-site adoption leaves an eleventh ad-hoc filter undiscovered | M | M | Same-class producer inventory rg (plan FIX ADDENDUM) must return only the shared module before completion |

---

## 11. USER STORIES

### US-001: Clean search results (Priority: P0)

**As a** memory-search user, **I want** deprecated and archived snapshots excluded from every channel, **so that** top-K slots stop stacking stale copies of one document.

**Acceptance Criteria**:
1. **Given** the live corpus with 7,340 deprecated rows and the hard-exclusion decision in effect (`SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false` per REQ-000), **When** I run the report §1 reproduction query, **Then** no deprecated row appears in any result slot from any channel; under the graduated default, deprecated rows appear uniformly ranked-cold across channels rather than clustered in the ungated ones.
2. **Given** an archived z_archive row matching my query lexically, **When** I search without `includeArchived`, **Then** the row is absent; **When** I pass `includeArchived: true`, **Then** it may return.

### US-002: Delete means gone (Priority: P0)

**As a** memory maintainer, **I want** soft-deleted rows invisible to all read paths with their edges preserved, **so that** delete is trustworthy and restore is lossless.

**Acceptance Criteria**:
1. **Given** a tombstoned memory, **When** I search, match triggers, list, or read stats, **Then** the row is not visible in any payload.
2. **Given** a tombstoned memory with causal edges, **When** I restore it, **Then** its edges are intact (no hard-delete happened at tombstone time).
3. **Given** an already-tombstoned row set, **When** bulk delete re-runs, **Then** zero rows are re-affected (idempotent).

### US-003: Trustworthy tiers (Priority: P1)

**As a** corpus operator, **I want** tier values normalized and derived from frontmatter only, **so that** ranking boosts and exclusion predicates act on honest data.

**Acceptance Criteria**:
1. **Given** a doc whose body quotes "[CRITICAL]" in a log sample, **When** it is parsed and saved, **Then** its tier comes from frontmatter, not the substring.
2. **Given** the 948-row substring-inflated critical audit population, **When** the retro-fix migration runs, **Then** each row's tier is recomputed from frontmatter with the prior tier logged.

---

## 12. OPEN QUESTIONS

- Retention window for the tier-migration audit trail (default: keep permanently; revisit in phase 009 ledger-retention sweeps if size matters).
- Whether the legacy `is_archived` column is dropped after the tier becomes authoritative (default: keep as derived mirror this phase; removal decision deferred to phase 013 closeout).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Evidence Sources**: `../research/deep-dive-report.md` (§1 live state, §2 Chain A, §3 P0 #1 and P1 #23/#24), `../research/findings-ledger.md` (L1, L5, DUP MECHANISM, Agent H), `../research/phase-decomposition.md` (§002)

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
