# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `e4c1a24b2d7bbfc23d1bcc2a9cebdcc4f8a78675`, 15 first-parent commits
- Files: 168, of which 30 uncommitted or untracked
- Owners: 8
- Findings: 1 (P0 0, P1 0, P2 1), 0 literal, 0 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Lanes: none (battery-only run)
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 6 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 75 | 7 |
| S3 | Feature catalog entries | yes | 81 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 81 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 87 | 3 |
| S6 | Changelogs updated or created | yes | 85 | 1 |
| S7 | Skill routing is right | yes | 7 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 7 | 1 |
| S9 | Commands aligned | yes | 4 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 7 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 6 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 49 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 140, fail 1, cannot run 0, not applicable 3

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1133 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 202 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 895 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 256 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 275 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 42 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 60 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 90 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 5777 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 46 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 5736 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 140 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 187 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 187 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 187 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 186 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 187 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 186 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 249 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 325 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 304 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 216 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 282 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 268 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 212 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 288 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 188 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 263 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 272 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 186 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 198 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 196 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 184 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 189 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 471 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 193 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 190 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1210 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 61 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 39 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 61157 |
| pass | P2 | no | `S5-derived-counts` | 0 | 130 |
| pass | P2 | no | `S5-readme-references` | 0 | 1780 |
| pass | P2 | no | `S6-release-coverage` | 0 | 43 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 32 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 347 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 28 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 3409 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 102 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 213 |
| pass | P2 | no | `S8-advisor-status` | 0 | 123 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 45 |
| fail | P2 | no | `S9-command-references` | 1 | 59 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 407 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 295 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 41 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 41 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 46 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 42 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 81 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 136 |
| pass | P2 | no | `S13-env-tokens` | 0 | 157 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2155 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 2069 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1665 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 1858 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1843 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1729 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1652 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1675 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 1653 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 1839 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 1802 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1731 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 2091 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 2089 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 217 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 79 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 7614 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1200 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 58 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 49 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 33 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 47 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1932 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 616 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 110 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 212 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 47 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2830 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3641 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 345 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 2151 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 552 |
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

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes awaiting the critic

None.

## Files no lane reviewed

No critic output in this run, so coverage was not checked.

