# Changelog

All notable changes to the workflows-code skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.3.6] - 2026-01-15

*Environment version: 1.0.3.6*

Performance patterns asset and 15 new reference files for comprehensive implementation guidance.

---

### Added

1. **Performance Patterns Asset** — `performance_patterns.js` with production-validated timing utilities:
   - Throttle/debounce constants (64ms pointermove, 180ms form validation, 200-250ms resize)
   - IntersectionObserver patterns with 0.1 threshold
2. **15 New Reference Files**:
   - `debugging/`: `debugging_workflows.md`, `error_recovery.md`
   - `implementation/`: `animation_workflows.md`, `css_patterns.md`, `focus_management.md`, `implementation_workflows.md`, `observer_patterns.md`, `performance_patterns.md`, `security_patterns.md`, `swiper_patterns.md`, `third_party_integrations.md`, `webflow_patterns.md`
   - `standards/`: `css_quick_reference.md`
   - `verification/`: `verification_workflows.md`

---

## [1.0.3.3] - 2026-01-11

*Environment version: 1.0.3.3*

Security hardening and documentation quality improvements.

---

### Fixed

1. **URL Validation XSS** — Protocol whitelist now rejects `javascript:` and `data:` schemes in `validation_patterns.js`
2. **35 Broken Markdown Links** — Cross-directory relative paths fixed across 16 reference files
3. **`debounce()` Default** — Added missing default delay (180ms) in `wait_patterns.js`
4. **SKILL.md Quick Reference Path** — Corrected `dist/` → `src/2_javascript/z_minified/`

---

### Changed

1. **Removed Deprecated `SafeDOM` Class** — 107 lines removed from `validation_patterns.js`
2. **Removed Deprecated Exports** — `debounce` and `raf_throttle` exports removed from `wait_patterns.js`
3. **Lenis Smooth Scroll Pattern** — Added routing to SKILL.md
4. **HLS Video Streaming Pattern** — Added routing to SKILL.md
5. **H2 Emojis Added** — 4 reference files (34 headers total):
   - `css_quick_reference.md` (7 headers)
   - `focus_management.md` (8 headers)
   - `css_patterns.md` (14 headers)
   - `error_recovery.md` (5 headers)

---

## [1.0.2.8] - 2026-01-02

*Environment version: 1.0.2.8*

Folder structure reorganization.

---

### Changed

1. **Folder Structure Reorganized**:
   - `phase1-implementation/` → `implementation/`
   - `phase2-debugging/` → `debugging/`
   - `phase3-verification/` → `verification/`
2. **Path References Updated** — Throughout SKILL.md and reference files

---

## [1.0.2.4] - 2026-01-01

*Environment version: 1.0.2.4*

Priority-based resource loading and reference reorganization.

---

### Changed

1. **Priority-Based Resource Loading** — P1/P2/P3 priority system
2. **References Reorganized** — Into 5 sub-folders
3. **Code Style Aligned** — With project standards

---

## [1.0.0.4] - 2025-12-29

*Environment version: 1.0.0.4*

Initial release of workflows-code skill.

---

### Added

1. **Initial Skill Structure** — 3-phase workflow (Implementation, Debugging, Verification)
2. **Reference Files** — Code quality, animation workflows, observer patterns
3. **Asset Patterns** — Validation, wait, and performance utilities

---

See [SKILL.md](./SKILL.md) for usage documentation.
