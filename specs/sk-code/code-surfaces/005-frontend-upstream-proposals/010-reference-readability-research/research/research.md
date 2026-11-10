# Reference Readability Research: Final Synthesis

Synthesis of the DeepSeek V4.1 Flash lineage (8 iterations) and the GPT-6 Luna lineage (7 iterations) over every sk-code reference and asset, plus the sk-create-skill templates, guidance and `validate_document.py` that passed them. Every finding below was re-read at HEAD `393e1ec2a9` by this synthesis. A lineage claim that did not hold is in Section 7.

---

## 1. VERDICT

sk-code has no P0 rendering defect at HEAD. Commit `819657b6e6` removed the joined bold labels, setext headings and bare URLs from the frontend, and a fence-aware scan of all 112 sk-code references, assets, `SKILL.md` and `ROUTER.md` files finds none of those three classes anywhere else. What remains is 27 structure, order and duplication defects spread over all six areas. No mode is clean. Five of them mislead a reader (P1), the rest are polish (P2).

The real gap sits upstream. The sk-create-skill templates still carry the P0 classes themselves (`skill-md-template.md:134-139` renders as a setext heading, `skill-asset-template.md:807-809` joins three bold labels), the reference template never shows a reference body, and `validate_document.py` reads no body text at all. Rerun at HEAD, the pre-fix control returns `valid: true`, `total_issues: 0`, exit 0. Ten mechanical checks would close most classes. Five of them flag the control file. The other five cannot, because the control holds no instance of their class. Section 8 records the success criterion this conflicts with.

---

## 2. HOW THIS SYNTHESIS WAS CHECKED

- **Read at HEAD.** Every `file:line` below was opened at `393e1ec2a9`. The two lineages were merged by file and line, and a disagreement was settled by the file, not by count.
- **Independent scan.** A fence-aware scanner written for this synthesis (not either lineage's `scan.cjs`) ran over the 112 sk-code files, the nine pre-fix frontend references at `cd00629166`, and 712 reference, asset, `SKILL.md` and `ROUTER.md` files across every skill. Its same-class sweeps found five instances neither lineage reported. Each is marked "synthesis" below.
- **Validator rerun.** `JEV_FEATURES=0 python3 -B .skilled/skills/sk-doc/scripts/validate_document.py <control> --type reference --json` printed `"valid": true`, `"total_issues": 0`, exit 0. The pre-fix `web-markup-and-css.md` (setext control) also printed `"valid": true`.
- **Limit.** No CommonMark renderer is installed here. The "renders wrong" claims follow the CommonMark rules: consecutive non-blank lines form one paragraph, and a `---` line directly under a paragraph line turns it into a level-2 setext heading. A render in any CommonMark viewer would confirm them.

---

## 3. FINDINGS BY MODE

Severity: **P0** renders wrong, **P1** structure or order misleads, **P2** polish. Fix: **mech** is scriptable, **auth** needs authoring. Lineage: **DS** DeepSeek, **LU** Luna, **both**, or **synthesis**.

### 3.1 Hub root and shared/

| ID | Sev | Location | Class | Fix | Lineage |
|----|-----|----------|-------|-----|---------|
| HUB-1 | P2 | `.skilled/skills/sk-code/ROUTER.md:218` | Section order | auth | DS, rebased |
| HUB-2 | P2 | `.skilled/skills/sk-code/SKILL.md:54-60` | Content in the wrong section | auth | LU |
| HUB-3 | P2 | `shared/references/workflow-implement.md:22-30`, `workflow-debug.md:22-30`, `workflow-verify.md:22-32`, `universal/code-quality-standards.md:23-31` | Overview subsection order | mech | both |
| HUB-4 | P2 | `shared/references/stack-detection.md:20-26` | Overview without orientation | auth | DS |

- **HUB-1.** §8 RELATED RESOURCES sits before §9 MACHINE-READABLE ROUTER (227) and §10 HOW TO READ THIS (441). The root router template orders MACHINE-READABLE ROUTER, HOW TO READ THIS, RELATED RESOURCES, MACHINE ROUTER (`sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md:62,132,141,148`). DeepSeek said related must be last. For a router that is wrong, because the template puts MACHINE ROUTER last. Seven lines cite §9 and follow any renumber: `ROUTER.md:49,86,452,470`, `sk-code/README.md:132,143` and `sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md:104`.
- **HUB-2.** WHEN TO USE carries the `/doctor:sk-code setup` maintenance step (54) and the implement, debug and verify doctrine (56-60). The intro (17) and §3 HOW IT WORKS (127) already state that doctrine. `sk-create-skill/SKILL.md:80-82` limits WHEN TO USE to triggers. The packet tables (34-45) are allowed by `parent-skill-hub-template.md:150-158`. The surface-count sentence (47-53) stays where it is, because line 53 makes it the target other docs point to.
- **HUB-3.** All four put Core Principle (or Iron Law) before When to Use. The same order appears in five more files (FE-3, QA-5, SK-6). The template is the root cause: it shows two orders (TPL-3).
- **HUB-4.** The OVERVIEW opens with Core Principle and a Surfaces table, with no Purpose and no When to Use.

### 3.2 sk-code-ci

| ID | Sev | Location | Class | Fix | Lineage |
|----|-----|----------|-------|-----|---------|
| CI-1 | P2 | `references/job-shape-rules.md:91` | Leaked authoring token | mech | DS |
| CI-2 | P2 | `references/job-shape-rules.md:17,23`; `references/trigger-and-filter-rules.md:16,22` | Intro restated in the overview | auth | LU |
| CI-3 | P2 | `ROUTER.md:23,33`; `SKILL.md:30-31,57` | Content in the wrong section | auth | both |
| CI-4 | P2 | `references/protected-set.md:21-23` | Overview without orientation | auth | DS |
| XS-1 | P2 | `SKILL.md:55` | Heading numbering | mech | see 3.7 |

- **CI-1.** A bare `status: landed` line sits between the §5 heading (89) and its first paragraph (93). It is the only such line in all 712 fleet docs.
- **CI-2.** Each intro lists the same parts the first overview paragraph lists again. The template warns against exactly this (`skill-reference-template.md:86-87`).
- **CI-3.** The router OVERVIEW recites every trigger string, all four reference paths and the default resource, and INTENT MODEL (33) states them again. In `SKILL.md`, the SMART ROUTING prose (57) restates the §1 triggers (30-31). The router template's OVERVIEW prompt invites this (TPL-10).
- **CI-4.** The OVERVIEW opens with the `### The Profile` mechanics and has no Purpose. The other three CI overviews orient the reader in prose or under Purpose, and they are not defects.

### 3.3 sk-code-frontend

| ID | Sev | Location | Class | Fix | Lineage |
|----|-----|----------|-------|-----|---------|
| FE-1 | P2 | `references/web-performance-and-loading.md:130`; `references/web-layout-and-sizing.md:126` | Duplicated text in one field | mech | DS (130), synthesis (126) |
| FE-2 | P1 | `references/figma-to-code.md:111,122,133,144` | Order by authoring history | auth | LU |
| FE-3 | P2 | `references/figma-to-code.md:21-29` | Overview subsection order | mech | DS |
| XS-1 | P2 | `SKILL.md:69` | Section order | mech | see 3.7 |

- **FE-1.** The `Support` field repeats a whole sentence pair: the `srcset` sentences at 130 and the `overscroll-behavior` sentences at 126. Both come from the restructure's merge of identical pre-fix `Support` lines (`cd00629166` `web-performance-and-loading.md:104-105`, `web-layout-and-sizing.md:107-108`). The merge concatenated the lines without removing the duplicate.
- **FE-2.** In §5 THE CHECK, Five Passes (111) and Verdict and Report (122) come before Figma-Side Tool Ladder (133) and Passes by Figma Transport (144). Workflow step 1 (88) already sends the reader to the ladder, and the transport decides which passes can run at all (148-151). The external anchor `#5-the-check` (`frontend-practice.md:75`) is an H2, so reordering the H3s inside §5 leaves it intact.
- **FE-3.** Core Principle (21) comes before Purpose (25). The eight sibling references open Purpose, When to Use, Boundaries.
- **Clean.** No joined labels, setext headings or bare URLs remain in any of the nine references. Rule ids match the restructure baseline.

### 3.4 sk-code-quality

| ID | Sev | Location | Class | Fix | Lineage |
|----|-----|----------|-------|-----|---------|
| QA-1 | P1 | `references/runner-contract.md:20-26` | Compound overview without orientation | auth | both |
| QA-2 | P2 | `references/runner-contract.md:53,113,182,265` | Wall of text | auth | DS (53, 113), synthesis (182, 265) |
| QA-3 | P2 | `references/quality-config.md:14-18` | Missing intro, overview without orientation | auth | DS |
| QA-4 | P2 | `references/quality-config.md:132` | Order by authoring history | mech | LU |
| QA-5 | P2 | `references/code-style-guide.md:22-30` | Overview subsection order | mech | synthesis |

- **QA-1.** `## 1. OVERVIEW AND CLI` opens with a command fence (22) and flag tables, and holds no overview. Ten places cite sections 2-8 by number, among them `sk-code-review/SKILL.md:82` (section 3), `shared/references/universal/rule-overrides.md:40` (section 5) and the code comment at `shared/scripts/lib/rule-registry.cjs:15`. The fix therefore keeps those numbers: §1 becomes `## 1. OVERVIEW` with Purpose and When to Use, and the synopsis and tables move under a `### CLI` subsection.
- **QA-2.** These are single prose paragraphs of 1,296 (53), 1,657 (113), 1,473 (182) and 1,370 (265) characters. They are the only prose paragraphs over 1,000 characters in sk-code.
- **QA-3.** The H1 goes straight to `## 1. OVERVIEW`, with no intro hook (`skill-reference-template.md:58,75`). The overview is one 121-word paragraph.
- **QA-4.** The run procedure names `SKIPPED_UNTRUSTED` for "an untrusted config" (132), four sections before §8 TRUST BOUNDARY (173-180) says what makes a config trusted. §8 is cited by number (`sk-code-quality/SKILL.md:75`, playbook `quality-gate/untrusted-config.md:191`), so the fix adds a link rather than moving the section.

### 3.5 sk-code-review

| ID | Sev | Location | Class | Fix | Lineage |
|----|-----|----------|-------|-----|---------|
| RV-1 | P1 | `SKILL.md:324,342` | Section order; order by authoring history | auth | both |
| RV-2 | P1 | `references/pr-state-dedup.md:15-99` | Heading numbering; overview without orientation | auth | DS |
| RV-3 | P1 | `references/quick-reference.md:44-52` | Incomplete index | mech | DS |
| RV-4 | P2 | `assets/fix-completeness-checklist.md:17,23` | Intro restates Purpose | auth | LU |

- **RV-1.** §8 RELATED RESOURCES (324) comes before §9 PR-STATE EFFICIENCY GATES (342). The M-1 and M-2 gates (344, 372) decide whether the review runs at all, yet Phase 1 (63-85) never points to them, and the `skill-md-template.md` scaffold ends with the related section. These cite the section by number: `SKILL.md:198,215,408,413`, `references/pr-state-dedup.md:19`, and the playbook files `intra-routing-recall/on-demand-tier.md:148`, `intra-routing-recall/pr-state.md:171`, `efficiency-and-restraint/review-depth-alias.md`, `efficiency-and-restraint/minimum-evidence-gate.md`, `efficiency-and-restraint/pr-state-content-hash-dedup.md:258` and `manual-testing-playbook.md`.
- **RV-2.** There is no intro. The OVERVIEW is one pointer sentence (19), followed by seven unnumbered H2 peers (21, 42, 59, 71, 78, 90, 94) with no dividers. No anchor links point into this file.
- **RV-3.** The SUPPORTING CHECKLISTS table lists five of the six assets. `fix-completeness-checklist.md` is missing, although `SKILL.md:272` lists it.
- **RV-4.** The intro (17) and the Purpose (23) are the same sentence.

### 3.6 sk-code-skilled

| ID | Sev | Location | Class | Fix | Lineage |
|----|-----|----------|-------|-----|---------|
| SK-1 | P2 | 14 rust references, e.g. `references/rust/style-guide/naming-conventions.md:22-28` | Boilerplate across files | auth | DS |
| SK-2 | P2 | `references/typescript/quality-standards/overview-and-type-system.md:16,24`; `references/javascript/quality-standards/overview-modules-and-docs.md:16,24`; `references/shell/quality-standards/validation-security-and-shellcheck.md:16,24` | Intro restates Purpose | auth | LU |
| SK-3 | P2 | `SKILL.md:148` | Heading welds topics | auth | DS |
| SK-4 | P2 | `references/shared/alignment-verification-automation.md:139,148` | Section order | mech | DS |
| SK-5 | P2 | `references/shell/style-guide/overview-structure-and-naming.md:170,172` | Repeated label | mech | DS |
| SK-6 | P2 | `references/shared/code-organization/overview-and-module-organization.md:22-30`, `references/shared/hooks.md:22-30`, `references/shared/universal-patterns/naming-and-commenting.md:22-30` | Overview subsection order | mech | synthesis |
| XS-1 | P2 | `SKILL.md:110` | Heading numbering | mech | see 3.7 |

- **SK-1.** All 14 files share one Purpose sentence ("Provides focused Rust guidance for <topic> in the OpenCode development environment") and the same three When to Use bullets. Only `rust/style-guide/overview-and-file-header.md:22-34` states a specific purpose and specific triggers.
- **SK-3.** The §4 heading joins ASSETS, OTHER SURFACE AREAS and ON-DEMAND with a dash. No file links to it.
- **SK-4.** §5 RELATED RESOURCES comes before §6 ALIGNMENT AUTHORITY INTERFACE. No file cites either section by number.
- **SK-5.** Two `**Evidence**:` paragraphs back one exception. This is the only adjacent repeated non-list label among the 712 fleet docs.

### 3.7 Cross-mode: the surface packet routing section

| ID | Sev | Location | Class | Fix | Lineage |
|----|-----|----------|-------|-----|---------|
| XS-1 | P2 | `sk-code-ci/SKILL.md:55`, `sk-code-skilled/SKILL.md:110`, `sk-code-frontend/SKILL.md:69` | Heading numbering; section order | mech | both |

Two surface packets number SMART ROUTING `2b`. The third puts it last, as §5, after its standards and overrides. Luna judged the frontend placement against `skill-md-template.md:451,502`, but surface packets are exempt from that template (`package_skill.py:393-397`). The defect is the inconsistency between the three, and its cause is that no sk-create-skill document gives a surface packet's section order (TPL-8). One consumer pins a heading by number: `sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs:31` splits on the literal `## 5. QUALITY CHECKLIST MAP`.

### 3.8 What is clean

- **Rendering, all modes.** Joined bold labels, setext headings and bare URLs: 0 hits in the 112 sk-code files.
- **Frontend rule ids.** P10 placed after P7, and I8 retired, are both deliberate (Section 7).
- **Assets.** The review and skilled checklist assets carry specific Purpose text. Their tails carry related lists where present.
- **No mode is clean overall.** Every one of the six areas has at least one confirmed P2 or worse.

### 3.9 sk-create-skill: the templates and guidance that let the classes ship

| ID | Sev | Location | Class | Lineage |
|----|-----|----------|-------|---------|
| TPL-1 | P0 | `assets/skill/skill-md-template.md:134-139` | Setext underline | synthesis |
| TPL-2 | P0 | `assets/skill/skill-asset-template.md:807-809,822-824,838-840`; `assets/skill/skill-md-template.md:857-858` | Joined bold labels | synthesis |
| TPL-3 | P1 | `assets/skill/skill-reference-template.md:100-108,238-241` | Two overview orders, no reference skeleton | DS (order), synthesis |
| TPL-4 | P2 | `assets/skill/skill-reference-template.md:36-50` against `:182-212` | Duplicated section | DS |
| TPL-5 | P2 | `assets/skill/skill-reference-template.md:94,101`; `assets/skill/skill-asset-template.md:182,188` | GOOD example restates its own hook | LU |
| TPL-6 | P1 | `assets/parent-skill/scaffold/hub-skill-scaffold.md:84,92`; `references/shared/skill-root-metadata-contract.md:193,204` | Related placement | synthesis |
| TPL-7 | P2 | `references/parent-skill/compiled-routing-architecture.md:21`; `references/parent-skill/parent-skills-nested-packets.md:21` | Compound overview heading | synthesis |
| TPL-8 | P1 | no owner; only `sk-doc/shared/assets/template-rules.json:95-101` and `sk-doc/changelog/v2.2.0.0.md:27,31` | Surface packet layout undocumented | synthesis |
| TPL-9 | P2 | `assets/skill/skill-md-template.md:65`; `scripts/package_skill.py:841` | Letter-suffixed H2 tolerated | DS (template), synthesis |
| TPL-10 | P2 | `assets/skill/skill-router-template.md:23` | Overview prompt invites the intent recital | synthesis |
| TPL-11 | P1 | `references/skill/creation-workflow.md:325-329`; `scripts/package_skill.py:751-810,1475`; `references/shared/validation-and-packaging.md:120` | Completion gate reads no body | LU |

- **TPL-1.** The example frontmatter is unfenced. Line 134 `---` is a thematic break, lines 135-138 are a paragraph, and line 139 `---` turns that paragraph into an H2 inside the template authors copy.
- **TPL-2.** `**File**:`, `**Purpose**:` and `**Structure**:` sit on consecutive lines, which is the exact defect of the control file.
- **TPL-3.** The GOOD example orders Purpose, When to Use, Core Principle (100-108). The Core Principle format example opens OVERVIEW with Core Principle (238-241). Nowhere does the file show a reference body: no rule-field layout, no link form, no blank line above `---`, and no related-last rule. The asset template states related-last at `skill-asset-template.md:166`, inside a fenced example.
- **TPL-6.** `init_skill.py:648` copies the hub scaffold into every new hub, so its related-before-integration order spreads.
- **TPL-11.** The documented completion gate is `package_skill.py --check --strict`. Its resource-doc pass reads only frontmatter. Content quality is left to AI judgment.

---

## 4. WHY THE VALIDATOR PASSED THEM

| ID | Location | Gap | Lineage |
|----|----------|-----|---------|
| VAL-1 | `sk-doc/shared/scripts/validate_document.py:909-915` | `validate_required_sections` accepts any numbered H2 whose name contains every required word, so `OVERVIEW AND CASCADE AND SPECIFICITY` satisfies `overview`. No body is required. | both |
| VAL-2 | `validate_document.py:2007-2029` | The pipeline runs the TOC, H2 format, general structure, required sections, type-specific and frontmatter checks. None of them reads a paragraph. | both |
| VAL-3 | `validate_document.py:676-701` | The divider rule wants `---` above each numbered ALL-CAPS H2 and skips blank lines on the way up. It never asks for a blank line above the `---`, so it accepts the setext layout. The pre-fix `web-markup-and-css.md:46-47` passes. | DS |
| VAL-4 | `validate_document.py:677,736,852,764` | Every H2 regex is `^## (\d+)\.`, so `## 2b.` and unnumbered H2s are invisible. A non-sequential number is only a warning. | DS |
| VAL-5 | `sk-doc/shared/assets/template-rules.json:319-326`; `validate_document.py:929` | `related_resources` is only recommended, and `recommendedSections` is read only in the router-command branch. Reference and asset placement is never checked. | DS |
| VAL-6 | `template-rules.json:62-63` and the `security_policy` and `skill_router` blocks | `firstSectionName` and `lastSectionPattern` are declared, but no script reads them (a search over every non-JSON file found no reader). The intended order rule exists only as data. | synthesis |

---

## 5. PREVENTION BY DEFECT CLASS

"Flags the control" means the check would report the `cd00629166` `web-cascade-and-selectors.md`. Each answer is reasoned from that file's content.

| Class | Template or guidance change | Validator check | Mechanical | Flags the control |
|-------|-----------------------------|-----------------|------------|-------------------|
| Joined bold labels | Reference skeleton shows rule fields as `- **Label:** text` bullets. Fix TPL-2. | `render_bold_label_join`: two consecutive non-blank, non-list lines outside fences that both open with `**...**` | Yes | **Yes**: 23-28 are six label lines with no blank line, repeated in all nine rules (46 joined lines) |
| Setext underline | Skeleton puts a blank line above every `---`. Fence TPL-1. | `render_setext_underline`: a `---` or `===` line directly under a paragraph line (not a heading, list item, table row, HTML comment, blockquote or frontmatter) outside fences | Yes | **No**: lines 16, 47, 70 and 110 above its four body dividers are blank. Known-bad instead: `cd00629166` `web-markup-and-css.md:46-47` (6 hits) and HEAD `skill-md-template.md:139` |
| Bare URL | Skeleton shows `[title](url)`. | `render_bare_url`: `http(s)://` outside fences and inline code, not a link target and not an `<autolink>` | Yes | **Yes**: 28, 37, 46, 60, 69, 82, 91, 100, 109 |
| Compound overview | Skeleton opens with exactly `## 1. OVERVIEW`. Fix TPL-7. | `render_overview_heading`: the first numbered H2 names OVERVIEW and anything after it | Yes | **Yes**: 19 |
| Overview without orientation | Skeleton gives Purpose and When to Use first. | `render_overview_orientation`: the first block under OVERVIEW is a fence, a table or a rule-id H3 (`### XX1.`) | Yes | **Yes**: the first block under 19 is `### CS1.` at 21 |
| Duplicated text in one field | Guidance: a merge script removes duplicates. | `render_repeated_sentence`: a sentence pair repeats inside one paragraph or list item | Yes | **No**: 58 and 59 name different features (`is`, `where`). Known-bad: HEAD FE-1, and `cd00629166` `web-performance-and-loading.md:104-105` |
| Repeated label | Skeleton shows one label per field. | `render_repeated_label`: the same bold label opens two adjacent non-list paragraphs. `[placeholder]` labels are skipped. | Yes | **Yes**: `**Support.**` opens both 58 and 59 |
| Heading numbering | `skill-md-template.md:65` says integers only. | `render_h2_numbering`: a letter-suffixed number, or an unnumbered H2 among numbered ones, in reference, asset and skill docs | Yes | **No**: its H2s at 19, 50, 73 and 113 run 1 to 4. Known-bad: XS-1, RV-2 |
| Section order | The reference template states related-last. Document the surface packet order (TPL-8). Fix TPL-6. | `render_section_order`: a related section, when present, is the last H2, or is followed only by MACHINE ROUTER. The same check reads the declared `lastSectionPattern` (VAL-6). | Yes | **No**: it has no related section, and its last H2 is `## 4. SUPPORT`. Known-bad: RV-1, SK-4, HUB-1, TPL-6 |
| Intro restates Purpose | Fix TPL-5. The guidance says the hook and the Purpose say different things. | `render_intro_restates_purpose` (advisory): token overlap of 0.6 or more between the intro and the first Purpose sentence | Partly: near-restatements only | **No**: it has no Purpose subsection. Known-bad: RV-4 (0.68), SK-2 TypeScript (0.76) and JavaScript (0.67) |
| Boilerplate across files | Guidance: Purpose names this file's outcome and triggers. | None. The validator reads one file at a time. | No | n/a |
| Order by authoring history | Guidance: a governing decision (trust, transport, skip gate) comes before the steps it governs. Canonical overview order in the template. | None | No | n/a |
| Wall of text | Guidance: split a paragraph that packs several mechanisms into a list. | Not proposed. A length rule is mechanical (17 paragraphs over 1,200 characters in 13 fleet files), but no template sets a limit, and the line between dense contract prose and a wall is editorial. | n/a | n/a |
| Incomplete index; leaked token | Guidance: an index lists every file of the directory it indexes, and the body carries no status tokens. | None. Each class has one instance fleet-wide. | No | n/a |

The guidance half belongs in `creation-workflow.md` as a reference and asset content review that runs beside the completion gate. The gate itself changes once: `package_skill.py --check --strict` runs the render checks on `references/` and `assets/`, and promotes their findings to errors.

---

## 6. ROLLOUT CONSTRAINT

`validate_document.py` serves every skill. These are the prototype hit counts over the 712 fleet docs:

| Check | sk-code | sk-create-skill | Other skills |
|-------|---------|-----------------|--------------|
| `render_bold_label_join` | 0 | 2 | 26 |
| `render_setext_underline` | 0 | 1 | 1 (`sk-doc/ROUTER.md:36-37`) |
| `render_bare_url` | 0 | 0 | 25 |
| `render_overview_heading` | 1 | 2 | 6 |
| `render_overview_orientation` | 1 | 0 | 8 |
| `render_repeated_sentence` | 2 | 0 | 0 |
| `render_repeated_label` | 1 | 0 | 0 |
| `render_h2_numbering` (letter suffix) | 2 | 0 | 2 |
| `render_h2_numbering` (unnumbered peer) | 1 | 0 | 28 |
| `render_section_order` | 3 | 2 | 13 |
| `render_intro_restates_purpose` | 3 | 0 | 6 (two sit at the 0.6 boundary) |

Spot checks found true positives outside sk-code too, for example `mcp-code-mode/references/architecture.md:467-469`, where Before, After and Savings join into one paragraph. The validator runs from `/create` commands and by hand, not as a CI fleet gate. `package_skill.py --strict` runs from `/create:skill` and `/doctor:sk-skill`. So the checks land as warnings, and strict packaging promotes them only past a known-debt ledger seeded from the other skills, the same pattern `routing-shape-known-debt.json` uses. Blocking them everywhere is a fleet clean-up, outside this packet.

---

## 7. REJECTED AND REBASED

| Claim | Lineage | Verdict | Reason |
|-------|---------|---------|--------|
| P10 before P8 and P9 in `web-performance-and-loading.md:111,124,133` is authoring-history order | DS | Rejected | It is deliberate: `sk-code-frontend/changelog/v1.0.2.0.md:32` moves P10 into the interaction section and keeps ids stable. Luna reached the same conclusion. |
| The I7 to I9 gap in `web-internationalization.md:105,118` | DS | Rejected | `I8` was removed with the Angular rules (`changelog/v1.0.2.0.md:33,39`). Ids stay stable by contract. |
| A rule-id monotonic validator check | DS | Rejected | Its only two hits at HEAD are the two deliberate cases above. |
| `runner-contract.md`, `quality-config.md` and `pr-state-dedup.md` are defective because they lack a related section | DS | Rejected | The section is optional (`skill-asset-template.md:166`, `template-rules.json` recommended), and 56 of the 112 sk-code files omit it. |
| Make `related_resources` required | DS | Rejected | Same reason, at fleet scale. |
| `code-style-guide.md:116` (408 characters) is a wall of text | DS | Rejected | It is an ordinary three-sentence paragraph. DeepSeek's own iteration 1 ruled out line length as a rendering defect. |
| Review `SKILL.md` lists the same files twice in §5 and §8 | DS | Rejected | §8 holds one pointer sentence and the playbook note (324-338). |
| The control's 58-59 are a duplicated sentence | DS | Corrected | They name two features (`is`, `where`). That is a repeated label, not duplicated text. |
| The setext check "would flag the control" | DS | Corrected | The control has a blank line above every divider. The setext control is `cd00629166` `web-markup-and-css.md:46-47`. |
| None of the four CI references has Purpose plus When to Use | DS | Narrowed | Prose overviews that orient are not defects (eight sk-code references use them). Only `protected-set.md` is kept (CI-4). |
| Hub `ROUTER.md` related must be the last section | DS | Rebased | The router template puts MACHINE ROUTER last. HUB-1 keeps the real defect: related comes before MACHINE-READABLE ROUTER and HOW TO READ THIS. |
| The frontend `SKILL.md` breaks the skill template's SMART ROUTING placement | LU | Rebased | Surface packets are exempt from that template. XS-1 keeps the real defect: the three packets disagree. |
| The pre-fix VALID/0 verdict is only plausible | LU | Confirmed | It was rerun here: `valid: true`, `total_issues: 0`, exit 0. |

---

## 8. OPEN ITEMS FOR THE OPERATOR

- **SC-002 cannot hold as written.** `spec.md` SC-002 says each proposed check would have flagged the phase 009 baseline file. Five of the ten checks flag it. The other five target classes the file does not contain (setext, repeated sentence, heading numbering, section order, intro restatement), and each of those is proven on another named known-bad file instead. Proposed wording: "Each proposed validator check flags at least one named known-bad file (the `cd00629166` control, another `cd00629166` reference, or a confirmed HEAD defect) and none flags a file this research confirmed clean."
- **Fleet follow-up, outside this packet.** The other-skill hits in Section 6, including `sk-doc/ROUTER.md:36-37` (a setext heading), go into the known-debt ledger. Each owning skill clears its own.
- **The `readme` and `security_policy` order keys stay unread.** The plan wires `firstSectionName` and `lastSectionPattern` only for the four types that get render checks. Reading them for README files would put warnings on every README in the fleet, and that count has not been measured.

---

## 9. EVIDENCE INDEX

- DeepSeek lineage: `lineages/deepseek/iterations/iteration-001.md` to `iteration-008.md`, `lineages/deepseek/research.md`.
- Luna lineage: `lineages/luna/iterations/iteration-001.md` to `iteration-007.md`, `lineages/luna/synthesis.md`.
- Control files: `git show cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md` and `git show cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md`.
- Baselines taken during synthesis: `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` printed `14323 links checked, 0 broken`. `package_skill.py --check --strict` printed `Skill is valid!` for `sk-code`, `sk-code-ci`, `sk-code-skilled` and `sk-code-review`.
