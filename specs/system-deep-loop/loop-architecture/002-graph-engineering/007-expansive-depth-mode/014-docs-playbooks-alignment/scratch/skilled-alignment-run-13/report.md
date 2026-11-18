# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `21c4b325b5a`
- Commits: `21c4b325b5a0074ac31d0f2ec3e31e28351be933` to `a2382a3f063312cd0534aa8b858212bf5a0c6d34`, 92 first-parent commits
- Files: 1436, of which 13 uncommitted or untracked
- Owners: 16
- Findings: 13 (P0 0, P1 1, P2 12), 3 literal, 0 inferred, 3 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 7 (6 handed off, 0 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 19 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 103 | 7 |
| S3 | Feature catalog entries | yes | 122 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 122 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 135 | 3 |
| S6 | Changelogs updated or created | yes | 132 | 1 |
| S7 | Skill routing is right | yes | 10 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 10 | 1 |
| S9 | Commands aligned | yes | 8 | 3 |
| S10 | Agents aligned | yes | 8 | 1 |
| S11 | Runtime mirrors | yes | 19 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 19 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 56 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 170, fail 2, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 2227 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 1055 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 1287 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-research` | 0 | 342 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop/deep-review` | 0 | 447 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 706 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 57 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-research` | 0 | 51 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop/deep-review` | 0 | 51 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 48 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 7215 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 39 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 7156 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 159 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 89 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/README.md` | 0 | 381 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/ROUTER.md` | 0 | 252 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/SKILL.md` | 0 | 234 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.0.0.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.1.0.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.2.0.md` | 0 | 379 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.3.0.md` | 0 | 485 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.4.0.md` | 0 | 350 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md` | 0 | 275 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md` | 0 | 297 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/README.md` | 0 | 314 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/SKILL.md` | 0 | 254 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md` | 0 | 266 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md` | 0 | 290 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md` | 0 | 273 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md` | 0 | 266 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md` | 0 | 302 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 241 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 249 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | 0 | 248 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 239 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 251 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | 0 | 255 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 262 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-graph-mirror-closes-unanswered-nodes.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md` | 0 | 240 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | 0 | 301 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | 0 | 356 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | 0 | 287 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | 0 | 277 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/README.md` | 0 | 287 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 0 | 259 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | 0 | 237 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md` | 0 | 253 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 0 | 254 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md` | 0 | 292 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` | 0 | 288 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/min-iterations-floor.md` | 0 | 270 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/custom-review-dimensions.md` | 0 | 326 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md` | 0 | 301 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` | 0 | 292 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/config-management.md` | 0 | 265 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md` | 0 | 243 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | 0 | 330 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | 0 | 256 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | 0 | 250 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | 0 | 298 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | 0 | 271 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | 0 | 264 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 0 | 277 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | 0 | 237 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md` | 0 | 235 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/completed-run-extension-flag.md` | 0 | 223 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md` | 0 | 268 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` | 0 | 270 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md` | 0 | 276 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/coverage-graph-db.md` | 0 | 324 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md` | 0 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/landed-iteration-no-redispatch.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/executor/research-claude-config-dir.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md` | 0 | 257 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md` | 0 | 283 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | 0 | 267 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 0 | 273 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | 0 | 262 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md` | 0 | 239 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md` | 0 | 229 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md` | 0 | 228 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | 0 | 340 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md` | 0 | 695 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | 0 | 314 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | 0 | 288 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 0 | 262 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/prompt-rendering/research-prompt-pack-contract.md` | 0 | 333 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1668 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 109 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 125 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 45 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 68821 |
| fail | P2 | no | `S5-derived-counts` | 1 | 248 |
| pass | P2 | no | `S5-readme-references` | 0 | 2369 |
| pass | P2 | no | `S6-release-coverage` | 0 | 55 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 36 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 476 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 29 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 4399 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 112 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 240 |
| pass | P2 | no | `S8-advisor-status` | 0 | 126 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 49 |
| fail | P2 | no | `S9-command-references` | 1 | 67 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 475 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 38 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 397 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 109 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 43 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 46 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 42 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 42 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 75 |
| pass | P2 | no | `S13-env-tokens` | 0 | 222 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension` | 0 | 2320 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir` | 0 | 1989 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor` | 0 | 1976 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix` | 0 | 2039 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment` | 0 | 1974 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields` | 0 | 1691 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class` | 0 | 1683 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage` | 0 | 1702 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge` | 0 | 2102 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode` | 0 | 2411 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode` | 0 | 2372 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene` | 0 | 1844 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration` | 0 | 1800 |
| pass | P0 | yes | `S14-packet-validate:specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment` | 0 | 1776 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 150 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 53 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 8362 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1774 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 60 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 65 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 40 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 54 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 2654 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 803 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 40 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 269 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 53 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 2358 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3630 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 362 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 2338 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 714 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 149 |

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

- **A-1** P1 judgment `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:407`: The review target containment check compares scope paths against the raw reviewTarget text. A files target written as a glob is in contract: deep-review.yaml lines 793-797 say 'Expand glob patterns from review_target', and the expanded list is stored as reviewScopeFiles (yaml line 874). Containment only consults that list for commit ranges (line 405), so with a glob target like 'src/**/*.ts' no sc...
  - Evidence: `node -e 'seedNodes({artifactDir, target:"review", candidates:[{question:"Does a.ts leak a handle?",scope:"src/a.ts"},{question:"Does b.ts race?",scope:["src/b.ts"]}]})' with review config {reviewTarge...` exit 0: {"admitted":0,"pruned":["relevance","relevance"]}; glob false, dot false, dotslash true; all-pruned seed result: {"admitted":[],"pruned":[{"nodeId":"F-1-001","reason":"relevance"}],"derivedMaxIterations":7,"growthSlots":3} with no warning field
- **X-1** P2 judgment `.skilled/commands/assets/local-skilled-alignment/resolve-scope.cjs:90`: The scope was built in the default first-parent mode, which keeps only first-parent, non-merge commits so that changes from merging the base back in stay out. On this branch every one of the 17 first-parent merges (the 'integrate the ...' commits) brings in a program side branch, not the base: none of their second parents is an ancestor of main. So `git diff 21c4b325b5a HEAD` changes 64 non-spec f... [handed off]
  - Disposition: A limitation of the scope tool, not a defect in this program's files. Owner: the local-skilled-alignment tooling (resolve-scope.cjs), whose default first-parent mode drops files that reached HEAD through first-parent merges of program side branches. The critic's manual checks on the off-map files passed: comment hygiene 0, quality gate 0 findings, runtime vitest 578 passed and 2 skipped, spec-kit ...
  - Evidence: `git -c core.fsmonitor=false diff --name-only 21c4b325b5a HEAD, minus scope.json files and specs/; for each first-parent merge: git merge-base --is-ancestor <merge>^2 main; xargs check-comment-hygiene....` exit 0: ...pec files changed in range but absent from scope.json; 17/17 merges are side branches (none on main); hygiene exit=0; quality-gate gate=NO_BLOCKER_FOUND findings: 0 (45 files); runtime vitest Test Files 25 passed, Tests 578 passed | 2 skipped; spec-kit cli vitest Test Files 3 passed, Tests 18 passed

### S2 Skill docs match sk-create-skill

- **B-4** P2 judgment `.skilled/skills/system-deep-loop/deep-review/SKILL.md:238`: sk-create-skill ALWAYS rule 5 says to keep SKILL.md within the Size Limits table (3000 recommended words), and rule 6 says to move long guidance into references/. The deep-review SKILL.md was already at 3026 words at the program base 21c4b325b5a. This program grew it to 3864, and package_skill.py now warns. Most of the growth is the new Expansive Depth Mode subsection. Its line 238 is a single 188...
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/system-deep-loop/deep-review --check` exit 0: 1 warning(s): SKILL.md has 3864 words (recommended max: 3000)
- **B-5** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:93`: The deep-research SKILL.md went over the 3000-word recommended limit during this program: 2613 words at base 21c4b325b5a, 3059 now by the packager's count, which now warns. That breaks ALWAYS rules 5 and 6 of sk-create-skill. The expansive-depth budget paragraph at line 93 (native lineage 12 in place of 10, node cap and growth slots, explicit-value precedence) repeats references/protocol/loop-prot...
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/system-deep-loop/deep-research --check` exit 0: SKILL.md has 3059 words (recommended max: 3000)

### S3 Feature catalog entries

- **B-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md:35`: This is an omission, not a false statement. Commit cec5a403eb3 changed how upsert.cjs maps a reused review finding id. The iteration's own derived findings now register in knownFindings before the stored ones (upsert.cjs lines 386-393), so when a reused id splits to finding:&lt;id&gt;#&lt;iteration&gt;, the leaf-sent FINDING node and every edge naming that id land on the new split node, not on the...
  - Evidence: `git -c core.fsmonitor=false diff 4a96a5da1e6 HEAD -- .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-scr...` exit 0: ... own findings register first. When a reused id was split into finding:&lt;id&gt;#&lt;iteration&gt;, the leaf's node and edges for that id belong to the new finding ... +derivedFinding ? { ...derivedFinding, ...(leafMetadata ?? {}) } : n.metadata; catalog upsert-script.md: no change since 4a96a5da1e6
- **B-3** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16`: The hub entry gives one defaulted-budget formula, min(24, max(loop default, 2 x c x (S + maxDepth - 1))) with c for review = the four canonical dimensions plus any custom name, and the next sentence applies it to a fan-out lineage too. A fan-out lineage is sized differently. fanout-run.cjs expansiveLineageBudgets (lines 339-350) calls expansiveBudget with no dimensions and no maxDepth, so it falls...
  - Evidence: `sed -n 325,375p .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` exit 0: ...ensions. A matrix iterations value is explicit and always kept. function expansiveLineageBudgets(lineages, { loopType, partition }) { ... const iterations = expansiveBudget({ target: loopType, seeded: share, loopDefault: lineage.kind === 'native' ? 12 : LOOP_DEFAULT_MAX_ITERATIONS[loopType], }); ...

### S5 READMEs match sk-create-readme, root included

- **BAT-01** P2 judgment: S5-derived-counts failed (exit 1). [handed off]
  - Disposition: Not this program's: the failing claim is system-skill-advisor/README.md line 141, unchanged since the program base 21c4b325b5a, and its count of two sidecar files is true. Owner: sk-create-readme's check_derived_readme_counts.py, which cannot derive a count over a folder that holds other files too. Same cause as C-1.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/bin/README.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/deep-research/...` exit 1: ... --trusted`. If that fails, delete the `skill-graph.sqlite` database and its two sidecar files under `runtime/database/`, then rebuild with `--trusted --force` | FAIL .skilled/skills/system-skill-advisor/README.md: claims=1 failures=1 PASS README.md: claims=1 failures=0 SUMMARY files=6 pass=5 fail=1
- **X-2** P2 literal `.skilled/skills/system-deep-loop/runtime/scripts/README.md:48`: This scope adds a new CLI entry point, runtime/scripts/frontier-admit.cjs, which seeds, admits, prunes and closes nodes in the frontier node store. The Files table in the scripts folder README has no row for it. runtime/README.md sends readers to that table for the CLI commands, so the script cannot be found from the runtime's own README. The README is unchanged since the base. Eleven other script...
  - Evidence: `for f in runtime/scripts/*.cjs; do grep -q $(basename $f) runtime/scripts/README.md || echo MISSING; done; git cat-file -e 21c4b325b5a:.skilled/skills/system-deep-loop/runtime/scripts/<name>.cjs per m...` exit 0: 12 MISSING rows; 11 present at base; frontier-admit NEW (status A in range); README.md no diff since base

### S9 Commands aligned

- **BAT-02** P2 judgment: S9-command-references failed (exit 1). [handed off]
  - Disposition: Not this program's: speckit-resume.yaml:104 and validate-command-references.cjs are both unchanged since the program base 21c4b325b5a. Owner: commands/scripts/validate-command-references.cjs. The YAML names a gitignored runtime file it falls back from, so the checker needs a runtime-state exemption. Same cause as X-3 and the hand-off in earlier runs.
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/speckit/assets/speckit-resume.yaml:104 [skill-asset] .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json - path does not exist on disk
- **X-3** P2 judgment `.skilled/commands/speckit/assets/speckit-resume.yaml:104`: No lane explains the S9-command-references battery failure. It is pre-existing and a checker false positive, not a gap in this scope. speckit-resume.yaml did not change in range, and line 104 names the same path at base. The path it flags, .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json, is runtime state that the resume step reads when it is present, and .gitignore line 431 ... [handed off]
  - Disposition: Pre-existing checker false positive, the explanation of BAT-02. Owner: commands/scripts/validate-command-references.cjs, which flags .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json although .gitignore line 431 ignores that runtime directory and speckit-resume.yaml reads the file only when present.
  - Evidence: `git -c core.fsmonitor=false diff --stat 21c4b325b5a HEAD -- .skilled/commands/speckit/assets/speckit-resume.yaml; git -c core.fsmonitor=false check-ignore -v .skilled/skills/system-spec-kit/runtime/da...` exit 0: no diff in range; .gitignore:431:.skilled/skills/system-spec-kit/runtime/database/ .skilled/skills/system-spec-kit/runtime/database/access-telemetry.json

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **C-1** P2 literal `.skilled/skills/system-skill-advisor/README.md:141`: Battery S5-derived-counts fails on this line. The cause is a checker limit, not a wrong claim: 'its two sidecar files under runtime/database/' is a true count (skill-graph.sqlite-shm and skill-graph.sqlite-wal exist there), but check_derived_readme_counts.py cannot derive it, because the folder holds other files too. The line predates the branch (last README change d68e7fdf888, no diff since base ... [handed off] [S5, C]
  - Disposition: Pre-existing per the critic: system-skill-advisor/README.md has no diff since the program base 21c4b325b5a and the sidecar count is true. Owner: sk-create-readme's check_derived_readme_counts.py, which needs to accept a count of named files in a mixed folder.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/skills/system-skill-advisor/README.md; ls .skilled/skills/system-skill-advisor/runtime/database/` exit 1: line 141: numeric count for 'files' ... FAIL .skilled/skills/system-skill-advisor/README.md: claims=1 failures=1; database/ lists skill-graph.sqlite, skill-graph.sqlite-shm, skill-graph.sqlite-wal, skill-graph-daemon-lease.sqlite(-shm,-wal), README.md, one .bak
  - Critic override: pre-existing, lane severity P2. git diff --stat 21c4b325b5a HEAD -- .skilled/skills/system-skill-advisor/README.md is empty, and git show 21c4b325b5a:.skilled/skills/system-skill-advisor/README.md already has the 'its two sidecar files under runtime/database/' line at 141. The README is not a scope file. It entered the S5 battery only because the recompiled skill-graph.json is in scope.

### unchanged in range

- **B-1** P2 judgment `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/upsert-script.md:15`: Triggered by the S4 scope file runtime/scripts/upsert.cjs. This program added a review finding evidence capability to upsert.cjs: the --state-log, --delta-dir and --iteration inputs, deriveReviewFindingEvidence (one FINDING node plus an EVIDENCE_FOR edge per path:line ref), the finding:&lt;id&gt;#&lt;iteration&gt; split for a reused id, leaf-id folding through resolveReviewFindingId, and the rejec... [S4, B]
  - Evidence: `grep -n -E "state-log|delta-dir|#&lt;iteration&gt;|rejectedOrphanEdges" .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/upsert-script.md` exit 1: 
- **C-2** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:237`: The newest root release notes do not describe the capabilities this scope adds, which the lens requires. The Deep Loop section never names --depth-mode=expansive, --extend=N or --extend-minutes, the review minIterations floor or custom review dimensions. The root README section does describe them (README.md lines 253-255). S6-release-coverage passed only because it matches skill ids such as 'deep ... [handed off] [S6, C]
  - Disposition: Not this program's: .skilled/changelog/skilled/v4.1.0.0.md is unchanged since the program base 21c4b325b5a. Owner: the operator, who owns the open root v4.1.0.0 release notes. Whether the deep-loop section names expansive depth, --extend, the review floor and custom dimensions is the release owner's call, made when this branch lands.
  - Evidence: `grep -niE 'depth|extend|dimension|completed-continue|minimum' .skilled/changelog/skilled/v4.1.0.0.md; git -c core.fsmonitor=false merge-base --is-ancestor v4.1.0.0 HEAD` exit 1: no match for depth-mode, expansive, --extend, custom dimension or minimum iteration; the only Deep Loop items are scripted verdicts, AI Council moved out, stdin hang, continuity saves; the tag is not an ancestor of HEAD (exit 1)

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

