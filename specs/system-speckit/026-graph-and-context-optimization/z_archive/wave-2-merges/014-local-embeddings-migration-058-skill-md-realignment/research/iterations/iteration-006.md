## Iter 006 Findings: system-skill-advisor/SKILL.md Drift Survey

### Frontmatter Key Usage Analysis

| Key | Usage in mcp_server/ | Verdict | Rationale |
|-----|----------------------|---------|-----------|
| `trigger_phrases` | ACTIVE - Used in `scripts/skill_advisor.py` signal mapping (lines 637, 758), `lib/scorer/projection.ts` derived trigger extraction (line 186, 340), stress test fixtures | **RETAIN** | Core scoring input - extends signal map from graph-metadata derived field |
| `importance_tier` | STALE - Only appears in test fixture `tests/skill-graph-db.vitest.ts:74` | **REMOVE** | No actual scoring logic consumption; test-only artifact |
| `keywords` | ACTIVE - Used in `lib/scorer/types.ts` (line 31), `lib/scorer/projection.ts` (line 37, 53, 68, 83, 98, 113, 147, 153, 202), `lib/scorer/explicit.ts` (line 275), `lib/scorer/lexical.ts` (line 63) | **RETAIN** | Core scoring input - merged with intentSignals for phrase boundary matching |
| `intent_signals` | ACTIVE - Used in database schema `lib/skill-graph/skill-graph-db.ts` (line 140, 634, 643), metadata loader `lib/cross-skill-edges/metadata-loader.ts` (line 110), scorer types `lib/scorer/types.ts` (line 33), projection logic `lib/scorer/projection.ts` (line 21, 204), signal mapping `scripts/skill_advisor.py` (line 633, 750, 752) | **RETAIN** | Core scoring input - primary intent signal source for lane attribution |

### Anchor Naming Pattern Analysis

| Target Anchor Pattern | Template Expected Pattern | Verdict | Rationale |
|----------------------|--------------------------|---------|-----------|
| `<!-- ANCHOR:1-when-to-use -->` with `## 1. WHEN TO USE` | `## 1. SECTION NAME` (numeric prefix) | **RETAIN** | Numeric prefixes match template convention (template uses `## 1. OVERVIEW`, `## 2. FRONTMATTER REQUIREMENTS`, etc.) |
| `<!-- ANCHOR:2-smart-routing -->` with `## 2. SMART ROUTING` | Same pattern | **RETAIN** | Consistent with template |
| `<!-- ANCHOR:3-how-it-works -->` with `## 3. HOW IT WORKS` | Same pattern | **RETAIN** | Consistent with template |
| `<!-- ANCHOR:4-rules -->` with `## 4. RULES` | Same pattern | **RETAIN** | Consistent with template |
| `<!-- ANCHOR:5-references -->` with `## 5. REFERENCES` | Same pattern | **RETAIN** | Consistent with template |
| `<!-- ANCHOR:6-success-criteria -->` with `## 6. SUCCESS CRITERIA` | Same pattern | **RETAIN** | Consistent with template |
| `<!-- ANCHOR:7-integration-points -->` with `## 7. INTEGRATION POINTS` | Same pattern | **RETAIN** | Consistent with template |
| `<!-- ANCHOR:8-references-and-related-resources -->` with `## 8. REFERENCES AND RELATED RESOURCES` | Same pattern | **RETAIN** | Consistent with template |

### Summary

**Frontmatter**: 3 of 4 extra keys are active scoring inputs (`trigger_phrases`, `keywords`, `intent_signals`). Only `importance_tier` is stale and should be removed.

**Anchor naming**: All 8 anchors use numeric prefixes (`1-`, `2-`, etc.) which match the template's expected pattern. No unification needed - retain current numeric prefix convention.

### Recommendations

1. **Remove `importance_tier`** from SKILL.md frontmatter (line 14) - unused in scoring logic, only appears in test fixture
2. **Retain** `trigger_phrases`, `keywords`, `intent_signals` - all are core scoring inputs
3. **Retain** numeric anchor prefixes - aligns with template convention

ITER_006_COMPLETE: 2 findings (1 stale frontmatter key, 0 anchor naming issues), newInfoRatio=0.25
