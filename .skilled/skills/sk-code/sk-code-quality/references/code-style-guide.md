---
title: Universal Code Style Guide
description: Language-agnostic naming, file structure, commenting and formatting principles that hold on every surface, with house style left to each surface.
trigger_phrases:
  - "universal code style guide"
  - "language agnostic naming"
  - "universal formatting principles"
  - "commenting universal rules"
importance_tier: normal
contextType: implementation
version: 2.3.0.0
---

# Universal Code Style Guide

Language-agnostic style principles that hold in any repository. Identifier schemes, file-size limits, line length, folder and test layout, formatter picks and header forms are house style, so each surface states its own. This file keeps only the universal rules.

---

## 1. OVERVIEW

### Purpose

Codifies the style principles that apply regardless of code surface: naming intent, file organization, commenting discipline and formatter use. The concrete conventions are surface-specific and live in each surface packet. For this repository's own code that is SKILLED, under `.skilled/skills/sk-code/sk-code-skilled/references/shared/`. Use this doc when the project lacks a surface-specific style guide or when a contributor is new to the codebase.

### Core Principle

Names communicate intent. Files express one concept. Comments explain WHY (never WHAT) and describe the code as it is now. Use the formatter the project picked.

### When to Use

- When picking a name for a new variable, function, type, or file.
- When deciding how to lay out a file's top-of-file structure.
- When deciding whether to add a comment.
- When a reviewer flags a style nit and you need the surface-agnostic contract.

### Key Sources

- Surface style guides: the standards each surface ships. The SKILLED ones are the language folders under `.skilled/skills/sk-code/sk-code-skilled/references/`.
- Rule ids and overrides: [`../../shared/references/universal/rule-overrides.md`](../../shared/references/universal/rule-overrides.md). A repository or surface may drop or replace a rule of this guide in a `## Rule overrides` section.
- Project-level enforcement (banned phrases, voice rules): the repository's `AGENTS.md` is authoritative, when present.

---

## 2. NAMING (universal principles)

### Names communicate intent

- A name should answer: *what does this represent / do / configure?*
- Reader-friendly beats author-friendly. Optimize for the future reader, not for typing speed.
- A name with `_temp`, `_new`, `_v2` is a smell — it suggests the author didn't have a clear concept.

### Surface-appropriate convention

Each surface and language has a convention. Follow the convention the repository or its surface declares, and do not invent your own. The floor rule is `floor.naming` in `../../shared/references/universal/code-quality-standards.md` §4, and the surface checklist states the concrete scheme. The SKILLED scheme is in `../../sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` §2.

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

Most communities have a conventional top-of-file and import order. Follow it, or the order the surface states. The SKILLED order is in `../../sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md` §2.

### File size, folders and tests

How long a file may grow, how folders are named and where tests live are house style. Follow the language's community convention and the surface's rules: some languages keep tests beside the source they cover, and others keep them in a separate tree. The SKILLED rules, a 500-line split point, no double-underscore folder names and a top-level `tests/` tree, are in `../../sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md` §2 and `../../sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md` §3.

---

## 4. COMMENTING (universal, with the strict version in the repository's AGENTS.md when present)

### Default to no comments

Well-named identifiers and clear structure self-document. Add a comment only when:

- A hidden constraint exists (for example, "this works around platform bug X").
- A non-obvious invariant must be preserved (for example, "must run before init Y").
- A workaround needs its cause named (for example, "works around an upstream SDK hang on empty payloads") — name the symptom, not a ticket id (see "No ephemeral-artifact pointers" below).
- Behavior would surprise a reader.

### Comment density

This guide owns the comment-density rule. A comment earns its place by naming a hidden constraint, an invariant, a workaround's cause or a surprise, never by filling a quota, so no universal count applies. Each surface may set its own numeric budget as that surface's setting, and a surface budget never removes a comment this section requires. A repository that wants fewer comments, or more, says so in its own checklist. The Skilled surface sets three per ten lines in `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md`.

### Never comment what the code does

```python
# BAD — explains the WHAT
i += 1  # increment i

# GOOD — explains the WHY
# Skip the first row because it's the header.
i += 1
```

### No commented-out code

Delete it. Git history preserves it. Commented code is cognitive load with no payoff. The floor rule is `floor.commented-out-code`.

### Describe current behavior, not history

**CHK-CMT-07 (P1):** each comment describes what the code does now, never how it got there, what it used to do or which change introduced it. A comment that narrates its own history is wrong the moment the next change lands. Before: `// this check used to live in the old loader`. After: `// skips blank lines so the count stays true`. This rule adds to the ephemeral-pointer rule below and never softens it.

### No ephemeral-artifact pointers

Never name a specific instance of an ephemeral tracking artifact in a comment. Keep the durable WHY; drop the perishable label. This is the canonical statement of the floor rule `floor.ephemeral-pointers`, and surface guides point here rather than restating it. The comment-hygiene checker enforces it through the `hygiene.*` rule ids, and a repository that tracks none of these artifacts can switch chosen ids off through `commentHygiene.disableRules` in its quality config.

An *ephemeral artifact* is anything that gets renamed, renumbered, archived, or deleted on its own schedule while the code lives on: a spec folder or its number (`specs/042-foo`, `Spec 031`), a packet / phase / task / checklist / requirement number (`Packet 117`, `Phase 005`, `T043`, `CHK-160`, `REQ-005`), a feature-catalog entry (`feature-catalog/scorer-fusion/...`), an ADR id (`ADR-004`), or a ticket / issue id (`#1234`, `CU-8abc`). When the artifact moves, the comment becomes a dangling pointer that sends the next reader chasing a dead reference — worse than no comment.

| Reference in a comment | Allowed? | Why |
|------------------------|----------|-----|
| Spec folder / spec / packet / phase number | No | Renamed or archived independently of the code |
| Task / checklist / requirement id (`T###`, `CHK-###`, `REQ-###`) | No | Points into a spec folder's tasks/checklist/spec that gets archived |
| Feature-catalog entry, ADR id, ticket / issue id | No | Tracking artifacts with their own lifecycle |
| The durable WHY — the constraint, invariant, or decision itself | Yes — required | Survives any artifact lifecycle change |
| A path or glob the running code needs (`specs/`, `specs/NNN-*`) | Yes | Structural — code the runtime reads, not a traceability comment |
| A stable external standard (`CWE-79`, an RFC number, `POSIX`) | Yes | Externally versioned; does not get archived with a sprint |
| A platform / library name (`NODE:`, `SQLITE:`, `POSTGRES:`) | Yes | Names a durable platform, not a tracking artifact |

The line that matters is *instance vs. structural*: a string the program reads at runtime (a `specs/` path constant) stays; a comment that merely cites an artifact for traceability is what this rule forbids.

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

### Mark intentional simplifications

When a simplification is deliberate, a known shortcut chosen on purpose and not an oversight, name it so it reads as intent and not ignorance: the shortcut, its known ceiling and the upgrade path or trigger. A surface MAY define a neutral marker for such comments so they can be listed and reviewed. Without one, a plain WHY comment does the job. The SKILLED surface defines the `ceiling:` marker in `../../sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` §3.

### Surface-specific commenting notes

Header forms, doc-comment forms and comment prefixes are surface rules. See the surface style guide.

---

## 5. FORMATTING

### Use the project's formatter

When the project runs a formatter, don't fight it: configure it once at the project root and never overwrite its output by hand. Which formatter, and which line length, are the surface's choice. The SKILLED picks are in `../../sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md` §2.

Wrap a line only when it improves readability, never for wrapping's sake.

---

## 6. SURFACE-SPECIFIC POINTERS

For the rules that ARE language-specific, see:

| Surface  | Reference                                                                                  |
| -------- | ------------------------------------------------------------------------------------------ |
| SKILLED | `.skilled/skills/sk-code/sk-code-skilled/references/` language standards and `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/`               |
| Any other surface | The standards and checklists its own skill declares, or the repository's quality config checklists |

---

## 7. RELATED RESOURCES

- [`../../shared/references/universal/code-quality-standards.md`](../../shared/references/universal/code-quality-standards.md) - severity tiers (P0/P1/P2) that wrap per-stack style enforcement.
- [`../../shared/references/workflow-debug.md`](../../shared/references/workflow-debug.md) - debugging and command-failure recovery when a style violation cannot be auto-fixed.
- Surface standards under `.skilled/skills/sk-code/sk-code-skilled/references/`.
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/` - the SKILLED checklists that operationalize this guide for this repository's own code.
- [`../../shared/references/universal/rule-overrides.md`](../../shared/references/universal/rule-overrides.md) - how a repository or surface drops or replaces a rule.
