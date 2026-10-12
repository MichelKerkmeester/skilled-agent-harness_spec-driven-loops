---
title: "Changelog & Release Notes Templates"
description: "The two-tier narrative format for global component changelogs at .skilled/changelog/{component}/v{VERSION}.md, with the selection, voice and length rules that keep a generated release short and readable."
trigger_phrases:
  - "changelog format templates"
  - "release notes template"
  - "compact changelog format"
  - "expanded changelog format"
  - "changelog omission rules"
importance_tier: normal
contextType: general
version: 1.1.0.29
---

# Changelog & Release Notes Templates - Format Reference

Two narrative formats for global component changelogs and their GitHub release notes. Every rule below serves one goal: the reader learns what changed for them and why, in the fewest words that still carry the connection.

## 1. OVERVIEW

### The Canonical Exemplar

`.skilled/changelog/skilled/v4.0.0.0.md` is the house style, so read it before writing. It shows the opening narrative, Why This Release, What's New at a Glance, topical H2 sections with benefit-led H4 items, inline Breaking markers and Upgrade Notes. Copy its voice and shape, not its length: it records a major release, and most releases need a fraction of it. Older entries in the same folders predate this style, so do not copy them. When this template and the exemplar disagree on shape, the exemplar wins and the discrepancy is recorded.

### Usage

The `/create:changelog` workflow reads this template at step 4. Section 5 picks the format. Packet-local changelogs use the spec-kit templates instead (section 7).

---

## 2. THE TWO TIERS

Every entry opens with the frontmatter block that SKILL.md section 5 defines. An editorial title H1 may follow it, and then the prose starts with the summary narrative. The retired machine header (a bare version title, a backlink, a version-date line) stays gone.

### Compact Format (under 10 changes, non-breaking)

```markdown
---
title: "{component} v{VERSION}"
description: "{What the release changed, in one or two plain sentences of 250 characters at most.}"
trigger_phrases:
  - "{component} v{VERSION}"
  - "{component} {VERSION}"
  - "{Topic phrase: 2-6 words from this entry that name what changed}"
importance_tier: "normal"
contextType: "general"
---

{Summary: 1-3 sentences on what the release does for the reader and why it matters.}

> Spec folder: `{path}` (Level {N})

&nbsp;

## What's New at a Glance

- **{The change, as a short sentence.}** {One plain sentence that adds what the bold one does not say.}

&nbsp;

## Upgrade

{The action the reader must take, or "No migration required."}
```

Include the spec-folder line only when the release has a spec folder. Add a `## Why This Release` section of 2-4 sentences after the summary only when the summary does not already say why, with an `&nbsp;` line before it like every other H2.

### Expanded Format (10+ changes, major or breaking)

```markdown
{The same frontmatter block as the compact format.}

{Opening narrative: 1-5 paragraphs in plain prose, one per theme, no headers.}

> Spec folder: `{path}` (Level {N})

&nbsp;

## Why This Release

{Why the release exists: the gap it closes or the gain it buys, in one to three short paragraphs or bold lead-in gain bullets.}

&nbsp;

## What's New at a Glance

- **{The theme, as a short sentence.}** {One plain sentence that adds what the bold one does not say.}

&nbsp;

## {Topical Domain}

{Optional 1-2 sentence introduction.}

#### {Benefit-led heading, usually 2-7 words}

{One or two paragraphs for most items, seven at most: what was broken, what changed and why it matters. Start where the glance bullet stopped.}

#### {Next heading}

**Breaking:** {What breaks and exactly what to do about it.}

&nbsp;

## Upgrade Notes

- **Adopt.** {Renames and new things to start using.}
- **Repoint.** {Moved paths and surfaces that changed address.}
- **Drop.** {Removed things and what replaces them.}
```

Include the spec-folder line only when the release has a spec folder.

**Field guidelines**:

- **`{Topical Domain}` (H2).** Name the section for the domain it changes, the way the exemplar names `Spec Kit` and `Safer Git`, never for a change type such as `New Features` or `Bug Fixes`. Most releases need one to five domains. A release the exemplar's size may need more when each one earns its section.
- **`{Benefit-led heading}` (H4).** 2-7 words for most headings and 10 at most, stating the gain or the fact. Good: `Specs Move to the Top Level`. Bad: `Improved validation logic`, a numbered item or a sentence-length title.
- **Separators.** An `&nbsp;` line, a forced blank line, goes before every H2: between the opening and Why This Release, between Why This Release and What's New at a Glance, and between every later section. Nothing separates the H4 items inside one H2, and no `---` rule appears anywhere in the entry body.
- **Upgrade Notes.** Use the Adopt, Repoint and Drop lead-ins only when the release has all three kinds of work. Otherwise write plain bullets or a short paragraph, and "No upgrade needed." when there is nothing to do.

---

## 3. WHAT TO LEAVE OUT

What goes in decides the length more than the wording does, so choose the content before writing any of it. Every item dropped stays findable in the spec packet.

### Choose by Reader Impact

List every change the source records. Keep an item only when the reader would notice it, act on it or decide differently because of it. Merge items that have the same effect for the reader, and lead with the one that matters most. A task list is evidence of what shipped, not an outline: ten tasks that produced one visible change make one bullet.

### Keep

- User-visible behavior changes, stated as before and after.
- Breaking changes and the exact migration step.
- Anything the reader must do, adopt, repoint or stop using.
- Honest corrections of a claim a previous release got wrong.
- Numbers that are the claim itself, such as a measured cost or a limit the reader must stay under.

### Drop by Default

- File inventories and Files Changed tables.
- Test counts, test tables and new test or playbook scenarios.
- Schema internals, index churn and machinery names the reader never touches.
- Internal labels such as task or requirement IDs, scenario IDs and packet or phase numbers. The spec-folder line is the one pointer an entry needs.
- How the work was done: review rounds, models, agents and research phases, unless it changes how far the reader can trust the result.
- Follow-on housekeeping: docs brought in line with the change, regenerated copies, rebuilt indexes and refreshed metadata or versions.
- Small fixes with no visible effect. Fold several into one sentence, or leave them out.
- Work tried and reverted during the cycle. It gets one story sentence at most, written into the narrative: what was tried and that it left before release. The exemplar's model is "An alignment mode was built during the cycle and removed before release, and the removal took `/deep:command-benchmark` and the conformance benchmark family with it."

### Say Each Fact Once

Each section has one job, and a fact lives in the section whose job it is.

| Section | Its job | Not its job |
|---|---|---|
| Summary or opening | What the release does, told at the level of themes | Fix-by-fix detail and the numbers behind it |
| Why This Release | The gap the release closes or the gain it buys | The list of changes, which the glance section carries |
| What's New at a Glance | One line per theme, stating the payoff | The full mechanism or a sentence that restates the bold one |
| Topical H4 items | The detail: before, mechanism and after | The glance bullet's sentence, said again |
| Upgrade Notes | The actions, one line each | Why the change was made |

When a sentence would repeat an earlier one, cut it or replace it with something the reader does not know yet. In a compact entry, each glance bullet must add something the summary did not say.

### When a Table Earns Its Place

A table appears only when the numbers are the claim. The exemplar carries one in six hundred lines, the measured cached-input cost per model, because the dollar difference was the finding. A table that restates prose, lists files or counts tests does not earn its place, and most entries carry none.

### The Cut Test

Before writing the file, ask of each sentence whether the reader would miss it. Cut the ones they would not. Then check the joints: concise is not compressed, so keep the "because" and the before-and-after that make a change make sense, and restore the noun when a cut leaves a "this" with nothing to point at.

---

## 4. WRITING STYLE RULES

These rules apply to changelog files and GitHub release notes. The Human Voice Rules are the authority on banned patterns, and the validator enforces both.

### Voice

- Write for a smart person who is not a developer.
- Lead with why the release matters, never with technical stats.
- Explain each change as what was broken, what changed and why it matters.
- One idea per sentence, active voice, no hedging.
- Define a technical term on first use, such as "BM25 (exact word matching)".
- Name an identifier (a skill, a path or a command) only where the reader acts on it, the way the exemplar names `mode-registry.json` where it explains dispatch.
- No Oxford commas, em dashes or semicolons, per `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`.

### Structure

- Bold lead-in bullets for lists of gains or upgrade steps.
- H4 (`####`) for item headings, never H3. No `**Problem:**` or `**Fix:**` labels.
- Inline `**Breaking:**` markers where the break is described, not a separate section.
- No metrics soup: never pack many numbers into one sentence.

### Length

| Element | Usually | Ceiling |
|---|---|---|
| Summary paragraph | 1-2 sentences | 3 sentences |
| Expanded opening narrative | 1-3 paragraphs | 5 paragraphs |
| Why This Release | 1-2 short paragraphs | 3 short paragraphs or 4 sentences, gain bullets allowed |
| What's New at a Glance | 3-6 bullets compact, 5-9 expanded | 12 bullets, one line each |
| Glance bullet | A bold sentence and one plain sentence | A bold sentence and three plain sentences |
| H4 item narrative | 1-2 paragraphs | 7 paragraphs |
| H4 heading | 2-7 words | 10 words |
| Compact file total | 10-25 lines of prose | 40 lines of prose |

Validation checks the ceilings, and each one sits at or above what the exemplar does, so the exemplar passes every check it teaches. The usual column is the target. A release with one fix reads short.

---

## 5. FORMAT SELECTION GUIDE

| Release Type | Format | When to Use |
|---|---|---|
| Hotfix (1-3 changes) | Compact | Quick bug fix, typo correction |
| Feature release (4-9 changes) | Compact | New feature, small refactor |
| Major release (10+ changes) | Expanded | Overhaul, multi-part work |
| Breaking change | Expanded | Any release requiring migration, regardless of count |

Count the changes that survive section 3, not the tasks behind them.

```text
Count the changes in the release.
├─> < 10 changes AND not major AND not breaking  → Compact format
├─> >= 10 changes OR major bump                  → Expanded format
└─> Any breaking change                          → Expanded format
```

---

## 6. GITHUB RELEASE NOTES FORMAT

The release body is the changelog content with any YAML frontmatter and the editorial title H1 removed, because GitHub shows the release title on its own. It keeps the entry's spacing, an `&nbsp;` line before every H2 and nothing between H4 items. The release step in the command YAMLs strips both before it runs `gh release create`, then appends an `&nbsp;` line and the pointer:

```text
&nbsp;

Full changelog: `.skilled/changelog/{component}/v{VERSION}.md`
```

The release title is the tag, an em dash and the editorial title, `v{VERSION} — {Editorial Title}`, and the tag is annotated with the message `v{VERSION}: {Editorial Title}`.

---

## 7. NESTED PACKET-LOCAL CHANGELOGS

Nested packet-local changelogs are a separate output mode for spec folders and phase children. **Do not reuse this template for them.** Root spec folders write to `changelog/changelog-<packet>-root.md` and phase children to `../changelog/changelog-<packet>-<phase-folder>.md`, through the generator:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <spec-folder> --write
```

The canonical templates are `.skilled/skills/system-spec-kit/templates/changelog/root.md` and `phase.md` beside it. The global versioning rules do not apply to nested changelogs.

---

## 8. RELATED RESOURCES

- `.skilled/changelog/skilled/v4.0.0.0.md` - the canonical exemplar this template derives from
- [hvr-rules.md](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules (banned words, punctuation, structure)
- [core-standards.md](../../shared/references/core-standards.md) - Markdown structure and naming conventions
- [worked-examples.md](../references/worked-examples.md) - a filled-in v4-style entry with annotations
- [nested-changelog.md](../../../system-spec-kit/references/workflows/nested-changelog.md) - nested packet-local changelog workflow
