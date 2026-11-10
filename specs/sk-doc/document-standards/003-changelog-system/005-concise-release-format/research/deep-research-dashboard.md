---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Research how .skilled/skills/sk-doc/sk-create-changelog (SKILL.md, ROUTER.md, assets/changelog-template.md and references/) should change so that, by default and especially for releases with many changes, it produces the format of the republished release entry .skilled/changelog/skilled/v4.0.1.0.md at commit 6a93a2cfeb: concise, written for a person using the repository, maintainer-only detail left out (internal tooling, tie-break order, test and scenario lists, how the work was done), a short spec-folder line, an at-a-glance list in section order within the ceiling, topical sections with short benefit-led H4 items, small fixes folded into one bullet list, upgrade notes ordered by section, and a single sentence naming the components that got their own changelog entry. Compare it with the long version of the same entry (git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md), the canonical exemplar .skilled/changelog/skilled/v4.0.0.0.md and the current template, and name each rule that would have produced the short version. Find where the template, SKILL.md, references and the /create:changelog command YAMLs push the other way (for example the exemplar-wins rule, the ceilings, the expanded-format guidance, the keep and drop lists) and what validate_document.py or hvr_scan.py could check. Propose exact edits with file:line. Read-only: write only under the spec folder. Cite file:line for every finding.
- Started: 2026-11-05T20:08:45.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-05T20:08:45.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: diff the short republished v4.0.1.0 entry at HEAD against the long version at bc28fcbbba and the v4.0.0.0 exemplar, and name every concrete format rule the short entry follows | format-rules | 0.93 | 15 | complete |
| 2 | Q2: where sk-create-changelog SKILL.md, ROUTER.md, assets/changelog-template.md and references/ push toward the long format | format-rules | 0.81 | 15 | complete |
| 3 | Q3: where the /create:changelog command doc and its auto and confirm workflow YAMLs push toward the long format or fail to enforce the short one | command-surface | 0.95 | 11 | complete |
| 4 | Q4: what validate_document.py and hvr_scan.py already check for changelog entries, and which concise-format failure modes are mechanically detectable (function and line to extend, tested against the short entry and the long one) | validation | 0.91 | 12 | complete |
| 5 | Q5 ranked edit list: ten ranks across 34 file:line sites that make the concise format the default, with every ranked line re-read in the working tree and four blocking operator decisions | - | 0.81 | 14 | complete |

- iterationsCompleted: 5
- keyFindings: 60
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Which concrete format rules (structure, length, audience, omissions) distinguish the short republished v4.0.1.0 entry at 6a93a2cfeb from the long version at bc28fcbbba and from the v4.0.0.0 exemplar?
- [x] Q2: Where do sk-create-changelog SKILL.md, ROUTER.md, assets/changelog-template.md and references/ push toward the long format (exemplar-wins rule, ceilings, expanded-format guidance, keep and drop lists), with file:line?
- [x] Q3: Where do the /create:changelog command doc and its auto and confirm workflow YAMLs push toward the long format or fail to enforce the short one, with file:line?
- [x] Q4: Which checks could validate_document.py or hvr_scan.py add to detect the long-format failure modes (maintainer-only detail, missing at-a-glance list, unfolded small fixes, upgrade-note order)?
- [x] Q5: What exact edits, as file:line plus replacement text, would make the concise format the default, ranked by impact?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▆▄▃▂▁▃▄▆▇█▇▇▇▆▅▄▃▂▁
- score sparkline: ▇▆▄▃▂▁▃▄▆▇█▇▇▇▆▅▄▃▂▁
- Last 3 ratios: 0.95 -> 0.91 -> 0.81
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.81
- coverageBySources: {"code":53,"other":35}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **A pure word-level diff as the source of the rules.** The rewording between the two versions is small; nearly all of the 144-line difference is deleted or merged H4 blocks. Deriving rules from the prose diff would have produced style advice where the actual loss is structure. [INFERENCE: based on 38 to 22 H4 headings against a 42 percent line cut] (iteration 1)
- **Candidate for the reducer's exhausted list:** none. (iteration 1)
- **Reading the compact branch as the model for the short entry.** The compact ceiling is 40 prose lines; the short entry is 176 body lines. The short entry is a third format, not a compact entry. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:210] (iteration 1)
- **Treating the exemplar as the length reference.** The exemplar is 535 lines and 40 H4 items, so deriving a length rule from it reproduces the long format rather than the short one. Only its H2/H4 shape, voice and separator convention transfer; its length does not. [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:13] (iteration 1)
- No dead ends this iteration. Both the long and short entries, the intermediate revisions and the exemplar were all reachable. (iteration 1)
- **A grep for a long-format keyword set rather than a full read.** No single phrase names the failure. The push is distributed across a tier name, two table rows, a precedence clause, a Drop-list item and an absence. A pattern search would have found the two selection rules and missed findings 4, 6, 7 and 11. Candidate for the exhausted list: lexical search of the skill packet for long-format push. (iteration 2)
- **Counting occurrences of "expanded" as a proxy for pressure.** The word appears across all six files, which ranks files by vocabulary rather than by constraint. It also ranks `SKILL.md` above the template, inverting the actual authority order established in finding 15. Candidate for the exhausted list: term-frequency ranking of format pressure. (iteration 2)
- **Hunting for a pro-long rule in `version-bump-rules.md` or `topology-edge-cases.md`.** Both were read in full and neither carries a format or length rule. `version-bump-rules.md` is the only reference file whose doctrine runs the other way. (iteration 2)
- **Re-reading the v4.0.1.0 entry or the v4.0.0.0 exemplar to re-derive the target format.** Q1 owns that and the pack prohibits re-deriving it; every claim above is grounded in the skill files, with the entry referenced only as the comparison case already fixed by iteration 1. (iteration 2)
- **Treating `references/worked-examples.md` as the missing-lever file.** It does re-assert the Expanded gate and point at the exemplar, but both are downstream of the template's clauses and would be fixed by the same edit that fixes the template. Its real independent contribution is finding 13, the absent mid-scale model, which is additive rather than corrective. (iteration 2)
- **Treating `SKILL.md` as the primary carrier of the long-format push.** It restates the binary and mirrors the ceilings, but it delegates format authority to the template in three separate places. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:100] Injecting a new format into `SKILL.md` alone would leave the template's tier model intact and self-contradicting. The template must change first. (iteration 2)
- **A length rule in the YAML at all.** Greps for `max|maximum|ceiling|cap|limit|prose lines|total lines|total words` across both files return zero hits. There is no ceiling to relocate; one has to be authored. Candidate for the reducer's exhausted list: searching the command YAMLs for an existing body ceiling. (iteration 3)
- **A pure keyword grep as the method.** The earlier offset-mangled listing produced three wrong line anchors that only a second numbered read corrected; keyword hits alone would have missed findings 5, 6 and 11, none of which contains a format keyword. (iteration 3)
- **A setup-level format question.** The six-field contract [SOURCE: .skilled/commands/create/assets/create-changelog-presentation.txt:69] is complete and `version_bump` is the only creative control; adding a format field is a design choice, not a discovery. (iteration 3)
- **Attributing the release step as a length gate.** It strips two blocks and preserves spacing [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:654]; it neither truncates nor summarises. (iteration 3)
- **Explaining the long output as "the operator chose Expanded".** No surface asks for a change count or a format; the tier is derived and, in autonomous mode, never confirmed [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:31]. (iteration 3)
- **Reading the confirm checkpoint as a format veto.** Its four options do not include a format choice [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:570]. (iteration 3)
- **Treating the command doc as an edit target for format.** It is 70 lines of routing with an explicit ban on inventing wording [SOURCE: .skilled/commands/create/changelog.md:61]. Any format fix belongs in the YAML step 4/step 5 or the template. (iteration 3)
- **A changelog mode on `hvr_scan.py`.** The scanner has no document-type concept and its own standard excludes the structural findings Q4 cares about [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:15-21]; a changelog mode would be a second scanner wearing the first one's name. (iteration 4)
- **A semantic at-a-glance order check without a template change.** Measured against the short entry's actual bullet text [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:41-48], no lexical mapping from bullet to H2 exists. (iteration 4)
- **A vocabulary ban on tool names or numbers as the maintainer-detail check.** Finding 18: the kept entry names tools and numbers deliberately. (iteration 4)
- **Populating `requiredSections` in `template-rules.json` as a fix.** The finder regex only reads numbered H2s [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1834], so the edit would be a no-op on real entries. (iteration 4)
- **Reading the command YAMLs again for a length home.** Iteration 3 already established there is no ceiling there, and it is on the exhausted list. (iteration 4)
- **Reusing `h2DividerRequired` as the section-shape hook.** It is already declared true and never fires (finding 6); extending it would mean changing the heading pattern for every document type. (iteration 4)
- `hvr_scan.py` as a validation surface for changelogs. Definitive: wrong packet, wrong contract, wrong layer. (iteration 4)
- Validator-side detection of "maintainer-only detail" by word list. Definitive: the target format keeps the same vocabulary. (iteration 4)
- **A blocking total-line ceiling shipped before D1.** Fails strict validation on the exemplar the moment it lands. (iteration 5)
- **A third tier for "10+ changes, non-breaking".** It cannot route the target entry, which carries two breaking markers [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138]. Definitive; do not revisit. (iteration 5)
- **Amending the Drop list at `template:148` to resolve the spec-line contradiction.** Unnecessary once Rank 5 deletes the suffix; the amendment would widen the exemption instead (F6). (iteration 5)
- **Editing `SKILL.md:342`'s success criterion.** It stays true once Expanded is redefined, and editing it would imply a third shape [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:342]. (iteration 5)
- **Editing the `/create:changelog` command doc for format.** Confirmed again at `:61`; it is a router with a wording ban [SOURCE: .skilled/commands/create/changelog.md:61]. (iteration 5)
- **Removing the per-item seven-paragraph allowance while leaving `:212` intact.** The calibration sentence would re-authorize any ceiling added next to it (F3). (iteration 5)
- `hvr_scan.py` as any part of this fix. Settled in iteration 4, not revisited. (iteration 5)
- Reading the command YAMLs for an existing length ceiling. Iteration 3 established there is none; this iteration read them only for the sites the edits touch. (iteration 5)
- Word-list detection of "maintainer-only detail". Settled in iteration 4; the target entry names tools and numbers deliberately [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60]. (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
