---
title: "Implementation Summary: Frontmatter Benefit Investigation"
description: "The detailed memory-style frontmatter on skill references/assets has no runtime consumer; it is an authoring-workflow artifact, and sk-doc's guidance contradicts itself about it three ways."
trigger_phrases:
  - "frontmatter investigation findings"
  - "no consumer for reference trigger_phrases"
  - "frontmatter contract decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation"
    last_updated_at: "2026-06-11T06:10:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Investigation complete; findings and recommendation recorded"
    next_safe_action: "Build advisor doc-harvest consumer packet; pilot deep-loop-runtime"
    blockers: []
    key_files:
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-frontmatter-benefit-investigation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No runtime system consumes trigger_phrases/importance_tier/contextType on references/assets today."
      - "Operator picked Option B with the skill advisor as sole consumer; spec memory never indexes skill docs."
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
| **Spec Folder** | 001-frontmatter-benefit-investigation |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The question "should skill references/assets carry detailed frontmatter?" now has an evidence-based answer instead of a guess. The detailed block (`trigger_phrases`, `importance_tier`, `contextType`) found on 103 of 369 reference/asset docs is consumed by nothing at runtime: the memory index only admits spec documents and constitutional memories, the skill advisor compiles only each skill's `graph-metadata.json`, and the code graph excludes skill folders by default. The 21 per-skill alignment phases can now normalize frontmatter without fear of destroying live routing signal.

### Frontmatter Inventory

You can now see exactly where the practice diverged: per-skill counts in research.md §2 show the detailed block is near-universal in five skills (deep-ai-council, deep-loop-runtime, mcp-click-up, system-code-graph, system-skill-advisor), partial in six, and absent in ten. The split tracks authoring workflow — docs written inside spec-kit-flavored sessions inherited spec-doc frontmatter — not functional need.

### Consumer Audit

Each plausible consumer was traced to its gating code with file:line citations (research.md §3 sources table). The headline: per-doc `trigger_phrases` never reach `memory_match_triggers` or advisor scoring. The phrases that DO drive advisor routing live in each skill's `graph-metadata.json` `derived.trigger_phrases`, capped at 24 by schema.

### sk-doc Contract Analysis

sk-doc currently gives three incompatible answers: `frontmatter_templates.md` says knowledge files should carry NO frontmatter; ~97% of actual docs carry at least title+description; and sk-doc's own catalog/README templates mark `trigger_phrases` as required, claiming routing effects the code does not perform. Phase 016-sk-doc owns reconciling this once the contract is decided.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| research.md | Created | Full findings: inventory, consumer audit, contract analysis, recommendation |
| spec.md | Modified | Investigation scope, requirements, completion status |
| plan.md | Modified | Three-track approach record |
| tasks.md | Modified | Executed task list with evidence pointers |
| implementation-summary.md | Created | This summary and the pending operator decision |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read-only investigation in a single session: inventory sweep via rg/find over all 21 skills, consumer tracing by reading the actual gating functions (not docs about them), and contract analysis from sk-doc's own files. Every claim in research.md cites a file, and the sweep commands are recorded for re-runs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| OPERATOR DECISION (2026-06-11): Option B, advisor-as-consumer | Cost is not a constraint and the upside is wanted. The skill advisor becomes the sole consumer of per-doc frontmatter (doc-level harvest into skill-graph.sqlite, matched_docs in recommendations); Spec Kit Memory never indexes skill docs - hard boundary. Supersedes the Option A recommendation below. |
| Recommend Option A (title+description only) | The detailed block has zero runtime consumers on these doc types; keeping it institutionalizes dead metadata and the guidance contradiction. Useful phrases belong in graph-metadata.json, which IS consumed. |
| Keep feature_catalog/ and manual_testing_playbook/ out of scope | Those doc types have their own template contracts; mixing them in would balloon 21 mechanical phases into a template-governance debate. |
| Write skill-child specs contract-agnostic | Phases 002-022 say "apply the canonical contract" so the operator's decision slots in without rewriting 21 specs. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Inventory counts (103/369 detailed, 11 bare) | PASS - reproduced by commands in research.md appendix |
| Memory-index gate excludes skill references | PASS - `isIndexablePath` admits only spec docs + constitutional paths (memory-parser.ts ~L1160-1180) |
| Advisor reads only graph-metadata.json | PASS - `skill_graph_compiler.py` scan loop + `indexSkillMetadata` in skill-graph-db.ts |
| Code graph excludes `.opencode/skills/**` by default | PASS - `index-scope.ts` CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS |
| Strict validation of this packet | PASS - `validate.sh <this folder> --strict` (run at completion) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Out-of-tree consumers cannot be fully excluded.** The audit covered every runtime registered in this repo's configs plus repo-wide greps; a private script reading these fields would survive unnoticed. Mitigation: values stay recoverable in git history after stripping.
2. **Counts are point-in-time (2026-06-11).** Each skill child phase must re-run the sweep before editing; new docs land continuously.
3. **The operator decision is RESOLVED (2026-06-11).** Option B with advisor-as-consumer: phases 002-022 author the full block on all references/assets; the advisor doc-harvest consumer is built in a dedicated skilled-agent-orchestration packet; Spec Kit Memory permanently excluded as a consumer.
<!-- /ANCHOR:limitations -->
