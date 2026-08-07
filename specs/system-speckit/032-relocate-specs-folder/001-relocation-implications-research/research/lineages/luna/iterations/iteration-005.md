# Iteration 005 — Measured reference surface and migration shape

## Focus

Measure the remaining root references in an explicit production-shaped source surface and derive a staged migration shape that respects the Git, runtime-mirror, tooling, and Memory MCP evidence.

## Actions Taken

- Counted literal `.opencode/specs` occurrences, matching lines, and matching files in `.opencode/skills/system-spec-kit` after excluding tests, fixtures, benchmarks, eval data, generated output, archives, and documentation-oriented trees.
- Counted maintained resolver entries, deep-workflow YAML references, deep-loop runtime contract references, runtime-mirror code references, and root `.gitignore` matches separately so unlike categories were not added into a misleading total.
- Re-read the tracked symlink/ignore evidence and the canonical-only versus dual-root Memory MCP findings.
- Built a compatibility-first migration sequence and a validation matrix; no migration files or symlinks were changed.

## Findings

- **F5.1 — The production-shaped Spec Kit source filter measured 100 literal `.opencode/specs` occurrences across 96 lines and 42 files; the resolver inventory has 21 entries, deep workflow YAML has 12 dual-root mentions across 10 files, deep-loop runtime has six static literals in two files, mirror code has zero, and root `.gitignore` has 18 specs-related matches.** [MEASUREMENT: iteration-local `rg` receipts] [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`]
- **F5.2 — The references mix default selection, containment, aliases, operator guidance, graph repair, and static contract census paths, so a blind string replacement would change behavior rather than only locations.** [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`]
- **F5.3 — A top-level-authoritative topology with a temporary `.opencode/specs` symlink bridge is the safest inferred migration shape; divergent real roots are unsafe under canonical-first discovery.** [INFERENCE: iterations 2 and 4] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221`]
- **F5.4 — Git and downstream global-ignore behavior require a separate cutover gate because source local negations and tracked symlink mode do not predict downstream clone behavior.** [SOURCE: `.gitignore:5-11`] [SOURCE: `/Users/michelkerkmeester/.gitignore_global:10-16`]
- **F5.5 — A six-case validation matrix must cover root topology, Git ignore context, tooling, Memory discovery/recovery/repair, and mirror baseline drift before the bridge is removed.** [INFERENCE: iterations 1–4 evidence]

### F5.1 — The measured source surface is broad but classifiable.

Under the stated production-shaped filter, Spec Kit source contains 100 literal `.opencode/specs` matches across 96 matching lines and 42 source files. A broader root-selector search returns 171 selector-related lines, which is a risk inventory rather than a patch count. The maintained resolver registry enumerates 21 resolver call-site entries. The deep command YAML assets add 12 old-root mentions across 10 files, all in dual-root containment or canonicalization guidance. The deep-loop runtime has six old-root literals in two shipped-census source files, while the active `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi` mirror code has zero matching source lines under the same source filter. The root `.gitignore` has 18 specs-related matches. [MEASUREMENT: `rg` counts run in this iteration; source filter excluded tests, fixtures, benchmarks, eval, generated output, archives, docs, and node_modules] [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`] [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:186-187`]

### F5.2 — The change is a contract migration, not a blind string replacement.

The 100 old-root literals mix discovery defaults, containment guards, alias handling, operator-facing examples, graph/repair paths, test-adjacent helpers excluded from the count, and static contract-census paths. The 21-entry resolver inventory also records legacy-first, canonical-first, direct-path-first, membership-only, and canonical-only behavior. Repointing every literal to `specs` would therefore risk changing precedence and identity semantics in callers that already accept both roots. [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:261-292`]

### F5.3 — The safest topology is a compatibility bridge with one declared authority.

Make the new top-level `specs/` directory authoritative, retain `.opencode/specs` as a temporary symlink to `../specs`, and make all readers accept both paths while the bridge exists. Update root selection, graph repair, startup drift recovery, and the context-server description-refresh caller before removing the bridge. A separate real directory at both paths is unsafe because canonical-first Memory discovery can scan only `.opencode/specs` and silently miss a divergent top-level tree. This bridge recommendation is an inference from the discovery, realpath, and recovery evidence. [INFERENCE: compatibility-first migration shape derived from F4.2, F4.4, F4.5, and F4.6] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts:18-75`]

### F5.4 — Git and downstream ignore state must be treated as a separate cutover gate.

The source repository currently uses local negations `!.opencode/` and `!specs`, while the configured global ignore file contains anchored `/.opencode/` and `/specs` rules. The existing root `specs` entry is a tracked symlink, so replacing it with a real directory changes index mode and child-path behavior. Downstream symlinked repositories do not inherit the source repository's local negations; they need an explicit local ignore policy or the new real directory remains globally ignored. [SOURCE: `.gitignore:5-11`] [SOURCE: `/Users/michelkerkmeester/.gitignore_global:10-16`] [MEASUREMENT: `git ls-files --stage -- specs`, `readlink specs`, and `git check-ignore` from iteration 2]

### F5.5 — Validation must cover divergent roots and clean downstream clones.

The minimum cutover matrix has six cases: only top-level `specs`; only legacy `.opencode/specs`; both roots with a compatibility symlink; both roots as divergent real directories; a source checkout with local negations; and a downstream checkout subject to the global ignores. Each case must exercise create/validate/description generation/graph backfill, Memory document discovery/graph metadata/resume/pending recovery/drift repair, and the mirror checks. The divergent-real-directories case must fail loudly or follow the declared authority; silent partial indexing is not acceptable.

## Questions Answered

- What is the measured reference count and the safest migration shape under these constraints? The measured source inventory is 100 literal old-root matches across 42 Spec Kit source files under the declared filter, plus 21 resolver entries and smaller workflow/contract/Git surfaces. The safest shape is a staged top-level-authoritative migration with a temporary `.opencode/specs` symlink, centralized precedence, explicit downstream ignore handling, and a six-case validation matrix.

## Questions Remaining

- No key research questions remain. Implementation details, exact patch ownership, and downstream operator communication are follow-up work outside this lineage.

## Ruled Out

- Blindly replacing every `.opencode/specs` literal with `specs` is ruled out because references have different contracts and precedence.
- Regenerating all runtime mirrors as a relocation step is ruled out by the zero source-reference result and the generator ownership audit; existing mirror drift still requires a separate baseline.
- A live Memory database migration result was not confirmed because the daemon IPC endpoint and coverage graph native module were unavailable.

## Edge Cases

- A compatibility symlink preserves realpath identity but can hide a divergent real directory if both roots exist.
- The source repository's local ignore behavior cannot stand in for downstream clones with the global excludes file.
- Static deep-loop census paths are not normal discovery roots; they still need deliberate treatment if the referenced contract files move.
- The current runtime mirror checks already have unrelated failures, so post-cutover pass/fail needs a captured baseline rather than a clean-green assumption.

## Sources Consulted

- `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221,308-379`
- `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:261-292`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts:114-134,220-270`
- `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts:18-75`
- `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:14-22`
- `.gitignore:5-11,260-279`
- `/Users/michelkerkmeester/.gitignore_global:10-16`
- `.opencode/commands/deep/assets/deep-research-auto.yaml:129-145,186-187`
- `.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:44-57`
- Iteration-local `rg` and Git count receipts

## Assessment

The relocation is medium-to-high risk because the codebase already has a dual-root compatibility layer with inconsistent precedence. The highest-risk work is not the mirror tree; it is making every canonical-only/default-root consumer agree on top-level authority before the compatibility symlink is removed.

## Reflection

The final count is large enough to reject a literal-only patch plan, but structured enough for a resolver-led migration. The evidence supports one concrete sequence: establish topology and ignore policy, fix root resolution and recovery, reindex and validate both aliases, then remove the bridge only after downstream behavior is proven.

## Recommended Next Focus

Synthesis only: consolidate five evidence iterations, preserve the convergence limitations, and write the lineage-local research and convergence reports.
