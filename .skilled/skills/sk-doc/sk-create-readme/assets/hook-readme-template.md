---
title: Hook Folder README Template
description: Fillable scaffolds for a shared hook folder README under .skilled/hooks/ and for the runtime adapter folders inside it, built around the runtime coverage table.
trigger_phrases:
  - "hook readme template"
  - "hook folder readme"
  - "hook adapter readme"
  - "runtime coverage table"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Hook Folder README Template

Use this template for the README of a hook folder under `.skilled/hooks/<name>/`, and for the runtime folders inside it, such as `claude/` or `pi/`.

---

## 1. OVERVIEW

### Purpose

A hook folder holds one concern. It keeps a shared core in `lib/` and a thin adapter for each runtime that runs it. Its README tells a maintainer what the concern does and which runtimes run it. It also says where each adapter really lives and how to switch the concern off. The runtime coverage table is the part most readers come for, so it gets a section of its own.

### Usage

Copy the scaffold in Section 4 into the hook folder as `README.md`. Fill it from the adapters and the files that register them, such as the hook registry and each runtime's config file. Then remove the sections the concern does not need and renumber the rest. Section 5 holds a shorter scaffold for each runtime folder inside the hook folder.

The README has no tagline. Its title names the concern and what it does, as in `Decision Capture: Operator Answer Queue for the Next Save`. A hook folder sits below the repository root, so the README separates its H2 sections with `---` rules, never with the `&nbsp;` spacers of a root guide.

Two folders in `.skilled/hooks/` do not use this template. The library README at `.skilled/hooks/README.md` has its own switch index and coverage matrix, and `shared/` holds helpers every adapter calls. Write both from [`readme-code-template.md`](./readme-code-template.md).

---

## 2. SECTION MODEL

| # | Section | Keep When |
|---|---|---|
| 1 | OVERVIEW | Always. What the concern does, the core file, the concern key and its switch |
| 2 | HOW IT WORKS | The core makes decisions worth explaining, such as verdicts, matching rules, locks or limits |
| 3 | RUNTIME COVERAGE | Always. One row for every runtime, including the ones with no adapter |
| 4 | DIRECTORY TREE | Always. The folder has a subfolder for each runtime |
| 5 | KEY FILES | Always. Include the files outside the folder that hold the concern together |
| 6 | CONFIGURATION | Always. The concern switch, the master switch and any flags |
| 7 | VALIDATION | Always. The test suites and one smoke test with the switch set |
| 8 | RELATED | Always |

A concern an operator starts by hand may put QUICK START in place of HOW IT WORKS. The session handover folder does this, because a reader first needs the command that starts the loop.

---

## 3. WRITING RULES

- Open OVERVIEW with what the concern does for a session. Then name the core file every adapter imports.
- State the concern key and the switch name. Say so when the key differs from the folder name, because the switch name is built from the key.
- Explain HOW IT WORKS with the exported function names, so a reader can open the core at the right place.
- Give every runtime a row in RUNTIME COVERAGE. A row that reads `None` tells the reader the gap is known.
- Name the real file in each row as well as the entry the runtime loads. A runtime that loads a link or a one-line re-export still runs the file in this folder.
- After the table, say how each runtime registers the adapter. Name the file that does it, such as the hook registry, `.vibe/hooks.toml`, the DSH bundle or the Pi entry.
- Say how each adapter fails, in the terms the runtime shows: exit 0 with no output, one warning line or a swallowed error.
- Keep counts a reader can check against the folder. A count that drifts, such as a test total, needs a `readme-check` allow comment that says where it comes from.
- Use plain words in prose. Name a switch, event or file only where the reader sets it or opens it.

---

## 4. FILLABLE SCAFFOLD

````markdown
---
title: "[Concern Name]: [What It Does]"
description: "[One sentence on what the concern does, then which runtimes run it.]"
trigger_phrases:
  - "[concern name]"
  - "[concern] hook"
importance_tier: "normal"
contextType: "reference"
---

# [Concern Name]: [What It Does]

---

## 1. OVERVIEW

`[folder]/` [does what for the session, in one or two sentences].

[How the parts fit: the core in `lib/[core-file]`, which every adapter imports, and any sweep or helper beside it.]

The concern key is `[key]`. Its switch is `[SWITCH_NAME]`, and `SYSTEM_HOOKS_DISABLED=1` is the master switch. [Say so when the key differs from the folder name.]

---

## 2. HOW IT WORKS

[One paragraph for each decision the core makes. Name the exported function, what it reads and what it returns. Add a table when the core returns a fixed set of verdicts or reasons.]

| Reason | Verdict | When |
|---|---|---|
| `[reason]` | [pass or fire] | [The condition that returns it] |

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `[Event]` | `claude/[file]` | `.skilled/hooks/[folder]/claude/[file]` | [What the session sees] |
| [Runtime] | None | None | None | Nothing. [Why there is no adapter] |

[How each runtime registers its adapter, with the file that does it and the timeout when there is one.]

[How each adapter fails, in the terms the runtime shows.]

---

## 4. DIRECTORY TREE

```text
[folder]/
+-- README.md
+-- claude/    [file], its test and fixtures/
+-- lib/       [core-file] and its test
`-- tests/     [suite]
```

[One sentence on the README each runtime folder carries.]

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/[core-file]` | [What the core decides] |
| `claude/[file]` | The Claude adapter. |
| `.skilled/hooks/shared/hook-flags.cjs` | The switch resolver every adapter calls. |

---

## 6. CONFIGURATION

The concern is on by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Switch | Concern key | Effect |
|---|---|---|
| `[SWITCH_NAME]=1` | `[key]` | [What every adapter does when it is set] |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Turns off this concern along with every other repository hook. |

Set a switch inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `.skilled/hooks/hook-flags.env.example`. The environment wins over the file.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/[folder]/lib/
```

Expected result: every case passes and the command exits 0.

```bash
[SWITCH_NAME]=1 node .skilled/hooks/[folder]/claude/[file] < /dev/null
```

Expected result: no output on either stream and exit status 0.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../shared/README.md`](../shared/README.md): the switch resolver every adapter calls.
- [`[runtime file]`]([relative path]): [what it registers].
````

---

## 5. RUNTIME FOLDER SCAFFOLD

Each runtime folder inside a hook folder, such as `claude/` or `pi/`, gets a short README of its own. It covers one adapter for one runtime: the event, the registration, what the adapter reads and how it fails. The other subfolders, such as `lib/` and `tests/`, are ordinary code folders and use [`readme-code-template.md`](./readme-code-template.md).

````markdown
---
title: "[Runtime] [Concern Name]: [Event] Adapter"
description: "[Runtime] adapter that [does what] for the [concern] concern."
trigger_phrases:
  - "[runtime] [concern]"
version: 1.0.0.0
---

# [Runtime] [Concern Name]: [Event] Adapter

---

## 1. OVERVIEW

`.skilled/hooks/[folder]/[runtime]/` holds the [Runtime] adapter for the [concern] concern. It runs at `[Event]` and [does what]. [What the session sees, or that it prints nothing.]

[Runtime] registers the adapter in `[config file]` at `[Event]`. [The matcher, the timeout and any fallback. Which other runtimes keep their own adapters.]

[What the adapter reads first, and when it returns at once.]

The concern switch is `[SWITCH_NAME]`, and `SYSTEM_HOOKS_DISABLED` is the master switch. [How every failure ends.]

---

## 2. DIRECTORY TREE

```text
[runtime]/
+-- README.md
+-- [adapter file]
`-- [test file]
```

| File | Responsibility |
|---|---|
| `[adapter file]` | The adapter. [What it checks and calls.] |
| `[test file]` | [What the suite replays and asserts.] |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/[folder]/[runtime]/[test file]
```

Expected result: [what each case asserts, and that it passes].

---

## 4. RELATED

- [`../README.md`](../README.md): the [concern] folder.
- [`../lib/[core-file]`](../lib/[core-file]): the shared core this adapter calls.
````

A flat runtime folder may swap the tree for the file table alone. The table must then name every file other than the README.

---

## 6. VALIDATION CHECKLIST

- [ ] OVERVIEW names the core file, the concern key and the switch.
- [ ] RUNTIME COVERAGE has a row for every runtime in the hooks coverage matrix, with the real file in each covered row.
- [ ] Each runtime's registration and failure behavior matches its config file and its adapter.
- [ ] Every path in KEY FILES and RELATED exists from the README's folder or the repository root, as written.
- [ ] Every VALIDATION command ran from the repository root, and its result is shown.
- [ ] H2 sections are numbered, ALL CAPS and separated by `---`.
- [ ] `validate_document.py` reports zero issues and `hvr_scan.py` reports zero hard blockers.

---

## 7. RELATED RESOURCES

- [`readme-template.md`](./readme-template.md) - Selection guide for every README template.
- [`runtime-plugin-readme-template.md`](./runtime-plugin-readme-template.md) - The runtime folder that loads these adapters.
- [`readme-code-template.md`](./readme-code-template.md) - Code-folder scaffold for `lib/`, `bin/` and `tests/`.
- [`hvr-rules.md`](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules.
