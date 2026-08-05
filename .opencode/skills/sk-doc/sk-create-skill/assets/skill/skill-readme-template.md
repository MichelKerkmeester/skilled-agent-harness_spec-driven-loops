---
title: Skill README Template
description: Template for human-facing skill README files in the narrative voice used by the repo root README and the changelogs: purpose-first identity, capability sections, at-a-glance table, problem-first overview, quick start, HVR enforcement, versioning and a strict validation checklist.
trigger_phrases:
  - "skill readme template"
  - "narrative skill readme"
  - "human facing skill readme"
  - "skill readme scaffold"
importance_tier: normal
contextType: general
version: 1.10.0.0
---

# Skill README Template

Use this template for `.opencode/skills/[skill-name]/README.md`. It writes a skill README in the same narrative voice the repo root `README.md` and the changelogs use: a one-line human pitch, an at-a-glance table near the top, a problem-first overview, then quick start, navigation and a verification close.

---

## 1. OVERVIEW

### Purpose

Give a person a fast, honest orientation to a skill before they open `SKILL.md`. The README answers what outcome the skill delivers, when to reach for it, what it does not own and how to navigate its files. `SKILL.md` stays the runtime instruction surface. The README is the front door a person reads.

### Identity Guidance (Purpose First)

The identity of a skill is the outcome it delivers, not the tools it routes between. Write the identity as one sentence a person would say out loud. Place that sentence before any tool name. The CLIs, the commands, the routing paths and the reference files are the means. They are described only after the outcome statement, in the pitch or in What It Does. A README that opens with a tool name has not found its identity yet.

The pilot README for mcp-obsidian states the outcome first: it makes AI use inside Obsidian effective. The CLIs and the MCP server are named later, as the surfaces that deliver that outcome. Follow that order. The outcome sentence and the pitch say the same thing twice on purpose: once in the frontmatter description, once in the blockquote, so the identity survives both a skim and a deep read.

### Usage

Copy the fillable scaffold in Section 6 into `.opencode/skills/[skill-name]/README.md`, then replace every placeholder with current behavior taken from the skill's real files. Keep the numbered ALL-CAPS section headers, the house style and the validator both require them. Drop any section that does not earn its place and renumber the rest.

### What Changed From The Old Style

The previous skill READMEs read as tabular reference cards: a feature inventory, a structure tree, a settings table and a command list, with no human entry point. This template keeps the facts but leads with the reader. The differences:

- A one-line pitch in a blockquote right after the H1, stating the outcome before any tool name.
- An identity guidance block that puts the delivered outcome ahead of the tooling.
- A capability section pattern for a skill's headline strengths, modeled on the pilot's Plugin Knowledge Layer.
- A dedicated HVR enforcement section with the banned forms and the scripted checks.
- Versioning conventions and a validation checklist that matches the pilot's gates.

---

## 2. SECTION MODEL

A skill README uses numbered ALL-CAPS H2 sections with `---` dividers between them. The default order:

| # | Section | Purpose | Keep When |
|---|---------|---------|-----------|
| 1 | AT A GLANCE | Four-row table a reader scans in five seconds | Always |
| 2 | OVERVIEW | Problem-first "why", then "what it does" | Always (required by the validator) |
| 3 | QUICK START | The fastest path to a first result | Skill has commands, scripts or a workflow |
| 4 | HOW IT WORKS | The lifecycle or main workflow in prose, with a small ASCII diagram when the flow has multiple steps | Skill has non-obvious behavior worth narrating |
| 5 | INTEGRATION & NAVIGATION | When to use it, plus how it hands off to sibling skills | Readers can confuse it with a neighbor |
| 6 | TROUBLESHOOTING | The failure modes operators actually hit | Predictable issues exist |
| 7 | FAQ | The two to five questions readers keep asking | High-value answers exist |
| 8 | VERIFICATION | How you know the skill works | Skill ships a playbook or validation command |
| 9 | RELATED DOCUMENTS | Stable links out, `SKILL.md` first | Always when links exist |

`OVERVIEW` is the one required section. Its normalized name must appear as a numbered header so the validator finds it. Every other section is optional. A small utility skill might run four sections (AT A GLANCE, OVERVIEW, QUICK START, RELATED DOCUMENTS). A large orchestrator might run all nine. Match the count to the skill. Never pad to hit a number.

Inside OVERVIEW you may add two optional subsections. The first is a `### Why It Matters` value beat with two to four outcome bullets stated benefit-first. The second is the capability section below. Add the value beat when the payoff is not obvious from What It Does.

### Capability Section Pattern

When a skill has a headline strength, give it a named capability section inside OVERVIEW, after What It Does. Open the section with 1 to 2 narrative sentences that say why the strength matters to the reader. Reach for one analogy if it makes the mechanism land. Then model the table on the pilot's Plugin Knowledge Layer: the section name names the domain. One table row covers each capability. Each row states what the skill can actually operate, at the file or data level. No marketing adjectives and no feature without a mechanism. A row that reads like a slogan has not earned its place. The prose carries the why, the table carries the what.

```markdown
### The Plugin Knowledge Layer

| Plugin | What the skill knows how to operate |
|---|---|
| **Beancount Ledger** | append and patch balanced transactions in the structured `.beancount` ledger |
| **Obsidian Tables** | edit `columns`, `rows` and `views` inside `.table.md` JSON payloads |
```

---

## 3. WRITING RULES

- State the outcome before the tooling. The pitch and the identity guidance name what the reader gets. The tool names follow as the means.
- Write the problem as a short narrative, not a summary. Put the reader in a concrete failing situation and let them feel the pain before you name the solution. The repo root README opens this way. It describes losing every architecture decision when the session window closes, then introduces the fix. Aim for that texture at skill scale.
- Add a 2 to 3 sentence narrative hook right after the blockquote pitch, before AT A GLANCE, when a skill needs a running start into its story. Keep AT A GLANCE the first numbered section so the validator contract and the five-second scan both hold.
- Descriptive length is welcome. One idea per sentence governs clarity, not length. A sentence with a subordinate clause is fine when it reads naturally aloud. The banned forms in Section 4 stay banned regardless of length.
- Carry the explanation in prose. Reach for a table only when 4 or more parallel items need a lookup grid (skill relationships, CLI flags, a comparison).
- A short, concrete analogy can carry an abstract mechanism better than adjectives (the repo root README uses "like a lab notebook for software", "like a triage nurse"). Use one only where it clarifies, never as decoration.
- Put the AT A GLANCE table first. Four rows, one line each, no prose cells.
- Name the canonical command or entry point in OVERVIEW or QUICK START so a reader knows where to start.
- Link to real files under `references/`, `assets/`, `scripts/`, `feature-catalog/` or `manual-testing-playbook/`. Verify each path resolves.
- State the expected output for every command you show, so a reader can tell success from failure.
- Be honest about boundaries and trade-offs. If the skill does not own something, say which skill does.
- Keep `SKILL.md` as the runtime surface. The README explains why and how to navigate. It does not restate long reference files.
- Follow the Human Voice Rules. Section 4 lists the banned forms and the scripted checks. It links the full ruleset.
- Vary subsection counts rather than defaulting to three.
- Document current state only. Do not paste spec packet history into a README. Use stable paths and commands. When behavior changes, update the README in the same pass, with a version bump and a changelog entry per Section 5.

---

## 4. HVR ENFORCEMENT

Every README this template produces must pass the Human Voice Rules. The full ruleset lives at [`hvr-rules.md`](../../../shared/references/hvr-rules.md).

### Banned Forms

The banned forms are: em dashes (U+2014), semicolons (U+003B), Oxford commas (a comma before the final and or or in a list), the hard-blocker words listed below and forced three-item groups.

### Scripted Checks

Run the checks below from the skill root, with the README path as the argument. Each command must return zero matches. The punctuation checks use hex escapes on purpose: the commands stay clean of the characters they enforce.

```bash
rg -n '\x{2014}' README.md
rg -n '\x{3B}' README.md
rg -n ',\s+(and|or)\b' README.md
rg -n '\b(delve|embark|realm|tapestry|illuminate|unveil|elucidate|abyss|revolutionise|game-changer|groundbreaking|cutting-edge|ever-evolving|shed light|dive deep|leverage|foster|nurture|resonate|empower|disrupt|curate|harness|elevate|robust|seamless|holistic|synergy|unpack|landscape|ecosystem|journey|paradigm|enlightening|esteemed|remarkable|skyrocket|skyrocketing|utilize|utilizing)\b' README.md
# Context-dependent words: landscape, ecosystem, journey, unlock, navigating
# Banned as metaphor, allowed in literal use. Judge each hit in context.
```

The word check lists the hard blockers. A hit inside a code sample or a quoted command is exempt. A hit in prose is a violation. Context-dependent words from the full ruleset are banned as metaphor and allowed in literal use. Judge each hit in context.

Forced three-item groups are the fifth banned form. No exactly-three inline enumerations: use 2, 4 or 5 items. Tables and bullet lists are exempt. No exactly-three H3 subsections under every H2: vary the count.

---

## 5. VERSIONING CONVENTIONS

Every skill README carries a version in its frontmatter: `version: X.Y.Z.W`, the same 4-part scheme `SKILL.md` uses. Bump the README version on every release, whether the change touched the README text or the skill it documents. The README states the current state, so a behavior change is a README change even when the prose barely moves.

Every release gets a per-skill changelog entry at `changelog/<version>.md`. The entry follows the shared [changelog template](../../../shared/assets/changelog-template.md) and its message-release shape: NEW covers what arrived, CHANGED covers what moved, NOT CHANGED covers what stayed untouched.

`SKILL.md` and the README carry versions that move together. A skill release bumps both files. The changelog entry records the new version.

---

## 6. FILLABLE SCAFFOLD

Copy this into `.opencode/skills/[skill-name]/README.md`, fill every placeholder from the skill's real files, then remove sections that do not fit and renumber.

````markdown
---
title: "[skill-name]"
description: "[One sentence. The outcome the skill delivers, stated before any tool name, then who reaches for it.]"
trigger_phrases:
  - "[primary routing phrase]"
  - "[secondary routing phrase]"
version: 1.0.0.0
---

# [skill-name]

> [One line. The delivered outcome, in plain words a person would say out loud, stated before any tool name.]

[Optional narrative hook, two to three sentences. A running start into the skill's story for a reader who wants context before the scan table. Delete it for a small utility skill. AT A GLANCE stays the first numbered section.]

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | [The problem it solves, one line.] |
| **Invoke with** | [Trigger keywords, command or routing path.] |
| **Works on** | [Inputs, surfaces or scope.] |
| **Produces** | [The artifacts or decisions it returns.] |

---

## 2. OVERVIEW

### Why This Skill Exists

[A short problem narrative, three to six sentences. Put the reader in a concrete failing situation and let them feel it before you name the solution. State the problem before the solution. No feature list here. Write it the way the root README opens, shown in the comment below, then delete the comment.]

<!-- Example shape, replace with the skill's real problem and delete this comment:
AI coding assistants have amnesia. Every session starts from zero. You explain your architecture on Monday and by Wednesday it is gone. The decisions, the trade-offs, the reasoning behind them, all lost the moment the window closes. This skill fixes that. -->

### What It Does

[Two to four sentences. The core capability in plain language, naming the canonical command or entry point. If a sibling skill is easy to confuse with this one, name the boundary in a sentence.]

### Why It Matters

[Optional. Two to four outcome bullets, benefit-first, each naming what the reader gets rather than what the skill has. Model: the root README "Reasons to try it" bullets. Drop this subsection when the payoff is already obvious from What It Does.]

- **[Outcome, not feature]:** [the concrete benefit in plain words]
- **[Outcome, not feature]:** [the concrete benefit in plain words]

### [The [Domain] Knowledge Layer]

[Optional. Present when the skill has a headline strength worth a dedicated table. Name the layer after the domain. Model: the pilot's Plugin Knowledge Layer.]

[One to two sentences that say why this strength matters to the reader, with one analogy if it helps the mechanism land. The prose carries the why.]

[Then the table. One row per capability, each row stating what the skill can actually operate at the file or data level. The table carries the what.]

| [Capability] | What the skill knows how to operate |
|---|---|
| [Name] | [The concrete operation, one line.] |
| [Name] | [The concrete operation, one line.] |

---

## 3. QUICK START

**Step 1: Invoke it.** [Automatic routing, a slash command or the manual read path.]

**Step 2: Run the primary workflow.**

```bash
[command]
```

[What success looks like in one line.]

**Step 3: Verify before you rely on it.**

```bash
[verification-command]
```

[Expected exit code or output.]

---

## 4. HOW IT WORKS

[Narrate the lifecycle or main workflow as prose: the sequence of steps, the decision points and the outputs. A reader should finish this section understanding the shape of the skill.]

[For any skill with a multi-step flow, include a small ASCII diagram of how the pieces connect, modeled on the root README connection diagram. Keep it to the boxes a reader needs. Drop the diagram only for a genuinely linear one-step skill.]

```text
[request]
   |
   v
[the routing or decision step]
   |
   v
[the surface that does the work]  -->  [the output the reader gets]
```

### [Key Concept]

[Explain one behavior that is not obvious from the name, with a concrete example.]

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

[Two to four real scenarios. Where the boundary with an adjacent skill is fuzzy, say which skill owns what so a reader does not misroute.]

### Related Skills

| Skill | Relationship |
|---|---|
| `[skill]` | [How the two hand off.] |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| [Symptom] | [Cause] | [Action] |

---

## 7. FAQ

**Q: [The question a reader actually asks, including "why this instead of X".]**

A: [A short, direct answer. Link a stable file when it helps.]

---

## 8. VERIFICATION

[For skills that ship a manual testing playbook or validation commands. List the checks that prove the skill works, plus the one command that runs them all. Remove this section for a small skill.]

| Check | Result |
|---|---|
| README structure | [the readme validator command] reports zero issues |
| [Test or gate] | [How to run it. What a pass looks like.] |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic |
| [`references/[name].md`](./references/[name].md) | [Why it matters] |
| [`assets/[name].md`](./assets/[name].md) | [How it is used] |
````

---

## 7. VALIDATION CHECKLIST

Each check has a pass criterion. A check only passes when its criterion holds, not when the file merely looks close.

| # | Check | Pass criterion |
|---|---|---|
| 1 | Pitch | H1 is followed by a one-line blockquote stating the delivered outcome |
| 2 | AT A GLANCE | First section, four rows, one line each |
| 3 | Numbered ALL-CAPS H2 | Every H2 is numbered sequentially with `---` dividers |
| 4 | OVERVIEW required | A numbered OVERVIEW section exists and opens problem-first |
| 5 | Command output expectations | Every command block shows its expected output |
| 6 | Link verification | Every relative link resolves on disk |
| 7 | HVR clean | The four greps in Section 4 return zero matches outside code fences |
| 8 | Validator | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues |
| 9 | Optional sections | Sections without real content were removed and the rest renumbered |
| 10 | Problem narrative | OVERVIEW opens with a concrete failing situation the reader recognizes, not a one-line summary |
| 11 | Connection diagram | A multi-step skill includes a small ASCII diagram of how the pieces connect |

Pass criteria in full:

| # | Pass criterion |
|---|---|
| 1 | A reader can say the outcome aloud from the pitch alone, without reading further. The pitch names no tool before the outcome. |
| 2 | The table has exactly four Aspect rows and no cell wraps to a second line. |
| 3 | `rg -n '^## [0-9]+\. ' README.md` lists every H2 in ascending order. Every title is ALL CAPS. |
| 4 | The validator reports zero issues. The first OVERVIEW paragraph names the reader's situation before any feature list. |
| 5 | A reader can tell success from failure without running the command. |
| 6 | Each target path exists relative to the README folder. |
| 7 | The em dash, semicolon, Oxford comma and banned-word greps report no prose hits. |
| 8 | The command exits 0 and reports zero issues. |
| 9 | The final section numbers run in order with no gaps. |
| 10 | The first OVERVIEW paragraph reads as a short story a reader feels, three to six sentences, before any feature list. |
| 11 | Skills with more than one step in HOW IT WORKS carry an ASCII diagram. A single-step utility skill is exempt. |

> The validator is a floor, not a proxy for this checklist. It enforces a numbered ALL-CAPS H2 named OVERVIEW and little else. It does not check the pitch, the AT A GLANCE table, command outputs, links or HVR. A green run means the file cleared the floor, not that it passed the nine checks above.

---

## 8. DIRECTIVE CROSS-CHECK

The pilot README work distilled eight writing directives. Every directive has a home in this template. This table maps each one to its location so no pilot lesson goes missing.

| Pilot directive | Template home | What the home says |
|---|---|---|
| Purpose-first identity | Section 1 Identity Guidance, Section 6 pitch and description placeholders | The outcome statement opens the README. The tooling is named after it as the means. |
| Problem-first OVERVIEW | Section 2 OVERVIEW row, Section 6 Why This Skill Exists | The reader's situation and what goes wrong without the skill come before any feature list. |
| One-line pitch | Section 3 first bullet, Section 6 blockquote | H1 is followed by a one-line blockquote stating the outcome in plain words. |
| Narrative prose | Section 3 Writing Rules | Prose carries the explanation. Tables appear only for genuine lookups. |
| Template structure | Section 2 Section Model, Section 6 scaffold | Numbered ALL-CAPS H2 with `---` dividers, AT A GLANCE first, OVERVIEW the only required section. |
| Human Voice Rules | Section 4 HVR Enforcement, Section 7 HVR row | Banned forms listed verbatim, scripted checks, link to hvr-rules.md. |
| Honest boundaries | Section 3 boundaries bullet | What the skill does not own is stated, with the sibling skill that owns it. |
| Current state only | Section 3 current-state bullet, Section 5 Versioning | Current behavior with stable paths. Version and changelog move with every release. |

---

## 9. RELATED RESOURCES

- [`readme-template.md`](../../../sk-create-readme/assets/readme-template.md) - General README scaffold this skill template narrows.
- [`creation-workflow.md`](../../references/skill/creation-workflow.md) - Skill creation workflow and lifecycle guidance.
- [`skill-md-template.md`](./skill-md-template.md) - Runtime `SKILL.md` scaffold.
- [`skill-reference-template.md`](./skill-reference-template.md) - Reference-file scaffold.
- [`hvr-rules.md`](../../../shared/references/hvr-rules.md) - Human Voice Rules, the voice this template writes in.
- [`changelog-template.md`](../../../shared/assets/changelog-template.md) - Changelog entry format every skill release follows.
