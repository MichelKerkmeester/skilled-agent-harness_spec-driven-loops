# Deep Research Strategy

Session tracking for the deep-research run on `specs/sk-doc/document-standards/003-changelog-system/005-concise-release-format`.

---

## 2. TOPIC
Research how .skilled/skills/sk-doc/sk-create-changelog (SKILL.md, ROUTER.md, assets/changelog-template.md and references/) should change so that, by default and especially for releases with many changes, it produces the format of the republished release entry .skilled/changelog/skilled/v4.0.1.0.md at commit 6a93a2cfeb: concise, written for a person using the repository, maintainer-only detail left out (internal tooling, tie-break order, test and scenario lists, how the work was done), a short spec-folder line, an at-a-glance list in section order within the ceiling, topical sections with short benefit-led H4 items, small fixes folded into one bullet list, upgrade notes ordered by section, and a single sentence naming the components that got their own changelog entry. Compare it with the long version of the same entry (git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md), the canonical exemplar .skilled/changelog/skilled/v4.0.0.0.md and the current template, and name each rule that would have produced the short version. Find where the template, SKILL.md, references and the /create:changelog command YAMLs push the other way (for example the exemplar-wins rule, the ceilings, the expanded-format guidance, the keep and drop lists) and what validate_document.py or hvr_scan.py could check. Propose exact edits with file:line. Read-only: write only under the spec folder. Cite file:line for every finding.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which concrete format rules (structure, length, audience, omissions) distinguish the short republished v4.0.1.0 entry at 6a93a2cfeb from the long version at bc28fcbbba and from the v4.0.0.0 exemplar?
- [x] Q2: Where do sk-create-changelog SKILL.md, ROUTER.md, assets/changelog-template.md and references/ push toward the long format (exemplar-wins rule, ceilings, expanded-format guidance, keep and drop lists), with file:line?
- [x] Q3: Where do the /create:changelog command doc and its auto and confirm workflow YAMLs push toward the long format or fail to enforce the short one, with file:line?
- [x] Q4: Which checks could validate_document.py or hvr_scan.py add to detect the long-format failure modes (maintainer-only detail, missing at-a-glance list, unfolded small fixes, upgrade-note order)?
- [x] Q5: What exact edits, as file:line plus replacement text, would make the concise format the default, ranked by impact?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing sk-create-changelog, the command YAMLs, validators or any changelog entry (read-only research; the build is a later step).
- Re-deciding the v4.0.0.0 house style beyond what the concise format needs.
- Retrofitting existing changelog entries.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: run all 5 iterations; convergence is telemetry only.
- Every proposed edit carries a file:line that a leaf has read.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Which concrete format rules (structure, length, audience, omissions) distinguish the short republished v4.0.1.0 entry at 6a93a2cfeb from the long version at bc28fcbbba and from the v4.0.0.0 exemplar?
- Q2: Where do sk-create-changelog SKILL.md, ROUTER.md, assets/changelog-template.md and references/ push toward the long format (exemplar-wins rule, ceilings, expanded-format guidance, keep and drop lists), with file:line?
- Q3: Where do the /create:changelog command doc and its auto and confirm workflow YAMLs push toward the long format or fail to enforce the short one, with file:line?
- Q4: Which checks could validate_document.py or hvr_scan.py add to detect the long-format failure modes (maintainer-only detail, missing at-a-glance list, unfolded small fixes, upgrade-note order)?
- Q5: What exact edits, as file:line plus replacement text, would make the concise format the default, ranked by impact?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A blocking total-line ceiling shipped before D1.** Fails strict validation on the exemplar the moment it lands. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A blocking total-line ceiling shipped before D1.** Fails strict validation on the exemplar the moment it lands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A blocking total-line ceiling shipped before D1.** Fails strict validation on the exemplar the moment it lands.

### **A changelog mode on `hvr_scan.py`.** The scanner has no document-type concept and its own standard excludes the structural findings Q4 cares about [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:15-21]; a changelog mode would be a second scanner wearing the first one's name. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A changelog mode on `hvr_scan.py`.** The scanner has no document-type concept and its own standard excludes the structural findings Q4 cares about [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:15-21]; a changelog mode would be a second scanner wearing the first one's name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A changelog mode on `hvr_scan.py`.** The scanner has no document-type concept and its own standard excludes the structural findings Q4 cares about [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:15-21]; a changelog mode would be a second scanner wearing the first one's name.

### **A grep for a long-format keyword set rather than a full read.** No single phrase names the failure. The push is distributed across a tier name, two table rows, a precedence clause, a Drop-list item and an absence. A pattern search would have found the two selection rules and missed findings 4, 6, 7 and 11. Candidate for the exhausted list: lexical search of the skill packet for long-format push. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A grep for a long-format keyword set rather than a full read.** No single phrase names the failure. The push is distributed across a tier name, two table rows, a precedence clause, a Drop-list item and an absence. A pattern search would have found the two selection rules and missed findings 4, 6, 7 and 11. Candidate for the exhausted list: lexical search of the skill packet for long-format push.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A grep for a long-format keyword set rather than a full read.** No single phrase names the failure. The push is distributed across a tier name, two table rows, a precedence clause, a Drop-list item and an absence. A pattern search would have found the two selection rules and missed findings 4, 6, 7 and 11. Candidate for the exhausted list: lexical search of the skill packet for long-format push.

### **A length rule in the YAML at all.** Greps for `max|maximum|ceiling|cap|limit|prose lines|total lines|total words` across both files return zero hits. There is no ceiling to relocate; one has to be authored. Candidate for the reducer's exhausted list: searching the command YAMLs for an existing body ceiling. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A length rule in the YAML at all.** Greps for `max|maximum|ceiling|cap|limit|prose lines|total lines|total words` across both files return zero hits. There is no ceiling to relocate; one has to be authored. Candidate for the reducer's exhausted list: searching the command YAMLs for an existing body ceiling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A length rule in the YAML at all.** Greps for `max|maximum|ceiling|cap|limit|prose lines|total lines|total words` across both files return zero hits. There is no ceiling to relocate; one has to be authored. Candidate for the reducer's exhausted list: searching the command YAMLs for an existing body ceiling.

### **A pure keyword grep as the method.** The earlier offset-mangled listing produced three wrong line anchors that only a second numbered read corrected; keyword hits alone would have missed findings 5, 6 and 11, none of which contains a format keyword. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A pure keyword grep as the method.** The earlier offset-mangled listing produced three wrong line anchors that only a second numbered read corrected; keyword hits alone would have missed findings 5, 6 and 11, none of which contains a format keyword.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A pure keyword grep as the method.** The earlier offset-mangled listing produced three wrong line anchors that only a second numbered read corrected; keyword hits alone would have missed findings 5, 6 and 11, none of which contains a format keyword.

### **A pure word-level diff as the source of the rules.** The rewording between the two versions is small; nearly all of the 144-line difference is deleted or merged H4 blocks. Deriving rules from the prose diff would have produced style advice where the actual loss is structure. [INFERENCE: based on 38 to 22 H4 headings against a 42 percent line cut] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A pure word-level diff as the source of the rules.** The rewording between the two versions is small; nearly all of the 144-line difference is deleted or merged H4 blocks. Deriving rules from the prose diff would have produced style advice where the actual loss is structure. [INFERENCE: based on 38 to 22 H4 headings against a 42 percent line cut]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A pure word-level diff as the source of the rules.** The rewording between the two versions is small; nearly all of the 144-line difference is deleted or merged H4 blocks. Deriving rules from the prose diff would have produced style advice where the actual loss is structure. [INFERENCE: based on 38 to 22 H4 headings against a 42 percent line cut]

### **A semantic at-a-glance order check without a template change.** Measured against the short entry's actual bullet text [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:41-48], no lexical mapping from bullet to H2 exists. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A semantic at-a-glance order check without a template change.** Measured against the short entry's actual bullet text [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:41-48], no lexical mapping from bullet to H2 exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A semantic at-a-glance order check without a template change.** Measured against the short entry's actual bullet text [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:41-48], no lexical mapping from bullet to H2 exists.

### **A setup-level format question.** The six-field contract [SOURCE: .skilled/commands/create/assets/create-changelog-presentation.txt:69] is complete and `version_bump` is the only creative control; adding a format field is a design choice, not a discovery. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A setup-level format question.** The six-field contract [SOURCE: .skilled/commands/create/assets/create-changelog-presentation.txt:69] is complete and `version_bump` is the only creative control; adding a format field is a design choice, not a discovery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A setup-level format question.** The six-field contract [SOURCE: .skilled/commands/create/assets/create-changelog-presentation.txt:69] is complete and `version_bump` is the only creative control; adding a format field is a design choice, not a discovery.

### **A third tier for "10+ changes, non-breaking".** It cannot route the target entry, which carries two breaking markers [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138]. Definitive; do not revisit. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A third tier for "10+ changes, non-breaking".** It cannot route the target entry, which carries two breaking markers [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138]. Definitive; do not revisit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A third tier for "10+ changes, non-breaking".** It cannot route the target entry, which carries two breaking markers [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138]. Definitive; do not revisit.

### **A vocabulary ban on tool names or numbers as the maintainer-detail check.** Finding 18: the kept entry names tools and numbers deliberately. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A vocabulary ban on tool names or numbers as the maintainer-detail check.** Finding 18: the kept entry names tools and numbers deliberately.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A vocabulary ban on tool names or numbers as the maintainer-detail check.** Finding 18: the kept entry names tools and numbers deliberately.

### **Amending the Drop list at `template:148` to resolve the spec-line contradiction.** Unnecessary once Rank 5 deletes the suffix; the amendment would widen the exemption instead (F6). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Amending the Drop list at `template:148` to resolve the spec-line contradiction.** Unnecessary once Rank 5 deletes the suffix; the amendment would widen the exemption instead (F6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Amending the Drop list at `template:148` to resolve the spec-line contradiction.** Unnecessary once Rank 5 deletes the suffix; the amendment would widen the exemption instead (F6).

### **Attributing the release step as a length gate.** It strips two blocks and preserves spacing [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:654]; it neither truncates nor summarises. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Attributing the release step as a length gate.** It strips two blocks and preserves spacing [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:654]; it neither truncates nor summarises.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Attributing the release step as a length gate.** It strips two blocks and preserves spacing [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:654]; it neither truncates nor summarises.

### **Candidate for the reducer's exhausted list:** none. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Candidate for the reducer's exhausted list:** none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Candidate for the reducer's exhausted list:** none.

### **Counting occurrences of "expanded" as a proxy for pressure.** The word appears across all six files, which ranks files by vocabulary rather than by constraint. It also ranks `SKILL.md` above the template, inverting the actual authority order established in finding 15. Candidate for the exhausted list: term-frequency ranking of format pressure. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Counting occurrences of "expanded" as a proxy for pressure.** The word appears across all six files, which ranks files by vocabulary rather than by constraint. It also ranks `SKILL.md` above the template, inverting the actual authority order established in finding 15. Candidate for the exhausted list: term-frequency ranking of format pressure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting occurrences of "expanded" as a proxy for pressure.** The word appears across all six files, which ranks files by vocabulary rather than by constraint. It also ranks `SKILL.md` above the template, inverting the actual authority order established in finding 15. Candidate for the exhausted list: term-frequency ranking of format pressure.

### **Editing `SKILL.md:342`'s success criterion.** It stays true once Expanded is redefined, and editing it would imply a third shape [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:342]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Editing `SKILL.md:342`'s success criterion.** It stays true once Expanded is redefined, and editing it would imply a third shape [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:342].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `SKILL.md:342`'s success criterion.** It stays true once Expanded is redefined, and editing it would imply a third shape [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:342].

### **Editing the `/create:changelog` command doc for format.** Confirmed again at `:61`; it is a router with a wording ban [SOURCE: .skilled/commands/create/changelog.md:61]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Editing the `/create:changelog` command doc for format.** Confirmed again at `:61`; it is a router with a wording ban [SOURCE: .skilled/commands/create/changelog.md:61].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing the `/create:changelog` command doc for format.** Confirmed again at `:61`; it is a router with a wording ban [SOURCE: .skilled/commands/create/changelog.md:61].

### **Explaining the long output as "the operator chose Expanded".** No surface asks for a change count or a format; the tier is derived and, in autonomous mode, never confirmed [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:31]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Explaining the long output as "the operator chose Expanded".** No surface asks for a change count or a format; the tier is derived and, in autonomous mode, never confirmed [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:31].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Explaining the long output as "the operator chose Expanded".** No surface asks for a change count or a format; the tier is derived and, in autonomous mode, never confirmed [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:31].

### **Hunting for a pro-long rule in `version-bump-rules.md` or `topology-edge-cases.md`.** Both were read in full and neither carries a format or length rule. `version-bump-rules.md` is the only reference file whose doctrine runs the other way. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Hunting for a pro-long rule in `version-bump-rules.md` or `topology-edge-cases.md`.** Both were read in full and neither carries a format or length rule. `version-bump-rules.md` is the only reference file whose doctrine runs the other way.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hunting for a pro-long rule in `version-bump-rules.md` or `topology-edge-cases.md`.** Both were read in full and neither carries a format or length rule. `version-bump-rules.md` is the only reference file whose doctrine runs the other way.

### **Populating `requiredSections` in `template-rules.json` as a fix.** The finder regex only reads numbered H2s [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1834], so the edit would be a no-op on real entries. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Populating `requiredSections` in `template-rules.json` as a fix.** The finder regex only reads numbered H2s [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1834], so the edit would be a no-op on real entries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Populating `requiredSections` in `template-rules.json` as a fix.** The finder regex only reads numbered H2s [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1834], so the edit would be a no-op on real entries.

### **Re-reading the v4.0.1.0 entry or the v4.0.0.0 exemplar to re-derive the target format.** Q1 owns that and the pack prohibits re-deriving it; every claim above is grounded in the skill files, with the entry referenced only as the comparison case already fixed by iteration 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Re-reading the v4.0.1.0 entry or the v4.0.0.0 exemplar to re-derive the target format.** Q1 owns that and the pack prohibits re-deriving it; every claim above is grounded in the skill files, with the entry referenced only as the comparison case already fixed by iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-reading the v4.0.1.0 entry or the v4.0.0.0 exemplar to re-derive the target format.** Q1 owns that and the pack prohibits re-deriving it; every claim above is grounded in the skill files, with the entry referenced only as the comparison case already fixed by iteration 1.

### **Reading the command YAMLs again for a length home.** Iteration 3 already established there is no ceiling there, and it is on the exhausted list. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reading the command YAMLs again for a length home.** Iteration 3 already established there is no ceiling there, and it is on the exhausted list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the command YAMLs again for a length home.** Iteration 3 already established there is no ceiling there, and it is on the exhausted list.

### **Reading the compact branch as the model for the short entry.** The compact ceiling is 40 prose lines; the short entry is 176 body lines. The short entry is a third format, not a compact entry. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:210] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading the compact branch as the model for the short entry.** The compact ceiling is 40 prose lines; the short entry is 176 body lines. The short entry is a third format, not a compact entry. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:210]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the compact branch as the model for the short entry.** The compact ceiling is 40 prose lines; the short entry is 176 body lines. The short entry is a third format, not a compact entry. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:210]

### **Reading the confirm checkpoint as a format veto.** Its four options do not include a format choice [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:570]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Reading the confirm checkpoint as a format veto.** Its four options do not include a format choice [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:570].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the confirm checkpoint as a format veto.** Its four options do not include a format choice [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:570].

### **Removing the per-item seven-paragraph allowance while leaving `:212` intact.** The calibration sentence would re-authorize any ceiling added next to it (F3). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Removing the per-item seven-paragraph allowance while leaving `:212` intact.** The calibration sentence would re-authorize any ceiling added next to it (F3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removing the per-item seven-paragraph allowance while leaving `:212` intact.** The calibration sentence would re-authorize any ceiling added next to it (F3).

### **Reusing `h2DividerRequired` as the section-shape hook.** It is already declared true and never fires (finding 6); extending it would mean changing the heading pattern for every document type. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reusing `h2DividerRequired` as the section-shape hook.** It is already declared true and never fires (finding 6); extending it would mean changing the heading pattern for every document type.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reusing `h2DividerRequired` as the section-shape hook.** It is already declared true and never fires (finding 6); extending it would mean changing the heading pattern for every document type.

### **Treating `references/worked-examples.md` as the missing-lever file.** It does re-assert the Expanded gate and point at the exemplar, but both are downstream of the template's clauses and would be fixed by the same edit that fixes the template. Its real independent contribution is finding 13, the absent mid-scale model, which is additive rather than corrective. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating `references/worked-examples.md` as the missing-lever file.** It does re-assert the Expanded gate and point at the exemplar, but both are downstream of the template's clauses and would be fixed by the same edit that fixes the template. Its real independent contribution is finding 13, the absent mid-scale model, which is additive rather than corrective.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `references/worked-examples.md` as the missing-lever file.** It does re-assert the Expanded gate and point at the exemplar, but both are downstream of the template's clauses and would be fixed by the same edit that fixes the template. Its real independent contribution is finding 13, the absent mid-scale model, which is additive rather than corrective.

### **Treating `SKILL.md` as the primary carrier of the long-format push.** It restates the binary and mirrors the ceilings, but it delegates format authority to the template in three separate places. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:100] Injecting a new format into `SKILL.md` alone would leave the template's tier model intact and self-contradicting. The template must change first. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating `SKILL.md` as the primary carrier of the long-format push.** It restates the binary and mirrors the ceilings, but it delegates format authority to the template in three separate places. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:100] Injecting a new format into `SKILL.md` alone would leave the template's tier model intact and self-contradicting. The template must change first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `SKILL.md` as the primary carrier of the long-format push.** It restates the binary and mirrors the ceilings, but it delegates format authority to the template in three separate places. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:100] Injecting a new format into `SKILL.md` alone would leave the template's tier model intact and self-contradicting. The template must change first.

### **Treating the command doc as an edit target for format.** It is 70 lines of routing with an explicit ban on inventing wording [SOURCE: .skilled/commands/create/changelog.md:61]. Any format fix belongs in the YAML step 4/step 5 or the template. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the command doc as an edit target for format.** It is 70 lines of routing with an explicit ban on inventing wording [SOURCE: .skilled/commands/create/changelog.md:61]. Any format fix belongs in the YAML step 4/step 5 or the template.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the command doc as an edit target for format.** It is 70 lines of routing with an explicit ban on inventing wording [SOURCE: .skilled/commands/create/changelog.md:61]. Any format fix belongs in the YAML step 4/step 5 or the template.

### **Treating the exemplar as the length reference.** The exemplar is 535 lines and 40 H4 items, so deriving a length rule from it reproduces the long format rather than the short one. Only its H2/H4 shape, voice and separator convention transfer; its length does not. [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:13] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating the exemplar as the length reference.** The exemplar is 535 lines and 40 H4 items, so deriving a length rule from it reproduces the long format rather than the short one. Only its H2/H4 shape, voice and separator convention transfer; its length does not. [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the exemplar as the length reference.** The exemplar is 535 lines and 40 H4 items, so deriving a length rule from it reproduces the long format rather than the short one. Only its H2/H4 shape, voice and separator convention transfer; its length does not. [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:13]

### `hvr_scan.py` as a validation surface for changelogs. Definitive: wrong packet, wrong contract, wrong layer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `hvr_scan.py` as a validation surface for changelogs. Definitive: wrong packet, wrong contract, wrong layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `hvr_scan.py` as a validation surface for changelogs. Definitive: wrong packet, wrong contract, wrong layer.

### `hvr_scan.py` as any part of this fix. Settled in iteration 4, not revisited. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `hvr_scan.py` as any part of this fix. Settled in iteration 4, not revisited.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `hvr_scan.py` as any part of this fix. Settled in iteration 4, not revisited.

### No dead ends this iteration. Both the long and short entries, the intermediate revisions and the exemplar were all reachable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No dead ends this iteration. Both the long and short entries, the intermediate revisions and the exemplar were all reachable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No dead ends this iteration. Both the long and short entries, the intermediate revisions and the exemplar were all reachable.

### Reading the command YAMLs for an existing length ceiling. Iteration 3 established there is none; this iteration read them only for the sites the edits touch. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reading the command YAMLs for an existing length ceiling. Iteration 3 established there is none; this iteration read them only for the sites the edits touch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the command YAMLs for an existing length ceiling. Iteration 3 established there is none; this iteration read them only for the sites the edits touch.

### Validator-side detection of "maintainer-only detail" by word list. Definitive: the target format keeps the same vocabulary. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Validator-side detection of "maintainer-only detail" by word list. Definitive: the target format keeps the same vocabulary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Validator-side detection of "maintainer-only detail" by word list. Definitive: the target format keeps the same vocabulary.

### Word-list detection of "maintainer-only detail". Settled in iteration 4; the target entry names tools and numbers deliberately [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Word-list detection of "maintainer-only detail". Settled in iteration 4; the target entry names tools and numbers deliberately [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Word-list detection of "maintainer-only detail". Settled in iteration 4; the target entry names tools and numbers deliberately [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60].

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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
- Q4: Which checks could validate_document.py or hvr_scan.py add to detect the long-format failure modes (maintainer-only detail, missing at-a-glance list, unfolded small fixes, upgrade-note order)? (iteration 3)
- Q5: What exact edits, as file:line plus replacement text, would make the concise format the default, ranked by impact? (iteration 3)
- Q5: What exact edits, as file:line plus replacement text, would make the concise format the default, ranked by impact? — with five new dependencies inherited from this iteration: the template must tag at-a-glance bullets with their section before an order check exists (12); it must supply a canonical fold heading before the fold heuristic is fair (15); it must carry a section-reference convention before upgrade-note order is checkable (16); the new shape checks should ship at `warning` severity because the exemplar fails any total ceiling (19); and ranking must not put a blocking total ceiling ahead of an exemplar decision. (iteration 4)
- None of Q1-Q5. Four operator decisions (D1-D4) block implementation, not research. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Parent packet `specs/sk-doc/document-standards/003-changelog-system/` phases 001-004 shipped the v4-style template, the skill changelog retrofit, the Skilled release line and section spacing. This phase 005 is a fresh scaffold (spec.md placeholders only, no handover, no prior research). Git history of `.skilled/changelog/skilled/v4.0.1.0.md`: `bc28fcbbba` (long, reordered), `b6147d785b` (cut to what a repo user needs), `a8cc47730b` (names every skill and mode with an entry); HEAD is `6a93a2cfeb`.

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/sk-doc/sk-create-changelog/{SKILL.md,ROUTER.md,assets/,references/}`, `.skilled/changelog/skilled/v4.0.0.0.md`, `.skilled/changelog/skilled/v4.0.1.0.md`, `git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md`, `/create:changelog` command doc and YAMLs under `.skilled/commands/create/`.
- Validators: `.skilled/skills/sk-doc/shared/scripts/validate_document.py` (another session is editing it; read only), `hvr_scan.py` (locate it).
- Constraints: read-only outside the research packet.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/sk-doc/document-standards/003-changelog-system/005-concise-release-format/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-05T20:08:45.000Z
