---
title: "Deep Research Strategy: Spec Root Resolution Hardening"
description: "Externalized strategy for investigating canonical and legacy spec-root resolution behavior."
trigger_phrases:
  - "spec root resolution"
  - "specs symlink"
  - "canonical specs root"
  - "legacy specs root"
importance_tier: "important"
contextType: "planning"
---
# Deep Research Strategy - Spec Root Resolution Hardening

## 1. OVERVIEW

### Purpose

Build a complete, cited model of spec-root resolution and auto-writer behavior before proposing a regression-safe remediation.

## 2. TOPIC

Harden spec-folder root resolution across scripts, MCP-server code, hooks, and automatic writers without relying on the repository-root `specs` symlink.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which call sites resolve or enumerate spec roots, what exact precedence does each use, and which writers or readers consume each result?
- [x] Is canonical-first the correct universal contract, and which legacy-first consumers or persisted paths could regress under that change?
- [x] What created and maintains the root `specs` symlink, is it intentional, and is it safe across supported platforms and checkout modes?
- [x] What is each automatic writer's failure mode when the symlink is absent, including the Claude session-stop autosave path?
- [x] What ranked remediation, migration, rollback, and dual-environment validation strategy minimizes regression risk?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement resolver, hook, symlink, or migration changes during this research loop.
- Do not broaden into unrelated spec-kit cleanup.
- Do not assume the current symlink masks every split-root path; verify each call site independently.

## 5. STOP CONDITIONS

- Run all 10 requested iterations; convergence is telemetry only under `stopPolicy=max-iterations`.
- Every material conclusion must cite repository evidence, generated behavior evidence, or an explicit inference.
- The synthesis must include migration, rollback, and validation both with and without the symlink.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which call sites resolve or enumerate spec roots, what exact precedence does each use, and which writers or readers consume each result?
- Is canonical-first the correct universal contract, and which legacy-first consumers or persisted paths could regress under that change?
- What created and maintains the root `specs` symlink, is it intentional, and is it safe across supported platforms and checkout modes?
- What is each automatic writer's failure mode when the symlink is absent, including the Claude session-stop autosave path?
- What ranked remediation, migration, rollback, and dual-environment validation strategy minimizes regression risk?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Symbol-focused searches around `getSpecsDirectories`, `findActiveSpecsDir`, canonical/legacy root variables, and direct root construction exposed the decision points; narrow source reads then established precedence and consumers. (iteration 1)
- Reusing iteration 1’s exact consumer inventory avoided the blocked broad scan; rereading only the shared resolver, `generate-context`, and workflow persistence paths exposed the distinction between target selection, containment, diagnostics, and identity derivation. (iteration 2)
- Git object/index/history inspection separated the tracked payload and capture commit from filesystem assumptions; targeted creator-pattern searches then distinguished Git checkout maintenance from runtime maintenance; official Git contracts made unsupported checkout behavior explicit. (iteration 3)
- Reusing the prior writer inventory avoided the blocked broad scan; tracing the configured Stop hook into compiled generator/detector/workflow artifacts exposed the previously hidden basename-recovery and phase-pointer-skip stages. (iteration 4)
- Starting at `.claude/settings.json`, pairing each source branch with the exact compiled artifact, and checking map metadata closed the runtime-evidence gap without re-running the broad writer inventory. (iteration 5)
- Reusing exact iteration 2–5 anchors avoided blocked broad scans and made candidate ranking depend on demonstrated bypass paths, duplicate behavior, and portability failure rather than patch size. (iteration 6)
- Git object/path counts plus inode evidence distinguished alias spelling from physical ownership without touching the symlink; parsing generated JSON exposed a persistence distinction that source-only identity reasoning missed. (iteration 7)
- Reusing iterations 4–7's exact behavior anchors and reading the existing temp-workspace, symlink-probe, pointer, hook, and dist harnesses converted a broad acceptance list into executable-style assertions without touching tests. (iteration 8)
- Treating rollout as a transaction with independent data, executable, and alias rollback domains exposed that implementation rank and deployment order are not the same thing. (iteration 9)
- Rechecking exact shared symbols first preserved the validated core inventory, while a separate direct-constructor pass exposed independent implementations without repeating the blocked repository-wide literal scan. (iteration 10)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The initial repository-wide literal search mixed runtime code with thousands of historical/generated references and truncated, while Code Mode had no local filesystem provider. (iteration 1)
- Treating “canonical-first” as a single boolean initially obscures the unsafe canonical-only variant; separating precedence, fallback, and explicit-path preservation produced a regression-safe contract. (iteration 2)
- the first broad symlink-pattern search exceeded the result-size limit because historical packet prose dominated. Narrowing to production roots and creator APIs removed that noise. The fetched `git-config` page was also large, so a narrow reread of its captured `core.symlinks` anchor was used to verify the exact wording. (iteration 3)
- Treating “legacy-first falls back to canonical” as sufficient initially missed that the Stop hook first converts its target into an explicit absent legacy path. Additional narrow runtime reads were required and exceeded the iteration tool budget. (iteration 4)
- Two initial bounded `node -e` scans failed on shell quoting before the corrected read-only scan ran; the source maps then proved unsuitable for byte-level provenance because they omit embedded sources. (iteration 5)
- Treating the shared resolver reorder as the obvious first patch fails coverage analysis because the highest-severity automatic writers either preserve an explicit legacy path or construct one directly. (iteration 6)
- The initial Git-tree process used Node's default output buffer, which was too small for 45,224 tracked entries; a bounded larger in-memory buffer resolved it without changing the query or repository. (iteration 7)
- Existing root-preference tests use different packet IDs or the same inode, so neither can prove the winner for a divergent same-relative collision; this required a separate packet-content sentinel dimension. (iteration 8)
- The initial Code Mode batch transport was unavailable in this runtime; direct narrow reads preserved the source budget and evidence quality. (iteration 9)
- The direct-constructor search reached the result cap and cannot prove universal absence; it is evidence of incompleteness, not a replacement exhaustive inventory. (iteration 10)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A read/write legacy compatibility window:** read fallback protects legacy-only discoverability, but write fallback allows automatic or stale clients to recreate split state after migration. Compatibility is therefore read-only, with migration writes allowed only under the global freeze. [INFERENCE: based on R2 fallback and R6 divergent-duplicate behavior] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **A read/write legacy compatibility window:** read fallback protects legacy-only discoverability, but write fallback allows automatic or stale clients to recreate split state after migration. Compatibility is therefore read-only, with migration writes allowed only under the global freeze. [INFERENCE: based on R2 fallback and R6 divergent-duplicate behavior]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A read/write legacy compatibility window:** read fallback protects legacy-only discoverability, but write fallback allows automatic or stale clients to recreate split state after migration. Compatibility is therefore read-only, with migration writes allowed only under the global freeze. [INFERENCE: based on R2 fallback and R6 divergent-duplicate behavior]

### **Bulk persisted-ID rewriting:** inspected identities are root-relative or metadata-backed, so the actual migration risk is packet collision/content, not alias text in IDs. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md:17,19-23] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Bulk persisted-ID rewriting:** inspected identities are root-relative or metadata-backed, so the actual migration risk is packet collision/content, not alias text in IDs. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md:17,19-23]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Bulk persisted-ID rewriting:** inspected identities are root-relative or metadata-backed, so the actual migration risk is packet collision/content, not alias text in IDs. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md:17,19-23]

### **Canonical-only resolution:** it would make unique legacy-only packets undiscoverable. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md:11,19-23] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Canonical-only resolution:** it would make unique legacy-only packets undiscoverable. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md:11,19-23]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Canonical-only resolution:** it would make unique legacy-only packets undiscoverable. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md:11,19-23]

### **MCP-first or source-only build validation:** the configured hook reaches scripts dist, while both packages declare compiled runtime entrypoints. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:5-19] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:5-31] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **MCP-first or source-only build validation:** the configured hook reaches scripts dist, while both packages declare compiled runtime entrypoints. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:5-19] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:5-31]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **MCP-first or source-only build validation:** the configured hook reaches scripts dist, while both packages declare compiled runtime entrypoints. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:5-19] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:5-31]

### **One Ubuntu symlink lane as portability proof:** the current workflow is Ubuntu-only, and mandatory absent/plain-file behavior is distinct from optional symlink capability. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:11-27] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **One Ubuntu symlink lane as portability proof:** the current workflow is Ubuntu-only, and mandatory absent/plain-file behavior is distinct from optional symlink capability. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:11-27]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **One Ubuntu symlink lane as portability proof:** the current workflow is Ubuntu-only, and mandatory absent/plain-file behavior is distinct from optional symlink capability. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:11-27]

### **Relative-symlink-only remediation:** it removes the developer-specific absolute payload but remains unavailable when Git checks symlinks out as plain files. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-003.md:13-15,22-24] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Relative-symlink-only remediation:** it removes the developer-specific absolute payload but remains unavailable when Git checks symlinks out as plain files. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-003.md:13-15,22-24]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Relative-symlink-only remediation:** it removes the developer-specific absolute payload but remains unavailable when Git checks symlinks out as plain files. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-003.md:13-15,22-24]

### **Resolver-order-only remediation:** it cannot fix the Stop hook's explicit legacy-qualified argument, post-save re-resolution, or direct `spec/create.sh` root construction. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:15-26] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Resolver-order-only remediation:** it cannot fix the Stop hook's explicit legacy-qualified argument, post-save re-resolution, or direct `spec/create.sh` root construction. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:15-26]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Resolver-order-only remediation:** it cannot fix the Stop hook's explicit legacy-qualified argument, post-save re-resolution, or direct `spec/create.sh` root construction. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:15-26]

### **Rolling packet data back after writer unfreeze:** the quarantine is older after the first canonical write, so restoration is potentially destructive. [INFERENCE: based on the S2/S3 write boundary] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Rolling packet data back after writer unfreeze:** the quarantine is older after the first canonical write, so restoration is potentially destructive. [INFERENCE: based on the S2/S3 write boundary]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Rolling packet data back after writer unfreeze:** the quarantine is older after the first canonical write, so restoration is potentially destructive. [INFERENCE: based on the S2/S3 write boundary]

### **Writer fixes before data preflight/migration:** this can strand the old packet and create a canonical twin for the same relative ID. [INFERENCE: based on the current legacy-first/direct-legacy writers and the intended canonical writer destinations] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Writer fixes before data preflight/migration:** this can strand the old packet and create a canonical twin for the same relative ID. [INFERENCE: based on the current legacy-first/direct-legacy writers and the intended canonical writer destinations]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Writer fixes before data preflight/migration:** this can strand the old packet and create a canonical twin for the same relative ID. [INFERENCE: based on the current legacy-first/direct-legacy writers and the intended canonical writer destinations]

### `mcp_server/lib/config/spec-doc-paths.ts` was not counted as a root-choice call site: production search results showed it supplying document classification/identity helpers, while actual filesystem root selection occurs in `memory-index-discovery.ts`. [INFERENCE: based on .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-220 and .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:52-62] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `mcp_server/lib/config/spec-doc-paths.ts` was not counted as a root-choice call site: production search results showed it supplying document classification/identity helpers, while actual filesystem root selection occurs in `memory-index-discovery.ts`. [INFERENCE: based on .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-220 and .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:52-62]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mcp_server/lib/config/spec-doc-paths.ts` was not counted as a root-choice call site: production search results showed it supplying document classification/identity helpers, while actual filesystem root selection occurs in `memory-index-discovery.ts`. [INFERENCE: based on .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-220 and .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:52-62]

### `scripts/loaders/data-loader.ts:84-91` was excluded as a spec-root resolver: it defines security bases for an input JSON file and does not choose a packet root. [SOURCE: .opencode/skills/system-spec-kit/scripts/loaders/data-loader.ts:80-105] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `scripts/loaders/data-loader.ts:84-91` was excluded as a spec-root resolver: it defines security bases for an input JSON file and does not choose a packet root. [SOURCE: .opencode/skills/system-spec-kit/scripts/loaders/data-loader.ts:80-105]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `scripts/loaders/data-loader.ts:84-91` was excluded as a spec-root resolver: it defines security bases for an input JSON file and does not choose a packet root. [SOURCE: .opencode/skills/system-spec-kit/scripts/loaders/data-loader.ts:80-105]

### A bulk persisted-ID rewrite was ruled out: inspected packet IDs and workflow folder identities are stored root-relative or read from packet metadata, not persisted as the selected root alias. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:531-549] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1053] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A bulk persisted-ID rewrite was ruled out: inspected packet IDs and workflow folder identities are stored root-relative or read from packet metadata, not persisted as the selected root alias. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:531-549] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1053]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A bulk persisted-ID rewrite was ruled out: inspected packet IDs and workflow folder identities are stored root-relative or read from packet metadata, not persisted as the selected root alias. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:531-549] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1053]

### A canonical-only resolver was ruled out because `getSpecsDirectories()` consumers rely on enumeration to retain unique legacy-only packet discoverability. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-360] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A canonical-only resolver was ruled out because `getSpecsDirectories()` consumers rely on enumeration to retain unique legacy-only packet discoverability. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-360]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A canonical-only resolver was ruled out because `getSpecsDirectories()` consumers rely on enumeration to retain unique legacy-only packet discoverability. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-360]

### A destructive live test that removes or replaces repository-root `specs` was not run because this dispatch makes all investigated code/config read-only; exact source and configured-dist branches were used instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-4.md:10-14] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A destructive live test that removes or replaces repository-root `specs` was not run because this dispatch makes all investigated code/config read-only; exact source and configured-dist branches were used instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-4.md:10-14]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A destructive live test that removes or replaces repository-root `specs` was not run because this dispatch makes all investigated code/config read-only; exact source and configured-dist branches were used instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-4.md:10-14]

### A full root-state × packet-state × entrypoint Cartesian suite was ruled out because most combinations repeat the same selector; R1–R9 plus targeted writer/reader rows preserve every distinct decision edge with less fixture duplication. [INFERENCE: based on the factorized selector, reader, and writer branches above] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A full root-state × packet-state × entrypoint Cartesian suite was ruled out because most combinations repeat the same selector; R1–R9 plus targeted writer/reader rows preserve every distinct decision edge with less fixture duplication. [INFERENCE: based on the factorized selector, reader, and writer branches above]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A full root-state × packet-state × entrypoint Cartesian suite was ruled out because most combinations repeat the same selector; R1–R9 plus targeted writer/reader rows preserve every distinct decision edge with less fixture duplication. [INFERENCE: based on the factorized selector, reader, and writer branches above]

### A production symlink installer or self-healer under `.opencode/skills` or `.opencode/scripts`: focused creator-pattern searches found only temporary test fixtures; the production script assumes the link already exists. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-217] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A production symlink installer or self-healer under `.opencode/skills` or `.opencode/scripts`: focused creator-pattern searches found only temporary test fixtures; the production script assumes the link already exists. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-217] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A production symlink installer or self-healer under `.opencode/skills` or `.opencode/scripts`: focused creator-pattern searches found only temporary test fixtures; the production script assumes the link already exists. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-217] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819]

### A repository-wide literal search for every occurrence of `.opencode/specs` was too noisy because generated packets, tests, fixtures, schema descriptions, and documentation dominate the results; the inventory was narrowed to executable root-choice functions and their production callers. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A repository-wide literal search for every occurrence of `.opencode/specs` was too noisy because generated packets, tests, fixtures, schema descriptions, and documentation dominate the results; the inventory was narrowed to executable root-choice functions and their production callers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A repository-wide literal search for every occurrence of `.opencode/specs` was too noisy because generated packets, tests, fixtures, schema descriptions, and documentation dominate the results; the inventory was narrowed to executable root-choice functions and their production callers.

### Broad test-keyword search produced unrelated uses of “legacy,” “canonical,” and “duplicate”; exact root-selector symbols and the identified root-discovery suites were used for the final inventory. [SOURCE: targeted grep results for root-selector symbols and precedence phrases under `.opencode/skills/system-spec-kit`, 2026-07-17] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Broad test-keyword search produced unrelated uses of “legacy,” “canonical,” and “duplicate”; exact root-selector symbols and the identified root-discovery suites were used for the final inventory. [SOURCE: targeted grep results for root-selector symbols and precedence phrases under `.opencode/skills/system-spec-kit`, 2026-07-17]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad test-keyword search produced unrelated uses of “legacy,” “canonical,” and “duplicate”; exact root-selector symbols and the identified root-discovery suites were used for the final inventory. [SOURCE: targeted grep results for root-selector symbols and precedence phrases under `.opencode/skills/system-spec-kit`, 2026-07-17]

### Changing shared resolver order will not fix or regress the untracked `spec/create.sh` branch because that writer constructs `specs/` directly and does not consume the shared resolver. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:32-34] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Changing shared resolver order will not fix or regress the untracked `spec/create.sh` branch because that writer constructs `specs/` directly and does not consume the shared resolver. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:32-34]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changing shared resolver order will not fix or regress the untracked `spec/create.sh` branch because that writer constructs `specs/` directly and does not consume the shared resolver. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:32-34]

### Depending on the alias as a universal contract is eliminated even if its target is corrected to relative: Git explicitly supports checkouts that materialize symlinks as plain files. [SOURCE: https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Depending on the alias as a universal contract is eliminated even if its target is corrected to relative: Git explicitly supports checkouts that materialize symlinks as plain files. [SOURCE: https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Depending on the alias as a universal contract is eliminated even if its target is corrected to relative: Git explicitly supports checkouts that materialize symlinks as plain files. [SOURCE: https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks]

### Explicit graph migration/backfill defaults were not promoted into the automatic-writer set; both default directly to canonical, so their inclusion is only a completeness comparator. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts:590-598] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:312-319] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Explicit graph migration/backfill defaults were not promoted into the automatic-writer set; both default directly to canonical, so their inclusion is only a completeness comparator. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts:590-598] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:312-319]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Explicit graph migration/backfill defaults were not promoted into the automatic-writer set; both default directly to canonical, so their inclusion is only a completeness comparator. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts:590-598] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:312-319]

### Generalizing canonical-first behavior to all MCP code: generic MCP folder discovery and startup pending recovery construct legacy before canonical. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1371-1379] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1602-1619] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Generalizing canonical-first behavior to all MCP code: generic MCP folder discovery and startup pending recovery construct legacy before canonical. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1371-1379] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1602-1619]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generalizing canonical-first behavior to all MCP code: generic MCP folder discovery and startup pending recovery construct legacy before canonical. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1371-1379] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1602-1619]

### Generic path-literal scanning is not a productive way to establish precedence; future inventory checks should search resolver symbols and direct `path.join(..., 'specs')` assignments, then read each production context. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Generic path-literal scanning is not a productive way to establish precedence; future inventory checks should search resolver symbols and direct `path.join(..., 'specs')` assignments, then read each production context.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generic path-literal scanning is not a productive way to establish precedence; future inventory checks should search resolver symbols and direct `path.join(..., 'specs')` assignments, then read each production context.

### Inferring broad cross-platform safety from current tests: the inspected CI path is Ubuntu-only and the integration test skips substantive assertions after `EPERM`. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:11-23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:185-193,208-215] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Inferring broad cross-platform safety from current tests: the inspected CI path is Ubuntu-only and the integration test skips substantive assertions after `EPERM`. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:11-23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:185-193,208-215]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inferring broad cross-platform safety from current tests: the inspected CI path is Ubuntu-only and the integration test skips substantive assertions after `EPERM`. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:11-23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:185-193,208-215]

### No new dead end was promoted. The iteration respected prior blocks against broad literal scans, canonical-only selection, symlink dependence, and bulk ID rewriting. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:76-188] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No new dead end was promoted. The iteration respected prior blocks against broad literal scans, canonical-only selection, symlink dependence, and bulk ID rewriting. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:76-188]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead end was promoted. The iteration respected prior blocks against broad literal scans, canonical-only selection, symlink dependence, and bulk ID rewriting. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:76-188]

### No new research direction is exhausted. Dynamic symlink-absent and divergent-root cases belong in isolated implementation-test fixtures, not in this read-only live-checkout iteration. [INFERENCE: based on the dispatch prohibition and the missing test cells identified above] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No new research direction is exhausted. Dynamic symlink-absent and divergent-root cases belong in isolated implementation-test fixtures, not in this read-only live-checkout iteration. [INFERENCE: based on the dispatch prohibition and the missing test cells identified above]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new research direction is exhausted. Dynamic symlink-absent and divergent-root cases belong in isolated implementation-test fixtures, not in this read-only live-checkout iteration. [INFERENCE: based on the dispatch prohibition and the missing test cells identified above]

### No new research direction is exhausted. The remaining work is implementation and execution of the designed fixtures; repeating static root-behavior analysis would add less evidence than running the source/dist matrix after the staged fixes. [INFERENCE: based on the now-concrete R1–R9 and writer/reader acceptance rows] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No new research direction is exhausted. The remaining work is implementation and execution of the designed fixtures; repeating static root-behavior analysis would add less evidence than running the source/dist matrix after the staged fixes. [INFERENCE: based on the now-concrete R1–R9 and writer/reader acceptance rows]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new research direction is exhausted. The remaining work is implementation and execution of the designed fixtures; repeating static root-behavior analysis would add less evidence than running the source/dist matrix after the staged fixes. [INFERENCE: based on the now-concrete R1–R9 and writer/reader acceptance rows]

### No new research direction is exhausted. The rollout model is now operationally closed; implementation must prove it through the designed temporary-workspace, migration-fault, source/dist, and OS lanes rather than another static resolver scan. [INFERENCE: based on the exact stage gates and L1–L4 assignments above] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No new research direction is exhausted. The rollout model is now operationally closed; implementation must prove it through the designed temporary-workspace, migration-fault, source/dist, and OS lanes rather than another static resolver scan. [INFERENCE: based on the exact stage gates and L1–L4 assignments above]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new research direction is exhausted. The rollout model is now operationally closed; implementation must prove it through the designed temporary-workspace, migration-fault, source/dist, and OS lanes rather than another static resolver scan. [INFERENCE: based on the exact stage gates and L1–L4 assignments above]

### Preserving “exhaustive every root-resolution call site” in synthesis: narrow direct-constructor verification found concrete omitted production resolvers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1363-1379] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/spec-affinity.ts:153-174] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Preserving “exhaustive every root-resolution call site” in synthesis: narrow direct-constructor verification found concrete omitted production resolvers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1363-1379] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/spec-affinity.ts:153-174]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Preserving “exhaustive every root-resolution call site” in synthesis: narrow direct-constructor verification found concrete omitted production resolvers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1363-1379] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/spec-affinity.ts:153-174]

### Regex/literal scanning cannot itself certify global completeness: the narrow direct-constructor search reached its result cap and still excludes dynamically composed paths and external automation. Future implementation must maintain an explicit resolver registry or an AST-backed inventory and prove it against the blocking matrix; synthesis must not turn this bounded audit into a universal negative claim. [INFERENCE: based on the capped direct-constructor search and the concrete omitted resolvers verified above] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Regex/literal scanning cannot itself certify global completeness: the narrow direct-constructor search reached its result cap and still excludes dynamically composed paths and external automation. Future implementation must maintain an explicit resolver registry or an AST-backed inventory and prove it against the blocking matrix; synthesis must not turn this bounded audit into a universal negative claim. [INFERENCE: based on the capped direct-constructor search and the concrete omitted resolvers verified above]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regex/literal scanning cannot itself certify global completeness: the narrow direct-constructor search reached its result cap and still excludes dynamically composed paths and external automation. Future implementation must maintain an explicit resolver registry or an AST-backed inventory and prove it against the blocking matrix; synthesis must not turn this bounded audit into a universal negative claim. [INFERENCE: based on the capped direct-constructor search and the concrete omitted resolvers verified above]

### Remediation ranking was not investigated because iteration 5 explicitly forbids broadening into remediation. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-5.md:8-12] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Remediation ranking was not investigated because iteration 5 explicitly forbids broadening into remediation. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-5.md:8-12]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Remediation ranking was not investigated because iteration 5 explicitly forbids broadening into remediation. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-5.md:8-12]

### Removing, replacing, or repointing the live symlink was ruled out by dispatch; Git tree/index reads and filesystem metadata provided the safe current-state inventory instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-7.md:8-10] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Removing, replacing, or repointing the live symlink was ruled out by dispatch; Git tree/index reads and filesystem metadata provided the safe current-state inventory instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-7.md:8-10]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing, replacing, or repointing the live symlink was ruled out by dispatch; Git tree/index reads and filesystem metadata provided the safe current-state inventory instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-7.md:8-10]

### Repeating the blocked repository-wide literal scan was unnecessary; the prior writer inventory plus narrow runtime/source reads covered each writer class. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:98-116] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Repeating the blocked repository-wide literal scan was unnecessary; the prior writer inventory plus narrow runtime/source reads covered each writer class. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:98-116]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repeating the blocked repository-wide literal scan was unnecessary; the prior writer inventory plus narrow runtime/source reads covered each writer class. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:98-116]

### Repeating the iteration-4 writer matrix would not close the freshness question; direct source/dist pairing and the configured runtime entrypoint were the narrower evidence path. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:13-35,85-93] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Repeating the iteration-4 writer matrix would not close the freshness question; direct source/dist pairing and the configured runtime entrypoint were the narrower evidence path. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:13-35,85-93]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repeating the iteration-4 writer matrix would not close the freshness question; direct source/dist pairing and the configured runtime entrypoint were the narrower evidence path. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:13-35,85-93]

### Retaining iteration 6's writer-before-data sequence as deployment order: iteration 9 correctly shows that it can create a canonical twin beside a unique legacy packet. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-009.md:14-27] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Retaining iteration 6's writer-before-data sequence as deployment order: iteration 9 correctly shows that it can create a canonical twin beside a unique legacy packet. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-009.md:14-27]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retaining iteration 6's writer-before-data sequence as deployment order: iteration 9 correctly shows that it can create a canonical twin beside a unique legacy packet. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-009.md:14-27]

### Source-only reasoning was insufficient because the configured hook executes compiled artifacts and the environment reported stale dist; targeted compiled-artifact reads resolved that evidence risk. [SOURCE: .claude/settings.json:123-137] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:30-102] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Source-only reasoning was insufficient because the configured hook executes compiled artifacts and the environment reported stale dist; targeted compiled-artifact reads resolved that evidence risk. [SOURCE: .claude/settings.json:123-137] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:30-102]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Source-only reasoning was insufficient because the configured hook executes compiled artifacts and the environment reported stale dist; targeted compiled-artifact reads resolved that evidence risk. [SOURCE: .claude/settings.json:123-137] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:30-102]

### Source-only testing and marker/mtime-only dist checks were ruled out because production Stop and generator routes execute compiled JavaScript. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:40-56,131-139] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:61-119] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Source-only testing and marker/mtime-only dist checks were ruled out because production Stop and generator routes execute compiled JavaScript. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:40-56,131-139] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:61-119]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Source-only testing and marker/mtime-only dist checks were ruled out because production Stop and generator routes execute compiled JavaScript. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:40-56,131-139] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:61-119]

### The first two bounded Git-tree scans exceeded Node's default `spawnSync` output buffer; the successful retry raised only the in-memory read buffer and made no filesystem or Git-state mutation. [SOURCE: command results from the three read-only `node` Git-tree inventory attempts, 2026-07-17] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The first two bounded Git-tree scans exceeded Node's default `spawnSync` output buffer; the successful retry raised only the in-memory read buffer and made no filesystem or Git-state mutation. [SOURCE: command results from the three read-only `node` Git-tree inventory attempts, 2026-07-17]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first two bounded Git-tree scans exceeded Node's default `spawnSync` output buffer; the successful retry raised only the in-memory read buffer and made no filesystem or Git-state mutation. [SOURCE: command results from the three read-only `node` Git-tree inventory attempts, 2026-07-17]

### The live repository symlink, tests, source, build outputs, and Git state were not modified; the dispatch requires fixture design only. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-8.md:8-12] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The live repository symlink, tests, source, build outputs, and Git state were not modified; the dispatch requires fixture design only. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-8.md:8-12]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The live repository symlink, tests, source, build outputs, and Git state were not modified; the dispatch requires fixture design only. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-8.md:8-12]

### Treating `EPERM` as a successful symlink test was ruled out because the current folder-discovery pattern can return after `expect(true).toBe(true)` without exercising assertions; capability-probed `it.skip` keeps the missing coverage visible while all no-symlink rows still run. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-215] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:108-124] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating `EPERM` as a successful symlink test was ruled out because the current folder-discovery pattern can return after `expect(true).toBe(true)` without exercising assertions; capability-probed `it.skip` keeps the missing coverage visible while all no-symlink rows still run. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-215] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:108-124]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `EPERM` as a successful symlink test was ruled out because the current folder-discovery pattern can return after `expect(true).toBe(true)` without exercising assertions; capability-probed `it.skip` keeps the missing coverage visible while all no-symlink rows still run. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-215] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:108-124]

### Treating a tracked symlink as inherently portable is eliminated: Git tracks its payload verbatim, and this payload is absolute and developer-specific. [SOURCE: command `git ls-files --stage -- specs`; `git cat-file -p HEAD:specs`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating a tracked symlink as inherently portable is eliminated: Git tracks its payload verbatim, and this payload is absolute and developer-specific. [SOURCE: command `git ls-files --stage -- specs`; `git cat-file -p HEAD:specs`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a tracked symlink as inherently portable is eliminated: Git tracks its payload verbatim, and this payload is absolute and developer-specific. [SOURCE: command `git ls-files --stage -- specs`; `git cat-file -p HEAD:specs`]

### Treating all `generate-context` invocations as alias-dependent is ruled out: canonical-qualified and bare inputs can select canonical directly; the Stop hook and explicit `specs/...` inputs are the vulnerable route. [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:214-307] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating all `generate-context` invocations as alias-dependent is ruled out: canonical-qualified and bare inputs can select canonical directly; the Stop hook and explicit `specs/...` inputs are the vulnerable route. [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:214-307]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all `generate-context` invocations as alias-dependent is ruled out: canonical-qualified and bare inputs can select canonical directly; the Stop hook and explicit `specs/...` inputs are the vulnerable route. [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:214-307]

### Treating every legacy-first call site as a write-target selector is incorrect: containment gates, diagnostics, relative-identity derivation, and description regeneration consume root lists without independently choosing a different physical packet. Reducer promotion should preserve this behavioral distinction. [INFERENCE: based on .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:13-27 and .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating every legacy-first call site as a write-target selector is incorrect: containment gates, diagnostics, relative-identity derivation, and description regeneration consume root lists without independently choosing a different physical packet. Reducer promotion should preserve this behavioral distinction. [INFERENCE: based on .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:13-27 and .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every legacy-first call site as a write-target selector is incorrect: containment gates, diagnostics, relative-identity derivation, and description regeneration consume root lists without independently choosing a different physical packet. Reducer promotion should preserve this behavioral distinction. [INFERENCE: based on .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:13-27 and .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058]

### Treating relative-symlink repair or canonical-only selection as the endpoint; both remain blocked by plain-file checkouts and legacy-only discoverability respectively. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:24-29] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating relative-symlink repair or canonical-only selection as the endpoint; both remain blocked by plain-file checkouts and legacy-only discoverability respectively. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:24-29]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating relative-symlink repair or canonical-only selection as the endpoint; both remain blocked by plain-file checkouts and legacy-only discoverability respectively. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:24-29]

### Treating targeted parity as proof that the entire stale dist tree is current was ruled out; only the chain's load-bearing branches were compared. [INFERENCE: based on the bounded source/dist pairs listed in Finding 2] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating targeted parity as proof that the entire stale dist tree is current was ruled out; only the chain's load-bearing branches were compared. [INFERENCE: based on the bounded source/dist pairs listed in Finding 2]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating targeted parity as proof that the entire stale dist tree is current was ruled out; only the chain's load-bearing branches were compared. [INFERENCE: based on the bounded source/dist pairs listed in Finding 2]

### Treating the latest commit as evidence of the exact creation command: its body explicitly labels the link as pre-existing uncommitted work, so only capture provenance is available. [SOURCE: command `git show -s --format=... 2f6f6abcfb97aef79e97d5fa28169c6229dca341`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the latest commit as evidence of the exact creation command: its body explicitly labels the link as pre-existing uncommitted work, so only capture provenance is available. [SOURCE: command `git show -s --format=... 2f6f6abcfb97aef79e97d5fa28169c6229dca341`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the latest commit as evidence of the exact creation command: its body explicitly labels the link as pre-existing uncommitted work, so only capture provenance is available. [SOURCE: command `git show -s --format=... 2f6f6abcfb97aef79e97d5fa28169c6229dca341`]

### Using source maps as byte-equivalent build provenance was ruled out because the inspected maps name the TypeScript inputs but contain no `sourcesContent`. [SOURCE: command `node` source-map/parity scan of session-stop, generate-context, folder-detector, config, subfolder-utils, and workflow maps] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Using source maps as byte-equivalent build provenance was ruled out because the inspected maps name the TypeScript inputs but contain no `sourcesContent`. [SOURCE: command `node` source-map/parity scan of session-stop, generate-context, folder-detector, config, subfolder-utils, and workflow maps]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using source maps as byte-equivalent build provenance was ruled out because the inspected maps name the TypeScript inputs but contain no `sourcesContent`. [SOURCE: command `node` source-map/parity scan of session-stop, generate-context, folder-detector, config, subfolder-utils, and workflow maps]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `mcp_server/lib/config/spec-doc-paths.ts` was not counted as a root-choice call site: production search results showed it supplying document classification/identity helpers, while actual filesystem root selection occurs in `memory-index-discovery.ts`. [INFERENCE: based on .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-220 and .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:52-62] (iteration 1)
- `scripts/loaders/data-loader.ts:84-91` was excluded as a spec-root resolver: it defines security bases for an input JSON file and does not choose a packet root. [SOURCE: .opencode/skills/system-spec-kit/scripts/loaders/data-loader.ts:80-105] (iteration 1)
- A repository-wide literal search for every occurrence of `.opencode/specs` was too noisy because generated packets, tests, fixtures, schema descriptions, and documentation dominate the results; the inventory was narrowed to executable root-choice functions and their production callers. (iteration 1)
- Generic path-literal scanning is not a productive way to establish precedence; future inventory checks should search resolver symbols and direct `path.join(..., 'specs')` assignments, then read each production context. (iteration 1)
- A bulk persisted-ID rewrite was ruled out: inspected packet IDs and workflow folder identities are stored root-relative or read from packet metadata, not persisted as the selected root alias. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:531-549] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1053] (iteration 2)
- A canonical-only resolver was ruled out because `getSpecsDirectories()` consumers rely on enumeration to retain unique legacy-only packet discoverability. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-360] (iteration 2)
- Changing shared resolver order will not fix or regress the untracked `spec/create.sh` branch because that writer constructs `specs/` directly and does not consume the shared resolver. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:32-34] (iteration 2)
- Treating every legacy-first call site as a write-target selector is incorrect: containment gates, diagnostics, relative-identity derivation, and description regeneration consume root lists without independently choosing a different physical packet. Reducer promotion should preserve this behavioral distinction. [INFERENCE: based on .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:13-27 and .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058] (iteration 2)
- A production symlink installer or self-healer under `.opencode/skills` or `.opencode/scripts`: focused creator-pattern searches found only temporary test fixtures; the production script assumes the link already exists. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-217] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819] (iteration 3)
- Depending on the alias as a universal contract is eliminated even if its target is corrected to relative: Git explicitly supports checkouts that materialize symlinks as plain files. [SOURCE: https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks] (iteration 3)
- Inferring broad cross-platform safety from current tests: the inspected CI path is Ubuntu-only and the integration test skips substantive assertions after `EPERM`. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:11-23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:185-193,208-215] (iteration 3)
- Treating a tracked symlink as inherently portable is eliminated: Git tracks its payload verbatim, and this payload is absolute and developer-specific. [SOURCE: command `git ls-files --stage -- specs`; `git cat-file -p HEAD:specs`] (iteration 3)
- Treating the latest commit as evidence of the exact creation command: its body explicitly labels the link as pre-existing uncommitted work, so only capture provenance is available. [SOURCE: command `git show -s --format=... 2f6f6abcfb97aef79e97d5fa28169c6229dca341`] (iteration 3)
- A destructive live test that removes or replaces repository-root `specs` was not run because this dispatch makes all investigated code/config read-only; exact source and configured-dist branches were used instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-4.md:10-14] (iteration 4)
- Explicit graph migration/backfill defaults were not promoted into the automatic-writer set; both default directly to canonical, so their inclusion is only a completeness comparator. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts:590-598] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:312-319] (iteration 4)
- Repeating the blocked repository-wide literal scan was unnecessary; the prior writer inventory plus narrow runtime/source reads covered each writer class. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:98-116] (iteration 4)
- Source-only reasoning was insufficient because the configured hook executes compiled artifacts and the environment reported stale dist; targeted compiled-artifact reads resolved that evidence risk. [SOURCE: .claude/settings.json:123-137] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:30-102] (iteration 4)
- Treating all `generate-context` invocations as alias-dependent is ruled out: canonical-qualified and bare inputs can select canonical directly; the Stop hook and explicit `specs/...` inputs are the vulnerable route. [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:214-307] (iteration 4)
- Remediation ranking was not investigated because iteration 5 explicitly forbids broadening into remediation. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-5.md:8-12] (iteration 5)
- Repeating the iteration-4 writer matrix would not close the freshness question; direct source/dist pairing and the configured runtime entrypoint were the narrower evidence path. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:13-35,85-93] (iteration 5)
- Treating targeted parity as proof that the entire stale dist tree is current was ruled out; only the chain's load-bearing branches were compared. [INFERENCE: based on the bounded source/dist pairs listed in Finding 2] (iteration 5)
- Using source maps as byte-equivalent build provenance was ruled out because the inspected maps name the TypeScript inputs but contain no `sourcesContent`. [SOURCE: command `node` source-map/parity scan of session-stop, generate-context, folder-detector, config, subfolder-utils, and workflow maps] (iteration 5)
- **Bulk persisted-ID rewriting:** inspected identities are root-relative or metadata-backed, so the actual migration risk is packet collision/content, not alias text in IDs. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md:17,19-23] (iteration 6)
- **Canonical-only resolution:** it would make unique legacy-only packets undiscoverable. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md:11,19-23] (iteration 6)
- **Relative-symlink-only remediation:** it removes the developer-specific absolute payload but remains unavailable when Git checks symlinks out as plain files. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-003.md:13-15,22-24] (iteration 6)
- **Resolver-order-only remediation:** it cannot fix the Stop hook's explicit legacy-qualified argument, post-save re-resolution, or direct `spec/create.sh` root construction. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:15-26] (iteration 6)
- No new dead end was promoted. The iteration respected prior blocks against broad literal scans, canonical-only selection, symlink dependence, and bulk ID rewriting. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md:76-188] (iteration 6)
- Broad test-keyword search produced unrelated uses of “legacy,” “canonical,” and “duplicate”; exact root-selector symbols and the identified root-discovery suites were used for the final inventory. [SOURCE: targeted grep results for root-selector symbols and precedence phrases under `.opencode/skills/system-spec-kit`, 2026-07-17] (iteration 7)
- No new research direction is exhausted. Dynamic symlink-absent and divergent-root cases belong in isolated implementation-test fixtures, not in this read-only live-checkout iteration. [INFERENCE: based on the dispatch prohibition and the missing test cells identified above] (iteration 7)
- Removing, replacing, or repointing the live symlink was ruled out by dispatch; Git tree/index reads and filesystem metadata provided the safe current-state inventory instead. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-7.md:8-10] (iteration 7)
- The first two bounded Git-tree scans exceeded Node's default `spawnSync` output buffer; the successful retry raised only the in-memory read buffer and made no filesystem or Git-state mutation. [SOURCE: command results from the three read-only `node` Git-tree inventory attempts, 2026-07-17] (iteration 7)
- A full root-state × packet-state × entrypoint Cartesian suite was ruled out because most combinations repeat the same selector; R1–R9 plus targeted writer/reader rows preserve every distinct decision edge with less fixture duplication. [INFERENCE: based on the factorized selector, reader, and writer branches above] (iteration 8)
- No new research direction is exhausted. The remaining work is implementation and execution of the designed fixtures; repeating static root-behavior analysis would add less evidence than running the source/dist matrix after the staged fixes. [INFERENCE: based on the now-concrete R1–R9 and writer/reader acceptance rows] (iteration 8)
- Source-only testing and marker/mtime-only dist checks were ruled out because production Stop and generator routes execute compiled JavaScript. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:40-56,131-139] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:61-119] (iteration 8)
- The live repository symlink, tests, source, build outputs, and Git state were not modified; the dispatch requires fixture design only. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-8.md:8-12] (iteration 8)
- Treating `EPERM` as a successful symlink test was ruled out because the current folder-discovery pattern can return after `expect(true).toBe(true)` without exercising assertions; capability-probed `it.skip` keeps the missing coverage visible while all no-symlink rows still run. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-215] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:108-124] (iteration 8)
- **A read/write legacy compatibility window:** read fallback protects legacy-only discoverability, but write fallback allows automatic or stale clients to recreate split state after migration. Compatibility is therefore read-only, with migration writes allowed only under the global freeze. [INFERENCE: based on R2 fallback and R6 divergent-duplicate behavior] (iteration 9)
- **MCP-first or source-only build validation:** the configured hook reaches scripts dist, while both packages declare compiled runtime entrypoints. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:5-19] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:5-31] (iteration 9)
- **One Ubuntu symlink lane as portability proof:** the current workflow is Ubuntu-only, and mandatory absent/plain-file behavior is distinct from optional symlink capability. [SOURCE: .github/workflows/strict-pass-freshness-sweep.yml:11-27] (iteration 9)
- **Rolling packet data back after writer unfreeze:** the quarantine is older after the first canonical write, so restoration is potentially destructive. [INFERENCE: based on the S2/S3 write boundary] (iteration 9)
- **Writer fixes before data preflight/migration:** this can strand the old packet and create a canonical twin for the same relative ID. [INFERENCE: based on the current legacy-first/direct-legacy writers and the intended canonical writer destinations] (iteration 9)
- No new research direction is exhausted. The rollout model is now operationally closed; implementation must prove it through the designed temporary-workspace, migration-fault, source/dist, and OS lanes rather than another static resolver scan. [INFERENCE: based on the exact stage gates and L1–L4 assignments above] (iteration 9)
- Generalizing canonical-first behavior to all MCP code: generic MCP folder discovery and startup pending recovery construct legacy before canonical. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1371-1379] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1602-1619] (iteration 10)
- Preserving “exhaustive every root-resolution call site” in synthesis: narrow direct-constructor verification found concrete omitted production resolvers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1363-1379] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/spec-affinity.ts:153-174] (iteration 10)
- Regex/literal scanning cannot itself certify global completeness: the narrow direct-constructor search reached its result cap and still excludes dynamically composed paths and external automation. Future implementation must maintain an explicit resolver registry or an AST-backed inventory and prove it against the blocking matrix; synthesis must not turn this bounded audit into a universal negative claim. [INFERENCE: based on the capped direct-constructor search and the concrete omitted resolvers verified above] (iteration 10)
- Retaining iteration 6's writer-before-data sequence as deployment order: iteration 9 correctly shows that it can create a canonical twin beside a unique legacy packet. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-009.md:14-27] (iteration 10)
- Treating relative-symlink repair or canonical-only selection as the endpoint; both remain blocked by plain-file checkouts and legacy-only discoverability respectively. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:24-29] (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The repository-root `specs` path is reported to be a symlink to `.opencode/specs` with the same inode.
- `scripts/dist/core/config.js#getSpecsDirectories` is reported to enumerate the legacy root first and return the first existing root.
- MCP-server `spec-doc-paths.js` is reported to prefer `.opencode/specs`.
- The Claude session-stop hook is reported to invoke `generate-context.js` as an automatic writer.
- `resource-map.md` was absent at initialization, so the loop must build its own cited inventory.
- Spec Kit Memory was unavailable at startup because the MCP connection closed.

### Bounded Context Snapshot

- Source pointers: `.opencode/skills/system-spec-kit/`, runtime hook configuration, root symlink metadata, tests, and package/build scripts.
- Integration points: scripts-side path resolution, MCP-server path resolution, memory save/generate-context, Claude session-stop automation, and validation fixtures.
- Constraint: preserve legacy packet discoverability while making canonical write ownership deterministic.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current generation: 1
- Started: 2026-07-17T07:55:46Z
