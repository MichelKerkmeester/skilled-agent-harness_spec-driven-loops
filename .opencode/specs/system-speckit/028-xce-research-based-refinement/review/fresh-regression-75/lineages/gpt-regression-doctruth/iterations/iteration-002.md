# Seat gpt-regression-doctruth — iteration 2 (global #40)

- Model: `openai/gpt-5.5-fast` · Executor: opencode · Angle: gpt-regression-doctruth
- Verdict: **FAIL** · Findings: P0=0 P1=2 P2=0

## Analysis

Read-only pass. I traced the feature catalog command-surface section to command frontmatter, the spec-memory tool registry, the CLI `list-tools` implementation, and the live `speckit` asset inventory.

The `/memory:*` command rows in the root catalog match the current command frontmatter. Code-index `8` and skill-advisor `9` match their registries. I found two traceability regressions in the catalog slice: spec-memory is still documented as `37` while the live registry is `39`, and per-feature catalog files still point at dead `spec_kit_*.yaml` asset names.

```json
{
  "seat": "gpt-regression-doctruth",
  "model": "openai/gpt-5.5-fast",
  "angle": "REGRESSION: feature catalog dead /spec_kit:* namespace + wrong tool count were fixed. Re-verify the catalog matches live commands/tool counts.",
  "verdict": "FAIL",
  "summary": "Spec-memory count still says 37 vs live 39, and catalog still links dead spec_kit_* workflow asset names.",
  "files_reviewed": [
    ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md",
    ".opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md",
    ".opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md",
    ".opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/stale-exclusion-audit-and-tool-ownership-lint.md",
    ".opencode/skills/system-spec-kit/feature_catalog/retrieval/session-recovery-spec-kit-resume.md",
    ".opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md",
    ".opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/debug-delegation-scaffold-generator.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/000-release-cleanup/changelog-000-003-skill-feature-catalog.md",
    ".opencode/commands/memory/README.txt",
    ".opencode/commands/memory/search.md",
    ".opencode/commands/memory/learn.md",
    ".opencode/commands/memory/manage.md",
    ".opencode/commands/memory/save.md",
    ".opencode/commands/speckit/README.txt",
    ".opencode/commands/speckit/resume.md",
    ".opencode/commands/speckit/assets/speckit_resume_auto.yaml",
    ".opencode/commands/speckit/assets/speckit_resume_confirm.yaml",
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts",
    ".opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts",
    ".opencode/bin/spec-memory.cjs",
    ".opencode/bin/skill-advisor.cjs",
    ".opencode/bin/code-index.cjs",
    ".opencode/skills/system-code-graph/mcp_server/tool-schemas.ts",
    ".opencode/skills/system-skill-advisor/mcp_server/tools/index.ts",
    ".opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts",
    ".opencode/skills/system-skill-advisor/mcp_server/handlers/index.ts"
  ],
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Spec-memory tool count still documents 37 while live registry exposes 39",
      "file": ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48",
      "evidence": "Line 48 says the Spec Kit Memory MCP server exposes 37 tools from TOOL_DEFINITIONS.length; tool-schemas.ts:906-955 exports the live TOOL_DEFINITIONS array with 39 entries, and spec-memory-cli.ts:540 renders list-tools count from TOOL_DEFINITIONS.length.",
      "why": "The catalog and CLI parity docs no longer match the registered MCP/CLI surface. Operators using the advertised list-tools parity check or ownership docs will see 39 live commands while the catalog says 37.",
      "recommendation": "Update the root catalog and spec-memory CLI catalog entries to 39, refresh the memory README coverage matrix, and adjust any 37-tool ownership lint/test wording to the current TOOL_DEFINITIONS length."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Feature catalog still links dead spec_kit_* workflow asset names",
      "file": ".opencode/skills/system-spec-kit/feature_catalog/retrieval/session-recovery-spec-kit-resume.md:64",
      "evidence": "Line 64 links .opencode/commands/speckit/assets/spec_kit_resume_auto.yaml, but .opencode/commands/speckit/README.txt:92-99 lists the live assets as speckit_resume_auto.yaml and other speckit_* files. The same stale spec_kit_ prefix appears in spec-folder-literal-naming-ai-derived-slugs.md:42-45 and debug-delegation-scaffold-generator.md:40-52.",
      "why": "The catalog source-file traceability points readers to nonexistent workflow assets, preserving the dead spec_kit naming pattern the regression pass was supposed to eliminate.",
      "recommendation": "Replace all feature-catalog spec_kit_*.yaml asset references with the live speckit_*.yaml paths and run a catalog source-file existence check over feature_catalog/**/*.md."
    }
  ]
}
```
