---
title: "Changelog: sk-design-interface and mcp-open-design integration test [145-mcp-open-design/009-design-skill-integration-test]"
description: "Chronological changelog for the MiMo and DeepSeek design-skill integration test phase."
trigger_phrases:
  - "phase changelog"
  - "integration test"
  - "model design comparison"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/design/002-mcp-open-design/009-design-skill-integration-test` (Level 1)
> Parent packet: `.opencode/specs/design/002-mcp-open-design`

### Summary

This phase tested whether the design doctrine steered different models the same way. MiMo v2.5 Pro and DeepSeek v4 Pro received the exact same brief: load `sk-design-interface`, follow the shared ground, anti-default and build loop with `mcp-open-design` and produce three self-contained HTML designs plus notes. Both models rejected the same three templated defaults, which showed that the steering came from the skill rather than from a single model's taste.

### Added

- Created packet 154.
- Wrote the identical model brief.
- Created six HTML files plus two `NOTES.md` files.
- Created MiMo outputs for a coffee-roaster landing page, an indie-podcast pricing page and a home-energy dashboard.
- Created DeepSeek outputs for the same three briefs.

### Changed

- Confirmed Open Design app state.
- Confirmed the MiMo and DeepSeek provider slugs.
- Dispatched the MiMo v2.5 Pro design seat.
- Dispatched the DeepSeek v4 Pro design seat.
- Collected and verified the six designs offline.
- Wrote the comparison verdict into `implementation-summary.md`.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Six HTML files plus two notes | PASS: all expected files exist. |
| Self-contained outputs | PASS: zero external CDN, font or script references in all six. |
| CSS variable token system | PASS: both models use `:root` plus `var()`. |
| Responsive plus reduced motion | PASS: three media queries and a reduced-motion block per page. |
| Real grounded copy | PASS: zero lorem or placeholder text. |
| Palette notes match CSS | MOSTLY: DeepSeek Wattbird amber `#F59E0B` appears in notes but not in the file. |
| House voice in notes | MIXED: MiMo PASS, DeepSeek FAIL due to em dashes. |
| Visual render quality | NOT JUDGED: files were not rendered in the record, and user opens them to judge. |
| Blocked tasks | PASS: no blocked tasks remaining. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `designs/open-design-live/{mimo,deepseek}/meridian-roasters.html` | Created | Live Open Design generations, model-pinned per arm. |
| `designs/mimo/0{1,2,3}-*.html` and `NOTES.md` | Created | MiMo's three designs and rationale. |
| `designs/deepseek/0{1,2,3}-*.html` and `NOTES.md` | Created | DeepSeek's three designs and rationale. |

### Follow-Ups

- The six HTML designs and two notes files were collected.
- Each HTML file was opened offline and confirmed self-contained.
- MiMo and DeepSeek were compared per brief and overall.
- The comparison verdict was written into `implementation-summary.md`.
