# Changelog - workflows-code

All notable changes to the workflows-code skill.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-dev-environment)

---

## [**1.0.8.4**] - 2026-01-24

Bug fixes restoring **3 missing minification scripts** and updating **25+ broken path references** across SKILL.md and deployment guides.

---

### New

1. **minify-webflow.mjs** — Batch minification script with manifest tracking for change detection
2. **verify-minification.mjs** — AST-based verification ensuring critical patterns (data selectors, DOM events, Webflow/Motion/gsap) are preserved
3. **test-minified-runtime.mjs** — Runtime testing in mock browser environment catching execution errors before deployment

---

### Fixed

1. **Missing scripts directory** — Created `.opencode/skill/workflows-code/scripts/` with all 3 minification scripts
2. **SKILL.md script paths** — Updated Common Commands section to reference correct skill-local paths
3. **minification_guide.md** — Fixed 10+ broken `scripts/` references to `.opencode/skill/workflows-code/scripts/`
4. **cdn_deployment.md** — Fixed 6 broken script path references
5. **Phase 1.5 missing from tables** — Added Code Quality Gate phase to overview tables in SKILL.md

---

### Changed

1. **Script location** — Scripts now bundled with skill at `scripts/` subdirectory instead of project root

---
