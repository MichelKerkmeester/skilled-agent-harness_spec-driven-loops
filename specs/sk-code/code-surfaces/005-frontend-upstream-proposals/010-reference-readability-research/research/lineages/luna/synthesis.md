# Luna Synthesis: sk-code Reference Readability

## 1. Overview

This report consolidates the seven-iteration audit of the requested sk-code surfaces and the sk-doc authoring/validation path. It preserves file-and-line evidence, separates rendering and structure checks from editorial judgments, and records the lineage's write-boundary decisions.

## 2. Executive Summary

The reducer has 15 findings from seven completed iterations. The recurring issues are repeated intro/Purpose content, overview headings that do not actually orient the reader, and procedural information appearing after the reader needs it. The strongest validator gap is concrete: the pre-fix CSS reference's compound `OVERVIEW AND ...` heading satisfies a fuzzy “overview” name check even though its next line is already a rule subsection. Body-level Markdown rendering is not checked by `validate_document.py`.

The most useful changes are to enforce a canonical overview structure, add a Markdown-AST lint for rendering traps and bare URLs, correct the reference/asset templates' overlapping “GOOD” examples, and make a short content/readability review part of the completion path. A parser can check syntax and heading shape. It cannot decide whether a section is in the best order for a task without a declared workflow model.

## 3. Scope and Method

The review covered the sk-code hub and shared tier, sk-code-ci, sk-code-frontend, sk-code-quality, sk-code-review, sk-code-skilled, their SKILL.md and ROUTER.md files, and the sk-create-skill reference/asset templates, guidance and scripts. The initial inventory held 99 Markdown references/assets; the sk-code-skilled Markdown structural pass covered 69 files. Each surface pass enumerated its resources, checked the requested structural/rendering patterns, and closely read files where those checks or the reader-flow review indicated likely issues.

The pre-fix `web-cascade-and-selectors.md` was read from commit `cd00629166`; its reported `VALID` / `0 issues` result was supplied in the task and was not rerun. No repo tests, validator commands, package commands, or source edits were made.

## 4. Coverage and Rendering Scan

Confirmed findings include repeated or misplaced content, an `OVERVIEW AND ...` section without overview prose, and a pre-fix Markdown paragraph formed by adjacent bold labels. No confirmed Setext-heading rendering defect was found in the current sk-code scans. Bare URLs were absent from the scanned current surfaces except in the supplied pre-fix CSS reference, where “See also” uses raw URLs. Bold-label matches inside list items were excluded as false positives because list markers keep each item distinct.

## 5. Hub and Shared Tier

1. The hub's WHEN TO USE section carries navigation tables, a repeated surface list, and implement/debug/verify workflow instructions. The sk-create-skill contract reserves that section for activation triggers, use cases, and when-not-to-use boundaries, leaving resource selection to SMART ROUTING and workflow detail to HOW IT WORKS. Evidence: `.skilled/skills/sk-code/SKILL.md:32,47,56`; `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:80-81`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:455`.

2. Four shared references place Core Principle or Iron Law before When to Use, while the sk-doc reference example orders Purpose, When to Use, then Core Principle. This is a consistent sequence mismatch, though whether every document benefits from that exact order remains an editorial choice. Evidence: `.skilled/skills/sk-code/shared/references/workflow-implement.md:22,26,30`; `.skilled/skills/sk-code/shared/references/workflow-debug.md:22,26,30`; `.skilled/skills/sk-code/shared/references/workflow-verify.md:22,26,32`; `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:23,27,31`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:100,103,108`.

## 6. sk-code-ci

1. `job-shape-rules.md` repeats its timeout, permissions, concurrency, setup, and switch inventory in the intro and Overview; `trigger-and-filter-rules.md` repeats events, path filters, rebuild commits, and exceptions in the same positions. The template says the intro is a short hook and Overview holds the detail. Evidence: `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:17,23`; `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md:16,22`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:136-145`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174-175`.

2. The CI router's overview paragraph recites trigger signals, resource paths, default resource, and no-match behavior, then the INTENT MODEL repeats signal and resource-map details. Keep the overview orienting and the intent model authoritative for the exact map. Evidence: `.skilled/skills/sk-code/sk-code-ci/ROUTER.md:23,25,33`.

## 7. sk-code-frontend

1. The frontend SKILL.md places SMART ROUTING after Surface Standards and Frontend Overrides, although standards already refer to router conditions and the earlier map does not direct the reader to ROUTER.md. The sk-create-skill template places SMART ROUTING immediately after WHEN TO USE. Evidence: `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:25,43,47,63,69,71`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:451,502`.

2. The Figma procedure presents its passes and verdict before the transport ladder that determines which passes a reader can run. Put the path choice before the procedure and verdict. Evidence: `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:88,111,122,133,137,144,159`.

The apparent P10/P8/P9 ordering in frontend practice was not counted as a defect: the changelog explains that P10 moved into the interaction section, while stable identifiers were retained. Evidence: `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.2.0.md:32-39`.

## 8. sk-code-quality

1. `runner-contract.md` calls its opening section OVERVIEW AND CLI but starts with a command synopsis and CLI tables without reader-orientation prose. Add an overview or title the section CLI. Evidence: `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:16,20,22,26`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:98-100`.

2. `quality-config.md` explains `SKIPPED_UNTRUSTED` inside the run procedure before the TRUST BOUNDARY that controls whether configured commands may execute. Move the trust contract before the procedure or surface a direct link at the first state-machine mention. Evidence: `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md:129,132,141,173,180`.

## 9. sk-code-review

1. `fix-completeness-checklist.md` repeats its producer/consumer, algorithm, matrix, and hostile-runtime inventory in its intro and Purpose. The asset template says the intro should be a hook and Overview should add details. Evidence: `.skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:17,19,23`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174-175`.

2. PR-state efficiency gates that can skip redundant analysis or a full review appear in section 9, after scope, analysis, output, references, and integration. Put skip decisions before the review phases they can bypass. Evidence: `.skilled/skills/sk-code/sk-code-review/SKILL.md:63,97,132,324,342,346,363,372,397,404`.

## 10. sk-code-skilled

Three quality references repeat the topic inventory in the post-title hook and Overview Purpose: TypeScript `overview-and-type-system.md:16,24`, JavaScript `overview-modules-and-docs.md:16,24`, and Shell `validation-security-and-shellcheck.md:16,24`. Keep the hook concise and use Purpose for the reader outcome. The reference template marks duplicate intro/Overview content as bad structure and separates summary from details. Evidence: `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md:16,24`; `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/overview-modules-and-docs.md:16,24`; `.skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md:16,24`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:112-145`.

## 11. Templates, Guidance, and Validator Root Causes

1. The pre-fix CSS reference has `## 1. OVERVIEW AND CASCADE AND SPECIFICITY` at `cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:19`, immediately followed by a CS1 rule subsection at `cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:21`. Reference rules require only the word `overview` (`.skilled/skills/sk-doc/shared/assets/template-rules.json:319-323`); `validate_required_sections` accepts a heading when all required words occur anywhere in its name (`.skilled/skills/sk-doc/scripts/validate_document.py:899-915`). No overview body is required. Enforce the canonical numbered OVERVIEW heading and require a minimal orientation body; both are mechanical.

2. `validate_document.py` has no Markdown-rendering pass for the pre-fix file's unbulleted bold-label paragraph (`cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:23-29`), raw URLs (`cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:28,37,46`), or duplicate Support label (`cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:58-60`). Its pipeline calls TOC, H2, general-structure, required-section, selected table, and frontmatter checks (`.skilled/skills/sk-doc/scripts/validate_document.py:2008-2029`); the general-structure check covers dividers, TOC, and anchor comments (`.skilled/skills/sk-doc/scripts/validate_document.py:667-729`). This makes the task-reported VALID/0 result plausible from static source tracing. Add an AST lint outside frontmatter and fences for label paragraphs, raw URLs, repeated labels, and forbidden Setext headings. These are mechanical checks when the document contract is explicit.

3. The reference and asset templates explicitly say not to duplicate intro and Overview content, but their GOOD examples paraphrase the same central subject: the reference example repeats commit workflows/filtering in its Purpose, and the asset example repeats commit-message templates/formats. This is a plausible contributor to the repeated intros seen in sk-code-ci, sk-code-review, and sk-code-skilled, not proven causation; authoring provenance would confirm it. Revise the examples to give the hook a distinct reader benefit and Purpose a separate scope or outcome. Exact repeats are machine-checkable; semantic overlap should be advisory or human-reviewed. Evidence: `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:86-87,92-101`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174-175,180-192`.

4. The authoring guide calls `package_skill.py --check --strict` the completion gate and describes hard failures for metadata, required SKILL.md sections, and generated paths (`.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:313-329,341-360`). The package script's resource-doc check validates reference/asset frontmatter and versions as warnings (`.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:751-810,1472-1478`). Content-quality assessment is described separately as AI judgment (`.skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md:117-125`). Require a short content review for each changed reference/asset covering intro-to-purpose duplication, reader-task order, and rendered Markdown. Structural/render checks can be scripted; task order and semantic duplication need judgment.

## Eliminated Alternatives

| Candidate | Why it was not treated as a defect | Evidence |
|---|---|---|
| Consecutive bold-label scans in review and skilled files | Each candidate was a Markdown list item; list markers render separate items. | `.skilled/skills/sk-code/sk-code-review/assets/removal-plan.md` and `quick-reference.md` inspected in iteration 5; sk-code-skilled structural pass in iteration 6. |
| Two lines directly before `---` in sk-code-skilled | Each preceding line was a numbered citation item, so the dash line was a thematic break, not a Setext underline. | `.skilled/skills/sk-code/sk-code-skilled/references/python/quality-standards.md:443-444`; `.skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md:249-250`. |
| Frontend rule identifiers appearing out of numeric order | The changelog documents the move and stable identifiers; sorting by number would contradict the task grouping. | `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.2.0.md:32-39`. |
| Repeated shared-reference paths in the skilled hub map | They are cross-listed under a secondary authoring/validation index as well as the shared tier; no broken or ambiguous target was confirmed. | `.skilled/skills/sk-code/sk-code-skilled/SKILL.md:80-106`. |
| A setext or bare-URL defect across all current sk-code areas | No other confirmed occurrence was found in the source scans; the known pre-fix CSS file does contain bare URLs. | Per-surface scan notes in iterations 1-6; pre-fix URL examples at `cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:28,37,46`. |

## Divergence Map

The review broadened by requested surface: hub/shared, CI, frontend, quality, review, skilled, then template/validator root causes. No research pivots were recorded. The max-iteration cap controlled completion; flat novelty telemetry was not used to stop early.

## 12. Open Questions

- The reduced strategy still carries five imported key questions unchecked. This report answers them substantively, but the gateway-projected state did not retain the iteration `answeredQuestions` fields; the closeout count therefore remains 0/5 unless a later workflow reconciles those fields.
- The template examples' overlap is a plausible contributor to repeated content, but there is no authoring history proving that authors followed those examples.
- The pre-fix validator result was not rerun. Static inspection explains a path to VALID/0; a controlled reproduction would confirm the behavior.
- No specific Setext defect was confirmed in the current sk-code documents; the proposed parser check is preventive.

## 13. Mechanical Check Plan

| Defect class | Suggested check | Mechanical? |
|---|---|---|
| Compound or missing OVERVIEW | Parse Markdown headings; require canonical `## N. OVERVIEW` for references/assets and a non-empty orientation block (for example, a Purpose subsection or opening overview paragraph). | Yes, after defining the accepted shape. |
| Consecutive bold labels joined into one paragraph | Parse outside frontmatter/fences and flag adjacent strong-labeled lines in one paragraph when they are not list items. | Yes, with AST. |
| Text line plus `---` interpreted as Setext | Parse heading node style; flag Setext headings in document types that require ATX sections and thematic-break dividers. | Yes, with AST and an explicit contract. |
| Bare URLs | Flag raw URL/autolink nodes outside code and frontmatter; suggest a descriptive Markdown link label. | Yes. |
| Duplicate labels such as Support repeated in one item | Flag repeated label keys in the same rule block. | Yes for repeated keys; semantic duplication across paragraphs remains advisory. |
| Intro/Purpose repetition | Compare normalized exact text; use similarity only as a review warning, not a blocking verdict. | Exact repeats: yes. Semantic overlap: advisory. |
| Sections or items ordered by authoring history | Checklist asks whether each section precedes the decision/action it governs and whether lists follow the reader path. | Human judgment unless the workflow has a declared canonical sequence. |

## 14. Template Changes

- Keep the canonical opening shape visible in both templates: short hook, exact OVERVIEW heading, orientation before topic mechanics, and examples with distinct hook and Purpose content.
- In reference examples, model labeled rule facts as bullet items or separately spaced blocks, not adjacent unbulleted bold labels.
- Use descriptive Markdown links in “See also” examples; state that raw URLs are not the authored presentation form.
- Make `---` examples unambiguous with blank-line spacing and say that thematic breaks must not double as Setext underlines.
- Add a short task-order example: prerequisites/tool choice, action, validation, failure handling, then related resources, with domain-specific deviations documented.

## 15. Authoring and Validation Changes

1. Add a reference/asset content checklist to the create-skill workflow: distinct intro and Purpose, overview before domain rules, governing trust/transport/skip decisions before the steps they constrain, and lists ordered by reader action.
2. Add the AST lint to `validate_document.py` or a focused companion check. Cover links, paragraphs, heading syntax, and label duplication; exclude fenced code/frontmatter to avoid false positives.
3. Keep semantic findings advisory: exact duplicate text may fail, but similarity and task-order concerns should prompt review rather than auto-fail.
4. Make the qualitative content review a named completion step for resource-doc edits; the current package gate is structural/frontmatter-oriented and cannot establish readability on its own.
5. Add regression fixtures from the pre-fix CSS example and the intro/Purpose examples, plus positive fixtures for bulleted labels, fenced examples, raw URLs in code, and legitimate task ordering. This research did not run or add those tests.

## 16. Evidence, Limits, and Workflow Boundary

The pass is read-only source research. Current line citations refer to the checkout; pre-fix citations name commit `cd00629166`. The causal link between sample-example overlap and authored duplication is explicitly an inference. No validator reproduction or project tests were run.

The workflow's graph-convergence step and synthesis/resource-map/spec-writeback/save steps can write to the packet folder, resource-map path, `/tmp`, or canonical continuity documents. The dispatch binds this lineage as the only write surface. Graph convergence was skipped and recorded in each iteration; synthesis was written here as `synthesis.md`. Resource-map emission, packet `research/research.md` writeback, spec findings writeback/validation, and continuity save were not performed because their targets fall outside this lineage. The configured cap remains the terminal reason.

The final artifact audit found missing route-proof fields in delta rows 2–7 and invalid asset-template paths in some citations. I repaired the delta metadata and citations and reran the reducer after each route-proof repair; every reducer pass retained 7 iterations with 0 corrupt rows. The verifier reads route proof from the delta because the gateway projection drops dispatch fields (`.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:415-419,467-483`). I did not append duplicate iteration records: the reducer counts each iteration row (`.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2610`), and the gateway ledger already contains seven iteration-completed events.

## 17. Source References

Primary comparison sources: `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md`; `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md`; `.skilled/skills/sk-doc/shared/assets/template-rules.json`; `.skilled/skills/sk-doc/scripts/validate_document.py`; `.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md`; `.skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md`; `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`.

Surface evidence is cited inline in Sections 5-11. The complete per-iteration evidence and ruled-out scans remain in `iterations/iteration-001.md` through `iteration-007.md` and `deltas/iter-001.jsonl` through `iter-007.jsonl`.
