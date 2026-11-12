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
version: 1.3.1.0
---

# Changelog & Release Notes Templates - Format Reference

Two narrative formats for global component changelogs and their GitHub release notes. Every rule below serves one goal: the reader learns what changed for them and why, in the fewest words that still carry the connection.

## 1. OVERVIEW

### Purpose

The two-tier narrative format for global component changelogs at `.skilled/changelog/{component}/v{VERSION}.md`, with the selection, voice and length rules that keep a generated release short and readable.

### Usage

The `/create:changelog` workflow reads this template at step 4. Section 5 picks the format. Packet-local changelogs are deprecated and no longer written (section 7).

### The Model Entries

Three published entries show the house style. Each one teaches something different, so read all three before writing. Only v4.0.2.1 passes the sentence rules in section 4. The other two were written before them.

- `.skilled/changelog/skilled/v4.0.1.0.md` is the model for length and selection. It keeps what a reader would notice, gives each item one paragraph and cuts items rather than sections. It also collects small fixes into a Smaller Fixes list, orders its upgrade notes by section and names the components with their own entry in one sentence. Model a release with many changes on it.
- `.skilled/changelog/skilled/v4.0.2.1.md` is the model for readability and depth. Its sentences are short and its words are plain. Each feature item says how the feature works and shows a real line of output. Its fixes are listed one by one. Its How It Was Checked section shows what was measured before and after, what the change costs and which tests ran. Copy its sentence length, its level of detail and that section.
- `.skilled/changelog/skilled/v4.0.0.0.md` is the model for voice and for how a major release opens. Its opening narrative and Why This Release frame a large change for a reader who was not there. Copy that voice and framing, never its length, because it records one unusually large release and runs past this template's ceilings.

When this template and a model entry disagree on how a section reads, the model entry wins. When they disagree on how long an entry runs, this template's ceilings win (section 4). Record the discrepancy either way. Older entries in the same folders predate this style, so do not copy them.

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

{Summary: a few short sentences, about 60 words in all, on what the release does for the reader and why it matters.}

> Spec folder: `{path}`

&nbsp;

## What's New at a Glance

- **{The change, as a short sentence.}** {One or two short plain sentences that add what the bold one does not say.}

&nbsp;

## Upgrade

{The action the reader must take, or "No migration required."}
```

Include the spec-folder line only when the release has a spec folder. Add a short `## Why This Release` section after the summary only when the summary does not already say why, with an `&nbsp;` line before it like every other H2.

### Expanded Format (10+ changes, major or breaking)

```markdown
{The same frontmatter block as the compact format.}

{Opening narrative: 1-5 paragraphs in plain prose, one per theme, no headers.}

> Spec folder: `{path}`

&nbsp;

## Why This Release

{Why the release exists: the gap it closes or the gain it buys, in one to three short paragraphs or bold lead-in gain bullets.}

&nbsp;

## What's New at a Glance

- **{The theme, as a short sentence.}** {One or two short plain sentences that add what the bold one does not say.} <!-- section: {Topical Domain} -->

&nbsp;

## {Topical Domain}

{Optional short introduction.}

#### {Benefit-led heading, usually 2-7 words}

{One paragraph of short sentences, about 60 words: what was broken, what changed and why it matters. Start where the glance bullet stopped. Add a second paragraph when the item needs it. A breaking change always gets its own, so its exact step stands apart.}

#### {Next heading}

**Breaking:** {What breaks and exactly what to do about it.}

#### Smaller Fixes

- **{The fix, as a short sentence.}** {One or two short sentences on what the reader now sees.}

&nbsp;

## How It Was Checked

#### Before and After

| Check | Before | After |
|---|---|---|
| {A real command or question a reader could run} | {What it returned} | {What it returns now} |

#### Tests and Scenarios

- **{The suite, as a short sentence that it passes.}** {How many tests passed and how many failed.}

&nbsp;

## Upgrade Notes

- **{The reader's situation, such as "Skills you wrote yourself"}:** {The action, as a short instruction.}
```

Include the spec-folder line only when the release has a spec folder.

**Field guidelines**:

- **`## How It Was Checked` (required in an expanded entry).** It is the last section before Upgrade Notes. It shows the reader why they can trust the release. Give a before-and-after table of real commands or questions, one row per change. Add what the change costs when it was measured, such as a lookup time against its budget. Then list each test suite and scenario that ran, with how many passed and failed. Say plainly when a check was left failing or undecided. This is the one section where test results belong. A compact entry may carry it as one short paragraph.
- **How a feature works.** An item for a new feature says what it does step by step, in the order it happens. It shows one real line of output or one command, in code. It names the flag that turns the feature off when one exists. It names the gap that remains when one does. A reader should be able to predict the new output from the item alone.
- **Fixes.** Every fix a reader could run into gets its own bold-led bullet: what went wrong and what happens now. Fixes found during the work sit in their own section or in Smaller Fixes, apart from the features.

- **`{Topical Domain}` (H2).** Name the section for the domain it changes, the way the model entries name `Spec Kit` and `Doctor Commands`, never for a change type such as `New Features` or `Bug Fixes`. Most releases need three to six domains, and eight is the most. Add one past six only when a reader would look for it by name.
- **`<!-- section: {Topical Domain} -->` tag.** Each glance bullet ends with a comment naming the topical section it summarizes, spelled as that section's H2, and the bullets follow the order of those sections. The comment does not show on a rendered page or in the release notes, so the bullet reads as plain text while the shape check can still test the order. A section may go without a glance bullet, but the tagged bullets never run out of order. A compact entry has no topical sections, so its bullets carry no tag.
- **`{Benefit-led heading}` (H4).** 2-7 words for most headings and 10 at most, stating the gain or the fact. Good: `Specs Move to the Top Level`. Bad: `Improved validation logic`, a numbered item or a sentence-length title.
- **Separators.** An `&nbsp;` line, a forced blank line, goes before every H2: between the opening and Why This Release, between Why This Release and What's New at a Glance, and between every later section. Nothing separates the H4 items inside one H2, and no `---` rule appears anywhere in the entry body.
- **`#### Smaller Fixes` (optional H4).** Small fixes a reader would notice, but that need no paragraph of their own, collect into one Smaller Fixes item with one bold-led bullet per fix. It sits last in the section that owns the fixes, and it is the one H4 whose body is a list. Leave it out when no such fix exists, and leave out a fix with no visible effect.
- **Coverage sentence.** When other components or modes have their own changelog entry for this release, one sentence in the last body section names every one of them, so a reader knows where the detail lives. It may stand as its own paragraph at the end of the item it closes.
- **Upgrade Notes.** One bullet per action, in the same order as the entry's sections, each led in bold by the reader's situation, such as `**Skills you wrote yourself:**`. A note about the release as a whole goes first. A retirement's note sits where the section that names its replacement sits, and a retirement with no replacement sits with its own section. Use the Adopt, Repoint and Drop lead-ins only in a compact entry, where section order does not apply. Write "No upgrade needed." when there is nothing to do.

---

## 3. WHAT TO LEAVE OUT

What goes in decides the length more than the wording does, so choose the content before writing any of it. Every item dropped stays findable in the spec packet.

### Choose by Reader Impact

Start from the reader: write down what they would notice, act on or decide differently about, then confirm each one in the source. A change the source records and the reader would not notice is not an item. Merge items that have the same effect for the reader, and lead with the one that matters most. A task list is evidence of what shipped, not an outline: ten tasks that produced one visible change make one bullet.

### Cut Items, Never Sections

When an entry runs past a ceiling, cut at the H4 level. A cut item leaves in one of three ways: it folds into a sibling item as a closing sentence, it moves into its section's Smaller Fixes list or it is dropped as process, housekeeping or a fix with no visible effect. Never drop a whole section to shorten the entry, because each section is a domain a reader looks for by name.

### Keep

- User-visible behavior changes, stated as before and after.
- Breaking changes and the exact migration step.
- Anything the reader must do, adopt, repoint or stop using.
- Honest corrections of a claim a previous release got wrong.
- Numbers that are the claim itself, such as a measured cost or a limit the reader must stay under.
- How each new feature works, in enough detail that a reader can predict its output.
- Every fix a reader could run into, one by one.
- What was measured before and after and which tests ran, in How It Was Checked.

### Drop by Default

- File inventories and Files Changed tables.
- Test counts and test results anywhere outside How It Was Checked. Lists of new test names stay out everywhere.
- Schema internals, index churn and machinery names the reader never touches.
- Internal labels such as task or requirement IDs, scenario IDs and packet or phase numbers. The spec-folder line is the one pointer an entry needs.
- How the work was done: review rounds, models, agents, research phases and the order the work landed in, unless it changes how far the reader can trust the result.
- How a router or scorer decides between candidates, such as the order that breaks a tie, unless the reader must act on it.
- Follow-on housekeeping: docs brought in line with the change, regenerated copies, rebuilt indexes and refreshed metadata or versions.
- Small fixes with no visible effect. Leave them out. A small fix with a visible effect goes in the section's Smaller Fixes list (section 2).
- Work tried and reverted during the cycle. It gets one story sentence at most, written into the narrative: what was tried and that it left before release. The v4.0.0.0 entry's model is "An alignment mode was built during the cycle and removed before release, and the removal took `/deep:command-benchmark` and the conformance benchmark family with it."

### Say Each Fact Once

Each section has one job, and a fact lives in the section whose job it is.

| Section | Its job | Not its job |
|---|---|---|
| Summary or opening | What the release does, told at the level of themes | Fix-by-fix detail and the numbers behind it |
| Why This Release | The gap the release closes or the gain it buys | The list of changes, which the glance section carries |
| What's New at a Glance | One line per theme, stating the payoff | The full mechanism or a sentence that restates the bold one |
| Topical H4 items | The detail: before, mechanism and after | The glance bullet's sentence, said again |
| How It Was Checked | The evidence: before and after, the cost and the tests that ran | A new claim about behavior, which a topical item carries |
| Upgrade Notes | The actions, one line each | Why the change was made |

When a sentence would repeat an earlier one, cut it or replace it with something the reader does not know yet. In a compact entry, each glance bullet must add something the summary did not say.

### When a Table Earns Its Place

A table appears only when the numbers are the claim. The v4.0.0.0 entry carries one in more than five hundred lines, the measured cached-input cost per model, because the dollar difference was the finding. The before-and-after table in How It Was Checked earns its place the same way, because each row is a result a reader can reproduce. A table that restates prose or lists files does not, and most entries carry no other table.

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
- Write short sentences, about 8 words each. None runs past 22 words, and the entry averages 10 at most. More sentences are always fine. When a sentence runs long, split it rather than cut a fact.
- Use the everyday word: "cut" before "truncate", "shows" before "surfaces", "runs" before "executes". Keep a technical word only when it is the literal name the reader will see, and put it in code.
- Define a technical term on first use, such as "BM25 (exact word matching)".
- Name an identifier (a skill, a path or a command) only where the reader acts on it, the way the v4.0.0.0 entry names `mode-registry.json` where it explains dispatch.
- No Oxford commas, em dashes or semicolons, per `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`.

### Structure

- Bold lead-in bullets for lists of gains or upgrade steps.
- H4 (`####`) for item headings, never H3. No `**Problem:**` or `**Fix:**` labels.
- Inline `**Breaking:**` markers where the break is described, not a separate section.
- No metrics soup: never pack many numbers into one sentence.

### Length

| Element | Usually | Ceiling |
|---|---|---|
| Summary paragraph | 1-3 short sentences | About 60 words |
| Expanded opening narrative | 1-3 paragraphs | 5 paragraphs |
| Why This Release | 1-3 short paragraphs | About 120 words, gain bullets allowed |
| What's New at a Glance | 3-6 bullets compact, 5-9 expanded | 14 bullets, one line each |
| Glance bullet | A bold sentence and one short plain sentence | A bold sentence and about 30 words |
| H4 item narrative | 1 paragraph, about 60 words | 2 paragraphs, about 120 words |
| H4 heading | 2-7 words | 10 words |
| Sentence | About 8 words | 22 words |
| Sentence average | About 8 words | 10 words |
| Compact file total | 10-25 lines of prose | 40 lines of prose |
| Expanded file total | 120-180 lines below the frontmatter | 280 lines below the frontmatter |
| Expanded H4 items | 12-22 | 32 |

Validation checks the ceilings, and each one is set from the entry a reader needs, never from a model entry's length. `scripts/check_changelog_shape.py` fails an entry past the expanded file total, the H4 item ceiling or the glance bullet ceiling, and it fails tagged glance bullets that run out of section order and a spec-folder line that carries a level label. It also fails a sentence past its ceiling, an average past its ceiling and an expanded entry with no How It Was Checked section. The usual column is the target. A release with one fix reads short. Paragraph and section word counts are guidance, not gates, so more short sentences are always fine. The two sentence ceilings are gates. Go past a word budget when a reader needs the fact, and record why.

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

## 7. NESTED PACKET-LOCAL CHANGELOGS (DEPRECATED)

Spec folders no longer get changelogs, so no workflow writes a new file under `specs/**/changelog/`. A change recorded in a spec folder goes into a global entry for the component it touched, written from this template.

Existing `changelog-<packet>-root.md` and `changelog-<packet>-<phase-folder>.md` files stay and still validate. The spec-kit nested generator remains only to render them and prints a deprecation notice. Do not reuse this template for them.

---

## 8. RELATED RESOURCES

- `.skilled/changelog/skilled/v4.0.1.0.md` - the model for length, selection and the shape of a release with many changes
- `.skilled/changelog/skilled/v4.0.2.1.md` - the model for sentence length, plain words, feature detail and the How It Was Checked section
- `.skilled/changelog/skilled/v4.0.0.0.md` - the model for voice and for how a major release opens
- [check_changelog_shape.py](../scripts/check_changelog_shape.py) - the shape check that enforces the expanded ceilings
- [hvr-rules.md](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules (banned words, punctuation, structure)
- [core-standards.md](../../shared/references/core-standards.md) - Markdown structure and naming conventions
- [worked-examples.md](../references/worked-examples.md) - a filled-in v4-style entry with annotations
- [nested-changelog.md](../../../system-spec-kit/references/workflows/nested-changelog.md) - the deprecated nested packet-local changelog workflow
