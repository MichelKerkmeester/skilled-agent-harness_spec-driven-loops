---
title: "Implementation Plan: Advisor Doc-Trigger Harvest"
description: "Leaf parser module + additive sqlite table + derived-lane integration + sanitized response pointers, all behind SPECKIT_ADVISOR_DOC_TRIGGERS with flag-off invariance as the hard contract."
trigger_phrases:
  - "advisor doc harvest plan"
  - "skill_docs implementation plan"
  - "doc trigger scoring integration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-advisor-doc-trigger-harvest"
    last_updated_at: "2026-06-11T08:45:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phases 1-3 executed; rollout phase pending"
    next_safe_action: "Governance surfaces, flag flip in runtime configs, daemon adoption"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-141-advisor-doc-trigger-harvest"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Advisor Doc-Trigger Harvest

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | TypeScript (ESM, better-sqlite3) + Python 3 (CLI fallback parity) |
| **Framework** | mk_skill_advisor MCP daemon; 5-lane fusion scorer; chokidar watcher |
| **Storage** | skill-graph.sqlite (WAL), new additive `skill_docs` table |
| **Testing** | vitest (`tests/`, `lib/scorer/lanes/__tests__/`), `ast.parse` for Python, isolated-DB pilot script |

### Overview
Make the skill advisor the sole runtime consumer of per-doc frontmatter on skill references/assets. The shape: a leaf module owns flag + parsing + discovery (`doc-frontmatter.ts`); the existing indexer gains a post-transaction harvest pass writing `skill_docs` rows; the sqlite projection attaches `docTriggers` per skill when the flag is on; the `derived_generated` lane scores them dampened (top-3, tier-weighted, 0.45 cap) and emits `doc:<path>` evidence; the recommend handler lifts that evidence into a sanitized `matchedDocs` response field. Every stage is inert when `SPECKIT_ADVISOR_DOC_TRIGGERS` is unset — the dominant design constraint is that flag-off output is byte-identical to pre-feature output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (consumer audit complete in 009/001 research.md)
- [x] Success criteria measurable (pilot prompts + invariance probes defined up front)
- [x] Dependencies identified (operator contract decision recorded before any code)

### Definition of Done
- [x] All acceptance criteria met for build phases (REQ-001..007; REQ-008 rollout pending)
- [x] Tests passing (11/11 new cases; suite failures proven pre-existing by stash-rerun)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary; governance surfaces tracked in rollout phase)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated additive pipeline extension — every touch point extends an existing seam (indexer, projection, lane, schema, watcher) rather than adding a parallel path; the one new module is a dependency-free leaf.

### Key Components
- **`doc-frontmatter.ts` (new leaf)**: `isDocTriggerHarvestEnabled()` (default-off env gate), `parseDocFrontmatter()` (block + inline list forms; null when no phrases), `listSkillDocFiles()` (references/assets walk, README-excluded, capped), `docTierWeight()` (constitutional/critical 1.0 → deprecated 0.2)
- **`harvestSkillDocs()` in skill-graph-db.ts**: own transaction AFTER the node transaction, runs for every skill regardless of node-hash skips (doc edits don't touch graph-metadata.json), upsert-on-conflict keyed `(skill_id, doc_path)`, per-skill stale sweep, counters surfaced as `result.docs`
- **`loadDocTriggersBySkill()` in projection.ts**: one SELECT grouped into `Map<skillId, SkillDocTriggerProjection[]>`, phrases normalized through the same `phraseVariants`/`unique` pipeline as curated triggers; missing-table tolerant for pre-migration read-only DBs
- **`scoreDocTriggers()` in lanes/derived.ts**: per-doc best-phrase specificity × tierWeight, top-3 by score, summed × 0.5 capped at 0.45, evidence ordered docs-first so the 6-entry fusion evidence cap cannot starve doc pointers
- **`matchedDocsFromContributions()` in advisor-recommend.ts**: exported, structurally typed; `SAFE_DOC_PATH` allowlist + dedupe + max 3; populated independent of `includeAttribution`

### Data Flow
`references|assets/*.md` → (scan, flag on) `harvestSkillDocs` → `skill_docs` rows → (recommend) `loadDocTriggersBySkill` → `SkillProjection.docTriggers` → `scoreDerivedLane` → `doc:` evidence in `LaneMatch` → fusion `LaneContribution.evidence` → `matchedDocs` on the public recommendation. Watcher events on doc paths re-enter at the scan step for the owning skill.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `indexSkillMetadata` (producer) | Owns graph ingestion | Updated — harvest pass appended post-transaction | Lifecycle vitest; pilot scan counters |
| `loadSqliteProjection` (producer) | Builds scorer projection | Updated — flag-gated doc-trigger attach | Pilot: 11 skills with docTriggers flag-on, 0 flag-off |
| `scoreDerivedLane` (policy) | Lane scoring | Updated — capped doc contribution | Capping + invariance vitest cases |
| `AdvisorRecommendationSchema` (public response) | `.strict()` output contract | Updated — optional `matchedDocs` | Schema parse in existing handler tests; additive-optional |
| `memory_save` boundary (NOT a consumer) | Rejects non-spec paths | Unchanged — `isMemoryFile` untouched by design | `git status` scope: zero system-spec-kit edits |
| Hook brief / CLI front door (consumers) | Print recommendations | Unchanged — tolerate unknown optional fields | `skill-advisor.cjs` passes JSON through |
| `skill_graph_compiler.py` (legacy producer) | Validates graph-metadata only | Not a consumer of doc rows | Compiler reads graph-metadata.json exclusively |

Required inventories:
- Same-class producers: `rg -n "trigger_phrases" lib/ handlers/ scripts/` — graph-metadata consumers confirmed untouched.
- Consumers of changed symbols: `rg -n "SkillGraphIndexResult|docTriggers|matchedDocs"` — scan handler spreads result (additive-safe); schemas/handler updated together.
- Matrix axes: flag {off,on} × doc state {new, unchanged, edited, deleted, phrase-stripped} × path {references, assets, nested, README, non-md} — covered across the 11 vitest cases.
- Algorithm invariant: matchedDocs paths satisfy `^(references|assets)/[A-Za-z0-9_./-]+\.md$` with no `..` — adversarial entries tested (traversal, prefix escape, non-md).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet scaffolded at Level 2 under skilled-agent-orchestration (create.sh --track)
- [x] Advisor internals mapped (sqlite schema, fusion lanes, ingestion paths, response shape) via exploration before any edit
- [x] Flag name + default fixed: `SPECKIT_ADVISOR_DOC_TRIGGERS`, opt-in `=== 'true'`

### Phase 2: Core Implementation
- [x] `doc-frontmatter.ts` leaf module (parser, walker, flag, tier weights)
- [x] `skill_docs` DDL in SCHEMA_SQL + ensureSchemaMigrations; `harvestSkillDocs` + result counters
- [x] Projection `docTriggers` load (flag-gated, missing-table tolerant)
- [x] Derived-lane doc scoring (top-3, tier-weighted, 0.45 cap, docs-first evidence)
- [x] `matchedDocs` schema field + sanitized extraction + `doc_reference_signal`
- [x] Watcher `doc-frontmatter` targets; Python CLI fallback harvest

### Phase 3: Verification
- [x] 11-case vitest file green; quote-stripping bug found and fixed via test
- [x] Full advisor suite: 2 failing files reproduced with changes stashed (pre-existing)
- [x] Isolated-DB pilot on the real skill tree (355/84, top-rank + matchedDocs, flag-off probe)

### Phase 4: Rollout (pending)
- [ ] Governance surfaces: advisor README/ARCHITECTURE, feature_catalog entry, manual_testing_playbook row + count self-check bump, skill changelog
- [ ] `SPECKIT_ADVISOR_DOC_TRIGGERS=true` in the three runtime configs (opencode/claude/codex daemon env)
- [ ] Fresh-session daemon adoption + live `skill_graph_scan` + CLI smoke (`matchedDocs` visible)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parser forms, tier mapping, walker exclusions, path sanitization | vitest (`skill-doc-harvest.vitest.ts`) |
| Integration | Flag-gated ingestion lifecycle (new/unchanged/edited/deleted/phrase-stripped) against a temp DB | vitest + `initDb`/`indexSkillMetadata` |
| Scoring | Doc contribution cap, curated-beats-doc-only, absent-vs-empty docTriggers equality | vitest + `scoreDerivedLane` fixtures |
| Regression | Full advisor suite; failures triaged by stash-rerun to prove pre-existing | vitest run + git stash |
| Manual | Real-tree pilot in an isolated `MK_SKILL_ADVISOR_DB_DIR`, scoring probes, flag-off probe | node ESM script against dist |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator contract decision (Option B, advisor-as-consumer) | Internal | Green (recorded in 009/001) | Feature would standardize dead metadata |
| better-sqlite3 / WAL on skill-graph.sqlite | Internal | Green | Harvest transaction semantics |
| 009 phases 002-022 authoring | Internal | Pending | Signal stays at 84 docs until authored |
| Fresh-session daemon restart for adoption | Operational | Pending | Live daemon serves old dist until then |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Routing regressions attributable to doc signal (top-1 flips on curated prompts), scan-time blowup, or schema errors on daemon start.
- **Procedure**: Unset `SPECKIT_ADVISOR_DOC_TRIGGERS` (or `=false`) in runtime configs and start a fresh session — ingestion, projection load, watcher targets, and Python harvest all gate off; the `skill_docs` table and code paths are inert. No code revert needed for behavioral rollback.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: packet + internals map + flag contract)
        │
        ▼
Phase 2 (Core: parser → storage → projection → lane → response → watcher/parity)
        │
        ▼
Phase 3 (Verify: vitest + suite triage + isolated pilot)
        │
        ▼
Phase 4 (Rollout: governance surfaces → config flip → daemon adoption → live smoke)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator decision (009/001) | Core |
| Core | Setup | Verify |
| Verify | Core | Rollout |
| Rollout | Verify | 009 authoring smoke tests (SC-003) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~1 hour (actual: exploration-led, single session) |
| Core Implementation | Med | ~3-4 hours (actual: one session pass, one parser bug) |
| Verification | Med | ~2 hours (actual: incl. stash-triage of pre-existing failures) |
| Rollout | Low | ~1-2 hours (pending) |
| **Total** | | **~7-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (no destructive data changes; skill-graph.sqlite is rebuildable from source metadata at any time)
- [x] Feature flag configured (default-off in code; opt-in only)
- [ ] Monitoring: `result.docs` counters + `DOC-READ-FAILED` warnings visible in scan output after adoption

### Rollback Procedure
1. Unset/false the flag in the affected runtime config(s).
2. Start a fresh session (advisor launcher EXITS on child SIGTERM — never SIGTERM-recycle; fresh session or `/mcp` reconnect after rebuild are the only safe adoption/rollback paths).
3. Smoke: `advisor_recommend` on a curated prompt → identical pre-feature output; no `matchedDocs` fields.
4. Optional hygiene: drop rows via `DELETE FROM skill_docs` or delete skill-graph.sqlite and rescan (graph fully rebuilds from graph-metadata.json).

### Data Reversal
- **Has data migrations?** Additive only (`CREATE TABLE IF NOT EXISTS skill_docs`).
- **Reversal procedure**: rows are ignored when the flag is off; full reversal = `DROP TABLE skill_docs` or DB delete + rescan. No other table is touched.
<!-- /ANCHOR:enhanced-rollback -->
