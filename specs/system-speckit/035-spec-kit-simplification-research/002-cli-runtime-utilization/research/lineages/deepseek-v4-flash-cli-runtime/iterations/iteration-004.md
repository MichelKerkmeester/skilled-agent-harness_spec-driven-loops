---
title: "Iteration 4: root entries get verdicts; utils/ — the corner round one never entered"
trigger_phrases: []
---
# Iteration 4: Root entries get verdicts; utils/ — the corner round one never entered

## Focus

Job 2 begins: the angles round one covered in one pass or not at all. Two targets: (a) the root-level entries (10 files: README, package.json, tsconfig, common.sh, check-api-boundary.sh, check-links.sh, check-markdown-links.cjs, deploy-mcp.sh, test-council-matrix.sh, validate-command-tree-parity.sh) — a caller verdict for each; (b) utils/ (20 files) — round one's resource-map has NO utils/ entry at all, so this directory never carried a verdict.

## Actions Taken

1. Root-entry caller census: check-api-boundary.sh → package.json `check` (line 24 of scripts) + skill README + playbook (wired). check-markdown-links.cjs → .github/workflows/markdown-link-integrity.yml:29 `GUARD=".../cli/check-markdown-links.cjs"` (CI-wired). validate-command-tree-parity.sh → .github/workflows/command-tree-parity.yml (CI-wired) + README row. test-council-matrix.sh → runtime/package.json:25-26 `test:council:full: bash cli/test-council-matrix.sh` (npm-script-wired; no workflow invokes it — manual lane, same class as most npm scripts). deploy-mcp.sh → README.md:130 documents it as the manual rebuild step after pulling source (dist/ is gitignored) — same documented-manual class as sweep-track-roots.mjs (round one's kept row); no executable caller found. common.sh → cli-internal sourcing (round one already verified).
2. utils/ import census (python, precise pattern `\.\.?/[^'"]*utils/NAME` over all .ts/.js outside utils/, dist/, node_modules, INCLUDING tests/): direct importer counts — logger 9, input-normalizer 15, file-helpers 6, fact-coercion 6, slug-utils 5, source-capabilities 5, path-utils 4, message-utils 3, task-enrichment 3, template-structure.js 3, spec-affinity 3, prompt-utils 2, tool-detection 2, data-validator 2, tool-sanitizer 1, index 2 — and **ZERO: phase-classifier.ts, validation-utils.ts, workspace-identity.ts**.
3. Follow-up reads: utils/index.ts is a partial barrel (exports 15 of the 20 modules; NOT phase-classifier, NOT task-enrichment, NOT template-structure.js); the only production barrel consumer is loaders/data-loader.ts:19 (imports structuredLog + sanitizePath only). utils/phase-classifier.ts is a pure re-export shim of ../lib/phase-classifier.js (the LIVE module — production importers: extractors/conversation-extractor.ts, utils/tool-detection.ts + tests). utils/workspace-identity.ts (218L): exports buildWorkspaceIdentity, getWorkspacePathVariants, isSameWorkspacePath, toWorkspaceRelativePath, normalizeAbsolutePath; the only non-self reference is tests/workspace-identity.vitest.ts:13 (imports `../utils` barrel). utils/validation-utils.ts (83L): validateNoLeakedPlaceholders + validateAnchors over rendered content; the only reference outside utils/ is tests/test-scripts-modules.js:177-186.
4. Duplication check: no twin of workspace-identity or validation-utils anywhere in runtime/ or shared/ (grep NONE outside cli). rules/check-placeholders.sh:12 explicitly states "Mustache {{...}} is NOT flagged" — so validation-utils' mustache-leak check is NOT a duplicate of the placeholder rule (different input class: rendered template output vs spec docs).

## Findings

1. **P1 — utils/workspace-identity.ts is a dead production module**: 218 lines, 5 exported functions, zero importers (python census including tests); reachable only through the utils/ barrel, whose sole production consumer (loaders/data-loader.ts:19) imports two unrelated names; the single usage site is tests/workspace-identity.vitest.ts:13. Declared purpose (module header comment + exports): workspace-relative path identity for captured sessions — a memory-pipeline concern, consistent with a survivor of the memory decommission rather than a live CLI feature. Observed callers: none found (production); the test is its only consumer. Severity P1 (dead production code, same profile as continuity/rank-memories.ts which 007 removed). Recommendation: **remove** (file + barrel section + the vitest suite), or restore its missing caller if the decommission left one — this audit can only see that none exists.

2. **P1 — utils/validation-utils.ts is the removed renderers/' orphan**: it validates RENDERED output (leaked `{{...}}` mustache, partial placeholders, open/close block balance, `<!-- ANCHOR:x -->` pairs) — the template-renderer era's validation, whose only production consumer (renderers/template-renderer.ts) was removed by 007. Zero production importers today; the single reference is tests/test-scripts-modules.js:177-186. Declared purpose: rendered-output placeholder/anchor validation. Observed callers: the legacy module test only. Severity P1 (dead production module). Recommendation: **remove** (and drop the T-002d/T-002e assertions), since rules/check-placeholders.sh:12 explicitly excludes mustache (different input class) and the engine's ANCHORS_VALID covers anchors — no live consumer needs the TS functions.

3. **P1 — utils/phase-classifier.ts is a dead re-export shim**: it exists only to re-export `classifyConversationExchanges`/`classifyConversationPhase` from the live `../lib/phase-classifier.js`, and ZERO files import utils/phase-classifier (production or test); every production consumer imports lib/phase-classifier directly (extractors/conversation-extractor.ts, utils/tool-detection.ts). Declared purpose: phase-classification compat re-export. Observed callers: none found. Severity P1 (dead compat shim — the same evidence class as the lib/trigger-extractor.js shim round one flagged as dead-but-registered). Recommendation: **remove** (the barrel never exported it; nothing breaks).

## Questions Answered

- (Q4, partial) utils/ — the round-one one-pass corner — now carries a per-file verdict: 17 of 20 are production-wired (direct importers or barrel consumers), 3 are dead (findings 1-3). Root entries: 5 of 6 entrypoints have a live caller (hook/CI/npm-script); deploy-mcp.sh is a documented manual tool (consistent with round one's kept row for sweep-track-roots.mjs).

## Questions Remaining

- Tests estate inventory + whether the new workflow's coverage claim matches its steps (iteration 5).
- config/, types/, loaders/ parity; retrieval/ and graph/ post-007 state (iterations 5-6).
- Duplicated helpers across cli/, ../lib/, shared/ (iteration 9).

## What Worked / What Failed

- Worked: a precise per-file import census in python over the whole cli tree — the earlier grep-based attempt (iteration 2's draft) produced noise; the python regex with anchored `utils/` prefix gave exact zeros.
- Worked: tracing validation-utils' lineage to the removed renderers/ before filing — the placeholder-rule parity note (rules/check-placeholders.sh:12) proves it is NOT a duplicated check, avoiding a false duplication claim.
- Failed: none; no approach exhausted.

## Ruled Out

- deploy-mcp.sh as dead — the README:130 documents it as the canonical manual rebuild step; same kept class as sweep-track-roots.mjs (round one's recorded decision), so no finding.
- validation-utils as a duplicate of the placeholder rules — rule 12 states mustache is NOT flagged there; different input classes.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/ (root ls + package.json scripts)] [SOURCE: .github/workflows/markdown-link-integrity.yml:29, .github/workflows/command-tree-parity.yml] [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:25-26] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/README.md:130] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/utils/ (python import census + index.ts full read)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/utils/phase-classifier.ts (full), lib/phase-classifier.ts (importers)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts:139-190, .opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts:13] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/utils/validation-utils.ts:12-60,83 + tests/test-scripts-modules.js:177-186] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:12, .opencode/skills/system-spec-kit/runtime/cli/loaders/data-loader.ts:19]

## Next Iteration

Iteration 5: the tests/ estate and the CI coverage claim — which test lanes the spec-kit-check workflow actually runs (vitest cli project only) vs test:legacy (test-scripts-modules.js, test-extractors-loaders.js) and test:validation (test-validation-system.cjs, test-validation.sh, test-validation-extended.sh) which the workflow does not run; recount the estate; check the vitest config's include patterns point at real files and no stale paths.
