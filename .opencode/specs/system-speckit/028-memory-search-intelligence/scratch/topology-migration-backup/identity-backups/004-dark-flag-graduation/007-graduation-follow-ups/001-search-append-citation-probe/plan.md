---
title: "Implementation Plan: Search Append-Exempt Serializer + True-Citation Density Probe"
description: "Marks tail-appended rows in the formatter, teaches the serializer's token-budget trim to drop non-exempt rows first, and adds a true-citation density probe surfaced through memory_health. All behind the existing default-off flags, byte-identical when off."
trigger_phrases:
  - "append-exempt serializer plan"
  - "density probe plan"
  - "token budget trim selection"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-dark-flag-graduation/007-graduation-follow-ups/001-search-append-citation-probe"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored plan"
    next_safe_action: "Run cli test pass"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Search Append-Exempt Serializer + True-Citation Density Probe

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (nodenext) |
| **Framework** | MCP server (better-sqlite3) |
| **Storage** | SQLite shadow ledger (`true_citation_events`) |
| **Testing** | Vitest |

### Overview
Two surgical follow-ups behind existing default-off flags. The serializer fix marks appended rows so the token-budget trim spares them; the probe counts usable session-scoped pairs and signals reranker-training readiness.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (009 review findings P1-001, P2-003)

### Definition of Done
- [x] All acceptance criteria met
- [ ] Tests passing (cli executor test pass)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive, flag-gated marker propagation. The append modules already stamp `source`/`sources`; the formatter derives a presentation-level `appendExempt` flag; the serializer reads it.

### Key Components
- **`isTailAppendedRow` (formatter)**: detects `multihop` / `lane-champion:*` source markers.
- **`selectBudgetTrimIndex` (context-server)**: returns the last non-exempt index, sparing appends.
- **`probeTrueCitationDensity` (emitter)**: three COUNT queries + a both-classes-present gate.

### Data Flow
Append stage stamps `source` → formatter sets `appendExempt: true` on those rows → serializer's trim loop calls `selectBudgetTrimIndex` and drops non-exempt rows first. Independently, the session-stop hook fills the ledger → `probeTrueCitationDensity` reads it → `memory_health` surfaces the reading.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/deterministic-multihop.ts` | Stamps `source: 'multihop'` on appended rows | unchanged (producer) | `rg -n "source: 'multihop'"` |
| `lib/search/lane-champion-backfill.ts` | Stamps `source: 'lane-champion:<lane>'` | unchanged (producer) | `rg -n "lane-champion:"` |
| `formatters/search-results.ts` | Formats rows into the response envelope | add `appendExempt` derivation | new tests A1-A3 |
| `context-server.ts` token-budget trim | Pops lowest-scored rows to fit budget | drop non-exempt first | new tests B1-B5, C1-C2 |
| `lib/feedback/true-citation-emitter.ts` | Owns the shadow ledger + read helpers | add density probe | new density tests |
| `handlers/memory-crud-health.ts` | Builds the `memory_health` payload | surface probe, flag-gated | byte-identity when flag off |

Required inventories:
- Append markers: `rg -n "source: 'multihop'|lane-champion:" mcp_server/lib/search`.
- Truncation consumers of `data.results`: the context-server after-tool callback is the only token-budget trim site (`rg -n "innerResults" context-server.ts`).
- Algorithm invariant: with no exempt row present, `selectBudgetTrimIndex` returns the last index, byte-identical to the original `pop()`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate the second truncation point (context-server token-budget trim)
- [x] Confirm append markers (`source`/`sources`) reach the formatter

### Phase 2: Core Implementation
- [x] Formatter: `appendExempt` field + `isTailAppendedRow` detection
- [x] Serializer: `selectBudgetTrimIndex`, trim loop spares exempt rows
- [x] Emitter: `probeTrueCitationDensity` + `RERANKER_TRAINING_MIN_PAIRS`
- [x] Health: surface the probe behind the emitter flag

### Phase 3: Verification
- [x] tsc clean (no new errors over the pre-existing tsconfig baseline)
- [x] Author the two test suites
- [ ] cli executor runs the vitest pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Formatter marking, trim selection, density probe | Vitest |
| Integration | Budget-trim loop survival of appended rows | Vitest (in-memory simulation of the trim loop) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Append modules stamping `source`/`sources` | Internal | Green | Marker detection has nothing to key on |
| `SPECKIT_TRUE_CITATION_EMITTER` ledger schema | Internal | Green | Probe queries fail (handled, returns zero) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Appends still dropped, or the probe misreports readiness.
- **Procedure**: Revert the four source edits. The append flags remain default-off, so reverting restores the exact prior serialization and health output.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour (locate truncation + markers) |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Feature flags already configured (default-off)
- [x] Byte-identity proven for the flag-off path

### Rollback Procedure
1. Both append flags and the emitter flag stay default-off; the change is dormant in production until a flag flips.
2. Revert the four source edits if needed.
3. Re-run the two vitest suites to confirm the revert.

### Data Reversal
- **Has data migrations?** No (the shadow table schema is unchanged).
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
