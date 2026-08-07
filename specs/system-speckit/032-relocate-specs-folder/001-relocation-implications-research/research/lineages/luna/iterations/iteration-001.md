# Iteration 1: Tooling path assumptions

## Focus

Determine which named spec-kit tools are root-agnostic, which still assume `.opencode/specs`, and where relocation would cause silent behavior changes.

## Actions Taken

- Read the argument parsing and root checks in `validate.sh` and `create.sh`.
- Read the source implementations of `generate-description` and `backfill-graph-metadata`.
- Read the shared research-artifact path resolver and two additional operator-facing literals that still name `.opencode/specs`.
- Attempted the YAML-selected `cli-codex` executor twice; both attempts were rejected by the recursion guard, so this bounded leaf used the loaded deep-research contract in direct mode.

## Findings

- **F1.1 — `create.sh` is only partially dual-root aware.** Its parent validation accepts both `$REPO_ROOT/specs` and `$REPO_ROOT/.opencode/specs`, but the default `SPECS_DIR` remains `$REPO_ROOT/.opencode/specs`. Its graph-metadata relative-path fallback also strips only the `.opencode/specs` prefix, so a root `specs/` target can retain an unwanted `specs/` segment. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:412-415] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:712-727] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811-815]
- **F1.2 — `validate.sh` is argument-driven at its front door, but contains a silent path-specific exception.** Rules and validator assets are resolved relative to the script, and the folder argument is accepted as any existing directory. However, the child-manifest fallback matches one canonical parent ending in `/.opencode/specs/...`; after relocation that case returns without applying the manifest. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:20-33] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:121-139] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:212-221]
- **F1.3 — `generate-description` delegates identity to a shared resolver and enforces real-path containment.** The implementation receives folder and base paths, checks that the real folder is under the real base, then calls `resolveSpecFolderIdentity`; it does not itself select `.opencode/specs` as the root. This makes the generator comparatively relocation-tolerant if its caller passes the new base and the identity resolver recognizes it. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:39-49] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:59-77] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:99-103]
- **F1.4 — `backfill-graph-metadata` has a caller/discovery risk, with an explicit override.** Repository-root discovery checks `.opencode/specs`, the default scan root is `path.join(resolveRepoRoot(), '.opencode', 'specs')`, and `--root` can override it. Scoped targets still pass through the shared identity and writer-path checks. A move therefore requires changing the default/discovery contract or ensuring every caller supplies `--root specs`. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:238-260] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:278-298] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:319-367]
- **F1.5 — shared artifact routing already supports both roots.** `normalizeSpecFolderReference` strips either `/.opencode/specs/` or `/specs/`, and approved artifact roots include both repository locations. This reduces migration risk for deep-loop artifact routing, but it does not repair tooling that independently defaults to `.opencode/specs`. [SOURCE: .opencode/skills/system-spec-kit/shared/review-research-paths.cjs:58-88] [SOURCE: .opencode/skills/system-spec-kit/shared/review-research-paths.cjs:256-281] [SOURCE: .opencode/skills/system-spec-kit/shared/review-research-paths.cjs:335-365]
- **F1.6 — relocation leaves operator-facing and diagnostic literals behind.** The Memory MCP context server embeds a runbook path under `.opencode/specs`, and the Gate 3 question examples repeatedly direct users to `.opencode/specs/...`. These are not root discovery algorithms, but they would produce stale links and misleading paths after a move. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:240-242] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:105-112]

## Questions Answered

- Q1 is substantially answered for the named tooling: the migration surface is mixed, with a small set of defaults, prefix strips, special-case literals, and discovery paths rather than a uniformly hard-coded toolchain.
- Q4 has an initial result: shared identity and artifact routing already model both roots, but the Memory MCP-facing code still contains stale user-visible path literals.

## Questions Remaining

- Which generated runtime mirrors and symlinked command surfaces copy or rewrite `.opencode/specs` references?
- How do repository-local and global ignore rules interact with the existing `specs` symlink and a real top-level `specs/` directory?
- What exact root does the Memory MCP server use for indexing, context, and graph/FTS recovery paths?
- What is the measured reference count after excluding documentation, fixtures, archives, and generated output?

## Ruled Out

- No complete migration direction is ruled out. The evidence rules out the assumption that all four named scripts need the same kind of patch: their failure modes differ between default selection, discovery, special cases, and caller-provided paths.

## Dead Ends

- The YAML executor branch was attempted twice and produced no leaf artifact because `cli-codex` was already present in `SPECKIT_CLI_DISPATCH_STACK`. The direct-mode fallback is bounded to this detached lineage and is recorded in `deep-research-state.jsonl`.
- Coverage-graph convergence was unavailable because the local `better-sqlite3` binary does not match the active Node ABI. Inline convergence remains the available signal.

## Edge Cases

- Real-path containment means a symlink can pass or fail based on its resolved target, not only its visible path. A root `specs` symlink and a real `specs` directory therefore need separate tests. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:62-77]
- `create.sh` may validate a root `specs` target successfully while still producing incorrect graph-relative identity because its fallback prefix strip is asymmetric. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:412-416]
- A caller that invokes `backfill-graph-metadata --all` without `--root` is more exposed than a scoped caller that passes an explicit folder. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:301-319]

## Sources Consulted

- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:400-420,700-735,800-817`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:20-33,121-139,205-223`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:39-77,99-103`
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:238-319,359-375`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:58-88,256-365`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:240-242`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:105-112`

## Assessment

The named tooling is not uniformly relocation-safe. The likely implementation shape is a root-resolution contract shared by create, validation special cases, graph backfill discovery, MCP path presentation, and runtime mirrors, with compatibility handling for both roots during transition. The largest immediate risk is silent omission: validation and metadata discovery can return successfully while skipping the relocated tree.

## Reflection

- What worked and why: targeted line-range reads exposed the distinction between root selection, path validation, identity normalization, and caller discovery.
- What did not work and why: nested `cli-codex` dispatch was blocked by the executor recursion guard, and the graph convergence helper was blocked by a native Node ABI mismatch.
- What I would do differently: begin with the shared identity resolver and all root-discovery callers before sampling individual leaf scripts, then use the script findings to validate the dependency map.

## Recommended Next Focus

Q2 — inspect `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi` mirror/symlink generation and determine whether they preserve, rewrite, or assume the current specs root.
