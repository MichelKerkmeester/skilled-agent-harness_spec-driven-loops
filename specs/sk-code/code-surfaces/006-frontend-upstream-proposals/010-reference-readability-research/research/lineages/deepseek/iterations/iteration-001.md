# Iteration 1: Template Contract and Hub Root Files

## Focus

Establish the normative section-order contract from the sk-doc reference and asset templates, then test the hub root files (`SKILL.md`, `ROUTER.md`, `shared/README.md`, `shared/references/**`) against it. This is the baseline every later family audit compares to.

## Actions Taken

1. Read `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` §2 (document structure, intro rules, frontmatter) and the section map of both templates.
2. Read the asset template's document-structure rules, including the "Related Resources must be last" clause.
3. Extracted the heading map of all nine hub `shared/` documents plus the hub `ROUTER.md` and `shared/README.md`.
4. Ran a 121-file mechanical structural scan (headings, bold-label adjacency, setext hazards, overview bodies, duplicate headings, bare URLs, related-section placement) over the scoped corpus; results staged at `.executor-state/scan.json`.
5. Read the flagged regions in `ROUTER.md`, `runner-contract.md`, `stack-detection.md`, `phase-detection.md`, `workflow-implement.md`, `workflow-verify.md` and `code-quality-standards.md`.

## Findings

1. The reference template makes the contract explicit: the H1 intro is 1-2 short sentences with no subsections, the first section is `## 1. OVERVIEW` with `### Purpose`, `### When to Use` and `### Core Principle`, and every reference carries six frontmatter fields. Yet the same template teaches duplication: `### When to Create References` under Section 1 restates the whole `## 3. WHEN TO CREATE REFERENCE FILES` section, so the normative document itself models duplicated content. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:58] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:100] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:36] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:182]

2. The asset template states the placement rule the corpus violates: "N. Related Resources (optional, if present must be last)". The hub `ROUTER.md` breaks it by placing `## 8. RELATED RESOURCES` at line 218 before `## 9. MACHINE-READABLE ROUTER` (227), `## 10. HOW TO READ THIS` (441) and `## 11. MACHINE ROUTER` (450), so the reader's "where next" section interrupts the routing content it should close. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:166] [SOURCE: .skilled/skills/sk-code/ROUTER.md:218] [SOURCE: .skilled/skills/sk-code/ROUTER.md:227] [SOURCE: .skilled/skills/sk-code/ROUTER.md:450]

3. `sk-code-quality/references/runner-contract.md` opens its body with `## 1. OVERVIEW AND CLI` and then goes straight into a code fence: there is no overview paragraph and no `### Purpose` or `### When to Use`, so the section named "overview" contains only the CLI synopsis and option tables. The combined heading is also the accretion pattern the brief names: two topics welded onto one heading instead of an overview followed by a CLI section. [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:20] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:22]

4. `shared/references/stack-detection.md` has an OVERVIEW section with `### Core Principle` and `### Surfaces` only, omitting the template's `### Purpose` and `### When to Use`. A reader meets the detection rule before learning what the file is for or when to load it. [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:20] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:26] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:100]

5. OVERVIEW subheading order is not consistent across sibling references, which is the "items ordered by authoring history" symptom at section level: `phase-detection.md` runs Purpose (22), When to Use (26), Core Principle (33); `workflow-implement.md` runs Purpose (22), Core Principle (26), When to Use (30); `workflow-verify.md` runs Purpose (22), Iron Law (26), When to Use (32); `code-quality-standards.md` runs Purpose (23), Core Principle (27), When to Use (31). Four files, three orders, and one file replaces Core Principle with Iron Law. [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:23]

## Ruled Out

- Treating every `firstH2NotOverview` hit on a `SKILL.md` as a template violation: skill bodies follow a different template, so only reference and asset files were scored against the reference/asset contract.
- Treating long prose lines as rendering defects: they wrap in rendered Markdown, so they were recorded as a style signal, not a finding.
- Treating `## Rule overrides` in `rule-overrides.md:51` as a stray heading: it sits inside a fenced example, and the fence-aware scan correctly excluded it.

## Dead Ends

- A purely regex-driven "authoring order" detector: section order can only be judged against a named reader task, so this iteration compares sibling files against each other and the template rather than inventing a universal order.

## Edge Cases

- Ambiguous input: "every reference and asset" excludes `manual-testing-playbook/`, `changelog/`, `benchmark/` and `feature-catalog/`; the scan scope was fixed to `references/`, `assets/`, `shared/`, `SKILL.md` and `ROUTER.md` (121 files).
- Contradictory evidence: the reference template's GOOD structure puts `When to Use` before `Core Principle` while several hub files put `Core Principle` first; the template wins because it is the stated baseline, but the inconsistency is recorded as a finding rather than a hard error.
- Missing dependencies: none.
- Partial success: none; all planned reads succeeded.

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:36-213`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:166`
- `.skilled/skills/sk-code/ROUTER.md:16-450`
- `.skilled/skills/sk-code/shared/references/stack-detection.md:20-40`
- `.skilled/skills/sk-code/shared/references/phase-detection.md:20-44`
- `.skilled/skills/sk-code/shared/references/workflow-implement.md:20-40`
- `.skilled/skills/sk-code/shared/references/workflow-verify.md:20-36`
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:21-40`
- `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:14-30`
- `.skilled/skills/sk-code/shared/README.md:20-123`

## Assessment

- New information ratio: 0.80
- Questions addressed: template contract; hub root and shared-reference conformance.
- Questions answered: "What section-order and container contract does the sk-doc skill-reference template define, and how do the hub SKILL.md, hub ROUTER.md and shared/ references diverge from it?"

## Reflection

- What worked and why: deriving the contract from the template first made the sibling-order inconsistency visible; without a named baseline, four different OVERVIEW orders all look locally reasonable.
- What did not work and why: a naive "first H2 is not OVERVIEW" rule produced false positives on SKILL.md, because skill bodies use a different template; the scan now separates reference/asset files from skill files.
- What I would do differently: read the template's own section map before the corpus scan, because the template duplicates its own guidance and that duplication sets the tolerance level for every file it governs.

## Recommended Next Focus

Iteration 2: the `sk-code-ci` family (`SKILL.md`, `ROUTER.md`, four references), checking heading shape, section order, item order and the same six defect classes against the contract established here.
