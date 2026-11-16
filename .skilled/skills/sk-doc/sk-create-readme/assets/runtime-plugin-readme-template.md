---
title: Runtime Plugin and Extension Folder README Template
description: Fillable scaffold for the README of a runtime folder that loads hook adapters, such as .pi/extensions/, .opencode/plugins/ or a hook mirror like .claude/hooks/, built around the entry map.
trigger_phrases:
  - "plugin folder readme template"
  - "extension folder readme template"
  - "runtime plugin readme"
  - "hook mirror readme"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Runtime Plugin and Extension Folder README Template

Use this template for the README of a folder a runtime loads its hooks from, such as `.pi/extensions/`, `.opencode/plugins/`, `.dsh/plugins/repo-guards/` or `.vibe/plugins/`. It also fits a hook mirror such as `.claude/hooks/`, which indexes the hook scripts without running them.

---

## 1. OVERVIEW

### Purpose

A runtime folder is where one runtime meets the shared hook cores. Most entries in it are links or thin adapters that translate the runtime's events into a core call. A reader opens this README to learn how the runtime finds each entry and which core does the work. They also learn what happens when a core fails. The entry map answers that, so it is the center of the README.

### Usage

Copy the scaffold in Section 4 into the folder as `README.md`. Fill it from the folder listing, the runtime's config file, the cores each entry calls and the suites that test them. Then remove the sections the folder does not need and renumber the rest.

The folder sits below the repository root, so the README separates its H2 sections with `---` rules. Frontmatter and a tagline are optional. Add the tagline when one sentence says what the folder is better than the title does.

A hook mirror is a smaller case. Its links exist so a person can find the adapters, and the runtime runs the real paths from its config file. Keep OVERVIEW, the entry map, VALIDATION and RELATED, and say in OVERVIEW that nothing runs through the links.

### A Self-Contained Package

A package that ships its own code, such as a third-party extension kept under `.pi/extensions/<name>/`, is not an adapter folder. Write its README from Section 6 of [`readme-template.md`](./readme-template.md) as a component README. Add a section on how the package loads, such as its entry in `.pi/settings.json`. Add a PROVENANCE section when it is a fork, naming the upstream and the commit it was taken from.

---

## 2. SECTION MODEL

| # | Section | Keep When |
|---|---|---|
| 1 | OVERVIEW | Always. How the runtime finds the entries, where the real files live and the rule every entry follows |
| 2 | ARCHITECTURE | The path from runtime event to core is easier to draw than to describe |
| 3 | DIRECTORY TREE | Always for a folder with subfolders. A flat folder may use the entry map alone when it names every file |
| 4 | ENTRY MAP | Always. One row per entry: the event, the real file or core and the effect |
| 5 | BOUNDARIES AND FLOW | The folder has rules about imports, ownership, output or failure |
| 6 | CONFIGURATION | Entries read switches or the runtime config carries settings for them |
| 7 | VALIDATION | Always. The suites and the check that the entries still resolve |
| 8 | RELATED | Always |

A folder that maps another runtime's plugins onto its own entries, as `.vibe/plugins/` does for OpenCode, can add a PLUGIN MAP section after the entry map.

---

## 3. WRITING RULES

- Open OVERVIEW with how the runtime finds the entries. Say whether it scans the folder, reads a config file or loads a patch.
- Say what kind of file each entry is: a link, a one-line re-export, a thin adapter or a full plugin. A reader who edits an entry that only re-exports changes nothing.
- Name the core that owns each decision, so a rule change lands in the core and not in the entry.
- Give the entry map one row per entry, with the runtime event, the real file or core and what the session sees.
- State the failure rule once in BOUNDARIES AND FLOW. Name every entry that can refuse a call, because those are the exceptions to failing open.
- Name the check that proves every entry still resolves, such as a mirror check or a registration check.
- Keep counts a reader can check against the folder. A count that drifts needs a `readme-check` allow comment that says where it comes from.
- Use plain words in prose. Name an event, switch or file only where the reader acts on it or opens it.

---

## 4. FILLABLE SCAFFOLD

````markdown
---
title: "[Runtime] [Plugins or Extensions]: [What They Do]"
description: "[One sentence on what the folder loads and which cores it reaches.]"
trigger_phrases:
  - "[runtime] plugins"
  - "[runtime] extensions"
---

# [Runtime] [Plugins or Extensions]: [What They Do]

---

## 1. OVERVIEW

`[folder]/` [is what, for which runtime]. [Runtime] finds each entry by [scanning the folder, reading a config file or loading a patch].

[What kind of file each entry is, and where the real files live. Link the hook library README for the cores.]

[The rule every entry follows, such as failing open, never writing to stdout or importing only its core.]

---

## 2. ARCHITECTURE

```text
╭──────────────────────╮
│ [Runtime] event      │
╰──────────┬───────────╯
           ▼
┌──────────────────────┐
│ [entry file]         │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ [shared core]        │
└──────────┬───────────┘
           ▼
╭──────────────────────╮
│ [allow, deny or add] │
╰──────────────────────╯
```

Dependency direction: [entry] ───▶ [adapter] ───▶ [core].

---

## 3. DIRECTORY TREE

```text
[folder]/
+-- README.md
+-- [entry file]         # [What it does]
+-- lib/                 # [Shared helpers, never loaded as entries]
`-- tests/               # [Suites for the entries]
```

---

## 4. ENTRY MAP

| Entry | Event | Real file or core | Effect |
|---|---|---|---|
| `[entry file]` | `[event]` | `[path to the core]` | [What the session sees] |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | [What an entry may import] |
| Ownership | [What belongs in the core and what belongs here] |
| Failure | [What happens when a core throws, and which entries can refuse a call] |

---

## 6. CONFIGURATION

[Which switches the entries read, and where a setting for them lives.]

| Switch | Effect |
|---|---|
| `[SWITCH_NAME]=1` | [What it turns off] |

---

## 7. VALIDATION

Run from the repository root.

```bash
[test command]
[check that every entry resolves]
```

Expected result: [what each command prints, and the exit code].

---

## 8. RELATED

- [`[runtime config file]`]([relative path]): [what it registers]
- [`.skilled/hooks/README.md`]([relative path]): the hook cores and the coverage matrix
- [`../SYNC.md`](../SYNC.md): what in this runtime folder is generated, linked or authored
````

---

## 5. VALIDATION CHECKLIST

- [ ] OVERVIEW says how the runtime finds the entries and what kind of file each one is.
- [ ] The entry map has a row for every entry in the folder, and every core it names exists.
- [ ] Every entry that can refuse a call is named, and the failure rule covers the rest.
- [ ] Every VALIDATION command ran from the repository root, and its result is shown.
- [ ] H2 sections are numbered, ALL CAPS and separated by `---`.
- [ ] `validate_document.py` reports zero issues and `hvr_scan.py` reports zero hard blockers.

---

## 6. RELATED RESOURCES

- [`readme-template.md`](./readme-template.md) - Selection guide, and the component scaffold for a self-contained package.
- [`hook-readme-template.md`](./hook-readme-template.md) - The hook folders whose adapters these entries load.
- [`runtime-folder-template.md`](./runtime-folder-template.md) - The runtime folder README and sync manifest this folder sits under.
- [`hvr-rules.md`](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules.
