# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `c10bb24f3e58dbd2fb01eb518d6e1d85da4caab7`, 64 first-parent commits
- Files: 1122, of which 0 uncommitted or untracked
- Owners: 15
- Findings: 17 (P0 0, P1 0, P2 17), 7 literal, 1 inferred, 0 outside the scope; 5 more overturned by the critic and not counted
- Open findings: 16 (1 handed off, 0 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 17 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 98 | 7 |
| S3 | Feature catalog entries | yes | 115 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 115 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 128 | 3 |
| S6 | Changelogs updated or created | yes | 125 | 1 |
| S7 | Skill routing is right | yes | 7 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 7 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 19 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 17 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 55 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 164, fail 1, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1027 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 488 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 649 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 227 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 223 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 32 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 33 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 31 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 4535 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 28 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 4519 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 85 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 183 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 166 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 166 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 159 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 174 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 173 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 171 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 172 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 176 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 171 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 178 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 170 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 166 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 172 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 159 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 170 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 170 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 179 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 172 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 166 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 169 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 159 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 158 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 158 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 159 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 158 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 157 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 155 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 173 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 171 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 158 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 176 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 170 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 168 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 169 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 158 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 410 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 171 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 158 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1035 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 49 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 36 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 46829 |
| pass | P2 | no | `S5-derived-counts` | 0 | 116 |
| pass | P2 | no | `S5-readme-references` | 0 | 1527 |
| pass | P2 | no | `S6-release-coverage` | 0 | 42 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 26 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 280 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 26 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 2439 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 88 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 201 |
| pass | P2 | no | `S8-advisor-status` | 0 | 173 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 38 |
| fail | P2 | no | `S9-command-references` | 1 | 54 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 348 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 31 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 251 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 39 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 33 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 34 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 31 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 31 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 51 |
| pass | P2 | no | `S13-env-tokens` | 0 | 108 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 1556 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1409 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1214 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1250 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1235 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1259 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1239 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1247 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1232 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1468 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1468 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1368 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1294 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1253 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 92 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 39 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 5083 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 948 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 39 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 40 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 28 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 38 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1399 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 466 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 29 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 162 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 37 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1509 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3413 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 248 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1270 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 386 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 104 |

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

- **A-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3834`: partitionFrontierNodes is called twice with identical arguments. budgetPartition (line 3749) is built from expandedLineages labels and frontierPartition (line 3834) from cliLineages labels, but cliLineages is allLineages, which expansiveLineageBudgets derives from expandedLineages without changing labels or order. When both are computed the second call re-reads frontier-nodes.jsonl and rebuilds th... (inferred)
- **A-2** P2 judgment `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:313`: The new frontier-unanswered seed embeds the node's scope path list into its focus text, and seedViolatesReadOnlyBoundary (line 174) then scans that focus for mutation verbs. A review target whose paths contain 'mutation', 'modify' or 'rewrite' therefore trips the read-only guard and the seed is silently dropped into boundaryRejections instead of becoming a pivot candidate. Every other seed source ...
  - Evidence: `node -e 'const fs=require("node:fs");const src=fs.readFileSync(".skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts","utf8");const block=src.slice(src.indexOf("function seed...` exit 0: "src/cache, src/scheduler" -> kept "src/mutation" -> DROPPED by /\bmutat(?:e|ion)\b/u "src/modify-record.ts" -> DROPPED by /\bmodify\b/u "src/rewrite-engine" -> DROPPED by /\brewrite\b/u
- **E-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:111`: hasScope accepts any non-empty array, while scopeEntries drops non-string and blank entries. A proposal with scope [" "], [123] or [null] therefore passes the relevance check at line 403. On a review run the review-target containment check then runs over an empty scope list and passes vacuously, so a node scoped nowhere is admitted, counted toward the frontier, and can never be answered by a findi...
  - Evidence: `node -e 'const {checkProposal}=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"); const caps={maxDepth:3,maxChildrenPerNode:6,maxRootChildren:8,maxFrontierNodes:10}; con...` exit 0: [" "] -> ADMITTED [123] -> ADMITTED [null] -> ADMITTED ["src/app.ts"] -> ADMITTED
- **E-4** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:278`: The expansiveBudget comment says the ceiling 'binds for a four-dimension review from two seeds on', but the function returns 24 at one seed: 2 x 4 x (1 + 3 - 1) = 24. The test at frontier-admit-review.vitest.ts:571 asserts 24 for one seed while its name repeats the same claim. B-08 reports the docs sentence and the test name; this is the code comment that seeded the wording, and it is the only pla...
  - Evidence: `node -e 'const {expansiveBudget}=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"); for (const s of [1,2]) console.log("S="+s+" -> "+expansiveBudget({target:"review",see...` exit 0: S=1 -> 24 S=2 -> 24

### S2 Skill docs match sk-create-skill

- **B-05** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:227`: The README states the playbook holds 71 deterministic scenarios; the shipped corpus holds 72. The root playbook itself says 72 and validate-playbook-package.cjs derives 72, so the README is the stale copy. This change raised the count from 54 to 71 but the corpus gained one more scenario than the README records.
  - Evidence: `grep -n '71 deterministic scenarios' .skilled/skills/system-deep-loop/deep-research/README.md; find .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook -mindepth 2 -name '*.md' ! -n...` exit 0: 227:`manual-testing-playbook/manual-testing-playbook.md` holds 71 deterministic scenarios across 9 categories. 72
- **B-06** P2 literal `.skilled/skills/system-deep-loop/deep-research/README.md:265`: The package-map row repeats the same stale count: 71 scenarios where the corpus holds 72. Same cause as B-05.
  - Evidence: `grep -n '71 scenarios' .skilled/skills/system-deep-loop/deep-research/README.md` exit 0: 265:| [`manual-testing-playbook/`](./manual-testing-playbook/) | 71 scenarios with expected signals and verdict rules |
- **B-07** P2 literal `.skilled/skills/system-deep-loop/deep-review/README.md:235`: The README states the playbook carries 69 deterministic scenarios; the shipped corpus carries 70. The root playbook says 70 and validate-playbook-package.cjs derives 70. This change raised the count from 56 to 69 but the corpus gained one more scenario than the README records.
  - Evidence: `grep -n '69 deterministic scenarios' .skilled/skills/system-deep-loop/deep-review/README.md; find .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook -mindepth 2 -name '*.md' ! -name ...` exit 0: 235:The skill ships a feature catalog and a manual testing playbook. ... The playbook carries 69 deterministic scenarios across ten categories. 70
- **B-08** P2 literal `.skilled/skills/system-deep-loop/deep-review/SKILL.md:238`: The derived-budget prose says 'With the four canonical dimensions the ceiling of 24 binds from two seeds on'. The shipped formula binds the ceiling at the first seed: expansiveBudget({target:'review',seeded:1,maxDepth:3,dimensions:4,loopDefault:7}) returns 24, because 2 x 4 x (1 + 3 - 1) = 24. The same sentence is repeated in four more shipped docs, so an operator sizing a one-seed review reads a ...
  - Evidence: `node -e 'const {expansiveBudget}=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"); for (const s of [1,2,3]) console.log("review S="+s+" -> "+expansiveBudget({target:"re...` exit 0: review S=1 -> 24 review S=2 -> 24 review S=3 -> 24

### S3 Feature catalog entries

- **B-01** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:487`: The 'Expansive depth mode' root entry freezes a pilot-run measurement and a criterion-amendment history into current-state catalog prose: 'Two live research pilots ran on one topic, and both failed the criterion that a stop candidate forms before the iteration cap ... The criterion was then amended to a frontier drain before the cap, which the second run met: its frontier showed 0 open nodes from ...
  - Evidence: `rg -n 'Two live research pilots' .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` exit 0: ...pic, and both failed the criterion that a stop candidate forms before the iteration cap: each run stopped on `maxIterationsReached`. The criterion was then amended to a frontier drain before the cap, which the second run met: its frontier showed 0 open nodes from the check before iteration 15 of 16.
- **B-02** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:16`: The leaf repeats the same frozen pilot measurement and criterion-amendment history in its OVERVIEW: 'Two live research pilots ran on one topic, and both failed the criterion ... The criterion was then amended to a frontier drain before the cap, which the second run met: its frontier showed 0 open nodes from the check before iteration 15 of 16.' Same rule as B-01: catalog prose must not freeze meas...
  - Evidence: `rg -n 'Two live research pilots' .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` exit 0: ...date forms before the iteration cap: each run stopped on `maxIterationsReached`. The criterion was then amended to a frontier drain before the cap, which the second run met: its frontier showed 0 open nodes from the check before iteration 15 of 16. This page describes the shipped code and its tests.
- **B-03** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:224`: The 'Expansive depth mode' root entry freezes a two-pilot measurement and a cap-change history into current-state prose: 'Two live review pilots ran. In the first the depth-1 budget check passed but the stop criterion failed: the root fan-out cap of 6, since raised to 8 for a review seed, pruned a seventh depth-1 node, and three of six lineages stopped on `maxIterationsReached`. The second, at `ma...
  - Evidence: `rg -n 'Two live review pilots' .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` exit 0: ...eventh depth-1 node, and three of six lineages stopped on `maxIterationsReached`. The second, at `maxIterations` 16, seeded eight depth-1 nodes and answered all eight, and the merged frontier ended with 0 open and 0 active nodes under a passing partition guard, which met the amended pilot criterion.
- **B-04** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16`: The leaf repeats the same frozen two-pilot measurement and cap-change history in its OVERVIEW. Same rule as B-03.
  - Evidence: `rg -n 'Two live review pilots' .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` exit 0: ...ed on `maxIterationsReached`. The second, at `maxIterations` 16, seeded eight depth-1 nodes and answered all eight, and the merged frontier ended with 0 open and 0 active nodes under a passing partition guard, which met the amended pilot criterion. This page describes the shipped code and its tests.
- **E-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:29`: The runtime catalog's script-entry-points group has no entry for frontier-admit.cjs, the new 938-line script with a CLI (seed, admit, close, graph, block) that deep-research.yaml and deep-review.yaml invoke directly. The group lists five entries (append-mode-event, convergence, query, status, upsert) and the table row names four scripts, none of them frontier-admit. The research and review catalog...
  - Evidence: `ls .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/; grep -rn 'frontier-admit' .skilled/skills/system-deep-loop/runtime/feature-catalog/` exit 0: append-mode-event-script.md convergence-script.md query-script.md status-script.md upsert-script.md fanout/fanout-run.md:104: ... expansiveBudget in frontier-admit.cjs. fanout/fanout-run.md:122: | scripts/frontier-admit.cjs | readNodeStore, expansiveBudget ... |
- **E-5** P2 judgment `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:28`: The prose says 'A node needs one iteration per dimension in its universe, the four canonical dimensions plus any custom name', but configuredReviewDimensionCount in frontier-admit.cjs counts only the configured reviewDimensions list. For reviewDimensions ["correctness","performance"] the code uses D=2 and derives 12 iterations, while the reducer's universe is five dimensions and the prose implies ...
  - Evidence: `mkdir -p /tmp/fa-custom && printf '%s\n' '{"maxIterations":7,"reviewDimensions":["correctness","performance"],"expansiveDepth":{"maxDepth":3}}' > /tmp/fa-custom/deep-review-config.json && printf '%s\n...` exit 0: {"derivedMaxIterations":12,"growthSlots":5}

### S4 Playbooks match sk-create-manual-testing-playbook

- **E-1** P2 literal `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:229`: The new Section 9 MODE PACKAGE INDEXES table states 71 deep-research scenarios and 69 deep-review scenarios. The package playbooks state 72 and 70, and the folders hold 72 and 70 scenario files. The scope added this table and copied the stale package-README counts, so the hub index now contradicts the package indexes it links to. Case: a reader planning release coverage from the hub playbook budge...
  - Evidence: `find .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook -mindepth 2 -name '*.md' ! -name 'README.md' | wc -l; find .skilled/skills/system-deep-loop/deep-review/manual-testing-playb...` exit 0: 72 70 229:| `deep-research` | 71 | 9 | ... 230:| `deep-review` | 69 | 10 | ...

### S7 Skill routing is right

- **D-3** P2 literal `.skilled/skills/system-deep-loop/deep-research/SKILL.md:94`: The new Expansive Depth Mode bullet names the inbox ("Admitted nodes land in `research/inbox.jsonl` with `origin: "frontier"`") but never names the node store `research/frontier-nodes.jsonl`, which `frontier-admit.cjs` writes and `reduce-state.cjs` reads via `readFrontierNodeStore(path.join(researchDir, 'frontier-nodes.jsonl'))`. The deep-review counterpart names its store (`review/frontier-nodes....
  - Evidence: `grep -c "frontier-nodes" .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md` exit 0: .skilled/skills/system-deep-loop/deep-research/SKILL.md:0 .skilled/skills/system-deep-loop/deep-review/SKILL.md:1

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Same cause as D-03. Owner: commands/scripts/validate-command-references.cjs:134, a file this program did not change; speckit-resume.yaml:104 names a gitignored runtime path (.gitignore:431).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **C-1** P1 literal `.skilled/skills/system-deep-loop/deep-research/README.md:227`: The README states the playbook holds 71 deterministic scenarios. The playbook it links to states 72, and the folder holds 72 scenario files across 9 categories. The scope raised this line from 54 to 71 and stopped one short, so the README now contradicts its own playbook index. Case: a reader planning release coverage from the README budgets for 71 scenarios and the playbook requires 72. [S5, C]
  - Evidence: `find .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook -name '*.md' ! -name 'README.md' ! -name 'manual-testing-playbook.md' | wc -l` exit 0: 72
  - Critic override: duplicate, lane severity P1. Same file, line and fix as B-05: deep-research/README.md:227 says 71 scenarios where the corpus holds 72.
- **C-2** P1 literal `.skilled/skills/system-deep-loop/deep-research/README.md:265`: The related-documents table repeats the same stale count, 71 scenarios, against 72 on disk. The scope edited this row in the same commit as line 227, so both carry the same off-by-one. Case: a reader scanning the file table takes 71 as the playbook size. [S5, C]
  - Evidence: `find .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook -name '*.md' ! -name 'README.md' ! -name 'manual-testing-playbook.md' | wc -l` exit 0: 72
  - Critic override: duplicate, lane severity P1. Same file, line and fix as B-06: deep-research/README.md:265 says 71 scenarios where the corpus holds 72.
- **C-3** P1 literal `.skilled/skills/system-deep-loop/deep-review/README.md:235`: The README states the playbook carries 69 deterministic scenarios across ten categories. The playbook states 70, and the folder holds 70 scenario files across 10 categories. The scope raised this line from 56 to 69 and stopped one short. Case: a reader planning release coverage from the README budgets for 69 scenarios and the playbook requires 70. [S5, C]
  - Evidence: `find .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook -name '*.md' ! -name 'README.md' ! -name 'manual-testing-playbook.md' | wc -l` exit 0: 70
  - Critic override: duplicate, lane severity P1. Same file, line and fix as B-07: deep-review/README.md:235 says 69 scenarios where the corpus holds 70.
- **D-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/SKILL.md:238`: The new Expansive Depth Mode bullet states "With the four canonical dimensions the ceiling of 24 binds from two seeds on", but the shipped `expansiveBudget` reaches 24 at one seed: 2 x 4 x (1 + 3 - 1) = 24. The stated threshold is off by one, so an operator sizing a wide review from this line under-estimates how quickly the budget saturates. The accompanying test at `runtime/tests/unit/frontier-ad... [S7, D]
  - Evidence: `node -e 'const {expansiveBudget}=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"); for (let S=0;S<=2;S++) console.log("S="+S+" -> "+expansiveBudget({target:"review",see...` exit 0: S=0 -> 7 S=1 -> 24 S=2 -> 24
  - Critic override: duplicate, lane severity P2. Same file and line as B-08's first location: deep-review/SKILL.md:238 says the ceiling binds from two seeds; expansiveBudget returns 24 at one seed.
- **D-2** P2 literal `.skilled/commands/deep/review.md:100`: The `--depth-mode` row of the Workflow Flag Surface repeats the same off-by-one threshold as D-1: "the ceiling of 24 binds from two seeds on". The command is the operator-facing flag reference, so the wrong threshold reaches an operator who never opens the packet SKILL.md. The shipped `expansiveBudget` returns 24 at one seed. [S9, D]
  - Evidence: `node -e 'const {expansiveBudget}=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs"); for (let S=0;S<=2;S++) console.log("S="+S+" -> "+expansiveBudget({target:"review",see...` exit 0: S=0 -> 7 S=1 -> 24 S=2 -> 24
  - Critic override: duplicate, lane severity P2. Same wrong sentence as B-08 at a location B-08 does not list: commands/deep/review.md:100. Fix it with B-08's six-location sweep.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-deep-loop/research | system-deep-loop/research | pass |
| P02 | system-deep-loop/research | system-deep-loop/research | pass |
| P03 | system-deep-loop/research | system-deep-loop/research | pass |
| P04 | system-deep-loop/research | system-deep-loop/research | pass |
| P05 | system-deep-loop/review | system-deep-loop/review | pass |
| P06 | system-deep-loop/review | system-deep-loop/review | pass |
| P07 | system-deep-loop/review | system-deep-loop/review | pass |
| P08 | system-deep-loop/review | system-deep-loop/review | pass |
| P09 | system-deep-loop/review | system-deep-loop/review | pass |
| P10 | system-deep-loop/review | system-deep-loop/review | pass |
| P11 | sk-code | sk-code/sk-code-review | pass |
| P12 | sk-code | sk-code/sk-code-review | pass |
| P13 | sk-doc | sk-doc/sk-create-skill | pass |
| P14 | sk-git | sk-git | pass |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.dsh/agents/deep-research.patch.yml`
- `.dsh/agents/deep-review.patch.yml`
- `.vibe/agents/deep-research.toml`
- `.vibe/agents/deep-review.toml`
- `.gitignore`
- `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/lineage-prompt.txt`

