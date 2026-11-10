# Iteration 8: Template, Guidance and Validator Changes

## Focus

Convert the confirmed defect classes and the traced validator gaps into concrete template, authoring-guidance and validator changes, with a mechanical-checkability verdict and a precision estimate for each.

## Actions Taken

1. Mapped each confirmed defect class to the exact validator function and rule-data block that should own it.
2. Used the lineage's 121-file fence-aware scan as a prototype for the proposed detectors and counted its current hits.
3. Ranked the proposals by precision, migration risk and whether a human must still judge the result.

## Findings

1. **Adjacent bold-label lines — mechanically checkable, high precision.** Add `render_bold_label_join`: outside fenced code, flag when two consecutive non-blank lines both start with `**Label**` and neither is a list item. On the 121-file corpus the detector found zero hits at HEAD and nine blocks in the pre-fix control, so it is a true-positive-only rule with negligible false-positive risk; make it blocking. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2008] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:130]

2. **Text directly above `---` — mechanically checkable, high precision.** Add `render_setext_hazard`: flag a non-blank, non-heading, non-list, non-table line immediately above a thematic break, because Markdown renders it as a setext H2. The current corpus has zero hits, the pre-fix control has the divider pattern the template encourages, and the check is a one-line lookbehind; make it blocking. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:676] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:77]

3. **`OVERVIEW AND <topic>` with no overview — mechanically checkable for emptiness, partially for quality.** Add `render_overview_empty`: for every H2 whose text contains OVERVIEW, require a prose paragraph of at least 40 characters or a `### Purpose` / `### When to Use` subsection with body text before the next section; flag a heading that continues after `OVERVIEW AND` as blocking. Whether the prose is a *good* overview remains human judgment, but the current `runner-contract.md` case and the pre-fix cascade case are both caught mechanically. [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:20] [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:321]

4. **Related Resources missing or misplaced — mechanically checkable, high precision once the template settles the rule.** Add `render_related_last`: require a related section for `reference` and `asset`, and flag any same-or-higher-level heading after it. This catches the three confirmed misplacements (`ROUTER.md` §8, `sk-code-review/SKILL.md` §8, `alignment-verification-automation.md` §5) and the two confirmed omissions (`runner-contract.md`, `quality-config.md`). The template must first be made consistent: the asset template says "must be last", the reference template does not say it, and `template-rules.json` lists it as recommended only. Make all three say required-and-last, then enforce it. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:166] [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:323] [SOURCE: .skilled/skills/sk-code/ROUTER.md:218]

5. **Bare URLs — mechanically checkable, medium-high precision.** Add `render_bare_url`: outside fences and inline code, flag an `http(s)://` token that is not inside `[text](url)` and not an angle-bracket autolink. The current corpus has zero hits; the pre-fix control has nine. Keep it a warning for one migration window because command examples and generated text can carry intentional raw URLs. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:58] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:28 (at cd00629166)]

6. **Duplicated content — exact duplicates checkable, semantic duplication not.** Add `render_duplicate_block` for an identical paragraph or an identical bold-label line repeated inside one section (warning), which catches the current `web-performance-and-loading.md:130` doubled support sentence and the `shell/style-guide/overview-structure-and-naming.md:170/172` repeated Evidence label. The 14-file rust boilerplate is *not* catchable this way: it is semantic sameness with different topic words, so it needs a batch-level "repeated purpose sentence" heuristic (medium precision) plus editorial review. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:130] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md:170] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/naming-conventions.md:22]

7. **Numbering and item order — mechanically checkable proxies, medium precision.** Extend the H2 regex to `^## (\d+)([a-z]?)\.` and make a letter suffix or a non-sequential number blocking, which catches `## 2b.` in two skill bodies and the unnumbered run in `pr-state-dedup.md`. Add a rule-id monotonic check for `^### ([A-Z]{1,4})(\d+)\.` as a warning, which catches P10 before P8 and the missing I8. Neither proves the order matches the reader's task; a monotonic id sequence is only a proxy for authoring-history ordering. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:736] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:111] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:21]

8. **Template and guidance changes — the precondition for every mechanical check.** Rewrite the reference template's Section 1/§3 duplication into one "when to create" section; add three rules the templates currently omit: (a) a bold-label line is a list item or is followed by a blank line and body text, (b) a thematic break always has a blank line above it, (c) an overview may not be titled `OVERVIEW AND <topic>`. Add the related-last clause to the *reference* template, and make the skill template's numbered-H2 rule reject letter suffixes. Without these, a validator rule would contradict the document authors are told to copy. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:36] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:182] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:65]

9. **What stays human.** "Items ordered by authoring history instead of reader task" at the semantic level, "misplaced content" beyond heading position, and whether an overview actually orients a reader cannot be decided by a regex. The validator can surface the proxies above; the review checklist must ask a human to read the rendered page and confirm the narrative order. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2009]

## Ruled Out

- A validator rule that rejects every bold-label paragraph: separate label paragraphs are legitimate; only adjacency is a rendering defect.
- A validator rule that rejects every raw URL: fenced command examples and generated reports can carry them; only unfenced, unlinked prose URLs are the defect.
- A cross-file "same purpose sentence" rule as blocking: the rust boilerplate differs by topic word and would need fuzzy matching, which is too imprecise for a blocking gate.

## Dead Ends

- Trying to make "reader-task order" fully mechanical: no static analysis can know the reader's task; monotonic ids and related-last are the only defensible proxies.

## Edge Cases

- Ambiguous input: "mechanically checkable" is reported as three levels — exact (adjacency, setext, empty overview, related-last), proxy (numbering, rule-id order, duplicate blocks) and judgment (semantic order, overview quality).
- Contradictory evidence: the asset template and the rule data disagree on whether related resources are optional; the proposal requires resolving that conflict before enforcement, not after.
- Missing dependencies: none.
- Partial success: precision estimates come from a 121-file prototype scan and one known-bad control, not from a labelled corpus; they are directional, not measured error rates.

## Sources Consulted

- `.skilled/skills/sk-doc/scripts/validate_document.py:676-938`, `:1937-2058`
- `.skilled/skills/sk-doc/shared/assets/template-rules.json:319-345`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:36-213`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:129-174`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:65`
- lineage scan prototype: `.executor-state/scan.cjs` over 121 scoped files

## Assessment

- New information ratio: 0.85
- Questions addressed: per-class remediation, mechanical checkability, precision.
- Questions answered: "Which template, guidance and validator changes would catch each defect class, and which are mechanically checkable at what precision?"

## Reflection

- What worked and why: using the prototype scan's hit counts turned "mechanically checkable" into a ranked list with real false-positive evidence rather than an assertion.
- What did not work and why: precision cannot be claimed as a measured error rate from one control file; the findings label the estimates as directional.
- What I would do differently: label a small corpus of intentional label paragraphs and intentional raw URLs before claiming a precision number for those two rules.

## Recommended Next Focus

Synthesis: consolidate the eight iterations into `research.md`, state the residual unknowns (no labelled precision corpus, no full read of every skilled rule body), and record the stop reason as `maxIterationsReached`.
