# Resource Map — compiled-serving admission research (deepseek lineage)

## Primary Sources Read

### Retired Lane C modules (read at `b45ea54cea3^`, deleted in `b45ea54cea3`)
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`
- `.opencode/commands/deep/assets/deep-skill-benchmark-auto.yaml`

### Live compiled-routing runtime
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/<hub>/manifest.json`
- `.skilled/bin/lib/compiled-route-manifest.cjs` + `.skilled/bin/lib/compiled-route-manifest.cjs`
- `.skilled/bin/compiled-route.cjs`, `.skilled/bin/compiled-route-status.cjs`, `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/compiled-route-sync.cjs`
- `.skilled/bin/lib/compiled-route-layout.cjs`
- `.skilled/bin/compiled-routing-foundation.vitest.ts`

### Admission-relevant corpus and bridges
- `.skilled/skills/{sk-code,system-deep-loop,mcp-tooling,cli-external-orchestration,sk-doc}/manual-testing-playbook/**` (typed gold, holdout, negative, defer scenarios)
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`
- `.skilled/skills/*/leaf-manifest.json`, `.skilled/skills/*/mode-registry.json`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/canary-cases.v1.json`

### Enforcement, CI and precedent
- `.opencode/scripts/git-hooks/pre-commit` (mirror: `.skilled/scripts/git-hooks/pre-commit`)
- `.github/workflows/routing-registry-drift.yml`
- `.skilled/skills/system-skill-advisor/runtime/tests/routing-golden-prompts.vitest.ts` + `scripts/fixtures/gate2-golden-prompts.jsonl`
- `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts`
- `.skilled/skills/*/benchmark/reports/compiled-routing/2026-07-21--*/report.{json,md}` (archived Lane C-era measurements, incl. sk-prompt)
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`

### Commits / history
- `b45ea54cea3` (retirement), `b45ea54cea3^` (module bodies)
- `a1faf0914a` (manifest auto re-mint hook), `ec33385ae5` (source-root migration)
- `8da89c0594e` (sk-prompt retirement), 7→6 topology commits (`640900daae7`, `065c1360c60`, `5d5e78bb5af`)

## Artifacts Produced (this lineage)

- `deep-research-config.json`, `deep-research-strategy.md`, `deep-research-state.jsonl`
- `iterations/iteration-001.md` … `iteration-005.md`
- `deltas/iter-001.jsonl` … `iter-005.jsonl`
- `findings-registry.json`, `convergence-report.md`, `deep-research-dashboard.md`, `synthesis-event.json`
- `research.md` (canonical synthesis answering Q1–Q5)
- this `resource-map.md`

## Gaps / Not Read

- The full 1,889-line body of `score-skill-benchmark.cjs` and the 741-line `router-replay.cjs` were
  read selectively (contract-defining sections), not line-by-line.
- The `routing-registry-drift.yml` golden-prompt and scorer-ratchet jobs were read for scope, not run.
- No execution trial of a restored harness was performed (forbidden by the lineage's write fence).
