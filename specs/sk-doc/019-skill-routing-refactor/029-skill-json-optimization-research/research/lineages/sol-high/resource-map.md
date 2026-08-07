# Research Resource Map - sol-high

## Contract And Fleet
- `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs`

## Generation And Scaffolding
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs`

## Advisor Ingest And Projection
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts`

## Compiled Routing
- `.opencode/bin/lib/compiled-route-manifest.cjs`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/router.cjs`
- `.opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json`

## Tests And CI
- `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-freshness.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation.vitest.ts`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs`
- `.opencode/bin/compiled-routing-foundation.vitest.ts`
- `.github/workflows/routing-registry-drift.yml`

## Evidence Artifacts
- `iterations/iteration-001.md` through `iterations/iteration-005.md`
- `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl`
- `deep-research-state.jsonl`
- `findings-registry.json`
