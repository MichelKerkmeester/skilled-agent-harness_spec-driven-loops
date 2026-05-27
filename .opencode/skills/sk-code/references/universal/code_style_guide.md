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

- Surface style guides: `references/webflow/javascript/style_guide.md` and `references/opencode/{javascript,typescript,python,shell,config}/`.
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
- A workaround needs its cause named (for example, "works around an upstream SDK hang on empty payloads") — name the symptom, not a ticket id (see "No ephemeral-artifact pointers" below).
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

### No ephemeral-artifact pointers

Never name a specific instance of an ephemeral tracking artifact in a comment. Keep the durable WHY; drop the perishable label. This is the canonical rule for both the OPENCODE and WEBFLOW surfaces — surface guides point here rather than restating it.

An *ephemeral artifact* is anything that gets renamed, renumbered, archived, or deleted on its own schedule while the code lives on: a spec folder or its number (`specs/042-foo`, `Spec 031`), a packet / phase / task / checklist / requirement number (`Packet 117`, `Phase 005`, `T043`, `CHK-160`, `REQ-005`), a feature-catalog entry (`feature_catalog/04--scorer-fusion/...`), an ADR id (`ADR-004`), or a ticket / issue id (`#1234`, `CU-8abc`). When the artifact moves, the comment becomes a dangling pointer that sends the next reader chasing a dead reference — worse than no comment.

| Reference in a comment | Allowed? | Why |
|------------------------|----------|-----|
| Spec folder / spec / packet / phase number | No | Renamed or archived independently of the code |
| Task / checklist / requirement id (`T###`, `CHK-###`, `REQ-###`) | No | Points into a spec folder's tasks/checklist/spec that gets archived |
| Feature-catalog entry, ADR id, ticket / issue id | No | Tracking artifacts with their own lifecycle |
| The durable WHY — the constraint, invariant, or decision itself | Yes — required | Survives any artifact lifecycle change |
| A path or glob the running code needs (`.opencode/specs/`, `specs/NNN-*`) | Yes | Structural — code the runtime reads, not a traceability comment |
| A stable external standard (`CWE-79`, an RFC number, `POSIX`) | Yes | Externally versioned; does not get archived with a sprint |
| A platform / library name (`WEBFLOW:`, `MOTION:`, `LENIS:`) | Yes | Names a durable platform, not a tracking artifact |

The line that matters is *instance vs. structural*: a string the program reads at runtime (a `.opencode/specs/` path constant) stays; a comment that merely cites an artifact for traceability is what this rule forbids.

```javascript
// BAD — points into tasks.md, which is archived per spec folder
// T107/REQ-033: transaction manager for pending file recovery
const tx = new TransactionManager(dbPath);

// GOOD — keeps the WHY, drops the ephemeral id
// Recover pending writes on startup so a mid-write crash cannot lose data
const tx = new TransactionManager(dbPath);
```

```javascript
// BAD — "ADR-004" is renamed/archived independently of this code
// ADR-004: FSRS-preferred decay with half-life fallback
const decay = fsrsDecay(age);

// GOOD — the behavior and the durable algorithm name are what a reader needs
// FSRS-preferred decay with half-life fallback
const decay = fsrsDecay(age);
```

When a comment mixes a forbidden id with a stable standard, keep the standard: `// CHK-160 / SEC: sanitize input (CWE-79)` becomes `// SEC: sanitize input to prevent stored XSS (CWE-79)`.

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
| WEBFLOW  | `references/webflow/javascript/style_guide.md` (snake_case JS, semantic CSS prefixes, BEM, GPU animation) |
| OPENCODE | `references/opencode/` language standards and `assets/opencode/checklists/`               |

---

## 7. RELATED RESOURCES

- `references/universal/code_quality_standards.md` - severity tiers (P0/P1/P2) that wrap per-stack style enforcement.
- `references/universal/error_recovery.md` - what to do when a style violation can't be auto-fixed.
- Surface standards under `references/webflow/standards/` and `references/opencode/`.
- `assets/webflow/checklists/` and `assets/opencode/checklists/` - the surface checklists that operationalize this guide.
