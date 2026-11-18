# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set full-diff
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `7a1b0ec7a1eca4f260338b90825a43db32084e6e`, 146 first-parent commits
- Files: 1845, of which 1 uncommitted or untracked
- Owners: 17
- Findings: 34 (P0 0, P1 5, P2 29), 16 literal, 0 inferred, 3 outside the scope; 6 more overturned by the critic and not counted
- Open findings: 31 (3 handed off, 0 rebutted)
- Lanes: A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 66 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 140 | 7 |
| S3 | Feature catalog entries | yes | 206 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 206 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 219 | 3 |
| S6 | Changelogs updated or created | yes | 216 | 1 |
| S7 | Skill routing is right | yes | 11 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 11 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 20 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 66 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 59 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 199, fail 2, cannot run 0, not applicable 1

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 2376 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 1401 |
| pass | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 0 | 4764 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 996 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 234 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 236 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 495 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 1100 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 45 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 44 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 47 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 43 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 45 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 5807 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 34 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 5727 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 100 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 73 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 101 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/ROUTER.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.7.0.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/quality-guards.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-focus-alignment.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-no-single-weak-source.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-source-diversity.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-band-budget-rolls-down.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-dashboard-section.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/composite-review-convergence-stop-behavior.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/dimension-coverage-convergence-signal.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 231 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 564 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-expansive-lineage-budget.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/frontier-admit-script.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/upsert-script.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/scripts/README.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/dashboard.md` | 0 | 72 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/prompt-pack.md` | 0 | 71 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/dashboard.md` | 0 | 68 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/prompt-pack.md` | 0 | 69 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/unit/README.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/SKILL.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.13.5.0.md` | 0 | 213 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1302 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 63 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 105 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 265 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 44 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 58645 |
| fail | P2 | no | `S5-derived-counts` | 1 | 185 |
| pass | P2 | no | `S5-readme-references` | 0 | 1976 |
| pass | P2 | no | `S6-release-coverage` | 0 | 54 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 33 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 378 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 32 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 3800 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 104 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 217 |
| pass | P2 | no | `S8-advisor-status` | 0 | 118 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 43 |
| fail | P2 | no | `S9-command-references` | 1 | 64 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 420 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 35 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 321 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 49 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 42 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 40 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 38 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 65 |
| pass | P2 | no | `S13-env-tokens` | 0 | 175 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 1993 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1713 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1633 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1652 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1617 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1602 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1613 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1588 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1554 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1792 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1770 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1611 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1606 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1573 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 136 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 52 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 6410 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1237 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 51 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 55 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 34 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 46 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1854 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 574 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 35 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 210 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 49 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1754 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3653 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 312 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1689 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 515 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 135 |

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

- **A1-1** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:739`: closeNode guards only pruned-to-live moves and keeps 'active' in CLOSE_STATUSES, so a node closed as exhausted, answered, blocked or abstained can be revived as active, despite its docstring promise to 'move a node to a later lifecycle status'. A shipped caller sends this: in deep-review.yaml, active_frontier_node is bound once at line 1184; the stuck-recovery branch (lines 1599-1605) closes it as...
  - Evidence: `D=$TMPDIR/local-skilled-alignment-scratch/skilled-alignment-run-16/A1/close-repro; node frontier-admit.cjs seed --artifact-dir $D --input seed.json; node frontier-admit.cjs close --artifact-dir $D --n...` exit 0: {"nodeId":"F-1-001",...,"status":"exhausted","reason":"stuck","iteration":2,...} exit=0 then {"nodeId":"F-1-001",...,"status":"active","reason":null,"iteration":3,...} exit=0
- **A2-1** P1 judgment `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2664`: On an expansive research run, a frontier node closed as exhausted with reason budget makes its question resolved (line 2684). The write-back then marks it '- [x]' in the strategy key questions, lists it under ANSWERED QUESTIONS and saves it as resolved in the registry. On the next reduce, question.checked is true, so line 2664 puts the node in answeredNodeIds, and applyFrontierBudget and buildFron...
  - Evidence: `node ${TMPDIR:-/tmp}/local-skilled-alignment-scratch/skilled-alignment-run-16/A2/scripts/repro-exhausted.cjs .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs ${TMPDIR:-/tmp}/loc...` exit 0: ...ted":1...} F-2-003 frontierStatus exhausted strategy line: - [x] Which limits does admission skip? | - Which limits does admission skip? reduce2(read) ["F-1-001:answered:null","F-2-002:answered:null","F-2-003:answered:null"] stats {..."answered":3,..."exhausted":0...} F-2-003 frontierStatus answered
- **A2-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:1`: The diff changes the file mode from 100755 to 100644 while the script keeps its '#!/usr/bin/env node' shebang. Its CLI siblings query.cjs, status.cjs and loop-lock.cjs stay 100755. Every workflow caller runs it as 'node .../upsert.cjs', so only a direct './upsert.cjs' run, such as a manual repair the doctor assets point at, fails with permission denied. Restore the executable bit with git update-i...
  - Evidence: `git -c core.fsmonitor=false log --format='%h %s' --summary 21c4b325b5a..7a1b0ec7a1e -- .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs | grep 'mode change'; git -c core.fsmonitor=false ls-...` exit 0: mode change 100755 => 100644 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs 100644 blob d4cb94d82ad327b96f55296b73da2d376b2e4f86 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs
- **A3-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:471`: preflightFailure (line 749) no longer refuses on remaining iterations, yet normalizeConfig still accepts, validates and persists antiConvergence.divergent.minRemainingIterations, and the 'insufficient_remaining_iterations' reason stays in the failure union. Case: an operator sets antiConvergence.divergent.minRemainingIterations: 3 and a pivot opens with remainingIterations 1. The pivot proceeds wi...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && grep -n "minRemainingIterations" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` exit 0: ...iningIterations?: number; | 235: readonly minRemainingIterations: number; | 293: minRemainingIterations: 1, | 471-473: normalizeConfig parses antiConvergence.divergent.minRemainingIterations | 1055/1062: persisted limits require and parse it. No other reads: preflightFailure no longer references it.
- **A4-1** P2 literal `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts:437`: The test 'places step_frontier_budget right after the phase_init seed step' never asserts that the budget step comes after the seed step. It slices text from the seed index to the budget index. If step_frontier_budget were moved above step_frontier_seed, that slice is the empty string, the step-key match count is 0, and the test passes. The order it names can be reversed without the test going red...
  - Evidence: `node -e 'const text="x\n step_frontier_budget:\n a: 1\n step_frontier_seed:\n"; const initSeed=text.indexOf(" step_frontier_seed:\n"); const between=text.slice(initSeed, text.indexOf(" step_frontier_b...` exit 0: "" 0
- **CRIT-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1`: A2-2 reported the 100755 to 100644 mode change on upsert.cjs only. Commit ab7312fe467 made the same change to convergence.cjs, which keeps its '#!/usr/bin/env node' shebang. Its CLI siblings query.cjs, status.cjs and loop-lock.cjs stay 100755. The reach matches A2-2: workflow callers run 'node .../convergence.cjs' and reduce-state, terminal-gates and review-verdict require() it, so only a direct '...
  - Evidence: `git -c core.fsmonitor=false diff --summary 21c4b325b5a 7a1b0ec7a1e | grep 'mode change'; git -c core.fsmonitor=false log --format='%h %s' --summary 21c4b325b5a..7a1b0ec7a1e -- .skilled/skills/system-d...` exit 0: ...scripts/convergence.cjs | mode change 100755 => 100644 .../runtime/scripts/upsert.cjs | ab7312fe467 feat(system-deep-loop): veto a soft research stop while frontier nodes stay open | #!/usr/bin/env node | ls-tree HEAD: 100644 convergence.cjs, 100755 query.cjs, 100755 status.cjs, 100755 loop-lock.cjs

### S2 Skill docs match sk-create-skill

- **B1-1** P1 literal `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:158`: This diff rewrote the Quality Gate row, but the row still lists 'no single weak-source dominance' as a rule that must pass. The runtime never evaluates that guard: convergence.cjs:907 hardcodes singleWeakSource = guardOutcome('notEvaluated', []), and guardOutcome (line 848) counts notEvaluated as passed. The catalog entry quality-guards.md was updated in the same diff to call it a reserved entry t...
  - Evidence: `rg -n 'singleWeakSource|notEvaluated' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs; rg -n -A6 '^function guardOutcome' .skilled/skills/system-deep-loop/runtime/scripts/convergence....` exit 0: 907: const singleWeakSource = guardOutcome('notEvaluated', []); 848: return { status, passed: status !== 'failed', violations }; Tests 1 passed | 112 skipped (113)
- **B1-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:123`: This diff rewrote the line, but it still says the legal-stop gates check 'that one weak source does not carry a finding'. That guard is hardcoded notEvaluated (convergence.cjs:907), and quality-guards.md now calls it a reserved entry. The README overview is never read by DR-022, so this is drift rather than a scenario failure. It also leaves out focus alignment, a guard that does run.
  - Evidence: `grep -n 'one weak source does not carry a finding' .skilled/skills/system-deep-loop/deep-research/README.md` exit 0: 123:A normalized score above 0.60 nominates STOP. ... that sources are diverse and that one weak source does not carry a finding. ...
- **B1-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:213`: Rule 12 says the 'no single-weak-source' check must pass before STOP. The shipped guard is never evaluated (convergence.cjs:907) and always counts as passed. SKILL.md therefore describes a check that the shipped code does not run, which contradicts the updated quality-guards.md catalog entry.
  - Evidence: `sed -n '213p' .skilled/skills/system-deep-loop/deep-research/SKILL.md` exit 0: 12. **Quality guards must pass before convergence** -- Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger
- **B1-4** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:135`: The quick reference loads first on every invocation. It lists no-single-weak-source as a quality guard that must pass, but the runtime reports that guard as notEvaluated (convergence.cjs:907). This contradicts quality-guards.md as updated in this diff.
  - Evidence: `sed -n '135p' .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` exit 0: Quality guards (source diversity, focus alignment, no single-weak-source) must pass before STOP.
- **B1-5** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:83`: reduce-state.cjs now writes a per-question `frontierStatus` field into findings-registry.json (lines 1422 and 2706) when a frontier node closes a question. When the question has no iteration evidence, it also derives resolvedAtIteration from the node's closedAtIteration. No markdown file anywhere in system-deep-loop names `frontierStatus`. The Frontier Node Store subsection, which says 'A frontier...
  - Evidence: `rg -n 'frontierStatus' .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs; rg -l 'frontierStatus' .skilled/skills/system-deep-loop --glob '*.md'` exit 1: 1422: ...(question.frontierStatus ? { frontierStatus: question.frontierStatus } : {}), 2706: ...(frontierClose ? { frontierStatus: frontierClose.status } : {}), [no .md hits]
- **B2-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:115`: The Divergent Pivot Contract gives a closed list of five candidate sources, but the changed divergent-review-pivot.ts now seeds a sixth, 'frontier-unanswered', for each frontier node an expansive run closed 'exhausted' or 'blocked'. The reference no longer describes the shipped candidate generation. Case: a divergent review run under --depth-mode=expansive whose frontier closed a node exhausted ge...
  - Evidence: `grep -n -o "Candidate sources are[^.]*\." .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md; grep -n "source: '" .skilled/skills/system-deep-loop/deep-review/scripts/d...` exit 0: 115:Candidate sources are persisted unswept dimensions, search debt, producer-consumer gaps, negative-test gaps, and traceability gaps. | 242 unswept-dimension, 256 search-debt, 276 producer-consumer-gap, 286 negative-test-gap, 305 traceability-gap, 325 frontier-unanswered (6 sources)
- **B2-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:120`: The release note says a sub-target answers once 'every configured dimension' has evidence. The reducer's per-node universe always starts from the four canonical dimensions and only adds custom names (buildReviewFrontier -> buildDimensionUniverse, seeded from REQUIRED_DIMENSIONS), so a subset-configured run still needs all four per node. state-format.md states the correct rule. Case: an expansive r...
  - Evidence: `sed -n 24p .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs; sed -n 1225p .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs; sed -n 2000p .skilled/skills/system-deep-l...` exit 0: const REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability']; | const universe = [...REQUIRED_DIMENSIONS]; | const universe = buildDimensionUniverse(config);
- **B3-1** P2 literal `.skilled/skills/system-deep-loop/changelog/v2.1.7.0.md:38`: The changelog says the golden tests keep a default run's output byte for byte, but research-depth-mode-golden.vitest.ts and review-depth-mode-golden.vitest.ts strip the expansive-only persona paragraph from the lineage prompt before comparing (EXPANSIVE_ONLY_PERSONA_PARAGRAPH, lines 211-221). A default run's lineage prompt now carries that paragraph, so the claim overstates the guarantee. runtime/...
  - Evidence: `grep -n 'byte for byte' .skilled/skills/system-deep-loop/changelog/v2.1.7.0.md; sed -n 211,221p .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts` exit 0: 38:The frontier, stop-decision, fan-out, ledger and reducer suites pass. The golden tests keep a default run's output byte for byte. / // The lineage prompt embeds the agent persona verbatim. ... That paragraph alone is removed before comparison

### S3 Feature catalog entries

- **CRIT-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md:22`: The catalog entry for the divergent review pivot lists five candidate sources. The in-range divergent-review-pivot.ts adds a sixth, 'frontier-unanswered' (line 325), which an expansive run seeds for each frontier node closed exhausted or blocked. The entry no longer describes the shipped feature. C2-6 named this file, but C2-6 is overridden here as a duplicate of B2-1, which covers only references...
  - Evidence: `sed -n 22p .skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md; grep -n "source: '" .skilled/skills/system-deep-loop/deep-review/scripts/divergen...` exit 0: 22: ...Candidate sources include unswept dimensions, search debt, producer-consumer paths, negative-test gaps, and traceability gaps. ... | 242 unswept-dimension, 256 search-debt, 276 producer-consumer-gap, 286 negative-test-gap, 305 traceability-gap, 325 frontier-unanswered

### S5 READMEs match sk-create-readme, root included

- **BAT-01** P2 judgment: S5-derived-counts failed (exit 1). [handed off]
  - Disposition: Owner: check_derived_readme_counts.py owner. The S5-derived-counts row fails only on .skilled/skills/system-skill-advisor/README.md line 141, where the checker reads 'its two sidecar files' in a troubleshooting row as a numeric file-count claim. That is a false positive in the checker, not README drift: lane C3 confirmed the database has two sidecar files (-shm and -wal). Same hand-off as run 15.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/bin/README.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/deep-research/...` exit 1: ... and its two sidecar files under `runtime/database/`, then rebuild with `--trusted --force` | FAIL .skilled/skills/system-skill-advisor/README.md: claims=1 failures=1 PASS .skilled/skills/system-spec-kit/README.md: claims=0 failures=0 PASS README.md: claims=1 failures=0 SUMMARY files=7 pass=6 fail=1
- **C2-5** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md:24`: The catalog understates the Next Focus rule. Line 24 says an uncovered dimension outranks a leaf nextFocus 'that names no dimension'. Lines 3 and 16, and the index entry feature-catalog.md:352, say the same. In code (runtime/scripts/reduce-state.cjs:2404) the leaf focus survives only when it names an uncovered dimension or nothing is uncovered. So a leaf focus naming only an already-covered dimens...
  - Evidence: `sed -n 2402,2407p .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` exit 0: if (leafFocus && (uncovered.length === 0 || uncovered.some((dimension) => leafKey.includes(dimension)))) { return leafFocus; } return uncovered[0] || leafFocus || '[All dimensions covered]';
- **C3-1** P2 literal `.skilled/skills/system-deep-loop/runtime/tests/unit/README.md:19`: The line this diff rewrote adds a semicolon. sk-create-readme section 8 Human Voice Rules says 'No semicolons', and its pre-publish checks require 'HVR passes'. The base version of this README had 0 HVR hard blockers and the head version has 1.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/system-deep-loop/runtime/tests/unit/README.md` exit 1: x1 first@19 hard punctuation ; | hard blockers: 1 (base 21c4b325b5a version: hard blockers: 0)
- **C4-5** P2 judgment `.skilled/skills/system-deep-loop/deep-review/README.md:166`: The README gives the expansive caps as 'maxDepth 3, maxChildrenPerNode 6' with no exception. But frontier-admit.cjs:61 sets ROOT_CHILDREN_FLOOR = { research: 6, review: 8 }, and readCaps (frontier-admit.cjs:310) sets maxRootChildren = max(maxChildrenPerNode, 8) for a review. So a review root takes up to 8 depth-1 sub-targets, and deep-review.yaml:329 asks the seed step for 3 to 8. Someone reading ...
  - Evidence: `grep -n "ROOT_CHILDREN_FLOOR = " .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 61:const ROOT_CHILDREN_FLOOR = Object.freeze({ research: 6, review: 8 });

### S6 Changelogs updated or created

- **C2-1** P1 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:129`: The entry fails the changelog shape gate. One bullet holds a 24-word sentence, over the 22-word ceiling. sk-create-changelog SKILL.md section 9 says an exit 1 from check_changelog_shape.py blocks the write.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` exit 1: FAIL ... [sentence-max] line 129: a sentence of 24 words, ceiling 22. Split it
- **C2-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:100`: An Oxford comma sits in a three-item series (caps..., caps..., and caps...). SKILL.md section 8 rule 5 bans Oxford commas. hvr_scan flags it as a candidate. The other candidates it flags (lines 58, 63, 123, 136 and v1.12.0.0 line 16) join clauses, so they are not defects.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py --all .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` exit 0: 100:79 review oxford-comma-candidate , and
- **C2-3** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:179`: The How It Was Checked table says the review command reference holds 1 --depth-mode match, the flag row. Commit 0c6b0c6a900 later added the setup line review.md:41, so the command the entry names (line 64) now finds 2. The entry belongs to no tagged release, so the After cell can still be corrected.
  - Evidence: `rg -c -- '--depth-mode' .skilled/commands/deep/review.md` exit 0: 2
- **C2-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md:22`: The three glance bullets (lines 22-24) open with bold lead-ins. assets/changelog-template.md line 209 says the folded summary header is the one place bold text appears. Line 34 names bold lead-in bullets as an older layout not to copy. The same rule is a voice-gate structural check in SKILL.md section 9.
  - Evidence: `grep -n '\*\*' .skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` exit 0: 22:- **A review below its floor continues.** ... 23:- **The floor is checked before the legal-stop gates.** ... 24:- **The shipped floor is unchanged.** ...
- **C3-2** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.7.0.md:20`: The entry uses the compact shape (summary, bullet glance list, Upgrade) for 11 changes. changelog-template.md section 5 requires the expanded format at 10 or more changes: a glance table with a Section column, Why This Release, topical H2 sections with anchored H4 items, How It Was Checked and Upgrade Notes. All 11 glance bullets also open with bold text, which template section 4 forbids ('No bold...
  - Evidence: `awk '/^## What.s New at a Glance/{g=1;next} /^## /{g=0} g && /^- /' .skilled/skills/system-deep-loop/changelog/v2.1.7.0.md | wc -l; grep -c '^- \*\*' .skilled/skills/system-deep-loop/changelog/v2.1.7....` exit 0: glance=11 boldlead=11
- **C3-3** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md:21`: Every glance bullet opens with bold text. changelog-template.md section 4 Structure: 'No bold text outside a folded block's summary header. No bold lead-in bullets.' The SKILL.md section 9 structural checks repeat the rule. The other entries written in the same batch (v2.1.3.0 to v2.1.6.0) follow it. Rewrite the bullets as plain sentences.
  - Evidence: `grep -c '^- \*\*' .skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` exit 0: 5 (all 5 glance bullets)
- **C3-4** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md:21`: Every glance bullet opens with bold text, which changelog-template.md section 4 forbids ('No bold lead-in bullets'). Rewrite the bullets as plain sentences, as v2.1.3.0 to v2.1.6.0 do.
  - Evidence: `grep -c '^- \*\*' .skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` exit 0: 4 (all 4 glance bullets)
- **C3-5** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md:21`: Every glance bullet opens with bold text, which changelog-template.md section 4 forbids ('No bold lead-in bullets'). Rewrite the bullets as plain sentences.
  - Evidence: `grep -c '^- \*\*' .skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` exit 0: 6 (all 6 glance bullets)
- **C3-6** P2 judgment `.skilled/skills/system-spec-kit/changelog/v2.13.5.0.md:21`: Every glance bullet opens with bold text, which changelog-template.md section 4 forbids ('No bold lead-in bullets'). Rewrite the bullets as plain sentences.
  - Evidence: `grep -c '^- \*\*' .skilled/skills/system-spec-kit/changelog/v2.13.5.0.md` exit 0: 3 (all 3 glance bullets)
- **C4-2** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.7.0.md:28`: fanout-run.cjs now exports DEEP_LOOP_COVERAGE_DB_DIR to graph-db/ inside every fan-out lineage (commit d68f9261a5c). Commit d68f9261a5c says this also changes default fan-out runs of both loop types: before it, a lineage that respected its write limit ran with no graph and could stop only at its cap. No new hub, deep-research or deep-review changelog entry names this. v2.1.7.0 describes only the e...
  - Evidence: `grep -l -i -E "graph-db|DEEP_LOOP_COVERAGE_DB_DIR" .skilled/skills/system-deep-loop/changelog/v2.1.*.md .skilled/skills/system-deep-loop/deep-research/changelog/v1.1[56]*.md .skilled/skills/system-dee...` exit 1: 

### S9 Commands aligned

- **BAT-02** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Owner: validate-command-references.cjs owner. The S9-command-references row fails only on .skilled/commands/speckit/assets/speckit-resume.yaml:104, which names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file (.gitignore:431, lane D) the YAML falls back from. The YAML is right; the checker needs a runtime-state exemption. Same hand-off as run 15.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

### S10 Agents aligned

- **CRIT-1** P2 literal `.skilled/agents/deep-research.md:181`: Cross-lane gap. The agent body says 'The orchestrator flags single-weak-source answers during convergence quality checks.' convergence.cjs:907 hard-codes singleWeakSource to notEvaluated, which counts as passed, so no weak-source check runs. Lanes B1 and C1 raised the same claim in the deep-research README, SKILL.md, quick-reference and convergence.md (B1-1 to B1-4), but no lane named the agent. A...
  - Evidence: `sed -n 181p .skilled/agents/deep-research.md; git -c core.fsmonitor=false show 21c4b325b5a:.skilled/agents/deep-research.md | sed -n 180p; rg -n "singleWeakSource = guardOutcome" .skilled/skills/syste...` exit 0: 181: **Source diversity**: Aim for >=2 independent sources per key finding. The orchestrator flags single-weak-source answers during convergence quality checks. (identical at base line 180) | convergence.cjs:907: const singleWeakSource = guardOutcome('notEvaluated', []);

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **B1-6** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:963`: The root H2 sections are out of sequence: '## 14. FAN-OUT', then '## 16. INTRA ROUTING RECALL' (963), then '## 15. AUTOMATED TEST CROSS-REFERENCE' (1076), then a second '## 15. FEATURE CATALOG CROSS-REFERENCE INDEX' (1083). The standard's root scaffold numbers its H2s sequentially and ends with the automated-test and catalog cross-reference sections. This diff rewrote the body of the second '## 15... [S4, B1]
  - Evidence: `grep -nE '^## 1[3-7]\.' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` exit 0: 851:## 13. COMMAND FLOW STRESS TESTS 905:## 14. FAN-OUT 963:## 16. INTRA ROUTING RECALL 1076:## 15. AUTOMATED TEST CROSS-REFERENCE 1083:## 15. FEATURE CATALOG CROSS-REFERENCE INDEX
  - Critic override: pre-existing, lane severity P2. The lane says so and the base confirms it. git show 21c4b325b5a:.../deep-research/manual-testing-playbook/manual-testing-playbook.md has '## 16. INTRA ROUTING RECALL' at line 807, then '## 15. AUTOMATED TEST CROSS-REFERENCE' at 920 and '## 15. FEATURE CATALOG CROSS-REFERENCE INDEX' at 927. That is the same 16/15/15 order HEAD has.

### unchanged in range

- **C4-1** P1 judgment `.skilled/changelog/skilled/v4.1.0.0.md:237`: No root release-notes entry describes the user-visible capabilities this scope adds: --depth-mode=expansive with its frontier node store (frontier-admit.cjs, the convergence.cjs frontierOpen veto and frontier_drained stop, the fan-out frontier partition), --extend=N / --extend-minutes=M, custom review dimensions, and the review minIterations floor. The root README (line 255) now describes these, b... [handed off] [S6, C4]
  - Disposition: Owner: operator (root release notes). The gap is that the root .skilled/changelog/skilled/v4.1.0.0.md does not describe this program's new deep-loop features (expansive depth mode, --extend, custom review dimensions, the review minIterations floor), and v4.1.0.0 is already tagged. Opening or amending the root release record is the release owner's call, made when this branch lands. Same hand-off as...
  - Evidence: `grep -c -i -E "expansive|--extend|frontier|custom dimension" .skilled/changelog/skilled/v4.1.0.0.md` exit 1: 0
- **C4-4** P2 literal `.skilled/skills/system-deep-loop/runtime/tests/fixtures/README.md:24`: This scope adds the fixture folders golden-research-default/ and golden-review-default/. research-depth-mode-golden.vitest.ts:29 and review-depth-mode-golden.vitest.ts:31 read them, and running with GOLDEN_UPDATE=1 regenerates them. The fixtures README directory tree (lines 24-29) and FILES table (lines 35-40) still list only the four authorized-ledger and event files. A FILES row for each folder ... [S5, C4]
  - Evidence: `grep -c golden .skilled/skills/system-deep-loop/runtime/tests/fixtures/README.md` exit 1: 0

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **C4-3** P2 judgment `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:129`: convergence.cjs dropped the loopType === 'research' guard on the minIterations floor (commit 15f0c2c268e), so every review now holds at CONTINUE with minIterationsNotReached until it reaches the shipped antiConvergence.minIterations of 2. A review that is clean on pass 1 used to stop and now runs a second pass. That changes the default path, but no changelog states it: deep-review v1.13.0.0 line 1... [S6, C4]
  - Evidence: `grep -l minIterationsNotReached .skilled/skills/system-deep-loop/changelog/v2.1.*.md .skilled/skills/system-deep-loop/deep-review/changelog/v1.1[23]*.md` exit 1: 
  - Critic override: refuted, lane severity P2. The evidence glob deep-review/changelog/v1.1[23]* cannot match v1.11.18.0.md. That range-added entry documents exactly this change. Line 3: 'A review stop candidate below its configured minIterations now continues with minIterationsNotReached, as research runs already did. The shipped floor of 2 is unchanged.' Line 16: 'The floor now applies to review runs too.' Line 22 names CONTINUE with reason ...

### duplicate

- **C1-1** P1 literal `.skilled/skills/system-deep-loop/deep-research/README.md:123`: This rewritten line says the legal-stop gates check that one weak source does not carry a finding. That check does not ship: convergence.cjs hard-codes singleWeakSource to notEvaluated, so it can never block a stop. The README now disagrees with quality-guards.md, which this scope reworded to call the entry reserved, and with playbook DR-022, which fails any source that claims a per-source strengt... [S5, C1]
  - Evidence: `grep -n 'one weak source does not carry a finding' .skilled/skills/system-deep-loop/deep-research/README.md; grep -n "singleWeakSource = guardOutcome('notEvaluated'" .skilled/skills/system-deep-loop/r...` exit 0: README.md:123: ...that sources are diverse and that one weak source does not carry a finding. ... | convergence.cjs:907: const singleWeakSource = guardOutcome('notEvaluated', []);
  - Critic override: duplicate, lane severity P1. Duplicate of B1-2: same file, line 123 and sentence, with the same fix intent. Dropping C1-1 is also a severity call, P1 to P2. DR-022 reads convergence.md, not the README, so the README claim does not fail a scenario. The claim already existed at base line 121; this range only rewrote the line around it. B1-2 at P2 is the right grade.
- **C1-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:158`: This scope edited the Quality Gate row but kept 'no single weak-source dominance' as a check that must pass. The code never evaluates singleWeakSource (convergence.cjs:907 always returns notEvaluated). Playbook DR-022 reads this row first and fails any source that claims this check. [S5, C1]
  - Evidence: `grep -n 'no single weak-source dominance pass' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` exit 0: 158:| Quality Gate | Source diversity, focus alignment, and no single weak-source dominance pass | `CONTINUE` with `qualityGuardFailed`, no `blocked_stop` event |
  - Critic override: duplicate, lane severity P2. Duplicate of B1-1: same convergence.md:158 Quality Gate row and the same fix. B1-1 keeps P1 because the range rewrote both that row and DR-022, whose new FAIL rule fails on it.
- **C1-3** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:213`: Rule 12 still says source diversity, focus alignment and no-single-weak-source checks must pass before STOP. The single-weak-source check is not evaluated (convergence.cjs:907). This line was not edited by this scope, but SKILL.md is in scope and now disagrees with the reworded quality-guards.md and DR-022. (inferred) [S5, C1]
  - Critic override: duplicate, lane severity P2. Duplicate of B1-3: same deep-research SKILL.md:213 rule 12 claim. B1-3 carries the literal fix.
- **C1-4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:135`: Says the quality guards (source diversity, focus alignment, no single-weak-source) must pass before STOP. singleWeakSource is a reserved entry that is always notEvaluated, so the quick reference names a check the code does not run. This scope edited the decision tree just below this line but left the claim in place. (inferred) [S5, C1]
  - Critic override: duplicate, lane severity P2. Duplicate of B1-4: same quick-reference.md:135 line. B1-4 carries the literal fix.
- **C2-6** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:115`: The divergent pivot contract lists its candidate sources as unswept dimensions, search debt, producer-consumer gaps, negative-test gaps and traceability gaps. scripts/divergent-review-pivot.ts now adds a fifth source, frontier-unanswered. Under --depth-mode=expansive it seeds one read-only revisit direction for each frontier node closed exhausted or blocked. feature-catalog/severity-system/diverge... [S5, C2]
  - Evidence: `git -c core.fsmonitor=false diff 21c4b325b5a 7a1b0ec7a1e -- .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` exit 0: + source: 'frontier-unanswered', + title: `Revisit ${status} frontier node ${nodeId}`,
  - Critic override: duplicate, lane severity P2. Duplicate of B2-1 for deep-review references/convergence/convergence.md:115. B2-1 carries the literal fix and counts six sources correctly; C2-6 says 'fifth'. The second file C2-6 named, feature-catalog/severity-system/divergent-convergence-mode.md:22, is kept as CRIT-2.

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

- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension/ (packet folder: goal.md + scratch/ 4 files; does not matter: goal slice 2502 chars under the 4000 limit, scratch is tracked run evidence, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir/ (packet folder: goal.md + scratch/ 13 files; does not matter: goal slice 2044 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor/ (packet folder: goal.md + scratch/ 10 files; does not matter: goal slice 2594 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix/ (packet folder: goal.md + scratch/ 25 files; does not matter: goal slice 3321 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment/ (packet folder: goal.md + scratch/ 7 files; does not matter: goal slice 3146 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields/ (packet folder: goal.md + scratch/ 40 files; does not matter: goal slice 3611 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class/ (packet folder: goal.md + scratch/ 15 files; does not matter: goal slice 3354 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage/ (packet folder: goal.md + scratch/ 8 files; does not matter: goal slice 2843 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge/ (packet folder: goal.md + scratch/ 8 files; does not matter: goal slice 2684 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/ (packet folder: goal.md + scratch/ 2 files; does not matter: goal slice 3745 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/ (packet folder: goal.md + scratch/ 2 files; does not matter: goal slice 3765 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/ (packet folder: goal.md + scratch/ 25 files; does not matter: goal slice 2517 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration/ (packet folder: goal.md + scratch/ 11 files; does not matter: goal slice 2266 chars, secret scan clean)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment/ (packet folder: goal.md + scratch/ 1372 files of earlier alignment-run lanes and logs; does not matter: goal slice 3674 chars, scratch is tracked by repo convention with 39380 scratch files at base, secret scan of all 1561 gap files returned 0 hits)`
- `.dsh/agents/deep-research.patch.yml (generated mirror of .skilled/agents/deep-research.md, which Lane D reviewed; no battery row replays dsh sync; checked by hand: sync-agents-dsh.cjs --check exit 0, 11 patches in sync; carries the CRIT-1 line)`
- `.dsh/agents/deep-review.patch.yml (generated mirror; sync-agents-dsh.cjs --check exit 0 by hand)`
- `.vibe/agents/deep-research.toml (generated mirror; no battery row replays vibe sync; sync-agents-vibe.cjs --check exit 0 by hand, 11 profiles in sync; carries the CRIT-1 line)`
- `.vibe/agents/deep-review.toml (generated mirror; sync-agents-vibe.cjs --check exit 0 by hand)`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json (does not matter: cmp shows it byte-identical to .skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json, which Lane D reviewed)`

