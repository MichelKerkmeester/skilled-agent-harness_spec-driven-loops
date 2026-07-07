---
title: "Implementation Plan: Apply 015/005 metadata fixes and re-run the seeded sweep"
description: "Read top-8 audit recommendations, apply per-skill graph-metadata.json + SKILL.md description edits, invalidate cache, re-run sweep, recommend."
trigger_phrases:
  - "metadata fixes plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-metadata-fixes-and-seeded-sweep-rerun"
    last_updated_at: "2026-05-14T01:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Apply 015/005 metadata fixes and re-run the seeded sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Apply 015/005's top-8 audit recommendations to the affected skills' `graph-metadata.json` and `SKILL.md` `description:` field, invalidate the embedding cache for those skills, re-run `lane-weight-sweep.vitest.ts`, emit the delta-vs-baseline report, recommend.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 015/005 audit-report.md on main with WHAT/WHY/EXAMPLE blocks for top-8.
- [x] 015/004 baseline numbers documented (`accuracyTotal 0.6667 / todayCorrect 1.0000 / intentDescribed 0.3333 / flippedFromBaseline 0`).
- [x] Embedding cache helper from 015/004 understood (`tests/scorer/fixtures/seed-skill-embeddings.ts`).

### Definition of Done
- [x] All applicable top-8 recommendations applied (entries skipped only if EXAMPLE is missing).
- [x] Cache invalidated.
- [x] Sweep re-run with delta table emitted.
- [x] Recommendation cites numbers.
- [x] Strict spec validation passes.
- [x] All 17 skills still discoverable.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON + YAML frontmatter edits, Vitest re-run |
| **Framework** | Spec Kit MCP server + skill-advisor sweep |
| **Storage** | Skill files in `.opencode/skills/<skill>/` |
| **Testing** | Vitest sweep + strict spec validate |

### Approach
1. Parse 015/005 `research/audit-report.md` to extract per-skill recommendations with WHAT/EXAMPLE blocks.
2. For each top-8 skill:
   - Apply concrete phrasing changes to `graph-metadata.json` `derived.trigger_phrases` / `derived.key_topics` (and optionally `derived.intent_signals` / `manual.depends_on` / `manual.related_to` when the audit explicitly named them).
   - Apply concrete phrasing changes to the `description:` field in `SKILL.md` frontmatter.
   - Touch nothing else in the file.
3. Invalidate the embedding cache:
   - Delete the cache file under `mcp_server/skill_advisor/tests/scorer/fixtures/.embeddings-cache/` (or its records for affected skill ids).
4. Run `npm exec -- vitest run mcp_server/skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts` from `system-spec-kit/`.
5. Compare new sweep output against 015/004 baseline. Emit `006-apply-metadata-fixes-and-resweep/research/sweep-results-after-fixes.md` with:
   - Per-vector accuracy table
   - "Delta vs 015/004" column
   - Per-case routing diff table
   - Recommendation
6. Update `implementation-summary.md` with the per-skill edit ledger + recommendation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Read 015/005 audit-report.md.
- Inventory affected skills + their files.
- Read embedding cache layout.

### Phase 2: Implementation
- Apply per-skill edits.
- Invalidate cache.
- Re-run sweep.
- Emit delta report.
- Update implementation-summary.md.

### Phase 3: Verification
- Strict spec validate this packet.
- Strict spec validate parent 015.
- Vitest skill_advisor: confirm only pre-existing plugin-bridge baseline still fails.
- Spot-check 2 affected skills via `advisor_recommend` against fresh process (manual; codex may skip if MCP cannot start its provider).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Edit fidelity | Each affected skill's edited file matches the audit EXAMPLE | Manual diff review |
| Cache invalidation | Sweep re-embeds the affected skills | Sweep log shows non-zero cache_misses for those ids |
| Delta surface | Sweep numbers differ from 015/004 baseline (or are confirmed unchanged) | New report's Delta column |
| Discovery | All 17 skills still parse | `skill_graph_scan` returns 17 |
| Strict | Spec packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 015/005 audit-report.md (top-8 with EXAMPLES).
- 015/004 baseline.
- 015/003 sweep test wired with seed helper.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert restores all edited skills + drops the new packet folder. Embedding cache will rebuild on next sweep run; no production code touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | 015/005 shipped | Need the recommendations source |
| Phase 2 | Phase 1 | Cannot edit before reading audit |
| Phase 3 | Phase 2 | Validation runs after edits |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Audit parse + inventory | <30 LOC of edits orchestration |
| Per-skill edits (8 skills × 2 files) | ~100 LOC of JSON/YAML changes |
| Cache invalidation | ~10 LOC |
| Sweep re-run + report writer reuse | trivial (uses existing helper) |
| implementation-summary.md update | ~80 LOC of doc |
| **Total** | **~220 LOC** |

cli-codex gpt-5.5 high dispatch: 8-15 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Sweep variance is still zero AND a top-routed skill regressed (e.g., advisor stops picking sk-code for a "code" prompt).
- Any of the 17 skills fails to parse after edits.
- Vitest skill_advisor adds new failures beyond the pre-existing plugin-bridge baseline.

### Recovery
1. Revert the implementation commit.
2. Run skill_graph_scan to confirm 17 skills present.
3. Run advisor_recommend against 3 fixture prompts to confirm pre-edit routings restored.

### Data Safety
Production skill metadata is the only thing changing. Revert restores prior state byte-for-byte.
<!-- /ANCHOR:enhanced-rollback -->
