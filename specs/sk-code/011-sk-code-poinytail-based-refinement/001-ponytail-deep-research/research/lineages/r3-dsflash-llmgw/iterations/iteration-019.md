# Iteration 19: Last unread corners and the ideas inventory

## Focus

The final research iteration: `sk-code-review/README.md` as the last unread operator-facing file of a part already surveyed, plus the original-ideas and rejections inventory the synthesis will rank. This follows iteration 18's Recommended Next Focus.

## Actions Taken

1. Read `sk-code-review/README.md` end to end and compared its verification table, example output and folder convention against the SKILL and the tree.
2. Counted the pre-rename names in the README.
3. Checked the README's playbook path and assessment token against the SKILL's contract and the actual folders.
4. Assembled this run's original-idea and rejection inventory from the iterations' proposals and ruled-out rows.

## Findings

1. **The review README documents a playbook folder convention the mode explicitly forbids and the tree does not use.** The README's verification row says to run scenarios under `manual-testing-playbook/<NN>--<topic>/` [SOURCE: .skilled/skills/sk-code/sk-code-review/README.md:203], while `SKILL.md` says the per-feature folders and files "use bare descriptive slugs, no numeric prefix" [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:473]; the folders on disk are `baseline-review-flow/`, `security-and-correctness-minimums/` and their peers, with no numeric prefix. Reproducing case: `rg -n "<NN>" .skilled/skills/sk-code/sk-code-review/README.md` prints the row, and `ls .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/` shows bare slugs. NEW, P2 (an operator following the README looks for folders that do not exist).
2. **The review README's own example uses a third assessment-token variant.** The example writes `**Overall assessment**: REQUESTED_CHANGES` [SOURCE: .skilled/skills/sk-code/sk-code-review/README.md:72], while the output contract's assessment set is `[APPROVE / REQUEST_CHANGES / COMMENT]` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:337] and the final-line set is `APPROVED/REQUESTED_CHANGES/COMMENTED`. The example's token matches neither set's assessment column; it borrows the final-line spelling for the assessment slot. Neither checker catches it because the final-line checker reads only the last line. Reproducing case: diff the README example's assessment line against SKILL.md's template; no checker flags the mismatch. NEW, P2 (extends the vocabulary footgun filed in f-iter007-003 with the canonical example itself).
3. **The review README carries 21 pre-rename name rows.** `rg -c "code-webflow|code-opencode|code-quality|code-review"` over the README prints 21, including the related-skill table and the FAQ [SOURCE: .skilled/skills/sk-code/sk-code-review/README.md:153]. This is the fourth packet-level count in the rename-miss family and the largest per file after the quality SKILL. NEW, P2 (evidence for a single sweep; no separate fix).
4. **Original ideas and rejections from this run, for the synthesis to rank.** Ideas proposed by the findings: (a) a documentation path-and-link checker for skill docs, which would have caught all six stale-family clusters in one pass; (b) one declared shared-controls source consumed by `ROUTER.md`, the router guard and the `SKILL.md` sentence, replacing the three disagreeing lists; (c) a review-output shape fixture that feeds both documented finding shapes through both checkers; (d) routing the review mode's detection through the shared detection contract instead of its private fork; (e) extending the hub version-parity check to the hub README and packet changelogs; (f) one canonical surface-list sentence reused by every hub doc, or a lint that flags the two-surface phrasing; (g) a load-tier claims check comparing prose tier claims against the machine `RESOURCE_MAP`. Rejections recorded across the run with reasons: renaming the removal plan's P-scale (would break the shared triage vocabulary); an include system for the repeated prose (heavier than the lint it replaces); per-file playbook validation (operator decision already recorded); reviving the retired benchmark lane (round one's rejection stands); editing legacy compatibility hooks (they are documented helpers, not live gates). NEW, P2 (proposal inventory).

## Questions Answered

- Key question 10's material is assembled: the ideas, the rejections, and the finding set the ranked table needs. The synthesis performs the ranking itself.

## Questions Remaining

- None within the iteration budget; iteration 20 is the consolidation pass before phase synthesis.

## Ruled Out

- **"File the README's validator command."** Its row passes `--type readme` correctly [SOURCE: .skilled/skills/sk-code/sk-code-review/README.md:200]; only the playbook row lacks a type, already filed with f-iter009-002.
- **"Re-file the stale-name family per packet."** Counted once here for the README; the fix is one sweep.
- **"Rank the ideas here."** Ranking belongs to the synthesis; this iteration only inventoried them.

## Dead Ends

- The README's related-skills table and FAQ agree with the SKILL on deep-review's boundary; no drift there.
- The quality playbook's single scenario file (`quality-gate/quality-checklist.md`) was spot-checked and names only shipped scripts; no finding.

## Edge Cases

- Ambiguous input: whether the README example is normative or illustrative. Chosen interpretation: it is the canonical example a reader copies; the token mismatch is filed.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/README.md`
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/` (folder listing)
- `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/iterations/iteration-001.md` through `iteration-018.md` (proposal and ruled-out extraction)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.85 (three fully new findings from the last unread file, one proposal inventory).
- Questions addressed: key question 10's material.
- Questions answered: none fully.

## Reflection

- What worked and why: treating the last unread operator-facing file as its own iteration. Three findings came from one file because nothing before it had applied the same checks to it.
- What did not work and why: the ideas inventory had to be re-extracted from eighteen iterations; a running ideas file would have made it a copy.
- What I would do differently: keep a running proposal list from iteration 1, as the strategy's next-focus field suggests.

## Recommended Next Focus

Iteration 20: the consolidation pass — re-map every finding to its current line references, resolve the classifications for the ranked table, and stage the synthesis inputs.
