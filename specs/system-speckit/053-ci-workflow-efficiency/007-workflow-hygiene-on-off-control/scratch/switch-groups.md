# Switch group assignment

Source: the push-versus-pull-request table in `.github/workflows/README.md` (rows at the guards, naming, gate-inputs, path-filtered, changed-packet, review-time, report and rebuild lines). The master switch `SKILLED_CI` sits on every switched job beside one group variable. `off` is the only disable token; an unset variable runs the job. `dependabot-auto-merge.yml` has no group and no switch on either of its jobs.

Read from the tree on the phase's start commit: 32 workflow files, 43 jobs before the Dependabot split, 42 jobs that take a switch (the split adds one unswitched job, so the phase ends at 44 jobs).

| Variable | README row | Workflow files | Files | Jobs |
|---|---|---|---|---|
| SKILLED_CI_FRESHNESS | guards, naming, gate-inputs, changed-packet | advisory-checks.yml, dispatch-enforcement-guard.yml, playbook-operator-contract.yml, rule-canary-sync.yml, sk-doc-script-tests.yml, naming-standard-guard.yml, gate-inputs.yml, changed-packet-validation.yml | 8 | 11 |
| SKILLED_CI_TESTS | path-filtered | chart-corpus.yml, command-tree-parity.yml, deep-loop-runtime.yml, diagram-corpus.yml, markdown-link-integrity.yml, opencode-dual-version.yml, opencode-plugin-tests.yml, pi-extension-tests.yml, repo-rules-corpus.yml, routing-registry-drift.yml, runtime-no-spec-import.yml, sk-code-script-tests.yml, sk-doc-rename-harness.yml, sk-git-script-tests.yml, skill-advisor-stress.yml, skill-doc-frontmatter.yml, spec-kit-check.yml | 17 | 24 |
| SKILLED_CI_REVIEW | review-time | agent-mirror-sync.yml, comment-hygiene.yml, prompt-card-sync.yml | 3 | 3 |
| SKILLED_CI_REPORTS | report and rebuild | strict-pass-freshness-report.yml, trigger-index-rebuild.yml | 2 | 3 |
| SKILLED_CI_MESSAGES | message contract | message-contract.yml | 1 | 1 |

Exempt: dependabot-auto-merge.yml (1 file, 1 job before the split, 2 after).

Totals: 8 + 17 + 3 + 2 + 1 = 31 switched files plus the exempt file = 32; 11 + 24 + 3 + 3 + 1 = 42 switched jobs plus 1 exempt job = 43.

## Deviation from the plan's expected counts

The plan expected FRESHNESS 9 files and 13 jobs and TESTS 16 and 22. The README table (and the requirement that follows it) puts `skill-doc-frontmatter.yml` (2 jobs) in the path-filtered row, which is TESTS, so the tree gives FRESHNESS 8 and 11, TESTS 17 and 24. The sums match the plan (25 files and 35 jobs across the two groups), so only the placement of that one file differs. The README table stays the authority.

## Correction recorded in the switch pass

The deviation note above names the wrong file. The plan's 9 and 13 for FRESHNESS and 16 and 22 for TESTS come from the task list, where `skill-doc-frontmatter.yml` already sits in TESTS (its two switch tasks both use `SKILLED_CI_TESTS`). The file that differs is `command-tree-parity.yml` (2 jobs): the task for it names `SKILLED_CI_FRESHNESS`, while the README table's path-filtered row lists it, so this mapping puts it in TESTS. The switch pass follows this mapping and the README. The other gap is `chart-corpus.yml` (1 job): it is in the TESTS row and in the path-filtered README row, and no switch task names it, so the pass added its TESTS switch without a task of its own.

Observed in the tree after the switch pass: FRESHNESS 8 files and 11 jobs, TESTS 17 and 24, REVIEW 3 and 3, REPORTS 2 and 3, MESSAGES 1 and 1, which is 42 switched jobs.
