# Changelog - workflows-documentation

All notable changes to the workflows-documentation skill.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**5.3.1**] - 2026-02-13

Aligned the **/create:folder_readme** command with the **canonical 9-section structure** from `readme_template.md` Section 13, fixing broken YAML key references and internal inconsistencies.

---

### Changed

1. **`create_folder_readme.yaml`** — Aligned with canonical 9-section structure from readme_template.md §13: replaced 4 custom section structures with canonical names, removed ~140 lines of embedded templates (replaced with reference stubs), fixed emoji inconsistencies, added `template_references` cross-references (765→611 lines, -20%)
2. **`folder_readme.md`** — Fixed broken YAML key references (`notes.*` → actual keys), aligned DQI target to 75+ (Good), standardized command name to `/create:folder_readme`, added step numbering explanation (463→465 lines)

---

### Fixed

1. **`create_folder_readme.yaml`** — `sequential_5_step` → `sequential_6_step` (YAML defines 6 steps, not 5)
2. **`create_folder_readme.yaml`** — Internal emoji_conventions inconsistency (🔧 vs 🛠️ for troubleshooting)
3. **`folder_readme.md`** — Non-existent YAML key references (`notes.readme_type_selection` → `readme_types`)

---

## [**5.3.0**] - 2026-02-13

Major **README template restructuring**: added 5 evolved patterns (anchor schema, TOC double-dash format, badge shields, architecture diagrams, Before/After patterns), then reduced from **1589→1058 lines (-33%)** through content consolidation and section merges (16→14 sections).

---

### Changed

1. **`readme_template.md`** — Major restructuring with 5 evolved patterns, reduced from 1589→1058 lines (-33%) through content consolidation and section merges (16→14 sections)
2. **§13 (Complete Template)** — Now defines the canonical 9-section README scaffold used as the single source of truth for all README generation
3. **§12 (Anchor Templates)** — Expanded with mandatory open/close anchor pairs and ID naming conventions
4. **§6 (Writing Patterns)** — Enhanced with Before/After comparison patterns
5. **§7 (Style Reference)** — Consolidated with redundant content removed

---

## [**5.2.1**] - 2026-02-12

Trimmed SKILL.md **frontmatter description** from ~290 to ~200 chars to reduce system prompt token consumption during auto-discovery.

---

### Changed

1. **SKILL.md `description`** — Trimmed from ~290 chars to ~200 chars for reduced token consumption

---

## [**5.2.0**] - 2026-02-03

Added **`validate_document.py`** automated format validator, **`template_rules.json`** machine-readable specs, and a **6-file test suite** for documentation quality enforcement.

---

### New

1. **`validate_document.py`** — Automated README/documentation format validator with TOC format, H2 emojis, required sections validation; exit codes 0 (valid), 1 (invalid), 2 (file error); JSON output mode (`--json`); auto-fix capability (`--fix`, `--dry-run`) with iterative fixing; document type detection (readme, skill, reference, asset, agent)
2. **ALL CAPS validation** — Section names must be uppercase (e.g., "OVERVIEW" not "Overview") with new error types `h2_not_uppercase` and `toc_not_uppercase`, auto-fixable with `--fix` flag, applies to `readme` and `install_guide` document types
3. **Path exclusions** — Auto-skip validation for auto-generated, third-party, and template files (`.pytest_cache`, `node_modules`, `__pycache__`, `.git`, `vendor`, `dist`, `build`, `.venv`, `venv`, `mcp-narsil/mcp_server`, `system-spec-kit/templates/`) with `--no-exclude` flag to force validation when needed
4. **`template_rules.json`** — Machine-readable template specifications with 5 document types, section emojis and rules, severity levels (blocking, warning, info), `toc_uppercase_required` and `h2_uppercase_required` flags, auto-fix rules for uppercase conversion
5. **Test suite** — 6 test files covering all error types with automated test runner (`test_validator.py`); results: 6/6 pass, batch validation: 53 VALID, 19 SKIPPED, 0 INVALID

---

### Changed

1. **`write.md` agent** — Added VALIDATE FORMAT gate (step 8)
2. **SKILL.md** — Added ALWAYS rule #9 for validate_document.py

---

## [**5.1.0**] - 2026-01-xx

Added **install guide creation workflow** with 5-phase installation documentation template.

---

### New

1. **Install guide creation workflow** — 5-phase installation documentation template with phase-based validation checkpoints

---

## [**5.0.0**] - 2026-01-xx

Added **ASCII flowchart creation** capability with integration into the document quality pipeline.

---

### New

1. **ASCII flowchart creation** — Flowchart templates for common patterns with integration into document quality pipeline

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
