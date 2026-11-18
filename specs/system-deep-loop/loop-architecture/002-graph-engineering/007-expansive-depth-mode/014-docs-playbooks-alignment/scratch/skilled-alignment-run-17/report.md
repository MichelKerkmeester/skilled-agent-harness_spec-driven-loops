# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set full-diff
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `9f456e735c2a901b1c643ed45325132ebd146d17`, 157 first-parent commits
- Files: 1903, of which 1 uncommitted or untracked
- Owners: 17
- Findings: 42 (P0 0, P1 0, P2 42), 23 literal, 3 inferred, 2 outside the scope; 1 more overturned by the critic and not counted
- Open findings: 38 (4 handed off, 0 rebutted)
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
| pass | P2 | no | `S1-quality-gate` | 0 | 2316 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 1382 |
| pass | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 0 | 5176 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 924 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 226 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 234 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 500 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 1089 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 43 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 44 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 43 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 42 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 46 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6354 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 36 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6274 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 108 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 128 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 276 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/ROUTER.md` | 0 | 278 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 240 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.7.0.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/quality-guards.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-focus-alignment.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-no-single-weak-source.md` | 0 | 383 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-source-diversity.md` | 0 | 329 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 280 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 278 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 234 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-band-budget-rolls-down.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-dashboard-section.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/composite-review-convergence-stop-behavior.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/dimension-coverage-convergence-signal.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 269 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 266 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 265 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md` | 0 | 276 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 576 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-expansive-lineage-budget.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md` | 0 | 250 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 276 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/frontier-admit-script.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/upsert-script.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/scripts/README.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/dashboard.md` | 0 | 71 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/prompt-pack.md` | 0 | 70 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/dashboard.md` | 0 | 73 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/prompt-pack.md` | 0 | 71 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/unit/README.md` | 0 | 282 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/SKILL.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.13.5.0.md` | 0 | 267 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1391 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 70 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 109 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 274 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 45 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 62314 |
| fail | P2 | no | `S5-derived-counts` | 1 | 184 |
| pass | P2 | no | `S5-readme-references` | 0 | 2019 |
| pass | P2 | no | `S6-release-coverage` | 0 | 51 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 36 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 387 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 30 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 4463 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 113 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 230 |
| pass | P2 | no | `S8-advisor-status` | 0 | 203 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 46 |
| fail | P2 | no | `S9-command-references` | 1 | 64 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 421 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 36 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 309 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 46 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 37 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 43 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 40 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 38 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 65 |
| pass | P2 | no | `S13-env-tokens` | 0 | 194 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2170 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1924 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1582 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1588 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1572 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1733 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1727 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1785 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1575 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1804 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1796 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1601 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1654 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1770 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 139 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 56 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 6824 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1402 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 49 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 55 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 34 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 43 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1976 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 587 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 36 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 211 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 47 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1941 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3641 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 365 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1715 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 525 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 134 |

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

- **A1-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:216`: dedupeKey's prefix regex /^[a-z]{1,2}-?\d+(?:-\d+)*\s*:\s*/ strips more than the question ids the comment at lines 210-213 promises (Q3, RQ-12, F-1-001). After lowercasing, ordinary technical tokens such as ES2015, H2, V8, S3 or IE11 match too. Two distinct proposals like 'ES2015: what changed in module loading?' and 'ES2022: what changed in module loading?' get the same key, and admission prunes ...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && node -e 'const {dedupeKey}=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"); console.log...` exit 0: true how is the cache invalidated (a full admitProposals run over the two ES proposals returned {"admitted":["F-2-004"],"pruned":[{"nodeId":"F-2-005","reason":"dedupe"}]})
- **A1-2** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:797`: The comment claims admission 'can only prune' a proposal under a closed node, but checkProposal (lines 525-527) prunes only a child of a missing or pruned parent. A child of a node closed as answered, blocked, exhausted or abstained passes every check and is admitted open. In the documented order (step_frontier_admit runs before step_reduce_state, and the reducer writes 'answered' during reduce at...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && node -e 'const m=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"),fs=require("fs"),os=re...` exit 0: {"admitted":["F-2-002"],"pruned":[]}
- **A1-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:1016`: readProposalRows swallows a JSON.parse error with an empty catch and no comment. A torn frontier_proposal line in the leaf's delta is dropped with exit 0: nothing goes to stderr, and no pruned row is written to the store, so nobody can tell the proposal existed. floor.silent-failures (code-quality-standards.md:115) asks that an exception reach the caller or be logged with context. readNodeStore to...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && D=$(mktemp -d) && printf '{"type":"frontier_proposal","parentId":"root","question":"q one?","scope":"a","evidence":"e"}\...` exit 0: {"admitted":["F-1-001"],"pruned":[]} exit=0, store holds 1 row; the torn second proposal left no trace and no stderr
- **A1-4** P2 judgment `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts:471`: The new CLI's fail-closed paths have no test. These include exit 2 with '--known-texts must hold a JSON array' (frontier-admit.cjs:991), the non-array seed input (line 997), an unknown command (line 1031), a missing flag value (line 955) and the exit-2 envelope in main (lines 1094-1096). The two suites spawn the CLI only on success paths (frontier-admit.vitest.ts:471, 638, 706 and frontier-admit-r...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && grep -rn 'known-texts' .skilled/skills/system-deep-loop/runtime/tests --include='*.ts'; D=$(mktemp -d) && echo '{}' > $D...` exit 2: grep: no matches; [frontier-admit] --known-texts must hold a JSON array; exit=2
- **A2-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1955`: The review reducer leaves visits out of the frontier count when they failed (FRONTIER_FAILED_STATUSES, line 33, applied in reviewFrontierVisits at line 1955 and in buildReviewFrontier's covered-dimension filter). No review test checks this. Every frontier fixture in deep-review-state-reducer.vitest.ts uses completed records. The only error record in that file (line 385) is not attributed to any fr...
  - Evidence: `grep -rln frontierNodeId .skilled/skills/system-deep-loop/runtime/tests | xargs grep -ln "'error'\|'timeout'\|'failed'"; sed -n '376,386p' .skilled/skills/system-deep-loop/runtime/tests/unit/deep-revi...` exit 0: Only deep-review-state-reducer.vitest.ts matches, and its single error record (line 385) is {type:'iteration', iteration:2, status:'error', focus:'dim-2'} in the non-frontier test 'shows a landed iteration as error when the still-fails row follows it'.
- **A2-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1965`: review.maintainability (repeated logic that behaves differently). The review and research reducers each hold their own copy of the frontier projection: the 50/35/15 band budget, the roll-down, FRONTIER_STATUSES, FRONTIER_FAILED_STATUSES and the node-marker regex. The copies are review applyReviewFrontierBudget (line 1965) and research applyFrontierBudget (deep-research/scripts/reduce-state.cjs:252...
  - Evidence: `grep -n 'Math.max(0, visits - covered)' .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs; grep -n 'Revisits:\|Frontier size:\|function applyFrontierBudget' .skilled/skills/system-deep...` exit 0: runtime 2538: return total + Math.max(0, visits - covered); research 2524: function applyFrontierBudget(...); research 3129: Frontier size ... ${stats.abstained} abstained; research 3131: Revisits: ... frontierNodeVisits(...) - 1
- **A4-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:648`: The new extension helpers readJson and stateRows return Record<string, any> (lines 648, 649, 652, 656). The resolver places this file in the SKILLED surface, whose universal checklist (Type Safety) says 'TypeScript: strict mode, no `any`', P2 when the type check passes. The base file had no `any`, and unlike the three `as any` added in stop-decision-yaml-contract.vitest.ts, which carry an eslint-d...
  - Evidence: `grep -nE "Record<string, any>" .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` exit 0: 648, 649, 652, 656: four Record<string, any> sites, all added by this diff (0 at base 21c4b325b5a)
- **A4-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts:182`: researchPackPath reads process.env.DEEP_RESEARCH_PACK_TEMPLATE at module scope. The comment says the override exists for the lockstep case, but the same path feeds every research-pack case: the rendered allow-list, the lineage render, findingsCount/keyQuestions, the narrative-to-nextFocus parse and both research frontier-block cases. Case: the manual playbook research-prompt-pack-contract.md step ...
  - Evidence: `grep -rn DEEP_RESEARCH_PACK_TEMPLATE .skilled | grep -v node_modules` exit 0: prompt-pack.vitest.ts:182 (module-scope const) and manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md:48 (sets it for a whole-file vitest run)

### S2 Skill docs match sk-create-skill

- **B1-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:229`: NEVER rule 7 says the leaf agent never edits research/research.md. That is the opposite of shipped behavior. This diff's prompt pack (assets/prompt-pack-iteration.md.tmpl ALLOWED WRITE PATHS) grants the leaf research.md when progressiveSynthesis is true, and so do the agent definition (.claude/agents/deep-research.md:42,298) and changelog v1.15.16.0. The package's own README.md:111 and references/...
  - Evidence: `grep -n "research.md" .claude/agents/deep-research.md; grep -n "never edits" .skilled/skills/system-deep-loop/deep-research/SKILL.md` exit 0: 42: Also allowed are `research/research.md` only when `progressiveSynthesis == true` ... | SKILL.md 229: ...never edits `research/research.md`, which the workflow rebuilds at synthesis
- **B1-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:179`: Iteration step 7 tells the leaf to leave research/research.md to the workflow. This diff's prompt pack and the agent definition allow a progressive synthesis write when progressiveSynthesis is true. The same file's line 63 and line 110 say research.md is updated during the loop. The diff edited this file (version 1.14.13.0) and left the step stale.
  - Evidence: `grep -n "Leave \`research/research.md\` to the workflow" .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` exit 0: 179:7. Leave `research/research.md` to the workflow, which owns it through synthesis
- **B1-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:172`: 'Without the flag, the prior budget carries over' reads as an unchanged duration budget. The shipped extend step adds the prior budget again: addedMinutes defaults to priorMaxDurationMinutes, so the new budget is max(prior, elapsed) + prior. SKILL.md:135, loop-protocol.md §Completed-run extension step 3 and the deep-research.yaml extend_minutes input all state that default correctly.
  - Evidence: `grep -n "addedMinutes" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 517: const addedMinutes = hasMinutes ? Number(extendMinutesRaw) : priorMaxDurationMinutes;
- **B1-4** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:169`: The state-file list adds frontier-nodes.jsonl for an expansive run but leaves out research/frontier-seed.json. The seed step writes that file on an expansive run as the input to frontier-admit.cjs seed. README.md (state table, new row) and references/state/state-format.md §Frontier Node Store both name it, so SKILL.md's list is incomplete.
  - Evidence: `grep -n "^State files include" .skilled/skills/system-deep-loop/deep-research/SKILL.md` exit 0: 169:State files include ... plus `frontier-nodes.jsonl` on an expansive run.
- **B2-1** P2 judgment `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:1`: The deep-review package bumped SKILL.md to 1.13.0.0 and in the same range made --extend=N and --extend-minutes=M live for review (SKILL.md argument-hint, completed-continue lifecycle mode no longer deferred in review-mode-contract.yaml, new catalog entry and DRV-070). Yet no deep-review package changelog records the feature. v1.13.0.0 covers only expansive depth mode, and older mentions of complet...
  - Evidence: `grep -c -- "--extend" .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md; grep -l -- "--extend" .skilled/skills/system-deep-loop/deep-review/changelog/*.md | wc -l` exit 0: research v1.16.0.0: 5 lines mention --extend; deep-review changelog files mentioning --extend: 0

### S3 Feature catalog entries

- **B3-3** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md:51`: The Validation And Tests row types executor-audit-cli-branch-receipts.test.ts as 'Node test'. The file imports from 'vitest', and runtime/vitest.config.ts runs it through the tests/**/*.{vitest,test}.ts include, so the row names the wrong runner. The matching playbook DLR-064 also runs it with npx vitest.
  - Evidence: `head -20 .skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts | grep -n import; grep -n include .skilled/skills/system-deep-loop/runtime/vitest.config.ts` exit 0: 16:import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'; / 46: include: ['tests/**/*.{vitest,test}.ts']
- **B3-4** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:133`: This change adds per-group test counts to the Validation And Tests rows: fanout-run.md:133 has '(13 tests ...)' and '(4 tests ...)', and fanout-merge.md:103 has '(7 tests)', '(6 tests)' and '(9 tests)'. sk-create-feature-catalog section 7 says catalog prose 'must not freeze measured counts or dated snapshots'. The counts match the suites today, and the validator's lexical snapshot regex misses the...
  - Evidence: `grep -rnoE "\([0-9]+ tests[^)]{0,40}" .skilled/skills/system-deep-loop/runtime/feature-catalog` exit 0: fanout-merge.md:103:(7 tests / (6 tests / (9 tests; fanout-run.md:133:(13 tests ... / (4 tests ...; append-mode-event-script.md:45:(11 tests (pre-existing, out of lane)
- **B4-1** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md:54`: The entry claims (section 2, Attempt Identity) that runtime/scripts/divergent-pivot.cjs carries the attempt number and retry signal through its prepare and finalize subcommands, but its Validation And Tests table omits the only test that drives that CLI seam, runtime/tests/unit/divergent-pivot-cli.vitest.ts, which this diff extended with the case "finalize prints a retryable quorum failure and a s...
  - Evidence: `grep -c 'divergent-pivot.cjs' .skilled/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts .skilled/skills/system-deep-loop/runtime/tests/unit/divergent-pivot-seat-scope.vitest...` exit 0: ...ivergent-council-quorum-retry.md:52:3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot-cli.vitest` .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md:94:| `divergent-pivot-cli.vitest` | Retryable finalize output |

### S4 Playbooks match sk-create-manual-testing-playbook

- **B3-1** P2 literal `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md:31`: DLR-060's Expected signals say 'the four prompt-pack cases pass', but no set of four exists. Command 3 runs all of tests/unit/prompt-pack.vitest.ts with no -t filter, and the 'research prompt pack and agent definition lockstep' group now holds five cases (lines 251, 260, 272, 284, 294). An operator cannot observe the stated signal, which breaks the standard's Determinism rule (observable expected ...
  - Evidence: `grep -nE "^\s*(describe|it|test)\(" .skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` exit 0: 250:describe('research prompt pack and agent definition lockstep' ... followed by it() at 251, 260, 272, 284, 294 (five cases); the file holds 22 cases in total
- **B3-2** P2 literal `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:223`: The root summary for DLR-060 repeats the stale 'the four prompt-pack cases passing' signal. The command it summarizes runs the whole prompt-pack suite, and the lockstep group holds five cases, so the root and the scenario both state a count nobody can observe.
  - Evidence: `grep -no 'the four prompt-pack cases pass[a-z]*' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` exit 0: 223:the four prompt-pack cases passing

### S5 READMEs match sk-create-readme, root included

- **BAT-01** P2 judgment: S5-derived-counts failed (exit 1). [handed off]
  - Disposition: Owner: check_derived_readme_counts.py owner. The S5-derived-counts row fails only on .skilled/skills/system-skill-advisor/README.md line 141, where the checker reads 'its two sidecar files' in a troubleshooting row as a numeric file-count claim. That is a false positive in the checker, not README drift: lane C3 confirmed the database has two sidecar files (-shm and -wal), and the line is unchanged...
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/bin/README.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/deep-research/...` exit 1: ... and its two sidecar files under `runtime/database/`, then rebuild with `--trusted --force` | FAIL .skilled/skills/system-skill-advisor/README.md: claims=1 failures=1 PASS .skilled/skills/system-spec-kit/README.md: claims=0 failures=0 PASS README.md: claims=1 failures=0 SUMMARY files=7 pass=6 fail=1
- **C1-1** P2 judgment `.skilled/skills/system-deep-loop/deep-research/README.md:109`: The README's research-packet artifact table gained the two expansive files frontier-nodes.jsonl and frontier-seed.json, but not frontier-graph-events.json, which step_frontier_graph_upsert writes into the artifact directory on every expansive iteration. references/state/state-format.md's new Frontier Node Store section leaves it out too, so the only doc naming it is the expansive-depth-mode catalo...
  - Evidence: `sed -n 1907,1914p .skilled/commands/deep/assets/deep-research.yaml; grep -rln 'frontier-graph-events' .skilled/skills/system-deep-loop/deep-research/` exit 0: enabled_when: "depth_mode == 'expansive'" ... frontier-admit.cjs graph --artifact-dir "{artifact_dir}" --output "{artifact_dir}/frontier-graph-events.json"; only match in the package: feature-catalog/convergence/expansive-depth-mode.md
- **C4-2** P2 literal `.skilled/skills/system-deep-loop/README.md:31`: The hub README's runtime summary lists what the shared runtime holds but leaves out the frontier node store this scope adds (runtime/scripts/frontier-admit.cjs, read by convergence.cjs for the frontierOpen veto and the frontier_drained review stop, and partitioned across lineages by fanout-run.cjs/fanout-merge.cjs). The hub README mentions neither frontier nor expansive anywhere, even though the r...
  - Evidence: `grep -n 'holds executor config' .skilled/skills/system-deep-loop/README.md; grep -c -i -E 'frontier|expansive' .skilled/skills/system-deep-loop/README.md` exit 1: 31:... The shared `runtime/` beneath both modes holds executor config, prompt-pack rendering, atomic state and the coverage graph. 0
- **X-1** P2 literal `README.md:255`: The root README's deep-loop section, added in this range, says the expansive frontier 'turns a stop into another pass while one stays open, though never past the iteration cap'. The iteration cap is named as the only limit, but the max-duration stop also beats the veto. In deep-research.yaml, step_check_max_duration sets STOP/maxDurationReached and skip_to: phase_synthesis whether or not a node is...
  - Evidence: `grep -n 'never past the iteration cap' README.md; grep -n -A3 'if_reached:' .skilled/commands/deep/assets/deep-research.yaml | sed -n 1,4p; grep -n 'the max-duration stop' .skilled/skills/system-deep-...` exit 0: ...on cap. | deep-research.yaml step_check_max_duration if_reached: set { decision: STOP, reason: maxDurationReached } ... skip_to: phase_synthesis | convergence.md:70 and deep-review SKILL.md:222: never outranks the iteration cap, consecutive failures, stuck recovery, pause, the max-duration stop, ...

### S6 Changelogs updated or created

- **C1-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:150`: The budget item states the floor only for a native fan-out lineage dealt no seed node. The shipped code and every other doc (README, loop-protocol.md, convergence.md) say a CLI lineage runs at 10. A CLI fan-out reader is left to assume 12.
  - Evidence: `grep -n 'floor is the budget' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` exit 0: 334:// floor is the budget that lineage would otherwise have run: 12 for a native lineage,
- **C1-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:138`: The list of stops the frontier veto never outranks leaves out the max-duration stop. SKILL.md, convergence.md and the expansive-depth-mode catalog entry all name it, so a reader of the changelog could expect an expansive run to outlive maxDurationMinutes. (inferred)
- **C1-4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:133`: The scope changed how two opt-in modes combine, and no changelog entry says so: under --convergence-mode=divergent, an expansive run's pivot is eligible only once no frontier node is open or active. convergence.md and the divergent-convergence-mode catalog entry gained this rule in the diff, but the 'A run keeps going while nodes stay open' item does not mention it. Add one bullet there, such as: ... (inferred)
- **C1-5** P2 literal `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:75`: 'Its waiver awaits operator sign-off.' is process status, not a reader-facing change. sk-create-changelog SKILL.md section 8 item 2 says to drop process detail, and this sentence goes stale once the sign-off happens. The bullets before it already tell the reader the paragraph has no effect on a default run. (inferred)
- **C2-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:197`: How It Was Checked says the Review admission helper suite (tests/unit/frontier-admit-review.vitest.ts) ran 18 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 36 passed. git blame dates the count line to 7ab0b520296. The suite file changed in later commits on this branch, and the entry itself was re-edited afterwards (9ff752dc5f6, 555be348b61) without...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/frontier-admit-review.vitest.ts` exit 0: Tests 36 passed (36)
- **C2-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:198`: How It Was Checked says the Shared admission table suite (tests/unit/frontier-admit.vitest.ts) ran 24 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 58 passed. git blame dates the count line to 7ab0b520296. The suite file changed in later commits on this branch, and the entry itself was re-edited afterwards (9ff752dc5f6, 555be348b61) without updatin...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/frontier-admit.vitest.ts` exit 0: Tests 58 passed (58)
- **C2-3** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:199`: How It Was Checked says the Reducer suite (tests/unit/deep-review-state-reducer.vitest.ts) ran 32 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 35 passed. git blame dates the count line to 7ab0b520296. The suite file changed in later commits on this branch, and the entry itself was re-edited afterwards (9ff752dc5f6, 555be348b61) without updating th...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/deep-review-state-reducer.vitest.ts` exit 0: Tests 35 passed (35)
- **C2-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:200`: How It Was Checked says the Stop decision suite (tests/unit/stop-decision.vitest.ts) ran 92 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 113 passed. git blame dates the count line to 7ab0b520296. The suite file changed in later commits on this branch, and the entry itself was re-edited afterwards (9ff752dc5f6, 555be348b61) without updating the cou...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/stop-decision.vitest.ts` exit 0: Tests 113 passed (113)
- **C2-5** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:201`: How It Was Checked says the Stop decision YAML contract suite (tests/unit/stop-decision-yaml-contract.vitest.ts) ran 34 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 57 passed. git blame dates the count line to 7ab0b520296. The suite file changed in later commits on this branch, and the entry itself was re-edited afterwards (9ff752dc5f6, 555be348b6...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/stop-decision-yaml-contract.vitest.ts` exit 0: Tests 57 passed (57)
- **C2-6** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:202`: How It Was Checked says the Divergent pivot suite (tests/integration/divergent-pivot.vitest.ts) ran 26 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 28 passed. git blame dates the count line to 7ab0b520296. The suite file changed in later commits on this branch, and the entry itself was re-edited afterwards (9ff752dc5f6, 555be348b61) without updati...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run tests/integration/divergent-pivot.vitest.ts` exit 0: Tests 28 passed (28)
- **C2-7** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:203`: How It Was Checked says the Fan-out runner suite (tests/unit/fanout-run.vitest.ts) ran 207 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 215 passed. git blame dates the count line to 7ab0b520296. The suite file changed in later commits on this branch, and the entry itself was re-edited afterwards (9ff752dc5f6, 555be348b61) without updating the coun...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/fanout-run.vitest.ts` exit 0: Tests 215 passed (215)
- **C2-8** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:204`: How It Was Checked says the Fan-out merge suite (tests/unit/fanout-merge.vitest.ts) ran 88 passed, and the entry says the suites "ran on this branch". At HEAD 9f456e735c2 that suite runs 93 passed. git blame dates the count line to 7ab0b520296. The suite file changed in later commits on this branch, and the entry itself was re-edited afterwards (9ff752dc5f6, 555be348b61) without updating the count...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/fanout-merge.vitest.ts` exit 0: Tests 93 passed (93)
- **C3-1** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.7.0.md:40`: The shared runtime changed heavily in this range (23 files under system-deep-loop/runtime/lib and runtime/scripts, including the new frontier-admit.cjs, the divergent-pivot quorum retry, the landed-iteration redispatch skip, the --claude-config-dir dispatch, source quality_class derivation and the fan-out review coverage merge), but runtime/changelog has no new entry and still ends at deep-loop-ru...
  - Evidence: `git -c core.fsmonitor=false diff --name-status 21c4b325b5a 9f456e735c2 -- .skilled/skills/system-deep-loop/runtime/changelog; git -c core.fsmonitor=false diff --stat 21c4b325b5a 9f456e735c2 -- .skille...` exit 0: runtime/changelog: no added files (newest v1.9.17.0); runtime lib+scripts: 23 files changed, 2732 insertions(+), 159 deletions(-); runtime -> ../../skills/system-deep-loop/runtime/changelog

### S9 Commands aligned

- **BAT-02** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Owner: validate-command-references.cjs owner. The S9-command-references row fails only on .skilled/commands/speckit/assets/speckit-resume.yaml:104, which names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file (.gitignore:431, lane D) the YAML falls back from. The YAML is right; the checker needs a runtime-state exemption. Same hand-off as runs 15 and 16.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
- **D-1** P2 judgment `.skilled/commands/deep/review.md:100`: The --depth-mode row gives the caps as 'maxDepth 3, maxChildrenPerNode 6' with no root exception. A review root takes up to 8 depth-1 children: frontier-admit.cjs:61 sets ROOT_CHILDREN_FLOOR review: 8, readCaps (frontier-admit.cjs:317) sets maxRootChildren = max(maxChildrenPerNode, 8), and deep-review.yaml:329 and :910 ask the seed step for 3 to 8 sub-targets. Run 16 accepted this as C4-5 for deep...
  - Evidence: `grep -n "ROOT_CHILDREN_FLOOR = \|maxRootChildren" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 61:const ROOT_CHILDREN_FLOOR = Object.freeze({ research: 6, review: 8 }); 317: maxRootChildren: Math.max(maxChildrenPerNode, ROOT_CHILDREN_FLOOR[target]), 399: return parentId === 'root' && Number.isFinite(caps.maxRootChildren) ? caps.maxRootChildren : caps.maxChildrenPerNode;
- **D-2** P2 literal `.skilled/commands/deep/assets/deep-review-presentation.txt:39`: The PRE-BOUND SETUP ANSWERS example indents lineage_mode, extend and extend_minutes by one space while every other field uses two. The extend and extend_minutes lines are new in this diff and copy the one-space indent of the existing lineage_mode line. auto-mode-contract.md section 2 says 'Each field is ` <key>: <value>` indented two spaces, one per line', and the block is described as YAML-style,...
  - Evidence: `grep -n "^ [a-z_]*: " .skilled/commands/deep/assets/deep-review-presentation.txt | cut -c1-40` exit 0: 39: lineage_mode: auto # one of: auto | 40: extend: "" # optional positive inte 41: extend_minutes: "" # optional posit
- **D-3** P2 judgment `.skilled/commands/deep/assets/deep-research.yaml:1793`: The rewritten command_note says the check 'prints one machine reason (dispatch_failed|...|delta_file_missing|executor_missing)' and then exempts 'executor_missing, findings_not_enumerated and ledger_backing_missing' from redispatch. Two of the three exempted reasons are not in its own list. verify-iteration.cjs REASONS also returns state_log_malformed, delta_file_malformed and gateway_bypass_detec...
  - Evidence: `grep -n "FINDINGS_NOT_ENUMERATED: \|LEDGER_BACKING_MISSING: \|STATE_LOG_MALFORMED: \|DELTA_FILE_MALFORMED: \|GATEWAY_BYPASS_DETECTED: " .skilled/skills/system-deep-loop/runtime/scripts/verify-iteratio...` exit 0: 73: STATE_LOG_MALFORMED: 'state_log_malformed', 74: DELTA_FILE_MALFORMED: 'delta_file_malformed', 75: FINDINGS_NOT_ENUMERATED: 'findings_not_enumerated', 76: GATEWAY_BYPASS_DETECTED: 'gateway_bypass_detected', 77: LEDGER_BACKING_MISSING: 'ledger_backing_missing',
- **D-4** P2 judgment `.skilled/commands/deep/assets/deep-review.yaml:1888`: Same as D-3 on the review side: the rewritten command_note lists eight reasons (with iteration_verdict_missing) and then exempts findings_not_enumerated and ledger_backing_missing, which its list omits. findings_not_enumerated is mostly a review reason (verify-iteration.cjs:534-546 branches on loopType === 'review'), so the omission matters most here.
  - Evidence: `grep -n "FINDINGS_NOT_ENUMERATED: \|LEDGER_BACKING_MISSING: \|STATE_LOG_MALFORMED: \|DELTA_FILE_MALFORMED: \|GATEWAY_BYPASS_DETECTED: " .skilled/skills/system-deep-loop/runtime/scripts/verify-iteratio...` exit 0: 73: STATE_LOG_MALFORMED: 'state_log_malformed', 74: DELTA_FILE_MALFORMED: 'delta_file_malformed', 75: FINDINGS_NOT_ENUMERATED: 'findings_not_enumerated', 76: GATEWAY_BYPASS_DETECTED: 'gateway_bypass_detected', 77: LEDGER_BACKING_MISSING: 'ledger_backing_missing',

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **C3-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/README.md:32`: Section 3 FILES lists 26 of the folder's 35 .cjs scripts. These nine are missing: check-ledger-stem-producers.cjs, check-projection-coverage.cjs, iteration-graph-upsert.cjs, loop-heartbeat.cjs, review-verdict.cjs, run-now-sentinel.cjs, runtime-bootstrap.cjs, terminal-gates.cjs and verify-authority.cjs. This range touched the table: it added frontier-admit.cjs and backfilled dispatch-iteration.cjs ... [handed off] [S5, C3]
  - Disposition: Owner: runtime scripts README owner. The nine scripts missing from runtime/scripts/README.md all existed at the base commit and were unlisted there too (the critic marked this pre-existing); this range only added frontier-admit.cjs and backfilled two rows.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && for f in $(ls scripts/*.cjs | xargs -n1 basename); do grep -q "`$f`" scripts/README.md || echo "missing: $f"; done` exit 0: missing: check-ledger-stem-producers.cjs, check-projection-coverage.cjs, iteration-graph-upsert.cjs, loop-heartbeat.cjs, review-verdict.cjs, run-now-sentinel.cjs, runtime-bootstrap.cjs, terminal-gates.cjs, verify-authority.cjs (26 table rows, 35 scripts)
  - Critic override: pre-existing, lane severity P2. All nine scripts the finding names already existed at base 21c4b325b5a (git cat-file -e succeeds for each), and none appears in the base runtime/scripts/README.md (grep for each backticked name in git show 21c4b325b5a:.../runtime/scripts/README.md returns 0). The range added rows but did not create the gap, as the lane itself notes.

### unchanged in range

- **C4-1** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:1`: No open root release notes describe the user-visible deep-loop capabilities this scope ships. The newest root notes, v4.1.0.0, are already tagged, and the tag does not contain the scope's commits (the frontier-admission commit 557dc50d160, the --extend commit 2c80c64f391, the pivot-retry commit df76ba090ef and the review minIterations commit 15f0c2c268e all fail merge-base --is-ancestor against v4... [handed off] [S6, C4]
  - Disposition: Owner: operator (root release notes). The root .skilled/changelog/skilled/v4.1.0.0.md does not describe this program's new deep-loop features (expansive depth mode, --extend, custom review dimensions, the review minIterations floor), and v4.1.0.0 is already tagged. Opening or amending the root release record is the release owner's call, made when this branch lands. Same hand-off as run 16's C4-1; ...
  - Evidence: `git -c core.fsmonitor=false merge-base --is-ancestor 557dc50d160 v4.1.0.0; echo $?; grep -c -i -E 'depth-mode|expansive|frontier|--extend|custom (review )?dimension|minimum iteration' .skilled/changel...` exit 1: frontier-commit-in-v4.1.0.0-tag exit=1; grep count 0 (exit 1); newest root notes file is v4.1.0.0.md

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **C1-6** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:1`: This file is outside the lane's file list, but the S6 lens requires the check. The newest root release notes, v4.1.0.0, are already published: tag v4.1.0.0 exists, and the file at HEAD matches the tagged file. They say nothing about --depth-mode=expansive or --extend/--extend-minutes, two user-visible research capabilities this scope adds. The root README (line 255) does describe both. Unless the ... [S6, C1]
  - Evidence: `git -c core.fsmonitor=false tag --list 'v4.1*'; git -c core.fsmonitor=false diff --stat v4.1.0.0 9f456e735c2 -- .skilled/changelog/skilled/; grep -niE 'expansive|depth-mode|--extend|frontier' .skilled...` exit 1: v4.1.0.0; (no diff between tag and HEAD for root changelog); (no match)
  - Critic override: duplicate, lane severity P2. Same gap as C4-1, which records it with stronger evidence: the newest root notes are .skilled/changelog/skilled/v4.1.0.0.md, already tagged; grep -c -i -E 'depth-mode|expansive|--extend' on it returns 0 (exit 1); and git merge-base --is-ancestor 2c80c64f391 v4.1.0.0 exits 1, so the --extend commit is not in the tag. Keep C4-1.

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

- `.dsh/agents/deep-research.patch.yml`
- `.dsh/agents/deep-review.patch.yml`
- `.vibe/agents/deep-research.toml`
- `.vibe/agents/deep-review.toml`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension/ (packet folder: all 5 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir/ (packet folder: all 14 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor/ (packet folder: all 11 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix/ (packet folder: all 26 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment/ (packet folder: all 8 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields/ (packet folder: all 41 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class/ (packet folder: all 16 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage/ (packet folder: all 9 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge/ (packet folder: all 9 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/ (packet folder: all 3 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/ (packet folder: all 3 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/ (packet folder: all 26 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration/ (packet folder: all 12 uncovered files in it)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment/ (packet folder: all 1431 uncovered files in it)`

