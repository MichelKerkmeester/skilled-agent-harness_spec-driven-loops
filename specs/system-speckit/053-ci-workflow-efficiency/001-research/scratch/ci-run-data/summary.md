# CI run-cost dataset

Collected 2026-10-23T06:47:49.174Z with gh run list / gh run view --json jobs (raw files beside this one).
Recent window: 1000 runs over 23.5 h (2026-10-22T07:07:25Z to 2026-10-23T06:35:03Z).
Per-workflow medians come from the 40 latest runs (wall) and the 5 latest completed runs (jobs). Billed minutes = sum over non-skipped jobs of ceil(job seconds / 60), the GitHub rounding rule. Estimated total: 3812 billed min/day.

| Workflow file | Runs in window | Median wall s | Median job-min | Median billed min | Est. billed min/day | Events (last 40) | Conclusions | Sample run ids |
|---|---|---|---|---|---|---|---|---|
| spec-kit-check.yml | 50 | 1178 | 23.9 | 25 | 1279 | push:40 | success:39 | 39910111430 39909844384 39901840569 39899611470 39899002589 |
| sk-doc-script-tests.yml | 73 | 199 | 5 | 6 | 448 | push:40 | success:40 | 39912381977 39912170786 39910111336 39909844360 39901840585 |
| command-tree-parity.yml | 73 | 76 | 2.3 | 4 | 299 | push:40 | success:40 | 39912382147 39912170577 39910111451 39909844400 39901840613 |
| dispatch-enforcement-guard.yml | 73 | 79 | 2.3 | 4 | 299 | push:40 | success:40 | 39912381887 39912170500 39910111587 39909844456 39901840561 |
| hooks-node-tests.yml | 61 | 201 | 3.2 | 4 | 250 | push:40 | success:40 | 39912381951 39910111374 39909844431 39901840551 39899611575 |
| opencode-plugin-tests.yml | 61 | 142 | 2.3 | 3 | 187 | push:40 | success:40 | 39912382087 39910111437 39909844432 39901840615 39899611481 |
| changed-packet-validation.yml | 73 | 100 | 1.5 | 2 | 149 | push:40 | success:40 | 39912381860 39912170536 39910111307 39909844277 39901841196 |
| gate-inputs.yml | 73 | 104 | 1.7 | 2 | 149 | push:40 | success:40 | 39912381844 39912170480 39910111300 39909844383 39901840701 |
| message-contract.yml | 73 | 82 | 1.3 | 2 | 149 | push:40 | success:40 | 39912382045 39912170583 39910111533 39909844339 39901840676 |
| playbook-operator-contract.yml | 73 | 81 | 1.3 | 2 | 149 | push:40 | success:40 | 39912381959 39912170580 39910111367 39909844592 39901840689 |
| rule-canary-sync.yml | 73 | 80 | 1.3 | 2 | 149 | push:40 | success:40 | 39912382100 39912170695 39910111461 39909844439 39901840612 |
| advisory-checks.yml | 73 | 65 | 1 | 1 | 75 | push:40 | success:40 | 39912381861 39912170725 39910111345 39909844372 39901840620 |
| opencode-dual-version.yml | 7 | 194 | 7 | 9 | 64 | push:31 pull_request:9 | success:39 failure:1 | 39909844429 39898821046 39877603254 39858029403 39843480114 |
| deep-loop-runtime.yml | 5 | 690 | 11.5 | 12 | 61 | push:33 pull_request:7 | success:27 failure:13 | 39909844320 39877603319 39858029393 39843480132 39782205245 |
| markdown-link-integrity.yml | 49 | 70 | 1 | 1 | 50 | push:40 | success:40 | 39912381995 39910111621 39909844373 39901840655 39899611439 |
| routing-registry-drift.yml | 6 | 201 | 4.6 | 5 | 31 | push:35 pull_request:5 | success:39 failure:1 | 39877603372 39858029397 39843479991 39819175964 39815869307 |
| skill-doc-frontmatter.yml | 7 | 59 | 0.9 | 1 | 7 | push:40 | success:40 | 39909844448 39898821116 39877603360 39858029359 39843479739 |
| sk-doc-rename-harness.yml | 2 | 172 | 2.8 | 3 | 6 | push:33 pull_request:7 | success:40 | 39797243161 39782205191 39637171722 39578213116 39526699911 |
| runtime-no-spec-import.yml | 5 | 72 | 0.6 | 1 | 5 | push:33 pull_request:7 | success:40 | 39877603376 39858029728 39843480032 39815869206 39782736836 |
| sk-code-script-tests.yml | 2 | 107 | 1 | 2 | 4 | push:5 pull_request:5 | success:10 | 39815587890 39782205075 39578213161 39512563089 39479558537 |
| agent-mirror-sync.yml | 0 | 94 | 1.6 | 2 | 0 | pull_request:40 | success:40 | 39578213261 39516104490 39510066807 39510056607 39509019035 |
| chart-corpus.yml | 0 | 104 | 1.3 | 2 | 0 | pull_request:11 push:29 | success:39 failure:1 | 39578213247 39462324636 39424040542 39406017109 39390303154 |
| comment-hygiene.yml | 0 | 76 | 1.2 | 2 | 0 | pull_request:40 | success:40 | 39578213197 39516104410 39510066717 39510056500 39509018956 |
| dependabot-auto-merge.yml | 0 | 27 | 0.1 | 1 | 0 | pull_request:27 | success:27 | 39578213432 39516104669 39510066521 39510056471 39509018894 |
| diagram-corpus.yml | 0 | 114 | 1 | 2 | 0 | push:29 pull_request:11 | success:28 failure:12 | 39611546340 39578213134 39462324448 39424040505 39406017176 |
| naming-standard-guard.yml | 0 | 92 | 1.5 | 2 | 0 | pull_request:30 push:10 | success:40 | 39578213244 39516104690 39510066629 39510056359 39509018844 |
| pi-extension-tests.yml | 0 | 203 | 2.4 | 3 | 0 | pull_request:6 push:2 | success:8 | 39578213389 39516104409 39510056463 39509009884 39508434074 |
| prompt-card-sync.yml | 0 | 58 | 0.9 | 1 | 0 | pull_request:40 | success:40 | 39578213271 39516104468 39510066595 39510056524 39509018867 |
| repo-rules-corpus.yml | 0 | 77 | 1.4 | 2 | 0 | push:19 | success:17 failure:2 | 38363499132 38206184543 38074353399 37633711105 37621940098 |
| sk-git-script-tests.yml | 0 | 70 | 1 | 1 | 0 | push:6 pull_request:5 | success:11 | 39631215313 39578213202 39516104733 39515394430 39510056523 |
| skill-advisor-stress.yml | 0 | 115 | 1.9 | 2 | 0 | push:29 pull_request:7 | success:26 failure:10 | 39636944064 39578213355 39564216421 39554313820 39524217211 |
| strict-pass-freshness-report.yml | 0 | 2577 | 42.8 | 43 | 0 | schedule:8 workflow_dispatch:1 | success:8 failure:1 | 39200485518 38205330444 37783711329 37265804421 36378725834 |
| trigger-index-rebuild.yml | 73 | 103 | 0 | 0 | 0 | push:40 | skipped:20 success:20 | 39912381915 39912170542 39910111438 39909844393 39901840525 |

## Median job seconds per workflow

- **spec-kit-check.yml**: Typecheck, import policy and test suites for the spec-kit packages 1215s; Runtime mirrors agree with their sources 62s; Doctor script test suites 163s
- **sk-doc-script-tests.yml**: No new broken citations 77s; Feature catalog packages validate 56s; sk-doc script tests 167s
- **command-tree-parity.yml**: Hermes skill and prompt copies match their sources 69s; OpenCode and Claude command trees stay identical 70s
- **dispatch-enforcement-guard.yml**: Every declared dispatch rule is reachable and discriminates 72s; Every hook vitest suite passes 69s
- **hooks-node-tests.yml**: Hook node:test suites 194s
- **opencode-plugin-tests.yml**: OpenCode plugin tests 138s
- **changed-packet-validation.yml**: Spec packets touched by this PR validate clean 92s
- **gate-inputs.yml**: Every gate input resolves under both source roots 101s
- **message-contract.yml**: Commit messages, branch names and PR description follow the templates 78s
- **playbook-operator-contract.yml**: Manual-testing-playbook operator-scenario contract 76s
- **rule-canary-sync.yml**: Load-bearing rule wording stays in sync across copies 78s
- **advisory-checks.yml**: Advisory — test suites and doc-model references 60s
- **opencode-dual-version.yml**: Battery on OpenCode v2 156s; Both versions installed at once 148s; Battery on OpenCode v1 127s
- **deep-loop-runtime.yml**: Deep-loop runtime vitest suites 688s
- **markdown-link-integrity.yml**: No broken markdown links in skills/commands/agents 59s
- **routing-registry-drift.yml**: Registry == advisor maps; compiled-routing freshness; parent-skill structure 103s; Gate-2 golden prompts — real scorer top-1/top-3 + joined compiled mode 178s
- **skill-doc-frontmatter.yml**: Skill reference/asset frontmatter contract 55s; Changed skill docs raise their version 0s
- **sk-doc-rename-harness.yml**: Rename tooling fixture harness 169s
- **runtime-no-spec-import.yml**: No runtime require/import from .opencode/specs 35s
- **sk-code-script-tests.yml**: sk-code script tests 62s
- **agent-mirror-sync.yml**: Agent runtime mirrors stay in sync 95s
- **chart-corpus.yml**: Corpus contract and its mutation suite 75s
- **comment-hygiene.yml**: No ephemeral-artifact pointers in code comments 72s
- **dependabot-auto-merge.yml**: Auto-merge Dependabot security patch updates 4s
- **diagram-corpus.yml**: Corpus contract, its mutation suite and both applicator gates 61s
- **naming-standard-guard.yml**: Enforce kebab-case filesystem names 89s
- **pi-extension-tests.yml**: Discover extensions 53s; pi-cache-optimizer tests 46s; pi-fast-mode-w-subagent-support tests 43s
- **prompt-card-sync.yml**: Prompt-knowledge drift guard 53s
- **repo-rules-corpus.yml**: Repo-rules corpus stays in sync 81s
- **sk-git-script-tests.yml**: sk-git script tests 60s
- **skill-advisor-stress.yml**: Skill advisor stress suite 117s
- **strict-pass-freshness-report.yml**: strict-pass-freshness 2568s
- **trigger-index-rebuild.yml**: Rebuild the trigger index 0s; Push the trigger index rebuild 0s
