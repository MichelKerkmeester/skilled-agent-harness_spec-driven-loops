# 058 Deep-Review — Consolidated Findings

## Summary
- Total iterations: 20
- Total findings: 169
- Per-track breakdown (8 tracks)

## Findings by Severity

### P0 — Blockers requiring immediate edit

**system-spec-kit/SKILL.md:**
- F-001-001: WHEN TO USE section partially aligned - missing explicit "Use Cases" subsection structure, has additional governance content not in template schema
- F-001-003: HOW IT WORKS section drifted - missing detailed process flow diagram with step-by-step visual breakdown, sub-action nesting, output descriptions
- F-001-004: RULES section drifted - uses emoji prefixes (✅/❌/⚠️) not specified in template, which requires exact subsection naming without emoji
- F-001-005: REFERENCES section drifted - missing explicit "Core References" and "Templates and Assets" subsections, content not structured per template schema
- F-002-001 through F-002-007: All 7 main sections missing anchor tags (0% coverage ratio)

**system-spec-kit/mcp_server/README.md:**
- F-008-001 through F-008-012: 12 references to non-existent code_graph/ and skill_advisor/ directories (moved to separate packages per ADR-002)
- Lines affected: 129-130, 141, 147, 149, 167-193, 210, 211, 227, 228, 257, 279, 280

**system-skill-advisor/SKILL.md:**
- F-006-001: Stale frontmatter key `importance_tier` should be removed - only appears in test fixture, not used in scoring logic

**system-skill-advisor/mcp_server/tools/README.md:**
- F-007-001: Entrypoints table missing skillGraphPropagateEnhancesTool (only lists 8 tools, should be 9)

**system-skill-advisor/references/db-path-policy.md:**
- F-013-001: Anchor/section numbering misalignment - 4 sections affected (section "2. POLICY" uses anchor `1-policy`, should be `2-policy`, etc.)

**system-skill-advisor/SKILL.md:**
- F-015-001: Documentation drift on line 189 - states "lib/skill-graph/ database/query logic remains in system-spec-kit until the pending packet 011 cleanup" but extraction is already complete

### P1 — Drift requiring rewrite

**system-spec-kit/SKILL.md:**
- F-003-001 through F-003-004: Tool count discrepancies across 4 locations claim 41/54/50 tools but actual count is 36 local + 4 skill advisor = 40 tools
- F-003-005: MCP server naming inconsistency - both `mk-spec-memory` and `spec_kit_memory` used, should standardize

**system-code-graph/SKILL.md:**
- F-004-001 through F-004-008: Multiple missing subsections across all 8 sections (SMART ROUTING missing detection signals, pseudocode; HOW IT WORKS missing process flow; RULES missing ALWAYS/NEVER/ESCALATE subsections - validation blocker; etc.)
- F-005-001: Smart Routing table missing `code_graph_apply` tool
- F-005-002: Smart Routing table missing `code_graph_classify_query_intent` tool

**system-skill-advisor/mcp_server/README.md:**
- F-010-001 through F-010-007: 7 major sections missing entirely (TABLE OF CONTENTS, ARCHITECTURE, PACKAGE TOPOLOGY, DIRECTORY TREE, KEY FILES, BOUNDARIES AND FLOW, VALIDATION)
- Current file: 66 lines, needs expansion to ~280 lines per iter 011-012 scaffold

### P2 — Polish / clarification

**system-spec-kit/mcp_server/README.md:**
- F-008-013: Tool count not explicitly stated (verified as 39 tools, should document for clarity)

**system-skill-advisor/references/:**
- All existing docs (legacy-tool-bridge.md, standalone-mcp-shape.md) have proper anchor integrity and style consistency
- 7 new reference docs specified in iterations 014-016 (advisor-scorer.md, propagate-enhances.md, skill-graph-extraction-plan.md, tool-ids-reference.md)

**system-code-graph/references/:**
- 3 new reference docs specified in iterations 017-019 (code-graph-readiness-check.md, ownership-boundary.md, database-path-policy.md)
- Iter 020 found 0 residual gaps - no additional docs needed

## Per-Target Summary

- **system-spec-kit/SKILL.md:** 18 issues (5 structural drift, 7 missing anchors, 4 tool count discrepancies, 2 naming inconsistencies)
- **system-code-graph/SKILL.md:** 10 issues (8 missing subsections, 2 missing tools in routing table)
- **system-skill-advisor/SKILL.md:** 2 issues (1 stale frontmatter key, 1 documentation drift)
- **system-spec-kit/mcp_server/README.md:** 13 issues (12 references to moved packages, 1 missing tool count)
- **system-code-graph/mcp_server/README.md:** 0 issues (no drift found)
- **system-skill-advisor/mcp_server/README.md:** 7 issues (7 missing sections, requires major expansion)
- **system-skill-advisor/mcp_server/tools/README.md:** 1 issue (missing tool in entrpoints table)
- **system-skill-advisor/references/:** 1 existing issue (anchor numbering in db-path-policy.md) + 4 new docs scoped (advisor-scorer, propagate-enhances, skill-graph-extraction-plan, tool-ids-reference)
- **system-code-graph/references/:** 0 existing issues + 3 new docs scoped (code-graph-readiness-check, ownership-boundary, database-path-policy)

---

<!-- ANCHOR:citations -->
## Citations

Findings trace to iteration files under `research/iterations/`:

- [Iter 001](iterations/iteration-001.md) — Track 1 system-spec-kit/SKILL.md drift survey (5 findings)
- [Iter 002](iterations/iteration-002.md) — Track 1 anchor coverage gap (7 findings)
- [Iter 003](iterations/iteration-003.md) — Track 1 content drift (6 findings)
- [Iter 004](iterations/iteration-004.md) — Track 2 system-code-graph/SKILL.md drift (6 findings)
- [Iter 005](iterations/iteration-005.md) — Track 2 content (2 findings)
- [Iter 006](iterations/iteration-006.md) — Track 3 system-skill-advisor/SKILL.md drift (2 findings)
- [Iter 007](iterations/iteration-007.md) — Track 3 content + tool count (2 findings)
- [Iter 008](iterations/iteration-008.md) — Track 4 system-spec-kit/mcp_server/README.md sanity (13 findings)
- [Iter 009](iterations/iteration-009.md) — Track 5 system-code-graph/mcp_server/README.md drift (0 findings)
- [Iter 010](iterations/iteration-010.md) — Track 6 advisor mcp_server gap analysis (7 findings)
- [Iter 011](iterations/iteration-011.md) — Track 6 target scope (7 findings)
- [Iter 012](iterations/iteration-012.md) — Track 6 draft outline (9 findings)
- [Iter 013](iterations/iteration-013.md) — Track 7 references audit (1 finding)
- [Iter 014](iterations/iteration-014.md) — Track 7 advisor-scorer.md spec (30 findings)
- [Iter 015](iterations/iteration-015.md) — Track 7 propagate-enhances + extraction plan specs (8 findings)
- [Iter 016](iterations/iteration-016.md) — Track 7 tool-ids-reference.md spec (10 findings)
- [Iter 017](iterations/iteration-017.md) — Track 8 code-graph-readiness-check.md spec (42 findings)
- [Iter 018](iterations/iteration-018.md) — Track 8 ownership-boundary.md spec (7 findings)
- [Iter 019](iterations/iteration-019.md) — Track 8 database-path-policy.md spec (5 findings)
- [Iter 020](iterations/iteration-020.md) — Track 8 residual gap finder (0 findings — no additional gaps)

State machine: `research/deep-research-state.jsonl` records per-iter status + newInfoRatio + timestamp.
Delta: `research/delta-verified.md` is the surgical edit list + new-file specs passed to Phase 4 sonnet @markdown batches A/B/C.
<!-- /ANCHOR:citations -->
