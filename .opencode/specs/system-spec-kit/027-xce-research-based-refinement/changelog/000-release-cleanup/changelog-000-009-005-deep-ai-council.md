---
title: "Changelog: Phase 5: deep-ai-council Frontmatter Alignment [009-skill-frontmatter-alignment/005-deep-ai-council]"
description: "Chronological changelog for the Phase 5: deep-ai-council Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/005-deep-ai-council` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

deep-ai-council's 18 reference and asset docs now carry exactly the canonical frontmatter contract, making the campaign's largest doc set so far fully valid routing signal for the advisor doc harvest. The phase exercised every drift class at once: enum normalization, missing-field backfill, net-new authoring, tier judgment, and phrase hygiene.

### Added

- Authored a full canonical frontmatter block from scratch on `prompt_pack_round.md`, which previously had no frontmatter at all.
- Added the two missing fields (`importance_tier`, `contextType`) to 4 docs that had `title`+`description`+`trigger_phrases` only: `loop_protocol.md`, `quick_reference.md`, `deep_ai_council_dashboard.md`, and `deep_ai_council_strategy.md`.

### Changed

- Captured a coverage-mode baseline showing all 18 docs failed: 13 on `contextType: reference` (the same natural-but-wrong enum the pilot found), 4 on missing `importance_tier`/`contextType`, and 1 with no frontmatter.
- Normalized `contextType` on all 13 references carrying the wrong enum: convergence rules, dispatch, failure handling, anti-patterns, seat diversity, scoring, and loop protocol moved to `planning`; graph support, command wiring, findings registry, folder layout, output schema, and state format moved to `implementation`.
- Promoted four docs from `normal` to `important` tier: `depth_dispatch.md` (seat-dispatch and no-recursive-counciling invariants), `folder_layout.md` (mandatory packet-local artifact layout), `output_schema.md` (single source of truth for the persist-artifacts parser), and `state_format.md` (append-only JSONL event contract).
- Repaired three trigger phrases to the lowercase multi-word rule: hyphenated `two-of-three-agree` became `two of three agree`, and uppercase `CLI`/`YAML` phrases were lowercased.
- Coverage check confirmed 18/18 docs conform (0 violations).
- Python local-mode smoke with the doc-trigger flag enabled routes "council escape hatches and two of three agree" to deep-ai-council first at 0.95 with two doc-signal matches.

### Fixed

- None.

### Follow-Ups

- Live-daemon verification is campaign-level; the running advisor daemon adopts the doc-trigger flag only after every advisor-attached session cycles.
- Prompt-pack phrases compete with sk-prompt: queries containing the bare token "prompt" rank sk-prompt above deep-ai-council, though council-specific phrasing routes correctly.

### Verification

- check-skill-doc-frontmatter.sh --skill deep-ai-council --coverage - PASS — docs=18, carrying-detailed-block=18, violations=0 (baseline: 18 violations)
- Python local-mode smoke ("council escape hatches and two of three agree", flag on) - PASS — deep-ai-council first at 0.95 with two (signal) doc matches
- Python local-mode smoke ("council seat verdict and round prompt pack", flag on) - PASS with caveat — deep-ai-council surfaces at 0.86 with !council seat verdict(signal); sk-prompt ranks first at 0.95 because the query contains "prompt"
- Diff hygiene - PASS — git diff -U0 hunk headers all inside leading fences across the 18 files
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `references/convergence/{convergence_signals,deep_mode,failure_handling}.md` | Modified | contextType to planning; phrase fix in convergence_signals |
| `references/convergence/depth_dispatch.md` | Modified | contextType to planning; tier to important |
| `references/{patterns/anti_patterns,patterns/seat_diversity_patterns,scoring/scoring_rubric}.md` | Modified | contextType to planning |
| `references/integration/loop_protocol.md` | Modified | Added tier normal + contextType planning |
| `references/integration/quick_reference.md` | Modified | Added tier normal + contextType general (operator cheat sheet) |
| `references/{integration/graph_support,patterns/command_wiring,scoring/findings_registry}.md` | Modified | contextType to implementation; phrase fixes in graph_support and command_wiring |
| `references/structure/{folder_layout,output_schema,state_format}.md` | Modified | contextType to implementation; tier to important |
| `assets/{deep_ai_council_dashboard,deep_ai_council_strategy}.md` | Modified | Added tier normal + contextType planning |
| `assets/prompt_pack_round.md` | Modified | Net-new canonical frontmatter block authored |


