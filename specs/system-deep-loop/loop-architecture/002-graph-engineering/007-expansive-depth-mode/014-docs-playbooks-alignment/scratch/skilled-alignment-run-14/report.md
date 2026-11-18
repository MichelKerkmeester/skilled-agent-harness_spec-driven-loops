# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set full-diff
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `102558edb44be4000c61b36932615bd1196dce74`, 113 first-parent commits
- Files: 1712, of which 1 uncommitted or untracked
- Owners: 17
- Findings: 50 (P0 1, P1 2, P2 47), 15 literal, 6 inferred, 7 outside the scope; 2 more overturned by the critic and not counted
- Open findings: 50 (0 handed off, 0 rebutted)
- Lanes: A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 64 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 124 | 7 |
| S3 | Feature catalog entries | yes | 188 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 188 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 201 | 3 |
| S6 | Changelogs updated or created | yes | 198 | 1 |
| S7 | Skill routing is right | yes | 10 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 10 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 19 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 64 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 59 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 182, fail 3, cannot run 0, not applicable 1

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 2643 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 1421 |
| fail | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 1 | 3889 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1002 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 243 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 230 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 451 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 1448 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 47 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 47 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 56 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 53 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 53 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6471 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 39 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6272 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 154 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 97 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 105 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/ROUTER.md` | 0 | 231 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 239 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 348 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 329 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 265 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 232 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md` | 0 | 379 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | 0 | 421 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 289 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 255 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 249 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 526 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/upsert-script.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/scripts/README.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/dashboard.md` | 0 | 71 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/prompt-pack.md` | 0 | 71 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/dashboard.md` | 0 | 74 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/prompt-pack.md` | 0 | 73 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1396 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 66 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 111 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 279 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 46 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 62740 |
| fail | P2 | no | `S5-derived-counts` | 1 | 185 |
| pass | P2 | no | `S5-readme-references` | 0 | 2129 |
| pass | P2 | no | `S6-release-coverage` | 0 | 50 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 34 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 390 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 30 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 4008 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 116 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 239 |
| pass | P2 | no | `S8-advisor-status` | 0 | 123 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 43 |
| fail | P2 | no | `S9-command-references` | 1 | 69 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 429 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 34 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 335 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 45 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 38 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 45 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 41 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 42 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 72 |
| pass | P2 | no | `S13-env-tokens` | 0 | 199 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2040 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1812 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1552 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1587 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1571 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 2103 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 2060 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 2055 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1711 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1867 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1864 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1740 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1707 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1672 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 128 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 56 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 7518 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1635 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 62 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 60 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 38 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 51 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 2328 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 645 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 40 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 261 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 47 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2040 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3671 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 351 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 2125 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 760 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 175 |

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

- **BAT-01** P0 judgment `.skilled/skills/system-spec-kit/runtime/cli`: S1-package-check failed for .skilled/skills/system-spec-kit/runtime/cli (exit 1).
  - Evidence: `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` exit 1: ...0 violations: 0 dist freshness: 3/4 fresh, 0 skipped Dist freshness check FAILED: 1 package/entry pair(s): Stale dist for system-spec-kit/runtime/cli entry default; build with: cd .skilled/skills/system-spec-kit/runtime/cli && npm run build compiled siblings beside a source: 0 undeclared, 0 declared
  - CI runs this command: spec-kit-check.yml > check > CLI check gate and typecheck
- **A1-1** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:948`: The CLI error path writes 'frontier-admit: <message>' to stderr. The resolved SKILLED javascript-checklist.md 'Bracketed Logging' item asks for the [COMPONENT] format, '[frontier-admit] ...', and fanout-run.cjs follows it ('[fanout-run] ...'). The sibling convention is mixed: convergence.cjs:1999 writes unbracketed JSON. It is P2 by the review-core section 2 meanings, a style follow-up with no beh...
  - Evidence: `git -c core.fsmonitor=false grep -n "frontier-admit: \|frontier-admit:" 102558edb44 -- .skilled .claude ':!specs' | grep -v '^102558edb44:.skilled/skills/system-deep-loop/runtime/scripts/frontier-admi...` exit 0: (no output): no consumer of the prefix outside the script
- **A1-2** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:927`: The seed command's budget notice on stderr uses the same unbracketed 'frontier-admit: ' prefix, against javascript-checklist.md 'Bracketed Logging' and the fanout-run.cjs '[fanout-run]' convention. A grep of the frontier-admit test files for 'budget after seed' returned no lines, so no test asserts this text. It is a style follow-up with no behavior impact. (inferred)
- **A1-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:620`: closeNode checks only the target status and never the node's current status. So a row that admission pruned (it never reached the inbox) can be closed as 'answered' or 'active'. That revives it as a live node: it then counts toward the live-node and child caps, is projected to the graph as a QUESTION, and counts in the review frontierAnswered fact that the frontier_drained hard stop reads. No call...
  - Evidence: `node -e (admitProposals with a no-evidence proposal, then closeNode(F-1-001,'answered'), then buildFrontierGraphEvents) in the A1 scratch dir` exit 0: admit {"admitted":[],"pruned":[{"nodeId":"F-1-001","reason":"relevance"}]} / close {..."status":"answered"...} / graph ["QUESTION:answered"]
- **A1-4** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:407`: scopeInsideTouchedFiles reads reviewScopeFiles only as an array or a separated string. terminal-gates.cjs scopeEntries (lines 74-93) documents and accepts named lists ({kind: [paths]}) 'once a review splits its target by kind'. For that shape, splitTargetPaths(object) returns [], files.length === 0, and every proposal scope passes relevance for a commit-range review: admission fails open. The only...
  - Evidence: `git -c core.fsmonitor=false grep -nE "reviewScopeFiles\s*[:=]\s*\{|reviewScopeFiles: \{|\"reviewScopeFiles\":\s*\{" 102558edb44 -- .skilled .claude` exit 0: 102558edb44:.skilled/skills/system-deep-loop/runtime/tests/unit/terminal-gates.vitest.ts:308: config: passingConfig({ reviewScopeFiles: { primary: ['src/app.ts'] } }),
- **A1-5** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:961`: The new module exports 16 functions (seedNodes, admitProposals, closeNode, seedBudget, renderFrontierBlock and others) with no JSDoc. javascript-checklist.md section 4 (P2 - RECOMMENDED) asks for JSDoc on public functions, and fanout-run.cjs and reduce-state.cjs use it. The prose comments above each function do carry the WHY.
  - Evidence: `grep -c "/\*\*" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs .skilled/skills/system-deep-loop/runtime/scripts/fa...` exit 0: frontier-admit.cjs:0 fanout-run.cjs:24 reduce-state.cjs:20 convergence.cjs:3
- **A2-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1963`: The review reducer's derived budget close in applyReviewFrontierBudget has no test: no test reaches a band's share and closes its open nodes as exhausted/budget, and none covers the unspent-share roll-down to the next band. The only review test with an exhausted node (deep-review-state-reducer.vitest.ts:1009) writes status 'exhausted', reason 'budget' straight into the store, so the projection pat...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && node /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/local-skilled-alignment-scratch/skilled-alignment-run-14/A2/probe-...` exit 0: [["F-1-001","exhausted","budget"],["F-2-002","open",null]] {"depth1":{"allotted":2,"spent":2},"depth2":{"allotted":1.4,"spent":0},"depth3":{"allotted":0.6,"spent":0}} F-2-002; the test file has only store-written exhausted rows (:1009, :1133) and a dashboard budget assertion (:1194)
- **A2-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:1025`: The 'extension-budget' rule checks only that the six fields are present and are uint32. It never checks them against each other or against the payload's continuedFromRun. Both reducers then adopt newMaxIterations as the run's maxIterations unconditionally (deep-research-reducer.ts:516, deep-review-reducer.ts:504), so a recorded extension can lower the ceiling or raise it to any uint32. The same ga...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration/.skilled/skills/system-deep-loop/runtime && npx tsx /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/local-skilled-alignmen...` exit 0: consistent ACCEPTED newMaxIterations=7 lowered ACCEPTED newMaxIterations=1 overextended ACCEPTED newMaxIterations=1000
- **A2-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1906`: readReviewFrontierStore swallows a malformed frontier-nodes.jsonl row with a bare catch and has no warning channel: it returns only {nodes, history}. The same reducer reports corruptionWarnings for a torn state-log line (parseJsonlDetailed, line 165). A torn row that was a node's only row silently removes that node: it leaves the frontier, it is never filed as open search debt, and the dashboard's...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && node /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/local-skilled-alignment-scratch/skilled-alignment-run-14/A2/probe-...` exit 0: keys=nodes,history nodes=F-1-001 (the store held F-1-001 and a truncated F-1-002 row; F-1-002 vanished with no warning)
- **A3-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:753`: The new FRONTIER_STATUSES, qualifyFrontierId and mergeResearchFrontier block was inserted between mergeResearchRegistries and its JSDoc. The doc block that says 'Merge research findings registries from all lineages. Deduplicates by findingId...' now sits on `const FRONTIER_STATUSES` at line 758, so editors and doc tooling attach it to the constant, and `function mergeResearchRegistries` at line 80...
  - Evidence: `sed -n 753,758p .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` exit 0: /** * Merge research findings registries from all lineages. * Deduplicates by findingId; cross-model attribution via lineage labels. * Returns the merged registry object. */ const FRONTIER_STATUSES = ['open', 'active', 'answered', 'blocked', 'exhausted', 'abstained', 'pruned'];
- **A3-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:347`: expansiveLineageBudgets hard-codes the native lineage's default budget as a bare `12`. The same value already appears as a bare literal at lines 1305, 1858 and 1928 (review.magic-literals, review.dry). Its comment says the floor is 'the budget that lineage would otherwise have run', so the floor is only correct while all four literals agree. Case: if someone changes the native default at line 1858...
  - Evidence: `grep -nE '(\? 12 :|: 12;|\|\| 12;)' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` exit 0: 347: loopDefault: lineage.kind === 'native' ? 12 : LOOP_DEFAULT_MAX_ITERATIONS[loopType], 1305: const iterations = Number.isFinite(rawIterations) && rawIterations > 0 ? Math.floor(rawIterations) : 12; 1858: const maxIterations = lineage.iterations || 12; 1928: const iters = lineage.iterations || 12;
- **A4-1** P2 judgment `.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json:111`: Battery S1-package-check failure cause. The @spec-kit/cli dist (entry default) was attested on the source tree just before commit 0d41845988f (2026-11-17 21:59). That commit is inside 21c4b325b5a..102558edb44 and is the only later commit to change a watched cli input: optimizer/optimizer-manifest.json, which adds antiConvergence.depthMode to lockedFields and to the anti-convergence lockedFields li...
  - Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check --package system-spec-kit/runtime/cli --entry default --json --no-write; then recompute the helper's sorted hashSourceFile...` exit 69: ...s=stale, 'source content differs from the attested build'; sorted source hash at 0d41845988f^ = bb938a46... (equals the stored attestation sourceHash); at HEAD = cd3d9e72... (equals the current worktree; every watched file is identical to HEAD); manifest is the only watched file newer than the build
- **A4-2** P2 literal `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts:97`: The regex /\n depth_mode: "\[default|expansive\]/ has an unescaped '|', so it parses as the alternation ('\n depth_mode: "[default' OR 'expansive]'), not the literal '[default|expansive]' it means to pin. Case: if the depth_mode user_inputs line is removed and any other 'expansive]' text exists anywhere in the YAML, the assertion still passes. Neither YAML has such text today, so the check current...
  - Evidence: `node: strip the depth_mode user_inputs line from deep-research.yaml and deep-review.yaml, then test the loose and escaped regexes` exit 0: literal present: true; loose regex with the line removed: false; escaped regex with the line removed: false (latent only)

### S2 Skill docs match sk-create-skill

- **B2-1** P1 judgment `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md:11`: The generated contract snapshot was hand-edited. Its frontmatter version was bumped to 1.11.3.0, but the generator's hardcoded SNAPSHOT_FRONTMATTER (render-contract-snapshot.cjs line 47) still emits 1.11.2.0. As a result the contract's own render-verify validation check (review-mode-contract.yaml line 499-500: 'node render-contract-snapshot.cjs --check ... fail on drift') fails. The rendered body ...
  - Evidence: `node .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs --check` exit 1: [render-contract-snapshot] drift detected: .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md is stale. Run without --check to regenerate.
- **B2-6** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:182`: Phase 2 Step 2 'Check Convergence' still gives the old abbreviated stop order: max iterations, stuck, composite, otherwise CONTINUE. This change rewrote convergence.md Decision Priority into ten steps, adding consecutive failures, convergence-mode off, stop-policy max-iterations, the minIterations floor (minIterationsNotReached), the frontier veto (frontierOpen) and the frontier_drained candidate.... (inferred)
- **B2-7** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:203`: The release's Tests and scenarios list says the playbook validator passed 'with the seven new scenarios'. The changelog was added in 7ab0b52 with seven scenarios (DRV-076..082). DRV-083 (frontier-drained-stops-review.md) was added later in 3bbb82c, and the changelog was then updated to describe frontier_drained (line 131) without updating the count. The release now ships eight expansive scenarios,...
  - Evidence: `git -c core.fsmonitor=false log --diff-filter=A --format='%h %s' 21c4b325b5a..102558edb44 -- .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drai...` exit 0: 3bbb82c9d7f docs(system-deep-loop): catalog and test the expansive script changes | 7ab0b520296 docs(system-deep-loop): add review frontier playbooks and changelog
- **B3-1** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md:1`: The hub moves from 2.0.2.0 to 2.1.6.0 through seven new hub changelogs. This diff records its runtime changes there and not in runtime/changelog/, which got no entry: v2.1.1.0 covers upsert.cjs, v2.1.2.0 fanout-merge.cjs, v2.1.4.0 divergent-pivot.ts, v2.1.5.0 the redispatch filter and v2.1.6.0 dispatch-iteration.cjs. None of the seven records the largest runtime addition: the new runtime/scripts/f...
  - Evidence: `grep -rln "frontier-admit\|frontierOpen\|frontier_partition" .skilled/skills/system-deep-loop/changelog/` exit 1: 

### S3 Feature catalog entries

- **B1-1** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:62`: The Validation And Tests table backs only admission (frontier-admit.vitest) plus DR-068 and DR-072. The leaf also claims the stop veto, the fan-out round-robin deal and partition guard, the frontier graph mirror and the reducer focus pick, but cites none of the suites that prove them: stop-decision.vitest, stop-decision-yaml-contract.vitest, fanout-run.vitest, fanout-merge.vitest, deep-research-re...
  - Evidence: `grep -rn 'feature-catalog/convergence/expansive-depth-mode.md' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/*/ ; grep -n 'vitest\|DR-0' .skilled/skills/system-deep-loop/deep-...` exit 0: 7 scenarios (DR-068..DR-074) name this leaf as their catalog entry; the leaf's validation table lists frontier-admit.vitest, DR-068 and DR-072 only
- **B1-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:36`: HOW IT WORKS leaves out shipped reducer behavior from this diff, although it lists reduce-state.cjs as a source. applyFrontierBudget closes a spent depth band's open nodes as exhausted with reason budget, and rolls an unspent share down but never up. pickFrontierFocus breaks depth ties by fewest visits and then the oldest node, and writes the 'Frontier node <id> (depth N, scope S): <question>' lin...
  - Evidence: `git -c core.fsmonitor=false diff 21c4b325b5a 102558edb44 -- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | grep -n 'applyFrontierBudget\|6B. FRONTIER\|pickFrontierFocus'` exit 0: applyFrontierBudget (band close reason budget, roll-down), pickFrontierFocus (depth, visits, iteration, nodeId), '## 6B. FRONTIER' dashboard section all added in this diff
- **B2-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:366`: The Review Dimensions section intro still says its entries capture 'the four canonical audit dimensions', but the section now holds five entries, including the new Custom review dimensions entry. The census row at the top already says 5 features. (inferred)
- **B2-3** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:28`: The entry tells the operator to 'fund the depth-1 band with at least 2 * ceil(nodes / lineages) * dimensions'. That figure is the maxIterations a lineage needs, not the size of the band: the depth-1 band is 0.5 of maxIterations and must hold ceil(nodes / lineages) * dimensions. loop-protocol.md line 469 states it correctly ('50% of each lineage's maxIterations should reach ceil(nodes / lineages) *... (inferred)
- **B3-5** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:142`: The PROMPT RENDERING section now holds two entries, because this diff added 'Research prompt pack contract' at line 160, and the overview table was updated to 2 features. The section intro still reads 'This entry covers prompt-pack template rendering...' in the singular and does not mention the new contract entry. Case: a reader of section 3 is told it holds one entry and finds two.
  - Evidence: `grep -n "This entry covers prompt-pack\|^### Prompt Pack\|^### Research prompt pack contract" .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` exit 0: 142:This entry covers prompt-pack template rendering and placeholder validation before iteration dispatch. 160:### Research prompt pack contract
- **B3-6** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:694`: Two intros in the runtime catalog root went stale when this diff added entries. COUNCIL (line 694) ends 'The council folder holds this one CJS helper.', but the folder now also holds divergent-pivot-seat-cap-and-retry.md (line 708), which documents divergent-pivot.ts rather than the CJS helper. SCRIPT ENTRY POINTS (line 594) says its entries are the .cjs interfaces 'that replaced the removed deep_...
  - Evidence: `grep -n "holds this one CJS helper\|^### Divergent pivot seat cap\|replaced the removed\|^### frontier-admit.cjs" .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` exit 0: 594:These entries cover the direct `.cjs` interfaces that replaced the removed `deep_loop_graph_*` MCP tools. 676:### frontier-admit.cjs 694:These entries cover the seat-dispatch helper ... The council folder holds this one CJS helper. 708:### Divergent pivot seat cap and council retry

### S4 Playbooks match sk-create-manual-testing-playbook

- **B1-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md:87`: DR-065 links back only to feature-catalog/loop-lifecycle/initialization.md. The matching catalog entry is loop-lifecycle/completed-run-extension.md, which this same diff added and which cites DR-065 as its validation scenario. The cross-reference rule says 'Playbooks should link back to the matching catalog entry when one exists' (sk-create-feature-catalog SKILL.md section 7). Every other new scen...
  - Evidence: `grep -n -i 'feature-catalog' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` exit 0: 87:| `../../feature-catalog/loop-lifecycle/initialization.md` | Feature-catalog source describing the lineage modes the config accepts |
- **B1-4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:479`: Two user-visible expansive features in this diff have no scenario. The first is the depth-band budget roll-down: an unspent share rolls down, never up, and an answered node keeps its share rolling. The second is the dashboard '## 6B. FRONTIER' section and its absence on a default run. The v1.16.0.0 changelog headlines both ('See the frontier on the dashboard', 'Budget is shared across three depth ...
  - Evidence: `grep -rln -E '6B|roll(s)? down|applyFrontierBudget' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook; grep -n -E "rolls an unspent|never rolls a share up|6B. FRONTIER" .skilled/s...` exit 0: playbook grep: no files; tests: 2033 rolls an unspent depth-1 share down to depth 2, 2059 never rolls a share up, 2163/2175 6B. FRONTIER present on expansive and absent on default
- **B2-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:503`: The DRV-020 root summary still says the dimension coverage signal requires all 4 dimensions. This change made coverage span every configured dimension, custom names included (convergence.md, loop-protocol.md and quick-reference.md were all updated to say so), so the scenario summary is pinned to superseded behavior. Note: the per-feature DRV-020 file is outside this lane. (inferred)
- **B2-5** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:508`: DRV-020 expected signals still list 'all 4 dimensions required'. The coverage signal now requires every configured dimension, which is the canonical four by default, plus any custom name. Note: the per-feature DRV-020 file is outside this lane. (inferred)
- **B3-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md:89`: frontier-admit.cjs is new in this diff and is the only script-entry-points catalog entry with no runtime playbook scenario. convergence, upsert, query, status and append-mode-event each have one under runtime/manual-testing-playbook/script-entry-points/. Its Validation And Tests table lists only the two vitest files, with no Manual playbook row. The other new runtime entries in this diff each cite...
  - Evidence: `grep -rl "frontier-admit" .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/` exit 1: 
- **B3-3** P2 literal `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:225`: The new Section 9 calls deep-research, deep-review and runtime 'the three mode packages'. The skill has two modes, and line 65 of this file, changed in the same diff, says mode-registry.json has exactly 2 active modes. runtime/ is the shared backend, not a mode. Case: an operator reads Section 9 next to precondition 4 and sees three mode packages against two active modes.
  - Evidence: `grep -n "three mode packages\|exactly 2 active modes" .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` exit 0: 65:4. `.skilled/skills/system-deep-loop/mode-registry.json` contains exactly 2 active modes in its `modes` array. 225:The three mode packages hold the remaining operator scenarios for this skill.
- **B3-4** P2 literal `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:636`: This diff added DLR-062 to the COUNCIL category and updated the intro of every other category it grew (executor 6, prompt rendering 2, coverage graph 7). The COUNCIL intro still says 'This scenario validates that surface' in the singular and names only the seat-dispatch helper, but the category now holds two scenarios, DLR-018 and DLR-062. Case: an operator reads the COUNCIL intro and expects one ...
  - Evidence: `grep -n "This scenario validates that surface\|^### DLR-018\|^### DLR-062" .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` exit 0: 636:Per the Runtime Boundary Decision (ADR-001), `lib/council/` holds the seat-dispatch helper the divergent pivot calls. This scenario validates that surface. 638:### DLR-018 | Multi-seat dispatch 647:### DLR-062 | Divergent council quorum retry
- **B4-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:339`: The diff adds a new fan-out behavior: under expansive depth, a lineage with no matrix iterations gets a budget sized from its own seed share (expansiveLineageBudgets), a lineage with no seed node runs at its loop default (12 native, the workflow default for CLI), and stderr notes name each derived budget and warn when lineages outnumber open seed nodes (expansiveLineageBudgetNotes). The runtime fe...
  - Evidence: `grep -rln -i -e 'seed share' -e 'expansiveLineageBudget' -e 'derived from its seed' -e 'lineage budget' -e 'no seed share' .skilled/skills/system-deep-loop/{deep-research,deep-review,runtime,.}/manual...` exit 1: (no matches); the cases exist at runtime/tests/unit/fanout-run.vitest.ts:6907 describe('fanout-run.cjs - per-lineage expansive budget'), :6937 'names an empty seed share and warns once when lineages outnumber the open seeds', :6957 'runs a lineage with no seed share at its loop default'

### S5 READMEs match sk-create-readme, root included

- **BAT-02** P2 judgment: S5-derived-counts failed (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/bin/README.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/deep-research/...` exit 1: ... and its two sidecar files under `runtime/database/`, then rebuild with `--trusted --force` | FAIL .skilled/skills/system-skill-advisor/README.md: claims=1 failures=1 PASS .skilled/skills/system-spec-kit/README.md: claims=0 failures=0 PASS README.md: claims=1 failures=0 SUMMARY files=7 pass=6 fail=1
- **C1-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:229`: Step 2c (Quality Guard Check, lines 221-232) still says a failed quality guard logs guard_violation events and persists a blocked_stop event. That contradicts convergence.md, which this scope corrected (line 133: 'A failed guard returns CONTINUE with qualityGuardFailed and emits no blocked_stop event'; table line 158), and it contradicts the code. convergence.cjs:1219 returns emit('CONTINUE', null...
  - Evidence: `rg -n 'qualityGuardFailed|guard_violation' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs .skilled/commands/deep/assets/deep-research.yaml` exit 0: ...null, 'qualityGuardFailed', evaluated, failedGuards); deep-research.yaml:1223: 6. a failed quality guard turns the candidate into CONTINUE (qualityGuardFailed) deep-research.yaml:1243: When stop_decision.reasonDetail == "qualityGuardFailed", log: "Quality guard failed: {blocked_by_csv}. Continuing."
- **C1-3** P2 judgment `.skilled/skills/system-deep-loop/deep-research/README.md:123`: Line 123 lists the quality-guard checks (sources diverse, no single weak source carrying a finding) among the legal-stop gates, then says 'When a gate fails, the run records blocked_stop and continues with a recovery focus'. The FAQ answer at line 197 says the same ('A blocked gate writes a blocked_stop event'). The decision order this scope documented in convergence.md (lines 133-134, table 158) ...
  - Evidence: `sed -n 123p .skilled/skills/system-deep-loop/deep-research/README.md; sed -n 133,134p .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` exit 0: ...e quality guards for every STOP candidate except hard max-iteration stop. A failed guard returns CONTINUE with qualityGuardFailed and emits no blocked_stop event. 9. Block every non-terminal STOP until a graph decision exists. A graph STOP_BLOCKED emits blockedStop and continues with recovery focus.
- **C3-3** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:49`: The new root-catalog entry 'Depth mode flag (--depth-mode)' uses '#### How It Works' at line 49. The other three entries in this file use '#### Current Reality' at lines 33, 83 and 101, and so does sk-create-feature-catalog/assets/feature-catalog-template.md. The catalog validator passes, so this is a consistency fix. Line 65 has the same defect, which C3-7 covers.
  - Evidence: `grep -n "#### How It Works\|#### Current Reality" .skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` exit 0: 33:#### Current Reality 49:#### How It Works 65:#### How It Works 83:#### Current Reality 101:#### Current Reality
- **C3-7** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:65`: The new root-catalog entry 'Completed-run extension flags (--extend, --extend-minutes)' uses '#### How It Works'. The other entries in this file, and the sk-create-feature-catalog template, use '#### Current Reality'. This is the same defect as C3-3, at its second location.
  - Evidence: `grep -n "#### How It Works\|#### Current Reality" .skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` exit 0: 33:#### Current Reality 49:#### How It Works 65:#### How It Works 83:#### Current Reality 101:#### Current Reality

### S6 Changelogs updated or created

- **C1-4** P2 literal `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:212`: The 'Tests and scenarios' list says a live expansive research run has not been run. The research frontier packet's implementation summary records two target-2 pilot runs (2026-11-17 and 2026-11-18) that stopped at the iteration cap, with AC-014 met under the amended drain criterion. Commit 94d246cb3bc corrected the same stale claim in the packet docs but not in this changelog.
  - Evidence: `rg -n -i pilot specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/implementation-summary.md` exit 0: 48:| **Completed** | ... two pilot runs on 2026-11-17 and 2026-11-18; AC-014 met 2026-11-18 under the amended criterion; ... 157:1. **The pilot ran twice; AC-014 was amended.** ...
- **C2-1** P2 judgment `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:138`: The v1.13.0.0 entry fails the changelog shape gate that sk-create-changelog SKILL.md validation check 11 requires to pass: line 138 holds a 31-word sentence, line 139 a 24-word sentence (ceiling 22), and the entry averages 10.6 words a sentence (ceiling 10). The sibling entries v1.11.18.0 and v1.12.0.0 pass the same gate.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` exit 1: FAIL ... [sentence-max] line 138: a sentence of 31 words, ceiling 22. Split it | [sentence-max] line 139: a sentence of 24 words, ceiling 22. Split it | [sentence-mean] 10.6 words a sentence on average, ceiling 10
- **C3-5** P2 judgment `.skilled/skills/system-deep-loop/hub-router.json:34`: Commit 30ac5b51f95 ('route expansive-depth requests to the deep-loop hub') adds hub routing vocabulary in four files: hub-router.json, ROUTER.md INTENT_SIGNALS, graph-metadata.json and the advisor's skill-graph.json. The new phrases are 'this research run', 'follow-up question frontier', 'frontier of follow-up questions', 'review target' and a review sub-target phrase. No hub changelog v2.1.0.0 to...
  - Evidence: `grep -rln "follow-up question frontier\|frontier of follow-up\|this research run" .skilled/skills/system-deep-loop/changelog/v2.1.*.md .skilled/skills/system-deep-loop/deep-research/changelog/v1.1[5-6...` exit 1: (no match)
- **C3-6** P2 judgment `.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json:111`: Commit 0d41845988f changes system-spec-kit's optimizer manifest. It adds antiConvergence.depthMode as a locked, never-tuned field of the anti-convergence contract, at lines 110-114 and in lockedFields at line 128. No system-spec-kit changelog records the new locked field; the newest is v2.13.4.0. Record it in that skill's next changelog entry, or note it under the deep-loop entry if this repositor...
  - Evidence: `grep -rl depthMode .skilled/skills/system-spec-kit/changelog/` exit 1: (no match)

### S9 Commands aligned

- **BAT-03** P2 judgment: S9-command-references failed (exit 1).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
- **CR-2** P2 judgment `.skilled/commands/speckit/assets/speckit-resume.yaml:104`: The S9-command-references battery failure has no lane finding. Its cause is outside this scope and predates it. speckit-resume.yaml is unchanged between 21c4b325b5a and 102558edb44, and the path it names, .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json, is gitignored runtime state (.gitignore:431), so it is absent on a fresh worktree. The validator flags a runtime-created fi...
  - Evidence: `git -c core.fsmonitor=false diff --quiet 21c4b325b5a 102558edb44 -- .skilled/commands/speckit/assets/speckit-resume.yaml; git -c core.fsmonitor=false check-ignore -v .skilled/skills/system-spec-kit/ru...` exit 0: yaml unchanged (diff exit 0); .gitignore:431:.skilled/skills/system-spec-kit/runtime/database/ matches; runtime/database/ does not exist in this worktree

### S15 CI parity

- **CR-1** P2 judgment `.github/workflows/deep-loop-runtime.yml:90`: Several selected workflows have blocking steps that no battery row replays. I sorted them by whether they could fail for this scope. (1) deep-loop-runtime.yml, step 'Run the deep-loop runtime suites' (npm --prefix .opencode/skills/system-deep-loop/runtime test): this is the step most likely to fail here. S15-ci-contract-drift replays only the workflow's first step. No lane ran the suite: the lanes...
  - Evidence: `node -e (list S15-ci-* row cmd and ci_matches from battery.json); grep -n -E '^\s+- name:' over the unreplayed workflows; node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs --che...` exit 0: ...ntract before the full suite' (no row matches 'Run the deep-loop runtime suites', skill-advisor-stress, advisory-checks, hook-vitest-suites, opencode-plugin-tests or opencode-dual-version) | [dsh-agent-sync] PASS: 11 agent patches are in sync. | [vibe-agent-sync] PASS: 11 agent profiles are in sync.

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **B1-5** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:937`: The root's numbered H2 sections run 14 FAN-OUT, 16 INTRA ROUTING RECALL, 15 AUTOMATED TEST CROSS-REFERENCE, 15 FEATURE CATALOG CROSS-REFERENCE INDEX: one number out of order and one duplicated. This predates the diff (the base has the same headings), but the diff rewrote the body of the second section 15 and left the numbering alone. The package validator does not flag it. Case: a reader or tool t... [S4, B1]
  - Evidence: `grep -n -E '^## 1[4-6]\.' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` exit 0: 879:## 14. FAN-OUT 937:## 16. INTRA ROUTING RECALL 1050:## 15. AUTOMATED TEST CROSS-REFERENCE 1057:## 15. FEATURE CATALOG CROSS-REFERENCE INDEX
  - Critic override: pre-existing, lane severity P2. Base 21c4b325b5a has the same heading order: git show 21c4b325b5a:.../deep-research/manual-testing-playbook/manual-testing-playbook.md gives 762 '## 14. FAN-OUT', 807 '## 16.', 920 '## 15.', 927 '## 15.'.
- **C3-4** P2 judgment `.skilled/skills/system-skill-advisor/README.md:141`: Battery S5-derived-counts fails on this file. The cause is a checker false positive, not a wrong count. Line 141 says the skill-graph.sqlite database has 'two sidecar files' under runtime/database/, and that folder does hold exactly two, skill-graph.sqlite-shm and skill-graph.sqlite-wal. The README has no readme-check block, so the checker cannot tell the count is deliberate. This file is unchange... [S5, C3]
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/skills/system-skill-advisor/README.md; ls .skilled/skills/system-skill-advisor/runtime/database/` exit 1: line 141: numeric count for 'files': ... its two sidecar files under `runtime/database/` ... FAIL .skilled/skills/system-skill-advisor/README.md: claims=1 failures=1 (ls) skill-graph.sqlite skill-graph.sqlite-shm skill-graph.sqlite-wal ...
  - Critic override: pre-existing, lane severity P2. .skilled/skills/system-skill-advisor/README.md is unchanged in 21c4b325b5a..102558edb44 (git diff --quiet exits 0) and is not in scope.json, so the S5-derived-counts failure predates this scope.

### unchanged in range

- **C3-1** P1 judgment `.skilled/changelog/skilled/v4.1.0.0.md:237`: The newest root release notes do not describe the two operator-facing deep-loop flags this scope adds, --depth-mode=expansive and --extend=N/--extend-minutes=M. The S6 lens requires that every user-visible capability the scope adds appear in the open root release notes. Both flags ship in the hub changelog v2.1.0.0, the mode changelogs deep-research v1.16.0.0 and deep-review v1.13.0.0, the command... [S6, C3]
  - Evidence: `grep -n -i -- "--depth-mode\|--extend" .skilled/changelog/skilled/v4.1.0.0.md` exit 1: (no match)
- **B4-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md:52`: DLR-025 governs tests/unit/fanout-run.vitest.ts, which this diff grew by 492 lines. It still pins a fixed count for that whole file: '5 integration tests' (lines 30, 45, 89), 'Confirm 5 tests pass' (line 52), '5/5 pass' (line 57) and 'GREEN when 5/5 pass' (line 100). Command 3 runs the entire file, which holds 209 cases at HEAD, so the scenario's PASS rule can never be met as written. The count wa... [S4, B4]
  - Evidence: `for c in 21c4b325b5a 102558edb44; do git -c core.fsmonitor=false show $c:.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | grep -c -E '^\s*(it|test)(\.each\([^)]*\))?\('; done` exit 0: 191 209
- **C4-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/tests/unit/README.md:19`: The unit-test README says its FILES table is 'the complete direct-file inventory', but this range adds five unit test files without a row in it: divergent-pivot-seat-scope.vitest.ts, frontier-admit-review.vitest.ts, frontier-admit.vitest.ts, research-depth-mode-golden.vitest.ts and review-depth-mode-golden.vitest.ts. The README did not change in the range. The table already missed 64 files at base... [S5, C4]
  - Evidence: `comm of git ls-tree 21c4b325b5a runtime/tests/unit, ls runtime/tests/unit and the backticked *.vitest.ts names in runtime/tests/unit/README.md; git diff --quiet 21c4b325b5a 102558edb44 -- runtime/test...` exit 0: base=154 head=159 listed=90; unlisted at base: 64; unlisted added in range: divergent-pivot-seat-scope.vitest.ts frontier-admit-review.vitest.ts frontier-admit.vitest.ts research-depth-mode-golden.vitest.ts review-depth-mode-golden.vitest.ts; README unchanged in range
- **C1-1** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:1`: The open root release notes (the highest-version note at HEAD 102558edb44) do not describe three user-visible deep-research changes in this scope: (1) the opt-in --depth-mode=expansive frontier (deep-research changelog v1.16.0.0, SKILL.md 1.16.0.0); (2) --extend=N / --extend-minutes=M reopening a completed run as lineage mode completed-continue (step_extend_completed_run is absent at base 21c4b325... [S6, C1]
  - Evidence: `git -c core.fsmonitor=false show 102558edb44:.skilled/changelog/skilled/v4.1.0.0.md | grep -n -i -- 'depth-mode\|expansive\|--extend\|focusAlignment\|deep-research\|deep research'` exit 0: 440:- `@deep-research` may search the web. 651:- Point a per-mode deep workflow name at `deep-research.yaml` or `deep-review.yaml`.
- **C2-3** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:1`: No root release note describes the user-visible review capabilities this scope adds: --depth-mode=expansive, --extend=N / completed-continue, custom review dimensions, and the review minIterations floor. The newest root note, v4.1.0.0, is already tagged at 05dbe23f023, and that tag is not an ancestor of HEAD 102558edb44. Under sk-create-changelog SKILL.md line 198, tagging the open release starts ... [S6, C2]
  - Evidence: `rg -l -- 'depth-mode|expansive depth|completed-continue|minIterationsNotReached|custom review dimension' .skilled/changelog/skilled/; git merge-base --is-ancestor v4.1.0.0 102558edb44` exit 1: no root release note matches; v4.1.0.0 tag is not an ancestor of HEAD

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **C3-2** P2 literal `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:225`: The new Section 9 calls deep-research, deep-review and runtime 'the three mode packages'. The hub has two modes, and runtime/ is the shared infrastructure layer. Line 65 of the same playbook says mode-registry.json holds exactly 2 active modes, and SKILL.md says the same. The scenario and category counts in the table are correct: 72/9, 70/10 and 56/12 match the package indexes. [S5, C3]
  - Evidence: `grep -n "three mode packages\|exactly 2 active modes" .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` exit 0: 65:4. `.skilled/skills/system-deep-loop/mode-registry.json` contains exactly 2 active modes in its `modes` array. 225:The three mode packages hold the remaining operator scenarios for this skill.
  - Critic override: duplicate, lane severity P2. Duplicate of B3-3: same file (system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:225), same 'three mode packages' line and the same fix. I read line 225 and it is unchanged.
- **C2-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:203`: The test summary says the playbook validator passed 'with the seven new scenarios', but the release ships eight expansive scenarios, DRV-076 to DRV-083, as the root playbook's overview says. The line was written in 7ab0b520296. DRV-083 (frontier-drained-stops-review.md) came later in 3bbb82c9d7f, and the entry was then extended to describe frontier_drained (line 131) without updating this count. [S6, C2]
  - Evidence: `grep -l -E '^title: "DRV-0(7[6-9]|8[0-3])' -r .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook | wc -l; git log --oneline --diff-filter=A 21c4b325b5a..102558edb44 -- .../frontier-d...` exit 0: 8 scenario files DRV-076..DRV-083; DRV-083 added in 3bbb82c9d7f, after the changelog line from 7ab0b520296
  - Critic override: duplicate, lane severity P2. Duplicate of B2-7: same file (deep-review/changelog/v1.13.0.0.md:203), same 'seven new scenarios' line and the same old/new fix. I read line 203 and it still reads 'PASS, with the seven new scenarios.'

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

- `.dsh/agents/deep-research.patch.yml (generated runtime mirror; does not matter: numstat 6/1 matches .skilled/agents/deep-research.md, and sync-agents-dsh.cjs --check, run by hand, PASS with 11 agents; S15-ci-agent-mirror-sync does not compare dsh)`
- `.dsh/agents/deep-review.patch.yml (generated runtime mirror; does not matter: numstat 9/3 matches the canonical file, the frontier_proposal, configured-custom-dimension and Custom (configured) phrase counts match, and sync-agents-dsh.cjs --check PASS)`
- `.vibe/agents/deep-research.toml (generated runtime mirror; does not matter: sync-agents-vibe.cjs --check, run by hand, PASS with 11 agents, and the single instructions line carries frontier_proposal)`
- `.vibe/agents/deep-review.toml (generated runtime mirror; does not matter: sync-agents-vibe.cjs --check PASS, and the instructions line carries frontier_proposal, configured custom dimension and Custom (configured))`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json (archive twin; does not matter: byte-identical (cmp) to .skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json, which Lane D reviewed and the S7 compiled-route rows passed)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension/ (packet folder entry: goal.md plus 4 scratch files; low: goal durable slice 2502 chars, under the 4000 limit)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir/ (packet folder entry: goal.md plus 13 scratch files; low: goal slice 2044 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor/ (packet folder entry: goal.md plus 10 scratch files; low: goal slice 2594 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix/ (packet folder entry: goal.md plus 25 scratch files; low: goal slice 3321 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment/ (packet folder entry: goal.md plus 7 scratch files; low: goal slice 3146 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields/ (packet folder entry: goal.md plus 40 scratch files; low: goal slice 3611 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class/ (packet folder entry: goal.md plus 15 scratch files; low: goal slice 3354 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage/ (packet folder entry: goal.md plus 8 scratch files; low: goal slice 2843 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge/ (packet folder entry: goal.md plus 8 scratch files; low: goal slice 2684 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/ (packet folder entry: goal.md plus 2 scratch files; low: goal slice 3745 chars, completion criteria now marked [x])`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/ (packet folder entry: goal.md plus 2 scratch files; low: goal slice 3765 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/ (packet folder entry: goal.md plus 25 scratch files; low: goal slice 2517 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration/ (packet folder entry: goal.md plus 11 scratch files; low: goal slice 2266 chars)`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment/ (packet folder entry: goal.md plus 1257 scratch files: 1256 committed artifacts of earlier doc-alignment and skilled-alignment runs, and this run's own untracked skilled-alignment-run-14/executors.json; low: goal slice 3674 chars, and committed scratch is the repository pattern, with 39380 scratch files under specs/ at base)`

