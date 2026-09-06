# Resource Map - deepseek-v4-flash-code-standards

Evidence-derived resource map from the converged research deltas. `resource-map.md` was not present at the spec folder at init, so this is an audit-local emission listing the sources consumed across the 10 iterations.

## Standards (read/inventoried)

- `.opencode/skills/sk-code/sk-code-opencode/references/shell/style-guide/overview-structure-and-naming.md`
- `.opencode/skills/sk-code/sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md`
- `.opencode/skills/sk-code/sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md`
- `.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/imports-and-exports.md`
- `.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md`
- `.opencode/skills/sk-code/shared/references/universal/code-quality-standards.md`

## Code sources cited (by finding)

- `runtime/cli/rules/*.sh` (check-files.sh, check-links.sh, check-comment-hygiene.sh)
- `runtime/cli/spec/recommend-level.sh`, `calculate-completeness.sh`, `quality-audit.sh`, `archive.sh`, `create.sh`
- `runtime/cli/lib/frontmatter-migration.ts`, `memory-frontmatter.ts`
- `runtime/cli/utils/memory-frontmatter.ts`
- `runtime/cli/core/workflow-path-utils.ts`, `path-utils.ts`
- `runtime/cli/retrieval/generate-trigger-index.mjs`, `retrofit-convention.mjs`, `rg-wrapper.mjs`
- `runtime/cli/setup/check-prerequisites.sh`, `rebuild-native-modules.sh`
- `runtime/cli/doctor.sh`, `validate-command-tree-parity.sh`
- `runtime/cli/.scan-validate-all.sh`, `.scan-one.sh`
- `runtime/cli/lib/embeddings.ts`
- `runtime/hooks/cursor/completion-evidence-response.mjs`
- `runtime/hooks/lib/workspace/repo-root.mjs`
- `runtime/hooks/{claude,codex,devin}/completion-evidence-stop.cjs`
- `runtime/lib/graph/graph-metadata-parser.ts`
- `runtime/api/index.ts`, `runtime/lib/MODULE-MAP.md`
- `runtime/cli/tests/import-policy-rules.vitest.ts`
- `shared/ipc/socket-server.ts`, `shared/embeddings.ts`, `shared/review-research-paths.cjs`
- `shared/frontmatter/parse-frontmatter.ts`, `shared/utils/path-containment.ts`, `shared/utils/path-security.ts`

## Boundary / coverage gate notes

- `resource-map.md` at the spec root: **not present at init**; coverage gate skipped.
- All in-scope source is either cited above or confirmed conforming (TS module headers, module boundaries, shell strict-mode/quoting baseline).
