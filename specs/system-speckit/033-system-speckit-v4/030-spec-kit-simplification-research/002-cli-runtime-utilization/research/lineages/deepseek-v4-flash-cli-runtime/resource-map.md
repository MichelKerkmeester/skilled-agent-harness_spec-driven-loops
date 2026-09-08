---
title: "Resource Map: the deepseek-v4-flash-cli-runtime evidence inventory"
description: "Lean path catalog of every corpus file this round-two lineage read, organized by research thread, with the read-iteration."
trigger_phrases:
  - "cli runtime round two evidence"
---

# Resource Map: the deepseek-v4-flash-cli-runtime evidence inventory

<!-- ANCHOR:how-to-read -->
## 1. HOW TO READ

Every path below was actually READ (fully, or header+targeted lines) during this lineage's ten iterations; the bracketed iteration cites where. Coverage intent: every claim in research.md traces to one of these reads. dist/ and node_modules/ are symlinks to the main checkout and were treated as build output (excluded from evidence, per the invocation contract); changelogs and benchmark reports were excluded from the reference census by rule.

<!-- /ANCHOR:how-to-read -->
<!-- ANCHOR:remediation -->
## 2. REMEDIATION-VERIFICATION READS (iterations 1-2, 8, 10)

- `.opencode/skills/system-spec-kit/references/config/environment-variables.md:178` [1]
- `.opencode/skills/system-spec-kit/references/validation/template-compliance-contract.md:236` [2]
- `.opencode/skills/system-spec-kit/runtime/lib/spec/README.md:16` [2]
- `.opencode/skills/system-spec-kit/ARCHITECTURE.md:23,77,134,180` [1,2]
- `.opencode/skills/system-spec-kit/runtime/cli/package.json:4 + scripts block [1,5]; README.md:17,130 [1,4]`
- `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/{002-valid-level1,003-valid-level2,004-valid-level3}/implementation-summary.md:119` [1]
- `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md (zero removed-var hits)` [2]
- `.opencode/skills/system-spec-kit/runtime/core/config.ts (zero batch hits)` [2]
- `.opencode/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts:125-132` [2]
- `.opencode/skills/system-spec-kit/runtime/cli/rules/README.md:20,93-94,133,153` [2]
- `.opencode/skills/system-spec-kit/runtime/cli/{spec,rules}/check-placeholders.sh:9-14; rules/check-comment-hygiene.sh:13-14` [2]
- `.opencode/skills/system-spec-kit/runtime/cli/ops/ (ls, README head)` [2]
- `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/graph-convergence-signals.md:55,61` [2]
- `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/graph-events-review.md:3,30-33` [1]
- `.github/workflows/spec-kit-check.yml (full)` [2,5]
- `.opencode/skills/system-spec-kit/shared/package.json:18; vitest.config.ts:41,53` [2]
- `.opencode/skills/system-spec-kit/runtime/{cli/{rules/check-doc-pointers.sh:3-8, check-links.sh:3-11, rules/check-links.sh:1-10, lib/validator-registry.json (parsed), spec/{README.md:74,108,152, repair-derived.cjs:40,319,465, is-phase-parent.ts:13-14,42-43,63}, continuity/generate-context.ts:34, lib/{cli-capture-shared.ts:3-11, validator-registry.ts:27,39,44, memory-frontmatter.ts:6, trigger-extractor.ts:14, decision-tree-generator.ts, trigger-phrase-sanitizer.ts, semantic-signal-extractor.ts:27}, utils/{index.ts (full), phase-classifier.ts (full), workspace-identity.ts:139-190, validation-utils.ts:12-60,83, cli-capture-shared.ts}, observability/{README.md:29,45-63, live-session-wrapper.ts, smart-router-measurement-results.jsonl summary record}, graph/{migrate-generated-json.ts, backfill-graph-metadata.ts}, optimizer/ (ls, README), pi/README.md, retrieval/{README.md:23,67,69,74, lib/frontmatter.mjs:6-8, sweep-memory-residue.mjs, measure-cold-lookup.mjs, fixtures/{corpus-manifest.json:7954,29, generation-diagnostics.json:37503}}, tests/{validator-registry-doc-count.vitest.ts:1-7, test-scripts-modules.js:177,569-603,979,2392, workspace-identity.vitest.ts:13, naming-migration.js}, extractors/{index.ts:36, collect-session-data.ts:11-22}, core/{alignment-validator.ts:3-7, workflow.ts:40, frontmatter-editor.ts}, config/index.ts (full), loaders/data-loader.ts:19, templates/{inline-gate-renderer.sh:5-10, inline-gate-renderer.ts}, references/spec-root-alias-retirement-runbook.md (head)}` [3,4,6,7,8,9]
- `.opencode/commands/doctor/_routes.yaml:160-200` [7]; `doctor/assets/doctor-update.yaml:271,280` [7]; `doctor/scripts/doctor-runtime-bootstrap.sh:48-62` [7]
- `.opencode/commands/deep/assets/deep-research-auto.yaml:1955-1974` [6,7]; `deep-review-auto.yaml:2145` [6]
- `.opencode/skills/system-deep-loop/{runtime/scripts/reduce-state.cjs:13,2090,2120,2259; deep-research/scripts/reduce-state.cjs:14,1536-1563; shared/synthesis/resource-map.cjs:18; shared/synthesis/README.md:20,35; shared/review-research-paths.cjs:30-42; runtime/lib/validation/orchestrator.ts:76,102-136,230}` [6,9]
- `.opencode/skills/system-spec-kit/templates/{README.md,C contract.md, template-mapping.md:89,100,337}; references/{templates/template-guide.md:61, workflows/{execution-methods.md:186, goal-set-string-playbook.md:95, quick-reference.md:92,143}}` [6,9 — ghost-file check, retracted]

<!-- /ANCHOR:remediation -->
<!-- ANCHOR:caller-surfaces -->
## 3. THE CALLER SURFACES (searched wholesale; reads targeted)

- `.opencode/commands/` (deep/, doctor/, create/, speckit/ assets): YAML steps that name cli entry points [2-7]
- `.opencode/bin/` (speckit-completion.cjs, install-codex-hooks.mjs) [7]
- `.opencode/hooks/` (post-edit-quality/lib/post-edit-router.cjs:40) [3,8]
- `.opencode/plugins/` (system-speckit-completion.js) [9]
- `.github/workflows/` (spec-kit-check.yml, markdown-link-integrity.yml:29, command-tree-parity.yml, strict-pass-freshness-report.yml, routing-registry-drift.yml:88-96) [4,5,7,8]
- `.opencode/agents/` + `.opencode/modes/` (optimizer: zero mentions) [7]
- Sibling skills (sk-code, sk-doc, system-deep-loop, system-skill-advisor, cli-external-orchestration/cli-pi) [1,4,6,7,9]

<!-- /ANCHOR:caller-surfaces -->
<!-- ANCHOR:gaps -->
## 4. GAPS (stated honestly)

- `tests/` files were enumerated by name and counted (353 files; 141 vitest) but not read individually except the ones cited above — the per-test-file liveness question was outside the charter.
- The two `council` lanes (test:council, test:council:full) were inventoried but not executed or fully read.
- `dist/` (symlink) and the compiled `runtime/dist` outputs were never used as evidence.
- The main-checkout topology (`.opencode/specs` alias state) could not be verified from this worktree — carried as a residual.

<!-- /ANCHOR:gaps -->
