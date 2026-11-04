---
title: Deep Research Strategy - sk-code Reference Readability Audit
description: Tracks the eight-iteration audit of reference/asset readability, section order and rendering defects across the sk-code skill family, plus the sk-doc template and validator gap analysis.
trigger_phrases:
  - "sk-code reference readability"
  - "markdown rendering defect audit"
  - "sk-doc template gap"
  - "validator coverage gaps"
importance_tier: normal
contextType: research
version: 1.0.0.0
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the detached deepseek lineage: records the audit focus, what evidence worked, what failed, and where the next iteration should look.

### Usage

- **Init:** Focus questions and boundaries seeded from the dispatch topic.
- **Per iteration:** the iteration file carries the evidence; the reducer refreshes the machine-owned sections below.
- **Mutability:** analyst-owned sections are stable; machine-owned sections are projections.

---

## 2. TOPIC
Audit every reference and asset under `.skilled/skills/sk-code/` for readability, structure, layout and section/item order against the sk-doc reference and asset templates; find rendering defects; trace why the sk-doc templates, authoring guidance and `validate_document.py` let them pass; propose mechanically checkable fixes.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What section-order and container contract does the sk-doc skill-reference template define, and how do the hub SKILL.md, hub ROUTER.md and shared/ references diverge from it?
- [x] Which sk-code-ci references and assets violate heading shape, section order or item order, and at which exact lines?
- [x] Which sk-code-frontend references, including web-cascade-and-selectors.md, carry the enumerated rendering defects, and at which exact lines?
- [x] Which sk-code-quality references carry the enumerated rendering defects or structural divergence, and at which exact lines?
- [x] Which sk-code-review references and assets carry the enumerated rendering defects or structural divergence, and at which exact lines?
- [x] Which sk-code-skilled references and checklist assets carry the enumerated defects, and is the divergence systematic across a file family?
- [x] Why do the sk-doc templates, authoring guidance and validate_document.py fail to detect each defect class, traced check by check?
- [x] Which template, guidance and validator changes would catch each defect class, and which are mechanically checkable at what precision?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing any sk-code or sk-doc file: this lineage is read-only outside its artifact directory.
- Reviewing manual-testing-playbook, changelog, benchmark or feature-catalog prose except where a reference/asset under audit links to it.
- Judging whether the technical guidance is correct; only readability, structure, layout, order and the validator gap.

---

## 5. STOP CONDITIONS
- Eight iterations completed (`stopPolicy: max-iterations`), regardless of convergence telemetry.
- Confirm every defect class has at least one confirmed file:line instance and one validator-gap explanation.
- Missing evidence for a claim forces an explicit UNKNOWN, never a silent generalization.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What section-order and container contract does the sk-doc skill-reference template define, and how do the hub SKILL.md, hub ROUTER.md and shared/ references diverge from it?
- Which sk-code-ci references and assets violate heading shape, section order or item order, and at which exact lines?
- Which sk-code-frontend references, including web-cascade-and-selectors.md, carry the enumerated rendering defects, and at which exact lines?
- Which sk-code-quality references carry the enumerated rendering defects or structural divergence, and at which exact lines?
- Which sk-code-review references and assets carry the enumerated rendering defects or structural divergence, and at which exact lines?
- Which sk-code-skilled references and checklist assets carry the enumerated defects, and is the divergence systematic across a file family?
- Why do the sk-doc templates, authoring guidance and validate_document.py fail to detect each defect class, traced check by check?
- Which template, guidance and validator changes would catch each defect class, and which are mechanically checkable at what precision?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- deriving the contract from the template first made the sibling-order inconsistency visible; without a named baseline, four different OVERVIEW orders all look locally reasonable. (iteration 1)
- comparing sibling OVERVIEW shapes inside one packet surfaced the systematic divergence faster than checking each file against the template alone. (iteration 2)
- diffing the pre-fix commit against HEAD produced a precise remediated shape, which made the surviving duplicate-support and id-order defects obvious by contrast. (iteration 3)
- measuring line length turned a vague "dense" impression into exact evidence and separated a real layout defect from a stylistic preference. (iteration 4)
- comparing the index table against the assets directory found an omission a heading scan cannot see, because the omitted file has no row to inspect. (iteration 5)
- counting a boilerplate sentence across the tree turned a suspicion into a family-level finding with an exact numerator (14 files) and a named exception. (iteration 6)
- running the validator on the pre-fix copy turned a brief assertion into observed evidence, and running it on four current defective files showed the gap is not historical. (iteration 7)
- using the prototype scan's hit counts turned "mechanically checkable" into a ranked list with real false-positive evidence rather than an assertion. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- a naive "first H2 is not OVERVIEW" rule produced false positives on SKILL.md, because skill bodies use a different template; the scan now separates reference/asset files from skill files. (iteration 1)
- the mechanical scan cannot see leaked authoring state such as `status: landed`, because it is valid prose; only reading the section exposed it. (iteration 2)
- the current-file structural scan reported zero bold-join and zero bare-URL hits, because the restructure repaired this family; without the commit control the audit would have under-reported the class. (iteration 3)
- the heading scan cannot see missing sections, because an absent heading produces no row; reading the file tails was required. (iteration 4)
- the first pass suspected three assets of missing related sections; reading their tails showed link lists under a heading the truncated map had hidden, so the claim was narrowed to one file. (iteration 5)
- the heading scan alone could not distinguish deliberate parallel structure from duplication; reading the two exemption tiers was needed to avoid a false positive. (iteration 6)
- reading the rule names alone would have suggested `recommendedSections` were enforced; only reading the router-only branch showed they are not. (iteration 7)
- precision cannot be claimed as a measured error rate from one control file; the findings label the estimates as directional. (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Frontmatter validation catches these files": all ten frontmatter fields are present in the tested files, so the frontmatter path has nothing to report. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "Frontmatter validation catches these files": all ten frontmatter fields are present in the tested files, so the frontmatter path has nothing to report.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Frontmatter validation catches these files": all ten frontmatter fields are present in the tested files, so the frontmatter path has nothing to report.

### "The citation-drift advisory would catch it": that advisory checks file-and-line citations and never changes the exit code; it has no URL, adjacency or ordering check. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The citation-drift advisory would catch it": that advisory checks file-and-line citations and never changes the exit code; it has no URL, adjacency or ordering check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The citation-drift advisory would catch it": that advisory checks file-and-line citations and never changes the exit code; it has no URL, adjacency or ordering check.

### "The validator is disabled for these paths": the explicit `--type reference` run returned a real verdict, not a skip, and `valid: true` came from `blocking_errors == []`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The validator is disabled for these paths": the explicit `--type reference` run returned a real verdict, not a skip, and `valid: true` came from `blocking_errors == []`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The validator is disabled for these paths": the explicit `--type reference` run returned a real verdict, not a skip, and `valid: true` came from `blocking_errors == []`.

### `ci-workflow-standards.md:54` naming `assets/workflow-template.yml` looked like a dangling link, but the asset exists at 81 lines, so it is a valid pointer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `ci-workflow-standards.md:54` naming `assets/workflow-template.yml` looked like a dangling link, but the asset exists at 81 lines, so it is a valid pointer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `ci-workflow-standards.md:54` naming `assets/workflow-template.yml` looked like a dangling link, but the asset exists at 81 lines, so it is a valid pointer.

### `quality-config.md:99` looked like a stray unnumbered `## Rule overrides` heading, but it sits inside a fenced markdown example; the fence-aware scan excludes it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `quality-config.md:99` looked like a stray unnumbered `## Rule overrides` heading, but it sits inside a fenced markdown example; the fence-aware scan excludes it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `quality-config.md:99` looked like a stray unnumbered `## Rule overrides` heading, but it sits inside a fenced markdown example; the fence-aware scan excludes it.

### A cross-file "same purpose sentence" rule as blocking: the rust boilerplate differs by topic word and would need fuzzy matching, which is too imprecise for a blocking gate. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A cross-file "same purpose sentence" rule as blocking: the rust boilerplate differs by topic word and would need fuzzy matching, which is too imprecise for a blocking gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A cross-file "same purpose sentence" rule as blocking: the rust boilerplate differs by topic word and would need fuzzy matching, which is too imprecise for a blocking gate.

### A file-by-file read of all 45 skilled references: the boilerplate and heading signals are dense enough to characterize the family, and reading every rule body would not change the structural verdict. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A file-by-file read of all 45 skilled references: the boilerplate and heading signals are dense enough to characterize the family, and reading every rule body would not change the structural verdict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A file-by-file read of all 45 skilled references: the boilerplate and heading signals are dense enough to characterize the family, and reading every rule body would not change the structural verdict.

### A purely regex-driven "authoring order" detector: section order can only be judged against a named reader task, so this iteration compares sibling files against each other and the template rather than inventing a universal order. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A purely regex-driven "authoring order" detector: section order can only be judged against a named reader task, so this iteration compares sibling files against each other and the template rather than inventing a universal order.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A purely regex-driven "authoring order" detector: section order can only be judged against a named reader task, so this iteration compares sibling files against each other and the template rather than inventing a universal order.

### A validator rule that rejects every bold-label paragraph: separate label paragraphs are legitimate; only adjacency is a rendering defect. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A validator rule that rejects every bold-label paragraph: separate label paragraphs are legitimate; only adjacency is a rendering defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A validator rule that rejects every bold-label paragraph: separate label paragraphs are legitimate; only adjacency is a rendering defect.

### A validator rule that rejects every raw URL: fenced command examples and generated reports can carry them; only unfenced, unlinked prose URLs are the defect. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A validator rule that rejects every raw URL: fenced command examples and generated reports can carry them; only unfenced, unlinked prose URLs are the defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A validator rule that rejects every raw URL: fenced command examples and generated reports can carry them; only unfenced, unlinked prose URLs are the defect.

### Claiming the three checklist assets lack a closing related section: their tails carry link lists under a related heading, so the omission is specific to `pr-state-dedup.md`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Claiming the three checklist assets lack a closing related section: their tails carry link lists under a related heading, so the omission is specific to `pr-state-dedup.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming the three checklist assets lack a closing related section: their tails carry link lists under a related heading, so the omission is specific to `pr-state-dedup.md`.

### Counting `SKILL.md` §8 REFERENCES AND RELATED RESOURCES as misplaced: it is the last section of the skill body, which matches the skill template's expectation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Counting `SKILL.md` §8 REFERENCES AND RELATED RESOURCES as misplaced: it is the last section of the skill body, which matches the skill template's expectation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `SKILL.md` §8 REFERENCES AND RELATED RESOURCES as misplaced: it is the last section of the skill body, which matches the skill template's expectation.

### Looking for a hidden link checker under a different rule id: the `reference` rule block has no link or URL key, and the orchestration calls no link function. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a hidden link checker under a different rule id: the `reference` rule block has no link or URL key, and the orchestration calls no link function.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a hidden link checker under a different rule id: the `reference` rule block has no link or URL key, and the orchestration calls no link function.

### Looking for adjacent bold labels in the review references: the packet uses bullets and tables, so the class is absent here. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for adjacent bold labels in the review references: the packet uses bullets and tables, so the class is absent here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for adjacent bold labels in the review references: the packet uses bullets and tables, so the class is absent here.

### Looking for bare URLs or adjacent bold labels in this family: none at HEAD, because these documents use bullets and tables rather than label paragraphs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for bare URLs or adjacent bold labels in this family: none at HEAD, because these documents use bullets and tables rather than label paragraphs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for bare URLs or adjacent bold labels in this family: none at HEAD, because these documents use bullets and tables rather than label paragraphs.

### Scoring the ci references against the asset template's Purpose/Usage pair: they are references, not assets, so the reference template's Purpose/When to Use pair is the correct baseline. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Scoring the ci references against the asset template's Purpose/Usage pair: they are references, not assets, so the reference template's Purpose/When to Use pair is the correct baseline.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Scoring the ci references against the asset template's Purpose/Usage pair: they are references, not assets, so the reference template's Purpose/When to Use pair is the correct baseline.

### Searching for current bare URLs in the frontend references: all nine were repaired in the restructure, so the class is now historical in this family but live elsewhere. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching for current bare URLs in the frontend references: all nine were repaired in the restructure, so the class is now historical in this family but live elsewhere.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for current bare URLs in the frontend references: all nine were repaired in the restructure, so the class is now historical in this family but live elsewhere.

### The blank double line before `---` in two references is whitespace noise, not a rendering defect. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The blank double line before `---` in two references is whitespace noise, not a rendering defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The blank double line before `---` in two references is whitespace noise, not a rendering defect.

### The three scaffold assets are YAML/JSON, not Markdown; their `#<<...>>` template directives are intentional scaffold syntax rather than rendering defects. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The three scaffold assets are YAML/JSON, not Markdown; their `#<<...>>` template directives are intentional scaffold syntax rather than rendering defects.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The three scaffold assets are YAML/JSON, not Markdown; their `#<<...>>` template directives are intentional scaffold syntax rather than rendering defects.

### Treating `## Rule overrides` in `rule-overrides.md:51` as a stray heading: it sits inside a fenced example, and the fence-aware scan correctly excluded it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `## Rule overrides` in `rule-overrides.md:51` as a stray heading: it sits inside a fenced example, and the fence-aware scan correctly excluded it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `## Rule overrides` in `rule-overrides.md:51` as a stray heading: it sits inside a fenced example, and the fence-aware scan correctly excluded it.

### Treating `frontend-practice.md:95` and `:102` (`**Layers**`, `**Web topic files**`) as adjacent bold joins: they are separated by blank lines and body text, so they render as separate label paragraphs. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `frontend-practice.md:95` and `:102` (`**Layers**`, `**Web topic files**`) as adjacent bold joins: they are separated by blank lines and body text, so they render as separate label paragraphs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `frontend-practice.md:95` and `:102` (`**Layers**`, `**Web topic files**`) as adjacent bold joins: they are separated by blank lines and body text, so they render as separate label paragraphs.

### Treating `quick-reference.md`'s `### Usage` heading as a template violation on its own: the deeper defect is the incomplete table, not the heading name. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating `quick-reference.md`'s `### Usage` heading as a template violation on its own: the deeper defect is the incomplete table, not the heading name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `quick-reference.md`'s `### Usage` heading as a template violation on its own: the deeper defect is the incomplete table, not the heading name.

### Treating `review-core.md` §9's long Python resolver as misplaced: it is an executable contract the section names, not unrelated prose. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating `review-core.md` §9's long Python resolver as misplaced: it is an executable contract the section names, not unrelated prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `review-core.md` §9's long Python resolver as misplaced: it is an executable contract the section names, not unrelated prose.

### Treating every `firstH2NotOverview` hit on a `SKILL.md` as a template violation: skill bodies follow a different template, so only reference and asset files were scored against the reference/asset contract. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating every `firstH2NotOverview` hit on a `SKILL.md` as a template violation: skill bodies follow a different template, so only reference and asset files were scored against the reference/asset contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every `firstH2NotOverview` hit on a `SKILL.md` as a template violation: skill bodies follow a different template, so only reference and asset files were scored against the reference/asset contract.

### Treating long prose lines as rendering defects: they wrap in rendered Markdown, so they were recorded as a style signal, not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating long prose lines as rendering defects: they wrap in rendered Markdown, so they were recorded as a style signal, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating long prose lines as rendering defects: they wrap in rendered Markdown, so they were recorded as a style signal, not a finding.

### Treating the `**Deeper:**` handoff lines in `web-markup-and-css.md` as orphaned labels: each closes a section with a valid link. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the `**Deeper:**` handoff lines in `web-markup-and-css.md` as orphaned labels: each closes a section with a valid link.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `**Deeper:**` handoff lines in `web-markup-and-css.md` as orphaned labels: each closes a section with a valid link.

### Treating the `runner-contract.md` CLI tables as the overview: they are the section content, which is the defect, not evidence that an overview exists. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the `runner-contract.md` CLI tables as the overview: they are the section content, which is the defect, not evidence that an overview exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `runner-contract.md` CLI tables as the overview: they are the section content, which is the defect, not evidence that an overview exists.

### Treating the checklist assets as boilerplate: their Purpose paragraphs are specific (`This split checklist protects DTO, error, panic, unsafe-code ... boundaries`), so the boilerplate is confined to the references. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the checklist assets as boilerplate: their Purpose paragraphs are specific (`This split checklist protects DTO, error, panic, unsafe-code ... boundaries`), so the boilerplate is confined to the references.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the checklist assets as boilerplate: their Purpose paragraphs are specific (`This split checklist protects DTO, error, panic, unsafe-code ... boundaries`), so the boilerplate is confined to the references.

### Treating the current `web-cascade-and-selectors.md` as still defective: the diff shows the bold-label blocks became bullet lists and the bare URLs became named links, so the file now matches the template shape. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the current `web-cascade-and-selectors.md` as still defective: the diff shows the bold-label blocks became bullet lists and the bare URLs became named links, so the file now matches the template shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the current `web-cascade-and-selectors.md` as still defective: the diff shows the bold-label blocks became bullet lists and the bare URLs became named links, so the file now matches the template shape.

### Treating the repeated `### Scope`, `### Exempted Standards` and `### What Still Applies` headings in `security-testing-and-exemptions.md` as duplication: the repeat is deliberate parallel structure for two exemption tiers, and both instances carry distinct content. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the repeated `### Scope`, `### Exempted Standards` and `### What Still Applies` headings in `security-testing-and-exemptions.md` as duplication: the repeat is deliberate parallel structure for two exemption tiers, and both instances carry distinct content.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the repeated `### Scope`, `### Exempted Standards` and `### What Still Applies` headings in `security-testing-and-exemptions.md` as duplication: the repeat is deliberate parallel structure for two exemption tiers, and both instances carry distinct content.

### Treating the same `**Evidence**:` path in `overview-modules-and-docs.md:137` and `:155` as a duplicate paragraph: two different rules cite the same implementation file, which is legitimate shared evidence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the same `**Evidence**:` path in `overview-modules-and-docs.md:137` and `:155` as a duplicate paragraph: two different rules cite the same implementation file, which is legitimate shared evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the same `**Evidence**:` path in `overview-modules-and-docs.md:137` and `:155` as a duplicate paragraph: two different rules cite the same implementation file, which is legitimate shared evidence.

### Trying to make "reader-task order" fully mechanical: no static analysis can know the reader's task; monotonic ids and related-last are the only defensible proxies. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Trying to make "reader-task order" fully mechanical: no static analysis can know the reader's task; monotonic ids and related-last are the only defensible proxies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to make "reader-task order" fully mechanical: no static analysis can know the reader's task; monotonic ids and related-last are the only defensible proxies.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A purely regex-driven "authoring order" detector: section order can only be judged against a named reader task, so this iteration compares sibling files against each other and the template rather than inventing a universal order. (iteration 1)
- Treating `## Rule overrides` in `rule-overrides.md:51` as a stray heading: it sits inside a fenced example, and the fence-aware scan correctly excluded it. (iteration 1)
- Treating every `firstH2NotOverview` hit on a `SKILL.md` as a template violation: skill bodies follow a different template, so only reference and asset files were scored against the reference/asset contract. (iteration 1)
- Treating long prose lines as rendering defects: they wrap in rendered Markdown, so they were recorded as a style signal, not a finding. (iteration 1)
- `ci-workflow-standards.md:54` naming `assets/workflow-template.yml` looked like a dangling link, but the asset exists at 81 lines, so it is a valid pointer. (iteration 2)
- Scoring the ci references against the asset template's Purpose/Usage pair: they are references, not assets, so the reference template's Purpose/When to Use pair is the correct baseline. (iteration 2)
- The blank double line before `---` in two references is whitespace noise, not a rendering defect. (iteration 2)
- The three scaffold assets are YAML/JSON, not Markdown; their `#<<...>>` template directives are intentional scaffold syntax rather than rendering defects. (iteration 2)
- Searching for current bare URLs in the frontend references: all nine were repaired in the restructure, so the class is now historical in this family but live elsewhere. (iteration 3)
- Treating `frontend-practice.md:95` and `:102` (`**Layers**`, `**Web topic files**`) as adjacent bold joins: they are separated by blank lines and body text, so they render as separate label paragraphs. (iteration 3)
- Treating the `**Deeper:**` handoff lines in `web-markup-and-css.md` as orphaned labels: each closes a section with a valid link. (iteration 3)
- Treating the current `web-cascade-and-selectors.md` as still defective: the diff shows the bold-label blocks became bullet lists and the bare URLs became named links, so the file now matches the template shape. (iteration 3)
- `quality-config.md:99` looked like a stray unnumbered `## Rule overrides` heading, but it sits inside a fenced markdown example; the fence-aware scan excludes it. (iteration 4)
- Counting `SKILL.md` §8 REFERENCES AND RELATED RESOURCES as misplaced: it is the last section of the skill body, which matches the skill template's expectation. (iteration 4)
- Looking for bare URLs or adjacent bold labels in this family: none at HEAD, because these documents use bullets and tables rather than label paragraphs. (iteration 4)
- Treating the `runner-contract.md` CLI tables as the overview: they are the section content, which is the defect, not evidence that an overview exists. (iteration 4)
- Claiming the three checklist assets lack a closing related section: their tails carry link lists under a related heading, so the omission is specific to `pr-state-dedup.md`. (iteration 5)
- Looking for adjacent bold labels in the review references: the packet uses bullets and tables, so the class is absent here. (iteration 5)
- Treating `quick-reference.md`'s `### Usage` heading as a template violation on its own: the deeper defect is the incomplete table, not the heading name. (iteration 5)
- Treating `review-core.md` §9's long Python resolver as misplaced: it is an executable contract the section names, not unrelated prose. (iteration 5)
- A file-by-file read of all 45 skilled references: the boilerplate and heading signals are dense enough to characterize the family, and reading every rule body would not change the structural verdict. (iteration 6)
- Treating the checklist assets as boilerplate: their Purpose paragraphs are specific (`This split checklist protects DTO, error, panic, unsafe-code ... boundaries`), so the boilerplate is confined to the references. (iteration 6)
- Treating the repeated `### Scope`, `### Exempted Standards` and `### What Still Applies` headings in `security-testing-and-exemptions.md` as duplication: the repeat is deliberate parallel structure for two exemption tiers, and both instances carry distinct content. (iteration 6)
- Treating the same `**Evidence**:` path in `overview-modules-and-docs.md:137` and `:155` as a duplicate paragraph: two different rules cite the same implementation file, which is legitimate shared evidence. (iteration 6)
- "Frontmatter validation catches these files": all ten frontmatter fields are present in the tested files, so the frontmatter path has nothing to report. (iteration 7)
- "The citation-drift advisory would catch it": that advisory checks file-and-line citations and never changes the exit code; it has no URL, adjacency or ordering check. (iteration 7)
- "The validator is disabled for these paths": the explicit `--type reference` run returned a real verdict, not a skip, and `valid: true` came from `blocking_errors == []`. (iteration 7)
- Looking for a hidden link checker under a different rule id: the `reference` rule block has no link or URL key, and the orchestration calls no link function. (iteration 7)
- A cross-file "same purpose sentence" rule as blocking: the rust boilerplate differs by topic word and would need fuzzy matching, which is too imprecise for a blocking gate. (iteration 8)
- A validator rule that rejects every bold-label paragraph: separate label paragraphs are legitimate; only adjacency is a rendering defect. (iteration 8)
- A validator rule that rejects every raw URL: fenced command examples and generated reports can carry them; only unfenced, unlinked prose URLs are the defect. (iteration 8)
- Trying to make "reader-task order" fully mechanical: no static analysis can know the reader's task; monotonic ids and related-last are the only defensible proxies. (iteration 8)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Audit corpus: 6 SKILL.md, 6 ROUTER.md, ~70 reference files, ~25 asset/checklist files under `.skilled/skills/sk-code/`.
- Baseline templates: `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` and `skill-asset-template.md`.
- Validator: `.skilled/skills/sk-doc/scripts/validate_document.py`.
- A mechanical structural scanner is staged under the lineage `.executor-state/` directory to find candidate defects with line numbers; every candidate still needs a manual read before it becomes a finding.

### Bounded Context Snapshot
- Source pointers: `sk-code/references/*`, `sk-code/*/references/*`, `sk-code/*/assets/*`, `sk-code/SKILL.md`, `sk-code/*/SKILL.md`, `sk-code/ROUTER.md`, `sk-code/*/ROUTER.md`.
- Reuse candidates: sk-doc templates as the normative baseline; `validate_document.py` as the coverage subject.
- Integration points: template guidance, `sk-create-skill` scripts, validator checks.
- Constraints: read-only outside the lineage; every finding needs a file:line citation.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05 (telemetry only; stopPolicy is max-iterations)
- Per-iteration budget: 24 tool calls, 20 minutes
- Progressive synthesis: false
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause` inside the lineage artifact directory
- Started: 2026-11-03T21:45:56Z
