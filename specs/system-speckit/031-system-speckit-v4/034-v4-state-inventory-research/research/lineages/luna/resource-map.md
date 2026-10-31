# Research Resource Map

This map records the source families used by the ten-iteration `luna` lineage. It is descriptive only; no repository tooling or generated metadata was run.

| evidence family | canonical sources |
|---|---|
| hub and mode topology | `.opencode/skills/*/mode-registry.json`, `.opencode/skills/*/leaf-manifest.json`, hub `SKILL.md`, `graph-metadata.json`, `hub-router.json` |
| commands and agents | `.opencode/commands/**/*.md`, `.opencode/agents/*.md`, runtime sync manifests under `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md` |
| system-spec-kit | `.opencode/skills/system-spec-kit/runtime/cli/README.md`, `runtime/cli/lib/validator-registry.json`, `runtime/cli/retrieval/README.md`, `.opencode/commands/speckit/*.md` |
| deep loop | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `mode-registry.json`, deep command routers, ledger/reducer runtime |
| advisor | `.opencode/skills/system-skill-advisor/mcp-server/tools/index.ts`, scoring constants, workspace/db path policy, `.opencode/bin/skill-advisor.cjs`, hook contract |
| hooks and goals | `.opencode/hooks/README.md`, `.opencode/hooks/goal/README.md`, `goal-plugin.md`, `injection-contract.md`, runtime mirror `hook-registry.json` |
| mirrors and CI | `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.github/workflows/*.yml`, `.github/dependabot.yml` |
| upgrade chronology | `specs/system-speckit/033-system-speckit-v4/timeline.md`, `spec.md`, read-only `git log v3.6.0.0..HEAD` path-filtered history |
| draft comparison | `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` |

Excluded from source authority: README-only counts when they contradicted registries; archived/feature-catalog/manual-testing-playbook narrative for current-state claims; remote content; dependency-lock and build-output content; and all other research lineage directories.
