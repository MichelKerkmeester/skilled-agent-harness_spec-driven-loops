[0m
> build · gpt-5.6-sol
[0m
The audit will stay read-only and limit owned-file inspection to the advisor subsystem, launcher, and verified plugin bridges. Reachability checks will search the entire repository across the specified code, config, shell, and documentation extensions.
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**"[90m 100 matches[0m
[0m✱ [0mGrep "system-skill-advisor|mk-skill-advisor-launcher|skill-advisor"[90m in .opencode/plugins · 32 matches[0m
[0m✱ [0mGlob ".opencode/plugins/**/*skill*advisor*"[90m 2 matches[0m
[0m✱ [0mGlob ".opencode/bin/*skill-advisor*"[90m 2 matches[0m
[0m✱ [0mGlob ".codex/**/*skill*advisor*"[90m 0 matches[0m
[0m✱ [0mGlob ".claude/**/*skill*advisor*"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.ts"[90m 100 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.js"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.cjs"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.mjs"[90m 7 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.md"[90m 100 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.py"[90m 7 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/README.md[90m [limit=1200][0m
[0m→ [0mRead .opencode/bin/mk-skill-advisor-launcher.cjs[90m [limit=1200][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/SKILL.md[90m [limit=1200][0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.json"[90m 30 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/package.json[90m [limit=400][0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.sh"[90m 5 matches[0m
The documented shape is broader than the initial file list: it includes a nine-tool MCP server, Python compatibility facade, daemon-backed CLI, prompt hooks, generated routing artifacts, and a package-local database. The first concrete audit risks are committed runtime-state files under `database/`, a large compatibility surface, and duplicated integration paths; these require tracked-file and whole-repo caller verification before they qualify as findings.
[0m
[0m$ [0mgit ls-files '.opencode/skills/system-skill-advisor/**' '.opencode/bin/mk-skill-advisor-launcher.cjs' '.opencode/plugins/mk-skill-advisor.js' '.opencode/plugins/tests/mk-skill-advisor.test.cjs'
.opencode/bin/mk-skill-advisor-launcher.cjs
.opencode/plugins/mk-skill-advisor.js
.opencode/plugins/tests/mk-skill-advisor.test.cjs
.opencode/skills/system-skill-advisor/ARCHITECTURE.md
.opencode/skills/system-skill-advisor/INSTALL-GUIDE.md
.opencode/skills/system-skill-advisor/README.md
.opencode/skills/system-skill-advisor/SKILL.md
.opencode/skills/system-skill-advisor/changelog/.gitkeep
.opencode/skills/system-skill-advisor/changelog/v0.1.0.md
.opencode/skills/system-skill-advisor/changelog/v0.10.0.md
.opencode/skills/system-skill-advisor/changelog/v0.2.0.md
.opencode/skills/system-skill-advisor/changelog/v0.3.0.md
.opencode/skills/system-skill-advisor/changelog/v0.4.0.md
.opencode/skills/system-skill-advisor/changelog/v0.5.0.md
.opencode/skills/system-skill-advisor/changelog/v0.6.0.md
.opencode/skills/system-skill-advisor/changelog/v0.7.0.md
.opencode/skills/system-skill-advisor/changelog/v0.8.0.md
.opencode/skills/system-skill-advisor/changelog/v0.9.0.md
.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/anti-stuffing.md
.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/derived-extraction.md
.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/df-idf-corpus.md
.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/doc-frontmatter-harvest.md
.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/provenance-and-trust-lanes.md
.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/sanitizer.md
.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/sync.md
.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/cache-invalidation.md
.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/generation.md
.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/lease.md
.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/lifecycle.md
.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/rebuild-from-source.md
.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/trust-state.md
.opencode/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/watcher.md
.opencode/skills/system-skill-advisor/feature-catalog/feature-catalog.md
.opencode/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md
.opencode/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md
.opencode/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md
.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/age-haircut.md
.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/archive-handling.md
.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/rollback.md
.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/schema-migration.md
.opencode/skills/system-skill-advisor/feature-catalog/lifecycle-routing/supersession.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/advisor-rebuild.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/advisor-status.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/advisor-validate.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/compat-entrypoint.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-advisor-cli.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-graph-query.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-graph-scan.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-graph-status.md
.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-graph-validate.md
.opencode/skills/system-skill-advisor/feature-catalog/python-compat/bench-runner.md
.opencode/skills/system-skill-advisor/feature-catalog/python-compat/cli-shim.md
.opencode/skills/system-skill-advisor/feature-catalog/python-compat/regression-suite.md
.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md
.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/ambiguity.md
.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/attribution.md
.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/five-lane-fusion.md
.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/projection.md
.opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md
.opencode/skills/system-skill-advisor/graph-metadata.json
.opencode/skills/system-skill-advisor/hooks/claude/README.md
.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts
.opencode/skills/system-skill-advisor/hooks/lib/README.md
.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts
.opencode/skills/system-skill-advisor/leaf-aliases.json
.opencode/skills/system-skill-advisor/leaf-manifest.config.json
.opencode/skills/system-skill-advisor/leaf-manifest.json
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/anti-stuffing.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/derived-extraction.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/doc-frontmatter-harvest.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/sanitizer-boundaries.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/generation-publication.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/lease-single-writer.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/rebuild-from-source.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/watcher-narrow-scope.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/skill-advisor-cli-fallback.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/force-local-force-native.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/python-shim-stdin.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/age-haircut.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/archive-handling.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/schema-migration.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/supersession.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/advisor-status-rebuild-separation.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/ambiguous-brief-rendering.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/lifecycle-redirect-metadata.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/native-recommend-happy-path.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/native-status-transitions.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/native-validate-slices.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/shadow-delta-sink.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/skill-graph-query.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/skill-graph-status.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/skill-graph-validate.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/quarantined-daemon.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/unavailable-daemon.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/bench-runner.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/force-native-force-local.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/regression-suite.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/stdin-mode.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/python-compat/threshold-flag.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ambiguity.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/five-lane-fusion.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-attribution.md
.opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/projection.md
.opencode/skills/system-skill-advisor/mcp-server/README.md
.opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/README.md
.opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-parse-latency.bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-query-latency.baseline.json
.opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-query-latency.bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/hook-brief-signal-noise.bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/latency-bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/scorer-bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/scorer-calibration-baseline.json
.opencode/skills/system-skill-advisor/mcp-server/bench/scorer-calibration.bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/watcher-benchmark.ts
.opencode/skills/system-skill-advisor/mcp-server/compat/README.md
.opencode/skills/system-skill-advisor/mcp-server/compat/index.ts
.opencode/skills/system-skill-advisor/mcp-server/data/README.md
.opencode/skills/system-skill-advisor/mcp-server/data/prompt-policy.default.json
.opencode/skills/system-skill-advisor/mcp-server/database/.gitignore
.opencode/skills/system-skill-advisor/mcp-server/database/README.md
.opencode/skills/system-skill-advisor/mcp-server/handlers/README.md
.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-rebuild.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-status.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-validate.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/index.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/README.md
.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/index.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/propagate-enhances.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/query.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/response-envelope.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/scan.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/status.ts
.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/validate.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/affordance-normalizer.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/auth/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/auth/trusted-caller.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/compat/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/compat/advisor-status-reader.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/compat/contract.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/compat/daemon-probe.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/compat/redirect-metadata.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/context/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/context/caller-context.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/corpus/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/corpus/df-idf.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/apply-graph-metadata-patch.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/context-template.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/detect-inbound-enhances.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/index.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/metadata-loader.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/cross-skill-edges/types.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/lease.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/lifecycle.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/state-mutation.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher-orchestrator.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/derived/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/derived/anti-stuffing.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/derived/extract.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/derived/provenance.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/derived/trust-lanes.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/adapter.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/adapters/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/adapters/ollama.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/index.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/registry.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/schema.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/types.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/error-diagnostics.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/freshness.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/cache-invalidation.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/generation.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/rebuild-from-source.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/sqlite-integrity.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/trust-state-values.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/trust-state.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/generation.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/ipc/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/ipc/launcher-idle-timeout.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/ipc/socket-server.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/age-haircut.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/archive-handling.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/rollback.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/schema-migration.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/status-values.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/supersession.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/metrics.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/normalize-adapter-output.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/prompt-cache.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/prompt-policy.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/ablation.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/age-policy.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/ambiguity.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/attribution.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/beta-reliability.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/feedback-calibration.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/bm25.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/derived.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/graph-causal.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/semantic-shadow.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/scoring-constants.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/text.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/types.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/weights-config.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/shadow/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/shadow/shadow-sink.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/shared/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/shared/embeddings
.opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/shared/unicode-normalization.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/bfs-traversal.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/metadata-sanitizer.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-queries.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/source-cache.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/subprocess.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/test-helpers/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/test-helpers/env-snapshot.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/utils/README.md
.opencode/skills/system-skill-advisor/mcp-server/lib/utils/busy-retry.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/utils/error-format.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/utils/json-guard.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/utils/skill-markdown.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts
.opencode/skills/system-skill-advisor/mcp-server/package-lock.json
.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/README.md
.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
.opencode/skills/system-skill-advisor/mcp-server/schemas/README.md
.opencode/skills/system-skill-advisor/mcp-server/schemas/advisor-tool-schemas.ts
.opencode/skills/system-skill-advisor/mcp-server/schemas/compat-contract.json
.opencode/skills/system-skill-advisor/mcp-server/schemas/daemon-status.ts
.opencode/skills/system-skill-advisor/mcp-server/schemas/generation-metadata.ts
.opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts
.opencode/skills/system-skill-advisor/mcp-server/scripts/README.md
.opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh
.opencode/skills/system-skill-advisor/mcp-server/scripts/check-skill-doc-frontmatter.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/check-skill-doc-frontmatter.sh
.opencode/skills/system-skill-advisor/mcp-server/scripts/fixtures/skill-advisor-regression-cases.jsonl
.opencode/skills/system-skill-advisor/mcp-server/scripts/init-skill-graph.sh
.opencode/skills/system-skill-advisor/mcp-server/scripts/out/.gitkeep
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/README.md
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/ambiguity-prompts.jsonl
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/build-holdout.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/derive-ambiguity-slice.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/gate3-corpus-runner.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/holdout-prompts.jsonl
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/labeled-prompts.jsonl
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-outcome-rerank.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json
.opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json
.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py
.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor_bench.py
.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor_regression.py
.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor_runtime.py
.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py
.opencode/skills/system-skill-advisor/mcp-server/scripts/verify-zombie-soak.sh
.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts
.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/README.md
.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/README.md
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/advisor-recommend-handler-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/daemon-lifecycle-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/df-idf-corpus-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/generation-cache-invalidation-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/generation-snapshot-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/hooks-parity-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/python-bench-runner-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/python-compat-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/scorer-extras-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/scorer-fusion-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/skill-projection-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/trust-state-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl
.opencode/skills/system-skill-advisor/mcp-server/tests/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/__fixtures__/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/__fixtures__/errors.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/__shared__/affordance-injection-fixtures.json
.opencode/skills/system-skill-advisor/mcp-server/tests/advisor-rebuild.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/affordance-normalizer.test.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/cache/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/cache/df-idf-cache.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/cache/listener-uniqueness.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/command-bridge-resolution-guard.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/daemon-probe.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge-smoke.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/python-compat.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/redirect-metadata.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/shim.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compiled-routing-consumption.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/cross-skill-edges.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-freshness-foundation.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-resource-leaks-049-005.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/ensure-active-embedder.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/registry.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/schema.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/shared-factory-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/fixtures/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/fixtures/lifecycle/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/fixtures/lifecycle/index.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/fixtures/skill-graph-db.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend-descriptor-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend-unavailable.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-status.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-trust-gate.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-validate-shapes.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-validate.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-corrupt-honesty.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-dispatch.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-listing.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-scan-auth.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/settings-driven-invocation-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/lane-attribution.test.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-bootstrap.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-idle-timeout.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-lease.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-reap-pid-reuse.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-brief-producer.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-corpus-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/ambiguousTopTwo.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/failOpenTimeout.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/livePassingSkill.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/noPassingSkill.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/promptPoisoningAdversarial.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/skipPolicyCommandOnly.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/skipPolicyEmptyPrompt.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/skippedShortCasual.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/staleHighConfidenceSkill.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-fixtures/unicodeInstructionalSkillLabel.json
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-freshness.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-graph-evidence-calibration.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-graph-health.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-observability.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-privacy.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-prompt-cache.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-prompt-policy.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-renderer.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-subprocess.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-timing.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/lifecycle-derived-metadata.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/manual-testing-playbook.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/metadata-sanitizer-entities-guard.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/migration-lineage-identity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/mk-skill-advisor-plugin.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parent-skill-check-fixtures.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/fixtures/executor-delegation-cases.json
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/fixtures/local-native-approved-divergences.json
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/holdout-independent.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/local-native-divergence-ratchet.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/python-ts-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/python/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/python/test_skill_advisor.py
.opencode/skills/system-skill-advisor/mcp-server/tests/rename-invariants.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/routing-fixtures.affordance.test.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/routing-parity-deep-council.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/routing-parity-deep-skills.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/schemas/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/schemas/advisor-tool-schemas.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/advisor-feedback-calibration.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/advisor-quality-049-003.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/ambiguity-slice.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/beta-reliability.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/bm25-lexical-shadow.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/conflict-query-rerank.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/harder-intent-prompt-corpus.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/intent-prompt-corpus.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/seed-skill-embeddings.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/graph-causal-visited-order.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/lane-registry-env-override.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/lane-weight-sweep.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/native-scorer.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-embedding-staleness.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-freshness.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/provenance-self-boost-guard.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/rrf-determinism-spine.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/runtime-lane-health.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/semantic-lane-promotion.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/semantic-shadow-ablation.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/shadow-sink.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-dual-client.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-help-aliases-errors.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-job-semantics.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-manifest-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-test-utils.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-trusted-prompt-time.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-doc-harvest.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-bfs-traversal.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-db.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-diagnostic-redaction.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-handlers.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-queries-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph/refresh-roundtrip.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/sqlite-integrity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/tri-daemon-drill.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/tsconfig.tests.json
.opencode/skills/system-skill-advisor/mcp-server/tests/utils/README.md
.opencode/skills/system-skill-advisor/mcp-server/tests/utils/workspace-root.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/vocabulary-agreement.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tools/README.md
.opencode/skills/system-skill-advisor/mcp-server/tools/advisor-contract-keys.ts
.opencode/skills/system-skill-advisor/mcp-server/tools/advisor-rebuild.ts
.opencode/skills/system-skill-advisor/mcp-server/tools/advisor-recommend.ts
.opencode/skills/system-skill-advisor/mcp-server/tools/advisor-status.ts
.opencode/skills/system-skill-advisor/mcp-server/tools/advisor-validate.ts
.opencode/skills/system-skill-advisor/mcp-server/tools/index.ts
.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts
.opencode/skills/system-skill-advisor/mcp-server/tools/types.ts
.opencode/skills/system-skill-advisor/mcp-server/tsconfig.build.json
.opencode/skills/system-skill-advisor/mcp-server/tsconfig.json
.opencode/skills/system-skill-advisor/mcp-server/vitest.config.ts
.opencode/skills/system-skill-advisor/mcp-server/vitest.stress.config.ts
.opencode/skills/system-skill-advisor/references/config/db-path-policy.md
.opencode/skills/system-skill-advisor/references/decisions/deferred-decisions.md
.opencode/skills/system-skill-advisor/references/graph/propagate-enhances.md
.opencode/skills/system-skill-advisor/references/graph/skill-graph-drift.md
.opencode/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md
.opencode/skills/system-skill-advisor/references/graph/skill-graph-query-cookbook.md
.opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md
.opencode/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md
.opencode/skills/system-skill-advisor/references/runtime/freshness-contract.md
.opencode/skills/system-skill-advisor/references/runtime/legacy-tool-bridge.md
.opencode/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md
.opencode/skills/system-skill-advisor/references/runtime/tool-ids-reference.md
.opencode/skills/system-skill-advisor/references/scoring/advisor-scorer.md
.opencode/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md
.opencode/skills/system-skill-advisor/references/scoring/validation-baselines.md
.opencode/skills/system-skill-advisor/scripts/README.md
.opencode/skills/system-skill-advisor/scripts/doctor.sh
[0m
[0m→ [0mRead .opencode/plugins/mk-skill-advisor.js[90m [limit=1100][0m
[0m→ [0mRead .opencode/plugins/tests/mk-skill-advisor.test.cjs[90m [limit=1200][0m
[0m
[0m$ [0mgit status --short -- '.opencode/skills/system-skill-advisor' '.opencode/bin/mk-skill-advisor-launcher.cjs' '.opencode/plugins/mk-skill-advisor.js' '.opencode/plugins/tests/mk-skill-advisor.test.cjs'
M .opencode/plugins/tests/mk-skill-advisor.test.cjs
D  .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph-daemon-lease.sqlite
D  .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite
[0m
[0m→ [0mRead .opencode/bin/mk-skill-advisor-launcher.cjs[90m [offset=1201, limit=500][0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/tests/**/*.ts"[90m 100 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/tools/**"[90m 9 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/*.{bak,backup,old,orig,rej,tmp,temp,save,swp,swo}"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/{references,feature-catalog,changelog,benchmark,bench,archive}/**"[90m 68 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/{backup,backups,scratch,tmp,temp,archive,changelog,benchmark,bench}/**"[90m 21 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/README.md[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs[90m [limit=1000][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/ARCHITECTURE.md[90m [limit=1200][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/INSTALL-GUIDE.md[90m [limit=1200][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/README.md[90m [limit=1400][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/compat/README.md[90m [limit=600][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/scripts/README.md[90m [limit=900][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/references/graph/skill-graph-extraction-plan.md[90m [limit=800][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/bench/README.md[90m [limit=600][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/references/runtime/legacy-tool-bridge.md[90m [limit=900][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/README.md[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/compat/README.md[90m [limit=700][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/README.md[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl[90m [limit=100][0m
[0m
[0m$ [0mgit ls-files '.opencode/skills/system-skill-advisor/**/.tmp*' '.opencode/skills/system-skill-advisor/**/*.tmp' '.opencode/skills/system-skill-advisor/**/*.bak' '.opencode/skills/system-skill-advisor/**/*.old' '.opencode/skills/system-skill-advisor/**/*.orig' '.opencode/skills/system-skill-advisor/**/out/**'
.opencode/skills/system-skill-advisor/mcp-server/scripts/out/.gitkeep
.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl
[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/**/README.md"[90m 57 matches[0m
[0m✱ [0mGrep "^(export\s+(?:default\s+)?(?:async\s+)?(?:function|class|const|let|var|type|interface|enum)|export\s*\{|module\.exports\s*=)"[90m in .opencode/skills/system-skill-advisor · 100 matches[0m
[0m✱ [0mGrep "(?:from\s+|import\s*\(|require\s*\()['"][^'"]+['"]"[90m in .opencode/skills/system-skill-advisor · 100 matches[0m
[0m✱ [0mGrep "process\.env\.[A-Z0-9_]+|process\.env\[[^\]]+\]|os\.environ\.get\(['"][A-Z0-9_]+|getenv\(['"][A-Z0-9_]+"[90m in .opencode/skills/system-skill-advisor · 100 matches[0m
[0m✱ [0mGrep "--[a-z][a-z0-9-]*"[90m in .opencode/skills/system-skill-advisor · 100 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts[90m [limit=800][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts[90m [limit=1000][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/compat/index.ts[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/database/README.md[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tools/index.ts[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/handlers/index.ts[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts[90m [limit=1200][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/compat/contract.ts[90m [limit=500][0m
[0m✗ [0mGrep "SYSTEM_SKILL_ADVISOR_DB_DIR" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tsconfig.build.json[90m [limit=300][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/vitest.stress.config.ts[90m [limit=300][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/vitest.config.ts[90m [limit=300][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts[90m [limit=300][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts[90m [limit=700][0m
[0m✗ [0mGrep "OPENCODE_PROMPT_TIME" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✱ [0mGrep "SKILL_ADVISOR_COMPAT_CONTRACT|resolvedConfidenceThreshold|resolvedUncertaintyThreshold"[90m 100 matches[0m
[0m✱ [0mGrep "compat/contract(?:\.js|\.ts)?|lib/compat/contract"[90m 100 matches[0m
[0m✱ [0mGrep "handle_advisor_(recommend|rebuild|status|validate)"[90m 28 matches[0m
[0m✗ [0mGrep "handleSkillGraph(Query|Scan|Status|Validate|PropagateEnhances)" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✱ [0mGrep "skillGraphTools|skillGraph(Query|Scan|Status|Validate|PropagateEnhances)Tool"[90m 62 matches[0m
Whole-repo symbol checks already isolate a likely CAT-1 cluster: the four snake_case handler aliases occur only at their declarations/re-export barrel in live code; other hits are historical audit/spec captures, not callers or an operator contract. The subsystem also maintains two complete tool-schema registries and two independent warm-CLI fallback implementations, so the next pass is separating deliberate compatibility boundaries from unjustified duplication.
[0m
[0m$ [0mnode -e 'const cp=require("node:child_process"),fs=require("node:fs"),p=require("node:path"); const files=cp.execFileSync("git",["ls-files","-z"],{encoding:"utf8",maxBuffer:64*1024*1024}).split("\0").filter(Boolean).filter(f=>/\.(?:ts|js|cjs|mjs)$/.test(f)); const set=new Set(files.map(f=>p.resolve(f))); const inbound=new Map(files.map(f=>[p.resolve(f),[]])); function resolve(from,s){if(!s.startsWith("."))return null;const b=p.resolve(p.dirname(from),s);const c=[b,b.replace(/\.js$/,".ts").replace(/\.mjs$/,".ts").replace(/\.cjs$/,".ts"),b+".ts",b+".js",b+".mjs",b+".cjs",p.join(b,"index.ts"),p.join(b,"index.js")];return c.find(x=>set.has(x))||null} for(const rel of files){const from=p.resolve(rel),src=fs.readFileSync(from,"utf8"),re=/(?:import|export)\s+(?:[^"'"']*?\sfrom\s*)?["'"']([^"'"']+)["'"']|import\(\s*["'"']([^"'"']+)["'"']\s*\)|require\(\s*["'"']([^"'"']+)["'"']\s*\)/g;let m;while((m=re.exec(src))){const to=resolve(from,m[1]||m[2]||m[3]);if(to)inbound.get(to).push(rel)}} const prefix=p.resolve(".opencode/skills/system-skill-advisor")+p.sep; for(const [abs,ins] of [...inbound].sort()){if(abs.startsWith(prefix)&&ins.length===0)console.log(p.relative(process.cwd(),abs));}'
zsh:1: unmatched "
[0m
[0m✱ [0mGrep "TOOL_DEFINITIONS|skillGraphToolDefinitions|advisorRecommendTool|advisorRebuildTool|advisorStatusTool|advisorValidateTool"[90m in .opencode/skills/system-skill-advisor · 38 matches[0m
[0m✱ [0mGrep "ARCHITECTURE\.md|compat/|mcp-server/index\.ts|handlers/recommend\.ts|lib/skill-graph/rebuild\.ts|hooks/opencode|manual_testing_playbook"[90m in .opencode/skills/system-skill-advisor · 100 matches[0m
[0m✱ [0mGrep "SPECKIT_RUN_BENCHES|vitest\.stress\.config|stress-test/skill-advisor|code-graph-parse-latency|code-graph-query-latency"[90m 100 matches[0m
[0m✗ [0mGrep "SKILL_ADVISOR_CLI_TOOL_MANIFEST|SKILL_ADVISOR_TOOL_DEFINITIONS" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✗ [0mGrep "buildLegacyBrief|buildCliBrief|buildNativeBrief|probeCliWarmDaemon|runCliRecommend|loadNativeAdvisorModules" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✱ [0mGrep "buildSkillAdvisorBriefFromCli|resolveSkillAdvisorCliFallbackTimeoutMs|shouldTrySkillAdvisorCliFallback|skillAdvisorCliFallbackEnvelope"[90m 23 matches[0m
[0m✱ [0mGrep "tests/\.tmp-resident-service-31202-1781868482214-e27892e065ba1|shadow-deltas\.jsonl"[90m 100 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-code-graph/**/bench/**/*code-graph*"[90m 0 matches[0m
[0m✱ [0mGrep "code-graph-query-latency|code-graph-parse-latency"[90m in .opencode/skills/system-code-graph · 0 matches[0m
[0m✱ [0mGrep "mcp-server/bench|SPECKIT_RUN_BENCHES|npm.*bench|run.*bench"[90m in .github · 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-code-graph/**/*latency*.{ts,json}"[90m 0 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-parse-latency.bench.ts[90m [limit=350][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-query-latency.bench.ts[90m [limit=350][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-query-latency.baseline.json[90m [limit=100][0m
[0m
[0m$ [0mnode -e 'const cp=require("node:child_process"),fs=require("node:fs"),p=require("node:path");const files=cp.execFileSync("git",["ls-files","-z"],{encoding:"utf8",maxBuffer:64*1024*1024}).split("\0").filter(Boolean).filter(f=>/\.(?:ts|js|cjs|mjs)$/.test(f));const set=new Set(files.map(f=>p.resolve(f)));const inbound=new Map(files.map(f=>[p.resolve(f),[]]));function r(from,s){if(!s.startsWith("."))return null;const b=p.resolve(p.dirname(from),s),c=[b,b.replace(/\.js$/,".ts").replace(/\.mjs$/,".ts").replace(/\.cjs$/,".ts"),b+".ts",b+".js",b+".mjs",b+".cjs",p.join(b,"index.ts"),p.join(b,"index.js")];return c.find(x=>set.has(x))||null}for(const rel of files){const from=p.resolve(rel),src=fs.readFileSync(from,"utf8"),re=/(?:import|export)\s+(?:[^"\x27]*?\sfrom\s*)?["\x27]([^"\x27]+)["\x27]|import\(\s*["\x27]([^"\x27]+)["\x27]\s*\)|require\(\s*["\x27]([^"\x27]+)["\x27]\s*\)/g;let m;while((m=re.exec(src))){const to=r(from,m[1]||m[2]||m[3]);if(to)inbound.get(to).push(rel)}}const prefix=p.resolve(".opencode/skills/system-skill-advisor")+p.sep;for(const [abs,ins]of[...inbound].sort()){if(abs.startsWith(prefix)&&ins.length===0)console.log(p.relative(process.cwd(),abs))}'
.opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-parse-latency.bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-query-latency.bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/hook-brief-signal-noise.bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/scorer-calibration.bench.ts
.opencode/skills/system-skill-advisor/mcp-server/bench/watcher-benchmark.ts
.opencode/skills/system-skill-advisor/mcp-server/compat/index.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/embedders/index.ts
.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/scripts/check-skill-doc-frontmatter.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/build-holdout.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/derive-ambiguity-slice.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/gate3-corpus-runner.mjs
.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-outcome-rerank.mjs
.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/advisor-recommend-handler-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/daemon-lifecycle-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/df-idf-corpus-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/generation-cache-invalidation-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/generation-snapshot-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/hooks-parity-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/python-bench-runner-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/python-compat-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/scorer-extras-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/scorer-fusion-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/skill-projection-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/trust-state-stress.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/advisor-rebuild.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/affordance-normalizer.test.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/cache/df-idf-cache.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/cache/listener-uniqueness.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/command-bridge-resolution-guard.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/daemon-probe.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge-smoke.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/python-compat.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/redirect-metadata.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compat/shim.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/compiled-routing-consumption.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/cross-skill-edges.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-freshness-foundation.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-resource-leaks-049-005.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/ensure-active-embedder.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/registry.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/schema.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/embedders/shared-factory-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend-descriptor-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend-unavailable.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-status.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-trust-gate.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-validate-shapes.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-validate.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-corrupt-honesty.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-dispatch.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-listing.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-scan-auth.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/settings-driven-invocation-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/lane-attribution.test.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-bootstrap.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-idle-timeout.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-lease.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-reap-pid-reuse.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-brief-producer.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-corpus-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-freshness.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-graph-evidence-calibration.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-graph-health.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-observability.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-privacy.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-prompt-cache.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-prompt-policy.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-renderer.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-subprocess.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-timing.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/lifecycle-derived-metadata.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/manual-testing-playbook.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/metadata-sanitizer-entities-guard.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/migration-lineage-identity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/mk-skill-advisor-plugin.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parent-skill-check-fixtures.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/holdout-independent.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/local-native-divergence-ratchet.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/python-ts-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/rename-invariants.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/routing-fixtures.affordance.test.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/routing-parity-deep-council.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/routing-parity-deep-skills.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/schemas/advisor-tool-schemas.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/advisor-feedback-calibration.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/advisor-quality-049-003.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/ambiguity-slice.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/beta-reliability.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/bm25-lexical-shadow.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/conflict-query-rerank.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/graph-causal-visited-order.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/lane-registry-env-override.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/lane-weight-sweep.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/native-scorer.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-embedding-staleness.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-freshness.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/provenance-self-boost-guard.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/rrf-determinism-spine.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/runtime-lane-health.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/semantic-lane-promotion.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/semantic-shadow-ablation.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/shadow-sink.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-dual-client.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-help-aliases-errors.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-job-semantics.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-manifest-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-trusted-prompt-time.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-doc-harvest.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-bfs-traversal.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-db.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-diagnostic-redaction.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-handlers.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-queries-parity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph/refresh-roundtrip.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/sqlite-integrity.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/tri-daemon-drill.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/utils/workspace-root.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/tests/vocabulary-agreement.vitest.ts
.opencode/skills/system-skill-advisor/mcp-server/vitest.config.ts
.opencode/skills/system-skill-advisor/mcp-server/vitest.stress.config.ts
[0m
[0m✱ [0mGrep "SPECKIT_RUN_BENCHES|system-skill-advisor/mcp-server/bench|code-graph-query-latency\.bench|code-graph-parse-latency\.bench"[90m in .opencode · 91 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/tests/**/*.test.ts"[90m 3 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/lib/**/__tests__/**/*.{test,vitest}.ts"[90m 1 match[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts[90m [limit=500][0m
[0m✗ [0mGrep "runStressHarness|SearchQuality|searchQuality|runScenario|runAllScenarios|harness" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/embedders/index.ts[90m [limit=300][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/README.md[90m [limit=800][0m
[0m✗ [0mGrep "system-skill-advisor/mcp-server/vitest\.stress\.config|npm.*system-skill-advisor.*stress|system-skill-advisor.*npm run stress|vitest run --config vitest\.stress\.config\.ts" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/README.md[90m [limit=400][0m
[0m✱ [0mGrep "semantic-shadow-cosine|affordance-normalizer\.test|lane-attribution\.test|routing-fixtures\.affordance\.test"[90m 100 matches[0m
[0m✱ [0mGrep "lib/embedders/index|from ['"].*embedders(?:/index)?\.js|ensureActiveEmbedder|createEmbedder|registerEmbedder"[90m 100 matches[0m
[0m✱ [0mGrep "search-quality/harness|stress-test/search-quality"[90m in .opencode/skills/system-skill-advisor · 6 matches[0m
[0m✱ [0mGrep "search-quality/harness|runSearchQualityHarness"[90m in .opencode/skills/system-spec-kit · 14 matches[0m
[0m→ [0mRead .opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness.ts[90m [limit=350][0m
[0m✱ [0mGlob ".opencode/skills/**/stress-test/search-quality/{harness,corpus,metrics}.ts"[90m 4 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/lib/search/search-decision-envelope.ts"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/{corpus,metrics}.ts"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/**"[90m 20 matches[0m
[0m✱ [0mGrep "runSearchQualityHarness"[90m in .opencode · 24 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/daemon/lease.ts[90m [limit=700][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/daemon/lifecycle.ts[90m [limit=800][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md[90m [limit=900][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/database/.gitignore[90m [limit=200][0m
[0m✱ [0mGrep "PID_FILE_NAME|OWNER_LEASE_FILE_NAME|leasePath\(|ownerLeasePath\(|daemonLeasePath"[90m in .opencode/bin/mk-skill-advisor-launcher.cjs · 76 matches[0m
[0m✱ [0mGrep "\.mk-skill-advisor-launcher\.json|\.skill-advisor-owner\.json|skill-graph-daemon-lease|acquireOwnerLeaseFile|isLeaseHeld|acquireLease"[90m 100 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/schemas/compat-contract.json[90m [limit=200][0m
[0m✱ [0mGrep "compat-contract\.json|SKILL_ADVISOR_COMPAT_CONTRACT"[90m in .opencode/skills/system-skill-advisor/mcp-server/tests · 2 matches[0m
[0m✱ [0mGrep "compat-contract\.json|SKILL_ADVISOR_COMPAT_CONTRACT"[90m in .opencode/skills/system-skill-advisor · 17 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts[90m [limit=700][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/compat/shim.vitest.ts[90m [limit=500][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/compat/python-compat.vitest.ts[90m [limit=500][0m
[0m✗ [0mGrep "SYSTEM_SKILL_ADVISOR_DB_DIR" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✗ [0mGrep "SPECKIT_ADVISOR_FRESHNESS" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✗ [0mGrep "SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✗ [0mGrep "SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✗ [0mGrep "SPECKIT_MAX_SECONDARY_CLIENTS" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✱ [0mGrep "SPECKIT_OPENCODE_HOOK_TIMEOUT_MS"[90m 5 matches[0m
[0m
[0m$ [0mnode -e 'const cp=require("node:child_process"),fs=require("node:fs");const targets=[".opencode/bin/mk-skill-advisor-launcher.cjs",".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"];const keys=new Set();for(const f of targets){const s=fs.readFileSync(f,"utf8"),i=s.indexOf("CHILD_ENV_ALLOWLIST"),e=s.indexOf("]);",i);for(const m of s.slice(i,e).matchAll(/\x27([A-Z][A-Z0-9_]+)\x27/g))keys.add(m[1])}const files=cp.execFileSync("git",["ls-files","-z"],{encoding:"utf8",maxBuffer:64*1024*1024}).split("\0").filter(Boolean).filter(f=>/\.(?:ts|js|cjs|mjs|py|md|yaml|yml|json|sh)$/.test(f)&&!f.startsWith(".opencode/specs/"));for(const k of [...keys].sort()){const hits=[];for(const f of files){let s;try{s=fs.readFileSync(f,"utf8")}catch{continue}if(s.includes(k))hits.push(f)}if(hits.length<=3)console.log(k+"\t"+hits.length+"\t"+hits.join(","))}'
SPECKIT_CODEX_HOOK_TIMEOUT_MS	1	.opencode/bin/mk-skill-advisor-launcher.cjs
SPECKIT_SKILL_ADVISOR_CLI_FALLBACK_TIMEOUT_MS	2	.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts,.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
SPECKIT_SKILL_ADVISOR_CLI_PROBE_TIMEOUT_MS	2	.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts,.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
[0m
[0m✱ [0mGrep "spec_kit\.graph\.(parse_duration_ms|query_latency_ms)|speckitMetrics"[90m in .opencode/skills/system-code-graph · 15 matches[0m
[0m✱ [0mGrep "system-skill-advisor.*metrics|skill-advisor/mcp-server/lib/metrics|from ['"].*metrics\.js"[90m in .opencode/skills/system-code-graph · 0 matches[0m
[0m✱ [0mGrep "code-graph-parse-latency|code-graph-query-latency"[90m in .opencode/skills/system-skill-advisor/changelog · 0 matches[0m
[0m✱ [0mGrep "spec_kit\.graph\.(parse_duration_ms|query_latency_ms)"[90m 25 matches[0m
[0m→ [0mRead .opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts[90m [limit=300][0m
[0m✱ [0mGrep "metrics-stub|export const speckitMetrics|recordHistogram"[90m in .opencode/skills/system-code-graph/mcp-server/lib/shared · 2 matches[0m
[0m✱ [0mGrep "metrics-stub|system-skill-advisor/mcp-server/lib/metrics"[90m in .opencode/skills/system-code-graph/mcp-server · 4 matches[0m
[0m✱ [0mGrep "code-graph-parse-latency.*(PASS|FAIL|SKIP)|code-graph-query-latency.*(PASS|FAIL|SKIP)|SPECKIT_RUN_BENCHES=true.*code-graph"[90m in .opencode/specs · 1 match[0m
## Objective
- Audit `.opencode/skills/system-skill-advisor/`, `.opencode/bin/mk-skill-advisor-launcher.cjs`, and verified plugin bridges across CAT-1 through CAT-6.
- Produce a read-only Markdown report with evidence, whole-repo verification commands, and blast radius per finding.

## Important Details
- Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.
- Strictly read-only; no repository or git mutations.
- Do not call MCP tools or load skills.
- Reachability searches must cover the whole repo across `.ts/.js/.cjs/.mjs/.md/.yaml/.json/.sh`; include `.ts`.
- Manual/operator interfaces are not dead merely because they lack programmatic callers.
- Read retention-directory READMEs before deletion claims. `mcp-server/bench/README.md` explicitly retains code-graph benchmarks as measurement assets.
- Output each finding as `### F<n> — CAT-<n>: ...`, then **Path**, **Evidence**, **Verify**, **Blast radius**.
- Explicitly state when a category has no findings.
- Working tree already had user changes: modified `.opencode/plugins/tests/mk-skill-advisor.test.cjs` and staged deletions under legacy `.opencode/skills/system-skill-advisor/mcp_server/database/`; do not touch them.
- No files were modified.

## Work State
### Completed
- Verified plugin surfaces:
  - `.opencode/plugins/mk-skill-advisor.js`
  - `.opencode/plugins/tests/mk-skill-advisor.test.cjs`
  - `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`
- Read subsystem architecture, install, MCP, scripts, compatibility, database, benchmark, stress-test, test, and bridge documentation.
- Strong CAT-3 candidate: tracked runtime residue at `.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl`; contains one telemetry row. `git ls-files` confirms it is committed.
- Strong CAT-2 candidate: `.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts` is an orphaned near-copy of the live `.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness.ts`.
  - Advisor copy imports absent local `./corpus.js`, `./metrics.js`, and `../../lib/search/search-decision-envelope.js`.
  - Whole-repo `runSearchQualityHarness` callers target the `system-spec-kit` successor.
- Strong CAT-1 candidate: snake_case aliases `handle_advisor_recommend`, `handle_advisor_rebuild`, `handle_advisor_status`, and `handle_advisor_validate` occur in live code only at their declarations and `handlers/index.ts` re-exports; other whole-repo hits are historical spec/audit captures.
- Strong CAT-1/CAT-5 candidate: `.opencode/skills/system-skill-advisor/mcp-server/vitest.config.ts:17` includes only `tests/**/*.vitest.ts`, excluding three documented tests:
  - `tests/affordance-normalizer.test.ts`
  - `tests/lane-attribution.test.ts`
  - `tests/routing-fixtures.affordance.test.ts`
- Strong CAT-4 candidate: `mcp-server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts` sits outside the configured `tests/**/*.vitest.ts` tree and is excluded from normal builds/tests.
- Strong CAT-5 candidate: compatibility defaults are duplicated verbatim between:
  - `mcp-server/schemas/compat-contract.json`
  - `mcp-server/lib/compat/contract.ts`
  - Bridge reads JSON while TypeScript runtime reads the TS object; tests verify JSON values but not JSON↔TS parity.
- Strong CAT-6 candidate: all nine tool descriptions/schemas are hand-copied into `skill-advisor-cli-manifest.ts` while canonical MCP descriptors also exist under `tools/`; parity is maintained by tests rather than a shared descriptor source.
- Static whole-repo import scan found no inbound code imports for `mcp-server/compat/index.ts`, but it is dynamically imported by bridge path string and is therefore live.
- Static scan also identified operator/benchmark entrypoints; these are not automatically dead.
- Bench README confirms `code-graph-parse-latency.bench.ts`, `code-graph-query-latency.bench.ts`, and baseline retention, so no deletion claim should be made.
- Launcher/bridge allowlist scan found `SPECKIT_CODEX_HOOK_TIMEOUT_MS` only in `.opencode/bin/mk-skill-advisor-launcher.cjs` outside historical specs, making it a potential dead allowlist entry.
- Database runtime files `.mk-skill-advisor-launcher.json` and `.skill-advisor-owner.json` exist locally but are ignored runtime state, not committed residue.

### Active
- Validate final finding set and assign each to exactly one category.
- Run exact whole-repo `rg` commands for each reachability claim, especially `SPECKIT_CODEX_HOOK_TIMEOUT_MS`, snake aliases, excluded tests, and search-quality harness.
- Capture concise exact line ranges for CLI manifest duplication, compatibility-contract duplication, and test inclusion mismatch.
- Decide whether the duplicate `OPENCODE_PROMPT_TIME` check at `skill-advisor-cli.ts:371-372` merits a separate CAT-1 finding.
- Decide whether to report duplicated bridge/hook warm-CLI fallback responsibility; current evidence shows overlap but bootstrap behavior may justify it.

### Blocked
- One inline Node import-graph command initially failed with `zsh:1: unmatched "`; a corrected command ran successfully.
- Some broad Grep calls returned `Ripgrep JSON record exceeded 65536 bytes` because archived spec JSON contains huge records; use targeted `rg` commands with explicit globs/exclusions.
- No substantive blocker.

## Next Move
1. Run targeted whole-repo verification commands and read exact evidence line ranges for the shortlisted findings.
2. Emit the final CAT-1–CAT-6 report, explicitly stating categories with no accepted finding.

## Relevant Files
- `.opencode/skills/system-skill-advisor/`: primary audit scope.
- `.opencode/bin/mk-skill-advisor-launcher.cjs`: launcher, env allowlists, PID/owner/daemon lease handling.
- `.opencode/plugins/mk-skill-advisor.js`: OpenCode plugin bridge caller.
- `.opencode/plugins/tests/mk-skill-advisor.test.cjs`: plugin regression bridge; pre-existing modification.
- `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`: subprocess bridge and JSON compatibility-contract consumer.
- `.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl`: committed temporary telemetry residue.
- `.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts`: broken orphaned legacy copy.
- `.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness.ts`: live successor with callers.
- `.opencode/skills/system-skill-advisor/mcp-server/vitest.config.ts`: excludes `.test.ts` and source-local `__tests__`.
- `.opencode/skills/system-skill-advisor/mcp-server/tests/README.md`: documents excluded `.test.ts` files as regression coverage.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts`: misplaced/unreached test.
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/index.ts`: re-exports four apparently dead snake_case aliases.
- `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts`: duplicate nine-tool CLI schema registry.
- `.opencode/skills/system-skill-advisor/mcp-server/tools/index.ts`: canonical MCP tool registry.
- `.opencode/skills/system-skill-advisor/mcp-server/schemas/compat-contract.json`: bridge-facing compatibility contract.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/compat/contract.ts`: duplicate TypeScript compatibility contract.
- `.opencode/skills/system-skill-advisor/mcp-server/bench/README.md`: documented benchmark retention contract.
Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed.
The final pass is separating retained-but-broken measurement assets from genuinely deletable code. Static evidence confirms the two code-graph benchmarks are retained by policy but disconnected from production telemetry, so they belong under misplaced artifacts rather than dead leftovers.
[0m✱ [0mGrep "export\s+(async\s+)?function\s+handle_advisor_|export\s+const\s+handle_advisor_"[90m in .opencode/skills/system-skill-advisor/mcp-server · 4 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/handlers/index.ts[90m [offset=1, limit=160][0m
[0m→ [0mRead .opencode/bin/mk-skill-advisor-launcher.cjs[90m [offset=250, limit=120][0m
[0m✗ [0mGrep "SPECKIT_CODEX_HOOK_TIMEOUT_MS" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✱ [0mGrep "handle_advisor_(recommend|rebuild|status|validate)"[90m 28 matches[0m
[0m✱ [0mGrep "SPECKIT_CODEX_HOOK_TIMEOUT_MS"[90m in .claude · 0 matches[0m
[0m✱ [0mGrep "CHILD_ENV_ALLOWLIST|SPECKIT_CODEX_HOOK_TIMEOUT_MS"[90m in .opencode/bin/mk-skill-advisor-launcher.cjs · 3 matches[0m
[0m✱ [0mGrep "SPECKIT_CODEX_HOOK_TIMEOUT_MS"[90m in .codex · 0 matches[0m
[0m→ [0mRead .opencode/bin/mk-skill-advisor-launcher.cjs[90m [offset=50, limit=145][0m
[0m✗ [0mGrep "SPECKIT_CODEX_HOOK_TIMEOUT_MS" failed[90m in .opencode[0m
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts[90m [offset=1, limit=280][0m
[0m→ [0mRead .opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness.ts[90m [offset=1, limit=280][0m
[0m✱ [0mGlob ".opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/*"[90m 20 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/*"[90m 2 matches[0m
[0m✱ [0mGrep "runSearchQualityHarness|search-quality/harness"[90m 100 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/README.md[90m [limit=260][0m
[0m→ [0mRead .opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/README.md[90m [limit=220][0m
[0m✱ [0mGrep "stress-test/search-quality|runSearchQualityHarness"[90m in .opencode/skills/system-skill-advisor · 8 matches[0m
[0m✱ [0mGrep "stress-test/search-quality|runSearchQualityHarness"[90m in .opencode/skills/system-spec-kit · 21 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tsconfig.json[90m [limit=220][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/vitest.config.ts[90m [limit=180][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/package.json[90m [limit=220][0m
[0m✱ [0mGrep "affordance-normalizer\.test|lane-attribution\.test|routing-fixtures\.affordance\.test|semantic-shadow-cosine"[90m in .opencode/skills/system-skill-advisor/mcp-server · 8 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/**/*.test.ts"[90m 3 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/**/__tests__/*.vitest.ts"[90m 1 match[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/README.md[90m [offset=80, limit=130][0m
[0m✱ [0mGrep "affordance-normalizer\.test\.ts|lane-attribution\.test\.ts|routing-fixtures\.affordance\.test\.ts"[90m in .opencode/skills/system-skill-advisor · 6 matches[0m
[0m✱ [0mGrep "semantic-shadow-cosine\.vitest\.ts"[90m in .opencode/skills/system-skill-advisor · 1 match[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/README.md[90m [offset=55, limit=90][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl[90m [limit=20][0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/**/.tmp*"[90m 0 matches[0m
[0m✱ [0mGrep "\.tmp-resident-service|tmp-resident-service"[90m in .gitignore · 0 matches[0m
[0m
[0m$ [0mgit ls-files -- '.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp*'
.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl
[0m
[0m$ [0mgit status --short -- '.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl'
(no output)
[0m
[0m✱ [0mGrep "tmp-resident-service|resident-service-"[90m in .opencode/skills/system-skill-advisor/mcp-server · 0 matches[0m
[0m✱ [0mGrep "shadow-deltas\.jsonl"[90m in .opencode/skills/system-skill-advisor/mcp-server/tests · 5 matches[0m
[0m
[0m$ [0mgit log --oneline --all -- '.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl'
cc77a1e550a refactor(sk-doc): migrate filesystem names to kebab-case (020, squashed)
e6f1fc1a305 refactor(sk-doc): migrate filesystem names to kebab-case (020, squashed)
250c3bf2a4d refactor(sk-doc): rename snake_case filesystem names to kebab-case (020 execution)
[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/bench/README.md[90m [offset=1, limit=190][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-parse-latency.bench.ts[90m [offset=1, limit=150][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-query-latency.bench.ts[90m [offset=1, limit=130][0m
[0m→ [0mRead .opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts[90m [limit=60][0m
[0m✱ [0mGrep "from ['"].*metrics\.js|from ['"].*system-code-graph|SPECKIT_METRICS_ENABLED|snapshot\(\)"[90m in .opencode/skills/system-skill-advisor/mcp-server/bench · 19 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-code-graph/mcp-server/code_graph/lib/*.ts"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-code-graph/mcp-server/lib/{runtime-detection,budget-allocator,ensure-ready}.ts"[90m 3 matches[0m
[0m✱ [0mGlob ".opencode/plugins/{spec-kit-skill-advisor,spec-kit-compact-code-graph,mk-skill-advisor}.js"[90m 1 match[0m
[0m✱ [0mGlob ".opencode/skills/sk-doc/scripts/quick-validate.py"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/sk-doc/scripts/quick_validate.py"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-spec-kit/scripts/{.scan-validate-all,.enumerate-no-frontmatter}.py"[90m 2 matches[0m
[0m✗ [0mGrep "spec-kit-compact-code-graph|spec-kit-skill-advisor|quick_validate\.py|code_graph/lib/runtime-detection" failed
[91m[1mError: [0mRipgrep JSON record exceeded 65536 bytes
[0m✱ [0mGlob ".opencode/skills/sk-doc/scripts/*validate*"[90m 1 match[0m
[0m✱ [0mGlob ".opencode/plugins/*code*graph*.js"[90m 2 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-query-latency.bench.ts[90m [offset=131, limit=120][0m
The retained code-graph benchmarks have two independent breakages: the parse suite points at renamed paths that no longer exist, and the query suite reads the advisor collector while the exercised code-graph runtime records through a disabled no-op collector. I am confirming those failures with the existing local Vitest binary before finalizing the blast-radius assessment.
[0m
[0m$ [0mSPECKIT_RUN_BENCHES=true ../../system-spec-kit/node_modules/.bin/vitest run --config vitest.config.ts bench/code-graph-parse-latency.bench.ts
zsh:1: no such file or directory: ../../system-spec-kit/node_modules/.bin/vitest
[0m
[0m$ [0mSPECKIT_RUN_BENCHES=true ../../system-spec-kit/node_modules/.bin/vitest run --config vitest.config.ts bench/code-graph-query-latency.bench.ts
zsh:1: no such file or directory: ../../system-spec-kit/node_modules/.bin/vitest
[0m
[0m→ [0mRead .opencode/skills/system-spec-kit/package.json[90m [limit=80][0m
[0m→ [0mRead .opencode/skills/system-spec-kit/mcp-server/package.json[90m [offset=1, limit=65][0m
[0m✱ [0mGlob ".opencode/skills/system-spec-kit/**/node_modules/.bin/vitest"[90m 0 matches[0m
[0m✱ [0mGlob "**/node_modules/.bin/vitest"[90m 0 matches[0m
[0m→ [0mRead .opencode/skills/system-spec-kit/mcp-server/node_modules/vitest[90m [limit=30][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/node_modules/vitest[90m [limit=30][0m
[0m→ [0mRead .opencode/skills/system-spec-kit/mcp-server/node_modules/.bin[90m [limit=100][0m
[0m→ [0mRead node_modules/.bin[90m [limit=100][0m
[0m
[0m$ [0mSPECKIT_RUN_BENCHES=true node node_modules/vitest/vitest.mjs run --config vitest.config.ts bench/code-graph-query-latency.bench.ts
RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp-server

 ❯ bench/code-graph-query-latency.bench.ts (1 test | 1 failed) 18ms
     × emits query_latency_ms samples within baseline tolerance for all 3 modes 17ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  bench/code-graph-query-latency.bench.ts > code-graph-query-latency bench > emits query_latency_ms samples within baseline tolerance for all 3 modes
BenchInvariantError: mode outline produced no query_latency_ms samples
 ❯ runQueryLatencyBench bench/code-graph-query-latency.bench.ts:177:15
    175|       const samples = extractHistogram(label);
    176|       if (samples.length === 0) {
    177|         throw new BenchInvariantError(`mode ${label} produced no query…
       |               ^
    178|       }
    179|       const observed: ModePct = {
 ❯ bench/code-graph-query-latency.bench.ts:216:20

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  18:37:20
   Duration  185ms (transform 75ms, setup 13ms, import 87ms, tests 18ms, environment 0ms)
[0m
[0m$ [0mSPECKIT_RUN_BENCHES=true node node_modules/vitest/vitest.mjs run --config vitest.config.ts bench/code-graph-parse-latency.bench.ts
RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp-server

 ❯ bench/code-graph-parse-latency.bench.ts (1 test | 1 failed) 4ms
     × emits non-zero samples per language and logs P50/P95/P99 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  bench/code-graph-parse-latency.bench.ts > code-graph parse-latency bench > emits non-zero samples per language and logs P50/P95/P99
AssertionError: fixture missing: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp-server/code_graph/lib/runtime-detection.ts: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ bench/code-graph-parse-latency.bench.ts:80:76
     78|   it('emits non-zero samples per language and logs P50/P95/P99', async…
     79|     for (const fixture of fixtures) {
     80|       expect(existsSync(fixture.path), `fixture missing: ${fixture.pat…
       |                                                                            ^
     81|     }
     82|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  18:37:20
   Duration  191ms (transform 92ms, setup 13ms, import 105ms, tests 4ms, environment 0ms)
[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/schemas/compat-contract.json[90m [limit=220][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/compat/contract.ts[90m [limit=260][0m
[0m✱ [0mGrep "compat-contract\.json|SKILL_ADVISOR_COMPAT_CONTRACT|COMPAT_CONTRACT|recommendRequestDefaults|recommendOptionsDefaults"[90m in .opencode/skills/system-skill-advisor · 23 matches[0m
[0m✱ [0mGrep "compat-contract\.json|recommendRequestDefaults|recommendOptionsDefaults"[90m in .opencode/plugins · 0 matches[0m
[0m✱ [0mGrep "compat-contract|recommendRequestDefaults|recommendOptionsDefaults"[90m in .opencode/plugins/tests · 0 matches[0m
[0m✱ [0mGrep "SKILL_ADVISOR_COMPAT_CONTRACT"[90m in .opencode/skills/system-skill-advisor/mcp-server/tests · 0 matches[0m
[0m✱ [0mGrep "confidenceThreshold.*0\.8|uncertaintyThreshold.*0\.35|statusValues|disabledEnv|forceLocalEnv"[90m in .opencode/skills/system-skill-advisor/mcp-server/tests/compat · 8 matches[0m
[0m✱ [0mGrep "contract\.ts.*compat-contract\.json|compat-contract\.json.*contract\.ts"[90m in .opencode/skills/system-skill-advisor · 0 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts[90m [offset=110, limit=45][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts[90m [offset=1, limit=260][0m
[0m✱ [0mGrep "name:\s*'(advisor_|skill_graph_)"[90m in .opencode/skills/system-skill-advisor/mcp-server/tools · 9 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tools/index.ts[90m [offset=1, limit=180][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-manifest-parity.vitest.ts[90m [offset=1, limit=260][0m
[0m✱ [0mGrep "toolName:\s*'(advisor_|skill_graph_)|name:\s*'(advisor_|skill_graph_)"[90m in .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts · 19 matches[0m
[0m✱ [0mGrep "handleAdvisorRecommend|handleAdvisorRebuild|handleAdvisorStatus|handleAdvisorValidate"[90m in .opencode/skills/system-skill-advisor · 82 matches[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts[90m [offset=1, limit=170][0m
[0m✱ [0mGrep "exports|handlers"[90m in .opencode/skills/system-skill-advisor/mcp-server/package.json · 0 matches[0m
[0m✱ [0mGrep "handlers/index|from ['"].*/handlers(?:/index)?\.js|import\(['"].*/handlers"[90m 100 matches[0m
[0m
[0m$ [0mrg -l 'handle_advisor_(recommend|rebuild|status|validate)' . --glob '*.{ts,js,cjs,mjs,md,yaml,yml,json,sh}' --glob '!.git/**'
./.opencode/skills/system-skill-advisor/mcp-server/handlers/index.ts
./.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-status.ts
./.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-validate.ts
./.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts
./.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-rebuild.ts
./.opencode/specs/system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/002-implementation-deep-research/research/gpt55/iterations/iteration-002.md
./.opencode/specs/system-skill-advisor/z_archive/004-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction/research/multi-ai-council-deliberation.md
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/002-code-vs-sk-code-opencode/review/seats/B09.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/001-readmes-vs-027/review/seats/A08.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/audit/AUD08.out.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/fixers/AF12.out.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/fixers/AF13.out.json
./.opencode/specs/system-code-graph/z_archive/034-code-graph-scatter-from-027/001-code-graph-code-only-indexing/review/deltas/iter-005-raw.json
./.opencode/specs/system-code-graph/z_archive/034-code-graph-scatter-from-027/001-code-graph-code-only-indexing/review/deltas/iter-004-raw.json
[0m
[0m$ [0mrg -l 'SPECKIT_CODEX_HOOK_TIMEOUT_MS' . --glob '*.{ts,js,cjs,mjs,md,yaml,yml,json,sh}' --glob '!.git/**'
./.opencode/bin/mk-skill-advisor-launcher.cjs
./.opencode/specs/sk-doc/016-create-diff-mode/011-skill-anchor-toc-removal/review/iterations/iteration-005.md
./.opencode/specs/sk-doc/016-create-diff-mode/011-skill-anchor-toc-removal/review/iterations/iteration-002.md
./.opencode/specs/system-code-graph/z_archive/034-code-graph-scatter-from-027/001-code-graph-code-only-indexing/review/deltas/iter-005-raw.json
./.opencode/specs/system-code-graph/z_archive/034-code-graph-scatter-from-027/001-code-graph-code-only-indexing/review/deltas/iter-004-raw.json
./.opencode/specs/system-code-graph/z_archive/031-code-graph-buildout/005-resilience-and-advisor/001-code-graph-advisor-refinement/research/001-code-graph-advisor-refinement-roadmap/iterations/iteration-004.md
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/iterations/iteration-044.md
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/findings-registry.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/003-deep-research-remediation/backlog/remediation-backlog.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/003-deep-research-remediation/verify/l5-still-real-partA.md
./.opencode/specs/system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/risk-resolution/lineages/mimo-risk/iterations/iteration-003.md
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/002-code-vs-sk-code-opencode/review/seats/B09.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/002-code-vs-sk-code-opencode/review/seats/B15.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/002-code-vs-sk-code-opencode/review/seats/B10.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/audit/AUD11.out.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/004-code-remediation/fixers/BF10.out.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/audit/AUD10.out.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/fixers/AF16.out.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/fixers/AF18.out.json
./.opencode/specs/system-speckit/026-graph-and-context-optimization/scratch/manual-test-prompts-029-hooks/skill-advisor-hooks.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/009-hook-parity-008-docs-impact-remediation/spec.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/009-hook-parity-008-docs-impact-remediation/plan.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/009-hook-parity-008-docs-impact-remediation/checklist.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/009-hook-parity-008-docs-impact-remediation/tasks.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/009-hook-parity-008-docs-impact-remediation/implementation-summary.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip/scratch/probe-1k-corpus.json
./.opencode/specs/system-speckit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-008-docs-impact-remediation.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-codex-hooks.ts
[0m
[0m$ [0mrg -l 'runSearchQualityHarness|stress-test/search-quality/harness' . --glob '*.{ts,js,cjs,mjs,md,yaml,yml,json,sh}' --glob '!.git/**'
./.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts
./.opencode/skills/system-spec-kit/scripts/evals/check-source-dist-alignment.ts
./.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness.ts
./.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness-telemetry-export.vitest.ts
./.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/baseline.vitest.ts
./.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/measurement-fixtures.ts
./.opencode/specs/system-speckit/026-graph-and-context-optimization/changelog/000-release-and-program-cleanup/changelog-003-024-harness-telemetry-export-mode.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip/scratch/probe-1k-corpus.json
./.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/003-system-bug-improvement-research/research/iterations/iteration-020.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/029-clean-infrastructure-stress-test/measurements/phase-k-v1-0-4-stress.test.ts
./.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/029-clean-infrastructure-stress-test/measurements/v1-0-4-summary.json
./.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/029-clean-infrastructure-stress-test/plan.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/022-stress-test-results-deep-research/research/iterations/iteration-002.md
./.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/024-harness-telemetry-export-mode/implementation-summary.md
[0m
[0m$ [0mrg -l 'semantic-shadow-cosine\.vitest\.ts' . --glob '*.{ts,js,cjs,mjs,md,yaml,yml,json,sh}' --glob '!.git/**'
./.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/README.md
./.opencode/specs/system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/006-deep-review/gpt55/iterations/iteration-004.md
./.opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/baseline/census/symlink-mode-manifest.json
./.opencode/specs/system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/002-implementation-deep-research/research/gpt55/iterations/iteration-002.md
./.opencode/specs/system-deep-loop/z_archive/009-deep-loop-parallel-fanout/008-deep-review/review/iterations/iteration-003.md
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/002-code-vs-sk-code-opencode/review/seats/B09.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/002-code-vs-sk-code-opencode/review/seats/B10.json
./.opencode/specs/system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/fixers/AF14.out.json
./.opencode/specs/system-speckit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-003-embedding-cache-cosine-wiring.md
./.opencode/specs/system-skill-advisor/z_archive/009-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync/spec.md
./.opencode/specs/system-skill-advisor/z_archive/009-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync/plan.md
./.opencode/specs/system-skill-advisor/z_archive/009-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync/tasks.md
./.opencode/specs/system-skill-advisor/z_archive/009-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync/graph-metadata.json
./.opencode/specs/system-skill-advisor/z_archive/005-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring/implementation-summary.md
./.opencode/specs/system-skill-advisor/z_archive/009-playbook-run-and-remediation/005-finding-remediation/research/iterations/iteration-003.md
./.opencode/specs/system-skill-advisor/z_archive/009-playbook-run-and-remediation/005-finding-remediation/research/research.md
./.opencode/specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/plan.md
./.opencode/specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md
./.opencode/specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/research/lineages/gpt55-1/iterations/iteration-010.md
./.opencode/specs/system-skill-advisor/z_archive/004-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction/research/multi-ai-council-deliberation.md
./.opencode/specs/system-skill-advisor/z_archive/010-skill-advisor-embedder-stack/001-pluggable-architecture/plan.md
./.opencode/specs/system-skill-advisor/z_archive/010-skill-advisor-embedder-stack/001-pluggable-architecture/review/iterations/iteration-004.md
[0m
[0m→ [0mRead .opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-codex-hooks.ts[90m [offset=1, limit=80][0m
[0m✱ [0mGrep "SPECKIT_CODEX_HOOK_TIMEOUT_MS"[90m in .opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-codex-hooks.ts · 1 match[0m
[0m✱ [0mGrep "CODEX_HOOK_TIMEOUT|timeoutMs|timeout"[90m in .opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-codex-hooks.ts · 7 matches[0m
[0m
[0m$ [0mnode node_modules/vitest/vitest.mjs list --config vitest.config.ts
...output truncated...

Full output saved to: /Users/michelkerkmeester/.local/share/opencode/tool-output/tool_fa471dc42001sdOaPtmqPcomRE

tests/handlers/advisor-validate-shapes.vitest.ts > PythonTopSkillsSchema (F-005-A5-03) > accepts an empty list
tests/handlers/advisor-validate-shapes.vitest.ts > PythonTopSkillsSchema (F-005-A5-03) > rejects non-array input
tests/handlers/advisor-validate-shapes.vitest.ts > PythonTopSkillsSchema (F-005-A5-03) > rejects elements that are neither string nor null
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > returns the required slice bundle schema for a skill subset
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > surfaces named intent buckets with minN floors
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > computes buckets over the full corpus regardless of skillSlug scope
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > CorpusRowSchema enforces bucket and source_type enums
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > preserves privacy by excluding raw prompts and PII-shaped content
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > drops malformed durable outcome telemetry instead of crashing validation
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > records shadow calibration reports from validate outcomes when explicitly enabled
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > includes newly recorded outcome events in telemetry totals
tests/handlers/advisor-validate.vitest.ts > advisor_validate handler > rejects invalid strict input clearly
tests/handlers/skill-graph-corrupt-honesty.vitest.ts > skill graph status corruption honesty > reports corruption and leaves the file in place instead of quarantining it
tests/handlers/skill-graph-corrupt-honesty.vitest.ts > advisor status corruption downgrades freshness > reads a corrupt-on-disk artifact as stale when integrity is checked
tests/handlers/skill-graph-corrupt-honesty.vitest.ts > advisor status corruption downgrades freshness > does NOT probe (stays live, no cost) on the default read-style path
tests/handlers/skill-graph-corrupt-honesty.vitest.ts > advisor status corruption downgrades freshness > keeps a healthy generation live when the artifact opens cleanly
tests/handlers/skill-graph-dispatch.vitest.ts > mk_skill_advisor dispatch > routes all eight public tools to advisor-local handlers
tests/handlers/skill-graph-dispatch.vitest.ts > mk_skill_advisor dispatch > returns query validation errors before calling the query handler
tests/handlers/skill-graph-listing.vitest.ts > mk_skill_advisor skill_graph_* listing > lists advisor tools plus the registered skill_graph_* tools
tests/handlers/skill-graph-listing.vitest.ts > mk_skill_advisor skill_graph_* listing > keeps the skill_graph_* JSON schemas aligned with the public ids
tests/handlers/skill-graph-scan-auth.vitest.ts > skill_graph_scan caller authority > rejects untrusted callers before mutating the graph
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > AS1 emits hookSpecificOutput.additionalContext for a work-intent prompt
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > AS2 emits {} for an empty prompt skipped by the producer
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > AS3 emits {} for /help skipped by the producer
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > AS4 respects SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 without calling the producer
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > AS5 emits {} for invalid JSON stdin without throwing
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > AS6 emits {} for producer timeout/fail-open and never emits a block decision
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > CHK-021 emits {} for Python-missing fail-open
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > CHK-028 keeps adapter cache-hit p95 under 60 ms with cached producer output
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > T014 normalizes Claude JSON additionalContext via the 005 comparator
tests/hooks/claude-user-prompt-submit-hook.vitest.ts > Claude UserPromptSubmit advisor hook > swallows async diagnostic persistence failures
tests/hooks/runtime-parity.vitest.ts > 3-runtime advisor brief parity > produces byte-equivalent brief for a known passing fixture across all 3 runtimes
tests/hooks/runtime-parity.vitest.ts > 3-runtime advisor brief parity > returns empty brief for skipped fixture across all 3 runtimes
tests/hooks/runtime-parity.vitest.ts > 3-runtime advisor brief parity > fails open on parse failure across all 3 runtimes
tests/hooks/runtime-parity.vitest.ts > 3-runtime advisor brief parity > accepts opencode runtime tag in buildSkillAdvisorBrief options
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > settings file exists at the expected path
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > top-level hooks block is defined and contains the four expected events
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > event is a single-element array of matcher-groups (no parallel-hook duplication)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > matcher-group has a `matcher` string field
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > matcher-group has the expected nested `hooks[]` array length
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > matcher-group has no top-level `bash` field (the F23.1 trigger)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > inner hook has `type: "command"`
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > inner hook has a non-empty `command` string
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > command points at the claude/ adapter, NOT copilot/opencode
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > command is anchored to the portable project dir and invokes the claude adapter via node
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=UserPromptSubmit > command terminates in a .js script reference
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > event is a single-element array of matcher-groups (no parallel-hook duplication)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > matcher-group has a `matcher` string field
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > matcher-group has the expected nested `hooks[]` array length
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > matcher-group has no top-level `bash` field (the F23.1 trigger)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > inner hook has `type: "command"`
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > inner hook has a non-empty `command` string
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > command points at the claude/ adapter, NOT copilot/opencode
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > command is anchored to the portable project dir and invokes the claude adapter via node
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=PreCompact > command terminates in a .js script reference
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > event is a single-element array of matcher-groups (no parallel-hook duplication)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > matcher-group has a `matcher` string field
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > matcher-group has the expected nested `hooks[]` array length
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > matcher-group has no top-level `bash` field (the F23.1 trigger)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > inner hook has `type: "command"`
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > inner hook has a non-empty `command` string
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > command points at the claude/ adapter, NOT copilot/opencode
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > command is anchored to the portable project dir and invokes the claude adapter via node
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart > command terminates in a .js script reference
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > event is a single-element array of matcher-groups (no parallel-hook duplication)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > matcher-group has a `matcher` string field
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > matcher-group has the expected nested `hooks[]` array length
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > matcher-group has no top-level `bash` field (the F23.1 trigger)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > inner hook has `type: "command"`
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > inner hook has a non-empty `command` string
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > command points at the claude/ adapter, NOT copilot/opencode
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > command is anchored to the portable project dir and invokes the claude adapter via node
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop > command terminates in a .js script reference
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=Stop (async-flush special case) > Stop hook is async with a flush-window timeout (>= 10s)
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > event=SessionStart (worktree guard special case) > SessionStart appends the worktree guard after the session-prime handler
tests/hooks/settings-driven-invocation-parity.vitest.ts > settings-driven invocation parity (F23.1 / F25 / F46 / F56) > anti-regression: copilot adapter must not appear anywhere in the file > grep -c "hooks/copilot/" returns 0
tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts > skill advisor CLI fallback envelope > normalizes advisor fallback outcomes to the shared warm-fallback shape
tests/parity/holdout-independent.vitest.ts > independent holdout gate > is a non-trivial, provenance-tagged set
tests/parity/holdout-independent.vitest.ts > independent holdout gate > is disjoint from the training corpus (measures generalization, not memorization)
tests/parity/holdout-independent.vitest.ts > independent holdout gate > holds top-1 at or above the committed baseline
tests/parity/local-native-divergence-ratchet.vitest.ts > local-vs-native routing divergence ratchet (eval gate) > uses a non-trivial union corpus and a well-formed ledger
tests/parity/local-native-divergence-ratchet.vitest.ts > local-vs-native routing divergence ratchet (eval gate) > ledger has no duplicate ids
tests/parity/local-native-divergence-ratchet.vitest.ts > local-vs-native routing divergence ratchet (eval gate) > every ledger id exists in the corpus
tests/parity/local-native-divergence-ratchet.vitest.ts > local-vs-native routing divergence ratchet (eval gate) > every current divergence is recorded in the ledger (no new drift)
tests/parity/local-native-divergence-ratchet.vitest.ts > local-vs-native routing divergence ratchet (eval gate) > every ledger entry is still divergent (resolved entries removed)
tests/parity/local-native-divergence-ratchet.vitest.ts > local-vs-native routing divergence ratchet (eval gate) > ledger entries match current promptHash and local/native tops
tests/parity/python-ts-parity.vitest.ts > 027/003 AC-1/AC-2 regression-protection parity and §11 gates > preserves all Python-correct corpus decisions while improving accuracy
tests/parity/python-ts-parity.vitest.ts > 027/003 AC-1/AC-2 regression-protection parity and §11 gates > AC-4 ablation disabling lexical reduces corpus accuracy
tests/parity/scorer-eval-baseline-ratchet.vitest.ts > scorer eval baseline ratchet (accuracy non-regression gate) > the baseline is well-formed
tests/parity/scorer-eval-baseline-ratchet.vitest.ts > scorer eval baseline ratchet (accuracy non-regression gate) > fixture hashes match the pinned baseline (no silent fixture drift)
tests/parity/scorer-eval-baseline-ratchet.vitest.ts > scorer eval baseline ratchet (accuracy non-regression gate) > full-corpus top-1 holds exactly and clears the release floor
tests/parity/scorer-eval-baseline-ratchet.vitest.ts > scorer eval baseline ratchet (accuracy non-regression gate) > unknown_count and gold_none_false_fire hold (both improve downward)
tests/parity/scorer-eval-baseline-ratchet.vitest.ts > scorer eval baseline ratchet (accuracy non-regression gate) > holdout top-1 holds exactly and clears the release floor
tests/parity/scorer-eval-baseline-ratchet.vitest.ts > scorer eval baseline ratchet (accuracy non-regression gate) > ambiguity slice top-1 holds exactly
tests/parity/scorer-eval-baseline-ratchet.vitest.ts > scorer eval baseline ratchet (accuracy non-regression gate) > named buckets hold exactly and satisfy minN
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS1 skips empty prompt
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS2 skips /help
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS3 fires on work-intent prompt and wraps advisor envelope
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > uses the shared ambiguous renderer contract for payload and brief content
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > uses the scorer ambiguity helper for score-near ties
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS4 fail-opens on subprocess timeout
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS5 treats JSON fallback freshness as stale ok output
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS6 stale freshness returns ok with a stale badge
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS7 absent freshness skips with null brief
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > maps unavailable freshness to degraded with null brief
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > preserves uncaught producer exception detail in fail-open diagnostics
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS8 exact HMAC cache hit returns identical brief without subprocess
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > keeps cache entries distinct for different maxTokens values
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > restamps top-level and envelope generatedAt on cache hits
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS9 deleted-skill invalidates cached brief and re-runs advisor
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > AS10 enforces the hard 120 token cap regardless of advisor output
tests/legacy/advisor-brief-producer.vitest.ts > buildSkillAdvisorBrief > records metalinguistic skill-name diagnostics without leaking prompt text
tests/legacy/advisor-corpus-parity.vitest.ts > advisor 193-prompt corpus regression-protection parity > preserves Python-correct top-1 decisions while allowing native improvements
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS1 returns live state when all sources are present and fresh
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS2 returns stale when SKILL.md is newer than skill-graph.sqlite
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS3 returns absent when skill-graph.sqlite is missing and no JSON fallback exists
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS4 returns unavailable when the source probe fails
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS5 suppresses deleted skills instead of reusing stale fingerprints
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS6 treats JSON fallback as stale and never live
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS7 advances generation after a rebuild signal
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS8 returns a cache hit within the 15-minute TTL and invalidates on signature change
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > changes source signature for same-size same-mtime source rewrites
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS9 recovers malformed generation.json on writable filesystems without returning live
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > AS10 fails closed when malformed generation.json cannot be regenerated
tests/legacy/advisor-freshness.vitest.ts > getAdvisorFreshness > bench records cold and warm probe p50/p95/p99 over 30 samples
tests/legacy/advisor-graph-evidence-calibration.vitest.ts > advisor graph evidence calibration > lowers uncertainty when graph evidence is the majority signal
tests/legacy/advisor-graph-health.vitest.ts > advisor graph health > validates graph metadata without orphan skills
tests/legacy/advisor-graph-health.vitest.ts > advisor graph health > keeps health ok when skill-advisor is the only graph-only node
tests/legacy/advisor-observability.vitest.ts > advisor observability contract > defines the speckit_advisor_hook metric namespace and closed labels
tests/legacy/advisor-observability.vitest.ts > advisor observability contract > serializes AdvisorHookDiagnosticRecord JSONL without forbidden prompt-bearing fields
tests/legacy/advisor-observability.vitest.ts > advisor observability contract > rejects diagnostic records with forbidden fields
tests/legacy/advisor-observability.vitest.ts > advisor observability contract > builds advisor-hook-health with last-N records, rolling cache hit rate, and p95
tests/legacy/advisor-observability.vitest.ts > advisor observability contract > keeps alert thresholds configurable through env
tests/legacy/advisor-observability.vitest.ts > advisor observability contract > sanitizes durable outcome labels to skill-id slugs
tests/legacy/advisor-observability.vitest.ts > advisor observability contract > preserves concurrent durable outcome appends
tests/legacy/advisor-privacy.vitest.ts > advisor privacy audit > keeps raw prompts out of envelope sources, metrics, stderr JSONL, health, and cache keys
tests/legacy/advisor-prompt-cache.vitest.ts > skill advisor prompt cache > returns exact HMAC cache hits within the TTL
tests/legacy/advisor-prompt-cache.vitest.ts > skill advisor prompt cache > invalidates all prior entries when sourceSignature changes
tests/legacy/advisor-prompt-cache.vitest.ts > skill advisor prompt cache > uses opaque HMAC keys and never embeds raw prompt text
tests/legacy/advisor-prompt-cache.vitest.ts > skill advisor prompt cache > includes normalized maxTokens in prompt cache keys
tests/legacy/advisor-prompt-cache.vitest.ts > skill advisor prompt cache > evicts the oldest entries when the size cap is reached
tests/legacy/advisor-prompt-policy.vitest.ts > skill advisor prompt policy > skips empty, whitespace, and exact navigation commands
tests/legacy/advisor-prompt-policy.vitest.ts > skill advisor prompt policy > skips short casual acknowledgements with no work intent
tests/legacy/advisor-prompt-policy.vitest.ts > skill advisor prompt policy > fires for explicit skill, command, and governance markers
tests/legacy/advisor-prompt-policy.vitest.ts > skill advisor prompt policy > fires for work-intent verbs with at least three meaningful tokens
tests/legacy/advisor-prompt-policy.vitest.ts > skill advisor prompt policy > fires for length plus meaningful-token thresholds
tests/legacy/advisor-prompt-policy.vitest.ts > skill advisor prompt policy > canonical-folds Unicode before classification and extracts metalinguistic skill names
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > renders the live passing skill from whitelisted fields only
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > renders stale freshness with explicit stale wording
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > emits no brief when no skill passes threshold
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > emits no brief on fail-open timeout
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > emits no brief for short casual skipped prompts
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > renders top-two ambiguity when the producer result carries the 120-token mode
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > renders score-near ambiguity when confidence is separated
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > renders a single recommendation when score and confidence are separated
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > blocks canonical-folded instruction-shaped skill labels
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > rejects newline labels instead of normalizing them into model-visible text
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > does not echo adversarial prompt fixture content
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > keeps skip-policy fixtures null
tests/legacy/advisor-renderer.vitest.ts > renderAdvisorBrief > does not read free-form predecessor fields in the renderer source
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > parses strict JSON array output
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > fails open on JSON parse failure
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > fails open on schema-invalid JSON stdout
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > fails open on non-busy nonzero exit codes
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > kills the child on timeout and reports TIMEOUT
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > retries SQLITE_BUSY once when timeout budget remains
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > reports SQLITE_BUSY retry exhaustion after the retry budget is spent
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > classifies child-process spawn errors for missing and non-executable runtimes
tests/legacy/advisor-subprocess.vitest.ts > runAdvisorSubprocess > returns SCRIPT_MISSING before spawning when target is absent
tests/legacy/advisor-timing.vitest.ts > advisor timing harness > records four lanes and gates only cache-hit p95
tests/legacy/advisor-timing.vitest.ts > advisor timing harness > meets the corrected 30-turn replay cache hit-rate gate
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorRecommendInputSchema workspaceRoot bounding (F-005-A5-01) > accepts paths under os.tmpdir()
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorRecommendInputSchema workspaceRoot bounding (F-005-A5-01) > accepts the repo root
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorRecommendInputSchema workspaceRoot bounding (F-005-A5-01) > rejects an arbitrary path outside the allowlist
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorRecommendInputSchema workspaceRoot bounding (F-005-A5-01) > treats workspaceRoot as optional when omitted
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorRecommendOutputSchema runtime lane health > accepts prompt-safe degraded lane metadata
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorValidateInputSchema workspaceRoot bounding (F-005-A5-01) > accepts paths under os.tmpdir()
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorValidateInputSchema workspaceRoot bounding (F-005-A5-01) > rejects an arbitrary path outside the allowlist
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorStatusInputSchema workspaceRoot bounding (F-005-A5-01) > rejects an arbitrary path outside the allowlist
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorStatusInputSchema workspaceRoot bounding (F-005-A5-01) > accepts a tmpdir path
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorRebuildInputSchema workspaceRoot bounding (F-005-A5-01) > rejects an arbitrary path outside the allowlist
tests/schemas/advisor-tool-schemas.vitest.ts > AdvisorRebuildInputSchema workspaceRoot bounding (F-005-A5-01) > treats workspaceRoot as optional
tests/schemas/advisor-tool-schemas.vitest.ts > isAllowedWorkspaceRoot (F-005-A5-01) > canonicalizes via realpath before checking allowlist
tests/schemas/advisor-tool-schemas.vitest.ts > isAllowedWorkspaceRoot (F-005-A5-01) > rejects unresolvable absolute paths outside the allowlist
tests/schemas/advisor-tool-schemas.vitest.ts > isAllowedWorkspaceRoot (F-005-A5-01) > rejects empty string
tests/schemas/advisor-tool-schemas.vitest.ts > isAllowedWorkspaceRoot (F-005-A5-01) > respects SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST env extras at module load time
tests/skill-graph/refresh-roundtrip.vitest.ts > 010/004 refreshSkillEmbeddings round-trip > adapter path: when active pointer set, writes to vec_<dim> via getAdapter
tests/skill-graph/refresh-roundtrip.vitest.ts > 010/004 refreshSkillEmbeddings round-trip > adapter path: re-running with no source changes skips (idempotent)
tests/skill-graph/refresh-roundtrip.vitest.ts > 010/004 refreshSkillEmbeddings round-trip > adapter path: returns ADAPTER-UNAVAILABLE warning when manifest is unknown
tests/skill-graph/refresh-roundtrip.vitest.ts > 010/004 refreshSkillEmbeddings round-trip > adapter path: fails fast on adapter-vs-pointer dim mismatch (P1-1)
tests/skill-graph/refresh-roundtrip.vitest.ts > 010/004 refreshSkillEmbeddings round-trip > legacy path: when pointer NOT set, falls back to createEmbeddingsProvider
tests/utils/workspace-root.vitest.ts > findAdvisorWorkspaceRoot — sentinel walk-up > returns the directory that holds the sentinel (happy path)
tests/utils/workspace-root.vitest.ts > findAdvisorWorkspaceRoot — fallback never lands inside a specs/ tree > hoists above a canonical .opencode/specs/ subtree when no sentinel is reachable
tests/utils/workspace-root.vitest.ts > findAdvisorWorkspaceRoot — fallback never lands inside a specs/ tree > hoists above a bare specs/ alias subtree when no sentinel is reachable
tests/utils/workspace-root.vitest.ts > findAdvisorWorkspaceRoot — fallback never lands inside a specs/ tree > never returns a path containing a specs segment for a packet-nested start
tests/utils/workspace-root.vitest.ts > findAdvisorWorkspaceRoot — non-specs paths keep prior fallback > returns the start dir for an ordinary path with no sentinel and no specs segment
tests/scorer/advisor-feedback-calibration.vitest.ts > advisor feedback calibration reducer > is default-off and produces read-only proposals only
tests/scorer/advisor-feedback-calibration.vitest.ts > advisor feedback calibration reducer > excludes low-sample outcome sets instead of proposing noisy deltas
tests/scorer/advisor-feedback-calibration.vitest.ts > advisor feedback calibration reducer > caps attributed lane deltas and threshold signals
tests/scorer/advisor-feedback-calibration.vitest.ts > advisor feedback calibration reducer > blocks concentrated samples as poisoning-prone evidence
tests/scorer/advisor-feedback-calibration.vitest.ts > advisor feedback calibration reducer > records advisory calibration output only when the flag is enabled
tests/scorer/advisor-feedback-calibration.vitest.ts > advisor feedback calibration live scorer isolation > keeps recommendation order, scores, and weights byte-identical with the shadow flag on
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-01 graph-causal conflict preservation > emits negative-scored matches for conflicts_with edges
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-01 graph-causal conflict preservation > preserves positive-scored entries (regression guard)
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-02 distinct derivedTriggers and derivedKeywords > keeps trigger_phrases out of derivedKeywords when key_topics differ
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-02 distinct derivedTriggers and derivedKeywords > passes both fields to scoreAdvisorPrompt without aliasing
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-03 token-stuffing dispersion guard > legitimate task-intent prompt with strong direct anchor still passes
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-03 token-stuffing dispersion guard > exposes guard via internal API: token-stuffed prompt does not force taskIntentFloor
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-04 ambiguity tie-cluster computation > three-way tie within margin populates ambiguousWith for all members
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-04 ambiguity tie-cluster computation > outside both score and confidence margins is unambiguously ranked
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-04 ambiguity tie-cluster computation > Packet 084: score outside margin but confidence within margin is ambiguous (SAD-002 case)
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-04 ambiguity tie-cluster computation > two candidates within margin still detected as ambiguous
tests/scorer/advisor-quality-049-003.vitest.ts > F-012-C2-04 ambiguity tie-cluster computation > non-passing candidates excluded from cluster
tests/scorer/advisor-quality-049-003.vitest.ts > F-013-C3-01 review-plus-write disambiguation > routes "review and update this" toward sk-code (not sk-code-review)
tests/scorer/advisor-quality-049-003.vitest.ts > F-013-C3-01 review-plus-write disambiguation > does not fire on pure review prompts (no write verb)
tests/scorer/advisor-quality-049-003.vitest.ts > F-013-C3-01 review-plus-write disambiguation > fires on each write verb variant (update, edit, fix, modify)
tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts > advisor self-recommendation penalty contract > is a negative penalty in the calibration constants
tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts > advisor self-recommendation penalty contract > keeps system-skill-advisor off the top spot on an audit prompt
tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts > advisor self-recommendation penalty contract > demotes the advisor below a score-tied competitor that would otherwise win the tie-break
tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts > advisor self-recommendation penalty contract > also demotes the skill-advisor ALIAS off the top spot on an audit prompt
tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts > advisor self-recommendation penalty contract > does not penalize the advisor when the prompt is not a recommendation audit
tests/scorer/ambiguity-slice.vitest.ts > ambiguity slice gate > is a non-empty, meaningful minority carrying its existing gold labels
tests/scorer/ambiguity-slice.vitest.ts > ambiguity slice gate > has a single frozen tau matching the baseline
tests/scorer/ambiguity-slice.vitest.ts > ambiguity slice gate > holds top-1 at or above the committed baseline
tests/scorer/beta-reliability.vitest.ts > beta posterior primitive > reads the uninformative 0.5 on cold start with Beta(1,1)
tests/scorer/beta-reliability.vitest.ts > beta posterior primitive > is flood-immune: 8 vs 10,000 all-accepted samples are NOT identical
tests/scorer/beta-reliability.vitest.ts > beta posterior primitive > holds the neutral prior below the count floor
tests/scorer/beta-reliability.vitest.ts > beta posterior primitive > rejects non-finite / negative counts
tests/scorer/beta-reliability.vitest.ts > advisor adapter (posterior → weight delta) > maps the neutral posterior to a zero delta (promotes nothing)
tests/scorer/beta-reliability.vitest.ts > advisor adapter (posterior → weight delta) > maps the poles to ±maxAbs
tests/scorer/beta-reliability.vitest.ts > asymmetric sink delta > is decay-only at gain 0 (acceptances never raise)
tests/scorer/beta-reliability.vitest.ts > asymmetric sink delta > keeps the sink at least as hard as the raise (down ≥ up) for equal pressure
tests/scorer/beta-reliability.vitest.ts > asymmetric sink delta > never ratchets past the cap
tests/scorer/beta-reliability.vitest.ts > two-gate promotion > promotes only when BOTH gates pass (non-trading conjunction)
tests/scorer/beta-reliability.vitest.ts > two-gate promotion > refuses on the k-floor even with a strong posterior
tests/scorer/beta-reliability.vitest.ts > two-gate promotion > refuses on the posterior even with enough attesters
tests/scorer/beta-reliability.vitest.ts > two-gate promotion > refuses an unreachable policy rather than silently never-promoting
tests/scorer/beta-reliability.vitest.ts > two-gate promotion > refuses degenerate k-floors
tests/scorer/beta-reliability.vitest.ts > held-out attestation > drops self-attestations (a producer cannot vote up its own reliability)
tests/scorer/beta-reliability.vitest.ts > held-out attestation > counts one vote per source and stays below certainty
tests/scorer/beta-reliability.vitest.ts > held-out attestation > resolves a tied source to failure (the conservative direction)
tests/scorer/beta-reliability.vitest.ts > content-addressed fold > folds a replay / double-delivery exactly once
tests/scorer/beta-reliability.vitest.ts > content-addressed fold > is order-independent
tests/scorer/beta-reliability.vitest.ts > content-addressed fold > derives a stable content id regardless of key order
tests/scorer/beta-reliability.vitest.ts > decay un-promotion (reversible, audit-tagged) > re-promotes on regained support (stable lane id)
tests/scorer/beta-reliability.vitest.ts > decay un-promotion (reversible, audit-tagged) > distinguishes support-went-bad from lost-support on demotion
tests/scorer/beta-reliability.vitest.ts > decay un-promotion (reversible, audit-tagged) > holds the frozen default between thresholds
tests/scorer/beta-reliability.vitest.ts > asymmetric threshold wiring stays default-off > keeps the symmetric value when no gain is set
tests/scorer/beta-reliability.vitest.ts > asymmetric threshold wiring stays default-off > lets acceptances offset corrections at full gain
tests/scorer/bm25-lexical-shadow.vitest.ts > advisor packed BM25 lexical shadow lane > is default-off and does not change live scorer output when the flag is enabled
tests/scorer/bm25-lexical-shadow.vitest.ts > advisor packed BM25 lexical shadow lane > applies query-time BM25F weights so name and keywords beat repeated description text
tests/scorer/bm25-lexical-shadow.vitest.ts > advisor packed BM25 lexical shadow lane > indexes derived triggers as a field without promoting them above authored name or keywords
tests/scorer/bm25-lexical-shadow.vitest.ts > advisor packed BM25 lexical shadow lane > packs postings into typed arrays and clears mutable warmup arrays
tests/scorer/bm25-lexical-shadow.vitest.ts > advisor packed BM25 lexical shadow lane > matches or beats the current lexical lane on exact-label advisor corpus prompts
tests/scorer/conflict-query-rerank.vitest.ts > advisor conflict, query class, and exact rerank seams > counts opt-in graph conflict demotions when metrics are enabled
tests/scorer/conflict-query-rerank.vitest.ts > advisor conflict, query class, and exact rerank seams > keeps query-class routing default-off and explicit-author dominant when enabled
tests/scorer/conflict-query-rerank.vitest.ts > advisor conflict, query class, and exact rerank seams > bypasses the semantic cutoff only for the requested exact subset
tests/scorer/conflict-query-rerank.vitest.ts > advisor conflict, query class, and exact rerank seams > uses exact semantic scores as an opt-in deterministic top-set tiebreak
tests/scorer/executor-delegation.vitest.ts > executor-delegation resolver (pure detector) > routes a direct executor alias to its executor
tests/scorer/executor-delegation.vitest.ts > executor-delegation resolver (pure detector) > routes a direct model alias to its executor
tests/scorer/executor-delegation.vitest.ts > executor-delegation resolver (pure detector) > routes an orchestrator noun co-occurring with a delegation cue
tests/scorer/executor-delegation.vitest.ts > executor-delegation resolver (pure detector) > routes a claude-code direct alias to cli-claude-code
tests/scorer/executor-delegation.vitest.ts > executor-delegation resolver (pure detector) > does not fire on the code hub opencode-standards surface (negative guard)
tests/scorer/executor-delegation.vitest.ts > executor-delegation resolver (pure detector) > abstains (no route, null executor) when a retired executor is named
tests/scorer/executor-delegation.vitest.ts > executor-delegation resolver (pure detector) > does not fire on a bare opencode mention with no delegation cue
tests/scorer/executor-delegation.vitest.ts > executor-delegation shared fixture (TS native + Python parity) > has a well-formed non-trivial fixture
tests/scorer/executor-delegation.vitest.ts > executor-delegation shared fixture (TS native + Python parity) > routes every fixture case to its expected top-1 on the native scorer
tests/scorer/executor-delegation.vitest.ts > executor-delegation shared fixture (TS native + Python parity) > agrees TS-native == Python for every fixture case
tests/scorer/graph-causal-visited-order.vitest.ts > graph-causal visited-guard order > scores a stronger later edge that a weaker earlier edge previously suppressed
tests/scorer/graph-causal-visited-order.vitest.ts > graph-causal visited-guard order > produces the same combined score regardless of edge processing order
tests/scorer/graph-causal-visited-order.vitest.ts > graph-causal visited-guard order > does not let a below-threshold earlier edge suppress a later above-threshold edge
tests/scorer/graph-causal-visited-order.vitest.ts > graph-causal visited-guard order > does not propagate positive score through a negative edge
tests/scorer/graph-causal-visited-order.vitest.ts > graph-causal visited-guard order > terminates with a bounded match set on a cycle at elevated depth and breadth
tests/scorer/lane-registry-env-override.vitest.ts > lane-registry env-override > preserves defaults when env vars are unset
tests/scorer/lane-registry-env-override.vitest.ts > lane-registry env-override > merges partial env override with defaults
tests/scorer/lane-registry-env-override.vitest.ts > lane-registry env-override > falls back to defaults on malformed JSON
tests/scorer/lane-registry-env-override.vitest.ts > lane-registry env-override > rejects out-of-range values and unknown lane ids
tests/scorer/lane-registry-env-override.vitest.ts > lane-registry env-override > honors the shadow-weights env independently
tests/scorer/lane-registry-env-override.vitest.ts > lane-registry env-override > rejects array JSON (must be a plain object)
tests/scorer/lane-weight-sweep.vitest.ts > 015/004 seeded lane weight sweep harness > applies lane weight overrides without changing unrelated lane weights
tests/scorer/lane-weight-sweep.vitest.ts > 015/004 seeded lane weight sweep harness > sweeps candidate lane weight vectors with seeded embeddings and writes the packet report
tests/scorer/lane-weight-sweep.vitest.ts > 015/004 seeded lane weight sweep harness > sweeps candidate lane weight vectors against the harder lexical-mis-route corpus
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > AC-1 weights config uses locked 5-lane named constants
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > AC-3 marks top-2-within-0.05 recommendations ambiguous
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > does not mark top-two recommendations ambiguous when both score and confidence are outside the margins
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > AC-5 semantic shadow scores and contributes to live fusion
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > AC-8 explicit deprecated prompt surfaces deprecated skill with redirect metadata
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > AC-7 scorer keeps explicit author signals ahead of derived-only overlap
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > adversarial stuffing fixture cannot pass default routing from derived-only evidence
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > ages derived generated evidence from projection generatedAt
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > applies derived anti-stuffing demotion in the derived lane
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > includeAllCandidates exposes failed candidates without promoting topSkill
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > routes memory-save and create-agent touchstone prompts to command bridges
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > 065/002 keeps ordinary file-save prompts below memory-save routing confidence
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > 065/002 routes next-session preservation phrasing to memory-save
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > 065/003 routes testing-playbook creation to the dedicated command bridge
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > 065/004 canonicalizes command ids and skill ids through narrow alias groups
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > 065/005 routes ambiguous code-problem prompts toward review without overconfidence
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > 065/005 keeps clear implementation prompts on sk-code
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > routes natural council deliberation prompts to system-deep-loop despite compare wording
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > projects derived triggers and keywords from distinct sources via filesystem fallback
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > falls back to filesystem projection when the SQLite graph is corrupt
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > does not propagate positive graph causal score through negative edges
tests/scorer/native-scorer.vitest.ts > 027/003 native scorer units > AC-6 scorer latency p95 meets cache-hit and uncached gates
tests/scorer/projection-embedding-staleness.vitest.ts > advisor projection embedding staleness > carries a fresh signature when stored vectors match the active embedder
tests/scorer/projection-embedding-staleness.vitest.ts > advisor projection embedding staleness > flags a projection stale when stored vectors belong to a different model
tests/scorer/projection-embedding-staleness.vitest.ts > advisor projection embedding staleness > fails closed when populated vectors have no stored model signature
tests/scorer/projection-embedding-staleness.vitest.ts > advisor projection embedding staleness > does not mark an empty projection stale when there are no stored vectors
tests/scorer/projection-embedding-staleness.vitest.ts > advisor projection embedding staleness > degrades the semantic shadow lane when the projection verdict is stale
tests/scorer/projection-embedding-staleness.vitest.ts > advisor projection embedding staleness > reports stale projection vectors in semantic lane health
tests/scorer/projection-fallback-049-005.vitest.ts > F-004-A4-01: loadAdvisorProjection surfaces SQLite failures explicitly > returns source=filesystem when the SQLite DB does not exist (legitimate first run)
tests/scorer/projection-fallback-049-005.vitest.ts > F-004-A4-01: loadAdvisorProjection surfaces SQLite failures explicitly > returns source=filesystem-fallback with a reason when the SQLite DB is corrupt
tests/scorer/projection-freshness.vitest.ts > derived-content freshness projection contract > decays the derived lane by per-skill derivedGeneratedAt, not the near-now projection generatedAt
tests/scorer/projection-freshness.vitest.ts > derived-content freshness projection contract > loads derived.generated_at as the canonical per-skill freshness over a stray last_updated_at
tests/scorer/provenance-self-boost-guard.vitest.ts > advisor provenance self-boost and audit penalty > keeps producer identity out of the default explicit-author lane output
tests/scorer/provenance-self-boost-guard.vitest.ts > advisor provenance self-boost and audit penalty > threads producer identity when includeProducerIdentity is requested
tests/scorer/provenance-self-boost-guard.vitest.ts > advisor provenance self-boost and audit penalty > routes a non-advisor explicit-author prompt to the matching skill
tests/scorer/provenance-self-boost-guard.vitest.ts > advisor provenance self-boost and audit penalty > applies the recommendation-audit penalty to the advisor alias
tests/scorer/provenance-self-boost-guard.vitest.ts > advisor provenance self-boost and audit penalty > applies the recommendation-audit penalty to the canonical advisor id
tests/scorer/rrf-determinism-spine.vitest.ts > advisor RRF determinism spine > keeps weighted-sum fusion as the default scorer path
tests/scorer/rrf-determinism-spine.vitest.ts > advisor RRF determinism spine > fuses opt-in lane ranks through the shared RRF primitive with advisor k
tests/scorer/rrf-determinism-spine.vitest.ts > advisor RRF determinism spine > splits graph positives from conflict mass for RRF consumers
tests/scorer/rrf-determinism-spine.vitest.ts > advisor RRF determinism spine > applies conflict mass as an opt-in post-fusion demotion
tests/scorer/runtime-lane-health.vitest.ts > runtime lane health graceful degradation > keeps an explicit healthy signal byte-identical to the default path
tests/scorer/runtime-lane-health.vitest.ts > runtime lane health graceful degradation > retains a healthy zero-match lane in the denominator
tests/scorer/runtime-lane-health.vitest.ts > runtime lane health graceful degradation > elides only runtime-degraded lanes from confidence normalization
tests/scorer/runtime-lane-health.vitest.ts > runtime lane health graceful degradation > keeps a lane live when degraded health still emits matches
tests/scorer/semantic-lane-promotion.vitest.ts > semantic lane promotion > keeps the promoted live weights normalized
tests/scorer/semantic-lane-promotion.vitest.ts > semantic lane promotion > keeps pre-promotion routing stable for implement a new code-graph scan feature with tests
tests/scorer/semantic-lane-promotion.vitest.ts > semantic lane promotion > keeps pre-promotion routing stable for save context for the next session
tests/scorer/semantic-lane-promotion.vitest.ts > semantic lane promotion > keeps pre-promotion routing stable for review this pull request for regressions
tests/scorer/semantic-lane-promotion.vitest.ts > semantic lane promotion > keeps pre-promotion routing stable for use code search to find implementation patterns
tests/scorer/semantic-lane-promotion.vitest.ts > semantic lane promotion > keeps pre-promotion routing stable for update the packet implementation-summary docs
tests/scorer/semantic-shadow-ablation.vitest.ts > semantic-shadow paired ablation (opt-in, seeded) > activates the seeded semantic lane (fail-on-skip under the opt-in flag)
tests/scorer/semantic-shadow-ablation.vitest.ts > semantic-shadow paired ablation (opt-in, seeded) > keeps the semantic lane within its frozen-weight neutral band over the full corpus
tests/scorer/semantic-shadow-ablation.vitest.ts > semantic-shadow runtime degradation detector > surfaces a silent lane degradation through getSemanticShadowRuntimeHealth
tests/scorer/semantic-shadow-ablation.vitest.ts > semantic-shadow runtime degradation detector > exposes the runtime-health telemetry contract
[0m
[0m$ [0mnode node_modules/vitest/vitest.mjs list --config vitest.config.ts --filesOnly
tests/advisor-rebuild.vitest.ts
tests/command-binding-existence.vitest.ts
tests/command-bridge-resolution-guard.vitest.ts
tests/compiled-routing-consumption.vitest.ts
tests/cross-skill-edges.vitest.ts
tests/daemon-freshness-foundation.vitest.ts
tests/daemon-watcher-resource-leaks-049-005.vitest.ts
tests/discovery-pipeline-parity.vitest.ts
tests/launcher-bootstrap.vitest.ts
tests/launcher-idle-timeout.vitest.ts
tests/launcher-lease.vitest.ts
tests/launcher-reap-pid-reuse.vitest.ts
tests/lifecycle-derived-metadata.vitest.ts
tests/manual-testing-playbook.vitest.ts
tests/metadata-sanitizer-entities-guard.vitest.ts
tests/migration-lineage-identity.vitest.ts
tests/mk-skill-advisor-plugin.vitest.ts
tests/parent-skill-check-fixtures.vitest.ts
tests/rename-invariants.vitest.ts
tests/routing-parity-deep-council.vitest.ts
tests/routing-parity-deep-skills.vitest.ts
tests/routing-registry-drift-guard.vitest.ts
tests/shadow-sink.vitest.ts
tests/skill-advisor-cli-dual-client.vitest.ts
tests/skill-advisor-cli-help-aliases-errors.vitest.ts
tests/skill-advisor-cli-job-semantics.vitest.ts
tests/skill-advisor-cli-manifest-parity.vitest.ts
tests/skill-advisor-cli-parity.vitest.ts
tests/skill-advisor-cli-trusted-prompt-time.vitest.ts
tests/skill-advisor-launcher-orphan-reaping.vitest.ts
tests/skill-doc-harvest.vitest.ts
tests/skill-graph-bfs-traversal.vitest.ts
tests/skill-graph-db.vitest.ts
tests/skill-graph-diagnostic-redaction.vitest.ts
tests/skill-graph-handlers.vitest.ts
tests/skill-graph-queries-parity.vitest.ts
tests/sqlite-integrity.vitest.ts
tests/tri-daemon-drill.vitest.ts
tests/vocabulary-agreement.vitest.ts
tests/cache/df-idf-cache.vitest.ts
tests/cache/listener-uniqueness.vitest.ts
tests/compat/daemon-probe.vitest.ts
tests/compat/plugin-bridge-smoke.vitest.ts
tests/compat/plugin-bridge.vitest.ts
tests/compat/python-compat.vitest.ts
tests/compat/redirect-metadata.vitest.ts
tests/compat/shim.vitest.ts
tests/embedders/ensure-active-embedder.vitest.ts
tests/embedders/registry.vitest.ts
tests/embedders/schema.vitest.ts
tests/embedders/shared-factory-parity.vitest.ts
tests/handlers/advisor-recommend-descriptor-parity.vitest.ts
tests/handlers/advisor-recommend-unavailable.vitest.ts
tests/handlers/advisor-recommend.vitest.ts
tests/handlers/advisor-status.vitest.ts
tests/handlers/advisor-trust-gate.vitest.ts
tests/handlers/advisor-validate-shapes.vitest.ts
tests/handlers/advisor-validate.vitest.ts
tests/handlers/skill-graph-corrupt-honesty.vitest.ts
tests/handlers/skill-graph-dispatch.vitest.ts
tests/handlers/skill-graph-listing.vitest.ts
tests/handlers/skill-graph-scan-auth.vitest.ts
tests/hooks/claude-user-prompt-submit-hook.vitest.ts
tests/hooks/runtime-parity.vitest.ts
tests/hooks/settings-driven-invocation-parity.vitest.ts
tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts
tests/legacy/advisor-brief-producer.vitest.ts
tests/legacy/advisor-corpus-parity.vitest.ts
tests/legacy/advisor-freshness.vitest.ts
tests/legacy/advisor-graph-evidence-calibration.vitest.ts
tests/legacy/advisor-graph-health.vitest.ts
tests/legacy/advisor-observability.vitest.ts
tests/legacy/advisor-privacy.vitest.ts
tests/legacy/advisor-prompt-cache.vitest.ts
tests/legacy/advisor-prompt-policy.vitest.ts
tests/legacy/advisor-renderer.vitest.ts
tests/legacy/advisor-subprocess.vitest.ts
tests/legacy/advisor-timing.vitest.ts
tests/parity/holdout-independent.vitest.ts
tests/parity/local-native-divergence-ratchet.vitest.ts
tests/parity/python-ts-parity.vitest.ts
tests/parity/scorer-eval-baseline-ratchet.vitest.ts
tests/schemas/advisor-tool-schemas.vitest.ts
tests/skill-graph/refresh-roundtrip.vitest.ts
tests/scorer/advisor-feedback-calibration.vitest.ts
tests/scorer/advisor-quality-049-003.vitest.ts
tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts
tests/scorer/ambiguity-slice.vitest.ts
tests/scorer/beta-reliability.vitest.ts
tests/scorer/bm25-lexical-shadow.vitest.ts
tests/scorer/conflict-query-rerank.vitest.ts
tests/scorer/executor-delegation.vitest.ts
tests/scorer/graph-causal-visited-order.vitest.ts
tests/scorer/lane-registry-env-override.vitest.ts
tests/scorer/lane-weight-sweep.vitest.ts
tests/scorer/native-scorer.vitest.ts
tests/scorer/projection-embedding-staleness.vitest.ts
tests/scorer/projection-fallback-049-005.vitest.ts
tests/scorer/projection-freshness.vitest.ts
tests/scorer/provenance-self-boost-guard.vitest.ts
tests/scorer/rrf-determinism-spine.vitest.ts
tests/scorer/runtime-lane-health.vitest.ts
tests/scorer/semantic-lane-promotion.vitest.ts
tests/scorer/semantic-shadow-ablation.vitest.ts
tests/utils/workspace-root.vitest.ts
[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/affordance-normalizer.test.ts[90m [offset=1, limit=45][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/lane-attribution.test.ts[90m [offset=1, limit=45][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tests/routing-fixtures.affordance.test.ts[90m [offset=1, limit=45][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts[90m [offset=1, limit=45][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/tsconfig.build.json[90m [limit=160][0m
[0m✱ [0mGrep "stress-test|search-quality"[90m in .opencode/skills/system-skill-advisor/mcp-server · 15 matches[0m
[0m
[0m$ [0mgit ls-files -- '.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/*' '.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/*'
.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/README.md
.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/README.md
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/baseline.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/bm25-scope-then-limit-stress.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/corpus.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness-telemetry-export.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/measurement-fixtures.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/measurement-output.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/metrics.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/ndcg-mrr.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/query-channel-calibration-benchmark.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/query-surrogates-stress.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/w13-decision-audit.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/w3-trust-tree.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/w5-shadow-learned-weights.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/w7-degraded-empty.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/w7-degraded-full-scan.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/w7-degraded-stale.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/w7-degraded-unavailable.vitest.ts
.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/w8-search-decision-envelope.vitest.ts
[0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/vitest.stress.config.ts[90m [limit=90][0m
[0m→ [0mRead .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts[90m [offset=340, limit=70][0m
[0m→ [0mRead .opencode/bin/mk-skill-advisor-launcher.cjs[90m [offset=780, limit=90][0m
[0m✱ [0mGrep "createChildEnv\(|env:\s*createChildEnv|childEnv"[90m in .opencode/bin/mk-skill-advisor-launcher.cjs · 5 matches[0m
[0m✱ [0mGrep "CODEX_HOOK_TIMEOUT_MS"[90m in .opencode/skills/system-skill-advisor · 0 matches[0m
[0m✱ [0mGrep "CODEX_HOOK_TIMEOUT_MS"[90m in .opencode/plugins · 0 matches[0m
[0m✱ [0mGrep "CODEX_HOOK_TIMEOUT_MS"[90m in .opencode/bin · 1 match[0m
[0m→ [0mRead .opencode/bin/mk-skill-advisor-launcher.cjs[90m [offset=1085, limit=38][0m
[0m→ [0mRead .opencode/skills/system-spec-kit/node_modules/.bin[90m [limit=30][0m
[0m
[0m$ [0mgit diff --no-index --stat -- '.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts' '.opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness.ts'
.../mcp-server/stress-test/search-quality/harness.ts             | 9 ++++++---
 1 file changed, 6 insertions(+), 3 deletions(-)
[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/{corpus,metrics}.ts"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/lib/search/search-decision-envelope.ts"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/mcp-server/lib/shadow/shadow-sink.ts"[90m 1 match[0m
[0m✱ [0mGlob ".opencode/skills/system-spec-kit/mcp-server/lib/search/search-decision-envelope.ts"[90m 1 match[0m
[0m
[0m$ [0mnode node_modules/vitest/vitest.mjs run --config vitest.config.ts tests/skill-advisor-cli-manifest-parity.vitest.ts tests/compat/plugin-bridge.vitest.ts
RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp-server


 Test Files  2 passed (2)
      Tests  12 passed (12)
   Start at  18:41:39
   Duration  628ms (transform 302ms, setup 20ms, import 379ms, tests 109ms, environment 0ms)
[0m
[0m✱ [0mGrep "SKILL_ADVISOR_CLI_TOOL_MANIFEST|TOOL_DEFINITIONS"[90m in .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts · 37 matches[0m
[0m✱ [0mGrep "skill-advisor-cli\.js|skill-advisor-cli-manifest"[90m in .opencode/bin/mk-skill-advisor-launcher.cjs · 1 match[0m
[0m✱ [0mGrep "skill-advisor-cli-manifest|SKILL_ADVISOR_CLI_TOOL_MANIFEST"[90m 29 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/**/*.js"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/**/*.js"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-skill-advisor/hooks/codex/**/*.ts"[90m 0 matches[0m
[0m✱ [0mGlob ".opencode/skills/system-spec-kit/hooks/codex/**/*.ts"[90m 0 matches[0m
[0m
[0m$ [0mgit diff --stat
.opencode/plugins/tests/mk-skill-advisor.test.cjs  | 67 ++++++++++++----------
 .opencode/specs/sk-doc/graph-metadata.json         |  9 +--
 .../017-findings-remediation/description.json      | 12 +++-
 .../017-findings-remediation/graph-metadata.json   |  4 +-
 4 files changed, 52 insertions(+), 40 deletions(-)
[0m
[0m$ [0mgit diff --cached --name-only
.claude/agents/README.txt
.codex/agents/deep-improvement.toml
.codex/prompts/design-md-generator.md
.codex/prompts/design-motion.md
.codex/prompts/interface-design-reference.md
.codex/prompts/interface-design.md
.codex/prompts/interface-motion.md
.codex/prompts/prompt-improve.md
.devin/hooks/check-dist-staleness.sh
.devin/hooks/check-git-hooks.sh
.devin/hooks/install-codex-hooks.mjs
.devin/hooks/permission-request-policy.mjs
.devin/hooks/session-cleanup.sh
.devin/hooks/worktree-guard.sh
.opencode/commands/doctor/_routes.yaml
.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml
.opencode/commands/doctor/assets/doctor-speckit-presentation.txt
.opencode/commands/doctor/speckit.md
.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs
[0m
[0m$ [0mgit diff --name-only
.opencode/plugins/tests/mk-skill-advisor.test.cjs
.opencode/specs/sk-doc/graph-metadata.json
.opencode/specs/system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/description.json
.opencode/specs/system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/graph-metadata.json
[0m
[0m$ [0mgit status --short
M  .claude/agents/README.txt
M  .codex/agents/deep-improvement.toml
D  .codex/prompts/design-md-generator.md
D  .codex/prompts/design-motion.md
R  .codex/prompts/design-foundations.md -> .codex/prompts/interface-design-reference.md
R  .codex/prompts/design-interface.md -> .codex/prompts/interface-design.md
R  .codex/prompts/design-audit.md -> .codex/prompts/interface-motion.md
M  .codex/prompts/prompt-improve.md
A  .devin/hooks/check-dist-staleness.sh
A  .devin/hooks/check-git-hooks.sh
A  .devin/hooks/install-codex-hooks.mjs
A  .devin/hooks/permission-request-policy.mjs
A  .devin/hooks/session-cleanup.sh
A  .devin/hooks/worktree-guard.sh
M  .opencode/commands/doctor/_routes.yaml
A  .opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml
M  .opencode/commands/doctor/assets/doctor-speckit-presentation.txt
M  .opencode/commands/doctor/speckit.md
 M .opencode/plugins/tests/mk-skill-advisor.test.cjs
A  .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs
 M .opencode/specs/sk-doc/graph-metadata.json
 M .opencode/specs/system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/description.json
 M .opencode/specs/system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/graph-metadata.json
?? .opencode/specs/cli-external-orchestration/031-cli-pi-creation/
?? .opencode/specs/sk-design/014-template-conformance/009-aesthetics-retirement/
?? .opencode/specs/system-code-graph/036-code-graph-decommission/
?? .opencode/specs/system-code-graph/spec.md
?? .opencode/specs/system-skill-advisor/018-advisor-audit-and-state-containment/
?? .opencode/specs/system-skill-advisor/spec.md
[0m
Confirmed nine findings across all six categories. Whole-repo searches included `.ts`, `.js`, `.cjs`, `.mjs`, `.md`, `.yaml`, `.yml`, `.json`, and `.sh`; archived spec captures were distinguished from live callers.

### F1 — CAT-1: Four snake_case handler aliases have no live consumers
**Path:** `mcp-server/handlers/advisor-{recommend,rebuild,status,validate}.ts`, `mcp-server/handlers/index.ts`

**Evidence:** The aliases are declared at `advisor-recommend.ts:596`, `advisor-rebuild.ts:147`, `advisor-status.ts:355`, and `advisor-validate.ts:763`, then re-exported at `handlers/index.ts:5-8`. All live callers use the camelCase handlers. Remaining whole-repo matches are archived specs and captured audit output.

**Verify:**
```bash
rg -n 'handle_advisor_(recommend|rebuild|status|validate)' . \
  --glob '*.{ts,js,cjs,mjs,md,yaml,yml,json,sh}' --glob '!.git/**'
```

**Blast radius:** Low. Removing the aliases and barrel re-exports changes only private source exports; the package is private and exposes no package-level export map for them.

### F2 — CAT-1: The launcher forwards an unused Codex timeout variable
**Path:** `.opencode/bin/mk-skill-advisor-launcher.cjs:99-155`

**Evidence:** `SPECKIT_CODEX_HOOK_TIMEOUT_MS` is included in `CHILD_ENV_ALLOWLIST` at line 128 and forwarded through `createChildEnv()` at lines 278-303. Neither the advisor runtime nor plugin bridge reads it. The only non-historical second occurrence is a packet-local Codex test runner that sets the variable for a removed `mcp_server/dist/hooks/codex/...` entrypoint; it does not read it from the advisor child.

**Verify:**
```bash
rg -n 'SPECKIT_CODEX_HOOK_TIMEOUT_MS' . \
  --glob '*.{ts,js,cjs,mjs,md,yaml,yml,json,sh}' --glob '!.git/**'
```

**Blast radius:** Low. Removing the allowlist entry only stops forwarding an unread value to build/server children; it does not remove the variable from a Codex hook process itself.

### F3 — CAT-2: The advisor contains an orphaned copy of the canonical search-quality harness
**Path:** `.opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts`

**Evidence:** It differs by only nine lines from the live `system-spec-kit` harness. The advisor copy imports absent local `corpus.ts`, `metrics.ts`, and `lib/search/search-decision-envelope.ts`. It has no caller and is excluded from the build. The `system-spec-kit` successor has multiple live test consumers and is identified as canonical by its README.

**Verify:**
```bash
git diff --no-index --stat -- \
  .opencode/skills/system-skill-advisor/mcp-server/stress-test/search-quality/harness.ts \
  .opencode/skills/system-spec-kit/mcp-server/stress-test/search-quality/harness.ts

rg -n 'runSearchQualityHarness|stress-test/search-quality/harness' . \
  --glob '*.{ts,js,cjs,mjs,md,yaml,yml,json,sh}' --glob '!.git/**'
```

**Blast radius:** Low. Removing the advisor copy affects no caller. Its generic folder README would need removal or correction at the same time.

### F4 — CAT-3: Test telemetry is committed under a temporary directory
**Path:** `.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp-resident-service-31202-1781868482214-e27892e065ba1/shadow-deltas.jsonl`

**Evidence:** The file contains one dated shadow-telemetry row and is tracked by git despite its generated `.tmp-resident-service-*` location.

**Verify:**
```bash
git ls-files -- '.opencode/skills/system-skill-advisor/mcp-server/tests/.tmp*'
```

**Blast radius:** None for runtime behavior. Deleting the tracked file and empty directory only removes stale test output.

### F5 — CAT-4: A scorer test is stored inside production source and excluded from every normal gate
**Path:** `mcp-server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts`

**Evidence:** The normal Vitest configuration includes only `tests/**/*.vitest.ts` at `vitest.config.ts:16-19`. The build explicitly excludes `**/__tests__` at `tsconfig.build.json:35`. `vitest list --filesOnly` does not list this 215-line suite.

**Verify:** Run from `mcp-server/`:
```bash
node node_modules/vitest/vitest.mjs list --config vitest.config.ts --filesOnly
```

**Blast radius:** Moving it to `tests/scorer/` adds previously absent semantic-cache regression coverage to `npm test`; it may reveal latent failures but has no production-runtime effect.

### F6 — CAT-4: Retained code-graph benchmarks are misplaced and currently broken
**Path:** `mcp-server/bench/code-graph-{parse,query}-latency.bench.ts`

**Evidence:** `bench/README.md:18-24` explicitly retains these as measurement assets, so they are not deletion candidates. However:

- The parse benchmark references renamed or removed fixtures at `code-graph-parse-latency.bench.ts:34-42`.
- The query benchmark reads the advisor collector at line 20 while code-graph records through `system-code-graph/.../metrics-stub.ts`, whose enable check always returns `false` and methods are no-ops.
- The parse benchmark fails with `fixture missing: .../mcp-server/code_graph/lib/runtime-detection.ts`.
- The query benchmark fails with `BenchInvariantError: mode outline produced no query_latency_ms samples`.

**Verify:** Run from `mcp-server/`:
```bash
SPECKIT_RUN_BENCHES=true node node_modules/vitest/vitest.mjs run \
  --config vitest.config.ts bench/code-graph-parse-latency.bench.ts

SPECKIT_RUN_BENCHES=true node node_modules/vitest/vitest.mjs run \
  --config vitest.config.ts bench/code-graph-query-latency.bench.ts
```

**Blast radius:** Medium. Restoring them requires code-graph ownership and a real telemetry collector seam, not deletion. Until then, the committed baselines cannot provide regression evidence.

### F7 — CAT-5: The documented test contract and Vitest discovery configuration disagree
**Path:** `mcp-server/vitest.config.ts:16-19`, `mcp-server/tests/*.test.ts`

**Evidence:** The README documents both `*.vitest.ts` and `*.test.ts` as test entrypoints at `tests/README.md:176-183`, but the config only includes `tests/**/*.vitest.ts`. These suites are omitted:

- `tests/affordance-normalizer.test.ts`
- `tests/lane-attribution.test.ts`
- `tests/routing-fixtures.affordance.test.ts`

All three import Vitest directly and are not Node-native test-runner files.

**Verify:** Run from `mcp-server/`:
```bash
node node_modules/vitest/vitest.mjs list --config vitest.config.ts --filesOnly
```

**Blast radius:** Widening the include or renaming the files activates affordance normalization, attribution, privacy, and routing-fixture coverage in the normal gate.

### F8 — CAT-5: The compatibility contract has two manually synchronized sources
**Path:** `schemas/compat-contract.json`, `lib/compat/contract.ts`

**Evidence:** Both files independently declare the same status values, environment names, confidence threshold `0.8`, and uncertainty threshold `0.35`. The plugin bridge reads JSON at `plugin-bridges/mk-skill-advisor-bridge.mjs:40-45`; native runtime modules import the TypeScript object. Existing tests validate the JSON-backed bridge but do not compare JSON against the TypeScript contract.

**Verify:**
```bash
rg -n 'statusValues|disabledEnv|forceLocalEnv|confidenceThreshold|uncertaintyThreshold' \
  .opencode/skills/system-skill-advisor/mcp-server/{schemas/compat-contract.json,lib/compat/contract.ts}

rg -n 'SKILL_ADVISOR_COMPAT_CONTRACT' \
  .opencode/skills/system-skill-advisor/mcp-server/tests
```

**Blast radius:** Medium. Drift can give plugin and MCP callers different statuses or threshold behavior. One representation should be generated from or validated against the other.

### F9 — CAT-6: All nine MCP tool descriptors are copied into a second CLI registry
**Path:** `mcp-server/skill-advisor-cli-manifest.ts:22-160`, `mcp-server/tools/`

**Evidence:** The CLI manifest repeats every name, description, and input schema from the canonical tool descriptors. Its parity test explicitly says the manifest is “hand-maintained, not generated” at `tests/skill-advisor-cli-manifest-parity.vitest.ts:1-5`. The current parity gate passes, but it detects drift after duplication rather than eliminating the duplicated responsibility.

**Verify:**
```bash
rg -n "name: '(advisor_|skill_graph_)" \
  .opencode/skills/system-skill-advisor/mcp-server/{skill-advisor-cli-manifest.ts,tools}
```

Current parity verification:
```text
2 test files passed
12 tests passed
```

**Blast radius:** Medium. Tool additions or schema edits currently require coordinated changes in two registries; drift changes CLI help, completion, validation, or exposed MCP schemas.

**Verification Summary**
- All six categories contain confirmed findings.
- CLI-manifest and bridge compatibility tests: `2 passed`, `12 tests passed`.
- Both retained code-graph benchmarks reproduced their reported failures.
- No repository files were modified by this audit.
- The worktree remains dirty from unrelated concurrent/user changes.
