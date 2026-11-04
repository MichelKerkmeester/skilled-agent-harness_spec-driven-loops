# Iteration 3: sk-code-frontend References and the Pre-Fix Cascade File

## Focus

Audit `.skilled/skills/sk-code/sk-code-frontend/` references against the enumerated defect classes, using the pre-fix `web-cascade-and-selectors.md` at commit `cd00629166` as the known-bad control and the current HEAD file as the remediation control.

## Actions Taken

1. Read the heading map of all ten frontend references plus `SKILL.md` and `ROUTER.md`.
2. Read the pre-fix `web-cascade-and-selectors.md` extracted from commit `cd00629166` and diffed it against HEAD.
3. Read the current `web-cascade-and-selectors.md`, `figma-to-code.md` overview, `web-internationalization.md` §4-§5 and `web-performance-and-loading.md` §4-§5.
4. Grepped the pre-fix copy for adjacent bold labels, bare URLs and duplicate labels to get exact lines.

## Findings

1. The pre-fix `web-cascade-and-selectors.md` carries the consecutive-bold-label defect on every rule: lines 23-28 are six adjacent `**Rule.**` / `**Why.**` / `**When not to.**` / `**Pitfall.**` / `**Support.**` / `**See also.**` lines with no blank lines, so CommonMark joins them into one paragraph and the label structure disappears in the rendered page. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:23 (at cd00629166)]

2. The same pre-fix file opens with `## 1. OVERVIEW AND CASCADE AND SPECIFICITY` and then goes directly to `### CS1. Cascade decision order`, so the section that promises an overview contains no overview, no Purpose and no When to Use. This is exactly the "OVERVIEW AND <topic>" accretion pattern named in the brief. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:19 (at cd00629166)]

3. The pre-fix file has nine bare URLs, one per rule, each placed after a `**See also.**` label and never wrapped in a link: lines 28, 37, 46, 60, 69, 82, 91, 100 and 109. It also repeats the same `**Support.**` line twice inside CS4 at lines 58-59, so the reader sees the same compatibility sentence twice with no explanation. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:28 (at cd00629166)] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:58 (at cd00629166)]

4. The current HEAD version fixes the shape by converting each rule block to a bullet list and each bare URL to a named link, which confirms the intended remediation: `- **Rule:**` ... `- **See also:** [MDN: CSS cascade](...)`. The fix is real, but it was applied to this file rather than enforced, so the class survives elsewhere. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:41] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:48]

5. `web-performance-and-loading.md` orders rule ids by authoring history rather than reader task: §4 ends with `### P10. Main-thread long tasks` at line 111, then §5 begins with `### P8. srcset and sizes selection` at 124 and `### P9. Picture formats and image hints` at 133. A reader following the ids meets P10 before P8 and P9, and the section boundary hides the inversion. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:111] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:124] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:133]

6. The duplicate-label class the pre-fix file showed also survives at HEAD: `web-performance-and-loading.md` P8 repeats the entire support sentence twice in one bullet, "Baseline widely available since 2019-09-27 (web-features `srcset`). Chrome 38 / Firefox 38 / Safari 10.1." followed by the same sentence again. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:130]

7. `web-internationalization.md` jumps from `### I7. Date-only parsing` (105) to `### I9. Expansion and pseudo-localization` (118) with no I8 anywhere in the file, so the numbering records a deleted or moved rule and gives the reader a false sense that a rule is missing. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md:105] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md:118]

8. `figma-to-code.md` is the only web-family reference whose OVERVIEW starts with `### Core Principle` (21) before `### Purpose` (25) and `### When to Use` (29); every sibling `web-*.md` starts with Purpose, When to Use, Boundaries. The same packet therefore presents two overview orders. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:21] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:25] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:21]

## Ruled Out

- Treating the current `web-cascade-and-selectors.md` as still defective: the diff shows the bold-label blocks became bullet lists and the bare URLs became named links, so the file now matches the template shape.
- Treating `frontend-practice.md:95` and `:102` (`**Layers**`, `**Web topic files**`) as adjacent bold joins: they are separated by blank lines and body text, so they render as separate label paragraphs.
- Treating the `**Deeper:**` handoff lines in `web-markup-and-css.md` as orphaned labels: each closes a section with a valid link.

## Dead Ends

- Searching for current bare URLs in the frontend references: all nine were repaired in the restructure, so the class is now historical in this family but live elsewhere.

## Edge Cases

- Ambiguous input: the pre-fix file no longer exists at HEAD, so its line citations are commit-relative and labelled `(at cd00629166)`.
- Contradictory evidence: HEAD passes the shape checks while the pre-fix commit failed them, so the same path yields two different verdicts depending on revision; the finding records the revision.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md` (HEAD)
- `.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md` at `cd00629166`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:105-144`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md:105-125`
- `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:13-40`
- `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:13-69`
- `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md:10-28`

## Assessment

- New information ratio: 0.75
- Questions addressed: frontend reference defects, including the pre-fix control.
- Questions answered: "Which sk-code-frontend references, including web-cascade-and-selectors.md, carry the enumerated rendering defects, and at which exact lines?"

## Reflection

- What worked and why: diffing the pre-fix commit against HEAD produced a precise remediated shape, which made the surviving duplicate-support and id-order defects obvious by contrast.
- What did not work and why: the current-file structural scan reported zero bold-join and zero bare-URL hits, because the restructure repaired this family; without the commit control the audit would have under-reported the class.
- What I would do differently: pull the pre-fix control before scanning any family, since a clean current file does not prove the class is absent from the corpus or the validator.

## Recommended Next Focus

Iteration 4: `sk-code-quality` references, where the first iteration already flagged `runner-contract.md` as an OVERVIEW with no overview and the longest introduction in the corpus.
