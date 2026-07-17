# Iteration 1: Exhaustive Root-Resolution Call-Site Inventory

## Focus

This iteration inventoried executable production call sites that choose, enumerate, validate, or consume the repository spec roots. “Precedence” means the order used when an unqualified packet reference could resolve under both `specs/` and `.opencode/specs/`; explicit absolute or root-qualified inputs preserve the caller-selected root. Tests and documentation were searched for corroboration but are not counted as production resolvers.

## Findings

1. **The scripts-side shared contract is legacy-first.** `getSpecsDirectories()` returns `PROJECT_ROOT/specs` before `PROJECT_ROOT/.opencode/specs`; `findActiveSpecsDir()` returns the first existing entry; and `getAllExistingSpecsDirs()` filters that same ordering before realpath deduplication. Consequently, when the root `specs` symlink exists, the surviving alias is normally the legacy spelling even though both aliases reach the same inode. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-346]

2. **Every production consumer of the shared scripts resolver inherits that legacy-first order unless it already has an explicit/matched path.** The exact inventory is:

   | Consumer | Exact call site(s) | Result consumed by | Precedence |
   |---|---|---|---|
   | Child-folder search | `findChildFolderSync()` and `findChildFolderAsync()` [SOURCE: .opencode/skills/system-spec-kit/scripts/core/subfolder-utils.ts:39-58] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/subfolder-utils.ts:129-149] | Recursive packet lookup; realpath-deduplicates aliases and returns the first spelling | Legacy-first through `getSpecsDirectories()` |
   | Main folder detector | Root enumeration and active-root lookup [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:1121-1139] | CLI argument resolution and later ranked detection | Explicit `specs/` or `.opencode/specs/` is preserved; bare input is legacy-first |
   | Folder-detector containment gate | Approved-root list [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:181-186] | Validates resolved candidates | Legacy then canonical, but validation is membership-only |
   | `generate-context` validation and nested lookup | Validation/enumeration [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:193-230] and CLI resolver [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-323] | Automatic continuity writer target selection | Explicit qualified path wins; otherwise legacy-first |
   | `generate-context` existing-folder lookup | Project-relative exact path, then root enumeration [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:352-380] | Existing packet selected for writes | Exact existing input wins; stripped/bare input is legacy-first |
   | `generate-context` packet-id derivation and diagnostics | Root loop and active root [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:531-549] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:785-799] | Persisted packet identity and “did you mean” listing | Legacy-first |
   | Session data collector | Candidate construction and matched-root capture [SOURCE: .opencode/skills/system-spec-kit/scripts/extractors/collect-session-data.ts:1193-1220] | Resolves provided/detected folder; root iteration occurs at lines 1063-1093 [SOURCE: .opencode/skills/system-spec-kit/scripts/extractors/collect-session-data.ts:1063-1093] | Legacy-first for unqualified inputs; matched explicit root retained |
   | Session related-doc reader | Reuses matched root, then active-root fallback [SOURCE: .opencode/skills/system-spec-kit/scripts/extractors/collect-session-data.ts:1437-1469] | Builds `SPEC_FILES` from the selected packet | Matched root first; otherwise legacy-first |
   | Canonical-save workflow | Detection-to-relative-name candidate loop [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1043] | Converts the detected absolute packet into a packet-relative identity | Detected path effectively wins; candidate testing is legacy-first |
   | Description regeneration | Base-root candidate loop [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1663-1687] | Regenerates missing `description.json` for the absolute save target | Legacy-first for base-relative identity inference |
   | Directory setup | Sanitization plus active-root error listing [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/directory-setup.ts:22-80] | Validates a write target and reports nearby folders | Membership accepts both; diagnostics are legacy-first |
   | Nested changelog | `validateFilePath(..., getSpecsDirectories())` [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/nested-changelog.ts:589] | Write-boundary validation | Membership-only; order does not select a target |

3. **The MCP indexing/read path is canonical-first with legacy fallback, not dual-root enumeration.** Both `findSpecDocuments()` and `findGraphMetadataFiles()` select only `.opencode/specs` whenever it exists and inspect `specs/` only when canonical is absent. Their consumers are the MCP context preload, index scan, API indexing, and resume ladder. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-223] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:308-382] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1703] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:763-768] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/api/indexing.ts:77] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:993]

4. **The Gate-3 write-boundary resolver is also canonical-first.** Its root constant is `['.opencode/specs', 'specs']`; workspace discovery accepts either root; `getSpecRoots()` preserves the constant order; and recursive candidate collection traverses roots in that order. This means bare candidate binding prefers canonical while explicit rooted paths remain valid under either root. [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:125-137] [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:348-377] [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:391-418]

5. **Direct writers/utilities form a third class and must not be treated as consumers of the shared resolver.** `spec/create.sh` writes tracked packets directly under `.opencode/specs/<track>` but writes untracked packets through `specs/`, explicitly assuming that path is a symlink; graph metadata migration/backfill and quality/memory maintenance scripts construct `.opencode/specs` directly; the deep-loop local-owner migration and optimizer replay list canonical before legacy. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts:151-157] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts:597] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:240-247] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:319] [SOURCE: .opencode/skills/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs:11-13] [SOURCE: .opencode/skills/system-spec-kit/scripts/optimizer/replay-corpus.cjs:60-61]

6. **The actionable split is therefore by behavior, not by language or subsystem:** (a) legacy-first shared scripts selection, (b) canonical-first MCP/Gate-3 selection, (c) explicit-root-preserving inputs, and (d) direct-root writers. Changing only `getSpecsDirectories()` would alter automatic writer/detector behavior but would not change MCP discovery, Gate-3 binding, `spec/create.sh`, or canonical-only maintenance tools. [INFERENCE: based on .opencode/skills/system-spec-kit/scripts/core/config.ts:321-335, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-220, .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:136-137, and .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819]

## Ruled Out

- A repository-wide literal search for every occurrence of `.opencode/specs` was too noisy because generated packets, tests, fixtures, schema descriptions, and documentation dominate the results; the inventory was narrowed to executable root-choice functions and their production callers.
- `scripts/loaders/data-loader.ts:84-91` was excluded as a spec-root resolver: it defines security bases for an input JSON file and does not choose a packet root. [SOURCE: .opencode/skills/system-spec-kit/scripts/loaders/data-loader.ts:80-105]
- `mcp_server/lib/config/spec-doc-paths.ts` was not counted as a root-choice call site: production search results showed it supplying document classification/identity helpers, while actual filesystem root selection occurs in `memory-index-discovery.ts`. [INFERENCE: based on .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-220 and .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:52-62]

## Dead Ends

- Generic path-literal scanning is not a productive way to establish precedence; future inventory checks should search resolver symbols and direct `path.join(..., 'specs')` assignments, then read each production context.

## Edge Cases

- Ambiguous input: “call site” was interpreted as executable production code that selects/enumerates a root or consumes a selected root; tests, packet artifacts, and prose were deferred except as corroboration.
- Contradictory evidence: scripts are legacy-first, while MCP and Gate-3 are canonical-first; this is a confirmed implementation split rather than a resolved universal contract.
- Missing dependencies: local Code Mode did not expose filesystem read tools, so two attempted batched reads failed; direct `Read`, `Grep`, and `Glob` supplied the evidence instead.
- Partial success: the broad literal scan truncated at 100 matches, but narrower symbol/direct-construction searches and source reads recovered the production inventory. Status is `complete` because the in-scope inventory question is answered with exact citations; universal-contract/regression analysis remains a separate key question.

## Sources Consulted

- `.opencode/skills/system-spec-kit/scripts/core/config.ts:321-354`
- `.opencode/skills/system-spec-kit/scripts/core/subfolder-utils.ts:39-149`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:181-204,1121-1149`
- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:193-380,531-549,785-799`
- `.opencode/skills/system-spec-kit/scripts/extractors/collect-session-data.ts:1063-1093,1193-1220,1437-1469`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1043,1663-1687`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/directory-setup.ts:22-80`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:203-223,308-382`
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:125-137,348-418`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:811-819`

## Assessment

- New information ratio: 1.0 (6 fully new findings / 6 total findings; capped after the synthesis reduced the resolver surface to four behavioral classes)
- Questions addressed: Which call sites resolve or enumerate spec roots, what exact precedence does each use, and which writers or readers consume each result?
- Questions answered: The production root-resolution inventory and its current precedence/caller map.

## Reflection

- What worked and why: Symbol-focused searches around `getSpecsDirectories`, `findActiveSpecsDir`, canonical/legacy root variables, and direct root construction exposed the decision points; narrow source reads then established precedence and consumers.
- What did not work and why: The initial repository-wide literal search mixed runtime code with thousands of historical/generated references and truncated, while Code Mode had no local filesystem provider.
- What I would do differently: Start with resolver definitions plus reverse symbol searches, then run a separately scoped direct-root assignment search; avoid generic `.opencode/specs` literals.

## Recommended Next Focus

Test whether canonical-first is the correct universal contract by tracing collision/regression behavior for each legacy-first consumer, especially unqualified `generate-context` input, folder detection, persisted packet IDs, description regeneration, and untracked `spec/create.sh` writes.
