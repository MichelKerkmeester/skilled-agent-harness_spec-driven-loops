---
title: "Changelog: Phase 14: sk-code Frontmatter Alignment [009-skill-frontmatter-alignment/014-sk-code]"
description: "Chronological changelog for the Phase 14: sk-code Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/014-sk-code` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

sk-code's 88 reference and asset docs now carry exactly the canonical frontmatter contract, making the campaign's largest skill fully valid routing signal for the advisor doc harvest. The phase scaled the pilot recipe from 4 docs to 88 by replacing per-file edits with a digest sweep plus one assertion-guarded batch patch, and proved the recipe holds at an order of magnitude more volume.

### Added

- None.

### Changed

- Normalized frontmatter across all 88 sk-code reference and asset docs using a digest-sweep-and-batch-patch recipe. 76 docs carrying only title and description received full trigger_phrases, importance_tier, and contextType blocks with surface-qualified phrases ("webflow swiper patterns", "opencode python quality standards", "motion dev decision matrix") so per-surface trees stay distinguishable to the router.
- The 12 webflow reference docs with pre-existing partial blocks were normalized in place: over-cap phrase lists trimmed to the 8 strongest, mixed-case tokens lowercased, single-word phrases replaced with multi-word forms, and a stray keywords key removed.
- Seven contract and gate docs were tiered important: the router contracts (smart_routing.md, stack_detection.md), the universal severity contract (code_quality_standards.md), the webflow enforcement and verification-workflow gates, and the two verification-gate checklists in assets. Router docs and phase_detection.md received contextType general; everything else received implementation except multi_agent_research.md (research) and decision_matrix.md (planning).

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill sk-code --coverage - PASS, mode=coverage scope=sk-code docs=88 carrying-detailed-block=88 violations=0 (baseline was violations=88)
- Batch patch guards - PASS, patched=88 of 88 with body-suffix assertions; no folded scalars or missing fences encountered
- Python local-mode smoke ("webflow swiper patterns", flag on) - PASS, sk-code first at 0.95 confidence with !webflow swiper patterns(signal) in the match reason
- Diff hygiene - PASS, git diff --stat scoped to sk-code shows exactly 88 files (611 insertions, 63 deletions); sampled hunks are frontmatter-only
- Live daemon matchedDocs smoke - DEFERRED, rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/sk-code/references/motion_dev/*.md (7)` | Modified | Full contract block added |
| `.opencode/skills/sk-code/references/opencode/*/.md (19)` | Modified | Full contract block added |
| `.opencode/skills/sk-code/references/{phase_detection,smart_routing,stack_detection}.md (3)` | Modified | Contract block; router contracts tiered important, contextType general |
| `.opencode/skills/sk-code/references/universal/*.md (4)` | Modified | Contract block; severity contract tiered important |
| `.opencode/skills/sk-code/references/webflow/*/.md (35)` | Modified | Contract block added or partial blocks normalized; keywords key dropped |
| `.opencode/skills/sk-code/assets/*/.md (20)` | Modified | Full contract block added; 2 verification gates tiered important |

### Follow-Ups

- Live-daemon matchedDocs verification is deferred until every advisor-attached session ends and a fresh session respawns the daemon with the doc-trigger flag enabled.
- The spec stub inventory overcounted assets (27 including READMEs vs. the checker's 20 in-scope). Scope and outcome are unaffected.
