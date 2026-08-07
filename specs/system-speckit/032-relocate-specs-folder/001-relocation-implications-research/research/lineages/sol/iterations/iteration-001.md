# Iteration 1: Spec Kit tooling and resolver assumptions

## Focus

Inventory the four named tooling entry points and the shared spec-root resolution layer, separating direct hard-coded writers from readers that already accept either root.

## Actions Taken

1. Searched the named scripts and the full Spec Kit skill for `.opencode/specs` literals.
2. Located the current canonical resolver, root registry, migration helpers, and their tests.
3. Read the relevant `create.sh`, description generation, graph backfill, and resolver implementations.
4. Counted files under `system-spec-kit` containing the canonical-root literal.

## Findings

1. `create.sh` is the highest-impact named writer: default packet creation still assigns `SPECS_DIR="$REPO_ROOT/.opencode/specs"`, while its parent/subfolder containment already accepts both `$REPO_ROOT/specs` and `$REPO_ROOT/.opencode/specs`. Moving the root therefore requires changing writer selection, not rebuilding its containment model. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:713] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811]
2. `create.sh` graph identity stripping has a primary `$SPECS_DIR` path plus an explicit `.opencode/specs` fallback. That fallback becomes semantically legacy after relocation and must not silently define canonical identities. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:414]
3. `validate.sh` is largely caller-path driven; the only literal hit in the script is a packet-specific exception for `system-deep-loop/036-deep-loop-innovation`. Its validation core is lower risk than creation, although the exception must be repointed or made identity-based. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:214]
4. `generate-description` is root-parameterized and delegates identity to `resolveSpecFolderIdentity`; its containment check uses caller-supplied `folderPath` and `basePath`. It should survive relocation if the shared MCP identity resolver is updated and callers pass the new base. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:27] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:54]
5. `backfill-graph-metadata` validates scoped folders through `resolveSpecFolderIdentity`, but repo-root discovery and the default `--all` root explicitly look for `.opencode/specs`. Scoped calls are adaptable; default broad backfills are currently canonical-root coupled. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:238] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:319]
6. A central migration layer already exists: `spec-root-canonical-resolver.ts` defines `.opencode/specs` as canonical and `specs` as legacy, while `spec-root-registry.ts` inventories 21 resolution call sites by precedence. The proposed move is primarily a semantic precedence inversion plus writer migration, not discovery from zero. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/spec-root-canonical-resolver.ts:42] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:24]
7. The raw blast radius is large: 271 files under `system-spec-kit` contain `.opencode/specs`. That number is an upper bound because it includes docs, tests, examples, fixtures, and historical evidence; later iterations must classify executable versus documentary references. [SOURCE: command `rg -l --hidden --glob '!**/node_modules/**' '\.opencode/specs' .opencode/skills/system-spec-kit | wc -l`]

## Questions Answered

- Partially answered: which named tools encode path assumptions and where the shared resolver centralizes them.

## Questions Remaining

- Classify runtime mirrors and symlinks.
- Prove Git/global-ignore behavior.
- Trace Memory MCP root discovery and index identity.
- Quantify executable versus documentary repointing scope and design verification.

## Ruled Out

- Treating all four named scripts as equally hard-coded: `create.sh` and default graph backfill are direct writer/root risks; `validate.sh` and description generation are more path-parameterized.
- A blind repository-wide string replacement: the existing resolver registry encodes intentionally different precedence modes, so uniform replacement would erase compatibility semantics.

## Dead Ends

- Raw literal counts alone cannot estimate implementation effort because docs and test fixtures dominate part of the corpus.

## Edge Cases

- Ambiguous input: “generate-description.js” and “backfill-graph-metadata.js” are generated/runtime names; the maintained TypeScript sources are authoritative.
- Contradictory evidence: none.
- Missing dependencies: startup memory context unavailable; local source code was sufficient.
- Partial success: the registry gives resolver coverage, but downstream consumers outside `system-spec-kit` remain unclassified.

## Sources Consulted

- `.opencode/skills/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts`
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-canonical-resolver.ts`
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts`

## Assessment

- New information ratio: 1.00
- Novelty justification: first evidence pass established seven packet-new findings, including the existing 21-call-site resolver registry and the distinction between hard-coded writers and parameterized readers.
- Confidence: high for the named scripts; medium for total migration effort until other runtimes and MCP paths are classified.

## Reflection

- What worked and why: combining literal search with the maintained resolver registry exposed both raw scale and architectural centralization.
- What did not work and why: the broad literal search produced too much historical and fixture noise for effort estimation.
- What I would do differently: classify by runtime and mutation role before returning to aggregate counts.

## Recommended Next Focus

Map `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi` mirror/symlink topology, including the root `specs` link and installer behavior.
