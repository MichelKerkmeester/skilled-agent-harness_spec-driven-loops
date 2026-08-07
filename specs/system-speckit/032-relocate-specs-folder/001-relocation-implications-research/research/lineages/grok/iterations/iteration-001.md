# Iteration 1: Spec-kit tooling path contracts (hardcode vs dual-accept)

## Focus

Map how `create.sh`, `validate.sh`, `generate-description`, and `backfill-graph-metadata` treat specs roots today: which paths are hardcoded to `.opencode/specs`, which dual-accept `specs/` + `.opencode/specs`, and which climb ancestors looking for a `.opencode/specs` marker.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-cursor","model":"cursor-grok-4.5-high"}`. Write authority restricted to lineage artifact_dir.

## Findings

1. **`create.sh` writes new packets only under `.opencode/specs`.** After resolving `REPO_ROOT`, it sets `SPECS_DIR="$REPO_ROOT/.opencode/specs"` (track-appended when `--track` is set) and `mkdir -p` that path. A literal move of the real tree to top-level `specs/` without changing this assignment would keep creating packets under a resurrected `.opencode/specs` tree. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:811]

2. **`create.sh` path validation already dual-accepts both roots.** `resolve_and_validate_spec_path` allows any existing directory under `$REPO_ROOT/specs` or `$REPO_ROOT/.opencode/specs` (after realpath), and errors with "must be under specs/ or .opencode/specs/". Subfolder/parent modes can therefore operate on either alias today — the asymmetry is create-default vs accept. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:713] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:726]

3. **`generate-description` is base-path-parameterized, not root-hardcoded.** CLI requires `<folder-path> <base-path>`; containment uses `realpathSync` and `startsWith(realBase + sep)`. Relocation risk sits with callers that pass `.opencode/specs` as base, not in the generator itself. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:55] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:68]

4. **`backfill-graph-metadata` defaults to `.opencode/specs` but exposes `--root`.** `planBackfill` initializes `root = path.join(resolveRepoRoot(), '.opencode', 'specs')`; `--root` overrides. Scoped targets must pass supported-root checks. A move to top-level `specs/` without updating the default (or always passing `--root`) would make `--all` miss the live tree. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:319] [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:359]

5. **`findSpecsRoot` in graph-metadata-parser only recognizes `.opencode/specs`.** It walks parents until `basename(current)==='specs' && basename(dirname(current))==='.opencode'`; otherwise returns null. Under a true top-level `specs/` directory (parent = repo root, not `.opencode`), key-file lookup loses `specsRoot`/`repoRoot` derivation. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:847]

6. **`resolveArtifactRoot` already approves both roots.** `getApprovedArtifactRoots` adds `.opencode/specs` and `specs` (plus realpath variants and tmpdir). Deep-loop artifact writes are dual-root-ready; the bottleneck is create defaults and `.opencode`-parent finders, not the artifact resolver. [SOURCE: .opencode/skills/system-spec-kit/shared/review-research-paths.cjs:266]

7. **`validate.sh` is mostly path-agnostic.** Grep of the script shows no `SPECS_DIR` hardcode; the only `.opencode/specs` hit is a grandfather path exception for a deep-loop packet. Validation takes an explicit folder argument and therefore survives relocation if callers pass the new path. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:214]

## Ruled Out

- Treating "tooling already fully dual-root" as true — create default + findSpecsRoot still assume `.opencode/specs`.
- Treating generate-description as a hard blocker — it is caller-parameterized.
- Treating validate.sh as a primary relocation risk — it does not own the specs root.

## Dead Ends

- Searching generate-description for hardcoded `.opencode/specs` returned no matches; risk is in invocation sites, deferred to the path-ref scale iteration.

## Edge Cases

- Current root `specs -> .opencode/specs` means both allowlist entries realpath to the same tree today; dual-accept is latent until the symlink is inverted or removed.
- `findSpecsRoot` returning null is silent degradation for key-file lookups, not a hard throw.

## Sources Consulted

- create.sh:811, :713, :726
- generate-description.ts:55, :68
- backfill-graph-metadata.ts:319, :359
- graph-metadata-parser.ts:847
- review-research-paths.cjs:266
- validate.sh:214

## Assessment

- New information ratio: 1.0
- Novelty justification: First tooling pass; seven fully new contracts mapping hardcode vs dual-accept vs parameterized.
- Questions addressed: tooling path assumptions for the four named tools (+ shared artifact resolver).
- Questions answered: create/backfill/findSpecsRoot are the hardcode hotspots; generate-description and validate are path-agnostic; review-research-paths and create validation already dual-accept.

## Reflection

- What worked: Reading create default assignment beside the dual-root validator exposed the create/accept asymmetry.
- What failed: None material.
- Ruled out: "Flip the symlink only" as sufficient — create.sh would still mkdir under `.opencode/specs`.

## Recommended Next Focus

Inventory how Gate 3 / cross-runtime mirrors and shared hooks encode `.opencode/specs` in prompts, classifiers, and packet_pointer derivation.
