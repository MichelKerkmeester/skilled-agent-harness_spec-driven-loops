# Changelog

All notable changes to this project will be documented in this file.

## [0.0.4] - 2026-04-19

### Added

- **DESIGN.md v2 format** — 17-section output (14 core + 4 optional), up from 9 sections in v1. New sections:
  - Section 0: Brand Context (company identity, audience, personality with design evidence)
  - Section 2.5: Dark Mode System (full parallel color mapping, not just overrides)
  - Section 7: Content & Voice (tone, casing, button patterns, emoji policy, voice examples)
  - Section 9: Accessibility Contract (WCAG target, contrast table, focus spec, ARIA patterns)
  - Section 11: State Matrix (loading/empty/error/disabled/success per component)
  - Section 12: Iconography (system detection, sizing scale, substitution)
  - Sections 14-17: Optional (Pattern Compositions, Platform Adaptations, i18n, Design Tokens Dictionary)

- **4-layer stability classification** — Every token classified as infrastructure (L1), system (L2), campaign (L3), or content (L4). DESIGN.md documents only L1+L2 as permanent system; L3 noted as campaign; L4 excluded. Prevents product image colors from contaminating the design system palette.
  - DOM structural region tagging (nav/header/main/footer/aside)
  - Multi-signal scoring: page coverage, usage dimensions, CSS variables, frequency, chromaticity
  - Applied to colors, typography, shadows, radius, and components

- **10-agent parallel pipeline** — Phase 2 launches 10 opus subagents simultaneously to write sections, plus a parallel proof task. Total pipeline target: under 4 minutes (down from 8+ minutes sequential).

- **`--fast` extraction flag** — One-flag speed optimization: maxPages=5, noInteraction=true, concurrency=8. Typical extraction: 60-120 seconds.

- **`--with-interaction` flag** — Interaction capture (hover/focus/active) is now opt-in instead of default. Eliminates hundreds of 2-second timeouts on interaction-heavy sites.

- **Live component preview in report** — report.html renders actual buttons, cards, inputs, and badges using extracted tokens with working hover states.

- **Dark mode variable grouping in report** — All variables displayed (no 15-row limit), grouped by role (backgrounds, text, borders, shadows).

- **Machine pre-validation step** (Step 20.5) — Automated hex verification: greps all hex values from generated DESIGN.md, cross-references against tokens.colorTokens + cssVariables + darkMode.variableDiff, auto-fixes 3-digit hex and phantoms before validation.

- **Enhanced writing knowledge base**:
  - writing-style-guide.md: 6 new patterns (comparative framing, named principles, frequency interpretation, intent narration, brand voice detection, self-containment checklist)
  - quality-checklist.md: 22 new checks across 6 categories (brand context, voice, accessibility, state, iconography, frequency)
  - anti-patterns.md: 8 new anti-patterns (AP-21 through AP-28: missing brand context, generic voice, no accessibility contract, state blindness, unnamed principles, convention assumption, frequency ignorance, emoji in formal brand)
  - color-role-taxonomy.md: frequency interpretation, brand vs structural classification, CSS variable naming
  - component-taxonomy.md: Use: line requirement, state matrix template, component decision logic

- **Enhanced extraction scripts**:
  - a11y-extract.ts: ARIA role statistics, tab order analysis, lang attribute, skip link detection, reduced-motion support, alt text coverage
  - icon-detect.ts: stroke width distribution, icon size scale, icon-to-label rate, color usage patterns
  - interaction-capture.ts: loading state detection (skeleton/spinner), empty state detection, error state detection
  - dom-collector.ts: structural region tagging (nav/header/main/footer/aside), nearest landmark, isInsideMedia flag

### Changed

- Default `noInteraction` changed from `false` to `true` (interaction capture now opt-in)
- Default `maxPages` changed from `20` to `8`
- CSS-in-JS hydration delay reduced from 2000ms to 1000ms
- Same-domain request delay reduced from 500ms to 300ms
- validate.ts: accepts colors from CSS variables, dark mode variableDiff, and hsl-derived values
- validate.ts: skips CSS class names, animation names, comma-separated font stacks, markdown table content
- validate.ts: supports both v1 (9-section) and v2 (17-section) section detection
- report.html: merged with proof.html into single page
- report.html: color palette split into Brand Colors vs Structural Colors
- report.html: DESIGN.md section shows download + copy buttons above embedded content
- SKILL.md: 3-phase parallel pipeline with 10 subagents + fallback sequential mode

### Fixed

- Preview/report black-on-black rendering on dark-dominant sites (inferBackground/inferTextColor now select by luminance)
- Shadow classification: rgba() commas no longer misclassify single-layer shadows as complex-stack
- Validate false positives: camelCase CSS properties, ALL-CAPS button labels, system fonts no longer flagged as unknown fonts

## [0.0.3] - 2026-04-17

### Added

- Universal AI agent support — entry point files for Claude Code, Cursor, GitHub Copilot, OpenAI Codex, Gemini CLI, Windsurf
- npm publish readiness — `tsc` build to `dist/`, compiled `bin` entry, `.npmignore`, `prepublishOnly` hook
- Full-auto execution mode — Steps 1-25 run without user confirmation, only pause on errors

## [0.0.2] - 2026-04-17

### Added

- Test infrastructure — Vitest with 50 tests covering clustering, validation, shadow splitting, token merging
- Multi-page dark mode detection with homepage-first fallback
- SPA wait strategy (`--wait-for css|selector:<s>`)
- Incremental extraction (`--merge-with`)
- Preview generator, report generator, fidelity proof, standalone CLI

### Fixed

- Shadow classification bug (rgba commas misclassified all shadows)
- Font name false positive (camelCase CSS properties flagged as fonts)

## [0.0.1] - 2026-04-05

### Added

- Initial release with 14-module TypeScript extraction pipeline
- Playwright crawler with stealth mode, 5-viewport screenshots
- OKLCH delta-E color clustering, typography/shadow/radius aggregation
- Dark mode, framework, icon, motion, accessibility detection
- Output validation, SKILL.md for Claude Code, 6 resource files, 4 examples
