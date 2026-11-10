---
title: "Iteration 9: cross-package duplication and the lib/ dead-file census (with a self-correction)"
trigger_phrases: []
---
# Iteration 9: Cross-package duplication and the lib/ dead-file census (with a self-correction)

## Focus

The last undecided big-ticket angle: helpers duplicated across cli/, ../lib/, shared/, and the per-file lib/ liveness census (the exact check that found three dead utils/ modules in iteration 4, applied to lib/). Also: did the 007 removals leave any barrel/import pointing at a removed module?

## Actions Taken

1. Barrel/removal side-effect check: extractors/index.ts:36 exports `./quality-scorer.js` — the LIVE extractors scorer (production V2, core/workflow.ts:40 imports it); core/README.md:113 row names the same file. No stale export of any removed module (the iteration-1 name census already returned NONE for every removed token; this targeted check confirms the barrel level too).
2. Duplication inventory re-verification: validate-memory-quality is a documented shim pair — continuity/validate-memory-quality.ts (3-8: "Canonical implementation lives in ../lib/validate-memory-quality.ts. This file re-exports everything for backward compatibility and serves as the CLI entry point") with THREE live test importers; the canonical lib/ module is imported by 5 production files (extractors/quality-scorer.ts, core/{spec-root-registry,quality-gates,workflow}.ts, continuity shim). Legitimate, documented, live — NOT a finding. retrieval/lib/frontmatter.mjs is a "deliberately narrow" single-key reader whose header explains why it cannot reuse the TS module (TS-only through build output; parseSectionValue collapses failure shapes) — justified. shared/review-research-paths.cjs is an artifact-subfolder allocator, NOT a repo-root resolver — round one's repo-root ×3 row stays at 3.
3. lib/ dead-file census (python, two import forms: `../lib/NAME[.js]` and within-lib `./NAME[.js]`) + repo-wide rg for every low-count file: results below with a documented self-correction.
4. Sub-checks: orchestrator registry loading (../lib/validation/orchestrator.ts:76 reads validator-registry.json directly); tests/validator-registry-doc-count.vitest.ts reads the JSON via fs (no TS loader use); the capture-module family cli-capture-shared.ts names (claude-code/opencode-cli/copilot-cli) — NO such modules exist in extractors/ or core/ (rg NONE).

## Findings

1. **P1 — lib/cli-capture-shared.ts is a dead extraction whose named consumers no longer exist**: 0 references anywhere in the repo (repo-wide rg NONE; a single README row). Its own header (lines 3-11) documents the intent — "Shared utility functions extracted from the CLI capture modules (claude-code, opencode-cli, copilot-cli)... The capture modules can be updated to import from here in a follow-up pass" — and the follow-up never ran: the three capture modules do not exist in the current tree (extractors/ + core/ contain no claude-code/opencode-cli/copilot-cli module), so the file's declared justification (eliminate duplication, prevent drift) has no subject left. Declared purpose: shared capture helpers. Observed callers: none found. Severity P1. Recommendation: **remove** (with the README row; the decommissioned capture family it served is gone).

2. **P1 — lib/validator-registry.ts (53L) is a dead loader**: exports loadValidatorRegistry/normalizeRuleId/findValidatorRule + types; zero importers repo-wide. The engine reads validator-registry.json directly (lib/validation/orchestrator.ts:76 VALIDATOR_REGISTRY_PATH + fs.existsSync at 230), and validator-registry-doc-count.vitest.ts reads the JSON via fs — nobody calls the TS module. Declared purpose: typed registry loader. Observed callers: none found. Severity P1 (dead module; the types it declares are re-declared in the engine). Recommendation: **remove**, or rewire orchestrator.ts:76 through it (that is the merge alternative — one loader, one type surface).

3. **P2 — retrieval/lib/frontmatter.mjs:6-8 cites a stale path in its design reason**: "It exists instead of reusing scripts/lib/frontmatter-migration.ts" — the module exists at runtime/cli/lib/frontmatter-migration.ts (verified), the `scripts/` prefix is stale since the CLI moved. The reason itself (TS-only through build output; parseSectionValue collapses failure shapes) is the true justification. Declaration purpose: narrow trigger-phrase frontmatter reader. Observed callers: 4 files (migrate-trigger-phrase-residual.ts, backfill-frontmatter.ts, generate-trigger-index.mjs + itself). Severity P2. Recommendation: **fix** (path).

4. **SELF-CORRECTION (recorded for the record)**: the first lib/ census pass used only the `.../lib/NAME.js` import form and produced false zeros for trigger-extractor.ts, ascii-boxes.ts, unicode-normalization.ts, topic-keywords.ts, esm-entry.js, dist-freshness.cjs, completion-state.cjs. Correcting with the within-lib form (`./NAME.js`) and repo-wide rg: trigger-extractor.ts is LIVE (lib/memory-frontmatter.ts:6 + semantic-signal-golden test — round one's DROPPED row was right, and its claim "imported by semantic-signal-extractor.ts and memory-frontmatter.ts" holds; the file re-exports @spec-kit/shared/trigger-extractor at line 14); ascii-boxes.ts LIVE (lib/decision-tree-generator.ts); unicode-normalization.ts LIVE (lib/trigger-phrase-sanitizer.ts); topic-keywords.ts LIVE (lib/semantic-signal-extractor.ts); esm-entry.js LIVE (27 importer files, 25 production); dist-freshness.cjs LIVE (package.json prepare-build/record-build — executed, not imported); completion-state.cjs LIVE (plugins/system-speckit-completion.js + bin/speckit-completion.cjs — `.cjs` requires, which the first pass did not match). No finding was filed on any of these; the iteration-4 utils/ findings were re-checked against the same flaw — tests/test-scripts-modules.js:569 tests lib/phase-classifier and 177 requires utils/validation-utils (the validation-utils finding accounted for it), while utils/phase-classifier and utils/workspace-identity confirmed zero-referenced.

## Questions Answered

- (Q4/Q6 completion) The lib/ dead-file census: 2 real deads found (findings 1-2), 1 stale-path doc (finding 3), and a corrected set of LIVE files; the 007 barrel check is clean; the documented shim pairs are legitimate; no cross-package duplication of the round-one class remains except the already-recorded decisions.

## Questions Remaining

- Final certification: full-sweep no-caller claims, finding-count reconciliation, ranked removal/merge list, convergence report, synthesis (iteration 10). (Note: the removed-name census and the zero-caller claims in this lineage are certified at the FULL sweep level for their respective scopes; iteration 10 consolidates.)

## What Worked / What Failed

- Worked: finding the census false-zero class quickly — triggered by a contradiction (round one's dropped row vs my zero) — and rerunning with both import forms before filing anything.
- Worked: the two-sided rule on cli-capture-shared — the file's own header ADMITS the follow-up never ran; the strongest possible evidence for a dead extraction.
- Failed: the first import-form census (within-lib relative imports) — corrected above; this lineage's iteration-4/9 method lesson is recorded in the strategy's "What Failed" and the correction is part of the record.

## Ruled Out

- trigger-extractor/ascii-boxes/unicode-normalization/topic-keywords/esm-entry/dist-freshness/completion-state as dead — all verified live (importers cited in finding 4's correction).
- A fourth repo-root resolver in shared/review-research-paths.cjs — it is a subfolder name allocator, not a root resolver.
- validator-registry.ts as "the" registry — the registry is the JSON, read by the engine; the TS module is the dead loader.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/lib/cli-capture-shared.ts:3-11 (header), lib/README.md] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.ts:27,39,44 + repo-wide importer grep] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:76,230] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/frontmatter.mjs:6-8, lib/frontmatter-migration.ts (exists)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/lib/{memory-frontmatter.ts:6, decision-tree-generator.ts, trigger-phrase-sanitizer.ts, semantic-signal-extractor.ts} + package.json scripts + .opencode/plugins/system-speckit-completion.js + .opencode/bin/speckit-completion.cjs] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/{continuity/validate-memory-quality.ts:3-8, lib/validate-memory-quality.ts} importers] [SOURCE: .opencode/skills/system-spec-kit/shared/review-research-paths.cjs:30-42]

## Next Iteration

Iteration 10: the certification + consolidation — full-sweep no-caller certification over this lineage's claims, finding-count reconciliation, the ranked removal/merge list (ranked by confidence that nothing documented depends on it), and the chartered questions' final verdicts, then the convergence report and synthesis.
