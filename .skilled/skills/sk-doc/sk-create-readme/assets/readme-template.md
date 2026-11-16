---
title: README Template and Selection Guide
description: Selection guide and fillable scaffolds for README files, from a repository front page to feature and component READMEs, with routing to the skill, code-folder, install, contributing and security templates.
trigger_phrases:
  - "readme selection guide"
  - "project readme template"
  - "front page readme template"
  - "skill readme routing"
  - "narrative readme structure"
importance_tier: normal
contextType: general
version: 1.2.4.0
---

# README Template and Selection Guide

Use this file to pick the right README template, then to write a repository front page or a feature or component README. The other templates in this folder cover skills, source-code folders, install guides, contributing guides and security policies.

---

## 1. README SELECTION

A README answers two questions: what is this, and how does someone use it or find their way around it?

| Type | Use When | Template |
|---|---|---|
| Front page | The repository root needs a public entry point | Section 7 of this file |
| Install guide | Installing takes more than a few commands | [`install-template.md`](./install-template.md) |
| Contributing guide | Outside people send changes | [`contributing-template.md`](./contributing-template.md) |
| Security policy | People need a private way to report a flaw | [`security-policy-template.md`](./security-policy-template.md) |
| Skill | A skill needs human-facing context beyond `SKILL.md` | [`skill-readme-template.md`](./skill-readme-template.md) |
| Feature | A user-facing feature needs setup, usage or behavior notes | Section 6 of this file |
| Component | A reusable module has an API, examples or configuration | Section 6 of this file, trimmed |
| Code Folder | A source directory needs developer orientation | [`readme-code-template.md`](./readme-code-template.md) |

Create a README when someone can land in the folder and needs orientation. Skip it when inline comments or a nearby parent README already explain the folder.

```text
Is this the repository root?
+-- Yes: write the front page. Add an install, contributing or security guide only when readers need one.
`-- No: is this a skill package?
    +-- Yes: use skill-readme-template.md.
    `-- No: is this source-code orientation?
        +-- Yes: use readme-code-template.md.
        `-- No: write a focused README only if readers need setup, usage or navigation help.
```

Keep READMEs current-state only. Do not cite spec packet numbers or phase IDs. Use feature names, file paths, commands and stable source links.

Two root guides have no template on purpose. A maintainer's release guide follows one project's own tools and version scheme, so a shared scaffold would hold little beyond placeholders. A map of folders a generator writes is the same: its rows are the project. Write either one as a general README from Section 6, with the root-guide separators from Section 4.

---

## 2. GENERAL STRUCTURE

Use only the sections that fit the audience. A front page often needs most of them. Feature and component READMEs should stay shorter.

| Section | Include When | Content |
|---|---|---|
| Overview | Always | Purpose, audience, main value and prerequisites |
| Key Statistics | Useful facts help readers decide scope | Counts, version, supported modes, limits |
| How This Compares | Readers may confuse this with nearby tools | Short comparison table |
| Quick Start | Readers need to run or try something | Short setup, verification and first use |
| Features | Capabilities need explanation | Feature groups, behavior notes and examples |
| Requirements | Runtime, tool or service needs exist | Minimum versions, permissions and external services |
| Structure | Navigation matters | Directory tree and key files |
| Configuration | Settings exist | The few settings readers change, with their defaults |
| Usage Examples | Patterns are easier shown than described | Simple and advanced examples with expected results |
| Troubleshooting | Users can hit known issues | What they see, cause and fix |
| FAQ | Repeated questions exist | One heading per question, a short answer under each |
| Related Resources | Always when links exist | Grouped skills, documents, commands or external references |

Code-folder READMEs are different. Do not force Quick Start, Features, FAQ or Troubleshooting unless the directory has runnable commands or known reader problems. Use [`readme-code-template.md`](./readme-code-template.md).

---

## 3. SKILL AND PROJECT PROFILE

A skill README has its own template, [`skill-readme-template.md`](./skill-readme-template.md). Use the profile below for package roots and project READMEs that need more than a bare overview.

| Profile Block | Good For | Keep It Short By |
|---|---|---|
| `trigger_phrases` | Search, memory and skill routing | 3-8 concrete phrases |
| Key Statistics | Counts, tool totals, version facts | Use one compact table |
| How This Compares | Neighboring tools | Compare only reader-relevant differences |
| Key Features | Current capability inventory | Group related features |
| Requirements | Tooling and runtime needs | Separate required from optional |
| Related Documents | Operator or developer references | Link stable docs, not packet history |
| FAQ | Repeated questions | 3-6 high-value questions |

Sections use plain numbered H2 headings. Do not add `<!-- ANCHOR -->` comments or a Table of Contents.

```markdown
## 1. OVERVIEW

[Section content]
```

---

## 4. WRITING RULES

Write for reading first, then scanning. A reader should be able to act after one pass.

### Sentences And Paragraphs

- Write short sentences with one idea each.
- Explain in real paragraphs. Keep bullets for things a reader scans: highlights, options, steps and parallel facts.
- Lead with what the thing does for the reader, then how it works.
- Use plain words in prose. Name a setting or a file path only where the reader acts on it, such as a value they set or a file they open.
- Put detail behind a plain-word link, such as `the [install guide](INSTALL.md)`, instead of restating it or spelling out the path in a sentence.
- Use code blocks only for what the reader types. A command the reader never runs belongs in a sentence or nowhere.
- Show expected output for verification commands, and test every command before documenting it.
- Use relative links for local docs.
- Give every inventory item a description. When an item needs more than one line, switch to the itemized pattern below instead of widening the table.
- Remove unused sections instead of leaving placeholders.

The itemized pattern for inventories where each item needs more than one line:

```markdown
**`spec.md`**
- What the feature is and why it exists.
- Required at every level.
```

Group related items under an unnumbered `#####` heading when the inventory has natural groups, for example by how each item is triggered.

### Front-Page Shape

A front page follows a fixed order, because each reader arrives with a different question.

- **Nav line.** Put one line of links under the first H2, so a reader jumps straight to what they came for. Bold the link a new reader needs first.
- **Highlights.** Follow the pitch with a short list of what the project holds: a bold name, a dash and one line each.
- **Install early.** Put the quick start right after the summary, ahead of how it works. A reader who already decided to try it should not scroll past the architecture.
- **Minimum commands.** When installing takes more than a few steps, keep only the minimum commands on the front page and point to an install guide.
- **FAQ headings.** Give each FAQ question its own H3 heading, phrased as the reader would ask it. The answer is a short paragraph under it.

Name the first section `OVERVIEW` even when it reads as a summary. The validator expects `OVERVIEW` first and warns on any other name.

### Section Separators

Most READMEs separate their H2 sections with a `---` rule, and the validator requires it. A repository's root guides use one `&nbsp;` line above each H2 instead, which keeps a long front page from reading as a stack of boxes.

The validator skips the `---` rule only for `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `INSTALL-SKILLED.md` and `PUBLIC-RELEASE.md` at a repository root, and for `.skilled/CROSS-CLI.md` one level down. Any other file uses `---`, including a README in a subfolder and an `INSTALL.md` at the root. Never mix the two separators in one file.

### Voice By README Type

| Type | Voice |
|---|---|
| Front page, Skill, Feature | Plain explanation first, reference detail later |
| Install, contributing and security guides | Plain steps. Name each command where the reader runs it |
| Component | Technical and concise |
| Code Folder | Technical and concise, via `readme-code-template.md` |

The front page may put a decorative emoji on each numbered H2. Every other README uses semantic emoji only (✅ ❌ ⚠️ 🔒 🚨) for rules and status markers.

Human Voice Rules apply to all README content:

- No em dashes. Use commas, periods or colons.
- No semicolons. Split the sentence or use "and".
- No Oxford comma in inline lists.
- No setup phrases.
- No banned words from the HVR reference.
- Prefer active voice and direct verbs.

Full reference: [`hvr-rules.md`](../../sk-create-with-human-voice/references/hvr-rules.md).

---

## 5. FRONTMATTER

Frontmatter is optional for normal project READMEs and recommended for skill or system documentation that should be discoverable. A repository front page usually has none, because hosting sites show it as a table above the title.

```yaml
---
title: "[DOCUMENT_TITLE]"
description: "[One-sentence description]"
trigger_phrases:
  - "[search phrase]"
  - "[routing phrase]"
---
```

Use frontmatter when it improves routing, search or maintenance. Omit it for small human-only documents.

---

## 6. FILLABLE SCAFFOLD

Copy this scaffold for a feature or component README below the repository root, then remove sections that do not apply. It separates sections with `---`, because a README below the root is never exempt from that rule.

````markdown
---
title: "[PROJECT_OR_FEATURE_NAME]"
description: "[One-sentence description]"
trigger_phrases:
  - "[search phrase]"
version: 1.0.0.0
---

# [PROJECT_OR_FEATURE_NAME]

> [One-sentence purpose statement.]

---

## 1. OVERVIEW

[Explain what this is, who it is for and why it exists.]

### Key Statistics

| Metric | Value |
|---|---|
| Status | [Current state] |
| Version | [Version or release channel] |
| Main audience | [Who uses this] |
| Operating modes | [Mode count or short list] |

### How This Compares

| Capability | This Project | Related Option |
|---|---|---|
| [Capability] | [Current behavior] | [Difference] |

---

## 2. QUICK START

```bash
# Install or prepare
[command]

# Verify
[command]
```

Expected result: [what success looks like].

---

## 3. FEATURES

### Key Features

| Feature | What It Does |
|---|---|
| [Feature] | [Current behavior] |

---

## 4. REQUIREMENTS

| Requirement | Minimum | Notes |
|---|---|---|
| [Runtime or tool] | [Version] | [Why it is needed] |

---

## 5. STRUCTURE

```text
[root]/
+-- [path]/        # [Purpose]
`-- [file]         # [Purpose]
```

| Path | Purpose |
|---|---|
| `[path]` | [Role] |

<!-- For items needing more than one line, use the itemized pattern
     from Section 4 instead of this table. -->

---

## 6. CONFIGURATION

| Option | Default | Purpose |
|---|---|---|
| `[OPTION]` | `[value]` | [What it controls] |

---

## 7. USAGE EXAMPLES

```bash
[command]
```

Result: [expected output or behavior].

---

## 8. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| [Symptom] | [Cause] | [Action] |

---

## 9. FAQ

### [Question readers ask often?]

[Short answer with a link when useful.]

---

## 10. RELATED RESOURCES

### Related Skills

| Skill | Relationship | Use When |
|---|---|---|
| [`[skill-name]`](../skill-name/SKILL.md) | [Sibling or dependency] | [When to use it] |

### Related Documents

| Document | Purpose |
|---|---|
| [`[Document]`](./path/to/doc.md) | [Why it matters] |
````

---

## 7. FRONT-PAGE SCAFFOLD

Copy this scaffold into the repository root as `README.md`. It is the only README that uses the front-page order from Section 4: nav line, highlights, install, then how it works. It separates sections with `&nbsp;`, which the validator accepts only for a root guide.

Check each nav-line anchor against the rendered heading. A heading with an emoji gets a second hyphen in its anchor, as in `#2--quick-start`.

````markdown
# [PROJECT_NAME] - [Short Descriptor]

[Optional: one line of badges, each linking to its source.]

&nbsp;

## 1. OVERVIEW

**[Quick Start](#2-quick-start)** · [How It Works](#3-how-it-works) · [Features](#4-features) · [FAQ](#6-faq)

[One sentence. What the project gives the reader, in plain words.]

[One sentence. Where it runs or who it is for.]

**What's inside**

- **[Highlight]** - [What it does for the reader, in one line]
- **[Highlight]** - [What it does for the reader, in one line]
- **[Highlight]** - [What it does for the reader, in one line]
- **[Highlight]** - [What it does for the reader, in one line]

&nbsp;

## 2. QUICK START

### Install

[One or two sentences on what the reader needs first, with versions.]

The [install guide](INSTALL.md) walks through every step. In short:

```bash
[the minimum commands]
```

[One sentence on why the commands run in this order, when it matters.]

### Check The Setup

[How the reader confirms it works.]

```bash
[verification command]
```

[What success looks like.]

### First Task

[The first useful thing to do, as one typed command or one plain request.]

&nbsp;

## 3. HOW IT WORKS

[Two or three short paragraphs on the main idea. Add a small diagram only when the parts are hard to picture.]

### [Part Name]

[What this part does for the reader. One idea per sentence. Link to its own README for detail.]

### [Part Name]

[What this part does for the reader.]

&nbsp;

## 4. FEATURES

[One sentence on how the features are grouped.]

### [Feature Name]

[What it does and why the reader cares. End with a plain-word link to its own document.]

### [Feature Name]

[What it does and why the reader cares.]

&nbsp;

## 5. CONFIGURATION

[One sentence on the defaults. Most readers change nothing.]

The few settings people change:

- **`[SETTING]`** [what it turns on or off]
- **`[SETTING]`** [what it turns on or off]

[One sentence that points to the full list of settings.]

&nbsp;

## 6. FAQ

### [A question readers ask?]

[A short, direct answer.]

### [Another question readers ask?]

[A short, direct answer.]

&nbsp;

## 7. RELATED DOCUMENTS

- **[Install Guide](INSTALL.md)** - [what it covers]
- **[Contributing](CONTRIBUTING.md)** - how to propose a change
- **[Security](SECURITY.md)** - how to report a problem privately
````

Give every major area its own H2 when a front page covers four or more, so each one gets a nav-line link. Drop any section that has nothing to say and renumber the rest, including the nav-line anchors.

---

## 8. VALIDATION CHECKLIST

- [ ] README type is correct. Skills use `skill-readme-template.md` and code folders use `readme-code-template.md`.
- [ ] Included sections match the audience and task.
- [ ] No empty sections remain.
- [ ] Commands were tested or marked as examples.
- [ ] Links use correct relative paths, and every nav-line anchor lands on its heading.
- [ ] Code blocks hold only what the reader types.
- [ ] Separators match the file: `&nbsp;` for an exempt root guide, `---` everywhere else.
- [ ] Each FAQ question is its own heading.
- [ ] Frontmatter is valid if present.
- [ ] No Table of Contents and no `<!-- ANCHOR -->` comments.
- [ ] HVR passes: no em dashes, semicolons, banned words or setup phrases.

---

## 9. RELATED RESOURCES

- [`skill-readme-template.md`](./skill-readme-template.md) - Skill package README scaffold.
- [`readme-code-template.md`](./readme-code-template.md) - Code-folder README scaffold.
- [`install-template.md`](./install-template.md) - Repository install guide scaffold.
- [`contributing-template.md`](./contributing-template.md) - Repository contributing guide scaffold.
- [`security-policy-template.md`](./security-policy-template.md) - Repository security policy scaffold.
- [`SKILL.md`](../SKILL.md) - README workflow and reference map.
- [`core-standards.md`](../../shared/references/core-standards.md) - Markdown formatting rules.
- [`validation.md`](../../shared/references/validation.md) - Document validation and DQI scoring.
- [`hvr-rules.md`](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules.
