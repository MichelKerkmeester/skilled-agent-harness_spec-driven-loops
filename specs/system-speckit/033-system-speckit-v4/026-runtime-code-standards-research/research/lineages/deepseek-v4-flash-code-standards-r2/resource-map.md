# Resource Map — deepseek-v4-flash-code-standards-r2

Derived from converged iteration deltas. `resource-map.md` was absent at init (`resource_map_present=false`), so this is a lineage-derived inventory of the sourced surfaces, not a source trove the loop treated as known inventory.

## Source surfaces covered

- runtime/cli/core/** (quality-scorer, memory-indexer, post-save-review, workflow, index)
- runtime/cli/extractors/** (quality-scorer, session-activity-signal, index, README)
- runtime/cli/spec-folder/** (generate-description, folder-detector, nested-changelog)
- runtime/cli/continuity/** (generate-context, migrate-trigger-phrase-residual, backfill-frontmatter)
- runtime/cli/graph/** (backfill-graph-metadata, migrate-generated-json)
- runtime/cli/templates/** (inline-gate-renderer)
- runtime/cli/utils/** (fact-coercion, index, path-utils, spec-affinity)
- runtime/cli/rules/*.sh (28 rule scripts, check-template-source, check-toc-policy, check-files)
- runtime/cli/spec/*.sh (14 spec scripts, progressive-validate, calculate-completeness, archive)
- runtime/cli/tests/** (quality-scorer-disambiguation, description-enrichment, test-validation-extended)
- runtime/hooks/lib/** (hook-adapter-shared, spec-gate/spec-gate-core)
- runtime/hooks/pi/** (spec-gate-classify, spec-gate-enforce, lib/claude-hook-adapter)
- runtime/hooks/{claude,codex,cursor,devin}/spec-gate-{classify,enforce}.mjs
- shared/** (embeddings/{factory,registry,adapters,providers}, ranking/{matrix-math,learned-combiner}, parsing/{secret-scrubber,quality-extractors}, ipc/socket-server, chunking, embeddings.ts)

## Standards cited

- sk-code-opencode/references/typescript/{style-guide/overview-strict-and-naming,quality-standards/overview-and-type-system,quality-standards/tsdoc-errors-and-async}
- sk-code-opencode/references/shell/{quality-standards/overview-and-priority-blockers,quality-standards/validation-security-and-shellcheck}
- sk-code-opencode/references/shared/code-organization/imports-and-exports
- shared/references/universal/code-quality-standards
