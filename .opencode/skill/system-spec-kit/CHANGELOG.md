# Changelog

All notable changes to the system-spec-kit skill are documented in this file.

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [**1.1.0.0**] - 2026-01-29

Major cognitive memory upgrade implementing **FSRS power-law decay** validated on 100M+ users, **Prediction Error Gating** to prevent duplicates, and **30 bug fixes** from comprehensive 10-agent audit. Memory commands aligned with template standards.

---

### New

**Cognitive Memory System**

1. **FSRS power-law algorithm** — `R(t,S) = (1 + 0.235 × t/S)^(-0.5)` replaces arbitrary exponential decay
2. **Prediction Error Gating** — 4-tier thresholds (0.95 DUPLICATE, 0.90 HIGH_MATCH, 0.70 MEDIUM_MATCH, 0.50 LOW_MATCH)
3. **5-state memory model** — HOT (≥0.8), WARM (0.25-0.8), COLD (0.05-0.25), DORMANT (0.02-0.05), ARCHIVED (<0.02)
4. **Testing Effect** — Accessing memories strengthens stability (desirable difficulty bonus)
5. **Schema v4** — New columns: stability, difficulty, last_review, review_count + memory_conflicts table

**New Files**

6. `lib/cognitive/fsrs-scheduler.js` — FSRS algorithm implementation
7. `lib/cognitive/prediction-error-gate.js` — Duplicate detection and conflict resolution
8. `tests/fsrs-scheduler.test.js` — 30 unit tests for FSRS
9. `tests/verify-cognitive-upgrade.js` — Comprehensive verification script

---

### Fixed

**Critical Bugs (P0)**

1. **BUG-001: FSRS function never executed** — Fixed signature mismatch in tier-classifier.js
2. **BUG-002: MEDIUM_MATCH = LOW_MATCH** — Changed LOW_MATCH to 0.50
3. **BUG-003: COLD = DORMANT thresholds** — Changed DORMANT to 0.02

**High Bugs (P1)**

4. **BUG-004: LRUCache missing methods** — Added keys() and delete() methods
5. **BUG-005: Missing await on DB check** — Added await to delete/update handlers
6. **BUG-006: Unhandled promise rejection** — Wrapped reinforce_existing_memory in try/catch
7. **BUG-007: NaN propagation** — Early return with 0.5 default when no timestamps
8. **BUG-008: Data loss on restore failure** — SAVEPOINT/ROLLBACK pattern in checkpoints.js
9. **BUG-009: ReDoS in YAML regex** — Line-by-line parsing in memory-parser.js
10. **BUG-010: ReDoS in trigger patterns** — Bounded greedy quantifiers in trigger-extractor.js
11. **BUG-011: Silent delete errors** — Added console.warn logging

**Medium Bugs (P2)**

12. **BUG-012: Cache thundering herd** — Loading flag with try/finally
13. **BUG-013: Inconsistent tier weights** — Centralized to importance-tiers.js
14. **BUG-014: NaN from env vars** — isNaN() validation in working-memory.js
15. **BUG-015: Negative scores not clamped** — Math.max(0, score) in co-activation.js
16. **BUG-016: Partial transaction commits** — Track failures, rollback all
17. **BUG-017: Token metrics wrong order** — Capture before reassignment
18. **BUG-018: Undo doesn't check result** — Verify changes > 0 in history.js
19. **BUG-019: Migration not transactional** — database.transaction() wrapper
20. **BUG-020: UTF-16 BE unsupported** — Manual byte-swap conversion

**Low Bugs (P3)**

21. **BUG-021-030** — Input validation, error sanitization, Unicode boundaries, symlink detection, division guards

---

### Changed

**MCP Server**

1. **Composite scoring** — Added retrievability weight (0.15), adjusted similarity (0.30 → 0.25)
2. **Tier classifier** — Extended from 3-state to 5-state model
3. **Attention decay** — Integrated FSRS decay functions

**Memory Commands**

4. **checkpoint.md** — Template alignment: emojis, section naming
5. **database.md** — Added section number to COGNITIVE MEMORY MODEL, fixed emoji (✓→✅)
6. **save.md** — PHASE 1B→2 (integer numbering), emoji fixes
7. **search.md** — Numbered CONSTITUTIONAL/COGNITIVE sections

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*

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
