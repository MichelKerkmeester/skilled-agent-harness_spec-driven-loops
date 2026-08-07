---
title: "Implementation Plan: Phase 2: archived-tier-and-tombstone-read-exclusions"
description: "Implements one shared active-row predicate module and adopts it in all ten read channels, then layers the archived-tier lifecycle, tombstone visibility fixes, tier hygiene migrations, and the stats/health active-vs-raw split on top."
trigger_phrases:
  - "archived tier exclusion"
  - "tombstone read filter"
  - "deprecated rows ranking"
  - "active row predicate plan"
  - "tier hygiene migration plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/002-archived-tier-and-tombstone-read-exclusions"
    last_updated_at: "2026-07-04T17:51:11.002Z"
    last_updated_by: "plan-remediation"
    recent_action: "Remediated REWORK: fixed predicate fragment, corrected FIX ADDENDUM rows, added T-004a task"
    next_safe_action: "Run T-001..T-004a confirm + logic-sync decision, then T-006 baseline before code changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-archived-tier-and-tombstone-read-exclusions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: archived-tier-and-tombstone-read-exclusions

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node 20+, ESM), compiled via tsc to mcp_server/dist |
| **Framework** | MCP server (mk-spec-memory daemon) + spec-memory.cjs CLI front door |
| **Storage** | SQLite (better-sqlite3) + sqlite-vec shards; FTS5; migrations in vector-index-schema.ts |
| **Testing** | vitest (mcp_server/tests), live CLI probes against the production DB (read-only) |

### Overview
Build one pure predicate module (`active-row-predicate.ts`) that encodes the active-row contract (`deleted_at IS NULL AND (importance_tier IS NULL OR lower(importance_tier) NOT IN ('deprecated','archived','constitutional'))` for ranked lanes — NULL tier is active, constitutional is excluded from ranked results and injected separately per ADR-002, and the deprecated/archived half is gated by the graduated `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` flag per the T-004a logic-sync decision) and adopt it at all ten read call sites, replacing the divergent per-channel filters (three gated differently today, the rest ungated). Then land the lifecycle fixes that make the predicate's inputs honest: archived tier added to IMPORTANCE_TIERS/VALID_TIERS and memory_update, includeArchived unhardcoded, tombstone read exclusion with edge preservation, tier write normalization, parser frontmatter-only tiers, and three audited migrations (z_archive rewrite, tier-case normalization, substring-tier retro-fix).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3, from deep-dive-report §1/§2/§3 and ledger L5)
- [x] Success criteria measurable (spec.md §5; SQL count probes + reproduction queries)
- [x] Dependencies identified (phases 011/001/003/005 boundaries; spec.md §6)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-010 with per-REQ evidence)
- [ ] Tests passing: full vitest gate re-run vs captured baseline, delta reported
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record synchronized; implementation-summary.md written)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-owner policy module with call-site adoption (no framework change). The predicate is one exported SQL fragment plus one row-level filter function; channels compose it into their existing queries.

### Key Components
- **active-row-predicate.ts (new)**: Owns the exclusion contract; exports `ACTIVE_ROW_SQL(alias, opts)`, `isActiveRow(row, opts)`, and options `{ includeArchived, includeCold, lane: 'ranked' | 'constitutional' }` where `includeCold` defaults from the graduated flag per ADR-001/ADR-002. The tier list is sourced from the repurposed canonical `getSearchableTiersFilter()` in importance-tiers.ts, not a second fork.
- **Channel call sites (10)**: vector, FTS, BM25, graph injection, summary lane, community, rescue backfill, trigger cache, keyword fallback, stats/health; each swaps its local filter (or absence of one) for the shared module.
- **Lifecycle writers**: memory-crud-delete.ts (tombstone semantics), memory-crud-update.ts (tier normalization + archived settable), memory-parser.ts (frontmatter-only tier), importance-tiers.ts (VALID_TIERS).
- **Migrations (vector-index-schema.ts)**: z_archive archived rewrite, tier-case normalization, substring-tier retro-fix; all writing a `memory_tier_migration_audit` trail per NFR-R01.

### Data Flow
Query/scan enters a channel, the channel's SQL embeds `ACTIVE_ROW_SQL` (or filters hydrated rows through `isActiveRow`), constitutional rows enter through their dedicated injection lane which honors only the tombstone half of the predicate, and stats/health compute both raw counts and predicate-filtered active counts from the same definitions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/vector-index-queries.ts:431` (vector) | Default branch already NULL-guards and excludes deprecated + constitutional; a vector-specific `isArchivedVectorInclusionEnabled()` override admits cold rows | update: swap local filter for the shared predicate, preserving the constitutional exclusion and NULL guard | `rg -n "NOT IN .'deprecated" mcp_server/lib/search/vector-index-queries.ts` shows the literal replaced by the shared helper |
| `lib/search/vector-index-queries.ts:875` (keyword fallback) | Joins `active_memory_projection` (one-active-per-logical-key dedup) but applies no tier/tombstone predicate | update: add the shared predicate on top of the projection join | channel adversarial test row-state matrix |
| `lib/search/sqlite-fts.ts:186-188` (FTS) | Already NULL-guards and excludes deprecated via `deprecatedTierFilter`, gated by `includeCold = includeArchived \|\| isArchivedRetrievalIncludedByDefault()` (:173); admits cold rows by default under the graduated flag | update: adopt the shared predicate honoring the same flag; extend to archived + constitutional-consistent exclusion | live reproduction query matches the recorded REQ-000 flag decision |
| `lib/search/hybrid-search.ts:560-566` (BM25 lane) | Already drops `importanceTier==='deprecated'` JS-side, gated by `excludeCold = !isArchivedRetrievalIncludedByDefault()`; admits cold rows by default under the graduated flag | update: replace the ad-hoc JS drop with `isActiveRow` honoring the same flag; add archived | adversarial test + `rg -n "importanceTier === 'deprecated'" mcp_server/lib/search/hybrid-search.ts` returns nothing post-change |
| `lib/search/causal-boost.ts:457,687` (graph injection) | No tier/parent filter; deprecated re-enter via graph (agent C P2) | update: predicate on injected neighbor rows | test: deprecated neighbor never injected |
| `lib/search/pipeline/stage1-candidate-gen.ts:167` (summary lane) | Archive filter is a literal no-op stub (Chain A step 4) | update: replace stub with predicate | test asserts stub replaced; grep for stub marker gone |
| `lib/graph/community-detection.ts` (community members) | Injects member ids with no existence/tier check (agent D P2) | update: predicate + existence check before inject | test: archived/deleted member never injected |
| `lib/search/rerank/retrieval-rescue.ts:388` (rescue backfill) | Bypasses tier/context/quality/expiry gates, default ON (#7) | update: rescue scans and hydrates ACTIVE rows only | test: rescue never resurrects excluded rows |
| `lib/parsing/trigger-matcher.ts` + `handlers/memory-triggers.ts` (trigger cache) | z_archive rows hit via single-word triggers (L4) | update: cache loader applies predicate | match_triggers probe on resume-style prompt returns 0 archived rows |
| `handlers/memory-crud-stats.ts` + `handlers/memory-crud-health.ts` | Disagree by 7,369 rows; silent population mismatch (L1) | update: active-vs-raw split, shared definitions | SQL reconciliation: active + excluded = raw on both surfaces |
| `handlers/memory-crud-delete.ts:82-99` (tombstone writer) | Soft delete invisible to no read path; edges hard-deleted (#1) | update: stop edge hard-delete in tombstone mode; bulk idempotency filter | restore-preserves-edges test; double-run bulk delete affects 0 rows |
| `handlers/memory-crud-update.ts:254` + `lib/scoring/importance-tiers.ts` (tier writers) | Raw-case store escapes predicates (#23); archived absent from the `ImportanceTier` union / IMPORTANCE_TIERS so it cannot be settable or in VALID_TIERS | update: normalize lowercase; add an `archived` IMPORTANCE_TIERS entry (value 0.2 / searchBoost 0.0 / decay false / autoExpireDays null) + union member so VALID_TIERS derives it (`Object.keys(IMPORTANCE_TIERS)` :80) | case-variant write test; memory_update tier=archived accepted; VALID_TIERS includes archived |
| `lib/parsing/memory-parser.ts:892` (tier producer) | Body substring sets tier (948 inflated rows) | update: frontmatter-only tier | parser table test incl. quoted-log adversarial case |
| `lib/search/vector-index-schema.ts` (migrations) | Owns migration registry (v28 retire pattern) | update: add 3 audited migrations | migration up/down test on fixture DB; audit rows count = rewritten rows |
| PE-gate/save dedup lanes (`memory-save.ts`, `pe-gating.ts`) | Read predecessor rows for dedup; tombstone-match semantics owned by phase 003 | unchanged: documented consumer, no edit here | note in predicate module contract; phase 003 pointer |
| `handlers/memory-crud-health.ts:463` exclusion-audit `content` column (#24) | Broken diagnostic, always 'ok' | not a consumer of this change: owned by phase 011 | tracked in 011 scope; no edit here |

Required inventories:
- Same-class producers (ad-hoc exclusion predicates that must collapse into the module): `rg -n "deprecated|is_archived|includeArchived|deleted_at" .opencode/skills/system-spec-kit/mcp_server/lib .opencode/skills/system-spec-kit/mcp_server/handlers --glob '*.ts'`
- Consumers of changed symbols after the change: `rg -n "ACTIVE_ROW_SQL|isActiveRow|active-row-predicate" .opencode/skills/system-spec-kit/mcp_server --glob '*.ts' --glob '*.md'` must list exactly the ten channels plus stats/health and tests.
- Tier literal audit (no case-sensitive stragglers): `rg -n "'critical'|'important'|'deprecated'|'archived'|\"critical\"" .opencode/skills/system-spec-kit/mcp_server/lib/search .opencode/skills/system-spec-kit/mcp_server/handlers --glob '*.ts'`
- Matrix axes: channel (10) x row-state (active, deprecated, archived, tombstoned, mixed-case tier, NULL tier, constitutional, archived+tombstoned) = 80 planned rows; enumerate before implementation in the T-021 test table.
- Algorithm invariant: a row is readable by a ranked channel iff `deleted_at IS NULL AND (importance_tier IS NULL OR lower(importance_tier) NOT IN ('deprecated','archived','constitutional'))`, with the deprecated/archived half gated by the graduated flag per the T-004a logic-sync decision (an unguarded `NOT IN` drops NULL-tier rows via SQL three-valued logic — the live channels all use the `IS NULL OR` guard). `includeArchived: true` widens ONLY the archived exclusion; constitutional is always excluded from ranked lanes and reaches results solely through its injection lane, which bypasses the tier clause but never the tombstone clause. Adversarial cases: mixed-case tiers, NULL tier, tombstoned constitutional row, archived row requested with includeArchived, restore after tombstone.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup - confirm-before-fix + baseline
- [ ] 🟡 findings re-verified in current code (T-001..T-005): tombstone read paths, edge hard-delete, tier raw store, parser substring, graph-injection/summary-stub filter gaps, includeArchived hardcode; graduated-flag logic-sync decision recorded (T-004a) before predicate adoption
- [ ] Baseline captured BEFORE any change (T-006): full vitest run, SQL state counts (deprecated=7,340, z_archive=11,086, critical=948-audit population), warm search + match_triggers latency
- [ ] Fixture DB snapshot taken for migration up/down tests

### Phase 2: Core Implementation
- [ ] Predicate module created and exported (T-007), then adopted channel-by-channel (T-008..T-015)
- [ ] Tombstone lifecycle fixes: read exclusion, edge preservation, bulk idempotency (T-016)
- [ ] Archived tier end-to-end + tier write normalization + parser fix (T-017, T-019, T-020)
- [ ] Migrations with audit trail: z_archive rewrite, case normalization, substring retro-fix (T-018, T-020)

### Phase 3: Verification
- [ ] Adversarial channel x row-state matrix executed (T-021); every fixed bypass has a regression test
- [ ] Whole vitest gate re-run; delta vs baseline reported (T-022)
- [ ] Live probes: reproduction queries from report §1 return clean slots (T-023)
- [ ] Docs synchronized + `validate.sh --strict` pass (T-024)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baseline-before-delta is mandatory: T-006 captures the real starting numbers (vitest pass/fail counts, SQL population counts, latency) BEFORE any change; T-022 re-runs the WHOLE gate after and reports the delta. "No regressions" claims cite both runs.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | predicate module semantics (all option combos, NULL/mixed-case tiers); parser tier table; tier normalization | vitest |
| Unit | migration up/down on fixture DB; audit-trail row counts | vitest + fixture SQLite |
| Integration | channel x row-state adversarial matrix (10 channels x 8 states); tombstone visibility per read path; restore preserves edges; bulk-delete idempotency | vitest against seeded test DB |
| Manual | live reproduction queries (report §1): "packet 028 memory search intelligence status", resume-style trigger match; stats-vs-health reconciliation SQL | spec-memory.cjs CLI + sqlite3 (read-only) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 daemon freshness (program order 011 -> 001 -> 002) | Internal | Yellow (not started) | CLI evidence unreliable; use dev-allow-stale bypass for read-only probes only |
| Phase 001 predicate consumption (dup collapse) | Internal | Yellow (runs before 002 but its dup-collapse task waits on this predicate) | 001 finishes its other tasks; collapse task re-sequenced after T-007 lands |
| vector-index-schema.ts migration registry | Internal | Green | Migrations follow the existing v28-style versioned pattern |
| better-sqlite3 / sqlite-vec native modules | External | Green | Read/write paths already in production; no version change planned |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-merge evidence that live rows are hidden (support query returns 0 where baseline returned >0 for active rows), search latency regression >10% attributable to the predicate, or migration audit counts diverging from rewritten-row counts.
- **Procedure**: Revert the code commits (predicate module + call-site adoption are isolated commits); run the migration rollback script that restores `importance_tier` from `memory_tier_migration_audit`; re-run T-006 baseline probes to confirm pre-change counts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + Baseline) ──► Phase 2 (Predicate + Adoption + Migrations) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (confirm-before-fix, baseline) | None | Core |
| Core (predicate, channels, lifecycle, migrations) | Setup | Verify; phase 001 dup-collapse task |
| Verify (matrix, delta, live probes) | Core | Phase close; successor 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 2-3 hours (verification reads + baseline capture) |
| Core Implementation | High | 8-14 hours (10 call sites + 3 audited migrations + lifecycle fixes) |
| Verification | Medium | 4-6 hours (80-row matrix + live probes + docs) |
| **Total** | | **14-23 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fixture DB snapshot exists for migration tests
- [ ] `memory_tier_migration_audit` trail verified writable before rewrites run
- [ ] Baseline probe outputs saved under scratch/ (counts + latency)

### Rollback Procedure
1. Revert the adoption commits (each channel adoption is a separate commit; predicate module last).
2. Run the audit-trail restore script: rewrite `importance_tier` back from `memory_tier_migration_audit` rows for the affected migration version.
3. Re-run the T-006 baseline SQL probes and confirm counts match pre-change capture.
4. Note the rollback and cause in implementation-summary.md.

### Data Reversal
- **Has data migrations?** Yes (3: z_archive rewrite, tier-case normalization, substring-tier retro-fix)
- **Reversal procedure**: Every migration writes (memory_id, prior_tier, new_tier, reason, migration_version) to `memory_tier_migration_audit` before mutating; the restore script replays prior_tier per version. Tombstone changes are code-only (no data rewrite) and revert with the commit.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌───────────────────────┐     ┌──────────────────┐
│  T-001..T-006    │────►│  T-007 predicate mod  │────►│ T-008..T-015     │
│  confirm+baseline│     └──────────┬────────────┘     │ channel adoption │
└──────────────────┘                │                  └────────┬─────────┘
                                    │                           │
                          ┌─────────▼──────────┐      ┌─────────▼─────────┐
                          │ T-016..T-020       │─────►│ T-021..T-024      │
                          │ lifecycle+migrations│      │ verify + docs     │
                          └────────────────────┘      └───────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Confirm + baseline (T-001..T-006) | None | Verified findings, baseline numbers | All code tasks |
| Predicate module (T-007) | Baseline | ACTIVE_ROW_SQL / isActiveRow | Channel adoption; phase 001 dup collapse |
| Channel adoption (T-008..T-015) | T-007 | Ten filtered channels | Verification matrix |
| Lifecycle + migrations (T-016..T-020) | T-007 (predicate semantics), fixtures | Honest tiers + tombstones | Verification matrix |
| Verification (T-021..T-024) | All above | Evidence, delta report, strict-pass docs | Phase close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T-006 baseline capture** - 1 hour - CRITICAL (nothing may change before it)
2. **T-007 predicate module** - 2 hours - CRITICAL (every adoption depends on it)
3. **T-008..T-015 channel adoption** - 6-8 hours - CRITICAL (the ten call sites are the phase's payload)
4. **T-018 z_archive migration** - 2 hours - CRITICAL (success criteria SC-003 depends on it)
5. **T-021/T-022 matrix + delta gate** - 3 hours - CRITICAL (completion evidence)

**Total Critical Path**: ~14-16 hours

**Parallel Opportunities**:
- T-001..T-005 confirm-before-fix reads can run in parallel.
- T-016 (tombstone lifecycle) and T-019/T-020 (tier hygiene) are independent of channel adoption once T-007 lands.
- Migration authoring (T-018) can proceed in parallel with channel adoption; it must land before T-021.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Findings confirmed + baseline captured | All 🟡 items re-verified with file:line quotes; baseline numbers saved | End of Phase 1 |
| M2 | Predicate live in all ten channels | Consumer inventory rg lists exactly the intended call sites; adversarial matrix green | Mid Phase 2 |
| M3 | Migrations applied with audit | SC-003 tier distributions sane; audit rows = rewritten rows | End of Phase 2 |
| M4 | Phase verified + docs closed | SC-001..SC-005 evidenced; validate.sh --strict exit 0; delta report written | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the target file section (file:line from the task) BEFORE editing; confirm the finding still reproduces (finding-is-a-hypothesis).
- [ ] Confirm the task's `deps` tasks are complete.
- [ ] Confirm scope: only files listed in the task's `touched-files` comment; spec.md §3 scope is FROZEN.

### Task Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in T-001 order unless marked [P]; 🟡 confirm-before-fix tasks always precede their fix task |
| TASK-SCOPE | No edits outside the task's touched-files list; new findings go to the ledger, not into scope |
| TASK-EVIDENCE | Every completed task cites its report/ledger finding ref and evidence (test name, rg output, or SQL count) in tasks.md - never in code comments (comment-hygiene HARD BLOCK) |

### Status Reporting Format
`T-0NN | STATUS (done/blocked/skipped) | evidence: <test/command + result> | delta vs baseline: <none or description>`

### Blocked Task Protocol
Mark the task `[B]` with the blocker in one line; do not silently re-scope. If implementation evidence contradicts a spec REQ, stop and escalate for amendment (logic-sync) instead of working around it.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decisions live in decision-record.md (ADR-001..ADR-004)
-->
