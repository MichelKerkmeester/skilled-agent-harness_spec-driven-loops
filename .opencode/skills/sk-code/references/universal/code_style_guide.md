---
title: Universal Code Style Guide
description: Language-agnostic naming, file structure, commenting, and formatting principles for WEBFLOW and OPENCODE code surfaces.
---

# Universal Code Style Guide

Language-agnostic style principles. Naming conventions and stack-specific enforcement live in each stack's standards doc; this file captures the universal rules.

---

## 1. OVERVIEW

### Purpose

Codifies the style principles that apply regardless of code surface: naming intent, file organization, commenting discipline, formatter use. The actual identifier convention is surface-specific and lives under `references/webflow/standards/` and `references/opencode/`. Use this doc when the project lacks a surface-specific style guide or when a contributor is new to the codebase.

### Core Principle

Names communicate intent. Files express one concept. Comments explain WHY (never WHAT). Formatters are not negotiable.

### When to Use

- When picking a name for a new variable, function, type, or file.
- When deciding how to lay out a file's top-of-file structure.
- When deciding whether to add a comment.
- When a reviewer flags a style nit and you need the surface-agnostic contract.

### Key Sources

- Surface style guides: `references/webflow/standards/code_style_guide.md` and `references/opencode/{javascript,typescript,python,shell,config}/`.
- Project-level enforcement (banned phrases, voice rules): the project CLAUDE.md / AGENTS.md is authoritative for this user's projects.

---

## 2. NAMING (universal principles)

### Names communicate intent

- A name should answer: *what does this represent / do / configure?*
- Reader-friendly beats author-friendly. Optimize for the future reader, not for typing speed.
- A name with `_temp`, `_new`, `_v2` is a smell — it suggests the author didn't have a clear concept.

### Surface-appropriate convention

Each surface and language has a convention. Follow the surface convention; do not invent your own.

| Surface              | Identifier convention                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| WEBFLOW (vanilla JS) | `snake_case` for variables/functions; `PascalCase` for classes/types; `UPPER_SNAKE` for constants            |
| OPENCODE JS/TS       | `camelCase` for variables/functions; `PascalCase` for classes/types; `UPPER_SNAKE` for constants             |
| OPENCODE Python/Shell | `snake_case` for variables/functions; `PascalCase` for classes; `UPPER_SNAKE` for constants                 |

The surface code quality checklist (see `code_quality_standards.md` §6) enforces the convention.

### Universal anti-patterns

- Type-coded prefixes (`strName`, `iCount`) — your tooling tells you the type.
- Hungarian notation in modern languages — leave it in COBOL.
- Single-letter names for non-trivial scope (loop counters fine; algorithm coefficients fine; business logic NOT fine).
- Negated booleans (`is_not_ready`) — flip the polarity (`is_ready`) and let callers negate.
- Magic numbers — name the value if it has meaning.

---

## 3. FILE STRUCTURE (universal principles)

### One thing per file

- A file represents one concept (one component, one service, one type system, one workflow).
- Multiple unrelated exports in one file is a smell.

### Stable import / structure order

Most communities have a conventional order. Follow it.

| Surface     | Top-of-file order                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| WEBFLOW JS  | File header (box-drawing) → constants → utilities → main IIFE → init                                     |
| OPENCODE TS | Module header → imports (external → local) → types/interfaces → exports                                |
| OPENCODE Python | Shebang → module docstring → imports (stdlib → third-party → local) → constants → classes/functions |

### Keep files small

- Hard to read beats hard to navigate. Split files when they exceed roughly 500 lines or contain three or more unrelated concepts.
- Exception: data files (constants, fixtures) can be large; that is fine.

---

## 4. COMMENTING (universal — see project CLAUDE.md for the strict version)

### Default to no comments

Well-named identifiers and clear structure self-document. Add a comment only when:

- A hidden constraint exists (for example, "this works around browser bug X").
- A non-obvious invariant must be preserved (for example, "must run before init Y").
- A workaround references a specific issue (for example, "see issue #1234").
- Behavior would surprise a reader.

### Never comment what the code does

```python
# BAD — explains the WHAT
i += 1  # increment i

# GOOD — explains the WHY
# Skip the first row because it's the header.
i += 1
```

### No commented-out code

Delete it. Git history preserves it. Commented code is cognitive load with no payoff.

### Surface-specific commenting notes

Some surfaces have additional commenting conventions (WEBFLOW JS uses three-line file headers with box-drawing characters; OPENCODE TypeScript uses `MODULE:` headers where required). See the surface style guide.

---

## 5. FORMATTING

### Use the language's standard formatter

| Surface     | Formatter                       |
| ----------- | ------------------------------- |
| WEBFLOW JS  | Prettier                        |
| OPENCODE JS/TS | Prettier or project formatter |
| OPENCODE Python | Black or Ruff                |
| OPENCODE Shell | `shfmt` where available       |

Don't fight the formatter. Configure once at the project root and never overwrite manually.

### Line length

- Soft limit roughly 100-120 characters (matches most modern editors at split-view).
- Hard wrap only when it improves readability.
- Don't wrap-for-wrap's-sake.

---

## 6. SURFACE-SPECIFIC POINTERS

For the rules that ARE language-specific, see:

| Surface  | Reference                                                                                  |
| -------- | ------------------------------------------------------------------------------------------ |
| WEBFLOW  | `references/webflow/standards/code_style_guide.md` (snake_case JS, semantic CSS prefixes, BEM, GPU animation) |
| OPENCODE | `references/opencode/` language standards and `assets/opencode/checklists/`               |

---

## 7. RELATED RESOURCES

- `references/universal/code_quality_standards.md` - severity tiers (P0/P1/P2) that wrap per-stack style enforcement.
- `references/universal/error_recovery.md` - what to do when a style violation can't be auto-fixed.
- Surface standards under `references/webflow/standards/` and `references/opencode/`.
- `assets/webflow/checklists/` and `assets/opencode/checklists/` - the surface checklists that operationalize this guide.
