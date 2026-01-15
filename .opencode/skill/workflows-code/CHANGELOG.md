# Changelog

All notable changes to the workflows-code skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.3.6] - 2026-01-15

*Environment version: 1.0.3.6*

Added performance patterns asset and 15 new reference files for comprehensive implementation guidance.

### Added

- **Performance Patterns Asset** - `performance_patterns.js` with production-validated timing utilities
  - Throttle/debounce constants (64ms pointermove, 180ms form validation, 200-250ms resize)
  - IntersectionObserver patterns with 0.1 threshold

- **15 New Reference Files**:
  - `debugging/`: `debugging_workflows.md`, `error_recovery.md`
  - `implementation/`: `animation_workflows.md`, `css_patterns.md`, `focus_management.md`, `implementation_workflows.md`, `observer_patterns.md`, `performance_patterns.md`, `security_patterns.md`, `swiper_patterns.md`, `third_party_integrations.md`, `webflow_patterns.md`
  - `standards/`: `css_quick_reference.md`
  - `verification/`: `verification_workflows.md`

---

## [1.0.3.3] - 2026-01-11

*Environment version: 1.0.3.3*

Security hardening and documentation quality improvements. Fixes URL validation XSS vulnerability, repairs 35 broken cross-references, and brings all reference files into H2 emoji compliance.

### Fixed

- **URL validation XSS** - Protocol whitelist now rejects `javascript:` and `data:` schemes in `validation_patterns.js`
- **35 broken markdown links** - Cross-directory relative paths fixed across 16 reference files
- **`debounce()` default** - Added missing default delay (180ms) in `wait_patterns.js`
- **SKILL.md Quick Reference path** - Corrected `dist/` → `src/2_javascript/z_minified/`

### Changed

- Removed deprecated `SafeDOM` class (107 lines) from `validation_patterns.js`
- Removed deprecated `debounce` and `raf_throttle` exports from `wait_patterns.js`
- Added Lenis smooth scroll pattern routing to SKILL.md
- Added HLS video streaming pattern routing to SKILL.md
- Added H2 emojis to 4 reference files (34 headers total):
  - `css_quick_reference.md` (7 headers)
  - `focus_management.md` (8 headers)
  - `css_patterns.md` (14 headers)
  - `error_recovery.md` (5 headers)

## [1.0.2.8] - 2026-01-02

### Changed

- Folder structure reorganized: `phase1-implementation/` → `implementation/`, `phase2-debugging/` → `debugging/`, `phase3-verification/` → `verification/`
- Path references updated throughout SKILL.md and reference files

## [1.0.2.4] - 2026-01-01

### Changed

- Priority-based resource loading (P1/P2/P3)
- References reorganized into 5 sub-folders
- Code style aligned with project standards

## [1.0.0.4] - 2025-12-29

### Added

- Initial skill structure with 3-phase workflow (Implementation, Debugging, Verification)
- Reference files for code quality, animation workflows, observer patterns
- Asset patterns for validation, wait, and performance utilities
