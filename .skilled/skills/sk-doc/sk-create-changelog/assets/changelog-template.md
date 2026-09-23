---
title: "Changelog & Release Notes Templates"
description: "The two-tier narrative format for global component changelogs at .skilled/changelog/{component}/v{VERSION}.md, with voice rules, an omission decision-aid, and validation checks that keep generated releases reading like the v4 exemplar."
trigger_phrases:
  - "changelog format templates"
  - "release notes template"
  - "compact changelog format"
  - "expanded changelog format"
  - "changelog omission rules"
importance_tier: normal
contextType: general
version: 1.1.0.28
---

# Changelog & Release Notes Templates - Format Reference

Two narrative formats (compact and expanded) for global component changelogs and the matching GitHub release notes. The shape, the voice and the omission rules below all derive from one document that every generated changelog must be able to sit beside without looking out of place.

## 1. OVERVIEW

### The Canonical Exemplar

`.skilled/changelog/system-spec-kit/v4.0.0.0.md` is the house style. Read it before generating any changelog. It demonstrates everything this template enforces: a multi-paragraph opening narrative, a Why This Release section, a What's New at a Glance section, topical H2 sections with benefit-led H4 story items, inline Breaking markers, and concrete Upgrade Notes at the end. Its single earned-evidence table (in six hundred lines) is what the counted dollar costs earned, not a quota a release must reproduce. When this template and the exemplar appear to disagree, the exemplar wins and the discrepancy is recorded.

### Usage

The `/create:changelog` workflow reads this template at Step 4. Choose **compact** for releases under 10 changes with no breaking change, and **expanded** for 10 or more changes, a major bump, or any breaking change (Section 5 has the decision rule).

Nested packet-local changelogs are a different output mode and use the spec-kit templates instead (see Section 8).

---

## 2. THE TWO TIERS

**Key points**:

- The prose starts with the summary narrative. YAML frontmatter and the editorial title H1 (the exemplar's opening) may precede it. The retired machine header (a bare version-title line, a backlink, a version-date line) stays gone.
- Lead with **why** the release matters, never with technical stats.
- Structure tells a story: what the release does, why it exists, what is new at a glance, then the detail, then what you must do.

### Compact Format (under 10 changes, non-breaking)

```markdown
{Summary paragraph: 1-3 sentences. What this release does, and why it matters to the person using it. No file paths, no counts of files or tests.}

> Spec folder: `{path}` (Level {N})

## What's New at a Glance

- **{The change, stated as a short sentence.}** {One or two plain sentences on what it means for the reader.}

## Upgrade

{Migration steps, or "No migration required."}
```

Include the spec-folder line only when the release has a spec folder. Add a short `## Why This Release` section (2-4 sentences) between the summary and the at-a-glance list when the motivation is not obvious from the summary alone.

### Expanded Format (10+ changes, major, or breaking)

```markdown
{Opening narrative: 1-5 paragraphs telling the story of the release in plain prose. What the release does, in one breath per theme. No headers interrupt this opening.}

> Spec folder: `{path}` (Level {N})

## Why This Release

{The motivation in one to three short paragraphs, or a short bullet list where each bullet carries a bold lead-in stating the practical gain.}

## What's New at a Glance

- **{The theme, stated as a short sentence.}** {One or two plain sentences on what changed.}
- **{The theme, stated as a short sentence.}** {One or two plain sentences on what changed.}

---

## {Topical Domain}

{Optional 1-2 sentence introduction for the section.}

#### {Benefit-led heading, usually 2-7 words}

{One to three flowing paragraphs for most items, seven at most for a dense one: what was broken or missing, what changed, and why it matters. State the broken behavior first, then the new behavior. A short bold-lead-in bullet list may carry one of the paragraphs when the content is genuinely enumerable. Write for a smart person who is not a developer. No unexplained jargon: first use of a technical term carries a parenthetical definition.}

&nbsp;

#### {Next heading}

{Same pattern. Where a change breaks something, mark it inline at the point it is described:}

**Breaking:** {what breaks and exactly what to do about it.}

---

## Upgrade Notes

- **Adopt.** {renames and new things to start using}
- **Repoint.** {moved paths and surfaces that changed address}
- **Drop.** {removed things and what replaces them}
```

Include the spec-folder line only when the release has a spec folder. Use the Adopt/Repoint/Drop lead-ins when the release has all three kinds of upgrade work. Otherwise write the Upgrade Notes as plain bullets or a short paragraph. For a release with no upgrade work, write "No upgrade needed." and nothing else.

**Field guidelines**:

**`{Topical Domain}` (H2)**: name the section for the domain it changes, the way the exemplar names its sections `Spec Kit`, `Safer Git`, `Documentation as a System`. Pick one to five domains per release. A release the size of the exemplar legitimately spans more, provided every domain earns its section. Do not use fixed change-type labels (`New Features`, `Bug Fixes`) when a domain name says more.

**`{Benefit-led heading}` (H4)**: 2-7 words for most headings and 10 at most. It states the gain or the fact and scans at a glance. Good: `Specs Move to the Top Level`, `A Completion Gate That Tells the Truth`. Bad: `Improved validation logic`, numbered items, sentence-length titles. The exemplar's longest heading, `Parent Skills, Nested Modes and the Tool That Builds Them`, sets the 10-word ceiling.

**`&nbsp;` between H4 items within the same H2.** It is the soft separator that renders as an invisible line. Never use `---` between H4s.

**`---` only between H2 sections**. Never place `---` or `&nbsp;` between an H2, or its intro paragraph, and the first H4 underneath.

---

## 3. WHAT TO LEAVE OUT

The omission rules are half of what makes a changelog readable. Every item dropped is detail a curious reader can find in the spec packet. Every item kept must earn its place.

### Keep

- User-visible behavior changes, stated as before and after.
- Breaking changes and the exact migration step.
- Anything the user must do, adopt, repoint or stop using.
- Honest corrections of a claim a previous release got wrong.
- Measured numbers when the numbers themselves are the story.

### Drop by default

- File-by-file inventories and Files Changed tables. The spec packet holds the file map.
- Test pass counts, test-metric tables, and before/after suites.
- Schema internals, index and column churn.
- Internal machinery names the user never touches.
- Mid-cycle churn: work that was tried and reverted during the cycle compresses to one story sentence, or disappears entirely.
- Counts of review passes, validation rounds or line-count deltas.

### When a table earns its place

A table appears only when the numbers are the claim, the way the exemplar carries one table: measured cached-input cost per model, because the dollar difference was the finding. A table that restates prose, inventories files, or displays test counts does not earn its place. Most changelogs contain zero tables.

### The one-line story sentence

Reverted or failed internal work gets one sentence at most, written as part of the narrative: what was tried, what it turned out to rest on, and that it left before release. The exemplar's model: "An alignment mode was built during the cycle and removed before release, and the removal took `/deep:command-benchmark` and the conformance benchmark family with it."

---

## 4. WRITING STYLE RULES

These rules apply to changelog files and GitHub release notes. The Human Voice Rules standard is the authority on banned patterns, and the validator enforces both.

### Voice

- Write like you are explaining to **a smart person who is not a developer**.
- Lead with **why** the release matters, not technical stats.
- Every change explained as: **what was broken**, **what changed**, **why it matters**.
- One idea per sentence. Active voice. No hedging.

### Jargon

- No jargon without explanation.
- First use carries a parenthetical definition: "BM25 (exact word matching)", "CTE (a reusable SQL subquery)".
- Keep out what the reader never acts on: file inventories, line numbers, machinery names the user never touches. Identifiers the reader must act on (skill names, paths, commands) appear where the reader needs them, the way the exemplar names `mode-registry.json` where it explains dispatch.

### Structure and formatting

- **Bold lead-in bullets** for lists that enumerate gains or upgrade steps.
- **One to three flowing paragraphs** per H4 item, seven at most for a dense one. Never `**Problem:** / **Fix:**` labels.
- **Short benefit-led sub-headings**: 2-7 words, 10 at most, never sentence-length, never numbered.
- **H4 (`####`) for item headings** under each H2. Never H3.
- **`&nbsp;` between H4 items within the same H2**. **`---` only between H2 sections.**
- **Inline `**Breaking:**` markers** at the point of the breaking change, never in a separate section when the context is already there.
- **No metrics soup**: do not pack many numbers into one sentence.
- **No Oxford commas, em dashes, or semicolons** per the HVR rules in `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`.

### Conciseness caps

| Element | Cap |
|---|---|
| Summary paragraph | 3 sentences |
| Expanded opening narrative | 5 paragraphs |
| Why This Release | 3 short paragraphs or 4 sentences, gain bullets allowed |
| What's New at a Glance | 12 bullets, one line each |
| H4 item narrative | 7 paragraphs, most items need 1-3 |
| H4 heading | 10 words, most need 2-7 |
| Compact file total | 40 lines of prose |

The caps are ceilings, not targets. A release with one fix should read short. No ceiling sits below what the exemplar does, so the exemplar passes every check it teaches.

---

## 5. FORMAT SELECTION GUIDE

| Release Type | Format | When to Use |
|---|---|---|
| Hotfix (1-3 changes) | Compact | Quick bug fix, typo correction |
| Feature release (4-9 changes) | Compact | New feature, small refactor |
| Major release (10+ changes) | Expanded | Overhaul, multi-part work |
| Breaking change | Expanded | Any release requiring migration, regardless of count |

**Decision rule**:

```text
Count the changes in the release.
├─> < 10 changes AND not major AND not breaking  → Compact format
├─> >= 10 changes OR major bump                  → Expanded format
└─> Any breaking change                          → Expanded format
```

---

## 6. THE CANONICAL EXAMPLE

Model every expanded release on `.skilled/changelog/system-spec-kit/v4.0.0.0.md`. It is the reference for opening narrative, Why This Release, at-a-glance bullets, topical H2 naming, H4 story items, the earned-evidence table and Upgrade Notes. Older changelog files in the same folders predate this style, so do not copy them.

---

## 7. GITHUB RELEASE NOTES FORMAT

The release body is the changelog content with any YAML frontmatter and the editorial title H1 removed. GitHub shows the release title on its own, and the release step in the command YAMLs strips both before it runs `gh release create`.

At the end, append:

```text
Full changelog: `.skilled/changelog/{component}/v{VERSION}.md`
```

---

## 8. NESTED PACKET-LOCAL CHANGELOGS

Nested packet-local changelogs are a separate output mode for spec folders and phase children. **Do not reuse this template for nested packet output.** Use the spec-kit templates listed below instead.

**Output paths**:
- Root spec folders write to `changelog/changelog-<packet>-root.md`
- Phase child folders write to `../changelog/changelog-<packet>-<phase-folder>.md`

**Canonical templates**:
- `.skilled/skills/system-spec-kit/templates/changelog/root.md`
- `.skilled/skills/system-spec-kit/templates/changelog/phase.md`

**Canonical generator**:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <spec-folder> --write
```

The global component versioning rules in this file do not apply to nested packet changelogs.

---

## 9. RELATED RESOURCES

### Standards

- `.skilled/changelog/system-spec-kit/v4.0.0.0.md` - the canonical exemplar this template derives from
- [hvr-rules.md](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules (banned words, punctuation, structure)
- [core-standards.md](../../shared/references/core-standards.md) - Markdown structure and naming conventions

### Workflows

- [worked-examples.md](../references/worked-examples.md) - a filled-in v4-style entry with annotations
- [nested-changelog.md](../../../system-spec-kit/references/workflows/nested-changelog.md) - nested packet-local changelog workflow
