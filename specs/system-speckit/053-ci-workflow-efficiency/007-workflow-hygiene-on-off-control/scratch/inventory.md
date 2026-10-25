| workflow | job | name | timeout | if | group |
|---|---|---|---|---|---|
| advisory-checks.yml | advisory | Advisory — test suites and doc-model references |  |  | SKILLED_CI_FRESHNESS |
| agent-mirror-sync.yml | agent-mirror-sync | Agent runtime mirrors stay in sync |  |  | SKILLED_CI_REVIEW |
| changed-packet-validation.yml | changed-packets | Spec packets touched by this PR validate clean |  |  | SKILLED_CI_FRESHNESS |
| chart-corpus.yml | corpus | Corpus contract and its mutation suite |  |  | SKILLED_CI_TESTS |
| command-tree-parity.yml | command-tree-parity | OpenCode and Claude command trees stay identical |  |  | SKILLED_CI_TESTS |
| command-tree-parity.yml | hermes-mirror | Hermes skill and prompt copies match their sources |  |  | SKILLED_CI_TESTS |
| comment-hygiene.yml | comment-hygiene | No ephemeral-artifact pointers in code comments |  |  | SKILLED_CI_REVIEW |
| deep-loop-runtime.yml | deep-loop-runtime | Deep-loop runtime vitest suites | timeout-minutes: 45 |  | SKILLED_CI_TESTS |
| dependabot-auto-merge.yml | auto-merge | Auto-merge Dependabot security patch updates |  | if: github.event.pull_request.user.login == 'dependabot[bot]' | none |
| diagram-corpus.yml | corpus | Corpus contract, its mutation suite and both applicator gates |  |  | SKILLED_CI_TESTS |
| dispatch-enforcement-guard.yml | dispatch-enforcement-guard | Every declared dispatch rule is reachable and discriminates |  |  | SKILLED_CI_FRESHNESS |
| dispatch-enforcement-guard.yml | hooks-vitest | Every hook vitest suite passes |  |  | SKILLED_CI_FRESHNESS |
| gate-inputs.yml | gate-inputs | Every gate input resolves under both source roots |  |  | SKILLED_CI_FRESHNESS |
| markdown-link-integrity.yml | markdown-link-integrity | No broken markdown links in skills/commands/agents |  |  | SKILLED_CI_TESTS |
| message-contract.yml | message-contract | Commit messages, branch names and PR description follow the templates |  |  | SKILLED_CI_MESSAGES |
| naming-standard-guard.yml | naming-standard | Enforce kebab-case filesystem names |  |  | SKILLED_CI_FRESHNESS |
| opencode-dual-version.yml | battery | Battery on OpenCode ${{ matrix.family }} | timeout-minutes: 30 |  | SKILLED_CI_TESTS |
| opencode-dual-version.yml | both | Both versions installed at once | timeout-minutes: 30 |  | SKILLED_CI_TESTS |
| opencode-plugin-tests.yml | plugin-and-hook-tests | OpenCode plugin and hook node:test suites | timeout-minutes: 40 |  | SKILLED_CI_TESTS |
| pi-extension-tests.yml | discover | Discover extensions |  |  | SKILLED_CI_TESTS |
| pi-extension-tests.yml | pi-extension | ${{ matrix.extension }} tests |  |  | SKILLED_CI_TESTS |
| playbook-operator-contract.yml | operator-contract | Manual-testing-playbook operator-scenario contract |  |  | SKILLED_CI_FRESHNESS |
| prompt-card-sync.yml | card-sync | Prompt-knowledge drift guard |  |  | SKILLED_CI_REVIEW |
| repo-rules-corpus.yml | repo-rules-corpus | Repo-rules corpus stays in sync |  |  | SKILLED_CI_TESTS |
| routing-registry-drift.yml | routing-drift | Registry == advisor maps; compiled-routing freshness; parent-skill structure |  |  | SKILLED_CI_TESTS |
| routing-registry-drift.yml | golden-prompt-gate | Gate-2 golden prompts — real scorer top-1/top-3 + joined compiled mode |  |  | SKILLED_CI_TESTS |
| rule-canary-sync.yml | rule-canary | Load-bearing rule wording stays in sync across copies |  |  | SKILLED_CI_FRESHNESS |
| runtime-no-spec-import.yml | no-spec-import | No runtime require/import from .opencode/specs |  |  | SKILLED_CI_TESTS |
| sk-code-script-tests.yml | sk-code-scripts | sk-code script tests |  |  | SKILLED_CI_TESTS |
| sk-doc-rename-harness.yml | rename-harness | Rename tooling fixture harness | timeout-minutes: 30 |  | SKILLED_CI_TESTS |
| sk-doc-script-tests.yml | sk-doc-scripts | sk-doc script tests |  |  | SKILLED_CI_FRESHNESS |
| sk-doc-script-tests.yml | catalog-packages | Feature catalog packages validate |  |  | SKILLED_CI_FRESHNESS |
| sk-doc-script-tests.yml | citation-drift | No new broken citations |  |  | SKILLED_CI_FRESHNESS |
| sk-git-script-tests.yml | sk-git-scripts | sk-git script tests |  |  | SKILLED_CI_TESTS |
| skill-advisor-stress.yml | skill-advisor-stress | Skill advisor stress suite | timeout-minutes: 20 |  | SKILLED_CI_TESTS |
| skill-doc-frontmatter.yml | frontmatter-coverage | Skill reference/asset frontmatter contract |  |  | SKILLED_CI_TESTS |
| skill-doc-frontmatter.yml | doc-version-raise | Changed skill docs raise their version |  | if: github.event_name == 'pull_request' | SKILLED_CI_TESTS |
| spec-kit-check.yml | check | Typecheck, import policy and test suites for the spec-kit packages |  |  | SKILLED_CI_TESTS |
| spec-kit-check.yml | mirrors | Runtime mirrors agree with their sources |  |  | SKILLED_CI_TESTS |
| spec-kit-check.yml | doctor-scripts | Doctor script test suites |  |  | SKILLED_CI_TESTS |
| strict-pass-freshness-report.yml | strict-pass-freshness |  |  |  | SKILLED_CI_REPORTS |
| trigger-index-rebuild.yml | rebuild | Rebuild the trigger index |  | if: "${{ !endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci') }}" | SKILLED_CI_REPORTS |
| trigger-index-rebuild.yml | push | Push the trigger index rebuild |  | if: needs.rebuild.outputs.committed == 'true' | SKILLED_CI_REPORTS |

tree: 32 files, 43 jobs
hooks-node-tests: merged into opencode-plugin-tests.yml
