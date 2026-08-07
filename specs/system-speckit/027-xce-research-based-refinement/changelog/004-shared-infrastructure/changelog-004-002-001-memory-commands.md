---
title: "Changelog: 001-memory-commands"
description: "Memory command presentation contracts were extracted into dedicated assets and `/memory:search` gained an open-ended startup and compact retrieval display contract."
trigger_phrases:
  - "004/002 001 memory commands changelog"
  - "memory command presentation split"
  - "memory search open ended startup"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands` (Level 2, Phase Parent)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation`

### Summary

The memory command family completed the router/presentation split across its four nested aspect phases: inventory/extract, author presentation Markdown, router rewire, and verify/UX. The visible UX change centers on `/memory:search`, which now starts with one open-ended retrieval question and uses compact grouped result displays.

### Added

- Presentation Markdown assets for memory-family startup questions, dashboards, and result displays.
- A `/memory:search` display contract that asks `What would you like to retrieve or analyze?` instead of dumping the old startup option list.

### Changed

- Memory command routers point to the presentation contracts instead of carrying display templates inline.
- Retrieval output is compact, grouped by leaf folder, and limited to score, id, and title unless trace is requested.

### Fixed

- Empty-result fallback labels and forbidden legacy labels were documented as contract checks rather than renderable output.

### Verification

| Check | Result |
|-------|--------|
| Nested phase map | PASS: 001-004 completed |
| Search startup contract | PASS: open-ended question present in presentation asset and router references it |
| Result-display contract | PASS: retrieval, empty-result, and analysis-mode templates present |
| Strict validation | PASS: final validation recorded in nested phase docs |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/memory/*.md` | Modified | Routers slimmed and pointed to presentation assets |
| `.opencode/commands/memory/assets/*_presentation.*` | Created | Display contracts for memory commands |
| `001-memory-commands/**` | Updated | Nested phase docs and verification evidence |

### Follow-Ups

- Cross-model runtime execution was represented by static contract checks in this pass; no external model dispatch was run.
