---
title: "Implementation Plan: Phase 5: trigger-phrase-quality-and-matcher-guards"
description: "Three-lane fix plan: retroactive trigger regeneration + constitutional cleanup (data repair), merge-not-replace auto-fix + apostrophe/multi-line parser fix (write guards), and stopword/IDF matcher guard + specFolder prefix scope + (path, mtime)-keyed extraction cache (read path). Baseline-before-delta testing against the 2.3s warm / 17s cold match_triggers measurements."
trigger_phrases:
  - "trigger phrase quality plan"
  - "trigger cache mtime caching"
  - "merge not replace auto-fix"
  - "specfolder prefix matching"
  - "trigger matcher guards"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/005-trigger-phrase-quality-and-matcher-guards"
    last_updated_at: "2026-07-03T12:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored implementation plan with affected-surfaces inventory and rollback"
    next_safe_action: "Start T001 confirm-before-fix verification of the agent-reported findings"
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
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: trigger-phrase-quality-and-matcher-guards

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | TypeScript (Node), spec-kit memory MCP server |
| **Framework** | None (MCP handlers + lib modules under .opencode/skills/system-spec-kit/mcp_server/) |
| **Storage** | SQLite via better-sqlite3 (memory_index, trigger phrase tables, constitutional rows) |
| **Testing** | vitest (existing trigger suites: trigger-latency-budget, trigger-goldens, trigger-extractor, trigger-backfill-resume, integration-trigger-pipeline) |

### Overview
Fix trigger quality at all three layers in one phase so junk cannot survive or return: (1) data repair - regenerate legacy word-soup rows through the quality-loop extractor and dedup/purge constitutional rows; (2) write guards - auto-fix merges instead of replacing user triggers, parser stops dropping apostrophe/multi-line phrases, constitutional saves from /tmp or sandbox rejected; (3) read path - stopword/min-length/IDF single-token guard, archive/deprecated exclusion via the phase 002 predicate, specFolder prefix scope, and a (path, mtime)-keyed extraction cache that ends the full-corpus disk re-read per 60s TTL. Correctness fixes to default-ON behavior ship direct (no flags), per the program's cross-cutting rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] T001 confirm-before-fix pass completed for all agent-reported (non-live-verified) findings
- [ ] T002 baseline captured: vitest trigger suites + match_triggers latency + junk-match reproduction
- [ ] Phase 002 predicate availability checked (blocks T008 only, not the phase)

### Definition of Done
- [ ] All REQ-001..REQ-008 acceptance criteria met (REQ-009/010 done or deferral documented)
- [ ] Whole vitest gate re-run and compared against the T002 baseline (no regressions, delta reported)
- [ ] spec/plan/tasks/checklist synchronized; decisions recorded in implementation-summary.md
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Existing modular MCP server: handlers own tool surfaces, lib/parsing owns extraction + matching, migrations follow the versioned pattern in vector-index-schema.ts. No new architecture; guards and caches are added inside the modules that already own the behavior.

### Key Components
- **lib/parsing/memory-parser.ts**: Frontmatter trigger extraction (write-side producer; apostrophe/multi-line fix + parse-time dedupe/cap).
- **handlers/memory-save.ts**: Quality-loop auto-fix application (merge-not-replace at line 537 area) and the constitutional write guard.
- **lib/parsing/trigger-matcher.ts**: Trigger cache loader + matcher (stopword/IDF guard, tier exclusion, (path, mtime) cache replacing readCanonicalSpecDocContent full re-reads at line 333 area).
- **handlers/memory-triggers.ts**: memory_match_triggers tool (specFolder prefix scope at lines 449/269; batched id IN hydration).
- **lib/search/trigger-embedding-backfill.ts**: Backfill loop (attempt cap/backoff, FK cleanup).
- **handlers/quality-loop.ts**: Existing extractor, reused unchanged as the regeneration engine.
- **New migration**: Batched, resumable regeneration of legacy word-soup rows + constitutional dedup/purge.

### Data Flow
Save: doc frontmatter -> memory-parser extraction -> quality-loop auto-fix (merge) -> index rows + phrase rows. Match: user prompt -> memory_match_triggers -> trigger cache (loader applies active-row predicate; (path, mtime) cache feeds phrase extraction) -> guarded matching (stopword/min-length/IDF, per-memory dedup) -> scoped filter (prefix semantics) -> batched hydration -> matches.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| lib/parsing/memory-parser.ts (producer) | Extracts trigger_phrases from frontmatter; regex at :820 drops apostrophe/multi-line phrases | update | Parser unit tests round-trip apostrophe + multi-line phrases; `rg -n "itemMatch" lib/parsing/memory-parser.ts` |
| handlers/memory-save.ts (producer/policy) | Applies quality-loop fixedTriggerPhrases by replacement at :537; writes constitutional rows without source-path guard | update | Regression test: user triggers survive auto-fix; guard test rejects /tmp constitutional save |
| handlers/quality-loop.ts (helper) | Trigger extractor used by save-time auto-fix | unchanged (reused by regeneration migration) | Extractor output sampled on legacy rows in T001 before migration is written |
| lib/parsing/trigger-matcher.ts (consumer/policy) | Cache loader (no tier exclusion) + matcher (no single-token guard); full-corpus disk re-read per TTL at :333 | update | Latency budget test + goldens; cold/warm cache tests; exclusion test with deprecated/archived rows |
| handlers/memory-triggers.ts (consumer/public response) | match_triggers tool; specFolder exact match at :449/:269; per-candidate hydration | update | Scope matrix test (none/exact/parent-prefix/foreign); hydration batch assertion |
| lib/search/trigger-embedding-backfill.ts (producer) | Re-pends failed phrase rows forever; no FK cleanup | update | trigger-backfill-resume.vitest.ts extended: capped failure terminates; orphan FK rows removed |
| Constitutional priming surface (consumer) | Injects constitutional rows (70 rows / 20 distinct incl. sandbox id 38797) into session priming | update via data migration + write guard | SQL audit post-migration: 20 distinct, id 38797 gone |
| Phase 002 shared active-row predicate (shared policy) | Owns tier/tombstone exclusion semantics | not a consumer yet - this phase consumes it in the cache loader, never forks it | `rg -n "activeRowPredicate\|deleted_at IS NULL" mcp_server/lib` confirms single definition once 002 lands |
| memory_stats / memory_health trigger counts (status) | Report totalTriggerPhrases from raw phrase rows | unchanged (counts will legitimately drop after regeneration) | Before/after stats snapshot recorded in T002/T017; drop explained in implementation-summary.md |
| Existing vitest trigger suites + tool docs (tests/docs) | Encode current exact-match scope + uncached loader behavior | update | Whole-gate re-run vs baseline; match_triggers doc updated for prefix semantics |

Required inventories:
- Same-class producers: `rg -n "trigger_phrases|triggerPhrases|fixedTriggerPhrases" .opencode/skills/system-spec-kit/mcp_server/handlers .opencode/skills/system-spec-kit/mcp_server/lib --glob '*.ts'`
- Consumers of changed symbols: `rg -n "match_triggers|matchTriggers|readCanonicalSpecDocContent|spec_folder !==" .opencode/skills/system-spec-kit/mcp_server --glob '*.ts' --glob '*.md'`
- Constitutional writers/readers: `rg -n "constitutional" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skills/system-spec-kit/mcp_server/lib --glob '*.ts'`
- Matrix axes: token class (stopword / sub-min-length / high-IDF single / multi-word) x row tier (active / deprecated / archived / constitutional) x specFolder scope (none / exact / parent-prefix / foreign) x cache state (cold / warm / stale-mtime / unchanged-mtime) x phrase syntax (plain / apostrophe / multi-line / quoted). Rows enumerated in tasks.md T016 before implementation is claimed complete.
- Algorithm invariant (matcher/scope/parser fixes): a trigger match never fires solely on a stopword or sub-min-length token; scoped queries use the same prefix semantics as every other read surface; excluded tiers can never enter the cache; parser never silently drops a syntactically valid phrase. Adversarial cases: resume-style prompt ("deep", "memory", "028" tokens), the literal token "z_archive", stopword-only prompt, parent-folder scope over phase children, phrase "user's trigger", multi-line YAML phrase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm + Baseline
- [ ] T001 confirm-before-fix: verify each agent-reported finding in current code (finding-is-a-hypothesis)
- [ ] T002 baseline: vitest trigger suites, match_triggers latency (2.3s warm / 17s cold reference), junk-match + corpus-stat snapshots

### Phase 2: Core Implementation
- [ ] Write guards: merge-not-replace auto-fix, parser apostrophe/multi-line fix, constitutional write guard
- [ ] Matcher: single-token guard + per-memory dedup, specFolder prefix scope, tier exclusion via 002 predicate, backfill cap + FK cleanup
- [ ] Hot path: (path, mtime)-keyed extraction cache, batched id IN hydration
- [ ] Data repair: regeneration migration (dry-run first), constitutional dedup/purge migration

### Phase 3: Verification
- [ ] Adversarial matrix + unit/integration tests green
- [ ] Whole vitest gate re-run vs T002 baseline; latency re-measured; success gates checked
- [ ] Docs synchronized, checklist evidence recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parser (apostrophe/multi-line/dedupe/cap), auto-fix merge, single-token guard predicate, prefix scope filter, cache keying | vitest |
| Integration | match_triggers end-to-end warm/cold; cache-loader exclusion; backfill termination; migration dry-run on DB copy | vitest + existing integration-trigger-pipeline suite |
| Manual | Resume-style prompt reproduction against production corpus; latency measurement (p50 over repeated warm calls); constitutional priming audit | CLI (spec-memory.cjs) + SQL audit queries |

Baseline-before-delta is mandatory: T002 captures the full vitest trigger-suite results, warm/cold match_triggers latency (report baseline 2.3s warm / 17s cold, re-measured locally), the junk-match reproduction (resume prompt -> 5/5 z_archive), the 45% single-word corpus share, and the constitutional row counts BEFORE any change. T017 re-runs the WHOLE gate and reports the delta against those exact numbers - no "no regressions" claim without the baseline comparison.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 shared active-row predicate | Internal | Yellow (002 scheduled before 005 in program order) | T008 (cache-loader exclusion) blocked; rest of phase proceeds |
| Quality-loop extractor (handlers/quality-loop.ts) | Internal | Green | Regeneration migration has no engine; phase P0 REQ-001 blocked |
| better-sqlite3 / production DB copy for dry-runs | Internal | Green | Migrations cannot be rehearsed safely; no live-DB dry-runs allowed |
| Existing vitest trigger suites | Internal | Green | Baseline-before-delta impossible; completion claims blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-migration audit fails (recall loss on goldens, corpus stats worse than baseline), warm p50 regresses, or guard over-filters legitimate triggers in production use.
- **Procedure**: Code changes revert via git (no feature flags - fixes ship direct per program rules). Data migrations restore from the pre-migration phrase snapshot kept until the post-audit passes; regeneration and constitutional migrations are batched + resumable, so partial application rolls back per batch cursor.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + Baseline) ──► Phase 2 (Core Implementation) ──► Phase 3 (Verification)
                                   │
002 predicate (external) ─────────┘  (gates T008 exclusion work only)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm + Baseline | None | Core Implementation |
| Core Implementation | Confirm + Baseline; phase 002 predicate (T008 only) | Verification |
| Verification | Core Implementation | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + Baseline | Low | 1-2 hours |
| Core Implementation | High | 8-12 hours (guards 4-6h, migrations 3-5h, cache 1-2h) |
| Verification | Med | 2-4 hours |
| **Total** | | **11-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-migration phrase snapshot created (regeneration + constitutional scopes)
- [ ] Migration dry-run completed on a DB copy with audit numbers recorded
- [ ] Baseline (T002) numbers stored in tasks.md evidence before any write

### Rollback Procedure
1. Stop: do not run further migration batches (cursor position preserved).
2. Restore phrase rows from the pre-migration snapshot for affected batches.
3. `git revert` the guard/cache/scope commits (no flags involved).
4. Re-run trigger goldens + latency budget test to confirm return to baseline behavior.

### Data Reversal
- **Has data migrations?** Yes (trigger regeneration; constitutional dedup/purge).
- **Reversal procedure**: Restore from the retained pre-migration snapshot tables; snapshots are deleted only after the T017 post-audit passes and the phase is signed off.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
