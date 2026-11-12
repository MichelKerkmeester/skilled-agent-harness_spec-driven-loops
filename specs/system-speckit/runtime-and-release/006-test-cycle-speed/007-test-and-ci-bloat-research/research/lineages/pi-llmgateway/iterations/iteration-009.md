# Iteration 9: Where the minutes actually are — the top six workflows are 58% of a sweep

## Focus

The remaining CI guard cluster, ranked against the whole sweep. The question is not which guards exist but which cut moves the needle: a guard that costs 10 s is irrelevant even if it is pure duplication, and the ranking in synthesis has to reflect that. Key question 1, second half.

## Actions Taken

1. Summed the per-workflow mean seconds recorded in the packet's `spec.md` table and split the total into the six largest and the ten smallest.
2. Read the run steps of `message-contract.yml`, `naming-standard-guard.yml`, `skill-doc-frontmatter.yml`, `changed-packet-validation.yml`, `markdown-link-integrity.yml` and `rule-canary-sync.yml`.
3. Read `playbook-operator-contract.yml` end to end to test whether its two validation passes duplicate each other.
4. Read `naming-standard-guard.yml:30-62` for its install and test steps.

## Findings

1. The 21 workflows with recorded runs sum to about 4,129 s of mean wall clock per sweep. The six largest (`Spec-Kit Check` 595, `Deep-Loop Runtime Tests` 472, `Skill Advisor Stress Tests` 457, `CodeQL` 319, `sk-doc Script Tests` 279, `OpenCode Plugin Tests` 255) are 2,377 s, or 58% of the total. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:81] [INFERENCE: based on summing the mean seconds in that table]

2. The ten small guards together — naming 148, message contract 135, dispatch 125, changed packet 119, command tree parity 108, playbook 108, markdown links 75, skill-doc frontmatter 66, runtime no-spec-import 66, rule canary 10 — are about 960 s, 23% of the sweep. Deleting all ten would save less than one `Spec-Kit Check` run, so no ranking that starts with these can be right. [INFERENCE: based on the same table]

3. `message-contract.yml` is the clearest hook duplicate: it runs the same validator the pre-push gate runs, three ways (a rev-list range, a branch rule, and `--explain`) plus the validator's own `node --test` suite. Its 135 s buys only the uninstalled-hook case. [SOURCE: .github/workflows/message-contract.yml:45] [SOURCE: .github/workflows/message-contract.yml:48]

4. `naming-standard-guard.yml` installs `pytest==8.4.2` with pip on every run to execute two Python test files, then runs a Python checker that rejects only newly introduced snake_case names. It is the only workflow in the repository that installs a test framework at run time, and its pip cache key points at the workflow file itself rather than at the tests it installs for. [SOURCE: .github/workflows/naming-standard-guard.yml:37] [SOURCE: .github/workflows/naming-standard-guard.yml:58]

5. `playbook-operator-contract.yml` validates the playbook fleet twice — once `--strict` for the contract and once `--no-strict --format json` to assert every fail-closed root is still discovered. The second pass is not redundancy: its comment explains that a root the scan cannot see cannot fail, so absence would read as a pass. The two passes can be merged into one `--strict --format json` run, which saves one Node start rather than a meaningful amount. [SOURCE: .github/workflows/playbook-operator-contract.yml:72] [SOURCE: .github/workflows/playbook-operator-contract.yml:79]

6. `CodeQL` at 319 s is a third-party security baseline, not repository bloat: it runs a standard analyzer over the tree. Any time-ranked cut list must exclude it, or the first recommendation becomes "delete the security scan". [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:81] [INFERENCE: based on CodeQL having no workflow file under .github/workflows, so its configuration lives on the repository settings rather than in this tree]

## Ruled Out

- Ranking the small guards as the primary cuts: 23% of the sweep combined, and several of them cover the uninstalled-hook case that no other path covers.
- Merging the guard workflows into one job: workflow consolidation is settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` and is not re-opened here.
- Treating `CodeQL` as a cut candidate.

## Dead Ends

- Estimating per-step savings inside a workflow from its mean. The means include queue time, so a step-level number cannot be read from them.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the guard cluster is where the duplication with hooks lives, yet it is also the cheapest part of the sweep. Both are true: duplication is a maintenance finding, cost is a workflow finding, and the synthesis must keep them apart.
- Missing dependencies: four workflows (`comment-hygiene`, `agent-mirror-sync`, `prompt-card-sync`, `dependabot-auto-merge`) have no recorded runs in the sampled window, so their absence from the table is not evidence that they are cheap.
- Partial success: the sum and split are arithmetic on recorded means; the individual step costs inside them are not.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:81` (run-time table)
- `.github/workflows/message-contract.yml`
- `.github/workflows/naming-standard-guard.yml`
- `.github/workflows/playbook-operator-contract.yml`
- `.github/workflows/skill-doc-frontmatter.yml`
- `.github/workflows/changed-packet-validation.yml`
- `.github/workflows/markdown-link-integrity.yml`
- `.github/workflows/rule-canary-sync.yml`

## SCOPE VIOLATIONS

None.

## Assessment

- New information ratio: 0.82
- Questions addressed: "Which CI workflows duplicate a local git hook check or another workflow, and how many seconds per run would deleting or merging them save?"
- Questions answered: the workflow-cost half of that question — the sweep total, the top-six share and the small-guard ceiling are now arithmetic rather than impression.

## Reflection

- What worked and why: summing the recorded means before reading any workflow. It inverted the natural order of investigation: the most duplicated guards turned out to be the least valuable to cut, and the expensive workflows contain little duplication.
- What did not work and why: looking for a big single duplication inside the large workflows. Their cost is test volume and installs, not repeated checks.
- What I would do differently: sum the table in iteration 1, because it would have redirected every iteration after it.

## Recommended Next Focus

Assemble the ranked cut list: every candidate with its file path, its class (delete, merge, narrow, move), its estimated minutes per commit, push or run, the regression it would stop catching, and its evidence confidence — then check the list for double counting before synthesis.
