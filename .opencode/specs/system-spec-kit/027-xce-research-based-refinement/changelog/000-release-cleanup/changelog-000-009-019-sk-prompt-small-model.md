---
title: "Changelog: Phase 19: sk-prompt-models Frontmatter Alignment [009-skill-frontmatter-alignment/019-sk-prompt-models]"
description: "Chronological changelog for the Phase 19: sk-prompt-models Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-models` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

All 14 sk-prompt-models reference and asset docs now carry exactly the canonical frontmatter contract, turning the per-model prompt-craft hub into valid routing signal for the advisor doc harvest. This was the campaign's first full net-new authoring phase: no doc carried the detailed block at baseline, and the seven model profiles had no description at all.

### Added

- Formal frontmatter contract authored on all seven model profiles in `references/models/{deepseek-v4-pro,glm-5.1,kimi-k2.6,mimo-v2.5-pro,minimax-2.7,minimax-m3,qwen3.6}.md`. Each gained a one-line description naming the model, its framework, and pre-planning density; trigger phrases embed the model name (e.g., "minimax m3 prompt framework", "deepseek dispatch scaffold") so each profile routes distinctly. Unconsumed registry keys (model_id, profile_of, status, last_benchmarked) were dropped — status and benchmark lineage are maintained in `_index.md` and `model-profiles.json`.

### Changed

- trigger_phrases, importance_tier, and contextType added to five non-profile reference docs (`references/{context-budget,models/_index,output-verification,pattern-index,quota-fallback}.md`) and two asset docs (`assets/{cli_prompt_quality_card,confidence-scoring-rubric}.md`). All kept their existing titles and descriptions.
- Tier `important` assigned only to `cli_prompt_quality_card.md`, the canonical cross-skill prompt-quality contract. The historical minimax-2.7 profile is tiered `deprecated` with contextType `research` to keep it from outranking the active minimax-m3 profile in routing. All other docs are tier `normal`.

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill sk-prompt-models --coverage - PASS — docs=14, carrying-detailed-block=14, violations=0
- Python local-mode smoke ("minimax m3 prompt framework", flag on) - PASS — sk-prompt-models first at 0.95 with !minimax m3 prompt framework(signal) in the match reason
- Diff hygiene - PASS — git diff shows only frontmatter hunks in the 14 files
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 10 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/sk-prompt-models/references/models/{deepseek-v4-pro,glm-5.1,kimi-k2.6,mimo-v2.5-pro,minimax-m3,qwen3.6}.md` | Modified | Full contract authored; description added; registry keys dropped; tier normal, contextType implementation |
| `.opencode/skills/sk-prompt-models/references/models/minimax-2.7.md` | Modified | Same cleanup; tier deprecated, contextType research (historical benchmark record) |
| `.opencode/skills/sk-prompt-models/references/models/_index.md` | Modified | trigger_phrases/tier/contextType added; tier normal, contextType general |
| `.opencode/skills/sk-prompt-models/references/{context-budget,output-verification,quota-fallback}.md` | Modified | trigger_phrases/tier/contextType added; contextType implementation |
| `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Modified | trigger_phrases/tier/contextType added; contextType general |
| `.opencode/skills/sk-prompt-models/assets/cli_prompt_quality_card.md` | Modified | trigger_phrases/tier/contextType added; tier important, contextType general |
| `.opencode/skills/sk-prompt-models/assets/confidence-scoring-rubric.md` | Modified | trigger_phrases/tier/contextType added; contextType implementation |

### Follow-Ups

- Live-daemon verification is campaign-level. The running advisor daemon predates the launcher allowlist fix, so matchedDocs cannot be observed live until every advisor-attached session cycles and a fresh session respawns it.
- Profile status and last_benchmarked no longer live in profile frontmatter. These fields now exist only in the `_index.md` table and `model-profiles.json`; scripts reading profile frontmatter for status must switch to those sources.
