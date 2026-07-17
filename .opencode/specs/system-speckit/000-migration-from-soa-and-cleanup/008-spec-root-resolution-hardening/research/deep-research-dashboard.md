---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Harden spec-folder root resolution. Enumerate every root-resolution call site with file and line and its precedence legacy-first vs canonical-first, decide whether canonical-first is the correct universal contract and whether any legacy specs-first caller would regress, determine what created and maintains the specs symlink and whether it is intentional and cross-platform-safe and whether resolution should depend on it, characterize the symlink-absent failure mode for each auto-writer, and produce a ranked regression-safe remediation with migration, rollback, and a validation strategy that passes both with and without the symlink.
- Started: 2026-07-17T07:55:46Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: rsr-2026-07-17T07-55-46Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Build the exhaustive root-resolution call-site inventory, including exact files, lines, callers, and precedence. | architecture | 1.00 | 6 | complete |
| 2 | Determine whether canonical-first is the correct universal contract and identify concrete regressions for every legacy-first consumer or persisted-path dependency found in iteration 1. | architecture | 1.00 | 5 | complete |
| 3 | Determine what created and maintains the root specs symlink, whether it is intentional, and whether it is safe across supported platforms, clones, archives, worktrees, and checkout modes. | portability | 1.00 | 6 | complete |
| 4 | Characterize the symlink-absent failure mode for every automatic or implicit writer, including Claude Stop autosave. | reliability | 0.93 | 6 | timeout |
| 5 | Close source/dist parity and the Claude Stop symlink-absent autosave-chain evidence gap. | reliability | 0.70 | 5 | complete |
| 6 | Generate and evidence-rank remediation candidates for a universal canonical-first contract without implementation. | architecture | 0.70 | 5 | complete |
| 7 | Perform a read-only collision, persisted-identity, and root-precedence test-gap inventory without altering the live symlink. | reliability | 0.90 | 5 | complete |
| 8 | Design the evidence-anchored symlink/no-symlink root-resolution fixture and assertion matrix without modifying tests. | reliability | 0.80 | 5 | complete |
| 9 | Make the staged migration, rollback, source/dist rebuild order, and CI operating-system lanes operationally precise while challenging packet-stranding and split-state recreation risks. | reliability | 0.90 | 5 | complete |
| 10 | Audit iterations 1-9 for adversarial consistency and completeness, resolve discrepancies, and produce the final ranked recommendation with explicit synthesis downgrades and residual unknowns. | assurance | 0.90 | 5 | complete |

- iterationsCompleted: 10
- keyFindings: 53
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which call sites resolve or enumerate spec roots, what exact precedence does each use, and which writers or readers consume each result?
- [x] Is canonical-first the correct universal contract, and which legacy-first consumers or persisted paths could regress under that change?
- [x] What created and maintains the root `specs` symlink, is it intentional, and is it safe across supported platforms and checkout modes?
- [x] What is each automatic writer's failure mode when the symlink is absent, including the Claude session-stop autosave path?
- [x] What ranked remediation, migration, rollback, and dual-environment validation strategy minimizes regression risk?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █████▇▇▅▂▁▁▂▄▅▄▄▅▆▆▆
- score sparkline: █████▇▇▅▂▁▁▂▄▅▄▄▅▆▆▆
- Last 3 ratios: 0.80 -> 0.90 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"code":209,"git-scm.com":3,"other":7}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
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

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
