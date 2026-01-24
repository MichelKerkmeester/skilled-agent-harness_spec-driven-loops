# Changelog

All notable changes to the system-spec-kit skill are documented in this file.

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [**1.0.8.2**] - 2026-01-24

Comprehensive test suite adding **1,087 tests** across **8 new test files** for cognitive memory, MCP handlers, session learning, validation rules, and the Five Checks Framework.

---

### New

**MCP Server Tests (3 files, 419 tests)**

1. **test-session-learning.js** — 161 tests for preflight/postflight handlers, Learning Index formula
2. **test-memory-handlers.js** — 162 tests for memory_search, triggers, CRUD, save, index operations
3. **test-cognitive-integration.js** — 96 integration tests for cognitive memory subsystem

**Scripts Tests (5 files, 668 tests)**

4. **test-validation-system.js** — 99 tests for all 13 validation rules, level detection, exit codes
5. **test-template-comprehensive.js** — 154 tests for template rendering, ADDENDUM integration
6. **test_dual_threshold.py** — 71 pytest tests for dual-threshold validation
7. **test-extractors-loaders.js** — 279 tests for session extractors and data loaders
8. **test-five-checks.js** — 65 tests for Five Checks Framework

---

### Fixed

1. **memory-crud.js import mismatch** — `isValidTier` → `is_valid_tier` (snake_case)

---

### Changed

1. **mcp_server/tests/README.md** — Added 3 new test files
2. **scripts/tests/README.md** — Added 5 new test files, corrected file count

---

## [**1.0.8.1**] - 2026-01-24

Cleanup release removing verbose templates.

---

### Removed

1. **`templates/verbose/` directory** — 26 files (~5,000+ lines) removed

---

## [**1.0.8.0**] - 2026-01-23

Dual-threshold validation, Five Checks Framework, and script reorganization.

---

### New

1. **Dual-Threshold Validation** — `(confidence >= 0.70) AND (uncertainty <= 0.35)`
2. **Five Checks Framework** — Architectural validation for Level 3+ specs
3. **session-learning.js** — Cognitive memory session learning handler

---

### Changed

1. **decision-tree-generator.js** — Moved from `extractors/` to `lib/`
2. **opencode-capture.js** — Moved from `lib/` to `extractors/`

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
