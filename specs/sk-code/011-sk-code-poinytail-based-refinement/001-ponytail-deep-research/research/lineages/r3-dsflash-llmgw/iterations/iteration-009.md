# Iteration 9: The review playbook against the files it tests

## Focus

Part 2, fourth slice: the review playbook. Do its thirty scenario files match the index that claims them, do the intra-routing scenarios' declared resources match the mode's router, and does the playbook's own documented validation command actually validate it? This follows iteration 8's Recommended Next Focus.

## Actions Taken

1. Extracted every scenario heading and catalog row from `manual-testing-playbook.md` and compared them with the files on disk.
2. Checked the declared ID space against the headings, the wave plan and the catalog.
3. Dumped the seven `intra-routing-recall` scenario frontmatter `expected_resources` blocks and compared them with the mode's `DEFAULT_RESOURCES` and `RESOURCE_MAP`.
4. Read `CR-023` and `CR-024` end to end as the two scenarios nearest the recently changed contract.
5. Ran the exact validation command the mode's §8 documents, read its output and exit status.

## Findings

1. **The playbook's ID space claims a scenario that does not exist.** The evidence-ledger field rules say `Scenario ID` must be "One of CR-001..CR-024 or CR-R01..CR-R07" [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md:152], and the wave plan leaps from CR-018 to CR-020 [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md:203]. No scenario, heading, catalog row or file defines CR-019: `rg -n "CR-019"` across the playbook exits 1, while the thirty headings cover 23 CR IDs plus seven CR-R IDs. An operator writing a ledger row for a missing scenario-ID range believes CR-019 is available; a reader auditing coverage cannot tell whether 019 was deleted or never existed. Reproducing case: `rg -n "CR-019" .skilled/skills/sk-code/sk-code-review/manual-testing-playbook` exits 1, and `rg -c "### CR-" .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` prints 30, not the 31 IDs the range implies. NEW, P2 (index-versus-files drift; one range fix or one retired-ID note closes it).
2. **The playbook's own documented validation runs under the wrong rule set.** The mode tells operators to validate the playbook with `validate_document.py manual-testing-playbook/manual-testing-playbook.md` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:473]. Run exactly, the validator answers `VALID` with one warning: "No document type rule matched …, so README rules were applied. Pass `--type` to choose the rule set." [observed command output]. So the structural check the scenario authors rely on never applies a playbook-specific rule set; a playbook defect that README rules do not model passes silently. Reproducing case: the documented command prints the `document_type_fallback` warning on the shipped playbook. NEW, P2 (validation-chain gap, not a playbook content defect; a `--type` argument or a rule-set mapping fixes it).
3. **The catalog, the files and the intra-routing resource declarations all agree.** The catalog lists thirty rows and each links to a file that exists; the two nearest-contract scenarios (`CR-023` depth alias, `CR-024` rule-invariant canary) describe the live §9.3 alias and the live checker pair including the final-line checker [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/rule-invariant-canary.md:71]; and all seven `intra-routing-recall` scenarios declare `DEFAULT_RESOURCES` plus exactly the intent's checklist — SECURITY riding the default security checklist, SOLID adding `assets/solid-checklist.md`, REMOVAL adding `assets/removal-plan.md`, TESTING adding `assets/test-quality-checklist.md` [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/solid.md:8] [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/removal.md:8] [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/testing.md:8], matching `DEFAULT_RESOURCES` and `RESOURCE_MAP` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:131] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:153]. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- Key question 6's playbook leg is answered: the scenario set matches the files and the router; the two defects found are in the index's ID bookkeeping and in the validation command, both filed.

## Questions Remaining

- What do the review scripts do on foreign-repository inputs?

## Ruled Out

- **"File the two 'Internal design notes' rows in the automated cross-reference as dead links."** They are explicitly labelled notes, not paths, and the section states the repository has no dedicated automated module; nothing resolves from them by design.
- **"Treat the catalog's `../manual-testing-playbook/` link prefix as broken."** It resolves back into the same folder; redundant but correct.
- **"Re-validate every scenario file."** The playbook's documented sweep is the root only, matching the validator's own limitation note; per-file validation is a recorded operator decision.

## Dead Ends

- `CR-016..CR-018` reference external CLI availability; their content was not exercised because no CLI dispatch is in this line's scope.
- The wave plan's category grouping matches the catalog's categories one for one; no orphan category.

## Edge Cases

- Ambiguous input: whether CR-019 was retired or never assigned. The playbook records neither; the finding names both possibilities and asks for one line of bookkeeping.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/rule-invariant-canary.md`
- `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/review-depth-alias.md`
- `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/{security,quality,kiss,dry,solid,removal,testing}.md`
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/skills/sk-doc/scripts/validate_document.py` (run, read-only)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.85 (two fully new findings, one ALREADY-ADOPTED agreement matrix).
- Questions addressed: key question 6 (playbook leg closed).
- Questions answered: key question 6's playbook leg.

## Reflection

- What worked and why: running the documented command instead of reading the command. The `document_type_fallback` warning is the kind of defect that only exists in execution.
- What did not work and why: counting IDs from the heading list first suggested 31 scenarios; the file count corrected it, which is what exposed the CR-019 gap.
- What I would do differently: reconcile the claimed ID range against headings and files in one step at the start of any playbook review.

## Recommended Next Focus

The review scripts: what they do on foreign-repository inputs and whether their own README matches their behaviour.
