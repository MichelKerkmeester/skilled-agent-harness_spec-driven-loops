# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `0a845d0d8ef0b1d3c48a2b14560196358a38d961`, 49 first-parent commits
- Files: 955, of which 83 uncommitted or untracked
- Owners: 15
- Findings: 25 (P0 0, P1 0, P2 25), 7 literal, 0 inferred, 4 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 20 (5 handed off, 0 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 16 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 89 | 7 |
| S3 | Feature catalog entries | yes | 105 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 105 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 118 | 3 |
| S6 | Changelogs updated or created | yes | 115 | 1 |
| S7 | Skill routing is right | yes | 7 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 7 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 19 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 16 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 55 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 155, fail 1, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1778 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 739 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1220 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 364 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 535 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 74 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 76 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 68 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6395 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 36 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6365 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 118 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 265 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 240 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 255 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 307 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 338 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 268 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 309 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 466 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 361 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 183 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 574 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 243 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 244 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 295 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 218 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1567 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 68 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 47 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 63861 |
| pass | P2 | no | `S5-derived-counts` | 0 | 167 |
| pass | P2 | no | `S5-readme-references` | 0 | 2655 |
| pass | P2 | no | `S6-release-coverage` | 0 | 59 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 39 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 464 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 31 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 4263 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 113 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 462 |
| pass | P2 | no | `S8-advisor-status` | 0 | 154 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 58 |
| fail | P2 | no | `S9-command-references` | 1 | 87 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 576 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 49 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 449 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 76 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 45 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 56 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 52 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 53 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 91 |
| pass | P2 | no | `S13-env-tokens` | 0 | 297 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2395 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 2061 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1699 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1698 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1658 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1858 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1866 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1962 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1867 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 2398 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 2287 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 2424 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 2279 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 2235 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 162 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 55 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 7622 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1360 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 50 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 52 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 34 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 44 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 2016 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 575 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 34 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 197 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 49 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2515 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3665 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 318 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 2240 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 692 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 137 |

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
- `routing-registry-drift.yml`: push: paths match .skilled/skills/system-deep-loop/SKILL.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-deep-loop/README.md
- `spec-kit-check.yml`: push: paths match .claude/agents/deep-research.md
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **A-1** P2 literal `.skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts:2`: The file header uses a `// TEST:` marker where the SKILLED TypeScript checklist's P0 File Header item and the TypeScript style guide declare `// MODULE: [Module Name]`. 211 of the 213 test files under runtime/tests use `// MODULE:`; only this file and its review sibling use `// TEST:`, so the marker is a new, undeclared variant rather than an established pattern.
  - Evidence: `grep -rl '^// MODULE:' .skilled/skills/system-deep-loop/runtime/tests/ | wc -l; grep -rl '^// TEST:' .skilled/skills/system-deep-loop/runtime/tests/ | wc -l; grep -rn '^// TEST:' .skilled/skills/syste...` exit 0: ...11 TEST headers: 2 .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts:2:// TEST: Research default-path golden byte identity .skilled/skills/system-deep-loop/runtime/tests/unit/review-depth-mode-golden.vitest.ts:2:// TEST: Review default-path golden byte identity
- **A-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:437`: The admission `budget` check can never prune. It fires only when both `proposal.budget` and `parent.budget` are finite numbers, but no writer ever puts a `budget` field on a node row: `admitProposals` and `seedNodes` write {nodeId, parentId, depth, scope, question, status, reason, iteration, dedupeKey}, `closeNode` only spreads an existing row, and the FRONTIER block asks the leaf for `question`, ...
  - Evidence: `D=$(mktemp -d) && node -e 'const fs=require("fs"),path=require("path");const {seedNodes,admitProposals,readNodeStore}=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs");c...` exit 0: row keys: ["nodeId","parentId","depth","scope","question","status","reason","iteration","dedupeKey"] has budget field: false admit with budget 99: {"admitted":["F-2-002"],"pruned":[]}
- **A-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:254`: `readCaps` and `seedBudget` derive the run-wide node cap from the same `maxIterations` value with different coercion, so they disagree whenever the config value is not already a finite positive number. `readCaps` (line 254) passes the raw value to `capValue`, which rejects a numeric string and falls back to DEFAULT_MAX_FRONTIER_NODES (10); `seedBudget` (line 304) wraps it in `Number()` first and d...
  - Evidence: `D=$(mktemp -d) && printf '{"maxIterations":"24","antiConvergence":{"depthMode":"expansive"},"expansiveDepth":{"maxDepth":3,"maxChildrenPerNode":6,"maxFrontierNodes":null}}' > "$D/deep-research-config....` exit 0: readCaps: {"maxDepth":3,"maxChildrenPerNode":6,"maxRootChildren":6,"maxFrontierNodes":10} seedBudget: {"derivedMaxIterations":24,"growthSlots":12}

### S2 Skill docs match sk-create-skill

- **B-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:465`: The reference contradicts itself on who writes the review node store. Line 465 says `frontier-admit.cjs --target review` 'is its only writer'; line 469 of the same file says 'Each lineage's store is written before it spawns'. `fanout-run.cjs:3960` calls `writeLineageFrontierStore(lineageDir, frontierPartition[lineage.label] || [], { inbox: loopType !== 'review' })`, so a fan-out lineage's `frontie...
  - Evidence: `sed -n '465p;469p' .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md | cut -c1-260; sed -n '3960p' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | cut...` exit 0: ...r. | 469: On a fan-out run the depth-1 nodes are dealt round-robin in node-id order, ... Each lineage's store is written before it spawns ... | fanout-run.cjs:3960: if (frontierPartition) writeLineageFrontierStore(lineageDir, frontierPartition[lineage.label] || [], { inbox: loopType !== 'review' });
- **X-6** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:135`: `--extend-minutes=M` is a new operator flag in this change, bound in both workflow YAMLs (`deep-research.yaml:70`, `deep-review.yaml:60`) and documented in both command docs, both presentation files, both compiled contracts, both loop-protocol references and both completed-run-extension feature entries. It is absent from the four surfaces a reader reaches first: `deep-research/SKILL.md:135` and `d...
  - Evidence: `grep -c 'extend-minutes' .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md .skilled/skills/system-deep-loop/deep-research/references/guides/...` exit 0: ...ls/system-deep-loop/deep-review/SKILL.md:0 .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:0 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:0 .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:2
- **X-8** P2 literal `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:81`: The new Frontier Node Store paragraph says `runtime/scripts/frontier-admit.cjs` "is the only writer" of `research/frontier-nodes.jsonl`. `deep-research/references/protocol/loop-protocol.md:421`, added in the same change, says `fanout-run.cjs --depth-mode expansive` "writes each lineage's `frontier-nodes.jsonl` and inbox rows before it spawns", and `fanout-run.cjs:3960` does exactly that through `w...
  - Evidence: `sed -n '81p' .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md | cut -c1-400; sed -n '421p' .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protoc...` exit 0: ...und-robin in node-id order across lineages, writes each lineage's `frontier-nodes.jsonl` and inbox rows before it spawns, binds `frontier_scope:` in the lineage pro if (frontierPartition) writeLineageFrontierStore(lineageDir, frontierPartition[lineage.label] || [], { inbox: loopType !== 'review' });

### S3 Feature catalog entries

- **B-1** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:49`: The frontier-to-coverage-graph mirror is a new shipped capability of this change with no feature-catalog entry anywhere in the skill. The deep-research workflow gained a step that runs `frontier-admit.cjs graph` and then `upsert.cjs --events` to mirror the node store into the coverage graph, re-kinding exhausted/blocked/abstained nodes from QUESTION to a closed CLAIM so question coverage and sourc...
  - Evidence: `grep -rn 'frontier-graph\|Mirror the frontier\|re-kinded' .skilled/skills/system-deep-loop/{deep-research,deep-review,runtime}/feature-catalog .skilled/skills/system-deep-loop/feature-catalog; grep -n...` exit 1: first grep: no matches (exit 1). second grep: 1911: node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs graph --artifact-dir "{artifact_dir}" --output "{artifact_dir}/frontier-graph-events.json"
- **B-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:620`: The `upsert.cjs` entry still describes only the pre-change behaviour. This change added 276 lines to `runtime/scripts/upsert.cjs`: the `--state-log`, `--delta-dir` and `--iteration` inputs, `resolveReviewFindingId` id folding, `parseFindingRef`, and `deriveReviewFindingEvidence`, which emits one FINDING node per iteration finding plus an EVIDENCE_FOR edge to the FILE node of its `path:line` ref an...
  - Evidence: `grep -n 'state-log\|delta-dir\|EVIDENCE_FOR\|rejectedOrphanEdges' .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md .skilled/skills/system-deep-loop/runtime/feature-catalog/s...` exit 1: no matches in either file
- **X-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md:16`: The entry says the merged review registry carries three coverage surfaces, candidate, dimension and search. `mergeReviewCoverageSurfaces` at `fanout-merge.cjs:1048` returns six: it adds `traceability`, `divergenceByLineage` and `ruledOutCandidates`. The DRV-071 playbook added in the same change names all six, and the runtime catalog index at `feature-catalog.md:850` repeats the three-surface sente...
  - Evidence: `grep -n 'three coverage surfaces' .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md; sed -n '1048,1058p' .skilled/skills/system-deep-loop/runtime/scripts/...` exit 0: ...didates: mergeRuledOutCandidates(lineages), playbook:15:... It focuses on a two-lineage review fan-out whose merged registry must carry the coverage that each lineage recorded: `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergenceByLineage` and `ruledOutCandidates`.
- **X-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:19`: `fanout-merge.cjs` gained 223 lines and nine new functions in this change: `qualifyFrontierId`, `mergeResearchFrontier`, `mergeReviewCoverageSurfaces`, `mergeDimensionCoverage`, `mergeTraceability`, `mergeSearchCoverage`, `mergeCandidateCoverage`, `mergeDivergenceByLineage` and `mergeRuledOutCandidates`, plus the `frontier_partition_guard_failed` warning. The entry (version 1.4.2.0) still describe...
  - Evidence: `git -c core.fsmonitor=false diff --stat 21c4b325b5a0074ac31d0f2ec3e31e28351be933..HEAD -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs; git -c core.fsmonitor=false diff 21c4b325b5...` exit 0: ...ineages) { +function mergeTraceability(lineages) { +function mergeSearchCoverage(lineages) { +function mergeCandidateCoverage(lineages) { +function mergeDivergenceByLineage(lineages) { +function mergeRuledOutCandidates(lineages) { +function mergeReviewCoverageSurfaces(lineageData) { entry matches: 0
- **X-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:19`: `fanout-run.cjs` gained 137 lines in this change: `partitionFrontierNodes`, `writeLineageFrontierStore`, the `frontier_scope` prompt binding, `frontierPartition` in `orchestration-summary.json`, `depthMode` propagation and the per-lineage `DEEP_LOOP_COVERAGE_DB_DIR`. The entry (version 1.4.3.0) has zero matches for `frontier`, `partition`, `depthMode` or `COVERAGE_DB_DIR`, so the driver that now d...
  - Evidence: `git -c core.fsmonitor=false diff --stat 21c4b325b5a0074ac31d0f2ec3e31e28351be933..HEAD -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs; git -c core.fsmonitor=false diff 21c4b325b5a0...` exit 0: fanout-run.cjs | 137 ++- DEEP_LOOP_COVERAGE_DB_DIR depthMode frontier_partition frontier_scope frontierPartition partitionFrontierNodes writeLineageFrontierStore entry matches: 0
- **X-4** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:19`: `convergence.cjs` gained 79 lines in this change: the `frontierOpen` veto, the review-only `frontier_drained` hard candidate, the `minIterations` floor with `minIterationsNotReached`, and `depthMode` read from `antiConvergence`. The entry (version 1.4.0.4) has zero matches for `frontier`, `minIterations` or `depthMode` and still describes the decision as graph-aware only, so the script entry point...
  - Evidence: `git -c core.fsmonitor=false diff --stat 21c4b325b5a0074ac31d0f2ec3e31e28351be933..HEAD -- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs; git -c core.fsmonitor=false diff 21c4b325b5a...` exit 0: convergence.cjs | 79 +- depthMode frontier frontier_drained frontierAnswered frontierOpen frontierTotal minIterations minIterationsNotReached entry matches: 0
- **X-5** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md:46`: The HOW IT WORKS section says "the research and review command workflows reopen the pivot once as attempt 2", but the Implementation table lists only `deep-review.yaml` as the command workflow. `deep-research.yaml:1371` carries the same reopen step with the same `skip_when` and `retryable` text, so the research half of the claim has no source anchor and a reader verifying the research retry is sen...
  - Evidence: `grep -n 'deep-research.yaml' .skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md; grep -n 'Reopen the pivot once as attempt 2' .skilled/commands/deep...` exit 1: ...mmands/deep/assets/deep-research.yaml:1371: action: "Reopen the pivot once as attempt 2 when finalize reports a retryable council quorum failure" .skilled/commands/deep/assets/deep-review.yaml:1476: action: "Reopen the pivot once as attempt 2 when finalize reports a retryable council quorum failure"

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:909`: The same new capability has no manual-testing scenario. The deep-research playbook's expansive set stops at DR-073 (fan-out partition): DR-068 covers the flag default, DR-069 the seed, DR-070 admission, DR-071 focus, DR-072 the veto and DR-073 the partition, but nothing exercises the frontier graph mirror, its QUESTION-to-CLAIM re-kinding, or the `skip_second_command_when: nodes 0` guard. The S4 l...
  - Evidence: `grep -rn 'frontier-graph\|frontier graph\|DERIVED_FROM' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` exit 1: no matches
- **X-7** P2 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:594`: `frontier_drained` is a new hard stop candidate in this change (`convergence.cjs:1183`), documented in the review SKILL.md, README, quick-reference, loop-protocol, convergence reference and expansive-depth-mode entry, and pinned by `stop-decision.vitest.ts:1259` and `stop-decision-yaml-contract.vitest.ts:399`. No manual-testing scenario exercises it: the playbook's expansive set stops at DRV-080 (...
  - Evidence: `grep -rn 'frontier_drained' .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/ | wc -l; grep -n 'review frontier_drained candidate' .skilled/skills/system-deep-loop/runtime/tests/un...` exit 0: 0 1259:describe('review frontier_drained candidate', () => { 594:### DRV-080 | Frontier open veto holds a review stop, hard stops included 607:### DRV-081 | Review pivot waits for a terminal frontier

### S5 READMEs match sk-create-readme, root included

- **C-01** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:107`: The Packet Files table is this README's only inventory of what a run writes, and it omits `frontier-nodes.jsonl`, the node store `--depth-mode=expansive` creates under `{spec_folder}/research/`. The file name appears nowhere in the README, although the depth-mode paragraph at line 127 describes the seed, admission and next-focus behavior that reads and writes it, and the review README names its eq...
  - Evidence: `grep -c 'frontier-nodes' .skilled/skills/system-deep-loop/deep-research/README.md` exit 1: 0 (no match; the store is real: frontier-admit.cjs:42 `const NODE_STORE_FILE = 'frontier-nodes.jsonl';` and references/state/state-format.md:81 documents `research/frontier-nodes.jsonl`)
- **C-02** P2 literal `.skilled/skills/system-deep-loop/deep-review/README.md:139`: The State on Disk table lists every file under `{spec_folder}/review/` except `frontier-nodes.jsonl`, while the depth-mode paragraph at line 158 tells the reader 'Node status lives in `review/frontier-nodes.jsonl`'. The scope added the store, and it is conditional the way `resource-map.md` is, which the table does list. A reader using the table as the packet inventory cannot see the file the mode ...
  - Evidence: `grep -n 'frontier-nodes' .skilled/skills/system-deep-loop/deep-review/README.md` exit 0: 158:`--depth-mode=expansive` is the one stop-path change ... Node status lives in `review/frontier-nodes.jsonl`, which no default run creates ... (one hit, the prose; no table row between lines 131 and 139)
- **C-03** P2 judgment `.skilled/skills/system-deep-loop/deep-research/README.md:127`: The depth-mode paragraph gives the derived budget as `min(24, max(10, 2 x (S + maxDepth - 1)))` and stops there, so a reader computing S=0 gets 10 iterations. A fan-out research lineage dealt no seed node runs at 12 instead, because fanout-run.cjs passes 12 as the floor for a native lineage. The review README states the same rule for its loop ('12 iterations for a native lineage and 7 for a CLI on...
  - Evidence: `node -e "const m=require('./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs'); console.log(m.expansiveBudget({target:'research',seeded:0,loopDefault:10}), m.expansiveBudget({target...` exit 0: 10 12 16 (S=0 single run or CLI lineage 10, S=0 native lineage 12, S=6 16 as the README already states) fanout-run.cjs:339 loopDefault: lineage.kind === 'native' ? 12 : LOOP_DEFAULT_MAX_ITERATIONS[loopType],
- **C-04** P2 judgment `.skilled/skills/system-deep-loop/deep-review/README.md:158`: The new depth-mode paragraph is one 367-word block whose sentences average 28 words and reach 46, against the standard's 'short paragraphs of short sentences, about 10-15 words each and about 60 words a paragraph'. The research sibling repeats the pattern (line 127: 218 words, 8 sentences, one of 44 words). The derived-budget rule, the fan-out split and the duration caveat sit in one run of text a...
  - Evidence: `python3 -c "import re; [print(p, n, len(l.split()), len(s), round(len(l.split())/len(s),1), max(len(x.split()) for x in s)) for p,n in [('.skilled/skills/system-deep-loop/deep-review/README.md',158),(...` exit 0: .skilled/skills/system-deep-loop/deep-review/README.md 158 367 13 28.2 46 .skilled/skills/system-deep-loop/deep-research/README.md 127 218 8 27.2 44
- **C-06** P2 judgment `.skilled/skills/system-deep-loop/deep-research/README.md:199`: The FAQ answer documents `--extend=N` as the source of `completed-continue` and never names `--extend-minutes=M`, the companion flag the same command binds. The flag ships in both workflow YAMLs and is documented in the command doc, the feature catalog and loop-protocol.md, and the root README names it, so the skill README is the one surface a reader can reach that omits it. The deep-review README...
  - Evidence: `grep -c 'extend-minutes' .skilled/skills/system-deep-loop/deep-research/README.md .skilled/skills/system-deep-loop/deep-review/README.md .skilled/commands/deep/assets/deep-research.yaml` exit 0: .skilled/skills/system-deep-loop/deep-research/README.md:0 .skilled/skills/system-deep-loop/deep-review/README.md:0 .skilled/commands/deep/assets/deep-research.yaml:3

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Same cause as D-03. Owner: commands/scripts/validate-command-references.cjs:134, a file this program did not change; speckit-resume.yaml:104 names a gitignored runtime path (.gitignore:431).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **D-01** P2 judgment `.skilled/skills/system-deep-loop/SKILL.md:45`: The hub's stage-one routing prose asserts that three sources are checked against hub-router.json vocabularyClasses: the mode-registry aliases, each packet's `Keyword triggers:` line, and the root ROUTER.md intents. Two of the three hold. The packet Keyword triggers do not: 5 of deep-research's 8 declared triggers and 7 of deep-review's 12 are absent from vocabularyClasses, so a phrase the packet a... [handed off] [S7, D]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: system-deep-loop hub routing. SKILL.md:45 (commit 9dc9992ed6a) and the packet trigger lists predate the program; the critic overrides it as pre-existing.
  - Evidence: `node -e 'compare mode-registry aliases and each packet Keyword triggers line against hub-router.json vocabularyClasses'` exit 0: ..."quality audit","find misalignments","verify cross-references","pre-release review","audit spec folder"] deep-review MISSING from hub vocabulary (7): ["spec folder review","convergence detection","quality audit","find misalignments","verify cross-references","pre-release review","audit spec folder"]
  - Critic override: pre-existing, lane severity P2. `git -c core.fsmonitor=false diff 21c4b325b5a0074ac31d0f2ec3e31e28351be933..HEAD -- .skilled/skills/system-deep-loop/SKILL.md` changes only the `version:` line (2.0.2.0 to 2.1.6.0), and the deep-research and deep-review SKILL.md diffs contain no `Keyword triggers:` change, so both the routing sentence at line 45 and the trigger lists it misdescribes predate the range. The claim is accurate about t...
- **D-02** P2 judgment `.skilled/skills/system-deep-loop/hub-router.json:37`: review-aliases carries the generic phrase 'review request', which skill-hub-routing.md section 4 names as the failure shape: a term that also matches unrelated work captures traffic the hub cannot serve. Three of four out-of-domain prompts route to system-deep-loop with action route, ahead of sk-code, so an operator asking about a customer or marketplace review request is offered /deep:review and ... [handed off] [S7, D]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: system-deep-loop hub routing. hub-router.json:37 review-aliases (commit 7af52ef940f) predate the program; the critic overrides it as pre-existing.
  - Evidence: `printf '%s' '{"prompt":"<prompt>"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` exit 0: ... please approve the vendor contract -> system-deep-loop@0.62012[route] sk-code@0.619171[route] Handle the review request from the customer and reply -> system-deep-loop@0.62012[route] sk-code@0.613308[route] Audit the diff for injection risks -> system-deep-loop@0.5912[route] sk-code@0.501095[defer]
  - Critic override: pre-existing, lane severity P2. `git -c core.fsmonitor=false diff 21c4b325b5a0074ac31d0f2ec3e31e28351be933..HEAD -- .skilled/skills/system-deep-loop/hub-router.json` changes only the `version:` line (2.0.2.0 to 2.1.6.0). `review-aliases` and its `review request` and `audit the diff` entries are byte-identical to the merge base, so the out-of-domain capture predates the scope.
- **D-03** P2 literal `.skilled/commands/scripts/validate-command-references.cjs:134`: Confirmed cause of the S9-command-references battery failure, and it is not in the eight S9 scope files: the validator's gitignored-runtime-state skip list exempts .skilled/skills/.state/ and .skilled/skills/system-deep-loop/runtime/database/*.sqlite, but not .skilled/skills/system-spec-kit/runtime/database/, which .gitignore:431 ignores wholesale. speckit-resume.yaml:104 therefore names a path th... [handed off] [S9, D]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: commands/scripts/validate-command-references.cjs:134, a file this program did not change; speckit-resume.yaml:104 names a gitignored runtime path (.gitignore:431).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs; git -c core.fsmonitor=false check-ignore -v .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json` exit 1: ...d/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk .gitignore:431:.skilled/skills/system-spec-kit/runtime/database/ .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json
  - Critic override: pre-existing, lane severity P2. `git -c core.fsmonitor=false diff --name-only 21c4b325b5a0074ac31d0f2ec3e31e28351be933..HEAD -- .skilled/commands/` lists only the eight deep command files, so neither `validate-command-references.cjs` nor `speckit-resume.yaml` changed, and `git show 21c4b325b5a0074ac31d0f2ec3e31e28351be933:.gitignore` already carries `.skilled/skills/system-spec-kit/runtime/database/` at line 431. The S9 gate fai...

### unchanged in range

- **C-05** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:1`: The newest root release notes describe no capability this scope adds. `--depth-mode=expansive`, `--extend=N`, `--extend-minutes=M` and custom review dimensions appear nowhere in the entry, so an operator reading the release notes learns nothing about them. The S6 battery row passes because check-release-coverage.cjs only requires the skill name, which the entry carries. v4.1.0.0 is tagged on origi... [handed off] [S6, C]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: the operator, who writes skilled release entries. .skilled/changelog/skilled/v4.1.0.0.md (commit 4672913c901) is tagged on origin and cannot be extended; a new release entry is the operator's call.
  - Evidence: `grep -niE 'expansive|depth-mode|extend=|custom dimension' .skilled/changelog/skilled/v4.1.0.0.md | wc -l; git -c core.fsmonitor=false ls-remote --exit-code --tags origin refs/tags/v4.1.0.0` exit 0: 0 648071a3cdf7394f0b592082a246c59bdea49b46 refs/tags/v4.1.0.0

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
| P03 | system-deep-loop/review | system-deep-loop/review | pass |
| P04 | system-deep-loop/review | system-deep-loop/review | pass |
| P05 | system-deep-loop/review | system-deep-loop/review | pass |
| P06 | system-deep-loop/review | system-deep-loop/review | pass |
| P07 | system-deep-loop/research | system-deep-loop/research | pass |
| P08 | system-deep-loop/research | system-deep-loop/research | pass |
| P09 | system-deep-loop/review | system-deep-loop/review | pass |
| P10 | sk-code | sk-code/sk-code-review | pass |
| P11 | sk-doc | sk-doc | pass |
| P12 | sk-git | sk-git | pass |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.gitignore`
- `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/lineage-prompt.txt`

