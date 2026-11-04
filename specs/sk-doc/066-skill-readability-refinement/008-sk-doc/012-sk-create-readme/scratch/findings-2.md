### .skilled/skills/sk-doc/sk-create-readme/references/readme/types-and-voice.md
- [P2] .skilled/skills/sk-doc/sk-create-readme/references/readme/types-and-voice.md:23 | 4 | §1 OVERVIEW opens with an unlabeled purpose paragraph, then Core Principle, then When to Use, so the reader meets the governing principle before the trigger list. `skill-reference-template.md` §2 Reference Body Skeleton orders the overview Purpose, then When to Use, then Core Principle and the optional blocks. | Replace lines 23-32 with:
```
### Purpose

A README answers "What is this?" and "How do I use it?" in a scannable, progressive format. The type and voice decisions below shape every section that follows, so make them before copying a template.

The README type decision tree lives in `ROUTER.md` Section 3. This reference covers the type table, disclosure stages and voice split that the tree feeds into.

### When to Use

- Deciding which of the five README types a folder needs
- Setting how much a reader gets at each disclosure stage
- Splitting narrative and reference voice inside one file

### Core Principle

Help users succeed in under 2 minutes, then provide depth for those who need it.
```
- [P2] .skilled/skills/sk-doc/sk-create-readme/references/readme/types-and-voice.md:52 | 7 | One paragraph carries three separate register decisions (the formatting rules, the voice allowance for non-front-page READMEs, and the "explains rather than sells" boundary), and the formatting rules are buried in a colon run, so a reader has to unpack them. | Replace line 52 with:
```
Every other README, including Skill and Feature, keeps the technical register for formatting:

- Numbered ALL-CAPS sections.
- Tables for lookups.
- Only semantic emoji (✅ ❌ ⚠️ 🔒 🚨) for rules and status markers.

The writing voice may still borrow the front page's engagement: a skill README may open with a pitch and benefit-led bullets before the technical detail. It explains rather than sells, and it never copies the decorative section emoji.
```

### .skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md
- [P2] .skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md:17 | 3 | The intro runs three sentences and closes on a pure contents pointer, "this file covers how to write them well", which the reference template's 1-2 sentence cap and the intro rule both reject. | Replace line 17 with: `Open this while drafting a single section, once the section list is settled and the question is how to shape that section. It is overflow detail behind `SKILL.md` Sections 5 and 6 (output shapes), which decide which sections to include.`
- [P2] .skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md:23 | 4 | §1 OVERVIEW opens with an unlabeled purpose paragraph, then Core Principle, then When to Use, so the trigger list comes after the governing principle. `skill-reference-template.md` §2 Reference Body Skeleton orders Purpose, then When to Use, then Core Principle. | Replace lines 23-30 with:
```
### Purpose

These are the writing patterns that make a README scannable and consistent: what each section is for, how headings nest, when an analogy helps, and which table shapes carry which content.

### When to Use

- Drafting a specific README section and wanting a writing tip
- Choosing a table pattern for comparison, statistics or parameters
- Confirming heading, code-block or placeholder conventions

### Core Principle

Show it in a table when the content is comparable, and lead every section with what the reader needs first.
```

  The `readme-template.md` Section 6 citation now at line 36 moves down with its paragraph. Its cited section number is unchanged, so only the citing line needs the manual recheck.
- [P2] .skilled/skills/sk-doc/sk-create-readme/references/readme/writing-patterns.md:48 | 7 | One paragraph packs five separate rules for the Features section (the two-tier split, H3 numbering with dividers, H4 numbering, the opening sentences, and first-use bolding), so a drafter has to unpack the procedure from prose. | Replace line 48 with:
```
Comprehensive feature documentation with two-tier structure.

- Split into a narrative subsection (`### 3.1 HOW IT WORKS`) and a reference subsection (`### 3.2 TECHNICAL REFERENCE`).
- Use numbered H3 ALL CAPS subsections with `---` dividers between them, and numbered H4 ALL CAPS sub-subsections (3.1.1, 3.1.2) within narrative subsections.
- Open each sub-subsection with 1-2 plain-language sentences, and bold key term names on first use.
```
