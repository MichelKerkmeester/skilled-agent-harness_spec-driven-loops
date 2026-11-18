# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a0074ac31d0f2ec3e31e28351be933`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `4a96a5da1e631332db0b02ffcb6452c92a253bf0`, 84 first-parent commits
- Files: 1375, of which 12 uncommitted or untracked
- Owners: 15
- Findings: 11 (P0 1, P1 4, P2 6), 2 literal, 0 inferred, 1 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 8 (3 handed off, 0 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 19 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 101 | 7 |
| S3 | Feature catalog entries | yes | 120 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 120 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 133 | 3 |
| S6 | Changelogs updated or created | yes | 130 | 1 |
| S7 | Skill routing is right | yes | 9 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 9 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 19 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 19 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 56 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 165, fail 2, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1625 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 684 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 980 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 275 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 317 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 83 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 79 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 80 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6218 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 36 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6228 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 112 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/ROUTER.md` | 0 | 247 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 408 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 364 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 310 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 317 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 237 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 372 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 359 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 231 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 231 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 274 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 280 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 276 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 303 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 263 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 279 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 270 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 265 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 241 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 547 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 204 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1514 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 59 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 43 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 65653 |
| pass | P2 | no | `S5-derived-counts` | 0 | 166 |
| pass | P2 | no | `S5-readme-references` | 0 | 2297 |
| pass | P2 | no | `S6-release-coverage` | 0 | 57 |
| fail | P0 | yes | `S7-skill-graph-freshness` | 1 | 40 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 436 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 33 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 4634 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 117 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 360 |
| pass | P2 | no | `S8-advisor-status` | 0 | 145 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 48 |
| fail | P2 | no | `S9-command-references` | 1 | 94 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 456 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 36 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 324 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 47 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 40 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 45 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 43 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 39 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 71 |
| pass | P2 | no | `S13-env-tokens` | 0 | 225 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2020 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1810 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1715 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1765 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1729 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1691 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1691 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1777 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1908 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 2159 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 2121 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1633 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1617 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1587 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 123 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 52 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 7329 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1369 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 53 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 51 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 33 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 44 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 2342 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 683 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 67 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 275 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 51 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2247 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3793 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 302 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 2000 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 636 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 140 |

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
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-deep-loop/README.md
- `spec-kit-check.yml`: push: paths match .claude/agents/deep-research.md
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **A-1** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:386`: When a review iteration reuses a finding id an earlier iteration stored for a different finding (other file and title), deriveReviewFindingEvidence correctly derives a separate node finding:<id>#<iteration>. But knownFindings is filled from the stored FINDING nodes (line 386) before this iteration's derived nodes (line 393), and an existing key is never overwritten. So the leaf's own finding-<id> ...
  - Evidence: `DEEP_LOOP_COVERAGE_DB_DIR=<scratch>/db; state log: iteration 1 finding F1 'Leak in a' src/a.cjs:3, iteration 2 finding F1 'Race in b' src/b.cjs:9; node upsert.cjs --spec-folder specs/repro-x --loop-ty...` exit 0: ...odes: [{"id":"finding:F1","name":"Race in b"},{"id":"finding:F1#2","name":"Race in b","meta":{"finding_id":"F1","file":"src/b.cjs","line":9}}]; edges: evidence:F1:file:src/a.cjs (finding:F1 -> file:src/a.cjs), conf-b (ev-b -> finding:F1), evidence:F1#2:file:src/b.cjs (finding:F1#2 -> file:src/b.cjs)
- **A-2** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:355`: normalizeTargetPath strips only a leading './' and trailing slashes, and never resolves '..' segments. So scopeInsideReviewTarget (line 406) admits a proposal scoped 'src/app/../../lib/x.ts' under a file-list target 'src/app', because the string starts with 'src/app/'. The check exists to reject anything outside the review target: the FRONTIER block the leaf sees says admission prunes 'anything ou...
  - Evidence: `node -e 'const m=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"); const cfg={reviewTargetType:"files",reviewTarget:"src/app"}; console.log(m.scopeInsideReviewTarget(["...` exit 0: inside: true dotdot: true outside: false

### S2 Skill docs match sk-create-skill

- **E-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:508`: This change made completed-continue a live review lineage mode. It removed `status: deferred` from that entry in lifecycleModes (lines 201-202, reopened through --extend=N), and deep-review/references/protocol/loop-protocol.md line 610 now says 'The runtime supports four lineage modes'. But the contract's own validation check `lifecycle-parity` (line 508) still says the docs and workflow branches ...
  - Evidence: `grep -rn -i -e 'three supported' .skilled/skills/system-deep-loop/deep-review; sed -n 199,203p .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml; grep -n 'four lineage mode...` exit 0: ...supported modes: new, resume, and restart." - id: fork / status: deferred ... - id: completed-continue / description: Reopen a completed review in the same session and generation through --extend=N ... 610:The runtime supports four lineage modes. `completed-continue` is live through `--extend=N` ...

### S3 Feature catalog entries

- **B-1** P1 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md:66`: The frontier-admit catalog entry still gives the old review per-node cost: the count of the config's reviewDimensions entries, or four when the list is empty or 'all'. Commit 954345ac43f changed seedBudget to count reviewDimensionCount(config), which returns buildDimensionUniverse(config).length: the four canonical dimensions plus each distinct custom name, never below four. Under the old wording,...
  - Evidence: `grep -n 'For review it is the count' .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md; grep -n 'reviewDimensionCount' .skilled/skills/system-deep-l...` exit 0: ...tion reviewDimensionCount(config) { 332: dimensions: mode === 'review' ? reviewDimensionCount(source) : 1, 1224:function buildDimensionUniverse(config) { const universe = [...REQUIRED_DIMENSIONS]; ... if (name && name !== 'all' && !universe.includes(name)) universe.push(name); ... return universe; }

### S6 Changelogs updated or created

- **C-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:141`: The changelog for the release that ships research expansive depth does not describe the seed-derived default budget. Commit f7d5fb9cbf8 ('size a defaulted expansive budget from the seed') changed what an operator gets when --max-iterations is left at its default. The run now sizes its budget as min(24, max(10, 2 x (S + maxDepth - 1))), 16 at six seeds, and a native fan-out lineage dealt no seed no...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && grep -n -i -e 'derived\|sizes its budget\|min(24' .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` exit 1: 
- **C-3** P2 judgment `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:133`: The changelog for the release that ships review expansive depth does not describe the seed-derived default budget. Commits f7d5fb9cbf8 and 954345ac43f changed the defaulted --max-iterations of an expansive review to min(24, max(7, 2 x D x (S + maxDepth - 1))), where D is the four canonical dimensions plus each custom name. Since D is never below four, the 24 ceiling binds from the first seed, so a...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && grep -n -i -e 'derived\|sizes its budget\|min(24' .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` exit 1: 

### S7 Skill routing is right

- **BAT-01** P0 judgment: S7-skill-graph-freshness failed (exit 1).
  - Evidence: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exit 1: ...ite vs disk: none GHOST (in compiled json, not on disk): none MISSING (on disk, not in compiled json): none FAMILY MISMATCH compiled vs disk: none SIGNAL DRIFT compiled vs disk: system-deep-loop NULL derived timestamp: none (report-only - the canonical reindex is operator-gated; nothing was written)
  - CI runs this command: routing-registry-drift.yml > routing-drift > Compiled skill graph freshness - compiled json matches graph-metadata
- **D-1** P1 judgment `.skilled/skills/system-deep-loop/graph-metadata.json:73`: Commit 30ac5b51f95 added five intent_signals to graph-metadata.json at positions 30-34 ("depth-capped frontier", "follow-up question frontier", "frontier of follow-up questions", "review target", "this research run"). It did not regenerate the tracked compiled .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json, which still holds the 30-signal list for system-deep-loop (generated...
  - Evidence: `node .opencode/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exit 1: SIGNAL DRIFT compiled vs disk: system-deep-loop (all other rows none; compiled skill-graph.json: 14 skills, generated_at 2026-11-17T11:29:50.903233+00:00)

### S9 Commands aligned

- **BAT-02** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Not this program's: speckit-resume.yaml:104 and validate-command-references.cjs are both unchanged since the program base 21c4b325b5a. Owner: commands/scripts/validate-command-references.cjs. The YAML names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file it falls back from, so the YAML is right and the checker needs a runtime-state exemption. Same cause as the han...
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

### S15 CI parity

- **E-2** P2 judgment `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment/scratch/skilled-alignment-run-12/scope.json:1`: The scope map was built in first-parent mode, so it leaves out files that reached HEAD through the integration merges. `git diff --name-only <mergeBase> HEAD` lists 228 changed files that scope.json does not hold. 64 of them are outside specs/, and 45 of those are code: runtime/scripts/verify-iteration.cjs, dispatch-iteration.cjs, fanout-merge.cjs and divergent-pivot.cjs, deep-research/scripts/div... [handed off]
  - Disposition: A limitation of the scope tool, not a defect in this program's files. Owner: the local-skilled-alignment tooling (resolve-scope.cjs), which builds the scope in first-parent mode and so leaves out files that reached HEAD through the integration merges. The critic's manual checks on the off-map code passed: quality gate 0 findings, comment hygiene 0, and the off-map vitest suites 578 passed, 2 skipp...
  - Evidence: `git -c core.fsmonitor=false diff --name-only 21c4b325b5a0074ac31d0f2ec3e31e28351be933 HEAD | LC_ALL=C sort > full; <scope.json files> | LC_ALL=C sort > scope; LC_ALL=C comm -23 full scope | wc -l; ......` exit 0: 228 off-map files, 64 non-spec, 45 code; quality-gate qg=0 findings: 0; comment-hygiene ch=0; vitest Test Files 25 passed (25), Tests 578 passed | 2 skipped (580)

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **C-1** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:237`: The open root release notes do not cover what this scope adds to the deep loops. v4.1.0.0.md is the newest file under .skilled/changelog/skilled/. Its tag sits on main's HEAD, and main keeps adding post-tag work to it, so it is still open. Its '## Deep Loop' section (lines 237-285) covers only the AI Council move, the failing-required-check rule and deterministic stops. It says nothing about any o... [handed off] [S6, C]
  - Disposition: Not this program's: .skilled/changelog/skilled/v4.1.0.0.md is unchanged since the program base 21c4b325b5a. Owner: the operator, who owns the open root v4.1.0.0 release notes. Whether the deep-loop section names expansive depth, --extend, the review floor and custom dimensions is the release owner's call, made when this branch lands.
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration && grep -n -i -e 'expansive' -e 'depth-mode' -e '--extend' -e 'minIterations\|minimum iteration' -e 'custom dimension' .ski...` exit 1: 

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

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

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.gitignore`
- `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml`
- `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/lineage-prompt.txt`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json`
- `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json`
- `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`
- `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json`
- `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md`
- `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md`
- `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-contract-parity.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-reducer-schema.vitest.ts`

