# Iteration 4: Anchor nesting produced by the core spec template

## Focus

Confirm or refute the operator's hypothesis that the current scaffold's `questions` anchor wraps other sections, and trace it to its producer. This closes the anchor-integrity part of Q2 with a template-level cause.

## Actions Taken

- Listed the fresh scaffold sample (`research/scaffold-sample/*.txt`) and extracted every anchor marker with line numbers.
- Read the anchor structure of `templates/core/spec.md.tmpl`, including its `IF level` conditional blocks.
- Read the ANCHORS_VALID rule contract in `references/validation/validation-rules.md`.
- Read the sample `description.json`, `graph-metadata.json` and `implementation-summary.md` frontmatter to separate creation-time correctness from move-time drift.

## Findings

1. The operator's hypothesis is CONFIRMED at the template source. `templates/core/spec.md.tmpl` opens `<!-- ANCHOR:questions -->` at line 184 and its matching closer sits at line 399 inside a `level:1,2,3` block, with a second closer at line 425 inside a `level:3+` block. Everything between the open and the first close (nfr, edge-cases, complexity and the Level 3 sections) renders INSIDE the questions anchor. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:399] CONFIRMED
2. The rendered Level 2 scaffold in the pre-edit sample shows the nested result: `questions` opens at line 128, `nfr` pairs 132-146, `edge-cases` pairs 150-166, `complexity` pairs 170-179, and `questions` closes at 187. Three anchored sections live inside another anchored section. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/spec.md.txt:128] CONFIRMED
3. The validator forbids exactly this shape: ANCHORS_VALID rule 3 says "No nesting - anchors cannot contain other anchors", and its scope is spec.md, plan.md, tasks.md, acceptance-criteria.md, decision-record.md, implementation-summary.md and memory files. Every newly scaffolded Level 2 or 3 packet therefore starts life with an anchor violation, before anyone edits it. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:389] CONFIRMED
4. The template selects level-specific sections with `<!-- IF level:... -->` / `<!-- /IF -->` blocks, so one physical template renders different anchor structures per level, and the stray second `questions` closer exists only on the Level 3+ path. Any template fix must be rendered and validated per level, not reviewed by eye once. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:186] CONFIRMED
5. A fresh scaffold deliberately writes `packet_pointer: "scaffold/<slug>"` in document frontmatter as a not-yet-filed marker, and the disk-consistency helper tolerates the scaffold marker in specific states. A packet that never receives a memory save or a repair keeps a pointer that is not its real path; this is a second, design-intended path-drift entry point distinct from archiving. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/implementation-summary.md.txt:9] CONFIRMED
6. The same sample records correct paths at creation time: `description.json` `specFolder` and `graph-metadata.json` `spec_folder` both name the real path (`system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research`). Creation is accurate; the later move (archive/restore) is the drift producer confirmed in iteration 3, and the unsaved scaffold pointer is the other. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/description.json.txt:2] CONFIRMED
7. The nested anchor is also semantically wrong even if nesting were legal: for Level 2 the close lands after the `## 10. OPEN QUESTIONS` items, so the anchor's name covers non-functional requirements, edge cases and complexity as well as its own section. Anchor extraction by name returns the wrong region, which is the functional cost of the defect. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/spec.md.txt:183] CONFIRMED

## Ruled Out

- Treating the anchor defects as author error: the pre-edit scaffold sample was produced by `create.sh` with no human edits, and it already violates the no-nesting rule.
- Fixing the rendered packets without fixing the template: that would leave the next scaffold broken and force the corpus repair to run forever.

## Dead Ends

- Reading only the scaffold sample would have localized the bug to "the Level 2 phase scaffold"; reading the core template showed it is the core `spec.md.tmpl` shared by Levels 2 and 3, a much wider blast radius.

## Edge Cases

- Ambiguous input: the operator wrote "Level 2 phase scaffold"; the template actually serves both Level 2 and Level 3 paths with different close placement, so the finding is broader than the hypothesis. Recorded as a scope widening, not a contradiction.
- Contradictory evidence: none. Template source, render sample and rule contract agree.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`
- `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/spec.md.txt`
- `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/description.json.txt`
- `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/graph-metadata.json.txt`
- `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/implementation-summary.md.txt`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`

## Assessment

- New information ratio: 0.90 (6 of 7 findings fully new; 1 is the confirmation of a lead hypothesis and counts as half new)
- Questions addressed: Q2 anchor-integrity cause at template level; Q1 candidate fix; Q3 constraint (fix at source, not at render)
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-008 | Fix the `questions` anchor in `templates/core/spec.md.tmpl` so the closer sits immediately after the Open Questions items on every level path, and remove the stray second closer; render all levels and run the anchor rule against each render as the acceptance proof | Q1, Q2 | `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` plus an anchor-render regression test under the spec-kit CLI tests | S to M | Med; the template feeds every future scaffold, so an error multiplies, but per-level render validation bounds it | Template file, test file | Template lines 184/399/425 nest three sections per the Level 2 render at scaffold-sample spec.md.txt:128; rule 3 forbids nesting (validation-rules.md:389) | CONFIRMED | Yes (single template write; renders are deterministic) | Revert the template commit | No; anchor markers only, section content untouched |
| R-009 | Add a scaffold-time structural self-check: after `create.sh` renders a packet, run the anchor rule on the rendered docs and fail the scaffold with a named defect instead of reporting success | Q1, Q2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` (post-render step) | S | Low; read-only check | `create.sh` | The scaffold sample proves a broken structure ships today with a success message | CONFIRMED defect, INFERRED fix | Yes (check runs on every scaffold) | Revert the commit | No |
| R-010 | Treat the `scaffold/<slug>` packet pointer as a repairable derived fact with a deadline: report (and optionally repair) packets whose pointer is still the scaffold form, since no save ever rewrote it | Q1, Q2 | `repair-derived.cjs` (report class) and `doctor` reporting | S | Low; report first | `repair-derived.cjs`, doctor assets | scaffold-sample implementation-summary.md.txt:9 carries the scaffold pointer; the disk rule tolerates it by design | CONFIRMED state, INFERRED that repair-derived does not yet report it (confirm by reading repair-derived.cjs body) | Yes (recompute) | Revert the commit | No; pointer is derived metadata |

## Reflection

- What worked and why: comparing the template's anchor list against the pre-edit render localized the defect to one open/close pair in one file with exact line numbers; the conditional blocks explain why the same template is safe for Level 1 and broken for 2/3.
- What did not work and why: the first pass assumed the phase-child template (a packet-type template) was the source; the core `spec.md.tmpl` is the actual producer, so checking the packet-types directory first cost a call.
- What I would do differently: for scaffold defects, always diff the render sample against the core template before reading any packet-type template.

## Recommended Next Focus

Iteration 5: finish Q2 for the convention classes: why GREP_CONVENTION, FRONTMATTER_VALID and TEMPLATE_SOURCE persist after the template-phrase cleanup, using the census tool, the phrase cleanup tool, and the removed-template-default commits as evidence; identify whether old template versions are the remaining producer.
