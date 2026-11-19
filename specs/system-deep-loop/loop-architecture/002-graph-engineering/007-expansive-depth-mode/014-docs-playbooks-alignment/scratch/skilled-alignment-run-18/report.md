# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set full-diff
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `32fec82b0e461fc0094cd4524db4a87636a61649`, 181 first-parent commits
- Files: 2094, of which 13 uncommitted or untracked
- Owners: 17
- Findings: 24 (P0 0, P1 2, P2 22), 9 literal, 5 inferred, 2 outside the scope; 3 more overturned by the critic and not counted
- Open findings: 21 (3 handed off, 0 rebutted)
- Lanes: A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 66 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 141 | 7 |
| S3 | Feature catalog entries | yes | 207 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 207 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 220 | 3 |
| S6 | Changelogs updated or created | yes | 217 | 1 |
| S7 | Skill routing is right | yes | 11 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 11 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 20 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 66 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 70 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 201, fail 2, cannot run 0, not applicable 1

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 2831 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 1395 |
| pass | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 0 | 5865 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 977 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 238 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 336 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 723 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 1793 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 88 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 74 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 72 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 47 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 51 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6216 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 70 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 5943 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 159 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 89 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 115 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 241 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/ROUTER.md` | 0 | 234 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 232 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.7.0.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/quality-guards.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-focus-alignment.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-no-single-weak-source.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-source-diversity.md` | 0 | 234 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 317 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-band-budget-rolls-down.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-dashboard-section.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 297 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 289 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 278 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 241 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 318 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 333 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md` | 0 | 333 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md` | 0 | 300 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/composite-review-convergence-stop-behavior.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/dimension-coverage-convergence-signal.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/changelog/v1.10.0.0.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 557 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 237 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-expansive-lineage-budget.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md` | 0 | 239 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/frontier-admit-script.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/upsert-script.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/scripts/README.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/dashboard.md` | 0 | 69 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/prompt-pack.md` | 0 | 69 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/dashboard.md` | 0 | 66 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/prompt-pack.md` | 0 | 65 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/unit/README.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/SKILL.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.13.5.0.md` | 0 | 206 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1302 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 68 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 106 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 257 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 45 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 59526 |
| fail | P2 | no | `S5-derived-counts` | 1 | 176 |
| pass | P2 | no | `S5-readme-references` | 0 | 2003 |
| pass | P2 | no | `S6-release-coverage` | 0 | 49 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 36 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 383 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 30 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 4277 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 112 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 225 |
| pass | P2 | no | `S8-advisor-status` | 0 | 250 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 43 |
| fail | P2 | no | `S9-command-references` | 1 | 62 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 410 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 34 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 314 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 47 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 41 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 40 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 37 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 65 |
| pass | P2 | no | `S13-env-tokens` | 0 | 179 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode` | 0 | 3150 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2136 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 2092 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 2045 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1921 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1706 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1724 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1637 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1664 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1604 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1822 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1815 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1641 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1641 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1630 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 133 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 50 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 6359 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1210 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 50 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 51 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 34 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 44 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1847 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 565 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 35 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 201 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 44 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1828 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3586 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 297 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1690 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 465 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 118 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .claude/agents/deep-research.md
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .claude/agents/deep-research.md
- `comment-hygiene.yml`: pull_request: no path filter
- `deep-loop-runtime.yml`: pull_request: paths match .skilled/commands/deep/assets/compiled/deep-research.contract.markdown
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `hook-vitest-suites.yml`: pull_request: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .claude/agents/deep-research.md
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-dual-version.yml`: pull_request: paths match .skilled/agents/deep-research.md
- `opencode-plugin-tests.yml`: pull_request: paths match .claude/agents/deep-research.md
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/system-deep-loop/ROUTER.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-advisor-stress.yml`: pull_request: paths match .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-deep-loop/README.md
- `spec-kit-check.yml`: push: paths match .claude/agents/deep-research.md
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **A1-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:508`: isRevisionRangeToken reads any token with '..' between two non-dot, non-slash characters as a git revision range, so a file-list review target whose path holds '..' inside a name (for example docs/notes..v2.md) is routed to scopeInsideTouchedFiles. With no reviewScopeFiles on record that path returns true, so the review-target relevance check admits every scope (fail-open) instead of narrowing to ...
  - Evidence: `node -e "const {checkProposal}=require('./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs'); const caps={maxDepth:3,maxChildrenPerNode:6,maxRootChildren:8,maxFrontierNodes:10}; for...` exit 0: docs/notes..v2.md null docs/notes.md relevance
- **A2-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1240`: deriveDimension now walks the configured custom dimension names (buildDimensionUniverse) with a bare substring test over free text (iteration focus + finding title + description). A short custom name the config contract allows, such as 'ui' or 'api', matches inside unrelated words ('build', 'guide', 'rapid'), so when no canonical dimension name appears a finding is labelled with the custom dimensi... (inferred)
- **A3-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:380`: writeLineageFrontierStore writes frontier-nodes.jsonl first and uses its existence as the 'already seeded' marker, then appends the research inbox in a second call. If the inbox append throws (ENOSPC, EACCES) or the process dies between the two writes, the next spawn attempt sees the store, returns false, and never writes the inbox. The research lineage then runs with no seeded inbox rows for its ... (inferred)

### S2 Skill docs match sk-create-skill

- **B1-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:169`: The SKILL.md state-file list names three expansive-run files but leaves out research/frontier-graph-events.json. That file is written on every expansive iteration by step_frontier_graph_upsert, and README.md line 111 and state-format.md line 81 both list it. SKILL.md therefore under-describes the shipped state surface.
  - Evidence: `rg -n frontier-graph-events .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-research/README.md .skilled/skills/system-deep-loop/deep-research/references/s...` exit 0: README.md:111 and state-format.md:81 match; SKILL.md has no match
- **B1-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:109`: The quick-reference state-file table adds Frontier, Frontier seed and Frontier focus rows but no row for research/frontier-graph-events.json, which every expansive iteration writes. This is the same gap as B1-2, and README.md and state-format.md both list the file.
  - Evidence: `rg -n frontier-graph-events .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` exit 1: 
- **B2-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:101`: The quick-reference artifact table adds frontier-nodes.jsonl but omits frontier-seed.json, the second file an expansive run writes. README.md, state-format.md and state-outputs.md all list both files, so this reference is the one that disagrees.
  - Evidence: `grep -n frontier-seed .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` exit 1: 

### S3 Feature catalog entries

- **B4-1** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:30`: The review reducer (runtime/scripts/reduce-state.cjs:33 FRONTIER_FAILED_STATUSES, reviewFrontierVisits at ~1953) now counts only evidence-bearing attempts as frontier visits: an iteration record with status error, failed, failure or timeout neither covers a node dimension nor spends its depth band share. The review expansive-depth catalog entry describes the band budget split and roll-down but nev...
  - Evidence: `grep -nE "FRONTIER_FAILED_STATUSES = " .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs; grep -ciE "error|timeout|timed out|failed attempt" .skilled/skills/system-deep-loop/deep-revie...` exit 1: 33:const FRONTIER_FAILED_STATUSES = new Set(["error", "failed", "failure", "timeout"]); 0
- **X-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:42`: This is the research-side counterpart of B4-1, which covered only the review entry. The range adds FRONTIER_FAILED_STATUSES to deep-research/scripts/reduce-state.cjs (line 2486, absent at base 21c4b325b5a). frontierNodeVisitRecords (line 2492) drops records with status error, failed, failure or timeout before counting frontier visits, and the code comment says the focus pick, the band budget and t...
  - Evidence: `git show 21c4b325b5a:.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | grep -c FRONTIER_FAILED_STATUSES; grep -n FRONTIER_FAILED_STATUSES .skilled/skills/system-deep-loop/deep-...` exit 1: 0 (base) 2486:const FRONTIER_FAILED_STATUSES = new Set(['error', 'failed', 'failure', 'timeout']); 2492: .filter((record) => !FRONTIER_FAILED_STATUSES.has(...)) 0 (catalog)

### S4 Playbooks match sk-create-manual-testing-playbook

- **B2-1** P1 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:56`: DRV-081 is pinned to a superseded test count. Command 1's filter now matches 5 cases, because the suite added 'still rejects a frontier seed whose free-text scope asks for a change' (it covers the new quotedPaths/isPathShaped guard in divergent-review-pivot.ts). The scenario expects 'Tests 4 passed' and lists four cases, at line 56 and in the 'four pivot cases' signal at line 31. Its Pass rule req...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot.vitest -t "review divergent pivot under the expansive depth mode" --reporter=verbose` exit 0: vitest exit 0 (captured directly, not through a pipe): Tests 5 passed | 23 skipped (28); fifth case: still rejects a frontier seed whose free-text scope asks for a change
- **B1-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:59`: DR-068 Expected says Command 1 (rg -n -- '--depth-mode' .skilled/commands/deep/research.md) prints two lines, but it prints three. The same diff added [--depth-mode=default|expansive] to the command's argument-hint on line 3, so the scenario is pinned to output the change superseded. An operator who grades on the stated line count would record a false FAIL.
  - Evidence: `rg -n -- '--depth-mode' .skilled/commands/deep/research.md` exit 0: 3:argument-hint: "<topic> ... [--depth-mode=default|expansive] ..." 41:> - `depth_mode` (default `default` unless `--depth-mode=expansive` is present) 107:| `--depth-mode` | `default` \| `expansive` | ...
- **B2-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:615`: The root index summary for DRV-081 repeats the stale count of four review pivot cases. The suite has five (see B2-1).
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot.vitest -t "review divergent pivot under the expansive depth mode"` exit 0: Tests 5 passed | 23 skipped (28)
- **B2-3** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:59`: DRV-076 says command 1 prints two lines. The command now prints three, because review.md's argument-hint (line 3) also names --depth-mode. The Pass rule does not depend on the count, so the verdict is unaffected, but the Expected text is stale.
  - Evidence: `rg -n -- '--depth-mode' .skilled/commands/deep/review.md` exit 0: 3:argument-hint ... [--depth-mode=default|expansive] ... 41: - `depth_mode` (default `default` unless `--depth-mode=expansive` is present) 100:| `--depth-mode` | `default` \| `expansive` | ...
- **B3-1** P2 literal `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:39`: The overview says DLR-060 to DLR-066 map to catalog entries that carry no F-number, but DLR-066 maps to feature-catalog/fanout/fanout-run.md, which the same playbook's cross-reference table labels F025 (row DLR-025, line 990). The DLR-066 row at line 1027 also drops the F025 label that row DLR-025 gives the same entry, so an operator tracing F-numbers gets two different answers for one catalog ent...
  - Evidence: `grep -n 'DLR-025 \|DLR-066 \|DLR-060 to DLR-066' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` exit 0: 39: ... DLR-060 to DLR-066 map to catalog entries that carry no F-number. | 990: | DLR-025 | [F025 Fan-out CLI lineage driver](../feature-catalog/fanout/fanout-run.md) | ... | 1027: | DLR-066 | [Fan-out CLI lineage driver](../feature-catalog/fanout/fanout-run.md) | ...

### S5 READMEs match sk-create-readme, root included

- **BAT-01** P2 judgment: S5-derived-counts failed (exit 1). [handed off]
  - Disposition: Owner: check_derived_readme_counts.py owner. The S5-derived-counts row fails only on .skilled/skills/system-skill-advisor/README.md line 141, where the checker reads 'its two sidecar files' in a troubleshooting row as a numeric file-count claim. That is a false positive in the checker, not README drift: run 17's lane C3 confirmed the database has two sidecar files (-shm and -wal), and the line is ...
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/bin/README.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/deep-research/...` exit 1: ... and its two sidecar files under `runtime/database/`, then rebuild with `--trusted --force` | FAIL .skilled/skills/system-skill-advisor/README.md: claims=1 failures=1 PASS .skilled/skills/system-spec-kit/README.md: claims=0 failures=0 PASS README.md: claims=1 failures=0 SUMMARY files=7 pass=6 fail=1
- **C1-4** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:211`: The README FAQ describes --extend=N without its single-executor limit. deep-research.yaml step_reject_extend_with_fanout (line 331) refuses --extend on a fan-out config. The root README (line 255), quick-reference.md and feature-catalog/loop-lifecycle/completed-run-extension.md (line 25) all state the refusal, but the skill README does not, so a fan-out user gets no warning before the usage error. (inferred)
- **C3-1** P2 judgment `.skilled/skills/system-deep-loop/README.md:86`: The hub README gained a sentence on --depth-mode=expansive but says nothing about the other capability this scope added to both loops: --extend=N / --extend-minutes=M, which reopen a finished single-executor run in the same session. The root README Deep Loop section (README.md:255) describes both flags and points readers to this README as the description of both modes and the shared runtime, and t...
  - Evidence: `grep -n -- "extend\|depth-mode" .skilled/skills/system-deep-loop/README.md` exit 0: 31: ...the frontier node store behind `--depth-mode=expansive`. 86: ...`--depth-mode=expansive` keeps a frontier of follow-up questions or sub-targets... (no --extend match)
- **C4-3** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/README.md:51`: The new frontier-admit.cjs row lists seed, admit, prune and close, but the CLI ships six commands. graph (projects the store to graph events), block (renders the FRONTIER prompt block) and budget (writes the seed budget) are missing, as frontier-admit.cjs:1112 shows. The command inventory does not match what shipped.
  - Evidence: `grep -n 'expected seed, admit, close' .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 1112: ... expected seed, admit, close, graph, block or budget

### S6 Changelogs updated or created

- **C2-1** P2 judgment `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:158`: The Completed Runs section and the Upgrade Notes (line 249) say --extend=N takes N more iterations, but leave out the catch that README.md line 143, quick-reference.md and loop-protocol.md all state: an extension keeps the run's stop policy, so under stopPolicy convergence an extension with nothing new can stop again at its first convergence check. A reader who follows the Upgrade step on a run cr... (inferred)
- **C2-2** P2 judgment `.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md:30`: The Upgrade line tells readers to add a custom name to review_dimensions, but does not say custom dimensions apply to single-executor runs only. A fan-out run binds review_dimensions: all in every lineage (runtime/scripts/fanout-run.cjs lines 1796 and 1895, and before this change as well), so a fan-out user's custom name is silently ignored. README.md line 45, the feature catalog and the command p... (inferred)
- **C4-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:265`: A behavior change that hits default runs is in no changelog. The review graph upsert now adds one FINDING node and one EVIDENCE_FOR edge for each finding that has a path:line ref (deriveReviewFindingEvidence). It also folds prefixed leaf finding ids onto the stored node (resolveReviewFindingId). For every loop type, an edge to an undeclared node is now skipped and listed in rejectedOrphanEdges, wh...
  - Evidence: `grep -rn -iE 'orphan|undeclared|rejectedOrphan|finding node|density|EVIDENCE_FOR|evidence.?edge' changelog/v2.1.*.md runtime/changelog/v1.10.0.0.md deep-review/changelog/v1.1[123]*.md deep-research/ch...` exit 1: (no matches)

### S9 Commands aligned

- **BAT-02** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Owner: validate-command-references.cjs owner. The S9-command-references row fails only on .skilled/commands/speckit/assets/speckit-resume.yaml:104, which names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file (.gitignore:431, run 17's lane D) the YAML falls back from. The YAML is right; the checker needs a runtime-state exemption. Same hand-off as runs 15 to 17; th...
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

### S11 Runtime mirrors

- **X-1** P1 judgment `.vibe/agents/deep-review.toml:4`: The Vibe agent profiles are stale against their canonical sources. HEAD commit 32fec82b0e4 added the sentence 'Keep the question and each scope entry within 500 characters on one line, because admission prunes a longer row as relevance' to .skilled/agents/deep-research.md:302 and .skilled/agents/deep-review.md:267. It regenerated the .claude, .codex, .pi and .dsh mirrors but not .vibe/agents/deep-...
  - Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check; grep -c 'within 500 characters' .vibe/agents/deep-review.toml .vibe/agents/deep-research.toml .skilled/agents/deep-r...` exit 1: [vibe-agent-sync] STALE .vibe/agents/deep-research.toml [vibe-agent-sync] STALE .vibe/agents/deep-review.toml [vibe-agent-sync] FAIL: 2 drift item(s); grep: vibe files 0, .skilled/agents/deep-review.md 1

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **B3-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/tests/fixtures/README.md:24`: This diff adds two fixture folders, golden-research-default/ and golden-review-default/. They hold the byte-for-byte default-run baselines that research-depth-mode-golden.vitest.ts and review-depth-mode-golden.vitest.ts compare against. The fixtures README was not updated: its description ('Shared event and ledger fixtures'), its directory tree (lines 24-29) and its FILES and entry tables still li... [S2, B3]
  - Evidence: `ls .skilled/skills/system-deep-loop/runtime/tests/fixtures; grep -n golden .skilled/skills/system-deep-loop/runtime/tests/fixtures/README.md` exit 1: authorized-ledger-fixtures.ts authorized-ledger-test-helper.ts authorized-ledger-worker.ts event-envelope-producers.ts golden-research-default golden-review-default README.md; grep found no 'golden' line in README.md
- **C4-2** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:237`: No open root release note describes what this scope adds. The newest root entry is v4.1.0.0, and a v4.1.0.0 tag already exists that is not an ancestor of HEAD. Under sk-create-changelog SKILL.md section 8, step 196-198, a tagged highest entry is closed, so new work needs a new numbered entry. The entry has no mention of --depth-mode=expansive, the frontier, --extend/--extend-minutes, custom review... [handed off] [S6, C4]
  - Disposition: Owner: operator (root release notes). Recurs unchanged from run 17's C4-1: the root .skilled/changelog/skilled/v4.1.0.0.md does not describe this program's new deep-loop features (expansive depth mode, --extend, custom review dimensions, the review minIterations floor), and v4.1.0.0 is already tagged. Opening or amending the root release record is the release owner's call, made when this branch la...
  - Evidence: `git tag --list v4.1.0.0; git merge-base --is-ancestor v4.1.0.0 32fec82b0e4 || echo not-ancestor; grep -c -iE 'expansive|depth-mode|--extend|frontier' .skilled/changelog/skilled/v4.1.0.0.md` exit 1: v4.1.0.0 not-ancestor 0

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **C1-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:169`: The state-file list names three expansive-only files and leaves out research/frontier-graph-events.json. The README state table (line 111) and state-format.md (line 81) both list it, and deep-research.yaml lines 1899-1900 write it on every expansive iteration. (inferred) [S5, C1]
  - Critic override: duplicate, lane severity P2. Verified: rg -n frontier-graph-events .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md exits 1 with no match. Same file, line and old/new fix as B1-2 (deep-research/SKILL.md:169 omits frontier-graph-events.json).
- **C1-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:109`: The state-file table adds rows for frontier-nodes.jsonl, frontier-seed.json and frontier-focus.txt but has no row for research/frontier-graph-events.json. The README (line 111) and state-format.md list that file, and the workflow writes it on every expansive iteration. (inferred) [S5, C1]
  - Critic override: duplicate, lane severity P2. Verified: rg -n frontier-graph-events .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md exits 1 with no match. Same file, line and fix as B1-3 (deep-research quick-reference.md:109 lacks a frontier-graph-events.json row).
- **C1-1** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:237`: The newest root release notes (v4.1.0.0, the only v4.1 note in HEAD's tree) do not describe the two user-visible deep-research capabilities this scope ships: the opt-in --depth-mode=expansive frontier and --extend=N / --extend-minutes=M completed-run extension (deep-research changelog v1.16.0.0). Its Deep Loop section (line 237 onward) covers only the AI Council move, review verdicts and stop deci... [S6, C1]
  - Evidence: `rg -c -i "expansive|depth-mode|--extend" .skilled/changelog/skilled/v4.1.0.0.md` exit 1: (no matches)
  - Critic override: duplicate, lane severity P2. Verified: rg -ci "expansive|depth-mode|--extend" .skilled/changelog/skilled/v4.1.0.0.md exits 1 with no match. C4-2 records the same gap (.skilled/changelog/skilled/v4.1.0.0.md:237 has no expansive, depth-mode or --extend mention; the tag is not an ancestor of HEAD) and is broader, also covering custom dimensions and the review floor.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-deep-loop/research | system-deep-loop/research | pass |
| P02 | system-deep-loop/research | system-deep-loop/research | pass |
| P03 | system-deep-loop/research | system-deep-loop/research | pass |
| P04 | system-deep-loop/review | system-deep-loop/review | pass |
| P05 | system-deep-loop/review | system-deep-loop/review | pass |
| P06 | system-deep-loop/review | system-deep-loop/review | pass |
| P07 | sk-code | sk-code/sk-code-review | pass |
| P08 | sk-code | sk-code | pass |
| P09 | sk-doc | sk-doc | pass |
| P10 | system-deep-loop/research | system-deep-loop/research | pass |
| P11 | system-deep-loop/review | system-deep-loop/review | pass |
| P12 | system-deep-loop/research | system-deep-loop/research | pass |
| P13 | system-deep-loop/review | system-deep-loop/review | pass |
| P14 | system-deep-loop/review | system-deep-loop/review | pass |
| P15 | system-deep-loop/review | system-deep-loop/review | pass |
| P16 | sk-code | sk-code/sk-code-review | pass |
| P17 | system-deep-loop/review | system-deep-loop/review | pass |
| P18 | system-deep-loop/review | system-deep-loop/review | pass |
| P19 | system-deep-loop/research | system-deep-loop/research | pass |
| P20 | system-deep-loop | system-deep-loop | pass |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.dsh/agents/deep-research.patch.yml (no lane or battery row; critic ran sync-agents-dsh.cjs --check by hand: in sync)`
- `.dsh/agents/deep-review.patch.yml (no lane or battery row; critic ran sync-agents-dsh.cjs --check by hand: in sync)`
- `.vibe/agents/deep-research.toml (no lane or battery row; stale, see X-1)`
- `.vibe/agents/deep-review.toml (no lane or battery row; stale, see X-1)`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json (byte-identical to the live .skilled/bin/lib/compiled-routing manifest Lane D reviewed; does not matter)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension/ (packet folder in place of its 5 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir/ (packet folder in place of its 14 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor/ (packet folder in place of its 11 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix/ (packet folder in place of its 26 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment/ (packet folder in place of its 8 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields/ (packet folder in place of its 41 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class/ (packet folder in place of its 16 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage/ (packet folder in place of its 9 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge/ (packet folder in place of its 9 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/ (packet folder in place of its 3 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/ (packet folder in place of its 3 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/ (packet folder in place of its 26 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration/ (packet folder in place of its 12 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are scratch and dispatch records)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment/ (packet folder in place of its 1501 uncovered files: goal.md, which holds session goal state that validate.sh does not read and no shipped behavior depends on; the rest are prior alignment-run scratch artifacts, and 39380 scratch files were already tracked at base)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/ (folder in place of its 109 files: deep-review run state, not shipped behavior)`

