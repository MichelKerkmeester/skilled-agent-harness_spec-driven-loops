---
title: "Feature Research: Frontmatter Benefit Investigation - Skill Reference/Asset Frontmatter Audit"
description: "Evidence-based audit of who consumes detailed memory-style frontmatter on skill references and assets, why the practice is uneven, and what sk-doc prescribes."
trigger_phrases:
  - "frontmatter benefit research"
  - "trigger_phrases consumer audit"
  - "skill reference frontmatter findings"
importance_tier: "normal"
contextType: "research"
---
# Feature Research: Frontmatter Benefit Investigation - Skill Reference/Asset Frontmatter Audit

Evidence-based audit answering: what does the detailed frontmatter block on skill references/assets buy, why do some skills have it and others not, and what does sk-doc skill creation say?

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-001
- **Feature/Spec**: ./spec.md (009-skill-frontmatter-alignment / 001-frontmatter-benefit-investigation)
- **Status**: Complete
- **Date Started**: 2026-06-11
- **Date Completed**: 2026-06-11
- **Researcher(s)**: claude-fable (orchestrating session)
- **Reviewers**: operator (pending contract decision)
- **Last Updated**: 2026-06-11

**Related Documents**:
- Spec: ./spec.md
- Parent: ../spec.md (phase map for the 21 per-skill alignment children)
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary
Some skill references/assets carry detailed frontmatter (`trigger_phrases`, `importance_tier`, `contextType`) while most carry only default `title` + `description`. Before 21 per-skill alignment phases normalize anything, establish: who consumes the detailed block, why the distribution is uneven, and what sk-doc's skill-creation guidance prescribes.

### Current Behavior

Inventory across `.opencode/skills/*/references/**/*.md` and `.opencode/skills/*/assets/**/*.md` (369 docs total, 2026-06-11):

| Practice | Count | Share |
|----------|-------|-------|
| Detailed memory-style block (`trigger_phrases` + `importance_tier` + `contextType`) | 103 (79 references, 24 assets) | ~28% |
| `title` + `description` only | ~255 | ~69% |
| No frontmatter at all | 11 | ~3% |

Per-skill distribution of the detailed block (references with/total, assets with/total):

| Skill | References | Assets |
|-------|-----------|--------|
| cli-claude-code | 0/4 | 0/2 |
| cli-codex | 1/5 | 0/2 |
| cli-opencode | 0/7 | 0/2 |
| deep-ai-council | 15/15 | 2/3 |
| deep-context | 0/10 | 0/1 |
| deep-improvement | 17/23 | 8/11 |
| deep-loop-runtime | 4/4 | — |
| deep-research | 0/13 | 0/2 |
| deep-review | 3/10 | 0/2 |
| mcp-chrome-devtools | 0/3 | — |
| mcp-click-up | 3/3 | — |
| mcp-code-mode | 0/5 | 0/2 |
| sk-code | 12/68 | 7/27 |
| sk-code-review | 0/10 | — |
| sk-doc | 2/14 | 7/25 |
| sk-git | 0/7 | 0/3 |
| sk-prompt | 0/2 | 0/3 |
| sk-prompt-models | 0/12 | 0/2 |
| system-code-graph | 6/7 | — |
| system-skill-advisor | 14/15 | — |
| system-spec-kit | 2/41 | 0/4 |

The block is all-or-nearly-all in deep-ai-council, deep-loop-runtime, mcp-click-up, system-code-graph, and system-skill-advisor; partial in deep-improvement, sk-code, deep-review, sk-doc, system-spec-kit, cli-codex; and absent in the remaining ten skills.

### Key Findings

1. **No runtime system consumes the detailed block on references/assets.** The audit covered all three plausible consumers:
   - *Spec Kit Memory indexing*: `mcp_server/lib/parsing/memory-parser.ts` (`isIndexablePath`, ~line 1160) admits only (a) canonical spec documents under `specs/**` and (b) constitutional memories under `.opencode/skills/*/constitutional/`. Regular references/assets never enter the memory index, so their `trigger_phrases` can never fire `memory_match_triggers` and their `importance_tier` never influences ranking. `handlers/memory-save.ts` enforces the same boundary for saves.
   - *Skill Advisor*: `system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` scans **only** each skill's root `graph-metadata.json` ("Skills without graph-metadata.json are silently skipped"), and `lib/skill-graph/skill-graph-db.ts` (`indexSkillMetadata`) likewise reads only `graph-metadata.json` (+ adjacent SKILL.md). Advisor routing uses `derived.trigger_phrases` from that file (`skill_advisor.py:632`, schema cap of 24 phrases in `schemas/skill-derived-v2.ts:43`). Per-doc frontmatter is never read.
   - *Code Graph*: `mcp_server/lib/utils/index-scope.ts` excludes `**/.opencode/skills/**` from code-graph indexing by default (`CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS`, opt-in via `SPECKIT_CODE_GRAPH_INDEX_SKILLS`), and the code graph does not interpret these fields regardless.

2. **The block is spec-doc/memory frontmatter that leaked into knowledge files.** The detailed block is byte-for-byte the contract used by memory-indexed spec documents — the `level_1/spec.md` template itself ships `trigger_phrases`, `importance_tier`, `contextType`, and `_memory.continuity`. Skills whose reference docs were authored inside spec-kit-adjacent workflows (the deep-* family, system-skill-advisor, system-code-graph, parts of sk-code) inherited the convention; docs authored as plain knowledge files got `title` + `description`. The distribution tracks authoring workflow, not any functional need.

3. **sk-doc's guidance is internally contradictory three ways.**
   - `references/skill_creation.md` focuses frontmatter quality on SKILL.md (`name`/`description` drive skill selection) and defers to `assets/frontmatter_templates.md` for everything else.
   - `assets/frontmatter_templates.md` §2 is unambiguous: Knowledge files → "❌ Never" add frontmatter, "Remove frontmatter if present" — which contradicts both observed practices (~97% of references/assets have at least title+description).
   - sk-doc's own templates require the opposite for adjacent doc types: `assets/feature_catalog/feature_catalog_snippet_template.md:33` marks `trigger_phrases` "required — drives skill-advisor routing and memory search", and `assets/readme/readme_template.md:67` prescribes 3-8 phrases for "Search, memory and skill routing". Finding 1 shows that the claimed advisor/memory consumption does not hold for per-doc frontmatter (the advisor reads `graph-metadata.json`, not docs).

4. **The benefit today is indirect at best.** Plausible residual value of the detailed block: (a) a curation hint for humans/AI when hand-maintaining the skill's `graph-metadata.json` `derived.trigger_phrases` (capped at 24 per skill, so per-doc phrases mostly cannot all promote anyway); (b) forward-compatibility if skill docs are ever opted into memory indexing. Costs are concrete: contradiction with the documented contract, an implied programmatic interface that does not exist, phrase rot with no validator, and inconsistent authoring guidance for every new doc.

### Recommendations

**Primary Recommendation (Option A)**: Canonical contract = `title` + `description` only for `references/**` and `assets/**`. Strip `trigger_phrases`, `importance_tier`, and `contextType` from the 103 docs during phases 002-022 (values are preserved in git history; any phrase worth keeping should be promoted into the skill's `graph-metadata.json` `derived.trigger_phrases`, which IS consumed). Update `frontmatter_templates.md` (inside 016-sk-doc) to legitimize title+description for knowledge files — the current "Never" rule contradicts ~97% of practice and should change rather than be enforced.

**Alternative Approaches**:
- **Option B**: Standardize the full block on every reference/asset AND build a consumer (opt skill docs into memory indexing behind a flag). Trade-off: real implementation cost in the memory pipeline, index growth (~370 extra docs), and the benefit is speculative — `memory_search` is scoped to spec docs and saved memory by design (per CLAUDE.md routing rules).
- **Option C (status quo)**: Do nothing. Trade-off: the three-way guidance contradiction keeps generating drift with every new doc; rejected as it defeats the parent phase's purpose.

**Decision owner**: operator. Phases 002-022 execute whichever contract is picked; their specs are written contract-agnostic ("apply the canonical contract").

**DECISION (2026-06-11)**: The operator picked **Option B with a corrected consumer**. The consumer is the **skill advisor**, not Spec Kit Memory: the advisor harvests per-doc frontmatter from references/assets into doc-level rows in skill-graph.sqlite (flag-gated, per-skill normalized, `matched_docs` pointers in `advisor_recommend` responses). Spec Kit Memory will **never** index skill docs — explicit operator directive that supersedes the memory-indexing variant sketched under Option B above; the memory path gate stays closed by design. Cost was explicitly not a constraint. The full block is authored on all references and assets (READMEs exempt) in phases 002-022; the consumer is built in a dedicated skilled-agent-orchestration packet.
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

### Executive Summary
About a quarter of skill reference/asset docs (103 of 369) carry a detailed memory-style frontmatter block that looks load-bearing but is not: the memory index refuses non-spec, non-constitutional paths; the skill advisor compiles only per-skill `graph-metadata.json`; and the code graph excludes skill folders by default. The block is an authoring-workflow artifact — docs written inside spec-kit-flavored workflows inherited spec-doc frontmatter, docs written as plain knowledge files did not.

sk-doc, the skill that owns documentation contracts, currently gives three incompatible answers (never add frontmatter to knowledge files; title+description in practice; trigger_phrases required on catalog/README templates "for routing" that code does not perform). The recommended fix is to declare title+description the canonical contract for references/assets, strip the dead fields skill by skill (phases 002-022), promote any genuinely useful phrases into each skill's `graph-metadata.json`, and amend sk-doc's frontmatter rules to match.

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Code | Memory index path gate | `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` (`isIndexablePath`) | High |
| Code | Memory save boundary | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | High |
| Code | Advisor graph compiler input | `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py:161-208` | High |
| Code | Advisor metadata indexer | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:674-680` | High |
| Code | Advisor trigger consumption + cap | `skill_advisor.py:632`, `schemas/skill-derived-v2.ts:43` | High |
| Code | Code-graph scope policy | `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts:41-47` | High |
| Documentation | Knowledge-file frontmatter rule | `.opencode/skills/sk-doc/assets/frontmatter_templates.md` §2 (By Document Type / Decision Framework) | High |
| Documentation | Conflicting template requirements | `sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:33`, `sk-doc/assets/readme/readme_template.md:67` | High |
| Documentation | Skill creation guidance | `.opencode/skills/sk-doc/references/skill_creation.md` | High |
| Survey | Frontmatter inventory sweep (rg/find over references+assets) | counts recorded in §2 above | High |
<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:constraints-limitations -->
## 4. CONSTRAINTS & LIMITATIONS

- **Audit scope**: Executable-code consumers were searched via field-name greps across `system-spec-kit/mcp_server`, `system-skill-advisor/mcp_server`, and `system-spec-kit/scripts`. Markdown mentions (docs describing the fields) were excluded as non-consumers. An out-of-tree or ad-hoc script consumer cannot be fully ruled out but none is referenced by any runtime config.
- **Scope boundary**: `feature_catalog/` and `manual_testing_playbook/` docs also carry `trigger_phrases` per their own templates; they are deliberately OUT of scope for phases 002-022 (separate template contracts, separate decision). This investigation covers `references/` and `assets/` only.
- **Counts are point-in-time** (2026-06-11); re-run the sweep at the start of each skill child phase before editing.
<!-- /ANCHOR:constraints-limitations -->

---

<!-- ANCHOR:appendix -->
## APPENDIX

### Glossary
- **Detailed block**: frontmatter carrying `trigger_phrases` (list), `importance_tier`, and `contextType` in addition to `title`/`description`.
- **Canonical contract**: the single frontmatter shape phases 002-022 will enforce for references/assets.

### Reproduction Commands
- Inventory: `rg -l "trigger_phrases:" .opencode/skills/*/references .opencode/skills/*/assets --glob '*.md'`
- No-frontmatter count: iterate `find .opencode/skills/*/references .opencode/skills/*/assets -name '*.md'` and test first line `== '---'`.
- Consumer audit: `rg -n "trigger_phrases" <mcp_server dirs> --glob '!*.md'`

### Change Log Detail

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-06-11 | 1.0.0 | Initial investigation completed | claude-fable |
<!-- /ANCHOR:appendix -->
