| workflow | line | literal text | kind |
|---|---|---|---|
| advisory-checks.yml | 30 | `RUNNER=".opencode/scripts/run-node-tests.mjs"` | run path |
| advisory-checks.yml | 33 | `exit 0` | skip-on-missing |
| advisory-checks.yml | 41 | `VALIDATOR=".opencode/skills/sk-doc/scripts/validate-doc-model-refs.js"` | run path |
| advisory-checks.yml | 44 | `exit 0` | skip-on-missing |
| agent-mirror-sync.yml | 17 | `CHECKER=".opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs"` | run path |
| changed-packet-validation.yml | 37 | `npm --prefix .opencode/skills/system-spec-kit ci` | run path |
| changed-packet-validation.yml | 38 | `( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )` | run path |
| changed-packet-validation.yml | 39 | `npm --prefix .opencode/skills/system-spec-kit/runtime run build` | run path |
| changed-packet-validation.yml | 99 | `out=$(bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh \` | run path |
| changed-packet-validation.yml | 132 | `base_out=$(bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh \` | run path |
| changed-packet-validation.yml | 141 | `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh "$packet" --strict --no-recursive 2>&1 \` | run path |
| changed-packet-validation.yml | 154 | `echo "Run: bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict"` | run path |
| chart-corpus.yml | 7 | `- '.opencode/skills/sk-design/sk-design-chart/**'` | paths filter |
| chart-corpus.yml | 11 | `- '.opencode/skills/sk-design/sk-design-chart/**'` | paths filter |
| chart-corpus.yml | 36 | `cd .opencode/skills/sk-design/sk-design-chart` | run path |
| chart-corpus.yml | 43 | `cd .opencode/skills/sk-design/sk-design-chart` | run path |
| command-tree-parity.yml | 29 | `npm --prefix .opencode/skills/system-spec-kit ci` | run path |
| command-tree-parity.yml | 33 | `CHECKER=".opencode/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh"` | run path |
| comment-hygiene.yml | 17 | `CHECKER=".opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"` | run path |
| comment-hygiene.yml | 41 | `echo "See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4"` | run path |
| diagram-corpus.yml | 7 | `- '.opencode/skills/sk-design/sk-design-diagram/**'` | paths filter |
| diagram-corpus.yml | 11 | `- '.opencode/skills/sk-design/sk-design-diagram/**'` | paths filter |
| diagram-corpus.yml | 36 | `cd .opencode/skills/sk-design/sk-design-diagram` | run path |
| diagram-corpus.yml | 47 | `cd .opencode/skills/sk-design/sk-design-diagram` | run path |
| diagram-corpus.yml | 58 | `cd .opencode/skills/sk-design/sk-design-diagram` | run path |
| dispatch-enforcement-guard.yml | 31 | `SUITE=".opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs"` | run path |
| dispatch-enforcement-guard.yml | 44 | `npm --prefix .opencode ci` | run path |
| dispatch-enforcement-guard.yml | 45 | `npx --prefix .opencode vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | run path |
| markdown-link-integrity.yml | 7 | `- '.opencode/skills/**'` | paths filter |
| markdown-link-integrity.yml | 8 | `- '.opencode/commands/**'` | paths filter |
| markdown-link-integrity.yml | 9 | `- '.opencode/agents/**'` | paths filter |
| markdown-link-integrity.yml | 29 | `GUARD=".opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs"` | run path |
| markdown-link-integrity.yml | 32 | `exit 0` | skip-on-missing |
| naming-standard-guard.yml | 45 | `python3 .opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py \` | run path |
| naming-standard-guard.yml | 51 | `.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py \` | run path |
| naming-standard-guard.yml | 52 | `.opencode/skills/sk-doc/scripts/tests/test_naming_root_resolver.py` | run path |
| `.github/workflows/playbook-operator-contract.yml` | 28 | `npm --prefix .opencode/skills/system-spec-kit ci` | run path |
| `.github/workflows/playbook-operator-contract.yml` | 29 | `( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )` | run path |
| `.github/workflows/playbook-operator-contract.yml` | 32 | `npm --prefix .opencode/skills/sk-doc ci` | run path |
| `.github/workflows/playbook-operator-contract.yml` | 42 | `VALIDATOR=".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"` | guard path |
| `.github/workflows/playbook-operator-contract.yml` | 43 | `ALLOWLIST=".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"` | guard path |
| `.github/workflows/playbook-operator-contract.yml` | 61 | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict` | run path |
| `.github/workflows/playbook-operator-contract.yml` | 68 | `PACKET=".opencode/skills/sk-doc/sk-create-manual-testing-playbook"` | guard path |
| `.github/workflows/playbook-operator-contract.yml` | 73 | `const packet = ".opencode/skills/sk-doc/sk-create-manual-testing-playbook";` | run path |
| `.github/workflows/prompt-card-sync.yml` | 15 | `GUARD=".opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh"` | guard path |
| `.github/workflows/prompt-card-sync.yml` | 16 | `if [ ! -f "$GUARD" ]; then` | skip-on-missing |
| `.github/workflows/prompt-card-sync.yml` | 18 | `exit 0` | skip-on-missing |
| `.github/workflows/repo-rules-corpus.yml` | 8 | `- '.opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs'` | paths filter |
| `.github/workflows/repo-rules-corpus.yml` | 24 | `GUARD=".opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs"` | guard path |
| `.github/workflows/routing-registry-drift.yml` | 17 | `# and command-metadata.json do not. See .opencode/scripts/git-hooks/pre-commit,` | guard path |
| `.github/workflows/routing-registry-drift.yml` | 26 | `- '.opencode/skills/*/mode-registry.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 27 | `- '.opencode/skills/*/hub-router.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 28 | `- '.opencode/skills/system-skill-advisor/runtime/**'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 29 | `- '.opencode/commands/doctor/scripts/parent-skill-check.cjs'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 30 | `- '.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/**'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 31 | `- '.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/**'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 32 | `- '.opencode/skills/*/SKILL.md'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 33 | `- '.opencode/skills/**/SKILL.md'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 34 | `- '.opencode/skills/*/ROUTER.md'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 35 | `- '.opencode/skills/*/leaf-manifest.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 36 | `- '.opencode/skills/*/leaf-manifest.config.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 37 | `- '.opencode/skills/*/command-metadata.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 38 | `- '.opencode/skills/*/leaf-aliases.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 39 | `- '.opencode/skills/*/description.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 40 | `- '.opencode/skills/*/graph-metadata.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 41 | `- '.opencode/skills/sk-doc/sk-create-skill/scripts/**'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 42 | `- '.opencode/bin/compiled-route*'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 43 | `- '.opencode/bin/lib/compiled-route*'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 50 | `- '.opencode/skills/*/mode-registry.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 51 | `- '.opencode/skills/*/hub-router.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 52 | `- '.opencode/skills/system-skill-advisor/runtime/**'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 53 | `- '.opencode/commands/doctor/scripts/parent-skill-check.cjs'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 54 | `- '.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/**'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 55 | `- '.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/**'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 56 | `- '.opencode/skills/*/SKILL.md'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 57 | `- '.opencode/skills/**/SKILL.md'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 58 | `- '.opencode/skills/*/ROUTER.md'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 59 | `- '.opencode/skills/*/leaf-manifest.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 60 | `- '.opencode/skills/*/leaf-manifest.config.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 61 | `- '.opencode/skills/*/command-metadata.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 62 | `- '.opencode/skills/*/leaf-aliases.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 63 | `- '.opencode/skills/*/description.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 64 | `- '.opencode/skills/*/graph-metadata.json'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 65 | `- '.opencode/skills/sk-doc/sk-create-skill/scripts/**'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 66 | `- '.opencode/bin/compiled-route*'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 67 | `- '.opencode/bin/lib/compiled-route*'` | paths filter |
| `.github/workflows/routing-registry-drift.yml` | 94 | `npm --prefix .opencode/skills/system-spec-kit ci` | run path |
| `.github/workflows/routing-registry-drift.yml` | 95 | `( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )` | run path |
| `.github/workflows/routing-registry-drift.yml` | 98 | `npm --prefix .opencode/skills/sk-doc ci` | run path |
| `.github/workflows/routing-registry-drift.yml` | 103 | `working-directory: .opencode/skills/system-skill-advisor/runtime` | run path |
| `.github/workflows/routing-registry-drift.yml` | 128 | `node .opencode/bin/compiled-route-guard.cjs` | run path |
| `.github/workflows/routing-registry-drift.yml` | 134 | `for registry in .opencode/skills/*/mode-registry.json; do` | run path |
| `.github/workflows/routing-registry-drift.yml` | 137 | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs "$hub"` | run path |
| `.github/workflows/routing-registry-drift.yml` | 147 | `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | run path |
| `.github/workflows/routing-registry-drift.yml` | 148 | `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | run path |
| `.github/workflows/routing-registry-drift.yml` | 149 | `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` | run path |
| `.github/workflows/routing-registry-drift.yml` | 160 | `python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` | run path |
| `.github/workflows/routing-registry-drift.yml` | 183 | `npm --prefix .opencode/skills/system-spec-kit ci` | run path |
| `.github/workflows/routing-registry-drift.yml` | 184 | `( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )` | run path |
| `.github/workflows/routing-registry-drift.yml` | 185 | `npm --prefix .opencode/skills/system-skill-advisor/runtime ci` | run path |
| `.github/workflows/routing-registry-drift.yml` | 187 | `working-directory: .opencode/skills/system-skill-advisor/runtime` | run path |
| `.github/workflows/routing-registry-drift.yml` | 199 | `working-directory: .opencode/skills/system-skill-advisor/runtime` | run path |
| `.github/workflows/routing-registry-drift.yml` | 216 | `working-directory: .opencode/skills/system-skill-advisor/runtime` | run path |
| `.github/workflows/rule-canary-sync.yml` | 17 | `CANARY=".opencode/skills/sk-code/sk-code-review/scripts/check-rule-copies.js"` | guard path |
| `.github/workflows/runtime-no-spec-import.yml` | 7 | ``# `.opencode/specs`, so the coupling cannot silently return.`` | guard path |
| `.github/workflows/runtime-no-spec-import.yml` | 13 | `- '.opencode/bin/**'` | paths filter |
| `.github/workflows/runtime-no-spec-import.yml` | 18 | `- '.opencode/bin/**'` | paths filter |
| `.github/workflows/runtime-no-spec-import.yml` | 22 | `name: No runtime require/import from .opencode/specs` | guard path |
| `.github/workflows/runtime-no-spec-import.yml` | 35 | `node .opencode/bin/check-no-spec-imports.cjs` | run path |
| `.github/workflows/runtime-no-spec-import.yml` | 37 | `if node .opencode/bin/check-no-spec-imports.cjs .opencode/bin/tests/fixtures/no-spec-import/positive; then` | run path |
| `.github/workflows/runtime-no-spec-import.yml` | 42 | `node .opencode/bin/check-no-spec-imports.cjs .opencode/bin/tests/fixtures/no-spec-import/negative` | run path |
| `.github/workflows/skill-doc-frontmatter.yml` | 8 | `- '.opencode/skills/**/references/**'` | paths filter |
| `.github/workflows/skill-doc-frontmatter.yml` | 9 | `- '.opencode/skills/**/assets/**'` | paths filter |
| `.github/workflows/skill-doc-frontmatter.yml` | 20 | `GUARD=".opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh"` | guard path |
| `.github/workflows/skill-doc-frontmatter.yml` | 21 | `if [ ! -f "$GUARD" ]; then` | skip-on-missing |
| `.github/workflows/skill-doc-frontmatter.yml` | 23 | `exit 0` | skip-on-missing |
| `.github/workflows/spec-kit-check.yml` | 7 | `- '.opencode/skills/system-spec-kit/**'` | paths filter |
| `.github/workflows/spec-kit-check.yml` | 13 | `- '.opencode/commands/**'` | paths filter |
| `.github/workflows/spec-kit-check.yml` | 14 | `- '.opencode/agents/**'` | paths filter |
| `.github/workflows/spec-kit-check.yml` | 15 | `- '.opencode/skills/*/command-metadata.json'` | paths filter |
| `.github/workflows/spec-kit-check.yml` | 24 | `- '.opencode/skills/system-spec-kit/**'` | paths filter |
| `.github/workflows/spec-kit-check.yml` | 30 | `- '.opencode/commands/**'` | paths filter |
| `.github/workflows/spec-kit-check.yml` | 31 | `- '.opencode/agents/**'` | paths filter |
| `.github/workflows/spec-kit-check.yml` | 32 | `- '.opencode/skills/*/command-metadata.json'` | paths filter |
| `.github/workflows/spec-kit-check.yml` | 61 | `npm --prefix .opencode/skills/system-spec-kit ci` | run path |
| `.github/workflows/spec-kit-check.yml` | 63 | `# on the plugin SDK declared in .opencode/package.json.` | run path |
| `.github/workflows/spec-kit-check.yml` | 64 | `npm --prefix .opencode ci` | run path |
| `.github/workflows/spec-kit-check.yml` | 68 | `npm --prefix .opencode/skills/sk-communication/cli-communication-projection ci` | run path |
| `.github/workflows/spec-kit-check.yml` | 71 | `npm --prefix .opencode/skills/system-skill-advisor/runtime ci` | run path |
| `.github/workflows/spec-kit-check.yml` | 72 | `npm --prefix .opencode/skills/system-skill-advisor/runtime run build` | run path |
| `.github/workflows/spec-kit-check.yml` | 73 | `( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )` | run path |
| `.github/workflows/spec-kit-check.yml` | 74 | `npm --prefix .opencode/skills/system-spec-kit/runtime run build` | run path |
| `.github/workflows/spec-kit-check.yml` | 75 | `npm --prefix .opencode/skills/system-spec-kit/runtime/cli run build` | run path |
| `.github/workflows/spec-kit-check.yml` | 83 | `npm --prefix .opencode/skills/system-spec-kit/runtime/cli run check` | run path |
| `.github/workflows/spec-kit-check.yml` | 84 | `npm --prefix .opencode/skills/system-spec-kit/runtime/cli run typecheck` | run path |
| `.github/workflows/spec-kit-check.yml` | 87 | `run: npm --prefix .opencode/skills/system-spec-kit/shared test` | run path |
| `.github/workflows/spec-kit-check.yml` | 97 | `cd .opencode/skills/system-spec-kit/runtime/cli` | run path |
| `.github/workflows/spec-kit-check.yml` | 105 | `npm --prefix .opencode/skills/system-spec-kit/runtime/cli run test:legacy` | run path |
| `.github/workflows/spec-kit-check.yml` | 106 | `npm --prefix .opencode/skills/system-spec-kit/runtime/cli run test:validation` | run path |
| `.github/workflows/spec-kit-check.yml` | 113 | `cd .opencode/skills/system-spec-kit/runtime` | run path |
| `.github/workflows/spec-kit-check.yml` | 136 | `npm --prefix .opencode/skills/system-spec-kit ci` | run path |
| `.github/workflows/spec-kit-check.yml` | 137 | `( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )` | run path |
| `.github/workflows/spec-kit-check.yml` | 142 | `node .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | run path |
| `.github/workflows/spec-kit-check.yml` | 143 | `node .opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check` | run path |
| `.github/workflows/spec-kit-check.yml` | 144 | `node .opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check` | run path |
| `.github/workflows/spec-kit-check.yml` | 145 | `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | run path |
| `.github/workflows/spec-kit-check.yml` | 146 | `node .opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` | run path |
| `.github/workflows/spec-kit-check.yml` | 147 | `node .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` | run path |
| `.github/workflows/spec-kit-check.yml` | 148 | `node .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` | run path |
| `.github/workflows/strict-pass-freshness-report.yml` | 43 | `npm --prefix .opencode/skills/system-spec-kit ci` | run path |
| `.github/workflows/strict-pass-freshness-report.yml` | 44 | `( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )` | run path |
| `.github/workflows/strict-pass-freshness-report.yml` | 45 | `npm --prefix .opencode/skills/system-spec-kit/runtime run build` | run path |
| `.github/workflows/strict-pass-freshness-report.yml` | 56 | `node --import ./.opencode/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs \` | run path |
| `.github/workflows/strict-pass-freshness-report.yml` | 57 | `.opencode/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts \` | run path |
| `.github/workflows/strict-pass-freshness-report.yml` | 94 | `node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --roots specs || true` | skip-on-missing |

## Orchestrator verification

Nineteen workflows under `.github/workflows/` name `.opencode`. The first DeepSeek dispatch for all nineteen returned an empty message (exit 0, 0 bytes). The split dispatch returned an empty message again for the first ten (advisory-checks.yml, agent-mirror-sync.yml, changed-packet-validation.yml, chart-corpus.yml, command-tree-parity.yml, comment-hygiene.yml, diagram-corpus.yml, dispatch-enforcement-guard.yml, markdown-link-integrity.yml, naming-standard-guard.yml) and 119 rows for the last nine. The orchestrator derived the first ten from the source: every line naming `.opencode`, classed by its YAML context (`paths:` list, missing-file test, otherwise run path), plus every `exit 0` within four lines of a missing-file test. That gives 36 rows. The lane's nine were checked against the source: every `.opencode` line is present, and none of the 119 rows differs from its cited line.
