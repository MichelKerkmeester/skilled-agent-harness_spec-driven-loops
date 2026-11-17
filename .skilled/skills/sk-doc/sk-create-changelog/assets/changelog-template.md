---
title: "Changelog & Release Notes Templates"
description: "The two-tier format for global component changelogs at .skilled/changelog/{component}/v{VERSION}.md: short bullets under short paragraphs, a glance table, alert boxes and folded detail, with the selection, voice and length rules."
trigger_phrases:
  - "changelog format templates"
  - "release notes template"
  - "compact changelog format"
  - "expanded changelog format"
  - "changelog omission rules"
importance_tier: normal
contextType: general
version: 1.4.0.0
---

# Changelog & Release Notes Templates - Format Reference

Two formats for global component changelogs and their GitHub release notes. Every rule below serves one goal: the reader learns what changed for them and why, in the fewest words that still carry the connection.

## 1. OVERVIEW

### Purpose

The two-tier format for global component changelogs at `.skilled/changelog/{component}/v{VERSION}.md`. Short bullets carry the detail. A short paragraph opens each section and says what the area does and what changed. A glance table, alert boxes and folded blocks keep a long release easy to scan.

### Usage

The `/create:changelog` workflow reads this template at step 4. Section 5 picks the format. Packet-local changelogs are deprecated and no longer written (section 7).

### The Model Entries

Three published entries show the house style. Each one teaches something different, so read all three before writing.

- `.skilled/changelog/skilled/v4.0.2.1.md` is the model for the layout. Copy its four-part opening of lead sentences and bullets, its breaking-change box and its glance table. Copy its one-paragraph section openings, its short bullets and its warning boxes. Copy its folded blocks for smaller fixes, the costs, the tests, the upgrade groups and the spec folders. It is also the model for sentence length, plain words, feature detail and How It Was Checked.
- `.skilled/changelog/skilled/v4.0.1.0.md` is the model for selection. It keeps what a reader would notice and cuts items rather than sections. Its layout is older: bold lead-in bullets, one paragraph per item and inline breaking markers. Do not copy that layout.
- `.skilled/changelog/skilled/v4.0.0.0.md` is the model for voice and for how a major release frames a large change. Copy that framing, never its length or its layout.

When this template and a model entry disagree on how a section reads, v4.0.2.1 wins. When they disagree on how long an entry runs, this template's length guidance wins (section 4). Record the discrepancy either way. Older entries in the same folders predate this style, so do not copy them.

---

## 2. THE TWO TIERS

Every entry opens with the frontmatter block that SKILL.md section 5 defines. An editorial title H1 may follow it, and then the prose starts. The retired machine header (a bare version title, a backlink, a version-date line) stays gone.

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

{Summary: one short paragraph, about 60 words, on what the release does for the reader and why it matters.}

&nbsp;

## What's New at a Glance

- {One change, as one short sentence.}
- {The next change.}

&nbsp;

## Upgrade

{The action the reader must take, or "No migration required."}

&nbsp;

> Spec folder: `{path}`
```

Include the spec-folder line only when the release has a spec folder. It closes the entry, after the last section and an `&nbsp;` line, so the reader meets the change before the bookkeeping. Add a short `## Why This Release` section after the summary only when the summary does not already say why, with an `&nbsp;` line before it like every other H2.

### Expanded Format (10+ changes, major or breaking)

```markdown
{The same frontmatter block as the compact format.}

# v{VERSION}, {Editorial Title}

{Lead sentence for the first theme.}

- {Short bullet: one fact.}
- {Short bullet.}

{Lead sentence for the next theme.}

- {Short bullet.}

> [!IMPORTANT]
> {N} changes can break an existing setup. Read these before you update.
>
> 1. {What breaks, in one short sentence.} [{Item name}](#c-{item-slug})

&nbsp;

## Why This Release

{One short paragraph on the gap the release closes.}

- {One gap per bullet.}

&nbsp;

## What's New at a Glance

| Change | What It Means | Section |
|---|---|---|
| [{The change, as a short phrase}](#c-{item-slug}) | {One short sentence the change column does not say.} | {Topical Domain} |

&nbsp;

## {Topical Domain}

{One or two short paragraphs: what this area does and what changed in it.}

#### {Benefit-led heading} <a id="c-{item-slug}"></a>

- {Short bullet: one fact, about 8 words.}
- {A bullet that shows a real line of output, such as `RESULT: PASSED`.}

#### {Next heading} <a id="c-{next-item-slug}"></a>

> [!WARNING]
> {What breaks and exactly what to do about it.}

- {Short bullet.}

<details>
<summary><b>Smaller fixes</b></summary>

- {One fix a reader could run into, as one short sentence.}

</details>

&nbsp;

## How It Was Checked

{One short paragraph on how the release was tested.}

#### Before and After <a id="c-before-and-after"></a>

| Check | Before | After |
|---|---|---|
| {A real command or question a reader could run} | {What it returned} | {What it returns now} |

<details>
<summary><b>What it costs</b></summary>

- {A measured cost against its budget.}

</details>

<details>
<summary><b>Tests and scenarios</b></summary>

- {A suite and how many tests passed and failed.}

</details>

&nbsp;

## Upgrade Notes

{One short paragraph on which steps apply to everyone.}

#### Before You Start <a id="c-before-you-start"></a>

1. {A step every reader takes, in the order they take it.}

<details>
<summary><b>{Topical Domain}</b></summary>

- {An action for a reader who uses this part.}

</details>

&nbsp;

<details>
<summary><b>Spec folders ({N})</b></summary>

> Spec folders: {path}, {path}

</details>
```

**Field guidelines**:

- **One line per paragraph and per bullet.** A GitHub release page turns every newline into a line break, so a paragraph wrapped across source lines breaks early on a phone. Write each paragraph, bullet and alert line as one source line, and never force a break with two trailing spaces or a backslash.
- **Short bullets prevail.** A bullet carries one fact in one short sentence, about 8 words. Prose stays to one or two short paragraphs where a section opens. An H4 item is bullets only, with no paragraph of its own.
- **Opening.** Two to four parts. Each part is one lead sentence that names a theme, then two to four short bullets under it. The parts follow what matters most to the reader. A release with a breaking change ends its opening with the `[!IMPORTANT]` box.
- **`> [!IMPORTANT]` box.** It lists every breaking change as a numbered line, each linked to the item that explains it. It sits after the opening, so a reader sees it before any section. Leave it out when nothing breaks.
- **`> [!WARNING]` box.** It replaces the inline breaking marker. It sits inside the item where the change is described, says what breaks and gives the exact step to take.
- **`## What's New at a Glance` table.** One row per change a reader would notice. The Change cell is a short phrase that links to its item. What It Means adds one short sentence the Change cell does not say. The Section cell names the topical H2 in plain text, spelled as that H2. Rows follow the order of those sections. A section may go without a row.
- **Item anchors.** Every H4 ends with `<a id="c-{item-slug}"></a>`, because a release page renders headings without anchors. The slug is the heading in lowercase, with punctuation dropped and spaces as hyphens. The glance table and the important box link to these anchors.
- **`{Topical Domain}` (H2).** Name the section for the domain it changes, the way the model entries name `Session Handover` and `Skill Advisor`, never for a change type such as `New Features` or `Bug Fixes`. Most releases need three to six domains, and twelve is the most. Add one past six only when a reader would look for it by name. Open each one with one or two short paragraphs.
- **`{Benefit-led heading}` (H4).** 2-7 words for most headings and 10 at most, stating the gain or the fact. Good: `Specs Move to the Top Level`. Bad: `Improved validation logic`, a numbered item or a sentence-length title.
- **How a feature works.** An item for a new feature lists what it does step by step, one bullet per step, in the order it happens. One bullet shows a real line of output or a command, in code. One names the switch that turns it off when one exists, and one names the gap that remains when one does.
- **Fixes.** Every fix a reader could run into gets its own bullet. A fix that needs more than one bullet gets its own H4 item. The rest go in the section's Smaller fixes block, which sits last in its section. Leave out a fix with no visible effect.
- **Folded blocks.** A `<details>` block with a `<summary><b>…</b></summary>` header folds detail a reader opens only when they need it. Use one for Smaller fixes, What it costs, Tests and scenarios, each upgrade group and the spec-folder list. Put a blank line after the summary line and before `</details>`, or the list inside does not render. The summary header is the one place bold text appears.
- **Code spans.** Put every file, path, command, flag, environment variable, setting, agent name and literal output line in code, such as `relocate.mjs`. Spec-folder paths in the closing list stay plain.
- **Numbered lists.** Use them only where order matters: the important box and the steps every reader takes in Upgrade Notes. Every other list is bullets.
- **`## How It Was Checked` (required in an expanded entry).** It is the last section before Upgrade Notes. It shows the reader why they can trust the release. Give a before-and-after table of real commands or questions, one row per change. Fold what the change costs and each test suite and scenario, with how many passed and failed. Say plainly when a check was left failing or undecided. This is the one section where test results belong. A compact entry may carry it as one short paragraph.
- **Upgrade Notes.** One short paragraph first, then a `#### Before You Start` item with the numbered steps every reader takes. A second numbered item may follow for a move that touches many readers, such as a renamed setting. Every other action goes in a folded group named for its topical section, in section order, one bullet per action. Write "No upgrade needed." when there is nothing to do.
- **Spec-folder line.** One folder closes the entry as a plain blockquote. Several fold into a `Spec folders ({N})` block. Either way it is last, after an `&nbsp;` line, and it carries paths only.
- **Coverage sentence.** When other components or modes have their own changelog entry for this release, one sentence in the last body section names every one of them, so a reader knows where the detail lives.
- **Separators.** An `&nbsp;` line goes before every H2 and before the closing spec-folder block. Alert boxes and folded blocks may sit between H4 items, but no `&nbsp;` line and no `---` rule does.

---

## 3. WHAT TO LEAVE OUT

What goes in decides the length more than the wording does, so choose the content before writing any of it. Every item dropped stays findable in the spec packet.

### Choose by Reader Impact

Start from the reader: write down what they would notice, act on or decide differently about, then confirm each one in the source. A change the source records and the reader would not notice is not an item. Merge items that have the same effect for the reader, and lead with the one that matters most. A task list is evidence of what shipped, not an outline: ten tasks that produced one visible change make one row.

### Cut Items, Never Sections

To shorten an entry, cut at the H4 level. A cut item leaves in one of three ways: it folds into a sibling item as one more bullet, it moves into its section's Smaller fixes block or it is dropped as process, housekeeping or a fix with no visible effect. Never drop a whole section to shorten the entry, because each section is a domain a reader looks for by name.

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
- Small fixes with no visible effect. Leave them out. A small fix with a visible effect goes in the section's Smaller fixes block (section 2).
- Work tried and reverted during the cycle. It gets one story sentence at most, written into the narrative: what was tried and that it left before release. The v4.0.0.0 entry's model is "An alignment mode was built during the cycle and removed before release, and the removal took `/deep:command-benchmark` and the conformance benchmark family with it."

### Say Each Fact Once

Each section has one job, and a fact lives in the section whose job it is.

| Section | Its job | Not its job |
|---|---|---|
| Opening | What the release does, told at the level of themes | Fix-by-fix detail and the numbers behind it |
| Why This Release | The gap the release closes or the gain it buys | The list of changes, which the glance table carries |
| What's New at a Glance | One row per change, stating the payoff | The full mechanism or a sentence that restates the Change cell |
| Section opening | What the area does and what changed in it | An item's detail |
| Topical H4 items | The detail: before, mechanism and after | The glance row's sentence, said again |
| How It Was Checked | The evidence: before and after, the cost and the tests that ran | A new claim about behavior, which a topical item carries |
| Upgrade Notes | The actions, one line each | Why the change was made |

When a sentence would repeat an earlier one, cut it or replace it with something the reader does not know yet. In a compact entry, each glance bullet must add something the summary did not say.

### When a Table Earns Its Place

An expanded entry carries two tables: the glance table, which links each change to its item, and the before-and-after table in How It Was Checked, where each row is a result a reader can reproduce. Any other table appears only when its numbers are the claim. The v4.0.0.0 entry carries one in more than five hundred lines, the measured cached-input cost per model, because the dollar difference was the finding. A table that restates prose or lists files does not earn its place.

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
- No Oxford commas, em dashes or semicolons, per `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`.

### Structure

- Short bullets for detail and one or two short paragraphs where a section opens. Bullets outnumber paragraphs.
- No bold text outside a folded block's summary header. No bold lead-in bullets.
- H4 (`####`) for item headings, never H3. No `**Problem:**` or `**Fix:**` labels.
- A `> [!WARNING]` box where a break is described, and one `> [!IMPORTANT]` box listing every break after the opening.
- One source line per paragraph, bullet and alert line (section 2).
- No metrics soup: never pack many numbers into one sentence.

### Length

| Element | Usually | Ceiling |
|---|---|---|
| Summary paragraph | 1-3 short sentences | About 60 words |
| Expanded opening | 2-4 lead sentences, each with 2-4 bullets | 5 parts |
| Section opening | 1 short paragraph | 2 paragraphs |
| Why This Release | 1 short paragraph and a few gap bullets | About 120 words |
| What's New at a Glance | 3-6 bullets compact, one row per change expanded | One line each |
| Glance row | A short phrase and one short sentence | About 20 words |
| H4 item | 3-8 short bullets | No paragraph |
| H4 heading | 2-7 words | 10 words |
| Sentence | About 8 words | 22 words |
| Sentence average | About 8 words | 10 words |

Validation checks the ceilings, and each one is set from the entry a reader needs, never from a model entry's length. `scripts/check_changelog_shape.py` fails glance rows and tagged bullets that run out of section order and a spec-folder line that carries a level label or does not close the entry. It also fails a sentence past its ceiling, an average past its ceiling and an expanded entry with no How It Was Checked section. An entry has no line, H4 item or glance row ceiling: its size follows from what the release changed. The usual column is the target. A release with one fix reads short. Paragraph and section word counts are guidance, not gates, so more short sentences are always fine. The two sentence ceilings are gates. Go past a word budget when a reader needs the fact, and record why.

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

The release body is the changelog content with any YAML frontmatter and the editorial title H1 removed, because GitHub shows the release title on its own. It keeps the entry's spacing, its alert boxes and its folded blocks, which a release page renders the same way. A release page also turns every newline into a line break, which is why each paragraph and bullet is one source line. The release step in the command YAMLs strips both before it runs `gh release create`, then appends an `&nbsp;` line and the pointer:

```text
&nbsp;

Full changelog: `.skilled/changelog/{component}/v{VERSION}.md`
```

The release title is the tag, an em dash and the editorial title, `v{VERSION} — {Editorial Title}`, and the tag is annotated with the message `v{VERSION}: {Editorial Title}`.

---

## 7. NESTED PACKET-LOCAL CHANGELOGS (DEPRECATED)

Spec folders no longer get changelogs, so no workflow writes a new file under `specs/**/changelog/`. A change recorded in a spec folder goes into a global entry for the component it touched, written from this template.

Existing `changelog-<packet>-root.md` and `changelog-<packet>-<phase-folder>.md` files stay as history and still validate. The spec-kit nested generator that rendered them is removed. Do not reuse this template for them.

---

## 8. RELATED RESOURCES

- `.skilled/changelog/skilled/v4.0.2.1.md` - the model for the layout, sentence length, plain words, feature detail and the How It Was Checked section
- `.skilled/changelog/skilled/v4.0.1.0.md` - the model for selection in a release with many changes
- `.skilled/changelog/skilled/v4.0.0.0.md` - the model for voice and for how a major release opens
- [check_changelog_shape.py](../scripts/check_changelog_shape.py) - the shape check that enforces the glance order, the spec-folder line and the sentence ceilings
- [hvr-rules.md](../../sk-create-with-human-voice/references/hvr-rules.md) - Human Voice Rules (banned words, punctuation, structure)
- [core-standards.md](../../shared/references/core-standards.md) - Markdown structure and naming conventions
- [worked-examples.md](../references/worked-examples.md) - a filled-in v4-style entry with annotations
