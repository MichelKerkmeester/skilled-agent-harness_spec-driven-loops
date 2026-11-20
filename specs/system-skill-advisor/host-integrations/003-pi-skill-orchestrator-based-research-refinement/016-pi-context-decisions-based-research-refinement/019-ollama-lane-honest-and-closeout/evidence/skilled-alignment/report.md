# Alignment report: worktrees/480-ollama-lane-honest-and-closeout

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `worktrees/480-ollama-lane-honest-and-closeout`, base `f2f03c90fb6`
- Commits: `f2f03c90fb6e1481a2be255cb398568fecc6846f` to `aaaff7dd9dfdef7289b08109f1948cecea899a94`, 11 first-parent commits
- Files: 340, of which 0 uncommitted or untracked
- Owners: 30
- Findings: 41 (P0 3, P1 17, P2 21), 2 literal, 3 inferred, 9 outside the scope; 1 more overturned by the critic and not counted
- Open findings: 41 (0 handed off, 0 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 20 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 22 | 7 |
| S3 | Feature catalog entries | yes | 39 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 39 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 57 | 3 |
| S6 | Changelogs updated or created | yes | 52 | 1 |
| S7 | Skill routing is right | yes | 38 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 38 | 1 |
| S9 | Commands aligned | yes | 14 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 15 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 21 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 279 | 1 |
| S15 | CI parity | yes | 1 | 21 |

## Battery

pass 151, fail 4, cannot run 0, not applicable 6

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1630 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 261 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 861 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 63 |
| fail | P0 | yes | `S2-skill-root-metadata` | 1 | 6670 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 52 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6611 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 179 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` | 0 | 334 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/README.md` | 0 | 284 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/SKILL.md` | 0 | 176 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md` | 0 | 2063 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/lifecycle.md` | 0 | 156 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/watcher.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/attribution.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md` | 0 | 168 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/five-lane-fusion.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md` | 0 | 169 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md` | 0 | 173 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/watcher-narrow-scope.md` | 0 | 320 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md` | 0 | 297 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md` | 0 | 170 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md` | 0 | 172 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/five-lane-fusion.md` | 0 | 174 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-attribution.md` | 0 | 184 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md` | 0 | 9347 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/runtime/lib/embedders/README.md` | 0 | 186 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | 0 | 359 |
| fail | P0 | yes | `S3-catalog-package` | 1 | 2504 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 95 |
| not_applicable | P2 | no | `S4-playbook-topology` | - | 0 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 57448 |
| pass | P2 | no | `S5-derived-counts` | 0 | 246 |
| pass | P2 | no | `S5-readme-references` | 0 | 3049 |
| pass | P2 | no | `S6-release-coverage` | 0 | 70 |
| fail | P0 | yes | `S7-skill-graph-freshness` | 1 | 34 |
| not_applicable | P2 | no | `S7-parent-skill-check` | - | 0 |
| not_applicable | P2 | no | `S7-router-intent-signals` | - | 0 |
| not_applicable | P2 | no | `S7-router-vocabulary-reach` | - | 0 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 99 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 190 |
| pass | P2 | no | `S8-advisor-status` | 0 | 619 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 44 |
| pass | P2 | no | `S9-command-references` | 0 | 126 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 1026 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 487 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 66 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 60 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 60 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 57 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 58 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 103 |
| fail | P2 | no | `S13-env-tokens` | 1 | 152 |
| pass | P0 | yes | `S14-packet-validate:specs/agents-md/repo-rule-operations/002-repo-rule-advisor-surfacing` | 0 | 1556 |
| pass | P0 | yes | `S14-packet-validate:specs/agents-md/repo-rule-operations/002-repo-rule-advisor-surfacing/011-decisions-rule-delivery` | 0 | 1598 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/006-agent-contract-and-registry-alignment` | 0 | 1165 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups` | 0 | 1128 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe` | 0 | 1464 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names` | 0 | 1492 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/008-orchestrate-routing-and-retry` | 0 | 1742 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/009-ai-council-writer-and-round-model` | 0 | 1652 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/014-prompt-improver-model-eligibility` | 0 | 1555 |
| pass | P0 | yes | `S14-packet-validate:specs/cli-external-orchestration/model-rosters/007-hy4-flash-free-opencode-roster` | 0 | 1442 |
| pass | P0 | yes | `S14-packet-validate:specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation` | 0 | 1219 |
| pass | P0 | yes | `S14-packet-validate:specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/017-dsh-rc3-repin` | 0 | 2740 |
| pass | P0 | yes | `S14-packet-validate:specs/cli-external-orchestration/runtime-lifecycle/003-cli-hermes-deprecation` | 0 | 1185 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/decision-capture/001-decision-capture` | 0 | 2405 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/decision-capture/001-decision-capture/011-level-match-operator-record` | 0 | 1368 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/env-secret-guard/001-env-secret-guard` | 0 | 1563 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure` | 0 | 1381 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/hook-platform/006-file-relative-adapter-imports` | 0 | 1340 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/hook-platform/007-hub-index-gap-links` | 0 | 1689 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite` | 0 | 3093 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration` | 0 | 2864 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline` | 0 | 1794 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation` | 0 | 1635 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/007-review-remediation` | 0 | 1553 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement` | 0 | 1398 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/009-deep-review-p2-remediation` | 0 | 1307 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/010-history-secret-redaction` | 0 | 1316 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop` | 0 | 2568 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/038-goal-and-workflow-resume` | 0 | 2295 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness` | 0 | 1433 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/038-goal-and-workflow-resume/011-permission-mode-carry` | 0 | 1417 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/038-goal-and-workflow-resume/013-opencode-child-and-title` | 0 | 1403 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons` | 0 | 1464 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/039-hop-dialog-goal-title` | 0 | 3439 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare` | 0 | 2169 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/039-hop-dialog-goal-title/002-packet-goal-fallback` | 0 | 2383 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/046-vibe-history-locator` | 0 | 1941 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/049-handover-doc-alignment` | 0 | 1918 |
| pass | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/050-handover-doc-alignment-2` | 0 | 1975 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/hub-architecture/006-sk-code-audit-remediation` | 0 | 1690 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach` | 0 | 1817 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/hub-architecture/006-sk-code-audit-remediation/005-hub-router-alignment` | 0 | 1781 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/hub-architecture/007-ci-vocabulary-single-source` | 0 | 1716 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/verification-guards/005-surface-intent-fold-declaration` | 0 | 1508 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement` | 0 | 1322 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements` | 0 | 1300 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes` | 0 | 1621 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/document-standards/003-changelog-system` | 0 | 1297 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite` | 0 | 1302 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/001-voice-rule-tooling-and-pilot` | 0 | 1570 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/document-standards/006-readme-template-conformance` | 0 | 1307 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes` | 0 | 1576 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/hub-routing-and-surfaces/007-host-spec-tree-readers` | 0 | 1414 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift` | 0 | 1414 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-git/commit-standards/008-doctor-host-hook-acceptance` | 0 | 1389 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement` | 0 | 2459 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/002-pasted-context-stripping` | 0 | 1452 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/010-route-receipts-research` | 0 | 2609 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout` | 0 | 1478 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` | 0 | 2536 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/019-workflow-outcome-measure` | 0 | 1542 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skilled-doctor/001-skill-and-overlay-build` | 0 | 1167 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skilled-doctor/001-skill-and-overlay-build/010-fix-barter-repin-handover-items-for-overlay-engine` | 0 | 1438 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skilled-doctor/001-skill-and-overlay-build/013-fix-review-findings-in-json-entry-set-restore` | 0 | 1416 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review` | 0 | 1404 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake` | 0 | 1440 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skilled-doctor/005-barter-upstream-fixes` | 0 | 1610 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/repo-operations/004-node-security-patch-update` | 0 | 1521 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/runtime-and-release/003-symlinked-runtime-root` | 0 | 1557 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/runtime-and-release/004-v4-release-line-research` | 0 | 1217 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/runtime-and-release/004-v4-release-line-research/023-configurable-host-index-folder` | 0 | 1565 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite` | 0 | 2682 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/runtime-and-release/006-test-cycle-speed` | 0 | 1234 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift` | 0 | 1320 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/007-shared-blocks-and-retired-mechanisms` | 0 | 1680 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/008-router-readme-presentation-alignment` | 0 | 1716 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/009-resume-contract-owned-assets` | 0 | 1533 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos` | 0 | 2712 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/008-track-subtrack-regrouping` | 0 | 1528 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/009-rename-rule-and-test-root-fixes` | 0 | 1402 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/010-mixed-track-sweep-guard` | 0 | 1533 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach` | 0 | 2490 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/005-tests-and-closeout` | 0 | 1657 |
| pass | P0 | yes | `S14-packet-validate:specs/system-speckit/spec-folder-tooling/006-remove-nested-changelog` | 0 | 1494 |
| pass | P2 | no | `S15-workflow-shape:.github/workflows/skill-advisor-stress.yml` | 0 | 41 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 108 |
| not_applicable | P2 | no | `S15-ci-contract-drift` | - | 0 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 5639 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1029 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 45 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 47 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 29 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 44 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1502 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 498 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 32 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 169 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 41 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1646 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3535 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 259 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1400 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 427 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 112 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .skilled/commands/create/assets/create-command-auto.yaml
- `comment-hygiene.yml`: pull_request: no path filter
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `hook-vitest-suites.yml`: pull_request: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .skilled/commands/create/assets/create-command-auto.yaml
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-plugin-tests.yml`: pull_request: paths match .skilled/bin/launcher-heartbeat-watchdog.vitest.ts
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/system-skill-advisor/SKILL.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/launcher-heartbeat-watchdog.vitest.ts
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-advisor-stress.yml`: pull_request: paths match .github/workflows/skill-advisor-stress.yml
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md
- `spec-kit-check.yml`: push: paths match .skilled/commands/create/assets/create-command-auto.yaml
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **A2** P2 judgment `.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts:179`: The comment "Keep every projection row as a candidate; unseeded rows receive no cosine match" is false, and the behavior it describes is what the ablation now measures. createFixtureProjection sets source:"fixture" (projection.ts:1882), so scoreSemanticShadowLane builds fixtureVectors for every projection row (semantic-shadow.ts:352-357) and falls back to it at semantic-shadow.ts:394. Unseeded row...
  - Evidence: `node -e 'const j=JSON.parse(require("fs").readFileSync("scripts/command-bridges/command-bridges.generated.json","utf8")); const ts=j.entries.filter(e=>e.runtime&&e.runtime.typescript&&e.runtime.typesc...` exit 0: total 63 ts-enabled 47
- **A3** P2 judgment `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:390`: Two changed behaviors have no test. (1) The heartbeat moved from after startSkillGraphDaemon to immediately after initSkillGraphDb (advisor-server.ts:390), which is the fix that makes the new HEARTBEAT_STARTUP_GRACE_MS window meaningful: without it a slow startup scan outlives the grace and the watchdog SIGTERMs a healthy daemon. launcher-heartbeat-watchdog.vitest.ts covers heartbeatVerdict and th...
  - Evidence: `grep -rn "refreshEmbeddingsInBackground" .skilled/skills/system-skill-advisor/runtime --include=*.ts | grep -v node_modules` exit 0: tests/skill-graph/refresh-in-background.vitest.ts (unit only); advisor-server.ts:439 and watcher.ts:496 are the only call sites and neither has a behavior test

### S2 Skill docs match sk-create-skill

- **BAT-01** P0 judgment: S2-skill-root-metadata failed (exit 1).
  - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` exit 1: ...ENERATED_FILE: system-skill-advisor: leaf-aliases.json does not match the projection of its leaf-manifest.json OK [S] system-skilled-doctor OK [S] system-spec-kit checked=14 passed=13 failed=1 fixed=0 Re-run with --fix to regenerate missing or stale manifests; authored files must be written by hand.
  - CI runs this command: routing-registry-drift.yml > routing-drift > Skill-root metadata class contract - every root, hub or standalone
- **B-07** P2 judgment `.skilled/skills/system-skill-advisor/SKILL.md:111`: The SKILL.md advisor_status sentence enumerates the opt-in diagnostics and names only includeEmbeddingsHealth: 'with includeEmbeddingsHealth, an opt-in embeddingsHealth covering provider resolution and the local model server'. The change added a second opt-in diagnostic, includeSemanticHealth, which now carries coverageComplete plus skill and command vector coverage, and SKILL.md never names it. T...
  - Evidence: `sed -n '111p' .skilled/skills/system-skill-advisor/SKILL.md` exit 0: `advisor_status` reports `indexStaleness` on every successful call and, with `includeEmbeddingsHealth`, an opt-in `embeddingsHealth` covering provider resolution and the local model server. It adds `hookHealth` once a prompt hook has written a health record for the workspace.

### S3 Feature catalog entries

- **BAT-02** P0 judgment: S3-catalog-package failed (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exit 1: ...validation-rule-engine.md:29: prose path is absent and ignored by a repository .gitignore: .skilled/hooks/hook-flags.env - [note] [ignored_path_absent] system-spec-kit/ask-surface-guard.md:38: prose path is absent and ignored by a repository .gitignore: .skilled/skills/.state/ask-surface/fires.jsonl
  - CI runs this command: sk-doc-script-tests.yml > catalog-packages > Validate every feature catalog package
- **B-03** P1 judgment `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:37`: The change added a new feature claim at line 24 (196-row corpus, 156 vs 161 correct, 7 flips) but the leaf's Validation And Tests table still lists only advisor-validate.vitest.ts. semantic-shadow-ablation.vitest.ts is the only test that produces those numbers and it is not anchored. The same gap runs through every catalog leaf the change edited: daemon-and-freshness/lifecycle.md:42 claims the bac...
  - Evidence: `for t in refresh-in-background embedding-coverage semantic-outage-degraded semantic-shadow-ablation semantic-shadow-cosine; do printf '%-32s anchored_in_catalog=' "$t"; grep -rl "$t" .skilled/skills/s...` exit 0: refresh-in-background anchored_in_catalog=0 embedding-coverage anchored_in_catalog=0 semantic-outage-degraded anchored_in_catalog=0 semantic-shadow-ablation anchored_in_catalog=0 semantic-shadow-cosine anchored_in_catalog=0

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-05** P2 judgment `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md:58`: SC-005 now carries two ablation records in one Expected Signals list: line 58 keeps 'The recorded ablation covered 193 prompts. It scored 149 with semantic_shadow and 150 without it', and line 59 adds 'Two runs on the 196-row corpus ... 156 correct ... 161 with the lane disabled'. The committed corpus is 196 non-empty rows, so the 193-prompt record is pinned to a corpus size the change superseded,...
  - Evidence: `grep -n "193 prompts" .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md; grep -c '[^[:space:]]' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accura...` exit 0: 58:- The recorded ablation covered 193 prompts. It scored 149 with `semantic_shadow` and 150 without it. 196
- **B-06** P2 judgment `.skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md:61`: The new OP-001 expected signal says 'With includeSemanticHealth enabled and Ollama unavailable, semantic health reports DEGRADED'. The status envelope carries no DEGRADED value: semanticLaneHealth.backend.state is one of reachable, unreachable, model_missing or probe_not_implemented (advisor-tool-schemas.ts:261-264). DEGRADED is the doctor leg's verdict derived from that state (doctor-setup.yaml:6...
  - Evidence: `grep -n "reports `DEGRADED`" .skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md; sed -n '261,264p' .skilled/skills/system-skill-advisor/runtime/schemas/advisor...` exit 0: ...des skill and command vector coverage. A lane weight of 0 passes this setup check. Recommendation prompts are not embedded at that weight. backend: z.object({ state: z.enum(['reachable', 'unreachable', 'model_missing', 'probe_not_implemented']), reason: z.string().nullable(), }).strict().optional(),
- **X-05** P2 judgment `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md:69`: The new background vector refresh and the new `includeSemanticHealth` status surface have no manual testing step. native-status-transitions.md:69 says 'With `includeSemanticHealth` enabled, the response reports ...' but the scenario's four steps (lines 39-58) never pass `--include-semantic-health true`. watcher-narrow-scope.md:87 says 'Each watcher reindex starts the shared skill and command vecto...
  - Evidence: `grep -n 'includeSemanticHealth\|Each watcher reindex\|After startup IPC' .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md .skilled/skills/syst...` exit 0: ...d command vector refresh. ... daemon-lifecycle-shutdown.md:71:- After startup IPC is ready, the shared background refresh starts without delaying readiness. ... 39:1. Live check: ... 40-58: advisor_status --format json; stale check; absent check; hook health check (no --include-semantic-health step)

### S5 READMEs match sk-create-readme, root included

- **C-03** P2 judgment `.skilled/skills/system-skill-advisor/README.md:48`: The skill README tells a reader to set SPECKIT_ADVISOR_LANE_WEIGHTS_JSON='{"semantic_shadow":0.05}' 'to enable its live scoring' and stops there. The scope adds a precondition the same release note states at .skilled/changelog/skilled/v4.1.0.0.md:227: raising the weight requires current vectors for every embeddable skill and command. semantic-shadow.ts:383-385 returns an empty match list with disa... (inferred)

### S6 Changelogs updated or created

- **C-04** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:220`: The open release note now contradicts itself about whether the daemon probes a backend. Line 220, unchanged by this scope, says the embedder 'points straight to its one registered model at daemon start, with no backend probes'. The scope adds line 226 in the next section: 'Incomplete coverage triggers one Ollama probe'. Both statements sit in the same Skill Advisor block of the same release note, ... (inferred)

### S7 Skill routing is right

- **BAT-03** P0 judgment: S7-skill-graph-freshness failed (exit 1).
  - Evidence: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exit 1: ...vs disk: none GHOST (in compiled json, not on disk): none MISSING (on disk, not in compiled json): none FAMILY MISMATCH compiled vs disk: none SIGNAL DRIFT compiled vs disk: system-skill-advisor NULL derived timestamp: none (report-only - the canonical reindex is operator-gated; nothing was written)
  - CI runs this command: routing-registry-drift.yml > routing-drift > Compiled skill graph freshness - compiled json matches graph-metadata

### S8 Skill integrated in system-skill-advisor

- **D-02** P1 judgment `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:383`: The incomplete_skill_vectors gate checks vector presence, not currency. cachedVectors is built from loadSkillEmbeddings(), which returns contentHash but the map keeps only row.embedding, and the gate is `!cachedVectors.has(skill.id)`. A stale vector (content_hash mismatch after a description edit whose re-embed failed) is present, so the gate passes and the lane scores with the old vector. changel...
  - Evidence: `grep -n 'requiredVectorRows.some' .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts && grep -c contentHash .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/...` exit 0: 383: if (requiredVectorRows.some((skill) => !cachedVectors.has(skill.id))) { 0
- **PRB-01** P1 judgment: Probe P01 "check the advisor's vector coverage for skills and commands" expected system-skill-advisor; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check the advisor'\''s vector coverage for skills and commands"}' --format json` exit 0: top-1 was nothing
- **PRB-02** P1 judgment: Probe P02 "turn on the semantic lane and see whether routing improves" expected system-skill-advisor; top-1 was command-doctor-helper.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"turn on the semantic lane and see whether routing improves"}' --format json` exit 0: top-1 was command-doctor-helper
- **PRB-03** P1 judgment: Probe P03 "why is the advisor daemon not refreshing stale skill vectors in the background" expected system-skill-advisor; top-1 was command-doctor-skill-advisor-rebuild.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"why is the advisor daemon not refreshing stale skill vectors in the background"}' --format json` exit 0: top-1 was command-doctor-skill-advisor-rebuild
- **PRB-04** P1 judgment: Probe P04 "run an ablation comparing the semantic lane against the lexical baseline" expected system-skill-advisor; top-1 was sk-code.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"run an ablation comparing the semantic lane against the lexical baseline"}' --format json` exit 0: top-1 was sk-code
- **PRB-05** P1 judgment: Probe P05 "explain which lane contributed to this routing recommendation" expected system-skill-advisor; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"explain which lane contributed to this routing recommendation"}' --format json` exit 0: top-1 was nothing
- **PRB-06** P1 judgment: Probe P06 "make the advisor daemon shut down cleanly when the session ends" expected system-skill-advisor; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"make the advisor daemon shut down cleanly when the session ends"}' --format json` exit 0: top-1 was nothing
- **PRB-07** P1 judgment: Probe P07 "narrow the watcher so it only reindexes the skill I just edited" expected system-skill-advisor; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"narrow the watcher so it only reindexes the skill I just edited"}' --format json` exit 0: top-1 was nothing
- **PRB-08** P1 judgment: Probe P08 "diagnose why the advisor reports degraded when Ollama is offline" expected system-skill-advisor; top-1 was command-doctor-helper.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"diagnose why the advisor reports degraded when Ollama is offline"}' --format json` exit 0: top-1 was command-doctor-helper
- **PRB-09** P1 judgment: Probe P09 "regenerate the command bridges so command vectors become embeddable" expected system-skill-advisor; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"regenerate the command bridges so command vectors become embeddable"}' --format json` exit 0: top-1 was nothing
- **PRB-10** P1 judgment: Probe P11 "show the advisor status with semantic lane health" expected system-skill-advisor; top-1 was command-doctor-helper.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"show the advisor status with semantic lane health"}' --format json` exit 0: top-1 was command-doctor-helper
- **PRB-11** P1 judgment: Probe P12 "disable the background vector refresh for this session" expected system-skill-advisor; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"disable the background vector refresh for this session"}' --format json` exit 0: top-1 was nothing

### S9 Commands aligned

- **D-03** P2 literal `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:148`: The /doctor:skill-advisor embedder route tells the operator to repair an unreachable backend by running /doctor:skill-advisor embedder, which is the route they are already in. doctor-skill-advisor-presentation.txt:300 and :304 repeat the same self-reference in the Final Result Next line and the status rule. The repair pointer should name a route that adds information, such as /doctor:setup, whose ...
  - Evidence: `grep -n 'point to /doctor:skill-advisor embedder' .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml && grep -n 'Next: \[none|start the advisor daemon' .skilled/commands/doctor/assets/...` exit 0: ...rage check as PASS when `semanticLaneHealth.coverageComplete` is true. Set STATUS=DEGRADED when `backend.state` is not `reachable` ... point to /doctor:skill-advisor embedder. ..." 300:Next: [none|start the advisor daemon with Ollama up so it refreshes missing vectors|/doctor:skill-advisor embedder]
- **D-04** P2 judgment `.skilled/commands/create/assets/create-command-auto.yaml:470`: The new bridge-regeneration activity sits in step_5_validation, whose enforcement is HARD_BLOCK, but it adds no quality_gates entry and no validation_command line, so nothing can fail when the bridges are not regenerated. create-command-confirm.yaml:482 has the same gap. The presentation template at create-command-presentation.txt:168 then prints 'Advisor command bridges: regenerated' unconditiona...
  - Evidence: `grep -n 'Regenerate command bridges' .skilled/commands/create/assets/create-command-auto.yaml && grep -n 'bridge' .skilled/commands/create/assets/create-command-auto.yaml | grep -i 'must pass'` exit 1: 470: - Regenerate command bridges after writing the command files with `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` (no quality_gates line mentions the bridges)

### S13 Env docs list every operator-settable variable

- **ENV-01** P2 judgment `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1445`: SYSTEM_SKILL_ADVISOR_EMBED_REFRESH is read in changed code but .env.example does not list it.
  - Evidence: `node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/check-env-tokens.cjs --scope /Users/michelkerkmeester/.local/state/local-skilled-alignment/480-ollama-lane-hones...` exit 1: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1445
- **ENV-02** P2 judgment `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:372`: VITEST is read in changed code but .env.example does not list it.
  - Evidence: `node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/check-env-tokens.cjs --scope /Users/michelkerkmeester/.local/state/local-skilled-alignment/480-ollama-lane-hones...` exit 1: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:372

### S14 Spec packets validate (changed-packet-validation replay)

- **X-01** P2 judgment `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/tasks.md:137`: CHK-020 is a P0 testing-checklist item marked `[x]` while its own evidence says two acceptance criteria are unmet: 'Every AC row is Met except AC-011 and AC-013, which wait on finalization.' The same packet's completion criteria at line 77 is `[ ]` and says T013 to T016 wait on finalization, and acceptance-criteria.md:70-71 marks AC-011 and AC-013 `Unmet` with `Closeable: No`. A checked P0 item th...
  - Evidence: `sed -n '137p;77p' specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeou...` exit 0: - [x] CHK-020 [P0] All acceptance criteria met Evidence: Every AC row is Met except AC-011 and AC-013, which wait on finalization. - [ ] All tasks marked `[x]` (T013 to T016 wait on finalization) 70:| AC-011 | ... | Unmet | - | 71:| AC-013 | ... | Unmet | - | **Closeable:** No
- **X-02** P2 judgment `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/plan.md:29`: The plan still describes the pre-amendment lane-live refresh: 'at the default weight 0 the daemon still makes no Ollama call. The refresh helper returns at once at weight 0' (line 29), '`refreshSkillEmbeddingsWhenLaneLive` ... does nothing at weight 0' (line 57), and 'the refresh helper, which refreshes only above weight 0' (line 63). The shipped code refreshes at any lane weight (`refreshEmbeddin...
  - Evidence: `sed -n '29p;57p;63p' specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-clos...` exit 0: ...on. It does nothing at weight 0. 63:Startup scan or watcher reindex, then the refresh helper, which refreshes only above weight 0, then the vectors. 67:The daemon now keeps every embeddable skill and command vector current at any lane weight. 1445:export async function refreshEmbeddingsInBackground(
- **X-03** P2 judgment `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/spec.md:215`: The spec's edge case says 'a startup scan that blocks for more than 3 minutes now gets the server reaped', but the launcher's startup grace is 5 minutes (`HEARTBEAT_STARTUP_GRACE_MS = 300_000` at system-skill-advisor-launcher.cjs:1557), and the spec's own REQ-006 (line 152), the plan (line 60), AC-006 and the implementation summary all say 5 minutes. The 3-minute figure is the existing heartbeat s...
  - Evidence: `sed -n '215p;176p' specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeo...` exit 0: ...erver reaped, which is the intended behavior for a wedged start. 176:- **SC-002**: ... `match-decision-table --scan-orphans` lists only live sessions. 1557:const HEARTBEAT_STARTUP_GRACE_MS = 300_000; 64:| AC-009 | ... | lists only live or skipped sessions, each skip with its reason | ... | Met | - |
- **X-04** P2 judgment `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/description.json:8`: The 019 packet's own metadata was never refreshed after the implementation. description.json still carries `lastUpdated: 2026-11-19T17:05:15.920Z` and `memorySequence: 0`; goal.md:11-14 still says `last_updated_by: scaffold`, `recent_action: Authored the durable directive`, `next_safe_action: Execute against the completion criteria`; acceptance-criteria.md:11-14 says `scaffold`; implementation-sum...
  - Evidence: `grep -n 'lastUpdated\|memorySequence' specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lan...` exit 0: ...mplate-author" implementation-summary.md:13: recent_action: "Initialized Level 2 template" implementation-summary.md:14: next_safe_action: "Replace continuity placeholders" 004-alignment-fixes/description.json: - "lastUpdated": "2026-11-13T10:04:51.555Z" / + "lastUpdated": "2026-11-19T17:48:11.937Z"

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **B-08** P2 judgment `.skilled/skills/system-skill-advisor/leaf-aliases.json:1`: Battery row S2-skill-root-metadata fails with STALE_GENERATED_FILE: leaf-aliases.json does not match the projection of its leaf-manifest.json. Confirmed cause: the committed file holds 120 rows while the projection of leaf-manifest.json holds 124; the four missing rows are feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md, feature-catalog/scorer-fusion/pasted-reply-stripping.m... [S2, B]
  - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir $SCRATCH/base/.skilled/skills` exit 1: FAIL [S] system-skill-advisor STALE_GENERATED_FILE: system-skill-advisor: leaf-aliases.json does not match the projection of its leaf-manifest.json checked=1 passed=0 failed=1 fixed=0
  - Critic override: pre-existing, lane severity P2. leaf-manifest.json and leaf-aliases.json are byte-identical between f2f03c90fb6 and aaaff7dd9df (git diff --name-only returns nothing), the four leaf files exist at both commits, and the same STALE_GENERATED_FILE reproduces against the base tree. The change did not cause it.
- **B-09** P2 judgment `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md:49`: Battery row S3-catalog-package fails with two packet_history_metadata violations: pasted-reply-stripping.md:49 and hooks-and-plugin/weak-follow-up-route-receipt-guard.md:50. Confirmed cause: both lines are '- Feature ID: SC-006' and '- Feature ID: CL-011', and PACKET_HISTORY_RE in validate_catalog_package.py:102-105 matches 'feature[- ]?id:' case-insensitively. The change did not cause it: neither... [S3, B]
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --skills-root $SCRATCH/base/.skilled/skills --repo-root $SCRATCH/base --package system-skill-advisor` exit 1: ...fail] [packet_history_metadata] system-skill-advisor/weak-follow-up-route-receipt-guard.md:50: packet-history metadata is not allowed in a feature catalog - [fail] [packet_history_metadata] system-skill-advisor/pasted-reply-stripping.md:49: packet-history metadata is not allowed in a feature catalog
  - Critic override: pre-existing, lane severity P2. pasted-reply-stripping.md and weak-follow-up-route-receipt-guard.md are unchanged between f2f03c90fb6 and aaaff7dd9df, and validate_catalog_package.py is unchanged, so the two packet_history_metadata violations reproduce at base. The change did not cause them.
- **D-05** P2 judgment `.skilled/skills/system-skill-advisor/graph-metadata.json:98`: S7-skill-graph-freshness fails on SIGNAL DRIFT compiled vs disk for system-skill-advisor. Cause confirmed in the repository: the compiled runtime/scripts/skill-graph.json carries 31 signals for the skill while graph-metadata.json declares 39 intent_signals; the first 8 missing are 'pasted earlier reply' (line 98) through 'confidence floor' (line 105), and signalDrift() requires compiledList.length... [S7, D]
  - Evidence: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exit 1: SIGNAL DRIFT compiled vs disk: system-skill-advisor (report-only - the canonical reindex is operator-gated; nothing was written)
  - Critic override: pre-existing, lane severity P2. graph-metadata.json and runtime/scripts/skill-graph.json are byte-identical between f2f03c90fb6 and aaaff7dd9df; the compiled file carries 31 signals against 39 on disk at both ends, with generated_at 2026-11-17T11:29:50.903233+00:00. The 8 missing signals predate the change.

### unchanged in range

- **C-01** P1 literal `.env.example:408`: The scope adds SYSTEM_SKILL_ADVISOR_EMBED_REFRESH, an operator-settable switch read at .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1445 and forwarded to the daemon child at .skilled/bin/system-skill-advisor-launcher.cjs:188. It is documented in ENV-REFERENCE.md:394, the skill README:48, INSTALL-GUIDE.md, the v1.3.0.0 changelog, the v4.1.0.0 release note and the l... [S13, C]
  - Evidence: `node /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/check-env-tokens.cjs --scope /Users/michelkerkmeester/.local/state/local-skilled-alignment/480-o...` exit 1: UNLISTED SYSTEM_SKILL_ADVISOR_EMBED_REFRESH .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1445 UNLISTED VITEST .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:372 STATUS=FINDINGS check-env-tokens: files=8 tokens=2 unlisted=2
- **B-01** P1 judgment `.skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md:146`: The freshness contract still tells a reader that the daemon never writes SQLite on its own: 'The daemon is NOT responsible for: Rebuilding the index automatically. SQLite database writes happen through trusted maintenance paths such as advisor_rebuild and skill_graph_scan'. The change makes the daemon write skill and command vectors from refreshEmbeddingsInBackground after startup IPC and after ev... [S2, B]
  - Evidence: `grep -n "NOT responsible for" -A 4 .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md` exit 0: ...ly. SQLite database writes happen through trusted maintenance paths such as `advisor_rebuild` and `skill_graph_scan`; corrupt-database recovery may also move aside and recreate the database during lazy initialization. 147:- Validating skill content. Only `skill_graph_validate` checks edge integrity.
- **B-02** P1 judgment `.skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:58`: The lane-tuning reference still states the semantic lane 'carries the lowest fusion weight (0.05), so its live contribution is small by design'. The shipped default live weight is 0 (DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow = 0, README.md:46, references/scoring/advisor-scorer.md:55, ENV-REFERENCE.md:391). The sentence cannot be read as the shadow weight because it names shadow_weight separately... [S2, B]
  - Evidence: `grep -n "lowest fusion weight" .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md` exit 0: ... higher than expected." The semantic_shadow lane is live in the registry but carries the lowest fusion weight (0.05), so its live contribution is small by design. Re-weight it only with measured evidence; adjust the shadow_weight separately if you are tuning shadow mode rather than the live ranking.
- **D-01** P1 judgment `.skilled/skills/system-skill-advisor/graph-metadata.json:66`: The v1.3.0.0 features have no advisor routing vocabulary. graph-metadata.json is byte-identical between base and head, and the only new trigger_phrases in the diff are in changelog/v1.3.0.0.md, which the advisor never reads. 10 of 12 positive probes authored from the changelog and feature-catalog prose route nowhere or to a doctor command bridge, so an operator asking about vector coverage, the se... [S8, D]
  - Evidence: `node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes probes.json --out probe-results.json --timeout-ms 60000` exit 1: ...or-skill-advisor-rebuild | fail P04 got=sk-code | fail P05 got=- | fail P06 got=- | fail P07 got=- | fail P08 got=command-doctor-helper | fail P09 got=- | pass P10 got=system-skill-advisor | fail P11 got=command-doctor-helper | fail P12 got=- | STATUS=FINDINGS run-probes: pass=6 fail=12 cannot_run=0
- **B-04** P2 judgment `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:26`: The background vector refresh is a new capability with its own env var (SYSTEM_SKILL_ADVISOR_EMBED_REFRESH), its own coverage function (embeddingCoverage), its own start sites (advisor-server.ts, watcher.ts) and three new tests, but it has no catalog entry. The daemon-and-freshness group still reads '7 | Watcher, lease, lifecycle, generation, trust state, rebuild-from-source, cache invalidation' a... [S3, B]
  - Evidence: `grep -n "daemon-and-freshness) | 7" .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` exit 0: 26:| [daemon-and-freshness](../feature-catalog/daemon-and-freshness) | 7 | Watcher, lease, lifecycle, generation, trust state, rebuild-from-source, cache invalidation |
- **C-02** P2 judgment `README.md:203`: The root README's Skill Routing section describes the advisor as a resident daemon and says nothing about the capability this scope adds: after startup IPC is ready and after each watcher reindex the daemon now checks skill and command vector coverage and, when coverage is incomplete, probes Ollama once and embeds missing or stale rows. That is a new background network call to Ollama on daemon sta... (inferred) [S5, C]

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **A1** P2 judgment `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:383`: The new incomplete_skill_vectors gate tests vector presence, not currency. requiredVectorRows.some((skill) => !cachedVectors.has(skill.id)) accepts any stored row, and loadSkillEmbeddings returns rows without filtering on content_hash or model_id. So a skill whose SKILL.md description changed while its re-embed failed keeps its old vector, passes the gate, and is scored against the previous descri... [S1, A]
  - Evidence: `cd .skilled/skills/system-skill-advisor/runtime && ./node_modules/.bin/vitest run tests/scorer/semantic-shadow-cosine.vitest.ts tests/skill-graph-embedding-outage.vitest.ts` exit 0: Test Files 6 passed (6) | Tests 73 passed (73) - the suite passes with a non-matching content_hash, confirming the gate ignores currency
  - Critic override: duplicate, lane severity P2. D-02 records the same gate defect at the same line (semantic-shadow.ts:383) with the same reach and the same changelog contradiction; keep D-02, which grades it P1.

## Env tokens

2 variables read in changed code, 2 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-skill-advisor | - | fail |
| P02 | system-skill-advisor | command-doctor-helper | fail |
| P03 | system-skill-advisor | command-doctor-skill-advisor-rebuild | fail |
| P04 | system-skill-advisor | sk-code | fail |
| P05 | system-skill-advisor | - | fail |
| P06 | system-skill-advisor | - | fail |
| P07 | system-skill-advisor | - | fail |
| P08 | system-skill-advisor | command-doctor-helper | fail |
| P09 | system-skill-advisor | - | fail |
| P10 | system-skill-advisor | system-skill-advisor | pass |
| P11 | system-skill-advisor | command-doctor-helper | fail |
| P12 | system-skill-advisor | - | fail |
| P13 | sk-code/sk-code-frontend | sk-code/sk-code-frontend | pass |
| P14 | sk-git | sk-git | pass |
| P15 | sk-doc | sk-doc/sk-create-quality-control | pass |
| P16 | mcp-tooling | mcp-code-mode | fail |
| P17 | system-spec-kit | system-spec-kit | pass |
| P18 | system-skilled-doctor | system-skilled-doctor | pass |

## Probes awaiting the critic

- P16: debug why the MCP tool call times out; expected mcp-tooling; actual skill mcp-code-mode

## Files no lane reviewed

None.

