# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `cee8682a6c9ef068533304435765dac7aad72702`, 29 first-parent commits
- Files: 444, of which 0 uncommitted or untracked
- Owners: 9
- Findings: 25 (P0 0, P1 12, P2 13), 13 literal, 0 inferred, 1 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 16 (7 handed off, 2 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 14 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 88 | 7 |
| S3 | Feature catalog entries | yes | 102 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 102 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 111 | 3 |
| S6 | Changelogs updated or created | yes | 108 | 1 |
| S7 | Skill routing is right | yes | 7 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 7 | 1 |
| S9 | Commands aligned | yes | 6 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 9 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 14 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 55 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 152, fail 1, cannot run 0, not applicable 3

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 2126 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 537 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1021 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 273 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 387 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 87 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 88 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 80 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6764 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 48 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6711 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 112 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 484 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 457 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 252 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 249 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 346 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 374 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 289 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 248 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 286 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 276 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 395 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 363 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 243 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 401 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 397 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 299 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 549 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 576 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 572 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 526 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 348 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 320 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 281 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 231 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 198 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 206 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 534 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 208 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1883 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 68 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 43 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 61883 |
| pass | P2 | no | `S5-derived-counts` | 0 | 165 |
| pass | P2 | no | `S5-readme-references` | 0 | 2732 |
| pass | P2 | no | `S6-release-coverage` | 0 | 48 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 39 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 484 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 52 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 3991 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 115 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 285 |
| pass | P2 | no | `S8-advisor-status` | 0 | 158 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 44 |
| fail | P2 | no | `S9-command-references` | 1 | 64 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 414 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 307 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 48 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 36 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 42 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 40 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 36 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 59 |
| pass | P2 | no | `S13-env-tokens` | 0 | 152 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2208 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 2010 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1867 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1686 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1592 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1677 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1696 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1695 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1514 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1715 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1711 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1813 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1753 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1725 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 122 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 49 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 6609 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1254 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 51 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 47 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 35 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 42 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 2253 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 864 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 41 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 208 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 122 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1993 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3641 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 320 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1694 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 520 |
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

- **A1** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:239`: readCaps derives maxFrontierNodes as floor(maxIterations/2), a value below the depth-1 seed the same function admits: the shipped configs give 5 (research, maxIterations 10) and 3 (review, maxIterations 7), while ROOT_CHILDREN_FLOOR/maxRootChildren on line 247 admit 6 and 8. The seed is exempt from the run cap only while `seeding` is true, and every seed still counts in countLiveNodes (line 149, w... [handed off]
  - Disposition: Owner: the coordinator; the cap design is under operator review and the code may change. runtime/scripts/frontier-admit.cjs:239 derives maxFrontierNodes as max(1, floor(maxIterations/2)), the seed is exempt only while seeding (:357-358) and still counts as live (countLiveNodes :149), so a seed that fills the cap leaves no depth-2 slot. The interim doc note landed in 7799a67f677; its wording is hel...
  - Evidence: `node ${TMPDIR:-/tmp}/local-skilled-alignment-scratch/skilled-alignment-run-6/A/probe-cap.cjs (seeds the shipped config, then admits one depth-2 child)` exit 0: ...oor=6 seeded=6 depth2=[{"nodeId":"F-2-007","reason":"fanout"}] review: maxIterations=7 maxFrontierNodes=3 seedFloor=8 seeded=8 depth2=[{"nodeId":"F-2-009","reason":"fanout"}] detail: maxFrontierNodes derives as floor(maxIterations/2); the seed is exempt from it but still counts toward countLiveNodes
- **A2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:200`: readNodeStore turns a read failure into an empty store: `catch { return nodes; }` has no comment and no log, unlike the sibling JSONL reader in upsert.cjs which throws for a required source. Case: frontier-nodes.jsonl at mode 0200 (read denied, append permitted). readNodeStore returns size 0, seedNodes sees no depth-1 row and treats the run as never seeded, and re-issues F-1-001; the store's last-...
  - Evidence: `node ${TMPDIR:-/tmp}/local-skilled-alignment-scratch/skilled-alignment-run-6/A/probe-store2.cjs` exit 0: first seed admitted: ["F-1-001","F-1-002"] store size after close: 2 readNodeStore with mode 0200 returns size: 0 re-seed: {"admitted":["F-1-001"],"pruned":[]} F-1-001 row after re-seed: {"question":"gamma question","status":"open"}
- **A3** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:329`: A proposal that carries evidence and scope but no `question` is pruned with reason 'dedupe': dedupeKey returns '' for a non-string, and checkProposal returns 'dedupe' for an empty key before any field-presence check. The module header (lines 16-18) and the DR-070 operator contract say the first failing check names the reason and that a pruned row lets an operator tell which bound it hit. Case: a l...
  - Evidence: `node ${TMPDIR:-/tmp}/local-skilled-alignment-scratch/skilled-alignment-run-6/A/probe-admit.cjs` exit 0: noQuestion: {"admitted":[],"pruned":[{"nodeId":"F-2-002","reason":"dedupe"}]} dedupeKey("We 2: how does the loop stop") === "how does the loop stop" dedupeKey("how does the loop stop") === "how does the loop stop"
- **A4** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:188`: The id-prefix strip `^[a-z]{1,2}[-\s]?\d+(?:[-\s]\d+)*\s*:\s*` also removes an ordinary 1-2 letter word followed by a number and a colon, which the comment on lines 183-185 says stays part of the question ('an ordinary word followed by a number and a colon is part of the question'). Case: a question that begins with such a word, such as 'We 2: how does the loop stop' - its key collapses to the key... [handed off]
  - Disposition: Owner: phase 010 research frontier mode (frontier-admit.cjs). The id-prefix strip at runtime/scripts/frontier-admit.cjs:188 also drops a 1-2 letter word plus number plus colon, against its own comment at :183-185. The right fix narrows the regex to the id shapes leaves actually write, and no test or doc pins that set, so the shape list is the owner's call, not a doc fix.
  - Evidence: `node ${TMPDIR:-/tmp}/local-skilled-alignment-scratch/skilled-alignment-run-6/A/probe-admit.cjs` exit 0: dedupeKey("We 2: how does the loop stop") === "how does the loop stop" dedupeKey("how does the loop stop") === "how does the loop stop"
- **A5** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:197`: The comment block on lines 197-202 describes the finding-to-evidence derivation (each finding with a path:line ref becomes a FINDING node plus an EVIDENCE_FOR edge to the FILE node) but sits above readJsonlRows, a generic JSONL reader; the function it describes, deriveReviewFindingEvidence on line 252, carries no comment of its own. A maintainer reading readJsonlRows is told it derives review evid...
  - Evidence: `grep -n -B6 "^function readJsonlRows" .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` exit 0: ...200-// leaf that sends no graph events would otherwise leave it at zero, so the graph 201-// could never allow a stop. The delta's finding rows carry the ref the leaf 202-// contract requires; the state record's findingDetails may leave it out. 203:function readJsonlRows(filePath, label, required) {

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-01** P1 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md:54`: The Expected block pins vitest summary counts that the committed suite no longer produces, so the stated Pass rule ("Commands 1 and 2 exit 0 with the expected counts", line 65) can never be met and a healthy run reports FAIL. Both counts are stale: command 1 and command 2. The scenario is pinned to the suite size the change superseded. Cause: this doc landed at 0c6b0c6a900 and stop-decision.vitest...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision.vitest -t "frontierOpen veto" --reporter=verbose` exit 0: Tests 28 passed | 85 skipped (113) [doc claims: Tests 28 passed | 64 skipped (92)]. Second command `npx vitest run stop-decision.vitest -t "echoes the input unchanged" --reporter=verbose` -> `Tests 1 passed | 112 skipped (113)` [doc claims: Tests 1 passed | 91 skipped (92)]
- **B-02** P1 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:54`: Both pinned vitest counts in the Expected block are stale, so the count-dependent Pass rule at line 65 fails on a green suite. Command 2's summary and command 3's summary both need restating.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "seeds" --reporter=verbose` exit 0: Tests 4 passed | 46 skipped (50) [doc claims: Tests 4 passed | 30 skipped (34)]. Second command `npx vitest run frontier-admit.vitest -t "seedNodes" --reporter=verbose` -> `Tests 2 passed | 25 skipped (27)` [doc claims: Tests 2 passed | 22 skipped (24)]
- **B-03** P1 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:55`: All three pinned vitest counts in the Expected block are stale, and the same `Tests 1 passed | 23 skipped (24)` string is used for both command 3 and command 4. The Pass rule at line 66 requires "the expected pass count", so the scenario fails a green suite.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit.vitest -t "prunes with" --reporter=verbose` exit 0: Tests 7 passed | 20 skipped (27) [doc claims: Tests 7 passed | 17 skipped (24)]. Command 3 `-t "admits a valid proposal"` -> `Tests 1 passed | 26 skipped (27)`; command 4 `-t "records a pruned proposal"` -> `Tests 1 passed | 26 skipped (27)` [doc claims 1 passed | 23 skipped (24) for both]
- **B-04** P1 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md:54`: The same stale vitest count is printed for both command 1 and command 2. The suite total moved from 51 to 53, so the Expected signals disagree with the shipped tests.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-research-reduce-state.vitest -t "picks the shallowest open node" --reporter=verbose` exit 0: Tests 1 passed | 52 skipped (53) [doc claims: Tests 1 passed | 50 skipped (51)]. Command 2 `-t "counts a visit when the leaf rewords"` -> `Tests 1 passed | 52 skipped (53)` [same doc claim]
- **B-05** P1 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:56`: Commands 1 to 3 carry stale counts (fanout-run.vitest grew from 208 to 210 tests); command 4 is correct. The Pass rule at line 67 requires all four commands to exit 0 "with the expected counts", so three of the four legs cannot pass as written.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest -t "round-robin" --reporter=verbose` exit 0: ...ipped (208)]. Command 2 `-t "writes the lineage store before spawn"` -> `Tests 1 passed | 209 skipped (210)`; command 3 `-t "default depth mode"` -> `Tests 1 passed | 209 skipped (210)` [doc claims 1 passed | 207 skipped (208) for both]. Command 4 verified correct: `Tests 4 passed | 86 skipped (90)`
- **B-06** P1 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:54`: Both pinned vitest counts are stale and the workflow line number is off by one, so three of the scenario's stated expected signals are wrong. Line numbers and suite totals are pinned to the tree the scenario was authored against, not to the shipped one.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit-review.vitest -t "seeds a review run" --reporter=verbose` exit 0: ...awns|seeds the single-executor review frontier right after the config exists" --reporter=verbose` -> `Tests 2 passed | 48 skipped (50)` [doc claims: Tests 2 passed | 32 skipped (34)]. `rg -n "step_frontier_seed:" .skilled/commands/deep/assets/deep-review.yaml` -> 319 and 899 [doc claims 319 and 898]
- **B-07** P1 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:55`: Both pinned vitest counts are stale; frontier-admit-review.vitest grew from 23 to 25 tests. The Pass rule at line 68 requires commands 1 and 2 to exit 0 "with the expected counts".
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit-review.vitest -t "prunes with" --reporter=verbose` exit 0: Tests 7 passed | 18 skipped (25) [doc claims: Tests 7 passed | 16 skipped (23)]. Command 2 `-t "seeds a review run, settling a candidate"` -> `Tests 1 passed | 24 skipped (25)` [doc claims: Tests 1 passed | 22 skipped (23)]
- **B-08** P1 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:54`: Command 2's pinned count is stale (stop-decision-yaml-contract.vitest grew from 34 to 50 tests); command 1's count is correct. The Pass rule at line 65 requires both commands to exit 0 "with the expected counts", so command 2 can never satisfy it.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "gates the divergent pivot on a terminal review frontier" --reporter=verbose` exit 0: Tests 1 passed | 49 skipped (50) [doc claims: Tests 1 passed | 33 skipped (34)]. Command 1 verified correct: `Tests 3 passed | 23 skipped (26)`
- **B-09** P1 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md:54`: Command 2's pinned count is stale; command 1's is correct. The Pass rule at line 65 requires both commands to exit 0 "with the expected counts", so the scenario fails a green suite as written.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "takes the next dimension from the active frontier node" --reporter=verbose` exit 0: Tests 1 passed | 49 skipped (50) [doc claims: Tests 1 passed | 33 skipped (34)]. Command 1 verified correct: `Tests 3 passed | 29 skipped (32)`
- **B-10** P1 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:55`: Command 1's pinned count is stale (fanout-run.vitest grew from 208 to 210 tests); command 2's count is correct. The Pass rule at line 66 requires both commands to exit 0 "with the expected counts".
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-run.vitest -t "deals seven review frontier nodes|writes a review lineage store without an inbox|binds a review frontier scope|adds ...` exit 0: Tests 4 passed | 206 skipped (210) [doc claims: Tests 4 passed | 204 skipped (208)]. Command 2 verified correct: `Tests 5 passed | 85 skipped (90)`
- **B-11** P1 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md:53`: The single pinned vitest count is stale; stop-decision.vitest grew from 92 to 113 tests. The expected signals, and therefore the scenario's verdict, no longer match the shipped suite.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision.vitest -t "expansive review candidate|vetoes a composite review stop while the frontier is open" --reporter=verbose` exit 0: Tests 9 passed | 104 skipped (113) [doc claims: Tests 9 passed | 83 skipped (92)]
- **B-12** P2 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:383`: The root summary's Prompt field disagrees with the scenario contract it summarizes (iteration-execution-and-state-discipline/graph-events-review.md:32), which the standard forbids: "Do not ship unsynchronized prompt fields." The two copies state different requests, so an operator cannot tell which is canonical. Pre-existing content, not introduced by this change, but it is inside a root playbook t...
  - Evidence: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` exit 0: ...oop/deep-review tier=FAIL_CLOSED scenarios=69 categories=10 operator=69 routing_gold_excluded=0 violations=0 warnings=3 WARN PROMPT_UNSYNCED manual-testing-playbook.md:383 iteration-execution-and-state-discipline/graph-events-review.md:32 scenario contract prompt differs from the root summary prompt
- **B-13** P2 judgment `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:9`: This root playbook carries the EXECUTION POLICY block but not the results-storage contract the standard requires in section 4, and it has no `benchmark/reports/` home for a run. The hub root (line 9) and the runtime packet root (line 9) both carry the `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` block, so the two packet corpora this change extended have nowhere to record the PASS/FAIL/SKIP outcom... [rebutted]
  - Disposition: The result-persistence marker is advisory, not required: sk-doc/sk-create-manual-testing-playbook/SKILL.md:447-448 says missing it 'never creates a new fail-closed violation for an existing package', and validate-playbook-package.cjs:751-756 emits it as a warning. The research root lacked it at base 21c4b325b5a (git show 21c4b325b5a:... | grep -c MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT printed...
  - Evidence: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` exit 0: ...warnings=2 WARN RESULT_PERSISTENCE_MARKER_MISSING manual-testing-playbook.md root playbook is missing the advisory MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT completion marker (grep -c MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT: hub root 1, runtime root 1, deep-research root 0, deep-review root 0)
- **B-14** P2 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:9`: Same gap as B-13 on the review root playbook: the EXECUTION POLICY block is present but the section 4 results-storage contract and its `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` marker are absent, so the 69 scenarios this playbook indexes have no documented destination for their outcomes. [rebutted]
  - Disposition: Same as B-13 for the review root: the marker is advisory per sk-create-manual-testing-playbook/SKILL.md:447-448 and validate-playbook-package.cjs:751-756 (warning, not violation), and the package validator exits 0 with PASS for system-deep-loop/deep-review.
  - Evidence: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` exit 0: ...e=system-deep-loop/deep-review tier=FAIL_CLOSED scenarios=69 categories=10 operator=69 routing_gold_excluded=0 violations=0 warnings=3 WARN RESULT_PERSISTENCE_MARKER_MISSING manual-testing-playbook.md root playbook is missing the advisory MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT completion marker

### S6 Changelogs updated or created

- **C-01** P2 literal `.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md:22`: The glance bullet tells the reader that research accepts `--claude-config-dir`, but that flag is internal to `dispatch-iteration.cjs` and is rendered by the workflow only when `config.executor.configDir` is set. The operator-facing surface is `--config-dir=PATH` on the `--executor` group (`.skilled/commands/deep/assets/deep-research-presentation.txt`:120), and `/deep:research`'s published flag tab...
  - Evidence: `grep -c "claude-config-dir" .skilled/commands/deep/research.md` exit 1: 0

### S7 Skill routing is right

- **D-1** P2 judgment `.skilled/skills/system-deep-loop/hub-router.json:37`: The review class is the only owner of the convergence phrase `findings stop changing`, so a research-framed request that uses it resolves to the review loop in one silent step, with no clarify and no ambiguity flag; the same prompt without that clause defers. That breaks the hub's own policy that an unclear deep-loop intent asks (routerPolicy.defaultMode null, ambiguityDelta 1), and skill-hub-rout... [handed off]
  - Disposition: Owner: system-deep-loop hub routing (skill-hub-routing.md section 4). hub-router.json:37 review-aliases holds 'findings stop changing' with no research counterpart, and ROUTER.md section 3 REVIEW INTENT_SIGNALS must move with it. A JSON routing-vocabulary change with an out-of-domain replay, not a doc fix; the lane notes it predates this change.
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "Research the vendoring strategy for three competing HTTP clients over several passes until the findings stop changing"` exit 0: {"hubId":"system-deep-loop","action":"route","selectionKind":"single","targets":[{"packetId":"deep-review","workflowMode":"review"}]} ; control, same prompt minus the clause: {"action":"defer","selectionKind":null,"targets":[]}
- **D-3** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:30`: The Keyword triggers list advertises activation the router cannot deliver, and the hub SKILL.md section 2 says this list is checked against vocabularyClasses while nothing enforces it. `comprehensive research` returns no recommendation at all; `multi-round research` and `autonomous research` put cli-external-orchestration top-1 (0.142 and 0.118); `deep investigation` returns no recommendation. Onl... [handed off]
  - Disposition: Owner: system-deep-loop hub routing. deep-research/SKILL.md:30 keyword triggers predate this program (unchanged since 21c4b325b5a) and several do not route. The fix is either new research-aliases in hub-router.json:33 or pruning the list to what the hub scores, followed by the section 4 replay; that choice belongs to the routing owner.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Do comprehensive research on the cache invalidation strategy" --format json` exit 0: {"recommendations":[],"ambiguous":false} ; "Run multi-round research on the cache invalidation strategy" -> cli-external-orchestration 0.14208 ambiguous true ; "Start autoresearch on the auth token refresh design" -> sk-design 0.410889, system-deep-loop second, ambiguous true

### S8 Skill integrated in system-skill-advisor

- **D-2** P2 judgment `.skilled/skills/system-deep-loop/hub-router.json:32`: The new expansive-depth feature contributes no routing vocabulary at any stage: `expansive`, `frontier`, `sub-target` and `depth mode` occur zero times in SKILL.md's keyword line, description.json's keywords, hub-router.json's vocabularyClasses, mode-registry.json's aliases, ROUTER.md's INTENT_SIGNALS and graph-metadata.json's intent_signals. A probe written from the feature's own documented wordi... [handed off]
  - Disposition: Owner: system-deep-loop hub routing with system-skill-advisor. No stage-one or stage-two vocabulary for expansive depth, frontier or sub-target: hub-router.json:32 vocabularyClasses, mode-registry.json aliases and graph-metadata.json intent_signals need a dual write and a replay per skill-hub-routing.md section 4. JSON routing metadata, not a doc defect.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Turn on expansive depth for the next review run" --format json` exit 0: ...":false,"action":"route","targets":["sk-code-review"]} ; "Run an expansive depth loop over the payment module" -> sk-doc 0.08, ambiguous false ; grep -ric 'expansive|frontier|sub-target|depth mode' returns 0 for graph-metadata.json, hub-router.json, description.json, ROUTER.md and mode-registry.json

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Same cause as D-4. The S9-command-references row fails only on speckit-resume.yaml:104, a gitignored runtime path (.gitignore:431). Owner: validate-command-references.cjs:136, which needs a runtime-state exemption. Predates this program.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **D-4** P2 judgment `.skilled/commands/speckit/assets/speckit-resume.yaml:104`: Confirmed cause of the failed S9-command-references row, and it is not a defect in any /deep:* command file. The validator requires every literal repo-relative token to exist on disk, and this line names `.skilled/skills/system-spec-kit/runtime/database/access-telemetry.json`. That directory is gitignored (.gitignore:431) and is created at runtime: shared/config.ts derives TELEMETRY_STORE_DIR as `... [handed off] [S9, D]
  - Disposition: Owner: commands/scripts/validate-command-references.cjs (:136 flags every missing skill-asset path). speckit-resume.yaml:104 names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file (.gitignore:431) the YAML falls back from when absent, so the YAML is right and the checker needs a runtime-state exemption. Outside this change's scope and predates it.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-deep-loop/research | system-deep-loop/review | fail |
| P02 | system-deep-loop/research | system-deep-loop/research | pass |
| P03 | system-deep-loop/research | system-deep-loop/research | pass |
| P04 | system-deep-loop/research | sk-design | fail |
| P05 | system-deep-loop/review | system-deep-loop/review | pass |
| P06 | system-deep-loop/review | system-deep-loop/review | pass |
| P07 | system-deep-loop/research | system-deep-loop/research | pass |
| P08 | system-deep-loop | system-deep-loop | pass |
| P09 | sk-code | sk-code/sk-code-review | pass |

## Probes awaiting the critic

- P01: Research the vendoring strategy for three competing HTTP clients over several passes until the findings stop changing; expected system-deep-loop; actual skill system-deep-loop
- P04: Start autoresearch on the auth token refresh design and keep a frontier of follow-up questions; expected system-deep-loop; actual skill sk-design

## Files no lane reviewed

No critic output in this run, so coverage was not checked.

