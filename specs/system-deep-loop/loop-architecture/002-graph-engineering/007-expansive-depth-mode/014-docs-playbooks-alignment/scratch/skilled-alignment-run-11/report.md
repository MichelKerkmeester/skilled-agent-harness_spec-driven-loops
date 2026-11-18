# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `7177cee3b503016c1ec844fb6f75f3352d177247`, 73 first-parent commits
- Files: 1251, of which 0 uncommitted or untracked
- Owners: 15
- Findings: 16 (P0 0, P1 7, P2 9), 2 literal, 0 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 10 (5 handed off, 1 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 18 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 99 | 7 |
| S3 | Feature catalog entries | yes | 117 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 117 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 130 | 3 |
| S6 | Changelogs updated or created | yes | 127 | 1 |
| S7 | Skill routing is right | yes | 7 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 7 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 19 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 18 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 56 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 165, fail 1, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 2183 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 805 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1285 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 351 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 394 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 81 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 116 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 108 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 9975 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 80 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 9843 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 171 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 410 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 336 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 257 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 257 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 294 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 301 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 348 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 352 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 320 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 405 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 283 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 279 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 366 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 402 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 471 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 357 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 393 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 420 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 385 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 391 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 694 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 505 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 361 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 346 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 384 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 382 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 400 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 372 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 323 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 656 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 571 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 340 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 321 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 315 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 363 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 467 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 430 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 421 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 375 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 436 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 407 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 505 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 563 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 559 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 456 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 355 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 337 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 363 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 387 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 443 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 432 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 383 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 371 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 335 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 350 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 339 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 333 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 272 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 273 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 275 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 282 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 453 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 440 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 433 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 431 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 357 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 369 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 373 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 384 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 284 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 285 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 276 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 288 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 274 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 268 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 265 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 337 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 328 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 329 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 302 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 289 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 304 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 297 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 358 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 367 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md` | 0 | 356 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 350 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 279 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 714 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 314 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 328 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 314 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 256 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1831 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 67 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 45 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 91181 |
| pass | P2 | no | `S5-derived-counts` | 0 | 188 |
| pass | P2 | no | `S5-readme-references` | 0 | 2768 |
| pass | P2 | no | `S6-release-coverage` | 0 | 53 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 62 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 538 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 34 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 5736 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 128 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 230 |
| pass | P2 | no | `S8-advisor-status` | 0 | 147 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 45 |
| fail | P2 | no | `S9-command-references` | 1 | 65 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 484 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 74 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 398 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 45 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 41 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 52 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 46 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 44 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 93 |
| pass | P2 | no | `S13-env-tokens` | 0 | 480 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 3550 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 3137 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 2538 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 2509 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 2483 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 2500 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 2555 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 2591 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 3533 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 3408 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 3523 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 2117 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 2070 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1972 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 210 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 121 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 8374 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1779 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 68 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 66 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 35 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 52 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 2841 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 885 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 45 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 248 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 115 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2634 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3712 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 477 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 2119 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 595 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 143 |

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

- **A-1** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:262`: readCaps derives maxFrontierNodes from the configured maxIterations (lines 262-264) while seedBudget derives it from the seed-sized budget (line 323). The comment at line 259 states the two agree; they do not. With the shipped research config (maxIterations 10) and the documented six-seed decomposition, seedNodes reports growthSlots 2 and no warning, but readCaps enforces a cap of 5, so the first ... [rebutted]
  - Disposition: The workflow never admits before step_frontier_budget writes the derived budget into the config (deep-research.yaml step_frontier_budget, deep-review.yaml likewise), so readCaps then reads the budget the seed reported: config 10, six seeds, derived 16, cap 8, growth 2, and a child is admitted. The evidence called seedNodes and admitProposals directly without that write. Commit f053c714a78 corrects...
  - Evidence: `node -e 'const fs=require("node:fs"),os=require("node:os"),p=require("node:path");const fa=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs");const d=fs.mkdtempSync(p.joi...` exit 0: seed reports growthSlots=2 warning=none | readCaps.maxFrontierNodes=5 admit one child -> {"admitted":[],"pruned":[{"nodeId":"F-2-007","reason":"fanout"}]}
- **A-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:475`: admitProposals builds the node id from nodes.size + 1. readNodeStore deliberately skips a torn line ('A torn or hand-edited line must not hide the rows after it'), so the map holds fewer entries than the highest id and the counter reuses an existing id at the same depth. The new row then overwrites that node in the map and the store keeps two rows for one nodeId, so the earlier node's question, sc...
  - Evidence: `node -e 'const fs=require("node:fs"),os=require("node:os"),p=require("node:path");const fa=require("./.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs");const d=fs.mkdtempSync(p.joi...` exit 0: before: F-1-001,F-1-002,F-2-003,F-2-005,F-2-006 admit -> {"admitted":["F-2-006"],"pruned":[]} after: F-1-001=seed one | F-1-002=seed two | F-2-003=child three | F-2-005=child five | F-2-006=a fresh depth two question

### S2 Skill docs match sk-create-skill

- **B-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:16`: Doubled comma in the OVERVIEW sentence: "...budget and cycle checks, in that order,, and holds a convergence stop while frontier nodes stay open." The stray comma is a typo in a shipped catalog leaf that the S2 lens (references and assets current) covers.
  - Evidence: `grep -n 'in that order,,' -r .skilled/skills/system-deep-loop/` exit 0: ...illed/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:16:`--depth-mode` takes `default` or `expansive`. ... under the relevance, dedupe, depth, fan-out, budget and cycle checks, in that order,, and holds a convergence stop while frontier nodes stay open. ...

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-2** P2 judgment `.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:217`: Section 8 SCENARIO DIRECTORY omits the `write-containment/` category and `WC-001`, so its census reads "Total scenarios: 11 / Categories: 4" while Section 6 CATEGORY INDEX lists 12 scenario IDs across 5 categories and the package holds 13 scenario files across 6 category folders. The new Section 9 (line 233) re-asserts "the 11-scenario total in Section 8", so the stale count is now load-bearing. T... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: system-deep-loop hub playbook. Section 8 SCENARIO DIRECTORY (commit adbba5a06a9) omits write-containment/WC-001. This program's Section 9 sentence no longer restates the Section 8 total (commit 6fc46e54edd).
  - Evidence: `sed -n '143,190p' .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md | grep -cE '^\| `[A-Z]+-[0-9]+`'` exit 0: 12 --- ids --- `AI-001` `AI-002` `AI-004` `MO-001` `MO-002` `MO-004` `RB-001` `RB-004` `SC-001` `SC-003` `SC-004` `WC-001`
- **B-3** P2 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:806`: Section 14 is titled "FEATURE CATALOG CROSS-REFERENCE INDEX" but contains only a scenario index; the file holds zero references to `feature-catalog`, so the deep-review feature catalog (which gained five entries in this change: expansive-depth-mode, min-iterations-floor, custom-review-dimensions, completed-run-extension, focus-hijack-guard) is unreachable from the playbook root. The standard's Sec...
  - Evidence: `grep -c "feature-catalog" .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` exit 1: 0

### S5 READMEs match sk-create-readme, root included

- **C-01** P2 judgment `.skilled/skills/system-deep-loop/deep-review/README.md:159`: The README calls `--depth-mode=expansive` 'the one stop-path change that grows work instead of ending it', but the paragraph two lines above describes the review min-iterations floor, which also holds a review at CONTINUE with `minIterationsNotReached`. Both ship in this scope (v1.11.18.0 and v1.13.0.0), so the 'one' claim is false and the section contradicts itself.
  - Evidence: `grep -n "one stop-path change\|minIterationsNotReached" .skilled/skills/system-deep-loop/deep-review/README.md` exit 0: ...ONTINUE` with reason `minIterationsNotReached` until its iteration count reaches `minIterations`, even when every dimension is clean. 159:`--depth-mode=expansive` is the one stop-path change that grows work instead of ending it. A seed step writes the depth-1 sub-target nodes before iteration 1. ...

### S6 Changelogs updated or created

- **C-02** P2 judgment `.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:116`: The v1.13.0.0 entry never names the `frontier_drained` stop candidate, the release's new stop path: a drained frontier lets an expansive review stop before its cap. The same release's README, SKILL.md, quick-reference, loop-protocol and convergence reference all name it, and commit 4b4f0448aba documented it in every one of those files except this entry, so the release notes are the one surface a r...
  - Evidence: `grep -c "frontier_drained" .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` exit 1: 0
- **E-1** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:25`: The scope adds four user-visible capabilities -- `--depth-mode=expansive`, `--extend=N` with `--extend-minutes=M`, custom review dimensions and the review min-iterations floor -- and no root release-notes entry describes any of them. The newest entry is already tagged `v4.1.0.0`, was not touched in the range, and no newer entry was created, so the operator-facing upgrade surface carries no record ... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: the operator, who writes skilled release entries. .skilled/changelog/skilled/v4.1.0.0.md (commit 6d4adab892a) is tagged v4.1.0.0; a new root release entry for this program's features is the operator's call.
  - Evidence: `for t in depth-mode expansive frontier extend minIterations "custom dimension" "min-iterations"; do printf '%s=%s ' "$t" "$(grep -ci -- "$t" .skilled/changelog/skilled/v4.1.0.0.md)"; done; git -c core...` exit 0: depth-mode=0 expansive=0 frontier=0 extend=0 minIterations=0 custom dimension=0 min-iterations=0 (no diff output) v4.1.0.0

### S7 Skill routing is right

- **D-01** P1 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:34`: The packet advertises eight `Keyword triggers:` terms (lines 30-39) and five are absent from `hub-router.json` `vocabularyClasses.research-aliases`: `autonomous research` (34), `iterative research` (36), `multi-round research` (37), `deep investigation` (38), `comprehensive research` (39). Four of the five route to another skill: `autonomous research`, `multi-round research`, `deep investigation` ... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: system-deep-loop hub routing. deep-research/SKILL.md Keyword triggers (commit 9eeebf9d9f7) and hub-router.json research-aliases predate the program, as does ci-hub-vocabulary-source.cjs reading only same-line triggers.
  - Evidence: `printf '%s' '{"prompt":"Run a comprehensive research pass on the topic"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` exit 0: top1=cli-external-orchestration score=0.158705; candidates=['cli-external-orchestration', 'sk-doc', 'system-deep-loop']
- **D-02** P1 judgment `.skilled/skills/system-deep-loop/deep-review/SKILL.md:76`: The packet advertises twelve trigger terms and six are absent from `hub-router.json` `vocabularyClasses.review-aliases`: `spec folder review`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`. All six route elsewhere: `spec folder review` and `audit spec folder` to `system-spec-kit`, `quality audit` and `pre-release review` to `sk-code`, `... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: system-deep-loop hub routing. deep-review/SKILL.md Keyword Triggers heading (commit b3e27b84255) and hub-router.json review-aliases predate the program.
  - Evidence: `printf '%s' '{"prompt":"Audit the spec folder for completeness"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` exit 0: top1=system-spec-kit score=0.888604; candidates=['system-spec-kit', 'sk-code', 'sk-doc']

### S8 Skill integrated in system-skill-advisor

- **D-03** P1 judgment `.skilled/skills/system-deep-loop/hub-router.json:32`: The new feature `--depth-mode=expansive` added no router vocabulary. `hub-router.json` `vocabularyClasses` (line 32) and `graph-metadata.json` `intent_signals` carry no `expansive`, `depth mode`, `frontier` or `sub-target` term, and `skill_advisor.py` has no matching pattern, so the feature is routable only when the prompt also names a pre-existing alias. Probes that name the feature alone route e...
  - Evidence: `printf '%s' '{"prompt":"Enable expansive depth mode on this research run"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` exit 0: top1=cli-external-orchestration score=0.181817; candidates=['cli-external-orchestration', 'mcp-code-mode', 'mcp-tooling']
- **PRB-01** P1 judgment: Probe P02 "Enable expansive depth mode on this research run" expected system-deep-loop/research; top-1 was cli-external-orchestration.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Enable expansive depth mode on this research run"}' --format json` exit 0: top-1 was cli-external-orchestration
- **PRB-02** P1 judgment: Probe P03 "Seed a depth-capped frontier of follow-up questions for this research run" expected system-deep-loop/research; top-1 was cli-external-orchestration.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Seed a depth-capped frontier of follow-up questions for this research run"}' --format json` exit 0: top-1 was cli-external-orchestration
- **PRB-03** P1 judgment: Probe P05 "Expand the review target into sub-targets to depth 3" expected system-deep-loop/review; top-1 was sk-code/sk-code-review.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Expand the review target into sub-targets to depth 3"}' --format json` exit 0: top-1 was sk-code/sk-code-review

### S9 Commands aligned

- **BAT-01** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Same cause as D-03. Owner: commands/scripts/validate-command-references.cjs:134, a file this program did not change; speckit-resume.yaml:104 names a gitignored runtime path (.gitignore:431).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
- **D-04** P2 literal `.skilled/commands/deep/assets/deep-research-presentation.txt:70`: The `maxIterations` row of the Default Resolution Table reads `with S the depth-1 nodes the seed admitted and c 1`, which is a truncated clause. The research budget formula is `2 * perNode * nodes` with `perNode = 1` (`frontier-admit.cjs:286`), so the intended text is `and c = 1`. The same string is copied into the generated `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:2...
  - Evidence: `grep -n 'and c 1' .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/compiled/deep-research.contract.markdown` exit 0: ...ep/assets/deep-research-presentation.txt:70: ... with S the depth-1 nodes the seed admitted and c 1; any other source is kept as given .skilled/commands/deep/assets/compiled/deep-research.contract.markdown:213: ... with S the depth-1 nodes the seed admitted and c 1; any other source is kept as given

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-deep-loop/research | system-deep-loop/research | pass |
| P02 | system-deep-loop/research | cli-external-orchestration | fail |
| P03 | system-deep-loop/research | cli-external-orchestration | fail |
| P04 | system-deep-loop/review | system-deep-loop/review | pass |
| P05 | system-deep-loop/review | sk-code/sk-code-review | fail |
| P06 | system-deep-loop/review | system-deep-loop/review | pass |
| P07 | sk-code | sk-code/sk-code-review | pass |
| P08 | sk-code | sk-code | pass |
| P09 | sk-doc | sk-doc | pass |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `.dsh/agents/deep-research.patch.yml`
- `.dsh/agents/deep-review.patch.yml`
- `.vibe/agents/deep-research.toml`
- `.vibe/agents/deep-review.toml`
- `.gitignore`
- `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/lineage-prompt.txt`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment/scratch/** (1040 prior-run artifacts across 30 run directories; no lane reviewed them and no battery row covers them)`

