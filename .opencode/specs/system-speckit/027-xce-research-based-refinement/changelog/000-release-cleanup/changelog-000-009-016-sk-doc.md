---
title: "Changelog: Phase 16: sk-doc Frontmatter Alignment [009-skill-frontmatter-alignment/016-sk-doc]"
description: "Chronological changelog for the Phase 16: sk-doc Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

All 39 sk-doc reference and asset docs now carry the canonical 5-field frontmatter contract, and sk-doc's own prescriptive guidance now teaches that contract instead of contradicting it. This mattered more here than in any sibling phase: sk-doc's assets define frontmatter practice for every other skill, and until this phase they instructed authors that knowledge files must never carry frontmatter while the advisor doc harvest required exactly the opposite.

### Added

- None.

### Changed

- Normalized frontmatter across all 39 sk-doc reference and asset docs and reconciled sk-doc's own prescriptive guidance to teach the canonical contract instead of contradicting it.
- 28 docs carrying only title and description received trigger_phrases, importance_tier, and contextType appended inside their existing fences. 7 docs with no frontmatter (agent_template.md and six flowchart examples) received a full 5-field block prepended above their H1.
- readme_creation.md gained the missing importance_tier and contextType fields.
- frontmatter_templates.md was rewritten: the knowledge-file NEVER rule is now scoped to docs outside skill folders, and a full Skill Reference/Asset document type was added across all doc-type tables, decision trees, field references, template entries, and validation rules.
- Both scaffold templates (skill_reference_template.md, skill_asset_template.md) now teach skeletons with the 5-field block so newly scaffolded docs are born conformant.
- Stale claims that skill-doc trigger_phrases drive memory search were rewritten to the true advisor doc harvest mechanism in feature_catalog_snippet_template.md and feature_catalog_creation.md.
- skill_creation.md gained a contract pointer where it discusses the references and assets directories.

### Fixed

- The two benchmark template skeletons (benchmark_report_template.md, benchmark_source_template.md) carried contextType: reference, which is not a valid enum value. Corrected to contextType: general while preserving their copyable {{PLACEHOLDER}} fences.
- benchmark_creation.md carried 12 trigger phrases, exceeding the contract's 8-item cap, and had contextType: reference instead of implementation. Trimmed to the 8 strongest phrases and corrected.

### Verification

- check-skill-doc-frontmatter.sh --skill sk-doc --coverage - PASS — docs=39, carrying-detailed-block=39, violations=0
- Python local-mode smoke ("dqi scoring bands", flag on) - PASS — sk-doc surfaces at 0.74 with !dqi scoring bands(signal); sk-prompt ties at 0.74 via a graph-family boost, sk-doc is the only doc-signal match
- Stale-claim re-sweep (grep for memory search/Spec Kit Memory) - PASS — remaining hits are true claims: MCP server names in a permission table, install-guide filenames, an example H1, and the new advisor-mechanism statements
- Diff hygiene (git diff --numstat) - PASS — deletions confined to seven in-scope files (2 frontmatter enum fixes, 1 frontmatter phrase trim, 4 Part 2 body-edit files); the other 32 files are pure frontmatter additions, and body edits stay inside the six Part 2 files
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 17 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/sk-doc/references/*/.md (14 docs)` | Modified | Frontmatter normalization; feature_catalog_creation + skill_creation also carry Part 2 body edits |
| `.opencode/skills/sk-doc/assets/*/.md (25 docs)` | Modified | Frontmatter normalization; 7 docs received full prepended blocks |
| `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | Modified | Skill Reference/Asset doc type replaces the knowledge-NEVER rule (tables, trees, field reference, template, validation rules) |
| `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | Modified | Scaffold skeleton now includes the 5-field block plus field rules |
| `.opencode/skills/sk-doc/assets/skill/skill_asset_template.md` | Modified | Both skeletons and the decision-tree example now teach the contract |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md` | Modified | Memory-search claims rewritten to advisor doc harvest |

### Follow-Ups

- Live-daemon matchedDocs verification is deferred until a fresh session respawns the daemon with the doc-trigger flag enabled.
- Benchmark skeleton placeholder phrases are weak routing signal: the two benchmark templates expose {{PLACEHOLDER}} trigger phrases because their leading fences must stay copyable. The noise is bounded and disappears in filled-in copies.
