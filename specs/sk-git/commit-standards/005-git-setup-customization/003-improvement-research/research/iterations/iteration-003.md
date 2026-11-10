# Iteration 3: Command and skill documentation drift

## Focus

Q4: Where do git.md, _routes.yaml, doctor-git-setup.yaml, doctor-git-presentation.txt, the sk-git SKILL.md, feature catalog and DOC-384 drift from the script's actual behavior, and which test gaps leave that behavior unguarded? The strategy names Q4 as the next focus. [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/deep-research-strategy.md:104]

## Actions Taken

- Read the run config, state log, strategy, registry and prior iteration before selecting Q4. The log contains iterations 1 and 2.
- Compared the router, route manifest, setup workflow, presentation contract, skill summary, feature playbook and DOC-384 with the setup battery and its process tests.
- Checked the process tests for the UNKNOWN result path and for assertions that bind the route/presentation contract to script behavior.
- Did not run tests or validation; this dispatch prohibits tests that write into the repository and explicitly prohibits validate.sh.

## Findings

1. **Rank 1 — P1, high impact, low effort: the aggregate result treats UNKNOWN-only runs as healthy.** The setup workflow says exit 0 means all checks pass. The battery catches a thrown check as UNKNOWN, but the human summary and process exit consider only whether any row is FAIL. An UNKNOWN-only report can therefore end with STATUS=OK and exit 0. The tests assert exit status from the presence of FAIL and cover all-pass and FAIL examples, but not UNKNOWN without FAIL. Change the aggregate result to distinguish uncertainty from success and add this edge case. [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:52] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:651] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:658] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:684] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:686] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:753] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:759] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:152] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:164]

2. **Rank 2 — P1, medium-high impact, medium effort: the workflow promises adapter registration that two adapter branches do not verify.** The workflow says every configured AI-tool adapter registers the advisory. For OpenCode and Pi, the battery reports registered as soon as an adapter file exists; it does not read the file contents. The current adapter tests exercise Codex and Cursor registration, not these two presence-only branches. Either verify their runtime-specific registration shape and test malformed or unrelated files, or narrow the workflow claim to file presence. [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:41] [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:49] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:597] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:604] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:606] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:329] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:342] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:357]

3. **Rank 3 — P2, medium impact, low effort: the shared setup dashboard labels setup as mutating.** Its template unconditionally says “Mutation class: mutates,” while the setup route is marked read-only in the route manifest and its workflow. The setup panel can therefore tell users the wrong mutation class. Render the selected route's class and add a small presentation-contract assertion for setup. [SOURCE: .skilled/commands/doctor/assets/doctor-git-presentation.txt:89] [SOURCE: .skilled/commands/doctor/_routes.yaml:275] [SOURCE: .skilled/commands/doctor/_routes.yaml:280] [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:15] [SOURCE: .skilled/commands/doctor/git.md:10] [SOURCE: .skilled/commands/doctor/git.md:89]

4. **Rank 4 — P2, medium impact, low effort: DOC-384's precondition does not support its all-PASS expectation.** The scenario requires only a working copy with hooks installed, then explicitly runs with --tool claude and expects every row to pass. The battery marks the explicitly active tool as broken when its adapter file is absent. The scenario can thus fail correctly in a checkout that meets its stated precondition. Require the active and configured adapters to be registered, or accept valid FAIL rows as captured results. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:26] [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:28] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:597] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:601] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:329] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:335]

## Questions Answered

- Q4: Where do git.md, _routes.yaml, doctor-git-setup.yaml, doctor-git-presentation.txt, the sk-git SKILL.md, feature catalog and DOC-384 drift from the script's actual behavior, and which test gaps leave that behavior unguarded?

The command router and skill summary correctly describe setup as read-only, and the route manifest and YAML agree on that contract. The drift found here is in the presentation panel and the adapter/status claims above. [SOURCE: .skilled/commands/doctor/git.md:10] [SOURCE: .skilled/commands/doctor/git.md:89] [SOURCE: .skilled/skills/sk-git/SKILL.md:261] [SOURCE: .skilled/skills/sk-git/SKILL.md:266] [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md:17] [SOURCE: .skilled/commands/doctor/_routes.yaml:280] [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:15]

## Questions Remaining

- Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix?
- Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests?

## Sources Consulted

- .skilled/commands/doctor/git.md
- .skilled/commands/doctor/_routes.yaml
- .skilled/commands/doctor/assets/doctor-git-setup.yaml
- .skilled/commands/doctor/assets/doctor-git-presentation.txt
- .skilled/commands/doctor/scripts/git-setup-check.cjs
- .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs
- .skilled/skills/sk-git/SKILL.md
- .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md
- .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md

## Assessment

- New information ratio: 0.75 (two fully new findings, two partially new findings).
- Questions answered: Q4.
- Questions remaining: Q3 and Q5.
- Status: complete for this iteration; CI tests were not run under the dispatch constraint.

## Reflection

Reading the presentation template against the route manifest exposed a static mutation label that the script test suite cannot catch. Comparing the workflow wording to the adapter branches exposed a stronger mismatch: file presence is reported as registration for OpenCode and Pi. The main remaining verification gap is the UNKNOWN-only aggregate path; the process tests mirror the existing FAIL-based status rule and do not independently challenge it.

## Recommended Next Focus

Investigate Q3 next: verify each suggested repair against the state it claims to fix, prioritize repairs that are destructive or target the wrong scope, and confirm each candidate against its producer. [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/deep-research-strategy.md:17]

## Next Focus

Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix? [SOURCE: specs/sk-git/033-git-setup-customization/003-improvement-research/research/deep-research-strategy.md:17]
