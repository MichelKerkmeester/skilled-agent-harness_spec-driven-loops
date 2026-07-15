---
title: "Changelog: Phase 18: sk-prompt Frontmatter Alignment [009-skill-frontmatter-alignment/018-sk-prompt]"
description: "Chronological changelog for the Phase 18: sk-prompt Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

sk-prompt's 5 reference/asset docs now carry exactly the canonical frontmatter contract, so the advisor doc harvest can route on them. Unlike the pilot, this phase was pure net-new authoring: every doc held title+description only, so all trigger phrases, tiers, and contextTypes were derived fresh from the doc bodies.

### Added

- None.

### Changed

- Authored trigger_phrases, importance_tier, and contextType for all 5 sk-prompt reference and asset docs. This was pure net-new authoring: every doc held title and description only, and all phrases were derived fresh from doc bodies ("depth thinking rounds", "clear scoring rubric", "rcaf json structure", "yaml template anchors").
- depth_framework.md was tiered important because it carries blocking phase-exit gates and the canonical energy-level table that other files reference as source of truth. All 5 docs received contextType implementation.
- The 3 format-guide assets (format_guide_json.md, format_guide_markdown.md, format_guide_yaml.md) had their folded multi-line description: > scalars collapsed to single-line scalars, as required by the contract's one-line description rule.

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill sk-prompt --coverage - PASS — docs=5, carrying-detailed-block=5, violations=0
- Python local-mode smoke ("depth thinking rounds clear scoring rubric", flag on) - PASS — sk-prompt first at 0.95 with !clear scoring rubric(signal) and !depth thinking rounds(signal)
- Diff hygiene - PASS — git diff shows only frontmatter hunks in the 5 files
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/sk-prompt/assets/format_guide_json.md` | Modified | Full block authored; description to one line |
| `.opencode/skills/sk-prompt/assets/format_guide_markdown.md` | Modified | Full block authored; description to one line |
| `.opencode/skills/sk-prompt/assets/format_guide_yaml.md` | Modified | Full block authored; description to one line |
| `.opencode/skills/sk-prompt/references/depth_framework.md` | Modified | Full block authored; tier to important |
| `.opencode/skills/sk-prompt/references/patterns_evaluation.md` | Modified | Full block authored |

### Follow-Ups

- Live-daemon matchedDocs verification is deferred until every advisor-attached session ends and a fresh session respawns the daemon with the doc-trigger flag enabled.
