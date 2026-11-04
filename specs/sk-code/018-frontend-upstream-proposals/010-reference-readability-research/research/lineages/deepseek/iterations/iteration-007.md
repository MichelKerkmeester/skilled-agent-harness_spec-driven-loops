# Iteration 7: Why the Validator and Guidance Let the Defects Pass

## Focus

Trace, check by check, why `.skilled/skills/sk-doc/scripts/validate_document.py`, its `template-rules.json`, and the sk-create-skill templates let every confirmed defect class pass. Verify the claim about the pre-fix `web-cascade-and-selectors.md` directly.

## Actions Taken

1. Read `validate_document.py` §4-§8: `validate_general_structure`, `validate_h2_headers`, `validate_required_sections`, the `validate_document` orchestration and the path-exclusion logic.
2. Read the `reference` and `asset` rule blocks in `.skilled/skills/sk-doc/shared/assets/template-rules.json`.
3. Ran the validator (`python3 -B`, `JEV_FEATURES=0`) on the pre-fix cascade copy and on four current files already confirmed defective.
4. Re-read the template's intro, duplication and related-placement rules for the guidance half of the gap.

## Findings

1. The validator passes every confirmed defect. The pre-fix `web-cascade-and-selectors.md` returned `"valid": true`, `"total_issues": 0`, exit 0 under `--type reference`, and four current files with confirmed defects (`runner-contract.md`, `web-performance-and-loading.md`, `rust/style-guide/naming-conventions.md`, `pr-state-dedup.md`) also each returned `valid: true, total_issues: 0`. The claim that the pre-fix file validated VALID with 0 issues is confirmed by direct execution, not inference. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2008] [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2045]

2. Required sections are checked by name, not by content: `validate_required_sections` collects `## <n>.` headers, normalizes their names, and accepts a match when every required word appears as a substring of the raw heading. `requiredSections` for a reference is only `["overview"]`, so `## 1. OVERVIEW AND CASCADE AND SPECIFICITY` satisfies it even when the section has no overview prose, no Purpose and no When to Use. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:837] [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:909] [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:321]

3. The H2 checker only recognises `^## (\d+)\.\s+`, so an unnumbered H2 and a letter-suffixed H2 are invisible to it: `## 2b. SMART ROUTING` never matches, which is why the ci and skilled skill bodies pass, and `pr-state-dedup.md`'s seven unnumbered H2s are never numbered at all. When a number does match, a non-sequential value is emitted as `severity: warning`, not blocking, so the P10/P8 inversion and the I8 gap cannot fail a run. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:736] [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:761] [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2041]

4. Related-section placement is not enforced: `recommendedSections` is read only inside the router branch, so a reference's `related_resources` is never required, never ordered and never checked for position. That is why `pr-state-dedup.md` can end without one, `quality-config.md` can end without one, and `ROUTER.md` can place one before sections 9-11. The rule data even downgrades the asset template's "must be last" to `recommendedSections`, so the two normative sources disagree. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:928] [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:323] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:166]

5. No check exists for any content-level defect class. The orchestration runs TOC, H2 headers, general structure, required sections and frontmatter, and nothing else: there is no adjacent-bold-label check, no setext-heading check, no bare-URL or link check, no duplicate-heading or duplicate-paragraph check, no intro-length check and no item-order check. The mechanical scan in this lineage found all of those classes, yet every one is outside the validator's vocabulary. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2009] [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2016] [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:2028]

6. The divider rule can reward the setext layout: `validate_general_structure` requires a `---` line immediately above every numbered ALL-CAPS H2, and it looks only for that line, never for a blank line between the preceding prose and the rule. A text line directly above `---` therefore satisfies the structure rule while rendering as a setext heading. The guidance compounds this: the reference template forbids duplication and fixes the intro to 1-2 sentences, but its own Section 1 duplicates Section 3's when-to-create content, and neither template says a bold-label line needs a blank line after it. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:676] [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:690] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:86] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:182]

## Ruled Out

- "The validator is disabled for these paths": the explicit `--type reference` run returned a real verdict, not a skip, and `valid: true` came from `blocking_errors == []`.
- "Frontmatter validation catches these files": all ten frontmatter fields are present in the tested files, so the frontmatter path has nothing to report.
- "The citation-drift advisory would catch it": that advisory checks file-and-line citations and never changes the exit code; it has no URL, adjacency or ordering check.

## Dead Ends

- Looking for a hidden link checker under a different rule id: the `reference` rule block has no link or URL key, and the orchestration calls no link function.

## Edge Cases

- Ambiguous input: "authoring guidance" could mean the templates or the sk-create-skill scripts; this iteration traces the templates and the rule data, and leaves the scripts' generation path to iteration 8.
- Contradictory evidence: the asset template says related resources "must be last" while `template-rules.json` lists it as recommended only; the template is the stated baseline, so the rule data is the half that needs correcting.
- Missing dependencies: none.
- Partial success: the validator was run with `JEV_FEATURES=0` to keep the citation advisory from making model calls; that switch does not affect the structural checks traced here.

## Sources Consulted

- `.skilled/skills/sk-doc/scripts/validate_document.py:603-938`
- `.skilled/skills/sk-doc/scripts/validate_document.py:1937-2058`
- `.skilled/skills/sk-doc/shared/assets/template-rules.json:319-345`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:36-213`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:129-174`
- pre-fix `web-cascade-and-selectors.md` validator run (valid true, 0 issues)
- current `runner-contract.md`, `web-performance-and-loading.md`, `rust/style-guide/naming-conventions.md`, `pr-state-dedup.md` validator runs (each valid true, 0 issues)

## Assessment

- New information ratio: 0.90
- Questions addressed: validator coverage, rule-data enforcement, template guidance, direct pre-fix verification.
- Questions answered: "Why do the sk-doc templates, authoring guidance and validate_document.py fail to detect each defect class, traced check by check?"

## Reflection

- What worked and why: running the validator on the pre-fix copy turned a brief assertion into observed evidence, and running it on four current defective files showed the gap is not historical.
- What did not work and why: reading the rule names alone would have suggested `recommendedSections` were enforced; only reading the router-only branch showed they are not.
- What I would do differently: run the validator on a known-bad control before reading its source, so the source read is aimed at the checks that could have caught it.

## Recommended Next Focus

Iteration 8: convert the traced gaps into concrete template, guidance and validator changes, with a mechanical-checkability verdict and precision estimate for each defect class.
