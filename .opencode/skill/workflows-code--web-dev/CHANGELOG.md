# Changelog - workflows-code--web-dev

All notable changes to the workflows-code--web-dev skill (formerly `workflows-code`).

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-dev-environment)

---

## [**1.0.9.0**] - 2026-01-26

Skill renamed from `workflows-code` to `workflows-code--web-dev` to distinguish from the new multi-stack variant `workflows-code--full-stack`.

---

### Changed

1. **Skill renamed** — `workflows-code` → `workflows-code--web-dev` for clarity
2. **Scope clarified** — Now explicitly for single-stack web projects (Webflow, vanilla JavaScript)

---

### Notes

- No functional changes to the skill itself
- All references, assets, and patterns remain identical
- For multi-stack projects (Go, Node.js, React, React Native, Swift), use `workflows-code--full-stack`

---

## [**1.0.8.5**] - 2026-01-26

Major enhancement adding **Phase 0: Research** stage, **6 new performance reference files**, and comprehensive quality fixes across **27 documents** verified by 5 parallel Opus agents.

---

### New

1. **Phase 0: Research stage** — Added to SKILL.md for complex analysis before implementation (10-agent methodology reference)
2. **Performance references** — 6 new files in `references/performance/`:
   - `cwv_remediation.md` — LCP, FCP, TBT, CLS optimization patterns with code examples
   - `resource_loading.md` — Preconnect, prefetch, preload, async CSS patterns
   - `webflow_constraints.md` — Platform limitations (TypeKit, jQuery, CSS generation) with workarounds
   - `third_party.md` — GTM delay with requestIdleCallback, analytics deferral patterns
3. **Research reference** — `references/research/multi_agent_patterns.md` with 10-agent specialization model
4. **Verification reference** — `references/verification/performance_checklist.md` for PageSpeed before/after protocol
5. **Expanded async_patterns.md** — From 104 → 511 lines with requestAnimationFrame, queueMicrotask, scheduler.postTask, browser compatibility tables

---

### Changed

1. **SKILL.md routing** — Fixed 6 kebab-case → snake_case file references
2. **validation_patterns.js** — Converted 44 methods + 45 variables from camelCase to snake_case (P0 fix)
3. **code_quality_checklist.md** — Fixed BEM convention (`.block--element` → `.block__element`)
4. **verification_workflows.md** — Fixed section ordering, step numbering (6→8 now 6→7)
5. **quick_reference.md** — Fixed 2 broken links to performance/security patterns
6. **Build scripts** — Updated naming conventions to snake_case across minify/verify/test scripts

---

### Fixed

1. **Checkbox markers** — `debugging_checklist.md` and `verification_checklist.md` (`-` → `□`)
2. **Template compliance** — All 27 reference files now follow snake_case naming, YAML frontmatter, emoji headers

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
