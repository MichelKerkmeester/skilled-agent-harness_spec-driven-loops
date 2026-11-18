# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `7799a67f677576d07a9f1082fb3db8d9b6efbaa4`, 32 first-parent commits
- Files: 609, of which 149 uncommitted or untracked
- Owners: 15
- Findings: 19 (P0 0, P1 7, P2 12), 6 literal, 1 inferred, 2 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 8 (11 handed off, 0 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 15 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 88 | 7 |
| S3 | Feature catalog entries | yes | 103 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 103 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 116 | 3 |
| S6 | Changelogs updated or created | yes | 113 | 1 |
| S7 | Skill routing is right | yes | 7 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 7 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 19 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 15 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 55 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 154, fail 1, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1147 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 528 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 726 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 234 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 253 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 40 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 37 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 39 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 5362 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 34 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 5336 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 91 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 273 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 186 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 186 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 198 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 184 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 198 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 198 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 187 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 191 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 187 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 182 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 205 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 512 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 200 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1190 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 61 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 37 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 55274 |
| pass | P2 | no | `S5-derived-counts` | 0 | 140 |
| pass | P2 | no | `S5-readme-references` | 0 | 1699 |
| pass | P2 | no | `S6-release-coverage` | 0 | 47 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 35 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 332 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 33 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 2838 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 98 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 212 |
| pass | P2 | no | `S8-advisor-status` | 0 | 123 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 42 |
| fail | P2 | no | `S9-command-references` | 1 | 59 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 386 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 35 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 304 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 44 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 41 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 40 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 35 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 60 |
| pass | P2 | no | `S13-env-tokens` | 0 | 128 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 1843 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1650 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1427 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1463 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1421 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1496 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1469 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1488 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1442 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1681 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1684 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1544 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1547 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1502 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 108 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 51 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 5913 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1088 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 46 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 47 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 33 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 42 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1650 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 537 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 33 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 187 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 48 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1648 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3393 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 289 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1529 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 448 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 122 |

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

- **A-1** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:386`: Case: a review run reuses a finding id for a different finding in a later iteration. Iteration 1 stores F1 (src/a.cjs, 'Leak in a'); iteration 2 stores F1 (src/b.cjs, 'Race in b'), which deriveReviewFindingEvidence places at finding:F1#2; iteration 3 reports F1 (src/c.cjs, 'Null deref in c') and the leaf sends {id:'F1',kind:'FINDING'} plus a RESOLVES edge from fix-3. The leaf's node folds onto fin... [handed off]
  - Disposition: Owner: phase 011 review frontier mode (review evidence edges, 7c6a2d9a7e5). runtime/scripts/upsert.cjs:386 folds a leaf-sent FINDING node onto finding:<id> even when deriveReviewFindingEvidence placed a reused id at finding:<id>#<iteration>, so a later RESOLVES edge can target the wrong finding. Fixing it means deciding how leaf graph events address a re-keyed finding, a design choice in the evide...
  - Evidence: `DEEP_LOOP_COVERAGE_DB_DIR=$SCRATCH/db node .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs --spec-folder specs/repro --loop-type review --session-id sess-repro --nodes '[{"id":"F1","kind":...` exit 0: ...nted: 'finding:F1 | Null deref in c | undefined' (iteration 1's node rewritten, metadata gone), 'finding:F1#2 | Race in b | {"finding_id":"F1","file":"src/b.cjs","line":9}', 'finding:F1#3 | Null deref in c | {"finding_id":"F1","file":"src/c.cjs","line":9}', and edge 'resolves-3 fix-3 -> finding:F1'.
- **A-2** P1 judgment `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2535`: Case: cap 10, F-1-001 (depth 1) open with 4 visits, F-2-002 (depth 2) open with 4 visits. The first reduce leaves depth 1 open, so carry is 0 and depth 2's allotted share is 3.5 < 4 spent, which closes F-2-002 as exhausted/reason budget. An iteration later answers F-1-001's question, so it reaches applyFrontierBudget through answeredNodeIds, the depth-1 band then has no open node, carry becomes 5-... [handed off]
  - Disposition: Owner: the coordinator, with the expansive-budget change in progress. deep-research/scripts/reduce-state.cjs:2535 carries an unspent band share forward only once a band holds no open node, so a node closed exhausted/budget can reopen when an earlier band later empties. The budget work being built now changes this projection.
  - Evidence: `node $SCRATCH/budget-flip.cjs # requires the exported applyFrontierBudget and calls it twice over one store: applyFrontierBudget(nodes, records, 10) then applyFrontierBudget(nodes, records, 10, undefi...` exit 0: ...hausted(budget)"] budget {"depth1":{"allotted":5,"spent":4},"depth2":{"allotted":3.5,"spent":4},"depth3":{"allotted":1.5,"spent":0}} / after answer : ["F-1-001:answered","F-2-002:open"] budget {"depth1":{"allotted":5,"spent":4},"depth2":{"allotted":4.5,"spent":4},"depth3":{"allotted":1.5,"spent":0}}
- **A-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:330`: Case: an iteration delta carries a frontier_proposal whose parentId names a node the store already marked pruned (the leaf's focus lags one step behind the close step, or a resubmitted proposal row names it). checkProposal's relevance check only rejects a parentId that is absent from the store, and readNodeStore keeps pruned rows, so the proposal is admitted as an open child of a rejected branch. ...
  - Evidence: `node $SCRATCH/pruned-parent.cjs # checkProposal({parentId:'F-1-001',question:'A child of the rejected branch',scope:['a'],evidence:'leaf evidence'}, Map{[F-1-001 => status 'pruned']}, caps, [])` exit 0: checkProposal => null (null is the admitted result; the six checks accepted a child of the pruned node)
- **A-4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2684`: Case: a frontier node seeded at iteration 0 (frontier-admit seed always writes iteration 0) is closed by applyFrontierBudget's band sweep at iteration 9. The question has no resolution record and no stored close row, because the budget close exists only in the projection, so resolvedAtIteration takes frontierClose.iteration, which is the store row's iteration (0 for a seed, the admission iteration... (inferred) [handed off]
  - Disposition: Owner: phase 010 research frontier mode. deep-research/scripts/reduce-state.cjs:2684 takes resolvedAtIteration from the store row's iteration (0 for a seed) when the close is a projection-only budget close. The lane notes no consumer reads resolvedAtIteration today; which iteration a projected close records is the owner's call.

### S2 Skill docs match sk-create-skill

- **B-S2-01** P2 literal `.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:125`: The release note says a Next Focus tie goes to a node with no covering finding. The reducer's tie-break after depth is the fewest visits (reduce-state.cjs:2493), and the skill and loop protocol both say 'least visited' (SKILL.md:95, loop-protocol.md:417). The note describes behavior the shipped code does not have.
  - Evidence: `rg -n "Ties go to a node with no covering finding|left.visits - right.visits" .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md .skilled/skills/system-deep-loop/deep-research/scrip...` exit 0: .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:125:- Ties go to a node with no covering finding. .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2493: || (left.visits - right.visits)

### S3 Feature catalog entries

- **B-S3-01** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16`: The current-state entry says 'One live review pilot ran' and records only the first pilot's failure (six depth-1 nodes, cap 6 pruned the seventh, three of six lineages on maxIterationsReached). The branch holds a second live review pilot: pilot-run-2.md at cee8682a6c9 seeded eight nodes, closed them 0 open/0 active and passed the merge guard, and 011 goal.md records it as the AC-011 amended-and-me...
  - Evidence: `ls specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/scratch; rg -n "Pilot run 2|AC-011 amended and met" specs/system-deep-loop/loop-arch...` exit 0: ...ng Q008. Pilot run 2 (scratch/pilot-run-2.md) at cee8682a6c9: 8 depth-1 nodes answered (7 subsystems + determinism), merged stats 22 total, 0 open, 0 active, merge guard passed, a lineage-local graph with EVIDENCE_FOR edges in all 6 lineages; pi-2 capped behind dimensionCoverageGate, pi-6 converged.
- **B-S3-02** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md:24`: The entry's do-not-pivot list omits maxDurationReached, which the review workflow's eligibility contract excludes (deep-review.yaml:1375), and the entry never mentions the new terminal-frontier gate (deep-review.yaml:1377). A reader would take a maxDurationReached stop and an open frontier as pivot-eligible, which the workflow refuses. The research twin omits the same frontier gate (B-S3-03).
  - Evidence: `rg -n "excluded_reasons|frontier_gate" .skilled/commands/deep/assets/deep-review.yaml | head -4` exit 0: 1375: excluded_reasons: [maxIterationsReached, blockedStop, stuckRecovery, error, manualStop, userPaused, maxDurationReached] 1377: frontier_gate: "Under depth_mode == 'expansive' the pivot is eligible only once registry.frontier holds no open or active node. ..."
- **B-S3-03** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md:22`: The entry lists the excluded stop reasons correctly but never mentions the terminal-frontier gate the research workflow now applies under --depth-mode=expansive: the pivot is eligible only once registry.frontier holds no open or active node (deep-research.yaml:1272). The feature's catalog entry therefore does not describe a changed behavior; the gate lives only in the workflow and the convergence ...
  - Evidence: `rg -n "frontier_gate" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 1272: frontier_gate: "Under depth_mode == 'expansive' the pivot is eligible only once registry.frontier holds no open or active node. ..."
- **B-S3-04** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:40`: The entry's Fan-Out section stops at the merged frontier and the partition guard. The same change keeps each review lineage's coverage graph local by exporting DEEP_LOOP_COVERAGE_DB_DIR to {lineage}/graph-db; deep-review/SKILL.md:244 documents it and fanout-run.cjs:4049 implements it, but a search of the system-deep-loop feature catalogs returns no hit, so no catalog entry records the behavior.
  - Evidence: `rg -n "DEEP_LOOP_COVERAGE_DB_DIR" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs .skilled/skills/system-deep-loop/deep-review/SKILL.md .skilled/skills/system-deep-loop/deep-review/fea...` exit 0: ...he runner exports `DEEP_LOOP_COVERAGE_DB_DIR` to it, so the graph steps stay inside the lineage write surface and the hotspot saturation gate has a graph to read. .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4049: DEEP_LOOP_COVERAGE_DB_DIR: path.join(promptLineageDir, 'graph-db'),

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-S4-01** P1 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:57`: DR-070's Expected block says command 1 prints 14 lines, but that command returns 15 matches. An operator running the scenario exactly as written sees an evidence count the scenario contract contradicts, so the expected signal is not deterministic. All six reason strings are present; only the count is stale.
  - Evidence: `rg -n "return '(relevance|dedupe|depth|fanout|budget|cycle)'" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs | wc -l` exit 0: 15

### S5 READMEs match sk-create-readme, root included

- **C-01** P1 literal `README.md:255`: The new deep-loop paragraph puts a semicolon in the sentence that introduces custom review dimensions. sk-create-readme section 8 lists 'No semicolons. Split the sentence or use "and".' under HUMAN VOICE RULES, and section 7 lists 'HVR passes' as a pre-publish check. The hvr_scan hard-blocker count for the file was 0 on main and is 1 here, so this scope introduced the violation. Column 556.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py README.md; git -c core.fsmonitor=false show main:README.md > /tmp/main-readme-lane-c.md && python3 .skilled/skills/sk-doc/...` exit 0: HEAD: x1 first@255 hard punctuation ; / hard blockers: 1 baseline: hard blockers: 0
- **C-02** P1 literal `.skilled/skills/system-deep-loop/deep-research/README.md:127`: The new '--depth-mode=expansive' paragraph joins two independent clauses with a semicolon. Same rule as C-01 (sk-create-readme section 8 semicolon ban, section 7 'HVR passes'). Column 968, in the sentence that tells the reader to raise --max-iterations. The file had 0 hard blockers on main and has 1 here. [handed off]
  - Disposition: Owner: the coordinator. This flags the interim cap note from 7799a67f677. The operator approved a code change to expansive budgets, built by another agent in this worktree, whose commits replace this wording (coordinator ruling, 2026-11-18). The text is held, not rewritten here. The semicolon sits inside that held sentence.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/system-deep-loop/deep-research/README.md` exit 0: x1 first@127 hard punctuation ; hard blockers: 1 (baseline main version of the same file: hard blockers: 0)
- **C-03** P1 literal `.skilled/skills/system-deep-loop/deep-review/README.md:158`: The new '--depth-mode=expansive' paragraph carries the same semicolon join. Same rule as C-01 and C-02. Column 1361. The file had 0 hard blockers on main and has 1 here. [handed off]
  - Disposition: Owner: the coordinator. This flags the interim cap note from 7799a67f677. The operator approved a code change to expansive budgets, built by another agent in this worktree, whose commits replace this wording (coordinator ruling, 2026-11-18). The text is held, not rewritten here. The semicolon sits inside that held sentence.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/system-deep-loop/deep-review/README.md` exit 0: x1 first@158 hard punctuation ; hard blockers: 1 (baseline main version of the same file: hard blockers: 0)

### S7 Skill routing is right

- **D-1** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:30`: The packet's Keyword triggers list advertises activation the hub cannot route. Four of the eight terms (autonomous research, multi-round research, deep investigation, comprehensive research) are absent from hub-router.json research-aliases; iterative research is absent too, though another scoring lane catches it. The packet's own ROUTER.md LOOP_SETUP carries autonomous research, so stage two adver... [handed off]
  - Disposition: Owner: system-deep-loop hub routing. deep-research/SKILL.md:30 keyword triggers predate this program (unchanged since 21c4b325b5a) and several do not route. The fix is new research-aliases in hub-router.json:33 or pruning the list to what the hub scores, then the skill-hub-routing.md section 4 replay; that choice belongs to the routing owner.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Do comprehensive research on the caching layer"}' --format json --timeout-ms 5000 | python3 -c "import json,sys; d=json.load(sy...` exit 0: [] False

### S8 Skill integrated in system-skill-advisor

- **D-3** P2 judgment `.skilled/skills/system-deep-loop/hub-router.json:37`: Two review aliases are broad enough to steal other skills' prompts. 'findings stop changing' gives system-deep-loop the top-1 at score 0.549, confidence 0.82, against sk-code 0.097 and mcp-tooling 0.080, with ambiguous=false, for 'The findings stop changing after refactor, fix the linter'; the hub cannot serve a linter repair and nothing asks for clarification. 'review request' gives the hub the t... [handed off]
  - Disposition: Owner: system-deep-loop hub routing. hub-router.json:37 review-aliases 'findings stop changing' and 'review request' catch prompts the hub cannot serve, and ROUTER.md section 3 REVIEW INTENT_SIGNALS must move with them. A JSON routing-vocabulary change with an out-of-domain replay per skill-hub-routing.md section 4; both aliases predate this program.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"The findings stop changing after refactor, fix the linter"}' --format json --timeout-ms 5000 | python3 -c "import json,sys; d=j...` exit 0: [('system-deep-loop', 0.548914, 0.82), ('sk-code', 0.096562, 0.82), ('mcp-tooling', 0.08, 0.82)] False
- **D-4** P2 judgment `.skilled/skills/system-deep-loop/hub-router.json:33`: The new expansive-depth feature contributes no stage-one vocabulary. 'expansive', 'frontier', 'depth mode' and 'sub-target' are absent from research-aliases, mode-registry aliases, the hub ROUTER.md RESEARCH intent and graph-metadata intent_signals. A probe from the feature's own wording, 'Use expansive depth mode to research the migration options', returns zero recommendations (ambiguous false); ... [handed off]
  - Disposition: Owner: system-deep-loop hub routing with system-skill-advisor. No stage-one or stage-two vocabulary for expansive depth, frontier or sub-target: hub-router.json:33 research-aliases, mode-registry.json aliases and graph-metadata.json intent_signals need a dual write and a replay per skill-hub-routing.md section 4. JSON routing metadata, not a doc defect.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Use expansive depth mode to research the migration options"}' --format json --timeout-ms 5000 | python3 -c "import json,sys; d=...` exit 0: [] False

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Same cause as D-5. Owner: commands/scripts/validate-command-references.cjs (:134-136), a file this program did not change. speckit-resume.yaml:104 names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file (.gitignore:431) the YAML falls back from, so the YAML is right and the checker needs a runtime-state exemption. Predates this program.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **D-2** P1 judgment `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs:169`: The triggers leg cannot see a bullet-list Keyword triggers block. triggerItems() scans only lines containing the literal 'Keyword triggers:' prefix, so the eight backticked items on the following lines of deep-research/SKILL.md are never compared with hub-router.json. The gate therefore prints triggers=0 and RESULT: PASSED while five advertised terms (autonomous research, iterative research, multi... [handed off] [S7, D]
  - Disposition: Owner: sk-doc/sk-create-skill (ci-hub-vocabulary-source.cjs:169), a file this program did not change. triggerItems() reads only lines that carry 'Keyword triggers:', so a bullet-list block below it is never compared with hub-router.json and the gate prints triggers=0. A CI checker fix for its owner.
  - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs --hub system-deep-loop` exit 0: OK system-deep-loop alias=0 stage-two=0 triggers=0 packets=0 stage-two-reverse=0 checked=1 hub(s), drift=0 RESULT: PASSED
- **D-5** P2 literal `.skilled/commands/scripts/validate-command-references.cjs:134`: The S9-command-references row fails on a runtime-state path the validator should exempt, not on a command defect. .skilled/commands/speckit/assets/speckit-resume.yaml:104 names .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json as a pointer it explicitly falls back from when missing. That directory is gitignored (.gitignore:431) and created at runtime, but the validator exempts... [handed off] [S9, D]
  - Disposition: Owner: commands/scripts/validate-command-references.cjs (:134-136), a file this program did not change. speckit-resume.yaml:104 names system-spec-kit/runtime/database/access-telemetry.json, a gitignored runtime file (.gitignore:431) the YAML falls back from, so the YAML is right and the checker needs a runtime-state exemption. Predates this program.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-deep-loop/research | sk-code | fail |
| P02 | system-deep-loop/review | system-deep-loop/review | pass |
| P03 | system-deep-loop/research | sk-code | fail |
| P04 | system-deep-loop/review | sk-code/sk-code-review | fail |
| P05 | system-deep-loop/research | system-deep-loop | fail |
| P06 | system-deep-loop/review | sk-code/sk-code-review | fail |
| P07 | sk-code | sk-code | pass |
| P08 | sk-doc | sk-doc/sk-create-readme | pass |
| P09 | sk-git | sk-git | pass |
| P10 | system-deep-loop/research | - | fail |
| P11 | system-deep-loop/research | system-deep-loop/research | pass |

## Probes awaiting the critic

- P01: Research the trade-offs of event sourcing versus CRUD for our audit log, deeply and with citations; expected system-deep-loop; actual skill sk-code
- P03: Run a multi-iteration investigation into why our CI builds doubled in duration; expected system-deep-loop; actual skill sk-code
- P04: Exhaustively review this pull request for correctness and edge cases before we merge; expected system-deep-loop; actual skill sk-code
- P05: Iteratively research the best migration path from our monolith to modules and cite the sources; expected system-deep-loop; actual skill system-deep-loop
- P06: Adversarially review the new retry logic against the spec and report every finding; expected system-deep-loop; actual skill sk-code
- P10: Use expansive depth mode to research the migration options; expected system-deep-loop; actual skill -

## Files no lane reviewed

No critic output in this run, so coverage was not checked.

