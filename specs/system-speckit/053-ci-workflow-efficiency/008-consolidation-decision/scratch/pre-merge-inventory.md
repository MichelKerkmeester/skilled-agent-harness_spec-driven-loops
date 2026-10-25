# Pre-merge inventory

| workflow | job | name | trigger | job-if | timeout |
|---|---|---|---|---|---|
| `advisory-checks.yml` | `advisory` | Advisory - test suites and doc-model references | pull_request,push,workflow_dispatch | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 28 |
| `changed-packet-validation.yml` | `changed-packets` | Spec packets touched by this PR validate clean | pull_request,push | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |
| `command-tree-parity.yml` | `command-tree-parity` | OpenCode and Claude command trees stay identical | pull_request,push,workflow_dispatch | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off' | 10 |
| `command-tree-parity.yml` | `hermes-mirror` | Hermes skill and prompt copies match their sources | pull_request,push,workflow_dispatch | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off' | 10 |
| `dispatch-enforcement-guard.yml` | `dispatch-enforcement-guard` | Every declared dispatch rule is reachable and discriminates | pull_request,push,workflow_dispatch | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |
| `dispatch-enforcement-guard.yml` | `hooks-vitest` | Every hook vitest suite passes | pull_request,push,workflow_dispatch | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |
| `gate-inputs.yml` | `gate-inputs` | Every gate input resolves under both source roots | pull_request,push,workflow_dispatch | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |
| `message-contract.yml` | `message-contract` | Commit messages, branch names and PR description follow the templates | pull_request,push | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_MESSAGES != 'off' | 20 |
| `playbook-operator-contract.yml` | `operator-contract` | Manual-testing-playbook operator-scenario contract | pull_request,push,schedule,workflow_dispatch | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |
| `rule-canary-sync.yml` | `rule-canary` | Load-bearing rule wording stays in sync across copies | pull_request,push | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |
| `sk-doc-script-tests.yml` | `sk-doc-scripts` | sk-doc script tests | pull_request,push | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |
| `sk-doc-script-tests.yml` | `catalog-packages` | Feature catalog packages validate | pull_request,push | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |
| `sk-doc-script-tests.yml` | `citation-drift` | No new broken citations | pull_request,push | vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off' | 10 |

tree: 9 workflows, 13 jobs

The `advisory` job name carries an em dash in the YAML; it is shown here as a hyphen.
