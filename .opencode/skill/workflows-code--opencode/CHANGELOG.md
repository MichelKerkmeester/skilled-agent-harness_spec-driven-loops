# Changelog - workflows-code--opencode

All notable changes to the workflows-code--opencode skill (multi-language OpenCode system code standards).

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-dev-environment)

---

## [**1.3.1**] - 2026-02-07

### Fixed — Template Alignment + Router Correction

Aligned all reference and asset files with `workflows-documentation` templates, then fixed 17 broken section references in the SKILL.md Use Case Router.

**Template alignment (22 files checked, 7 edited)**:
- 6 reference files: Added `## 1. OVERVIEW` section, emoji H2 headers, renumbered sections (JS style_guide, JS quality_standards, JS quick_reference, TS style_guide, TS quality_standards, TS quick_reference)
- 1 asset file: Added emoji H2 headers to `typescript_checklist.md`
- 10 reference files + 5 asset files already aligned (no changes)

**SKILL.md Use Case Router (17 fixes)**:
- All section number references shifted +1 to account for new OVERVIEW sections
- Removed phantom Python entry (`python/quality_standards.md#4` — CLI argument parsing/argparse does not exist in the file)
- Fixed 2 Shell entries pointing to wrong file (`shell/quality_standards.md` → `shell/style_guide.md` for color definitions and logging functions)
- Fixed Config `$schema` reference (`#3` → `#7`)
- Updated TS header description from "box-drawing format" to "dash-line format"

**Version**: 1.3.0 → 1.3.1

---

## [**1.3.0**] - 2026-02-07

### Changed — Post-Migration Alignment (Phase 17)

Comprehensive bi-directional alignment between this skill and the system-spec-kit codebase after the TypeScript migration (Phases 1-16). Audit found 645 violations across 136 files — the skill was substantially outdated. All 15 remediation tasks completed.

**Skill corrections (Track A — 9 tasks)**:

| Change | Details |
|--------|---------|
| TS header template fixed (A1) | `// ============` → `// -------` in style_guide.md, SKILL.md, quick_reference.md, typescript_checklist.md |
| 22 evidence citations fixed (A2) | `.js` → `.ts` references + line numbers across style_guide.md, quality_standards.md, code_organization.md, universal_patterns.md |
| File counts updated (A3) | "206 JavaScript files" → ~65 JS, ~341 TS |
| Structure diagrams rebuilt (A4) | MCP server tree (~100 lines) + scripts tree (~95 lines) — added 12+ missing directories, corrected all extensions |
| snake_case DB exception documented (A5) | New subsection in TS style_guide.md Section 4 for SQLite column-mapped properties |
| Block-comment dividers documented (A6) | TS style_guide.md Section 3 now shows Format A (line) and Format B (block) |
| Test file exemption tier added (A7) | New Section 8 in JS quality_standards.md — exempts test runners from module.exports/guard/prefix requirements |
| Mixed JS/TS patterns documented (A8) | New Section 8 in TS style_guide.md — 5 coexistence patterns (require, strict, aliases, allowJs, .d.ts) |
| tsconfig outDir corrected (A9) | `"outDir": "."` → `"outDir": "./dist"` in TS quality_standards.md baseline |

**Code fixes applied to system-spec-kit (Track B — 6 tasks)**:

| Change | Details |
|--------|---------|
| `'use strict'` removed (B1) | 98 .ts files cleaned — tsconfig `strict: true` provides enforcement |
| snake_case → camelCase rename (B2) | IEmbeddingProvider + 3 providers + callers — 13 files, 40+ renames. MemoryRecord (DB-mapped) preserved. |
| Barrel file created (B3) | `shared/index.ts` with 8 export sections |
| Shell strict mode fixed (B4) | 2 scripts upgraded to `set -euo pipefail`, 1 documented (bash 3.2 array compat) |
| filters.jsonc keys fixed (B5) | 6 snake_case keys → camelCase + 3 consumer files updated |
| TS headers verified (B6) | Zero `// ============` remaining, all use `// -------` |

**Key decisions**:
- D1: Skill adapts to code for header format (62+ files consistent)
- D2: snake_case rename completed in-phase (originally deferred to Phase 18)
- D6: `to_string` → `toDisplayString` (avoids Object.prototype.toString shadow)
- D7: MemoryRecord snake_case untouched (DB-mapped dual naming)
- D8: Voyage `input_type` untouched (API parameter name)

**Verification**: 8 parallel agents (4 Opus + 4 Sonnet) implemented changes. 2 verification agents confirmed 15/15 tasks PASS. `tsc --build`: 0 new errors.

---

## [**1.2.0**] - 2026-02-07

### Added — TypeScript Language Standards

Added comprehensive TypeScript coding standards in preparation for the system-spec-kit JavaScript-to-TypeScript migration (Phase 0).

**New reference files (4)**:

| File | Content |
|------|---------|
| `references/typescript/style_guide.md` | File headers, naming (PascalCase interfaces/types/enums, camelCase functions), import ordering (4-group with type-only imports), section organization (TYPE DEFINITIONS section), formatting rules, `strict` mode via tsconfig |
| `references/typescript/quality_standards.md` | `interface` vs `type` decision guide, `unknown` over `any` policy, strict null checks, discriminated unions, utility types, return type annotation policy, TSDoc format, typed error classes, async patterns, tsconfig baseline |
| `references/typescript/quick_reference.md` | Complete TS file template, naming cheat sheet, type annotation patterns, utility type patterns, import/export templates, error handling patterns, tsconfig quick reference |
| `assets/checklists/typescript_checklist.md` | P0: file header, no `any` in public API, PascalCase types. P1: explicit return types, interfaces for data shapes, strict mode, TSDoc. P2: utility types, discriminated unions, type-only imports, generic constraints |

**Updated existing files (5)**:

| File | Changes |
|------|---------|
| `SKILL.md` | Added TypeScript to language detection, keyword triggers, FILE_EXTENSIONS, resource router, use case router, naming matrix, file header templates, evidence table, skill differentiation table, external resources, related resources. Removed "TypeScript not used" exclusion. Version bumped to 1.2.0. |
| `references/shared/universal_patterns.md` | Added TypeScript to language list, naming examples, boolean examples, consistency rule examples, related resources |
| `references/shared/code_organization.md` | Added TypeScript import ordering (4-group with `import type`), export patterns (ES module syntax), `.test.ts` to test naming conventions, TypeScript directory in skill structure, related resources |
| `assets/checklists/universal_checklist.md` | Added TypeScript to file header check, naming conventions, validation workflow (`tsc --noEmit`), language-specific checklists list |
| `CHANGELOG.md` | This entry |

**Key conventions established**:
- `PascalCase` for interfaces, type aliases, enums, and enum members
- `camelCase` for functions, variables, parameters (same as JavaScript)
- `I` prefix retained only for legacy `IEmbeddingProvider` and `IVectorStore` (Decision D5)
- `import type` on separate line for type-only imports
- `unknown` over `any` in public API (P0 blocker)
- TSDoc replaces JSDoc (no `{type}` in tags — native TS types used instead)
- `strict: true` in tsconfig replaces `'use strict'` directive
- tsconfig baseline: `target: es2022`, `module: commonjs`, `strict: true`, `composite: true`

---

## [**1.1.0**] - 2026-02-06

### Changed — JavaScript Naming Convention Alignment

Aligned JavaScript naming conventions with ecosystem standards (MDN, Airbnb, Node.js core).

| Element | Before (v1.0) | After (v1.1) |
|---------|---------------|--------------|
| Functions | `snake_case` | `camelCase` |
| Parameters | `snake_case` | `camelCase` |
| Module variables | `snake_case` | `camelCase` |
| Exports | `snake_case` primary | `camelCase` primary |
| Booleans | `is_`/`has_` | `is`/`has` (camelCase) |

**No changes**: Constants (`UPPER_SNAKE_CASE`), Classes (`PascalCase`), Files (`kebab-case`), Python, Shell, Config.

**Updated files**:
- `SKILL.md` — Naming matrix, routing comments, code examples
- `references/javascript/style_guide.md` — Rewritten Section 4 with camelCase examples
- `references/javascript/quality_standards.md` — Export pattern flipped to camelCase primary
- `references/javascript/quick_reference.md` — Naming cheat sheet + file template updated
- `references/shared/universal_patterns.md` — JS code examples updated
- `references/shared/code_organization.md` — Export pattern flipped
- `assets/checklists/javascript_checklist.md` — P0: camelCase functions
- `assets/checklists/universal_checklist.md` — Already correct (no changes needed)

**Migration**: All ~206 JS files in `system-spec-kit/` migrated from snake_case to camelCase.
MCP handler exports include backward-compatible snake_case aliases.

---

## [**1.0.0**] - 2026-02-04

Initial release providing multi-language code standards for OpenCode system code across JavaScript, Python, Shell, and JSON/JSONC.

---

### New

1. **SKILL.md orchestrator** — 10-section structure with Use Case Router tables, Quick Reference with code examples
2. **Language-specific style guides** — 4 comprehensive guides:
   - `references/javascript/style_guide.md` — Node.js/ES modules, JSDoc, async patterns
   - `references/python/style_guide.md` — PEP 8, docstrings, type hints
   - `references/shell/style_guide.md` — POSIX compliance, error handling, shebang patterns
   - `references/jsonc/style_guide.md` — Schema references, comment conventions
3. **Universal patterns** — `references/shared/universal_patterns.md` for cross-language consistency
4. **Quality checklist** — `assets/code_quality_checklist.md` for pre-commit validation
5. **skill_advisor.py integration** — INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS for automatic routing

---

### Features

| Feature | Description |
|---------|-------------|
| **Language detection** | Automatic routing based on file extension |
| **Unified commenting** | WHY-focused comments, quantity limits (5/10 lines) |
| **Reference patterns** | T###, REQ-###, SEC-###, BUG-### prefixes |
| **Naming conventions** | snake_case (Python/Shell), camelCase (JS), kebab-case (files) |
| **Resource loading** | 3-tier system: ALWAYS, CONDITIONAL, ON_DEMAND |

---

### Skill Routing

```python
# INTENT_BOOSTERS added to skill_advisor.py
"opencode": ("workflows-code--opencode", 2.0),
"mcp": ("workflows-code--opencode", 1.5),
"python": ("workflows-code--opencode", 1.0),
"shell": ("workflows-code--opencode", 1.0),
"bash": ("workflows-code--opencode", 1.0),
"jsonc": ("workflows-code--opencode", 1.5),
```

---

### Notes

- Derived from workflows-code patterns, adapted for multi-language OpenCode context
- Inline commenting standards aligned with workflows-code (quantity limit, WHY not WHAT, no commented-out code)
- For web-specific projects (Webflow, vanilla JavaScript), use `workflows-code--web-dev`

---

*For older versions, see git history.*
