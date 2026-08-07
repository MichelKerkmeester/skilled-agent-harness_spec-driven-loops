# Iteration 8: Evidence-Anchored Symlink/No-Symlink Fixture and Assertion Matrix

## Focus

This iteration designed, but did not create, the isolated regression fixtures and assertions for canonical and legacy spec-root resolution. The contract under test is the staged contract from iterations 6–7: canonical wins unqualified ambiguity, explicit legacy input remains authoritative during migration, unique legacy-only packets remain readable, divergent duplicate IDs block writes, and behavior must not depend on the repository-root `specs` symlink.

## Route Proof

- Exact rendered route: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-8.md:1-3]
- This is `iteration: 8`, `run: 8`, with `mode="research"`, `target_agent="deep-research"`, and `agent_definition_loaded=true`; the dispatch permits only this narrative, one canonical state append, and `deltas/iter-008.jsonl`. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-8.md:4-12]

## Findings

1. **Use one packet-local temporary-workspace factory with factorized root and packet dimensions, rather than a full Cartesian fixture set.** A future `createRootResolutionFixture({ rootMode, packetMode })` should create a realpathed `mkdtemp` root, expose `canonicalRoot=<tmp>/.opencode/specs` and `legacyRoot=<tmp>/specs`, write minimal valid `spec.md` plus schema-valid `graph-metadata.json`, and always remove the workspace in `afterEach`. Root modes should be `canonical-only`, `legacy-only`, `symlink-alias`, `independent-roots`, `broken-symlink`, `plain-directory-replacement`, and `plain-file-checkout`; packet modes should be `unique`, `same-id-identical`, `same-id-divergent`, and `phase-parent-child`. The existing harnesses already establish `mkdtemp`/recursive cleanup, valid graph-metadata construction, and symlink capability probing; the new factory should reuse those patterns and must use an explicit skipped-test result when symlink creation is unsupported instead of returning a vacuous pass. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:49-67,134-227] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:9-78] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:108-124]

   Concrete packet identities and sentinels:

   | Packet mode | Layout | Assertion sentinel |
   |---|---|---|
   | `unique` | `system-spec-kit/930-canonical-only` or `931-legacy-only` in one physical root | Root-qualified absolute result plus root-relative packet ID |
   | `same-id-identical` | Byte-identical `system-spec-kit/932-duplicate` under both independent roots | Equal file hashes and one logical canonical winner |
   | `same-id-divergent` | Same relative ID under both roots, but `spec.md` headings and metadata summaries say `CANONICAL` versus `LEGACY` | Collision preflight reports both absolute paths and blocks implicit writes |
   | `phase-parent-child` | `system-spec-kit/940-parent/001-child` with valid parent and child metadata | Child write target and parent `last_active_child_id` resolve within the same physical root |

2. **The minimal root-state matrix is nine pairwise cells; it covers every requested topology without repeating every entrypoint against every state.** Direct resolver assertions belong in a dedicated scripts-side contract suite because current `getSpecsDirectories()` and compiled dist both return legacy before canonical, `findActiveSpecsDir()` accepts any existing path without checking that it is a directory, and same-inode deduplication preserves the first spelling. These assertions should initially expose the intended red cells, then become the regression contract after remediation. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-360] [SOURCE: .opencode/skills/system-spec-kit/scripts/dist/core/config.js:214-250]

   | Cell | Root state and packet placement | Required shared-resolver assertion | Current-baseline expectation |
   |---|---|---|---|
   | R1 | Canonical root only; canonical unique packet | Order is `[canonical, legacy]`; active root is canonical; existing roots are `[canonical]` | Active fallback already succeeds, but list order is currently legacy-first. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-340] |
   | R2 | Legacy root only; legacy unique packet | Active root is legacy and the packet remains discoverable through fallback | Already succeeds and must remain green. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:328-360] |
   | R3 | `specs` is a symlink to canonical; one packet | Active spelling is canonical; existing roots dedupe to one realpath; packet ID is root-relative and stable | Current code dedupes to one inode but preserves the legacy spelling; existing tests cover inode/identity dedup. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-226] |
   | R4 | Two independent roots; one unique packet in each | Canonical is active, but enumeration retains both roots in canonical-first order | Existing MCP fixture proves both physical roots can exist; scripts order is currently opposite. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:158-168] |
   | R5 | Independent roots; byte-identical same relative ID | Classifier says `duplicate-identical`; unqualified selection is canonical; no data move is proposed | Missing today; realpath dedup cannot collapse independent inodes. [INFERENCE: based on config.ts:338-360 and iteration-007.md:14-18] |
   | R6 | Independent roots; divergent same relative ID | Classifier says `duplicate-divergent`, reports both paths, and implicit reader/writer orchestration stops before mutation | Missing today; this is the only selection case where reordering changes content. [INFERENCE: based on iteration-002.md:11-17 and iteration-007.md:16-18] |
   | R7 | Canonical root plus dangling `specs` symlink | Broken alias is not selected; canonical remains active; no replacement legacy root is created | `existsSync` makes the shared resolver fall through, but this behavior has no direct test. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:328-340] |
   | R8 | Canonical root plus distinct plain `specs` directory (alias replacement) | Implicit selection and writes are canonical; explicit legacy-qualified reads/writes remain legacy during migration | Current shared resolver and untracked `spec/create.sh` select/write the plain legacy directory. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-335] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819] |
   | R9 | Canonical root plus plain file at `specs` containing link text | Non-directory legacy candidate is rejected; canonical remains active; implicit creation never calls `mkdir` through the file | Current `existsSync`-only active-root check can return the file, while direct untracked creation hard-fails. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:328-340] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819] |

3. **Reader assertions must distinguish scripts enumeration from MCP authoritative-root selection and must inspect content, not only path counts.** Extend the existing MCP `findSpecDocuments` fixture with (a) canonical absent/legacy-only fallback, (b) the same relative ID in both independent roots with divergent sentinel content, and (c) broken/plain legacy entries while canonical exists. Assert that MCP returns the canonical sentinel whenever canonical exists and the legacy sentinel only when canonical is absent; mirror each case for `findGraphMetadataFiles`. Separately assert that scripts-side discovery retains unique legacy packets while choosing canonical for an unqualified duplicate. Existing `T520-9a` uses different packet IDs, so it proves root preference but cannot detect a same-ID content switch; `T520-9b` proves only same-inode deduplication. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:500-607] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-223,308-382] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-007.md:14-18]

   Reader acceptance assertions:

   | Reader | Canonical-only | Legacy-only | Symlink alias | Independent unique roots | Same-ID divergent |
   |---|---|---|---|---|---|
   | Scripts active/default | Canonical | Legacy fallback | Canonical spelling, one realpath | Canonical active; both enumerable | Canonical only after collision preflight explicitly approves selection |
   | MCP docs + graph metadata | Canonical | Legacy fallback | One canonical file set | Canonical tree only while canonical exists | Canonical sentinel only; no legacy content leakage |
   | Explicit legacy-qualified lookup | Not found unless fallback semantics are explicitly requested | Legacy | Same inode, stable root-relative ID | Legacy target preserved during migration | Legacy target preserved only for explicit reads; implicit mutation remains blocked |

4. **Writer tests should assert the selected absolute packet, every touched metadata file, absence of writes in the losing root, and reader visibility after the write.** Mock-only argument tests are necessary but insufficient: one source-level test should capture each writer's selected path, and one temporary-workspace integration test should inspect the filesystem afterward. The matrix below maps each assertion to an existing harness seam. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:116-205] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:42-249] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:60-157]

   | Writer / entrypoint | Fixture cells | Required assertions | Harness anchor and current expected red |
   |---|---|---|---|
   | Claude Stop target normalization | R1, R3, R7, R8 | Captured autosave payload uses `.opencode/specs/<id>` for transcript-derived implicit targets; source hook and compiled hook produce the same payload; no `specs/<id>` target is emitted | `processStopHook` already supports a test-only generator override and classifies subprocess outcomes. Current source and dist normalize to `specs/`, so the canonical-target assertion is intentionally red before the call-site fix. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:31-56,104-152,705-749] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:22-45,67-102,563] |
   | `generate-context` bare/canonical/legacy input | R1, R2, R6, R8 | Bare input selects canonical; canonical-qualified stays canonical; explicit existing legacy stays legacy; divergent implicit duplicate exits before `runWorkflow`; losing-root mtimes/content remain unchanged | CLI-authority harness already captures `runWorkflow.specFolderArg`; resolver currently preserves explicit qualified paths and otherwise enumerates shared roots. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:57-161] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-338,352-382] |
   | Workflow metadata follow-ups | R1, R8 | `description.json`, `graph-metadata.json`, and any research metadata are all under the selected absolute packet; zero corresponding files appear in the losing root; MCP rediscovers the written packet | Existing workflow evidence shows follow-ups consume the resolved absolute packet rather than choosing a root independently. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:21-24] |
   | Phase-child save | R1, R7, R8 with `phase-parent-child` | Child metadata and parent pointer update in the same root; parent points to the child's root-relative ID; the losing parent metadata is byte-unchanged | Existing valid-metadata fixture and assertions cover pointer content but not root divergence. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:9-123] |
   | `spec/create.sh --track` and untracked creation | R1, R7, R8, R9 | Both implicit creation forms land under canonical after remediation; alias state is irrelevant; no new plain legacy root is materialized; explicit migration-only legacy mode, if retained, is separately named and tested | Tracked creation is canonical now; untracked creation directly selects `specs` and `mkdir -p`, producing split-brain or failure. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:800-819] |

5. **Run the contract at both semantic source seams and actual compiled runtime seams; marker or mtime freshness checks alone are not behavior proof.** Source-mode Vitest should import the TypeScript resolver, MCP discovery, Stop hook, and pointer functions. Dist-mode should first build both packages, then import `scripts/dist/core/config.js`, spawn or import `scripts/dist/memory/generate-context.js` with `CONFIG.PROJECT_ROOT` rebound to the temporary workspace before workflow execution, and invoke `mcp_server/dist/hooks/claude/session-stop.js` with `SPECKIT_TEST=true` plus a capture stub. The same table-driven expected-result object should drive source and dist assertions so drift is a value mismatch, not a prose review. Existing checks only prove the compiled export exists or compare markers/mtimes; the configured Stop route and scripts package entrypoints execute dist, so the behavior matrix must run after a fresh build and then in a second alias-absent pass. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:274-304,328-332] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:61-119] [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:10-19] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:18-32] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:40-56,104-152]

   Exact execution split:

   | Gate | Source assertions | Compiled-dist assertions |
   |---|---|---|
   | Resolver | All R1–R9 against `scripts/core/config.ts` | All R1–R9 against `scripts/dist/core/config.js` |
   | Readers | R1–R7 against MCP discovery source | Canonical/legacy/same-ID smoke cells against built MCP discovery entrypoint |
   | Stop autosave | R1/R3/R7/R8 payload capture through source `processStopHook` | Same cases through built CLI with capture stub; assert exit/outcome and captured target |
   | Generator/writes | Bare, canonical-qualified, explicit-legacy, collision-blocked source cases | R1/R7/R8 actual output-location smoke tests against built generator |
   | Freshness prerequisite | Typecheck and targeted source suites | Build first, then behavior tests; mtime/marker freshness remains an additional gate, not a substitute |

## Ruled Out

- A full root-state × packet-state × entrypoint Cartesian suite was ruled out because most combinations repeat the same selector; R1–R9 plus targeted writer/reader rows preserve every distinct decision edge with less fixture duplication. [INFERENCE: based on the factorized selector, reader, and writer branches above]
- Treating `EPERM` as a successful symlink test was ruled out because the current folder-discovery pattern can return after `expect(true).toBe(true)` without exercising assertions; capability-probed `it.skip` keeps the missing coverage visible while all no-symlink rows still run. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:180-215] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:108-124]
- Source-only testing and marker/mtime-only dist checks were ruled out because production Stop and generator routes execute compiled JavaScript. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:40-56,131-139] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:61-119]
- The live repository symlink, tests, source, build outputs, and Git state were not modified; the dispatch requires fixture design only. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-8.md:8-12]

## Dead Ends

- No new research direction is exhausted. The remaining work is implementation and execution of the designed fixtures; repeating static root-behavior analysis would add less evidence than running the source/dist matrix after the staged fixes. [INFERENCE: based on the now-concrete R1–R9 and writer/reader acceptance rows]

## Edge Cases

- Ambiguous input: “plain-directory replacement” is treated as a distinct writable `specs/` directory that replaced the intended alias; “two independent roots” is the topology, while packet placement (`unique`, identical duplicate, or divergent duplicate) supplies the behavioral distinction.
- Contradictory evidence: none. Existing legacy-first scripts and Stop normalization are baseline behaviors expected to fail selected canonical-first assertions, not conflicting evidence about current execution.
- Missing dependencies: none for the research design. Symlink privilege is an implementation-time capability condition and is explicitly represented as skipped symlink rows plus mandatory no-symlink rows, not as a vacuous success.
- Partial success: none. Dynamic test execution was prohibited and is not claimed; the requested fixture and assertion design is complete as research.

## Sources Consulted

- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/prompts/iteration-8.md:1-12`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-004.md:1-93`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-005.md:1-71`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-006.md:1-69`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-007.md:1-67`
- `.opencode/skills/system-spec-kit/scripts/core/config.ts:321-360`
- `.opencode/skills/system-spec-kit/scripts/dist/core/config.js:214-250`
- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-382,755-816`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:800-819`
- `.opencode/skills/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:42-305`
- `.opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:1-232`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-223,308-382`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:31-56,104-152,516-615,641-749`
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:22-102,563`
- `.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:49-67,134-227`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:500-607`
- `.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:108-124`
- `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:61-119`

## Assessment

- New information ratio: 0.80 (2 fully new findings and 3 partially new findings across 5 findings = 0.70, plus a 0.10 simplicity bonus for reducing the broad Cartesian acceptance space to nine decision-distinct root cells and targeted writer/reader rows)
- Novelty justification: The temporary fixture architecture and source/dist execution split are new; the concrete root, reader, and writer assertions refine the prior high-level acceptance matrix.
- Questions addressed: What exact isolated fixtures, assertions, harness placements, and source/dist gates cover root resolution with and without the symlink?
- Questions answered: The R1–R9 topology/packet matrix, reader discoverability contract, auto-writer destination contract, symlink capability policy, and source/dist execution split are specified.

## Reflection

- What worked and why: Reusing iterations 4–7's exact behavior anchors and reading the existing temp-workspace, symlink-probe, pointer, hook, and dist harnesses converted a broad acceptance list into executable-style assertions without touching tests.
- What did not work and why: Existing root-preference tests use different packet IDs or the same inode, so neither can prove the winner for a divergent same-relative collision; this required a separate packet-content sentinel dimension.
- What I would do differently: Start future implementation with the shared fixture factory and R1–R9 resolver tests before changing behavior, so every subsequent call-site fix has an explicit red-to-green receipt in both source and dist.

## Recommended Next Focus

Perform a final read-only implementation-readiness pass that assigns R1–R9 and each writer/reader row to the exact staged remediation change and CI operating-system lane, including the expected pre-change red set and rollback gate; do not implement the tests inside the research loop.
