---
title: Install Guide Template
description: Fillable scaffold for a repository install guide at the root, INSTALL.md, written in plain steps with one command block per action and a verification step before anything else.
trigger_phrases:
  - "install guide template"
  - "repository install guide"
  - "installation guide scaffold"
  - "install.md template"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Install Guide Template

Use this template for a repository's `INSTALL.md`, the guide a front page points to when installing takes more than a few commands.

---

## 1. OVERVIEW

### Purpose

An install guide takes a reader from an empty machine to a working setup they have checked. The front page keeps only the minimum commands and links here for the rest. This guide holds every step with the check that proves it.

### Usage

Copy the scaffold in Section 4 to the repository root as `INSTALL.md`. Fill it from commands you ran on a clean checkout, then remove the sections the project does not need.

An install guide for one skill is a different document. It lives next to that skill's `SKILL.md` as `INSTALL-GUIDE.md`, and the validator holds it to the install-guide rules and their required sections.

---

## 2. SECTION MODEL

| # | Section | Keep When |
|---|---|---|
| 1 | OVERVIEW | Always. Say what the reader has at the end, and compare the ways to install when there is more than one |
| 2 | INSTALL | Always. Prerequisites, then each step, then a check of the result |
| 3 | UPDATE AND UNINSTALL | Readers keep the project for longer than one session |
| 4 | TROUBLESHOOTING | Readers hit known errors |
| 5 | RELATED DOCUMENTS | Always when links exist |

A project with two install paths, such as linking a checkout and copying it in, gives each path its own H2 after section 2 and walks it as numbered steps.

---

## 3. WRITING RULES

- Open with two or three sentences under the title. Say what the guide installs and what each section covers.
- Write one short sentence before each command block, saying what the block does or why it comes first.
- Put only what the reader types in a code block. Keep explanation out of it.
- State exact versions in the prerequisites, and say why a version matters when it does.
- Make the check a step of its own. The reader confirms one stage works before starting the next.
- Show what success looks like after each check, and name the one command to run when it fails.
- Keep optional extras after the core install, each with what it adds and what it costs.
- Use a table for troubleshooting, with the exact message the reader sees in the first column.
- Use plain words in prose. Name a file or setting only where the reader opens it or sets it.

Separators: an `INSTALL.md` is not one of the root guides the validator exempts, so separate its H2 sections with `---` rules. Use `&nbsp;` spacers only when the repository exempts its install guide by name.

---

## 4. FILLABLE SCAFFOLD

````markdown
# Install [PROJECT_NAME]

This guide installs [PROJECT_NAME] and checks that it works. [One sentence on what the later sections cover.]

---

## 1. OVERVIEW

[What the reader has at the end, in one or two sentences.]

[When there is more than one way to install, compare them. Delete this table when there is one way.]

| | [Option A] | [Option B] |
| --- | --- | --- |
| **How it works** | [One line] | [One line] |
| **Updates** | [One line] | [One line] |
| **Choose it when** | [One line] | [One line] |

[One sentence that recommends one option.]

---

## 2. INSTALL

### Prerequisites

[What the reader needs first, with exact versions, in one or two sentences.]

### Get The Code

[One sentence on what this step does.]

```bash
[command]
```

### Build

[One sentence on why this step comes next.]

```bash
[command]
```

### Check The Install

[One sentence on what the check proves.]

```bash
[verification command]
```

[What success looks like. The one command to run when it fails.]

### [Optional Extra]

[What it adds and what it costs. Then the command that adds it.]

---

## 3. UPDATE AND UNINSTALL

### Update

[How to move to a newer release, and the check to run afterward.]

```bash
[update command]
```

### Uninstall

[What uninstalling removes and what it leaves behind.]

```bash
[uninstall command]
```

---

## 4. TROUBLESHOOTING

| You see | Cause | Fix |
| --- | --- | --- |
| `[exact message]` | [Why it happens] | [What to run] |

---

## 5. RELATED DOCUMENTS

- [README](README.md): what [PROJECT_NAME] is and what each part does.
- [Contributing](CONTRIBUTING.md): how to set up for development.
````

---

## 5. VALIDATION CHECKLIST

- [ ] Every command ran on a clean checkout, in the order the guide gives.
- [ ] Each command block holds only what the reader types.
- [ ] Every check shows what success looks like and the fix when it fails.
- [ ] Prerequisites name exact versions.
- [ ] Each troubleshooting row starts with the exact message the reader sees.
- [ ] H2 sections are numbered, ALL CAPS and separated by `---`.
- [ ] Every local link resolves from the repository root.
- [ ] HVR passes: no em dashes, semicolons, banned words or setup phrases.

---

## 6. RELATED RESOURCES

- [`readme-template.md`](./readme-template.md) - Selection guide and the front-page scaffold that links to this guide.
- [`contributing-template.md`](./contributing-template.md) - Contributing guide scaffold, which reuses the install steps for development.
- [`hvr-rules.md`](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules.
