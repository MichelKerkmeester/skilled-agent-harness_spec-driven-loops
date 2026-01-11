# Changelog

All notable changes to the workflows-code skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.3.3] - 2026-01-11

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
