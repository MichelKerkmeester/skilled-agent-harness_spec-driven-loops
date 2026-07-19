---
title: Skill README Template
description: Template for human-facing skill README files in the narrative voice used by the repo root README and the changelogs, covering the human pitch, at-a-glance table, problem-first overview, quick start, navigation and verification.
trigger_phrases:
  - "skill readme template"
  - "narrative skill readme"
  - "human facing skill readme"
  - "skill readme scaffold"
importance_tier: normal
contextType: general
version: 1.8.0.5
---

# Skill README Template

Use this template for `.opencode/skills/[skill-name]/README.md`. It writes a skill README in the same narrative voice the repo root `README.md` and the changelogs use: a one-line human pitch, an at-a-glance table near the top, a problem-first overview, then quick start, navigation and a verification close.

---

## 1. OVERVIEW

### Purpose

Give a human a fast, honest orientation to a skill before they open `SKILL.md`. The README answers what problem the skill solves, when to reach for it and how to navigate its files. `SKILL.md` stays the runtime instruction surface. The README is the front door a person reads.

### Usage

Copy the fillable scaffold in Section 4 into `.opencode/skills/[skill-name]/README.md`, then replace every placeholder with current behavior taken from the skill's real files. Keep the numbered ALL-CAPS section headers (the validator and the house style both require them). Drop any section that does not earn its place and renumber the rest.

### What Changed From The Old Style

The previous skill READMEs read as tabular reference cards: a feature inventory, a structure tree and a settings table, with no human entry point. This template keeps the facts but leads with the reader. The differences:

- A one-line pitch in a blockquote right after the H1, stating the outcome in plain words.
- An `AT A GLANCE` table as the first section, not a buried "Key Statistics" block.
- An `OVERVIEW` that opens with the problem the skill solves before listing what it does.
- Prose carries the explanation. Tables appear only for genuine lookups (4 or more parallel items).
- A `VERIFICATION` close for skills that ship test playbooks or validation commands.

### When To Write A Skill README

Write one when the skill has multiple modes, references, assets or scripts, when operators need quick-start or validation commands or when the skill takes part in skill-graph routing. Keep orientation inside `SKILL.md` only when the skill is tiny and its runtime instructions already orient a human.

---

## 2. SECTION MODEL

A skill README uses numbered ALL-CAPS H2 sections with `---` dividers between them. The default order:

| # | Section | Purpose | Keep When |
|---|---------|---------|-----------|
| 1 | AT A GLANCE | Four-row table a reader scans in five seconds | Always |
| 2 | OVERVIEW | Problem-first "why", then "what it does" | Always (required by the validator) |
| 3 | QUICK START | The fastest path to a first result | Skill has commands, scripts or a workflow |
| 4 | HOW IT WORKS | The lifecycle or main workflow, in prose | Skill has non-obvious behavior worth narrating |
| 5 | INTEGRATION & NAVIGATION | When to use it, and how it hands off to sibling skills | Readers can confuse it with a neighbor |
| 6 | TROUBLESHOOTING | The failure modes operators actually hit | Predictable issues exist |
| 7 | FAQ | The two to five questions readers keep asking | High-value answers exist |
| 8 | VERIFICATION | How you know the skill works | Skill ships a playbook or validation command |
| 9 | RELATED DOCUMENTS | Stable links out, `SKILL.md` first | Always when links exist |

`OVERVIEW` is the one required section, and its normalized name must appear as a numbered header so the validator finds it. Every other section is optional. A small utility skill might run four sections (AT A GLANCE, OVERVIEW, QUICK START, RELATED DOCUMENTS). A large orchestrator might run all nine. Match the count to the skill, and never pad to hit a number.

---

## 3. WRITING RULES

- Lead with the reader. The pitch and the OVERVIEW state the problem the skill solves before any feature list.
- Carry the explanation in prose. Reach for a table only when 4 or more parallel items need a lookup grid (skill relationships, CLI flags, a comparison).
- Put the AT A GLANCE table first. Four rows, one line each, no prose cells.
- Name the canonical command or entry point in OVERVIEW or QUICK START so a reader knows where to start.
- Link to real files under `references/`, `assets/`, `scripts/`, `feature-catalog/` or `manual-testing-playbook/`. Verify each path resolves.
- State the expected output for every command you show, so a reader can tell success from failure.
- Be honest about boundaries and trade-offs. If the skill does not own something, say which skill does.
- Keep `SKILL.md` as the runtime surface. The README explains why and how to navigate, and does not restate long reference files.
- Follow the Human Voice Rules: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Vary subsection counts rather than defaulting to three.
- Do not paste spec packet history into a README. Document current behavior with stable paths and commands.

---

## 4. FILLABLE SCAFFOLD

Copy this into `.opencode/skills/[skill-name]/README.md`, fill every placeholder from the skill's real files, then remove sections that do not fit and renumber.

````markdown
---
title: "[skill-name]"
description: "[One sentence: what the skill does and who reaches for it.]"
trigger_phrases:
  - "[primary routing phrase]"
  - "[secondary routing phrase]"
version: 1.0.0.0
---

# [skill-name]

> [One line. The outcome the skill delivers, in plain words a person would say out loud.]

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

[Two to four sentences, problem-first. Describe the situation a reader is in and what goes wrong without this skill. State the problem before the solution. No feature list here.]

### What It Does

[Two to four sentences. The core capability in plain language, naming the canonical command or entry point. If a sibling skill is easy to confuse with this one, name the boundary in a sentence.]

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

[Narrate the lifecycle or main workflow as prose: the sequence of steps, the decision points and the outputs. A reader should finish this section understanding the shape of the skill. Add one small table or flowchart only if it makes the flow clearer than prose can.]

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

[For skills that ship a manual testing playbook or validation commands. List the checks that prove the skill works, or the one command that runs them. Remove this section for a small skill.]

| Check | Result |
|---|---|
| [Test or gate] | [How to run it, and what a pass looks like.] |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic |
| [`references/[name].md`](./references/[name].md) | [Why it matters] |
| [`assets/[name].md`](./assets/[name].md) | [How it is used] |
````

---

## 5. VALIDATION CHECKLIST

- [ ] H1 is followed by a one-line blockquote pitch stating the outcome.
- [ ] `AT A GLANCE` is the first section and its table is four rows of one-line cells.
- [ ] A numbered `OVERVIEW` section exists and opens problem-first, before any feature list.
- [ ] H2 sections are numbered, ALL CAPS and separated by `---` dividers.
- [ ] Prose carries the explanation. Tables appear only for genuine 4-plus-item lookups.
- [ ] Every command shows its expected output, and every linked path resolves.
- [ ] Boundaries with sibling skills are stated where confusion is likely.
- [ ] `SKILL.md` and the README do not duplicate each other.
- [ ] Optional sections without real content were removed and the rest renumbered.
- [ ] HVR passes: no em dashes, semicolons, Oxford commas, banned words or setup phrases, and no forced three-item groups.
- [ ] `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues.

---

## 6. RELATED RESOURCES

- [`readme-template.md`](../readme/readme-template.md) - General README scaffold this skill template narrows.
- [`skill-creation.md`](../../references/skill-creation.md) - Skill creation workflow and lifecycle guidance.
- [`skill-md-template.md`](./skill-md-template.md) - Runtime `SKILL.md` scaffold.
- [`skill-reference-template.md`](./skill-reference-template.md) - Reference-file scaffold.
- [`hvr-rules.md`](../../../shared/references/hvr-rules.md) - Human Voice Rules, the voice this template writes in.
