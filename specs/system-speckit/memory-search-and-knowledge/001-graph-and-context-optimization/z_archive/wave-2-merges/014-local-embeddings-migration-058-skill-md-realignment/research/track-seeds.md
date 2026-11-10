# 058 Track Seeds — 8 Thematic Tracks × 20 Iter

## Track 1: system-spec-kit/SKILL.md (3 iter)

**Iter 001** — RQ_SHORT: system-spec-kit/SKILL.md drift survey
RQ_FULL: Read `.opencode/skills/system-spec-kit/SKILL.md` (466 lines) and compare against the sk-doc skill_md_template (`.opencode/skills/sk-doc/assets/skill/skill_md_template.md` section 3). For each required section (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES), report: present? aligned with template section schema? Cite line numbers.

**Iter 002** — RQ_SHORT: system-spec-kit/SKILL.md anchor coverage gap
RQ_FULL: The sk-doc template uses anchor tags around sections. system-spec-kit/SKILL.md has NO anchor tags. Identify every section header that should have an anchor pair per the template's pattern. Report each location + the anchor name to assign (e.g., `<!-- ANCHOR:1-when-to-use -->` ... `<!-- /ANCHOR:1-when-to-use -->`).

**Iter 003** — RQ_SHORT: system-spec-kit/SKILL.md content drift
RQ_FULL: Walk every factual claim in the SKILL.md (tool counts, file paths, agent names, command names, version strings, MCP server names). Cross-check against current reality. Report each DRIFTED claim with line number + suggested fix.

## Track 2: system-code-graph/SKILL.md (2 iter)

**Iter 004** — RQ_SHORT: system-code-graph/SKILL.md drift survey
RQ_FULL: Read `.opencode/skills/system-code-graph/SKILL.md` (146 lines, 8 anchors) vs sk-doc template. Report sections present/missing. Check `_memory` continuity block currency. Check anchor naming consistency with the template's pattern.

**Iter 005** — RQ_SHORT: system-code-graph/SKILL.md content + structure
RQ_FULL: Walk factual claims (tool names from CODE_GRAPH_TOOL_SCHEMAS, MCP server name `mk_code_index`, integration points). Cross-check. List drift items with line numbers + fixes. Verify the SKILL.md size (146 lines) vs sk-doc template's 800-2000 target — recommend whether to expand.

## Track 3: system-skill-advisor/SKILL.md (2 iter)

**Iter 006** — RQ_SHORT: system-skill-advisor/SKILL.md drift survey
RQ_FULL: Read `.opencode/skills/system-skill-advisor/SKILL.md` (215 lines, 8 anchors). Compare to template. The frontmatter has 4 extra keys (trigger_phrases, importance_tier, keywords, intent_signals). For each: does it serve a real function (advisor scoring, smart routing) that should be preserved? Or is it stale metadata that should be slimmed to match template?

**Iter 007** — RQ_SHORT: system-skill-advisor/SKILL.md content + tool count
RQ_FULL: Walk factual claims. Particular focus: 9 tool registrations (4 advisor + 5 skill_graph including propagate_enhances), public-vs-internal split as documented at line 671 of root README (already 069 audit notes "Nine tools cover the public surface (8 public + 1 internal)"). Verify SKILL.md description matches the resolved understanding.

## Track 4: system-spec-kit/mcp_server/README.md (1 iter)

**Iter 008** — RQ_SHORT: system-spec-kit/mcp_server/README.md sanity
RQ_FULL: Read `.opencode/skills/system-spec-kit/mcp_server/README.md` (323 lines, 9 anchors) — THE MODEL. Cross-check factual claims: tool count (39 per iter 001 in 056), package topology accuracy, directory tree, key files table, boundaries, entrypoints. Report any drift.

## Track 5: system-code-graph/mcp_server/README.md (1 iter)

**Iter 009** — RQ_SHORT: system-code-graph/mcp_server/README.md drift vs model
RQ_FULL: Read `.opencode/skills/system-code-graph/mcp_server/README.md` (263 lines, 9 anchors — already aligned to model). Cross-check factual claims (11 tools per CODE_GRAPH_TOOL_SCHEMAS, MCP server name `mk_code_index` vs `mk-code-index`, directory tree). Report drift items.

## Track 6: system-skill-advisor/mcp_server/README.md (3 iter)

**Iter 010** — RQ_SHORT: system-skill-advisor/mcp_server/README.md gap analysis
RQ_FULL: Current state (66 lines, 4 anchors): OVERVIEW, STRUCTURE, ENTRYPOINTS, RELATED. Missing 5 sections from the 9-anchor model: TABLE OF CONTENTS, ARCHITECTURE (with diagram), PACKAGE TOPOLOGY, DIRECTORY TREE, KEY FILES, BOUNDARIES AND FLOW, VALIDATION. List what each missing section should cover, with line ranges from the actual codebase to source facts.

**Iter 011** — RQ_SHORT: system-skill-advisor/mcp_server/README.md target scope
RQ_FULL: Read the actual `.opencode/skills/system-skill-advisor/mcp_server/` source: handlers, lib (lib/context, lib/scorer/lanes, lib/skill-graph, ...), tools, scripts (routing-accuracy), stress_test (search-quality, skill-advisor), tests. Produce an outline for the expanded README: per-anchor section with the source facts to cover (architecture diagram concept, directory tree, key files table, boundary rules, entrypoints table).

**Iter 012** — RQ_SHORT: system-skill-advisor/mcp_server/README.md draft outline
RQ_FULL: From iter 010 + 011, draft the section-by-section content sketch (NOT prose; just bullet points per section) that sonnet @markdown will use as input for the actual rewrite. Target ~280 lines.

## Track 7: system-skill-advisor/references/ (4 iter)

**Iter 013** — RQ_SHORT: skill-advisor/references/ existing-doc audit
RQ_FULL: Read all 3 existing files in `.opencode/skills/system-skill-advisor/references/` (legacy-tool-bridge.md, db-path-policy.md, standalone-mcp-shape.md). For each: is content current? Are any claims stale? Any anchor pairs broken? Style consistent across the 3 files (frontmatter shape, ANCHOR sections)?

**Iter 014** — RQ_SHORT: advisor-scorer.md new-doc spec
RQ_FULL: Author a complete specification for a new reference doc `advisor-scorer.md` covering: (a) how lane attribution works (lexical vs semantic vs graph lanes per SKILL.md), (b) scorer logic + confidence thresholds, (c) why lane attribution is safety-critical for prompt isolation. Cite the actual scorer source files in `mcp_server/lib/scorer/`. Output: front matter shape + section outline + 2-3 critical facts per section.

**Iter 015** — RQ_SHORT: propagate-enhances.md + skill-graph-extraction-plan.md specs
RQ_FULL: Author specs for TWO new docs: (1) `propagate-enhances.md` covering the internal `skill_graph_propagate_enhances` tool's role + invariants + when it runs; (2) `skill-graph-extraction-plan.md` covering the planned `lib/skill-graph/` extraction (line 189 of SKILL.md gestures at it — verify status). Output 2 specs.

**Iter 016** — RQ_SHORT: tool-ids-reference.md new-doc spec
RQ_FULL: Author a spec for `tool-ids-reference.md` — a table covering all 9 public tool IDs (4 advisor_* + 5 skill_graph_*) with: tool name, namespace (`mcp__mk_skill_advisor__*`), one-line purpose, typical args. Cross-check against `tools/index.ts` and `tools/skill-graph-tools.ts`.

## Track 8: system-code-graph/references/ (4 iter)

**Iter 017** — RQ_SHORT: code-graph-readiness-check.md new-doc spec
RQ_FULL: Author a spec for `code-graph-readiness-check.md` covering what `ensureCodeGraphReady()` validates pre-tool-dispatch. Read `lib/code-graph-db.ts` + handlers' readiness gates. Cover: preconditions, failure modes, recovery procedures (cite `lib/recovery-procedures.ts`).

**Iter 018** — RQ_SHORT: ownership-boundary.md new-doc spec
RQ_FULL: Author a spec for `ownership-boundary.md` — why deep loops + coverage tools stay in system-spec-kit while structural indexing lives in system-code-graph. Cite extraction packets (007 line). Cover the integration points: how does system-spec-kit's deep-loop use system-code-graph's read paths?

**Iter 019** — RQ_SHORT: database-path-policy.md new-doc spec
RQ_FULL: Author a spec for `database-path-policy.md` — where `code-graph.sqlite` lives, environment overrides (SPECKIT_CODE_GRAPH_DB_DIR), migration considerations. Mirror system-skill-advisor/references/db-path-policy.md style. Cite `core/config.ts`.

**Iter 020** — RQ_SHORT: residual-gap finder
RQ_FULL: With awareness of iter 4-5 + 17-19 findings, search system-code-graph's SKILL.md + mcp_server/ for additional architectural decisions that warrant their own reference doc (e.g., graph quality thresholds, doctor apply policy, CCC feedback loop semantics). If found, author one more spec. If not found, mark "no additional gaps."
