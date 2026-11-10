# Alignment report: worktrees/314-frontend-upstream-proposals

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `worktrees/314-frontend-upstream-proposals`, base `main`
- Commits: `b478953ab7df43836c824bc849d6f3f0eeecc079` to `ad9bbed86e2d286ea6022bee8128011b76ac6596`, 23 first-parent commits
- Files: 278, of which 0 uncommitted or untracked
- Owners: 23
- Findings: 16 (P0 0, P1 5, P2 11), 8 literal, 0 inferred, 5 outside the scope; 4 more overturned by the critic and not counted
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 28 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 72 | 7 |
| S3 | Feature catalog entries | yes | 85 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 85 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 106 | 3 |
| S6 | Changelogs updated or created | yes | 84 | lens only |
| S7 | Skill routing is right | yes | 34 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 34 | 1 |
| S9 | Commands aligned | no | 0 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 15 | 9 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 28 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 49 | 1 |
| S15 | CI parity | yes | 0 | 19 |

## Battery

pass 181, fail 0, cannot run 0, not applicable 1

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1364 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 258 |
| pass | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 0 | 4884 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/cli-classifier` | 0 | 363 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/cli-external-orchestration` | 0 | 1394 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/mcp-tooling` | 0 | 1256 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/mcp-tooling/mcp-figma` | 0 | 142 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-code` | 0 | 730 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-code/sk-code-frontend` | 0 | 126 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-code/sk-code-review` | 0 | 140 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-design` | 0 | 1661 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-design/sk-design-fundamentals` | 0 | 121 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-doc` | 0 | 1360 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-doc/sk-create-skill` | 0 | 105 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-deep-loop` | 0 | 709 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 376 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 697 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/cli-classifier` | 0 | 37 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/cli-external-orchestration` | 0 | 37 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/mcp-tooling` | 0 | 40 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/mcp-tooling/mcp-figma` | 0 | 39 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-code` | 0 | 39 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-code/sk-code-frontend` | 0 | 45 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-code/sk-code-review` | 0 | 41 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-design` | 0 | 39 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-design/sk-design-fundamentals` | 0 | 35 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-doc` | 0 | 34 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-doc/sk-create-skill` | 0 | 37 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-deep-loop` | 0 | 40 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 41 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 39 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 4804 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 31 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 4757 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/cli-classifier` | 0 | 65 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/cli-external-orchestration` | 0 | 120 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/mcp-tooling` | 0 | 202 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/sk-code` | 0 | 112 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/sk-design` | 0 | 603 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/sk-doc` | 0 | 101 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-deep-loop` | 0 | 101 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 62 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 96 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | 0 | 165 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md` | 0 | 151 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/check-built-screen.md` | 0 | 152 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/node-to-token-markup.md` | 0 | 155 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/token-drift.md` | 0 | 154 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/manual-testing-playbook.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/README.md` | 0 | 181 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/ROUTER.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/SKILL.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/changelog/v3.10.0.0.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/feature-catalog/feature-catalog.md` | 0 | 172 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | 0 | 175 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md` | 0 | 167 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/shared/README.md` | 0 | 149 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/shared/references/phase-detection.md` | 0 | 151 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/shared/references/stack-detection.md` | 0 | 151 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/README.md` | 0 | 153 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/SKILL.md` | 0 | 158 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.0.0.md` | 0 | 154 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.1.0.md` | 0 | 153 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/figma-check.md` | 0 | 149 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/frontend-native.md` | 0 | 152 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/frontend-web.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/manual-testing-playbook.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` | 0 | 156 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md` | 0 | 157 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md` | 0 | 159 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md` | 0 | 169 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md` | 0 | 164 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md` | 0 | 161 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md` | 0 | 202 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/react-native-layout-and-a11y.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md` | 0 | 220 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md` | 0 | 207 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md` | 0 | 230 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/workflow-debug.md` | 0 | 231 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/workflow-implement.md` | 0 | 237 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/workflow-verify.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-review/README.md` | 0 | 225 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/SKILL.md` | 0 | 227 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/changelog/v1.1.0.0.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/manual-testing-playbook.md` | 0 | 226 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/profile-load/unknown-project.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/value-discipline/value-names-its-source.md` | 0 | 215 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md` | 0 | 214 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | 0 | 211 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.0.0.md` | 0 | 208 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.1.0.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | 0 | 197 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/SKILL.md` | 0 | 176 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.12.31.0.md` | 0 | 173 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1299 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/cli-classifier` | 0 | 57 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/cli-external-orchestration` | 0 | 65 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/mcp-tooling` | 0 | 45 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/sk-code` | 0 | 73 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/sk-design` | 0 | 42 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/sk-doc` | 0 | 41 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-deep-loop` | 0 | 59 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 81 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 176 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/cli-classifier` | 0 | 39 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/cli-external-orchestration` | 0 | 39 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/mcp-tooling` | 0 | 37 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/sk-code` | 0 | 34 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/sk-design` | 0 | 33 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/sk-doc` | 0 | 38 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/system-deep-loop` | 0 | 35 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 53706 |
| pass | P2 | no | `S5-derived-counts` | 0 | 293 |
| pass | P2 | no | `S5-readme-references` | 0 | 4035 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 34 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/cli-classifier` | 0 | 136 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/cli-external-orchestration` | 0 | 687 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/mcp-tooling` | 0 | 634 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/sk-code` | 0 | 498 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/sk-design` | 0 | 679 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/sk-doc` | 0 | 1383 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/system-deep-loop` | 0 | 462 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/cli-classifier` | 0 | 28 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/cli-external-orchestration` | 0 | 29 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/mcp-tooling` | 0 | 30 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/sk-code` | 0 | 29 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/sk-design` | 0 | 30 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/sk-doc` | 0 | 28 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/system-deep-loop` | 0 | 27 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/cli-classifier` | 0 | 10564 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/cli-external-orchestration` | 0 | 21830 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/mcp-tooling` | 0 | 28897 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/sk-code` | 0 | 23291 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/sk-design` | 0 | 24180 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/sk-doc` | 0 | 29549 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/system-deep-loop` | 0 | 6217 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 89 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 178 |
| pass | P2 | no | `S8-advisor-status` | 0 | 241 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 248 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 42 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 35 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 37 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 36 |
| pass | P0 | yes | `S11-hermes-prompts` | 0 | 36 |
| pass | P0 | yes | `S11-hermes-skills` | 0 | 168 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 35 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 65 |
| pass | P2 | no | `S13-env-tokens` | 0 | 157 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals` | 0 | 1575 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode` | 0 | 1807 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes` | 0 | 1701 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs` | 0 | 1948 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios` | 0 | 1943 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations` | 0 | 2071 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/006-open-items-and-alignment` | 0 | 1834 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 123 |
| pass | P0 | yes | `S15-ci-contract-drift` | 0 | 62 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 5909 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 2037 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 54 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 56 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 30 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 45 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1874 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 593 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 41 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 212 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 47 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1982 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3768 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 305 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1676 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .skilled/skills/system-spec-kit/SKILL.md
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .hermes/SYNC.md
- `comment-hygiene.yml`: pull_request: no path filter
- `deep-loop-runtime.yml`: pull_request: paths match .skilled/skills/system-deep-loop/graph-metadata.json
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .skilled/skills/README.txt
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-plugin-tests.yml`: pull_request: paths match .hermes/SYNC.md
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/cli-classifier/graph-metadata.json
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
- `sk-code-script-tests.yml`: pull_request: paths match .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
- `sk-doc-rename-harness.yml`: pull_request: paths match .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-advisor-stress.yml`: pull_request: paths match .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/mcp-tooling/mcp-figma/SKILL.md
- `spec-kit-check.yml`: push: paths match .skilled/skills/system-spec-kit/SKILL.md
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **A-2** P2 literal `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:138`: The contract states that a hand-curated intent_signals entry never appears in intent_signals_generated and so is never an orphan. The seed branch in write() contradicts it: on a hub's first --write, every phrase the router already declares that is present in intent_signals is recorded in intent_signals_generated, including entries no --write ever added. Reproduced in a throwaway repo holding a cop...
  - Evidence: `node generate-router-intent-signals.cjs --write (twice, in a throwaway repo whose hub was seeded from system-deep-loop with intent_signals_generated removed, then had "deep research" dropped from its ...` exit 0: WROTE deep-hub declared= 28 signals= 34 added= 0 orphans= 1 / - deep research ; intent_signals after: ["deep research"] removed

### S2 Skill docs match sk-create-skill

- **B-05** P2 literal `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:35`: SKILL.md says the packet ships one file per intent under manual-testing-playbook/frontend-surface/, but the surface router declares 14 intents and the folder holds 3 scenario files. The packet's own playbook index and the v1.0.1.0 changelog both describe one scenario per intent family. A reader checking coverage from SKILL.md would look for 11 files that were never planned.
  - Evidence: `rg -c '": \{"weight"' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md; ls .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/*.md | wc -l; rg -o 'one file per intent'...` exit 0: 14 3 one file per intent

### S5 READMEs match sk-create-readme, root included

- **C-01** P1 literal `README.md:830`: The root README still lists React Native among the stacks sk-code does not support, two lines above the bullet that announces the frontend surface as carrying React Native practice, and against line 1576 of the same file. Commit 481d5e7096 fixed the identical sentence in .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md (final wording: Go, Swift, Next.js server ...
  - Evidence: `git -c core.fsmonitor=false blame -L 830,831 README.md` exit 0: 830 d24db803b6dd (untouched by this branch) - Unsupported stacks (Go, React/Next.js, generic Node.js, React Native, Swift) trigger a quick disambiguation question | 831 dddc000f7e05 (this branch) - Three surfaces. ... The Frontend surface holds stack-agnostic web and React Native frontend practice

### S6 Changelogs updated or created

- **C-03** P1 literal `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.1.0.md:33`: Commit 2db7c31d3e changed routing after this entry was written: it added keyboard focus, accessibility labels, react native flatlist and figma frame to the packet router and bumped sk-code-frontend/ROUTER.md from 1.0.0.0 to 1.0.1.0, and it also bumped the hub ROUTER.md from 2.3.12.0 to 2.3.13.0 for the mirrored copy of the same keywords. That commit carries no changelog file in any stream, so the ...
  - Evidence: `git -c core.fsmonitor=false show 2db7c31d3e -- .skilled/skills/sk-code/sk-code-frontend/ROUTER.md && grep -n 'Routing is unchanged' .skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.1.0.md` exit 0: ...TIVE_A11Y gaining 'accessibility labels', NATIVE_LISTS_MOTION gaining 'react native flatlist' and FIGMA_TO_CODE gaining 'figma frame'; the commit's file list holds no changelog path; changelog line 33 reads: - **Routing is unchanged.** The intent signals and the resource map are the same as v1.0.0.0

### S7 Skill routing is right

- **D-01** P2 literal `.skilled/skills/sk-code/hub-router.json:7`: The new surface is ranked behind the existing CI surface in routerPolicy.tieBreak. parent-skills-nested-packets.md:249 (row 3 of the integration list) says to place a new surface mode "after the workflow modes and ahead of the existing surface modes", and the v3.10.0.0 changelog justifies only the fallback keeping last place. The documented failure is losing a keyword tie to the surfaces already t...
  - Evidence: `node -e 'const j=require("./.skilled/skills/sk-code/hub-router.json"); console.log(j.routerPolicy.tieBreak.join(", "))'` exit 0: sk-code-quality, sk-code-review, sk-code-ci, sk-code-frontend, sk-code-skilled
- **D-02** P2 literal `.skilled/skills/sk-code/description.json:3`: The hub description gained the sk-code-frontend keyword and the 3.10.0.0 version, but its description string still advertises only this framework own system code. Row 8 of the integration list names "keywords and description" as the doctor metadata surface, so the one human-readable advertisement of the hub omits the third surface while its keyword list carries it. The CI surface has the same omis...
  - Evidence: `node -e 'const d=require("./.skilled/skills/sk-code/description.json"); console.log("mentions frontend/web/native/figma:", /frontend|web|native|figma/i.test(d.description))'` exit 0: mentions frontend/web/native/figma: false

### S8 Skill integrated in system-skill-advisor

- **PRB-01** P1 judgment: Probe P03 "check where the focus ring sits on this button and add an accessible label" expected sk-code; top-1 was sk-design/sk-design-fundamentals.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check where the focus ring sits on this button and add an accessible label"}' --format json` exit 0: top-1 was sk-design/sk-design-fundamentals
- **D-06** P2 judgment `.skilled/skills/sk-code/hub-router.json:87`: A plain operator prompt for the new surface accessibility work routes top-1 to sk-design-fundamentals. The frontend alias class declares "focus visible styling", "keyboard focus" and "accessibility labels", while .skilled/skills/sk-design/graph-metadata.json:81 and :98 declare "focus ring accessibility" and "aria label missing", so the phrase an operator actually types for this work lands on the d...
  - Evidence: `node .skilled/commands/assets/local-lsa-worktree-copy/run-probes.cjs --probes probes-final.json --out probes-final-out.json --timeout-ms 60000` exit 1: fail D03 want=sk-code got=sk-design/sk-design-fundamentals STATUS=FINDINGS run-probes: pass=9 fail=1 cannot_run=0

### S11 Runtime mirrors

- **D-03** P2 judgment `.hermes/SYNC.md:24`: The cell the branch edited counts its own inventory as 55 canonical SKILL.md copies plus 11 agent copies, which is 66 folders, then states "61 of the 68" and "The other seven are quarantined". The 68 predates the branch (main read 56 + 12 = 68) and only the first two numbers were corrected, so the cell now contradicts itself inside one sentence. The 61 of 68 figure is a live operator measurement d...
  - Evidence: `printf 'canonical=%s dirs=%s\n' "$(find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' | wc -l | tr -d ' ')" "$(ls .hermes/skills | wc -l | tr -d ' ')"; grep -o '61 of the 68' .hermes/SY...` exit 0: canonical=55 dirs=66 61 of the 68

### S14 Spec packets validate (changed-packet-validation replay)

- **CR-1** P1 judgment `specs/sk-code/018-frontend-upstream-proposals/006-open-items-and-alignment/implementation-summary.md:40`: The phase that closes the packet ships an unfilled template implementation summary stamped Completed while the same phase says nothing has started. 006/spec.md is Status Draft, all 7 acceptance criteria are Unmet with Closeable: No, and 0 of 29 tasks are checked, yet the summary records Completed 2026-11-03 and still holds 6 [YOUR_VALUE_HERE] or [FILL:] placeholders. The parent spec.md says Status...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/314-frontend-upstream-proposals && P=specs/sk-code/018-frontend-upstream-proposals; printf 'impl-summary placeholders=%s completed=%s\n' "$(grep -c 'YOUR_V...` exit 0: ...eable=Closeable:** No status=**Status:** Draft tasks checked=0 unchecked=29 parent status=| **Status** | Complete | phase-row=| 6 | 006-open-items-and-alignment/ | [Phase 6 scope] | Pending | evidence MISSING scratch/alignment-1/recheck.md evidence MISSING scratch/reach-final.txt ℹ pass 101 ℹ fail 0
- **CR-2** P2 literal `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/implementation-summary.md:52`: A-2 corrects the claim that a hand-curated intent signal is never recorded in intent_signals_generated, and this packet states the same rule as fact in two places the lane did not name: this implementation summary line 52 and decision-record.md line 65. The shipped write() contradicts both. On a hub whose graph-metadata.json has no intent_signals_generated array, write() seeds it from every existi...
  - Evidence: `cd /Users/michelkerkmeester/worktrees/public/314-frontend-upstream-proposals && grep -n 'Hand-curated signals are never\|A hand-curated signal is never' specs/sk-code/018-frontend-upstream-proposals/0...` exit 0: ... from the declared phrases already present lets a later router rename read as an orphan. const declaredSet = new Set(p.declared.map((s) => String(s).toLowerCase())); const seed = Array.isArray(p.meta.intent_signals_generated) ? [] : p.existing.filter((s) => declaredSet.has(String(s).toLowerCase()));

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **B-01** P1 literal `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:155`: The section 6 UNKNOWN row still lists React Native among the stacks sk-code does not own, and this file is always loaded: sk-code/ROUTER.md:86 makes it part of the DEFAULT_RESOURCE preamble every sk-code invocation reads. The hub's own SKILL.md:50 now declares the sk-code-frontend surface to be the stack-agnostic web and React Native practice surface, and this branch corrected the same list in man... [S2, B]
  - Evidence: `rg -o 'does not own Go, React/Next\.js, generic Node\.js, React Native or Swift\.' .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md; rg -o 'stack-agnostic web and React Na...` exit 0: does not own Go, React/Next.js, generic Node.js, React Native or Swift. stack-agnostic web and React Native practice
- **B-02** P2 judgment `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:152`: Section 6 states that this file is the contract and the surface checklists are the implementations, and its surface table spans lines 149 to 155 with rows for SKILLED, CI, Declared specific surface and UNKNOWN. There is no Frontend row. The new surface deliberately declares no quality checklists (sk-code-frontend/SKILL.md section 3, and phase-detection.md assigns its Phase 1.5 to sk-code-quality w... [S2, B]
  - Evidence: `awk 'NR>=150 && NR<=155 {split($0,a,"|"); printf "%d: %s\n", NR, a[2]}' .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` exit 0: 150: Surface 151: ------- 152: SKILLED 153: CI 154: Declared specific surface 155: UNKNOWN
- **B-06** P2 judgment `.skilled/skills/sk-doc/sk-create-skill/scripts/README.md:31`: The contents row for generate-router-intent-signals.cjs still says that --check reports drift and --write applies it. Since v1.10.0.0, --check also names and counts orphaned intent signals and exits 1 on them, --write prunes those orphans from intent_signals and intent_signals_generated, and intent_signals_keep pins a generated phrase that should outlive its router entry. The script header and ref... [S2, B]
  - Evidence: `rg -o '`--check` reports drift, `--write` applies it\.' .skilled/skills/sk-doc/sk-create-skill/scripts/README.md; rg -o 'names and counts orphans and fails' .skilled/skills/sk-doc/sk-create-skill/scri...` exit 0: `--check` reports drift, `--write` applies it. names and counts orphans and fails intent_signals_keep
- **B-04** P2 judgment `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md:24`: This entry, and the matching Current Reality paragraph at feature-catalog/feature-catalog.md:55, describe the replay as reading INTENT_SIGNALS and RESOURCE_MAP only, scoring a hit with the intent's weight, and scoring a 64-row gold. v1.10.1.0 shipped three behaviors neither entry describes: the replay reads INTENT_MODEL when no INTENT_SIGNALS block is declared, a (phrase, weight) tuple scores its ... [S3, B]
  - Evidence: `node -e 'const r=require("./.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs");const p=r.parseRouter("INTENT_MODEL = {\"A\": {\"weight\": 4, \"keywords\": [(\"alpha phrase\", 9)]}}...` exit 0: INTENT_MODEL intents: {"A":{"weight":4,"keywords":[["alpha phrase",9]]}} tuple score: [{"intent":"A","score":9}] 64-row committed gold 64-row committed gold total gold=65 scored=57 tied=4 mean_f1=0.9156 exact=49
- **D-04** P2 judgment `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-alone-ci-compiled-routing.md:8`: compiled-route-admission reports the new surface as the only uncovered mode on sk-code: 0 gold scenarios against 1 for sk-code-ci and 3 for sk-code-skilled. The hub playbook holds one surface-alone scenario per surface (this file declares expected_intent: sk-code-ci, surface-alone-skilled-compiled-routing.md:8 declares sk-code-skilled) and none for sk-code-frontend, so a change to the frontend com... [S7, D]
  - Evidence: `node .skilled/bin/compiled-route-admission.cjs --hub sk-code --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const h=JSON.parse(s).hubs[0];console.log("uncovered:",JSON.strin...` exit 0: uncovered: ["sk-code-frontend"] | frontend scenarios: 0 | enforced: false

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **D-05** P2 literal `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md:11`: The scenario now calls frontend practice one of the supported stacks. shared/references/stack-detection.md:34 says the opposite for detection: sk-code-frontend declares no detection block, so detection never returns it. A surface-detection scenario that names an undetectable packet a supported stack teaches an operator to expect FRONTEND as a detection result the router can never produce, and the ... [S7, D]
  - Evidence: `sed -n '11p' .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md; sed -n '34p' .skilled/skills/sk-code/shared/references/stack-detection.md` exit 0: ...d` carries. Everything else (Go, Swift, Next.js server code, generic Node.js) is UNKNOWN and MUST trigger a disambiguation question. `sk-code-ci` and `sk-code-frontend` are surface packets with no detection block. The hub bundles each from request vocabulary alone, so detection never returns either.
  - Critic override: refuted, lane severity P2. The two files answer different questions and agree on the one the scenario grades. stack-detection.md:34 states that surface detection never returns a packet with no detection block, which remains true. unknown-fallback.md:11 states which stacks the hub supports, and frontend is supported because the hub bundles it from request vocabulary; the same sentence still lists Go, Swift, Next.js server co...

### duplicate

- **B-03** P2 literal `README.md:830`: The sk-code bullet list says unsupported stacks, React Native among them, trigger a quick disambiguation question. The next bullet, line 831 and edited by this branch, says the Frontend surface holds stack-agnostic web and React Native frontend practice. compiled-route.cjs now routes a request that names a covered frontend concern to sk-code-frontend, so React Native is a supported stack; a vague ... [none listed, B]
  - Evidence: `rg -o 'Unsupported stacks \([^)]*\)' README.md; rg -o 'The Frontend surface holds stack-agnostic web and React Native frontend practice' README.md; rg -n 'Unsupported stacks' README.md | cut -c1-12` exit 0: Unsupported stacks (Go, React/Next.js, generic Node.js, React Native, Swift) The Frontend surface holds stack-agnostic web and React Native frontend practice The Frontend surface holds stack-agnostic web and React Native frontend practice 830:- Unsupp
  - Critic override: duplicate, lane severity P2. Same claim as C-01 at README.md:830. C-01 is canonical; this adds only the observation that README.md fires no named surface.
- **A-1** P2 judgment `README.md:830`: The CODE WORKFLOW block lists React Native among the stacks that "trigger a quick disambiguation question", while the bullet one line below, changed by this branch, says the Frontend surface holds "stack-agnostic web and React Native frontend practice". The same change removed React Native from the unsupported list in sk-code's own playbook (manual-testing-playbook/surface-detection/unknown-fallba... [S1, A]
  - Evidence: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "react native flatlist jank on scroll"` exit 0: action=route targets=sk-code-frontend (same flag with "implement the react native checkout screen" returns action=defer)
  - Critic override: duplicate, lane severity P2. Same file and line as C-01: README.md:830, the React Native entry in the unsupported-stacks bullet. C-01 carries the blame evidence and the literal repair, and its wording matches the fix the branch already chose in unknown-fallback.md. Keep C-01 as canonical and treat A-1's softer decision note as the reasoning behind it.
- **C-02** P2 literal `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:155`: The UNKNOWN row of the surface checklist table, the row an agent reads when the quality gate resolves no surface, still says sk-code does not own React Native. The same branch added sk-code-frontend and taught both of this table's sibling files (shared/references/stack-detection.md and shared/references/phase-detection.md) about it, so this row is the one place left that denies the shipped surface... [S5, C]
  - Evidence: `grep -rn 'React Native' .skilled/skills/sk-code/shared/ .skilled/skills/sk-code/sk-code-quality/ .skilled/skills/sk-code/sk-code-review/` exit 0: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:155 is the only remaining unowned-React-Native claim in the shared tree; the sk-code-review README row and the frontend packet describe it as covered
  - Critic override: duplicate, lane severity P2. Same file and row as B-01: code-quality-standards.md:155. Keep B-01, which carries the always-loaded evidence from ROUTER.md:86. When the fix lands, use the wording the branch already chose in unknown-fallback.md, 'Go, Swift, Next.js server code, generic Node.js', rather than keeping React/Next.js in the unsupported list.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | sk-code | sk-code/sk-code-review | pass |
| P02 | sk-code/sk-code-frontend | sk-code/sk-code-frontend | pass |
| P03 | sk-code | sk-design/sk-design-fundamentals | fail |
| P04 | sk-code/sk-code-frontend | sk-code/sk-code-frontend | pass |
| P05 | sk-design/sk-design-fundamentals | sk-design/sk-design-fundamentals | pass |
| P06 | sk-design/sk-design-fundamentals | sk-design/sk-design-fundamentals | pass |
| P07 | sk-doc | sk-doc | pass |
| P08 | system-spec-kit | system-spec-kit | pass |
| P09 | sk-git | sk-git | pass |
| P10 | sk-doc | sk-doc/sk-create-readme | pass |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `specs/sk-code/graph-metadata.json`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/004-compiler-n1-shadow/compiler/evaluator.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/004-compiler-n1-shadow/compiler/projections.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/lib/policy-card.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/policy-card.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/lib/router.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/lib/router.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/policy-card.cjs`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/mcp-tooling/manifest.json`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json`

