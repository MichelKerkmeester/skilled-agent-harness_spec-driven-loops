---
title: "Implementation Summary: Phase 16: sk-doc Frontmatter Alignment"
description: "All 39 sk-doc docs now conform to the canonical contract and sk-doc's own guidance now teaches that contract instead of forbidding it."
trigger_phrases:
  - "sk-doc frontmatter summary"
  - "guidance reconciliation complete"
  - "frontmatter campaign final phase"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 39 docs conform and guidance reconciled"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-016-sk-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-sk-doc |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 39 sk-doc reference and asset docs now carry the canonical 5-field frontmatter contract, and sk-doc's own prescriptive guidance now teaches that contract instead of contradicting it. This mattered more here than in any sibling phase: sk-doc's assets define frontmatter practice for every other skill, and until this phase they instructed authors that knowledge files must never carry frontmatter while the advisor doc harvest required exactly the opposite.

### Part 1: Frontmatter normalization (39 docs)

The baseline had four doc classes. 28 docs carrying title+description only received the three missing fields; 7 docs with no frontmatter at all (agent_template plus the six flowchart examples) received a full prepended block with title and description authored from their H1 and intro; benchmark_creation trimmed its 12 trigger phrases to the 8 strongest and left `contextType: reference` for `implementation`; readme_creation gained the tier and contextType it lacked. The two benchmark templates are the special case: their leading fences are copyable `{{PLACEHOLDER}}` skeletons that a documented `cp` workflow copies verbatim into new benchmark folders, so they kept their skeleton fences and received only the `contextType: reference` to `general` enum fix.

### Part 2: Guidance reconciliation

`frontmatter_templates.md` is the canonical home: the knowledge-file NEVER rule is now scoped to knowledge files outside skill folders, and a full Skill Reference/Asset document type joins SKILL.md and Command across the doc-type tables, decision trees, Section 3 field reference, Section 4 template entry (with the advisor-harvest mechanism and the memory exclusion stated explicitly), Section 5 validation rules, and the Sections 6/7/9/10 sweeps. Both scaffold sources (`skill_reference_template.md`, `skill_asset_template.md`) now teach skeletons with the 5-field block so newly scaffolded docs are born conformant. Stale claims that skill-doc trigger_phrases drive memory search were rewritten to the true mechanism (advisor doc harvest; memory deliberately excludes skill docs) while spec-folder memory claims stayed untouched. `skill_creation.md` gained a contract pointer where it discusses the references and assets directories.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/references/**/*.md` (14 docs) | Modified | Frontmatter normalization; feature_catalog_creation + skill_creation also carry Part 2 body edits |
| `.opencode/skills/sk-doc/assets/**/*.md` (25 docs) | Modified | Frontmatter normalization; 7 docs received full prepended blocks |
| `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | Modified | Skill Reference/Asset doc type replaces the knowledge-NEVER rule (tables, trees, field reference, template, validation rules) |
| `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | Modified | Scaffold skeleton now includes the 5-field block plus field rules |
| `.opencode/skills/sk-doc/assets/skill/skill_asset_template.md` | Modified | Both skeletons and the decision-tree example now teach the contract |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md` | Modified | Memory-search claims rewritten to advisor doc harvest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Part 1 shipped as one assertion-guarded Python batch (every file's fence shape verified before patching); Part 2 shipped as surgical per-section edits, then the contract checker, the routing smoke, a stale-claim re-sweep, and a numstat diff review confirmed the result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Benchmark skeleton fences kept in place, enum fix only | Their leading fences are copyable `{{PLACEHOLDER}}` skeletons that the documented `cp` workflow copies verbatim; moving them into body code fences would break that workflow, so restructuring was not genuinely necessary. |
| Tier `important` for hvr_rules, core_standards, evergreen_packet_id_rule, validation, frontmatter_templates (benchmark_creation kept it) | These are the formal rule/contract docs other skills are held to: voice rules, structural validation rules, the evergreen invariant, DQI quality gates, and the canonical frontmatter contract itself. Templates and examples stay `normal`. |
| `contextType: implementation` for the seven creation-workflow references, `general` for rule sets, templates and flowcharts | Creation guides direct active document-production work; standards, scaffolds and diagram examples are consulted from any context. |
| Knowledge-file rule scoped, not deleted | Knowledge files outside `.opencode/skills/*/` genuinely should stay frontmatter-free; only the skill reference/asset subset moved to the 5-field contract, so the guidance distinguishes the two instead of flipping wholesale. |
| Smoke via Python local mode, not the live daemon | The live daemon adopts the doc-trigger flag only after a session cycle (packet 145 T025); the Python path reads the same files under the same flag and proves routing now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill sk-doc --coverage` | PASS — docs=39, carrying-detailed-block=39, violations=0 |
| Python local-mode smoke ("dqi scoring bands", flag on) | PASS — sk-doc surfaces at 0.74 with `!dqi scoring bands(signal)`; sk-prompt ties at 0.74 via a graph-family boost, sk-doc is the only doc-signal match |
| Stale-claim re-sweep (`grep` for memory search/Spec Kit Memory) | PASS — remaining hits are true claims: MCP server names in a permission table, install-guide filenames, an example H1, and the new advisor-mechanism statements |
| Diff hygiene (`git diff --numstat`) | PASS — deletions confined to seven in-scope files (2 frontmatter enum fixes, 1 frontmatter phrase trim, 4 Part 2 body-edit files); the other 32 files are pure frontmatter additions, and body edits stay inside the six Part 2 files |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon predates the doc-trigger flag adoption, so `matchedDocs` cannot be observed live until a fresh session respawns it (tracked as packet 145 T025).
2. **Benchmark skeleton placeholder phrases are weak routing signal.** The two benchmark templates expose `{{PLACEHOLDER}}` trigger phrases to the harvest because their leading fences must stay copyable; the noise is bounded (8 placeholder phrases across 2 docs) and disappears in copied, filled-in files.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
