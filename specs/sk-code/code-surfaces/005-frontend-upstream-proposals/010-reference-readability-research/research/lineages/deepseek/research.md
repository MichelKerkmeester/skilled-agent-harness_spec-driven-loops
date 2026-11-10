# Reference and Asset Readability Audit — sk-code Skill Family

Detached research lineage `deepseek`, session `fanout-deepseek-1793742315296-80sid6`, eight iterations. Every claim below is anchored to a file and line; where a claim rests on inference, the inference is marked.

## 1. EXECUTIVE SUMMARY

The sk-code reference and asset corpus is structurally sound at the level the validator measures, and visibly defective at the level readers experience. A 121-file fence-aware scan found no adjacent bold-label paragraphs and no bare URLs at HEAD, because the frontend restructure repaired the one file the brief names. The same scan and a family-by-family read found eight live structural defects the validator cannot see: an `OVERVIEW AND CLI` section with no overview, related sections that are missing, split or misplaced in four files, a mixed numbered/unnumbered heading scheme, an id sequence that runs P10 before P8, a missing I8, a 408-character rule paragraph, and a duplicated support sentence. The validator returns `valid: true, total_issues: 0` for all of them, and it returned the same verdict for the pre-fix `web-cascade-and-selectors.md` at `cd00629166`, which is confirmed by direct execution rather than inference. The cause is not a missing rule or two; it is that `validate_document.py` checks section names, numbered H2 shape, dividers, required names and frontmatter, and checks nothing about the body a reader renders. The fix is a small set of high-precision rendering-shape checks plus template corrections that stop teaching the defects.

## 2. RESEARCH QUESTION AND SCOPE

The question: audit every reference and asset under `.skilled/skills/sk-code/` for readability, structure, layout and section/item order against the sk-doc reference and asset templates; find the enumerated rendering defects; explain why the templates, authoring guidance and validator let them pass; and propose changes, saying which are mechanically checkable.

Scope: 6 `SKILL.md`, 6 `ROUTER.md`, 9 hub `shared/` documents, and all Markdown under each packet's `references/` and `assets/` — 121 files. `manual-testing-playbook/`, `changelog/`, `benchmark/` and `feature-catalog/` are out of scope: they are not references or assets and follow their own contracts.

## 3. METHOD

1. Read the sk-doc reference and asset templates to fix the normative contract.
2. Built a fence-aware structural scanner over all 121 files (`.executor-state/scan.cjs`) covering headings, bold-label adjacency, setext hazards, overview bodies, duplicate headings and paragraphs, bare URLs, related placement and heading numbering.
3. Read each family's references and skill bodies, confirming candidates by hand and discarding false positives.
4. Used the pre-fix `web-cascade-and-selectors.md` at `cd00629166` as the known-bad control and the current HEAD file as the remediation control.
5. Ran `validate_document.py` on the control and on current defective files to test the validator directly.
6. Traced each validator check to the function and rule-data block that owns it.

## 4. CORPUS AND BASELINE

- 121 scoped Markdown files: 115 carry an `OVERVIEW` section, 6 `SKILL.md` files follow the skill template instead.
- Normative baseline: `skill-reference-template.md` (1-2 sentence intro at 58; `### Purpose` 100, `### When to Use` 103, `### Core Principle` 108; six frontmatter fields at 84) and `skill-asset-template.md` (related "must be last" at 166).
- Current HEAD shape: 0 adjacent bold-label pairs, 0 setext hazards, 0 bare URLs; 3 related-placement breaks, 4 duplicate headings (2 deliberate parallel structures), 2 duplicate paragraphs, 1 repeated label, 1 rule-id inversion, 1 numbering gap.

## 5. THE TEMPLATE CONTRACT — AND ITS OWN DEFECT

The template states the contract the corpus should meet: a 1-2 sentence intro with no subsections, an overview with Purpose/When to Use/Core Principle, six frontmatter fields, and a related section last. It then breaks its own rule: `### When to Create References` in Section 1 duplicates `## 3. WHEN TO CREATE REFERENCE FILES` in Section 3. The document that forbids duplication models it, which sets the tolerance level for every file it governs. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:36] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:182]

The asset and reference templates also disagree with the rule data: the asset template says related resources "must be last", the reference template says nothing, and `template-rules.json` lists `related_resources` as recommended only. Three normative sources, three different answers. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:166] [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:323]

## 6. DEFECT TAXONOMY

| Class | Definition | Current status at HEAD |
|---|---|---|
| D1 Adjacent bold labels | Two `**Label**` lines with no blank line; Markdown joins them into one paragraph | Fixed in the frontend control, absent at HEAD |
| D2 Setext hazard | Prose directly above `---`; renders as a setext H2 | Absent at HEAD, encouraged by the divider rule |
| D3 Empty overview | `OVERVIEW` or `OVERVIEW AND <topic>` with no overview prose or Purpose/When-to-Use | Live: `runner-contract.md` |
| D4 Related placement | Missing, split or non-last related section | Live in four files |
| D5 Duplicated content | Repeated sentence, label or boilerplate purpose | Live: one sentence, one label, 14-file boilerplate |
| D6 Bare URLs | Unlinked `http(s)` in prose | Fixed in the frontend control, absent at HEAD |
| D7 Authoring-history order | Ids or sections ordered by insertion, not reader task | Live: P10 before P8, I8 gap, 2b sections |
| D8 Wall of text | Single paragraph over ~400 characters hiding structure | Live: 1,296-1,657 chars in `runner-contract.md` |

## 7. FAMILY FINDINGS: HUB AND CI

**Hub.** `ROUTER.md` places `## 8. RELATED RESOURCES` at 218 before `## 9. MACHINE-READABLE ROUTER` (227), `## 10. HOW TO READ THIS` (441) and `## 11. MACHINE ROUTER` (450); two sections are named some form of "machine router", and the reader's next-step section interrupts them. [SOURCE: .skilled/skills/sk-code/ROUTER.md:218] [SOURCE: .skilled/skills/sk-code/ROUTER.md:227] [SOURCE: .skilled/skills/sk-code/ROUTER.md:450]

**Hub shared.** `stack-detection.md` omits Purpose and When to Use and opens with Core Principle and a table. The four sibling workflow references use three different OVERVIEW orders: Purpose/When/Core (`phase-detection.md`), Purpose/Core/When (`workflow-implement.md`), Purpose/Iron Law/When (`workflow-verify.md`). [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:20] [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:22]

**CI.** None of the four references carries the Purpose/When-to-Use pair, and the packet uses three overview shapes: H3 Purpose plus custom H3s (`ci-workflow-standards.md`), plain paragraphs (`job-shape-rules.md`, `trigger-and-filter-rules.md`), and H3 `The Profile`/`Profile Keys` (`protected-set.md`). `job-shape-rules.md` leaks `status: landed` as rendered prose at line 91. `ROUTER.md` repeats the four-reference order in its overview (23) and intent model (33). `SKILL.md` inserts `## 2b. SMART ROUTING` at 55. [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:91] [SOURCE: .skilled/skills/sk-code/sk-code-ci/ROUTER.md:23] [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:55]

## 8. FAMILY FINDINGS: FRONTEND

The pre-fix control is exactly the defect set the brief names: six adjacent bold-label lines per rule (23-28), `## 1. OVERVIEW AND CASCADE AND SPECIFICITY` at 19 with no overview, nine bare `**See also.**` URLs (28, 37, 46, 60, 69, 82, 91, 100, 109), and a duplicated `**Support.**` line at 58-59. HEAD repairs all four by converting labels to bullets and URLs to named links. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:19 (at cd00629166)] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:28 (at cd00629166)]

The repair was per-file, not enforced. At HEAD, `web-performance-and-loading.md` still repeats the entire `srcset` support sentence at 130, and orders P10 (111) before P8 (124) and P9 (133). `web-internationalization.md` jumps from I7 (105) to I9 (118) with no I8. `figma-to-code.md` opens with Core Principle (21) before Purpose (25), the only web-family file to do so. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:130] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:111] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md:118] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:21]

## 9. FAMILY FINDINGS: QUALITY AND REVIEW

**Quality.** `runner-contract.md` opens with `## 1. OVERVIEW AND CLI` and goes straight to a code fence, so the overview has no overview; its prose lines reach 1,296 (53), 970 (103), 1,657 (113) and 815 (118) characters. It and `quality-config.md` end without a related section, while `code-style-guide.md` has one. `quality-config.md`'s overview is one 121-word paragraph. [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:20] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:113] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/quality-config.md:18]

**Review.** `SKILL.md` has two link inventories (`## 5. REFERENCES` 262, `## 8. RELATED RESOURCES` 324) and the related section precedes `## 9. PR-STATE EFFICIENCY GATES` (342). `pr-state-dedup.md` numbers only its overview, then uses seven unnumbered H2 peers, and ends without a related section. `quick-reference.md` lists five checklists and omits `fix-completeness-checklist.md`, which exists and is listed in `SKILL.md` §5. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:324] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:342] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:17] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/quick-reference.md:44]

## 10. FAMILY FINDINGS: SKILLED

Fourteen rust split references repeat the same content-free purpose sentence and the same three When-to-Use bullets; only `rust/style-guide/overview-and-file-header.md` states a specific purpose and specific triggers. `SKILL.md` repeats the `2b` numbering at 110 and welds three concepts into one H2 at 148 (`ASSETS AND OTHER SURFACE AREAS — ON-DEMAND`). `alignment-verification-automation.md` puts related at 139 before section 6 at 148. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/naming-conventions.md:22] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:110] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:148] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:139]

## 11. RECOMMENDATIONS

### Template changes

1. Merge the reference template's duplicated `When to Create References` content into one section.
2. Add three explicit layout rules: a bold label is a list item or is followed by a blank line and body; a thematic break always has a blank line above it; an overview may not be titled `OVERVIEW AND <topic>`.
3. Add the "related resources must be last" clause to the reference template as well as the asset template, and make the rule data require it.
4. Reject letter suffixes in the skill template's numbered-H2 rule.

### Guidance changes

5. Add a render pass to the authoring checklist: read the file as rendered Markdown and check label joining and setext headings.
6. Add a reader-task ordering step: assign rule ids at placement time and keep them monotonic; do not append new ids to a section because that is where the author was working.

### Validator changes

| Rule id | Check | Level | Precision evidence |
|---|---|---|---|
| `render_bold_label_join` | Two consecutive non-list bold-label lines outside fences | blocking | 0 current hits, 9 pre-fix blocks |
| `render_setext_hazard` | Non-blank non-heading line directly above `---` | blocking | 0 current hits, control shows the layout |
| `render_overview_empty` | `OVERVIEW` body under 40 chars with no Purpose/When subsection; `OVERVIEW AND` flagged | blocking | 1 true positive at HEAD |
| `render_related_last` | Related section missing or followed by a same/higher heading | blocking | 3 placement + 2 omission true positives |
| `render_bare_url` | Unfenced `http(s)` not in a link or autolink | warning | 0 current, 9 pre-fix |
| `render_duplicate_block` | Identical paragraph or repeated bold label in one section | warning | 2 true positives, semantic boilerplate needs review |
| `render_numbering` | Letter-suffixed or non-sequential numbered H2 | blocking | 2 true positives (`2b` twice) |
| `render_rule_id_order` | Non-monotonic `### <PREFIX><n>.` ids | warning | 1 inversion, 1 gap |

Wire the checks into `validate_document.py` at the orchestration block (2008-2029) and give `reference`/`asset` rule ids in `template-rules.json`. Make `render_related_last` required only after the template conflict is resolved.

**Not mechanically checkable:** semantic reader-task order, misplaced content beyond heading position, and whether an overview actually orients a reader. These stay in human review.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat `firstH2NotOverview` on `SKILL.md` as a template violation | Skill bodies follow a different template | `skill-md-template.md` | 1 |
| Treat long prose lines as rendering defects | They wrap in rendered Markdown; they are a style signal, not a defect | corpus scan | 1 |
| Treat the fenced `## Rule overrides` heading as stray | It sits inside a fenced example | `rule-overrides.md:50` | 1 |
| Reject every bold-label paragraph | Separate label paragraphs are legitimate; only adjacency renders wrong | template GOOD example | 8 |
| Reject every raw URL | Fenced command examples can carry raw URLs | pre-fix control, fenced examples | 8 |
| A blocking cross-file "same purpose sentence" rule | Fuzzy matching is too imprecise for a gate | rust boilerplate | 8 |
| File-by-file read of all 45 skilled references | Boilerplate density characterizes the family; rule bodies do not change the verdict | count-based scan | 6 |
| Trusting the fixture-style `recommendedSections` as enforced | It is read only inside the router branch | `validate_document.py:928` | 7 |

## Divergence Map

- Saturated directions: the scanner's original narrow bold-label regex (bare labels only) — replaced by the label-with-inline-text rule; no pivots were taken.
- Pivots: none recorded.
- Failed pivots: none.
- Audited overrides: none.
- Remaining frontier: a labelled precision corpus for the proposed rules; a full read of the typescript/python rule bodies; a batch duplicate-purpose detector.

## 12. OPEN QUESTIONS

- What is the measured false-positive rate of `render_bold_label_join` and `render_bare_url` on a labelled corpus? The current estimate is directional only.
- Should related resources be mandatory for every reference, or only for entry-point references? The templates disagree; the corpus splits 2 missing / 3 present.
- Do the typescript and python split references repeat the same boilerplate as the rust set? The count covered the whole reference tree but line-level citations sampled rust.
- Does the skill template allow a long capability intro before §1? The skill template's tagline line is less strict than the reference template's 1-2 sentence rule.
- Would renumbering rule ids to reader order break the external consumers that cite `P10`, `I7` and `CS4` by id?

## 13. CONFIDENCE AND LIMITATIONS

- Confirmed by execution: the pre-fix validator verdict; the four current files' verdicts; the corpus-wide counts; every cited line.
- Inferred: the precision estimates (from one control and the current corpus, not a labelled set); the claim that the boilerplate extends to typescript/python at the same rate (count only).
- Not covered: rule-body technical accuracy, manual-testing-playbook and changelog prose, non-Markdown assets (YAML/JSON scaffolds were checked for existence and ordering only).
- Conflict with the workflow: resource-map emission and spec.md write-back target paths outside the lineage write authority, so both were skipped. The lineage artifacts are self-contained; the parent workflow can emit the resource map from the deltas.

## 14. EVIDENCE INDEX

- `iterations/iteration-001.md` — template contract, hub root, shared references (5 findings)
- `iterations/iteration-002.md` — ci family (4 findings)
- `iterations/iteration-003.md` — frontend family and pre-fix control (8 findings)
- `iterations/iteration-004.md` — quality family (4 findings)
- `iterations/iteration-005.md` — review family (4 findings)
- `iterations/iteration-006.md` — skilled family (5 findings)
- `iterations/iteration-007.md` — validator trace (6 findings)
- `iterations/iteration-008.md` — remediation proposals (9 findings)
- `deltas/iter-001.jsonl` … `deltas/iter-008.jsonl` — 45 structured findings

## 15. REFERENCES

- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md`
- `.skilled/skills/sk-doc/scripts/validate_document.py`
- `.skilled/skills/sk-doc/shared/assets/template-rules.json`
- `.skilled/skills/sk-code/**` (121 scoped files, cited per finding)

## 16. CONVERGENCE REPORT

- Stop reason: `maxIterationsReached`
- Total iterations: 8 / 8
- Questions answered: 8 / 8
- Remaining questions: 5 (see Section 12)
- Last three ratios: 0.70 (iter 6), 0.90 (iter 7), 0.85 (iter 8)
- Convergence threshold: 0.05 — telemetry only; `stopPolicy: max-iterations` governed the stop
- Divergence summary: no divergent pivots recorded.

## 17. APPENDIX: REPRODUCTION

```bash
node specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/research/lineages/deepseek/.executor-state/scan.cjs
JEV_FEATURES=0 python3 -B .skilled/skills/sk-doc/scripts/validate_document.py \
  specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/research/lineages/deepseek/.executor-state/prefix-web-cascade.md \
  --type reference --json
```

The first command reproduces the corpus counts; the second reproduces the `valid: true, total_issues: 0` verdict on the pre-fix control.
