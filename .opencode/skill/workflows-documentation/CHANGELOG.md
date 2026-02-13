# Changelog - workflows-documentation

All notable changes to this skill are documented in this file.

---

## [5.3.1] - 2026-02-13

### Spec 117: /create:folder_readme Command Alignment

#### Changed
- `../../command/create/assets/create_folder_readme.yaml`: Aligned with canonical 9-section structure from readme_template.md §13 — replaced 4 custom section structures with canonical names, removed ~140 lines of embedded templates (replaced with reference stubs), fixed emoji inconsistencies, added `template_references` cross-references (765→611 lines, -20%)
- `../../command/create/folder_readme.md`: Fixed broken YAML key references (`notes.*` → actual keys), aligned DQI target to 75+ (Good), standardized command name to `/create:folder_readme`, added step numbering explanation (463→465 lines)

#### Fixed
- `create_folder_readme.yaml`: `sequential_5_step` → `sequential_6_step` (YAML defines 6 steps, not 5)
- `create_folder_readme.yaml`: Internal emoji_conventions inconsistency (🔧 vs 🛠️ for troubleshooting)
- `folder_readme.md`: Non-existent YAML key references (`notes.readme_type_selection` → `readme_types`)

---

## [5.3.0] - 2026-02-13

### Spec 115: README Template Alignment

#### Changed
- `assets/documentation/readme_template.md`: Major restructuring — added 5 evolved patterns (anchor schema, TOC double-dash format, badge shields, architecture diagrams, Before/After patterns), then reduced from 1589→1058 lines (-33%) through content consolidation and section merges (16→14 sections)
- §13 (Complete Template) now defines the canonical 9-section README scaffold used as the single source of truth for all README generation
- §12 (Anchor Templates) expanded with mandatory open/close anchor pairs and ID naming conventions
- §6 (Writing Patterns) enhanced with Before/After comparison patterns
- §7 (Style Reference) consolidated with redundant content removed

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
