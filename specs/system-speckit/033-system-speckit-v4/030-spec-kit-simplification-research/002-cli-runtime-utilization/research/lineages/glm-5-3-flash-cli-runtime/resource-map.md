---
title: "Resource Map: the glm-5-3-flash-cli-runtime evidence inventory"
description: "Lean path catalog of every corpus file this lineage read, organized by audited directory, with the read-iteration. Produced per the deep-research lineage contract (this is the hand-rolled emission that f-iter008-006 proposes to automate)."
trigger_phrases:
  - "cli runtime utilization evidence"
---

# Resource Map: the glm-5-3-flash-cli-runtime evidence inventory

<!-- ANCHOR:how-to-read -->
## 1. HOW TO READ

Every path below was actually READ (fully, or header+targeted sections) during this lineage's ten iterations; the bracketed iteration cites where. Coverage intent: every directory under .opencode/skills/system-spec-kit/runtime/cli carries at least one read; the five caller surfaces (.opencode/commands, .opencode/bin, .opencode/hooks, .opencode/plugins, .github/workflows) were searched wholesale via rg (each search's exact pattern: see the iteration Sources sections). dist/ and node_modules/ were treated as symlinks/build outputs (observed, not enumerated); tests/ and test-fixtures/ were GREPPED (patterns recorded) but not read; the .ts test inventory informed the certification counts.

<!-- /ANCHOR:how-to-read -->
<!-- ANCHOR:audited-package -->
## 2. THE AUDITED PACKAGE (.opencode/skills/system-spec-kit/runtime/cli/)

**Read in full**: package.json [1]; scripts-registry.json [1]; README.md [1]; common.sh (headers + callers) [1,6]; doctor.sh (header + callers) [6]; .scan-one.sh (header + callers) [6]; continuity/generate-context.ts [3]; continuity/validate-memory-quality.ts (header + callers) [3]; continuity/rank-memories.ts (header + callers) [3]; continuity/fix-memory-h1.mjs (header + callers) [3]; continuity/ast-parser.ts (callers) [3]; continuity/backfill-*.ts + migrate-trigger-phrase-residual.ts (headers + callers) [3]; continuity/README.md (presence) [3]; core/index.ts [3]; core/workflow.ts (imports + conduct + daemon) [3,4]; core/post-save-review.ts (imports + header) [3]; core/quality-scorer.ts (header/exports/callers) [3,4]; core/daemon-detect.ts (self-documentation) [3]; core/alignment-validator.ts (header + diff + callers) [6]; core/spec-root-*.ts (census + callers) [3]; core/config.ts (header) [3]; core/README.md (referenced) [3]; extractors/collect-session-data.ts (imports + purpose) [4]; extractors/index.ts [4]; extractors/session-extractor.ts + file-extractor.ts + implementation-guide-extractor.ts (imports) [4]; extractors/quality-scorer.ts (canonical, via workflow.ts) [4]; extractors/README.md (presence) [4]; loaders/data-loader.ts (header + imports) [4]; loaders/index.ts [4]; renderers/ (ls + callers) [4]; templates/ (ls + create.sh:1066 + template-mapping.md) [4]; spec/validate.sh (header/flags/delegation) [2]; spec/README.md, spec/README-repair-derived.md (presence) [2]; spec/repair-derived.cjs:40,319 (the BACKFILL delegation) [2,5]; spec/check-placeholders.sh (diff + callers) [2]; spec/is-phase-parent.ts (regex + CLI tail) [2]; spec/create.sh:1066 [4]; spec/README-*.md (presence) [2]; spec/check-smart-router.sh + sweep-track-roots.mjs + quality-audit.sh + progressive-validate.sh + scaffold-debug-delegation.sh + sync-phase-map-status.ts + check-template-staleness.sh + archive.sh + upgrade-level.sh + calculate-completeness.sh + recommend-level.sh + check-completion.sh + test-validation.sh (caller classification) [2]; rules/ (31 check-* listed; README.md:12-14 read) [2]; rules/check-links.sh + check-placeholders.sh (callers) [2]; validation/ (7+1 files, headers read) [2]; validation/generated-metadata-integrity.ts (bridge header) [2]; lib/validator-registry.json (39 entries + existence sweep) [2,10]; lib/coverage-graph-convergence.cjs (the stray) [9]; lib/shell-common.sh:45-48 (is_phase_parent) [2]; lib/ (the production import census, 39 files) [6,9]; types/session-types.ts + save-mode.ts (census: 30+4 citations) [6]; config/index.ts:5-8 (the inversion seam) [3]; retrieval/README.md (declared lanes) [5]; retrieval/lookup-trigger-index.mjs (imports + validation + staleness) [5]; retrieval/generate-trigger-index.mjs (imports + the hooks/lib crossing) [5]; retrieval/rg-wrapper.mjs + retrofit-convention.mjs + sweep-memory-residue.mjs + measure-cold-lookup.mjs (headers + callers) [5]; retrieval/lib/ + retrieval/fixtures/ (inventory: 10 frozen baselines) [5]; graph/ (README + backfill-graph-metadata.ts + migrate-generated-json.ts + callers) [5]; evals/ (12 files: 6 checks + policy + allowlist + 3 stranded harnesses + README) [8]; evals/check-architecture-boundaries.ts:80 (the 4-extension predicate) [8]; observability/ (7 files + the committed outputs) [8]; optimizer/ (7 files + the 3 agent-definition callers) [8]; kpi/ (2 files, 1=self) [8]; metrics/ (fable-baseline.json + fable-metrics.cjs + the doctor wiring) [8]; resource-map/ (extract-from-evidence.cjs + its 4 doc references) [8]; sweep/strict-pass-freshness.ts (CI-wired) [8]; setup/ (6 files + caller classification) [7]; ops/ (7 files + ops/README.md:15-37's self-declared stubs) [7]; runtime-mirrors/ + codex/ + pi/ (9 productive files + their doctor _routes wiring) [7]; references/ (presence) [1].

<!-- /ANCHOR:audited-package -->
<!-- ANCHOR:caller-surfaces -->
## 3. THE CALLER SURFACES (searched wholesale; the reads were targeted)

- .opencode/commands/speckit/assets/*.yaml — plan/complete/implement ×confirm/auto: the check-prerequisites/create/recommend/validate/post_save_indexing reminders and executions [2,3]; the 49-file retrieval-mention decomposition [10].
- .opencode/commands/doctor/ — _routes.yaml:169-199 (the runtime-mirrors route: 5 trigger phrases, the five --check lines, 2 doctor checkers, install-codex-hooks --check), assets/doctor-runtime-mirrors.yaml:34-40,141, assets/doctor-fable-mode.yaml, scripts/doctor-runtime-bootstrap.sh, scripts/agent-roster-mirror-check.cjs:23-66,255-263, scripts/command-catalog-mirror-check.cjs, scripts/fable-mode-check.cjs [5,7,8].
- .opencode/commands/deep/assets/deep-research-auto.yaml:175,252-256 — the resource_map contract without the extractor [8].
- .opencode/commands/scripts/validate-command-references.cjs (presence in the sync-caller set) [7].
- .opencode/commands/create/assets/create-changelog-*.yaml (nested-changelog callers) [2].
- .opencode/bin/speckit-completion.cjs + install-codex-hooks.mjs (check-completion + the doctor --check) [2,7].
- .opencode/hooks/completion/README.md, .opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:20-56 (+ its README:52,117) [2].
- .opencode/plugins/system-speckit-completion.js + session-cleanup.js [2,7].
- .github/workflows/ — all 12 inventoried; READ: agent-mirror-sync.yml:15-40, prompt-card-sync.yml:13-24, rule-canary-sync.yml:15-28, routing-registry-drift.yml:83-192 (working-directory: the advisor), changed-packet-validation.yml, strict-pass-freshness-report.yml:53-94, command-tree-parity.yml, comment-hygiene.yml:17, markdown-link-integrity.yml [2,5,7,8].

<!-- /ANCHOR:caller-surfaces -->
<!-- ANCHOR:adjacent-corpus -->
## 4. THE ADJACENT CORPUS (the declared-purpose sources and thecross-package exhibits)

- .opencode/skills/system-spec-kit/ARCHITECTURE.md (full; :20-22,23,28,100,148-166,182,193-195) [1,2,3,9].
- .opencode/skills/system-spec-kit/runtime/lib/MODULE-MAP.md (full) [1].
- .opencode/skills/system-spec-kit/SKILL.md (targeted: :61,95,103,428,430,432,447,526-535,547,549) [1,5].
- .opencode/skills/system-spec-kit/README.md (:269 + the deploy-mcp/test-councilMatrix rows) [4,6].
- .opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md + tooling-and-scripts/* (the calledBy/upgrade/archive references) [2,6,7].
- .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md (the rg-wrapper×2 count) [5].
- .opencode/skills/system-spec-kit/references/validation/validation-rules.md + path-scoped-rules.md + references/workflows/quick-reference.md + references/templates/* (the unwired-script references) [2,6].
- .opencode/skills/system-spec-kit/manual-testing-playbook/ (the setup native-module + post-save-review + core-workflow pages) [3,6,7].
- .opencode/skills/system-spec-kit/changelog/v2+/v2.2.10.0.md, v3.0.0.3.md, v3.9.0.0.md, v3.5.0.0.md + deep-ai-council/changelog/v1.1.0.0.md, v1.2.0.0.md (the one-off scripts' consumption records) [6,7].
- .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts + coverage-graph-query.ts + better-sqlite3.d.ts + next-focus/next-focus-types.ts (the production twin) [9]; system-deep-loop/runtime/tests/unit/coverage-graph-*.vitest.ts (4-5 test importers) [9]; system-deep-loop/deep-ai-council + benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json [6]; the deep-research + deep-review resource-map-emission playbooks [8].
- .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh (the CI+hook twin) [2]; sk-code/sk-code-opencode/references/.../directory-and-test-conventions.md (the registry-loader + rebuild-native mentions) [2,6].
- .opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json + baseline-readme-verdicts.json (the observability fixture mentions) [8].
- specs/system-speckit/035-spec-kit-simplification-research/002-cli-runtime-utilization/goal.md + spec.md:76-90 (the charter, the problem statement, the handoff criteria) [1,10].
- The 002-packet-adjacent: specs/.../035-*/{001-ripgrep-search-system,003-shared-package-utilization,005-overengineering-simplification} (the sibling-track context, by name only) [1].

<!-- /ANCHOR:adjacent-corpus -->
<!-- ANCHOR:gaps -->
## 5. KNOWN GAPS (what this map does NOT catalog)

- dist/ contents (515 files, build outputs, resolved through the worktree's symlink to the main checkout); node_modules/ (likewise).
- tests/ and test-fixtures/ (362 + 259 files): grepped, not read; the counts cited in the certification are pattern-hits, not reads.
- .opencode/agents/, .opencode/skills/* beyond the named files, .opencode/lib if any, .cursor/, .codex/ (beyond the existence of .codex/agents + .codex/prompts), .claude/, .pi/ (beyond the directory existence) — the invocation-CONTRACT surfaces were searched via rg, not read.
- The dynamic-import surface (string-concatenated require/import): not swept (f-iter009-002).

<!-- /ANCHOR:gaps -->
