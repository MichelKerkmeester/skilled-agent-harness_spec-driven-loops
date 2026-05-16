---
title: "Audit Report: sk-code and code README coverage"
description: "Coverage matrix and sk-code compliance findings for packet 026."
trigger_phrases:
  - "026 audit report"
  - "code README coverage"
importance_tier: "high"
contextType: "audit"
---
# Audit Report: sk-code and code README coverage

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Metric | Before | After |
|---|---:|---:|
| Skills audited | 19 | 19 |
| Code-bearing folders audited | 192 | 192 |
| README files present | 145 | 192 |
| README files compliant | 140 | 187 |
| README compliance rate | 72.9% | 97.4% |
| READMEs authored this dispatch | 0 | 47 |
| sk-code sample violations found | 121 | 121 |
| sk-code violations fixed | 0 | 0 |
| sk-code violations deferred | 121 | 121 |

Audit universe: first-party code folders under the 19 requested skills with direct `.ts`, `.js`, `.py`, `.mjs`, or `.cjs` files. Vendored environments, generated outputs, databases, data folders, fixtures, and scratch folders are excluded from coverage math because they are either not first-party authored code or are blocked by the dispatch fixture-edit constraint.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes-authored -->
## 2. READMES AUTHORED

- `.opencode/skills/deep-agent-improvement/scripts/README.md`
- `.opencode/skills/deep-agent-improvement/scripts/tests/README.md`
- `.opencode/skills/deep-ai-council/scripts/README.md`
- `.opencode/skills/deep-ai-council/scripts/lib/README.md`
- `.opencode/skills/deep-research/scripts/README.md`
- `.opencode/skills/deep-review/scripts/README.md`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/README.md`
- `.opencode/skills/mcp-coco-index/tests/README.md`
- `.opencode/skills/mcp-code-mode/scripts/README.md`
- `.opencode/skills/sk-code/assets/motion_dev/snippets/README.md`
- `.opencode/skills/sk-code/assets/scripts/README.md`
- `.opencode/skills/sk-code/assets/universal/patterns/README.md`
- `.opencode/skills/sk-code/assets/webflow/integrations/README.md`
- `.opencode/skills/sk-code/assets/webflow/patterns/README.md`
- `.opencode/skills/sk-code/assets/webflow/scripts/README.md`
- `.opencode/skills/sk-code/assets/webflow/templates/README.md`
- `.opencode/skills/sk-doc/scripts/README.md`
- `.opencode/skills/sk-doc/scripts/tests/README.md`
- `.opencode/skills/system-code-graph/mcp_server/tests/handlers/README.md`
- `.opencode/skills/system-skill-advisor/hooks/claude/README.md`
- `.opencode/skills/system-skill-advisor/hooks/codex/README.md`
- `.opencode/skills/system-skill-advisor/hooks/codex/lib/README.md`
- `.opencode/skills/system-skill-advisor/hooks/gemini/README.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/context/README.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/README.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/README.md`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/README.md`
- `.opencode/skills/system-skill-advisor/mcp_server/stress_test/search-quality/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/lib/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/causal/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/__helpers__/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/archive/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/continuity/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/description/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/helpers/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/integration/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/memory/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/security/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/validation/README.md`

<!-- /ANCHOR:readmes-authored -->

---

<!-- ANCHOR:deferred-findings -->
## 3. DEFERRED SK-CODE FINDINGS

| Follow-on Packet | Finding Count | Reason |
|---|---:|---|
| 027-ts-header-normalization | 84 | Widespread TypeScript header normalization spans production and test surfaces and exceeds the 10 LOC dispatch cap as a cluster. |
| 028-generated-js-and-declaration-alignment | 23 | JavaScript, ESM, CJS, and declaration outputs include generated or package-boundary files that need owner-specific validation before edits. |
| 029-python-package-header-policy | 4 | Python package modules include import-only package files where script shebang policy needs a narrower sk-code rule. |
| 030-any-type-justification-sweep | 10 | Possible any-usage findings require semantic review before changing types. |

These are named follow-ons rather than inline fixes because each cluster crosses many folders, includes tests or generated/package-boundary files, and needs focused verification beyond this README coverage sweep.

<!-- /ANCHOR:deferred-findings -->

---

<!-- ANCHOR:coverage-matrix -->
## 4. COVERAGE MATRIX

| Skill | Subdir | README Present | README Compliant | sk-code Violations | Action |
|---|---|---|---|---|---|
| deep-agent-improvement | `scripts` | Yes | Yes | None in sample | README authored |
| deep-agent-improvement | `scripts/tests` | Yes | Yes | benchmark-stability.vitest.ts: missing standard TS header<br>candidate-lineage.vitest.ts: missing standard TS header | README authored |
| deep-ai-council | `scripts` | Yes | Yes | None in sample | README authored |
| deep-ai-council | `scripts/lib` | Yes | Yes | None in sample | README authored |
| deep-research | `scripts` | Yes | Yes | None in sample | README authored |
| deep-review | `scripts` | Yes | Yes | None in sample | README authored |
| mcp-coco-index | `mcp_server/cocoindex_code` | Yes | Yes | __init__.py: missing portable python shebang/header<br>__main__.py: missing portable python shebang/header | README authored |
| mcp-coco-index | `mcp_server/tests` | Yes | Yes | None in sample | README authored |
| mcp-coco-index | `tests` | Yes | Yes | None in sample | README authored |
| mcp-code-mode | `mcp_server` | Yes | Yes | None in sample | No README action |
| mcp-code-mode | `scripts` | Yes | Yes | None in sample | README authored |
| sk-code | `assets/motion_dev/snippets` | Yes | Yes | animate_on_scroll.js: missing strict mode directive<br>animate_on_scroll.js: missing standard JS header<br>cdn_bootstrap.js: missing strict mode directive<br>cdn_bootstrap.js: missing standard JS header | README authored |
| sk-code | `assets/scripts` | Yes | Yes | None in sample | README authored |
| sk-code | `assets/universal/patterns` | Yes | Yes | validation_patterns.js: missing standard JS header<br>wait_patterns.js: missing standard JS header | README authored |
| sk-code | `assets/webflow/integrations` | Yes | Yes | hls_patterns.js: missing standard JS header<br>lenis_patterns.js: missing standard JS header | README authored |
| sk-code | `assets/webflow/patterns` | Yes | Yes | interaction_gate_patterns.js: missing standard JS header<br>performance_patterns.js: missing standard JS header | README authored |
| sk-code | `assets/webflow/scripts` | Yes | Yes | None in sample | README authored |
| sk-code | `assets/webflow/templates` | Yes | Yes | None in sample | README authored |
| sk-doc | `scripts` | Yes | Yes | extract_structure.py: missing module docstring near top | README authored |
| sk-doc | `scripts/tests` | Yes | Yes | None in sample | README authored |
| system-code-graph | `mcp_server` | Yes | Yes | index.js: missing strict mode directive | No README action |
| system-code-graph | `mcp_server/core` | Yes | Yes | config.ts: missing standard TS header | No README action |
| system-code-graph | `mcp_server/handlers` | Yes | Yes | apply.d.ts: missing standard TS header<br>apply.js: missing strict mode directive | No README action |
| system-code-graph | `mcp_server/lib` | Yes | Yes | apply-metadata.d.ts: missing standard TS header<br>apply-metadata.js: missing strict mode directive | No README action |
| system-code-graph | `mcp_server/lib/utils` | Yes | Yes | workspace-path.d.ts: missing standard TS header<br>workspace-path.js: missing strict mode directive | No README action |
| system-code-graph | `mcp_server/plugin_bridges` | Yes | Yes | None in sample | No README action |
| system-code-graph | `mcp_server/stress_test/code-graph` | Yes | Yes | ccc-integration-stress.vitest.ts: missing standard TS header | No README action |
| system-code-graph | `mcp_server/tests` | Yes | Yes | code-graph-apply-e2e.vitest.ts: missing standard TS header | No README action |
| system-code-graph | `mcp_server/tests/handlers` | Yes | Yes | classify-query-intent.vitest.ts: missing standard TS header | README authored |
| system-code-graph | `mcp_server/tools` | Yes | Yes | code-graph-tools.d.ts: missing standard TS header<br>code-graph-tools.js: missing strict mode directive | No README action |
| system-skill-advisor | `hooks/claude` | Yes | Yes | None in sample | README authored |
| system-skill-advisor | `hooks/codex` | Yes | Yes | None in sample | README authored |
| system-skill-advisor | `hooks/codex/lib` | Yes | Yes | None in sample | README authored |
| system-skill-advisor | `hooks/gemini` | Yes | Yes | None in sample | README authored |
| system-skill-advisor | `mcp_server` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/bench` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/compat` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/handlers` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/handlers/skill-graph` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/auth` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/compat` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/context` | Yes | Yes | caller-context.ts: missing standard TS header | README authored |
| system-skill-advisor | `mcp_server/lib/corpus` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/daemon` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/derived` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/freshness` | Yes | Yes | cache-invalidation.ts: possible unqualified any usage in sample | No README action |
| system-skill-advisor | `mcp_server/lib/lifecycle` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/scorer` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/scorer/lanes` | Yes | Yes | explicit.ts: possible unqualified any usage in sample | README authored |
| system-skill-advisor | `mcp_server/lib/scorer/lanes/__tests__` | Yes | Yes | None in sample | README authored |
| system-skill-advisor | `mcp_server/lib/shadow` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/skill-graph` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/lib/utils` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/schemas` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/scripts` | Yes | Yes | skill_advisor.py: missing module docstring near top | No README action |
| system-skill-advisor | `mcp_server/scripts/routing-accuracy` | Yes | Yes | gate3-corpus-runner.mjs: missing standard ESM header | README authored |
| system-skill-advisor | `mcp_server/stress_test/search-quality` | Yes | Yes | None in sample | README authored |
| system-skill-advisor | `mcp_server/stress_test/skill-advisor` | Yes | Yes | advisor-recommend-handler-stress.vitest.ts: missing standard TS header<br>anti-stuffing-cardinality-stress.vitest.ts: missing standard TS header | No README action |
| system-skill-advisor | `mcp_server/tests` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/tests/cache` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/tests/compat` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/tests/handlers` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/tests/hooks` | Yes | Yes | claude-user-prompt-submit-hook.vitest.ts: missing standard TS header<br>codex-prompt-wrapper.vitest.ts: missing standard TS header | No README action |
| system-skill-advisor | `mcp_server/tests/legacy` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/tests/parity` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/tests/python` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/tests/schemas` | Yes | Yes | advisor-tool-schemas.vitest.ts: possible unqualified any usage in sample | No README action |
| system-skill-advisor | `mcp_server/tests/scorer` | Yes | Yes | None in sample | No README action |
| system-skill-advisor | `mcp_server/tools` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/api` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/configs` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/core` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/formatters` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/handlers` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/handlers/council-graph` | Yes | Yes | None in sample | README authored |
| system-spec-kit | `mcp_server/handlers/coverage-graph` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/handlers/save` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/hooks` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/hooks/claude` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/hooks/codex` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/hooks/codex/lib` | Yes | Yes | None in sample | README authored |
| system-spec-kit | `mcp_server/hooks/gemini` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/analytics` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/architecture` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/cache` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/causal` | Yes | Yes | None in sample | README authored |
| system-spec-kit | `mcp_server/lib/chunking` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/cocoindex` | Yes | Yes | None in sample | README authored |
| system-spec-kit | `mcp_server/lib/cognitive` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/config` | Yes | Yes | memory-types.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/lib/context` | Yes | Yes | budget-allocator.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/lib/continuity` | Yes | Yes | thin-continuity-record.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/lib/council-graph` | Yes | Yes | None in sample | README authored |
| system-spec-kit | `mcp_server/lib/coverage-graph` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/deep-loop` | Yes | Yes | executor-audit.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/lib/description` | Yes | Yes | description-merge.ts: missing standard TS header<br>description-schema.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/lib/discovery` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/enrichment` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/errors` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/eval` | Yes | Yes | bm25-baseline.ts: possible unqualified any usage in sample | No README action |
| system-spec-kit | `mcp_server/lib/extraction` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/feedback` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/governance` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/graph` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/interfaces` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/learning` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/merge` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/ops` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/parsing` | Yes | Yes | content-normalizer.ts: possible unqualified any usage in sample | No README action |
| system-spec-kit | `mcp_server/lib/providers` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/query` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/rag` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/response` | Yes | No | None in sample | Existing README follow-on |
| system-spec-kit | `mcp_server/lib/resume` | Yes | No | None in sample | Existing README follow-on |
| system-spec-kit | `mcp_server/lib/routing` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/scoring` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/search` | Yes | Yes | anchor-metadata.ts: possible unqualified any usage in sample | No README action |
| system-spec-kit | `mcp_server/lib/search/pipeline` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/session` | Yes | Yes | context-metrics.ts: possible unqualified any usage in sample | No README action |
| system-spec-kit | `mcp_server/lib/spec` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/storage` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/telemetry` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/templates` | Yes | Yes | level-contract-resolver.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/lib/test-helpers` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/lib/utils` | Yes | Yes | cleanup-helpers.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/lib/validation` | Yes | Yes | orchestrator.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/matrix_runners` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/plugin_bridges` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/schemas` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/scripts` | Yes | Yes | finalize-dist.mjs: missing standard ESM header | No README action |
| system-spec-kit | `mcp_server/scripts/migrations` | Yes | No | None in sample | Existing README follow-on |
| system-spec-kit | `mcp_server/scripts/tests` | Yes | Yes | resource-map-extractor.vitest.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/stress_test/matrix` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/stress_test/memory` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/stress_test/search-quality` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/stress_test/session` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/stress_test/substrate` | Yes | No | query-expansion-bound-stress.vitest.ts: missing standard TS header | Existing README follow-on |
| system-spec-kit | `mcp_server/tests` | Yes | Yes | ablation-framework.vitest.ts: possible unqualified any usage in sample<br>access-tracker-extended.vitest.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/tests/__helpers__` | Yes | Yes | test-env.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/_support` | Yes | Yes | token-budget-assertions.ts: missing standard TS header<br>vitest-setup.ts: missing standard TS header | No README action |
| system-spec-kit | `mcp_server/tests/_support/hooks` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/tests/adversarial` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/tests/archive` | Yes | Yes | None in sample | README authored |
| system-spec-kit | `mcp_server/tests/continuity` | Yes | Yes | timestamp-normalize.vitest.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/deep-loop` | Yes | Yes | cli-matrix.vitest.ts: missing standard TS header<br>dispatch-failure.vitest.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/description` | Yes | Yes | description-merge.vitest.ts: missing standard TS header<br>repair-specimens.vitest.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/graph` | Yes | Yes | graph-metadata-lineage.vitest.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/helpers` | Yes | Yes | None in sample | README authored |
| system-spec-kit | `mcp_server/tests/integration` | Yes | Yes | entity-density-commit-hooks.vitest.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/local-llm-features` | Yes | No | auto-migration.vitest.ts: missing standard TS header<br>cascade-resolution.vitest.ts: missing standard TS header | Existing README follow-on |
| system-spec-kit | `mcp_server/tests/local-llm-features/performance` | Yes | Yes | cold-start.bench.ts: missing standard TS header<br>embedding-latency.bench.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/memory` | Yes | Yes | trust-badges.test.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/security` | Yes | Yes | adversarial-unicode.vitest.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tests/validation` | Yes | Yes | evidence-marker-audit.vitest.ts: missing standard TS header | README authored |
| system-spec-kit | `mcp_server/tools` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `mcp_server/utils` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `scripts` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `scripts/config` | Yes | Yes | index.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/core` | Yes | Yes | config.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/evals` | Yes | Yes | check-allowlist-expiry.ts: missing standard TS header<br>check-architecture-boundaries.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/extractors` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `scripts/graph` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `scripts/lib` | Yes | Yes | anchor-generator.ts: missing standard TS header<br>ascii-boxes.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/loaders` | Yes | Yes | data-loader.ts: missing standard TS header<br>index.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/memory` | Yes | Yes | ast-parser.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/observability` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `scripts/optimizer` | Yes | Yes | promote.cjs: missing standard JS header<br>replay-corpus.cjs: missing standard JS header | No README action |
| system-spec-kit | `scripts/renderers` | Yes | Yes | index.ts: missing standard TS header<br>template-renderer.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/resource-map` | Yes | Yes | extract-from-evidence.cjs: missing standard JS header | No README action |
| system-spec-kit | `scripts/rules` | Yes | Yes | check-canonical-save-helper.cjs: missing strict mode directive<br>check-canonical-save-helper.cjs: missing standard JS header | No README action |
| system-spec-kit | `scripts/setup` | Yes | Yes | record-node-version.js: missing strict mode directive | No README action |
| system-spec-kit | `scripts/spec` | Yes | Yes | is-phase-parent.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/spec-folder` | Yes | Yes | alignment-validator.ts: missing standard TS header<br>directory-setup.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/templates` | Yes | Yes | inline-gate-renderer.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/tests` | Yes | Yes | alignment-drift-fixture-preservation.vitest.ts: missing standard TS header<br>architecture-boundary-enforcement.vitest.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/types` | Yes | Yes | js-yaml.d.ts: missing standard TS header<br>save-mode.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/utils` | Yes | Yes | data-validator.ts: missing standard TS header<br>fact-coercion.ts: missing standard TS header | No README action |
| system-spec-kit | `scripts/validation` | Yes | Yes | None in sample | No README action |
| system-spec-kit | `shared` | Yes | Yes | chunking.ts: missing standard TS header<br>code-graph-contracts.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/algorithms` | Yes | Yes | adaptive-fusion.ts: missing standard TS header<br>index.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/contracts` | Yes | Yes | retrieval-trace.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/embeddings` | Yes | Yes | factory.ts: missing standard TS header<br>llama-cpp-availability.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/embeddings/providers` | Yes | Yes | hf-local.ts: missing standard TS header<br>llama-cpp.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/lib` | Yes | Yes | structure-aware-chunker.ts: missing standard TS header<br>structure-aware-chunker.ts: possible unqualified any usage in sample | No README action |
| system-spec-kit | `shared/parsing` | Yes | Yes | memory-sufficiency.ts: missing standard TS header<br>memory-template-contract.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/predicates` | Yes | Yes | boolean-expr.test.ts: missing standard TS header<br>boolean-expr.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/ranking` | Yes | Yes | learned-combiner.ts: missing standard TS header<br>learned-combiner.ts: possible unqualified any usage in sample<br>matrix-math.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/scoring` | Yes | Yes | folder-scoring.ts: missing standard TS header | No README action |
| system-spec-kit | `shared/utils` | Yes | Yes | jsonc-strip.ts: missing standard TS header<br>path-security.ts: missing standard TS header | No README action |

<!-- /ANCHOR:coverage-matrix -->
