# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `65eb3c029d0c2c0a29dcfcc0039d7343692c2d83`, 17 first-parent commits
- Files: 279, of which 118 uncommitted or untracked
- Owners: 8
- Findings: 18 (P0 0, P1 3, P2 15), 4 literal, 0 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Lanes: A, B, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 6 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 81 | 7 |
| S3 | Feature catalog entries | yes | 87 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 87 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 95 | 3 |
| S6 | Changelogs updated or created | yes | 93 | 1 |
| S7 | Skill routing is right | yes | 7 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 7 | 1 |
| S9 | Commands aligned | yes | 6 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 9 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 6 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 49 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 146, fail 1, cannot run 0, not applicable 3

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1768 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 205 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1510 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 302 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 665 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 87 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 80 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 74 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 8354 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 54 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 7958 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 303 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 289 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 307 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 248 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 322 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 283 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 278 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 301 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 429 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 391 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 429 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 429 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 241 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 288 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 281 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 305 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 304 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 341 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 517 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 666 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 599 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 596 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 462 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 317 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 317 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 232 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 374 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 336 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 335 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 339 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 273 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 326 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 289 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 279 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 611 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 262 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 2473 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 65 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 43 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 84835 |
| pass | P2 | no | `S5-derived-counts` | 0 | 289 |
| pass | P2 | no | `S5-readme-references` | 0 | 5187 |
| pass | P2 | no | `S6-release-coverage` | 0 | 73 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 34 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 421 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 28 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 4931 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 176 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 299 |
| pass | P2 | no | `S8-advisor-status` | 0 | 395 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 59 |
| fail | P2 | no | `S9-command-references` | 1 | 82 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 564 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 416 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 54 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 45 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 52 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 59 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 58 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 103 |
| pass | P2 | no | `S13-env-tokens` | 0 | 447 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 3011 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 2807 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 2592 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 2587 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 2583 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 2381 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1834 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1830 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1709 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 2045 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 2044 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1807 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 2415 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 2180 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 202 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 52 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 8746 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1601 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 56 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 57 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 36 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 49 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 2476 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 706 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 35 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 214 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 47 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2663 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3654 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 386 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 3413 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 565 |
| not_applicable | P2 | no | `S15-ci-agent-mirror-sync` | - | 0 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .skilled/commands/deep/assets/compiled/deep-research.contract.markdown
- `comment-hygiene.yml`: pull_request: no path filter
- `deep-loop-runtime.yml`: pull_request: paths match .skilled/commands/deep/assets/compiled/deep-research.contract.markdown
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `hook-vitest-suites.yml`: pull_request: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .skilled/commands/deep/assets/compiled/deep-research.contract.markdown
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-plugin-tests.yml`: pull_request: paths match .skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/system-deep-loop/SKILL.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-deep-loop/README.md
- `spec-kit-check.yml`: push: paths match .skilled/commands/deep/assets/compiled/deep-research.contract.markdown
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **F1** P2 judgment `.skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts:167`: The suite's stated invariant (header lines 5-9: 'A run that never asks for it must render the same bytes') cannot fail for the default-path next-focus change this branch lands. writeFixture writes spec.md, the config, the strategy, the state log and the inbox, and never creates research/iterations/iteration-NNN.md, so parseIterationFile yields nothing and the leafNextFocus signal reduce-state.cjs ...
  - Evidence: `node leaf-focus-probe.cjs` exit 0: NEXT FOCUS section => "## 11. NEXT FOCUS\nRe-read the branch dispatch table" without leafNextFocus => "How does the reducer pick the next focus?" with leafNextFocus => "Re-read the branch dispatch table"
- **F2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:363`: The comment at 361-362 promises a fail-safe the code does not implement: 'An unreadable review config must not silently widen the relevance check to every path, so it degrades to the no-target object rather than being skipped.' readTargetConfig returns null for a missing or unparseable deep-review-config.json, and `?? {}` hands scopeInsideReviewTarget an empty object, which returns true for every ...
  - Evidence: `node admit-probe.cjs` exit 0: review config {} (what the code degrades to) => true review config files/target => false review config null => true
- **F3** P2 judgment `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2465`: The comment above frontierNodeVisits states a property the focus does not have and explains the wrong mechanism: 'The frontier focus names the node and never repeats its question text: a question resolves when an iteration's focus equals its text, so echoing the text would close a node just by visiting it.' pickFrontierFocus at 2491 returns `Frontier node ${nodeId} (depth d, scope s): ${chosen.que...
  - Evidence: `node admit-probe.cjs` exit 0: pickFrontierFocus => "Frontier node F-1-001 (depth 1, scope runtime/lib): Which module owns admission?" question echoed verbatim in focus => true
- **F4** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:341`: The run-wide node cap is pruned with reason 'fanout', so a store row cannot be read as naming the bound it hit. The module header (lines 12-17) enumerates the checks as relevance, dedupe, depth, fan-out, monotone budget and acyclicity, and 340 is the fan-out check; 341 is a different bound — the total live-node count — reported under the same word. Case: two answered depth-1 nodes, maxFrontierNode...
  - Evidence: `node cap-probe.cjs` exit 0: live children of F-1-001: 0 child cap: 6 total live nodes: 2 node cap: 2 checkProposal reason => "fanout"
- **F5** P2 literal `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3573`: Five of the exports added to this file have no consumer anywhere in the repository — not a script, not a lib module, not a test: applyFrontierBudget (3573), buildFrontierProjection (3574), frontierNodeVisits (3586), pickFrontierFocus (3590) and readFrontierNodeStore (3591). Every other name in the same exports block has at least three external references, so this is speculative API surface rather ...
  - Evidence: `for n in applyFrontierBudget buildFrontierProjection frontierNodeVisits pickFrontierFocus readFrontierNodeStore; do grep -rl "\b$n\b" --include=*.cjs --include=*.ts --include=*.js --include=*.mjs .ski...` exit 0: applyFrontierBudget=0 buildFrontierProjection=0 frontierNodeVisits=0 pickFrontierFocus=0 readFrontierNodeStore=0

### S2 Skill docs match sk-create-skill

- **B-S2-01** P2 judgment `.skilled/skills/system-deep-loop/deep-review/SKILL.md:238`: The new expansive section claims `antiConvergence.depthMode` and the `expansiveDepth` caps are 'both ... locked against the optimizer'. The optimizer manifest lists only `antiConvergence.depthMode` in `lockedFields`; `expansiveDepth.*` appears in neither `tunableFields` nor `lockedFields`, and the config's `_optimizerManaged.lockedFields` does not include it either. The claim is repeated at `refer...
  - Evidence: `node -e 'const m=require("./.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json"); console.log(JSON.stringify({expansiveDepthInTunable:m.tunableFields.some(f=>String(f.name)....` exit 0: {"expansiveDepthInTunable":false,"expansiveDepthInLocked":false,"depthModeInLocked":true}
- **B-S2-02** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:91`: The absent-flag claim is too strong: research says `default` 'renders the same bytes as before' and review says it 'runs exactly as before' (`deep-review/SKILL.md:237`; also `deep-research/references/convergence/convergence.md:68`, `deep-research/references/protocol/loop-protocol.md:411`, `deep-review/references/convergence/convergence.md:105`, `deep-review/references/protocol/loop-protocol.md:459...
  - Evidence: `rg -n "withoutExpansiveOnlyPersona" .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts` exit 0: 11: comment; 219: function definition; 281: one call "withoutExpansiveOnlyPersona(lineagePrompt.split(...))" - the helper removes the expansive-only persona paragraph before comparing to the baseline
- **B-S2-03** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:99`: The convergence-mode table says the shipped review YAML has no `off` decision branch and that review therefore follows `default`. The workflow's `step_check_convergence` item 3 (`deep-review.yaml:1241`) and `convergence.cjs`'s `convergenceMode === 'off'` branch return CONTINUE/`convergenceModeOff` for review, and the same file's decision order at line 179 says exactly that. DRV-080 also exercises ...
  - Evidence: `rg -n "has no .off. decision branch|Convergence mode off" .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` exit 0: 99: | `off` | ... the shipped review YAML has no `off` decision branch ... | ; 179: 4. **Convergence mode off** -- `convergenceMode: off` returns `CONTINUE` (`convergenceModeOff`).
- **B-S2-04** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:135`: Decision-order item 10 says a failed gate 'emit[s] blockedStop'. That is the review branch of `buildStopDecision` (`convergence.cjs:1201`); the research branch returns `CONTINUE` with reasonDetail `qualityGuardFailed` (`convergence.cjs:1204`), and the research workflow logs that reason (`deep-research.yaml:1182,1202`). The §4 gate table repeats the blockedStop claim in its Failure column, so the r...
  - Evidence: `rg -n "emit blockedStop and CONTINUE with recovery focus|emit\('CONTINUE', null, 'qualityGuardFailed'" .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md .skilled/ski...` exit 0: convergence.md:135: ... otherwise emit blockedStop and CONTINUE with recovery focus. | convergence.cjs:1204: return emit('CONTINUE', null, 'qualityGuardFailed', evaluated, failedGuards);
- **B-S2-05** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:127`: The table titled 'Runtime-supported lifecycle modes:' lists only `new`, `resume` and `restart`, while the paragraph immediately below (line 135) says `completed-continue` is set by `--extend=N`, and the research config's `lineage.allowedModes` now includes `completed-continue` with `fork` as the only deferred mode. The review SKILL lists `completed-continue` among its lifecycle modes. Add the four...
  - Evidence: `rg -n "Runtime-supported lifecycle modes|completed-continue. is set by" .skilled/skills/system-deep-loop/deep-research/SKILL.md` exit 0: 127: Runtime-supported lifecycle modes: ; 135: `completed-continue` is set by `--extend=N`: it reopens a completed run ...

### S3 Feature catalog entries

- **B-S3-01** P1 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16`: The review and research expansive-depth entries, and both root catalogs, still say the live pilot runs 'are still open' and that no pilot result is recorded. The branch records three pilots, all reporting FAIL on the non-cap stop criterion: `010-research-frontier-mode/scratch/pilot-run-1.md`, `010-research-frontier-mode/scratch/pilot-run-2.md`, and `011-review-frontier-mode/scratch/pilot-run-1.md`...
  - Evidence: `rg -n "live pilot runs" .skilled/skills/system-deep-loop/deep-research/feature-catalog .skilled/skills/system-deep-loop/deep-review/feature-catalog` exit 0: 4 matches: deep-review/feature-catalog/feature-catalog.md:224, deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16, deep-research/feature-catalog/feature-catalog.md:471, deep-research/feature-catalog/convergence/expansive-depth-mode.md:16

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-S4-01** P1 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md:80`: Three deep-review scenarios declare that no feature-catalog entry exists for their capability, but the entries added in this change exist and cite these very scenarios. `review-dimensions/custom-review-dimensions.md` cites DRV-074 at line 57 and DRV-075 at line 58; `loop-lifecycle/min-iterations-floor.md` cites DRV-072 at line 49. The same false status sits at `review-depth-v2-rollout/stop-gate-cu...
  - Evidence: `rg -n "No dedicated catalog entry|No dedicated convergence catalog entry" .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` exit 0: custom-dimension-setup-and-universe.md:80: ...No dedicated catalog entry exists for custom review dimensions yet... | stop-gate-custom-dimension-coverage.md:79: same | review-min-iterations-floor.md:79: ...No dedicated convergence catalog entry exists for deep-review floor behavior yet...
- **B-S4-02** P1 judgment `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:65`: Global precondition 4 requires `mode-registry.json` to contain exactly 3 active modes, but the registry has 2 (`research`, `review`), so no hub scenario can clear its own precondition. Line 35 also pins the coverage note to version `2.0.0.0` while the registry is `2.1.6.0`, the version stamp this branch superseded. The file is in scope and the new Section 9 was added to it; the precondition and ve...
  - Evidence: `node -e 'const r=require("./.skilled/skills/system-deep-loop/mode-registry.json"); console.log(JSON.stringify({version:r.version,modeCount:r.modes.length,modes:r.modes.map(m=>m.workflowMode)}));'` exit 0: {"version":"2.1.6.0","modeCount":2,"modes":["research","review"]}
- **B-S4-03** P2 judgment `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md:102`: The new runtime scenarios do not reach the catalog entries added for them. DLR-062, DLR-063 and DLR-064 still end with 'this scenario does not cite a specific catalog entry' although `council/divergent-pivot-seat-cap-and-retry.md`, `executor/landed-iteration-no-redispatch.md` and `executor/research-claude-config-dir.md` exist and the playbook table now links them. DLR-060 and DLR-061 carry no feat...
  - Evidence: `rg -n "does not cite a specific catalog entry|DLR-060|DLR-061" .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md .skilled/skills/system-deep-loop/...` exit 0: research-claude-config-dir.md:102, landed-iteration-skips-redispatch.md:102, divergent-council-quorum-retry.md:104: 'does not cite a specific catalog entry'; playbook lines 995-996: DLR-060 -> F004 prompt-pack, DLR-061 -> F013 coverage-graph-signals

### S7 Skill routing is right

- **D3** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:131`: The table headed 'Runtime-supported lifecycle modes' lists new, resume and restart, and the sentence directly below it declares completed-continue a live mode set by --extend=N, so the section contradicts itself and the table is the wrong one. The sibling deep-review/SKILL.md was updated to list completed-continue inline, which makes the research table the only stale copy of the lifecycle set. Rep...
  - Evidence: `sed -n '127,135p' .skilled/skills/system-deep-loop/deep-research/SKILL.md` exit 0: ...rch tree, mint a fresh `sessionId`, increment `generation`, and append a typed `restarted` event | `completed-continue` is set by `--extend=N`: it reopens a completed run in the same session and generation, raises the iteration cap to the runs so far plus N, and appends a typed `run_extended` event.

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
- **D1** P2 literal `.skilled/commands/deep/research.md:33`: The HARD-BLOCK 'YOUR FIRST ACTION' gate tells the executor to resolve 7 setup values, but the same file's YAML START CONDITION at line 17 now requires 9, including convergence_mode, depth_mode and lineage_mode. The branch added convergence_mode and depth_mode to line 17 (diff hunk at line 14) and left this list untouched, so the two binding surfaces in one file disagree. Reproducer: /deep:research...
  - Evidence: `sed -n '17p;33,41p' .skilled/commands/deep/research.md` exit 0: ...ugh the presentation contract and resolve: > - `research_topic` > - `spec_folder` > - `execution_mode` > - `maxIterations` > - `convergenceThreshold` > - `stop_policy` (default `convergence` unless `--stop-policy=max-iterations` is present) > - `dry_run` (default false unless `--dry-run` is present)
- **D2** P2 literal `.skilled/commands/deep/review.md:31`: Same divergence as D1, in the review router: the HARD-BLOCK gate lists 9 setup values without convergence_mode, depth_mode or lineage_mode, while line 17 of the same file requires 12. The branch edited the neighbouring Step 6 list at line 83 to add convergence_mode and depth_mode, and the start condition at line 17, so the omission here is now the only stale copy and it contradicts both. Reproduce...
  - Evidence: `sed -n '17p;31,41p' .skilled/commands/deep/review.md` exit 0: ...review_target` > - `review_target_type` > - `review_dimensions` > - `spec_folder` > - `execution_mode` > - `maxIterations` > - `convergenceThreshold` > - `stop_policy` (default `convergence` unless `--stop-policy=max-iterations` is present) > - `dry_run` (default false unless `--dry-run` is present)

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-deep-loop/deep-research | system-deep-loop/research | fail |
| P02 | system-deep-loop/deep-research | system-deep-loop/research | fail |
| P03 | system-deep-loop/deep-review | system-deep-loop/review | fail |
| P04 | system-deep-loop/deep-review | system-deep-loop/review | fail |
| P05 | system-deep-loop/deep-research | system-deep-loop/research | fail |
| P06 | system-deep-loop/deep-review | system-deep-loop/review | fail |
| P07 | sk-code | sk-code/sk-code-review | pass |

## Probes awaiting the critic

- P01: Run a deep research loop with expansive depth on how the advisor scores routing metadata; expected system-deep-loop; actual skill system-deep-loop
- P02: Use depth-mode=expansive for the next deep research run; expected system-deep-loop; actual skill system-deep-loop
- P03: Start an expansive-depth deep review of the commands validation scripts; expected system-deep-loop; actual skill system-deep-loop
- P04: Run a deep review with --depth-mode=expansive on the routing scripts; expected system-deep-loop; actual skill system-deep-loop
- P05: Extend the completed deep research run by five more iterations; expected system-deep-loop; actual skill system-deep-loop
- P06: Extend the finished deep review run by three iterations; expected system-deep-loop; actual skill system-deep-loop

## Files no lane reviewed

No critic output in this run, so coverage was not checked.

