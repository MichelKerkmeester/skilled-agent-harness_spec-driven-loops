---
title: "Tasks: Phase 2: archived-tier-and-tombstone-read-exclusions"
description: "Task breakdown: confirm-before-fix verification of 🟡 findings first, baseline capture, then shared active-row predicate, channel adoption, tombstone and tier lifecycle fixes, audited migrations, and verification."
trigger_phrases:
  - "archived tier exclusion"
  - "tombstone read filter"
  - "deprecated rows ranking"
  - "active row predicate tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/002-archived-tier-and-tombstone-read-exclusions"
    last_updated_at: "2026-07-04T14:25:43.046Z"
    last_updated_by: "plan-remediation"
    recent_action: "Remediated REWORK: added T-004a logic-sync, fixed T-007 predicate, tier config, [CONST] fix"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-archived-tier-and-tombstone-read-exclusions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: archived-tier-and-tombstone-read-exclusions

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T-0NN [P?] Description (file path) — refs: <report/ledger finding ids>`

Every task carries a metadata comment: `<!-- agent: direct | deps: [...] | touched-files: [...] -->`. Finding refs use deep-dive-report §3 numbering (#N), ledger tags (L#, agent letters), and phase-decomposition §002 lines. Refs live HERE, never in code comments (comment-hygiene HARD BLOCK).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

🟡 confirm-before-fix group FIRST (finding-is-a-hypothesis): each task re-reads the cited code and either confirms the finding with a quoted line or downgrades it with evidence, then T-006 captures the baseline. No production edits in this phase.

- [ ] T-001 [P] Confirm tombstone invisibility: verify no `deleted_at` filter exists in search/triggers/list/stats/dedup read paths, and that edges are hard-deleted in tombstone mode (handlers/memory-crud-delete.ts:82-99) — refs: report §3 P0 #1 🟡, ledger Agent H P0
  <!-- agent: direct | deps: [] | touched-files: [] -->
- [ ] T-002 [P] Confirm tier raw-case store: validation lowercases for the check but stores raw input (handlers/memory-crud-update.ts:254), so 'Deprecated' escapes case-sensitive predicates — refs: report §3 P1 #23 🟡, ledger Agent H P1
  <!-- agent: direct | deps: [] | touched-files: [] -->
- [ ] T-003 [P] Confirm substring tier inflation: bare `[CRITICAL]`/`[IMPORTANT]` anywhere in body sets tier (lib/parsing/memory-parser.ts:892); reconcile the 948-critical audit population via SQL — refs: report §3 P2 highlights 🟢(data)/🟡(code), ledger Agent H P2
  <!-- agent: direct | deps: [] | touched-files: [] -->
- [ ] T-004 [P] Confirm channel filter gaps: graph injection has no tier/tombstone filter (lib/search/causal-boost.ts:457,687), summary-lane archive filter is a no-op stub (lib/search/pipeline/stage1-candidate-gen.ts:167), rescue backfill bypasses gates (lib/search/rerank/retrieval-rescue.ts:388), community injection has no existence/tier check (lib/graph/community-detection.ts) — refs: Chain A step 4 🟢, #7 🟡, ledger DUP MECHANISM, Agent C P2, Agent D P2
  <!-- agent: direct | deps: [] | touched-files: [] -->
- [ ] T-004a [LOGIC-SYNC] Re-read the channels that ALREADY filter deprecated and the graduated flag, then record an EXPLICIT decision BEFORE adopting the predicate: sqlite-fts.ts:186-188 (`deprecatedTierFilter`, gated by `includeCold` at :173), hybrid-search.ts:560-566 (JS drop gated by `excludeCold`), search-flags.ts:834 `isArchivedRetrievalIncludedByDefault` (returns `isFeatureEnabled('SPECKIT_INCLUDE_ARCHIVED_DEFAULT')`, default TRUE / graduated). Decide KEEP the graduated cold-inclusion flag (deprecated/archived admitted, FSRS-ranked low) vs MOVE to unconditional hard exclusion; the predicate's cold-inclusion default (T-007) MUST match the recorded decision so adoption never silently reverses the graduation. If moving to hard exclusion, escalate the reversal for operator sign-off (logic-sync protocol) — refs: SYSTEMIC #2, report §2, ledger DUP MECHANISM
  <!-- agent: direct | deps: [T-004] | touched-files: [] -->
- [ ] T-005 [P] Confirm archived-tier phantom state: 'archived' is absent from the `ImportanceTier` union and IMPORTANCE_TIERS (lib/scoring/importance-tiers.ts:20,32) so VALID_TIERS (`Object.keys(IMPORTANCE_TIERS)` :80) cannot contain it; only the vector `isArchivedVectorInclusionEnabled()` gate references archived conceptually; `includeArchived` hardcoded false; `is_archived=0` on all 33,101 rows — refs: ledger L5 🟢, Agent H refinement, Agent E contract
  <!-- agent: direct | deps: [] | touched-files: [] -->
- [ ] T-006 Baseline capture BEFORE any change: full vitest run (pass/fail counts), SQL population counts (deprecated=7,340 expected, z_archive=11,086 incl. 272 critical/4,278 important, dup-audit critical=948, tombstoned=0), warm memory_search + match_triggers latency, report §1 reproduction query outputs; save under scratch/baseline/ — refs: report §1 🟢, CLAUDE.md baseline-before-delta rule
  <!-- agent: direct | deps: [T-001, T-002, T-003, T-004, T-005] | touched-files: [scratch/baseline/] -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-007 Create shared active-row predicate module encoding `deleted_at IS NULL AND (importance_tier IS NULL OR lower(importance_tier) NOT IN ('deprecated','archived','constitutional'))` for ranked lanes: `ACTIVE_ROW_SQL(alias, opts)` + `isActiveRow(row, opts)` with `{ includeArchived, includeCold, lane }`, `includeCold` defaulting from the graduated flag per the T-004a decision; source the tier list from the repurposed canonical `getSearchableTiersFilter()` (importance-tiers.ts:148) rather than a new fork; unit tests for all option/row-state combos incl. NULL tier, constitutional lane, includeArchived widening (lib/search/active-row-predicate.ts) — refs: phase-decomposition §002 predicate line, ADR-001/ADR-002, SYSTEMIC #2
  <!-- agent: direct | deps: [T-006, T-004a] | touched-files: [mcp_server/lib/search/active-row-predicate.ts, mcp_server/tests/unit/active-row-predicate.vitest.ts] -->
- [ ] T-008 Adopt predicate in vector channel and keyword fallback, replacing the local deprecated-only filter (lib/search/vector-index-queries.ts:431, :875) — refs: Chain A step 4, ledger Agent F OPT-P1 (keyword path)
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/lib/search/vector-index-queries.ts] -->
- [ ] T-009 Adopt predicate in FTS and BM25 lanes; honor `includeArchived` param end-to-end (lib/search/sqlite-fts.ts, lib/search/hybrid-search.ts) — refs: ledger DUP MECHANISM (deprecated at 0.85 via lexical), L5
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/lib/search/sqlite-fts.ts, mcp_server/lib/search/hybrid-search.ts] -->
- [ ] T-010 Adopt predicate in graph injection at both injection points (lib/search/causal-boost.ts:457,687) — refs: Chain A step 4, ledger Agent C P2 (deprecated re-enter via graph)
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/lib/search/causal-boost.ts] -->
- [ ] T-011 Replace summary-lane no-op archive filter stub with predicate (lib/search/pipeline/stage1-candidate-gen.ts:167) — refs: Chain A step 4 (literal no-op stub)
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/lib/search/pipeline/stage1-candidate-gen.ts] -->
- [ ] T-012 Community member injection: existence check + predicate before inject (lib/graph/community-detection.ts) — refs: ledger Agent D P2 (phantom injected ids), phase-decomposition §002
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/lib/graph/community-detection.ts] -->
- [ ] T-013 Rescue backfill honors predicate: LIKE scan and hydration restricted to active rows (lib/search/rerank/retrieval-rescue.ts:388) — refs: report §3 P1 #7 🟡
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/lib/search/rerank/retrieval-rescue.ts] -->
- [ ] T-014 Trigger cache loader excludes archived/deprecated/tombstoned rows via predicate (lib/parsing/trigger-matcher.ts, handlers/memory-triggers.ts) — refs: ledger L4 🟢 (z_archive rows via single-word triggers), phase-decomposition §005 matcher note (uses 002 predicate)
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/lib/parsing/trigger-matcher.ts, mcp_server/handlers/memory-triggers.ts] -->
- [ ] T-015 stats/health active-vs-raw split: both handlers compute raw and predicate-filtered counts from shared definitions and carry a population note (handlers/memory-crud-stats.ts, handlers/memory-crud-health.ts) — refs: ledger L1 🟢 (7,369-row disagreement), Agent H P2; definitions doc owned by phase 011
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/handlers/memory-crud-stats.ts, mcp_server/handlers/memory-crud-health.ts] -->
- [ ] T-016 Tombstone lifecycle fixes: `deleted_at` exclusion in all read paths via predicate adoption; STOP hard-deleting edges in tombstone mode; bulk delete adds `deleted_at IS NULL` idempotency filter (handlers/memory-crud-delete.ts:82-99) — refs: report §3 P0 #1 🟡, ledger Agent H P0 + P2 (bulk re-delete)
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/handlers/memory-crud-delete.ts] -->
- [ ] T-017 Archived tier end-to-end: add an `archived` entry to IMPORTANCE_TIERS (value 0.2, searchBoost 0.0, decay false, autoExpireDays null) and to the `ImportanceTier` union so VALID_TIERS derives it (lib/scoring/importance-tiers.ts:20,32,80); settable via memory_update; unhardcode `includeArchived` param through the search surface (lib/search/search-utils.ts, lib/storage/ports/vector-store.ts) — refs: ledger L5 🟢, Agent H refinement, Agent E contract
  <!-- agent: direct | deps: [T-007] | touched-files: [mcp_server/lib/scoring/importance-tiers.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/lib/search/search-utils.ts, mcp_server/lib/storage/ports/vector-store.ts] -->
- [ ] T-018 z_archive migration: mark 11,086 z_archive rows `archived`, retro-demote their 272 critical / 4,278 important tiers, set `is_archived=1`, write prior tier to `memory_tier_migration_audit`; ship rollback script (lib/search/vector-index-schema.ts) — refs: ledger L5 🟢, report §1, ADR-003
  <!-- agent: direct | deps: [T-017] | touched-files: [mcp_server/lib/search/vector-index-schema.ts] -->
- [ ] T-019 Tier write normalization: store lowercase at update/save; case-normalization migration rewrites existing mixed-case tier rows with audit (handlers/memory-crud-update.ts:254, lib/search/vector-index-schema.ts) — refs: report §3 P1 #23 🟡
  <!-- agent: direct | deps: [T-002] | touched-files: [mcp_server/handlers/memory-crud-update.ts, mcp_server/lib/search/vector-index-schema.ts] -->
- [ ] T-020 Parser substring tier fix + retro-fix migration: remove the `[CONSTITUTIONAL]`/`[CRITICAL]`/`[IMPORTANT]` body-substring tier assignment (lib/parsing/memory-parser.ts:892,895,898) so tier derives from frontmatter only — `[CONSTITUTIONAL]` (:892) is included because it grants the highest-privilege always-surface tier; migration recomputes tier for the 948-row critical/important substring-inflated population (272 z_archive overlap resolved by T-018 first) with audit; existing substring-inflated constitutional rows are healed together with phase 005's constitutional dedup to avoid double-touching those rows (lib/search/vector-index-schema.ts) — refs: ledger Agent H P2 🟢(data), ADR-004
  <!-- agent: direct | deps: [T-003, T-018] | touched-files: [mcp_server/lib/parsing/memory-parser.ts, mcp_server/lib/search/vector-index-schema.ts] -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-021 Adversarial matrix: channel (10) x row-state (active, deprecated, archived, tombstoned, mixed-case tier, NULL tier, constitutional, archived+tombstoned) on a seeded test DB; one regression test per fixed bypass — refs: plan FIX ADDENDUM matrix axes, CHK-FIX-004
  <!-- agent: direct | deps: [T-008, T-009, T-010, T-011, T-012, T-013, T-014, T-015, T-016, T-017, T-018, T-019, T-020] | touched-files: [mcp_server/tests/] -->
- [ ] T-022 Re-run the WHOLE vitest gate; report delta vs T-006 baseline (pass/fail counts, intentional changes listed) — refs: baseline-before-delta rule, SC-005
  <!-- agent: direct | deps: [T-021] | touched-files: [scratch/baseline/] -->
- [ ] T-023 Live probes: report §1 reproduction queries return 0 deprecated/archived rows; stats-vs-health reconciliation SQL balances (active + excluded = raw); match_triggers resume-prompt probe returns 0 archived rows — refs: SC-001, SC-004, ledger L1/L4/L5
  <!-- agent: direct | deps: [T-022] | touched-files: [scratch/baseline/] -->
- [ ] T-024 Docs closed: checklist.md evidence filled, implementation-summary.md written, `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exit 0 — refs: completion verification rule
  <!-- agent: direct | deps: [T-023] | touched-files: [spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md] -->
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] SC-001..SC-005 evidenced (spec.md §5); every 🟡 finding either confirmed-and-fixed or downgraded with evidence
- [ ] Baseline-vs-delta report saved and cited in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-000 logic-sync maps to T-004a; REQ-001..REQ-010 map to T-007..T-020)
- **Plan**: See `plan.md` (FIX ADDENDUM surface table; AI execution protocol)
- **Decisions**: See `decision-record.md` (ADR-001..ADR-004)
- **Evidence sources**: `../research/deep-dive-report.md`, `../research/findings-ledger.md`, `../research/phase-decomposition.md` §002
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
