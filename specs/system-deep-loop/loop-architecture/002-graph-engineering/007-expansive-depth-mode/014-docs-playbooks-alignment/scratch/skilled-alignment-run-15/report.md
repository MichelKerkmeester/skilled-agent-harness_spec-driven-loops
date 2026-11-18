# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set full-diff
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `83af96cb5af5dca28f6da0676955d773a8f693d0`, 129 first-parent commits
- Files: 1786, of which 1 uncommitted or untracked
- Owners: 17
- Findings: 52 (P0 0, P1 2, P2 50), 28 literal, 3 inferred, 1 outside the scope; 4 more overturned by the critic and not counted
- Open findings: 49 (3 handed off, 0 rebutted)
- Lanes: A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 65 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 140 | 7 |
| S3 | Feature catalog entries | yes | 205 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 205 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 218 | 3 |
| S6 | Changelogs updated or created | yes | 215 | 1 |
| S7 | Skill routing is right | yes | 11 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 11 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 20 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 65 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 59 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 199, fail 2, cannot run 0, not applicable 1

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 2477 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 1395 |
| pass | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 0 | 5066 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1019 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 256 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 269 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 560 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 1230 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 50 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 53 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 48 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 47 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 49 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6185 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 39 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6091 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 116 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 82 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 116 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/ROUTER.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.7.0.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 234 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 258 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 266 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 267 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 234 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/quality-guards.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-focus-alignment.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-no-single-weak-source.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-source-diversity.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-band-budget-rolls-down.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-dashboard-section.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/composite-review-convergence-stop-behavior.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/dimension-coverage-convergence-signal.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 534 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-expansive-lineage-budget.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 232 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/frontier-admit-script.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/upsert-script.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/scripts/README.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/dashboard.md` | 0 | 79 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/prompt-pack.md` | 0 | 76 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/dashboard.md` | 0 | 72 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/prompt-pack.md` | 0 | 72 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/unit/README.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/SKILL.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.13.5.0.md` | 0 | 233 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1523 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 73 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 130 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 333 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 47 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 62790 |
| fail | P2 | no | `S5-derived-counts` | 1 | 207 |
| pass | P2 | no | `S5-readme-references` | 0 | 2085 |
| pass | P2 | no | `S6-release-coverage` | 0 | 49 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 36 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 392 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 31 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 3881 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 105 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 225 |
| pass | P2 | no | `S8-advisor-status` | 0 | 164 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 43 |
| fail | P2 | no | `S9-command-references` | 1 | 65 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 416 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 35 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 315 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 46 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 38 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 43 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 39 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 67 |
| pass | P2 | no | `S13-env-tokens` | 0 | 187 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2044 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1813 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1598 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1618 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1602 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1639 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1616 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1611 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1630 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1813 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1813 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1660 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1646 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1594 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 153 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 54 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 6792 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1342 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 47 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 55 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 33 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 51 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1923 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 570 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 35 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 215 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 45 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2111 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3607 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 314 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1900 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 567 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 126 |

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

- **A2-1** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:324`: classifySourceLocation runs `if (extension === '.jsonl' || /ledger/i.test(fileName)) return classes.LEDGER_STATE;` before its repo-code fallback, so any source file whose name contains 'ledger' is classed as ledger state. That includes deep-research-ledger-schema.ts and check-ledger-stem-producers.cjs. This contradicts the declared contract in runtime/feature-catalog/coverage-graph/source-quality-...
  - Evidence: `sed -n '302,332p' .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs > classify.js; node -e '<define upsert.cjs constants; eval classify.js; print classifySourceLocation(p, SOURCE_QUALITY_CLA...` exit 0: ...tem-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts ledger-state .skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs repo-code .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs ledger-state specs/x/deep-research-state.jsonl
- **A1-1** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:580`: The comment in admitProposals says a 'missing or unreadable' review config gives the no-target object and admits every scope. An unreadable or unparsable config does not do that. readTargetConfig (lines 271-277) throws on it, and readCaps on line 579 calls it before the review options are built, so the CLI fails closed with exit 2. Only a missing config, or one that parses to a non-object such as ...
  - Evidence: `printf '{not json' > <dir>/deep-review-config.json; node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs admit --artifact-dir <dir> --input <one frontier_proposal row> --target rev...` exit 2: [frontier-admit] cannot read deep-review-config.json: Expected property name or '}' in JSON at position 1 (line 1 column 2)
- **A2-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:453`: Every research SOURCE node now gets a derived quality_class, including 'unclassified' when no field names a location. The diversity signal counts any non-empty class string (coverage-graph-signals.ts:680-683), so 'unclassified' counts as a distinct source kind. Case: a finding that cites one repo file and one free-text source named 'Maintainer interview' gets {repo-code, unclassified} = 2, which c...
  - Evidence: `node -e '<same harness over upsert.cjs lines 302-332>' on 'Maintainer interview' and convergence.cjs` exit 0: unclassified Maintainer interview repo-code .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs
- **A2-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:662`: The new fail-closed branch that refuses a legacy 'extended' row whose extension budget has a missing or non-integer field (reason run-extended-budget-missing) has no test. append-mode-event-legacy-seam.vitest.ts covers only the happy-path upcast of a complete extended row. Case: a legacy extended row without extension.newMaxIterations is never exercised, so a regression that defaulted the ceiling ...
  - Evidence: `grep -rn run-extended-budget-missing .skilled/skills/system-deep-loop/runtime/tests` exit 1: 
- **A3-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:875`: The fan-in partition guard runs only when at least one lineage registry carries a frontier (hasFrontier at :875 for research and :1139 for review). When fanout-run recorded a frontier_partition but no lineage registry has a frontier, the merge returns no frontier key, no partitionGuard, no frontier_partition_guard output field and no stderr warning, although every dealt node is unreported. A regis...
  - Evidence: `node -e 'const m=require("./.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"); const v=m.mergeReviewRegistries([{label:"a",registry:{openFindings:[],resolvedFindings:[]}},{label:"b",...` exit 0: {"hasFrontier":false,"guard":null} (mergeResearchRegistries with the same partition and frontier-less registries prints the same)
- **A3-2** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:556`: The diff rewrote the step-2 comment (:500-504) to say the projected state row now carries the route-proof fields and the delta is only a fallback for older rows, but the step-4 comment it governs still says the delta is read 'before the projection dropped it' (:555-556). The two comments now contradict each other about whether the projection drops the route-proof fields, so the WHY a reader takes ... (inferred)
- **A3-3** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:568`: The reworded warning says the state row 'lacked route proof', but stateRouteReason comes from checkRouteProof (:256-273), which returns ROUTE_PROOF_MISMATCH as well as ROUTE_PROOF_MISSING. A state row that carries mode/target_agent with wrong values, rescued by a valid delta, is reported as lacking the fields, which points an operator at the wrong cause. No test pins this text (the only reference,... (inferred)
- **A3-4** P2 judgment `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:178`: seedViolatesReadOnlyBoundary now removes quotedScope from the focus before it runs the mutation-verb guard (:178), on the docstring premise that the scope is path data (:35). For a frontier-unanswered seed, the scope is the node scope that a leaf proposed. frontier-admit.cjs scopeInsideReviewTarget returns true for any review target that is not a file list (:484), and fan-out binds review_target_t... (inferred)
- **A4-1** P2 literal `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:798`: The test titled '... extends under the lock, before classification ...' compares extendAt against lockAt without first asserting the step_acquire_lock anchor was found. If step_acquire_lock is renamed, re-indented or removed from deep-research.yaml or deep-review.yaml, indexOf returns -1 and expect(extendAt).toBeGreaterThan(lockAt) still passes, so the 'under the lock' half of the contract cannot ...
  - Evidence: `node -e '...indexOf("\n step_acquire_lock:\n") and indexOf("\n step_extend_completed_run:\n") on .skilled/commands/deep/assets/deep-{research,review}.yaml'` exit 0: deep-research.yaml lockAt 27554 extendAt 30314; deep-review.yaml lockAt 31070 extendAt 33830; extendAt > -1 in both, so with lockAt = -1 the ordering assertion would still pass

### S2 Skill docs match sk-create-skill

- **B1-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:228`: The README scenario count was updated in this diff to 72, but the shipped playbook holds 74 scenarios across 9 categories. The root playbook itself says 74, and the validator derives 74.
  - Evidence: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook; grep -n 72 .skille...` exit 0: PASS package=system-deep-loop/deep-research tier=FAIL_CLOSED scenarios=74 categories=9 ... | README.md:228 holds 72 deterministic scenarios across 9 categories
- **B1-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:266`: The README resource table repeats the stale playbook count of 72. The playbook ships 74 scenarios.
  - Evidence: `grep -n '72 scenarios' .skilled/skills/system-deep-loop/deep-research/README.md` exit 0: 266:| [`manual-testing-playbook/`](./manual-testing-playbook/) | 72 scenarios with expected signals and verdict rules |
- **B1-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:223`: The Step 2c rewrite added in this diff points to 'convergence.md §2, Decision Priority steps 8 and 9'. convergence.md section 2 is STOP CONTRACT, and the numbered list lives under '## 3. LIVE ALGORITHM' > '### Decision Order'. No 'Decision Priority' heading exists. Steps 8 (quality guards) and 9 (graph) are numbered correctly.
  - Evidence: `grep -n '^#' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` exit 0: 90:## 2. STOP CONTRACT / 121:## 3. LIVE ALGORITHM / 123:### Decision Order (no 'Decision Priority' heading)
- **B2-3** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:51`: SKILL.md says this quick reference loads first on every invocation. This run added the --depth-mode row to its Parameters table but no row for the other new operator flags, --extend and --extend-minutes, which the command doc defines (.skilled/commands/deep/review.md:107-108) and the command argument-hint advertises. They appear only inside the lifecycle-mode table, so the flag table no longer lis...
  - Evidence: `sed -n 44,51p .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md; grep -n '^| `--extend' .skilled/commands/deep/review.md` exit 0: Parameters rows: --max-iterations, --convergence, --depth-mode, --stop-policy, --spec-folder, --restart; command doc rows 107 `--extend`, 108 `--extend-minutes`
- **B2-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/SKILL.md:4`: The SKILL.md body now documents --depth-mode=expansive (section 3 Expansive Depth Mode) and --extend=N (Lifecycle modes), but the frontmatter argument-hint still lists only the pre-change flags. The skill's advertised invocation shape therefore omits both new capabilities. sk-doc sets no argument-hint rule, so this is a current-state accuracy gap, not a standard violation.
  - Evidence: `grep -n 'argument-hint' .skilled/skills/system-deep-loop/deep-review/SKILL.md` exit 0: 4:argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--stop-policy=convergence|max-iterations]"
- **B2-5** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:44`: The packet-artifact table gained frontier-nodes.jsonl but not frontier-seed.json. README.md and state-format.md, changed in the same range, both list frontier-seed.json as an expansive-run packet file written once by the seed step, so this reference disagrees with its siblings on the expansive artifact set.
  - Evidence: `grep -n 'frontier-seed.json' .skilled/skills/system-deep-loop/deep-review/README.md .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md .skilled/skills/system-deep-loop/deep-...` exit 0: README.md and state-format.md each list frontier-seed.json; state-outputs.md has no match
- **B3-11** P2 judgment `.skilled/skills/system-deep-loop/runtime/tests/unit/README.md:101`: The rows for research-depth-mode-golden.vitest.ts (line 101) and review-depth-mode-golden.vitest.ts (line 103) say a default run 'keeps its pre-expansive output byte for byte'. Both golden tests first strip the expansive-only persona paragraph from the CLI lineage prompt, then compare, as the tests' own header comments and deep-research SKILL.md line 91 say. The rows should name that strip, for ex...
  - Evidence: `grep -n 'stripped before\|alone is removed' .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts; grep -n 'byte for byte' .skilled/skills/system-deep-loop/runtime/t...` exit 0: 10: applies only to expansive runs. That paragraph alone is stripped before the; 214: alone is removed before comparison; README 101/103: ... keeps its pre-expansive output byte for byte.
- **CR-1** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:5`: Cross-lane miss: lane B2 reported (B2-4) that the deep-review SKILL.md argument-hint omits --depth-mode and --extend, but lane B1 reviewed the deep-research SKILL.md and left the identical gap. Its frontmatter hint still reads '[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]' while the body documents --depth-mode=expansive and --extend=N (lifecycle completed-continue). Whatever B2-...
  - Evidence: `grep -n 'argument-hint' .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md` exit 0: deep-research/SKILL.md:5:argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]" deep-review/SKILL.md:4:argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--stop-policy=convergence|max-iterations]"
- **CR-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:59`: Cross-lane miss mirroring B2-3: this scope added a --depth-mode row to the deep-research quick reference Parameters table (line 59) but no row for --extend=N or --extend-minutes=M, which the command defines and its argument-hint advertises. They appear only in the lifecycle note at line 107, so the flag table no longer lists every operator flag the mode added. Lane B1 reviewed this file without re...
  - Evidence: `grep -n 'extend\|depth-mode' .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` exit 0: 59:| `--depth-mode` | default | `expansive` grows a depth-capped frontier ... 105:| Frontier | `research/frontier-nodes.jsonl` | ... 107:> **Live lifecycle branches:** `new`, `resume`, `restart`, and `completed-continue` through `--extend=N`, with `--extend-minutes=M` ...

### S3 Feature catalog entries

- **B3-5** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md:44`: A role cell in the source table records change history ('Checked, not edited by this change.'). A feature catalog describes current shipped behavior, and this sentence goes stale once the change is no longer the latest one.
  - Evidence: `grep -nF 'Checked, not edited by this change.' .skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` exit 0: 44:| `.skilled/agents/deep-research.md` | Agent contract | The rule the rendered pack must match. Checked, not edited by this change. |
- **B3-6** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:43`: Current-state catalog text uses change-history wording ('The floor now applies to review as well as research').
  - Evidence: `grep -nF 'The floor now applies to review as well as research.' .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` exit 0: 43:... The floor now applies to review as well as research. ...
- **B3-7** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:604`: The convergence.cjs root entry uses change-history wording ('now applies to review as well as research') in a current-state catalog.
  - Evidence: `grep -nF 'now applies to review as well as research.' .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` exit 0: 604:... The `minIterations` floor (`minIterationsNotReached`) now applies to review as well as research.
- **B3-8** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:74`: The per-feature HOW IT WORKS text uses change-history wording ('Each CLI lineage now keeps its coverage graph').
  - Evidence: `grep -nF 'Each CLI lineage now keeps its coverage graph in' .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` exit 0: 74:the write limit would skip every graph step. Each CLI lineage now keeps its coverage graph in
- **B4-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md:44`: The diff to runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts (iteration_completed now admits target_agent, agent_definition_loaded, resolved_route, findingsCount, keyQuestions and the telemetry fields, line 671) and runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts (optionalLeafFields keeps those fields through the upcast, lines 496 and 712) is what lets the pro...
  - Evidence: `bash -c 'R=.skilled/skills/system-deep-loop; grep -rl legacy-compatibility.ts $R/feature-catalog $R/deep-research/feature-catalog $R/deep-review/feature-catalog $R/runtime/feature-catalog | wc -l | tr...` exit 0: 0
- **B4-2** P2 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md:57`: The entry claims the schema refuses a run_extended event whose newMaxIterations is not continuedFromRun plus addedIterations, and it states the budget, fan-out refusal and precondition rules. Its Validation table anchors only deep-research-reducers.vitest.ts and the DR-065 playbook. The tests that pin those claims are missing from it: deep-research-ledger-schema.vitest.ts ('refuses an extension wh...
  - Evidence: `grep -c 'workflow-restart-lifecycle\|deep-research-ledger-schema.vitest' .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` exit 1: 0
- **B4-3** P2 literal `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md:57`: The entry claims the deep-review reducer routes run_extended and adopts the new ceiling as the run's cap, and it states the budget and refusal rules. Its Validation table anchors only deep-review-ledger-schema.vitest.ts and the DRV-070 playbook. Two tests are missing from it: deep-review-reducers.vitest.ts ('run_extended' group: 'raises the projected iteration ceiling and keeps the run live') and ...
  - Evidence: `grep -c 'deep-review-reducers.vitest\|workflow-restart-lifecycle' .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` exit 1: 0
- **B4-4** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:30`: runtime/scripts/reduce-state.cjs (renderFrontierSection, lines 2529-2558) adds a `## 10B. FRONTIER` section to the review dashboard on an expansive run only. The section shows frontier size by status, pruned nodes, revisits (visits that covered no new dimension), spent and allotted iterations per budget band, and the active node with its next dimension. deep-review-state-reducer.vitest.ts pins it ...
  - Evidence: `bash -c 'grep -rln "10B\|Frontier size\|ANCHOR:frontier" .skilled/skills/system-deep-loop/deep-review --include=*.md | grep -v changelog | wc -l | tr -d " "'` exit 0: 0
- **B4-5** P2 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md:50`: runtime/lib/legacy-projections/deep-research-contract.ts now projects a deep_research.run_extended ledger event into the state-log row {event: 'extended', lineageMode: 'completed-continue', continuedFromRun, extension}. The entry's own claim depends on that row: 'The lifecycle event filters in deep-research/scripts/reduce-state.cjs read the same event'. The Implementation table never names the pro...
  - Evidence: `grep -c 'legacy-projections\|append-mode-event-legacy-seam' .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md .skilled/skills/system-deep-loop/de...` exit 1: .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md:0 .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md:0
- **B4-6** P2 literal `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md:50`: runtime/lib/legacy-projections/deep-review-state-contract.ts now projects a deep_review.run_extended event into an 'extended' state-log row (lineageMode 'completed-continue', continuedFromRun, extension). The entry says runtime/scripts/reduce-state.cjs reads the extension through its live lineage modes, and that reading depends on this row. The Implementation table omits the projection, and no cat...
  - Evidence: `grep -c 'legacy-projections\|append-mode-event-legacy-seam' .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md .skilled/skills/system-deep-loop/de...` exit 1: .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md:0 .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md:0

### S4 Playbooks match sk-create-manual-testing-playbook

- **B1-4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md:52`: DR-023 was rewritten in this diff to trace the qualityGuardFailed path, but its command sequence still pins line ranges that print unrelated text. 'sed -n 218,247p deep-research.yaml' prints no convergence step; step_check_convergence is at line 1209 and the qualityGuardFailed rule at 1223/1243. 'sed -n 97,107p loop-protocol.md' prints the init Outputs list, while Step 2c is at line 221. 'sed -n 1...
  - Evidence: `sed -n '97,107p' .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md; grep -n 'Step 2c' .../loop-protocol.md; grep -n 'step_check_convergence:\|qualityGuardFailed' .ski...` exit 0: 97-107 prints init Outputs and Auto-Resume Protocol; 221:#### Step 2c: Quality Guard Check; 1209: step_check_convergence:; 1223/1243 qualityGuardFailed
- **B1-5** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-source-diversity.md:50`: DR-020 was edited in this diff to the no-event guard contract, but its commands still pin 'sed -n 97,107p loop-protocol.md' (init Outputs, not Step 2c at line 221) and 'sed -n 236,243p deep-research.yaml' (gate_defaults, not step_check_convergence at 1209). Line 56 still asks for 'the state_format event schema example', which no longer applies now that a failed guard writes no event. Lines 60 and ...
  - Evidence: `sed -n '236,243p' .skilled/commands/deep/assets/deep-research.yaml` exit 0: gate_defaults: after_gate_refresh_lock: ... (no quality-guard text)
- **B1-6** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-focus-alignment.md:50`: DR-021 was edited in this diff, but it keeps the same stale pins as DR-020: loop-protocol.md 97-107 (init Outputs; Step 2c is at 221) and deep-research.yaml 236-243 (gate_defaults; step_check_convergence is at 1209). Line 56 still asks for 'the state_format supported guard values list', which state-format.md no longer carries for a no-event guard. Lines 60 and 76 cite a nonexistent 'convergence.md...
  - Evidence: `sed -n '97,107p' .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` exit 0: - In **auto mode**: accept the charter ... ### Outputs ... ### Auto-Resume Protocol
- **B1-7** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-no-single-weak-source.md:50`: DR-022 was edited in this diff, but its step 3 'sed -n 183,195p state-format.md' prints nothing because state-format.md is 155 lines, so the sourceStrength evidence it asks for cannot be captured. Steps 5 and 6 keep the stale loop-protocol 97-107 and deep-research.yaml 236-243 pins. Lines 61 and 77 cite a nonexistent 'convergence.md §2.4 Quality Guard Protocol'.
  - Evidence: `wc -l .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md; sed -n '183,195p' .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` exit 0: 155 lines; sed prints empty output
- **B2-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md:82`: DRV-071 records a catalog exception ('No dedicated fan-out catalog entry exists for deep-review yet'), but this run added runtime/feature-catalog/fanout/fanout-review-coverage-merge.md, which documents exactly these six merged surfaces and anchors DRV-071 back. deep-review's own catalog also has loop-lifecycle/fanout-dispatch.md. The playbook standard (ALWAYS 6/7) says to link the matching catalog...
  - Evidence: `git -c core.fsmonitor=false diff --name-status 21c4b325b5a 83af96cb5af -- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md; grep -n 'fan-out-merged' .ski...` exit 0: ...illed/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md; 53:| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | Manual playbook | DRV-071: a merged two-lineage review keeps its coverage surfaces. |
- **B2-2** P2 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:31`: The root overview says the expansive-only agent paragraph 'is waived pending operator ratification', and DRV-076 (entry-points-and-modes/expansive-depth-flag-and-default-identity.md:34) repeats it. That is a temporary governance status, not current runtime behavior, in a doc the standard binds to evergreen current-state wording (sk-doc/shared/references/evergreen-packet-id-rule.md: describe the cu...
  - Evidence: `grep -rn 'ratification' .skilled/skills/system-deep-loop/deep-review/ | grep -v changelog` exit 0: ...re-change baseline only by the expansive-only agent paragraph, which is waived pending operator ratification. ...; manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:34: ... That paragraph is waived pending operator ratification, and the comparison strips it.
- **B3-1** P2 literal `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:106`: The runtime playbook's release-clearance rule still names 56 scenarios after this diff added DLR-060 to DLR-066. The overview at line 39 says 58, the category counts sum to 58, and there are 58 scenario files. Read literally, the rule clears a release with two scenarios unrun.
  - Evidence: `for c in $(find .skilled/skills/system-deep-loop/runtime/manual-testing-playbook -mindepth 1 -maxdepth 1 -type d); do ls $c/*.md; done | wc -l; grep -n 'provides 58\|all 56 scenarios' .skilled/skills/...` exit 0: 58 scenario files; 39: This playbook provides 58 deterministic scenarios across 12 categories ...; 106: Release is cleared only when all 56 scenarios are `PASS` ...
  - Critic override: severity P1 to P2. Lanes disagree on the same line: B3-1 grades runtime manual-testing-playbook.md:106 (all 56 scenarios vs 58 at line 39, confirmed at HEAD) P1, while C3-1 grades the identical line P2. Every sibling stale-count finding in this run (B1-1, B1-2, B3-2, B3-3, C3-2, C3-3) is P2, and this one is the same kind of prose count drift with a literal one-number fix, so P2 keeps the grading consistent.
- **B3-10** P2 judgment `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md:19`: The 'Why This Matters' section of DLR-062 describes earlier behavior ('A quorum miss used to end a pivot for good. A resumed or later pivot could also be refused ...'). Restate it as the risk the scenario guards against, for example: 'Without the retry, one missed seat round ends a pivot; without the per-pivot cap, a later pivot is refused for seats an earlier one spent.'
  - Evidence: `grep -nF 'used to end a pivot' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` exit 0: 19:A quorum miss used to end a pivot for good. A resumed or later pivot could also be refused because an earlier pivot had spent seats. ...
- **B3-2** P2 literal `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:229`: The new section 9 package index gives deep-research 72 scenarios. The deep-research package root says 74, and the package holds 74 scenario files (75 .md files minus the command-flow-stress-tests README).
  - Evidence: `grep -n 'provides 74' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md; find .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook -mi...` exit 0: 30: This playbook provides 74 deterministic scenarios across 9 categories ...; 75 (includes command-flow-stress-tests/README.md)
- **B3-3** P2 literal `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:231`: The new section 9 package index gives runtime 56 scenarios. The runtime package root overview says 58, and the package holds 58 scenario files.
  - Evidence: `grep -n 'provides 58' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md; find .skilled/skills/system-deep-loop/runtime/manual-testing-playbook -mindepth 2 -na...` exit 0: 39: This playbook provides 58 deterministic scenarios across 12 categories ...; 58
- **B3-4** P2 literal `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:678`: This diff edits the FAN-OUT category intro, and the edited line keeps the packet-history phrase 'added in packet 124'. The evergreen packet-id rule (sk-doc shared/references/evergreen-packet-id-rule.md) gives 'Added in packet 033' as its example violation.
  - Evidence: `grep -nF 'added in packet 124' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` exit 0: 678:This category covers 12 scenarios validating the opt-in multi-executor fan-out layer added in packet 124: ...
- **B3-9** P2 judgment `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md:19`: DLR-061 frames its rationale as change history. Line 19 says 'Before this change no producer set `quality_class`', and line 15 says the signal 'now reads those derived classes ... instead of only on fixtures'. Both should say what the behavior protects today, for example: 'If no producer sets quality_class, the source-diversity guard has nothing real to read.'
  - Evidence: `grep -nE 'Before this change|now reads' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` exit 0: 15: ... the `sourceDiversity` signal now reads those derived classes on normal runs instead of only on fixtures that typed one in.; 19:Before this change no producer set `quality_class`, ...

### S5 READMEs match sk-create-readme, root included

- **BAT-01** P2 judgment: S5-derived-counts failed (exit 1). [handed off]
  - Disposition: Owner: check_derived_readme_counts.py owner. The S5-derived-counts row fails only on .skilled/skills/system-skill-advisor/README.md line 141, where the checker reads 'its two sidecar files' in a troubleshooting row as a numeric file-count claim. That is a false positive in the checker, not README drift, and the same row was handed off in earlier runs.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/bin/README.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/deep-research/...` exit 1: ... and its two sidecar files under `runtime/database/`, then rebuild with `--trusted --force` | FAIL .skilled/skills/system-skill-advisor/README.md: claims=1 failures=1 PASS .skilled/skills/system-spec-kit/README.md: claims=0 failures=0 PASS README.md: claims=1 failures=0 SUMMARY files=7 pass=6 fail=1
- **C2-3** P2 judgment `.skilled/skills/system-deep-loop/deep-review/README.md:143`: The skill README adds --extend=N and --extend-minutes=M but leaves out two operator-facing limits. First, the extension keeps the run's stop policy, so under the default policy an extended run can re-stop at its first convergence check. Second, --extend refuses fan-out. The root README (line 255) and references/protocol/loop-protocol.md (Completed-run extension, Convergence window) state both, so ...
  - Evidence: `grep -c -i 're-stop\|refuses fan-out' .skilled/skills/system-deep-loop/deep-review/README.md; grep -n -o 'It keeps the stop policy the run was created with, so under the default policy it can re-stop ...` exit 0: 0 255:It keeps the stop policy the run was created with, so under the default policy it can re-stop at once
- **C4-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/README.md:33`: The section 3 FILES table has no row for divergent-pivot.cjs or dispatch-iteration.cjs, and this scope changed both (divergent-pivot.cjs: pivot seat scoping and quorum retry, recorded in system-deep-loop v2.1.4.0; dispatch-iteration.cjs: research runs now validate and pass the configured Claude config dir as CLAUDE_CONFIG_DIR, recorded in v2.1.6.0). The table also lacks nine other scripts that thi...
  - Evidence: `S=.skilled/skills/system-deep-loop/runtime/scripts; for f in $S/*.cjs; do b=$(basename $f); grep -q "\`$b\`" $S/README.md || echo "missing: $b"; done` exit 0: ...heck-projection-coverage.cjs missing: dispatch-iteration.cjs missing: divergent-pivot.cjs missing: iteration-graph-upsert.cjs missing: loop-heartbeat.cjs missing: review-verdict.cjs missing: run-now-sentinel.cjs missing: runtime-bootstrap.cjs missing: terminal-gates.cjs missing: verify-authority.cjs

### S6 Changelogs updated or created

- **C1-1** P2 judgment `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:1`: This range makes completed-run extension (--extend=N, --extend-minutes=M, lineage mode completed-continue) live inside the deep-research packet. The packet's SKILL.md lineage table and rule 6, README FAQ, assets/deep-research-config.json allowedModes, references and a new catalog feature (loop-lifecycle/completed-run-extension.md) all change for it. None of the three new deep-research changelog en...
  - Evidence: `grep -rln -- "--extend\|completed-continue\|run_extended" .skilled/skills/system-deep-loop/deep-research/changelog/ ; git -c core.fsmonitor=false show 21c4b325b5a:.skilled/commands/deep/research.md | ...` exit 0: only v1.4.0.0, v1.5.0.0, v1.6.1.0, v1.6.2.0 match (pre-range entries describing it as deferred); base command doc has 0 --extend matches, so the feature is new in this range
- **C2-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:129`: The bullet lists the stop paths that outrank the frontierOpen veto, but it leaves out pause and the max-duration stop. SKILL.md section 3, README.md line 164, references/convergence/convergence.md, references/protocol/quick-reference.md, references/protocol/loop-protocol.md and the depthMode description in assets/review-mode-contract.yaml all name both. A reader of the release entry could think an...
  - Evidence: `grep -n 'still decide first' .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md; grep -c 'pause, the max-duration stop' .skilled/skills/system-deep-loop/deep-review/README.md .skilled...` exit 0: 129:- The iteration cap, consecutive failures, stuck recovery, the off setting, the max-iterations policy and the review floor still decide first. .skilled/skills/system-deep-loop/deep-review/SKILL.md:1 .skilled/skills/system-deep-loop/deep-review/README.md:1
- **C2-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:100`: The entry says fan-out caps each parent at six children. For a review, the root takes up to eight depth-1 children: readCaps sets maxRootChildren to max(maxChildrenPerNode, ROOT_CHILDREN_FLOOR.review), and ROOT_CHILDREN_FLOOR.review is 8. feature-catalog/loop-lifecycle/expansive-depth-mode.md:16 states the root cap of 8, so the changelog contradicts the catalog for the same release.
  - Evidence: `grep -n 'ROOT_CHILDREN_FLOOR = \|maxRootChildren: Math' .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 61:const ROOT_CHILDREN_FLOOR = Object.freeze({ research: 6, review: 8 }); 310: maxRootChildren: Math.max(maxChildrenPerNode, ROOT_CHILDREN_FLOOR[target]),
- **C3-4** P2 judgment `.skilled/skills/system-spec-kit/changelog/v2.13.5.0.md:2`: The entry says the lock covers only research: the title reads 'locks the research depth mode', and line 15 says only deep research gained the mode and that its switch lives in the research config. But the anti-convergence-floor group that gains the lock lists products ['deep-research','deep-review'], and the review presentation contract binds --depth-mode to antiConvergence.depthMode in the review...
  - Evidence: `rg -n '"products"|antiConvergence.depthMode' .skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json; rg -n 'depth-mode.*antiConvergence.depthMode' .skilled/commands/deep/assets/...` exit 0: "products": ["deep-research", "deep-review"] ... "lockedFields": [..., "antiConvergence.depthMode"]; review presentation: --depth-mode=default|expansive -> antiConvergence.depthMode = value

### S7 Skill routing is right

- **D-3** P2 judgment `.skilled/skills/system-deep-loop/graph-metadata.json:73`: The diff adds `depth-capped frontier` to the hub's stage-one intent_signals, but neither stage-two surface (ROUTER.md INTENT_SIGNALS, hub-router.json vocabularyClasses) carries it. skill-hub-routing.md §1 says a stage-one hit with no stage-two intent means the two stages disagree. A request whose only routing phrase is this one reaches the hub with no mode signal, and hub-router.json sets defaultM...
  - Evidence: `grep -n "depth-capped" .skilled/skills/system-deep-loop/ROUTER.md .skilled/skills/system-deep-loop/hub-router.json .skilled/skills/system-deep-loop/graph-metadata.json` exit 0: .skilled/skills/system-deep-loop/graph-metadata.json:73: "depth-capped frontier",

### S9 Commands aligned

- **BAT-02** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Owner: validate-command-references.cjs owner. The S9-command-references row fails only on .skilled/commands/speckit/assets/speckit-resume.yaml:104, which names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file the YAML falls back from. The YAML is right; the checker needs a runtime-state exemption. Same cause as the hand-off in earlier runs.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
- **D-1** P2 literal `.skilled/commands/deep/research.md:43`: The router's setup list says lineage_mode stays `auto` unless --lineage-mode or --restart is present. It omits --extend=N, which the presentation binds to lineage_mode=completed-continue (deep-research-presentation.txt:118) and the YAML's user_inputs.extend describes the same way. The router summary therefore disagrees with the presentation binding. That matters because the YAML preflight (deep-re...
  - Evidence: `grep -n "lineage_mode. (default\|lineage_mode = completed-continue" .skilled/commands/deep/research.md .skilled/commands/deep/assets/deep-research-presentation.txt` exit 0: ...p/research.md:43:> - `lineage_mode` (default `auto` unless `--lineage-mode` or `--restart` is present) .skilled/commands/deep/assets/deep-research-presentation.txt:118: |-- --extend=N -> extend = N, lineage_mode = completed-continue (positive integer only; a completed run only; refused with fan-out)
- **D-2** P2 literal `.skilled/commands/deep/review.md:43`: The router's setup list says lineage_mode stays `auto` unless --lineage-mode or --restart is present. It omits --extend=N, which the presentation binds to lineage_mode=completed-continue (deep-review-presentation.txt:131) and the YAML's user_inputs.extend describes the same way. The router summary therefore disagrees with the presentation binding. That matters because the YAML preflight (deep-revi...
  - Evidence: `grep -n "lineage_mode. (default\|lineage_mode = completed-continue" .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-review-presentation.txt` exit 0: .../deep/review.md:43:> - `lineage_mode` (default `auto` unless `--lineage-mode` or `--restart` is present) .skilled/commands/deep/assets/deep-review-presentation.txt:131: |-- --extend=N -> extend = N, lineage_mode = completed-continue (positive integer only; a completed run only; refused with fan-out)

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **C4-1** P1 judgment `.skilled/changelog/skilled/v4.1.0.0.md:1`: No open root release notes describe the user-visible capabilities this scope adds: --depth-mode=expansive with its frontier node store (frontier-admit.cjs, the convergence.cjs frontier veto and frontier_drained stop), --extend=N / --extend-minutes=M, custom review dimensions, and the review minIterations floor (convergence.cjs now applies minIterations to review as well as research). The newest ro... [handed off] [S6, C4]
  - Disposition: Owner: operator (root release notes). The gap is that the root .skilled/changelog/skilled/v4.1.0.0.md does not describe this program's new deep-loop features (expansive depth mode, --extend, custom review dimensions, the review minIterations floor). Opening or amending the root release record is the release owner's call, made when this branch lands. The critic folded C2-4 into this finding as a du...
  - Evidence: `git -c core.fsmonitor=false merge-base --is-ancestor v4.1.0.0 83af96cb5af; echo "is-ancestor exit=$?"; grep -c -i -E 'expansive|depth-mode|--extend|frontier|custom dimension' .skilled/changelog/skille...` exit 1: is-ancestor exit=1 0 grep exit=1

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **C3-1** P2 literal `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:106`: The runtime playbook's release gate says 'all 56 scenarios' while line 39 of the same file says 58, and the package holds 58 scenario files at HEAD. The diff raised line 39 from 51 to 58 but set the release-gate line to 56, so the gate count does not match what shipped. [S5, C3]
  - Evidence: `git -c core.fsmonitor=false ls-tree -r --name-only 83af96cb5af .skilled/skills/system-deep-loop/runtime/manual-testing-playbook | grep -v 'manual-testing-playbook/manual-testing-playbook.md$' | grep -...` exit 0: 58
  - Critic override: duplicate, lane severity P2. Duplicate of B3-1: same file (runtime/manual-testing-playbook/manual-testing-playbook.md), same line 106, same 56 vs 58 mismatch.
- **C3-2** P2 literal `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:231`: The new Mode Package Indexes table in the hub playbook gives the runtime package 56 scenarios. The runtime package index says 58, and 58 scenario files exist at HEAD. [S5, C3]
  - Evidence: `git -c core.fsmonitor=false ls-tree -r --name-only 83af96cb5af .skilled/skills/system-deep-loop/runtime/manual-testing-playbook | grep -v 'manual-testing-playbook/manual-testing-playbook.md$' | grep -...` exit 0: 58
  - Critic override: duplicate, lane severity P2. Duplicate of B3-3: hub manual-testing-playbook.md:231 runtime row says 56; confirmed at HEAD.
- **C3-3** P2 literal `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:229`: The same table gives the deep-research package 72 scenarios. Its package index says 'provides 74 deterministic scenarios across 9 categories', and 74 scenario files exist at HEAD, not counting command-flow-stress-tests/README.md. The deep-review row, 70, is correct. [S5, C3]
  - Evidence: `git -c core.fsmonitor=false ls-tree -r --name-only 83af96cb5af .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook | grep -v 'manual-testing-playbook/manual-testing-playbook.md$' | ...` exit 0: 74
  - Critic override: duplicate, lane severity P2. Duplicate of B3-2: hub manual-testing-playbook.md:229 deep-research row says 72; confirmed at HEAD.
- **C2-4** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:1`: This file is outside the lane's assigned list, but the S6 lens names it. The newest root release notes at HEAD 83af96cb5af are v4.1.0.0, which is already tagged on origin, so the release is published and closed. The entry does not describe this scope's user-visible deep-review additions: --depth-mode=expansive, --extend=N for review, custom review dimensions and the review minIterations floor. The... [S6, C2]
  - Evidence: `git -c core.fsmonitor=false ls-remote --exit-code --tags origin refs/tags/v4.1.0.0; grep -c -i -E 'depth-mode|expansive|--extend|custom dimension|minIterations' .skilled/changelog/skilled/v4.1.0.0.md` exit 1: 93e875708d0e63bd128f5538a237f32ae40cce1e refs/tags/v4.1.0.0 0
  - Critic override: duplicate, lane severity P2. Duplicate of C4-1: same file (.skilled/changelog/skilled/v4.1.0.0.md) and same gap (closed root release notes do not record this scope). C4-1 carries the fuller evidence; confirmed tag v4.1.0.0 is not an ancestor of 83af96cb5af (merge-base --is-ancestor exit=1).

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

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.dsh/agents/deep-research.patch.yml`
- `.dsh/agents/deep-review.patch.yml`
- `.vibe/agents/deep-research.toml`
- `.vibe/agents/deep-review.toml`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension/ (packet folder, 5 files: goal.md plus scratch run artifacts; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir/ (packet folder, 14 files: goal.md plus scratch dispatch briefs and results; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor/ (packet folder, 11 files: goal.md plus scratch dispatch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix/ (packet folder, 26 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment/ (packet folder, 8 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields/ (packet folder, 41 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class/ (packet folder, 16 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage/ (packet folder, 9 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge/ (packet folder, 9 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/ (packet folder, 3 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/ (packet folder, 3 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/ (packet folder, 26 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration/ (packet folder, 12 files: goal.md plus scratch; goal.md passes check-goal.cjs)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment/ (packet folder, 1315 files: goal.md plus committed scratch from earlier doc-alignment and skilled-alignment runs; goal.md passes check-goal.cjs; added lines scanned for key and token patterns with no hit)`

