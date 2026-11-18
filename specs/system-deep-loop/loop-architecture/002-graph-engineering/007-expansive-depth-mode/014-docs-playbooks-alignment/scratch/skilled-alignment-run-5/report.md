# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `6675f479b647233d4737e2bee384a2a2d84e2b50`, 18 first-parent commits
- Files: 378, of which 236 uncommitted or untracked
- Owners: 8
- Findings: 28 (P0 0, P1 5, P2 23), 15 literal, 2 inferred, 3 outside the scope; 1 more overturned by the critic and not counted
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 6 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 83 | 7 |
| S3 | Feature catalog entries | yes | 89 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 89 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 97 | 3 |
| S6 | Changelogs updated or created | yes | 95 | 1 |
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

pass 148, fail 1, cannot run 0, not applicable 3

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1707 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 213 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 885 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 267 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 324 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 50 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 68 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 89 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6010 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 41 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 5911 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 466 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 365 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 274 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 391 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 348 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 198 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 187 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 184 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 183 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 184 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 182 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 198 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 198 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 497 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 186 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 186 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 188 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1191 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 58 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 41 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 54997 |
| pass | P2 | no | `S5-derived-counts` | 0 | 131 |
| pass | P2 | no | `S5-readme-references` | 0 | 1727 |
| pass | P2 | no | `S6-release-coverage` | 0 | 48 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 31 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 340 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 27 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 3044 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 102 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 201 |
| pass | P2 | no | `S8-advisor-status` | 0 | 126 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 41 |
| fail | P2 | no | `S9-command-references` | 1 | 60 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 386 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 300 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 45 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 40 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 34 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 38 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 59 |
| pass | P2 | no | `S13-env-tokens` | 0 | 137 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 1822 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1657 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1585 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1714 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1658 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1643 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1706 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1699 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1510 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1664 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1663 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1485 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1484 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1439 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 104 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 50 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 5842 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1087 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 54 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 46 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 31 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 46 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1598 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 519 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 34 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 181 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 42 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1754 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3609 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 318 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1464 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 616 |
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

- **A-1** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:532`: renderFrontierBlock emits the research-only focus instruction ("Copy the Focus Area line exactly into this iteration record's \"focus\"") for the review target too, immediately before the review-specific instruction added at line 536. A review prompt has no Focus Area line; prompt-pack-iteration.md.tmpl:14 owns that line for research only, and deep-review's iteration prompt carries the dimension i...
  - Evidence: `node ${TMPDIR:-/tmp}/local-skilled-alignment-scratch/skilled-alignment-run-5/A/block-review.cjs (seed target=review, then renderFrontierBlock({target:'review', dimension:'correctness'}))` exit 0: ....\nCopy the Focus Area line exactly into this iteration record's "focus", so the run can tell which node this iteration worked.\nSet this iteration record's "focus" to "Frontier node F-1-001: correctness" and add "frontierNodeId":"F-1-001" to it, so the run can tell which node this iteration worked.
- **A-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2465`: The comment above frontierNodeVisits states the frontier focus "never repeats its question text", but pickFrontierFocus at line 2491 appends "): ${chosen.question}" after the marker. What actually keeps a visit from resolving the question is the `Frontier node <id>` prefix meeting the equality matcher (buildRegistry line 2628, record.focus === question text), not the absence of the text - the dura... (inferred)
- **A-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts:167`: The suite's stated invariant (header: "A run that never asks for it must render the same bytes") cannot fail for the one default-path behavior this branch changes. writeFixture writes spec.md, the config, the strategy, the state log and the inbox, and creates no research/iterations/iteration-NNN.md, so parseIterationFile yields no iterationFiles and the leafNextFocus the reducer now passes into de...
  - Evidence: `node ${TMPDIR:-/tmp}/local-skilled-alignment-scratch/skilled-alignment-run-5/A/leaf-focus-probe.cjs (reduceResearchState on the golden fixture, with and without an iterations/iteration-002.md carrying...` exit 0: leaf iteration markdown present=false => NEXT FOCUS "## 11. NEXT FOCUS\nQ1: Which module owns the stop decision?" leaf iteration markdown present=true => NEXT FOCUS "## 11. NEXT FOCUS\nRe-read the branch dispatch table"
- **A-4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2484`: One file, two definitions of a node visit. pickFrontierFocus (line 2484) and the dashboard Revisits metric (line 3097) count every iteration record whose focus carries the marker, while applyFrontierBudget (lines 2512-2514) drops records whose status is error/failed/failure/timeout before counting. The review twin states the rule the budget follows - "Only an attempt that produced evidence counts ... (inferred)

### S2 Skill docs match sk-create-skill

- **X-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/SKILL.md:238`: The review Expansive Depth Mode bullet lists `maxChildrenPerNode` 6 as the cap but omits the root seed floor: `frontier-admit.cjs` sets `maxRootChildren = max(6, 8)` for a review seed (`ROOT_CHILDREN_FLOOR` is `{ research: 6, review: 8 }`), so a review seeds 3 to 8 depth-1 sub-targets while research seeds 3 to 6. The feature catalog page records the raised review root cap, but SKILL.md, `reference...
  - Evidence: `sed -n '56,60p' .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs; grep -n 'maxChildrenPerNode' .skilled/skills/system-deep-loop/deep-review/SKILL.md; grep -n 'raised to 8' .skilled/...` exit 0: const ROOT_CHILDREN_FLOOR = Object.freeze({ research: 6, review: 8 }); SKILL.md:238:... `maxDepth` 3, `maxChildrenPerNode` 6 ... expansive-depth-mode.md:16:... the root fan-out cap of 6, since raised to 8 for a review seed, ...

### S3 Feature catalog entries

- **X-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md:104`: Phase 006's user-visible fix (the `findings_not_enumerated` gate and the `focusAlignment` guard read real leaf fields) is the only one of the 13 Feature to Playbook Map rows with no feature-catalog entry, and this scenario still records that absence. The 014 packet's purpose is to give every user-visible feature and fix a catalog entry; the nearest deep-research entry, `convergence/quality-guards....
  - Evidence: `grep -rn -i "leaf field\|findings_not_enumerated\|focusAlignment" .skilled/skills/system-deep-loop/deep-research/feature-catalog; grep -n "Feature catalog status" .skilled/skills/system-deep-loop/deep...` exit 0: (no catalog hits) 104:- Feature catalog status: this scenario does not cite a specific catalog entry.

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md:102`: The scenario still declares it has no catalogue entry, but the curated entry `deep-research/feature-catalog/state-management/focus-hijack-guard.md` names DR-066 as the scenario that proves it, and this change updated eleven sibling scenarios to cite their entry. The exception recorded in the ALWAYS rule §8.7 is now false, so the catalog→playbook pair is one-directional.
  - Evidence: `rg -n "Feature catalog status" <scenario>; rg -n "next-focus-ignores-answered-free-text" .skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` exit 0: ...cite a specific catalog entry. focus-hijack-guard.md:47:| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | Manual playbook | DR-066: Next Focus skips answered free text and status sentences. |
- **B-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md:99`: Same stale exception on the review side: `deep-review/feature-catalog/state-management/focus-hijack-guard.md` names DRV-073 as its manual-playbook proof, so the scenario's claim that it cites no catalogue entry is wrong and the link only works in one direction.
  - Evidence: `rg -n "Feature catalog status" <scenario>; rg -n "review-next-focus-first-uncovered-dimension" .skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` exit 0: ...te a specific catalog entry. focus-hijack-guard.md:41:| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | Manual playbook | DRV-073: Review Next Focus names the first uncovered dimension. |
- **X-1** P2 literal `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:35`: The hub playbook's coverage note pins the routing it validates to version `2.0.0.0`, but this branch bumps `mode-registry.json`, `hub-router.json`, `description.json` and `SKILL.md` to 2.1.6.0. A reader cannot tell whether the playbook validates the shipped routing or an older one; this is the version stamp the S4 lens says must not survive a superseding change.
  - Evidence: `grep -n '2\.0\.0\.0' .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md; node -e "const r=require('./.skilled/skills/system-deep-loop/mode-registry.json');const h=requ...` exit 0: manual-testing-playbook.md:35:Coverage note: the playbook covers the hub's registry-driven routing at version `2.0.0.0`. It exercises: 2.1.6.0 2.1.6.0
- **X-3** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md:48`: `--extend-minutes=M` is a new user-visible flag in phase 001 (command rows, both packet catalog entries, REQ-005/AC-005), but no manual scenario exercises it: both extend scenarios pass only `--extend=3`, and a search of all four playbook packages finds no mention. Its duration-budget behavior is covered only by `workflow-restart-lifecycle.vitest`, so the S4 lens's rule that a new feature has a sc...
  - Evidence: `grep -rn -- "extend-minutes" .skilled/skills/system-deep-loop/*/manual-testing-playbook; grep -n -- "--extend=3" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and...` exit 0: (no playbook hits) 48:4. `/deep:research "<fixture topic>" :auto --spec-folder=<completed-fixture-spec-folder> --extend=3 --convergence-mode=off`

### S5 READMEs match sk-create-readme, root included

- **C-01** P1 literal `.skilled/skills/system-deep-loop/deep-research/README.md:223`: The VERIFICATION table's expected output is contradicted by the command it documents. The row says the script prints `PASS checked 24 script references across 2 workflow YAMLs`; it prints 27 (14 unique .cjs references in deep-research.yaml plus 13 in deep-review.yaml). The count grew when the expansive-depth steps (step_frontier_seed, step_frontier_admit, step_frontier_activate) added script refer...
  - Evidence: `bash .skilled/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh` exit 0: PASS checked 27 script references across 2 workflow YAMLs

### S6 Changelogs updated or created

- **C-02** P2 literal `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:186`: The `## How It Was Checked` before-and-after row now records a number no run reproduces: `git grep -c -- '--depth-mode'` on `.skilled/commands/deep/research.md` returns 2, not the recorded 1. This scope's own edit added the second occurrence at research.md line 41 (`depth_mode` (default `default` unless `--depth-mode=expansive` is present)), turning the release entry's stated evidence into an un-r...
  - Evidence: `git -c core.fsmonitor=false grep -c -- '--depth-mode' -- .skilled/commands/deep/research.md .skilled/commands/deep/review.md` exit 0: .skilled/commands/deep/research.md:2 .skilled/commands/deep/review.md:2
- **C-03** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:174`: Same drift as C-02 in the review entry: the before-and-after row states `--depth-mode` appears once in `.skilled/commands/deep/review.md`, and the scope's edit of review.md added a second occurrence at line 41. The recorded evidence no longer matches what a run returns.
  - Evidence: `git -c core.fsmonitor=false grep -c -- '--depth-mode' -- .skilled/commands/deep/research.md .skilled/commands/deep/review.md` exit 0: .skilled/commands/deep/research.md:2 .skilled/commands/deep/review.md:2

### S7 Skill routing is right

- **D1** P2 judgment `.skilled/skills/system-deep-loop/hub-router.json:33`: The branch adds expansive depth mode, completed-run extension (completed-continue via --extend) and custom review dimensions, edits the convergence-mode docs, and documents them in the packet SKILL.md files and command flag tables, but the hub's only authored mode vocabulary carries no feature term. The branch's only change to this file is the version bump 2.0.2.0 -> 2.1.6.0. A probe that names a ...
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "Investigate the retry policy in expansive depth mode, three levels of follow-up questions deep"` exit 0: {"hubId":"system-deep-loop","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"c6b62457fa5db8f1c3545095977dd006c852dc2c0021407a94bd2fbcbcb713b6","generation":4}
- **D2** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:57`: The routing prose names 'a convergence check' as one of the requests that fires the hub's research signal, but the hub vocabulary carries 'research convergence', not 'convergence check', so the documented phrase takes the defer outcome. Reproducer in evidence; the same sentence's other four phrases route. Fix the doc to the phrase the router carries, or add 'convergence check' to research-aliases ...
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "Run a convergence check on the advisor routing metadata"` exit 0: {"hubId":"system-deep-loop","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"c6b62457fa5db8f1c3545095977dd006c852dc2c0021407a94bd2fbcbcb713b6","generation":4}
- **D3** P2 literal `.skilled/skills/system-deep-loop/deep-review/SKILL.md:83`: The routing prose names 'a spec-folder audit' as a request that fires the hub's review signal, but neither 'spec-folder audit' nor 'spec folder audit' is in review-aliases, so the documented phrase defers. The advisor gives the same wording to system-spec-kit ('Audit the spec folder for completeness' -> system-spec-kit 0.889), so adding the phrase to review-aliases would steal spec-validation traf...
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "Do a spec-folder audit before release"; printf %s "{\"prompt\":\"Audit the spec folder for completeness\"}" | node .skilled/bin/sk...` exit 0: {"hubId":"system-deep-loop","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"c6b62457fa5db8f1c3545095977dd006c852dc2c0021407a94bd2fbcbcb713b6","generation":4} advisor top=system-spec-kit 0.889

### S8 Skill integrated in system-skill-advisor

- **PRB-01** P1 judgment: Probe P02 "Investigate the retry policy in expansive depth mode, three levels of follow-up questions deep" expected system-deep-loop/research; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Investigate the retry policy in expansive depth mode, three levels of follow-up questions deep"}' --format json` exit 0: top-1 was nothing
- **PRB-02** P1 judgment: Probe P03 "Extend a completed research run by three more iterations in the same session" expected system-deep-loop/research; top-1 was system-deep-loop.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Extend a completed research run by three more iterations in the same session"}' --format json` exit 0: top-1 was system-deep-loop
- **PRB-03** P1 judgment: Probe P04 "Review the payments module in expansive depth mode with a frontier of review sub-targets" expected system-deep-loop/review; top-1 was sk-code/sk-code-review.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Review the payments module in expansive depth mode with a frontier of review sub-targets"}' --format json` exit 0: top-1 was sk-code/sk-code-review
- **PRB-04** P1 judgment: Probe P07 "Review the release against custom dimensions beyond the four canonical ones" expected system-deep-loop/review; top-1 was sk-code/sk-code-review.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Review the release against custom dimensions beyond the four canonical ones"}' --format json` exit 0: top-1 was sk-code/sk-code-review
- **D4** P2 judgment `.skilled/skills/system-deep-loop/description.json:6`: The hub's advisor-facing vocabulary carries no term for the branch's new features. The keywords here and graph-metadata.json's intent_signals - the array the advisor actually scores, per skill_advisor.py's _extend_signal_map call - stop at the mode names, so a request that names a feature without its mode is not scored to the hub. 'Review the payments module in expansive depth mode with a frontier...
  - Evidence: `printf '%s' '{"prompt":"Review the payments module in expansive depth mode with a frontier of review sub-targets"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json | nod...` exit 0: top=sk-code 0.592 count=1 hasDeepLoop=false

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
- **D5** P2 literal `.skilled/commands/deep/review.md:100`: The --depth-mode row was rewritten on this branch (commit 8fda03e7135 introduced it) but kept a pilot-testing chore in shipped command text: '(record the pilot range SHA; ...)'. The command standard's Step 8 forbids development notes in the command body, the phrase names no flag, config field or workflow step, and a repository-wide search finds it in no skill doc or playbook, so an executor that f...
  - Evidence: `grep -rn "pilot range SHA" .skilled/commands/deep .skilled/skills/system-deep-loop/deep-review` exit 0: ...sive` | `default`, the value when the flag is absent, runs exactly as before. `expansive` is opt-in: the run seeds depth-1 sub-target nodes from the review target before iteration 1 (record the pilot range SHA; merges are pruned as `merge-no-own-diff` and index rebuilds as `generated-artifact`), ...

### S14 Spec packets validate (changed-packet-validation replay)

- **X-5** P2 judgment `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/implementation-summary.md:157`: The implementation summary still says "Pilot not run on the branch" and the completion row says "pilot and full suite open", but the committed goal log records two live target-2 runs: pilot-run-1 FAIL and pilot-run-2 FAIL on the fixed tree, both on AC-014 (`goal.md:95-96`). `acceptance-criteria.md:102` repeats "the target-2 pilot has not run", and `tasks.md:108` still describes the rerun as pendin...
  - Evidence: `grep -n "Pilot not run\|pilot has not run" specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/implementation-summary.md specs/system-dee...` exit 0: implementation-summary.md:157:1. **Pilot not run on the branch.** ... acceptance-criteria.md:102:No. AC-014 is unmet: the target-2 pilot has not run, so its registry stats do not exist yet. pilot-run-2.md:1:# Target-2 research pilot, rerun on the fixed tree (FAIL on AC-014)
- **X-6** P2 judgment `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/implementation-summary.md:119`: The summary still says "Pilot not run" and its `_memory` block is the untouched scaffold (`completion_pct: 0`, `recent_action: Authored the planned phase docs`, `next_safe_action: Wait for phases 008-010, then start T001`), while the goal log records the live target-1 pilot: AC-011 FAIL, T031 PASS (`goal.md:99`), and `acceptance-criteria.md:99` still says the pilot "runs at integration after merge...
  - Evidence: `grep -n "Pilot not run" specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/implementation-summary.md; sed -n '/_memory:/,/^---$/p' specs/s...` exit 0: implementation-summary.md:119:1. **Pilot not run.** ... completion_pct: 0 / next_safe_action: "Wait for phases 008-010, then start T001" pilot-run-1.md:1:# Target-1 review pilot (FAIL on AC-011, T031 PASS)

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **B-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:9`: The root playbook was edited by this change but still lacks the result-persistence completion marker the playbook standard §4 anchors a run's PASS/FAIL/SKIP outcome, reason and evidence paths to; the operator validator reports it as an advisory warning, and the hub root and the runtime root already carry the block, so this root is the odd one out in the same skill. [S4, B]
  - Evidence: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook; grep -c MANUAL_PLA...` exit 0: ...arios=71 categories=9 operator=71 routing_gold_excluded=0 violations=0 warnings=2 WARN RESULT_PERSISTENCE_MARKER_MISSING manual-testing-playbook.md root playbook is missing the advisory MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT completion marker (grep: 0 matches, exit 1; the hub root matches once)
  - Critic override: pre-existing, lane severity P2. `git show 21c4b325b5a:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md | grep -c MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` prints 0. The marker is absent at the merge base, while the hub and runtime roots already carry it at base; the scope touched this file but did not introduce the gap. The fix is still consistent with the standard.
- **B-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:9`: The deep-review root playbook has the same gap: no result-persistence marker, so the standard's run-record contract has no declared home in this package even though the shared benchmark tree and the two sibling roots define one. The validator reports the missing marker as an advisory warning, and this change already touches the package root playbook. [S4, B]
  - Evidence: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook; grep -c MANUAL_PLAYB...` exit 0: ...view tier=FAIL_CLOSED scenarios=69 categories=10 operator=69 routing_gold_excluded=0 violations=0 warnings=3 WARN RESULT_PERSISTENCE_MARKER_MISSING manual-testing-playbook.md root playbook is missing the advisory MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT completion marker (grep: 0 matches, exit 1)
  - Critic override: pre-existing, lane severity P2. Same check on the deep-review root playbook prints 0 at 21c4b325b5a. The marker is missing at the merge base, so this is pre-existing debt in a file the scope touched, not a regression introduced by the range.
- **D6** P2 literal `.skilled/commands/scripts/validate-command-references.cjs:134`: The S9 battery row is red because the checker resolves a runtime-generated path as a missing file. config.ts resolves TELEMETRY_STORE_DIR to <skill root>/runtime/database and access-telemetry.ts writes access-telemetry.json there on first use; .gitignore line 431 ignores the directory, so a clean checkout and this worktree hold no file. The checker already exempts the same class for .skilled/skill... [S9, D]
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
  - Critic override: pre-existing, lane severity P2. `git show 21c4b325b5a:.skilled/commands/speckit/assets/speckit-resume.yaml | grep -n access-telemetry` already reports line 104, and the 014 goal records the same reference as BAT-18, present at base and handed to the coordinator. Both the YAML and the checker are outside the 378-file scope; the S9 failure is baseline debt, not a change in this range.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **C-04** P2 literal `.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md:25`: The scope rewrote this bullet to split its sentences for human-voice compliance but carried a serial comma through the rewrite. `They are a run that is not complete, a fan-out config, and a value that is not a positive integer.` is a three-item list with a comma before `and`. The Human Voice Rules table bans it outright (`Oxford Comma Ban | , and | NEVER use`), and sk-create-changelog section 8.5 ... [S6, C]
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/system-deep-loop/changelog/v2.1.0.0.md --all` exit 0: 25:128 review oxford-comma-candidate , and hard blockers: 0 mechanical deductions: -2 mechanical ceiling: 98/100
  - Critic override: refuted, lane severity P2. At HEAD, `.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md:25` reads "...a fan-out config, or a value..." — there is no `, and` sentence. The quoted text and the literal `old` string come from an intermediate working-tree rewrite; the current tree's line already reads "...a fan-out config and a value..." with no comma. `hvr_scan` on the HEAD blob flags line 25 as a generic `, and` candidate ...

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-deep-loop/research | system-deep-loop/research | pass |
| P02 | system-deep-loop/research | - | fail |
| P03 | system-deep-loop/research | system-deep-loop | fail |
| P04 | system-deep-loop/review | sk-code/sk-code-review | fail |
| P05 | system-deep-loop/review | system-deep-loop/review | pass |
| P06 | system-deep-loop/review | system-deep-loop/review | pass |
| P07 | system-deep-loop/review | sk-code/sk-code-review | fail |
| P08 | sk-code | sk-code/sk-code-review | pass |
| P09 | sk-git | sk-git | pass |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json`

