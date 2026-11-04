# Iteration 7: templates, authoring path and validator

## Focus

Trace the reference and asset templates, sk-create-skill authoring and completion guidance, package validation, and `validate_document.py` against the pre-fix `web-cascade-and-selectors.md` supplied in the request. This is static source inspection; the validator was not rerun.

## Actions Taken

- Compared the reference and asset templates' required overview shapes and GOOD examples (`.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:86-101`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174-192`).
- Traced required-section matching and the validation pipeline (`.skilled/skills/sk-doc/shared/assets/template-rules.json:319-323`; `.skilled/skills/sk-doc/scripts/validate_document.py:899-915,2008-2029`).
- Followed the create-skill completion gate, package checks, and content-review guidance (`.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:313-360`; `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:751-810,1472-1478`; `.skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:117-125`).
- Compared those rules with the pre-fix CSS reference at commit `cd00629166` (`.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:19-60`).

## Findings

1. The reference validator accepts a compound OVERVIEW heading by fuzzy word containment and never requires an overview body, so the pre-fix CSS file's first rule subsection can stand in for the overview. The heading at `cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:19` is followed immediately by a CS1 rule subsection at `cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:21`. The reference rule requires only an `overview` heading (`.skilled/skills/sk-doc/shared/assets/template-rules.json:319-323`), and `validate_required_sections` accepts required words anywhere in the normalized heading (`.skilled/skills/sk-doc/scripts/validate_document.py:899-915`). Require the canonical numbered `OVERVIEW` heading and a minimal orientation body; both are mechanical checks.

2. `validate_document.py` has no Markdown-rendering lint for joined bold-label paragraphs, bare URLs, duplicate labels, or accidental Setext headings. The pre-fix CSS reference has adjacent unbulleted bold labels at `cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:23-29`, raw URLs at lines 28, 37, and 46 of that file, and a repeated `Support` label at lines 58-60. The validation pipeline calls TOC, H2, general-structure, required-section, selected table, and frontmatter checks (`.skilled/skills/sk-doc/scripts/validate_document.py:2008-2029`); general structure checks dividers before numbered uppercase H2s plus TOC and anchor rules (`.skilled/skills/sk-doc/scripts/validate_document.py:667-729`). The supplied report that this file returned VALID with 0 issues is consistent with this code path. Add a Markdown AST lint outside frontmatter and fences for label paragraphs, raw URLs, repeated labels, and forbidden Setext headings; these are mechanical when the document contract is explicit.

3. Both resource templates warn against duplicating intro and Overview content, but their GOOD examples paraphrase the same central subject: the reference example repeats commit workflows and filtering in Purpose (`.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:86-101`), and the asset example repeats commit-message templates and formats (`.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174-192`). This is a plausible contributor to repeated inventories found in sk-code references; authoring provenance would confirm whether it caused them. Revise the examples so the hook gives a distinct reader benefit and Purpose adds scope or outcome. Exact repeats are mechanical; semantic overlap should be advisory or human-reviewed.

4. The documented completion path does not make content review a blocking package check. The reference workflow points authors to the templates, then calls `package_skill.py --check --strict` authoritative and lists metadata, required SKILL.md sections, and paths as hard failures (`.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:313-360`). The package script validates resource-document frontmatter and version as warnings (`.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:751-810,1472-1478`), while separate comprehensive-validation guidance assigns content quality and style to AI judgment (`.skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:117-125`). Require a content review for each changed reference/asset covering intro-to-Purpose duplication, reader-task order, and rendered Markdown. Ordering and semantic duplication need human judgment; raw links, section shape, and Markdown AST defects can be scripted.

## Questions Answered

- **Why did the templates, authoring guidance and validator miss each defect class?** The required-section rule accepts a compound heading without an overview body; the validator has no Markdown AST/rendering pass for the cited body defects; and the package completion gate emphasizes structural checks while content review remains qualitative (Findings 1, 2, and 4).
- **Which fixes belong in templates, guidance or validation, and which checks can run mechanically?** Canonical overview shape, orientation presence, raw links, label paragraphs, duplicate labels, and forbidden Setext syntax can be checked mechanically when specified. Template-example edits and an explicit content-review step address semantic duplication and reader-task order, which need human judgment (Findings 1-4).

## Questions Remaining

- A controlled run against the pre-fix snapshot would confirm the task-reported VALID/0 validator result; this pass traced the static code path but did not rerun the validator.
- Template-example overlap is a plausible contributor to repeated authored content, but authoring provenance is needed to establish causation.
- Section and item ordering still needs a reviewer to judge the reader's workflow unless each document family defines a canonical sequence.

## Recommended Next Focus

The configured maximum of seven iterations has been reached. Synthesize the findings and keep the historical-validator result and template-causality limits explicit.

## Workflow Boundary

The YAML graph-convergence step persists a packet-level snapshot (`.skilled/commands/deep/assets/deep-research-auto.yaml:757-760`), beyond this lineage's authorized write directory; it was skipped. The configured max-iterations policy makes convergence signals telemetry until the cap (`.skilled/commands/deep/assets/deep-research-auto.yaml:776`).
