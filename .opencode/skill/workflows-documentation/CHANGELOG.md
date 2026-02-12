# Changelog - workflows-documentation

All notable changes to this skill are documented in this file.

---

## [5.2.1] - 2026-02-12

### Changed

**Frontmatter Audit**

- Trimmed `description` in SKILL.md from ~290 chars to ~200 chars to reduce system prompt token consumption during auto-discovery

---

## [5.2.0] - 2026-02-03

### Added

#### validate_document.py (New Script)
- Automated README/documentation format validator
- Validates TOC format, H2 emojis, required sections
- **ALL CAPS validation**: Section names must be uppercase (e.g., "OVERVIEW" not "Overview")
  - New error types: `h2_not_uppercase`, `toc_not_uppercase`
  - Auto-fixable with `--fix` flag
  - Applies to `readme` and `install_guide` document types
- Exit codes: 0 (valid), 1 (invalid), 2 (file error)
- JSON output mode (`--json`)
- Auto-fix capability (`--fix`, `--dry-run`) with iterative fixing
- Document type detection (readme, skill, reference, asset, agent)
- **Path Exclusions**: Auto-skip validation for auto-generated, third-party, and template files
  - Excluded patterns: `.pytest_cache`, `node_modules`, `__pycache__`, `.git`, `vendor`, `dist`, `build`, `.venv`, `venv`
  - Third-party patterns: `mcp-narsil/mcp_server`
  - Template patterns: `system-spec-kit/templates/`
- **`--no-exclude` flag**: Force validation of excluded paths when needed

#### template_rules.json (New Asset)
- Machine-readable template specifications
- 5 document types with section emojis and rules
- Severity levels: blocking, warning, info
- `toc_uppercase_required` and `h2_uppercase_required` flags for readme/install_guide
- Auto-fix rules for uppercase conversion

#### Test Suite
- 6 test files covering all error types
- Automated test runner (`test_validator.py`)

### Changed
- **write.md agent**: Added VALIDATE FORMAT gate (step 8)
- **SKILL.md**: Added ALWAYS rule #9 for validate_document.py

### Test Results
- Test suite: 6/6 pass
- Batch validation: 53 VALID, 19 SKIPPED, 0 INVALID

---

## [5.1.0] - 2026-01-xx

### Added
- Install guide creation workflow
- 5-phase installation documentation template
- Phase-based validation checkpoints

---

## [5.0.0] - 2026-01-xx

### Added
- ASCII flowchart creation capability
- Flowchart templates for common patterns
- Integration with document quality pipeline

---

*For older versions, see git history.*
