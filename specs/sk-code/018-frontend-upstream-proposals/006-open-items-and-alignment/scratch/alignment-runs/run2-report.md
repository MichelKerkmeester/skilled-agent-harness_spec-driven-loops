# Alignment report: worktrees/314-frontend-upstream-proposals

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `worktrees/314-frontend-upstream-proposals`, base `origin/main`
- Commits: `22cf3c3601b6a6243d7c804c2824094a2535b38c` to `5117366374269613a225cbfe47df9c1906b8724d`, 10 first-parent commits
- Files: 293, of which 72 uncommitted or untracked
- Owners: 14
- Findings: 45 (P0 3, P1 9, P2 33), 10 literal, 0 inferred, 9 outside the scope; 7 more overturned by the critic and not counted
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 39 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 53 | 7 |
| S3 | Feature catalog entries | yes | 64 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 64 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 137 | 3 |
| S6 | Changelogs updated or created | yes | 122 | lens only |
| S7 | Skill routing is right | yes | 25 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 25 | 1 |
| S9 | Commands aligned | yes | 58 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 70 | 9 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 39 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 49 | 1 |
| S15 | CI parity | yes | 0 | 19 |

## Battery

pass 116, fail 19, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1295 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 274 |
| fail | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 2 | 1058 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/mcp-tooling/mcp-figma` | 0 | 143 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-code` | 0 | 997 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-code/sk-code-frontend` | 0 | 127 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-design/sk-design-fundamentals` | 0 | 168 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-doc` | 0 | 1817 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-doc/sk-create-skill` | 0 | 187 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/mcp-tooling/mcp-figma` | 0 | 110 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-code` | 0 | 49 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-code/sk-code-frontend` | 0 | 47 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-design/sk-design-fundamentals` | 0 | 47 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-doc` | 0 | 44 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-doc/sk-create-skill` | 0 | 45 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6836 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 40 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 6829 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/mcp-tooling` | 0 | 186 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/sk-code` | 0 | 108 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/sk-design` | 0 | 733 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/sk-doc` | 0 | 100 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | 0 | 203 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md` | 0 | 204 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/check-built-screen.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/node-to-token-markup.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/token-drift.md` | 0 | 190 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/manual-testing-playbook.md` | 0 | 195 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/README.md` | 0 | 224 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/ROUTER.md` | 0 | 231 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/SKILL.md` | 0 | 239 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/changelog/v3.10.0.0.md` | 0 | 237 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/feature-catalog/feature-catalog.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | 0 | 245 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/shared/README.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/shared/references/phase-detection.md` | 0 | 233 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/shared/references/stack-detection.md` | 0 | 247 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/README.md` | 0 | 242 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | 0 | 249 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/SKILL.md` | 0 | 252 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.0.0.md` | 0 | 254 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` | 1 | 257 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md` | 0 | 263 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md` | 1 | 254 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md` | 1 | 242 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md` | 1 | 240 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md` | 1 | 249 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md` | 1 | 241 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/react-native-layout-and-a11y.md` | 0 | 240 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md` | 1 | 238 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md` | 1 | 244 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md` | 1 | 242 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md` | 1 | 242 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md` | 1 | 239 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` | 1 | 237 |
| fail | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md` | 1 | 236 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/workflow-debug.md` | 0 | 238 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/workflow-implement.md` | 0 | 252 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/workflow-verify.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/SKILL.md` | 0 | 259 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/changelog/v1.1.0.0.md` | 0 | 268 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/manual-testing-playbook.md` | 0 | 271 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/profile-load/unknown-project.md` | 0 | 249 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/value-discipline/value-names-its-source.md` | 0 | 261 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md` | 0 | 283 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | 0 | 300 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.0.0.md` | 0 | 295 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.1.0.md` | 0 | 295 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | 0 | 301 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 2258 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/mcp-tooling` | 0 | 64 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/sk-code` | 0 | 114 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/sk-design` | 0 | 63 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/sk-doc` | 0 | 58 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 308 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/mcp-tooling` | 0 | 57 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/sk-code` | 0 | 58 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/sk-design` | 0 | 54 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/sk-doc` | 0 | 58 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 48832 |
| pass | P2 | no | `S5-derived-counts` | 0 | 344 |
| fail | P2 | no | `S5-readme-references` | 1 | 5671 |
| fail | P0 | yes | `S7-skill-graph-freshness` | 1 | 47 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/mcp-tooling` | 0 | 1215 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/sk-code` | 0 | 913 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/sk-design` | 0 | 1133 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/sk-doc` | 0 | 2087 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/mcp-tooling` | 0 | 42 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/sk-code` | 0 | 39 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/sk-design` | 0 | 42 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/sk-doc` | 0 | 43 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/mcp-tooling` | 0 | 22645 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/sk-code` | 0 | 21103 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/sk-design` | 0 | 23599 |
| fail | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/sk-doc` | 1 | 21635 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 90 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 196 |
| pass | P2 | no | `S8-advisor-status` | 0 | 193 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 41 |
| fail | P2 | no | `S9-command-references` | 1 | 60 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 348 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 254 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 39 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 35 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 40 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 36 |
| pass | P0 | yes | `S11-hermes-prompts` | 0 | 35 |
| pass | P0 | yes | `S11-hermes-skills` | 0 | 143 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 34 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 57 |
| pass | P2 | no | `S13-env-tokens` | 0 | 169 |
| fail | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals` | 1 | 1572 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode` | 0 | 1666 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes` | 0 | 1689 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs` | 0 | 1500 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios` | 0 | 1478 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations` | 0 | 1608 |
| pass | P0 | yes | `S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals/006-open-items-and-alignment` | 0 | 1425 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 95 |
| not_applicable | P2 | no | `S15-ci-contract-drift` | - | 0 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 5510 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 2104 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 54 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 50 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 30 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 45 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1741 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 556 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 35 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 168 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 46 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1691 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3708 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 255 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1300 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .hermes/skills/mcp-figma/SKILL.md
- `comment-hygiene.yml`: pull_request: no path filter
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .skilled/commands/assets/lsa-worktree-copy/aggregate-findings.cjs
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-plugin-tests.yml`: pull_request: paths match .hermes/skills/mcp-figma/SKILL.md
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/mcp-tooling/mcp-figma/SKILL.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
- `sk-code-script-tests.yml`: pull_request: paths match .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
- `sk-doc-rename-harness.yml`: pull_request: paths match .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/mcp-tooling/mcp-figma/SKILL.md
- `spec-kit-check.yml`: push: paths match .skilled/commands/assets/lsa-worktree-copy/aggregate-findings.cjs
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **BAT-01** P0 judgment `.skilled/skills/system-spec-kit/runtime/cli`: S1-package-check failed for .skilled/skills/system-spec-kit/runtime/cli (exit 2).
  - Evidence: `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` exit 2: ...pstream-proposals/.skilled/skills/system-spec-kit/runtime/cli npm error workspace @spec-kit/cli@1.7.2 npm error location /Users/michelkerkmeester/worktrees/public/314-frontend-upstream-proposals/.skilled/skills/system-spec-kit/runtime/cli npm error command failed npm error command sh -c tsc --noEmit
  - CI runs this command: spec-kit-check.yml > check > CLI check gate and typecheck
- **A-3** P2 judgment `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:60`: Folding hyphens in both the needle and the haystack makes a hub's two spellings of one phrase both hit, so scoreModes() counts a single mention twice: score = matching keyword count * mode weight. Five hubs declare such a pair in one vocabulary class (sk-code 'code quality'/'code-quality', system-deep-loop 'deep-research'/'deep research', mcp-tooling, cli-classifier, cli-external-orchestration has...
  - Evidence: `node -e 'const S=require("./.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"); console.log(JSON.stringify(S.scoreIntents("code quality pass",{QUALITY:{weight:4,keywords:["code qua...` exit 0: both spellings: [{"intent":"QUALITY","score":8}] ; hyphen spelling only: [{"intent":"QUALITY","score":4}] ; hyphen hit: true ; spaced hit: true
- **A-4** P2 literal `.skilled/skills/sk-code/graph-metadata.json:291`: The hub's causal_summary still says the hub bundles 'one of two read-only surface evidence packets (sk-code-ci, sk-code-skilled)', while this branch adds sk-code-frontend as a third surface everywhere the machine reads it: SKILL.md, README.md, feature-catalog.md, description.json, mode-registry.json, hub-router.json, leaf-manifest.json and verify-router-sync.cjs. sk-code/README.md line 135 names t...
  - Evidence: `grep -n 'one of two read-only surface evidence packets' .skilled/skills/sk-code/graph-metadata.json` exit 0: 291: "causal_summary": "sk-code is the single public code skill that routes a request through mode-registry.json to two workflow modes (sk-code-quality, sk-code-review) or bundles one of two read-only surface evidence packets (sk-code-ci, sk-code-skilled) over a shared surface-detection router.

### S2 Skill docs match sk-create-skill

- **B-01** P1 judgment `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:19`: The new packet's topic references break the repository document standard: 12 of the 15 non-symlink reference files fail validate_document.py with a blocking missing_required_section: overview, because each starts section 1 straight into detail (figma-to-code.md:19 '## 1. THE RULE'; native-accessibility.md '## 1. ROLE AND STATE ALIASES'; native-inputs-and-keyboard.md '## 1. KEYBOARD AVOIDANCE'; nat...
  - Evidence: `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` exit 1: INVALID: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md / Document type: reference / Total issues: 1 / Blocking errors (1): - [missing_required_section] Missing required section: overview
- **B-02** P1 literal `.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md:188`: The same validator run reports a second blocking class the packet never ran: general_h2_separator. A numbered ALL-CAPS H2 must be preceded by a '---' divider, and three new references place one directly after the previous section's last line: web-markup-and-css.md:188 ('## 9. PRE-COMPLETION CHECKLIST'), web-accessibility-patterns.md:47 ('## 3. NAMES AND FOCUS') and web-internationalization.md:107 ...
  - Evidence: `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` exit 1: INVALID: .../web-markup-and-css.md / Total issues: 1 / Blocking errors (1): - [general_h2_separator] Numbered ALL-CAPS H2 sections must be separated by `---`. Line: ## 9. PRE-COMPLETION CHECKLIST...
- **B-03** P1 literal `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:100`: Two references in the same new packet contradict each other on the command that produces Pass 3a evidence. figma-to-code.md:100 tells the operator to read resolved styles 'from bdg dom eval and getComputedStyle', while web-markup-and-css.md:165 records that exact call failing ('bdg dom eval failed with "Session target not found" in the same session, so use Runtime.evaluate') and the packet's own m...
  - Evidence: `rg -n "bdg dom eval" .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` exit 0: ...e.md:100:| 3a. Render token check | Web: resolved styles from bdg dom eval and getComputedStyle. ... web-markup-and-css.md:165:- Read resolved styles for Pass 3a with `bdg cdp Runtime.evaluate ...`. `bdg dom eval` failed with "Session target not found" in the same session, so use `Runtime.evaluate`.
- **B-05** P2 literal `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:29`: The stated count and the stated glob disagree with the tree. SKILL.md:29 says 'The six `web-*.md` and five `native-*.md` topic files', and README.md:52 repeats it as '| `references/web-*.md` | Six focused topics: ...'. `web-*.md` matches seven files because web-markup-and-css.md, the web stack layer, carries the same prefix; `native-*.md` matches exactly five because the native stack layer is reac...
  - Evidence: `ls .skilled/skills/sk-code/sk-code-frontend/references/web-*.md | wc -l` exit 0: 7 (and: ls .skilled/skills/sk-code/sk-code-frontend/references/native-*.md | wc -l -> 5)
- **B-07** P2 literal `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md:233`: The new hand-off line points at a path that resolves from nowhere as written. It reads 'the five-pass check in `sk-code/sk-code-frontend/references/figma-to-code.md`', which is neither skill-relative (the file's other paths, such as `references/figma-cli-reference.md` and `scripts/install.sh`, are) nor repo-root-relative (that would start `.skilled/skills/`). The packet's own scenario writes the f...
  - Evidence: `rg -n "sk-code/sk-code-frontend" .skilled/skills/mcp-tooling/mcp-figma/SKILL.md` exit 0: 233:A Figma read that feeds code ends at the five-pass check in `sk-code/sk-code-frontend/references/figma-to-code.md`.
- **BAT-02** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-03** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-04** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-05** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-06** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-07** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-08** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md` exit 1: ...ing errors (2): - [general_h2_separator] Numbered ALL-CAPS H2 sections must be separated by `---`. Line: ## 3. NAMES AND FOCUS... Fix: Add `---` immediately above the numbered H2 section. - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-09** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-10** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-11** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md` exit 1: ... (2): - [general_h2_separator] Numbered ALL-CAPS H2 sections must be separated by `---`. Line: ## 5. TRANSLATION-TOLERANT TEXT... Fix: Add `---` immediately above the numbered H2 section. - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-12** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"
- **BAT-13** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` exit 1: ...code/sk-code-frontend/references/web-markup-and-css.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [general_h2_separator] Numbered ALL-CAPS H2 sections must be separated by `---`. Line: ## 9. PRE-COMPLETION CHECKLIST... Fix: Add `---` immediately above the numbered H2 section.
- **BAT-14** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md`: S2-validate-document failed for .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md` exit 1: ❌ INVALID: .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md Document type: reference Total issues: 1 🚫 Blocking errors (1): - [missing_required_section] Missing required section: overview Fix: Add section with name containing "overview"

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-09** P2 judgment `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:61`: The new surface ships no manual-testing-playbook, so nothing replays its routing. Both sibling surfaces ship a packet-level playbook (sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md, sk-code-skilled/manual-testing-playbook/), and the hub playbook explains why that matters at line 47: the router-sync guard 'replays packet-level playbooks only'. verify-router-sync.cjs:283 skips a packet ...
  - Evidence: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` exit 0: PASS check 1b: every routable reference or asset doc is routed / PASS check 4: playbook expected_resource is emitted by the router / router-sync: 5/5 checks passed (check 4 skips at line 283 when a packet has no manual-testing-playbook)

### S5 READMEs match sk-create-readme, root included

- **BAT-15** P2 judgment: S5-readme-references failed (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/bin/README.md .skilled/skills/mcp-tooling/README.md .skilled/skills/mcp-tooling/mcp-figma/README.md .skilled...` exit 1: ...t/README.md: references=307 unresolved=0 examples=0 allowed=1 line 237: inline '/Users/me/code/my-app': names a machine-local path outside the repository line 240: inline 'CLAUDE.md': path does not exist FAIL README.md: references=443 unresolved=2 examples=0 allowed=0 SUMMARY files=11 pass=10 fail=1
- **C-06** P2 literal `.skilled/skills/sk-code/sk-code-frontend/README.md:66`: The section 4 verification row claims its rg check prints "the machine-router heading and its resource declarations", but the first alternation is ## MACHINE ROUTER and the heading is ## 3. MACHINE ROUTER, so that branch can never match. The command exits 0 and prints three of the four patterns, so an operator reads a pass while the heading half of the stated output was never produced.
  - Evidence: `rg -n "## MACHINE ROUTER|^INTENT_SIGNALS|^RESOURCE_MAP|^DEFAULT_RESOURCE" .skilled/skills/sk-code/sk-code-frontend/ROUTER.md; grep -n "^## 3. MACHINE ROUTER" .skilled/skills/sk-code/sk-code-frontend/R...` exit 0: 68:DEFAULT_RESOURCE = ["references/frontend-practice.md"] / 70:INTENT_SIGNALS = { / 87:RESOURCE_MAP = { (no heading line printed) | 65:## 3. MACHINE ROUTER

### S6 Changelogs updated or created

- **X-4** P2 literal `.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md:21`: The changelog repeats the unresolvable path B-07 reports in `SKILL.md`. `sk-code/sk-code-frontend/references/figma-to-code.md` is neither skill-relative nor repo-root-relative; the scenario files and the frontend packet use `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`. B-07's fix covers only the SKILL.md occurrence, so a literal fix of that finding leaves this line wrong....
  - Evidence: `rg -n "sk-code/sk-code-frontend" .skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md .skilled/skills/mcp-tooling/mcp-figma/SKILL.md` exit 0: ...eds code ends at the five-pass check in `sk-code/sk-code-frontend/references/figma-to-code.md`. .skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md:21:- **The check is named.** A Figma read that feeds code ends at the five-pass check in `sk-code/sk-code-frontend/references/figma-to-code.md`.

### S7 Skill routing is right

- **BAT-16** P0 judgment: S7-skill-graph-freshness failed (exit 1).
  - Evidence: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exit 1: ...MATCH SQLite vs disk: none GHOST (in compiled json, not on disk): none MISSING (on disk, not in compiled json): none FAMILY MISMATCH compiled vs disk: none SIGNAL DRIFT compiled vs disk: sk-code NULL derived timestamp: none (report-only - the canonical reindex is operator-gated; nothing was written)
  - CI runs this command: routing-registry-drift.yml > routing-drift > Compiled skill graph freshness - compiled json matches graph-metadata
- **X-1** P1 judgment `.skilled/skills/sk-code/ROUTER.md:219`: Section 6 now says canonical sk-code owns the stack-agnostic `sk-code-frontend` surface for web and React Native practice (line 195), but the section 7 DO NOT list still says `Load Go/NextJS/React Native resources (those live in the Barter fork)` (line 219). The branch replaced the section 6 paragraph and left section 7 unchanged, so one file both requires and forbids the new native references. An...
  - Evidence: `grep -n "Canonical sk-code owns\|Load Go/NextJS/React Native" .skilled/skills/sk-code/ROUTER.md` exit 0: ... the SKILLED surface, the `sk-code-ci` GitHub Actions surface and the stack-agnostic `sk-code-frontend` surface for web and React Native practice. Project-specific Go, Next.js or React Native surfaces live in a project fork. 219:- Load Go/NextJS/React Native resources (those live in the Barter fork)
- **BAT-17** P2 judgment `.skilled/skills/sk-doc`: S7-router-vocabulary-reach failed for .skilled/skills/sk-doc (exit 1).
  - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub sk-doc` exit 1: ... declared=249 wrong-hub= 0 outranked= 1 no-reach= 0 allowed= 7 probe-error= 0 operator-local= 0 outranked operator validation system-spec-kit=0.8339, sk-doc=0.8298 checked=1 hub(s), wrong-hub=0, outranked=1, no-reach=0, allowed=7, probe-error=0, operator-local=0 advisor generation: 51 RESULT: FAILED
- **D-01** P2 judgment `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:97`: The release adds provenance-based orphan pruning, but write() only records phrases it adds on a later run: when intent_signals_generated is absent it is never created, and every hub already holds its router phrases, so p.missing is empty and the guard returns before writing. All 739 router-declared phrases across the seven hubs (97 in sk-code alone) have no provenance, so the rename case the relea...
  - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check; for h in sk-code system-deep-loop mcp-tooling cli-external-orchestration cli-classifier sk-doc sk-design...` exit 0: ...SSED sk-code signals=135 generated=ABSENT system-deep-loop signals=34 generated=ABSENT mcp-tooling signals=130 generated=ABSENT cli-external-orchestration signals=96 generated=ABSENT cli-classifier signals=44 generated=ABSENT sk-doc signals=265 generated=ABSENT sk-design signals=219 generated=ABSENT
  - Critic override: severity P1 to P2. The upgrade note in sk-create-skill v1.10.0.0 already states that a phrase generated before the release is not tracked and must be removed by hand once, so this is a documented migration limit and a hardening item, not a correctness bug. The seed-on-first-write suggestion remains the right improvement.
- **D-08** P2 judgment `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:3`: The branch added the new packet directory to the frozen manifest by hand and left derived_count at 766 while directories now holds 767 entries; on origin/main the two fields matched at 766. The manifest test still fails, and the two directories it names were added on origin/main by 7aeb4db9be, so they predate this branch. Fix: rerun the documented regenerate command rather than hand-adding one pat...
  - Evidence: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py; python3 -c "import json;d=json.load(open('.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json'));prin...` exit 1: ...illed/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation, .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/outcomes; removed: none) derived_count 766 directories 767
- **X-2** P2 judgment `.skilled/skills/sk-code/hub-router.json:88`: The new surface's 27 aliases are exact phrases that miss the probe prompts authored for it. `compiled-route --hub sk-code` sends `Debug the React Native FlatList that drops frames while I scroll the feed` to `sk-code-skilled` alone (the framework-code fallback, no workflow mode), and returns `defer` for `Add keyboard focus handling and accessibility labels to my native dialog component` and `Imple...
  - Evidence: `for p in "Debug the React Native FlatList that drops frames while I scroll the feed" "Implement this Figma frame as component markup and check the spacing against our tokens" "Add keyboard focus handl...` exit 0: ...d":null,"targets":[],"effectivePolicyHash":"3eeeccd336d22b6c481622592c13fcb6bbc0bc8631417fbbb948c42d12798df4","generation":2} {"hubId":"sk-code","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"3eeeccd336d22b6c481622592c13fcb6bbc0bc8631417fbbb948c42d12798df4","generation":2}

### S9 Commands aligned

- **BAT-18** P2 judgment: S9-command-references failed (exit 1).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: ...nds/doctor/assets/doctor-update-record-base.yaml:62 [skill-asset] .skilled/skills/.state/doctor-update/.apply.lock - path does not exist on disk .skilled/commands/doctor/assets/doctor-update-rollback.yaml:52 [skill-asset] .skilled/skills/.state/doctor-update/.apply.lock - path does not exist on disk

### S14 Spec packets validate (changed-packet-validation replay)

- **BAT-19** P0 judgment `specs/sk-code/018-frontend-upstream-proposals`: S14-packet-validate failed for specs/sk-code/018-frontend-upstream-proposals (exit 1).
  - Evidence: `node .skilled/commands/assets/lsa-worktree-copy/validate-packet.cjs specs/sk-code/018-frontend-upstream-proposals` exit 1: ...iolation(s) (enforced): graph-metadata.json: SOURCE_FINGERPRINT_MISMATCH: source_fingerprint does not match a re-derive of the current source docs, the stored derived fields may be stale FAIL specs/sk-code/018-frontend-upstream-proposals: error rules GENERATED_METADATA_INTEGRITY (validate.sh exit 2)
  - CI runs this command: changed-packet-validation.yml > changed-packets > Validate the packets this PR changed
- **X-3** P1 judgment `specs/sk-code/018-frontend-upstream-proposals/goal.md:24`: The packet's goal state contradicts its completion state. `goal.md` carries `completion_pct: 0`, `recent_action: "Authored the durable directive"` and `next_safe_action: "Execute against the completion criteria"`, while `spec.md` carries `completion_pct: 100`, `recent_action: "Closed all five phases..."` and the root spec Status is Complete. All five phase goals carry 100 but keep the same authori...
  - Evidence: `grep -n "completion_pct\|recent_action\|next_safe_action\|open_questions" specs/sk-code/018-frontend-upstream-proposals/goal.md specs/sk-code/018-frontend-upstream-proposals/spec.md specs/sk-code/018-...` exit 0: ...:13: recent_action: "Authored the durable directive" specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/goal.md:14: next_safe_action: "Execute against the completion criteria" specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/goal.md:21: completion_pct: 100

### S15 CI parity

- **A-1** P1 judgment `.skilled/skills/sk-code/graph-metadata.json:177`: The 27 frontend intent_signals appended to sk-code's graph-metadata were never compiled into the committed skill graph, so the blocking 'Compiled skill graph freshness' step in routing-registry-drift.yml fails. A fresh compile emits 135 sk-code signals, the committed skill-graph.json still holds the pre-branch 108, and signalDrift() treats the on-disk list as the required prefix. reach: every push...
  - Evidence: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exit 1: SIGNAL DRIFT compiled vs disk: sk-code ; STALE COMPILED: none (generated_at 2026-11-03T12:10:59.779609+00:00, newest source stamp 2026-10-26T00:00:00Z)
- **X-5** P1 judgment `.skilled/commands/assets/local-skilled-alignment/alignment-lib.cjs:25`: The alignment harness resolves `REPO_ROOT` from `__dirname`, but in this worktree `.skilled/commands/assets/local-skilled-alignment` is a symlink to `/Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment`, so `REPO_ROOT` is the main checkout. That checkout is on `main` at 627fe21 and has no `sk-code-frontend`. `run-battery.cjs` sets `context.repo` and e...
  - Evidence: `node -e 'const m=require("./.skilled/commands/assets/local-skilled-alignment/alignment-lib.cjs"); console.log("REPO_ROOT="+m.REPO_ROOT)'; git -c core.fsmonitor=false -C /Users/michelkerkmeester/MEGA/D...` exit 0: REPO_ROOT=/Users/michelkerkmeester/MEGA/Development/Skilled main 627fe21fee70ec83e29d2653d22d9afd5d07b4aa frontend_dirs=0 STALE COMPILED: none (generated_at 2026-11-03T12:10:59.779609+00:00, newest source stamp 2026-10-26T00:00:00Z) SIGNAL DRIFT compiled vs disk: sk-code strict_exit=1

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **D-04** P2 literal `.hermes/SYNC.md:24`: The sync contract states one generated copy per canonical SKILL.md (all 56) plus one agent mirror per shared agent (12). The tree holds 55 skill copies and 11 agent mirrors, and the branch adds sk-code-frontend (origin/main was 54 skills against the same 56, so the drift predates the branch and its new mirror makes 55 the correct number). The undated counts are present tense and wrong; the dated '... [S11, D]
  - Evidence: `ls .hermes/skills | grep -vc '^agent-'; ls -d .hermes/skills/agent-* | wc -l; find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' | wc -l; ls .skilled/agents/*.md | wc -l` exit 0: 55 11 55 11
  - Critic override: pre-existing, lane severity P2. SYNC.md already said 56 skills and 12 agents on origin/main, where the tree held 54 and 11; the branch adds one skill mirror, so the correct present-tense count is 55 and 11. The file is unchanged in the range and the count error predates it.

### unchanged in range

- **C-01** P1 judgment `README.md:825`: The root README's CODE WORKFLOW block for sk-code still opens with the count claim "Two surfaces." and names only the Skilled and CI surfaces, while the hub now ships three (mode-registry.json extensions.surface-axis.surfaces is sk-code-ci, sk-code-frontend, sk-code-skilled). Count and feature list are both stale. Nothing in the battery sees it: verify-doc-claims.cjs check surfaces walks hub markd... [S5, C]
  - Evidence: `grep -n "exactly three surfaces" .skilled/skills/sk-code/SKILL.md; grep -n "Two surfaces" README.md` exit 0: SKILL.md:47:**Surface list.** The hub has exactly three surfaces: | README.md:825:- Two surfaces. The native Skilled surface covers this framework's own code ... The CI surface holds GitHub Actions workflow standards ... A declared specific surface ... ranks ahead of Skilled
- **C-02** P1 judgment `README.md:1558`: The customization section a forker follows still says "sk-code ships two surfaces" and walks through only the Skilled and CI surfaces, so the page that explains how to add or remove a surface misstates what ships. The sibling instruction on the same page ("Add a surface of your own when you want the hub to carry another stack") reads against a hub that already carries a third one, and the link tar... [S5, C]
  - Evidence: `grep -n "ships two surfaces" README.md; grep -n "ships three surfaces" .skilled/skills/sk-code/README.md` exit 0: README.md:1558:`sk-code` ships two surfaces. The Skilled surface holds the standards ... The CI surface holds the GitHub Actions workflow standards ... | sk-code/README.md:114:sk-code ships three surfaces: the native SKILLED surface, the CI standards surface and a stack-agnostic frontend surface.
- **A-2** P2 judgment `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/policy-card.cjs:249`: Commit 8babc9421a sets out to 'treat hyphen and space alike in every keyword matcher', and the sibling document-replay cards in 001-sk-code and 009-sk-design were both folded, but system-deep-loop's card still matches selector keywords with a raw substring test. A prompt spelling a declared phrase with a space therefore routes through 002's canary-router and yet replays as no-match in the document... [S1, A]
  - Evidence: `grep -n 'spaced(\|signal.value.includes' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/lib/policy-card.cjs` exit 0: ...cy-card.cjs:170: const haystack = spaced(text); ; 009-sk-design/lib/policy-card.cjs:26:function spaced(value) ; 009-sk-design/lib/policy-card.cjs:172: const haystack = spaced(text); ; 002-system-deep-loop/lib/policy-card.cjs:249: signal.value.includes(normalizeSignal(keyword)) ; (no spaced() in 002)
- **B-08** P2 literal `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:81`: The hub playbook's global precondition still enumerates four packets, so an operator checking preconditions after this branch confirms the presence of every packet but the one the branch added, and a missing or half-copied sk-code-frontend would not fail precondition 2. This is the same class of stale list the branch updated everywhere else (README, shared/README, stack-detection, phase-detection,... [S2, B]
  - Evidence: `sed -n '81p' .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` exit 0: 2. The sk-code skill is present at `.skilled/skills/sk-code/` with the `sk-code-quality/`, `sk-code-review/`, `sk-code-ci/` and `sk-code-skilled/` packets intact.
- **C-05** P2 judgment `.skilled/skills/README.txt:60`: The skills catalog row for sk-code lists its surface packets as (sk-code-skilled, sk-code-ci) only, so the new sk-code-frontend packet is absent from the catalog that summarizes every shipped skill, and the two it does name are in the reverse of the hub-router.json routerPolicy.tieBreak order (sk-code-ci, sk-code-frontend, sk-code-skilled). The catalog is a .txt, so neither the README audit nor th... [S5, C]
  - Evidence: `grep -n "read-only SURFACE evidence packets" .skilled/skills/README.txt` exit 0: 60:| [`sk-code`](sk-code/README.md) | Unified two-axis code skill: two WORKFLOW modes (`sk-code-quality`, `sk-code-review`) plus read-only SURFACE evidence packets (`sk-code-skilled`, `sk-code-ci`), each carrying implement/debug/verify workflow and verification gates |
- **C-07** P2 judgment `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:27`: The reference's worked example still reads "`sk-code` publishes two workflow modes ... plus two surface packets, `sk-code-ci` and `sk-code-skilled`", and line 141 of the same file says "the live hub gives all four packets weight 4". sk-create-skill is a skill this branch changed, and both sentences describe the live sk-code hub as it was before the third surface and the fifth router signal entry l... [S5, C]
  - Evidence: `grep -n "plus two surface packets\|all four packets" .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` exit 0: 27:**Worked example**: `sk-code` publishes two workflow modes in `mode-registry.json`, `sk-code-quality` and `sk-code-review`, plus two surface packets, `sk-code-ci` and `sk-code-skilled`. | 141:... the live hub gives all four packets weight 4, so consult the hub's own `hub-router.json` ...
- **C-03** P2 literal `.skilled/changelog/sk-code/code-frontend:1`: The repository keeps one symlink per hub packet under .skilled/changelog/<hub>/, each pointing at that packet's changelog/ directory, so the global stream resolves every packet entry. sk-code has code-ci, code-quality, code-review, code-skilled and parent. The new packet sk-code-frontend ships a changelog/ with v1.0.0.0.md but no code-frontend link, so its entry is unreachable from .skilled/change... [S6, C]
  - Evidence: `ls .skilled/changelog/sk-code/; ls .skilled/skills/sk-code/sk-code-frontend/changelog/` exit 0: code-ci code-quality code-review code-skilled parent | v1.0.0.0.md
  - Critic override: severity P1 to P2. The packet's changelog entry ships at sk-code-frontend/changelog/v1.0.0.0.md; the missing .skilled/changelog/sk-code/code-frontend link is an index and navigation gap, not a missing changelog entry, and the path does not exist in the range.
- **D-06** P2 judgment `.skilled/skills/sk-code/sk-code-review/README.md:164`: The review mode's Related Skills table names two of the hub's three surface packets and its FAQ answer names one, with no sk-code-frontend row or mention anywhere in the file. A reviewer reading the mode's own navigation surface cannot discover the frontend evidence packet the hub now bundles beside review, which is the new canary case ('review my css cascade layers change' resolves to [sk-code-re... [S7, D]
  - Evidence: `grep -n "sk-code-ci\|sk-code-skilled\|sk-code-frontend" .skilled/skills/sk-code/sk-code-review/README.md | head -5` exit 0: ...e implement → debug → verify workflow doctrine... 164:| `sk-code-ci` | CI surface the hub bundles beside review when a request names GitHub Actions workflow terms or a `.github/workflows/` path | 202:A: The surface packets (`sk-code-skilled`) carry the implement → debug → verify workflow doctrine...

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **B-04** P1 literal `.skilled/skills/sk-code/graph-metadata.json:291`: The hub's authored causal summary still counts two surfaces after this branch made it three. derived.causal_summary reads 'bundles one of two read-only surface evidence packets (sk-code-ci, sk-code-skilled)', while SKILL.md section 1 states 'The hub has exactly three surfaces' and mode-registry.json extensions.surface-axis.surfaces lists three. The field is authored prose, not derived: regenerate-... [S2, B]
  - Evidence: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` exit 0: PASS check surfaces: surface counts match mode-registry.json / doc-claims: 4/4 checks passed (the guard passes while graph-metadata.json:291 still says two)
  - Critic override: duplicate, lane severity P1. Duplicate of A-4, which carries the canonical fix and evidence. B-04's P1 is also over-graded: the field is authored prose that no gate reads, the other three lanes grade the same issue P2, and A-4's P2 is the right grade.
- **B-06** P2 literal `.skilled/skills/sk-code/sk-code-frontend/README.md:68`: The packet's own verification recipe cannot show what the packet says it shows. README.md:68 claims 'The router check prints the machine-router heading and its resource declarations', but the command on line 66 alternates on the literal '## MACHINE ROUTER' while the heading is '## 3. MACHINE ROUTER' (ROUTER.md:45), so the heading alternative never matches and three of the four declarations print. ... [S2, B]
  - Evidence: `rg -n "## MACHINE ROUTER|^INTENT_SIGNALS|^RESOURCE_MAP|^DEFAULT_RESOURCE" .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` exit 0: 3 lines, no heading line: 68:DEFAULT_RESOURCE = ["references/frontend-practice.md"] / 70:INTENT_SIGNALS = { / 87:RESOURCE_MAP = {
  - Critic override: duplicate, lane severity P2. Duplicate of C-06; both report the same non-matching MACHINE ROUTER pattern in sk-code-frontend/README.md, and C-06 carries the exact replacement.
- **C-04** P2 literal `.skilled/skills/sk-code/graph-metadata.json:291`: The causal_summary still says the hub "bundles one of two read-only surface evidence packets (sk-code-ci, sk-code-skilled)". This branch edited the same file to add the frontend trigger phrases and mode-registry.json now declares three surface packets, so the shipped summary contradicts the registry it describes. The count survives every guard because verify-doc-claims.cjs collectDocs walks .md fi... [S5, C]
  - Evidence: `grep -c '"packetKind": "surface"' .skilled/skills/sk-code/mode-registry.json; grep -n "one of two read-only surface evidence packets" .skilled/skills/sk-code/graph-metadata.json` exit 0: 3 | 291: "causal_summary": "... or bundles one of two read-only surface evidence packets (sk-code-ci, sk-code-skilled) over a shared surface-detection router ..."
  - Critic override: duplicate, lane severity P2. Duplicate of A-4; same causal_summary sentence and same fix.
- **D-02** P2 literal `.skilled/skills/sk-code/graph-metadata.json:291`: causal_summary still says the hub bundles one of two read-only surface evidence packets and names only sk-code-ci and sk-code-skilled, while this branch adds sk-code-frontend and every other sk-code doc now says three. The advisor metadata a consumer renders advertises the stale surface set, and this file is edited by the branch. [S7, D]
  - Evidence: `rg -n "one of two read-only surface evidence packets" .skilled/skills/sk-code/graph-metadata.json` exit 0: 291: "causal_summary": "sk-code is the single public code skill that routes a request through mode-registry.json to two workflow modes (sk-code-quality, sk-code-review) or bundles one of two read-only surface evidence packets (sk-code-ci, sk-code-skilled) over a shared surface-detection router.
  - Critic override: duplicate, lane severity P2. Duplicate of A-4; same causal_summary sentence and same fix.
- **D-03** P2 literal `.skilled/skills/sk-code/sk-code-frontend/README.md:66`: The packet's verification recipe greps for '## MACHINE ROUTER', but the heading is '## 3. MACHINE ROUTER', so that alternative never matches and the command does not print the heading the README promises; it prints only the three declaration lines. The README's evidence sentence is therefore not reproducible as written. [S7, D]
  - Evidence: `cd .skilled/skills/sk-code/sk-code-frontend && rg -n "## MACHINE ROUTER|^INTENT_SIGNALS|^RESOURCE_MAP|^DEFAULT_RESOURCE" ROUTER.md; rg -n "^## 3\. MACHINE ROUTER" ROUTER.md` exit 0: 68:DEFAULT_RESOURCE = ["references/frontend-practice.md"] 70:INTENT_SIGNALS = { 87:RESOURCE_MAP = { 65:## 3. MACHINE ROUTER
  - Critic override: duplicate, lane severity P2. Duplicate of C-06; same README recipe and same defect.
- **D-05** P2 judgment `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/policy-card.cjs:249`: The hyphen/space fold reached both routers, both sk-code and sk-design policy cards and the shadow compiler, but the system-deep-loop policy card still compares raw signals. Its replayPolicyCard path therefore answers differently from the live route for a hyphenated or spaced prompt, contradicting the commit claim of 'every keyword matcher' and the v1.10.1.0 changelog line 'The compiled hub matche... [S7, D]
  - Evidence: `grep -n "signal.value.includes(normalizeSignal(keyword))" .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/policy-card.cjs; for f in 001-sk-code 002-system-deep-loop 0...` exit 0: 249: signal.value.includes(normalizeSignal(keyword)) 001-sk-code spaced=1 002-system-deep-loop spaced=0 009-sk-design spaced=1
  - Critic override: duplicate, lane severity P2. Duplicate of A-2; both report the missing hyphen and space fold in the system-deep-loop policy card.
- **D-07** P2 literal `.skilled/skills/sk-code/sk-code-frontend/SKILL.md:29`: The reference map says 'six `web-*.md` topic files', but seven files match `web-*.md`: web-markup-and-css.md is the web stack layer, not one of the six topic files the ROUTER table lists. The count is right for topic files and wrong as written with the glob, and the ROUTER, README and changelog all avoid the glob by saying 'six web topic files'. [S7, D]
  - Evidence: `cd .skilled/skills/sk-code/sk-code-frontend && grep -n 'six .web-' SKILL.md; ls references/web-*.md | wc -l` exit 0: 29:- The six `web-*.md` and five `native-*.md` topic files cover focused implementation details for each stack. 7
  - Critic override: duplicate, lane severity P2. Duplicate of B-05; both report the six web-*.md glob label against the seven matching files.

## Env tokens

2 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | sk-code/sk-code-review | sk-code/sk-code-review | pass |
| P02 | sk-code | sk-code/sk-code-skilled | pass |
| P03 | sk-code | sk-design/sk-design-fundamentals | fail |
| P04 | sk-code | sk-code | pass |
| P05 | sk-code/sk-code-review | sk-code/sk-code-review | pass |
| P06 | sk-design/sk-design-fundamentals | sk-design/sk-design-fundamentals | pass |
| P07 | sk-design/sk-design-fundamentals | sk-design/sk-design-fundamentals | pass |
| P08 | sk-doc/sk-create-skill | sk-doc/sk-create-skill | pass |
| P09 | sk-design/sk-design-md-generator | sk-design/sk-design-md-generator | pass |
| P10 | sk-code/sk-code-review | sk-code/sk-code-review | pass |
| P11 | sk-code/sk-code-review | sk-code/sk-code-review | pass |
| P12 | mcp-tooling/mcp-figma | mcp-tooling/mcp-figma | pass |

## Probes awaiting the critic

- P03: Add keyboard focus handling and accessibility labels to my native dialog component; expected sk-code; actual skill sk-design

## Files no lane reviewed

- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/acceptance-criteria.md`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/decision-record.md`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/description.json`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/goal.md`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/implementation-summary.md`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/plan.md`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/spec.md`
- `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/tasks.md`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/acceptance-criteria.md`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/decision-record.md`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/description.json`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/goal.md`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/implementation-summary.md`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/plan.md`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/spec.md`
- `specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/tasks.md`
- `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs/acceptance-criteria.md`
- `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs/description.json`
- `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs/goal.md`
- `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs/implementation-summary.md`
- `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs/plan.md`
- `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs/spec.md`
- `specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs/tasks.md`
- `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/acceptance-criteria.md`
- `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/description.json`
- `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/goal.md`
- `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/implementation-summary.md`
- `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/plan.md`
- `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/spec.md`
- `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/tasks.md`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/acceptance-criteria.md`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/decision-record.md`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/description.json`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/goal.md`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/implementation-summary.md`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/plan.md`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/spec.md`
- `specs/sk-code/018-frontend-upstream-proposals/005-inferred-confirmations/tasks.md`
- `specs/sk-code/018-frontend-upstream-proposals/description.json`
- `specs/sk-code/018-frontend-upstream-proposals/goal.md`
- `specs/sk-code/018-frontend-upstream-proposals/graph-metadata.json`
- `specs/sk-code/018-frontend-upstream-proposals/spec.md`
- `specs/sk-code/graph-metadata.json`

