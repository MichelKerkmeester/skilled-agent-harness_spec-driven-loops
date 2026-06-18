---
title: "Changelog: Phase 1: Frontmatter Benefit Investigation [009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation]"
description: "Chronological changelog for the Phase 1: Frontmatter Benefit Investigation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

The question "should skill references/assets carry detailed frontmatter?" now has an evidence-based answer instead of a guess. The detailed block (trigger_phrases, importance_tier, contextType) found on 103 of 369 reference/asset docs is consumed by nothing at runtime: the memory index only admits spec documents and constitutional memories, the skill advisor compiles only each skill's graph-metadata.json, and the code graph excludes skill folders by default. The 21 per-skill alignment phases can now normalize frontmatter without fear of destroying live routing signal.

### Added

- Created `research.md` with an inventory sweep across all 21 skills (103 of 369 reference/asset docs carry the detailed frontmatter block; per-skill breakdown in §2), a consumer audit tracing every runtime system to its gating code with file:line citations (§3), and a contract analysis documenting three incompatible answers in sk-doc's own templates (§4).
- Updated `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` to capture investigation scope, the three-track approach, executed tasks with evidence pointers, and the resolved operator decision.

### Changed

- Inventory sweep via `rg` and `find` across all 21 skills counted 103 reference/asset docs with the full `trigger_phrases`/`importance_tier`/`contextType` block and 11 with no frontmatter at all; the distribution tracks authoring workflow rather than functional need — docs written inside spec-kit-flavored sessions inherited spec-doc frontmatter.
- Consumer audit proved zero runtime consumption: `memory-parser.ts` `isIndexablePath` admits only spec documents and constitutional paths; `skill_graph_compiler.py` scans only each skill's `graph-metadata.json`; `index-scope.ts` excludes `.opencode/skills/` from code graph indexing by default.
- sk-doc contract analysis surfaced three incompatible answers: `frontmatter_templates.md` insists knowledge files carry no frontmatter; ~97% of actual docs carry at least `title`+`description`; and the catalog/README templates mark `trigger_phrases` as required, claiming routing effects the code does not perform.

### Fixed

- None.

### Follow-Ups

- Out-of-tree consumers cannot be fully excluded. The audit covered every runtime registered in this repo's configs plus repo-wide greps; a private script reading these fields would survive unnoticed. Values remain recoverable in git history after stripping.
- Per-skill counts are point-in-time. Each skill child phase must re-run the sweep before editing; new docs land continuously.
- The operator decision resolved to Option B with advisor-as-consumer: phases 002-022 author the full canonical block on all references and assets; the advisor doc-harvest consumer is built in a dedicated packet; Spec Kit Memory is permanently excluded as a consumer.

### Verification

- Inventory counts (103/369 detailed, 11 bare) - PASS - reproduced by commands in research.md appendix
- Memory-index gate excludes skill references - PASS - isIndexablePath admits only spec docs + constitutional paths (memory-parser.ts ~L1160-1180)
- Advisor reads only graph-metadata.json - PASS - skill_graph_compiler.py scan loop + indexSkillMetadata in skill-graph-db.ts
- Code graph excludes .opencode/skills/** by default - PASS - index-scope.ts CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS
- Strict validation of this packet - PASS - validate.sh <this folder> --strict (run at completion)
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `research.md` | Created | Full findings: inventory, consumer audit, contract analysis, recommendation |
| `spec.md` | Modified | Investigation scope, requirements, completion status |
| `plan.md` | Modified | Three-track approach record |
| `tasks.md` | Modified | Executed task list with evidence pointers |
| `implementation-summary.md` | Created | This summary and the pending operator decision |


