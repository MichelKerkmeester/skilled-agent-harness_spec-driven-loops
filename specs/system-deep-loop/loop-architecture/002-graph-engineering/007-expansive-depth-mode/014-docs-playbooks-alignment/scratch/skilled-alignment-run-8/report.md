# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `1e350ae863f1d4fe433e4b708ab58a3eabb6ac46`, 42 first-parent commits
- Files: 763, of which 301 uncommitted or untracked
- Owners: 15
- Findings: 20 (P0 0, P1 3, P2 17), 5 literal, 0 inferred, 1 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 2 (18 handed off, 0 rebutted)
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
| pass | P2 | no | `S1-quality-gate` | 0 | 1670 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 780 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1041 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 353 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 365 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 73 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 59 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 55 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6454 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 41 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6443 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 104 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 285 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 240 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 239 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 258 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 249 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 252 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 258 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 244 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 248 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 231 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 241 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 437 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 425 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 255 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 248 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 262 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 259 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 252 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 244 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 240 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 239 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 239 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 219 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 300 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 300 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 300 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 265 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 246 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 638 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 322 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 290 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 343 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 221 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1566 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 71 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 47 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 58515 |
| pass | P2 | no | `S5-derived-counts` | 0 | 157 |
| pass | P2 | no | `S5-readme-references` | 0 | 2249 |
| pass | P2 | no | `S6-release-coverage` | 0 | 59 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 86 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 411 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 32 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 3728 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 113 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 259 |
| pass | P2 | no | `S8-advisor-status` | 0 | 182 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 48 |
| fail | P2 | no | `S9-command-references` | 1 | 70 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 442 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 39 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 337 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 57 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 42 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 44 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 40 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 38 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 67 |
| pass | P2 | no | `S13-env-tokens` | 0 | 154 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2169 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1946 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1561 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1587 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1561 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1524 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1685 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1723 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1731 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1795 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1776 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1528 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1572 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1546 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 135 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 55 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 6793 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1208 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 53 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 51 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 34 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 45 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1901 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 609 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 40 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 210 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 80 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1984 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3619 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 328 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1861 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 640 |
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
- `routing-registry-drift.yml`: push: paths match .skilled/skills/system-deep-loop/SKILL.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-deep-loop/README.md
- `spec-kit-check.yml`: push: paths match .claude/agents/deep-research.md
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **A-1** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:391`: Case: a review run reuses a finding id for a different finding in a later iteration (the code treats ids as unique only per source, so deriveReviewFindingEvidence places the later one at finding:<id>#<iteration>), and the leaf also emits that finding as a graph node/edge ({id:'F1',kind:'FINDING'} plus a RESOLVES edge to 'F1'). knownFindings is filled from every stored FINDING first (386-392) and t... [handed off]
  - Disposition: Owner: phase 011 review frontier mode (review evidence edges). runtime/scripts/upsert.cjs:386-397 folds a leaf-sent FINDING node onto finding:<id> even when deriveReviewFindingEvidence placed a reused id at finding:<id>#<iteration>, so a later RESOLVES edge can target the wrong finding. Fixing it means deciding how leaf graph events address a re-keyed finding, a design choice in the evidence-edge ...
  - Evidence: `S=$TMPDIR/a1fix; mkdir -p $S/db; state.jsonl = iterations 1-3, each with findingDetails [{id:'F1',title:'<different title>',file:'src/<different>.cjs:9'}]; for i in 1 2: DEEP_LOOP_COVERAGE_DB_DIR=$S/d...` exit 0: ...etadata":null} | {"id":"finding:F1#2","name":"Race in b","iteration":2,"metadata":"{...src/b.cjs...}"} | {"id":"finding:F1#3","name":"Null deref in c","iteration":3,"metadata":"{...src/c.cjs...}"}; coverage_edges: {"id":"resolves-3","source_id":"fix-3","target_id":"finding:F1","relation":"RESOLVES"}
- **A-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2684`: Case: a seeded frontier node (frontier-admit always writes iteration 0) is closed by applyFrontierBudget's band sweep at iteration 9. The close exists only in the projection, so there is no resolution record and no stored close row; resolvedAtIteration falls back to frontierClose.iteration, the store row's iteration (0 for a seed), and the registry reports the question resolved at iteration 0. No ... [handed off]
  - Disposition: Owner: phase 010 research frontier mode. deep-research/scripts/reduce-state.cjs:2684 takes resolvedAtIteration from the store row's iteration (0 for a seed) when the close is a projection-only budget close. The lane notes no consumer reads resolvedAtIteration today; which iteration a projected close records is the owner's call.
  - Evidence: `node -e 'const {reduceResearchState}=require("./.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs"); console.log(JSON.stringify(reduceResearchState(<packet>, {write:false}).regis...` exit 0: frontier: [{"nodeId":"F-1-001","parentId":"root","depth":1,"scope":"runtime","question":"Which module owns admission?","status":"exhausted","reason":"budget","iteration":0}] keyQuestions: [{"text":"Which module owns admission?","resolved":true,"resolvedAtIteration":0,"frontierStatus":"exhausted"}]
- **A-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:234`: Case: deep-research-config.json exists but is truncated or hand-edited into invalid JSON. readTargetConfig catches every error and returns null, so readCaps (239-259) treats the run as having no config and the caps widen from the configured maxDepth/maxChildrenPerNode/maxFrontierNodes to the defaults 3/6/10, admitting proposals the run's config forbids. The same module throws for a node store that...
  - Evidence: `printf '%s' '{"maxIterations":10,"expansiveDepth":{"maxDepth":1,"maxChildrenPerNode":2,"maxFrontierNodes":2}' > deep-research-config.json; node -e 'const {readCaps}=require("./.skilled/skills/system-d...` exit 0: corrupt: {"maxDepth":3,"maxChildrenPerNode":6,"maxRootChildren":6,"maxFrontierNodes":10} valid : {"maxDepth":1,"maxChildrenPerNode":2,"maxRootChildren":6,"maxFrontierNodes":2}
- **A-4** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:195`: Case: a question begins with an ordinary 1-2 letter word, a number and a colon ('We 2: how does the loop stop'). The id-prefix strip ^[a-z]{1,2}[-\s]?\d+... removes it, so dedupeKey collapses that question to the key of 'how does the loop stop'; a genuinely different second question then prunes 'dedupe' and never reaches the frontier. The comment on lines 190-192 promises the opposite ('an ordinar... [handed off]
  - Disposition: Owner: phase 010 research frontier mode. The id-prefix strip at runtime/scripts/frontier-admit.cjs:195 also drops a 1-2 letter word plus number plus colon, against its own comment at :190-192. The right fix narrows the regex to the id shapes leaves actually write, and no test or doc pins that set, so the shape list is the owner's call.
  - Evidence: `node -e 'const {dedupeKey}=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"); for (const q of ["We 2: how does the loop stop","how does the loop stop","Q1: how does the ...` exit 0: "We 2: how does the loop stop" => "how does the loop stop" "how does the loop stop" => "how does the loop stop" "Q1: how does the loop stop" => "how does the loop stop" "Go 2: which cap applies" => "which cap applies"
- **A-5** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:377`: Case: a caller passes --state-log/--delta-dir to a non-review loop, --iteration with neither source, --iteration 0, a flag without a value, or an unreadable state log. The five new inputError branches at 377-383 are changed behavior with no test: the integration suite exercises only the pre-existing events-file read error (upsert-script.vitest.ts:90), and a search for the new messages returns no r...
  - Evidence: `rg -n -- 'supported only for loop type|iteration must be a positive integer|iteration needs --state-log|state log is unreadable|state-log requires a path|delta-dir requires a path' .skilled/skills/sys...` exit 1: (no matches)
- **A-6** P2 judgment `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2508`: Case: the depth-band budget is implemented twice with the same shares, bandOf, allotted/carry math and status sweep: applyFrontierBudget here (2508-2538) and applyReviewFrontierBudget in runtime/scripts/reduce-state.cjs (1963-1990). The two already differ in visit attribution, so a fix to one (such as excluding a non-evidence iteration status in the visit count) must be mirrored by hand in the oth... [handed off]
  - Disposition: Owner: phases 010 and 011 together. The band arithmetic exists twice, deep-research/scripts/reduce-state.cjs:2508-2538 and runtime/scripts/reduce-state.cjs:1963-1990, and the two already differ in visit attribution. Merging them into one shared module is a cross-packet refactor that must first settle which visit rule is right, not a small fix.
  - Evidence: `rg -n "rolls down|const allotted = cap \* shares\[band\] \+ carry" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs .skilled/skills/system-deep-loop/runtime/scripts/reduce-state...` exit 0: ... runtime/scripts/reduce-state.cjs:1980: const allotted = cap * shares[band] + carry; deep-research/scripts/reduce-state.cjs:2502:// unspent share rolls down to the next band only once the band has no open node, deep-research/scripts/reduce-state.cjs:2528: const allotted = cap * shares[band] + carry;

### S2 Skill docs match sk-create-skill

- **B-S2-01** P2 judgment `.skilled/skills/system-deep-loop/deep-review/SKILL.md:229`: Case: a review run reaches its maxDurationMinutes budget (120 by default). The section says runtime/scripts/convergence.cjs 'computes the whole stop decision once per pass' and that deep-review.yaml 'renders no stop arithmetic of its own', but the duration decision is rendered in the workflow: deep-review.yaml:1203 sets decision STOP with reason maxDurationReached after its own elapsed-minutes com... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: the expansive-depth docs follow-up the coordinator opens after this phase. deep-review SKILL.md:229 says convergence.cjs computes the whole stop decision, but deep-review.yaml:1203 renders the duration stop; older text.
  - Evidence: `rg -n 'reason: "maxDurationReached"' .skilled/commands/deep/assets/deep-review.yaml | head -3; rg -n maxDuration .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs || echo 'no maxDuratio...` exit 0: 1203: set: { decision: "STOP", reason: "maxDurationReached", stopReason: "maxDurationReached" } no maxDuration in convergence.cjs

### S3 Feature catalog entries

- **B-S3-01** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md:24`: Case: a research SOURCE node arrives with an unclassified path, an unclassified name, and a label that names a document (for example path 'working notes', name 'note', label 'docs/loop.md'). The entry states the class comes from the source 'path, then name, then id', so an operator applying it concludes the node falls to id and stays unclassified; upsert.cjs actually consults label before id and d... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: the expansive-depth docs follow-up the coordinator opens after this phase. runtime catalog source-quality-class.md:24 omits that the label decides before the id; owned with the source-quality-class feature.
  - Evidence: `sed -n '24p' .skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md; rg -n "for \(const candidate of" .skilled/skills/system-deep-loop/runtime/scripts/upsert.c...` exit 0: `runtime/scripts/upsert.cjs` derives the class from the source `path`, then `name`, then `id`, and writes it on research SOURCE nodes. The derived value replaces any leaf-supplied `quality_class`. 333: for (const candidate of [node.path, node.name, node.label, node.id]) {

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-S4-01** P1 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:52`: Case: an operator finishes any deep-research scenario and records its outcome under the instruction in section 3 GLOBAL EVIDENCE REQUIREMENTS, which asks for 'A PASS, PARTIAL, or FAIL verdict'. Section 1 of the same playbook (line 9) says 'The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented)', and the governing standard limits execution status to... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: the expansive-depth docs follow-up the coordinator opens after this phase. deep-research manual-testing-playbook.md:52 asks for a PARTIAL verdict the standard forbids; older root playbook text.
  - Evidence: `rg -n "PARTIAL" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` exit 0: 52:- A PASS, PARTIAL, or FAIL verdict with reasoning.
- **B-S4-02** P2 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:793`: Case: an operator uses section 14 'FEATURE CATALOG CROSS-REFERENCE INDEX' to reach the deep-review catalog, or opens one of the 13 new review scenarios to check it against the catalog entry that covers it. The section lists scenario files only and never names the catalog (the word 'catalog' occurs once in the whole root playbook, in the heading), and 8 of the 13 new scenario files contain no catal... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 011 review frontier mode. deep-review manual-testing-playbook.md:793 cross-reference index never names the catalog, and 8 of the 13 new review scenarios carry no catalog reference.
  - Evidence: `grep -c -i catalog .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md; grep -Li catalog .skilled/skills/system-deep-loop/deep-review/manual-testing-playboo...` exit 0: 1 8
- **B-S4-03** P2 judgment `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md:61`: Case: the label-only node from B-S3-01 (path and name unclassified, label naming a document) is graded with this scenario. The Fail list makes 'A label or leaf value decides the class' a FAIL, but the shipped derivation deliberately lets the label decide once path and name yield nothing, and the scenario's own Pass line treats path-over-label precedence, not label-never-decides, as the rule. Failu... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: the expansive-depth docs follow-up the coordinator opens after this phase. runtime playbook source-quality-class-derivation.md:61 fails a label-decided class the code allows; owned with the source-quality-class feature.
  - Evidence: `sed -n '61p;65p' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` exit 0: ...he typecheck fails. If the classification is wrong, check the order in `classifySourceLocation` first: the path decides, then the label, then the id. If the diversity score is wrong, check that the seeded fixtures carry paths and not labels, since a label-only fixture cannot produce a derived class.
- **B-S4-04** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:316`: Case: an operator runs DR-025 from its root summary and looks for the 'v1.1.0 agent instructions' the expected signal names. .skilled/agents/deep-research.md carries no version field at all and its Step 6 required-fields list is versionless, so the stamp names a version the current deep-research release (1.16.0.0) superseded and the signal cannot be confirmed from the shipped file; the DR-025 feat... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: the expansive-depth docs follow-up the coordinator opens after this phase. deep-research manual-testing-playbook.md:316 DR-025 cites v1.1.0 agent instructions the agent file no longer versions; older text.
  - Evidence: `sed -n '316p' .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md; grep -c '^version:' .skilled/agents/deep-research.md` exit 0: Expected signals: JSONL iteration records contain both `newInfoRatio` (number, 0.0-1.0) and `noveltyJustification` (string, human-readable sentence); the justification field is listed as required in v1.1.0 agent instructions; ALWAYS rule 11 mandates both fields. 0

### S5 READMEs match sk-create-readme, root included

- **C-01** P2 literal `.skilled/skills/system-deep-loop/deep-review/README.md:139`: The 'State on Disk' table lists every file under {spec_folder}/review/ except `frontier-nodes.jsonl`, while the same section's depth-mode paragraph (line 158) tells the reader 'Node status lives in `review/frontier-nodes.jsonl`'. The scope added the store, and it is conditional the way `resource-map.md` is, which the table does list. A reader using the table as the packet inventory cannot see the ... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 011 review frontier mode. deep-review README.md:139 State on Disk table omits review/frontier-nodes.jsonl.
  - Evidence: `grep -n "frontier-nodes" .skilled/skills/system-deep-loop/deep-review/README.md; grep -n "NODE_STORE_FILE = " .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: ...h-mode=expansive` is the one stop-path change ... Node status lives in `review/frontier-nodes.jsonl`, which no default run creates ... 42:const NODE_STORE_FILE = 'frontier-nodes.jsonl'; (written under artifactDir at lines 440, 518, 569) only one occurrence in the README: the prose, never a table row
- **C-02** P2 judgment `.skilled/skills/system-deep-loop/deep-research/README.md:127`: The depth-mode paragraph gives the derived budget as `min(24, max(10, 2 x (S + maxDepth - 1)))` and stops there, so a reader computing S=0 gets 10 iterations. A fan-out research lineage dealt no seed node runs at 12 instead, because fanout-run.cjs passes 12 as the floor for a native lineage. The review README states the same rule for its loop ('12 iterations for a native lineage and 7 for a CLI on... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 010 research frontier mode. deep-research README.md:127 budget sentence omits the native fan-out lineage floor of 12.
  - Evidence: `node -e "const m=require('./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs'); console.log(m.expansiveBudget({target:'research',seeded:0,loopDefault:10}), m.expansiveBudget({target...` exit 0: 10 12 16 (S=0 single run or CLI lineage 10, S=0 native lineage 12, S=6 16 as the README already states) fanout-run.cjs:339 loopDefault: lineage.kind === 'native' ? 12 : LOOP_DEFAULT_MAX_ITERATIONS[loopType],
- **C-03** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:107`: The 'Packet Files' table is the README's only inventory of what a run writes, and it omits the frontier node store that `--depth-mode=expansive` creates under {spec_folder}/research/. The file name appears nowhere in this README although the depth-mode paragraph describes the seed, admission and next-focus behavior that reads and writes it, and the review README names its equivalent (`review/front... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: packet 010 research frontier mode. deep-research README.md:107 Packet Files table omits the research frontier node store.
  - Evidence: `grep -c "frontier-nodes" .skilled/skills/system-deep-loop/deep-research/README.md` exit 1: 0
- **C-04** P2 judgment `.skilled/skills/system-deep-loop/deep-review/README.md:158`: The new depth-mode paragraph is one 367-word block whose sentences average 28 words and reach 46, against the standard's 'short paragraphs of short sentences, about 10-15 words each and about 60 words a paragraph'. The research sibling repeats the pattern (line 127: 218 words, 8 sentences, one of 44 words). The derived-budget rule, the fan-out split and the duration caveat sit in one run of text t... [handed off]
  - Disposition: Handed off under the operator ruling of 2026-11-18 ('Fix ours, hand off rest'). Owner: the expansive-depth docs follow-up the coordinator opens after this phase. deep-review README.md:158 and deep-research README.md:127 depth-mode paragraphs exceed the README paragraph and sentence length guidance; a rewrite for both READMEs together.
  - Evidence: `python3 -c "import re; line=open('.skilled/skills/system-deep-loop/deep-review/README.md').read().split(chr(10))[157]; s=[x for x in re.split(r'(?<=[.!?])\\s+', line) if x.strip()]; print(len(line.spl...` exit 0: 367 13 46 28.2 (research README line 127: 218 8 44 27.2)

### S7 Skill routing is right

- **D-02** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:57`: The SMART ROUTING sentence says this packet is selected when the request names 'a research state packet', but no stage carries that phrase: `graph-metadata.json` has no such `intent_signals` entry and no derived phrase, `hub-router.json`'s `research-aliases` has no such keyword, and `deep-research/ROUTER.md`'s machine INTENT model declares `state file` but no such intent. Reproduced: `advisor_reco... [handed off]
  - Disposition: Owner: system-deep-loop hub routing. deep-research/SKILL.md:57 names 'a research state packet' as a selection phrase that no stage carries (hub-router.json:33, graph-metadata.json intent_signals, deep-research/ROUTER.md INTENT model). Whether to add the phrase to the routing vocabulary or drop it from the sentence is the routing owner's call under skill-hub-routing.md section 4; the sentence preda...
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "recover a research state packet"; node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"recover a research stat...` exit 0: {"hubId":"system-deep-loop","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"c6b62457fa5db8f1c3545095977dd006c852dc2c0021407a94bd2fbcbcb713b6","generation":4} system-spec-kit score=0.551358

### S8 Skill integrated in system-skill-advisor

- **D-01** P1 judgment `.skilled/skills/system-deep-loop/hub-router.json:33`: The hub's routing vocabulary names none of the new features. `hub-router.json`'s `research-aliases` and `review-aliases`, `graph-metadata.json`'s `intent_signals` (line 42) and `description.json`'s `keywords` (line 6) contain no `expansive`, `depth mode`, `frontier`, `extend` or `completed-run` phrase, so stage one cannot select the hub from a request that names the feature without also naming dee... [handed off]
  - Disposition: Owner: system-deep-loop hub routing with system-skill-advisor. hub-router.json:33 research-aliases and review-aliases, graph-metadata.json:42 intent_signals and description.json:6 keywords carry no expansive, depth mode, frontier or extend phrase. Adding them needs a dual write and the out-of-domain replay in skill-hub-routing.md section 4; JSON routing metadata, not a doc defect.
  - Evidence: `for p in "turn on expansive depth mode for this investigation" "use the expansive depth sub-mode on this audit" "extend this completed run by five iterations" "reopen the finished loop for three more ...` exit 0: ...nsive depth sub-mode on this audit -> sk-code score=0.460329 extend this completed run by five iterations -> cli-external-orchestration score=0.106349 reopen the finished loop for three more passes -> NO_RECOMMENDATION run the research pass with a follow-up question frontier -> sk-doc score=0.150528

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Same cause as D-03. Owner: commands/scripts/validate-command-references.cjs (:134-136), a file this program did not change. speckit-resume.yaml:104 names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file (.gitignore:431) the YAML falls back from, so the YAML is right and the checker needs a runtime-state exemption. Predates this program.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **D-03** P2 literal `.skilled/commands/scripts/validate-command-references.cjs:134`: The S9-command-references row fails on `speckit-resume.yaml:104`, and the failing reference is correct: `.skilled/skills/system-spec-kit/runtime/database/access-telemetry.json` is gitignored runtime state (`.gitignore:431`, confirmed by `git check-ignore -v`), written on demand by `resolveTelemetryStorePath()` into `TELEMETRY_STORE_DIR` (`runtime/lib/graph/access-telemetry.ts`, `shared/config.ts`)... [handed off] [S9, D]
  - Disposition: Owner: commands/scripts/validate-command-references.cjs (:134-136), a file this program did not change. speckit-resume.yaml:104 names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file (.gitignore:431) the YAML falls back from, so the YAML is right and the checker needs a runtime-state exemption. Predates this program.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json — path does not exist on disk

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
| P04 | system-deep-loop/research | sk-doc | fail |
| P05 | system-deep-loop/research | - | fail |
| P06 | system-deep-loop/review | system-deep-loop/review | pass |
| P07 | system-deep-loop/review | system-deep-loop/review | pass |
| P08 | system-deep-loop/review | sk-code | fail |
| P09 | system-deep-loop/research | system-deep-loop/research | pass |
| P10 | system-deep-loop/research | system-deep-loop/research | pass |
| P11 | system-deep-loop | cli-external-orchestration | fail |
| P12 | system-deep-loop | - | fail |
| P13 | system-deep-loop/review | system-deep-loop/review | pass |
| P14 | system-deep-loop/review | system-deep-loop/review | pass |
| P15 | sk-code | sk-code | pass |
| P16 | sk-doc | sk-doc | pass |
| P17 | sk-git | sk-git | pass |

## Probes awaiting the critic

- P04: run the research pass with a follow-up question frontier; expected system-deep-loop; actual skill sk-doc
- P05: turn on expansive depth mode for this investigation; expected system-deep-loop; actual skill -
- P08: use the expansive depth sub-mode on this audit; expected system-deep-loop; actual skill sk-code
- P11: extend this completed run by five iterations; expected system-deep-loop; actual skill cli-external-orchestration
- P12: reopen the finished loop for three more passes; expected system-deep-loop; actual skill -

## Files no lane reviewed

No critic output in this run, so coverage was not checked.

