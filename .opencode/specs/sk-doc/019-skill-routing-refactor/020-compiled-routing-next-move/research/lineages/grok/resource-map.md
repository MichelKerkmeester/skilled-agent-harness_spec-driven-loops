# Resource Map — grok lineage (evidence-derived)

## Scripts
- `.opencode/bin/compiled-route-sync.cjs` — promote/check/verify/finalize/revert
- `.opencode/bin/compiled-route-guard.cjs` — freshness + authored-drift reporter
- `.opencode/bin/lib/compiled-route-manifest.cjs` — mint/refresh/freshness (runtime writes)
- `.opencode/bin/lib/compiled-route-layout.cjs` — activation/resolver path layout
- `.opencode/bin/compiled-route-status.cjs` — status probe
- `.opencode/bin/check-no-spec-imports.cjs` — CI sibling gate

## Runtime
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs`
- `.opencode/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json`

## Authored
- `.opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/**` (IMPL_ROOT)

## Skills (live inputs)
- `.opencode/skills/cli-external-orchestration/mode-registry.json`
- `.opencode/skills/sk-design/mode-registry.json`

## Hooks / CI
- `.opencode/hooks/README.md`, `.opencode/scripts/git-hooks/pre-commit`, `pre-push`
- `.codex/hooks.json`
- `.github/workflows/routing-registry-drift.yml`
- `.github/workflows/runtime-no-spec-import.yml`

## Tests
- `.opencode/bin/tests/compiled-route-manifest.test.cjs`
