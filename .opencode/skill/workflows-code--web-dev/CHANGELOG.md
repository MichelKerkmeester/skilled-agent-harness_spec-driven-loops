# Changelog - workflows-code--web-dev

All notable changes to the workflows-code--web-dev skill (formerly `workflows-code`).

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-dev-environment)

---

## [**1.0.9.3**] - 2026-02-14

New **form upload reference document** (633 lines, DQI 97/100), SKILL.md routing for upload-related tasks, and CDN version number cleanup across **7 files** (~35 instances → `{version}` placeholders).

---

### New

1. **`form_upload_workflows.md`** — Complete architecture reference for the FilePond-to-R2 file upload pipeline (11 sections: Overview, Architecture, Webflow Integration, FilePond Configuration, State Machine, Cloudflare Worker Proxy, Form Integration, MIME Type Reference, Troubleshooting, Pages & Deployment, Related Resources)

---

### Changed

**SKILL.md Routing:**

2. **`TASK_KEYWORDS`** — Added `FORM_UPLOAD` keyword group (upload, filepond, file upload, drag drop, mime type, r2 upload, file type, dropzone)
3. **Pseudocode router** — Added `form_upload_workflows.md` condition (`task.has_file_upload` or filepond/upload keywords)
4. **Use Case table** — Added row for file upload, FilePond, drag-drop, MIME types, R2 upload

**CDN Version Number Cleanup (7 files):**

5. **`form_upload_workflows.md`** — FilePond `@4.30.4` → `@{version}`; removed "Current Version" column from dependencies table
6. **`third_party_integrations.md`** — HLS.js `@1.6.11` → `@{version}` (7 occurrences); library examples `@1.0.0`/`@1.2.3` → `@{version}`; version pinning `@1.0` → `@{major.minor}`
7. **`animation_workflows.md`** — Motion.dev `@12.15.0` → `@{version}`; added note to check `global.html` for current pinned version
8. **`cdn_deployment.md`** — Version bump examples from specific (`1.3.12 → 1.3.13`) to generic (`X.Y.Z → X.Y.(Z+1)`); HTML update patterns → `{version}` placeholders
9. **`resource_loading.md`** — Lenis/Motion CDN URLs → `@{version}`; R2 script URLs `?v=1.2.31` → `?v={version}`
10. **`SKILL.md`** — Motion.dev version `@12.15.0` removed from Common Commands
11. **`hls_patterns.js`** — `@version 1.6.11` comment → "Check HTML source files for current pinned version"; `HLS_CDN_URL` const → `hls.js@{version}`

---

### Source

- Plan: `keen-jingling-graham.md` (Form Upload Reference Document plan)
- Source files: `input_upload.js`, `input_upload.css`, `form_submission.js`, `form_validation.js`, `form_persistence.js`, `werken_bij.html`, `vacature.html`
- Validation: `validate_document.py` exit 0, `extract_structure.py` DQI 97/100

---

## [**1.0.9.2**] - 2026-02-07

Inline comment style enforcement across **10 files** (~200 edits), router completeness fixes, and dead file removal.

---

### Deleted

1. **`bundling_patterns.md`** — Removed entirely (unreferenced in router, no keyword triggers, no cross-references)

---

### Changed

**Inline Comment Style Enforcement (5 `.js` assets):**

1. **`performance_patterns.js`** — File header converted to 3-line `// ───` format; 7 section headers from `// ───` to `/* ── */`; 2 WHAT comments removed
2. **`lenis_patterns.js`** — 8 section headers JSDoc → `/* ── */`; P0 commented-out export block deleted (16 lines); WHAT comments removed
3. **`wait_patterns.js`** — 5 WHAT comments removed/reworded to WHY
4. **`hls_patterns.js`** — 8 WHAT comments removed/reworded to WHY
5. **`validation_patterns.js`** — 21 WHAT comments removed/reworded to WHY; architecture layer comments kept

**Inline Comment Style Enforcement (5 `.md` references):**

6. **`webflow_patterns.md`** — 44 WHAT comments deleted, 1 reworded
7. **`third_party_integrations.md`** — 42 WHAT comments deleted, 1 reworded
8. **`animation_workflows.md`** — 22 WHAT comments deleted, 4 reworded
9. **`observer_patterns.md`** — 20 WHAT comments deleted (config trailing comments, narrating code)
10. **`swiper_patterns.md`** — 7 WHAT comments deleted/reworded

**Router Completeness (SKILL.md):**

11. **`TASK_KEYWORDS`** — Added `SCHEDULING` (requestIdleCallback, queueMicrotask, idle callback, postTask) and `THIRD_PARTY` (third-party, external library, finsweet, script loading) keyword groups
12. **Pseudocode router** — Added `async_patterns.md` condition (`task.has_scheduling_apis`) and `third_party_integrations.md` condition (`task.has_third_party`)
13. **Use Case table** — Added `async_patterns.md` row (RAF, requestIdleCallback, queueMicrotask, scheduling APIs)

---

### Source

- Style rules: `code_style_guide.md` Section 5 (WHY not WHAT, no commented-out code, section header format)
- Excluded: `code_style_guide.md` and `code_style_enforcement.md` (contain bad examples as teaching material)

---

## [**1.0.9.1**] - 2026-02-07

Incorporated performance optimization teachings from Spec 031 (`project-performance-analysis`) into reference files and pattern assets.

---

### New

1. **SharedObservers consolidation pattern** — New Section 7 in `observer_patterns.md` documenting the `window.SharedObservers` API, single-element and multi-element migration patterns, fallback strategy
2. **`wait_for_motion()`** — Event-driven Motion.dev waiting using `motion:ready` CustomEvent (replaces 17 polling loops). Added to `wait_patterns.js`
3. **`wait_for_image_with_timeout()`** — `Promise.race` wrapper for image loading with configurable timeout (default 2s). Added to `wait_patterns.js`
4. **Timeout hierarchy** — Standardized timeout values documented in `cwv_remediation.md`: 1s Motion.dev, 2s images, 3s desktop safety, 2s mobile safety (ADR-001)
5. **Mobile safety timeout** — Device-aware safety timeout with 2s mobile / 3s desktop in `cwv_remediation.md`

---

### Changed

1. **`cwv_remediation.md`** — Safety timeout section expanded with `<head>` positioning requirement, timeout hierarchy table, mobile detection code, `Promise.race` image timeout pattern
2. **`performance_patterns.md`** — will-change section expanded with anti-pattern: static `will-change` in CSS creates permanent compositor layers (9 static + 40+ premature declarations found in Spec 031)
3. **`SKILL.md`** — Observer patterns upgraded from `ON_DEMAND` to `CONDITIONAL` loading; SharedObservers keywords added to `OBSERVERS` trigger; Phase 1 visibility gates updated to prefer SharedObservers
4. **`observer_patterns.md`** — Related Resources section renumbered (7→8) to accommodate new SharedObservers section

---

### Source

- Spec: `005-project-name/031-project-performance-analysis`
- ADRs: ADR-001 (Timeout Values), ADR-002 (Motion.dev Ready Event)
- Implementation: SharedObservers migration in `video_player_hls_scroll.js`, `video_background_hls_hover.js`, `table_of_content.js`

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

1. **Missing scripts directory** — Created `.opencode/skill/workflows-code--web-dev/scripts/` with all 3 minification scripts
2. **SKILL.md script paths** — Updated Common Commands section to reference correct skill-local paths
3. **minification_guide.md** — Fixed 10+ broken `scripts/` references to `.opencode/skill/workflows-code--web-dev/scripts/`
4. **cdn_deployment.md** — Fixed 6 broken script path references
5. **Phase 1.5 missing from tables** — Added Code Quality Gate phase to overview tables in SKILL.md

---

### Changed

1. **Script location** — Scripts now bundled with skill at `scripts/` subdirectory instead of project root

---
