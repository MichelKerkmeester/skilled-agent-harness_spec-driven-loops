# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `65eb3c029d0c2c0a29dcfcc0039d7343692c2d83`, 17 first-parent commits
- Files: 189, of which 13 uncommitted or untracked
- Owners: 8
- Findings: 10 (P0 0, P1 2, P2 8), 0 literal, 0 inferred, 1 outside the scope; 0 more overturned by the critic and not counted
- Lanes: C, D
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
| pass | P2 | no | `S1-quality-gate` | 0 | 1782 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 230 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1575 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 309 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 558 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 103 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 199 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 135 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 7536 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 49 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 7664 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 280 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 250 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 460 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 481 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 284 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 250 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 246 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 250 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 593 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 614 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 252 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 376 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 477 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 308 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 213 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 209 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 418 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 321 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 222 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 221 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 293 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 291 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 281 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 372 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 344 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 362 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 342 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 210 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 217 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 200 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 232 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 560 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 366 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 2751 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 75 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 69 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 91113 |
| pass | P2 | no | `S5-derived-counts` | 0 | 277 |
| pass | P2 | no | `S5-readme-references` | 0 | 3607 |
| pass | P2 | no | `S6-release-coverage` | 0 | 75 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 46 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 675 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 51 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 3813 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 102 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 229 |
| pass | P2 | no | `S8-advisor-status` | 0 | 513 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 107 |
| fail | P2 | no | `S9-command-references` | 1 | 80 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 426 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 315 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 44 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 43 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 37 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 67 |
| pass | P2 | no | `S13-env-tokens` | 0 | 147 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2346 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 2053 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 2178 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 2588 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 2412 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 2135 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 3181 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 3181 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 3164 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 2457 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 2456 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 2156 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 3236 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 3233 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 123 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 55 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 9798 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1738 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 59 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 58 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 42 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 88 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 2814 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 997 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 40 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 229 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 56 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2880 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3597 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 376 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 4152 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 570 |
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

### S5 READMEs match sk-create-readme, root included

- **C-05** P2 judgment `README.md:253`: The root README section that covers the deep loops does not reflect the capabilities this scope added. It describes the loops, their stop rules and their fan-out, but names none of `--depth-mode=expansive` on both loops, custom review dimensions, or `--extend=N` for a completed run; a grep for those terms over README.md returns 0 matches. Line 253's stop enumeration also leaves out the frontier ho...
  - Evidence: `grep -cE -- "depth-mode|expansive|--extend|custom dimension|dimensions" README.md` exit 1: 0

### S6 Changelogs updated or created

- **C-01** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md:25`: The entry fails the shape gate that sk-create-changelog section 9 requires before writing: line 25 holds a 23-word sentence over the 22-word ceiling, and the entry averages 10.1 words a sentence against a ceiling of 10. The file was added after the checker's last change, so the defect is in the entry, not a later rule change. Split the sentence and shorten the surrounding prose until the gate pass...
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` exit 1: FAIL .skilled/skills/system-deep-loop/changelog/v2.1.0.0.md [sentence-max] line 25: a sentence of 23 words, ceiling 22. Split it [sentence-mean] 10.1 words a sentence on average, ceiling 10. Use more, shorter sentences SUMMARY files=1 pass=0 fail=1
- **C-02** P2 judgment `.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md:15`: The entry fails the shape gate: its prose averages 10.5 words a sentence against the 10-word ceiling in sk-create-changelog section 9. Shorten the opening paragraph and the glance bullets until the gate passes.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` exit 1: FAIL .skilled/skills/system-deep-loop/changelog/v2.1.1.0.md [sentence-mean] 10.5 words a sentence on average, ceiling 10. Use more, shorter sentences SUMMARY files=1 pass=0 fail=1
- **C-03** P2 judgment `.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md:16`: The entry fails the shape gate: its prose averages 11.1 words a sentence against the 10-word ceiling in sk-create-changelog section 9. The opening paragraph at line 16 is the longest, so split it and shorten the remaining prose until the gate passes.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` exit 1: FAIL .skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md [sentence-mean] 11.1 words a sentence on average, ceiling 10. Use more, shorter sentences SUMMARY files=1 pass=0 fail=1
- **C-04** P2 judgment `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md:16`: The entry fails the shape gate: line 16 holds a 23-word sentence over the 22-word ceiling, and the entry averages 12.1 words a sentence against a ceiling of 10. Split the opening paragraph and shorten the rest until the gate passes.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` exit 1: FAIL .skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md [sentence-max] line 16: a sentence of 23 words, ceiling 22. Split it [sentence-mean] 12.1 words a sentence on average, ceiling 10. Use more, shorter sentences SUMMARY files=1 pass=0 fail=1

### S7 Skill routing is right

- **D-02** P1 judgment `.skilled/skills/system-deep-loop/hub-router.json:32`: Stage two cannot resolve the feature's vocabulary. `vocabularyClasses` has no expansive-depth or frontier phrase, so `compiled-route --hub system-deep-loop` returns `defer` for a research-specific feature request ('...keep a depth-capped frontier of follow-up questions') and for a review request naming the feature ('Review the payment module in expansive depth mode'). The mode SKILL.md files also ...
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "Investigate iteratively why the parser drops unicode and keep a depth-capped frontier of follow-up questions"` exit 0: {"hubId":"system-deep-loop","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"c6b62457fa5db8f1c3545095977dd006c852dc2c0021407a94bd2fbcbcb713b6","generation":4}

### S8 Skill integrated in system-skill-advisor

- **D-01** P1 judgment `.skilled/skills/system-deep-loop/mode-registry.json:48`: The new expansive-depth frontier has no advisor reach. Probes authored from the feature before reading advisor metadata (probes-pre-metadata.md #2 and #5) fail: 'Investigate iteratively why the parser drops unicode and keep a depth-capped frontier of follow-up questions' returns zero recommendations, and 'Audit this spec folder for release readiness and keep a frontier of sub-targets open until th...
  - Evidence: `printf '%s' '{"prompt":"Research token refresh in expansive depth mode"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json | node -e 'let s="";process.stdin.on("data",d=>...` exit 0: {"top":null,"count":0}

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
- **D-03** P2 judgment `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:162`: The new `depth_mode` flag is described in the PRE-BOUND schema (line 190) and the Default Resolution Table (line 215), but the `:auto` Tier-1 persist shape at line 162 still lists `antiConvergence.convergenceMode` and omits `antiConvergence.depthMode`; the review contract has the same omission at line 156. A run following the contract's own Tier-1 shape writes a config without the flag and only ge...
  - Evidence: `sed -n '162p' .skilled/commands/deep/assets/compiled/deep-research.contract.markdown | grep -o 'shape: .*config.executor\.\*'` exit 0: shape: `researchTopic`, `specFolder`, `maxIterations`, `convergenceThreshold`, `antiConvergence.convergenceMode`, reserved `antiConvergence.divergent: {}`, `executionMode: "auto"`, `resource_map.emit`, `config.executor.*

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **D-04** P2 judgment `.skilled/commands/scripts/validate-command-references.cjs:131`: The S9-command-references battery row fails on a runtime data path, not on a broken deep command reference. `.skilled/commands/speckit/assets/speckit-resume.yaml:104` names `.skilled/skills/system-spec-kit/runtime/database/access-telemetry.json`; `.gitignore:431` ignores that whole directory, so a clean checkout never holds it. The validator already exempts `.skilled/skills/.state/` (line 131) and... [S9, D]
  - Evidence: `git -c core.fsmonitor=false check-ignore -v .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json` exit 0: .gitignore:431:.skilled/skills/system-spec-kit/runtime/database/ .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-deep-loop/research | system-deep-loop/research | pass |
| P02 | system-deep-loop/research | - | fail |
| P03 | system-deep-loop/research | system-deep-loop/research | pass |
| P04 | system-deep-loop/review | system-deep-loop/review | pass |
| P05 | system-deep-loop/review | system-spec-kit | fail |
| P06 | system-deep-loop/review | system-deep-loop/review | pass |
| P07 | system-deep-loop/research | system-deep-loop/research | pass |
| P08 | system-deep-loop/review | system-deep-loop/review | pass |
| P09 | sk-code/sk-code-review | sk-code/sk-code-review | pass |
| P10 | sk-git | sk-git | pass |
| P11 | system-deep-loop/research | system-deep-loop/research | pass |
| P12 | system-deep-loop/review | sk-code/sk-code-review | fail |

## Probes awaiting the critic

- P02: Investigate iteratively why the parser drops unicode and keep a depth-capped frontier of follow-up questions; expected system-deep-loop; actual skill -
- P05: Audit this spec folder for release readiness and keep a frontier of sub-targets open until they are exhausted; expected system-deep-loop; actual skill system-spec-kit
- P12: Extend the completed review run by three iterations; expected system-deep-loop; actual skill sk-code

## Files no lane reviewed

No critic output in this run, so coverage was not checked.

